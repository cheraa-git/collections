import { FC } from "react"
import { NavBarMenu } from "./NavBarMenu"
import { Link } from "react-router-dom"
import { clientRoutes } from "../../constants/routes"
import SearchIcon from '@mui/icons-material/Search'
import { IconButton, InputBase } from "@mui/material"
import { LoaderLine } from "../UI/Loader/LoaderLine"
import { useApp } from "../../hooks/appStateHook"

export const NavBar: FC = () => {
  const { loading } = useApp()

  return (
    <div className="sticky top-0 z-10">
      <nav className="bg-gray-800 w-full ">
        <div className="mx-auto max-w-7xl px-2">
          <div className="relative flex h-16 items-center text-white">
            <div className="block sm:flex min-w-[200px]">
              <Link to={clientRoutes.MAIN}>
                <h1 className="text-start">Collections</h1>
              </Link>
            </div>
            <div className="ml-auto flex">
              <div className="bg-white text-gray-600 pl-3 rounded">
                <InputBase placeholder="Search..."/>
                <IconButton>
                  <SearchIcon className=""/>
                </IconButton>
              </div>
              <NavBarMenu/>
            </div>
          </div>
        </div>
      </nav>
      <LoaderLine hidden={!loading}/>
    </div>
  )
}
