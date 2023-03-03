import { FC } from "react"
import { Box, IconButton, MenuItem, TextField } from "@mui/material"
import RemoveIcon from '@mui/icons-material/Remove'
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"
import { Collection, ItemConfigType } from "../../../../common/types/collection"


interface ConfigInputsProps {
  configInputs: ItemConfigType[]
  setConfigInputs: (configs: ItemConfigType[]) => void
  editable?: { collection: Collection, itemConfigs: ItemConfigType[] }
}
export const ConfigInputs: FC<ConfigInputsProps> = ({configInputs, setConfigInputs, editable}) => {
  const { t } = useTranslation()
  const { enqueueSnackbar: snackbar } = useSnackbar()

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


  const removeConfigInput = (index: number) => {
    setConfigInputs(configInputs.filter((_, i) => i !== index))
  }

  return (
    <div>
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
    </div>
  )
}
