import connectMongoDB from '@/libs/mongodb'
import Topic from '@/models/topic'
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// 이미지 저장 디렉토리 설정
const uploadDir = path.join(process.cwd(), 'public', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title')?.toString()
    const description = formData.get('description')?.toString()
    const price = formData.get('price')?.toString()
    const image = formData.get('image') as File | null
    const userEmail = formData.get('userEmail')?.toString() // 로그인한 사용자의 이메일

    // 유효성 검사
    if (!title || !description || !price || !image || !userEmail) {
      return NextResponse.json(
        { message: '상품명, 설명, 가격, 이미지, 이메일은 모두 필수입니다.' },
        { status: 400 }
      )
    }

    // 가격 변환 및 유효성 검사
    const parsedPrice = parseFloat(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json(
        { message: '유효한 가격을 입력해주세요. (양수 필요)' },
        { status: 400 }
      )
    }

    // 이미지 파일 유형 확인
    if (!allowedImageTypes.includes(image.type)) {
      return NextResponse.json(
        { message: '허용되지 않은 이미지 파일 형식입니다.' },
        { status: 400 }
      )
    }

    // 유니크한 파일 이름 생성
    const uniqueFileName = `${uuidv4()}-${image.name}`
    const imagePath = path.join(uploadDir, uniqueFileName)
    const buffer = await image.arrayBuffer()
    fs.writeFileSync(imagePath, Buffer.from(buffer))
    const imageUrl = `/uploads/${uniqueFileName}`

    // MongoDB 연결 및 데이터 저장
    await connectMongoDB()
    const newTopic = await Topic.create({
      title,
      description,
      price: parsedPrice,
      image: imageUrl, // 저장된 이미지의 경로
      userEmail, // 사용자의 이메일 추가
    })

    return NextResponse.json(
      { message: 'Topic created successfully', newTopic },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/topics:', error)
    return NextResponse.json(
      { message: 'Internal server error in POST' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await connectMongoDB()
    const topics = await Topic.find().sort({ createdAt: -1 }) // 최신 순 정렬
    return NextResponse.json({ topics })
  } catch (error) {
    console.error('Error in GET /api/topics:', error)
    return NextResponse.json(
      { message: 'Internal server error in GET' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 })
    }

    await connectMongoDB()
    const deletedTopic = await Topic.findByIdAndDelete(id)

    if (!deletedTopic) {
      return NextResponse.json({ message: 'Topic not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Topic deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE /api/topics:', error)
    return NextResponse.json(
      { message: 'Internal server error in DELETE' },
      { status: 500 }
    )
  }
}
