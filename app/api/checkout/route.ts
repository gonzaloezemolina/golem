import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { sendInternalNotification, sendOrderConfirmation } from "@/lib/send-email";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { buyer, items, total } = body;

    console.log("📦 Datos recibidos:", { buyer, items, total });

    if (!buyer?.name || !buyer?.email || !items?.length) {
      return NextResponse.json(
        { success: false, error: "Datos incompletos" },
        { status: 400 }
      );
    }

    const [order] = await sql`
      INSERT INTO orders (buyer_name, buyer_email, buyer_phone, total, status)
      VALUES (${buyer.name}, ${buyer.email}, ${buyer.phone || ""}, ${total}, 'pending')
      RETURNING id
    `;

    console.log("✅ Orden creada:", order.id);

    const orderId = order.id;

    // Calcular comisiones y preparar items para MP
    let totalCommission = 0;
    const mpItems = [];

    for (const item of items) {
      // Guardar en order_items
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${orderId}, ${item.id}, ${item.quantity}, ${item.price})
      `;

      // Calcular comisión
      const commission = item.brand !== 'Golem' 
        ? (item.price * item.quantity * (item.commission_rate / 100))
        : 0;
      
      totalCommission += commission;

      // Preparar item para MP
      mpItems.push({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "ARS",
      });
    }

    console.log("💰 Comisión total:", totalCommission);

    const preference = new Preference(client);

    const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
    
    const preferenceBody: any = {
      items: mpItems,
      payer: {
        name: buyer.name,
        email: buyer.email,
      },
      back_urls: {
        success: `${baseUrl}/checkout/success`,
        failure: `${baseUrl}/checkout/failure`,
        pending: `${baseUrl}/checkout/pending`,
      },
      external_reference: orderId.toString(),
      notification_url: `${baseUrl}/api/webhooks`,
    };

    // ✅ SI HAY PRODUCTOS DE OTRAS MARCAS, AGREGAR SPLIT
    const hasThirdPartyProducts = items.some((item: any) => item.brand !== 'Golem' && item.seller_mp_id);

    if (hasThirdPartyProducts && totalCommission > 0) {
      // Obtener el seller_mp_id del primer producto (asumiendo 1 vendedor por orden)
      const sellerItem = items.find((item: any) => item.brand !== 'Golem');
      
      // if (sellerItem?.seller_mp_id) {
      //   preferenceBody.marketplace = "GOLEM";
      //   preferenceBody.marketplace_fee = totalCommission;
      //   preferenceBody.collector_id = Number(sellerItem.seller_mp_id);

      //   console.log("🏪 Marketplace configurado:");
      //   console.log("  - Vendedor MP ID:", sellerItem.seller_mp_id);
      //   console.log("  - Tu comisión:", totalCommission);
      // }
    }

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

    // 📧 ENVIAR EMAILS SI EL PAGO FUE APROBADO
    // if (orderStatus === "approved") {
    //   console.log("📧 Pago aprobado, enviando emails...");

    //   try {
    //     // Obtener datos completos de la orden
    //     const [order] = await sql`
    //       SELECT * FROM orders WHERE id = ${orderId}
    //     `;

    //     if (!order) {
    //       console.error("❌ No se encontró la orden:", orderId);
    //       return NextResponse.json({ 
    //         success: true,
    //         order_id: orderId,
    //         status: orderStatus,
    //         email_sent: false,
    //       });
    //     }

    //     const orderItems = await sql`
    //       SELECT oi.*, p.name, p.price
    //       FROM order_items oi
    //       JOIN products p ON oi.product_id = p.id
    //       WHERE oi.order_id = ${orderId}
    //     `;

    //     console.log("📦 Datos de la orden:", {
    //       id: order.id,
    //       buyer: order.buyer_name,
    //       email: order.buyer_email,
    //       items: orderItems.length,
    //     });

    //     // Email al cliente
    //     const clientEmailResult = await sendOrderConfirmation({
    //       buyerName: order.buyer_name,
    //       buyerEmail: order.buyer_email,
    //       orderId: order.id,
    //       items: orderItems.map((item: any) => ({
    //         name: item.name,
    //         quantity: item.quantity,
    //         price: item.price,
    //       })),
    //       total: order.total,
    //     });

    //     // Email interno (notificación para vos)
    //     const internalEmailResult = await sendInternalNotification({
    //       buyerName: order.buyer_name,
    //       buyerEmail: order.buyer_email,
    //       orderId: order.id,
    //       items: orderItems.map((item: any) => ({
    //         name: item.name,
    //         quantity: item.quantity,
    //         price: item.price,
    //       })),
    //       total: order.total,
    //     });

    //     console.log("📧 Resultado emails:", {
    //       cliente: clientEmailResult.success ? "✅ Enviado" : `❌ Error: ${clientEmailResult.error}`,
    //       interno: internalEmailResult.success ? "✅ Enviado" : `❌ Error: ${internalEmailResult.error}`,
    //     });
    //   } catch (emailError: any) {
    //     console.error("❌ Error al enviar emails:", emailError);
    //     // No fallar el webhook por error de email
    //   }
    // }


    return NextResponse.json({
      success: true,
      init_point: preferenceData.init_point,
      preference_id: preferenceData.id,
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