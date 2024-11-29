// src/lib/mongodb.ts

import mongoose from 'mongoose'

export default async function connectMongoDB() {
  if (mongoose.connection.readyState >= 1) {
    console.log('Already connected to MongoDB')
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI as string)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw new Error('Failed to connect to MongoDB')
  }
}
