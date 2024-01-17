import { Schema, model, models } from 'mongoose'
import { nanoid } from 'nanoid'
import User from './User'

const courseSchema = new Schema(
  {
    id: {
      type: String,
      default: () => nanoid(8).replace(/[_-]/g, 'V').toUpperCase(),
    },
    name: { type: String, required: true },
    image: { type: String, default: null },
    level: { type: String, default: '' },
    creator: { type: String, required: true },
    publishAt: { type: Date, default: Date.now },
    type: {
      type: String,
      default: 'join_request',
      enum: ['join_request', 'free', 'limited_time'],
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'inactive', 'deleted'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

courseSchema.virtual('_creator', {
  ref: User,
  localField: 'creator',
  foreignField: 'id',
  justOne: true,
})
courseSchema.pre('find', function preFind(next) {
  this.populate({
    path: '_creator',
    select: 'id name avatar',
  })
  next()
})
courseSchema.post('find', function preFind(docs, next) {
  for (const doc of docs) {
    if (doc._creator) {
      doc.creator = doc._creator
      delete doc._creator
      delete doc.creator._id
    }
    delete doc._creator
    delete doc._id
  }
  next()
})
courseSchema.pre('findOne', function preFind(next) {
  this.populate({
    path: '_creator',
    select: 'id name avatar',
  })
  next()
})
courseSchema.post('findOne', function preFind(doc, next) {
  if (doc) {
    if (doc._creator) {
      doc.creator = doc._creator
      delete doc.creator._id
    }
    delete doc._creator
    delete doc._id
  }

  next()
})

const Course = models.Course || model('Course', courseSchema)

export default Course
