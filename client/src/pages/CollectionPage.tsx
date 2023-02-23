import { FC, useEffect, useState } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { useParams } from "react-router-dom"
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
import { useTranslation } from "react-i18next"
import { Text } from "../components/UI/Text"
import { TypographyLink } from "../components/UI/TypographyLink"
import Image from "mui-image"

export const CollectionPage: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const { collection, getThemeName, isAuthor } = useCollection()
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
        <Grid item md={4} xs={12} hidden={!collection.imageUrl}>
          <Box maxWidth="400px" >
            <Image src={collection.imageUrl || ''} alt="collection" showLoading/>
          </Box>
        </Grid>
        <Grid item md={8} xs={12}>
          <Typography variant="h4" className="capitalize">{collection.title}</Typography>
          <Box data-color-mode={theme} mb={2}>
            <MDEditor.Markdown source={collection.description}/>
          </Box>
        </Grid>
      </Grid>

      <Box p={2} mt={2} justifyContent="space-between" className="border flex rounded">
        <Box>
          <Typography variant="h6">{t('Theme')}: {getThemeName()}</Typography>
          <i className="flex">
            <Text>Created by</Text>
            <TypographyLink to={`/profile/${collection.userId}`} mx={1} className="link">
              @{collection.userName}
            </TypographyLink>
            <Typography>{t('on')} {dateFormat(collection.timestamp)}</Typography>
          </i>
        </Box>
        <Box my="auto" height="min-content" hidden={!isAuthor}>
          <Button onClick={() => setEditItemDialogOpen(true)} hidden={!collection}>
            <AddIcon/>
            {t('add item')}
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
