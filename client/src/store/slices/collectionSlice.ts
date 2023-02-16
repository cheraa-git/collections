import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Collection, ItemConfigType, Theme } from "../../../../common/common-types"

export interface CollectionState {
  collection: Collection
  itemConfigs: ItemConfigType[]
  themes: Theme[]

}

const initialState: CollectionState = {
  collection: {
    id: NaN,
    userId: NaN,
    title: '',
    description: '',
    themeId: NaN,
    imageUrl: '',
    timestamp: '',
  },
  itemConfigs: [],
  themes: [],
}

export const userSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setCollectionData: (state, { payload }:
      PayloadAction<{ collection: Collection, itemConfigs: ItemConfigType[] }>) => {
      state.collection = payload.collection
      state.itemConfigs = payload.itemConfigs
    },

    setItemConfigs: (state, { payload }: PayloadAction<ItemConfigType[]>) => {
      state.itemConfigs = payload
    },
    clearCollectionData: (state) => {
      return { ...initialState, themes: state.themes }
    },

    setThemes: (state, { payload }: PayloadAction<Theme[]>) => {
      state.themes = payload
    },

  }
})

export const { setCollectionData, setItemConfigs, clearCollectionData, setThemes, } = userSlice.actions

export const CollectionReducer = userSlice.reducer
