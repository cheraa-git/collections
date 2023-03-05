import { axiosPost } from "../../apis/axios/axios-app"
import { logoutUser, setAuthErrorMessage, setAuthInfoMessage, setAuthLoading, setUser } from "../slices/userSlice"
import { AppDispatch } from "../store"
import { AuthorizationError } from "../../../../common/errors/AuthorizationError"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { AutoLoginError } from "../../../../common/errors/AutoLoginError"
import { Either, left } from "@sweet-monads/either"
import { AxiosResponse } from "axios"
import { AuthData, AuthProviderName, User } from "../../../../common/types/user"
import { authProvider } from "../../apis/firebase/actions/auth"
import { setUnknownError } from "../slices/appSlice"
import { AuthByProviderBody } from "../../../../common/types/request-body-types/auth"
import { ProviderType } from "../../apis/firebase/firebase"


export const sendRegisterConfirm = (data: AuthData) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setAuthLoading(true))
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
    dispatch(setAuthLoading(false))
  }
}


export const registerUser = async (registerToken?: string): Promise<Either<any, AxiosResponse<User>>> => {
  if (!registerToken) return left(new Error())
  return (await axiosPost<any, User>('/auth/register', { token: registerToken }))
}

export const loginUser = (data: AuthData) => async (dispatch: AppDispatch) => {
  dispatch(setAuthLoading(true))
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
  dispatch(setAuthLoading(false))
}

export const autoLogin = () => async (dispatch: AppDispatch) => {
  const token = localStorage.getItem('token')
  if (!token) return
  const response = await axiosPost<AutoLoginError, User>('/auth/autologin', { token })
  response
    .mapRight(({ data: user }) => dispatch(setUser(user)))
    .mapLeft(() => dispatch(logoutUser()))
}

export const authByProvider = (provider: ProviderType, providerName: AuthProviderName) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setAuthLoading(true))
    const googleResponse = await authProvider(provider, providerName)
    googleResponse
      .mapLeft((e) => {
        if (e.code === 'auth/account-exists-with-different-credential') {
          return dispatch(setAuthErrorMessage('The account is already registered using another service'))
        }
        dispatch(setUnknownError(true))
        dispatch(setAuthLoading(false))
      })
      .mapRight(async (data) => {
        const userResponse = await axiosPost<DatabaseError, User, AuthByProviderBody>('/auth/provider', { ...data })
        userResponse
          .mapRight(({ data: user }) => {
            localStorage.setItem('token', user.token)
            dispatch(setUser(user))
            dispatch(setAuthLoading(false))
          })
          .mapLeft(() => dispatch(setUnknownError(true)))
      })
  }
}




