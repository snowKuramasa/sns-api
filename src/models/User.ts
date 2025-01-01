import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  provider: string
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  provider: { type: String, default: 'manual' },
})

export default mongoose.model<IUser>('User', UserSchema)
