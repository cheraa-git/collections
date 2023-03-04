import { FC } from "react"
import { Box, TextField } from "@mui/material"
import { useTranslation } from "react-i18next"

export const FixedConfigInputs: FC = () => {
  const { t } = useTranslation()
  const fixedConfigInputs = [['string', 'title'], ['tags', 'tags']]

  return (
    <>
      {fixedConfigInputs.map((config, index) => (
        <Box my={1} display="flex" key={index}>
          <TextField size="small" sx={{ mr: 2 }} label={t("type")} disabled value={t(config[0])} fullWidth/>
          <TextField size="small" label={t("label")} disabled value={t(config[1])} fullWidth/>
        </Box>
      ))}
    </>
  )
}
