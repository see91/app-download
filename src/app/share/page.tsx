'use client'
import Swal from 'sweetalert2'
import Slider from 'react-slick'
import copy from 'copy-to-clipboard'
import { Image } from '@nextui-org/react'
import { replaceIpfsUrl } from '../utils'
import { useSearchParams } from 'next/navigation'
import { getPostDetailByID } from '@/app/services/apiService'
import { SetStateAction, useCallback, useEffect, useState } from 'react'

const medias = [
  {
    name: 'Copy Link',
    icon: '/copy_2.svg',
  },
  {
    name: 'Twitter/X',
    link: 'https://x.com/_creamstream',
    icon: '/x.svg',
  },
  {
    name: 'Telegram',
    link: 'https://t.me/creamstream_io',
    icon: '/tg.svg',
  },
]

export default function Share() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const postID: string | number = useSearchParams().get('post_id') ?? ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [postDetails, setPostDetails] = useState<any>(null)

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    beforeChange: (_: SetStateAction<number>, next: SetStateAction<number>) =>
      setCurrentSlide(next),
    customPaging: (i: number) => (
      <div
        className="w-3 h-3 rounded-full -mt-5"
        style={{
          backgroundColor: currentSlide === i ? '#F31260' : 'gray',
        }}
      />
    ),
  }

  const handleClickMedia = (link: string | undefined) => {
    if (!link) {
      try {
        copy(window.location.href)
        Swal.fire({
          icon: 'success',
          title: 'Copy Success !',
          showConfirmButton: false,
        })
      } catch (error) {
        console.error(error)
      }
    } else {
      window.open(link, '_blank')
    }
  }

  const _fetch = useCallback(async () => {
    if (!postID) {
      Swal.fire({
        icon: 'error',
        text: 'Post ID is missing, please try again later',
      }).finally(() => self.close())
    } else {
      const { success, data, message } = await getPostDetailByID({ postID })
      if (success) {
        setPostDetails(data)
      } else {
        Swal.fire({
          icon: 'error',
          text: message,
        })
      }
    }
  }, [postID])

  useEffect(() => {
    _fetch()
  }, [_fetch])

  return (
    <div className="items-center justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-geist-sans)] bg-hb-pattern-mobile bg-no-repeat bg-cover">
      <main className="w-full flex flex-col items-center sm:items-start pt-6 px-6">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center w-full">
            <Image
              src={replaceIpfsUrl(postDetails?.userAvatar) || '/user.svg'}
              width={50}
              height={50}
              className="rounded-full"
              alt=""
            />

            <div className="mx-2 w-[calc(100%-70px)]">
              <p className="overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-sans font-extrabold leading-[145%] text-neutral-100">
                {postDetails?.userNickName || '~'}
              </p>
              <p className="text-[12px] font-medium leading-[145%] text-neutral-500 font-sans">
                {postDetails?.updateTime}
              </p>
            </div>
          </div>
        </div>

        <div className="text-neutral-100 w-full text-[18px] leading-[145%] font-medium line-clamp-4 mt-4 border-neutral-100 break-words">
          {postDetails?.context || '~'}
        </div>

        <Slider {...sliderSettings} className="w-full text-red-500 mt-5">
          {postDetails &&
          'fileInfos' in postDetails &&
          postDetails?.fileInfos.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            postDetails?.fileInfos.map((slide: any, index: number) => (
              <Image
                src={replaceIpfsUrl(slide.thumbnail) || ''}
                className="object-cover"
                key={index}
                width={'100%'}
                height={350}
                alt=""
              />
            ))
          ) : (
            <div className="text-center mt-9">No Data</div>
          )}
        </Slider>

        <button
          className="flex items-center btn-shadow w-fit my-4 bg-UI-Color-Indigo-200 px-[32px] py-[16px] rounded-full text-[18px] text-center font-semibold leading-[100%] text-neutral-100 font-sans fixed bottom-5"
          onClick={() => window.open('https://app.creamstream.io/', '_blank')}
        >
          Download App
        </button>

        <div className="border-t-1 border-[#52353C] w-full grid grid-cols-3 gap-4 pt-10 mt-10">
          {medias.map((x, index) => (
            <div
              className="flex flex-col items-center justify-center px-4 py-7 rounded-[8px] border-2 border-indigo-100 bg-[rgba(255,254,252,0.01)] shadow-[inset_3px_3px_4px_0px_#DCD9FD,inset_-3px_-3px_4px_0px_#7E7D91] text-center text-[18px] font-semibold leading-[100%] text-indigo-100 font-sans"
              key={index}
              onClick={handleClickMedia.bind('', x.link)}
            >
              <Image
                src={x.icon}
                width={32}
                height={32}
                alt=""
                className="mb-4 rounded-none"
              />
              <span className="mt-2 whitespace-nowrap">{x.name}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
