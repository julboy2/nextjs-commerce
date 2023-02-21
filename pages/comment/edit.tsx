import AutoSizeImage from '@components/AutoSizeImage'
import CustomEditor from '@components/Editor'
import { Slider } from '@mantine/core'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

const CommentEdit = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>([])
  const router = useRouter()
  const [rate, setRate] = useState(5)
  const { orderItemId } = router.query // query 에서 찾아오면 string  타입이다.
  const [editorState, setEditorState] = useState<EditorState | undefined>(
    undefined
  )

  useEffect(() => {
    if (orderItemId != null) {
      fetch(`/api/get-comment?orderItemId=${orderItemId}`)
        .then((res) => res.json())
        .then((data) => {
          //console.log(data)
          if (data.items.contents) {
            setEditorState(
              EditorState.createWithContent(
                convertFromRaw(JSON.parse(data.items.contents))
              )
            )
            setRate(data.items.rate)
            setImages(data.items.images.split(',') ?? [])
          } else {
            setEditorState(EditorState.createEmpty())
          }
        })
    }
  }, [orderItemId])

  const handleChange = () => {
    if (
      inputRef.current &&
      inputRef.current.files &&
      inputRef.current.files.length > 0
    ) {
      for (let i = 0; inputRef.current.files.length; i++) {
        const fd = new FormData()

        fd.append(
          'image',
          inputRef.current.files[i],
          inputRef.current.files[i].name
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
            setImages((prev) =>
              Array.from(new Set(prev.concat(data.data.image.url)))
            )
          })
          .catch(console.log)
      }
    }
  }

  const handleSave = () => {
    if (editorState) {
      fetch(`/api/update-comment`, {
        method: 'post',
        body: JSON.stringify({
          orderItemId: Number(orderItemId),
          rate: rate,
          contents: JSON.stringify(
            convertToRaw(editorState.getCurrentContent())
          ),
          images: images.join(','),
        }),
      })
        .then((res) => res.json())
        .then(() => {
          alert('Success')
          router.back()
        })
    }
  }
  return (
    <div>
      <CustomEditor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        onSave={handleSave}
      />
      <Slider
        defaultValue={5}
        min={1}
        max={5}
        step={1}
        value={rate}
        onChange={setRate}
        marks={[
          { value: 1 },
          { value: 2 },
          { value: 3 },
          { value: 4 },
          { value: 5 },
        ]}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
      />
      <div style={{ display: 'flex' }}>
        {images &&
          images.length > 0 &&
          images.map((image, idx) => <AutoSizeImage src={image} key={idx} />)}
      </div>
    </div>
  )
}

export default CommentEdit
