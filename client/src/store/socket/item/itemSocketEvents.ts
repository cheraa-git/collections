import { AppSocket } from "../../../types/socket"
import { AppDispatch } from "../../store"
import { addComment, addLike, removeLike, setComments, setLikes, setSocket } from "../../slices/itemSlice"
import { onTokenError } from "../../slices/userSlice"
import { setLoading } from "../../slices/appSlice"

export const socketEvents = (socket: AppSocket, itemId: number) => (dispatch: AppDispatch) => {
  socket.on('connect', () => {
    dispatch(setSocket(socket))
    socket.emit('get:comments', itemId)
    socket.emit('get:likes', itemId)
  })

  socket.on('token_error', () => {
    socket.close()
    dispatch(onTokenError())
  })

  socket.on('disconnect', () => {
    dispatch(setSocket(null))
  })
  socket.on('connect_error', () => {
    dispatch(setSocket(null))
    socket.close()
    console.log('connect_error')
  })
}

export const commentSocketEvents = (socket: AppSocket) => (dispatch: AppDispatch) => {
  socket.on('comments', (comments) => {
    dispatch(setComments(comments))
    dispatch(setLoading(false))
  })

  socket.on('new_comment', (comment) => {
    dispatch(addComment(comment))
    dispatch(setLoading(false))
  })
}

export const likeSocketEvents = (socket: AppSocket) => (dispatch: AppDispatch) => {
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
}
