import './styles.css'
import { FC, InputHTMLAttributes } from "react"
import { formatFileSize } from "../../utils"
import { MAX_IMAGE_SIZE } from "../../constants/_other"
import { Box } from "@mui/material"
import { CloseIcon } from "../icons"
import { useTranslation } from "react-i18next"
import { Text } from "../Text"

interface ImageDropProps {
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  className?: string
  imageFile?: File
  clearFile?: () => void
  existingImageUrl?: string
}

export const ImageDrop: FC<ImageDropProps> = ({ imageFile, inputProps, className, clearFile, existingImageUrl }) => {
  const { t } = useTranslation()
  const imageUrl = (imageFile ? URL.createObjectURL(imageFile) : '') || existingImageUrl
  const sizeAllowed = imageFile && imageFile.size > MAX_IMAGE_SIZE

  return (
    <Box className={`drop ${className}`}>
      <p className={`drop-max-size ${sizeAllowed && 'red'}`}>
        {imageFile
          ? `${t('size')} ${imageFile && formatFileSize(imageFile.size)}`
          : `${t('max size')} ${formatFileSize(MAX_IMAGE_SIZE)}`
        }
      </p>
      <Text hidden={!!imageUrl} className="drop-title">Drop your image here</Text>

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
