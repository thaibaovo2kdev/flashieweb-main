import { Schema, model, models } from 'mongoose'
import { nanoid } from 'nanoid'
// import User from './User'

const miniGameSchema = new Schema(
  {
    id: {
      type: String,
      default: () => nanoid(8).replace(/[_-]/g, 'V').toUpperCase(),
    },
    name: { type: String, required: true },
    image: { type: String, default: null },
    flashsetIds: { type: [String], default: [] },
    creator: {
      id: { type: String, default: '' },
      name: { type: String, default: '' },
      avatar: { type: String, default: '' },
    },
    level: { type: String, default: 'M1' },
    type: {
      type: String,
      default: 'matching1',
      enum: ['matching1', 'matching2'],
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

// courseSchema.virtual('_creator', {
//   ref: User,
//   localField: 'creator',
//   foreignField: 'id',
//   justOne: true,
// })
// courseSchema.pre('find', function preFind(next) {
//   this.populate({
//     path: '_creator',
//     select: 'id name avatar',
//   })
//   next()
// })
// courseSchema.post('find', function preFind(docs, next) {
//   for (const doc of docs) {
//     if (doc._creator) {
//       doc.creator = doc._creator
//       delete doc._creator
//       delete doc.creator._id
//     }
//     delete doc._creator
//     delete doc._id
//   }
//   next()
// })
// courseSchema.pre('findOne', function preFind(next) {
//   this.populate({
//     path: '_creator',
//     select: 'id name avatar',
//   })
//   next()
// })
// courseSchema.post('findOne', function preFind(doc, next) {
//   if (doc) {
//     if (doc._creator) {
//       doc.creator = doc._creator
//       delete doc.creator._id
//     }
//     delete doc._creator
//     delete doc._id
//   }

//   next()
// })

const MiniGame = models.MiniGame || model('MiniGame', miniGameSchema)

export default MiniGame
