'use client'
import Slider from 'react-slick'
import Swal from 'sweetalert2'
import { useSearchParams } from 'next/navigation'
import { Button, Image } from '@nextui-org/react'
import { SetStateAction, useCallback, useEffect, useState } from 'react'
import { getPostDetailByID } from '@/app/services/apiService'
import { replaceIpfsUrl } from '../utils'

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

  const handleToast = () => {
    Swal.fire({
      text: 'This operation can only be performed within the App',
      showConfirmButton: false,
    })
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
      <main className="w-full flex flex-col items-center sm:items-start pt-6">
        <div className="w-full flex items-center justify-between px-6">
          <div className="flex items-center">
            <Image
              src={replaceIpfsUrl(postDetails?.userAvatar) || '/user.svg'}
              width={50}
              height={50}
              className="rounded-full"
              alt=""
            />

            <span className="text-white mx-2 max-w-24">
              {postDetails && 'userNickName' in postDetails
                ? postDetails?.userNickName
                : '~'}
            </span>
          </div>
          <Button color="danger" onPress={handleToast}>
            + Floow
          </Button>
        </div>

        <Slider {...sliderSettings} className="w-full text-red-500 mt-5">
          {postDetails &&
          'fileInfos' in postDetails &&
          postDetails?.fileInfos.length > 0 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            postDetails?.fileInfos.map((slide: any, index: number) => (
              <Image
                src={replaceIpfsUrl(slide.thumbnail) || ''}
                key={index}
                width={'100%'}
                height={350}
                alt=""
              />
            ))
          ) : (
            <div>No Data</div>
          )}
        </Slider>

        <div className="text-[#F31260] w-full text-[18px] line-clamp-4 px-3 mt-4">
          {postDetails && 'context' in postDetails ? postDetails?.context : '~'}
        </div>
        <p className="w-full text-left px-3 mt-3 text-white text-[14px]">
          {postDetails && 'updateTime' in postDetails
            ? postDetails?.updateTime
            : '~'}
        </p>

        <div className="mt-8 flex w-full justify-between px-3">
          <div
            className="text-white flex items-center space-x-1"
            onClick={handleToast}
          >
            <img src="/like.svg" className="w-10 cursor-pointer" alt="" />
            <span>
              {postDetails && 'liked' in postDetails ? postDetails?.liked : 0}
            </span>
          </div>
          <Button
            color="danger"
            onPress={() =>
              Swal.fire({
                title: 'Coming Soon...',
                showConfirmButton: false,
              })
            }
          >
            Download App
          </Button>
          <div
            className="text-white flex items-center space-x-1"
            onClick={handleToast}
          >
            <span>
              {postDetails && 'favorites' in postDetails
                ? postDetails?.favorites
                : 0}
            </span>
            <img src="/love.svg" className="w-10 cursor-pointer" alt="" />
          </div>
        </div>
      </main>
    </div>
  )
}
