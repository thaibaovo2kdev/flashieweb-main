import { NextResponse } from 'next/server'
import MiniGameScene from '~/models/MiniGameScene'
import FlashSetHistory from '~/models/FlashSetHistory'
import connectDB from '~/utils/database'
import { getToken } from 'next-auth/jwt'

export async function GET(req, res) {
  try {
    await connectDB()
    const token = await getToken({ req })

    const { id } = res.params
    const data = await MiniGameScene.aggregate([
      { $match: { gameId: id } },
      {
        $group: { _id: '$sceneId', doc: { $first: '$$ROOT' } },
      },
      {
        $replaceRoot: { newRoot: '$doc' },
      },
    ]).sort({ sceneId: 1 })

    let idx = 0
    for (const d of data) {
      d.totalCompleted = await FlashSetHistory.countDocuments({
        userId: token.id,
        flashsetId: `${id}-${d.sceneId}`,
        type: 'game',
      })
      d.totalCards = await MiniGameScene.countDocuments({
        sceneId: d.sceneId,
        gameId: id,
      })
      d.isBlocked =
        !data[idx - 1]?.totalCompleted ||
        data[idx - 1]?.totalCompleted < data[idx - 1]?.totalCards
      idx += 1
    }
    data[0].isBlocked = false

    return NextResponse.json(data, {
      status: 200,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 500 })
  }
}
