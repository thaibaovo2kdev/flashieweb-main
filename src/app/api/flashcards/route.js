import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import FlashCard from '~/models/FlashCard'
import connectDB from '~/utils/database'

/**
 * @swagger
 * '/api/flashcards':
 *   post:
 *     tags:
 *     -  FlashCards
 *     description: Create flashcard
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *           type: object
 *           properties:
 *             name:
 *              type: string
 *              example: FlashSet test
 *             flashsetId:
 *              type: string
 *             frontText:
 *              type: string
 *             frontImage:
 *              type: string
 *             backText:
 *              type: string
 *             backImage:
 *              type: string
 *     responses:
 *       201:
 *         description: Success
 *       400:
 *         description: Error
 */
export async function POST(req, res) {
  try {
    await connectDB()
    const token = await getToken({ req })

    const body = await req.json()

    if (Array.isArray(body)) {
      const cards = await FlashCard.insertMany(
        body.map((i) => ({ ...i, creator: token.id }))
      )

      return NextResponse.json(cards, {
        status: 201,
      })
    }

    const course = await FlashCard.create({ ...body, creator: token.id })
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
