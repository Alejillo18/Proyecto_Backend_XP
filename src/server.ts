import mongoose from 'mongoose';
import { createApp } from './app';
import dotenv from 'dotenv';


dotenv.config(); 

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trueque-verde';

const { app } = createApp();

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(' Conectado a MongoDB con éxito');
    app.listen(PORT, () => {
      console.log(` Trueque Verde backend escuchando en el puerto ${PORT}`);
      console.log(` Documentación en http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error(' Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

startServer();