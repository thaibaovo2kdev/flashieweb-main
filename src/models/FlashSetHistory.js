import { Schema, model, models } from 'mongoose'

const flashSetHistorySchema = new Schema(
  {
    userId: { type: String, required: true },
    flashsetId: { type: String, required: true },
    flashcardId: { type: String, required: true },
    type: { type: String, required: true },
    result: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const FlashSetHistory =
  models.FlashSetHistory || model('FlashSetHistory', flashSetHistorySchema)

export default FlashSetHistory
