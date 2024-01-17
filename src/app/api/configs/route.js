import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import User from '~/models/User'
import connectDB from '~/utils/database'

/**
 * @swagger
 * /api/configs:
 *   get:
 *     tags:
 *     -  Configs
 *     description: Returns the configs
 *     responses:
 *       200:
 *         description: Success!
 */

export async function GET(req, res) {
  try {
    await connectDB()
    const level = [
      'Sprout A',
      'Sprout B',
      'Bud',
      'E3',
      'E4',
      'E5',
      'E6',
      'E7',
      'E8',
      'E9',
      'M11',
      'M12',
      'M13',
      'M14',
      'M15',
      'M16',
      'M17',
    ]
    const style = ['Realistic', 'Storytelling']
    const tone = [
      'Inspirational',
      'Informative',
      'Humorous',
      'Serious',
      'Emotional',
      'Casual',
      'Formal',
      'Sarcastic',
      'Optimistic',
      'Pessimistic',
      'Neutral',
      'Skeptical',
      'Eloquent',
      'Concise',
      'Nostalgic',
    ]
    const courseTypes = [
      { key: 'join_request', name: constants.course_type_join_request },
      { key: 'free', name: constants.course_type_free },
    ]
    return NextResponse.json(
      { courseTypes, tone, style, level },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 400 })
  }
}

/**
 * @swagger
 * '/api/users':
 *   post:
 *     tags:
 *     -  Courses
 *     description: Create User
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *           type: object
 *           properties:
 *             name:
 *              type: string
 *              example: Course test
 *             level:
 *              type: string
 *              example: M1
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *         description: Error
 */

export async function POST(req, res) {
  try {
    await connectDB()

    const body = await req.json()

    const course = await User.create(body)
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
