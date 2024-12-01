import mongoose from 'mongoose'

const FavoriteSchema = new mongoose.Schema(
  {
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Topic',
      required: true,
    },
    userEmail: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.models.Favorite ||
  mongoose.model('Favorite', FavoriteSchema)
