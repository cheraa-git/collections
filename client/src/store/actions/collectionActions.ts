import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "../../apis/axios/axios-app"
import { CreateCollectionPayload, EditCollectionPayload } from "../../types/collection"
import { deleteImageFromCloud, saveImageToCloud } from "../../apis/firebase/firebaseActions"
import { CreateCollectionBody, EditCollectionBody } from "../../../../common/types/request-types"
import {
  setCollectionData,
  setCollectionErrorMessage,
  setCollectionLoading,
  setThemes
} from "../slices/collectionSlice"
import { setLoading, setUnknownError } from "../slices/appSlice"
import { NavigateFunction } from "react-router-dom"
import { setItems } from "../slices/itemSlice"
import { AppDispatch, GetState } from "../store"
import { TokenError } from "../../../../common/errors/TokenError"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { onTokenError } from "../slices/userSlice"
import { GetCollectionResponse } from "../../../../common/types/response-types"
import { Collection, Theme } from "../../../../common/types/collection"


export const createCollection = (data: CreateCollectionPayload, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    const { image, themeId, title, itemConfigs, description, userId } = data
    const token = getState().user.currentUser.token
    dispatch(setCollectionLoading(true))
    const response = await axiosPost<TokenError | DatabaseError, Collection, CreateCollectionBody>('/collection', {
      userId, token, imageUrl: await saveImageToCloud(image), themeId, title, description, itemConfigs
    })
    response
      .mapRight(() => navigate(`/profile/${userId}`))
      .mapLeft(e => {
        if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
        else {
          console.log(e.response?.data)
          dispatch(setUnknownError(true))
        }
      })
    dispatch(setCollectionLoading(false))
  }
}


export const editCollection = (data: EditCollectionPayload, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    const { image, existingImage, itemConfigs, removedConfigs, deletedImage, ...collection } = data
    const token = getState().user.currentUser.token
    dispatch(setCollectionLoading(true))
    let imageUrl = existingImage || await saveImageToCloud(image)
    await deleteImageFromCloud(deletedImage)
    const response = await axiosPatch<TokenError | DatabaseError, Collection, EditCollectionBody>('/collection', {
      itemConfigs, removedConfigs, collection: { ...collection, imageUrl }, token
    })
    response
      .mapRight(() => navigate(`/collection/${collection.id}`))
      .mapLeft(e => {
        if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
        else {
          console.log(e.response?.data)
          dispatch(setUnknownError(true))
        }
      })
    dispatch(setCollectionLoading(false))
  }
}


export const getCollection = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setCollectionLoading(true))
  const response = await axiosGet<DatabaseError, GetCollectionResponse | undefined>(`/collection/${id}`)
  response
    .mapRight(({ data }) => {
      if (!data) return dispatch(setCollectionErrorMessage('Collection not found'))
      dispatch(setCollectionData({ collection: data.collection, itemConfigs: data.itemConfigs }))
      dispatch(setItems(data.items))
    })
    .mapLeft(e => console.log(e.response?.data))
  dispatch(setCollectionLoading(false))
}


export const deleteCollection = (collection: Collection, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    dispatch(setCollectionLoading(true))
    const token = getState().user.currentUser.token
    const response = await axiosDelete<TokenError | DatabaseError>('/collection', { data: { collection, token } })
    response
      .mapRight(() => navigate(`/profile/${collection.userId}`))
      .mapLeft(e => {
        if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
        else {
          console.log(e.response?.data)
          dispatch(setUnknownError(true))
        }
      })
    dispatch(setCollectionLoading(false))
  }
}

export const getThemes = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const response = await axiosGet<DatabaseError, Theme[]>('/collection/themes')
  response
    .mapRight(({ data: themes }) => dispatch(setThemes(themes)))
    .mapLeft(e => console.log(e.response?.data))
  dispatch(setLoading(false))
}

