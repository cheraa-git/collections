import '../styles.css'
import { connectHits } from "react-instantsearch-dom"
import { SearchItemCard } from "./SearchItemCard"
import { Box } from "@mui/material"
import { Text } from "../../UI/Text"

export const SearchItemsList = connectHits(({ hits }) => {
  return (
    <Box>
      <Text className="search-title" hidden={hits.length === 0}>Items</Text>
      <Box px={1}>
        {hits.map(hit => (
          <SearchItemCard key={hit.id} hit={hit} attribute="name"/>
        ))}
      </Box>
    </Box>
  )
})
