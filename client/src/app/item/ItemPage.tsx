import { FC, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { deleteItem, getItem } from "../../store/actions/itemActions"
import { ItemFieldView } from "./ItemFieldView"
import { Box, Typography } from "@mui/material"
import { EditItemDialog } from "./EditItemDialog"
import { useCollection } from "../../hooks/collectionStateHook"
import { Comments } from "./Comments"
import { Likes } from "./Likes"
import { TagChip } from "../../common/TagChip"
import { useConfirm } from "../../hooks/confirmHook"
import { TransButton } from "../../common/TransButton"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../hooks/authHook"
import { timestampToDateTime } from "../../utils"
import { Text } from "../../common/Text"
import { Spinner } from "../../common/Loader/Spinner"

export const ItemPage: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const navigate = useNavigate()
  const { showConfirm } = useConfirm()
  const { items, loading } = useAppSelector((state: RootState) => state.item)
  const itemConfigs = useCollection().itemConfigs.filter(config => !config.hidden)
  const { id: currentUserId, isAdmin } = useAuth().currentUser
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const item = items.find(item => item.id === Number(id))
  const isAuthor = currentUserId && (item?.userId === currentUserId || isAdmin)


  useEffect(() => {
    if (id) {
      dispatch(getItem(+id))
    }
  }, [id, dispatch])

  const deleteHandler = () => {
    if (item) {
      showConfirm(
        t('Аre you sure you want to permanently delete?', { name: item.name }),
        () => dispatch(deleteItem(item, navigate))
      )
    }
  }

  return (
    <Box py={1} px={3} my={3} mx="auto" maxWidth="42rem" className="border">
      <Box display="flex">
        <Text fontSize="medium" color="gray" mr={1} hidden={!item?.userNickname}>author</Text>
        <Link to={`/profile/${item?.userId}`} className="link capitalize">{item?.userNickname}</Link>
      </Box>
      <Box p={1} className="flex border-b">
        <Box mr="auto">
          <Typography variant="h5">{item?.name}</Typography>
          <Typography fontSize="small" color="gray">{timestampToDateTime(item?.timestamp)}</Typography>
        </Box>
        {
          loading
            ? <Spinner/>
            : <Box hidden={!isAuthor}>
              <TransButton onClick={() => setEditDialogOpen(true)} hidden={!isAuthor}>Edit</TransButton>
              <TransButton color="error" onClick={deleteHandler} hidden={!isAuthor}>Delete</TransButton>
            </Box>
        }

        {item &&
          <EditItemDialog collectionId={item?.collectionId} open={editDialogOpen}
                          onClose={() => setEditDialogOpen(false)}
                          item={item}/>
        }

      </Box>
      <Box display="flex" flexWrap="wrap">
        {item?.tags.map(tag => <TagChip key={tag.id + tag.name} tag={tag}/>)}
      </Box>
      {itemConfigs.map(config => (
        <Box key={config.id}>
          <ItemFieldView item={item} config={config}/>
        </Box>
      ))}
      <Box display="flex" justifyContent="space-between">
        <TransButton size="small" onClick={() => navigate(`/collection/${item?.collectionId}`)}>
          Open collection
        </TransButton>
        <Likes itemId={Number(id)}/>
      </Box>
      <Comments itemId={Number(id)}/>
    </Box>
  )
}
