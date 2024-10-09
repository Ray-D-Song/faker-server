import { Box, Drawer, List, ListItem, ListItemText, Toolbar, Chip, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import ApiEditor, { ApiData } from './components/ApiEditor';
import { Toaster } from 'react-hot-toast';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

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
          'Mock-Server-Key': apiKey
        }
      });
      if (response.status === 401) {
        setOpenKeyDialog(true);
        return;
      }
      if (!response.ok) {
        throw new Error('获取 API 列表失败');
      }
      const data = await response.json();
      setApis(data);
    } catch (error) {
      console.error('获取 API 列表时出错:', error);
      toast.error('获取 API 列表失败');
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
          'Mock-Server-Key': apiKey
        },
        body,
      });

      if (!response.ok) {
        throw new Error('保存失败');
      }

      setRefetch(prev => !prev)
      if (api._id) {
        toast.success('API 更新成功');
      } else {
        toast.success('API 创建成功');
      }

      setSelectedApiId(null);
      setType('create');
      fetchApis(); // 重新获取列表以确保数据同步
    } catch (error) {
      console.error('保存 API 时出错:', error);
      toast.error('保存 API 失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/delete/${id}`, { method: 'DELETE', headers: {
        'Mock-Server-Key': apiKey
      } });
      if (!response.ok) {
        throw new Error('删除 API 失败');
      }
      setApis(prevApis => prevApis.filter(api => api._id !== id));
      toast.success('API 删除成功');
    } catch (error) {
      console.error('删除 API 时出错:', error);
      toast.error('删除 API 失败');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Toaster position='top-center'/>
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
          接口列表
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
          >
            新增接口
          </Button>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <ApiEditor 
          type={type} 
          onSave={handleSave} 
          apiId={selectedApiId}
          apiKey={apiKey}
        />
      </Box>
      <Dialog open={openKeyDialog} onClose={() => setOpenKeyDialog(false)}>
        <DialogTitle>输入 API 密钥</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="API 密钥"
            type="password"
            fullWidth
            variant="outlined"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenKeyDialog(false)}>取消</Button>
          <Button onClick={handleKeySubmit}>确认</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}