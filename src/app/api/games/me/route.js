import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import MiniGame from '~/models/MiniGame'
import CourseStudent from '~/models/CourseStudent'
import connectDB from '~/utils/database'

export const dynamic = 'force-dynamic'
/**
 * @swagger
 * /api/courses/me:
 *   get:
 *     tags:
 *     -  Courses
 *     description: Returns my courses
 *     responses:
 *       200:
 *         description: Success!
 */

export async function GET(req, res) {
  try {
    const token = await getToken({ req })
    await connectDB()
    const { searchParams } = req.nextUrl
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '20', 10)
    const q = searchParams.get('q') || ''
    const type = searchParams.get('type') || ''
    const level = searchParams.get('level') || ''

    const match = {
      'creator.id': token.id,
      status: { $ne: 'deleted' },
    }
    if (q) {
      match['name'] = { $regex: q, $options: 'i' }
      // match['$or'] = [
      //   {
      //     name: { $regex: q, $options: 'i' },
      //   },
      //   { type: { $regex: q, $options: 'i' } },
      // ]
    }
    if (type && type !== 'all') match['type'] = type
    if (level) match['level'] = level

    const data = await MiniGame.find(match)
      .skip(page * perPage - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .lean()

    const total = await MiniGame.countDocuments(match)
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
