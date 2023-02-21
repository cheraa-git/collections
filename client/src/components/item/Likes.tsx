import { FC } from "react"
import { useAuth } from "../../hooks/authHook"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { IconButton, Typography } from "@mui/material"
import { toggleLike } from "../../store/actions/itemActions"
import { FavoriteBorderIcon, FavoriteIcon } from "../UI/icons"

export const Likes: FC<{ itemId: number }> = ({ itemId }) => {
  const dispatch = useAppDispatch()
  const { id: userId } = useAuth().currentUser
  const { likes } = useAppSelector((state: RootState) => state.item)
  const isLiked = !!likes.find(like => like.userId === userId)


  const likeHandler = () => {
    dispatch(toggleLike(itemId))
  }

  return (
    <>
      <IconButton onClick={likeHandler}>
        {isLiked ? <FavoriteIcon className="red"/> : <FavoriteBorderIcon/>}
        <Typography >{likes.length}</Typography>
      </IconButton>
    </>
  )
}
