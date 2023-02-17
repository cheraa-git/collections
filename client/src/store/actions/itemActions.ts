import { CreateItemPayload } from "../../types/collections"
import { AppDispatch, RootState } from "../store"
import { setLoading } from "../slices/appSlice"
import { CreateItemBody } from "../../../../common/request-types"
import axios from "../../axios-app"
import { Item } from "../../../../common/common-types"
import { setItemConfigs } from "../slices/collectionSlice"
import { NavigateFunction } from "react-router-dom"
import { AppSocket } from "../../types/socket"
import { io } from "socket.io-client"
import { addComment, addItem, setComments, setItem, setSocket } from "../slices/itemSlice"

export const createItem = (data: CreateItemPayload) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setLoading(true))
  const { id: userId, token } = getState().user.currentUser
  const sendData: CreateItemBody = { userId, token, ...data, tags: '' }
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


export const editItem = (item: Item) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setLoading(true))
  const token = getState().user.currentUser.token
  const response = await axios.patch<Item>('/item', { item, token })
  dispatch(setItem(response.data))
  dispatch(setLoading(false))
}

export const deleteItem = (item: Item, navigate: NavigateFunction) => async (dispatch: AppDispatch, getState: () => RootState) => {
  dispatch(setLoading(true))
  const token = getState().user.currentUser.token
  //TODO: удалить картинку из firebase
  const response = await axios.delete('/item', { data: { item, token } })
  console.log('DELETE', response.data)
  navigate(`/collection/${item.collectionId}`)
  dispatch(setLoading(false))
}

export const postNewComment = (itemId: number, text: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { user: { currentUser: { id, token, nickname } }, item: { socket } } = getState()
  socket?.emit('add:comment', token, id, itemId, text, nickname)
  dispatch(setLoading(true))
}

export const connectSocket = (itemId: number) => async (dispatch: AppDispatch,) => {
  const socket: AppSocket = io(process.env.REACT_APP_SOCKET_URL + '', { transports: ['websocket'] })
  socket.on('connect', () => {
    dispatch(setSocket(socket))
    socket.emit('get:comments', itemId)
    console.log('connected', socket.id)
  })

  socket.on('comments', (comments) => {
    dispatch(setComments(comments))
    console.log('SOCKET_COMMENTS', comments)
  })

  socket.on('new_comment', (comment) => {
    dispatch(addComment(comment))
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

