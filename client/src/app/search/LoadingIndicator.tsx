import { connectStateResults } from "react-instantsearch-dom"
import { Spinner } from "../../common/Loader/Spinner"
import { Box } from "@mui/material"

export const LoadingIndicator = connectStateResults(({ isSearchStalled }) => {
  return isSearchStalled ? <Box width="min-content" mx="auto" mt={1}><Spinner/></Box> : null
  }
)
