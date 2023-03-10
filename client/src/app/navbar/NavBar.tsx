import '../../styles/navbar-styles.css'
import { FC } from "react"
import { NavBarMenu } from "./NavBarMenu"
import { Link, useNavigate } from "react-router-dom"
import { LoaderLine } from "../../common/Loader/LoaderLine"
import { useApp } from "../../hooks/appStateHook"
import { SearchDialog } from "../search/SearchDialog"
import { SearchButton } from "./SearchButton"
import { ArrowBackIosIcon, ArrowForwardIosIcon, PngLogoIcon } from "../../common/icons"
import { Box, IconButton } from "@mui/material"
import { Text } from "../../common/Text"
import { useAppDispatch } from "../../store/store"
import { setSearchOpen } from "../../store/slices/appSlice"

export const NavBar: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, isDark } = useApp()
  return (
    <>
      <div className={`navbar ${isDark && 'navbar_dark'} border-b`}>
        <div>
          <Box minWidth={50}>
            <Link to="/" className="flex">
              <img src={PngLogoIcon} alt="collections-logo" width={50} height={50}/>
              <Text variant="h5" alignSelf="center" hidden={window.innerWidth < 500}>collections</Text>
            </Link>
          </Box>
          <Box display="flex">
            <IconButton onClick={() => navigate(-1)}><ArrowBackIosIcon/></IconButton>
            <IconButton onClick={() => navigate(1)}><ArrowForwardIosIcon/></IconButton>
          </Box>
          <Box ml="auto" display="flex">
            <SearchButton onClick={() => dispatch(setSearchOpen(true))}/>
            <SearchDialog/>
            <NavBarMenu/>
          </Box>
        </div>
      </div>
      <Box>
        {loading && <LoaderLine/>}
      </Box>
    </>
  )
}
