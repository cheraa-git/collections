import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from "../../types/user"

export interface UserState {
  currentUser: User
  errorMessage: string
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
  loading: false,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setErrorMessage: (state, { payload: message }: PayloadAction<string>) => {
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
    }
  }
})

export const { toggleAuthLoading, setErrorMessage, setUser, logoutUser } = userSlice.actions

export const UserReducer = userSlice.reducer
