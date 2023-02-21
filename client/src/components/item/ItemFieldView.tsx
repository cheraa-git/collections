import { FC } from "react"
import { Item, ItemConfigType } from "../../../../common/common-types"
import MDEditor from "@uiw/react-md-editor"
import { Box, Checkbox, Typography } from "@mui/material"
import dayjs from "dayjs"
import { useApp } from "../../hooks/appStateHook"

interface ItemFieldViewProps {
  item?: Item
  config: ItemConfigType
}

export const ItemFieldView: FC<ItemFieldViewProps> = ({ config, item }) => {
  const sliceType = config.type.slice(0, -1)
  const theme = useApp().theme
  const getView = () => {
    if (item) {
      const value = item[config.type]
      switch (sliceType) {
        case 'date':
          return <Typography>{value ? dayjs(value as string).format('MM-DD-YYYY') : "-"}</Typography>
        case 'str':
          return <Typography>{value}</Typography>
        case 'txt':
          return <MDEditor.Markdown source={value as string}/>
        case 'numb':
          return <Typography>{value}</Typography>
        case 'bool':
          return <Checkbox checked={!!value}/>
        default:
          return <></>
      }
    }
  }

  return (
    <Box my={1} p={1} className="border rounded" data-color-mode={theme}>
      <Typography variant="h6">{config.label}</Typography>
      {getView()}
    </Box>
  )
}
