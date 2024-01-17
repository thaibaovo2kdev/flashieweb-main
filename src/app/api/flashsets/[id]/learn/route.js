import { NextResponse } from 'next/server'
import Learn from '~/models/Learn'
import Score from '~/models/Score'

import connectDB from '~/utils/database'
import { getToken } from 'next-auth/jwt'

export const dynamic = 'force-dynamic'

/**
 * @swagger
 * '/api/flashsets/{id}/learn':
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

    const { flashcards } = await req.json()

    // Clear old histories
    await Learn.deleteMany({
      userId: token.id,
      flashsetId: id,
      flashcardId: { $in: flashcards },
    })

    const insert = flashcards.map((flashcardId) => ({
      userId: token.id,
      flashsetId: id,
      flashcardId,
    }))

    await Learn.insertMany(insert)

    // Calculate score
    const learned = await Learn.countDocuments({
      userId: token.id,
      flashsetId: id,
    })
    const score = (3 * learned) / 20
    await Score.findOneAndUpdate({
      userId: token.id,
      parentKey: `learn`,
      parentValue: id,
      score,
    })

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
