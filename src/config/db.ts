import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '', {
      dbName: 'sns-api', // データベース名
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection failed:', error)
    process.exit(1)
  }
}

export default connectDB
