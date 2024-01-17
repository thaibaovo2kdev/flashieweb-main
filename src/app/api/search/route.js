import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import Course from '~/models/Course'
import FlashSet from '~/models/FlashSet'
import User from '~/models/User'
import connectDB from '~/utils/database'
import Bookmark from '~/models/Bookmark'

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags:
 *     -  search
 *     description: Returns the search
 *     responses:
 *       200:
 *         description: Success!
 */

export async function GET(req, res) {
  try {
    const token = await getToken({ req })
    await connectDB()
    const { searchParams } = req.nextUrl
    // const page = parseInt(searchParams.get('page') || '1', 10)
    // const perPage = parseInt(searchParams.get('perPage') || '20', 10)
    const q = searchParams.get('q') || ''

    let courses = await Course.find({
      name: { $regex: q, $options: 'i' },
    }).limit(5)
    let flashsets = await FlashSet.find({
      name: { $regex: q, $options: 'i' },
    }).limit(5)
    // let users = await User.find({ name: { $regex: q, $options: 'i' } }).limit(5)

    const data = [
      ...courses.map((i) => ({
        type: 'course',
        id: i.id,
        name: i.name,
        image: i.image,
      })),
      ...flashsets.map((i) => ({
        type: 'flashset',
        id: i.id,
        name: i.name,
        image: i.image,
      })),
      // ...users.map((i) => ({
      //   type: 'user',
      //   id: i.id,
      //   name: i.name,
      //   image: i.avatar,
      // })),
    ]

    return NextResponse.json(
      { data },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 400 })
  }
}
