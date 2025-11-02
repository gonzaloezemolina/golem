import Link from "next/link";

export default function CheckoutFailure() {
  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Pago rechazado</h1>
      <p className="text-lg mb-6">Hubo un problema al procesar tu pago.</p>
      <p className="mb-6">Por favor, intentá nuevamente.</p>
      <Link href="/cart" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
        Volver al carrito
      </Link>
    </div>
  );
}