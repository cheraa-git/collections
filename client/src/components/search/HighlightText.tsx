import { FC } from "react"
import { Typography, TypographyProps } from "@mui/material"

interface HighlightProps {
  highlight: { value: string, isHighlighted: boolean }[]
  fontSize?: TypographyProps['fontSize']
}

export const HighlightText: FC<HighlightProps> = ({ highlight, fontSize }) => {
  return (
    <Typography fontSize={fontSize}>
      {highlight.map(
        (part, index) =>
          part.isHighlighted ? (
            <mark key={index} style={{ background: "#ccc" }}>{part.value}</mark>
          ) : (
            <span key={index}>{part.value}</span>
          )
      )}
    </Typography>
  )
}
