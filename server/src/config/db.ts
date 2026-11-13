import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/liquid_task_manager';

  try {
    // Try connecting to provided URI with a short timeout first
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✨ Connected to external MongoDB at ${uri}`);
  } catch (error) {
    console.log('⚠️ Could not connect to external MongoDB daemon.');
    console.log('🚀 Spawning embedded in-memory MongoDB engine for zero-configuration instant local development...');

    try {
      mongod = await MongoMemoryServer.create({
        instance: {
          launchTimeout: 60000,
        },
      });
      const inMemoryUri = mongod.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`🎉 Embedded MongoDB engine ready and connected at ${inMemoryUri}`);
    } catch (memErr) {
      console.error('❌ Failed to start embedded MongoDB:', memErr);
      process.exit(1);
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};
