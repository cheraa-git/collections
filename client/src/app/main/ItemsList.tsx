import { FC, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Spinner } from "../../common/Loader/Spinner"
import { ItemCard } from "../item/ItemCard"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { getNextItems } from "../../store/actions/mainActions"
import { Box, IconButton } from "@mui/material"
import { TagsArea } from "../item/TagsArea"
import { clearMainItems, setHasManyItems, setSearchTags } from "../../store/slices/mainSlice"
import { SearchIcon } from "../../common/icons"
import { PopularTagCloud } from "./PopularTagCloud"
import { Text } from "../../common/Text"

export const ItemsList: FC = () => {
  const NUMBER_OF_LOADED_ITEMS = 50
  const dispatch = useAppDispatch()
  const { items, hasMoreItems, searchTags } = useAppSelector((state: RootState) => state.main)
  const tagIds = searchTags.map(tag => Number(tag.id)).filter(id => id)


  const loadItemsHandler = () => {
    dispatch(getNextItems(items.length, items.length + NUMBER_OF_LOADED_ITEMS, tagIds))
  }

  const searchHandler = () => {
    dispatch(clearMainItems())
    dispatch(getNextItems(0, NUMBER_OF_LOADED_ITEMS, tagIds))
    dispatch(setHasManyItems(true))
  }

  useEffect(() => {
    searchHandler()
  }, [searchTags])

  useEffect(() => {
    if (items.length === 0) {
      dispatch(getNextItems(0, NUMBER_OF_LOADED_ITEMS, tagIds))
    }
  }, [items.length, dispatch])
  return (
    <Box>
      <PopularTagCloud/>
      <Text variant="h4">Item feed</Text>
      <Box display="flex">
        <Box width="100%">
          <TagsArea value={searchTags} setValue={tags => dispatch(setSearchTags(tags))} freeSolo={false}
                    placeholder="tags search"/>
        </Box>
        <IconButton onClick={searchHandler}><SearchIcon/></IconButton>
      </Box>
      <InfiniteScroll
        dataLength={items.length}
        next={loadItemsHandler}
        hasMore={hasMoreItems}
        loader={<Box mx="auto" width="min-content" mt={2}><Spinner/></Box>}
        endMessage={<Text textAlign="center" fontSize="x-large">The end</Text>}
      >
        {items?.map(item => <ItemCard key={item.id} item={item}/>)}
      </InfiniteScroll>
    </Box>
  )
}
