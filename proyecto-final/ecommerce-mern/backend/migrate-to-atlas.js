import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Modelos
import './models/product.model.js';
const Product = mongoose.model('Product');

// Conexiones
const LOCAL_URI = 'mongodb://localhost:27017/ecommerce';
const ATLAS_URI = process.env.MONGODB_ATLAS_URI || 'mongodb+srv://ecommerce:ecommerce@cluster0.b6out72.mongodb.net/ecommerce?retryWrites=true&w=majority';

async function migrateData() {
  try {
    console.log('🔄 Iniciando migración de datos...\n');

    // Conectar a MongoDB LOCAL
    console.log('📍 Conectando a MongoDB LOCAL...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✅ Conectado a MongoDB LOCAL\n');

    // Obtener productos de LOCAL
    const LocalProduct = localConn.model('Product', Product.schema);
    const products = await LocalProduct.find({}).lean();
    console.log(`📦 Productos encontrados en LOCAL: ${products.length}\n`);

    if (products.length === 0) {
      console.log('⚠️  No hay productos para migrar');
      await localConn.close();
      return;
    }

    // Mostrar algunos productos
    console.log('Primeros 3 productos:');
    products.slice(0, 3).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.name} - $${p.price}`);
    });
    console.log('');

    // Conectar a MongoDB ATLAS
    console.log('☁️  Conectando a MongoDB ATLAS...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✅ Conectado a MongoDB ATLAS\n');

    // Limpiar productos existentes en ATLAS
    const AtlasProduct = atlasConn.model('Product', Product.schema);
    const deleteResult = await AtlasProduct.deleteMany({});
    console.log(`🧹 Productos eliminados en ATLAS: ${deleteResult.deletedCount}\n`);

    // Insertar productos en ATLAS
    console.log('⬆️  Insertando productos en ATLAS...');
    const insertResult = await AtlasProduct.insertMany(products);
    console.log(`✅ Productos insertados: ${insertResult.length}\n`);

    // Cerrar conexiones
    await localConn.close();
    await atlasConn.close();

    console.log('🎉 ¡Migración completada exitosamente!');
    console.log(`\n📊 Resumen:`);
    console.log(`   - Productos migrados: ${insertResult.length}`);
    console.log(`   - Desde: LOCAL (localhost)`);
    console.log(`   - Hacia: ATLAS (Cluster0)`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    console.error('\nDetalles del error:', error);
    process.exit(1);
  }
}

// Ejecutar migración
migrateData();
