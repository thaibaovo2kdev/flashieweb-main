import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import Course from '~/models/Course'
import CourseStudent from '~/models/CourseStudent'
import User from '~/models/User'
import UserProvider from '~/models/UserProvider'
import connectDB from '~/utils/database'
import { nanoid } from 'nanoid'
import { VerifyCode } from '~/app/api/email/template'
import { sendMail } from '~/app/api/email/controller'

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
    const { students } = await req.json()

    const course = await Course.findOne({ id }).lean()
    if (!course) {
      return NextResponse.json({ message: 'Not found course' }, { status: 400 })
    }

    const exists = await User.find({
      email: { $in: students.map((i) => i.email) },
    }).lean()

    const users = []
    const providers = []
    const courseStudents = []
    for (const student of students) {
      const uId = nanoid(8).replace(/[_-]/g, 'V').toUpperCase()
      const username = student.email.split('@')[0]
      const avatar = `https://ui-avatars.com/api/?background=random&name=${username}&format=jpg`

      const exist = exists.find((i) => i.email == student.email)
      if (exist) {
        courseStudents.push({
          courseId: id,
          studentId: exist.id,
          status: 'accepted',
        })
      } else {
        courseStudents.push({
          courseId: id,
          studentId: uId,
          status: 'accepted',
        })
        users.push({
          id: uId,
          avatar,
          name: username,
          email: student.email,
        })
        providers.push({
          userId: uId,
          uid: student.email,
          provider: 'EMAIL',
          password: bcrypt.hashSync(`${username}`, bcrypt.genSaltSync(10)),
        })
        providers.push({
          userId: uId,
          uid: username,
          provider: 'USERNAME',
          password: bcrypt.hashSync(`${username}`, bcrypt.genSaltSync(10)),
        })
      }
    }

    await User.insertMany(users)
    await UserProvider.insertMany(providers)
    await CourseStudent.insertMany(courseStudents)

    try {
      await Promise.all(
        providers
          .filter((i) => i.uid == 'USERNAME')
          .map((i) => {
            const html = VerifyCode({
              code: i.uid,
              changePasswordUrl: `${process.env.NEXTAUTH_URL}/reset-password`,
            })
            const uId = providers.find((p) => p.userId === i.userId)
            return sendMail({ html, to: uId, subject: 'Account Created' })
          })
      )
    } catch (error) {}

    // const user = await User.findOne({
    //   $or: [{ id: studentId }, { email: studentId }],
    // }).lean()
    // if (!user) {
    //   return NextResponse.json({ message: 'Not found user' }, { status: 400 })
    // }

    return NextResponse.json(students, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
