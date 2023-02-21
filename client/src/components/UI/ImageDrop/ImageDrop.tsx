import './styles.css'
import { FC, InputHTMLAttributes } from "react"
import { formatFileSize } from "../../../utils"
import { MAX_IMAGE_SIZE } from "../../../constants/_other"
import { Box, Typography } from "@mui/material"
import { CloseIcon } from "../icons"

interface ImageDropProps {
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  className?: string
  imageFile?: File
  clearFile?: () => void
  existingImageUrl?: string
}

export const ImageDrop: FC<ImageDropProps> = ({ imageFile, inputProps, className, clearFile, existingImageUrl }) => {
  const imageUrl = (imageFile ? URL.createObjectURL(imageFile) : '') || existingImageUrl
  const sizeAllowed = imageFile && imageFile.size > MAX_IMAGE_SIZE

  return (
    <Box
      className={`drop ${className}`}>

      <p className={`drop-max-size ${sizeAllowed && 'red'}`}>
        {imageFile
          ? `size: ${imageFile && formatFileSize(imageFile.size)}`
          : `max size: ${formatFileSize(MAX_IMAGE_SIZE)}`
        }
      </p>
      <Typography hidden={!!imageUrl} className="drop-title">Drop your image here</Typography>

      <Box className="image-container">
        <Box hidden={!imageUrl} position="relative">
          <img className="image" src={imageUrl} alt="upload"/>
          <Box hidden={!clearFile} className="image-close" onClick={clearFile}>
            <CloseIcon fontSize="small"/>
          </Box>
        </Box>
      </Box>

      <p className="image-name">{imageFile?.name}</p>

      <input className="drop-input" type="file" {...inputProps}/>
    </Box>

  )
}
