import { axiosPost } from "../../apis/axios/axios-app"
import { logoutUser, setAuthErrorMessage, setUser, toggleAuthLoading } from "../slices/userSlice"
import { AuthData } from "../../types/user"
import { apiRoutes } from "../../constants/routes"
import { AppDispatch } from "../store"
import { User } from "../../../../common/common-types"
import { AuthorizationError } from "../../../../common/errors/AuthorizationError"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { AutoLoginError } from "../../../../common/errors/AutoLoginError"


export const authUser = (type: 'login' | 'create', data: AuthData) => async (dispatch: AppDispatch) => {
  const url = type === 'login' ? apiRoutes.AUTH.LOGIN : apiRoutes.AUTH.REGISTER
  dispatch(toggleAuthLoading())
  const response = await axiosPost<AuthorizationError | DatabaseError, User>(url, data)
  response
    .mapRight(({ data: user }) => {
      localStorage.setItem('token', user.token)
      dispatch(setUser(user))
      console.log('AUTH', user)
    })
    .mapLeft(e => {
      if (e.response?.data.name === 'AuthorizationError') {
        dispatch(setAuthErrorMessage(e.response?.data.message))
      } else console.log(e.response?.data)
    })
  dispatch(toggleAuthLoading())
}

export const autoLogin = () => async (dispatch: AppDispatch) => {
  const token = localStorage.getItem('token')
  if (!token) return
  const response = await axiosPost<AutoLoginError, User>(apiRoutes.AUTH.AUTOLOGIN, { token })
  response
    .mapRight(({ data: user }) => dispatch(setUser(user)))
    .mapLeft(() => dispatch(logoutUser()))
}



