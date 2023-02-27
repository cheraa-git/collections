import { FC } from "react"
import { Control, Controller } from "react-hook-form"
import { MarkdownEditor } from "./MarkdownEditor"
import { Text } from "../Text"

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
      <Text variant="h6">{props.label}</Text>
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
