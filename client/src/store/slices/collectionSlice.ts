import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Collection, ItemConfigType } from "../../../../common/common-types"

export interface CollectionState {
  collection: Collection
  itemConfigs: ItemConfigType[]
}

const initialState: CollectionState = {
  collection: {
    id: NaN,
    userId: NaN,
    title: '',
    description: '',
    theme: '',
    imageUrl: '',
  },
  itemConfigs: []
}

export const userSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setCollectionData: (state, { payload }: PayloadAction<{collection: Collection, itemConfigs: ItemConfigType[]}>) => {
      state.collection = payload.collection
      state.itemConfigs = payload.itemConfigs
    }
  }
})

export const { setCollectionData } = userSlice.actions

export const CollectionReducer = userSlice.reducer
