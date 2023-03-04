import { FC } from "react"
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
  GridToolbarQuickFilter
} from '@mui/x-data-grid'

export const ToolBar: FC = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton/>
      <GridToolbarFilterButton/>
      <GridToolbarExport/>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )
}
