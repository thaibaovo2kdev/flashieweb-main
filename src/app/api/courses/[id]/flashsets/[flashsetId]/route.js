import { NextResponse } from 'next/server'
import Course from '~/models/Course'
import CourseFlashset from '~/models/CourseFlashset'
import connectDB from '~/utils/database'

/**
 * @swagger
 * '/api/courses/{id}/flashsets/{flashsetId}':
 *   post:
 *     tags:
 *     -  Courses
 *     description: Update flashset in course
 *     parameters:
 *      - name: id
 *        in: path
 *        description: Id of course
 *        require: true
 *      - name: studentId
 *        in: path
 *        description: Id of studentId
 *        require: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */

export async function PUT(req, res) {
  try {
    await connectDB()
    const { id, flashsetId } = res.params
    const body = await req.json()
    const course = await Course.findOne({ id }).lean()
    if (!course) {
      return NextResponse.json({ message: 'Not found course' }, { status: 400 })
    }
    const data = await CourseFlashset.findOneAndUpdate(
      { courseId: id, flashsetId },
      body,
      { new: true }
    )
    return NextResponse.json(data, {
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
    const { id, flashsetId } = res.params
    const course = await Course.findOne({ id }).lean()
    if (!course) {
      return NextResponse.json({ message: 'Not found course' }, { status: 400 })
    }
    const data = await CourseFlashset.findOneAndUpdate(
      {
        courseId: id,
        flashsetId,
      },
      { status: 'deleted' }
    )
    return NextResponse.json(data, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
