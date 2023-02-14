import { FC } from "react"
import { Link } from "react-router-dom"
import { Button, TextField } from "@mui/material"
import { useAppDispatch } from "../../store/store"
import { SubmitHandler, useForm } from "react-hook-form"
import { authUser } from "../../store/actions/userActions"


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
      <div className="text-center mb-4">
        <h1 className="mb-2">Welcome!</h1>
        <p className="text-gray-400">Sign in to your account</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
        <TextField variant="standard" label="Email" fullWidth {...register('email', { required: true })}
                   error={!!errors.email}/>
        <TextField variant="standard" label="Password" fullWidth {...register('password', { required: true })}
                   error={!!errors.password}
                   type="password"
                   margin="normal"
                   autoComplete="on"/>
        <div className="w-min ml-auto mt-2">
          <Button variant="outlined" type="submit">Login</Button>
        </div>
      </form>
      <div className="flex mt-4">
        <p>Don`t have an account?</p>
        <Link className="text-orange-600 ml-2" to="/auth/signup">Sign up!</Link>
      </div>
    </>
  )
}
