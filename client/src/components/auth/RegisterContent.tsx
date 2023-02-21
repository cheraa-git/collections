import { FC } from "react"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useAppDispatch } from "../../store/store"
import { useSnackbar } from "notistack"
import { SubmitHandler, useForm } from "react-hook-form"
import { authUser } from "../../store/actions/userActions"
import { TypographyLink } from "../UI/TypographyLink"

interface Inputs {
  email: string
  password: string
  nickname: string
  confirmPassword: string
}

export const RegisterContent: FC = () => {
  const dispatch = useAppDispatch()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = ({ email, password, nickname, confirmPassword }) => {
    if (!email.includes('@')) return snackbar('Email is invalid')
    if (confirmPassword !== password) return snackbar('The password is not equal to the confirm password')
    dispatch(authUser('create', { nickname, email, password }))
  }

  return (
    <>
      <Box mb={2} textAlign="center">
        <Typography variant="h4" mb={1}>Create Account!</Typography>
      </Box>
      <Box component="form" width={300} onSubmit={handleSubmit(onSubmit)}>
        <TextField fullWidth label="Name" {...register('nickname', { required: true })} error={!!errors.nickname}
                   variant="standard"
                   margin="normal"/>
        <TextField fullWidth label="E-mail" {...register('email', { required: true })} error={!!errors.email}
                   variant="standard"
                   margin="normal"/>
        <TextField fullWidth label="Password" {...register('password', { required: true })} error={!!errors.password}
                   variant="standard"
                   type="password"
                   margin="normal"
                   autoComplete="off"/>
        <TextField fullWidth label="Confirm your password" {...register('confirmPassword', { required: true })}
                   variant="standard"
                   error={!!errors.confirmPassword}
                   type="password"
                   margin="normal"
                   autoComplete="off"/>
        <Box ml="auto" mt={1} width="min-content">
          <Button variant="outlined" type="submit">Create</Button>
        </Box>
      </Box>
      <Box display="flex" mt={2}>
        <Typography fontSize="medium">Already have an account?</Typography>
        <TypographyLink fontSize="medium" ml={1} to="/auth/login">Login!</TypographyLink>
      </Box>
    </>
  )
}
