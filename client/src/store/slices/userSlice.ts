import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "../../../../common/common-types"

export interface UserState {
  currentUser: User
  errorMessage: string
  tokenError: string
  loading: boolean
}

const initialState: UserState = {
  currentUser: {
    id: NaN,
    nickname: '',
    email: '',
    token: '',
    avatar: '',
    isAdmin: false,
    status: 'active'
  },
  errorMessage: '',
  tokenError: '',
  loading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setAuthErrorMessage: (state, { payload: message }: PayloadAction<string>) => {
      state.errorMessage = message
    },
    toggleAuthLoading: (state, { payload }: PayloadAction<boolean | undefined>) => {
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
    }
  }
})

export const { toggleAuthLoading, setAuthErrorMessage, setUser, logoutUser, onTokenError } = userSlice.actions

export const UserReducer = userSlice.reducer
