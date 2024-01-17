import { Schema, model, models } from 'mongoose'

const friendsSchema = new Schema(
  {
    requester: { type: String, require: true },
    recipient: { type: String, require: true },
    status: {
      type: String,
      enums: ['accepted', 'rejected', 'pending', 'requested', 'friends'],
      // enums: [
      //   0, //'add friend',
      //   1, //'requested',
      //   2, //'pending',
      //   3 //'friends'
      // ]
    },
  },
  { timestamps: true }
)

const Friend = models.Friends || model('Friends', friendsSchema)

export default Friend
