import Button from '@components/Button'
import styled from '@emotion/styled'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

const ImageUpload = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState('')

  const handleUpload = () => {
    if (inputRef.current && inputRef.current.files) {
      const fd = new FormData()

      fd.append(
        'image',
        inputRef.current.files[0],
        inputRef.current.files[0].name
      )

      fetch(
        'https://api.imgbb.com/1/upload?expiration=600&key=27549a0655df633efab7ed26e79a6181',
        {
          method: 'post',
          body: fd,
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          setImage(data.data.image.url)
        })
        .catch(console.log)
    }
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" />
      <Button onClick={handleUpload}>업로드</Button>
    </div>
  )
}

export default ImageUpload
