import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { MercadoPagoConfig, Preference } from "mercadopago";

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

    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (${orderId}, ${item.id}, ${item.quantity}, ${item.price})
      `;
    }

    console.log("✅ Items guardados");

    const preference = new Preference(client);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    const preferenceBody = {
      items: items.map((item: any) => ({
        title: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        currency_id: "ARS",
      })),
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
      sandbox_mode: true,
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
      init_point: preferenceData.sandbox_init_point,
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