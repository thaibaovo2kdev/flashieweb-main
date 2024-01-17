import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import User from '~/models/User'
import connectDB from '~/utils/database'

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *     -  Users
 *     description: Returns the users
 *     responses:
 *       200:
 *         description: Success!
 */

export async function GET(req, res) {
  try {
    await connectDB()
    const { searchParams } = req.nextUrl
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '20', 10)

    let match = {}
    if (searchParams.get('username')) {
      match['username'] = searchParams.get('username')
    }
    if (searchParams.get('q')) {
      match = {
        $or: [
          { username: { $regex: searchParams.get('q'), $options: 'i' } },
          { email: { $regex: searchParams.get('q'), $options: 'i' } },
          { name: { $regex: searchParams.get('q'), $options: 'i' } },
        ],
      }
    }

    const data = await User.find(match)
      .skip(page * perPage - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .lean()
    const total = await User.countDocuments({})
    return NextResponse.json(
      { data, page, perPage, total },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 400 })
  }
}

/**
 * @swagger
 * '/api/users':
 *   post:
 *     tags:
 *     -  Courses
 *     description: Create User
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *           type: object
 *           properties:
 *             name:
 *              type: string
 *              example: Course test
 *             level:
 *              type: string
 *              example: M1
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *         description: Error
 */

export async function POST(req, res) {
  try {
    await connectDB()

    const body = await req.json()

    const course = await User.create(body)
    if (!course) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 })
    }

    return NextResponse.json(course, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
