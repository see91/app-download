'use client'
import { useState, useRef, useEffect } from 'react'
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Textarea,
  Input,
  Button,
} from '@nextui-org/react'
import Swal from 'sweetalert2'
import { Response } from '@/app/services/apiService'
import { useSearchParams } from 'next/navigation'
import { uploadImages, createQuestion } from '@/app/services/apiService'

export default function Home() {
  const userAddress: string = useSearchParams().get('user_address') ?? ''
  const [questionContent, setQuestionContent] = useState('')

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<Array<string>>([])
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

  const _fetch = async () => {
    if (!userAddress) {
      Swal.fire({
        icon: 'error',
        text: 'User address is missing, please try again later',
      }).finally(() => self.close())
    }
  }

  useEffect(() => {
    _fetch()
  }, [userAddress, _fetch])

  return (
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

          <div className="">
            <Tabs aria-label="Options" className="w-full flex justify-center">
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
                          <img
                            src={url}
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
                    <ul>
                      <li>Question 1</li>
                      <li>Question 2</li>
                    </ul>
                  </CardBody>
                </Card>
              </Tab>
              <Tab key="replied" title="Replied">
                <Card>
                  <CardBody>
                    <ul>
                      <li>Question 3</li>
                      <li>Question 4</li>
                    </ul>
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </main>
      </div>
  )
}
