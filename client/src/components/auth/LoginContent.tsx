import { FC } from "react"
import { Box, Button, TextField, Typography } from "@mui/material"
import { useAppDispatch } from "../../store/store"
import { SubmitHandler, useForm } from "react-hook-form"
import { authUser } from "../../store/actions/userActions"
import { TypographyLink } from "../UI/TypographyLink"


interface Inputs {
  email: string
  password: string
}

export const LoginContent: FC = () => {
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = ({ email, password }) => {
    dispatch(authUser('login', { email, password }))
  }

  return (
    <>
      <Box mb={2} textAlign="center">
        <Typography variant="h4" mb={1}>Welcome!</Typography>
        <Typography>Sign in to your account</Typography>
      </Box>
      <Box component="form" width={300} onSubmit={handleSubmit(onSubmit)}>
        <TextField variant="standard" label="Email" fullWidth {...register('email', { required: true })}
                   error={!!errors.email}/>
        <TextField variant="standard" label="Password" fullWidth {...register('password', { required: true })}
                   error={!!errors.password}
                   type="password"
                   margin="normal"
                   autoComplete="on"/>
        <Box ml="auto" mt={1} width="min-content">
          <Button variant="outlined" type="submit">Login</Button>
        </Box>
      </Box>
      <Box display="flex" mt={2}>
        <Typography fontSize="medium">Don`t have an account?</Typography>
        <TypographyLink fontSize="medium" ml={1} to="/auth/signup">Sign up!</TypographyLink>
      </Box>
    </>
  )
}
