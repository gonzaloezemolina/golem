import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { sendOrderConfirmation, sendInternalNotification } from "@/lib/send-email";
import crypto from "crypto";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});

// ⭐ AGREGAR MÉTODO GET PARA VERIFICACIÓN
export async function GET(request: Request) {
  console.log("✅ Webhook verificado por MercadoPago (GET request)");
  return NextResponse.json({ 
    status: "ok",
    message: "Webhook endpoint is active" 
  });
}

// ⭐ MÉTODO POST EXISTENTE
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

    // ⭐ REDUCIR STOCK SI EL PAGO FUE APROBADO
    if (orderStatus === "approved") {
      console.log("📦 Reduciendo stock de productos...");

      const orderItems = await sql`
        SELECT * FROM order_items WHERE order_id = ${orderId}
      `;

      for (const item of orderItems) {
        if (item.variant_id) {
          await sql`
            UPDATE product_variants 
            SET stock = GREATEST(stock - ${item.quantity}, 0)
            WHERE id = ${item.variant_id}
          `;
          console.log(`  ↓ Variante #${item.variant_id}: -${item.quantity} unidades`);
        }
        
        await sql`
          UPDATE products 
          SET stock = GREATEST(stock - ${item.quantity}, 0)
          WHERE id = ${item.product_id}
        `;
        console.log(`  ↓ Producto #${item.product_id}: -${item.quantity} unidades`);
      }

      console.log("✅ Stock actualizado correctamente");

      // 📧 ENVIAR EMAILS
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

      const itemsWithDetails = await sql`
        SELECT oi.*, p.name, oi.size
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
        items: itemsWithDetails.length,
      });

      const shippingInfo = {
        type: order.shipping_type,
        address: order.shipping_address,
        city: order.shipping_city,
        province: order.shipping_province,
        zip: order.shipping_zip,
      };

      try {
        // Email al cliente
        await sendOrderConfirmation({
          buyerName: order.buyer_name,
          buyerEmail: order.buyer_email,
          orderId: order.id,
          items: itemsWithDetails.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            size: item.size || null, // ← AGREGAR SIZE
          })),
          total: parseFloat(order.total),
          shippingCost: parseFloat(order.shipping_cost || 0),
          shippingAddress: shippingInfo,
        });

        // Email interno
        await sendInternalNotification({
          buyerName: order.buyer_name,
          buyerEmail: order.buyer_email,
          buyerPhone: order.buyer_phone,
          buyerDni: order.buyer_dni,
          orderId: order.id,
          items: itemsWithDetails.map((item: any) => ({
            name: item.name,
            quantity: item.quantity,
            price: parseFloat(item.price),
            size: item.size || null, // ← AGREGAR SIZE
          })),
          total: parseFloat(order.total),
          shippingCost: parseFloat(order.shipping_cost || 0),
          shippingAddress: shippingInfo,
        });

        console.log("✅ Emails enviados correctamente");
      } catch (emailError: any) {
        console.error("❌ Error al enviar emails:", emailError);
      }

      // 🎯 META PIXEL - Purchase via Conversions API
      if (process.env.META_PIXEL_ID && process.env.META_ACCESS_TOKEN) {
        try {
          const numItems = itemsWithDetails.reduce((acc: number, item: any) => acc + item.quantity, 0)
          const contentIds = itemsWithDetails.map((item: any) => item.product_id.toString())
          const hashedEmail = order.buyer_email
            ? crypto.createHash('sha256').update(order.buyer_email.trim().toLowerCase()).digest('hex')
            : undefined

          await fetch(
            `https://graph.facebook.com/v18.0/${process.env.META_PIXEL_ID}/events?access_token=${process.env.META_ACCESS_TOKEN}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                data: [{
                  event_name: 'Purchase',
                  event_time: Math.floor(Date.now() / 1000),
                  event_id: `order_${order.id}`,
                  action_source: 'website',
                  user_data: {
                    ...(hashedEmail && { em: [hashedEmail] }),
                  },
                  custom_data: {
                    currency: 'ARS',
                    value: parseFloat(order.total),
                    content_ids: contentIds,
                    num_items: numItems,
                    order_id: order.id.toString(),
                  },
                }],
              }),
            }
          )
          console.log('✅ Meta Pixel Purchase enviado via CAPI')
        } catch (metaError) {
          console.error('❌ Error enviando Purchase a Meta CAPI:', metaError)
        }
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