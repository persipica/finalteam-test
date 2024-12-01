'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react' // 로그인 상태 확인

import Link from 'next/link'

import Image from 'next/image'

interface Topic {
  _id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  image?: string // 상품 이미지를 추가할 수 있도록 필드 확장
  price: number
  userEmail: string // 상품 등록한 사용자의 이메일 추가
  category: string // 카테고리 필드 추가
}

export default function TopicLists() {
  const { data: session } = useSession() // 로그인한 사용자 정보 가져오기
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch('/api/topics')
        if (!res.ok) {
          throw new Error('Failed to fetch topics')
        }
        const data = await res.json()

        // 로그인한 사용자의 이메일만 필터링
        if (session) {
          const userTopics = data.topics.filter(
            (topic: Topic) => topic.userEmail === session.user?.email
          )
          setTopics(userTopics)
        }
      } catch (error) {
        console.error('Error loading topics: ', error)
        setError('Failed to load topics')
      } finally {
        setLoading(false)
      }
    }
    fetchTopics()
  }, [session]) // session이 변경될 때마다 실행

  if (loading) return <p>Loading topics...</p>
  if (error) return <p>Error: {error}</p>
  if (topics.length === 0)
    return <p className="text-gray-500 mt-4">등록한 상품이 없습니다...</p>

  return (
    <div className="container mx-auto my-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {topics.map((topic: Topic) => (
          <div
            key={topic._id}
            className="bg-white border border-gray-300 rounded-md shadow hover:shadow-lg p-4 transition"
          >
            {/* 이미지 표시 */}
            <div className="relative h-48 w-full mb-4">
              <Image
                src={topic.image || '/default-avatar.png'} // 기본 이미지 사용
                alt={topic.title}
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
            {/* 제목 및 설명 */}
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {topic.title}
            </h3>
            <p className="text-sm text-gray-600 mt-2 truncate">
              {topic.description}
            </p>
            {/* 카테고리 표시 */}
            <p className="text-sm text-gray-500 mt-2">{topic.category}</p>
            <h3 className="text-lg font-bold text-gray-800 truncate mt-4">
              {topic.price}원
            </h3>
            {/* 상품 상세 페이지 링크 */}
            <Link href={`/detailTopic/${topic._id}`} passHref>
              <button className="text-blue-600 mt-4">자세히 보기</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
