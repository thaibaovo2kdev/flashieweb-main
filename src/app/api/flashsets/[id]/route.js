import { NextResponse } from 'next/server'
import FlashSet from '~/models/FlashSet'
import FlashCard from '~/models/FlashCard'
import Learn from '~/models/Learn'
import FlashSetHistory from '~/models/FlashSetHistory'
import connectDB from '~/utils/database'
import { getToken } from 'next-auth/jwt'
import Bookmark from '~/models/Bookmark'
import CourseQuiz from '~/models/CourseQuiz'

/**
 * @swagger
 * '/api/flashsets/{id}':
 *   post:
 *     tags:
 *     -  FlashSets
 *     description: Get flashset
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id of FlashSet
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
    const token = await getToken({ req })
    const { id } = res.params
    const flashset = await FlashSet.findOne({ id }).lean()

    if (!flashset) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 })
    }

    const totalHamburgers = await FlashCard.countDocuments({
      flashsetId: id,
      frontText: { $exists: true, $ne: '' },
      backText: { $exists: true, $ne: '' },
    })
    const completedHamburgers = await FlashSetHistory.countDocuments({
      flashsetId: id,
      userId: token.id,
      type: 'burger',
    })
    flashset.hamburger = {
      total: totalHamburgers,
      completed: completedHamburgers,
    }

    flashset.totalCards = await FlashCard.countDocuments({ flashsetId: id })

    flashset.learned = await FlashSetHistory.countDocuments({
      flashsetId: id,
      userId: token.id,
      type: 'learn',
    })
    // flashset.countdown = await FlashSetHistory.countDocuments({
    //   flashsetId: id,
    //   userId: token.id,
    //   type: 'countdown',
    // })
    flashset.quiz = await FlashSetHistory.countDocuments({
      flashsetId: id,
      userId: token.id,
      type: 'quiz',
    })
    flashset.dictation = await FlashSetHistory.countDocuments({
      flashsetId: id,
      userId: token.id,
      type: 'dictation',
    })
    // flashset.totalQuiz = await CourseQuiz.countDocuments({
    //   flashsetId: id,
    //   // courseId: token.id,
    //   type: 'course',
    // })

    const bookmark = await Bookmark.findOne({
      parentId: id,
      parentType: 'flashset',
      userId: token.id,
    }).lean()
    flashset.isBookmark = bookmark ? true : false

    return NextResponse.json(flashset, {
      status: 200,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 500 })
  }
}

/**
 * @swagger
 * '/api/flashsets/{id}':
 *   post:
 *     tags:
 *     -  FlashSets
 *     description: Get flashset
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id of Flashset
 *        require: true
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *           type: object
 *           properties:
 *             name:
 *              type: string
 *              example: FlashSet test
 *             type:
 *              type: string
 *             status:
 *              type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
export async function PUT(req, res) {
  try {
    await connectDB()
    const { id } = res.params

    const body = await req.json()

    const course = await FlashSet.findOneAndUpdate({ id }, body, {
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

/**
 * @swagger
 * '/api/flashsets/{id}':
 *   delete:
 *     tags:
 *     -  FlashSets
 *     description: Delete flashset
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id of Flashset
 *        require: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
export async function DELETE(req, res) {
  try {
    await connectDB()
    const { id } = res.params

    const course = await FlashSet.findOneAndDelete({ id })
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
