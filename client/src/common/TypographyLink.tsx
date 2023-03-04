import { FC } from "react"
import { Typography, TypographyProps } from "@mui/material"
import { Link } from "react-router-dom"

interface TypographyLinkProps extends TypographyProps {
  to: string
}

export const TypographyLink: FC<TypographyLinkProps> = ({ to, children, ...props }) => {
  return (
    <Link to={to} className="link h-min flex">
      <Typography {...props}>
        {children}
      </Typography>
    </Link>
  )
}
