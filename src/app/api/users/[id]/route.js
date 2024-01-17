import { NextResponse } from 'next/server'
import User from '~/models/User'
import UserProvider from '~/models/UserProvider'
import connectDB from '~/utils/database'

/**
 * @swagger
 * '/api/users/{id}':
 *   post:
 *     tags:
 *     -  Users
 *     description: Get user
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id of user
 *        require: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */

export async function GET(req, res) {
  try {
    await connectDB()
    const { id } = res.params
    const course = await User.findOne({ id }).lean()

    if (!course) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 })
    }

    return NextResponse.json(course, {
      status: 200,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 500 })
  }
}

export async function PUT(req, res) {
  try {
    await connectDB()
    const { id } = res.params

    const body = await req.json()
    const old = await User.findOne({ id }).lean()

    if (body.username && body.username !== old.username) {
      await UserProvider.findOneAndUpdate(
        { uid: old.username },
        { uid: body.username }
      )
    }
    if (body.email && body.email !== old.email) {
      await UserProvider.findOneAndUpdate(
        { uid: old.email },
        { uid: body.email }
      )
    }

    const user = await User.findOneAndUpdate({ id }, body, {
      new: true,
    }).lean()
    if (!user) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 })
    }

    return NextResponse.json(user, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}

export async function DELETE(req, res) {
  try {
    await connectDB()
    const { id } = res.params

    const user = await User.findOneAndDelete({ id })
    if (!user) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 })
    }

    return NextResponse.json(user, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
