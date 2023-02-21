import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { deleteItem, getItem } from "../store/actions/itemActions"
import { ItemFieldView } from "../components/item/ItemFieldView"
import { Box, Button, Typography } from "@mui/material"
import { EditItemDialog } from "../components/item/EditItemDialog"
import { useCollection } from "../hooks/collectionStateHook"
import { Comments } from "../components/item/Comments"
import { Likes } from "../components/item/Likes"
import { TagChip } from "../components/TagChip"
import { useConfirm } from "../hooks/confirmHook"

export const ItemPage: FC = () => {
  const dispatch = useAppDispatch()
  const { id, collectionId } = useParams()
  const navigate = useNavigate()
  const { showConfirm } = useConfirm()
  const { itemConfigs } = useCollection()
  const { items } = useAppSelector((state: RootState) => state.item)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const item = items.find(item => item.id === Number(id))


  useEffect(() => {
    if (!item && id && collectionId) {
      dispatch(getItem(+collectionId, +id))
    }
  }, [collectionId, item, id, dispatch])

  const deleteHandler = () => {
    if (item) {
      showConfirm(
        `are you sure you want to permanently delete "${item.name}"`,
        () => dispatch(deleteItem(item, navigate))
      )
    }
  }


  return (
    <Box py={1} px={3} my={3} mx="auto" maxWidth="42rem" className="border">
      <Box p={1} className="flex border-b">
        <Typography variant="h5" mr="auto">{item?.name}</Typography>
        <Button onClick={() => setEditDialogOpen(true)}>edit</Button>
        <Button color="error" onClick={deleteHandler}>Delete</Button>
        <EditItemDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}
                        collectionId={Number(collectionId)} item={item}/>
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
