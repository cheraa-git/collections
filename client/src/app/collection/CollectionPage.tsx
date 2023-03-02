import { FC, useEffect, useState } from "react"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { useParams } from "react-router-dom"
import { dateFormat } from "../../utils"
import MDEditor from "@uiw/react-md-editor"
import { Box, Button, Grid, Typography } from "@mui/material"
import { getCollection } from "../../store/actions/collectionActions"
import { EditItemDialog } from "../item/EditItemDialog"
import { ItemCard } from "../item/ItemCard"
import { clearCollectionData } from "../../store/slices/collectionSlice"
import { useCollection } from "../../hooks/collectionStateHook"
import { AddIcon } from "../../common/icons"
import { useApp } from "../../hooks/appStateHook"
import { EditCollectionMenu } from "./EditCollectionMenu"
import { useTranslation } from "react-i18next"
import { Text } from "../../common/Text"
import { TypographyLink } from "../../common/TypographyLink"
import Image from "mui-image"

export const CollectionPage: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { id } = useParams()
  const { collection, getTheme, isAuthor } = useCollection()
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
          <Box maxWidth="400px">
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

      <Box p={2} mt={2} className="border rounded">
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6">{t('Theme')}: {getTheme()?.name}</Typography>
            <i className="flex-wrap">
              <Text>Created by</Text>
              <TypographyLink to={`/profile/${collection.userId}`} mx={1} className="link">
                @{collection.userName}
              </TypographyLink>
              <Typography>{t('on')} {dateFormat(collection.timestamp)}</Typography>
            </i>
          </Box>
          <EditCollectionMenu/>
        </Box>
        <Box my="auto" height="min-content" width="100%" display="flex" justifyContent="end" hidden={!isAuthor}>
          <Button onClick={() => setEditItemDialogOpen(true)} hidden={!collection}>
            <AddIcon/>
            {t('add item')}
          </Button>
        </Box>
        <EditItemDialog open={editItemDialogOpen} onClose={() => setEditItemDialogOpen(false)}
                        collectionId={collection.id}/>
      </Box>

      {items.map(item => <ItemCard item={item} key={item.id}/>)}

    </Box>
  )
}
