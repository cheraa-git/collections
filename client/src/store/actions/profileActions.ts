import { axiosGet, axiosPost } from "../../apis/axios/axios-app"
import { setProfileErrorMessage, setProfileInfo } from "../slices/profileSlice"
import { setLoading, setUnknownError } from "../slices/appSlice"
import { AppDispatch } from "../store"
import { GetProfileResponse } from "../../../../common/response-types"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { EditProfileBody } from "../../../../common/request-types"
import { AuthorizationError } from "../../../../common/errors/AuthorizationError"
import { GmailError } from "../../../../common/errors/GmailError"
import { Either, left } from "@sweet-monads/either"
import { AxiosResponse } from "axios"

export const getProfile = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const response = await axiosGet<DatabaseError, GetProfileResponse>(`/profile/${userId}`)
  response
    .mapRight(({ data }) => dispatch(setProfileInfo({ ...data })))
    .mapLeft(e => console.log(e))

  dispatch(setLoading(false))
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

export const editProfile = async (editToken?: string): Promise<Either<any, AxiosResponse<number>>> => {
  if (!editToken) return left(new Error())
  return (await axiosPost<any, number>('/profile/edit', { token: editToken }))
}
