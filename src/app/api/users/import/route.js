import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import User from '~/models/User'
import UserProvider from '~/models/UserProvider'
import connectDB from '~/utils/database'
import { nanoid } from 'nanoid'

export async function POST(req, res) {
  try {
    await connectDB()
    const body = await req.json()

    const exists = await User.find({
      email: { $in: body.map((i) => i.email) },
    }).lean()

    const users = []
    const providers = []
    for (const u of body) {
      const uId = nanoid(8).replace(/[_-]/g, 'V').toUpperCase()
      const username = u.email.split('@')[0]
      const avatar = `https://ui-avatars.com/api/?background=random&name=${username}&format=jpg`

      const exist = exists.find((i) => i.email == u.email)
      if (!exist) {
        users.push({
          id: uId,
          avatar,
          name: username,
          type: u.type,
          email: u.email,
        })
        providers.push({
          userId: uId,
          uid: u.email,
          provider: 'EMAIL',
          password: bcrypt.hashSync(`${u.password}`, bcrypt.genSaltSync(10)),
        })
        providers.push({
          userId: uId,
          uid: username,
          provider: 'USERNAME',
          password: bcrypt.hashSync(`${u.password}`, bcrypt.genSaltSync(10)),
        })
      }
    }

    await User.insertMany(users)
    await UserProvider.insertMany(providers)

    return NextResponse.json(users, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
