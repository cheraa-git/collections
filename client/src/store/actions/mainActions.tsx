import { AppDispatch } from "../store"
import { axiosGet } from "../../apis/axios/axios-app"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { Collection, Item } from "../../../../common/common-types"
import { setUnknownError } from "../slices/appSlice"
import { addMainCollections, addMainItems, setHasManyCollections, setHasManyItems } from "../slices/mainSlice"

export const getNextItems = (offset: number, limit: number) => async (dispatch: AppDispatch) => {
  const itemsResponse = await axiosGet<DatabaseError, Item[]>(`/item/next?offset=${offset}&limit=${limit}`)
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

export const getNextCollections = (offset: number, limit: number) => async (dispatch: AppDispatch) => {
  const collectionsResponse = await axiosGet<DatabaseError, Collection[]>(`/collection/next?offset=${offset}&limit=${limit}`)
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
