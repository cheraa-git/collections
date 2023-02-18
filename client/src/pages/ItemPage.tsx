import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { deleteItem, getItem } from "../store/actions/itemActions"
import { ItemFieldView } from "../components/item/ItemFieldView"
import { Box, Button } from "@mui/material"
import { EditItemDialog } from "../components/item/EditItemDialog"
import { useCollection } from "../hooks/collectionStateHook"
import { Comments } from "../components/item/Comments"
import { Likes } from "../components/item/Likes"
import { TagChip } from "../components/TagChip"

export const ItemPage: FC = () => {
  const dispatch = useAppDispatch()
  const { id, collectionId } = useParams()
  const navigate = useNavigate()
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
      dispatch(deleteItem(item, navigate))
    }
  }


  return (
    <div className="shadow rounded max-w-2xl mx-auto my-5 px-5 py-2">
      <div className="bg-white rounded p-2 flex border-b border-blue-400">
        <h1 className="mr-auto">{item?.name}</h1>
        <Button onClick={() => setEditDialogOpen(true)}>edit</Button>
        <Button color="error" onClick={deleteHandler}>Delete</Button>
        <EditItemDialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}
                        collectionId={Number(collectionId)} item={item}/>
      </div>
      <div className="flex flex-wrap">
        {item?.tags.map(tag => <TagChip key={tag.id} tag={tag}/>)}
      </div>
      {itemConfigs.map(config => (
        <div key={config.id}>
          <ItemFieldView item={item} config={config}/>
        </div>
      ))}
      <Box sx={{ ml: 'auto', width: "min-content" }}>
        <Likes itemId={Number(id)}/>
      </Box>
      <Comments itemId={Number(id)}/>
    </div>
  )
}
