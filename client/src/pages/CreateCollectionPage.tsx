import { FC, useEffect, useState } from "react"
import { Button, IconButton, MenuItem, TextField } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAppDispatch, } from "../store/store"
import { createCollection, editCollection } from "../store/actions/collectionActions"
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useSnackbar } from "notistack"
import { MarkdownFormControl } from "../components/UI/Markdown/MarkdownFormControl"
import { ImageDrop } from "../components/UI/ImageDrop"
import { MAX_IMAGE_SIZE } from "../constants/_other"
import { useLocation, useNavigate } from "react-router-dom"
import { useApp } from "../hooks/appStateHook"
import { Spinner } from "../components/UI/Loader/Spinner"
import { Collection, ItemConfigType } from "../../../common/common-types"
import { useCollection } from "../hooks/collectionStateHook"


interface Inputs {
  title: string
  description: string
  themeId: number
  image: FileList
  existingImage?: string
}

export const CreateCollectionPage: FC = () => {
  const dispatch = useAppDispatch()
  const { loading } = useApp()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues, control } = useForm<Inputs>()
  const [configInputs, setConfigInputs] = useState<ItemConfigType[]>([{ type: '', label: '' }])
  const imageFile = watch('image') && watch('image').length > 0 ? watch('image')[0] : undefined
  const fixedConfigInputs = [['string', 'name'], ['#tags', 'tags']]
  const editable: { collection: Collection, itemConfigs: ItemConfigType[] } | undefined = location.state?.editable
  const themes = useCollection().themes

  useEffect(() => {
    if (editable) {
      setValue('title', editable.collection.title)
      setValue('description', editable.collection.description)
      setValue('themeId', editable.collection.themeId)
      setValue('existingImage', editable.collection.imageUrl)
      setConfigInputs(editable.itemConfigs)
    }
  }, [])

  useEffect(() => {
    if (imageFile) setValue('existingImage', '')
  }, [watch('image')])

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const itemConfigs = configInputs.filter(config => config.type && config.label)
    if (data.image[0]?.size > MAX_IMAGE_SIZE) return snackbar('The maximum photo size is 10MB')
    if (editable) {
      dispatch(editCollection({ ...editable.collection, ...data, image: data.image[0], itemConfigs, }, navigate))
    } else {
      dispatch(createCollection({ ...data, image: data.image[0], itemConfigs }, navigate))
    }
  }

  const configTypeHandler = (index: number, type: string) => {
    const newConfig = [...configInputs]
    const count = newConfig.filter(config => config.type.includes(type)).length + 1
    if (count > 3) {
      return snackbar('You have reached the maximum number of fields with this type')
    }
    newConfig[index].type = type + count
    if (editable) newConfig[index].collectionId = editable.collection.id
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

  const clearImage = () => {
    setValue('image', new DataTransfer().files)
    setValue('existingImage', '')
  }

  return (
    <div className="bg-white max-w-3xl mx-auto px-4 my-5 p-5">
      <h1>Create new collection</h1>
      <form className="flex flex-col mx-auto px-3" onSubmit={handleSubmit(onSubmit)}>

        <TextField label="Title" margin="normal" {...register('title', { required: true })} error={!!errors.title}/>

        <TextField select label="Theme" defaultValue={editable?.collection.themeId || ''} margin="normal"
                   {...register('themeId', { required: true, })} error={!!errors.themeId}>
          {themes.map((theme) => <MenuItem key={theme.id} value={theme.id}>{theme.name}</MenuItem>)}
        </TextField>

        <h3>If you want, add a picture of the collection</h3>
        <ImageDrop className="mx-auto mb-3 mt-1"
                   imageFile={imageFile}
                   inputProps={{ ...register('image') }}
                   clearFile={clearImage}
                   existingImageUrl={getValues().existingImage}
        />

        <MarkdownFormControl control={control} className="mb-4" controlName="description" label="Enter a description"/>

        {fixedConfigInputs.map((config, index) => (
          <div className="my-1 flex mr-[40px]" key={index}>
            <TextField className="bg-gray-100" size="small" sx={{ marginRight: "1rem" }} label="type" disabled
                       value={config[0]} fullWidth/>
            <TextField className="bg-gray-100" size="small" label="label" disabled value={config[1]} fullWidth/>
          </div>
        ))}

        {configInputs.map((config, index) => (
          <div className="flex my-1 w-full" key={index}>
            <TextField style={{ border: 'none', borderRadius: 0 }} sx={{ marginRight: "1rem" }} select size="small"
                       label="type" defaultValue=""
                       fullWidth
                       value={config.type.slice(0, -1)}
                       onChange={(e) => configTypeHandler(index, e.target.value)}
            >
              <MenuItem value="str">string</MenuItem>
              <MenuItem value="txt">markdown text</MenuItem>
              <MenuItem value="numb">number</MenuItem>
              <MenuItem value="bool">boolean</MenuItem>
              <MenuItem value="date">date</MenuItem>
            </TextField>
            <TextField size="small" label="label" fullWidth
                       value={config.label}
                       onChange={e => configLabelHandler(index, e.target.value)}
            />
            <IconButton color="error" onClick={() => removeConfigInput(index)}>
              <RemoveIcon className="text-red-400"/>
            </IconButton>
          </div>
        ))}
        <IconButton className="w-min animate-pulse" onClick={addConfigInput}>
          <AddIcon className="text-orange-400"/>
        </IconButton>

        {
          loading
            ? <Spinner className="ml-auto mr-1"/>
            : <Button type="submit" variant="outlined" className="w-[100px] self-end">Save</Button>
        }
      </form>
    </div>
  )
}
