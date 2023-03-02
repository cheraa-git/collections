import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Collection, ProfileUser } from "../../../../common/common-types"

export interface ProfileState {
  profileUser: ProfileUser
  collections: Collection[]
  errorMessage: string
  loading: boolean
}

const initialState: ProfileState = {
  profileUser: {
    id: NaN,
    nickname: '',
    avatarUrl: '',
    status: 'active',
    isAdmin: false,
    email: ''
  },
  collections: [],
  errorMessage: '',
  loading: false

}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileInfo: (state, { payload }: PayloadAction<{ collections: Collection[], user: ProfileUser }>) => {
      state.collections = payload.collections
      state.profileUser = payload.user
    },
    setProfileErrorMessage: (state, { payload }: PayloadAction<string>) => {
      state.errorMessage = payload
    },
    setProfileAvatar: (state, { payload }: PayloadAction<string>) => {
      state.profileUser.avatarUrl = payload
    },
    setProfileLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.loading = payload
    }
  }
})

export const { setProfileInfo, setProfileErrorMessage, setProfileAvatar, setProfileLoading } = profileSlice.actions

export const ProfileReducer = profileSlice.reducer
