import { Schema, model, models } from 'mongoose'

const bookmarkSchema = new Schema(
  {
    userId: { type: String, required: true },
    parentId: { type: String, required: true },
    parentType: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const Bookmark = models.Bookmark || model('Bookmark', bookmarkSchema)

export default Bookmark
