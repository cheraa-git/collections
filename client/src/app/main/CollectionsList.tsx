import { FC, useEffect } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import InfiniteScroll from "react-infinite-scroll-component"
import { Spinner } from "../../common/Loader/Spinner"
import { Box, MenuItem, TextField } from "@mui/material"
import { CollectionCard } from "../collection/CollectionCard"
import { getNextCollections } from "../../store/actions/mainActions"
import { useTranslation } from "react-i18next"
import { useCollection } from "../../hooks/collectionStateHook"
import { clearMainCollections, setHasManyCollections, setSearchTheme } from "../../store/slices/mainSlice"
import { Text } from "../../common/Text"

export const CollectionsList: FC = () => {
  const NUMBER_OF_LOADED_COLLECTIONS = 10
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { themes } = useCollection()
  const { collections, hasMoreCollections, searchThemeId } = useAppSelector((state: RootState) => state.main)


  const loadCollectionsHandler = () => {
    dispatch(getNextCollections(collections.length, collections.length + NUMBER_OF_LOADED_COLLECTIONS, searchThemeId))
  }

  const searchHandler = () => {
    dispatch(clearMainCollections())
    dispatch(getNextCollections(0, NUMBER_OF_LOADED_COLLECTIONS, searchThemeId))
    dispatch(setHasManyCollections(true))
  }

  useEffect(() => {
    searchHandler()
  }, [searchThemeId])

  useEffect(() => {
    if (collections.length === 0) {
      dispatch(getNextCollections(0, NUMBER_OF_LOADED_COLLECTIONS, searchThemeId))
    }
  }, [collections.length, dispatch])

  return (
    <Box>
      <Text variant="h4">Collection feed</Text>
      <TextField
        select label={t("Theme")} fullWidth
        value={searchThemeId || ''}
        onChange={e => dispatch(setSearchTheme(+e.target.value))}
      >
        <MenuItem value="">all</MenuItem>
        {themes.map((theme) => <MenuItem key={theme.id} value={theme.id}>{theme.name}</MenuItem>)}
      </TextField>
      <InfiniteScroll
        dataLength={collections.length}
        next={loadCollectionsHandler}
        hasMore={hasMoreCollections}
        loader={<Box mx="auto" width="min-content" mt={2}><Spinner/></Box>}
        endMessage={<Text textAlign="center" fontSize="x-large">The end</Text>}
      >
        {collections?.map(collection => <CollectionCard key={collection.id} collection={collection}/>)}
      </InfiniteScroll>
    </Box>
  )
}
