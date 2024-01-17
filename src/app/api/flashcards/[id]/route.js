import { NextResponse } from 'next/server'
import FlashCard from '~/models/FlashCard'
import connectDB from '~/utils/database'

/**
 * @swagger
 * '/api/flashcards/{id}':
 *   get:
 *     tags:
 *     -  FlashCards
 *     description: Get flash card
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id of flash card
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
    const { id } = res.params
    const course = await FlashCard.findOne({ id }).lean()

    if (!course) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 })
    }

    return NextResponse.json(course, {
      status: 200,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: '' }, { status: 500 })
  }
}

/**
 * @swagger
 * '/api/flashcards/{id}':
 *   put:
 *     tags:
 *     -  FlashCards
 *     description: Get flash card
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id of flash card
 *        require: true
 *     requestBody:
 *      content:
 *       application/json:
 *        schema:
 *           type: object
 *           properties:
 *             name:
 *              type: string
 *              example: FlashSet test
 *             flashsetId:
 *              type: string
 *             frontText:
 *              type: string
 *             frontImage:
 *              type: string
 *             backText:
 *              type: string
 *             backImage:
 *              type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
export async function PUT(req, res) {
  try {
    await connectDB()
    const { id } = res.params

    const body = await req.json()

    const course = await FlashCard.findOneAndUpdate({ id }, body, {
      new: true,
    }).lean()
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

/**
 * @swagger
 * '/api/flashcards/{id}':
 *   delete:
 *     tags:
 *     -  FlashCards
 *     description: Delete a flash card
 *     parameters:
 *      - name: id
 *        in: path
 *        description: id of flash card
 *        require: true
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Error
 */
export async function DELETE(req, res) {
  try {
    await connectDB()
    const { id } = res.params

    const course = await FlashCard.findOneAndDelete({ id })
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
