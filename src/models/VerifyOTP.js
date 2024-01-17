import { Schema, model, models } from "mongoose";

const VerifyOTPSchema = new Schema(
  {
    uid: { type: String, required: true },
    code: { type: String, required: true },
    createdAt: { type: Date, expires: "60m", default: Date.now },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// RefreshTokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })
const VerifyOTP = models.VerifyOTP || model("VerifyOTP", VerifyOTPSchema);

export default VerifyOTP;
