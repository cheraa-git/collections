import { FC } from "react"
import './styles.css'

export const LoaderLine: FC<{ hidden?: boolean }> = ({ hidden }) => {
  return (
    <div className="loader-line" hidden={hidden}></div>
  )
}
