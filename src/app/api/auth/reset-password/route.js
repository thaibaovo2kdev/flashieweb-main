import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import User from '~/models/User'
import UserProvider from '~/models/UserProvider'
import connectDB from '~/utils/database'
import { sendMail } from '~/app/api/email/controller'
import { ResetPassword } from '~/app/api/email/template'

export async function POST(req, res) {
  try {
    await connectDB()
    const { uid } = await req.json()

    const provider = await UserProvider.findOne({ uid }).lean()
    if (!provider) {
      return NextResponse.json(
        { message: "Account doesn't found with given email" },
        { status: 400 }
      )
    }
    const token = jwt.sign(
      { userId: provider.userId, uid: provider.uid },
      process.env.JWT_SECRET,
      {
        expiresIn: '5m',
      }
    )
    const user = await User.findOne({ id: provider.userId }).lean()

    const html = ResetPassword({
      userName: user.name,
      changePasswordUrl: `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`,
    })
    await sendMail({
      html,
      to: provider.uid,
      subject: 'Reset password instructions',
    })

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

export async function PUT(req, res) {
  try {
    await connectDB()
    const { password, token } = await req.json()

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

    if (decodedToken.exp * 1000 < Date.now()) {
      return NextResponse.json(
        { message: 'Token is Expired!' },
        { status: 400 }
      )
    }

    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    await UserProvider.updateMany(
      { userId: decodedToken.userId },
      { resetPassword: hash }
    )

    return NextResponse.json(
      { message: 'Password Update Successfully' },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
