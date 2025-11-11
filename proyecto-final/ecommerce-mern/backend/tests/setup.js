import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

// Setup antes de todos los tests
beforeAll(async () => {
  // Crear servidor MongoDB en memoria
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  // Conectar a la base de datos de prueba
  await mongoose.connect(mongoUri);
});

// Cleanup después de cada test
afterEach(async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

// Cleanup después de todos los tests
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
});
