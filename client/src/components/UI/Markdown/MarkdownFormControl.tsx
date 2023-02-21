import { FC } from "react"
import { Control, Controller } from "react-hook-form"
import { MarkdownEditor } from "./MarkdownEditor"
import { Typography } from "@mui/material"

interface MarkdownFormControlProps {
  control: Control<any>
  controlName: string
  className?: string
  required?: boolean
  label?: string
}


export const MarkdownFormControl: FC<MarkdownFormControlProps> = (props) => {
  const { control, controlName, required = true, className } = props
  return (
    <>
      <Typography variant="h6">{props.label}</Typography>
      <div className={className}>
        <Controller
          name={controlName}
          control={control}
          rules={{ required }}
          render={({ field, formState: { errors } }) => <MarkdownEditor field={field} error={!!errors[controlName]}/>}
        />
      </div>
    </>
  )
}
