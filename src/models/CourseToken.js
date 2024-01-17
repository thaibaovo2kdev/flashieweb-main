import { Schema, model, models } from 'mongoose'
import { nanoid } from 'nanoid'

const courseTokenSchema = new Schema(
  {
    courseId: { type: String, require: true },
    token: {
      type: String,
      default: () => nanoid(6).replace(/[_-]/g, 'V').toUpperCase(),
    },
    expireAt: {
      type: Date,
      default: () => {
        const nextDay = new Date()
        nextDay.setDate(nextDay.getDate() + 1)
        nextDay.setHours(23, 59, 59, 999)
        return nextDay
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const CourseToken =
  models.CourseToken || model('CourseToken', courseTokenSchema)

export default CourseToken
