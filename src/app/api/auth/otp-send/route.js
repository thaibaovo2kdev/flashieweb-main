import { NextResponse } from 'next/server'

import VerifyOTP from '~/models/VerifyOTP'
import connectDB from '~/utils/database'
import { sendMail } from '~/app/api/email/controller'
import { VerifyCode } from '~/app/api/email/template'

export async function POST(req, res) {
  try {
    await connectDB()
    const { uid } = await req.json()
    console.log(uid)
    const code = Math.floor(100000 + Math.random() * 900000)

    await VerifyOTP.create({ uid, code })
    const html = VerifyCode({
      code,
      changePasswordUrl: `${process.env.NEXTAUTH_URL}/reset-password`,
    })
    // console.log({ uid, html });
    await sendMail({ html, to: uid, subject: 'Verify code' })
    return NextResponse.json(
      { uid },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
