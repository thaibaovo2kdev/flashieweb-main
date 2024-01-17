import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

import User from '~/models/User'
import UserProvider from '~/models/UserProvider'
import connectDB from '~/utils/database'

// export async function GET(req, res) {
//   try {
//     await connectDB()

//     const users = [
//       'tuansk1002@gmail.com',
//       'vinhnguyen19052002@gmail.com',
//       'tienlnk888@gmail.com',
//       'minhkhuy7601@gmail.com',
//       'haokhuy@gmail.com',
//       'phamtructrung18096411@gmail.com',
//       'thaibaovo2k@gmail.com',
//       'vothanhmy14011982@gmail.com',
//       'minhkhang01k12@gmail.com',
//       'englishwing.vn@gmail.com',
//       'vietnam@englishwing.com',
//       'vuhongchau@englishwing.com',
//     ]
//     const pass = '12345678'
//     for (const u of users) {
//       const username = u.split('@')[0]
//       const avatar = `https://ui-avatars.com/api/?background=random&name=${username}&format=jpg`
//       const user = await User.create({ avatar, name: username, email: u })
//       const hash = bcrypt.hashSync(pass, bcrypt.genSaltSync(10))
//       await UserProvider.create({
//         userId: user.id,
//         uid: username,
//         provider: 'USERNAME',
//         password: hash,
//       })
//       await UserProvider.create({
//         userId: user.id,
//         uid: u,
//         provider: 'EMAIL',
//         password: hash,
//       })
//     }
//     console.log('done')
//     return NextResponse.json(
//       {},
//       {
//         status: 201,
//       }
//     )
//   } catch (error) {
//     console.log('error', error)
//     return NextResponse.json(
//       {},
//       {
//         status: 400,
//       }
//     )
//   }
// }

export async function POST(req, res) {
  try {
    await connectDB()
    const { email, password, username, name, talksamId } = await req.json()
    const exist_user = await UserProvider.findOne({ uid: email }).lean()
    if (exist_user) {
      return NextResponse.json(
        { message: 'User Exists with given email address' },
        { status: 400 }
      )
    }
    const avatar = `https://ui-avatars.com/api/?background=random&name=${
      username || email
    }&format=jpg`
    const user = await User.create({ avatar, name, username, email, talksamId })
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    await UserProvider.create({
      userId: user.id,
      uid: username,
      provider: 'USERNAME',
      password: hash,
    })
    await UserProvider.create({
      userId: user.id,
      uid: email,
      provider: 'EMAIL',
      password: hash,
    })

    return NextResponse.json(user, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
