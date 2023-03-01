import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Collection, Item } from "../../../../common/common-types"

export interface MainState {
  errorMessage: string
  collections: Collection[]
  items: Item[],
  hasMoreItems: boolean
  hasMoreCollections: boolean
}

const initialState: MainState = {
  errorMessage: '',
  collections: [],
  items: [],
  hasMoreCollections: true,
  hasMoreItems: true
}

export const mainSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setMainErrorMessage: (state, { payload }: PayloadAction<string>) => {
      state.errorMessage = payload
    },
    addMainCollections: (state, { payload }: PayloadAction<Collection[]>) => {
      if (state.collections.length === 0) return { ...state, collections: payload }
      const newCollections = payload.filter(newCollection => {
        if (!state.collections?.find(collection => collection.id === newCollection.id)) return newCollection
      })
      state.collections = [ ...state.collections, ...newCollections ]
    },
    addMainItems: (state, { payload }: PayloadAction<Item[]>) => {
      if (state.items.length === 0) return { ...state, items: payload }
      const newItems = payload.filter(newItem => {
        if (!state.items?.find(item => item.id === newItem.id)) return newItem
      })
      state.items = [ ...state.items, ...newItems ]
    },
    setHasManyCollections: (state, { payload }: PayloadAction<boolean>) => {
      state.hasMoreCollections = payload
    },
    setHasManyItems: (state, { payload }: PayloadAction<boolean>) => {
      state.hasMoreItems = payload
    }
  }
})

export const {
  setMainErrorMessage,
  addMainItems,
  addMainCollections,
  setHasManyItems,
  setHasManyCollections
} = mainSlice.actions

export const MainReducer = mainSlice.reducer
