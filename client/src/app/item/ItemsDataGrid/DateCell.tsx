import { FC } from "react"
import { GridRenderCellParams } from "@mui/x-data-grid"
import { Box, Typography } from "@mui/material"

export const DateCell: FC<{ params: GridRenderCellParams }> = ({ params }) => {
  return (
    <Box>
      <Typography fontSize="small" color="gray">
        {params.formattedValue}
      </Typography>
    </Box>
  )
}
