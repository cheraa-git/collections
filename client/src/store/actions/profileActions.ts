import { axiosGet } from "../../apis/axios/axios-app"
import { setProfileInfo } from "../slices/profileSlice"
import { setLoading } from "../slices/appSlice"
import { AppDispatch } from "../store"
import { GetProfileResponse } from "../../../../common/response-types"
import { DatabaseError } from "../../../../common/errors/DatabaseError"

export const getProfile = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const response = await axiosGet<DatabaseError, GetProfileResponse>(`/profile/${userId}`)
  response
    .mapRight(({ data }) => dispatch(setProfileInfo({ ...data })))
    .mapLeft(e => console.log(e))

  dispatch(setLoading(false))
}
