import { FC, useEffect } from "react"
import InfiniteScroll from "react-infinite-scroll-component"
import { Spinner } from "../../common/Loader/Spinner"
import { ItemCard } from "../item/ItemCard"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { getNextItems } from "../../store/actions/mainActions"
import { Box } from "@mui/material"

export const ItemsList: FC = () => {
  const NUMBER_OF_LOADED_ITEMS = 50
  const dispatch = useAppDispatch()
  const { items, hasMoreItems } = useAppSelector((state: RootState) => state.main)
  const loadItemsHandler = () => {
    dispatch(getNextItems(items.length, items.length + NUMBER_OF_LOADED_ITEMS))
  }

  useEffect(() => {
    if (items.length === 0) {
      dispatch(getNextItems(0, 50))
    }
  }, [])
  return (
    <Box px={5}>
      <InfiniteScroll
        dataLength={items.length}
        next={loadItemsHandler}
        hasMore={hasMoreItems}
        loader={<Box mx="auto" width="min-content" mt={2}><Spinner/></Box>}
      >
        {items?.map(item => <ItemCard key={item.id} item={item}/>)}
      </InfiniteScroll>
    </Box>
  )
}
