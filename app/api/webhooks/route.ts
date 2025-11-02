import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log("🔔 Webhook recibido:", JSON.stringify(body, null, 2));

    // MP envía diferentes tipos de notificaciones
    if (body.type !== "payment" && body.action !== "payment.created") {
      console.log("⏭️ Notificación ignorada");
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data.id;
    console.log("💳 Payment ID:", paymentId);

    // Verificar que el paymentId exista
    if (!paymentId) {
      console.log("❌ No se recibió payment ID");
      return NextResponse.json({ error: "No payment ID" }, { status: 400 });
    }

    // Obtener información del pago desde MP
    const payment = new Payment(client);
    
    // Convertir a string si es necesario
    const paymentData = await payment.get({ 
      id: paymentId.toString() 
    });

    console.log("📦 Datos del pago:", {
      id: paymentData.id,
      status: paymentData.status,
      external_reference: paymentData.external_reference,
    });

    const orderId = paymentData.external_reference;
    const paymentStatus = paymentData.status;

    if (!orderId) {
      console.log("❌ No se encontró external_reference");
      return NextResponse.json({ error: "No order ID" }, { status: 400 });
    }

    // Mapear estados
    let orderStatus = "pending";
    
    if (paymentStatus === "approved") {
      orderStatus = "approved";
    } else if (paymentStatus === "rejected") {
      orderStatus = "rejected";
    } else if (paymentStatus === "cancelled") {
      orderStatus = "cancelled";
    }

    console.log(`🔄 Actualizando orden ${orderId} a: ${orderStatus}`);

    // Actualizar orden
    await sql`
      UPDATE orders 
      SET 
        status = ${orderStatus},
        payment_id = ${paymentData.id?.toString() || null}
      WHERE id = ${orderId}
    `;

    console.log("✅ Orden actualizada correctamente");

    return NextResponse.json({ 
      success: true,
      order_id: orderId,
      status: orderStatus,
    });

  } catch (error: any) {
    console.error("❌ Error en webhook:", error);
    console.error("❌ Stack:", error.stack);
    
    // Devolver 200 para que MP no reintente
    return NextResponse.json({ 
      error: error.message,
      received: true 
    }, { status: 200 });
  }
}