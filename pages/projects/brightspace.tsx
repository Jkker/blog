import AutoFocus from '@/components/AutoFocus'
import { Layout } from '@/layouts'
import config from '@/site.config'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import dynamic from 'next/dynamic'
import { GetStaticProps } from 'next'
import React, { ReactNode, useState } from 'react'
import { BiArchiveOut } from 'react-icons/bi'
import { IoArrowDown } from 'react-icons/io5'

const Comment = dynamic(() => import('@/components/Giscus'), {
  ssr: false,
})

const FILENAME_CHAR_MAP = {
  '<': '(',
  '>': ')',
  ':': '-',
  '"': "'",
  '/': '-',
  '\\': ',',
  '|': '-',
  '?': '',
  '*': '',
  '@': 'at',
}

type ProcessedFileList = {
  courseName: string
  folderName: string
  filePaths: string[]
}[]

function sanitizeFilename(filename: string) {
  let sanitized = filename
  Object.entries(FILENAME_CHAR_MAP).forEach(([key, value]) => {
    sanitized = sanitized.replaceAll(key, value)
  })
  return sanitized.replace(/\s+/g, ' ').trim()
}

const sortAlphabetically = (list, property = undefined) =>
  list.sort((a, b) =>
    (property ? a[property] : a).localeCompare(property ? b[property] : b)
  )

function ContentOrganizer() {
  const [warnings, setWarnings] = useState<ReactNode[]>([])
  const [processed, setProcessed] = useState<ProcessedFileList>([])
  const [files, setFiles] = useState<string[]>([])

  const processFile = async (file: File, output: JSZip) => {
    try {
      const zip = await JSZip.loadAsync(file)
      setFiles((files) => [...files, file.name])
      const toc = await zip.file('Table of Contents.html')?.async('string')
      if (!toc) {
        setWarnings((warnings) => [
          ...warnings,
          <li key={file.name}>
            No Table of Contents found in
            <b>{file.name}</b>
          </li>,
        ])
        return
      }

      const tocDoc = new DOMParser().parseFromString(toc, 'text/html')

      const title =
        tocDoc.querySelector('font.title > strong')?.textContent || 'Untitled'
      const folderName = sanitizeFilename(title.split(' - ').at(-1) as string)

      const courseName = sanitizeFilename(title.split(',').at(0) as string)

      const filePaths = await Promise.all(
        Array.from(
          tocDoc.querySelectorAll<HTMLAnchorElement>('p.d2l > a'),
          async (a) => {
            const filename = a.textContent && sanitizeFilename(a.textContent)
            const href = a.getAttribute('href') || ''
            const file = await zip.file(href)?.async('blob')
            const ext = href.split('.').pop()

            const filePath = `${courseName}/${folderName}/${filename}.${ext}`
            await output.file(filePath, file)
            return filePath
          }
        )
      )
      return {
        courseName,
        folderName,
        filePaths,
      }
    } catch (e: any) {
      setWarnings((warnings) => [
        ...warnings,
        <li key={file.name}>
          <b>{file.name}</b> is not a valid Brightspace export file.
        </li>,
      ])
    }
  }

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setWarnings([])
    setProcessed([])
    setFiles([])
    const output = new JSZip()

    const files = e.target.files
    if (!files) return

    const processed = (
      await Promise.all(
        Array.from(files).map((file) => processFile(file, output))
      )
    ).filter((p) => p !== undefined) as ProcessedFileList

    setProcessed(sortAlphabetically(processed, 'folderName'))
    if (!processed.length) {
      setWarnings(['No files processed. Please check the console for errors.'])
      return
    }

    const content = await output.generateAsync({ type: 'blob' })
    saveAs(content, 'output.zip')
  }

  return (
    <div className='w-full flex gap-4 flex-col'>
      <h2 className='font-bold text-xl md:text-2xl'>
        Brightspace File Organizer
      </h2>
      <p className='text-gray-700 dark:text-gray-300 text-sm md:text-base'>
        The zip files downloaded from Brightspace are quite a mess. This tool
        will help you rename and organize the files into folders based on the
        course name and the table of content.
      </p>
      <label
        htmlFor='dropzone-file'
        className='flex flex-col justify-center items-center w-full card hover:shadow-lg hover:bg-gray-200  dark:hover:bg-gray-700 transition-all duration-300 text-gray-500 dark:text-gray-300 gap-2 py-6'
      >
        {files.length > 0 ? (
          <ul className='space-y-2 list-inside text-sm text-gray-600 dark:text-gray-300'>
            {sortAlphabetically(files).map((file) => (
              <li key={file}>{file}</li>
            ))}
          </ul>
        ) : (
          <>
            <p className='font-semibold text-gray-600 dark:text-gray-300 mb-1'>
              Select Exported Zip Files
            </p>
            <BiArchiveOut className='h-14 w-14 opacity-40' />
            <p className='text-gray-500 dark:text-gray-400 hidden md:block text-sm'>
              Click here or drag and drop files
            </p>
            <p className='text-gray-500 dark:text-gray-400 text-sm'>2 GB max</p>
          </>
        )}
        <input
          id='dropzone-file'
          type='file'
          className='hidden'
          name='file'
          multiple
          onChange={onFileSelect}
        />
      </label>

      {warnings.length > 0 && (
        <ul className='text-red-500 space-y-2'>{warnings}</ul>
      )}
      {processed.length > 0 && (
        <>
          <IoArrowDown className='h-14 w-14 text-gray-300 dark:text-gray-700 mx-auto' />

          <div className='card'>
            <AutoFocus
              as='h3'
              className='font-bold text-lg md:text-2xl flex items-center gap-1'
            >
              Processed Files
            </AutoFocus>
            <ul className='space-y-2'>
              {processed.map(({ folderName, filePaths, courseName }) => (
                <li key={folderName}>
                  <h4 className='mb-2'>{folderName}</h4>
                  <ul className='pl-2 list-inside space-y-1 text-sm'>
                    {filePaths.map((filePath) => (
                      <li key={filePath}>{filePath.split('/').at(2)}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      <p className='text-gray-700 dark:text-gray-300 text-sm md:text-base mb-8'>
        Don&apos;t worry about privacy! This tool does everything in your
        browser.
      </p>
    </div>
  )
}

export default function BrightSpaceTools(props) {
  return (
    <Layout {...props} hasComment>
      <div className='w-full flex-col gap-4 pt-4 mx-3 flex-center text-black dark:text-gray-100'>
        <ContentOrganizer />
        <div className='w-full md:card'>
          <Comment />
        </div>
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {
      ...config.projects.find(
        (tool) => tool.title === 'Brightspace File Organizer'
      ),
    },
  }
}
