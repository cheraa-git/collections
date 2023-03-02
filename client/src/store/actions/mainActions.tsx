import { AppDispatch } from "../store"
import { axiosGet } from "../../apis/axios/axios-app"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { Collection, Item, TagCount } from "../../../../common/common-types"
import { setLoading, setUnknownError } from "../slices/appSlice"
import {
  addMainCollections,
  addMainItems,
  setHasManyCollections,
  setHasManyItems,
  setTagCounts
} from "../slices/mainSlice"

export const getNextItems = (offset: number, limit: number, tagIds: number[] = []) => async (dispatch: AppDispatch) => {
  const url = `/item/next?offset=${offset}&limit=${limit}&tagIds=${JSON.stringify(tagIds)}`
  setLoading(true)
  const itemsResponse = await axiosGet<DatabaseError, Item[]>(url)
  itemsResponse
    .mapRight(({ data: items }) => {
      if (items.length === 0) return dispatch(setHasManyItems(false))
      dispatch(addMainItems(items))
    })
    .mapLeft(e => {
      console.log(e.response?.data)
      dispatch(setUnknownError(true))
    })
  setLoading(false)
}

export const getNextCollections = (offset: number, limit: number, themeId?: number) => async (dispatch: AppDispatch) => {
  const url = `/collection/next?offset=${offset}&limit=${limit}&themeId=${themeId}`
  setLoading(true)
  const collectionsResponse = await axiosGet<DatabaseError, Collection[]>(url)
  collectionsResponse
    .mapRight(({ data: collections }) => {
      if (collections.length === 0) return dispatch(setHasManyCollections(false))
      dispatch(addMainCollections(collections))
    })
    .mapLeft(e => {
      console.log(e.response?.data)
      dispatch(setUnknownError(true))
    })
  setLoading(false)
}

export const getMostPopularTags = () => async (dispatch: AppDispatch) => {
  setLoading(true)
  const tagCountsResponse = await axiosGet<DatabaseError, TagCount[]>('/item/popular_tags')
  tagCountsResponse
    .mapRight(({data: tagCounts}) => dispatch(setTagCounts(tagCounts)))
    .mapLeft(e => {
      console.log(e.response?.data)
      dispatch(setUnknownError(true))
    })
  setLoading(false)
}
