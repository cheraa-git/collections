import { FC, useEffect, useState } from "react"
import { dateTimeFormat } from "../../utils"
import { Box, Divider, IconButton, TextField, Typography } from "@mui/material"
import { connectSocket, postNewComment } from "../../store/actions/itemActions"
import { useSnackbar } from "notistack"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { clearComments } from "../../store/slices/itemSlice"
import SendIcon from '@mui/icons-material/Send'
import { TypographyLink } from "../../common/TypographyLink"
import { Text } from "../../common/Text"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../hooks/authHook"


export const Comments: FC<{ itemId: number }> = ({ itemId }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const { comments, socket } = useAppSelector((state: RootState) => state.item)
  const { isAuth } = useAuth()
  const [commentValue, setCommentValue] = useState('')

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
    if (commentValue.trim()) {
      dispatch(postNewComment(itemId, commentValue))
      setCommentValue('')
    } else {
      snackbar(t('Enter the comment text'))
    }
  }
  return (
    <>
      <Divider/>
      <Box my={2}>
        <Text variant="h6">Comments</Text>
        {comments?.map(({ id, userId, nickname, text, timestamp }) => (
          <Box py={1} key={id} className="border-b flex">
            <TypographyLink mr={1} to={`/profile/${userId}`}>{nickname}:</TypographyLink>
            <Typography alignSelf="center">{text}</Typography>
            <Typography fontSize="x-small" ml="auto" minWidth={90}>{dateTimeFormat(timestamp)}</Typography>
          </Box>
        ))}
      </Box>
      {comments.length === 0 && <Text color="gray" textAlign="center" mb={3}>There are no comments yet</Text>}
      {
        isAuth &&
        <TextField size="small" multiline fullWidth placeholder={t("Enter comment...") || ''}
                   value={commentValue}
                   onChange={e => setCommentValue(e.target.value)}
                   InputProps={{
                     endAdornment: <IconButton sx={{ mt: 'auto' }} onClick={addCommentHandler}><SendIcon/></IconButton>
                   }}
        />
      }
    </>
  )
}