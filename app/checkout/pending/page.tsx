import Link from "next/link";

export default function CheckoutPending() {
  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-yellow-600 mb-4">Pago pendiente</h1>
      <p className="text-lg mb-6">Tu pago está en proceso de validación.</p>
      <p className="mb-6">Te notificaremos por email cuando se confirme.</p>
      <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
        Volver al inicio
      </Link>
    </div>
  );
}