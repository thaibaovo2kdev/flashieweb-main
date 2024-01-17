import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import MiniGame from '~/models/MiniGame'
import MiniGameScene from '~/models/MiniGameScene'
import CourseFlashset from '~/models/CourseFlashset'
import FlashCard from '~/models/FlashCard'
import connectDB from '~/utils/database'

/**
 * @swagger
 * /api/games:
 *   get:
 *     tags:
 *     -  Games
 *     description: Returns the games
 *     responses:
 *       200:
 *         description: Success!
 */

export async function GET(req, res) {
  try {
    const token = await getToken({ req })
    // console.log(req.user, 'req.user', token);
    await connectDB()
    // await Course.create({ name: "Test course", creator: "ZY-PTX-W" });
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10)
    const perPage = parseInt(
      req.nextUrl.searchParams.get('perPage') || '20',
      10
    )
    // const filter = req.nextUrl.searchParams.get('filter')

    let match = { level: token?.attributes?.level }
    // if (filter === 'active') {
    //   const courseActive = await CourseStudent.find({
    //     studentId: token.id,
    //     status: 'accepted',
    //   }).lean()
    //   match = { id: { $in: courseActive.map((i) => i.courseId) } }
    // }
    const data = await MiniGame.find({
      ...match,
      status: { $ne: 'deleted' },
    })
      .skip(page * perPage - perPage)
      .limit(perPage)
      .lean()
    const total = await MiniGame.countDocuments({})
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

/**
 * @swagger
 * '/api/games':
 *   post:
 *     tags:
 *     -  Games
 *     description: Create games
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *           type: object
 *           properties:
 *             name:
 *              type: string
 *              example: Course test
 *             image:
 *              type: string
 *              example: https://
 *     responses:
 *       201:
 *         description: Success
 *       404:
 *         description: Error
 */

export async function POST(req, res) {
  try {
    await connectDB()

    const token = await getToken({ req })

    const body = await req.json()
    // let match = {}
    // if (body.type === 'matching1') {
    //   match = {
    //     frontImage: /^[\s\S]{10,}$/,
    //     backImage: /^[\s\S]{10,}$/,
    //   }
    // }
    // if (body.type === 'matching2') {
    //   match = {
    //     $or: [{ frontImage: /^[\s\S]{10,}$/ }, { backImage: /^[\s\S]{10,}$/ }],
    //   }
    // }

    let courseFlashsetIds = []
    console.log(body.courseIds, 'body.courseIds')
    if (body.courseIds) {
      const cflashsets = await CourseFlashset.find({
        courseId: { $in: body.courseIds },
      }).lean()
      courseFlashsetIds = cflashsets.map((i) => i.flashsetId)
      console.log(courseFlashsetIds, 'courseFlashsetIds')
    }

    const cards = await FlashCard.find({
      flashsetId: { $in: [...body.flashsetIds, ...courseFlashsetIds] },
      // $or: [{ frontImage: /^[\s\S]{10,}$/ }, { backImage: /^[\s\S]{10,}$/ }],
    }).lean()

    if (cards.length < 2) {
      return NextResponse.json(
        {
          message: 'Cards are not enough to create a game!',
        },
        { status: 400 }
      )
    }

    const game = await MiniGame.create({ ...body, creator: token })

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

    return NextResponse.json([], {
      status: 201,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
