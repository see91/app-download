'use client'
import { Suspense } from 'react'
import Image from 'next/image'

const menus = [
  {
    text: 'Twitter',
    icon: '/x.svg',
    link: 'https://x.com/_creamstream',
  },
  {
    text: 'Medium',
    icon: '/medium.svg',
    link: 'https://medium.com/@_creamstream',
  },
]

export default function Home() {
  const _clickMenu = (link: string) => {
    window.open(link, '_blank')
  }

  return (
    <Suspense fallback={null}>
      <div className="items-center justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-geist-sans)] bg-hb-pattern-mobile bg-no-repeat bg-cover">
        <main className="w-full flex flex-col items-center sm:items-start">
          <div className="w-full px-3 grid grid-cols-3 gap-1 m-header min-h-16 items-center text-center">
            {/* <div className="bg-back flex w-6 h-6" /> */}
            <div />
            <div className="m-title text-UI-Color-Neutral-100 text-[18px] font-extrabold">
              Contact Us
            </div>
            <div />
          </div>

          <ul className="w-full grid grid-cols-3 gap-8 text-UI-Color-Neutral-100 text-[16px] font-semibold mt-4 p-4">
            {menus.map((x) => (
              <li
                className="flex flex-col justify-center items-center p-3 rounded-xl border-white border-y-2"
                onClick={_clickMenu.bind(this, x.link)}
                key={x.text}
              >
                <Image
                  className="dark:invert"
                  src={x.icon}
                  alt="icon"
                  width={30}
                  height={30}
                  priority
                />
                <span className="truncate mt-2">{x.text}</span>
              </li>
            ))}
          </ul>
        </main>
      </div>
    </Suspense>
  )
}
