import { NextResponse } from 'next/server'
import MiniGame from '~/models/MiniGame'
import MiniGameScene from '~/models/MiniGameScene'
import FlashCard from '~/models/FlashCard'
import connectDB from '~/utils/database'

const getCorsHeaders = (origin) => {
  // Default options
  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Origin': '*',
  }

  // If no allowed origin is set to default server origin
  if (!process.env.ALLOWED_ORIGIN || !origin) return headers

  // If allowed origin is set, check if origin is in allowed origins
  const allowedOrigins = process.env.ALLOWED_ORIGIN.split(',')

  // Validate server origin
  if (allowedOrigins.includes('*')) {
    headers['Access-Control-Allow-Origin'] = '*'
  } else if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }

  // Return result
  return headers
}

export const OPTIONS = async (request) => {
  // Return Response
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: getCorsHeaders(request.headers.get('origin') || ''),
    }
  )
}

export async function POST(req, res) {
  try {
    await connectDB()
    const { flashsetIds, gameData } = await req.json()

    const cards = await FlashCard.find({
      flashsetId: { $in: flashsetIds },
    }).lean()

    if (cards.length < 2) {
      return NextResponse.json(
        {
          message: 'Cards are not enough to create a game!',
        },
        { status: 400 }
      )
    }
    const game = await MiniGame.create(gameData)

    const scenes = []
    const sceneNum = [
      { from: 0, to: 4 },
      { from: 4, to: 10 },
      { from: 10, to: 18 },
      { from: 18, to: 28 },
      { from: 28, to: 42 },
    ]

    for (let index = 0; index < 5; index++) {
      if (sceneNum[index]) {
        const sCard = cards.slice(sceneNum[index].from, sceneNum[index].to)
        if (sCard.length - (sceneNum[index].to - sceneNum[index].from) === 0) {
          scenes.push(
            sCard.map((i) => ({
              ...i,
              _id: undefined,
              gameId: game.id,
              sceneId: `${index + 1}`,
            }))
          )
        }
      }
    }

    for (const scene of scenes) {
      await MiniGameScene.insertMany(scene)
    }

    return NextResponse.json(game, {
      status: 201,
      headers: getCorsHeaders(req.headers.get('origin') || ''),
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
