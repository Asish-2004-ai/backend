// backend/db.js
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb://127.0.0.1:27017/urlshortener";

if (!'mongodb://127.0.0.1:27017/urlshortener') {
  throw new Error('⚠️ Please define the MONGO_URL environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect('mongodb://127.0.0.1:27017/urlshortener', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
