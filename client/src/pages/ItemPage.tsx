import { FC, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAppDispatch } from "../store/store"
import { deleteItem, getItem } from "../store/actions/collectionActions"
import { ItemFieldView } from "../components/item/ItemFieldView"
import { Button } from "@mui/material"
import { EditItemDialog } from "../components/item/EditItemDialog"
import { useCollection } from "../hooks/collectionStateHook"

export const ItemPage: FC = () => {
  const dispatch = useAppDispatch()
  const { id, collectionId } = useParams()
  const navigate = useNavigate()
  const { items, itemConfigs } = useCollection()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const item = items.find(item => item.id === Number(id))
  // const _item = {
  //   id: 1,
  //   collectionId: 1,
  //   name: 'string',
  //   timestamp: '1264639492',
  //   str1: "string number 1",
  //   txt1: "Markdown text",
  //   bool1: false,
  //   date1: '2023-01-01'
  // }
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
      {itemConfigs.map(config => (
        <div key={config.id}>
          <ItemFieldView item={item} config={config}/>
        </div>
      ))}
    </div>
  )
}
