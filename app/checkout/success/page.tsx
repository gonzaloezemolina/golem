import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <div className="p-4 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">¡Pago exitoso! 🎉</h1>
      <p className="text-lg mb-6">Tu compra se procesó correctamente.</p>
      <p className="mb-6">Recibirás un email de confirmación en breve.</p>
      <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
        Seguir comprando
      </Link>
    </div>
  );
}