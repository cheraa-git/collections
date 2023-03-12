import { FC } from "react"
import { Box, Grid, Typography } from "@mui/material"
import { TagChip } from "../../common/TagChip"
import { Item } from "../../../../common/types/item"
import { TypographyLink } from "../../common/TypographyLink"
import { timestampToDateTime } from "../../utils"

interface ItemCardProps {
  item: Item
}

export const ItemCard: FC<ItemCardProps> = ({ item }) => {

  return (
    <Box className="border-b fade" py={1} px={1}>
      <Grid container>
        <Grid item display="flex">
          <TypographyLink to={`/collection/${item.collectionId}`}>{item.collectionTitle}</TypographyLink>
          <Typography mx={1}>/</Typography>
        </Grid>
        <Grid item>
          <TypographyLink to={`/item/${item.id}`} fontWeight="bold">{item.name}</TypographyLink>
        </Grid>

        <Grid item display="flex" overflow="hidden" ml="auto">
          {item.tags?.map(tag => <TagChip key={tag.id} tag={tag}/>)}
        </Grid>
      </Grid>
      <Typography fontSize="small">{timestampToDateTime(item.timestamp)}</Typography>

    </Box>
  )
}
