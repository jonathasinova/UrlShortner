import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Adicione MONGODB_URI ao seu .env');
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export async function connectDB() {
  try {
    await client.connect();
    return client.db('InovaUrl');
  } catch (error) {
    console.error('Erro na conexão com MongoDB:', error);
    throw error;
  }
} 