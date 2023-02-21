import { FC } from "react"
import { Button, ButtonProps } from "@mui/material"
import { Trans, useTranslation } from "react-i18next"

export const TransButton: FC<ButtonProps> = ({ children, ...props }) => {
  const { t } = useTranslation()
  return (
    <Button {...props}>
      <Trans t={t}>
        {children}
      </Trans>
    </Button>
  )
}
