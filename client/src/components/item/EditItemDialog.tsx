import { FC, KeyboardEvent, useEffect, useState } from "react"
import { ItemField } from "./ItemField"
import { Button, Dialog, TextField } from "@mui/material"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { useAppDispatch } from "../../store/store"
import { createItem, editItem } from "../../store/actions/itemActions"
import { Fields, Item, Tag } from "../../../../common/common-types"
import { useCollection } from "../../hooks/collectionStateHook"
import { TagsArea } from "./TagsArea"


interface EditItemDialogProps {
  open: boolean
  onClose: () => void
  collectionId: number
  item?: Item
}

export const EditItemDialog: FC<EditItemDialogProps> = ({ open, onClose, collectionId, item }) => {
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
      console.log("EDIT", data)
      dispatch(editItem({ ...data, tags: addedTags } as Item))
    } else {
      dispatch(createItem({ collectionId, fields: { ...data } as Fields, tags: addedTags }))
    }
    onClose()
  }

  const preventEnter = (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.code === 'Enter') {
      event.preventDefault()
    }
  }

  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <form className="p-5" onSubmit={handleSubmit(submitHandler)} onKeyDown={preventEnter}>
        <h1>{item ? 'Edit' : 'Create'} Item</h1>
        <TextField label="name" size="small" margin="dense" fullWidth
                   {...register('name', { required: true })}
                   error={!!errors.name}/>
        <div className="my-2">
          <TagsArea value={addedTags} setValue={setAddedTags}/>
        </div>

        {itemConfigs.map(config => {
            const required = config.type.slice(0, -1) !== 'bool'
            return (
              <div className="" key={config.id}>
                <ItemField type={config.type} label={config.label} control={control} required={required}/>
              </div>
            )
          }
        )}
        <div className="flex justify-between text-gray-400">
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Dialog>
  )
}
