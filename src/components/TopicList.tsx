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
  image?: string
  price: number
  category: string
}

export default function TopicLists() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCategory, setSelectedCategory] = useState<string>('') // 선택된 카테고리
  const [priceSortOrder, setPriceSortOrder] = useState<string>('asc') // 가격 정렬 순서 (asc 또는 desc)
  const [dateSortOrder, setDateSortOrder] = useState<string>('desc') // 최신순/오래된순 정렬

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

  // 필터링 및 정렬
  const filteredTopics = topics
    .filter((topic) => {
      if (selectedCategory && topic.category !== selectedCategory) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      // 가격 순 정렬
      if (priceSortOrder === 'asc') {
        return a.price - b.price
      } else if (priceSortOrder === 'desc') {
        return b.price - a.price
      }

      // 날짜 순 정렬
      if (dateSortOrder === 'desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
    })

  if (loading) return <p>Loading topics...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className="container mx-auto my-8">
      {/* 필터 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <label htmlFor="category" className="mr-2">
            카테고리:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">전체</option>
            <option value="가전제품">가전제품</option>
            <option value="문구(완구)">문구(완구)</option>
            <option value="장난감">장난감</option>
            <option value="생필품">생필품</option>
            <option value="가구">가구</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div>
          <label htmlFor="priceSort" className="mr-2">
            가격 순:
          </label>
          <select
            id="priceSort"
            value={priceSortOrder}
            onChange={(e) => setPriceSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="asc">가격 낮은순</option>
            <option value="desc">가격 높은순</option>
          </select>
        </div>

        <div>
          <label htmlFor="dateSort" className="mr-2">
            날짜 순:
          </label>
          <select
            id="dateSort"
            value={dateSortOrder}
            onChange={(e) => setDateSortOrder(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="desc">최신순</option>
            <option value="asc">오래된순</option>
          </select>
        </div>
      </div>

      {/* 상품이 없을 때도 필터는 계속 보이도록 */}
      {filteredTopics.length === 0 ? (
        <p>등록된 상품이 없습니다...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filteredTopics.map((topic) => (
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
      )}
    </div>
  )
}
