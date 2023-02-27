import { FC } from "react"
import { Typography, TypographyProps } from "@mui/material"
import { Trans, useTranslation } from "react-i18next"

export const Text: FC<TypographyProps> = ({ children, ...props }) => {
  const {t} = useTranslation()
  return (
    <Typography {...props}>
      <Trans t={t}>
        {children}
      </Trans>
    </Typography>
  )
}
