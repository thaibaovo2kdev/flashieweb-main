import { Schema, model, models } from 'mongoose'
import { nanoid } from 'nanoid'

const courseQuizSchema = new Schema(
  {
    id: {
      type: String,
      default: () => nanoid(8).replace(/[_-]/g, 'V').toUpperCase(),
    },
    courseId: { type: String, required: true },
    flashsetId: { type: String, required: true },
    types: { type: [String], default: ['abcd'] },
    name: { type: String, required: true },
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

const CourseQuiz = models.CourseQuiz || model('CourseQuiz', courseQuizSchema)

export default CourseQuiz
