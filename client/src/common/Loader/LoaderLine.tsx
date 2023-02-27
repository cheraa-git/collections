import { FC } from "react"
import './Loader.css'

export const LoaderLine: FC<{ hidden?: boolean }> = ({ hidden }) => {
  return (
    <div className="loader-line" hidden={hidden}></div>
  )
}
