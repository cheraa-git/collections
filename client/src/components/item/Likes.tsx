import { FC } from "react"
import { useAuth } from "../../hooks/authHook"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import { IconButton } from "@mui/material"
import { toggleLike } from "../../store/actions/itemActions"

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
        {isLiked ? <FavoriteIcon className="text-red-400"/> : <FavoriteBorderIcon/>}
        <p className="text-lg">{likes.length}</p>
      </IconButton>
    </>
  )
}
