import { NextResponse } from 'next/server'
import Course from '~/models/Course'
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
    const body = await req.json()

    const course = await Course.create({ ...body })
    if (!course) {
      return NextResponse.json({ message: 'Not found' }, { status: 400 })
    }

    return NextResponse.json(course, {
      status: 201,
      headers: getCorsHeaders(req.headers.get('origin') || ''),
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({ message: 'Bad request' }, { status: 400 })
  }
}
