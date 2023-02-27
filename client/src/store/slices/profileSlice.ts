import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ProfileUser } from "../../types/user"
import { Collection } from "../../../../common/common-types"

export interface ProfileState {
  profileUser: ProfileUser
  collections: Collection[]
  errorMessage: string
}

const initialState: ProfileState = {
  profileUser: {
    id: NaN,
    nickname: '',
    avatar: '',
    status: 'active'
  },
  collections: [],
  errorMessage: ''

}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileInfo: (state, { payload }: PayloadAction<{ collections: Collection[], user: ProfileUser }>) => {
      state.collections = payload.collections
      state.profileUser = payload.user
    },
    setProfileErrorMessage: (state, {payload}: PayloadAction<string>) => {
      state.errorMessage = payload
    }
  }
})

export const {setProfileInfo, setProfileErrorMessage} = profileSlice.actions

export const ProfileReducer = profileSlice.reducer
