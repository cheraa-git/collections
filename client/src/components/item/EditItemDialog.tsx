import { FC, useEffect } from "react"
import { ItemField } from "./ItemField"
import { Button, Dialog, TextField } from "@mui/material"
import { FieldValues, SubmitHandler, useForm } from "react-hook-form"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { createItem, editItem } from "../../store/actions/collectionActions"
import { Fields } from "../../../../common/common-types"
import { Item } from "../../../../common/common-types"


interface EditItemDialogProps {
  open: boolean
  onClose: () => void
  collectionId: number
  item?: Item
}

export const EditItemDialog: FC<EditItemDialogProps> = ({ open, onClose, collectionId, item }) => {
  const dispatch = useAppDispatch()
  const { register, handleSubmit, formState: { errors }, control, setValue } = useForm<FieldValues>()
  const itemConfigs = useAppSelector((state: RootState) => state.collection.itemConfigs)
  // const _itemConfigs = [
  //   { id: 1, type: 'date1', label: 'date' },
  //   { id: 2, type: 'str1', label: 'title' },
  //   { id: 3, type: 'txt1', label: 'description' },
  //   { id: 4, type: 'numb1', label: 'number' },
  //   { id: 5, type: 'bool1', label: 'isNice' }]

  useEffect(() => {
    if (item) {
      Object.entries(item).forEach(([key, value]) => setValue(key, value))
    }
  }, [])
  const submitHandler: SubmitHandler<FieldValues> = (data) => {
    if (item) {
      console.log("EDIT", data)
      dispatch(editItem(data as Item))
    } else {
      dispatch(createItem({ collectionId, fields: { ...data } as Fields }))
    }
    onClose()
  }
  return (
    <Dialog open={open} fullWidth onClose={onClose}>
      <form className="p-5" onSubmit={handleSubmit(submitHandler)}>
        <h1>{item ? 'Edit' : 'Create'} Item</h1>
        <TextField label="name" size="small" margin="dense" fullWidth
                   {...register('name', { required: true })}
                   error={!!errors.name}/>
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
