import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User, UserStatus } from "../../../../common/types/user"

export interface AdminState {
  users: Omit<User, 'token'>[]
  loading: boolean
}

const initialState: AdminState = {
  users: [],
  loading: false,
}

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setUsers: (state, { payload }: PayloadAction<Omit<User, 'token'>[]>) => {
      state.users = payload
    },
    setStatus: (state, { payload }: PayloadAction<{ ids: number[], status: UserStatus }>) => {
      state.users = state.users.map(user => {
        if (payload.ids.includes(user.id)) {
          user.status = payload.status
        }
        return user
      })
    },
    setAdmin: (state, { payload }: PayloadAction<{ ids: number[], status: boolean }>) => {
      state.users = state.users.map(user => {
        if (payload.ids.includes(user.id)) {
          user.isAdmin = payload.status
        }
        return user
      })
    },
    setAdminLoading: (state, {payload}: PayloadAction<boolean>) => {
      state.loading = payload
    }
  }
})

export const { setUsers, setStatus, setAdmin, setAdminLoading } = adminSlice.actions

export const AdminReducer = adminSlice.reducer
