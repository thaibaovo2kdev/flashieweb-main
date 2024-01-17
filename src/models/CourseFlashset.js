import { Schema, model, models } from 'mongoose'
import { nanoid } from 'nanoid'

const courseFlashsetSchema = new Schema(
  {
    id: {
      type: String,
      default: () => nanoid(8).replace(/[_-]/g, 'V').toUpperCase(),
    },
    courseId: { type: String, require: true },
    flashsetId: { type: String, require: true },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive', 'blocked', 'unblocked', 'deleted'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const CourseFlashset =
  models.CourseFlashset || model('CourseFlashset', courseFlashsetSchema)

export default CourseFlashset
