import { fetchProductBySlug } from "@/app/data/data";
import AddToCartButton from "@/components/addToCartButton";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }>  }) {
    const { slug } = await params;
    const product = await fetchProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <Link href="/products">← Volver a productos</Link>
      
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      
      <div>
        <p><strong>Precio:</strong> ${product.price}</p>
        <p><strong>Stock disponible:</strong> {product.stock} unidades</p>
      </div>
  
         <AddToCartButton product={product} />
    </div>
  );
}