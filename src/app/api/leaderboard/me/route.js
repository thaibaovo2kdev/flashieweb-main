import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import FlashSet from '~/models/FlashSet'
import MiniGame from '~/models/MiniGame'
import Score from '~/models/Score'

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
    // const name = searchParams.get('q') || ''
    // const type = searchParams.get('type') || ''

    // const filter = {}
    // if (name) {
    //   filter['name'] = { $regex: name, $options: 'i' }
    // }
    // if (type && type !== 'all') filter['type'] = type

    const data = await Score.find({ userId: token.id })
      .skip(page * perPage - perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .lean()

    // const courseIds = data.filter(i => ['dictation', 'countdown', 'learn'].includes(i.parentKey))
    const flashsets = await FlashSet.find({
      id: { $in: data.map((i) => i.parentValue) },
    }).lean()
    const games = await MiniGame.find({
      id: {
        $in: data
          .filter((i) => i.parentKey === 'game')
          .map((i) => i.parentValue.split('-')[0]),
      },
    }).lean()
    console.log(
      data
        .filter((i) => i.parentKey === 'game')
        .map((i) => i.parentValue.split('-')[0])
    )
    for (const d of data) {
      const flashset = flashsets.find((i) => i.id === d.parentValue)
      if (flashset) d.parentName = flashset?.name
      const game = games.find((i) => i.id === d.parentValue.split('-')[0])
      if (game) d.parentName = game?.name
    }
    const total = await Score.countDocuments({ userId: token.id })
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
