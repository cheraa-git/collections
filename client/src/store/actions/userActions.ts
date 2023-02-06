import { AppDispatch } from "../store"
import axios from "../../axios-app"
import { AxiosError } from "axios"
import { logoutUser, setErrorMessage, setUser, toggleAuthLoading } from "../slices/userSlice"
import { AuthData, User } from "../../types/user"
import { apiRoutes } from "../../constants/routes"


export const authUser = (type: 'login' | 'create', data: AuthData) => async (dispatch: AppDispatch) => {
  const url = type === 'login' ? apiRoutes.AUTH.LOGIN : apiRoutes.AUTH.REGISTER
  dispatch(toggleAuthLoading())
  try {
    const user = (await axios.post<User>(url, data)).data
    localStorage.setItem('token', user.token)
    dispatch(setUser(user))
    console.log(user)
  } catch (error) {
    if (error instanceof AxiosError) {
      dispatch(setErrorMessage(error.response?.data.error))
    }
    console.log(error)
  } finally {
    dispatch(toggleAuthLoading())
  }
}

export const autoLogin = () => async (dispatch: AppDispatch) => {
  const token = localStorage.getItem('token')
  if (!token) return
  try {
    const user = (await axios.post<User>(apiRoutes.AUTH.AUTOLOGIN, {token})).data
    dispatch(setUser(user))
  } catch (error) {
    dispatch(logoutUser())
    console.log(error)
  }
}

