import { NextResponse } from 'next/server'
import FlashSet from '~/models/FlashSet'
import FlashCard from '~/models/FlashCard'
import CourseQuiz from '~/models/CourseQuiz'
import CourseFlashset from '~/models/CourseFlashset'
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
    const { flashset, cards, courseId } = await req.json()

    const flashsetData = await FlashSet.create({ ...flashset })
    if (!flashsetData) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 })
    }

    await FlashCard.insertMany(
      cards.map((i, idx) => ({
        ...i,
        frontText: i.front_text || i.frontText,
        backText: i.back_text || i.backText,
        name: `Card ${idx + 1}`,
        flashsetId: flashsetData.id,
      }))
    )
    if (courseId) {
      await CourseFlashset.create({ courseId, flashsetId: flashsetData.id })
    }

    await CourseQuiz.insertMany(
      cards.map((i, idx) => ({
        ...i,
        _id: undefined,
        name: `Card ${idx + 1}`,
        frontText: i.front_text || i.frontText,
        backText: i.back_text || i.backText,
        courseId,
        flashsetId: flashsetData.id,
        types: ['abcd', 'arrange-word', 'blank'],
      }))
    )

    return NextResponse.json(flashsetData, {
      status: 201,
      headers: getCorsHeaders(req.headers.get('origin') || ''),
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
