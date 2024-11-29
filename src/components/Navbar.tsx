'use client'

import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  const { status, data: session } = useSession()

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' }) // 로그아웃 후 메인 화면으로 리다이렉트
  }

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center bg-blue-500 px-8 py-4 shadow gap-4">
      {/* Logo */}
      <Link href="/" className="text-white text-lg font-bold">
        Secondhand Trading
      </Link>

      {/* Search Bar */}
      <div className="flex-grow max-w-md w-full">
        <input
          type="text"
          placeholder="Search for products..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Navigation Links */}
      <ul className="flex gap-4 items-center">
        <li>
          <Link href="/categories" className="text-white hover:underline">
            Categories
          </Link>
        </li>
      </ul>

      {/* User Actions */}
      <div className="flex gap-4 items-center">
        {status === 'authenticated' ? (
          <>
            {/* Product Add Button */}{' '}
            <li>
              <Link href="/dashboard" className="text-white hover:underline">
                My Page
              </Link>
            </li>
            <Link
              href="/addTopic"
              className="bg-yellow-300 hover:bg-yellow-400 text-black px-4 py-2 rounded-md text-lg font-bold"
            >
              상품 등록
            </Link>
            {/* User Info */}
            <div className="flex gap-2 items-center">
              <Image
                src={session?.user?.image ?? '/default-avatar.png'}
                width={40}
                height={40}
                alt={session?.user?.name ?? 'user'}
                className="rounded-full"
              />
              <span className="text-white font-bold">
                {session?.user?.name}
              </span>
            </div>
            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-lg font-bold"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-lg font-bold"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
