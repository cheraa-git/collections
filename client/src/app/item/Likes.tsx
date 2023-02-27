import { FC } from "react"
import { useAuth } from "../../hooks/authHook"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { IconButton, Typography } from "@mui/material"
import { toggleLike } from "../../store/actions/itemActions"
import { FavoriteBorderIcon, FavoriteIcon } from "../../common/icons"

export const Likes: FC<{ itemId: number }> = ({ itemId }) => {
  const dispatch = useAppDispatch()
  const { currentUser, isAuth } = useAuth()
  const { likes } = useAppSelector((state: RootState) => state.item)
  const isLiked = !!likes.find(like => like.userId === currentUser.id)


  const likeHandler = () => {
    dispatch(toggleLike(itemId))
  }

  return (
    <>
      <IconButton onClick={likeHandler} disabled={!isAuth}>
        {isLiked ? <FavoriteIcon className="red"/> : <FavoriteBorderIcon/>}
        <Typography >{likes.length}</Typography>
      </IconButton>
    </>
  )
}
