import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configurar variables de entorno
dotenv.config();

// Importar modelos
import './models/user.model.js';
import './models/product.model.js';

const User = mongoose.model('User');
const Product = mongoose.model('Product');

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

// Productos de muestra
const sampleProducts = [
  {
    name: 'Laptop Gaming Pro',
    description: 'Laptop para gaming de alta performance con procesador Intel i7 y tarjeta gráfica RTX 4060',
    price: 1299.99,
    category: 'Electrónicos',
    subcategory: 'Computadoras',
    brand: 'TechBrand',
    images: ['https://via.placeholder.com/400x300/0066cc/ffffff?text=Laptop+Gaming'],
    stock: 10,
    weight: 2.5,
    tags: ['gaming', 'laptop', 'alta-performance'],
    specifications: {
      processor: 'Intel Core i7-12700H',
      memory: '16GB DDR4',
      storage: '512GB SSD',
      graphics: 'NVIDIA RTX 4060',
      screen: '15.6 FHD 144Hz'
    },
    dimensions: {
      length: 35.8,
      width: 25.4,
      height: 2.3
    }
  },
  {
    name: 'Smartphone Premium X',
    description: 'Smartphone de última generación con cámara triple de 108MP y pantalla AMOLED',
    price: 899.99,
    category: 'Electrónicos',
    subcategory: 'Teléfonos',
    brand: 'MobileTech',
    images: ['https://via.placeholder.com/400x300/cc6600/ffffff?text=Smartphone+X'],
    stock: 25,
    weight: 0.19,
    tags: ['smartphone', 'premium', '5g'],
    specifications: {
      screen: '6.7" AMOLED 120Hz',
      camera: '108MP + 12MP + 8MP',
      processor: 'Snapdragon 8 Gen 2',
      memory: '12GB RAM',
      storage: '256GB',
      battery: '5000mAh'
    },
    dimensions: {
      length: 16.3,
      width: 7.8,
      height: 0.89
    }
  },
  {
    name: 'Auriculares Inalámbricos Pro',
    description: 'Auriculares inalámbricos con cancelación activa de ruido y 30 horas de batería',
    price: 249.99,
    category: 'Electrónicos',
    subcategory: 'Audio',
    brand: 'AudioMax',
    images: ['https://via.placeholder.com/400x300/009900/ffffff?text=Auriculares+Pro'],
    stock: 50,
    weight: 0.25,
    tags: ['auriculares', 'inalambricos', 'noise-cancelling'],
    specifications: {
      connectivity: 'Bluetooth 5.3',
      battery: '30 horas total',
      drivers: '40mm dynamic',
      features: 'Active Noise Cancellation',
      controls: 'Touch controls'
    },
    dimensions: {
      length: 18.5,
      width: 15.2,
      height: 7.8
    }
  },
  {
    name: 'Tablet Creativa 12"',
    description: 'Tablet profesional de 12 pulgadas perfecta para diseño y productividad',
    price: 649.99,
    category: 'Electrónicos',
    subcategory: 'Tablets',
    brand: 'CreativeTab',
    images: ['https://via.placeholder.com/400x300/9900cc/ffffff?text=Tablet+12'],
    stock: 15,
    weight: 0.68,
    tags: ['tablet', 'diseño', 'productividad'],
    specifications: {
      screen: '12.9" Liquid Retina',
      processor: 'M2 Chip',
      memory: '8GB RAM',
      storage: '256GB',
      stylus: 'Apple Pencil compatible',
      keyboard: 'Smart Keyboard support'
    },
    dimensions: {
      length: 28.1,
      width: 21.5,
      height: 0.64
    }
  },
  {
    name: 'Smartwatch Deportivo',
    description: 'Smartwatch resistente al agua con GPS y monitor de salud avanzado',
    price: 329.99,
    category: 'Electrónicos',
    subcategory: 'Wearables',
    brand: 'FitTech',
    images: ['https://via.placeholder.com/400x300/cc0099/ffffff?text=Smartwatch'],
    stock: 30,
    weight: 0.045,
    tags: ['smartwatch', 'deportivo', 'gps'],
    specifications: {
      screen: '1.9" Always-On Display',
      battery: '7 days',
      sensors: 'Heart rate, SpO2, GPS',
      resistance: '5ATM water resistant',
      compatibility: 'iOS & Android'
    },
    dimensions: {
      length: 4.5,
      width: 3.8,
      height: 1.08
    }
  }
];

// Función para insertar productos
const insertProducts = async () => {
  try {
    console.log('🚀 Iniciando inserción de productos...');

    // Limpiar productos existentes (opcional)
    await Product.deleteMany({});
    console.log('🧹 Productos existentes eliminados');

    // Insertar productos de muestra
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ ${insertedProducts.length} productos insertados exitosamente`);

    // Mostrar IDs de los productos insertados
    console.log('\n📦 Productos creados:');
    insertedProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   ID: ${product._id}`);
      console.log(`   Precio: $${product.price}`);
      console.log(`   Stock: ${product.stock}`);
      console.log('');
    });

    return insertedProducts;
  } catch (error) {
    console.error('❌ Error insertando productos:', error);
    throw error;
  }
};

// Función principal
const main = async () => {
  try {
    await connectDB();
    await insertProducts();
    console.log('✅ Proceso completado exitosamente');
  } catch (error) {
    console.error('❌ Error en el proceso:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔐 Conexión a MongoDB cerrada');
    process.exit(0);
  }
};

// Ejecutar script
main();