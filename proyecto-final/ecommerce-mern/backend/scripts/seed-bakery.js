import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

// Usuarios vendedores de pastelería
const sellers = [
  {
    name: 'María Dulzura',
    email: 'maria@pasteleriadulzura.com',
    password: 'password123',
    role: 'seller',
    phone: '1145678901',
    storeName: 'Pastelería Dulzura',
    storeDescription: 'Postres artesanales hechos con amor desde 1995',
    authProvider: 'local',
    isActive: true
  },
  {
    name: 'Carlos Repostero',
    email: 'carlos@tortasdeliciosas.com',
    password: 'password123',
    role: 'seller',
    phone: '1156789012',
    storeName: 'Tortas Deliciosas',
    storeDescription: 'Tortas para toda ocasión, decoradas a pedido',
    authProvider: 'local',
    isActive: true
  },
  {
    name: 'Ana Chocolatera',
    email: 'ana@chocolateparadise.com',
    password: 'password123',
    role: 'seller',
    phone: '1167890123',
    storeName: 'Chocolate Paradise',
    storeDescription: 'Especialistas en postres de chocolate y trufas',
    authProvider: 'local',
    isActive: true
  }
];

// Función para crear productos de pastelería
const createBakeryProducts = (sellerIds) => [
  // PRODUCTOS DE MARÍA DULZURA
  {
    seller: sellerIds[0],
    createdBy: sellerIds[0],
    name: 'Alfajores de Maicena x 12',
    description: 'Deliciosos alfajores caseros de maicena rellenos con dulce de leche y bañados en coco rallado. Elaborados con ingredientes premium y receta tradicional. Perfectos para compartir en reuniones o regalar. Cada alfajor pesa aproximadamente 50g.',
    shortDescription: 'Alfajores artesanales de maicena con dulce de leche',
    price: 4500,
    comparePrice: 5200,
    sku: 'ALFAJOR-MAICENA-12',
    category: {
      main: 'Pastelería',
      subcategory: 'Alfajores'
    },
    brand: 'Pastelería Dulzura',
    inventory: {
      quantity: 25,
      trackQuantity: true
    },
    unit: 'docena',
    weight: 600,
    images: [
      { url: 'https://images.unsplash.com/photo-1590080876232-2e0054d1ad6b?w=800', alt: 'Alfajores de maicena', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800', alt: 'Detalle alfajor', isPrimary: false }
    ],
    featured: true,
    status: 'active',
    tags: ['alfajores', 'dulce de leche', 'artesanal', 'por docena']
  },
  {
    seller: sellerIds[0],
    createdBy: sellerIds[0],
    name: 'Medialunas de Manteca x 12',
    description: 'Medialunas recién horneadas, doradas y crocantes por fuera, esponjosas por dentro. Elaboradas con manteca de primera calidad siguiendo la tradición argentina. Ideales para el desayuno o la merienda. Se entregan el mismo día de horneado.',
    shortDescription: 'Medialunas artesanales de manteca recién horneadas',
    price: 3800,
    comparePrice: 4500,
    sku: 'MEDIALUNA-MANT-12',
    category: {
      main: 'Pastelería',
      subcategory: 'Facturas'
    },
    brand: 'Pastelería Dulzura',
    inventory: {
      quantity: 40,
      trackQuantity: true
    },
    unit: 'docena',
    weight: 500,
    images: [
      { url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800', alt: 'Medialunas de manteca', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800', alt: 'Medialunas doradas', isPrimary: false }
    ],
    featured: true,
    status: 'active',
    tags: ['medialunas', 'facturas', 'manteca', 'desayuno', 'por docena']
  },
  {
    seller: sellerIds[0],
    createdBy: sellerIds[0],
    name: 'Torta de Cumpleaños Vainilla (1kg)',
    description: 'Torta de vainilla de 1kg para 8-10 porciones. Bizcochuelo suave relleno con crema pastelera y cubierto con buttercream de vainilla. Decoración personalizable con mensaje de cumpleaños y flores de azúcar. Requiere 48hs de anticipación para pedido.',
    shortDescription: 'Torta de vainilla 1kg con decoración personalizada',
    price: 12000,
    comparePrice: 14000,
    sku: 'TORTA-VAINILLA-1KG',
    category: {
      main: 'Pastelería',
      subcategory: 'Tortas'
    },
    brand: 'Pastelería Dulzura',
    inventory: {
      quantity: 5,
      trackQuantity: true
    },
    unit: 'unidad',
    weight: 1000,
    images: [
      { url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800', alt: 'Torta de vainilla', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', alt: 'Detalle torta', isPrimary: false }
    ],
    featured: true,
    status: 'active',
    tags: ['torta', 'cumpleaños', 'vainilla', 'personalizable', '1kg']
  },
  {
    seller: sellerIds[0],
    createdBy: sellerIds[0],
    name: 'Cookies de Chocolate x 12',
    description: 'Cookies gigantes con chips de chocolate belga. Masa crocante por fuera y blanda por dentro, con generosas porciones de chocolate. Horneadas diariamente. Cada cookie pesa aproximadamente 80g. Perfectas para acompañar con leche o café.',
    shortDescription: 'Cookies gigantes con chips de chocolate belga',
    price: 4200,
    comparePrice: 5000,
    sku: 'COOKIE-CHOCO-12',
    category: {
      main: 'Pastelería',
      subcategory: 'Cookies'
    },
    brand: 'Pastelería Dulzura',
    inventory: {
      quantity: 30,
      trackQuantity: true
    },
    unit: 'docena',
    weight: 960,
    images: [
      { url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800', alt: 'Cookies de chocolate', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800', alt: 'Cookies apiladas', isPrimary: false }
    ],
    featured: false,
    status: 'active',
    tags: ['cookies', 'chocolate', 'gigantes', 'por docena']
  },

  // PRODUCTOS DE CARLOS REPOSTERO (Tortas Deliciosas)
  {
    seller: sellerIds[1],
    createdBy: sellerIds[1],
    name: 'Torta Red Velvet (1.5kg)',
    description: 'Espectacular torta Red Velvet de 1.5kg para 12-15 porciones. Capas de bizcochuelo rojo aterciopelado con frosting de queso crema. Decoración elegante con detalles en blanco y rojo. Ideal para eventos especiales. Requiere 48hs de anticipación.',
    shortDescription: 'Torta Red Velvet 1.5kg con frosting de queso crema',
    price: 18500,
    comparePrice: 21000,
    sku: 'TORTA-REDVELVET-1.5KG',
    category: {
      main: 'Pastelería',
      subcategory: 'Tortas'
    },
    brand: 'Tortas Deliciosas',
    inventory: {
      quantity: 3,
      trackQuantity: true
    },
    unit: 'unidad',
    weight: 1500,
    images: [
      { url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800', alt: 'Torta Red Velvet', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800', alt: 'Red Velvet detalle', isPrimary: false }
    ],
    featured: true,
    status: 'active',
    tags: ['torta', 'red velvet', 'queso crema', 'eventos', '1.5kg']
  },
  {
    seller: sellerIds[1],
    createdBy: sellerIds[1],
    name: 'Torta Selva Negra (2kg)',
    description: 'Clásica torta Selva Negra de 2kg para 15-20 porciones. Capas de bizcochuelo de chocolate húmedo, crema chantilly, cerezas al marrasquino y virutas de chocolate negro. Decoración tradicional. Perfecta para celebraciones. Pedido con 72hs de anticipación.',
    shortDescription: 'Torta Selva Negra 2kg con cerezas y crema',
    price: 24000,
    comparePrice: 27000,
    sku: 'TORTA-SELVANEGRA-2KG',
    category: {
      main: 'Pastelería',
      subcategory: 'Tortas'
    },
    brand: 'Tortas Deliciosas',
    inventory: {
      quantity: 2,
      trackQuantity: true
    },
    unit: 'unidad',
    weight: 2000,
    images: [
      { url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800', alt: 'Torta Selva Negra', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800', alt: 'Selva Negra corte', isPrimary: false }
    ],
    featured: true,
    status: 'active',
    tags: ['torta', 'selva negra', 'chocolate', 'cerezas', '2kg']
  },
  {
    seller: sellerIds[1],
    createdBy: sellerIds[1],
    name: 'Cupcakes Surtidos x 12',
    description: 'Caja de 12 cupcakes surtidos con diferentes sabores: vainilla, chocolate, red velvet y limón. Cada uno decorado con buttercream suave y toppings variados. Perfectos para fiestas o eventos. Colores y decoraciones personalizables con 24hs de anticipación.',
    shortDescription: 'Caja de 12 cupcakes surtidos decorados',
    price: 8500,
    comparePrice: 10000,
    sku: 'CUPCAKE-SURT-12',
    category: {
      main: 'Pastelería',
      subcategory: 'Cupcakes'
    },
    brand: 'Tortas Deliciosas',
    inventory: {
      quantity: 15,
      trackQuantity: true
    },
    unit: 'docena',
    weight: 800,
    images: [
      { url: 'https://images.unsplash.com/photo-1426869884541-df7117556757?w=800', alt: 'Cupcakes surtidos', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1599785209796-786432b228bc?w=800', alt: 'Cupcakes decorados', isPrimary: false }
    ],
    featured: true,
    status: 'active',
    tags: ['cupcakes', 'surtidos', 'fiestas', 'personalizable', 'por docena']
  },
  {
    seller: sellerIds[1],
    createdBy: sellerIds[1],
    name: 'Torta Tres Leches (1kg)',
    description: 'Auténtica torta tres leches de 1kg para 8-10 porciones. Bizcochuelo empapado en una mezcla de tres leches, cubierto con merengue italiano dorado. Textura húmeda y esponjosa. Sabor tradicional latinoamericano. Se entrega refrigerada.',
    shortDescription: 'Torta tres leches 1kg con merengue italiano',
    price: 13500,
    comparePrice: 15500,
    sku: 'TORTA-3LECHES-1KG',
    category: {
      main: 'Pastelería',
      subcategory: 'Tortas'
    },
    brand: 'Tortas Deliciosas',
    inventory: {
      quantity: 6,
      trackQuantity: true
    },
    unit: 'unidad',
    weight: 1000,
    images: [
      { url: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=800', alt: 'Torta tres leches', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', alt: 'Tres leches corte', isPrimary: false }
    ],
    featured: false,
    status: 'active',
    tags: ['torta', 'tres leches', 'merengue', 'tradicional', '1kg']
  },

  // PRODUCTOS DE ANA CHOCOLATERA (Chocolate Paradise)
  {
    seller: sellerIds[2],
    createdBy: sellerIds[2],
    name: 'Brownies de Chocolate x 12',
    description: 'Brownies de chocolate oscuro extra húmedos y densos. Elaborados con chocolate belga 70% cacao y nueces pecanas. Cada brownie es un cuadrado de 7x7cm de pura indulgencia. Perfectos para amantes del chocolate intenso. Se conservan frescos por 5 días.',
    shortDescription: 'Brownies húmedos de chocolate belga con nueces',
    price: 5500,
    comparePrice: 6500,
    sku: 'BROWNIE-CHOCO-12',
    category: {
      main: 'Pastelería',
      subcategory: 'Brownies'
    },
    brand: 'Chocolate Paradise',
    inventory: {
      quantity: 20,
      trackQuantity: true
    },
    unit: 'docena',
    weight: 700,
    images: [
      { url: 'https://images.unsplash.com/photo-1590841609987-4ac211afdde1?w=800', alt: 'Brownies de chocolate', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1606312619070-d48b4cde2f86?w=800', alt: 'Brownie húmedo', isPrimary: false }
    ],
    featured: true,
    status: 'active',
    tags: ['brownies', 'chocolate', 'nueces', 'belga', 'por docena']
  },
  {
    seller: sellerIds[2],
    createdBy: sellerIds[2],
    name: 'Trufas de Chocolate Premium x 12',
    description: 'Caja de 12 trufas artesanales de chocolate. Variedad de sabores: chocolate negro, chocolate con leche, maracuyá, café y frambuesa. Cubiertas con cacao en polvo o chocolate rallado. Presentación en caja elegante. Regalo perfecto. Hecho a mano.',
    shortDescription: 'Caja de 12 trufas artesanales sabores variados',
    price: 7200,
    comparePrice: 8500,
    sku: 'TRUFA-PREMIUM-12',
    category: {
      main: 'Pastelería',
      subcategory: 'Chocolates'
    },
    brand: 'Chocolate Paradise',
    inventory: {
      quantity: 18,
      trackQuantity: true
    },
    unit: 'docena',
    weight: 350,
    images: [
      { url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800', alt: 'Trufas de chocolate', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1590080876232-2e0054d1ad6b?w=800', alt: 'Caja de trufas', isPrimary: false }
    ],
    featured: true,
    status: 'active',
    tags: ['trufas', 'chocolate', 'premium', 'regalo', 'por docena']
  },
  {
    seller: sellerIds[2],
    createdBy: sellerIds[2],
    name: 'Torta de Chocolate con Ganache (1.5kg)',
    description: 'Torta de chocolate para verdaderos amantes del cacao. 1.5kg para 12-15 porciones. Triple capa de bizcochuelo de chocolate húmedo relleno con ganache de chocolate semi-amargo. Cobertura de ganache espejo brillante. Decoración minimalista elegante.',
    shortDescription: 'Torta de chocolate 1.5kg con ganache espejo',
    price: 19500,
    comparePrice: 22000,
    sku: 'TORTA-CHOCO-GANACHE-1.5KG',
    category: {
      main: 'Pastelería',
      subcategory: 'Tortas'
    },
    brand: 'Chocolate Paradise',
    inventory: {
      quantity: 4,
      trackQuantity: true
    },
    unit: 'unidad',
    weight: 1500,
    images: [
      { url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800', alt: 'Torta chocolate ganache', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800', alt: 'Ganache espejo', isPrimary: false }
    ],
    featured: true,
    status: 'active',
    tags: ['torta', 'chocolate', 'ganache', 'elegante', '1.5kg']
  },
  {
    seller: sellerIds[2],
    createdBy: sellerIds[2],
    name: 'Alfajores de Chocolate x 12',
    description: 'Alfajores triple capa de chocolate. Tapas de chocolate puro rellenas con dulce de leche y mousse de chocolate. Bañados en chocolate semi-amargo. Textura suave y sabor intenso. Cada alfajor pesa 70g. Conservar en lugar fresco. Duración 10 días.',
    shortDescription: 'Alfajores triple chocolate rellenos con dulce de leche',
    price: 6800,
    comparePrice: 7800,
    sku: 'ALFAJOR-CHOCO-TRIPLE-12',
    category: {
      main: 'Pastelería',
      subcategory: 'Alfajores'
    },
    brand: 'Chocolate Paradise',
    inventory: {
      quantity: 22,
      trackQuantity: true
    },
    unit: 'docena',
    weight: 840,
    images: [
      { url: 'https://images.unsplash.com/photo-1590080876232-2e0054d1ad6b?w=800', alt: 'Alfajores chocolate', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=800', alt: 'Alfajor triple', isPrimary: false }
    ],
    featured: false,
    status: 'active',
    tags: ['alfajores', 'chocolate', 'triple', 'premium', 'por docena']
  },
  {
    seller: sellerIds[2],
    createdBy: sellerIds[2],
    name: 'Chocotorta Clásica (1kg)',
    description: 'La tradicional chocotorta argentina de 1kg para 8-10 porciones. Capas de galletitas de chocolate humedecidas en café, alternadas con mousse de dulce de leche y queso crema. Decorada con chocolate rallado. Sin horno. Textura cremosa. Sabor casero auténtico.',
    shortDescription: 'Chocotorta clásica 1kg con dulce de leche',
    price: 11000,
    comparePrice: 13000,
    sku: 'CHOCOTORTA-1KG',
    category: {
      main: 'Pastelería',
      subcategory: 'Tortas'
    },
    brand: 'Chocolate Paradise',
    inventory: {
      quantity: 8,
      trackQuantity: true
    },
    unit: 'unidad',
    weight: 1000,
    images: [
      { url: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800', alt: 'Chocotorta', isPrimary: true },
      { url: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800', alt: 'Chocotorta argentina', isPrimary: false }
    ],
    featured: false,
    status: 'active',
    tags: ['chocotorta', 'tradicional', 'argentina', 'sin horno', '1kg']
  }
];

const seedDatabase = async () => {
  try {
    // Conectar a MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    // Limpiar productos y usuarios vendedores existentes
    await Product.deleteMany({});
    console.log('🗑️  Productos eliminados');
    
    await User.deleteMany({ role: 'seller' });
    console.log('🗑️  Usuarios vendedores eliminados');

    // Crear usuarios vendedores
    const sellerUsers = [];
    for (const sellerData of sellers) {
      // No hashear aquí - el modelo lo hará automáticamente en el hook pre('save')
      const seller = await User.create({
        ...sellerData
      });
      sellerUsers.push(seller._id);
      console.log(`👤 Vendedor creado: ${sellerData.name} (${sellerData.email})`);
    }

    // Crear productos de pastelería
    const products = createBakeryProducts(sellerUsers);
    const createdProducts = await Product.insertMany(products);
    console.log(`🍰 ${createdProducts.length} productos de pastelería creados`);

    // Resumen
    console.log('\n📊 RESUMEN:');
    console.log(`   Vendedores: ${sellerUsers.length}`);
    console.log(`   Productos: ${createdProducts.length}`);
    console.log('\n🔐 Credenciales de vendedores:');
    sellers.forEach(seller => {
      console.log(`   📧 ${seller.email} | 🔑 password123`);
    });

    console.log('\n✨ Seed completado exitosamente!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
};

seedDatabase();
