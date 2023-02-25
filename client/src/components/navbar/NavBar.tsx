import './styles.css'
import { FC } from "react"
import { NavBarMenu } from "./NavBarMenu"
import { Link } from "react-router-dom"
import { clientRoutes } from "../../constants/routes"
import { LoaderLine } from "../UI/Loader/LoaderLine"
import { useApp } from "../../hooks/appStateHook"
import { SearchDialog } from "../search/SearchDialog"
import { SearchButton } from "./SearchButton"
import { PngLogoIcon } from "../UI/icons"
import { Box } from "@mui/material"
import { Text } from "../UI/Text"
import { useAppDispatch } from "../../store/store"
import { setSearchOpen } from "../../store/slices/appSlice"

export const NavBar: FC = () => {
  const dispatch = useAppDispatch()
  const { loading, isDark } = useApp()

  return (
    <>
      <div className={`navbar ${isDark && 'navbar_dark'} border-b`}>
        <div>
          <Box minWidth={220}>
            <Link to={clientRoutes.MAIN} className="flex">
              <img src={PngLogoIcon} alt="collections-logo" width={50} height={50}/>
              <Text variant="h5" alignSelf="center">collections</Text>
            </Link>
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
