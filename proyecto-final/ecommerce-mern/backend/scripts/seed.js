import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

// Esquema del producto (usando el modelo real)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  sku: { type: String, required: true, unique: true },
  category: {
    main: { type: String, required: true },
    subcategory: { type: String }
  },
  stock: { type: Number, default: 0 },
  images: [{ type: String }],
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'active', 'archived', 'out_of_stock'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Datos de productos de ejemplo
const sampleProducts = [
  {
    name: "Smartphone Galaxy Ultra",
    description: "Último modelo de smartphone con cámara de 108MP, pantalla AMOLED de 6.8 pulgadas y batería de larga duración.",
    price: 899.99,
    sku: "GALAXY-ULTRA-001",
    category: {
      main: "Electrónicos",
      subcategory: "Smartphones"
    },
    stock: 25,
    images: ["https://via.placeholder.com/400x400?text=Galaxy+Ultra"],
    featured: true,
    status: 'active'
  },
  {
    name: "Laptop Gaming Pro",
    description: "Laptop para gaming con procesador Intel i7, 16GB RAM, RTX 4060 y SSD de 1TB.",
    price: 1299.99,
    sku: "LAPTOP-GAMING-002",
    category: {
      main: "Computadoras",
      subcategory: "Laptops"
    },
    stock: 15,
    images: ["https://via.placeholder.com/400x400?text=Gaming+Laptop"],
    featured: true,
    status: 'active'
  },
  {
    name: "Auriculares Inalámbricos Premium",
    description: "Auriculares con cancelación de ruido activa, 30 horas de batería y sonido Hi-Res.",
    price: 249.99,
    sku: "HEADPHONES-003",
    category: {
      main: "Audio",
      subcategory: "Auriculares"
    },
    stock: 50,
    images: ["https://via.placeholder.com/400x400?text=Headphones"],
    status: 'active'
  },
  {
    name: "Smartwatch Series 9",
    description: "Reloj inteligente con monitor de salud, GPS, resistente al agua y pantalla Always-On.",
    price: 399.99,
    sku: "SMARTWATCH-004",
    category: {
      main: "Wearables",
      subcategory: "Smartwatches"
    },
    stock: 30,
    images: ["https://via.placeholder.com/400x400?text=Smartwatch"],
    status: 'active'
  },
  {
    name: "Tablet Pro 12.9",
    description: "Tablet profesional con pantalla Liquid Retina XDR, chip M2 y soporte para Apple Pencil.",
    price: 799.99,
    sku: "TABLET-PRO-005",
    category: {
      main: "Tablets",
      subcategory: "Tablets Pro"
    },
    stock: 20,
    images: ["https://via.placeholder.com/400x400?text=Tablet+Pro"],
    status: 'active'
  }
];

// Función para insertar productos
const seedProducts = async () => {
  try {
    // Limpiar productos existentes
    await Product.deleteMany({});
    console.log('🗑️  Productos existentes eliminados');

    // Insertar nuevos productos
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${insertedProducts.length} productos insertados exitosamente`);

    // Mostrar algunos productos insertados
    console.log('\n📦 Productos agregados:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - $${product.price}`);
    });

  } catch (error) {
    console.error('❌ Error insertando productos:', error);
  }
};

// Ejecutar el seed
const runSeed = async () => {
  await connectDB();
  await seedProducts();
  
  console.log('\n🎉 Seed completado exitosamente!');
  console.log('🚀 Ahora puedes probar el frontend para ver los productos');
  
  process.exit(0);
};

// Ejecutar si este archivo es llamado directamente
runSeed();
