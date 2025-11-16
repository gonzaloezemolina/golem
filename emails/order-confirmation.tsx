interface OrderConfirmationEmailProps {
  buyerName: string;
  orderId: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

export const OrderConfirmationEmail = ({
  buyerName,
  orderId,
  items,
  total,
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
        }
        .header {
          background-color: #000;
          color: #fff;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px 20px;
          border: 1px solid #ddd;
          border-top: none;
        }
        .order-summary {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .item {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
          text-align: right;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #000;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 14px;
        }
        .highlight {
          color: #d3b05c;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1>GOLEM</h1>
        <p>Confirmación de compra</p>
      </div>

      <div className="content">
        <h2>¡Hola {buyerName}! 👋</h2>
        <p>
          Tu pedido <strong className="highlight">#{orderId}</strong> ha sido
          confirmado y está siendo procesado.
        </p>

        <div className="order-summary">
          <h3>Resumen de tu pedido:</h3>
          {items.map((item, index) => (
            <div className="item" key={index}>
              <div>
                <strong>{item.name}</strong>
                <br />
                <span style={{ color: "#666", fontSize: "14px" }}>
                  Cantidad: {item.quantity}
                </span>
              </div>
              <div style={{ fontWeight: "bold" }}>
                ${(item.price * item.quantity).toLocaleString("es-AR")}
              </div>
            </div>
          ))}

          <div className="total">
            Total: ${total.toLocaleString("es-AR")} ARS
          </div>
        </div>

        <p>
          Te notificaremos cuando tu pedido esté listo para ser enviado.
        </p>

        <p style={{ marginTop: "30px" }}>
          Si tenés alguna consulta, no dudes en contactarnos.
        </p>

        <p style={{ marginTop: "20px" }}>
          ¡Gracias por tu compra! 🎉
          <br />
          <strong>El equipo de GOLEM</strong>
        </p>
      </div>

      <div className="footer">
        <p>Este es un email automático, por favor no respondas a este mensaje.</p>
        <p>© 2024 GOLEM. Todos los derechos reservados.</p>
      </div>
    </body>
  </html>
);