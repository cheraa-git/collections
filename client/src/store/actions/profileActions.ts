import { axiosGet, axiosPatch, axiosPost } from "../../apis/axios/axios-app"
import { setProfileAvatar, setProfileErrorMessage, setProfileInfo, setProfileLoading } from "../slices/profileSlice"
import { setUnknownError } from "../slices/appSlice"
import { AppDispatch, GetState } from "../store"
import { GetProfileResponse } from "../../../../common/response-types"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { EditProfileBody } from "../../../../common/request-types"
import { AuthorizationError } from "../../../../common/errors/AuthorizationError"
import { GmailError } from "../../../../common/errors/GmailError"
import { Either, left } from "@sweet-monads/either"
import { AxiosResponse } from "axios"
import { saveImageToCloud } from "../../apis/firebase/firebaseActions"
import { TokenError } from "../../../../common/errors/TokenError"
import { onTokenError } from "../slices/userSlice"

export const getProfile = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setProfileLoading(true))
  const response = await axiosGet<DatabaseError, GetProfileResponse>(`/profile/${userId}`)
  response
    .mapRight(({ data }) => dispatch(setProfileInfo({ ...data })))
    .mapLeft(e => console.log(e))

  dispatch(setProfileLoading(false))
}

export const sendConfirmProfileChange = (data: EditProfileBody) => async (dispatch: AppDispatch) => {
  (await axiosPost<AuthorizationError | DatabaseError | GmailError>('/profile/confirm_edit', data))
    .mapLeft(e => {
      if (e.response?.data.name === 'AuthorizationError') dispatch(setProfileErrorMessage('The password is invalid'))
      if (e.response?.data.name === 'DatabaseError') {
        dispatch(setUnknownError(true))
        console.log(e.response?.data)
      }
      if (e.response?.data.name === 'GmailError') {
        dispatch(setUnknownError(true))
        console.log(e.response?.data)
      }
    })
}

export const editProfileInfo = async (editToken?: string): Promise<Either<any, AxiosResponse<number>>> => {
  if (!editToken) return left(new Error())
  return (await axiosPost<any, number>('/profile/edit', { token: editToken }))
}

export const editProfileImage = (userId: number, image?: File) => async (dispatch: AppDispatch, getState: GetState) => {
  const token = getState().user.currentUser.token
  dispatch(setProfileLoading(true))
  let avatarUrl = await saveImageToCloud(image)
  const response = await axiosPatch<TokenError | DatabaseError, { avatarUrl: string }>('/profile/edit_avatar', {
    avatarUrl, token, userId
  })
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
