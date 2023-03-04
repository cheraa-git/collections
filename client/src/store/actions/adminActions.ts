import { axiosGet, axiosPost } from "../../apis/axios/axios-app"
import { setAdmin, setAdminLoading, setStatus, setUsers } from "../slices/adminSlice"
import { setUnknownError } from "../slices/appSlice"
import { AppDispatch, RootState } from "../store"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { TokenError } from "../../../../common/errors/TokenError"
import { onTokenError } from "../slices/userSlice"
import { User, UserStatus } from "../../../../common/types/user"


export const getUsers = () => async (dispatch: AppDispatch) => {
  dispatch(setAdminLoading(true))
  const users = (await axiosGet<DatabaseError, User[]>('/admin/users'))
  users
    .mapRight(r => dispatch(setUsers(r.data)))
    .mapLeft(e => console.log(e.response?.data))
  dispatch(setAdminLoading(false))
}

export const setUsersStatus = (ids: number[], status: UserStatus) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setAdminLoading(true))
    const token = getState().user.currentUser.token
    const response = await axiosPost<TokenError | DatabaseError, number[]>('/admin/users/status', {
      token, status, userIds: ids
    })
    response
      .mapRight(r => dispatch(setStatus({ ids: r.data, status })))
      .mapLeft(e => {
        if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
        else {
          console.log(e.response?.data)
          dispatch(setUnknownError(true))
        }
      })
    dispatch(setAdminLoading(false))
  }
}

export const setAdminStatus = (ids: number[], status: boolean) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setAdminLoading(true))
    const token = getState().user.currentUser.token
    const response = await axiosPost<TokenError | DatabaseError, number[]>('/admin/users/admin_status', {
      token, status, userIds: ids
    })
    response
      .mapRight(r => dispatch(setAdmin({ ids: r.data, status })))
      .mapLeft(e => {
        if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
        else {
          console.log(e.response?.data)
          dispatch(setUnknownError(true))
        }
      })
    dispatch(setAdminLoading(false))
  }
}


