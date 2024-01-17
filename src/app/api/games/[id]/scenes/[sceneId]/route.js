import { NextResponse } from 'next/server'
import MiniGameScene from '~/models/MiniGameScene'
import connectDB from '~/utils/database'

/**
 * @swagger
 * '/api/games/{id}/scenes/{sceneId}':
 *   post:
 *     tags:
 *     -  Scenes
 *     description: Update scenes in game
 *     parameters:
 *      - name: id
 *        in: path
 *        description: Id of course
 *        require: true
 *      - name: sceneId
 *        in: path
 *        description: Id of scene
 *        require: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */

export async function GET(req, res) {
  try {
    await connectDB()
    const { id, sceneId } = res.params

    const data = await MiniGameScene.find({ gameId: id, sceneId }).lean()

    return NextResponse.json(data, {
      status: 200,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
