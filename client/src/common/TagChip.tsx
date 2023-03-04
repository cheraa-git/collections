import { FC } from "react"
import Chip from '@mui/material/Chip'
import { Box } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "../store/store"
import { setSearchTags } from "../store/slices/mainSlice"
import { Tag } from "../../../common/types/item"

export const TagChip: FC<{ tag: Tag }> = ({ tag }) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/')
    dispatch(setSearchTags([tag]))
  }
  return (
    <Box mx={0.5}>
      <Chip label={tag.name} size="small" onClick={handleClick}/>
    </Box>
  )
}
