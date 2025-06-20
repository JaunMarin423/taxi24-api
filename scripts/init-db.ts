import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/nest';

async function main() {
  await mongoose.connect(MONGODB_URI);

  // Ejemplo: crear un usuario admin si no existe
  const userCollection = mongoose.connection.collection('users');
  const admin = await userCollection.findOne({ email: 'admin@admin.com' });
  if (!admin) {
    await userCollection.insertOne({
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin123', // Recuerda hashear en producción
      role: 'admin',
    });
    console.log('Usuario admin creado');
  } else {
    console.log('Usuario admin ya existe');
  }

  await mongoose.disconnect();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });