import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Comment, Item } from "../../../../common/common-types"
import { AppSocket } from "../../types/socket"

export interface ItemState {
  items: Item[]
  comments: Comment[]
  socket: AppSocket | null
}

const initialState: ItemState = {
  items: [],
  comments: [],
  socket: null
}

export const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    addItem: (state, { payload }: PayloadAction<Item>) => {
      if (!state.items.find(item => item.id === payload.id)) {
        state.items.push(payload)
      }
    },
    setItem: (state, { payload }: PayloadAction<Item>) => {
      state.items = state.items.map(item => item.id === payload.id ? payload : item)
    },
    setItems: (state, { payload }: PayloadAction<Item[]>) => {
      state.items = payload
    },
    setComments: (state, { payload }: PayloadAction<Comment[]>) => {
      state.comments = payload
    },
    addComment: (state, { payload }: PayloadAction<Comment>) => {
      if (!state.comments.find(comment => comment.id === payload.id)) {
        state.comments.push(payload)
      }
    },
    clearComments: (state) => {
      state.comments = []
    },
    setSocket: (state, { payload }: PayloadAction<AppSocket | null>) => {
      return { ...state, socket: payload }
    },
  }
})

export const { addItem, setItem, addComment, clearComments, setComments, setSocket, setItems } = itemSlice.actions

export const ItemReducer = itemSlice.reducer
