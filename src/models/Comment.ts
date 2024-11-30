import mongoose, { Schema, Model } from 'mongoose'

interface IComment {
  content: string
  userEmail: string // 댓글 작성자의 이메일
  topicId: mongoose.Schema.Types.ObjectId // 댓글이 달린 상품의 ID
  createdAt: Date
}

const commentSchema = new Schema<IComment>({
  content: { type: String, required: true },
  userEmail: { type: String, required: true },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  }, // 상품과 연결
  createdAt: { type: Date, default: Date.now },
})

let Comment: Model<IComment>
try {
  Comment = mongoose.model<IComment>('Comment')
} catch {
  Comment = mongoose.model<IComment>('Comment', commentSchema)
}

export default Comment
