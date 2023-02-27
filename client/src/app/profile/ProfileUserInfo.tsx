import { FC } from "react"
import { RootState, useAppSelector } from "../../store/store"
import { useAuth } from "../../hooks/authHook"
import { Box, Button, IconButton, Typography } from "@mui/material"
import Image from "mui-image"
import { AccountCircleIcon, AddIcon, EditIcon } from "../../common/icons"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"


export const ProfileUserInfo: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const profileUser = useAppSelector((state: RootState) => state.profile.profileUser)
  const currentUser = useAuth().currentUser
  const isAuthor = currentUser.isAdmin || (profileUser.id === currentUser.id)

  return (
    <Box display="flex" flexWrap="wrap" mb={1} p={2} className="flex bg-gray border">

      <Image
        src="https://firebasestorage.googleapis.com/v0/b/collections-c4986.appspot.com/o/files%2Favatar.jpeg?alt=media&token=616a7078-fbed-4637-a776-a4cf916b0cb5"
        // src=""
        errorIcon={<Box fontSize="100px" height={120}><AccountCircleIcon color="disabled" fontSize="inherit"/></Box>}
        showLoading={true} width={200} height={200} fit="cover" className="rounded"/>
      <Typography variant="h5" className="capitalize" ml={2} mr={1}>@{profileUser.nickname}</Typography>
      <Box hidden={!isAuthor}>
        <IconButton size="small"><EditIcon/></IconButton>
      </Box>
      <Box ml="auto" mt="auto" hidden={!isAuthor}>
        <Button onClick={() => navigate('/create_collection', { state: { userId: profileUser.id } })}>
          <AddIcon/>{t('Collection')}
        </Button>
      </Box>
    </Box>
  )
}
