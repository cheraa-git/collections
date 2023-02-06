import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { UserReducer } from "./slices/userSlice"
import { CollectionReducer } from "./slices/collectionSlice"
import { ProfileReducer } from "./slices/profileSlice"


export const store = configureStore({
  reducer: {
    user: UserReducer,
    collection: CollectionReducer,
    profile: ProfileReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector