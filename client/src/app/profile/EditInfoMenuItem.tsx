import { FC, useEffect, useState } from "react"
import { BlurDialog } from "../../common/BlurDialog"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { Box, Button, MenuItem, TextField } from "@mui/material"
import { Text } from "../../common/Text"
import { TransButton } from "../../common/TransButton"
import { SubmitHandler, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../hooks/authHook"
import { useSnackbar } from "notistack"
import { editProfileInfoByProvider, sendConfirmProfileChange } from "../../store/actions/profileActions"
import { useApp } from "../../hooks/appStateHook"
import { getProviderImage } from "../../apis/firebase/actions/auth"
import { EditProfileByTokenBody } from "../../../../common/types/request-body-types/profile-body"

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
  const profileUser = useAppSelector((state: RootState) => state.profile.profileUser)
  const { currentUser } = useAuth()
  const theme = useApp().theme
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open && (profileUser.nickname === currentUser.nickname || currentUser.isAdmin)) {
      reset({
        email: profileUser.email,
        nickname: profileUser.nickname,
      })
    } else setOpen(false)
  }, [open, profileUser, currentUser, reset])

  const onClose = () => {
    setOpen(false)
  }

  const submitWithEmail: SubmitHandler<Inputs> = ({ email, nickname, oldPassword, newPassword }) => {
    const sendData: EditProfileByTokenBody = { oldPassword, oldEmail: profileUser.email }
    if (!email && !nickname && !newPassword) return
    if (!email.includes('@')) return snackbar('Email is invalid')
    if (email && email !== profileUser.email) sendData.email = email
    if (currentUser.isAdmin) sendData.adminEmail = currentUser.email
    if (nickname && nickname !== profileUser.nickname) sendData.nickname = nickname
    if (newPassword) sendData.password = newPassword
    dispatch(sendConfirmProfileChange(sendData))
    onClose()
    snackbar(t('Check your email'))
  }

  const submitWithProvider: SubmitHandler<Inputs> = ({newPassword, nickname}) => {
    if (!nickname) return
    dispatch(editProfileInfoByProvider({email: profileUser.email, nickname, password: newPassword}))
    onClose()
  }

  const getSubmitMethod = () => {
    if (currentUser.authProvider) {
      return submitWithProvider
    } else {
      return submitWithEmail
    }
  }


  const oldPasswordField = (
    <>
      {currentUser.isAdmin
        ? <Text mt={2}>To change the profile, enter the password from the admin account</Text>
        : <Text mt={2}>To change the profile, enter the old password</Text>

      }
      <TextField label={t("Password")} type="password" size="small" margin="dense" autoComplete="new-password"
                 fullWidth{...register('oldPassword', { required: !currentUser.authProvider })}
                 error={!!errors.oldPassword}/>

      <Text fontSize="small" color="gray">
        * after saving, an email with a confirmation link will be sent to your email
      </Text>
    </>
  )

  return (
    <>
      <MenuItem onClick={() => setOpen(true)}>{t('Edit profile info')}</MenuItem>
      <BlurDialog open={open} onClose={onClose} fullWidth>
        <Box component="form" px={3} py={1} onSubmit={handleSubmit(getSubmitMethod())}>
          <Text variant="h5">Edit profile</Text>
          <TextField label={t("Nickname")} autoComplete="username" size="small" margin="dense"
                     fullWidth{...register('nickname')}/>

          {
            !currentUser.authProvider &&
            <TextField label="Email" size="small" margin="dense" fullWidth{...register('email')}
                       error={!!errors.email}/>
          }

          <TextField type="password" autoComplete="new-password" label={t("New password")} size="small" margin="dense"
                     fullWidth{...register('newPassword')}/>

          {!currentUser.authProvider && oldPasswordField}
          <Box display="flex" justifyContent="space-between" mt={1}>
            <TransButton onClick={onClose} color="inherit">Cancel</TransButton>
            {
              currentUser.authProvider
                ? <Button type="submit">
                  <Text variant="button" mt={0.5} mr={1}>Continue with</Text>
                  <img src={getProviderImage(currentUser.authProvider, theme)} width={25} height={25} alt="provider"/>
                </Button>
                : <TransButton type="submit">Save</TransButton>
            }

          </Box>
        </Box>
      </BlurDialog>
    </>
  )
}
