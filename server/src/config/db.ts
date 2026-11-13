import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  let rawUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/liquid_task_manager';

  // Normalize URI: if it ends in '/', append default database name
  let uri = rawUri.trim();
  if (uri.endsWith('/')) {
    uri = `${uri}liquid_task_manager`;
  } else if (!uri.includes('/', 10)) {
    // e.g. mongodb://localhost:27017 without trailing slash
    uri = `${uri}/liquid_task_manager`;
  }

  try {
    console.log(`Connecting to local MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4, // Prioritize IPv4 for local MongoDB compatibility
    });
    console.log(`✨ Successfully connected to your local MongoDB at ${uri}`);
  } catch (error: any) {
    console.warn(`⚠️ Could not connect to ${uri}: ${error.message}`);
    console.log('🚀 Spawning embedded in-memory MongoDB engine fallback...');

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
