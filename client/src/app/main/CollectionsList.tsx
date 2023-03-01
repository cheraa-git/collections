import { FC, useEffect } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import InfiniteScroll from "react-infinite-scroll-component"
import { Spinner } from "../../common/Loader/Spinner"
import { Box } from "@mui/material"
import { CollectionCard } from "../collection/CollectionCard"
import { getNextCollections } from "../../store/actions/mainActions"

export const CollectionsList: FC = () => {
  const NUMBER_OF_LOADED_COLLECTIONS = 10
  const dispatch = useAppDispatch()
  const { collections, hasMoreCollections } = useAppSelector((state: RootState) => state.main)

  const loadCollectionsHandler = () => {
    dispatch(getNextCollections(collections.length, collections.length + NUMBER_OF_LOADED_COLLECTIONS))
  }

  useEffect(() => {
    if (collections.length === 0) {
      dispatch(getNextCollections(0, NUMBER_OF_LOADED_COLLECTIONS))
    }
  }, [dispatch, collections.length])
  return (
    <Box>
      <InfiniteScroll
        dataLength={collections.length}
        next={loadCollectionsHandler}
        hasMore={hasMoreCollections}
        loader={<Box mx="auto" width="min-content" mt={2}><Spinner/></Box>}
      >
        {collections?.map(collection => <CollectionCard key={collection.id} collection={collection}/>)}
      </InfiniteScroll>
    </Box>
  )
}
