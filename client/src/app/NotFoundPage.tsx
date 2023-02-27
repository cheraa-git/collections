import { useNavigate } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import { useApp } from "../hooks/appStateHook"
import { Text } from "../common/Text"
import { TransButton } from "../common/TransButton"

export function NotFoundPage() {
  const navigate = useNavigate()
  const theme = useApp().theme
  const bgColor = theme === 'light' ? '#fff' : '#121212'
  const goBackPage = () => {
    navigate(-1)
  }
  return (
    <Box display="flex" alignItems="center" flexDirection="column" height="100vh">
      <Box position="relative" mb={6}>
        <Typography fontWeight="lighter" fontSize="240px" height="273px">404</Typography>
        <Text position="absolute" bgcolor={bgColor} bottom={0} left="10%" right="10%" textAlign="center">
          THE PAGE CAN`T BE FOUND
        </Text>
      </Box>
      <TransButton variant="contained" onClick={goBackPage} className="py-4">Go back page</TransButton>
    </Box>
  )
}
