import { FC } from "react"
import { timestampToDateTime } from "../../utils"
import MDEditor from "@uiw/react-md-editor"
import { Box, Card, Grid, Typography } from "@mui/material"
import { TypographyLink } from "../../common/TypographyLink"
import { useApp } from "../../hooks/appStateHook"
import { Link } from "react-router-dom"
import { TransButton } from "../../common/TransButton"
import Image from 'mui-image'
import { ArticleTwoToneIcon } from "../../common/icons"
import { ThemeChip } from "../../common/ThemeChip"
import { ProfileUser } from "../../../../common/types/user"
import { Collection } from "../../../../common/types/collection"


interface CollectionCardProps {
  collection: Collection
  user?: ProfileUser
}

export const CollectionCard: FC<CollectionCardProps> = ({ collection, user }) => {
  const appTheme = useApp().theme

  return (
    <Card className="border fade" sx={{ px: 2, py: 1, my: 2 }}>
      <Box mb={1} className="border-b w-full">
        <Box display="flex" justifyContent="space-between" flexWrap="wrap">
          <Link to={`/collection/${collection.id}`}>
            <Typography variant="h5">{collection.title}</Typography>
          </Link>
          <Typography minWidth="max-content" variant="caption">{timestampToDateTime(collection.timestamp)}</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">

          <TypographyLink to={`/profile/${collection.userId}`} alignSelf="center" mt={1} className="capitalize">
            {user?.nickname || collection.userName}
          </TypographyLink>
          <Box mb={0.5}>
            <ThemeChip themeId={collection.themeId}/>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={2}>
        <Grid item md={4} xs={12} hidden={!collection.imageUrl}>
          <Box maxWidth="400px">
            <Image src={collection.imageUrl || ''} alt="collection" showLoading duration={500}/>
          </Box>
        </Grid>
        <Grid item md={8} xs={12} data-color-mode={appTheme}>
          <Box overflow="auto" pb={2} maxHeight={400}>
            <MDEditor.Markdown source={collection.description}/>
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="space-between" className="border-t w-full">
        {
          collection.countItems &&
          <Box display="flex" mt={1}>
            <ArticleTwoToneIcon/>
            <Typography>{collection.countItems}</Typography>
          </Box>
        }

        <Box width="min-content" ml="auto">
          <Link to={`/collection/${collection.id}`}>
            <TransButton>Open</TransButton>
          </Link>
        </Box>
      </Box>
    </Card>
  )
}
