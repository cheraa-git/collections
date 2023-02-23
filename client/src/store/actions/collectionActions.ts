import axios from "../../axios-app"
import { CreateCollectionPayload, EditCollectionPayload } from "../../types/collections"
import { saveImageToCloud } from "../../apis/firebase/firebaseActions"
import { CreateCollectionBody } from "../../../../common/request-types"
import { setCollectionData, setThemes } from "../slices/collectionSlice"
import { setLoading } from "../slices/appSlice"
import { Collection } from "../../../../common/common-types"
import { NavigateFunction } from "react-router-dom"
import { setItems } from "../slices/itemSlice"
import { AppDispatch, GetState } from "../store"


export const createCollection = (data: CreateCollectionPayload, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    const { image, themeId, title, itemConfigs, description, userId } = data
    const token = getState().user.currentUser.token
    let imageUrl = ''
    dispatch(setLoading(true))
    if (image) imageUrl = await saveImageToCloud(image)
    const sendData: CreateCollectionBody = { userId, token, imageUrl, themeId, title, description, itemConfigs }
    const collection = (await axios.post<Collection>('/collection', sendData)).data
    navigate(`/profile/${userId}`)
    dispatch(setLoading(false))
    console.log('CREATE_COLLECTION', collection)
  }
}

export const editCollection = (data: EditCollectionPayload, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    const { image, existingImage, id, title, userId, itemConfigs, themeId, description } = data
    const token = getState().user.currentUser.token
    let imageUrl = ''
    dispatch(setLoading(true))
    if (existingImage) imageUrl = existingImage
    if (image) imageUrl = await saveImageToCloud(image)
    const sendData = { itemConfigs, collection: { id, userId, imageUrl, title, themeId, description }, token }
    const response = await axios.patch<Collection>('/collection', sendData)
    console.log('EDIT_COLLECTION', response.data)
    navigate(`/collection/${id}`)
    dispatch(setLoading(false))
  }
}


export const getCollection = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const { collection, itemConfigs, items } = (await axios.get(`/collection/${id}`)).data
  console.log('GET_COLLECTION', { collection, items, itemConfigs })
  dispatch(setCollectionData({ collection, itemConfigs }))
  dispatch(setItems(items))
  dispatch(setLoading(false))
}


export const deleteCollection = (collection: Collection, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    dispatch(setLoading(true))
    const token = getState().user.currentUser.token
    const response = await axios.delete('/collection', { data: { collection, token } })
    console.log('DELETE', response.data)
    navigate(`/profile/${collection.userId}`)
    dispatch(setLoading(false))
  }
}

export const getThemes = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const response = await axios.get('/collection/themes')
  dispatch(setThemes(response.data))
  dispatch(setLoading(false))
}

