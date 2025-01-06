'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Textarea,
  Input,
  Button,
  Image,
  Spinner,
  Pagination,
} from '@nextui-org/react'
import Swal from 'sweetalert2'
import { useSearchParams } from 'next/navigation'
import {
  uploadImages,
  createQuestion,
  getProblemFeedback,
  Response,
  QuestionListItem,
  QuestionListResponse,
} from '@/app/services/apiService'
import { replaceIpfsUrl } from '../utils'

enum Status {
  Waiting = 0,
  Replied = 1,
}

const renderQuestion = (
  dataList:
    | string[]
    | { [key: string]: string[] }
    | QuestionListResponse
    | { records: QuestionListItem[] }
    | null
    | undefined
) =>
  dataList && 'records' in dataList && dataList.records.length > 0 ? (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataList?.records.map((x: any, index: number) => (
      <li key={index} className="bg-[#4A0323] px-2 py-2 rounded-xl">
        <div className="flex justify-between">
          <p className="line-clamp-3">{x.context}</p>
          <span className="whitespace-nowrap ml-4 text-red-500 font-bold">
            {Status[x.status]}
          </span>
        </div>
        <Image
          src={replaceIpfsUrl(x.image)}
          alt=""
          className="w-20 h-20 rounded-lg my-2"
        />
        <p>{x.createTime}</p>
        {x.status === Status.Replied && x.responseContext && (
          <div className="border-2 px-2 py-1 rounded-md mt-5">
            <span>Reply: </span>
            <span>{x.responseContext}</span>
          </div>
        )}
      </li>
    ))
  ) : (
    <li className="text-black text-center font-extrabold">No Data</li>
  )

