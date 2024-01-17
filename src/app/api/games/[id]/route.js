import { NextResponse } from 'next/server'
import MiniGame from '~/models/MiniGame'
import Course from '~/models/Course'
import Bookmark from '~/models/Bookmark'
import connectDB from '~/utils/database'
import { getToken } from 'next-auth/jwt'

/**
 * @swagger
 * '/api/courses/{id}':
 *   post:
 *     tags:
 *     -  Courses
 *     description: Get course
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id of course
 *        require: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */

export async function GET(req, res) {
  try {
    const token = await getToken({ req })

    await connectDB()
    const { id } = res.params
    const course = await MiniGame.findOne({
      id,
      status: { $ne: 'deleted' },
    }).lean()

    if (!course) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 })
    }

    // const bookmark = await Bookmark.findOne({
    //   parentId: id,
    //   parentType: 'course',
    //   userId: token.id,
    // }).lean()
    // course.isBookmark = bookmark ? true : false

    return NextResponse.json(course, {
      status: 200,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 500 })
  }
}

export async function PUT(req, res) {
  try {
    await connectDB()
    const { id } = res.params

    const body = await req.json()
    const course = await MiniGame.findOneAndUpdate({ id }, body, {
      new: true,
    }).lean()
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

export async function DELETE(req, res) {
  try {
    await connectDB()
    const { id } = res.params

    const course = await MiniGame.findOneAndUpdate(
      { id },
      { status: 'deleted' }
    )
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
