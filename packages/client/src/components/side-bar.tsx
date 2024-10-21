import {
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Box,
  Button,
} from '@mui/material'
import { t } from 'i18next'
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import toast from 'react-hot-toast'
import { ApiListItem } from '../types/ApiList'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyContext from '../ctx/key'
import SetKeyDialog from './set-key-dialog'

const drawerWidth = 240

interface SideBarProps {
  onSelectItem: (id: string) => void
  onSelectCreate: () => void
}

const SideBar = forwardRef(
  ({ onSelectItem, onSelectCreate }: SideBarProps, ref) => {
    const [apis, setApis] = useState<ApiListItem[]>([])
    const { apiKey } = useContext(KeyContext)
    const deleteApi = async (id: string) => {
      try {
        const response = await fetch(`/api/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Faker-Server-Key': apiKey,
          },
        })
        if (!response.ok) {
          throw new Error(t('error.delete-api'))
        }
        setApis((prevApis) => prevApis.filter((api) => api._id !== id))
        toast.success(t('success.api-delete'))
      } catch (error) {
        console.error(error)
        toast.error(t('error.delete-api'))
      }
    }

    const [openKeyDialog, setOpenKeyDialog] = useState(false)
    const fetchApis = async () => {
      try {
        const response = await fetch('/api/list', {
          headers: {
            'Faker-Server-Key': apiKey,
          },
        })
        if (response.status === 401) {
          setOpenKeyDialog(true)
          return
        }
        if (!response.ok) {
          throw new Error(t('error.get-api-list'))
        }
        const data = await response.json()
        setApis(data)
      } catch (error) {
        console.error(error)
        toast.error(t('error.get-api-list'))
      }
    }

    useEffect(() => {
      fetchApis()
    }, [])

    useImperativeHandle(ref, () => ({
      openKeyDialog: () => setOpenKeyDialog(true),
      refresh: fetchApis,
    }))

    return (
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <SetKeyDialog
          visible={openKeyDialog}
          setVisible={setOpenKeyDialog}
          onSubmit={fetchApis}
        />
        <Toolbar />
        <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
          {t('dashboard.api-list')}
        </Typography>
        <List dense className="overflow-x-hidden">
          {apis.map((api) => (
            <ListItem
              key={api._id}
              onClick={() => onSelectItem(api._id)}
              sx={{
                py: 0.5,
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'action.hover',
                  transform: 'translateX(5px)',
                },
                '&:active': {
                  backgroundColor: 'action.selected',
                },
              }}
              className="cursor-pointer"
            >
              <ListItemText
                primary={api.name}
                secondary={`${api.method} ${api.path}`}
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
              <Chip
                label={api.method}
                color={getMethodColor(api.method)}
                size="small"
                sx={{ fontSize: '0.7rem', height: 20, mr: 1 }}
              />
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteApi(api._id)
                }}
                sx={{ p: 0.5 }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ p: 2, mt: 'auto' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            size="small"
            onClick={onSelectCreate}
          >
            {t('dashboard.create-api')}
          </Button>
        </Box>
      </Drawer>
    )
  },
)

function getMethodColor(method: string) {
  switch (method) {
    case 'GET':
      return 'primary'
    case 'POST':
      return 'success'
    case 'DELETE':
      return 'error'
    default:
      return 'default'
  }
}

export default SideBar
