'use client'

import Image from 'next/image'
import { Portfolio } from '@/app/types/portfolio'

type IntroductionScreenProps = {
  portfolio: Portfolio
  onStart: () => void
}

export const IntroductionScreen = ({ portfolio, onStart }: IntroductionScreenProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black text-white z-10">
      <div className="max-w-2xl mx-auto p-8 text-center space-y-6">
        {portfolio.owner.image && (
          <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden">
            <Image
              src={portfolio.owner.image}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        )}
        <h1 className="text-4xl font-bold">Welcome to My Portfolio</h1>
        {portfolio.aboutMe && (
          <p className="text-xl text-gray-300">{portfolio.aboutMe}</p>
        )}
        <div className="flex justify-center space-x-4">
          {portfolio.github && (
            <a
              href={portfolio.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              GitHub
            </a>
          )}
          {portfolio.linkedin && (
            <a
              href={portfolio.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300"
            >
              LinkedIn
            </a>
          )}
        </div>
        <button
          onClick={onStart}
          className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Explore My Projects
        </button>
      </div>
    </div>
  )
}