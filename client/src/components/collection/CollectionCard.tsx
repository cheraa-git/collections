import './styles.css'
import { FC } from "react"
import { Collection } from "../../../../common/common-types"
import { ProfileUser } from "../../types/user"
import { dateTimeFormat } from "../../utils"
import MDEditor from "@uiw/react-md-editor"
import { Box, Card, Grid, Typography } from "@mui/material"
import { useCollection } from "../../hooks/collectionStateHook"
import { ButtonLink } from "../UI/ButtonLink"
import Chip from "@mui/material/Chip"
import { TypographyLink } from "../UI/TypographyLink"
import { useApp } from "../../hooks/appStateHook"
import { Link } from "react-router-dom"

interface CollectionCardProps {
  collection: Collection
  user: ProfileUser
}

export const CollectionCard: FC<CollectionCardProps> = ({ collection, user }) => {
  const appTheme = useApp().theme
  const { getThemeName } = useCollection()

  return (
    <Card className="card" sx={{ px: 2, py: 1, my: 2 }}>
      <Box mb={1} className="border-b w-full">
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Link to={`/collection/${collection.id}`}>
            <Typography variant="h5">{collection.title}</Typography>
          </Link>
          <Typography minWidth="max-content" variant="caption">{dateTimeFormat(collection.timestamp)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <TypographyLink to={`/profile/${collection.userId}`} className="capitalize">@{user.nickname}</TypographyLink>
          <Chip label={getThemeName(collection.themeId)} size="small" sx={{ mb: 1 }}/>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item md={4} xs={12}>
          <img src={collection.imageUrl} alt="collection" hidden={!collection.imageUrl}/>
        </Grid>
        <Grid item md={8} xs={12} data-color-mode={appTheme}>
          <Box overflow="auto" pb={2} maxHeight={400}>
            <MDEditor.Markdown source={collection.description}/>
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="end" className="border-t w-full">
        <ButtonLink to={`/collection/${collection.id}`}>Open</ButtonLink>
      </Box>
    </Card>
  )
}
