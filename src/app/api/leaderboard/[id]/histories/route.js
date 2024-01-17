import { NextResponse } from 'next/server'
import FlashSetHistory from '~/models/FlashSetHistory'
import FlashSet from '~/models/FlashSet'
import FlashCard from '~/models/FlashCard'
import Score from '~/models/Score'

import connectDB from '~/utils/database'
import { getToken } from 'next-auth/jwt'

export const dynamic = 'force-dynamic'

/**
 * @swagger
 * '/api/flashsets/{id}/histories':
 *   post:
 *     tags:
 *     -  FlashSets
 *     description: Update flashset learn
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
 *             flashcards:
 *              type: array
 *              example: [flashcardId, flashcardId]
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
export async function POST(req, res) {
  try {
    await connectDB()
    const token = await getToken({ req })
    const { id } = res.params

    const { flashcards, type } = await req.json()

    // Clear old histories
    await FlashSetHistory.deleteMany({
      userId: token.id,
      flashsetId: id,
      flashcardId: { $in: flashcards.map((i) => i.id) },
      type,
    })

    const insert = flashcards.map((card) => ({
      userId: token.id,
      flashsetId: id,
      flashcardId: card.id,
      result: card.result,
      type,
    }))

    await FlashSetHistory.insertMany(insert)

    // Calculate score
    const completed = await FlashSetHistory.countDocuments({
      userId: token.id,
      flashsetId: id,
      type,
    })
    // const totalCards = await FlashCard.countDocuments({
    //   flashsetId: id
    // })
    // console.log(completed, Math.floor(completed / 20))

    // tinhdiem
    const score = 3 * Math.floor(completed / 20)
    await Score.findOneAndUpdate(
      {
        userId: token.id,
        parentKey: type,
        parentValue: id,
      },
      { score },
      { upsert: true }
    )

    return NextResponse.json(
      { flashcards },
      {
        status: 201,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
