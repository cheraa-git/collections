import { AppDispatch } from "../store"
import { axiosGet } from "../../apis/axios/axios-app"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { Collection, Item } from "../../../../common/common-types"
import { setUnknownError } from "../slices/appSlice"
import { addMainCollections, addMainItems, setHasManyCollections, setHasManyItems } from "../slices/mainSlice"

export const getNextItems = (offset: number, limit: number, tagIds: number[] = []) => async (dispatch: AppDispatch) => {
  const url = `/item/next?offset=${offset}&limit=${limit}&tagIds=${JSON.stringify(tagIds)}`
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
}

export const getNextCollections = (offset: number, limit: number, themeId?: number) => async (dispatch: AppDispatch) => {
  const url = `/collection/next?offset=${offset}&limit=${limit}&themeId=${themeId}`
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
}
