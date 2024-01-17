import { NextResponse } from "next/server";

import VerifyOTP from "~/models/VerifyOTP";
import connectDB from "~/utils/database";

export async function POST(req, res) {
  try {
    await connectDB();
    const { uid, code } = await req.json();

    const otp = await VerifyOTP.findOne({ uid, code });
    if (!otp) {
      return NextResponse.json(
        { message: "The OTP entered is incorrect." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { uid },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
}
