import { ChangeEvent, FC, useState } from "react"
import { Box, MenuItem } from "@mui/material"
import { useTranslation } from "react-i18next"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { BlurDialog } from "../../common/BlurDialog"
import { ImageDrop } from "../../common/ImageDrop/ImageDrop"
import { TransButton } from "../../common/TransButton"
import { Text } from "../../common/Text"
import { editProfileImage } from "../../store/actions/profileActions"

export const EditImageMenuItem: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const profileUser = useAppSelector((state: RootState) => state.profile.profileUser)
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<FileList | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState(profileUser.avatarUrl)
  const imageFile = image && image.length > 0 ? image[0] : undefined


  const onClose = () => {
    setOpen(false)
  }

  const clearImage = () => {
    setImage(new DataTransfer().files)
    setExistingImageUrl('')
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files)
    setExistingImageUrl('')
  }

  const editImageHandler = () => {
    if (existingImageUrl) return onClose()
    dispatch(editProfileImage(profileUser.id, imageFile))
    onClose()
  }

  return (
    <div>
      <MenuItem onClick={() => setOpen(true)}>{t('Edit avatar')}</MenuItem>
      <BlurDialog open={open} onClose={onClose} fullWidth>
        <Box px={3} py={2}>
          <Text variant="h5" mb={2}>Changing the avatar</Text>
          <Box mb={2} width="min-content" mx="auto">
            <ImageDrop
              existingImageUrl={existingImageUrl}
              imageFile={imageFile}
              clearFile={clearImage}
              inputProps={{ onChange }}/>
          </Box>
          <Box display="flex" justifyContent="space-between" mt={1}>
            <TransButton onClick={onClose} color="inherit">Cancel</TransButton>
            <TransButton onClick={editImageHandler}>Save</TransButton>
          </Box>
        </Box>
      </BlurDialog>
    </div>
  )
}
