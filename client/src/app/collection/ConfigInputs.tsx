import { FC } from "react"
import { Box, IconButton, MenuItem, TextField, Tooltip } from "@mui/material"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"
import { Collection, ItemConfigType } from "../../../../common/types/collection"
import { useConfirm } from "../../hooks/confirmHook"
import { RemoveIcon, VisibilityIcon, VisibilityOffIcon } from "../../common/icons"


interface ConfigInputsProps {
  configInputs: ItemConfigType[]
  setConfigInputs: (configs: ItemConfigType[]) => void
  editable?: { collection: Collection, itemConfigs: ItemConfigType[] }
}

export const ConfigInputs: FC<ConfigInputsProps> = ({ configInputs, setConfigInputs, editable }) => {
  const { t } = useTranslation()
  const { enqueueSnackbar: snackbar } = useSnackbar()
  const { showConfirm } = useConfirm()

  const configTypeHandler = (index: number, type: string) => {
    const newConfig = [...configInputs]
    const count = newConfig.filter(config => config.type.includes(type)).length + 1
    if (count > 3) {
      return snackbar(t('You have reached the maximum number of fields with this type'))
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
    if (editable) {
      showConfirm(t('This action will delete the field of each item'), () => {
        setConfigInputs(configInputs.filter((_, i) => i !== index))
      })
    } else setConfigInputs(configInputs.filter((_, i) => i !== index))
  }

  const toggleVisible = (index: number) => {
    const newConfig = [...configInputs]
    newConfig[index].hidden = !newConfig[index].hidden
    setConfigInputs(newConfig)
  }

  const getInputActions = (config: ItemConfigType, index: number) => (
    <>
      <IconButton color="error" onClick={() => removeConfigInput(index)}>
        <RemoveIcon className="red"/>
      </IconButton>
      {
        config.hidden
          ?
          <Tooltip title={t('Show')}>
            <IconButton onClick={() => toggleVisible(index)}>
              <VisibilityOffIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
          :
          <Tooltip title={t('Hide')}>
            <IconButton onClick={() => toggleVisible(index)}>
              <VisibilityIcon fontSize="small"/>
            </IconButton>
          </Tooltip>
      }
    </>
  )

  return (
    <div>
      {configInputs.map((config, index) => (
        <Box display="flex" my={1} key={index}>
          <TextField sx={{ mr: 2 }} select label={t("type")} fullWidth
                     value={config.type.slice(0, -1)}
                     onChange={(e) => configTypeHandler(index, e.target.value)}
          >
            <MenuItem value="str">{t('string')}</MenuItem>
            <MenuItem value="txt">markdown</MenuItem>
            <MenuItem value="numb">{t('number')}</MenuItem>
            <MenuItem value="bool">{t('checkbox')}</MenuItem>
            <MenuItem value="date">{t('date')}</MenuItem>
          </TextField>
          <TextField
            label={t("label")} fullWidth
            value={config.label}
            onChange={e => configLabelHandler(index, e.target.value)}
            InputProps={{ endAdornment: getInputActions(config, index) }}
          />
        </Box>
      ))}
    </div>
  )
}
