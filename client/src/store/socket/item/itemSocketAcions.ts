import { AppDispatch, GetState } from "../../store"
import { AppSocket } from "../../../types/socket"
import { io } from "socket.io-client"
import { commentSocketEvents, likeSocketEvents, socketEvents } from "./itemSocketEvents"
import { setCommentLoading, setLikesLoading } from "../../slices/itemSlice"


export const connectItemSocket = (itemId: number) => (dispatch: AppDispatch) => {
  const socket: AppSocket = io(process.env.REACT_APP_SOCKET_URL + '', { transports: ['websocket'] })
  dispatch(socketEvents(socket, itemId))
  dispatch(commentSocketEvents(socket))
  dispatch(likeSocketEvents(socket))
}

export const postNewComment = (itemId: number, text: string) => (dispatch: AppDispatch, getState: GetState) => {
  const { user: { currentUser: { id, token, nickname } }, item: { socket } } = getState()
  socket?.emit('add:comment', { token, userId: id, itemId, text, nickname })
  dispatch(setCommentLoading(true))
}

export const toggleLike = (itemId: number) => (dispatch: AppDispatch, getState: GetState) => {
  const { user: { currentUser: { id, token, nickname } }, item: { socket } } = getState()
  socket?.emit('set:like', { token, userId: id, itemId, nickname })
  dispatch(setLikesLoading(true))
}
