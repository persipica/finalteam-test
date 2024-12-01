import { NextRequest, NextResponse } from 'next/server'

import Favorite from '@/models/Favorite'
import connectMongoDB from '@/libs/mongodb'

// POST 요청 처리 (찜 추가)
export async function POST(req: NextRequest) {
  try {
    await connectMongoDB()

    const body = await req.json()
    const { topicId, userEmail } = body

    if (!topicId || !userEmail) {
      return NextResponse.json(
        { error: 'topicId and userEmail are required' },
        { status: 400 }
      )
    }

    const newFavorite = await Favorite.create({ topicId, userEmail })
    return NextResponse.json(newFavorite, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/favorites:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// GET 요청 처리 (찜 목록 조회)
export async function GET(req: NextRequest) {
  try {
    await connectMongoDB()

    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('userEmail')

    if (!userEmail) {
      return NextResponse.json(
        { error: 'userEmail query parameter is required' },
        { status: 400 }
      )
    }

    const favorites = await Favorite.find({ userEmail }).populate('topicId')
    return NextResponse.json(favorites, { status: 200 })
  } catch (error) {
    console.error('Error in GET /api/favorites:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// DELETE 요청 처리 (찜 목록에서 삭제)
export async function DELETE(req: NextRequest) {
  try {
    await connectMongoDB()

    const body = await req.json()
    const { topicId, userEmail } = body

    if (!topicId || !userEmail) {
      return NextResponse.json(
        { error: 'topicId and userEmail are required' },
        { status: 400 }
      )
    }

    const favorite = await Favorite.findOneAndDelete({
      topicId,
      userEmail,
    })

    if (!favorite) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 })
    }

    return NextResponse.json(
      { message: 'Favorite removed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in DELETE /api/favorites:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
