export default function Features() {
    return(
        <>
            <section className="text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <p className="text-highlight text-sm font-semibold mb-3 uppercase tracking-wider">Por qué elegirnos</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance">
              Nuestro trabajo
            </h2>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              Ofrecemos una experiencia de compra superior, cuidando cada detalle desde que entrás a la tienda hasta que recibís tu pedido.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* Feature 1 - Wide Selection */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-highlight/10 rounded-2xl mb-6 group-hover:bg-highlight/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-box text-highlight" viewBox="0 0 16 16">
  <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
</svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">Envíos a todo el país</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Golem llega a tu puerta, independientemente de donde te encuentres.
              </p>
            </div>

            {/* Feature 2 - Expert Advice */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-highlight/10 rounded-2xl mb-6 group-hover:bg-highlight/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-shield-check text-highlight" viewBox="0 0 16 16">
  <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56"/>
  <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0"/>
</svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">Compra segura</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Pagos protegidos con Mercado Pago.
              </p>
            </div>

            {/* Feature 3 - Fast Delivery */}
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-highlight/10 rounded-2xl mb-6 group-hover:bg-highlight/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="currentColor" className="bi bi-telephone-inbound text-highlight" viewBox="0 0 16 16">
  <path d="M15.854.146a.5.5 0 0 1 0 .708L11.707 5H14.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 1 0v2.793L15.146.146a.5.5 0 0 1 .708 0m-12.2 1.182a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
</svg>
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-3">Soporte</h3>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                Te acompañamos antes y después de tu compra. Escribinos por WhatsApp si tenes dudas.
              </p>
            </div>
          </div>
        </div>
      </section>

        </>
    )
}