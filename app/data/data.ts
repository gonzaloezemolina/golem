import sql from "@/lib/db";

export async function fetchProducts () {
    try {
        const products = await sql `SELECT * FROM products`;
        return products;
    } catch (error) {
        console.log('Error fetchProducts:', error);
    }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const [product] = await sql`
      SELECT * FROM products 
      WHERE slug = ${slug}
      LIMIT 1
    `;
    return product || null;
  } catch (error) {
    console.error("Error fetchProductBySlug:", error);
    return null;
  }
}