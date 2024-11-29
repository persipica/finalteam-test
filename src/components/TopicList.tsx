'use client'

import React, { useEffect, useState } from 'react'

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
}

export default function TopicLists() {
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
        setTopics(data.topics)
      } catch (error) {
        console.error('Error loading topics: ', error)
        setError('Failed to load topics')
      } finally {
        setLoading(false)
      }
    }
    fetchTopics()
  }, [])

  if (loading) return <p>Loading topics...</p>
  if (error) return <p>Error: {error}</p>
  if (topics.length === 0) return <p>No topics found</p>

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
