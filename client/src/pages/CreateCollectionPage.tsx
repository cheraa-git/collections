import { FC, useEffect, useState } from "react"
import { Box, IconButton, MenuItem, TextField } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAppDispatch, } from "../store/store"
import { createCollection, editCollection } from "../store/actions/collectionActions"
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { useSnackbar } from "notistack"
import { MarkdownFormControl } from "../components/UI/Markdown/MarkdownFormControl"
import { ImageDrop } from "../components/UI/ImageDrop/ImageDrop"
import { MAX_IMAGE_SIZE } from "../constants/_other"
import { useLocation, useNavigate } from "react-router-dom"
import { useApp } from "../hooks/appStateHook"
import { Spinner } from "../components/UI/Loader/Spinner"
import { Collection, ItemConfigType } from "../../../common/common-types"
import { useCollection } from "../hooks/collectionStateHook"
import { Text } from "../components/UI/Text"
import { useTranslation } from "react-i18next"
import { TransButton } from "../components/UI/TransButton"
import { useAuth } from "../hooks/authHook"


interface Inputs {
  title: string
  description: string
  themeId: number
  image: FileList
  existingImage?: string
}

export const CreateCollectionPage: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { loading } = useApp()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuth, currentUser } = useAuth()
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues, control } = useForm<Inputs>()
  const [configInputs, setConfigInputs] = useState<ItemConfigType[]>([{ type: '', label: '' }])
  const imageFile = watch('image') && watch('image').length > 0 ? watch('image')[0] : undefined
  const fixedConfigInputs = [['string', 'title'], ['tags', 'tags']]
  const editable: { collection: Collection, itemConfigs: ItemConfigType[] } | undefined = location.state?.editable
  const userId = location.state?.userId ||  currentUser.id
  const themes = useCollection().themes


  useEffect(() => {
    if (!isAuth) navigate('/')
  }, [isAuth, navigate])

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
      dispatch(createCollection({ ...data, image: data.image[0], itemConfigs, userId }, navigate))
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
    <Box maxWidth="900px" mx="auto" px={5} py={4} className="border-x">
      <Text variant="h4">{editable ? 'Edit' : 'Create'} collection</Text>
      <Box component="form" display="flex" flexDirection="column" mx="auto" px={1} onSubmit={handleSubmit(onSubmit)}>

        <TextField label={t("Title")} margin="normal" {...register('title', { required: true })}
                   error={!!errors.title}/>

        <TextField select label={t("Theme")} defaultValue={editable?.collection.themeId || ''} margin="normal"
                   {...register('themeId', { required: true, })} error={!!errors.themeId}>
          {themes.map((theme) => <MenuItem key={theme.id} value={theme.id}>{theme.name}</MenuItem>)}
        </TextField>

        <Text variant="h6">If you want, add a picture of the collection</Text>
        <Box mx="auto">
          <ImageDrop imageFile={imageFile}
                     inputProps={{ ...register('image') }}
                     clearFile={clearImage}
                     existingImageUrl={getValues().existingImage}
          />
        </Box>

        <Box mb={2}>
          <MarkdownFormControl control={control} controlName="description" label="Enter a description"/>
        </Box>

        {fixedConfigInputs.map((config, index) => (
          <Box my={1} display="flex" mr={5} key={index}>
            <TextField size="small" sx={{ mr: 2 }} label={t("type")} disabled value={t(config[0])} fullWidth/>
            <TextField size="small" label={t("label")} disabled value={t(config[1])} fullWidth/>
          </Box>
        ))}

        {configInputs.map((config, index) => (
          <Box display="flex" my={1} key={index}>
            <TextField sx={{ mr: 2 }} select size="small" label={t("type")} fullWidth
                       value={config.type.slice(0, -1)}
                       onChange={(e) => configTypeHandler(index, e.target.value)}
            >
              <MenuItem value="str">{t('string')}</MenuItem>
              <MenuItem value="txt">markdown</MenuItem>
              <MenuItem value="numb">{t('number')}</MenuItem>
              <MenuItem value="bool">{t('checkbox')}</MenuItem>
              <MenuItem value="date">{t('date')}</MenuItem>
            </TextField>
            <TextField size="small" label={t("label")} fullWidth
                       value={config.label}
                       onChange={e => configLabelHandler(index, e.target.value)}
            />
            <IconButton color="error" onClick={() => removeConfigInput(index)}>
              <RemoveIcon className="red"/>
            </IconButton>
          </Box>
        ))}
        <IconButton className="w-min animate-pulse" onClick={addConfigInput}>
          <AddIcon className="blue"/>
        </IconButton>

        {
          loading
            ? <Box ml="auto"><Spinner/></Box>
            : <Box alignSelf="end"><TransButton type="submit" variant="outlined">Save</TransButton></Box>
        }
      </Box>
    </Box>
  )
}
