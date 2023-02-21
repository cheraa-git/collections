import { FC, useEffect, useState } from "react"
import { dateTimeFormat } from "../../utils"
import { Box, Divider, IconButton, TextField, Typography } from "@mui/material"
import { connectSocket, postNewComment } from "../../store/actions/itemActions"
import { useSnackbar } from "notistack"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { clearComments } from "../../store/slices/itemSlice"
import SendIcon from '@mui/icons-material/Send'
import { TypographyLink } from "../UI/TypographyLink"


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
    <>
      <Divider/>
      <Box my={2}>
        <Typography variant="h6">Comments</Typography>
        {comments?.map(({ id, userId, nickname, text, timestamp }) => (
          <Box py={1} key={id} className="border-b flex">
            <TypographyLink mr={1} to={`/profile/${userId}`}>{nickname}:</TypographyLink>
            <Typography alignSelf="center">{text}</Typography>
            <Typography fontSize="x-small" ml="auto" minWidth={90}>{dateTimeFormat(timestamp)}</Typography>
          </Box>
        ))}
      </Box>
      <TextField size="small" multiline fullWidth placeholder="Enter comment..."
                 value={commentValue}
                 onChange={e => setCommentValue(e.target.value)}
                 InputProps={{
                   endAdornment: <IconButton sx={{mt: 'auto'}} onClick={addCommentHandler}><SendIcon/></IconButton>
                 }}
      />
    </>
  )
}
