import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import FlashSet from '~/models/FlashSet'
import FlashCard from '~/models/FlashCard'
import connectDB from '~/utils/database'

export const dynamic = 'force-dynamic'
/**
 * @swagger
 * /api/flashsets/me:
 *   get:
 *     tags:
 *     -  FlashSets
 *     description: Returns my flashsets
 *     responses:
 *       200:
 *         description: Success!
 */

export async function GET(req, res) {
  try {
    const token = await getToken({ req })
    await connectDB()
    const { searchParams } = req.nextUrl
    const page = parseInt(searchParams.get('page') || '1', 10)
    const perPage = parseInt(searchParams.get('perPage') || '20', 10)
    const q = searchParams.get('q') || ''
    const type = searchParams.get('type') || ''

    const match = { creator: token.id }
    if (q) {
      match['$or'] = [
        {
          name: { $regex: q, $options: 'i' },
        },
        { type: { $regex: q, $options: 'i' } },
      ]
    }
    if (type && type !== 'all') match['type'] = type

    const data = await FlashSet.find(match)
      .skip(page * perPage - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .lean()
    for (const d of data) {
      d.totalCards = await FlashCard.countDocuments({ flashsetId: d.id })
    }
    const total = await FlashSet.countDocuments(match)
    return NextResponse.json(
      { data, page, perPage, total },
      {
        status: 200,
      }
    )
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 400 })
  }
}
