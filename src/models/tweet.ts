import mongoose, { Document, Schema } from 'mongoose'

export interface ITweet extends Document {
  content: string
  createrNickName: string
  createrName: string
  createrEmail: string
  createdAt: Date
}

const tweetSchema: Schema = new Schema({
  content: { type: String, required: true },
  createrNickName: { type: String, required: true },
  createrName: { type: String, required: true },
  createrEmail: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
})

const Tweet = mongoose.model<ITweet>('Tweet', tweetSchema)

export default Tweet
