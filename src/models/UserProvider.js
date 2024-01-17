import { Schema, model, models } from "mongoose";

const userProviderSchema = new Schema(
  {
    userId: { type: String, require: true },
    provider: { type: String, require: true },
    uid: { type: String, default: null },
    password: { type: String, default: null },
    resetPassword: { type: String, default: null },
  },
  { timestamps: true }
);

const UserProvider =
  models.UserProvider || model("UserProvider", userProviderSchema);

export default UserProvider;
