import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "../../../../common/types/user"

export interface UserState {
  currentUser: User
  errorMessage: string
  tokenError: string
  loading: boolean
  infoMessage: string
}

const initialState: UserState = {
  currentUser: {
    id: NaN,
    nickname: '',
    email: '',
    token: '',
    isAdmin: false,
    status: 'active'
  },
  errorMessage: '',
  tokenError: '',
  loading: false,
  infoMessage: ''
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthErrorMessage: (state, { payload: message }: PayloadAction<string>) => {
      state.errorMessage = message
    },
    setAuthLoading: (state, { payload }: PayloadAction<boolean | undefined>) => {
      if (payload !== undefined) state.loading = payload
      else state.loading = !state.loading
    },
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.currentUser = payload
    },
    logoutUser: state => {
      localStorage.removeItem('token')
      state.currentUser = initialState.currentUser
    },
    onTokenError: state => {
      localStorage.removeItem('token')
      state.currentUser = initialState.currentUser
      state.tokenError = 'Authorization error'
    },
    clearTokenError: state => {
      state.tokenError = ''
    },
    setAuthInfoMessage: (state, {payload}: PayloadAction<string>) => {
      state.infoMessage = payload
    }
  }
})

export const {
  setAuthLoading,
  setAuthErrorMessage,
  setUser,
  logoutUser,
  onTokenError,
  clearTokenError,
  setAuthInfoMessage
} = userSlice.actions

export const UserReducer = userSlice.reducer
