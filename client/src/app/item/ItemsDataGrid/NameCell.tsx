import { FC } from "react"
import { GridRenderCellParams } from "@mui/x-data-grid"
import { Box, Typography } from "@mui/material"

export const NameCell: FC<{ params: GridRenderCellParams }> = ({ params }) => {
  return (
    <Box>
      <Typography height="100%" whiteSpace="normal" fontWeight="bold">
        {params.row.name}
      </Typography>
    </Box>
  )
}
