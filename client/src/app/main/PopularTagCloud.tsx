import { FC, useEffect } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { TagCloud } from 'react-tagcloud'
import { Box } from "@mui/material"
import { Text } from "../../common/Text"
import { setSearchTags } from "../../store/slices/mainSlice"
import { useNavigate } from "react-router-dom"
import { getMostPopularTags } from "../../store/actions/mainActions"

interface CloudTag {
  value: string
  count: number
  key: number
}

export const PopularTagCloud: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { tagCounts } = useAppSelector((state: RootState) => state.main)
  const tags = useAppSelector((state: RootState) => state.item.tags)

  useEffect(() => {
    dispatch(getMostPopularTags())
  }, [dispatch])

  const getTagNameById = (tagId: number) => {
    return tags.find(tag => tag.id === tagId)?.name
  }

  const formatTagCounts: CloudTag[] = tagCounts.map(tagCount => (
    { count: tagCount.count, value: getTagNameById(tagCount.tagId) || '', key: tagCount.tagId }
  ))

  const customRenderer = (tag: CloudTag, size: number, color: string) => {
    if (tag.value) {
      return (
        <span
          key={tag.key}
          className="cloud-tag scale"
          style={{
            animationDelay: `${Math.random() * 2}s`,
            fontSize: `${size}px`,
            color: `${color}`
          }}
        >
      {tag.value}
    </span>
      )
    } else return <span key={tag.key}></span>
  }

  const onTagClick = (tag: CloudTag) => {
    navigate('/')
    dispatch(setSearchTags([{ id: tag.key, name: tag.value }]))
  }


  return (
    <Box>
      <Text variant="h4" hidden={formatTagCounts.length === 0}>The most popular tags</Text>
      <Box className="bg-gray" mb={2}>
        <TagCloud
          className="text-center"
          minSize={15}
          maxSize={45}
          colorOptions={{ luminosity: 'bright', hue: '#8fc7ff' }}
          tags={formatTagCounts}
          onClick={onTagClick}
          renderer={customRenderer}
          shuffle={false}
        />
      </Box>
    </Box>
  )
}
