import { useState, useEffect } from 'react';
import { Typography, TextField, Button, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, Tabs, Tab, SelectChangeEvent, Card } from '@mui/material';
import { Fade } from '@mui/material'; // 添加 Fade 组件
import QueryGrid from './request/QueryGrid';
import HeadersGrid from './request/HeadersGrid';
import JsonEditor from './response/JsonEditor';
import { toast } from 'react-hot-toast';

interface ApiEditorProps {
  type: 'update' | 'create';
  apiId: string | null;
  onSave: (apiData: ApiData) => void;
  apiKey: string;
}

export interface ApiData {
  _id?: string;
  name: string;
  path: string;
  method: string;
  description: string;
  reqParams: unknown;
  reqHeaders: unknown;
  resHeaders: unknown;
  resResponseType: string;
  resBody: unknown;
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

function ApiEditor({ type, apiId, onSave, apiKey }: ApiEditorProps) {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<ApiData>({
    name: '',
    path: '',
    method: 'GET',
    description: '',
    reqParams: '',
    reqHeaders: '',
    resHeaders: '',
    resResponseType: 'json',
    resBody: undefined,
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (type === 'update' && apiId) {
      fetchApiDetail(apiId);
    } else {
      setApiData({
        name: '',
        path: '',
        method: 'GET',
        description: '',
        reqParams: '',
        reqHeaders: '',
        resHeaders: '',
        resResponseType: 'json',
        resBody: {},
      });
    }
  }, [type, apiId]);

  const fetchApiDetail = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/detail/${id}`, {
        headers: {
          'Faker-Server-Key': apiKey
        }
      });
      if (!response.ok) {
        throw new Error('获取 API 详情失败');
      }
      const data = await response.json();
      setApiData(data);
    } catch (error) {
      console.error('获取 API 详情时出错:', error);
      toast.error('获取 API 详情失败');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setApiData(prevData => ({ ...prevData, [name as string]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(apiData);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleQueryUpdate = (query: unknown) => {
    setApiData(prevData => ({ ...prevData, reqParams: query }));
  };

  const handleHeadersUpdate = (headers: unknown) => {
    setApiData(prevData => ({ ...prevData, reqHeaders: headers }));
  };

  const handleResBodyUpdate = (body: unknown) => {
    setApiData(prevData => ({ ...prevData, resBody: body }));
  };


  if (loading) {
    return <div className='flex justify-center items-center h-screen'><CircularProgress /></div>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ '& > :not(style)': { m: 1 } }}>
      <Typography variant="h6">{type === 'update' ? '修改接口' : '新增接口'}</Typography>
      <TextField
        size='small'
        fullWidth
        label="接口名"
        name="name"
        value={apiData.name}
        onChange={handleInputChange}
        required
      />
      <TextField
        size='small'
        fullWidth
        label="接口地址"
        name="path"
        value={apiData.path}
        onChange={handleInputChange}
        required
      />
      <FormControl fullWidth>
        <InputLabel id="method-select-label">请求方法</InputLabel>
        <Select
          size='small'
          labelId="method-select-label"
          id="method-select"
          name="method"
          value={apiData.method}
          label="请求方法"
          onChange={(event: SelectChangeEvent<string>) => handleInputChange(event as React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>)}
          required
        >
          {HTTP_METHODS.map((method) => (
            <MenuItem key={method} value={method}>{method}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        size='small'
        className='w-1/2'
        label="接口描述"
        name="description"
        value={apiData.description}
        onChange={handleInputChange}
        multiline
        rows={4}
      />
      <Typography variant="h6">请求参数</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="请求参数标签页">
          <Tab label="Query" />
          <Tab label="Headers" />
        </Tabs>
      </Box>
      <Box sx={{ mt: 2, position: 'relative', height: '200px' }}>
        <Fade in={activeTab === 0} timeout={300}>
          <Card sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <QueryGrid onUpdate={handleQueryUpdate} />
          </Card>
        </Fade>
        <Fade in={activeTab === 1} timeout={300}>
          <Card sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <HeadersGrid onUpdate={handleHeadersUpdate} />
          </Card>
        </Fade>
      </Box>
      <Typography variant="h6">响应数据</Typography>
      <JsonEditor onChange={handleResBodyUpdate} initData={apiData.resBody} type={type} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" type="submit">保存</Button>
      </Box>
    </Box>
  );
}

export default ApiEditor;