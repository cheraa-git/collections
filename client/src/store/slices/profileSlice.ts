import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ProfileUser } from "../../types/user"
import { Collection } from "../../../../common/common-types"

export interface ProfileState {
  profileUser: ProfileUser
  collections: Collection[]
}

const initialState: ProfileState = {
  profileUser: {
    id: NaN,
    nickname: '',
    avatar: '',
  },
  collections: []

}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileInfo: (state, { payload }: PayloadAction<{ collections: Collection[], user: ProfileUser }>) => {
      state.collections = payload.collections
      state.profileUser = payload.user
    }
  }
})

export const {setProfileInfo} = profileSlice.actions

export const ProfileReducer = profileSlice.reducer
