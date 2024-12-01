'use client'

import { useSession } from 'next-auth/react'

import UserTopicList from '@/components/UserTopicList'
import FavoritesList from '@/components/FavoritesList'

export default function DashboardPage() {
  const { data: session } = useSession()

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

      <div className="mb-8">
        <FavoritesList userEmail={session.user?.email!} />
      </div>
    </div>
  )
}
