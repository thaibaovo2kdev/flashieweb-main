import { Schema, model, models } from 'mongoose'

const scoreSchema = new Schema(
  {
    userId: { type: String, required: true },
    parentKey: { type: String, required: true },
    parentValue: { type: String, required: true },
    // type: { type: String, required: true },
    score: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const Score = models.Score || model('Score', scoreSchema)

export default Score
