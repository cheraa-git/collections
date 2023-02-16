import { FC, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { formatDate } from "../../utils"
import { IconButton, TextField } from "@mui/material"
import { connectSocket, postNewComment } from "../../store/actions/itemActions"
import { useSnackbar } from "notistack"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { clearComments } from "../../store/slices/itemSlice"
import SendIcon from '@mui/icons-material/Send'


export const Comments: FC<{ itemId: number }> = ({ itemId }) => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const [commentValue, setCommentValue] = useState('')
  const { comments, socket } = useAppSelector((state: RootState) => state.item)

  useEffect(() => {
    if (!socket) {
      dispatch(connectSocket(itemId))
    }
    return () => {
      socket?.close()
      dispatch(clearComments)
    }
  }, [socket, dispatch, itemId])

  const addCommentHandler = () => {
    if (commentValue) {
      dispatch(postNewComment(itemId, commentValue))
      setCommentValue('')
    } else {
      snackbar('Enter the comment text')
    }
  }
  return (
    <div>
      <div className="border-t border-gray-300 mt-3 mb-3">
        <h2>Comments</h2>
        {comments?.map(comment => (
          <div key={comment.id} className="bg-white border-b px-4 py-1 flex">
            <Link to={`/profile/${comment.userId}`} className="link mr-3">{comment.nickname}:</Link>
            <p className="self-center">{comment.text}</p>
            <p className="ml-auto text-end text-xs min-w-[120px] ">{formatDate(comment.timestamp)}</p>
          </div>
        ))}
      </div>
      <div className="flex">
        <TextField value={commentValue} onChange={e => setCommentValue(e.target.value)}
                   fullWidth
                   size="small"
                   multiline
                   placeholder="Enter comment..."></TextField>
        <div className="h-min mt-auto ml-2">
          <IconButton onClick={addCommentHandler}><SendIcon/></IconButton>
        </div>
      </div>
    </div>
  )
}
