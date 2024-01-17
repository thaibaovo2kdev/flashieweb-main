import { NextResponse } from 'next/server'
import connectDB from '~/utils/database'
import { getToken } from 'next-auth/jwt'
import Friend from '~/models/Friend'
import User from '~/models/User'
// import bcrypt from 'bcryptjs'
// import UserProvider from '~/models/UserProvider'

export async function GET(req, res) {
  try {
    await connectDB()
    const { id } = res.params
    const token = await getToken({ req })

    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10)
    const perPage = parseInt(
      req.nextUrl.searchParams.get('perPage') || '20',
      10
    )

    const friends = await Friend.find({
      requester: id == 'me' ? token.id : id,
      status: 'friends',
    })
      .skip(page * perPage - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .lean()

    const usrs = await User.find({
      id: { $in: friends.map((i) => i.recipient) },
    })
    const data = friends.map((i) => {
      const usr = usrs.find((u) => u.id == i.recipient)
      if (!usr) return i
      return {
        name: usr.name,
        avatar: usr.avatar,
        email: usr.email,
        username: usr.username,
      }
    })

    const total = await Friend.countDocuments({
      requester: id == 'me' ? token.id : id,
      status: 'friends',
    })

    return NextResponse.json(
      { data, page, perPage, total },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 500 })
  }
}

export async function POST(req, res) {
  try {
    await connectDB()
    const token = await getToken({ req })

    const requester = token.id
    const recipient = res.params.id

    await Friend.findOneAndUpdate(
      { requester, recipient },
      { $set: { status: 'requested' } },
      { upsert: true, new: true }
    )
    await Friend.findOneAndUpdate(
      { recipient: requester, requester: recipient },
      { $set: { status: 'pending' } },
      { upsert: true, new: true }
    )

    return NextResponse.json(
      { status: 'requested' },
      {
        status: 201,
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
    const token = await getToken({ req })

    const requester = token.id
    const recipient = res.params.id

    await Friend.findOneAndUpdate(
      { requester, recipient },
      { $set: { status: 'friends' } },
      { upsert: true, new: true }
    )
    await Friend.findOneAndUpdate(
      { recipient: requester, requester: recipient },
      { $set: { status: 'friends' } },
      { upsert: true, new: true }
    )

    return NextResponse.json(
      { status: 'friends' },
      {
        status: 201,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}

export async function DELETE(req, res) {
  try {
    await connectDB()
    const token = await getToken({ req })

    const requester = token.id
    const recipient = res.params.id

    await Friend.findOneAndRemove({ requester, recipient })
    await Friend.findOneAndRemove({
      recipient: requester,
      requester: recipient,
    })

    return NextResponse.json(
      { status: 'success' },
      {
        status: 201,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
