import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

import path from 'path'

const Bucket = process.env.AWS_BUCKET_NAME
const s3 = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
})

/**
 * @swagger
 * '/api/uploads':
 *   post:
 *     tags:
 *     -  Uploads
 *     description: Upload multi files
 *     requestBody:
 *      content:
 *       multipart/form-data:
 *        schema:
 *           type: object
 *           properties:
 *             file:
 *              type: string
 *              format: binary
 *     responses:
 *       201:
 *         description: Success
 *       400:
 *         description: Error
 */
export async function POST(request) {
  const formData = await request.formData()
  const files = formData.getAll('file')

  const response = await Promise.all(
    files.map(async (file) => {
      const fileExtension = path.extname(file.name)
      let fileName = file.name
        .replace(fileExtension, '')
        .toLowerCase()
        .split(' ')
        .join('-')
      fileName = `${fileName.substring(0, 10)}-${nanoid(4)}${fileExtension}`

      const Body = await file.arrayBuffer()

      const putParams = {
        Bucket,
        Key: fileName,
        Body,
        // ContentType: file.mimetype,
        ACL: 'public-read',
      }
      await s3.send(new PutObjectCommand(putParams))
      return {
        url: `https://${Bucket}.s3.amazonaws.com/${fileName}`,
        name: fileName,
        type: fileExtension.replace('.', ''),
      }
    })
  )

  return NextResponse.json(response)
}
