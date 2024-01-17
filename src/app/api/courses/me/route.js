import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import Course from '~/models/Course'
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
    const q = searchParams.get('q')
    const level = searchParams.get('level')
    //{course.totalLearned}/{course.totalStudents}
    const match = { creator: token.id, status: { $ne: 'deleted' } }
    if (q) {
      match['name'] = { $regex: q, $options: 'i' }
    }
    if (level) {
      match['level'] = level
    }

    const data = await Course.find(match)
      .skip(page * perPage - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .lean()

    for (const d of data) {
      d.totalStudents = await CourseStudent.countDocuments({
        courseId: d.id,
        status: { $ne: 'deleted' },
      })
      d.totalStudentAccepteds = await CourseStudent.countDocuments({
        courseId: d.id,
        status: 'accepted',
      })
      // const totalLearned = await CourseStudent.aggregate([
      //   {
      //     $match: {
      //       courseId: d.id,
      //     },
      //   },
      //   {
      //     $group: {
      //       _id: '$studentId',
      //       count: {
      //         $sum: 1,
      //       },
      //     },
      //   },
      // ])
      // d.totalLearned = totalLearned.length
    }
    const total = await Course.countDocuments(match)
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
