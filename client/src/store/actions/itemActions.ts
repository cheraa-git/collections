import { CreateItemPayload } from "../../types/collection"
import { setLoading, setUnknownError } from "../slices/appSlice"
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "../../apis/axios/axios-app"
import { setCollectionLoading, setItemConfigs } from "../slices/collectionSlice"
import { NavigateFunction } from "react-router-dom"
import { addItem, setItem, setItemErrorMessage, setItemLoading, setTags } from "../slices/itemSlice"
import { AppDispatch, GetState } from "../store"
import { DbError } from "../../../../common/errors/DbError"
import { GetItemResponse } from "../../../../common/types/response-types"
import { TokenError } from "../../../../common/errors/TokenError"
import { onTokenError } from "../slices/userSlice"
import { NotFoundError } from "../../../../common/errors/NotFoundError"
import { Item, Tag } from "../../../../common/types/item"
import { CreateItemBody, EditItemBody } from "../../../../common/types/request-body-types/item-body"

export const createItem = (data: CreateItemPayload) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setCollectionLoading(true))
  const { id: userId, token } = getState().user.currentUser
  const sendData: CreateItemBody = { userId, token, ...data }
  const itemResponse = await axiosPost<DbError | TokenError, Item, CreateItemBody>('/item', sendData)
  itemResponse
    .mapRight(({ data: item }) => dispatch(addItem(item)))
    .mapLeft(e => {
      if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
      else {
        console.log(e.response?.data)
        dispatch(setUnknownError(true))
      }
    })
  dispatch(setCollectionLoading(false))
}

export const getItem = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setItemLoading(true))
  const itemResponse = await axiosGet<DbError | NotFoundError, GetItemResponse>(`/item/${id}`)
  itemResponse
    .mapRight(({ data }) => {
      dispatch(addItem(data.item))
      dispatch(setItemConfigs(data.itemConfigs))
    })
    .mapLeft(e => {
      if (e.response?.data.name === 'NotFoundError') dispatch(setItemErrorMessage('Item not found'))
      if (e.response?.data.name === 'DbError') {
        console.log(e.response?.data)
        dispatch(setUnknownError(true))
      }
    })
  dispatch(setItemLoading(false))
}


export const editItem = (item: Item) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setItemLoading(true))
  const token = getState().user.currentUser.token
  const itemResponse = await axiosPatch<TokenError | DbError, Item, EditItemBody>('/item', { item, token })
  itemResponse
    .mapRight(({ data: item }) => dispatch(setItem(item)))
    .mapLeft(e => {
      if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
      else {
        console.log(e.response?.data)
        dispatch(setUnknownError(true))
      }
    })
  dispatch(setItemLoading(false))
}

export const deleteItem = (item: Item, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    dispatch(setLoading(true))
    const token = getState().user.currentUser.token
    const response = await axiosDelete<TokenError | DbError>('/item', { data: { item, token } })
    response
      .mapRight(() => navigate(`/collection/${item.collectionId}`))
      .mapLeft(e => {
        if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
        else {
          console.log(e.response?.data)
          dispatch(setUnknownError(true))
        }
      })
    dispatch(setLoading(false))
  }
}


export const getTags = () => async (dispatch: AppDispatch) => {
  (await axiosGet<DbError, Tag[]>('/item/tags'))
    .mapRight(({ data: tags }) => dispatch(setTags(tags)))
    .mapLeft(e => console.log(e.response?.data))
}

