interface InternalNotificationEmailProps {
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  buyerDni?: string;
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

export const InternalNotificationEmail = ({
  buyerName,
  buyerEmail,
  buyerPhone,
  buyerDni,
  orderId,
  items,
  total,
  shippingCost,
  shippingAddress,
}: InternalNotificationEmailProps) => (
  <html>
    <head>
      <style>{`
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 700px;
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
          background: linear-gradient(135deg, #000 0%, #333 100%);
          color: #d3b05c;
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
        }
        .alert {
          background-color: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px;
          border-radius: 4px;
        }
        .content {
          padding: 30px 20px;
        }
        .section {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .section-title {
          font-size: 16px;
          font-weight: bold;
          color: #d3b05c;
          margin-bottom: 15px;
          text-transform: uppercase;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          font-weight: 600;
          color: #666;
        }
        .info-value {
          color: #333;
        }
        .item {
          padding: 12px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .item:last-child {
          border-bottom: none;
        }
        .total-section {
          background-color: #000;
          color: #fff;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
        }
        .total-row.final {
          font-size: 24px;
          font-weight: bold;
          color: #d3b05c;
          padding-top: 15px;
          border-top: 2px solid #d3b05c;
          margin-top: 10px;
        }
      `}</style>
    </head>
    <body>
      <div className="email-container">
        <div className="header">
          <h1>🔔 NUEVA ORDEN RECIBIDA</h1>
          <p style={{ margin: "10px 0 0 0", fontSize: "18px", color: "#fff" }}>
            Orden #{orderId}
          </p>
        </div>

        <div className="alert">
          <strong>⚡ Acción requerida:</strong> Nueva orden de compra que requiere procesamiento.
        </div>

        <div className="content">
          {/* Información del cliente */}
          <div className="section">
            <div className="section-title">👤 Datos del Cliente</div>
            <div className="info-row">
              <span className="info-label">Nombre:</span>
              <span className="info-value">{buyerName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{buyerEmail}</span>
            </div>
            {buyerPhone && (
              <div className="info-row">
                <span className="info-label">Teléfono:</span>
                <span className="info-value">{buyerPhone}</span>
              </div>
            )}
            {buyerDni && (
              <div className="info-row">
                <span className="info-label">DNI:</span>
                <span className="info-value">{buyerDni}</span>
              </div>
            )}
          </div>

          {/* Información de envío */}
          {shippingAddress && (
            <div className="section">
              <div className="section-title">🚚 Información de Envío</div>
              {shippingAddress.type === "retiro" ? (
                <>
                  <div className="info-row">
                    <span className="info-label">Método:</span>
                    <span className="info-value" style={{ color: "#d3b05c", fontWeight: "bold" }}>
                      RETIRO EN PUNTO
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Ubicación:</span>
                    <span className="info-value">Bv. Oroño 3614, Rosario, Santa Fe</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="info-row">
                    <span className="info-label">Método:</span>
                    <span className="info-value">ENVÍO A DOMICILIO</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Dirección:</span>
                    <span className="info-value">{shippingAddress.address}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Localidad:</span>
                    <span className="info-value">
                      {shippingAddress.city}, {shippingAddress.province}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Código Postal:</span>
                    <span className="info-value">{shippingAddress.zip}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Costo de envío:</span>
                    <span className="info-value" style={{ fontWeight: "bold" }}>
                      {shippingCost === 0 ? (
                        <span style={{ color: "#d3b05c" }}>GRATIS</span>
                      ) : (
                        `$${shippingCost}`
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Productos */}
          <div className="section">
            <div className="section-title">📦 Productos</div>
           {items.map((item, index) => (
  <div className="item" key={index}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
      <div>
        <strong>{item.name}</strong>
        {item.size && (
          <div style={{ color: "#d3b05c", fontSize: "13px", marginTop: "4px" }}>
            Talle: {item.size}
          </div>
        )}
      </div>
      <strong>${(item.price * item.quantity).toLocaleString('es-AR')}</strong>
    </div>
    <div style={{ color: "#666", fontSize: "14px" }}>
      Cantidad: {item.quantity} × ${item.price.toLocaleString('es-AR')}
    </div>
  </div>
))}
          </div>

          {/* Total */}
          <div className="total-section">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${(total - shippingCost)}</span>
            </div>
            <div className="total-row">
              <span>Envío:</span>
              <span>{shippingCost === 0 ? "GRATIS" : `$${shippingCost}`}</span>
            </div>
            <div className="total-row final">
              <span>TOTAL:</span>
              <span>${total} ARS</span>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "30px", padding: "20px", backgroundColor: "#f0f8ff", borderRadius: "8px" }}>
            <p style={{ margin: "0 0 10px 0", fontSize: "16px", fontWeight: "bold" }}>
              ⏰ Siguiente paso:
            </p>
            <p style={{ margin: 0, color: "#666" }}>
              Preparar el pedido para {shippingAddress?.type === "retiro" ? "retiro" : "envío"}
            </p>
          </div>
        </div>
      </div>
    </body>
  </html>
);