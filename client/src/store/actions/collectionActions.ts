import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "../../apis/axios/axios-app"
import { CreateCollectionPayload, EditCollectionPayload } from "../../types/collections"
import { saveImageToCloud } from "../../apis/firebase/firebaseActions"
import { CreateCollectionBody, EditCollectionBody } from "../../../../common/request-types"
import { setCollectionData, setCollectionErrorMessage, setThemes } from "../slices/collectionSlice"
import { setLoading, setUnknownError } from "../slices/appSlice"
import { Collection, Theme } from "../../../../common/common-types"
import { NavigateFunction } from "react-router-dom"
import { setItems } from "../slices/itemSlice"
import { AppDispatch, GetState } from "../store"
import { TokenError } from "../../../../common/errors/TokenError"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { onTokenError } from "../slices/userSlice"
import { GetCollectionResponse } from "../../../../common/response-types"


export const createCollection = (data: CreateCollectionPayload, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    const { image, themeId, title, itemConfigs, description, userId } = data
    const token = getState().user.currentUser.token
    dispatch(setLoading(true))
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
    dispatch(setLoading(false))
  }
}


export const editCollection = (data: EditCollectionPayload, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    const { image, existingImage, id, title, userId, itemConfigs, themeId, description } = data
    const token = getState().user.currentUser.token
    let imageUrl = existingImage || await saveImageToCloud(image)
    dispatch(setLoading(true))
    const response = await axiosPatch<TokenError | DatabaseError, Collection, EditCollectionBody>('/collection', {
      itemConfigs, collection: { id, userId, imageUrl, title, themeId, description }, token
    })
    response
      .mapRight(() => navigate(`/collection/${id}`))
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


export const getCollection = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const response = await axiosGet<DatabaseError, GetCollectionResponse | undefined>(`/collection/${id}`)
  response
    .mapRight(({ data }) => {
      if (!data) return dispatch(setCollectionErrorMessage('Collection not found'))
      dispatch(setCollectionData({ collection: data.collection, itemConfigs: data.itemConfigs }))
      dispatch(setItems(data.items))
    })
    .mapLeft(e => console.log(e.response?.data))
  dispatch(setLoading(false))
}


export const deleteCollection = (collection: Collection, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    //TODO: удалить картинку из firebase
    dispatch(setLoading(true))
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
    dispatch(setLoading(false))
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

