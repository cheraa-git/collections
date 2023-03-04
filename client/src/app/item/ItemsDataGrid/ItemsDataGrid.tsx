import { FC } from "react"
import { ItemConfigType } from "../../../../../common/types/collection"
import { Item } from "../../../../../common/types/item"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { Box, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { dateFormat } from "../../../utils"
import { NameCell } from "./NameCell"
import { TextCell } from "./TextCell"
import { mdToString } from "../../../common/Markdown/mdToString"
import { DateCell } from "./DateCell"
import { useTranslation } from "react-i18next"

interface ItemsDataGridProps {
  itemConfigs: ItemConfigType[]
  items: Item[]
}

export const ItemsDataGrid: FC<ItemsDataGridProps> = ({ itemConfigs, items }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const getColumnConfig = (type: string): Omit<GridColDef, 'field'> => {
    if (type.includes('str')) {
      return { renderCell: (params) => <TextCell source={params.row[type]}/> }
    }
    if (type.includes('bool')) {
      return { type: 'boolean', minWidth: 150 }
    }
    if (type.includes('numb')) {
      return { type: 'number', minWidth: 100, }
    }
    if (type.includes('date')) {
      return {
        type: 'date',
        minWidth: 120,
        renderCell: params => <Typography fontSize="small" color="gray">{dateFormat(params.row[type])}</Typography>
      }
    }
    if (type.includes('txt')) {
      return { renderCell: (params) => <TextCell source={mdToString(params.row[type])}/> }
    }
    return { type: 'string' }
  }

  const defaultColumn: GridColDef[] = [
    { field: 'name', minWidth: 200, headerName: t('Title') || '', renderCell: params => <NameCell params={params}/> },
    {
      field: 'timestamp',
      minWidth: 140,
      headerName: t('Publication date') || '',
      renderCell: params => <DateCell params={params}/>
    }
  ]
  const columns: GridColDef[] = itemConfigs.map(config => ({
    field: config.type, headerName: config.label, minWidth: 200, flex: 1, ...getColumnConfig(config.type)
  }))

  return (
    <Box width="100%" mt={3}>
      <DataGrid
        rowSpacingType="margin"
        getRowHeight={({ model }) => Math.ceil(model.name.length / 24) * 23 + 23}
        columns={[...defaultColumn, ...columns]}
        rows={items}
        onRowClick={(row) => navigate(`/item/${row.id}`)}
        disableSelectionOnClick
        autoHeight
      />
    </Box>
  )
}
