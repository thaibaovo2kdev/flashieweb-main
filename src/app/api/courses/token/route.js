import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import CourseToken from '~/models/CourseToken'
import CourseStudent from '~/models/CourseStudent'
import connectDB from '~/utils/database'
import constants from '~/utils/constants'

export const dynamic = 'force-dynamic'

export async function POST(req, res) {
  try {
    const token = await getToken({ req })
    await connectDB()
    // const { searchParams } = req.nextUrl
    // const page = parseInt(searchParams.get('page') || '1', 10)
    // const perPage = parseInt(searchParams.get('perPage') || '20', 10)
    const body = await req.json()
    const courseToken = await CourseToken.findOne({
      token: body.token,
      // status: 'pending',
    })
    if (!courseToken) {
      return NextResponse.json(
        { message: constants.course_token+' invalid!' },
        {
          status: 400,
        }
      )
    }

    if (new Date().getTime() > new Date(courseToken.expireAt).getTime()) {
      return NextResponse.json(
        { message: constants.course_token+' has expired!' },
        {
          status: 400,
        }
      )
    }
    const data = await CourseStudent.create({
      courseId: courseToken.courseId,
      studentId: token.id,
      status: 'requested',
    })
    return NextResponse.json(data, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 400 })
  }
}
