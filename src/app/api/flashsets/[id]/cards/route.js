import { NextResponse } from 'next/server'
import FlashCard from '~/models/FlashCard'
import FlashSet from '~/models/FlashSet'

import connectDB from '~/utils/database'

/**
 * @swagger
 * /api/flashsets/{id}/cards:
 *   get:
 *     tags:
 *     -  FlashSets
 *     description: Returns cards of flashset
 *     responses:
 *       200:
 *         description: Success!
 */

export async function GET(req, res) {
  try {
    await connectDB()
    const { id } = res.params
    const { searchParams } = req.nextUrl
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '20', 10)

    const data = await FlashCard.find({ flashsetId: id })
      .skip(page * perPage - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .lean()

    const total = await FlashCard.countDocuments({ flashsetId: id })
    return NextResponse.json(
      { data, page, perPage, total },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad Request' }, { status: 400 })
  }
}
