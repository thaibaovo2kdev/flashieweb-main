import { Schema, model, models } from 'mongoose'
import { nanoid } from 'nanoid'

const miniGameSceneSchema = new Schema(
  {
    id: {
      type: String,
      default: () => nanoid(8).replace(/[_-]/g, 'V').toUpperCase(),
    },
    gameId: { type: String, required: true },
    sceneId: { type: String, required: true },
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

const MiniGameScene =
  models.MiniGameScene || model('MiniGameScene', miniGameSceneSchema)

export default MiniGameScene
