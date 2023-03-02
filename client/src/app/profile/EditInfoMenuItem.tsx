import { FC, useEffect, useState } from "react"
import { BlurDialog } from "../../common/BlurDialog"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { Box, MenuItem, TextField } from "@mui/material"
import { Text } from "../../common/Text"
import { TransButton } from "../../common/TransButton"
import { SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../hooks/authHook"
import { EditProfileBody } from "../../../../common/request-types"
import { useSnackbar } from "notistack"
import { sendConfirmProfileChange } from "../../store/actions/profileActions"

interface Inputs {
  nickname: string
  email: string
  oldPassword: string
  newPassword: string
}

export const EditInfoMenuItem: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>({})
  const [open, setOpen] = useState(false)
  const profileUser = useAppSelector((state: RootState) => state.profile.profileUser)
  const currentUser = useAuth().currentUser

  useEffect(() => {
    if (open && profileUser.nickname === profileUser.nickname && currentUser.email) {
      reset({
        email: currentUser.email,
        nickname: currentUser.nickname,
      })
    } else setOpen(false)
  }, [open, profileUser, currentUser, reset])

  const onClose = () => {
    setOpen(false)
  }

  const submitHandler: SubmitHandler<Inputs> = ({ email, nickname, oldPassword, newPassword }) => {
    const sendData: EditProfileBody = { oldPassword, oldEmail: currentUser.email }
    if (!email && !nickname && !newPassword) return
    if (!email.includes('@')) return snackbar('Email is invalid')
    if (email && email !== currentUser.email) sendData.email = email
    if (nickname && nickname !== currentUser.nickname) sendData.nickname = nickname
    if (newPassword) sendData.password = newPassword
    dispatch(sendConfirmProfileChange(sendData))
    onClose()
    snackbar(t('Check your email'))
  }

  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>{t('Edit profile info')}</MenuItem>
      <BlurDialog open={open} onClose={onClose} fullWidth>
        <Box component="form" px={3} py={1} onSubmit={handleSubmit(submitHandler)}>
          <Text variant="h5">Edit profile</Text>
          <TextField label={t("Nickname")} autoComplete="username" size="small" margin="dense"
                     fullWidth{...register('nickname')}/>
          <TextField label="Email" size="small" margin="dense" fullWidth{...register('email')} error={!!errors.email}/>
          <TextField type="password" autoComplete="new-password" label={t("New password")} size="small" margin="dense"
                     fullWidth{...register('newPassword')}/>

          <Text mt={2}>To change the profile, enter the old password</Text>
          <TextField label={t("Password")} type="password" size="small" margin="dense" autoComplete="new-password"
                     fullWidth{...register('oldPassword', { required: true })}
                     error={!!errors.oldPassword}/>

          <Text fontSize="small" color="gray">
            * after saving, an email with a confirmation link will be sent to your email
          </Text>
          <Box display="flex" justifyContent="space-between" mt={1}>
            <TransButton onClick={onClose} color="inherit">Cancel</TransButton>
            <TransButton type="submit">Save</TransButton>
          </Box>
        </Box>
      </BlurDialog>
    </>
  )
}
