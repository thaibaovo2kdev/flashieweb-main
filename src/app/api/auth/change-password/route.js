import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import UserProvider from '~/models/UserProvider'
import connectDB from '~/utils/database'
import { getToken } from 'next-auth/jwt'

export async function PUT(req, res) {
  try {
    await connectDB()
    const token = await getToken({ req })
    const { oldPassword, newPassword } = await req.json()

    const provider = await UserProvider.findOne({ userId: token.id }).lean()
    if (!provider) {
      return NextResponse.json(
        { message: "Account doesn't found with given email" },
        { status: 400 }
      )
    }
    let verifyPassword = await bcrypt.compare(oldPassword, provider.password)
    if (!verifyPassword && provider.resetPassword) {
      verifyPassword = await bcrypt.compare(oldPassword, provider.resetPassword)
    }
    if (!verifyPassword) {
      return NextResponse.json(
        { message: 'Old password not match!' },
        { status: 400 }
      )
    }
    const hash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10))
    await UserProvider.updateMany(
      { userId: token.id },
      { password: hash, resetPassword: null }
    )

    return NextResponse.json(
      {},
      {
        status: 201,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
