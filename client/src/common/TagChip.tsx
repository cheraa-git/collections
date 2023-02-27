import { FC } from "react"
import Chip from '@mui/material/Chip'
import { Tag } from '../../../common/common-types'
import { Box } from "@mui/material"

export const TagChip: FC<{ tag: Tag }> = ({ tag }) => {
  const handleClick = () => {
    //TODO: search by tag
  }
  return (
    <Box m={0.5}>
      <Chip label={tag.name} size="small" onClick={handleClick}/>
    </Box>
  )
}
