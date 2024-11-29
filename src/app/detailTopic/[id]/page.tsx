'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation' // Next.js 13+ 에서 URL 매개변수를 추출
import { useSession } from 'next-auth/react' // 로그인 상태를 확인하는 예시 (next-auth 사용)
import RemoveBtn from '@/components/RemoveBtn'
import Link from 'next/link'
import { HiPencilAlt } from 'react-icons/hi'
import Image from 'next/image' // next/image 임포트

interface Topic {
  _id: string
  title: string
  description: string
  image?: string
  price: number
  userEmail: string // 상품 등록자의 이메일
}

export default function TopicDetailPage() {
  const params = useParams() // URL 매개변수를 추출
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id // id가 배열일 경우 첫 번째 값을 사용
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false) // 모달 상태
  const [modalImage, setModalImage] = useState<string | null>(null) // 모달에 표시될 이미지

  const { data: session } = useSession() // 세션에서 로그인한 사용자 정보 가져오기
  const userEmail = session?.user?.email // 로그인한 사용자의 이메일
  //const router = useRouter() // 페이지 이동을 위한 router

  useEffect(() => {
    if (!id) return

    const fetchTopic = async () => {
      try {
        const res = await fetch(`/api/topics/${id}`)
        if (!res.ok) throw new Error('Failed to fetch topic')
        const data = await res.json()
        setTopic(data)

        // 방문한 상품 정보 로컬 스토리지에 저장
        const visitedProducts = JSON.parse(
          localStorage.getItem('visitedProducts') || '[]'
        )

        // 중복 방문을 방지
        if (
          !visitedProducts.some((product: Topic) => product._id === data._id)
        ) {
          // 최대 10개까지만 저장
          if (visitedProducts.length >= 10) {
            visitedProducts.shift() // 첫 번째(오래된) 상품을 삭제
          }
          visitedProducts.push(data)
          localStorage.setItem(
            'visitedProducts',
            JSON.stringify(visitedProducts)
          )
        }
      } catch (error) {
        console.error('Error fetching topic:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopic()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!topic) return <div>상품을 찾을 수 없습니다.</div>

  // 로그인한 사용자가 상품을 등록한 사람인지 확인
  const isOwner = userEmail === topic.userEmail

  // 이미지 클릭 시 모달 열기
  const handleImageClick = (image: string) => {
    setModalImage(image)
    setIsModalOpen(true) // 모달 열기
  }

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false)
    setModalImage(null)
  }

  return (
    <div className="container mx-auto my-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-4">{topic.title}</h2>
      <div className="mb-6">
        <Image
          src={topic.image || '/default-avatar.png'}
          alt={topic.title}
          width={500} // 원하는 이미지 너비
          height={320} // 원하는 이미지 높이
          className="w-full h-80 object-cover rounded-md cursor-pointer"
          onClick={() => handleImageClick(topic.image || '/default-avatar.png')} // 이미지 클릭 시 모달 열기
        />
      </div>
      <p className="text-lg text-gray-800 mb-6">{topic.description}</p>
      <p className="text-xl font-bold text-gray-900 mb-6">{topic.price}원</p>

      <div className="flex gap-4">
        {isOwner ? (
          <>
            <Link href={`/editTopic/${topic._id}`} className="text-blue-600">
              <HiPencilAlt size={20} />
            </Link>
            <RemoveBtn id={id} />
          </>
        ) : (
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md">
            구매하기
          </button>
        )}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative w-full h-full">
            <button
              className="absolute top-0 right-0 p-4 text-white bg-red-600 rounded-full"
              onClick={closeModal} // 모달 닫기
            >
              X
            </button>
            <Image
              src={modalImage || '/default-avatar.png'}
              alt="Modal Image"
              width={1000} // 모달 이미지 크기 조정
              height={1000}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
