import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";

// ✅ CORREGIDO: RESEND_API_KEY en vez de solo RESEND
const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
  buyerName: string;
  buyerEmail: string;
  orderId: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  try {
    console.log("📧 Intentando enviar email al cliente:", data.buyerEmail);
    
    const { data: emailData, error } = await resend.emails.send({
      from: "GOLEM <golem@moreuro.resend.app>", // ✅ CORREGIDO: sin ">" extra
      to: data.buyerEmail,
      subject: `Confirmación de pedido #${data.orderId} - GOLEM`,
      react: OrderConfirmationEmail({
        buyerName: data.buyerName,
        orderId: data.orderId,
        items: data.items,
        total: data.total,
      }),
    });

    if (error) {
      console.error("❌ Error al enviar email al cliente:", error);
      return { success: false, error };
    }

    console.log("✅ Email enviado al cliente:", emailData?.id);
    return { success: true, id: emailData?.id };
  } catch (error: any) {
    console.error("❌ Error al enviar email al cliente:", error);
    return { success: false, error: error.message };
  }
}

// Email de notificación interna (para vos)
export async function sendInternalNotification(data: OrderEmailData) {
  try {
    console.log("📧 Intentando enviar notificación interna...");
    
    const { data: emailData, error } = await resend.emails.send({
      from: "GOLEM Notificaciones <golem@moreuro.resend.app>",
      to: "gonzalomolina.cs@gmail.com",
      subject: `🛒 Nueva orden #${data.orderId} - GOLEM`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Nueva orden recibida 🎉</h2>
          <p><strong>Orden:</strong> #${data.orderId}</p>
          <p><strong>Cliente:</strong> ${data.buyerName} (${data.buyerEmail})</p>
          <p><strong>Total:</strong> $${data.total.toLocaleString("es-AR")} ARS</p>
          
          <h3>Productos:</h3>
          <ul>
            ${data.items.map((item) => `
              <li>${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString("es-AR")}</li>
            `).join("")}
          </ul>
          
          <p>Revisá los detalles completos en tu panel de administración.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Error al enviar notificación interna:", error);
      return { success: false, error };
    }

    console.log("✅ Notificación interna enviada:", emailData?.id);
    return { success: true, id: emailData?.id };
  } catch (error: any) {
    console.error("❌ Error al enviar notificación:", error);
    return { success: false, error: error.message };
  }
}