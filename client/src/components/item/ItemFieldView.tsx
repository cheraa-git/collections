import { FC } from "react"
import { Item, ItemConfigType } from "../../../../common/common-types"
import MDEditor from "@uiw/react-md-editor"
import { Checkbox } from "@mui/material"
import dayjs from "dayjs"

interface ItemFieldViewProps {
  item?: Item
  config: ItemConfigType
}

export const ItemFieldView: FC<ItemFieldViewProps> = ({ config, item }) => {
  const sliceType = config.type.slice(0, -1)
  const getView = () => {
    if (item) {
      const value = item[config.type]
      switch (sliceType) {
        case 'date':
          return <p>{dayjs(value as string).format('MM-DD-YYYY')}</p>
        case 'str':
          return <p>{value}</p>
        case 'txt':
          return <MDEditor.Markdown source={value as string}/>
        case 'numb':
          return <p>{value}</p>
        case 'bool':
          return <Checkbox checked={!!value}/>
        default:
          return <></>
      }
    }
  }

  return (
    <div className="shadow my-2 p-2 bg-white rounded">
      <h3>{config.label}</h3>
      {getView()}
    </div>
  )
}
