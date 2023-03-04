import { axiosPost } from "../../apis/axios/axios-app"
import { logoutUser, setAuthErrorMessage, setAuthInfoMessage, setUser, toggleAuthLoading } from "../slices/userSlice"
import { AppDispatch } from "../store"
import { AuthorizationError } from "../../../../common/errors/AuthorizationError"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { AutoLoginError } from "../../../../common/errors/AutoLoginError"
import { Either, left } from "@sweet-monads/either"
import { AxiosResponse } from "axios"
import { AuthData, User } from "../../../../common/types/user"


export const sendRegisterConfirm = (data: AuthData) => {
  return async (dispatch: AppDispatch) => {
    dispatch(toggleAuthLoading())
    const response = await axiosPost<AuthorizationError | DatabaseError>('/auth/confirm_register', data)
    response
      .mapRight(() => dispatch(setAuthInfoMessage(
        'An email has been sent to your email. Follow the link from the email to complete the registration'
      )))
      .mapLeft(e => {
        if (e.response?.data.name === 'AuthorizationError') {
          dispatch(setAuthErrorMessage(e.response?.data.message))
        } else console.log(e.response?.data)
      })
    dispatch(toggleAuthLoading())
  }
}


export const registerUser = async (registerToken?: string): Promise<Either<any, AxiosResponse<User>>> => {
  if (!registerToken) return left(new Error())
  return (await axiosPost<any, User>('/auth/register', { token: registerToken }))
}

export const loginUser = (data: AuthData) => async (dispatch: AppDispatch) => {
  dispatch(toggleAuthLoading())
  const response = await axiosPost<AuthorizationError | DatabaseError, User>('/auth/login', data)
  response
    .mapRight(({ data: user }) => {
      localStorage.setItem('token', user.token)
      dispatch(setUser(user))
    })
    .mapLeft(e => {
      if (e.response?.data.name === 'AuthorizationError') {
        dispatch(setAuthErrorMessage(e.response?.data.message))
      } else console.log(e.response?.data)
    })
}

export const autoLogin = () => async (dispatch: AppDispatch) => {
  const token = localStorage.getItem('token')
  if (!token) return
  const response = await axiosPost<AutoLoginError, User>('/auth/autologin', { token })
  response
    .mapRight(({ data: user }) => dispatch(setUser(user)))
    .mapLeft(() => dispatch(logoutUser()))
}



