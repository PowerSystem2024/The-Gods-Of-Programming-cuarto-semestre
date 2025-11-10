import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const checkUsers = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    const users = await User.find({ role: 'seller' }).select('+password');
    
    console.log(`👥 Total usuarios vendedores: ${users.length}\n`);
    
    for (const user of users) {
      console.log('📧 Email:', user.email);
      console.log('👤 Nombre:', user.name);
      console.log('🔑 Tiene password:', user.password ? 'SÍ' : 'NO');
      console.log('🔑 Password hash:', user.password ? user.password.substring(0, 20) + '...' : 'N/A');
      console.log('✅ Activo:', user.isActive);
      console.log('---\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkUsers();
