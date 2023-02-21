import styled from '@emotion/styled'
import Image from 'next/image'
import React from 'react'

const AutoSizeImage = ({ src, size = 500 }: { src: string; size: number }) => {
  return (
    <AutoSizeImageWrapper>
      <Image src={src} alt="" layout="fill" objectFit="contain" />
    </AutoSizeImageWrapper>
  )
}

export default AutoSizeImage

const AutoSizeImageWrapper = styled.div<{ size: number }>`
  width: ${(props) => (props.size ? `${props.size}px` : '500px')}
  height: ${(props) => (props.size ? `${props.size}px` : '500px')}
  position: relative;
`