export default function Home() {
  const pageSize = 10
  const userAddress: string = useSearchParams().get('user_address') ?? ''
  const [questionContent, setQuestionContent] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<Array<string>>([])
  const [waitingList, setWaitingList] = useState<Response['data'] | null>()
  const [repliedList, setRepliedList] = useState<Response['data'] | null>()
  const [currentPage, setCurrentPage] = useState<number>(1)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files

    if (!fileList) {
      console.warn('No files selected')
      return
    }

    const files = Array.from(fileList) as File[]
    setSelectedFiles(files)

    const urls = files.map((file: File) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const handleUpload = async (): Promise<string[] | undefined> => {
    if (selectedFiles.length <= 0) {
      Swal.fire({
        icon: 'warning',
        text: 'Please select a picture to upload!',
      })
      return
    }

    // The stingray
    const formData: FormData = new FormData()
    formData.append('file', selectedFiles[0])
    const res: Response = await uploadImages(formData)
    if (!res.success) {
      Swal.fire({
        icon: 'warning',
        text: 'Please select a picture to upload!',
      })
      return
    }

    if (Array.isArray(res.data)) {
      return res.data
    }

    return
    // return selectedFiles.map((file: any) => {
    //   console.log(`${file.name}`, file)
    //   return ['','']
    // })
  }

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles]
    updatedFiles.splice(index, 1)
    setSelectedFiles(updatedFiles)

    const updatedUrls = [...previewUrls]
    updatedUrls.splice(index, 1)
    setPreviewUrls(updatedUrls)
  }

  const handleSubmit = async () => {
    if (!questionContent) {
      Swal.fire({
        icon: 'warning',
        text: 'Please enter a description of the problem.',
      })
      return
    }
    const imgRes: string[] | undefined = await handleUpload()

    try {
      const res = await createQuestion({
        userAddress: userAddress,
        context: questionContent,
        image: imgRes ? imgRes[0] : '',
      })
      if (!res.success) {
        Swal.fire({
          icon: 'error',
          text: res.message,
        })
        return
      } else {
        Swal.fire({
          icon: 'success',
          text: 'Submit successfully',
        }).finally(() => {
          setQuestionContent('')
          setSelectedFiles([])
          setPreviewUrls([])
        })
      }
    } catch {
      Swal.fire({
        icon: 'error',
        text: 'Some Error,Please try again later!',
      })
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  type TabKeyFunction = () => Promise<void>
  const handleChangeTab = (tabKey: string | number) => {
    setCurrentPage(1)
    _fetchData(tabKey)
  }

  const handleChangePage = (tabKey: string | number, page: number) => {
    setCurrentPage(page)
    _fetchData(tabKey, page)
  }

  const _fetchData = async (
    tabKey: string | number,
    pageNumber: number = 1
  ) => {
    const tabKeys: Record<string, TabKeyFunction> = {
      waiting: async () => {
        const { success, data, message } = await getProblemFeedback({
          userAddress,
          pageNumber,
        })
        if (success) {
          setWaitingList(data)
        } else {
          Swal.fire({
            icon: 'error',
            text: message,
          })
        }
      },
      replied: async () => {
        const { success, data, message } = await getProblemFeedback({
          userAddress,
          status: 1,
          pageNumber,
        })
        if (success) {
          setRepliedList(data)
        } else {
          Swal.fire({
            icon: 'error',
            text: message,
          })
        }
      },
    }

    if (tabKeys[tabKey]) {
      setLoading(true)
      await tabKeys[tabKey]()
      setLoading(false)
    }
  }

  const _fetch = useCallback(async () => {
    if (!userAddress) {
      Swal.fire({
        icon: 'error',
        text: 'User address is missing, please try again later',
      }).finally(() => self.close())
    }
  }, [userAddress])

  useEffect(() => {
    _fetch()
  }, [_fetch, waitingList, repliedList])

  return (
    <>
      <div className="items-center justify-items-center min-h-screen sm:p-20 font-[family-name:var(--font-geist-sans)] bg-hb-pattern-mobile bg-no-repeat bg-cover">
        <main className="w-full flex flex-col items-center sm:items-start">
          <div className="w-full px-3 grid grid-cols-3 gap-1 m-header min-h-16 items-center text-center">
            {/* <div className="bg-back flex w-6 h-6" /> */}
            <div />
            <div className="m-title text-UI-Color-Neutral-100 text-[18px] font-extrabold">
              FeedBack
            </div>
            <div />
          </div>

          <div>
            <Tabs
              aria-label="Options"
              className="w-full flex justify-center"
              onSelectionChange={handleChangeTab}
            >
              <Tab key="submit" title="Submit a question">
                <Card>
                  <CardBody>
                    <Textarea
                      isRequired
                      label="Problem Description"
                      placeholder="Input content"
                      value={questionContent}
                      labelPlacement="outside"
                      onChange={(e) => setQuestionContent(e.target.value)}
                    />
                    <Input
                      type="file"
                      // multiple
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex flex-wrap gap-3 my-5">
                      {previewUrls.map((url: string, index: number) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 rounded-lg overflow-hidden"
                        >
                          <Image
                            src={replaceIpfsUrl(url)}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            color="danger"
                            size="sm"
                            className="absolute top-1 right-1 p-0 min-w-5 h-5 rounded-3xl"
                            onPress={() => handleRemoveFile(index)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                      <div
                        className="w-24 h-24 border-2 border-[#cccccc] flex items-center justify-center cursor-pointer rounded-lg text-[30px]"
                        onClick={triggerFileInput}
                      >
                        +
                      </div>
                    </div>
                    <Button
                      className="bg-[#52353C] text-white"
                      onPress={handleSubmit}
                    >
                      Submit
                    </Button>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="waiting" title="Waiting for reply">
                <Card>
                  <CardBody>
                    <ul className="space-y-5 text-white">
                      {renderQuestion(waitingList)}
                    </ul>
                    <Pagination
                      page={currentPage}
                      total={
                        waitingList && 'total' in waitingList
                          ? Math.ceil((waitingList?.total as number) / pageSize)
                          : 1
                      }
                      color="danger"
                      showShadow
                      onChange={handleChangePage.bind('', 'waiting')}
                      className="self-center my-3"
                    />
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="replied" title="Replied">
                <Card>
                  <CardBody>
                    <ul className="space-y-5 text-white">
                      {renderQuestion(repliedList)}
                    </ul>
                    <Pagination
                      page={currentPage}
                      total={
                        repliedList && 'total' in repliedList
                          ? Math.ceil((repliedList?.total as number) / pageSize)
                          : 0
                      }
                      color="danger"
                      onChange={handleChangePage.bind('', 'replied')}
                      className="self-center my-3"
                    />
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </main>
      </div>
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center w-screen h-screen bg-[rgba(0,0,0,0.8)] z-50">
          <Spinner size="lg" />
        </div>
      )}
    </>
  )
}
