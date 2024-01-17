import { Schema, model, models } from 'mongoose'

const courseStudentSchema = new Schema(
  {
    courseId: { type: String, require: true },
    studentId: { type: String, require: true },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'requested', 'invited', 'accepted', 'rejected'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

const CourseStudent =
  models.CourseStudent || model('CourseStudent', courseStudentSchema)

export default CourseStudent
