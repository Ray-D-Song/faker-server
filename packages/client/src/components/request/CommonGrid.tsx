import { useState, useEffect } from 'react'
import { DataGrid, GridColDef, useGridApiRef } from '@mui/x-data-grid'
import { Autocomplete, TextField, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

interface CommonGridProps {
  cols: Array<{
    editable: boolean
    headerName: string
    type: 'input' | 'select'
    options?: Array<string>
  }>
  onUpdate: (val: unknown) => void
}

function CommonGrid({ cols, onUpdate }: CommonGridProps) {
  const columns: GridColDef[] = [
    ...cols.map((col, index) => {
      let obj: GridColDef = {
        field: `field${index + 1}`,
        headerName: col.headerName,
        editable: col.editable,
        flex: 1,
      }
      if (col.type === 'select') {
        obj.renderEditCell = (params: any) => (
          <Autocomplete
            freeSolo
            fullWidth
            options={col.options || []}
            renderInput={(params) => <TextField {...params} />}
            value={params.value}
            onChange={(_, newValue) => {
              params.api.setEditCellValue({
                id: params.id,
                field: `field${index + 1}`,
                value: newValue,
              })
            }}
            onInputChange={(_, newInputValue) => {
              params.api.setEditCellValue({
                id: params.id,
                field: `field${index + 1}`,
                value: newInputValue,
              })
            }}
          />
        )
      }
      return obj
    }),
    {
      field: 'actions',
      headerName: '操作',
      sortable: false,
      width: 100,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDeleteRow(params.row.id)}
          size="small"
          aria-label="删除"
          disabled={rows.length === 1}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      ),
    },
  ]

  const [rows, setRows] = useState([{ id: 1, field1: '', field2: '' }])

  const handleDeleteRow = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id))
  }

  useEffect(() => {
    const lastRow = rows[rows.length - 1]
    if (lastRow.field1 && lastRow.field2) {
      setRows([...rows, { id: rows.length + 1, field1: '', field2: '' }])
    }

    const filteredRows = rows.filter((row) => row.field1 && row.field2)
    const resultObject = filteredRows.reduce<Record<string, string>>(
      (acc, row) => {
        acc[row.field1] = row.field2
        return acc
      },
      {},
    )
    onUpdate(resultObject)
  }, [rows])

  const apiRef = useGridApiRef()
  const handleCellEditStop = (params: any) => {
    const newRow = apiRef.current?.getRowWithUpdatedValues(
      params.id,
      params.field,
    )
    setRows(
      rows.map((row) =>
        row.id === newRow.id
          ? (newRow as { id: number; field1: string; field2: string })
          : row,
      ),
    )
  }

  return (
    <div style={{ height: 200, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellEditStop={handleCellEditStop}
        hideFooter
        density="compact"
        apiRef={apiRef}
      />
    </div>
  )
}

export default CommonGrid
