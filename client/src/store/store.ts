import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { UserReducer } from "./slices/userSlice"
import { CollectionReducer } from "./slices/collectionSlice"
import { ProfileReducer } from "./slices/profileSlice"
import { AppReducer } from "./slices/appSlice"
import { ItemReducer } from "./slices/itemSlice"
import { AdminReducer } from "./slices/adminSlice"
import { MainReducer } from "./slices/mainSlice"


export const store = configureStore({
  reducer: {
    app: AppReducer,
    user: UserReducer,
    collection: CollectionReducer,
    item: ItemReducer,
    profile: ProfileReducer,
    admin: AdminReducer,
    main: MainReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['item/setSocket'],
      ignoredPaths: ['item.socket']
    },
  })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type GetState = () => RootState

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
