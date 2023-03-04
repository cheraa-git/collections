import { FC, useEffect, useRef, useState } from "react"
import { Box, Typography } from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

export const TextCell: FC<{ source: string }> = ({ source }) => {
  const boxRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const [showEllipsis, setShowEllipsis] = useState(false)

  useEffect(() => {
    if (!boxRef.current || !textRef.current) return
    if (boxRef.current?.offsetHeight < textRef.current?.offsetHeight) {
      setShowEllipsis(true)
    } else {
      setShowEllipsis(false)
    }
  }, [])

  return (
    <Box height="100%"  position="relative">
      <Box height="calc(100% - 10px)" overflow="hidden" ref={boxRef} >
        <Typography fontSize="0.875rem" whiteSpace="pre-wrap" ref={textRef} >
          {source}
        </Typography>
      </Box>
      <Box position="absolute" bottom={-12} right={-4}>
        {showEllipsis && <MoreHorizIcon sx={{ ml: 0 }} fontSize="small" color="disabled"/>}
      </Box>
    </Box>

  )
}
