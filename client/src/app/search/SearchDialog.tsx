import './styles.css'
import { FC } from "react"
import { BlurDialog } from "../../common/BlurDialog"
import { Box, Typography } from "@mui/material"
import { Index, InstantSearch } from 'react-instantsearch-dom'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import { SearchInput } from "./SearchInput"
import { SearchItemsList } from "./item/SearchItemsList"
import { SearchCommentsList } from "./comment/SearchCommentsList"
import { Text } from "../../common/Text"
import { useApp } from "../../hooks/appStateHook"
import { useAppDispatch } from "../../store/store"
import { setSearchOpen } from "../../store/slices/appSlice"
import { SearchCollectionList } from "./collection/SearchCollectionList"


export const SearchDialog: FC = () => {
  const dispatch = useAppDispatch()
  const { searchOpen } = useApp()
  const searchClient = instantMeiliSearch(
    process.env.REACT_APP_MEILISEARCH_HOST || 'http://localhost:7700',
    process.env.REACT_APP_MEILISEARCH_API_KEY
    )

  const searchCloseHandler = () => {
    dispatch(setSearchOpen(false))
  }

  document.onkeydown = (e) => {
    if (e.code === 'Escape' && searchOpen) {
      e.preventDefault()
      searchCloseHandler()
    }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyK') {
      dispatch(setSearchOpen(!searchOpen))
    }
  }

  return (
    <BlurDialog open={searchOpen} fullWidth onClose={searchCloseHandler} disableEscapeKeyDown>
      <Box px={2} py={1} height="70vh">
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Text fontSize="x-large">Site search</Text>
          <Typography className="esc-bth" onClick={searchCloseHandler}>esc</Typography>
        </Box>
        <InstantSearch indexName="collections" searchClient={searchClient}>
          <SearchInput/>
          <Box px={1} mt={1}>
            <Index indexName="items">
              <SearchItemsList/>
            </Index>
            <Index indexName="collections">
              <SearchCollectionList/>
            </Index>
            <Index indexName="comments">
              <SearchCommentsList/>
            </Index>
          </Box>
        </InstantSearch>
      </Box>
    </BlurDialog>
  )
}

