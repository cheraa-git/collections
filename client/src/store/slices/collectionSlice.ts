import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Collection, Item, ItemConfigType, Theme } from "../../../../common/common-types"

export interface CollectionState {
  collection: Collection
  itemConfigs: ItemConfigType[]
  items: Item[]
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
  items: [],
  themes: []
}

export const userSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setCollectionData: (state, { payload }:
      PayloadAction<{ collection: Collection, itemConfigs: ItemConfigType[], items: Item[] }>) => {
      state.collection = payload.collection
      state.itemConfigs = payload.itemConfigs
      state.items = payload.items
    },
    addItem: (state, { payload }: PayloadAction<Item>) => {
      if (!state.items.find(item => item.id === payload.id)) {
        state.items.push(payload)
      }
    },
    setItemConfigs: (state, { payload }: PayloadAction<ItemConfigType[]>) => {
      state.itemConfigs = payload
    },
    clearCollectionData: (state) => {
      return { ...initialState, themes: state.themes }
    },
    setItem: (state, { payload }: PayloadAction<Item>) => {
      state.items = state.items.map(item => item.id === payload.id ? payload : item)
    },
    setThemes: (state, { payload }: PayloadAction<Theme[]>) => {
      state.themes = payload
    },
  }
})

export const { setCollectionData, addItem, setItemConfigs, clearCollectionData, setItem, setThemes } = userSlice.actions

export const CollectionReducer = userSlice.reducer
