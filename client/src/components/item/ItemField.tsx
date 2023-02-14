import { FC } from "react"
import { Checkbox, TextField, TextFieldProps } from "@mui/material"
import { Control, Controller, RefCallBack } from "react-hook-form"
import { MarkdownFormControl } from "../UI/Markdown/MarkdownFormControl"
import { DatePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

interface ItemFieldProps {
  type: string
  label: string
  control: Control<any>
  required?: boolean
}

export const ItemField: FC<ItemFieldProps> = ({ type, label, control, required = true }) => {
  const sliceType = type.slice(0, -1)

  if (sliceType === 'txt') {
    return <MarkdownFormControl control={control} controlName={type} label={label}/>
  }
  return <Controller
    name={type} control={control} rules={{ required }}
    render={({ field: { onChange, ref, onBlur, value }, formState: { errors } }) => (
      <Field field={{ onBlur, onChange, inputRef: ref, defaultValue: value }}
             textFieldConfig={{ label, error: !!errors[type], size: 'small', margin: 'dense', fullWidth: true }}
             sliceType={sliceType}
      />
    )}/>
}

interface FieldProps {
  field: {
    onBlur: () => void
    onChange: () => void
    inputRef: RefCallBack
    defaultValue: any
  }
  sliceType: string
  textFieldConfig: TextFieldProps
}

const Field = (props: FieldProps) => {
  const { field, sliceType, textFieldConfig } = props
  switch (sliceType) {
    case "str":
      return <TextField {...field} {...textFieldConfig}/>
    case "date":
      return <DateInput {...props}/>
    case "numb":
      return <TextField {...field} type="number" {...textFieldConfig}/>
    case "bool":
      return <CheckboxInput {...props}/>
    default:
      return <></>
  }
}

const DateInput = (props: FieldProps) => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker
      {...props.field}
      label={props.textFieldConfig.label}
      value={props.field.defaultValue || null}
      renderInput={(params) => <TextField {...params} {...props.textFieldConfig}
                                          error={params.error || props.textFieldConfig.error}/>}
    />
  </LocalizationProvider>
)
const CheckboxInput = (props: FieldProps) => {
  return (
    <div className="flex">
      <p className="self-center">{props.textFieldConfig.label}</p>
      <Checkbox {...props.field} checked={!!props.field.defaultValue}/>
    </div>
  )
}
