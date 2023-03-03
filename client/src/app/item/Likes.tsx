import { FC, useEffect } from "react"
import { useAuth } from "../../hooks/authHook"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { IconButton, Typography } from "@mui/material"
import { toggleLike } from "../../store/socket/item/itemSocketAcions"
import { FavoriteBorderIcon, FavoriteIcon } from "../../common/icons"
import { Spinner } from "../../common/Loader/Spinner"
import { setLikes } from "../../store/slices/itemSlice"

export const Likes: FC<{ itemId: number }> = ({ itemId }) => {
  const dispatch = useAppDispatch()
  const { currentUser, isAuth } = useAuth()
  const { likes, likesLoading } = useAppSelector((state: RootState) => state.item)
  const isLiked = !!likes.find(like => like.userId === currentUser.id)

  useEffect(() => {
    if (likes.length > 0 && likes[0].itemId !== itemId) {
      dispatch(setLikes([]))
      console.log('clear like')
    }
  }, [likes])

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
