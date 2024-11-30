'use client'

import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function AddTopicPage() {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session) {
    redirect('/login') // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  }

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | string>('') // 상품 가격 상태
  const [image, setImage] = useState<File | null>(null)
  const [category, setCategory] = useState('') // 카테고리 상태
  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImage(file)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // 유효성 검사
    if (!title || !description || !price || !image || !category) {
      alert('상품명, 가격, 설명, 이미지, 카테고리가 모두 필요합니다.')
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('price', price.toString()) // 가격은 문자열로 저장
    formData.append('image', image)
    formData.append('category', category) // 카테고리 추가

    // 로그인한 사용자의 이메일을 함께 추가
    const userEmail = session?.user?.email || ''
    formData.append('userEmail', userEmail)

    // 디버깅: FormData에 어떤 값들이 들어가 있는지 확인
    console.log('FormData userEmail:', userEmail)
    console.log('FormData category:', category)

    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        body: formData, // FormData를 전송
      })

      if (res.ok) {
        router.push('/') // 상품 등록 후 홈으로 리다이렉트
      } else {
        throw new Error('상품 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto my-8 max-w-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">상품 등록</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {/* 상품명 */}
        <input
          className="border border-slate-300 p-3 rounded-md"
          type="text"
          placeholder="상품명"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
        />

        {/* 상품 설명 */}
        <textarea
          className="border border-slate-300 p-3 h-32 rounded-md"
          placeholder="상세 설명"
          value={description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setDescription(e.target.value)
          }
        />

        {/* 상품 가격 */}
        <input
          className="border border-slate-300 p-3 rounded-md"
          type="number"
          placeholder="상품 가격"
          value={price}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setPrice(e.target.value)
          }
        />

        {/* 카테고리 선택 */}
        <select
          className="border border-slate-300 p-3 rounded-md"
          value={category}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setCategory(e.target.value)
          }
        >
          <option value="">카테고리 선택</option>
          <option value="가전제품">가전제품</option>
          <option value="문구(완구)">문구(완구)</option>
          <option value="장난감">장난감</option>
          <option value="생필품">생필품</option>
          <option value="가구">가구</option>
          <option value="기타">기타</option>
        </select>

        {/* 상품 이미지 업로드 */}
        <div>
          <label
            htmlFor="image"
            className="block mb-2 font-bold text-slate-600"
          >
            상품 이미지 업로드
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
          />
        </div>

        {/* 등록 버튼 */}
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md"
          type="submit"
          disabled={loading}
        >
          {loading ? '등록 중...' : '상품 등록'}
        </button>
      </form>
    </div>
  )
}
