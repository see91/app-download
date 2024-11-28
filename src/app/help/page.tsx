'use client'
import { Suspense } from 'react'
import Swal from 'sweetalert2'

const menus = [
  {
    text: '如何注册?',
  },
  {
    text: '如何设置订阅费?',
  },
  {
    text: '订阅付费流程?',
  },
]

export default function Home() {
  const _clickMenu = () => {
    Swal.fire({
      title: 'Coming Soon...',
    })
  }

  return (
    <Suspense fallback={null}>
      <div className="items-center justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-geist-sans)] bg-hb-pattern-mobile bg-no-repeat bg-cover">
        <main className="w-full flex flex-col items-center sm:items-start">
          <div className="w-full px-3 grid grid-cols-3 gap-1 m-header min-h-16 items-center text-center">
            <div className="bg-back flex w-6 h-6" />
            <div className="m-title text-UI-Color-Neutral-100 text-[18px] font-extrabold">
              帮助中心
            </div>
            <div />
          </div>

          <ul className="w-full text-UI-Color-Neutral-100 text-[16px] font-semibold">
            {menus.map((x) => (
              <li
                className="flex justify-between px-5 py-2 border-b-2 my-3"
                onClick={_clickMenu}
              >
                <span className="truncate">{x.text}</span>
                <span className="w-5 h-5 min-w-5 bg-back rotate-180" />
              </li>
            ))}
          </ul>
        </main>
      </div>
    </Suspense>
  )
}
