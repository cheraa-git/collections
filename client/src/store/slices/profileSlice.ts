import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ProfileUser } from "../../../../common/types/user"
import { Collection } from "../../../../common/types/collection"

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
    },
    setProfileUser: (state, { payload }: PayloadAction<ProfileUser>) => {
      state.profileUser = payload
    }
  }
})

export const {
  setProfileInfo,
  setProfileErrorMessage,
  setProfileAvatar,
  setProfileLoading,
  setProfileUser
} = profileSlice.actions

export const ProfileReducer = profileSlice.reducer
