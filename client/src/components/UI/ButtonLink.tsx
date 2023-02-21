import { FC } from "react"
import { Button, ButtonProps, } from "@mui/material"
import { Link } from "react-router-dom"

interface ButtonLinkProps extends ButtonProps {
  to: string
}

export const ButtonLink: FC<ButtonLinkProps> = ({ to, children, ...props }) => {
  return (
    <Link to={to}>
      <Button {...props}>
        {children}
      </Button>
    </Link>
  )
}
