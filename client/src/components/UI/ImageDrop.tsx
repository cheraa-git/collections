import { FC, InputHTMLAttributes } from "react"
import { formatFileSize } from "../../utils"
import { MAX_IMAGE_SIZE } from "../../constants/_other"
import CloseIcon from '@mui/icons-material/Close'

interface ImageDropProps {
  inputProps?: InputHTMLAttributes<HTMLInputElement>
  className?: string
  imageFile?: File
  clearFile?: () => void
}

export const ImageDrop: FC<ImageDropProps> = ({ imageFile, inputProps, className, clearFile }) => {
  const imageUrl = imageFile ? URL.createObjectURL(imageFile) : ''
  const sizeAllowed = imageFile && imageFile.size > MAX_IMAGE_SIZE

  return (
    <div
      className={`border-2 border-dashed relative w-[300px] h-[200px] hover:border-blue-400 transition-colors ${className}`}>

      <p hidden={!!imageFile} className="text-sm absolute right-1 top-1 text-gray-400">
        max size: {formatFileSize(MAX_IMAGE_SIZE)}
      </p>
      <h3 hidden={!!imageUrl} className="absolute top-[45%] text-center w-full">Drop your image here</h3>

      <p hidden={!imageFile} className={`text-sm absolute left-1 top-1 ${sizeAllowed && 'text-red-600'}`}>
        size: {imageFile && formatFileSize(imageFile.size)}
      </p>
      <div className="flex items-center justify-center h-full">
        <div hidden={!imageUrl} className="relative">
          <img className="max-w-[250px] max-h-[150px] rounded" src={imageUrl} alt="upload"/>

          <div hidden={!clearFile} className="absolute right-0 top-0 z-20" onClick={clearFile}>
            <CloseIcon className="text-red-300 hover:text-red-500"/>
          </div>
        </div>
      </div>

      <p className="absolute bottom-0.5 right-0 left-0 text-center text-sm truncate">{imageFile?.name}</p>

      <input className="absolute left-0 right-0 top-0 bottom-0 opacity-0" type="file" {...inputProps}/>
    </div>

  )
}
