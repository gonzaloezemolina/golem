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

    // MP envía notificaciones de diferentes tipos
    // Solo procesamos los de tipo "payment"
    if (body.type !== "payment") {
      console.log("⏭️ Notificación ignorada (no es payment)");
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data.id;
    console.log("💳 Payment ID:", paymentId);

    // Obtener información completa del pago desde MP
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    console.log("📦 Datos del pago:", {
      id: paymentData.id,
      status: paymentData.status,
      external_reference: paymentData.external_reference,
    });

    const orderId = paymentData.external_reference; // El ID de nuestra orden
    const paymentStatus = paymentData.status;

    // Mapear estados de MP a nuestros estados
    let orderStatus = "pending";
    
    if (paymentStatus === "approved") {
      orderStatus = "approved";
    } else if (paymentStatus === "rejected") {
      orderStatus = "rejected";
    } else if (paymentStatus === "cancelled") {
      orderStatus = "cancelled";
    }

    console.log(`🔄 Actualizando orden ${orderId} a estado: ${orderStatus}`);

    // Actualizar orden en la base de datos
    await sql`
      UPDATE orders 
      SET 
        status = ${orderStatus},
        payment_id = ${paymentData.id?.toString() || null}
      WHERE id = ${orderId}
    `;

    console.log("✅ Orden actualizada correctamente");

    // TODO: Aquí después agregaremos el envío de email de confirmación

    return NextResponse.json({ 
      success: true,
      order_id: orderId,
      status: orderStatus,
    });

  } catch (error: any) {
    console.error("❌ Error en webhook:", error);
    // Siempre devolver 200 para que MP no reintente
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}