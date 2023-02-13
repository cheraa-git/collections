import { FC, useEffect, useState } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { Link, useNavigate, useParams } from "react-router-dom"
import { formatDate } from "../utils"
import MDEditor from "@uiw/react-md-editor"
import { Button, Grid } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import { deleteCollection, getCollection } from "../store/actions/collectionActions"
import { EditItemDialog } from "../components/item/EditItemDialog"
import { ItemCard } from "../components/item/ItemCard"
import { clearCollectionData } from "../store/slices/collectionSlice"

export const CollectionPage: FC = () => {
  const dispatch = useAppDispatch()
  const { collection, items } = useAppSelector((state: RootState) => state.collection)
  const { id } = useParams()
  const navigate = useNavigate()
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false)


  useEffect(() => {
    if (collection && collection.id !== Number(id)) {
      dispatch(clearCollectionData())
    }
    if (id) {
      dispatch(getCollection(id))
    }
  }, [dispatch, id])

  const deleteHandler = () => {
    dispatch(deleteCollection(collection, navigate))
  }

  if (!collection.id) return <></>
  return (
    <div className="bg-white max-w-5xl mx-auto my-5 rounded p-5">
      <Button onClick={deleteHandler}>delete</Button>
      <Grid container spacing={5}>
        <Grid item md={4} xs={12} hidden={!collection.imageUrl}>
          <img className="max-h-[50vh] max-w-[300px]" src={collection.imageUrl} alt="collection"/>
        </Grid>
        <Grid item md={8} xs={12}>
          <h1>{collection.title}</h1>
          <div data-color-mode="light" className="mb-3">
            <MDEditor.Markdown source={collection.description}/>
          </div>
        </Grid>
      </Grid>

      <div className="border-y py-2 my-2 flex justify-between">
        <div>
          <h3>Theme: {collection.theme}</h3>
          <p className="italic">
            Created by
            <Link to={`/profile/${collection.userId}`} className="text-orange-400 mx-1">@{collection.userName}</Link>
            in {formatDate(collection.timestamp)}
          </p>
        </div>
        <Button onClick={() => setEditItemDialogOpen(true)} hidden={!collection}>
          <AddIcon/>
          add item
        </Button>
        <EditItemDialog open={editItemDialogOpen} onClose={() => setEditItemDialogOpen(false)}
                        collectionId={collection.id}/>
      </div>

      {items.map(item => <ItemCard item={item} key={item.id}/>)}

    </div>
  )
}
