'use client'
import { Suspense, useState, useRef } from 'react'
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

export default function Home() {
  const [questionContent, setQuestionContent] = useState('')

  const [selectedFiles, setSelectedFiles] = useState<any>([])
  const [previewUrls, setPreviewUrls] = useState<any>([])
  const fileInputRef = useRef<any>(null)

  const handleFileChange = (event: any) => {
    const files = Array.from(event.target.files)
    setSelectedFiles(files)

    const urls = files.map((file: any) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }

  const handleUpload = async () => {
    if (selectedFiles.length <= 0) {
      Swal.fire({
        title: 'Tip',
        text: 'Please select a picture to upload!',
      })
      return
    }

    return selectedFiles.map((file: any) => {
      console.log(`上传文件: ${file.name}`, file)
      return ['1223']
    })
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
        title: 'Tip',
        text: 'Please enter a description of the problem.',
      })
      return
    }
    const imgRes = await handleUpload()
    console.log('提交问题', imgRes)
  }

  return (
    <Suspense fallback={null}>
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
                        onClick={() => fileInputRef.current.click()}
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
    </Suspense>
  )
}
