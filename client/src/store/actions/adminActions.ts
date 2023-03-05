import { axiosGet, axiosPost } from "../../apis/axios/axios-app"
import { setAdmin, setAdminLoading, setStatus, setUsers } from "../slices/adminSlice"
import { setUnknownError } from "../slices/appSlice"
import { AppDispatch, GetState } from "../store"
import { DbError } from "../../../../common/errors/DbError"
import { TokenError } from "../../../../common/errors/TokenError"
import { onTokenError } from "../slices/userSlice"
import { User, UserStatus } from "../../../../common/types/user"
import { SetAdminStatusBody, SetUsersStatusBody } from "../../../../common/types/request-body-types/admin-body"


export const getUsers = () => async (dispatch: AppDispatch) => {
  dispatch(setAdminLoading(true))
  const response = (await axiosGet<DbError, User[]>('/admin/users'))
  response
    .mapRight(r => dispatch(setUsers(r.data)))
    .mapLeft(e => console.log(e.response?.data))
  dispatch(setAdminLoading(false))
}

export const setUsersStatus = (ids: number[], status: UserStatus) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    dispatch(setAdminLoading(true))
    const token = getState().user.currentUser.token
    const response = await axiosPost<TokenError | DbError, number[], SetUsersStatusBody>('/admin/users/status', {
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
  return async (dispatch: AppDispatch, getState: GetState) => {
    dispatch(setAdminLoading(true))
    const token = getState().user.currentUser.token
    const response = await axiosPost<TokenError | DbError, number[], SetAdminStatusBody>('/admin/users/admin_status', {
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


