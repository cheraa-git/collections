import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch } from "../../store/store"
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
import { useItem } from "../../hooks/itemStateHook"
import { useAuth } from "../../hooks/authHook"
import { Text } from "../../common/Text"

export const ItemPage: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const navigate = useNavigate()
  const { showConfirm } = useConfirm()
  const { itemConfigs } = useCollection()
  const { id: currentUserId, isAdmin } = useAuth().currentUser
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const item = useItem().items.find(item => item.id === Number(id))
  const isAuthor = currentUserId && (item?.userId === currentUserId || isAdmin)


  useEffect(() => {
    if (!item && id) {
      dispatch(getItem(+id))
    }
  }, [item, id, dispatch])

  const deleteHandler = () => {
    if (item) {
      showConfirm(
        t('Аre you sure you want to permanently delete?', { name: item.name }),
        () => dispatch(deleteItem(item, navigate))
      )
    }
  }

  if (!item) return <Text>Item not found</Text>
  return (
    <Box py={1} px={3} my={3} mx="auto" maxWidth="42rem" className="border">
      <Box p={1} className="flex border-b">
        <Typography variant="h5" mr="auto">{item?.name}</Typography>
        <Box hidden={!isAuthor}>
          <TransButton onClick={() => setEditDialogOpen(true)} hidden={true}>Edit</TransButton>
          <TransButton color="error" onClick={deleteHandler} hidden={!isAuthor}>Delete</TransButton>
        </Box>
        <EditItemDialog collectionId={item.collectionId} open={editDialogOpen} onClose={() => setEditDialogOpen(false)}
                        item={item}/>
      </Box>
      <Box display="flex" flexWrap="wrap">
        {item?.tags.map(tag => <TagChip key={tag.id} tag={tag}/>)}
      </Box>
      {itemConfigs.map(config => (
        <Box key={config.id}>
          <ItemFieldView item={item} config={config}/>
        </Box>
      ))}
      <Box ml="auto" width="min-content">
        <Likes itemId={Number(id)}/>
      </Box>
      <Comments itemId={Number(id)}/>
    </Box>
  )
}
