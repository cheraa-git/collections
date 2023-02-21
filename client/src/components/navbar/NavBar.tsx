import './styles.css'
import { FC, useState } from "react"
import { NavBarMenu } from "./NavBarMenu"
import { Link } from "react-router-dom"
import { clientRoutes } from "../../constants/routes"
import { LoaderLine } from "../UI/Loader/LoaderLine"
import { useApp } from "../../hooks/appStateHook"
import { SearchDialog } from "../search/SearchDialog"
import { SearchButton } from "./SearchButton"
import { PngLogoIcon } from "../UI/icons"
import { Box, Typography } from "@mui/material"

export const NavBar: FC = () => {
  const { loading, isDark } = useApp()
  const [searchDialogOpen, setSearchDialogOpen] = useState(false)


  return (
    <>
      <div className={`navbar ${isDark && 'navbar_dark'} border-b`}>
        <div>
          <Box minWidth={220}>
            <Link to={clientRoutes.MAIN} className="flex">
              <img src={PngLogoIcon} alt="collections-logo" width={50} height={50}/>
              <Typography variant="h5" alignSelf="center">collections</Typography>
            </Link>
          </Box>
          <Box ml="auto" display="flex">
            <SearchButton onClick={() => setSearchDialogOpen(prev => !prev)}/>
            <SearchDialog open={searchDialogOpen} setOpen={setSearchDialogOpen}/>
            <NavBarMenu/>
          </Box>
        </div>
      </div>
      <Box >
        {loading && <LoaderLine/>}
      </Box>
    </>
  )
}
