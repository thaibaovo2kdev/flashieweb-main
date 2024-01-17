import { Schema, model, models } from 'mongoose'
import { nanoid } from 'nanoid'

const userSchema = new Schema(
  {
    id: {
      type: String,
      default: () => nanoid(8).replace(/[_-]/g, 'V').toUpperCase(),
    },
    avatar: { type: String, default: true },
    name: { type: String, require: true },
    username: { type: String, require: true },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    talksamId: { type: String, default: null },
    birthday: { type: Date, default: null },
    type: { type: String, default: 'student', enum: ['student', 'teacher'] },
    role: { type: String, default: null },
    attributes: { type: Object, default: {} },
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

// userSchema.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret) {
//     delete ret._id;
//   },
// });

const User = models.User || model('User', userSchema)

export default User
