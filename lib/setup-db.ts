import sql from "./db";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function setupDatabase() {
  try {
    console.log("🔧 Creando tablas...");

    // Crear tabla users
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear tabla products
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        stock INTEGER DEFAULT 0,
        image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear tabla orders (con preference_id incluido)
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255),
        buyer_name VARCHAR(255) NOT NULL,
        buyer_email VARCHAR(255) NOT NULL,
        buyer_phone VARCHAR(50),
        total DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        payment_id VARCHAR(255),
        preference_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear tabla order_items
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `;

    console.log("✅ Tablas creadas");

    // Seed de productos de ejemplo
    console.log("🌱 Insertando productos de ejemplo...");

    const result = await sql`
      INSERT INTO products (slug, name, description, price, stock, image_url)
      VALUES 
        ('remera-basica-negra', 'Remera Básica Negra', 'Remera de algodón 100%, corte unisex', 15000, 50, '/products/remera-negra.jpg'),
        ('jean-clasico', 'Jean Clásico', 'Jean azul corte recto, talle alto', 35000, 30, '/products/jean.jpg'),
        ('zapatillas-urban', 'Zapatillas Urban', 'Zapatillas urbanas cómodas para el día a día', 45000, 20, '/products/zapatillas.jpg')
      ON CONFLICT (slug) DO NOTHING
      RETURNING *
    `;

    console.log(`✅ Seed completado - ${result.length} productos insertados`);
    console.log("🎉 Base de datos lista!");
    
    // Verificar que se insertaron
    const productos = await sql`SELECT * FROM products`;
    console.log(`📦 Total productos en DB: ${productos.length}`);

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

setupDatabase();