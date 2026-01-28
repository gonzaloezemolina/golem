interface OrderConfirmationEmailProps {
  buyerName: string;
  orderId: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
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

export const OrderConfirmationEmail = ({
  buyerName,
  orderId,
  items,
  total,
  shippingCost,
  shippingAddress,
}: OrderConfirmationEmailProps) => (
  <html>
    <head>
      <style>{`
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .email-container {
          background-color: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
          background-color: #000;
          color: #d3b05c;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 32px;
          letter-spacing: 2px;
        }
        .header p {
          margin: 5px 0 0 0;
          color: #fff;
          font-size: 14px;
        }
        .content {
          padding: 30px 20px;
        }
        .greeting {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }
        .order-number {
          background-color: #f9f9f9;
          border-left: 4px solid #d3b05c;
          padding: 15px;
          margin: 20px 0;
        }
        .order-number strong {
          color: #d3b05c;
          font-size: 20px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin: 25px 0 15px 0;
          color: #333;
        }
        .order-summary {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .item:last-child {
          border-bottom: none;
        }
        .item-name {
          font-weight: 600;
          color: #333;
        }
        .item-quantity {
          color: #666;
          font-size: 14px;
          margin-top: 4px;
        }
        .item-price {
          font-weight: bold;
          color: #000;
        }
        .shipping-info {
          background-color: #f0f8ff;
          border: 1px solid #d3b05c;
          border-radius: 8px;
          padding: 15px;
          margin: 20px 0;
        }
        .shipping-info p {
          margin: 5px 0;
        }
        .totals {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 2px solid #e0e0e0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          font-size: 15px;
        }
        .total-row.final {
          font-size: 20px;
          font-weight: bold;
          color: #d3b05c;
          padding-top: 15px;
          border-top: 2px solid #000;
          margin-top: 10px;
        }
        .footer {
          background-color: #f9f9f9;
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 13px;
          border-top: 1px solid #e0e0e0;
        }
        .highlight {
          color: #d3b05c;
          font-weight: bold;
        }
        .cta {
          text-align: center;
          margin: 30px 0;
        }
        .cta-text {
          font-size: 16px;
          color: #666;
        }
      `}</style>
    </head>
    <body>
      <div className="email-container">
        <div className="header">
          <h1>GOLEM</h1>
          <p>Confirmación de Compra</p>
        </div>

        <div className="content">
          <p className="greeting">¡Hola {buyerName}! 👋</p>
          
          <div className="order-number">
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
              Número de orden:
            </p>
            <strong>#{orderId}</strong>
          </div>

          <p>
            ¡Tu pedido ha sido confirmado y está siendo procesado! Te notificaremos
            cuando esté listo para ser enviado.
          </p>

          <h3 className="section-title">📦 Resumen del pedido</h3>
          <div className="order-summary">
            {items.map((item, index) => (
              <div className="item" key={index}>
                <div>
                  <div className="item-name">{item.name}</div>
                  {item.size && (
        <div style={{ color: "#d3b05c", fontSize: "13px", marginTop: "2px" }}>
          Talle: {item.size}
        </div>
      )}
                  <div className="item-quantity">Cantidad: {item.quantity}</div>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity)}
                </div>
              </div>
            ))}

            <div className="totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${(total - shippingCost)}</span>
              </div>
              <div className="total-row">
                <span>Envío:</span>
                <span className={shippingCost === 0 ? "highlight" : ""}>
                  {shippingCost === 0 ? "GRATIS" : `$${shippingCost}`}
                </span>
              </div>
              <div className="total-row final">
                <span>TOTAL:</span>
                <span>${total} ARS</span>
              </div>
            </div>
          </div>

          {shippingAddress && (
            <>
              <h3 className="section-title">🚚 Información de envío</h3>
              <div className="shipping-info">
                {shippingAddress.type === "retiro" ? (
                  <>
                    <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#d3b05c" }}>
                      Retiro en punto
                    </p>
                    <p style={{ margin: "5px 0" }}>📍 Bv. Oroño 3614</p>
                    <p style={{ margin: "5px 0" }}>Rosario, Santa Fe</p>
                    <p style={{ margin: "15px 0 0 0", fontSize: "14px", color: "#666" }}>
                      Te avisaremos cuando tu pedido esté listo para retirar.
                    </p>
                  </>
                ) : (
                  <>
                    <p style={{ margin: "0 0 10px 0", fontWeight: "bold" }}>
                      Envío a domicilio
                    </p>
                    <p style={{ margin: "5px 0" }}>📍 {shippingAddress.address}</p>
                    <p style={{ margin: "5px 0" }}>
                      {shippingAddress.city}, {shippingAddress.province}
                    </p>
                    <p style={{ margin: "5px 0" }}>CP: {shippingAddress.zip}</p>
                    {shippingCost === 0 && (
                      <p style={{ margin: "15px 0 0 0", fontSize: "14px", color: "#d3b05c", fontWeight: "bold" }}>
                        ✨ ¡Envío GRATIS!
                      </p>
                    )}
                  </>
                )}
              </div>
            </>
          )}

          <div className="cta">
            <p className="cta-text">
              Si tenés alguna consulta sobre tu pedido, no dudes en contactarnos.
            </p>
          </div>

          <p style={{ marginTop: "30px", textAlign: "center", fontSize: "16px" }}>
            ¡Gracias por tu compra! 🎉
            <br />
            <strong>El equipo de GOLEM</strong>
          </p>
        </div>

        <div className="footer">
          <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          <p style={{ marginTop: "10px" }}>© 2025 GOLEM. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
  </html>
);