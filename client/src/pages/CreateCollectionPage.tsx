import { FC, useState } from "react"
import { Button, IconButton, MenuItem, TextField } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAppDispatch } from "../store/store"
import { createCollection } from "../store/actions/collectionActions"
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useSnackbar } from "notistack"

interface Inputs {
  title: string
  description: string
  theme: string
  image: FileList
}

export const CreateCollectionPage: FC = () => {
  const dispatch = useAppDispatch()
  const {enqueueSnackbar: snackbar} = useSnackbar()
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
  const [configInputs, setConfigInputs] = useState<{ type: string, label: string }[]>([{ type: '', label: '' }])

  const fixedConfigInputs = [['number', 'id'], ['string', 'name'], ['#tags', 'tags']]
  const themes = ["Books", "Films", "Travels", "Programming", "TV"]

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const itemConfigs = configInputs.filter(config => config.type && config.label)
    dispatch(createCollection({ ...data, image: data.image[0], itemConfigs }))
  }

  const configTypeHandler = (index: number, type: string) => {
    const newConfig = [...configInputs]
    const count = newConfig.filter(config => config.type.includes(type)).length + 1
    if (count > 3) {
      return snackbar('You have reached the maximum number of fields with this type')
    }
    newConfig[index].type = type + count
    setConfigInputs(newConfig)
  }

  const configLabelHandler = (index: number, label: string) => {
    const newConfig = [...configInputs]
    newConfig[index].label = label
    setConfigInputs(newConfig)
  }

  const addConfigInput = () => {
    setConfigInputs(prev => [...prev, { type: '', label: '' }])
  }

  const removeConfigInput = (index: number) => {
    setConfigInputs(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white max-w-3xl mx-auto px-4">

      <form className="max-w-lg flex flex-col mx-auto" onSubmit={handleSubmit(onSubmit)}>

        <TextField label="Title" margin="normal" {...register('title', { required: true })} error={!!errors.title}/>

        <TextField label="Description" margin="normal" {...register('description', { required: true })} multiline
                   rows={10} error={!!errors.description}/>

        <TextField select label="Theme" defaultValue="" margin="normal"
                   {...register('theme', { required: true, })} error={!!errors.theme}>
          {themes.map((theme, i) => <MenuItem key={i} value={theme}>{theme}</MenuItem>)}
        </TextField>

        <TextField margin="normal" type="file" {...register('image')}/>

        {fixedConfigInputs.map((config, index) => (
          <div className="bg-gray-100 my-1 flex mr-[40px]" key={index}>
            <TextField size="small" label="type" disabled value={config[0]} fullWidth/>
            <span className="px-2 bg-white py-5"/>
            <TextField size="small" label="label" disabled value={config[1]} fullWidth/>
          </div>
        ))}

        {configInputs.map((config, index) => (
          <div className="flex my-1 w-full" key={index}>
            <TextField select size="small" label="type" defaultValue="" fullWidth
                       value={config.type.slice(0, -1)}
                       onChange={(e) => configTypeHandler(index, e.target.value)}
            >
              <MenuItem value="str">string</MenuItem>
              <MenuItem value="txt">markdown text</MenuItem>
              <MenuItem value="numb">number</MenuItem>
              <MenuItem value="bool">boolean</MenuItem>
              <MenuItem value="date">date</MenuItem>
            </TextField>
            <span className="px-2 bg-white py-5"/>
            <TextField size="small" label="label" fullWidth
                       value={config.label}
                       onChange={e => configLabelHandler(index, e.target.value)}
            />
            <IconButton onClick={() => removeConfigInput(index)}>
              <RemoveIcon className="text-red-400"/>
            </IconButton>
          </div>
        ))}
        <IconButton className="w-min" onClick={addConfigInput}>
          <AddIcon className="text-orange-400"/>
        </IconButton>

        <Button type="submit">Send</Button>
      </form>
    </div>
  )
}
