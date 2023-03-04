import { FC, useEffect, useState } from "react"
import { DataGrid, GridColDef, GridSelectionModel } from '@mui/x-data-grid'
import { Box } from "@mui/material"
import { RootState, useAppDispatch, useAppSelector } from "../../store/store"
import { getUsers } from "../../store/actions/adminActions"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { UserActions } from "./UsersActions"
import { MultipleActionsMenu } from "./MultipleActionsMenu"
import { Text } from "../../common/Text"


export const UsersDataGrid: FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { users } = useAppSelector((state: RootState) => state.admin)
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])

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
      width: 160,
      renderCell: UserActions
    },

  ]


  return (
    <Box height={window.innerHeight - 200} width="100%" maxWidth={720} mx="auto">
      <Box display="flex" justifyContent="space-between">
        <Text alignSelf="center">Users management</Text>
        <MultipleActionsMenu selectionModel={selectionModel as number[]}/>
      </Box>
      <DataGrid
        rows={users}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
        onSelectionModelChange={(newSelectionModel) => setSelectionModel(newSelectionModel)}
        selectionModel={selectionModel}
      />
    </Box>
  )
}
