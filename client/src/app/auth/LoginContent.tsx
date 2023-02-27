import { FC } from "react"
import { Box, TextField } from "@mui/material"
import { useAppDispatch } from "../../store/store"
import { SubmitHandler, useForm } from "react-hook-form"
import { authUser } from "../../store/actions/userActions"
import { Text } from "../../common/Text"
import { TransButton } from "../../common/TransButton"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { setAuthErrorMessage } from "../../store/slices/userSlice"


interface Inputs {
  email: string
  password: string
}

export const LoginContent: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = ({ email, password }) => {
    dispatch(setAuthErrorMessage(''))
    dispatch(authUser('login', { email, password }))
  }

  return (
    <>
      <Box mb={2} textAlign="center">
        <Text variant="h4" mb={1}>Welcome!</Text>
        <Text>Sign in to your account</Text>
      </Box>
      <Box component="form" width={300} onSubmit={handleSubmit(onSubmit)}>
        <TextField variant="standard" label="Email" fullWidth {...register('email', { required: true })}
                   error={!!errors.email}/>
        <TextField variant="standard" label={t("Password")} fullWidth {...register('password', { required: true })}
                   error={!!errors.password}
                   type="password"
                   margin="normal"
                   autoComplete="on"/>
        <Box ml="auto" mt={1} width="min-content">
          <TransButton variant="outlined" type="submit">Login</TransButton>
        </Box>
      </Box>
      <Box display="flex" mt={2}>
        <Text fontSize="medium">Don`t have an account?</Text>
        <Link to="/auth/signup" className="link">
          <Text fontSize="medium" ml={1}>Sign up</Text>
        </Link>
      </Box>
    </>
  )
}
