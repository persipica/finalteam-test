import Image from 'next/image'
import TopicList from '@/components/TopicList'

export default function Home() {
  return (
    <div>
      {/* 배너 섹션 */}
      <div className="bg-gray-200">
        <div className="container mx-auto py-8">
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4">CARE Week</h2>
            <p className="text-lg text-gray-700 mb-6">
              단 2주, 하이엔드급 혜택
            </p>
            <div className="relative w-full max-w-4xl h-64">
              <Image
                src="/banner-image.jpg" // 배너 이미지를 프로젝트 public 폴더에 넣고 경로 지정
                alt="Promotional Banner"
                layout="fill"
                objectFit="cover"
                className="rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <TopicList />

      {/* Footer */}
      <footer className="bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Secondhand Trading. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
