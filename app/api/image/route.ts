import { R2Client } from '@/lib/services/image/r2Client'
import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length',
  'Access-Control-Max-Age': '86400', // 24시간 동안 preflight 요청 캐시
}

// Helper function to create consistent response with CORS
const createResponse = (body: any, status: number = 200) => {
  return NextResponse.json(body, {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  })
}

// 타임아웃 설정 추가
const UPLOAD_TIMEOUT = 30000 // 30초

const uploadImage = async (
  files: File[],
  route: string,
  id: string,
  startIndex: string,
) => {
  const uploadPromises = files.map(async (file, index) => {
    try {
      // 각 파일 업로드에 대한 타임아웃 설정
      const uploadWithTimeout = Promise.race([
        (async () => {
          const buffer = Buffer.from(await file.arrayBuffer())
          const fileType = file.type.split('/')[0]

          let optimizedBuffer = buffer
          let contentType = file.type
          let fileExtension = file.name.split('.').pop()

          if (fileType === 'image') {
            try {
              optimizedBuffer = await sharp(buffer)
                .resize()
                .webp({ quality: 80 })
                .toBuffer()
              contentType = 'image/webp'
              fileExtension = 'webp'
            } catch (error) {
              console.error('이미지 최적화 중 오류:', error)
            }
          }

          const fileName = `${route}-${id}-${index + Number(startIndex)}.${fileExtension}`

          // 파일 크기 로깅 추가
          console.log(
            `Uploading file: ${fileName}, Size: ${buffer.length} bytes`,
          )

          const command = new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: fileName,
            Body: optimizedBuffer,
            ContentType: contentType,
            CacheControl: 'public, max-age=604800, immutable',
          })

          await R2Client.send(command)
          return { success: true, fileName }
        })(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Upload timeout')), UPLOAD_TIMEOUT),
        ),
      ])

      return await uploadWithTimeout
    } catch (error) {
      console.error(`파일 업로드 중 오류 (${file.name}):`, error)
      return { success: false, error, fileName: file.name }
    }
  })

  // 모든 업로드 작업에 대한 타임아웃 설정
  const results = await Promise.all(uploadPromises)
  const failedUploads = results.filter((r: any) => !r.success)

  if (failedUploads.length > 0) {
    throw new Error(`${failedUploads.length}개의 파일 업로드 실패`)
  }

  return results.filter((r: any) => r.success).map((r: any) => r.fileName)
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function POST(req: NextRequest) {
  try {
    // 요청 크기 제한 확인
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 500 * 1024 * 1024) {
      // 500MB 제한
      return createResponse({ error: '파일 크기가 너무 큽니다' }, 413)
    }

    if (!process.env.R2_BUCKET_NAME) {
      return createResponse(
        { error: 'R2 버킷 이름이 설정되지 않았습니다' },
        500,
      )
    }

    const formData = await req.formData()
    const files = formData.getAll('files')
    const route = formData.get('route')
    const id = formData.get('id')
    const startIndex = formData.get('startIndex')

    if (!files?.length || !route || !id || !startIndex) {
      return createResponse({ error: '필수 파라미터가 누락되었습니다' }, 400)
    }

    // 디버깅을 위한 로그 추가
    console.log(`업로드 시작: ${files.length}개 파일`)
    console.log(`Route: ${route}, ID: ${id}, StartIndex: ${startIndex}`)

    const uploadedFiles = await uploadImage(
      files as File[],
      route as string,
      id as string,
      startIndex as string,
    )

    return createResponse({
      message: '이미지가 성공적으로 업로드되었습니다',
      files: uploadedFiles,
    })
  } catch (error) {
    console.error('이미지 업로드 중 상세 오류:', error)
    return createResponse(
      {
        error: '이미지 업로드에 실패했습니다',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      500,
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const prefix = searchParams.get('prefix')

    if (!prefix) {
      return createResponse({ error: 'prefix 파라미터가 필요합니다' }, 400)
    }

    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
      Prefix: prefix,
    })

    const listResponse = await R2Client.send(listCommand)

    if (!listResponse.Contents?.length) {
      return createResponse({ error: '이미지를 찾을 수 없습니다' }, 404)
    }

    const urlPromises = listResponse.Contents.map(async (item) => {
      const headCommand = new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: item.Key,
      })

      const headResponse = await R2Client.send(headCommand)
      const getCommand = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: item.Key,
      })

      const signedUrl = await getSignedUrl(R2Client, getCommand, {
        expiresIn: 3600,
      })

      return {
        key: item.Key,
        url: signedUrl,
        contentType: headResponse.ContentType,
      }
    })

    const imageUrls = await Promise.all(urlPromises)
    return createResponse({ urls: imageUrls })
  } catch (error) {
    console.error('이미지 URL 생성 중 오류:', error)
    return createResponse({ error: '이미지 URL 생성에 실패했습니다' }, 500)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get('key')

    if (!key) {
      return createResponse({ error: 'key 파라미터가 필요합니다' }, 400)
    }

    const listCommand = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME!,
      Prefix: key,
    })

    const listResponse = await R2Client.send(listCommand)

    if (!listResponse.Contents?.length) {
      return createResponse({ error: '삭제할 이미지가 존재하지 않습니다' }, 404)
    }

    const deletePromises = listResponse.Contents.map((item) => {
      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: item.Key,
      })
      return R2Client.send(command)
    })

    await Promise.all(deletePromises)
    return createResponse({ message: '이미지들이 성공적으로 삭제되었습니다' })
  } catch (error) {
    console.error('이미지 삭제 중 오류:', error)
    return createResponse({ error: '이미지 삭제에 실패했습니다' }, 500)
  }
}
