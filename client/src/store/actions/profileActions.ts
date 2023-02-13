import { AppDispatch } from "../store"
import axios from "../../axios-app"
import { setProfileInfo } from "../slices/profileSlice"
import { GetProfileResponse } from "../../../../common/response-types"
import { setLoading } from "../slices/appSlice"

export const getProfile = (userId: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const profile = (await axios.get<GetProfileResponse>(`/profile/${userId}`)).data
  dispatch(setProfileInfo({ collections: profile.collections, user: profile.user }))
  dispatch(setLoading(false))
}
