import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { MercadoPagoConfig, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyer, items, subtotal, shippingCost, shippingAddress, total } = body;

    console.log("📦 Datos recibidos:", { buyer, items, subtotal, shippingCost, total });

    if (!buyer?.name || !buyer?.email || !items?.length || !shippingAddress) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    // Crear orden con datos de envío
    const [order] = await sql`
      INSERT INTO orders (
        buyer_name, 
        buyer_email, 
        buyer_phone,
        buyer_dni,
        total, 
        shipping_cost,
        shipping_address,
        shipping_city,
        shipping_province,
        shipping_zip,
        shipping_type,
        status
      )
      VALUES (
        ${buyer.name}, 
        ${buyer.email}, 
        ${buyer.phone || ""}, 
        ${buyer.dni || ""},
        ${total},
        ${shippingCost},
        ${shippingAddress.domicilio || "Retiro en punto"},
        ${shippingAddress.ciudadNombre},
        ${shippingAddress.provinciaNombre},
        ${shippingAddress.codigoPostal},
        ${shippingAddress.tipoEntrega},
        'pending'
      )
      RETURNING id
    `;

    console.log("✅ Orden creada:", order.id);

    const orderId = order.id;

    // Preparar items para MercadoPago
    const mpItems = [];

    for (const item of items) {
      // Guardar en order_items
      await sql`
        INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
        VALUES (${orderId}, ${item.id},  ${item.variant_id || null}, ${item.quantity}, ${item.price}, ${item.size || null})
      `;

      // Agregar a items de MP (CON ID)
      mpItems.push({
        id: item.id?.toString() || `product-${item.id}`, // ← AGREGAR ID
        title: item.size ? `${item.name} - Talle ${item.size}` : item.name, 
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "ARS",
      });
    }

    // AGREGAR ENVÍO COMO ITEM SEPARADO (si no es gratis)
    if (shippingCost > 0) {
      mpItems.push({
        id: "shipping", // ← ID para envío
        title: `Envío a ${shippingAddress.ciudadNombre}, ${shippingAddress.provinciaNombre}`,
        quantity: 1,
        unit_price: shippingCost,
        currency_id: "ARS",
      });
    }

    console.log("📦 Items para MP:", mpItems);

    const preference = new Preference(client);
    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
    
    const preferenceBody = {
      items: mpItems,
      payer: {
        name: buyer.name,
        email: buyer.email,
        phone: {
          number: buyer.phone || ""
        },
        identification: {
          type: "DNI" as const,
          number: buyer.dni || ""
        }
      },
      back_urls: {
        success: `${baseUrl}/checkout/success?order_id=${orderId}`,
        failure: `${baseUrl}/checkout/failure?order_id=${orderId}`,
        pending: `${baseUrl}/checkout/pending?order_id=${orderId}`,
      },
      auto_return: "approved" as const,
      external_reference: orderId.toString(),
      notification_url: `${baseUrl}/api/webhooks`,
      statement_descriptor: "GOLEM",
    };

    console.log("🔍 Preferencia a enviar:", JSON.stringify(preferenceBody, null, 2));

    const preferenceData = await preference.create({
      body: preferenceBody,
    });

    console.log("✅ Preferencia creada:", preferenceData.id);

    await sql`
      UPDATE orders 
      SET preference_id = ${preferenceData.id}
      WHERE id = ${orderId}
    `;

    return NextResponse.json({
      success: true,
      init_point: preferenceData.init_point,
      preference_id: preferenceData.id,
      order_id: orderId,
    });

  } catch (error: any) {
    console.error("❌ Error en checkout:", error);
    console.error("❌ Error completo:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { success: false, error: error.message || "Error al procesar el pago" },
      { status: 500 }
    );
  }
}