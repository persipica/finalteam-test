// src/models/topic.ts
import mongoose, { Schema, Model } from 'mongoose'

interface ITopic {
  title: string
  description: string
  price: number
  image?: string
  userEmail: string // 상품을 올린 사용자의 이메일 추가
}

const topicSchema = new Schema<ITopic>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  userEmail: { type: String, required: true }, // 상품 등록자의 이메일
})

let Topic: Model<ITopic>
try {
  Topic = mongoose.model<ITopic>('Topic')
} catch {
  Topic = mongoose.model<ITopic>('Topic', topicSchema)
}

export default Topic
