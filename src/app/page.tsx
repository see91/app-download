'use client'
import { Suspense } from 'react'
import Image from 'next/image'
import { ellipsisFormat } from './utils'
import copy from 'copy-to-clipboard'
import Swal from 'sweetalert2'
import { useSearchParams } from 'next/navigation'

const uls = [
  {
    icon: 'bg-ul-1',
    text: 'Make new friends',
  },
  {
    icon: 'bg-ul-2',
    text: 'Share updates',
  },
  {
    icon: 'bg-ul-3',
    text: 'Earn money',
  },
]

const ReferrerInfo = () => {
  const address: string = useSearchParams().get('referrer_address') ?? ''

  const _copy = () => {
    try {
      copy(address)
      Swal.fire({
        icon: 'success',
        title: 'Copy Success !',
        showConfirmButton: false,
      })
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div
      className="w-full text-[#FFFEFC] font-[Albert Sans] text-base"
      style={{}}
    >
      <h2 className="font-semibold">Referrer’s Address:</h2>
      <div className="flex w-full max-w-full overflow-hidden items-center justify-between">
        <span className="w-52 middle-truncate">{ellipsisFormat(address)}</span>
        <div className="w-28 h-10 bg-copy bg-no-repeat" onClick={_copy} />
      </div>
    </div>
  )
}

export default function Home() {
  const _download = () => {
    Swal.fire({
      title: 'Coming Soon...',
      showConfirmButton: false,
    })
  }

  return (
    <Suspense fallback={null}>
      <div className="px-[18px] items-center justify-items-center min-h-screen py-9 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-hb-pattern-mobile bg-no-repeat bg-cover">
        <main className="flex flex-col gap-8 items-center sm:items-start">
          <Image
            className="dark:invert"
            src="/creamstream.svg"
            alt="Cream Stream Logo"
            width={254}
            height={138}
            priority
          />

          <ul className="grid grid-cols-3 gap-2">
            {uls.map((x) => (
              <li className="p-[14px] bg-[#52353C] rounded-lg" key={x.text}>
                <i
                  className={`flex w-full h-16 ${x.icon} bg-no-repeat bg-center`}
                />
                <span className="flex mt-2 text-[#FBEDE0] text-center font-[Albert Sans] text-base font-medium">
                  {x.text}
                </span>
              </li>
            ))}
          </ul>

          <ReferrerInfo />

          <div className="flex items-start p-2 rounded-lg bg-[#191012]">
            <Image
              className="dark:invert"
              src="/tip.svg"
              alt="Tip"
              width={20}
              height={20}
              priority
            />
            <span className="text-[#FFFEFC] font-extrabold font-[Albert Sans] ml-2">
              Copy the Referrer’s Address carefully. You will need this when you
              sign up for your account.
            </span>
          </div>

          <div className="flex flex-col items-center">
            <button
              className="flex items-center btn-shadow w-fit my-4 bg-UI-Color-Indigo-200 px-[32px] py-[16px] rounded-full text-UI-Color-Neutral-100 text-[18px] font-extrabold"
              onClick={_download}
            >
              <Image
                className="mr-[12px]"
                src="/ios.svg"
                priority
                alt=""
                width={18}
                height={18}
              />
              Download for IOS
            </button>

            <button
              className="flex items-center btn-shadow w-fit my-4 bg-UI-Color-Indigo-200 px-[32px] py-[16px] rounded-full text-UI-Color-Neutral-100 text-[18px] font-extrabold"
              onClick={_download}
            >
              <Image
                className="mr-[12px]"
                src="/android.svg"
                priority
                alt=""
                width={18}
                height={18}
              />
              Download for Android
            </button>
          </div>
        </main>
      </div>
    </Suspense>
  )
}
