import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Favorite {
  _id: string
  topicId: {
    _id: string
    title: string
    description: string
    price: number
    category: string
    image?: string
  }
}

export default function FavoritesList({ userEmail }: { userEmail: string }) {
  const [favorites, setFavorites] = useState<Favorite[]>([])

  useEffect(() => {
    if (!userEmail) return

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`/api/favorites?userEmail=${userEmail}`)
        if (!res.ok) throw new Error('Failed to fetch favorites')
        const data = await res.json()
        setFavorites(data)
      } catch (error) {
        console.error('Error fetching favorites:', error)
      }
    }

    fetchFavorites()
  }, [userEmail])

  return (
    <div>
      <h2 className="text-2xl font-semibold">찜한 상품</h2>
      {/* 찜한 상품이 없으면 메시지 표시 */}
      {favorites.length === 0 ? (
        <p className="text-gray-500 mt-4">찜한 상품이 없습니다...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {favorites.map((favorite) => (
            <div
              key={favorite._id}
              className="bg-white border border-gray-300 rounded-md shadow hover:shadow-lg p-4 transition"
            >
              <div className="relative h-48 w-full mb-4">
                <Image
                  src={favorite.topicId.image || '/default-avatar.png'} // 기본 이미지 사용
                  alt={favorite.topicId.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {favorite.topicId.title}
              </h3>
              <p className="text-sm text-gray-600 mt-2 truncate">
                {favorite.topicId.description}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {favorite.topicId.category}
              </p>
              <h3 className="text-lg font-bold text-gray-800 truncate mt-4">
                {favorite.topicId.price}원
              </h3>
              <Link href={`/detailTopic/${favorite.topicId._id}`} passHref>
                <button className="text-blue-600 mt-4">자세히 보기</button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
