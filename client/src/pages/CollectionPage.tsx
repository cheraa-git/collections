import { FC, useEffect, useState } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { Link, useParams } from "react-router-dom"
import { dateFormat } from "../utils"
import MDEditor from "@uiw/react-md-editor"
import { Box, Button, Grid, Typography } from "@mui/material"
import { getCollection } from "../store/actions/collectionActions"
import { EditItemDialog } from "../components/item/EditItemDialog"
import { ItemCard } from "../components/item/ItemCard"
import { clearCollectionData } from "../store/slices/collectionSlice"
import { useCollection } from "../hooks/collectionStateHook"
import { AddIcon } from "../components/UI/icons"
import { useApp } from "../hooks/appStateHook"
import { EditCollectionMenu } from "../components/collection/EditCollectionMenu"

export const CollectionPage: FC = () => {
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const { collection, getThemeName } = useCollection()
  const theme = useApp().theme
  const items = useAppSelector((state: RootState) => state.item.items)
  const [editItemDialogOpen, setEditItemDialogOpen] = useState(false)


  useEffect(() => {
    if (collection && collection.id !== Number(id)) {
      dispatch(clearCollectionData())
    }
    if (id) {
      dispatch(getCollection(id))
    }
  }, [dispatch, id])


  if (!collection.id) return <></>
  return (
    <Box maxWidth="64rem" mx="auto" my={3} borderRadius=".25rem" p={2}>
      <Grid container spacing={5}>
        <Grid item md={4} xs={12} hidden={!collection.imageUrl}>{/*maxWidth="50vh" maxHeight="300px"*/}
          <img src={collection.imageUrl} alt="collection"/>
        </Grid>
        <Grid item md={8} xs={12}>
          <Typography variant="h4" className="capitalize">{collection.title}</Typography>
          <Box data-color-mode={theme} mb={2}>
            <MDEditor.Markdown source={collection.description}/>
          </Box>
        </Grid>
      </Grid>

      <Box p={2} mt={2} justifyContent="space-between" className="border flex rounded">
        <div>
          <Typography variant="h6">Theme: {getThemeName()}</Typography>
          <i className="flex">
            <Typography>Created by</Typography>
            <Link to={`/profile/${collection.userId}`} className="link">
              <Typography mx={1}>@{collection.userName}</Typography>
            </Link>
            <Typography>in {dateFormat(collection.timestamp)}</Typography>
          </i>
        </div>
        <Box my="auto" height="min-content">
          <Button onClick={() => setEditItemDialogOpen(true)} hidden={!collection}>
            <AddIcon/>
            add item
          </Button>
          <EditCollectionMenu/>
        </Box>
        <EditItemDialog open={editItemDialogOpen} onClose={() => setEditItemDialogOpen(false)}
                        collectionId={collection.id}/>
      </Box>

      {items.map(item => <ItemCard item={item} key={item.id}/>)}

    </Box>
  )
}
