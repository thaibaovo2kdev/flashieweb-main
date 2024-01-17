import { Schema, model, models } from 'mongoose'

const learnSchema = new Schema(
  {
    userId: { type: String, required: true },
    flashsetId: { type: String, required: true },
    flashcardId: { type: String, required: true },
    // result: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const Learn = models.Learn || model('Learn', learnSchema)

export default Learn
