import { AppDispatch, RootState } from "../store"
import axios from "../../axios-app"
import { CreateCollectionPayload, CreateItemPayload } from "../../types/collections"
import { saveImageToCloud } from "../../apis/firebase/firebaseActions"
import { CreateCollectionBody, CreateItemBody } from "../../../../common/request-types"
import { addItem, setCollectionData, setItem, setItemConfigs } from "../slices/collectionSlice"
import { setLoading } from "../slices/appSlice"
import { Collection, Item } from "../../../../common/common-types"
import { NavigateFunction } from "react-router-dom"


export const createCollection = (data: CreateCollectionPayload, navigate: NavigateFunction) => {
  const { image, theme, title, itemConfigs, description } = data
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { id: userId, token } = getState().user.currentUser
    let imageUrl = ''
    dispatch(setLoading(true))
    if (image) imageUrl = await saveImageToCloud(image)
    const sendData: CreateCollectionBody = { userId, token, imageUrl, theme, title, description, itemConfigs }
    const collection = (await axios.post<Collection>('collection/create_collection', sendData)).data
    navigate(`/profile/${userId}`)
    dispatch(setLoading(false))
    console.log('CREATE_COLLECTION', collection)
  }
}

export const createItem = (data: CreateItemPayload) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setLoading(true))
  const { id: userId, token } = getState().user.currentUser
  const sendData: CreateItemBody = { userId, token, ...data, tags: '' }
  const item = (await axios.post<Item>('collection/create_item', sendData)).data
  dispatch(setLoading(false))
  dispatch(addItem(item))
  console.log('CREATE_ITEM', item)
}

export const getCollection = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const { collection, itemConfigs, items } = (await axios.get(`collection/${id}`)).data
  console.log('GET_COLLECTION', { collection, items, itemConfigs })
  dispatch(setCollectionData({ collection, itemConfigs, items }))
  dispatch(setLoading(false))
}

export const getItem = (collectionId: number, id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const item = (await axios.get(`/collection/${collectionId}/${id}`)).data
  dispatch(addItem(item.item))
  dispatch(setItemConfigs(item.itemConfigs))
  dispatch(setLoading(false))
  console.log('GET_ITEM', item)
}

export const editItem = (item: Item) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setLoading(true))
  const token = getState().user.currentUser.token
  const response = await axios.post<Item>('/collection/edit_item', { item, token })
  dispatch(setItem(response.data))
  dispatch(setLoading(false))
}

export const deleteItem = (item: Item, navigate: NavigateFunction) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setLoading(true))
  const token = getState().user.currentUser.token
  const response = await axios.delete('/collection/delete_item', { data: { item, token } })
  console.log('DELETE', response.data)
  navigate(`/collection/${item.collectionId}`)
  dispatch(setLoading(false))
}

export const deleteCollection = (collection: Collection, navigate: NavigateFunction) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setLoading(true))
  const token = getState().user.currentUser.token
  const response = await axios.delete('/collection/delete_collection', { data: { collection, token } })
  console.log('DELETE', response.data)
  navigate(`/profile/${collection.userId}`)
  dispatch(setLoading(false))
}
