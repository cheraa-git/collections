import { FC, useEffect, useState } from "react"
import { useAppDispatch } from "../store/store"
import { Link, useNavigate, useParams } from "react-router-dom"
import { formatDate } from "../utils"
import MDEditor from "@uiw/react-md-editor"
import { Button, Grid, IconButton, Menu, MenuItem } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import { deleteCollection, getCollection } from "../store/actions/collectionActions"
import { EditItemDialog } from "../components/item/EditItemDialog"
import { ItemCard } from "../components/item/ItemCard"
import { clearCollectionData } from "../store/slices/collectionSlice"
import { useConfirm } from "../hooks/confirmHook"
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useCollection } from "../hooks/collectionStateHook"

export const CollectionPage: FC = () => {
  const dispatch = useAppDispatch()
  const { collection, items, itemConfigs, getThemeName } = useCollection()
  const { id } = useParams()
  const navigate = useNavigate()
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  const { showConfirm } = useConfirm()


  useEffect(() => {
    if (collection && collection.id !== Number(id)) {
      dispatch(clearCollectionData())
    }
    if (id) {
      dispatch(getCollection(id))
    }
  }, [dispatch, id])


  const deleteHandler = () => {
    setMenuAnchorEl(null)
    showConfirm('It will be impossible to restore the collection.', () => {
      dispatch(deleteCollection(collection, navigate))
    })
  }
  const editHandler = () => {
    setMenuAnchorEl(null)
    navigate('/create_collection', { state: { editable: { collection, itemConfigs } } })
  }


  if (!collection.id) return <></>
  return (
    <div className="bg-white max-w-5xl mx-auto my-5 rounded p-5">
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
          <h3>Theme: {getThemeName()}</h3>
          <p className="italic">
            Created by
            <Link to={`/profile/${collection.userId}`} className="text-orange-400 mx-1">@{collection.userName}</Link>
            in {formatDate(collection.timestamp)}
          </p>
        </div>
        <div className="h-min my-auto text-blue-500">
          <Button onClick={() => setEditItemDialogOpen(true)} hidden={!collection}>
            <AddIcon/>
            add item
          </Button>

          <IconButton onClick={(e) => setMenuAnchorEl(e.currentTarget)}><MoreVertIcon/></IconButton>
          <Menu open={Boolean(menuAnchorEl)} onClose={() => setMenuAnchorEl(null)} anchorEl={menuAnchorEl}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
          >
            <MenuItem onClick={editHandler}><EditIcon className="text-gray-500 mr-3"/>Edit collection</MenuItem>
            <MenuItem onClick={deleteHandler}><DeleteIcon className="text-red-400 mr-3"/>Delete collection</MenuItem>
          </Menu>
        </div>
        <EditItemDialog open={editItemDialogOpen} onClose={() => setEditItemDialogOpen(false)}
                        collectionId={collection.id}/>
      </div>

      {
        items.map(item => <ItemCard item={item} key={item.id}/>)
      }

    </div>
  )
}
