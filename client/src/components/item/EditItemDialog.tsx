import { FC, useEffect, useState } from "react"
import { ItemField } from "./ItemField"
import { Box, Dialog, TextField } from "@mui/material"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useAppDispatch } from "../../store/store"
import { createItem, editItem } from "../../store/actions/itemActions"
import { Fields, Item, Tag } from "../../../../common/common-types"
import { useCollection } from "../../hooks/collectionStateHook"
import { TagsArea } from "./TagsArea"
import { Text } from "../UI/Text"
import { TransButton } from "../UI/TransButton"
import { useTranslation } from "react-i18next"


interface EditItemDialogProps {
  open: boolean
  onClose: () => void
  collectionId: number
  item?: Item
}

export const EditItemDialog: FC<EditItemDialogProps> = ({ open, onClose, collectionId, item }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<FieldValues>({})
  const itemConfigs = useCollection().itemConfigs
  const [addedTags, setAddedTags] = useState<Tag[]>([])

  useEffect(() => {
    if (item) {
      Object.entries(item).forEach(([key, value]) => setValue(key, value))
      setAddedTags(item.tags)
    }
  }, [item])

  const submitHandler: SubmitHandler<FieldValues> = (data) => {
    if (item) {
      dispatch(editItem({ ...data, tags: addedTags } as Item))
    } else {
      dispatch(createItem({ collectionId, fields: { ...data } as Fields, tags: addedTags }))
    }
    onClose()
  }


  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <Box component="form" px={3} py={1} onSubmit={handleSubmit(submitHandler)}>
        <Text variant="h5">{item ? 'Edit' : 'Create'} item</Text>
        <TextField label={t("title")} size="small" margin="dense" fullWidth
                   {...register('name', { required: true })}
                   error={!!errors.name}/>
        <Box my={1}>
          <TagsArea value={addedTags} setValue={setAddedTags}/>
        </Box>

        {itemConfigs.map(config => {
            const required = config.type.slice(0, -1) !== 'bool'
            return (
              <div key={config.id}>
                <ItemField type={config.type} label={config.label} control={control} required={required}/>
              </div>
            )
          }
        )}
        <Box display="flex" justifyContent="space-between" mt={1}>
          <TransButton onClick={onClose} color="inherit">Cancel</TransButton>
          <TransButton type="submit">Save</TransButton>
        </Box>
      </Box>
    </Dialog>
  )
}
