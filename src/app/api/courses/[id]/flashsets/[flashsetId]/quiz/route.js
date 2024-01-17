import { NextResponse } from 'next/server'
import Course from '~/models/Course'
import CourseQuiz from '~/models/CourseQuiz'
import FlashCard from '~/models/FlashCard'
import connectDB from '~/utils/database'

/**
 * @swagger
 * '/api/courses/{id}/flashsets/{flashsetId}/quiz':
 *   get:
 *     tags:
 *     -  Courses
 *     description: get quiz in course
 *     parameters:
 *      - name: id
 *        in: path
 *        description: Id of course
 *        require: true
 *      - name: flashsetId
 *        in: path
 *        description: Id of flashset
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
    const { id, flashsetId } = res.params

    const course = await Course.findOne({ id }).lean()
    if (!course) {
      return NextResponse.json({ message: 'Not found course' }, { status: 400 })
    }

    const { searchParams } = req.nextUrl
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '20', 10)

    const data = await CourseQuiz.find({ courseId: id, flashsetId })
      .lean()
      .skip(page * perPage - perPage)
      .limit(perPage)
      .lean()
    const total = await CourseQuiz.countDocuments({ courseId: id, flashsetId })
    return NextResponse.json(
      { data, page, perPage, total },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}

/**
 * @swagger
 * '/api/courses/{id}/flashsets/{flashsetId}/quiz':
 *   post:
 *     tags:
 *     -  Courses
 *     description: create quiz in course
 *     parameters:
 *      - name: id
 *        in: path
 *        description: Id of course
 *        require: true
 *      - name: flashsetId
 *        in: path
 *        description: Id of flashset
 *        require: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */

export async function POST(req, res) {
  try {
    await connectDB()
    const { id, flashsetId } = res.params
    const { types } = await req.json()
    const course = await Course.findOne({ id }).lean()
    if (!course) {
      return NextResponse.json({ message: 'Not found course' }, { status: 400 })
    }

    const cards = await FlashCard.find({ flashsetId }).lean()
    await CourseQuiz.deleteMany({ courseId: id, flashsetId })
    const data = await CourseQuiz.insertMany(
      cards.map((i) => ({
        ...i,
        _id: undefined,
        courseId: id,
        flashsetId,
        types,
      }))
    )
    return NextResponse.json(data, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
