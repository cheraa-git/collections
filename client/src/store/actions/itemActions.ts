import { CreateItemPayload } from "../../types/collections"
import { setLoading } from "../slices/appSlice"
import { CreateItemBody } from "../../../../common/request-types"
import axios from "../../axios-app"
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
  setLikes,
  setSocket,
  setTags
} from "../slices/itemSlice"
import { AppDispatch, GetState } from "../store"

export const createItem = (data: CreateItemPayload) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setLoading(true))
  const { id: userId, token } = getState().user.currentUser
  const sendData: CreateItemBody = { userId, token, ...data }
  const item = (await axios.post<Item>('/item', sendData)).data
  dispatch(setLoading(false))
  dispatch(addItem(item))
  console.log('CREATE_ITEM', item)
}

export const getItem = (collectionId: number, id: number) => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true))
  const item = (await axios.get(`/item/${collectionId}/${id}`)).data
  dispatch(addItem(item.item))
  dispatch(setItemConfigs(item.itemConfigs))
  dispatch(setLoading(false))
  console.log('GET_ITEM', item)
}


export const editItem = (item: Item) => async (dispatch: AppDispatch, getState: GetState) => {
  dispatch(setLoading(true))
  const token = getState().user.currentUser.token
  const response = await axios.patch<Item>('/item', { item, token })
  dispatch(setItem(response.data))
  dispatch(setLoading(false))
}

export const deleteItem = (item: Item, navigate: NavigateFunction) => {
 return  async (dispatch: AppDispatch, getState: GetState) => {
    dispatch(setLoading(true))
    const token = getState().user.currentUser.token
    //TODO: удалить картинку из firebase
    const response = await axios.delete('/item', { data: { item, token } })
    console.log('DELETE', response.data)
    navigate(`/collection/${item.collectionId}`)
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
  const tags = (await axios.get<Tag[]>('/item/tags')).data
  dispatch(setTags(tags))
}

