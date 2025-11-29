import sql from "@/lib/db";

// Interfaces existentes...
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
  image_2: string | null
  image_3: string | null
  image_4: string | null
  image_5: string | null
  created_at: Date
  category: string | null
  brand: string | null
  color: string | null
  seller_mp_id: string | null
  commission_rate: number | null
  category_id: number | null
  subcategory_id: number | null
}

// NUEVA: Interface para variantes
interface ProductVariant {
  id: number
  product_id: number
  size: string
  stock: number
  sku: string
  is_active: boolean
  created_at: Date
}

// NUEVA: Interface para producto con variantes
interface ProductWithVariants extends Product {
  variants: ProductVariant[]
  available_sizes: string[]
  total_stock: number
}

// Funciones existentes...
export async function fetchProducts() {
    try {
        const products = await sql`SELECT * FROM products`;
        return products as Product[];
    } catch (error) {
        console.log('Error fetchProducts:', error);
        return [];
    }
}

// ACTUALIZADA: Traer producto con variantes
export async function fetchProductBySlug(slug: string) {
  try {
    const [product] = await sql`
      SELECT * FROM products 
      WHERE slug = ${slug}
      LIMIT 1
    `;
    
    if (!product) return null;

    // Obtener variantes del producto
    const variants = await sql`
      SELECT * FROM product_variants 
      WHERE product_id = ${product.id} 
      ORDER BY size ASC
    ` as ProductVariant[];

    // Calcular stock total y talles disponibles
    const total_stock = variants.reduce((sum, v) => sum + v.stock, 0);
    const available_sizes = variants
      .filter(v => v.stock > 0 && v.is_active)
      .map(v => v.size);

    return {
      ...product,
      variants,
      total_stock,
      available_sizes
    } as ProductWithVariants;

  } catch (error) {
    console.error("Error fetchProductBySlug:", error);
    return null;
  }
}

// NUEVA: Obtener todas las variantes de un producto
export async function fetchProductVariants(productId: number) {
  try {
    const variants = await sql`
      SELECT * FROM product_variants 
      WHERE product_id = ${productId} AND is_active = true
      ORDER BY size ASC
    `;
    return variants as ProductVariant[];
  } catch (error) {
    console.error("Error fetchProductVariants:", error);
    return [];
  }
}

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


// NUEVA: Obtener productos relacionados
export async function fetchRelatedProducts(productId: number, subcategoryId: number, limit: number = 4) {
  try {
    const products = await sql`
      SELECT * FROM products 
      WHERE subcategory_id = ${subcategoryId}
        AND id != ${productId}
        AND stock > 0
      ORDER BY RANDOM()
      LIMIT ${limit}
    ` as Product[];
    
    return products;
  } catch (error) {
    console.error("Error fetchRelatedProducts:", error);
    return [];
  }
}