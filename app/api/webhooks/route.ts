import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { sendOrderConfirmation, sendInternalNotification } from "@/lib/send-email";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log("🔔 Webhook recibido:", JSON.stringify(body, null, 2));

    if (body.type !== "payment") {
      console.log("⏭️ Notificación ignorada (no es payment)");
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data.id;
    console.log("💳 Payment ID:", paymentId);

    const payment = new Payment(client);
    const paymentData = await payment.get({ id: paymentId });

    console.log("📦 Datos del pago:", {
      id: paymentData.id,
      status: paymentData.status,
      external_reference: paymentData.external_reference,
    });

    const orderId = paymentData.external_reference;
    const paymentStatus = paymentData.status;

    let orderStatus = "pending";
    
    if (paymentStatus === "approved") {
      orderStatus = "approved";
    } else if (paymentStatus === "rejected") {
      orderStatus = "rejected";
    } else if (paymentStatus === "cancelled") {
      orderStatus = "cancelled";
    }

    console.log(`🔄 Actualizando orden ${orderId} a estado: ${orderStatus}`);

    await sql`
      UPDATE orders 
      SET 
        status = ${orderStatus},
        payment_id = ${paymentData.id?.toString() || null}
      WHERE id = ${orderId}
    `;

    console.log("✅ Orden actualizada correctamente");

    // 📧 ENVIAR EMAILS SI EL PAGO FUE APROBADO
    if (orderStatus === "approved") {
      console.log("📧 Enviando emails de confirmación...");

      const [order] = await sql`
        SELECT * FROM orders WHERE id = ${orderId}
      `;

      if (!order) {
        console.error("❌ No se encontró la orden:", orderId);
        return NextResponse.json({ 
          success: true,
          order_id: orderId,
          status: orderStatus,
          email_sent: false,
        });
      }

      const orderItems = await sql`
        SELECT oi.*, p.name, p.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ${orderId}
      `;

      console.log("📦 Datos completos de la orden:", {
        id: order.id,
        buyer: order.buyer_name,
        email: order.buyer_email,
        total: order.total,
        shipping_cost: order.shipping_cost,
        shipping_type: order.shipping_type,
        items: orderItems.length,
      });

      // Preparar datos de envío
      const shippingInfo = {
        type: order.shipping_type,
        address: order.shipping_address,
        city: order.shipping_city,
        province: order.shipping_province,
        zip: order.shipping_zip,
      };

      try {
        // Email al cliente
        const clientEmailResult = await sendOrderConfirmation({
          buyerName: order.buyer_name,
          buyerEmail: order.buyer_email,
          orderId: order.id,
          items: orderItems.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: parseFloat(order.total),
          shippingCost: parseFloat(order.shipping_cost || 0),
          shippingAddress: shippingInfo,
        });

        // Email interno
        const internalEmailResult = await sendInternalNotification({
          buyerName: order.buyer_name,
          buyerEmail: order.buyer_email,
          buyerPhone: order.buyer_phone,
          buyerDni: order.buyer_dni,
          orderId: order.id,
          items: orderItems.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          total: parseFloat(order.total),
          shippingCost: parseFloat(order.shipping_cost || 0),
          shippingAddress: shippingInfo,
        });

        console.log("📧 Resultado emails:", {
          cliente: clientEmailResult.success ? "✅ Enviado" : `❌ Error: ${clientEmailResult.error}`,
          interno: internalEmailResult.success ? "✅ Enviado" : `❌ Error: ${internalEmailResult.error}`,
        });
      } catch (emailError: any) {
        console.error("❌ Error al enviar emails:", emailError);
      }
    }

    return NextResponse.json({ 
      success: true,
      order_id: orderId,
      status: orderStatus,
    });

  } catch (error: any) {
    console.error("❌ Error en webhook:", error);
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}