import { FC } from "react"
import { useAuth } from "../../hooks/authHook"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { IconButton, Typography } from "@mui/material"
import { toggleLike } from "../../store/socket/item/itemSocketAcions"
import { FavoriteBorderIcon, FavoriteIcon } from "../../common/icons"
import { Spinner } from "../../common/Loader/Spinner"

export const Likes: FC<{ itemId: number }> = ({ itemId }) => {
  const dispatch = useAppDispatch()
  const { currentUser, isAuth } = useAuth()
  const { likes, likesLoading } = useAppSelector((state: RootState) => state.item)
  const isLiked = !!likes.find(like => like.userId === currentUser.id)


  const likeHandler = () => {
    dispatch(toggleLike(itemId))
  }

  return (
    <>
      <IconButton onClick={likeHandler} disabled={!isAuth || likesLoading}>
        {isLiked ? <FavoriteIcon className="red"/> : <FavoriteBorderIcon/>}
        {
          likesLoading
            ? <Spinner variant="small" className="self-center"/>
            : <Typography>{likes.length}</Typography>
        }
      </IconButton>
    </>
  )
}
