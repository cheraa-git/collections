import { FC } from "react"
import { RootState, useAppSelector } from "../../store/store"
import { useAuth } from "../../hooks/authHook"
import { Alert, Box, Button, Typography } from "@mui/material"
import Image from "mui-image"
import { AccountCircleIcon, AddIcon } from "../../common/icons"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Text } from "../../common/Text"
import { EditProfileMenu } from "./EditProfileMenu"


export const ProfileUserInfo: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const profileUser = useAppSelector((state: RootState) => state.profile.profileUser)
  const { currentUser, isAuth } = useAuth()
  const isAuthor = isAuth && (currentUser.isAdmin || (profileUser.id === currentUser.id))

  return (
    <Box display="flex" flexWrap="wrap" mb={1} p={2} className="flex bg-gray border">
      <Image
        src={profileUser.avatarUrl || ''}
        errorIcon={<Box fontSize="100px" height={120}><AccountCircleIcon color="disabled" fontSize="inherit"/></Box>}
        showLoading width={200} height={200} fit="cover" className="rounded" duration={500}/>
      <Box>
        {profileUser.status === 'blocked' && <Alert sx={{ ml: 1 }} severity="warning">{t('Blocked')}</Alert>}
        <Box ml={1} mb={1}>
          <Text color="gray">Nickname</Text>
          <Typography fontSize="x-large" className="capitalize" ml={2} mr={1}>{profileUser.nickname}</Typography>
        </Box>
        <Box ml={1} hidden={!isAuthor}>
          <Text color="gray">Email</Text>
          <Typography fontSize="x-large" ml={2} mr={1}>{profileUser.email}</Typography>
        </Box>
      </Box>
      {
        isAuthor &&
        <Box ml="auto" display="flex" flexDirection="column" justifyContent="space-between">
          <Box ml="auto">
            <EditProfileMenu/>
          </Box>
          <Button onClick={() => navigate('/create_collection', { state: { userId: profileUser.id } })}>
            <AddIcon/>{t('Collection')}
          </Button>
        </Box>
      }
    </Box>
  )
}
