import './styles.css'
import { FC } from "react"
import { Box, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { TagChip } from "../../common/TagChip"
import { useApp } from "../../hooks/appStateHook"
import { TransButton } from "../../common/TransButton"
import { timestampToDateTime } from "../../utils"
import { Item } from "../../../../common/types/item"

interface ItemCardProps {
  item: Item
}

export const ItemCard: FC<ItemCardProps> = ({ item }) => {
  const isDark = useApp().isDark

  return (
    <Box className="item-card border-b fade">
      <Box>
        <Typography fontWeight="bold" width="max-content">{item.name}</Typography>
        <Typography fontSize="small">{timestampToDateTime(item.timestamp)}</Typography>
      </Box>

      <Box className="card-tags">
        {item.tags?.map(tag => <TagChip key={tag.id} tag={tag}/>)}
      </Box>

      <Box className={`card-btn-wrapper ${isDark && 'card-btn-wrapper_dark'}`}>
        <Link to={`/item/${item.id}`}>
          <TransButton size="small">Open</TransButton>
        </Link>
      </Box>
    </Box>
  )
}
