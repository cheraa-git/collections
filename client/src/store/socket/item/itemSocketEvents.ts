import { AppSocket } from "../../../types/socket"
import { AppDispatch } from "../../store"
import {
  addComment,
  addLike,
  removeLike,
  setCommentLoading,
  setComments,
  setLikes,
  setLikesLoading,
  setSocket
} from "../../slices/itemSlice"
import { onTokenError } from "../../slices/userSlice"

export const socketEvents = (socket: AppSocket, itemId: number) => (dispatch: AppDispatch) => {
  socket.on('connect', () => {
    dispatch(setSocket(socket))
    socket.emit('get:comments', itemId)
    socket.emit('get:likes', itemId)
    dispatch(setCommentLoading(true))
    dispatch(setLikesLoading(true))
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
    dispatch(setCommentLoading(false))
  })

  socket.on('new_comment', (comment) => {
    dispatch(addComment(comment))
    dispatch(setCommentLoading(false))
  })
}

export const likeSocketEvents = (socket: AppSocket) => (dispatch: AppDispatch) => {
  socket.on('likes', (likes) => {
    dispatch(setLikes(likes))
    dispatch(setLikesLoading(false))
  })

  socket.on('like', (like) => {
    dispatch(addLike(like))
    dispatch(setLikesLoading(false))
  })

  socket.on('cancel_like', (userId) => {
    dispatch(removeLike({ userId }))
    dispatch(setLikesLoading(false))
  })
}
