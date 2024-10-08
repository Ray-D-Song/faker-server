import { Box, Drawer, List, ListItem, ListItemText, Toolbar, Chip, Typography, Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import ApiEditor from './components/ApiEditor';

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
  const [apis, setApis] = useState([
    { id: 1, text: '主页', method: 'GET' },
    { id: 2, text: '设置', method: 'POST' },
    { id: 3, text: '个人资料', method: 'DELETE' },
  ]);

  const handleDelete = (id: number) => {
    if (window.confirm('确定要删除这个接口吗?')) {
      setApis(apis.filter(api => api.id !== id));
    }
  };

  const handleSave = (api: any) => {
    setApis([...apis, api]);
  };

  const handleCancel = () => {
    // 取消编辑
  };

  return (
    <Box sx={{ display: 'flex' }}>
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
          {apis.map((item) => (
            <ListItem 
              key={item.id} 
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
                primary={item.text} 
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
              <Chip 
                label={item.method} 
                color={getMethodColor(item.method)}
                size="small"
                sx={{ fontSize: '0.7rem', height: 20, mr: 1 }}
              />
              <IconButton 
                size="small" 
                onClick={() => handleDelete(item.id)}
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
        <ApiEditor onSave={handleSave} onCancel={handleCancel} />
      </Box>
    </Box>
  );
}