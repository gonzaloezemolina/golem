import { Resend } from "resend";
import { OrderConfirmationEmail } from "@/emails/order-confirmation";
import { InternalNotificationEmail } from "@/emails/internal-notification";

const resend = new Resend(process.env.RESEND_API_KEY);

// INTERFACE ACTUALIZADA
interface OrderEmailData {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string; // ← AGREGAR
  buyerDni?: string; // ← AGREGAR
  orderId: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingCost: number; // ← AGREGAR
  shippingAddress?: { // ← AGREGAR
    type: string;
    address?: string;
    city: string;
    province: string;
    zip: string;
  };
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  try {
    const result = await resend.emails.send({
      from: "GOLEM <onboarding@resend.dev>", // Cambiar por tu dominio verificado
      to: data.buyerEmail,
      subject: `Confirmación de pedido #${data.orderId} - GOLEM`,
      react: OrderConfirmationEmail({
        buyerName: data.buyerName,
        orderId: data.orderId,
        items: data.items,
        total: data.total,
        shippingCost: data.shippingCost,
        shippingAddress: data.shippingAddress,
      }),
    });

    console.log("✅ Email al cliente enviado:", result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("❌ Error al enviar email al cliente:", error);
    return { success: false, error: error.message };
  }
}

export async function sendInternalNotification(data: OrderEmailData) {
  try {
    const result = await resend.emails.send({
      from: "GOLEM <onboarding@resend.dev>", // Cambiar por tu dominio verificado
      to: "tu-email@golem.com", // ← TU EMAIL AQUÍ
      subject: `🔔 Nueva orden #${data.orderId}`,
      react: InternalNotificationEmail({
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerPhone: data.buyerPhone,
        buyerDni: data.buyerDni,
        orderId: data.orderId,
        items: data.items,
        total: data.total,
        shippingCost: data.shippingCost,
        shippingAddress: data.shippingAddress,
      }),
    });

    console.log("✅ Email interno enviado:", result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("❌ Error al enviar email interno:", error);
    return { success: false, error: error.message };
  }
}