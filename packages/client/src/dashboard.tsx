import { Box, Drawer, List, ListItem, ListItemText, Toolbar, Chip, Typography, Button, IconButton, AppBar } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ApiEditor, { ApiData } from './components/ApiEditor';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import TranslateIcon from '@mui/icons-material/Translate';
import GitHubIcon from '@mui/icons-material/GitHub';

interface ApiListItem {
  _id: string;
  name: string;
  method: string;
  path: string;
}

const drawerWidth = 240;

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'primary';
    case 'POST':
      return 'success';
    case 'DELETE':
      return 'error';
    default:
      return 'default';
  }
};

export default function Dashboard() {
  const { t, i18n } = useTranslation()
  const [apis, setApis] = useState<ApiListItem[]>([]);
  const [selectedApiId, setSelectedApiId] = useState<string | null>(null);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [openKeyDialog, setOpenKeyDialog] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('mockServerKey') || '');

  const [refetch, setRefetch] = useState(false)
  useEffect(() => {
    const savedKey = localStorage.getItem('mockServerKey');
    if (savedKey) {
      setApiKey(savedKey);
    }
    fetchApis();
  }, [refetch]);

  const fetchApis = async () => {
    try {
      const response = await fetch('/api/list', {
        headers: {
          'Faker-Server-Key': apiKey
        }
      });
      if (response.status === 401) {
        setOpenKeyDialog(true);
        return;
      }
      if (!response.ok) {
        throw new Error(t('error.get-api-list'));
      }
      const data = await response.json();
      setApis(data);
    } catch (error) {
      console.error(error);
      toast.error(t('error.get-api-list'));
    }
  };

  const handleKeySubmit = () => {
    localStorage.setItem('mockServerKey', apiKey);
    setOpenKeyDialog(false);
    fetchApis();
  };

  const handleApiSelect = (id: string) => {
    setSelectedApiId(id);
    setType('update');
  };

  const handleSave = async (api: ApiData) => {
    try {
      const url = api._id ? '/api/update' : '/api/create';
      const method = 'POST';
      const body = JSON.stringify(api);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Faker-Server-Key': apiKey
        },
        body,
      });

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error(t('error.api-path-and-method-unique'));
          default:
            throw new Error(t('error.save-api'));
        }
      }

      setRefetch(prev => !prev)
      if (api._id) {
        toast.success(t('success.api-update'));
      } else {
        toast.success(t('success.api-create'));
      }

      setSelectedApiId(null);
      setType('create');
      fetchApis()
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t('error.save-api'));
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/delete/${id}`, { method: 'DELETE', headers: {
        'Faker-Server-Key': apiKey
      } });
      if (!response.ok) {
        throw new Error(t('error.delete-api'));
      }
      setApis(prevApis => prevApis.filter(api => api._id !== id));
      toast.success(t('success.api-delete'));
    } catch (error) {
      console.error(error);
      toast.error(t('error.delete-api'));
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
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
          <Toolbar />
          <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
            {t('dashboard.api-list')}
          </Typography>
          <List dense className='overflow-x-hidden'>
            {apis.map((api) => (
              <ListItem 
                key={api._id} 
                onClick={() => handleApiSelect(api._id)}
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
                className='cursor-pointer'
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
                    e.stopPropagation();
                    handleDelete(api._id);
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
              onClick={() => {
                setSelectedApiId(null);
                setType('create');
              }}
            >
              {t('dashboard.create-api')}
            </Button>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 1, overflow: 'auto' }}>
          <div className='w-full h-8 mb-4 z-10 flex items-center justify-end'>
            <IconButton onClick={toggleLanguage} color="inherit">
              <TranslateIcon />
            </IconButton>
            <IconButton href="https://github.com/ray-d-song/faker-server" target="_blank" rel="noopener noreferrer" color="inherit">
              <GitHubIcon />
            </IconButton>
          </div>
          <ApiEditor 
            type={type} 
            onSave={handleSave} 
            apiId={selectedApiId}
            apiKey={apiKey}
          />
        </Box>
      </Box>
      <Dialog open={openKeyDialog} onClose={() => setOpenKeyDialog(false)}>
        <DialogTitle>{t('dashboard.input-admin-key')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('dashboard.admin-key')}
            type="password"
            fullWidth
            variant="outlined"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenKeyDialog(false)}>{t('global.cancel')}</Button>
          <Button onClick={handleKeySubmit}>{t('global.confirm')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}