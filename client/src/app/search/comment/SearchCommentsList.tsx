import '../../../styles/search-styles.css'
import { connectHits } from "react-instantsearch-dom"
import { SearchCommentCard } from "./SearchCommentCard"
import { Box } from "@mui/material"
import { Text } from "../../../common/Text"

export const SearchCommentsList = connectHits(({ hits }) => {
  console.log('comments', hits)
  return (
    <Box>
      <Text className="search-title" hidden={hits.length === 0}>Comments</Text>
      <Box>
        {hits.map(hit => (
          <SearchCommentCard key={hit.id} hit={hit} attribute="text"/>
        ))}
      </Box>
    </Box>
  )
})
