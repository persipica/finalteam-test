'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import RemoveBtn from '@/components/RemoveBtn'
import Link from 'next/link'
import { HiPencilAlt } from 'react-icons/hi'
import Image from 'next/image'

interface Topic {
  _id: string
  title: string
  description: string
  image?: string
  price: number
  userEmail: string
  category: string
}

interface Comment {
  _id: string
  userEmail: string
  content: string
  createdAt: string
  isSeller: string
}

export default function TopicDetailPage() {
  const params = useParams()
  const id = Array.isArray(params?.id) ? params?.id[0] : params?.id
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  const { data: session } = useSession()
  const userEmail = session?.user?.email

  useEffect(() => {
    if (!id) return

    const fetchTopic = async () => {
      try {
        const res = await fetch(`/api/topics/${id}`)
        if (!res.ok) throw new Error('Failed to fetch topic')
        const data = await res.json()
        setTopic(data)

        // 댓글 불러오기
        const commentRes = await fetch(`/api/comments?topicId=${id}`)
        if (!commentRes.ok) throw new Error('Failed to fetch comments')
        const { comments, sellerEmail } = await commentRes.json() // 판매자 이메일도 가져옴
        setComments(
          comments.map((comment: Comment) => ({
            ...comment,
            isSeller: comment.userEmail === sellerEmail, // 댓글 작성자가 판매자인지 확인
          }))
        )

        // 찜한 상품 여부 확인
        const favoritesRes = await fetch(
          `/api/favorites?userEmail=${userEmail}`
        )
        if (!favoritesRes.ok) throw new Error('Failed to fetch favorites')
        const favorites = await favoritesRes.json()
        const isProductFavorited = favorites.some(
          (favorite: { topicId: { _id: string } }) =>
            favorite.topicId._id === data._id
        )
        setIsFavorite(isProductFavorited)

        // 방문한 상품 정보 로컬 스토리지에 저장
        const visitedProducts = JSON.parse(
          localStorage.getItem('visitedProducts') || '[]'
        )

        if (
          !visitedProducts.some((product: Topic) => product._id === data._id)
        ) {
          if (visitedProducts.length >= 10) {
            visitedProducts.shift()
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
  }, [id, userEmail])

  const handleImageClick = (image: string) => {
    setModalImage(image)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalImage(null)
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value)
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return

    const newCommentData = {
      content: newComment,
      userEmail,
      topicId: topic?._id,
    }

    try {
      let res
      if (editingCommentId) {
        res = await fetch(`/api/comments/${editingCommentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCommentData),
        })
      } else {
        res = await fetch('/api/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newCommentData),
        })
      }

      if (res.ok) {
        const data = await res.json()
        setComments((prev) => {
          if (editingCommentId) {
            return prev.map((comment) =>
              comment._id === editingCommentId ? data : comment
            )
          }
          return [data, ...prev]
        })
        setNewComment('')
        setEditingCommentId(null)
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    }
  }

  const handleCommentEdit = (commentId: string) => {
    const commentToEdit = comments.find((c) => c._id === commentId)
    if (commentToEdit) {
      setNewComment(commentToEdit.content)
      setEditingCommentId(commentId)
    }
  }

  const handleCommentDelete = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId))
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const handleAddToFavorites = async () => {
    if (!userEmail || !topic) return

    try {
      const method = isFavorite ? 'DELETE' : 'POST'
      const res = await fetch('/api/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topicId: topic._id, userEmail }),
      })

      if (res.ok) {
        setIsFavorite(!isFavorite)
        alert(
          isFavorite
            ? '찜 목록에서 삭제되었습니다!'
            : '찜 목록에 추가되었습니다!'
        )
      } else {
        throw new Error('Failed to update favorite')
      }
    } catch (error) {
      console.error('Error updating favorite:', error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!topic) return <div>상품을 찾을 수 없습니다.</div>

  const isOwner = userEmail === topic.userEmail

  return (
    <div className="container mx-auto my-8 max-w-4xl">
      <h2 className="text-3xl font-bold mb-4">{topic.title}</h2>
      <p className="text-sm text-gray-500 mb-4">
        카테고리: <span className="font-semibold">{topic.category}</span>
      </p>

      <div className="mb-6">
        <Image
          src={topic.image || '/default-avatar.png'}
          alt={topic.title}
          width={500}
          height={320}
          className="w-full h-80 object-cover rounded-md cursor-pointer"
          onClick={() => handleImageClick(topic.image || '/default-avatar.png')}
        />
      </div>
      <p className="text-lg text-gray-800 mb-6">{topic.description}</p>
      <p className="text-xl font-bold text-gray-900 mb-6">{topic.price}원</p>

      <div className="flex gap-4">
        {!isOwner ? (
          <>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
              onClick={() => alert('구매하기 기능')}
            >
              구매하기
            </button>
            <button
              className={`py-2 px-4 rounded-md ${
                isFavorite ? 'bg-red-600' : 'bg-gray-600'
              } text-white`}
              onClick={handleAddToFavorites}
            >
              {isFavorite ? '찜 목록에서 삭제' : '찜하기'}
            </button>
          </>
        ) : (
          <>
            <Link href={`/editTopic/${topic._id}`} className="text-blue-600">
              <HiPencilAlt size={20} />
            </Link>
            <RemoveBtn id={id} />
          </>
        )}
      </div>

      {/* 댓글 영역 */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">댓글</h3>
        <div className="space-y-4 max-h-64 overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment._id} className="border-b pb-2">
              <p className="text-gray-800">{comment.content}</p>
              <p className="text-sm text-gray-500">
                {comment.userEmail}
                {comment.isSeller && (
                  <span className="text-blue-500 ml-2">[판매자]</span>
                )}
              </p>
              {comment.userEmail === userEmail && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleCommentEdit(comment._id)}
                    className="text-blue-600"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleCommentDelete(comment._id)}
                    className="text-red-600"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 댓글 작성 */}
        <textarea
          value={newComment}
          onChange={handleCommentChange}
          placeholder="댓글을 작성하세요"
          rows={3}
          className="w-full border p-2 rounded-md mt-4"
        />
        <button
          onClick={handleCommentSubmit}
          className="bg-blue-600 text-white py-2 px-4 rounded-md mt-2"
        >
          댓글 {editingCommentId ? '수정' : '작성'}
        </button>
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative w-full h-full">
            <button
              className="absolute top-0 right-0 p-4 text-white bg-red-600 rounded-full"
              onClick={closeModal}
            >
              X
            </button>
            <Image
              src={modalImage || '/default-avatar.png'}
              alt="Modal Image"
              width={1000}
              height={1000}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
