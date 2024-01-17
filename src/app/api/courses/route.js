import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import Course from '~/models/Course'
import CourseStudent from '~/models/CourseStudent'
import connectDB from '~/utils/database'

/**
 * @swagger
 * /api/courses:
 *   get:
 *     tags:
 *     -  Courses
 *     description: Returns the courses
 *     responses:
 *       200:
 *         description: Success!
 */

export async function GET(req, res) {
  try {
    const token = await getToken({ req })
    // console.log(req.user, 'req.user', token);
    await connectDB()
    // await Course.create({ name: "Test course", creator: "ZY-PTX-W" });
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10)
    const perPage = parseInt(
      req.nextUrl.searchParams.get('perPage') || '20',
      10
    )
    const filter = req.nextUrl.searchParams.get('filter')
    const q = req.nextUrl.searchParams.get('q')

    let match = { level: token?.attributes?.level }
    if (filter === 'active') {
      const courseActive = await CourseStudent.find({
        studentId: token.id,
        status: 'accepted',
      }).lean()
      match = { id: { $in: courseActive.map((i) => i.courseId) } }
    }
    if (filter === 'free') {
      match = {
        $or: [
          { ...match, type: 'free' },
          { type: 'free', level: '' },
        ],
      }
    }
    if (q) {
      match['name'] = { $regex: q, $options: 'i' }
    }

    const data = await Course.find({ ...match, status: 'active' })
      .skip(page * perPage - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .lean()
    const total = await Course.countDocuments({
      ...match,
      status: 'active',
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

/**
 * @swagger
 * '/api/courses':
 *   post:
 *     tags:
 *     -  Courses
 *     description: Create courses
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

    const token = await getToken({ req })

    const body = await req.json()

    const course = await Course.create({ ...body, creator: token.id })
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
