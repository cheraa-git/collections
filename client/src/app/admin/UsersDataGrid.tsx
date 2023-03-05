import { FC, useEffect, useState } from "react"
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { Box, LinearProgress } from "@mui/material"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { getUsers } from "../../store/actions/adminActions"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { UserActions } from "./UsersActions"
import { MultipleActionsMenu } from "./MultipleActionsMenu"
import { Text } from "../../common/Text"
import { ToolBar } from "../item/ItemsDataGrid/ToolBar"


export const UsersDataGrid: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { users, loading } = useAppSelector((state: RootState) => state.admin)
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([])

  useEffect(() => {
    dispatch(getUsers())
  }, [dispatch])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'nickname',
      headerName: t('Nickname') || '',
      width: 150,
      renderCell: (params) => <Link to={`/profile/${params.row.id}`} className="link">{params.row.nickname}</Link>
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 200,
    },
    {
      field: 'isAdmin',
      type: 'boolean',
      width: 80
    },
    {
      field: 'actions',
      headerName: t('Actions') || '',
      type: 'actions',
      width: 180,
      renderCell: UserActions
    },

  ]


  return (
    <Box height={window.innerHeight - 200} width="100%" maxWidth={740} mx="auto">
      <Box display="flex" justifyContent="space-between">
        <Text alignSelf="center">Users management</Text>
        <MultipleActionsMenu selectionModel={selectionModel as number[]}/>
      </Box>
      <DataGrid
        rows={users}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        onRowSelectionModelChange={(newSelectionModel) => setSelectionModel(newSelectionModel)}
        rowSelectionModel={selectionModel}
        slots={{ toolbar: ToolBar, loadingOverlay: LinearProgress }}
        loading={loading}
      />
    </Box>
  )
}
