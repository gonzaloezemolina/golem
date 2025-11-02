import Link from "next/link";
import { fetchProducts } from "../data/data";

export default async function productsPage () {
    const products = await fetchProducts();

    if (!products || products.length === 0) {
        return <h1>No hay productos disponibles</h1>;
    }

    return(
        <div>
            <h1>Productos</h1>
      <div>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ccc", padding: "16px", marginBottom: "16px" }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Precio:</strong> ${product.price}</p>
            <p><strong>Stock:</strong> {product.stock} unidades</p>
            <Link href={`/products/${product.slug}`}>
              Ver detalle
            </Link>
          </div>
        ))}
      </div>
    </div>
    )
}