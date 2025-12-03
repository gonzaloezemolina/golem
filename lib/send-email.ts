import { Resend } from "resend";

const resend = new Resend(process.env.RESEND);

interface OrderEmailData {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerDni?: string;
  orderId: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  shippingCost: number;
  shippingAddress?: {
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
      from: "GOLEM <onboarding@resend.dev>",
      to: data.buyerEmail,
      subject: `Confirmación de pedido #${data.orderId} - GOLEM`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background-color: #000; color: #d3b05c; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 32px; letter-spacing: 2px;">GOLEM</h1>
              <p style="margin: 5px 0 0 0; color: #fff; font-size: 14px;">Confirmación de Compra</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px 20px;">
              <p style="font-size: 18px; color: #333; margin-bottom: 20px;">¡Hola ${data.buyerName}! 👋</p>
              
              <div style="background-color: #f9f9f9; border-left: 4px solid #d3b05c; padding: 15px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #666;">Número de orden:</p>
                <strong style="color: #d3b05c; font-size: 20px;">#${data.orderId}</strong>
              </div>
              
              <p>¡Tu pedido ha sido confirmado y está siendo procesado! Te notificaremos cuando esté listo para ser enviado.</p>
              
              <!-- Products -->
              <h3 style="font-size: 18px; font-weight: bold; margin: 25px 0 15px 0; color: #333;">📦 Resumen del pedido</h3>
              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                ${data.items.map(item => `
                  <div style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                      <strong style="color: #333;">${item.name}</strong>
                      <strong style="color: #000;">$${(item.price * item.quantity).toLocaleString('es-AR')}</strong>
                    </div>
                    <div style="color: #666; font-size: 14px;">Cantidad: ${item.quantity}</div>
                  </div>
                `).join('')}
                
                <!-- Totals -->
                <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #e0e0e0;">
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px;">
                    <span>Subtotal:</span>
                    <span>$${(data.total - data.shippingCost).toLocaleString('es-AR')}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 15px;">
                    <span>Envío:</span>
                    <span style="${data.shippingCost === 0 ? 'color: #d3b05c; font-weight: bold;' : ''}">
                      ${data.shippingCost === 0 ? 'GRATIS' : '$' + data.shippingCost.toLocaleString('es-AR')}
                    </span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 20px; font-weight: bold; color: #d3b05c; padding-top: 15px; border-top: 2px solid #000; margin-top: 10px;">
                    <span>TOTAL:</span>
                    <span>$${data.total.toLocaleString('es-AR')} ARS</span>
                  </div>
                </div>
              </div>
              
              ${data.shippingAddress ? `
                <h3 style="font-size: 18px; font-weight: bold; margin: 25px 0 15px 0; color: #333;">🚚 Información de envío</h3>
                <div style="background-color: #f0f8ff; border: 1px solid #d3b05c; border-radius: 8px; padding: 15px;">
                  ${data.shippingAddress.type === 'retiro' ? `
                    <p style="margin: 0 0 10px 0; font-weight: bold; color: #d3b05c;">Retiro en punto</p>
                    <p style="margin: 5px 0;">📍 Bv. Oroño 3614</p>
                    <p style="margin: 5px 0;">Rosario, Santa Fe</p>
                    <p style="margin: 15px 0 0 0; font-size: 14px; color: #666;">Te avisaremos cuando tu pedido esté listo para retirar.</p>
                  ` : `
                    <p style="margin: 0 0 10px 0; font-weight: bold;">Envío a domicilio</p>
                    <p style="margin: 5px 0;">📍 ${data.shippingAddress.address}</p>
                    <p style="margin: 5px 0;">${data.shippingAddress.city}, ${data.shippingAddress.province}</p>
                    <p style="margin: 5px 0;">CP: ${data.shippingAddress.zip}</p>
                    ${data.shippingCost === 0 ? `
                      <p style="margin: 15px 0 0 0; font-size: 14px; color: #d3b05c; font-weight: bold;">✨ ¡Envío GRATIS!</p>
                    ` : ''}
                  `}
                </div>
              ` : ''}
              
              <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 16px;">Si tenés alguna consulta sobre tu pedido, no dudes en contactarnos.</p>
              </div>
              
              <p style="margin-top: 30px; text-align: center; font-size: 16px;">
                ¡Gracias por tu compra! 🎉<br>
                <strong>El equipo de GOLEM</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9f9f9; text-align: center; padding: 20px; color: #666; font-size: 13px; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 10px 0;">Este es un email automático, por favor no respondas a este mensaje.</p>
              <p style="margin: 0;">© 2025 GOLEM. Todos los derechos reservados.</p>
            </div>
            
          </div>
        </body>
        </html>
      `,
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
      from: "GOLEM <onboarding@resend.dev>",
      to: "gonzalomolina.cs@gmail.com",
      subject: `🔔 Nueva orden #${data.orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <div style="max-width: 700px; margin: 0 auto; background-color: #fff; border-radius: 8px; overflow: hidden;">
            
            <div style="background: linear-gradient(135deg, #000 0%, #333 100%); color: #d3b05c; padding: 30px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🔔 NUEVA ORDEN RECIBIDA</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; color: #fff;">Orden #${data.orderId}</p>
            </div>
            
            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px;">
              <strong>⚡ Acción requerida:</strong> Nueva orden de compra que requiere procesamiento.
            </div>
            
            <div style="padding: 30px 20px;">
              <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <div style="font-size: 16px; font-weight: bold; color: #d3b05c; margin-bottom: 15px;">👤 DATOS DEL CLIENTE</div>
                <p style="margin: 8px 0;"><strong>Nombre:</strong> ${data.buyerName}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> ${data.buyerEmail}</p>
                ${data.buyerPhone ? `<p style="margin: 8px 0;"><strong>Teléfono:</strong> ${data.buyerPhone}</p>` : ''}
                ${data.buyerDni ? `<p style="margin: 8px 0;"><strong>DNI:</strong> ${data.buyerDni}</p>` : ''}
              </div>
              
              ${data.shippingAddress ? `
                <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                  <div style="font-size: 16px; font-weight: bold; color: #d3b05c; margin-bottom: 15px;">🚚 INFORMACIÓN DE ENVÍO</div>
                  ${data.shippingAddress.type === 'retiro' ? `
                    <p style="margin: 8px 0;"><strong>Método:</strong> <span style="color: #d3b05c; font-weight: bold;">RETIRO EN PUNTO</span></p>
                    <p style="margin: 8px 0;"><strong>Ubicación:</strong> Bv. Oroño 3614, Rosario, Santa Fe</p>
                  ` : `
                    <p style="margin: 8px 0;"><strong>Método:</strong> ENVÍO A DOMICILIO</p>
                    <p style="margin: 8px 0;"><strong>Dirección:</strong> ${data.shippingAddress.address}</p>
                    <p style="margin: 8px 0;"><strong>Localidad:</strong> ${data.shippingAddress.city}, ${data.shippingAddress.province}</p>
                    <p style="margin: 8px 0;"><strong>CP:</strong> ${data.shippingAddress.zip}</p>
                    <p style="margin: 8px 0;"><strong>Costo:</strong> ${data.shippingCost === 0 ? '<span style="color: #d3b05c; font-weight: bold;">GRATIS</span>' : '$' + data.shippingCost.toLocaleString('es-AR')}</p>
                  `}
                </div>
              ` : ''}
              
              <div style="background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <div style="font-size: 16px; font-weight: bold; color: #d3b05c; margin-bottom: 15px;">📦 PRODUCTOS</div>
                ${data.items.map(item => `
                  <div style="padding: 12px 0; border-bottom: 1px solid #e0e0e0;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                      <strong>${item.name}</strong>
                      <strong>$${(item.price * item.quantity).toLocaleString('es-AR')}</strong>
                    </div>
                    <div style="color: #666; font-size: 14px;">Cantidad: ${item.quantity} × $${item.price.toLocaleString('es-AR')}</div>
                  </div>
                `).join('')}
              </div>
              
              <div style="background-color: #000; color: #fff; padding: 20px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span>Subtotal:</span>
                  <span>$${(data.total - data.shippingCost).toLocaleString('es-AR')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span>Envío:</span>
                  <span>${data.shippingCost === 0 ? 'GRATIS' : '$' + data.shippingCost.toLocaleString('es-AR')}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 24px; font-weight: bold; color: #d3b05c; padding-top: 15px; border-top: 2px solid #d3b05c; margin-top: 10px;">
                  <span>TOTAL:</span>
                  <span>$${data.total.toLocaleString('es-AR')} ARS</span>
                </div>
              </div>
              
              <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f0f8ff; border-radius: 8px;">
                <p style="margin: 0 0 10px 0; font-size: 16px; font-weight: bold;">⏰ Siguiente paso:</p>
                <p style="margin: 0; color: #666;">Preparar el pedido para ${data.shippingAddress?.type === 'retiro' ? 'retiro' : 'envío'}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("✅ Email interno enviado:", result);
    return { success: true, data: result };
  } catch (error: any) {
    console.error("❌ Error al enviar email interno:", error);
    return { success: false, error: error.message };
  }
}