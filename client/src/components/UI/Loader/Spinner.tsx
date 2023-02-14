import { FC } from "react"
import './Loader.css'

export const Spinner: FC<{ className?: string }> = ({ className }) => {
  return <span className={`loader ${className}`}></span>
}
