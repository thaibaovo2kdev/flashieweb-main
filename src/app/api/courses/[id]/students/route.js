import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import Course from '~/models/Course'
import CourseStudent from '~/models/CourseStudent'
import Friend from '~/models/Friend'
import User from '~/models/User'
import connectDB from '~/utils/database'

export async function GET(req, res) {
  try {
    await connectDB()
    const token = await getToken({ req })

    const { searchParams } = req.nextUrl
    const { id } = res.params
    const students = await CourseStudent.find({
      courseId: id,
      status: { $ne: 'rejected' },
    }).lean()
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '20', 10)

    const data = await User.find({
      id: { $in: students.map((i) => i.studentId) },
    })
      .select('id name avatar email')
      .skip(page * perPage - perPage)
      .limit(perPage)
      .lean()

    const friends = await Friend.find({
      requester: token.id,
      recipient: { $in: students.map((i) => i.studentId) },
    }).lean()

    console.log(friends, 'friends')
    for (const d of data) {
      d.status = students.find((i) => i.studentId == d.id)?.status
      d.friendStatus = friends.find((i) => i.recipient == d.id)?.status
    }
    console.log(data, 'data')

    const total = await CourseStudent.countDocuments({
      courseId: id,
      status: { $ne: 'rejected' },
    })

    return NextResponse.json(
      {
        data: data.map((i) => ({
          ...i,
          createdAt: students.find((s) => s.studentId === i.id)?.createdAt,
        })),
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
 * '/api/courses/{id}/students':
 *   post:
 *     tags:
 *     -  Courses
 *     description: Add a student to course
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
 *             studentId:
 *              type: string
 *              example: id of student
 *             status:
 *              type: string
 *              example: pending
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
    const { studentId, status } = await req.json()

    const course = await Course.findOne({ id }).lean()
    if (!course) {
      return NextResponse.json({ message: 'Not found course' }, { status: 400 })
    }

    const listUsrIds = studentId.split(',').map((i) => i.trim())
    if (listUsrIds.length > 1) {
      const users = await User.find({
        $or: [{ id: { $in: listUsrIds } }, { email: { $in: listUsrIds } }],
      }).lean()
      if (users.length === 0) {
        return NextResponse.json({ message: 'Not found user' }, { status: 400 })
      }

      for (const usr of users) {
        await CourseStudent.findOneAndDelete({
          courseId: id,
          studentId: usr.id,
        })
        const data = await CourseStudent.create({
          courseId: id,
          studentId: usr.id,
          status,
        })
      }

      return NextResponse.json(
        {},
        {
          status: 201,
        }
      )
    }

    const user = await User.findOne({
      $or: [{ id: studentId }, { email: studentId }],
    }).lean()
    if (!user) {
      return NextResponse.json({ message: 'Not found user' }, { status: 400 })
    }

    // const course = await Course.findOne({ id }).lean()
    // if (!course) {
    //   return NextResponse.json({ message: 'Not found course' }, { status: 400 })
    // }
    const exists = await CourseStudent.findOne({
      courseId: id,
      studentId: user.id,
    })
    if (exists) {
      if (exists.status === 'pending') {
        return NextResponse.json(
          {
            message: 'Student has been invited!',
          },
          { status: 400 }
        )
      }
      await CourseStudent.findOneAndDelete({ courseId: id, studentId: user.id })
    }

    const data = await CourseStudent.create({
      courseId: id,
      studentId: user.id,
      status,
    })
    return NextResponse.json(data, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
