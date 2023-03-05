import { axiosGet, axiosPatch, axiosPost } from "../../apis/axios/axios-app"
import {
  setProfileAvatar,
  setProfileErrorMessage,
  setProfileInfo,
  setProfileLoading,
  setProfileUser
} from "../slices/profileSlice"
import { setLoading, setUnknownError } from "../slices/appSlice"
import { AppDispatch, GetState } from "../store"
import { GetProfileResponse } from "../../../../common/types/response-types"
import { DbError } from "../../../../common/errors/DbError"
import { AuthError } from "../../../../common/errors/AuthError"
import { GmailError } from "../../../../common/errors/GmailError"
import { Either, left } from "@sweet-monads/either"
import { AxiosResponse } from "axios"
import { deleteImageFromCloud, saveImageToCloud } from "../../apis/firebase/actions/storage"
import { TokenError } from "../../../../common/errors/TokenError"
import { onTokenError } from "../slices/userSlice"
import { authProvider, getProvider } from "../../apis/firebase/actions/auth"
import { ProfileUser } from "../../../../common/types/user"
import {
  EditAvatarBody,
  EditProfileByProviderBody,
  EditProfileByTokenBody
} from "../../../../common/types/request-body-types/profile-body"

export const getProfile = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setProfileLoading(true))
  const res = await axiosGet<DbError, GetProfileResponse>(`/profile/${userId}`)
  res
    .mapRight(({ data }) => dispatch(setProfileInfo({ ...data })))
    .mapLeft(e => console.log(e))
  dispatch(setProfileLoading(false))
}

export const sendConfirmProfileChange = (data: EditProfileByTokenBody) => async (dispatch: AppDispatch) => {
  (await axiosPost<AuthError | DbError | GmailError, any, EditProfileByTokenBody>('/profile/confirm_edit', data))
    .mapLeft(e => {
      if (e.response?.data.name === 'AuthError') dispatch(setProfileErrorMessage('The password is invalid'))
      if (e.response?.data.name === 'DbError') {
        dispatch(setUnknownError(true))
        console.log(e.response?.data)
      }
      if (e.response?.data.name === 'GmailError') {
        dispatch(setUnknownError(true))
        console.log(e.response?.data)
      }
    })
}

export const editProfileInfoByToken = async (editToken?: string): Promise<Either<any, AxiosResponse<number>>> => {
  if (!editToken) return left(new Error())
  return (await axiosPost<any, number>('/profile/edit_by_token', { token: editToken }))
}

export const editProfileInfoByProvider = (data: EditProfileByProviderBody) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    dispatch(setLoading(true))
    const providerName = getState().user.currentUser.authProvider
    if (!providerName) return
    const provider = getProvider(providerName)
    const providerRes = await authProvider(provider, providerName)
    providerRes
      .mapRight(async () => {
        (await axiosPost<DbError, ProfileUser, EditProfileByProviderBody>('/profile/edit_by_provider', data))
          .mapRight(({ data: user }) => {
            dispatch(setProfileUser(user))
            dispatch(setLoading(false))
          })
          .mapLeft((e) => {
            console.log(e.response?.data)
            dispatch(setLoading(false))
          })
      })
      .mapLeft(() => {
        dispatch(setUnknownError(true))
        dispatch(setLoading(false))
      })
  }
}

export const editProfileImage = (userId: number, image?: File, deletedImage?: string) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    const token = getState().user.currentUser.token
    dispatch(setProfileLoading(true))
    let avatarUrl = await saveImageToCloud(image)
    await deleteImageFromCloud(deletedImage)
    const response = await axiosPatch<TokenError | DbError, { avatarUrl: string }, EditAvatarBody>('/profile/edit_avatar',
      { avatarUrl, token, userId }
    )
    response
      .mapRight(({ data }) => dispatch(setProfileAvatar(data.avatarUrl)))
      .mapLeft(e => {
        if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
        else {
          console.log(e.response?.data)
          dispatch(setUnknownError(true))
        }
      })
    dispatch(setProfileLoading(false))

  }
}
