import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Comment, Item, Like, Tag } from "../../../../common/common-types"
import { AppSocket } from "../../types/socket"

export interface ItemState {
  items: Item[]
  comments: Comment[]
  socket: AppSocket | null
  likes: Like[]
  tags: Tag[]
  errorMessage: string
  loading: boolean
  commentLoading: boolean
  likesLoading: boolean
}

const initialState: ItemState = {
  socket: null,
  items: [],
  comments: [],
  likes: [],
  tags: [],
  errorMessage: '',
  loading: false,
  commentLoading: false,
  likesLoading: false
}

export const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    addItem: (state, { payload }: PayloadAction<Item>) => {
      if (!state.items.find(item => item.id === payload.id)) {
        state.items.push(payload)
      } else {
        state.items = state.items.map(item => item.id === payload.id ? payload : item)
      }
    },
    setItem: (state, { payload }: PayloadAction<Item>) => {
      state.items = state.items.map(item => item.id === payload.id ? payload : item)
    },
    setItems: (state, { payload }: PayloadAction<Item[]>) => {
      state.items = payload
    },
    setSocket: (state, { payload }: PayloadAction<AppSocket | null>) => {
      return { ...state, socket: payload }
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
    setLikes: (state, { payload }: PayloadAction<Like[]>) => {
      state.likes = payload
    },
    addLike: (state, { payload }: PayloadAction<Like>) => {
      if (!state.likes.find(like => like.id === payload.id)) {
        state.likes.push(payload)
      }
    },
    removeLike: (state, { payload }: PayloadAction<{ userId: number }>) => {
      state.likes = state.likes.filter(like => like.userId !== payload.userId)
    },
    setTags: (state, { payload }: PayloadAction<Tag[]>) => {
      state.tags = payload
    },
    setItemErrorMessage: (state, {payload}: PayloadAction<string>) => {
      state.errorMessage = payload
    },
    setItemLoading: (state, {payload}: PayloadAction<boolean>) => {
      state.loading = payload
    },
    setCommentLoading: (state, {payload}: PayloadAction<boolean>) => {
      state.commentLoading = payload
    },
    setLikesLoading: (state, {payload}: PayloadAction<boolean>) => {
      state.likesLoading = payload
    }

  }
})

export const {
  addItem,
  setItem,
  addComment,
  clearComments,
  setComments,
  setSocket,
  setItems,
  addLike,
  setLikes,
  removeLike,
  setTags,
  setItemErrorMessage,
  setItemLoading,
  setLikesLoading,
  setCommentLoading
} = itemSlice.actions

export const ItemReducer = itemSlice.reducer
