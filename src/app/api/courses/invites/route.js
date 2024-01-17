import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import Course from '~/models/Course'
import CourseStudent from '~/models/CourseStudent'
import connectDB from '~/utils/database'

export const dynamic = 'force-dynamic'
/**
 * @swagger
 * /api/courses/invites:
 *   get:
 *     tags:
 *     -  Courses
 *     description: Returns inviting courses
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

    const courseStudents = await CourseStudent.find({
      studentId: token.id,
      status: 'pending',
    })
    const data = await Course.find({
      id: { $in: courseStudents.map((i) => i.courseId) },
    })
      .skip(page * perPage - perPage)
      .limit(perPage)
      .lean()

    const total = await Course.countDocuments({
      id: { $in: courseStudents.map((i) => i.courseId) },
    })
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
