import '../styles.css'
import { connectHits } from "react-instantsearch-dom"
import { SearchCommentCard } from "./SearchCommentCard"
import { Box } from "@mui/material"
import { Text } from "../../../common/Text"

export const SearchCommentsList = connectHits(({ hits }) => {
  return (
    <Box>
      <Text className="search-title" hidden={hits.length === 0}>Comments</Text>
      <Box px={1}>
        {hits.map(hit => (
          <SearchCommentCard key={hit.id} hit={hit} attribute="text"/>
        ))}
      </Box>
    </Box>
  )
})
