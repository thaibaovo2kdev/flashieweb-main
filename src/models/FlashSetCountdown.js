import { Schema, model, models } from 'mongoose'

const countdownSchema = new Schema(
  {
    userId: { type: String, required: true },
    flashsetId: { type: String, required: true },
    flashcardId: { type: String, required: true },
    result: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const FlashSetCountdown =
  models.Countdown || model('Countdown', countdownSchema)

export default FlashSetCountdown
