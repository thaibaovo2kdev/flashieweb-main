import { NextResponse } from 'next/server'
import CourseToken from '~/models/CourseToken'
import connectDB from '~/utils/database'
// import { getToken } from 'next-auth/jwt'

export async function POST(req, res) {
  try {
    await connectDB()
    const { id } = res.params

    const data = await CourseToken.create({ courseId: id })

    return NextResponse.json(data, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
