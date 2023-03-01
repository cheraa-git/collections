import { CreateItemPayload } from "../../types/collections"
import { setLoading, setUnknownError } from "../slices/appSlice"
import { CreateItemBody } from "../../../../common/request-types"
import { axiosDelete, axiosGet, axiosPatch, axiosPost } from "../../apis/axios/axios-app"
import { Item, Tag } from "../../../../common/common-types"
import { setItemConfigs } from "../slices/collectionSlice"
import { NavigateFunction } from "react-router-dom"
import { AppSocket } from "../../types/socket"
import { io } from "socket.io-client"
import {
  addComment,
  addItem,
  addLike,
  removeLike,
  setComments,
  setItem,
  setItemErrorMessage,
  setLikes,
  setSocket,
  setTags
} from "../slices/itemSlice"
import { AppDispatch, GetState } from "../store"
import { DatabaseError } from "../../../../common/errors/DatabaseError"
import { GetItemResponse } from "../../../../common/response-types"
import { TokenError } from "../../../../common/errors/TokenError"
import { onTokenError } from "../slices/userSlice"
import { NotFoundError } from "../../../../common/errors/NotFoundError"

export const createItem = (data: CreateItemPayload) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setLoading(true))
  const { id: userId, token } = getState().user.currentUser
  const sendData: CreateItemBody = { userId, token, ...data }
  const itemResponse = await axiosPost<DatabaseError | TokenError, Item>('/item', sendData)
  itemResponse
    .mapRight(({ data: item }) => dispatch(addItem(item)))
    .mapLeft(e => {
      if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
      else {
        console.log(e.response?.data)
        dispatch(setUnknownError(true))
      }
    })
  dispatch(setLoading(false))
}

export const getItem = (id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const itemResponse = await axiosGet<DatabaseError | NotFoundError, GetItemResponse>(`/item/${id}`)
  itemResponse
    .mapRight(({ data }) => {
      dispatch(addItem(data.item))
      dispatch(setItemConfigs(data.itemConfigs))
      dispatch(setLoading(false))
    })
    .mapLeft(e => {
      if (e.response?.data.name === 'NotFoundError') dispatch(setItemErrorMessage('Item not found'))
      if (e.response?.data.name === 'DatabaseError') {
        console.log(e.response?.data)
        dispatch(setUnknownError(true))
        dispatch(setLoading(false))
      }
    })
}


export const editItem = (item: Item) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setLoading(true))
  const token = getState().user.currentUser.token
  const itemResponse = await axiosPatch<TokenError | DatabaseError, Item>('/item', { item, token })
  itemResponse
    .mapRight(({ data: item }) => dispatch(setItem(item)))
    .mapLeft(e => {
      if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
      else {
        console.log(e.response?.data)
        dispatch(setUnknownError(true))
      }
    })
  dispatch(setLoading(false))
}

export const deleteItem = (item: Item, navigate: NavigateFunction) => {
  return async (dispatch: AppDispatch, getState: GetState) => {
    dispatch(setLoading(true))
    const token = getState().user.currentUser.token
    const response = await axiosDelete<TokenError | DatabaseError>('/item', { data: { item, token } })
    response
      .mapRight(() => navigate(`/collection/${item.collectionId}`))
      .mapLeft(e => {
        if (e.response?.data.name === 'TokenError') dispatch(onTokenError())
        else {
          console.log(e.response?.data)
          dispatch(setUnknownError(true))
        }
      })
    dispatch(setLoading(false))
  }
}

export const postNewComment = (itemId: number, text: string) => async (dispatch: AppDispatch, getState: GetState) => {
  const { user: { currentUser: { id, token, nickname } }, item: { socket } } = getState()
  socket?.emit('add:comment', { token, userId: id, itemId, text, nickname })
  dispatch(setLoading(true))
}

export const toggleLike = (itemId: number) => async (dispatch: AppDispatch, getState: GetState) => {
  const { user: { currentUser: { id, token, nickname } }, item: { socket } } = getState()
  socket?.emit('set:like', { token, userId: id, itemId, nickname })
  dispatch(setLoading(true))
}

export const connectSocket = (itemId: number) => async (dispatch: AppDispatch) => {
  const socket: AppSocket = io(process.env.REACT_APP_SOCKET_URL + '', { transports: ['websocket'] })
  socket.on('connect', () => {
    dispatch(setSocket(socket))
    socket.emit('get:comments', itemId)
    socket.emit('get:likes', itemId)
    console.log('connected', socket.id)
  })

  socket.on('comments', (comments) => {
    dispatch(setComments(comments))
    dispatch(setLoading(false))
  })

  socket.on('new_comment', (comment) => {
    dispatch(addComment(comment))
    dispatch(setLoading(false))
  })


  socket.on('likes', (likes) => {
    dispatch(setLikes(likes))
    dispatch(setLoading(false))
  })

  socket.on('like', (like) => {
    dispatch(addLike(like))
    dispatch(setLoading(false))
  })

  socket.on('cancel_like', (userId) => {
    dispatch(removeLike({ userId }))
    dispatch(setLoading(false))
  })

  socket.on('token_error', () => {
    socket.close()
    dispatch(setSocket(null))
    console.log("TOKEN ERROR")
  })

  socket.on('disconnect', () => {
    dispatch(setSocket(null))
    console.log('disconnect')
  })
  socket.on('connect_error', () => {
    dispatch(setSocket(null))
    socket.close()
    console.log('connect_error')
  })
}

export const getTags = () => async (dispatch: AppDispatch) => {
  (await axiosGet<DatabaseError, Tag[]>('/item/tags'))
    .mapRight(({ data: tags }) => dispatch(setTags(tags)))
    .mapLeft(e => console.log(e.response?.data))
}

