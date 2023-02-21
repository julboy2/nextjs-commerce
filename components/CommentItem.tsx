import styled from '@emotion/styled'
import { IconStar } from '@tabler/icons'
import { format } from 'date-fns'
import { convertFromRaw, EditorState } from 'draft-js'

import { CommentITemType } from 'pages/products/[id]'
import AutoSizeImage from './AutoSizeImage'
import CustomEditor from './Editor'

const CommentItem = ({ item }: { item: CommentITemType }) => {
  return (
    <Wrapper>
      <div>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              {Array.from({ length: 5 }).map((_, idx) => (
                <IconStar
                  key={idx}
                  fill={idx < item.rate ? 'red' : 'none'}
                  stroke={idx < item.rate ? 0 : 1}
                />
              ))}
            </div>
            <span className="text-zinc-600 text-xs">
              {item.price.toLocaleString('ko-kr')} 원 * {item.quantity} 개=
              {item.amount.toLocaleString('ko-kr')} 원
            </span>
          </div>
          <p className="text-zinc-300 ml-auto">
            {format(new Date(item.updatedAt), 'yyyy년 M월 d일')}
          </p>
        </div>
        {/* <CustomEditor
          editorState={EditorState.createWithContent(
            convertFromRaw(JSON.parse(item.contents ?? ''))
          )}
          readOnly
          noPadding
        /> */}
        {item.contents ?? ''}
      </div>
      <div style={{ display: 'flex' }}>
        {item.images?.split(',').map((image, idx) => (
          <AutoSizeImage key={idx} src={image} size={500} />
        ))}
      </div>
    </Wrapper>
  )
}

export default CommentItem

const Wrapper = styled.div`
  border: 1px solid black;
  border-radius: 8px;
  padding: 8px;
`
