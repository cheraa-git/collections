import '../../../styles/search-styles.css'
import { connectHits } from "react-instantsearch-dom"
import { SearchCollectionCard } from "./SearchCollectionCard"
import { Box } from "@mui/material"
import { Text } from "../../../common/Text"

export const SearchCollectionList = connectHits(({ hits }) => {
  console.log('collections', hits)
  return (
    <Box>
      <Text className="search-title" hidden={hits.length === 0}>collections</Text>
      <Box>
        {hits.map(hit => (
          <SearchCollectionCard key={hit.id} hit={hit} attribute="name"/>
        ))}
      </Box>
    </Box>
  )
})
