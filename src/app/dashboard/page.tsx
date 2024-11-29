'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import UserTopicList from '@/components/UserTopicList'

interface Topic {
  _id: string
  title: string
  description: string
  price: number
  image?: string
  userEmail: string // 상품 등록한 사용자의 이메일
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [userProducts, setUserProducts] = useState<Topic[]>([])

  // 내가 등록한 상품 가져오기
  useEffect(() => {
    if (session) {
      const fetchUserProducts = async () => {
        const res = await fetch('/api/topics') // 서버에서 등록된 상품 목록 가져오기
        const data = await res.json()

        // data가 배열인지 확인
        if (Array.isArray(data)) {
          // 현재 로그인한 사용자 이메일과 일치하는 상품만 필터링
          const filteredProducts = data.filter(
            (product: Topic) => product.userEmail === session.user?.email
          )
          setUserProducts(filteredProducts) // 필터링된 상품 목록 상태에 저장
        } else {
          console.error('Received data is not an array:', data)
        }
      }

      fetchUserProducts()
    }
  }, [session])

  if (!session) return <div>Loading...</div>

  return (
    <div className="container mx-auto my-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">마이 페이지</h1>

      {/* 사용자 정보 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">내 정보</h2>
        <p className="mt-2">이름: {session.user?.name}</p>
        <p className="mt-2">이메일: {session.user?.email}</p>
      </div>

      {/* 내가 등록한 상품 */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">내가 등록한 상품</h2>
        <UserTopicList />
      </div>
    </div>
  )
}
