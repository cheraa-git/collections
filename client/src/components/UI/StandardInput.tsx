import { FC } from "react"
import { TextField, TextFieldProps } from "@mui/material"

export const StandardInput: FC<TextFieldProps> = (props) => {
  return <TextField variant="standard" fullWidth {...props}/>
}
