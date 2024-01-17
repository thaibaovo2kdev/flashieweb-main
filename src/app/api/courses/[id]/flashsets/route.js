import { NextResponse } from 'next/server'
import Course from '~/models/Course'
import CourseFlashset from '~/models/CourseFlashset'
import FlashSet from '~/models/FlashSet'
import FlashCard from '~/models/FlashCard'
import CourseQuiz from '~/models/CourseQuiz'

import connectDB from '~/utils/database'

export async function GET(req, res) {
  try {
    await connectDB()
    const { searchParams } = req.nextUrl
    const { id } = res.params
    const courseFlashsets = await CourseFlashset.find({
      courseId: id,
      status: { $ne: 'deleted' },
    }).lean()
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '10', 10)

    const data = await FlashSet.find({
      id: { $in: courseFlashsets.map((i) => i.flashsetId) },
    })
      // .select('id name avatar email')
      .skip(page * perPage - perPage)
      .limit(perPage)
      .lean()

    for (const d of data) {
      const courseQuiz = await CourseQuiz.findOne({
        courseId: id,
        flashsetId: d.id,
      })
      d.hasQuiz = !!courseQuiz
      d.totalCards = await FlashCard.countDocuments({
        flashsetId: d.id,
      })
    }

    const total = await FlashSet.countDocuments({
      id: { $in: courseFlashsets.map((i) => i.flashsetId) },
      // courseId: id,
      // status: { $ne: 'deleted' },
    })

    return NextResponse.json(
      {
        data,
        page,
        perPage,
        total,
      },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 500 })
  }
}

/**
 * @swagger
 * '/api/courses/{id}/flashsets':
 *   post:
 *     tags:
 *     -  Courses
 *     description: Add a flashset to course
 *     parameters:
 *      - name: id
 *        in: path
 *        description: Id of course
 *        require: true
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *           type: object
 *           properties:
 *             flashsetId:
 *              type: string
 *              example: id of student
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */

export async function POST(req, res) {
  try {
    await connectDB()
    const { id } = res.params
    const { flashsetIds } = await req.json()

    const course = await Course.findOne({ id }).lean()
    if (!course) {
      return NextResponse.json({ message: 'Not found course' }, { status: 400 })
    }
    const data = await CourseFlashset.insertMany(
      flashsetIds.map((flashsetId) => ({
        courseId: id,
        flashsetId,
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
