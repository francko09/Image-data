"use client"

import UploadForm from '@/components/UploadForm'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <UploadForm/>
      <Link href={'/gallery'} >
        voir
      </Link>
    </>
  )
}

export default page
