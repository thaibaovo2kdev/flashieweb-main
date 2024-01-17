import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import Bookmark from '~/models/Bookmark'
import Course from '~/models/Course'
import FlashSet from '~/models/FlashSet'
import connectDB from '~/utils/database'

export async function GET(req, res) {
  try {
    await connectDB()

    const token = await getToken({ req })

    // const { parentType, parentId } = await req.json()

    const bookmarks = await Bookmark.find({
      userId: token.id,
    }).lean()

    let data = []
    // const courseIds = bookmarks
    //   .filter((i) => i.parentType === 'course')
    //   .map((i) => i.parentId)
    // if (courseIds.length) {
    //   const courses = await Course.find({ id: { $in: courseIds } }).lean()
    //   console.log('courses', courses)
    //   data = [...data, ...courses.map((i) => ({ data: i, type: 'course' }))]
    // }
    const flashsetIds = bookmarks
      .filter((i) => i.parentType === 'flashset')
      .map((i) => i.parentId)
    if (flashsetIds.length) {
      const flashsets = await FlashSet.find({ id: { $in: flashsetIds } }).lean()
      data = [...data, ...flashsets.map((i) => ({ data: i, type: 'flashset' }))]
    }
    return NextResponse.json(data, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
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
 *             parentType:
 *              type: string
 *             parentId:
 *              type: string
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

    const { parentType, parentId } = await req.json()

    const bookmark = await Bookmark.findOne({
      userId: token.id,
      parentType,
      parentId,
    }).lean()
    if (bookmark)
      return NextResponse.json(bookmark, {
        status: 201,
      })
    const data = await Bookmark.create({
      parentType,
      parentId,
      userId: token.id,
    })

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

    const token = await getToken({ req })

    const { parentType, parentId } = await req.json()

    const bookmark = await Bookmark.deleteMany({
      userId: token.id,
      parentType,
      parentId,
    })

    return NextResponse.json(bookmark, {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
