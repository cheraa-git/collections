import { FC } from "react"
import { Box, TextField } from "@mui/material"
import { useAppDispatch } from "../../store/store"
import { useSnackbar } from "notistack"
import { SubmitHandler, useForm } from "react-hook-form"
import { authUser } from "../../store/actions/userActions"
import { useTranslation } from "react-i18next"
import { Text } from "../UI/Text"
import { Link } from "react-router-dom"
import { TransButton } from "../UI/TransButton"
import { setAuthErrorMessage } from "../../store/slices/userSlice"

interface Inputs {
  email: string
  password: string
  nickname: string
  confirmPassword: string
}

export const RegisterContent: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = ({ email, password, nickname, confirmPassword }) => {
    if (!email.includes('@')) return snackbar('Email is invalid')
    if (confirmPassword !== password) return snackbar('The password is not equal to the confirm password')
    dispatch(setAuthErrorMessage(''))
    dispatch(authUser('create', { nickname, email, password }))
  }

  return (
    <>
      <Box mb={2} textAlign="center">
        <Text variant="h4" mb={1}>Create Account!</Text>
      </Box>
      <Box component="form" width={300} onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label={t('Nickname')} {...register('nickname', { required: true })}
                   error={!!errors.nickname}
                   variant="standard"
                   margin="normal"/>
        <TextField fullWidth label="Email" {...register('email', { required: true })} error={!!errors.email}
                   variant="standard"
                   margin="normal"/>
        <TextField fullWidth label={t("Password")} {...register('password', { required: true })}
                   error={!!errors.password}
                   variant="standard"
                   type="password"
                   margin="normal"
                   autoComplete="off"/>
        <TextField fullWidth label={t("Confirm your password")} {...register('confirmPassword', { required: true })}
                   variant="standard"
                   error={!!errors.confirmPassword}
                   type="password"
                   margin="normal"
                   autoComplete="off"/>
        <Box ml="auto" mt={1} width="min-content">
          <TransButton variant="outlined" type="submit">Create</TransButton>
        </Box>
      </Box>
      <Box display="flex" mt={2}>
        <Text fontSize="medium">Already have an account?</Text>
        <Link to="/auth/login" className="link">
          <Text fontSize="medium" ml={1}>Login</Text>
        </Link>
      </Box>
    </>
  )
}
