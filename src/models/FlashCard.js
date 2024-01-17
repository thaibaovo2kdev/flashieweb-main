import { Schema, model, models } from 'mongoose'
import { nanoid } from 'nanoid'

const flashcardSchema = new Schema(
  {
    id: {
      type: String,
      default: () => nanoid(8).replace(/[_-]/g, 'V').toUpperCase(),
    },
    flashsetId: { type: String, required: true },
    name: { type: String, default: '' },
    frontText: { type: String, default: null },
    frontImage: { type: String, default: null },
    backText: { type: String, default: null },
    backImage: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const FlashCard = models.FlashCard || model('FlashCard', flashcardSchema)

export default FlashCard
