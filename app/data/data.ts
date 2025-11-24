import sql from "@/lib/db";

// Interfaces
interface Category {
  id: number
  name: string
  slug: string
  created_at?: Date
}

interface Subcategory {
  id: number
  category_id: number
  name: string
  slug: string
  created_at?: Date
}

interface Product {
  id: number
  slug: string
  name: string
  description: string | null
  price: number
  stock: number
  image_url: string | null
  created_at: Date
  category: string | null
  brand: string | null
  color: string | null
  seller_mp_id: string | null
  commission_rate: number | null
  category_id: number | null
  subcategory_id: number | null
}

// EXISTENTES
export async function fetchProducts() {
    try {
        const products = await sql`SELECT * FROM products`;
        return products as Product[];
    } catch (error) {
        console.log('Error fetchProducts:', error);
        return [];
    }
}

export async function fetchProductBySlug(slug: string) {
  try {
    const [product] = await sql`
      SELECT * FROM products 
      WHERE slug = ${slug}
      LIMIT 1
    `;
    return product as Product | null;
  } catch (error) {
    console.error("Error fetchProductBySlug:", error);
    return null;
  }
}

// NUEVAS
export async function fetchCategories() {
  try {
    const categories = await sql`SELECT * FROM categories ORDER BY name`;
    return categories as Category[];
  } catch (error) {
    console.error('Error fetchCategories:', error);
    return [];
  }
}

export async function fetchSubcategories(categoryId?: number) {
  try {
    if (categoryId) {
      const subcategories = await sql`
        SELECT * FROM subcategories 
        WHERE category_id = ${categoryId} 
        ORDER BY name
      `;
      return subcategories as Subcategory[];
    } else {
      const subcategories = await sql`SELECT * FROM subcategories ORDER BY name`;
      return subcategories as Subcategory[];
    }
  } catch (error) {
    console.error('Error fetchSubcategories:', error);
    return [];
  }
}