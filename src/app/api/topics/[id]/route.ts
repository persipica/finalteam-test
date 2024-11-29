/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextRequest, NextResponse } from 'next/server'
import Topic from '@/models/topic'
import fs from 'fs'
import path from 'path'

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const topic = await Topic.findById(params.id)
    if (!topic) {
      return NextResponse.json(
        { message: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }
    return NextResponse.json(topic) // 상품 정보를 JSON으로 반환
  } catch (error) {
    console.error()
    return NextResponse.json(
      { message: '상품 정보 조회 중 오류 발생' },
      { status: 500 }
    )
  }
}

export const PUT = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const formData = await req.formData() // FormData로 요청 데이터 받기

    const title = formData.get('title')?.toString()
    const description = formData.get('description')?.toString()
    const price = formData.get('price')
      ? Number(formData.get('price'))
      : undefined
    const newImage = formData.get('newImage') as File | null
    const oldImage = formData.get('oldImage')?.toString()

    const updatedData: any = { title, description, price }

    // 새 이미지를 업로드할 경우
    if (newImage) {
      // 기존 이미지를 삭제
      if (oldImage) {
        const oldImagePath = path.join(
          process.cwd(),
          'public',
          'uploads',
          oldImage
        )
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath)
        }
      }

      // 새 이미지 저장
      const newImagePath = path.join(
        process.cwd(),
        'public',
        'uploads',
        newImage.name
      )
      const buffer = Buffer.from(await newImage.arrayBuffer())
      fs.writeFileSync(newImagePath, buffer)

      // 절대 경로로 저장
      updatedData.image = `/uploads/${newImage.name}` // 클라이언트에서 접근할 경로
    }

    // 상품 수정
    const topic = await Topic.findByIdAndUpdate(params.id, updatedData, {
      new: true, // 수정된 데이터를 반환
    })

    if (!topic) {
      return NextResponse.json(
        { message: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json(topic) // 수정된 상품 정보를 반환
  } catch (error) {
    console.error('상품 수정 중 오류 발생:', error)
    return NextResponse.json(
      { message: '상품 수정 중 오류 발생' },
      { status: 500 }
    )
  }
}
