import { FC, useEffect, useState } from "react"
import { Box, IconButton, MenuItem, TextField } from "@mui/material"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAppDispatch, } from "../../store/store"
import { createCollection, editCollection } from "../../store/actions/collectionActions"
import { useSnackbar } from "notistack"
import { MarkdownFormControl } from "../../common/Markdown/MarkdownFormControl"
import { ImageDrop } from "../../common/ImageDrop/ImageDrop"
import { MAX_IMAGE_SIZE } from "../../constants/image-drop"
import { useLocation, useNavigate } from "react-router-dom"
import { Spinner } from "../../common/Loader/Spinner"
import { Collection, ItemConfigType } from "../../../../common/common-types"
import { useCollection } from "../../hooks/collectionStateHook"
import { Text } from "../../common/Text"
import { useTranslation } from "react-i18next"
import { TransButton } from "../../common/TransButton"
import { useAuth } from "../../hooks/authHook"
import { ConfigInputs } from "./ConfigInputs"
import { FixedConfigInputs } from "./FixedConfigInputs"
import { AddIcon } from "../../common/icons"


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
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuth, currentUser } = useAuth()
  const
    { register, handleSubmit, formState: { errors }, watch, setValue, reset, getValues, control } = useForm<Inputs>()
  const [configInputs, setConfigInputs] = useState<ItemConfigType[]>([{ type: '', label: '' }])
  const imageFile = watch('image') && watch('image').length > 0 ? watch('image')[0] : undefined
  const editable: { collection: Collection, itemConfigs: ItemConfigType[] } | undefined = location.state?.editable
  const userId = location.state?.userId || currentUser.id
  const { themes, loading } = useCollection()


  useEffect(() => {
    if (!isAuth) navigate('/')
  }, [isAuth, navigate])

  useEffect(() => {
    if (editable) {
      const { title, description, themeId, imageUrl } = editable.collection
      reset({ title, description, themeId, existingImage: imageUrl })
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

  const addConfigInput = () => {
    setConfigInputs(prev => [...prev, { type: '', label: '' }])
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

        <FixedConfigInputs/>

        <ConfigInputs configInputs={configInputs} setConfigInputs={setConfigInputs} editable={editable}/>

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
