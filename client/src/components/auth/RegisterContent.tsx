import { FC } from "react"
import { Link } from "react-router-dom"
import { Button, TextField } from "@mui/material"
import { useAppDispatch } from "../../store/store"
import { useSnackbar } from "notistack"
import { SubmitHandler, useForm } from "react-hook-form"
import { authUser } from "../../store/actions/userActions"

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
      <div className="text-center mb-4">
        <h1 className="mb-2">Create Account!</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
        <TextField fullWidth label="Name" {...register('nickname', { required: true })} error={!!errors.nickname}
                   margin="normal"/>
        <TextField fullWidth label="E-mail" {...register('email', { required: true })} error={!!errors.email}
                   margin="normal"/>
        <TextField fullWidth label="Password" {...register('password', { required: true })} error={!!errors.password}
                   type="password"
                   margin="normal"
                   autoComplete="off"/>
        <TextField fullWidth label="Confirm your password" {...register('confirmPassword', { required: true })}
                   error={!!errors.confirmPassword}
                   type="password"
                   margin="normal"
                   autoComplete="off"/>
        <div className="w-min ml-auto mt-3">
          <Button variant="outlined" type="submit">Create</Button>
        </div>
      </form>
      <div className="flex mt-4">
        <p>Already have an account?</p>
        <Link className="text-orange-600 ml-2" to="/auth/login">Login!</Link>
      </div>
    </>
  )
}
