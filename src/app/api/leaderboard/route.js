import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import Score from '~/models/Score'
import FlashSet from '~/models/FlashSet'
import User from '~/models/User'
import CourseStudent from '~/models/CourseStudent'
import connectDB from '~/utils/database'
import CourseFlashset from '~/models/CourseFlashset'
import Course from '~/models/Course'

/**
 * @swagger
 * /api/leaderboard:
 *   get:
 *     tags:
 *     -  Leaderboard
 *     description: Returns the leaderboard
 *     responses:
 *       200:
 *         description: Success!
 */

export async function GET(req, res) {
  try {
    const token = await getToken({ req })
    await connectDB()
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10)
    const perPage = parseInt(
      req.nextUrl.searchParams.get('perPage') || '20',
      10
    )

    let community = await Score.aggregate([
      {
        $group: {
          _id: '$userId',
          score: {
            $sum: {
              $toInt: '$score',
            },
          },
        },
      },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: null,
          docs: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $unwind: {
          path: '$docs',
          includeArrayIndex: 'rownum',
        },
      },
      {
        $addFields: {
          'docs.rank': {
            $add: ['$rownum', 1],
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: '$docs',
        },
      },
      { $limit: 10 },
    ])
    const meIdx = community.findIndex((i) => i._id === token.id)
    if (meIdx > -1) community[meIdx].me = true
    else {
      let me = await Score.aggregate([
        {
          $group: {
            _id: '$userId',
            score: {
              $sum: {
                $toInt: '$score',
              },
            },
          },
        },
        { $sort: { score: -1 } },
        {
          $group: {
            _id: null,
            docs: {
              $push: '$$ROOT',
            },
          },
        },
        {
          $unwind: {
            path: '$docs',
            includeArrayIndex: 'rownum',
          },
        },
        {
          $match: {
            'docs._id': token.id,
          },
        },
        {
          $addFields: {
            'docs.rank': {
              $add: ['$rownum', 1],
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: '$docs',
          },
        },
        { $limit: 10 },
      ])
      console.log(me, 'mememe', community[0])
      if (me.length === 0) {
        me = [{ _id: token.id, score: 0, rank: community.length + 1, me: true }]
      }
      community = [...community, ...me]
    }

    let game = await Score.aggregate([
      {
        $match: {
          parentKey: 'game',
        },
      },
      {
        $group: {
          _id: '$userId',
          score: {
            $sum: {
              $toInt: '$score',
            },
          },
        },
      },
      { $sort: { score: -1 } },
      {
        $group: {
          _id: null,
          docs: {
            $push: '$$ROOT',
          },
        },
      },
      {
        $unwind: {
          path: '$docs',
          includeArrayIndex: 'rownum',
        },
      },
      {
        $addFields: {
          'docs.rank': {
            $add: ['$rownum', 1],
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: '$docs',
        },
      },
      { $limit: 10 },
    ])
    const gameMeIdx = game.findIndex((i) => i._id === token.id)
    if (gameMeIdx > -1) game[gameMeIdx].me = true
    else {
      let me = await Score.aggregate([
        {
          $match: {
            parentKey: 'game',
          },
        },
        {
          $group: {
            _id: '$userId',
            score: {
              $sum: {
                $toInt: '$score',
              },
            },
          },
        },
        { $sort: { score: -1 } },
        {
          $group: {
            _id: null,
            docs: {
              $push: '$$ROOT',
            },
          },
        },
        {
          $unwind: {
            path: '$docs',
            includeArrayIndex: 'rownum',
          },
        },
        {
          $match: {
            'docs._id': token.id,
          },
        },
        {
          $addFields: {
            'docs.rank': {
              $add: ['$rownum', 1],
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: '$docs',
          },
        },
        { $limit: 10 },
      ])
      if (me.length === 0) {
        me = [{ _id: token.id, score: 0, rank: game.length + 1, me: true }]
      }
      game = [...game, ...me]
    }

    const myCourses = await CourseStudent.find({ studentId: token.id }).lean()
    const myFlashsets = await CourseFlashset.find({
      courseId: { $in: myCourses.map((i) => i.courseId) },
    }).lean()
    // $or: [
    //   { parentKey: 'learn' },
    //   { parentKey: 'countdown' },
    //   { parentKey: 'quiz' },
    //   { parentKey: 'dictation' },
    // ],
    let scoreCourses = []
    for (const cusre of myCourses) {
      const flashsets = myFlashsets.filter((i) => i.courseId === cusre.courseId)
      // console.log(flashsets, 'flashsets')

      let ranks = await Score.aggregate([
        {
          $match: { parentValue: { $in: flashsets.map((i) => i.flashsetId) } },
        },
        {
          $group: {
            _id: '$userId',
            score: {
              $sum: {
                $toInt: '$score',
              },
            },
          },
        },
        { $sort: { score: -1 } },
        {
          $group: {
            _id: null,
            docs: {
              $push: '$$ROOT',
            },
          },
        },
        {
          $unwind: {
            path: '$docs',
            includeArrayIndex: 'rownum',
          },
        },
        {
          $addFields: {
            'docs.rank': {
              $add: ['$rownum', 1],
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: '$docs',
          },
        },
        { $limit: 10 },
      ])

      // console.log(rank, 'rank')

      const courseMeIdx = ranks.findIndex((i) => i._id === token.id)
      console.log(courseMeIdx, 'courseMeIdx', ranks)
      if (courseMeIdx > -1) ranks[courseMeIdx].me = true
      else {
        let me = await Score.aggregate([
          // {
          //   $match: {
          //     // parentKey: 'learn',
          //   },
          // },
          {
            $group: {
              _id: '$userId',
              score: {
                $sum: {
                  $toInt: '$score',
                },
              },
            },
          },
          { $sort: { score: -1 } },
          {
            $group: {
              _id: null,
              docs: {
                $push: '$$ROOT',
              },
            },
          },
          {
            $unwind: {
              path: '$docs',
              includeArrayIndex: 'rownum',
            },
          },
          {
            $match: {
              'docs._id': token.id,
            },
          },
          {
            $addFields: {
              'docs.rank': {
                $add: ['$rownum', 1],
              },
            },
          },
          {
            $replaceRoot: {
              newRoot: '$docs',
            },
          },
          { $limit: 10 },
        ])
        console.log(me, 'meme')
        if (me.length === 0) {
          me = [{ _id: token.id, score: 0, rank: ranks.length + 1, me: true }]
        }
        const _me = me[0]
        _me.me = true
        ranks = [...ranks, _me]

        // scoreCourses.push({ rank, id: cusre.courseId })
      }

      scoreCourses.push({ ranks, id: cusre.courseId })
    }
    // console.log(JSON.stringify(scoreCourses, null, 2), 'scoreCourses')
    const courses = await Course.find({
      id: { $in: myCourses.map((i) => i.courseId) },
    }).lean()
    scoreCourses = scoreCourses.map((i) => {
      const course = courses.find((c) => c.id === i.id)
      return { ...i, name: course.name }
    })
    const uids = [
      ...community.map((i) => i._id),
      ...game.map((i) => i._id),
      // ...course.map((i) => i._id),
      ...scoreCourses.reduce((p, c) => {
        return [...p, ...c.ranks.map((i) => i._id)]
      }, []),
    ]
    const users = await User.find({ id: { $in: uids } })
      .select('id avatar name')
      .lean()

    community = community.map((i) => {
      const usr = users.find((u) => u.id === i._id)
      if (!usr) return i
      return { ...usr, score: i.score, me: i.me, rank: i.rank }
    })
    game = game.map((i) => {
      const usr = users.find((u) => u.id === i._id)
      if (!usr) return i
      return { ...usr, score: i.score, me: i.me, rank: i.rank }
    })
    // course = course.map((i) => {
    //   const usr = users.find((u) => u.id === i._id)
    //   if (!usr) return i
    //   return { ...usr, score: i.score, me: i.me, rank: i.rank }
    // })

    scoreCourses = scoreCourses.reduce((p, c) => {
      // console.log(c.ranks, 'c.rank')
      const ranks = c.ranks.map((i) => {
        const usr = users.find((u) => u.id === i._id)

        if (!usr) return i
        return { ...usr, score: i.score, me: i.me, rank: i.rank }
      })
      return [...p, { ...c, ranks }]
    }, [])
    // console.log(scoreCourses, 'scoreCourses')
    // console.log(JSON.stringify(scoreCourses, null, 2))
    return NextResponse.json(
      { community, game, course: scoreCourses },
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
 * '/api/courses':
 *   post:
 *     tags:
 *     -  FlashSets
 *     description: Create courses
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *           type: object
 *           properties:
 *             name:
 *              type: string
 *              example: FlashSet test
 *             level:
 *              type: string
 *              example: M1
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

    const course = await FlashSet.create({ ...body, creator: token.id })
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
