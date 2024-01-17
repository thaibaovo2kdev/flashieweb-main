import { Schema, model, models } from 'mongoose'
import { nanoid } from 'nanoid'
import User from './User'
// import Course from './Course'

const flashsetSchema = new Schema(
  {
    id: {
      type: String,
      default: () => nanoid(8).replace(/[_-]/g, 'V').toUpperCase(),
    },
    image: { type: String, required: true },
    name: { type: String, required: true },
    creator: { type: String, required: true },
    // course: { type: String, default: null },
    type: {
      type: String,
      default: 'flower',
      // enum: ['animal', 'flower'],
    },
    status: { type: String, default: 'active', enum: ['active', 'inactive'] },
  },
  {
    timestamps: true,
    versionKey: false,
  }
)

flashsetSchema.virtual('_creator', {
  ref: User,
  localField: 'creator',
  foreignField: 'id',
  justOne: true,
})
// flashsetSchema.virtual('_course', {
//   ref: Course,
//   localField: 'course',
//   foreignField: 'id',
//   justOne: true,
// })
flashsetSchema.pre('find', function preFind(next) {
  this.populate({
    path: '_creator',
    select: 'id name avatar',
  })
  // this.populate({
  //   path: '_course',
  //   select: 'id name',
  // })
  next()
})
flashsetSchema.post('find', function preFind(docs, next) {
  for (const doc of docs) {
    delete doc._id
    if (doc._creator) {
      doc.creator = doc._creator
      delete doc.creator._id
    }
    delete doc._creator

    // if (doc._course) {
    //   doc.course = doc._course
    //   delete doc.course._id
    // }
    // delete doc._course
  }
  next()
})
flashsetSchema.pre('findOne', function preFind(next) {
  this.populate({
    path: '_creator',
    select: 'id name avatar',
  })
  // if (this.course) {
  //   this.populate({
  //     path: '_course',
  //     select: 'id name',
  //   })
  // }

  next()
})
flashsetSchema.post('findOne', function preFind(doc, next) {
  if (doc) {
    if (doc._creator) {
      doc.creator = doc._creator
      delete doc.creator._id
    }

    // if (doc._course) {
    //   doc.course = doc._course
    //   delete doc.course._id
    // }

    delete doc._creator
    // delete doc._course
    delete doc._id
  }
  next()
})

const FlashSet = models.FlashSet || model('FlashSet', flashsetSchema)

export default FlashSet
