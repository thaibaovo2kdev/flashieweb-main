import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import User from '~/models/User'
import UserProvider from '~/models/UserProvider'
import connectDB from '~/utils/database'

export async function POST(req, res) {
  try {
    await connectDB()
    const { email, password } = await req.json()
    const provider = await UserProvider.findOne({ uid: email }).lean()

    if (!provider) {
      return NextResponse.json(
        { message: 'Email address does not exist' },
        { status: 400 }
      )
    }

    let verifyPassword = await bcrypt.compare(password, provider.password)
    if (!verifyPassword && provider.resetPassword) {
      verifyPassword = await bcrypt.compare(password, provider.resetPassword)
    }
    if (!verifyPassword) {
      return NextResponse.json(
        { message: 'Invalid Email/User name and Password' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ id: provider.userId }).lean()

    return NextResponse.json(user, {
      status: 200,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
