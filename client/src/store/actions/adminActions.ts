import axios from "../../axios-app"
import { setAdmin, setStatus, setUsers } from "../slices/adminSlice"
import { setLoading } from "../slices/appSlice"
import { User } from "../../types/user"
import { AppDispatch, GetState, RootState } from "../store"

export const getUsers = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const users = await axios.get('/admin/users')
  dispatch(setUsers(users.data))
  console.log(users.data)
  dispatch(setLoading(false))
}

export const setUsersStatus = (ids: number[], status: User['status']) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setLoading(true))
    const token = getState().user.currentUser.token
    const response = await axios.post('/admin/users/status', { token, status, userIds: ids })
    console.log(response.data)
    dispatch(setStatus({ ids: response.data, status }))
    dispatch(setLoading(false))
  }
}

export const setAdminStatus = (ids: number[], status: boolean) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setLoading(true))
    const token = getState().user.currentUser.token
    const response = await axios.post('/admin/users/admin_status', { token, status, userIds: ids })
    console.log(response.data)
    dispatch(setAdmin({ ids: response.data, status }))
    dispatch(setLoading(false))
  }
}

export const indexing = (type: 'items' | 'collections' | 'comments') => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    const token = getState().user.currentUser.token
    try {
      const response = await axios.post(`/admin/indexing/${type}`, { token })
      console.log(`INDEXING ${type}`, response.data)
    } catch (err) {
      console.log(`INDEXING ${type}`, err)
    }
  }
}

