import './styles.css'
import { FC } from "react"
import { Box, Button, Typography } from "@mui/material"
import { Item } from "../../../../common/common-types"
import { Link } from "react-router-dom"
import { TagChip } from "../TagChip"
import { useApp } from "../../hooks/appStateHook"

interface ItemCardProps {
  item: Item
}

export const ItemCard: FC<ItemCardProps> = ({ item }) => {
  const isDark = useApp().isDark

  return (
    <Box className="item-card border-b">
      <Typography className="card-header">{item.name}</Typography>
      <Box className="card-tags">
        {item.tags?.map(tag => <TagChip key={tag.id} tag={tag}/>)}
      </Box>
      <Box className={`card-btn-wrapper ${isDark && 'card-btn-wrapper_dark'}`}>
        <Link to={`/collection/${item.collectionId}/${item.id}`}>
          <Button size="small">Open</Button>
        </Link>
      </Box>
    </Box>
  )
}
