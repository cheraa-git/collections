import { FC } from "react"
import '../../styles/loaders.css'

interface SpinnerProps {
  className?: string
  variant?: 'normal' | 'small'
}

export const Spinner: FC<SpinnerProps> = ({ className, variant = 'normal' }) => {
  return <span className={`${variant === 'normal' ? 'spinner' : 'mini-spinner'} ${className}`}></span>
}
