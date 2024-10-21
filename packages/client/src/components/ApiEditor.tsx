import { useState, useEffect, useRef } from 'react'
import {
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material'
import JsonEditor, { JsonEditorRef, JsonNode } from './response/JsonEditor'
import { toast } from 'react-hot-toast'
import i18n from '../utils/i18n'
import { useTranslation } from 'react-i18next'
import ReactShikiEditor from 'react-shiki-editor'
import HelpButton from './help-button'

interface ApiEditorProps {
  type: 'update' | 'create'
  apiId: string | null
  onSave: (apiData: ApiData) => Promise<void>
  apiKey: string
}

export interface ApiData {
  _id?: string
  name: string
  path: string
  method: string
  description: string
  reqParams: unknown
  reqHeaders: unknown
  resHeaders: unknown
  resResponseType: string
  resBody: unknown
  resBodyText: string
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE']

function ApiEditor({ type, apiId, onSave, apiKey }: ApiEditorProps) {
  const [loading, setLoading] = useState(false)
  const [apiData, setApiData] = useState<ApiData>({
    name: '',
    path: '',
    method: 'GET',
    description: '',
    reqParams: '',
    reqHeaders: '',
    resHeaders: '',
    resResponseType: 'json',
    resBody: [],
    resBodyText: '',
  })
  const resBodyRef = useRef<JsonEditorRef>(null)

  const { t } = useTranslation()
  useEffect(() => {
    if (type === 'update' && apiId) {
      fetchApiDetail(apiId)
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
        resBody: [],
        resBodyText: '',
      })
    }
  }, [type, apiId])

  const fetchApiDetail = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/detail/${id}`, {
        headers: {
          'Faker-Server-Key': apiKey,
        },
      })
      if (!response.ok) {
        throw new Error(i18n.t('error.network'))
      }
      const data = await response.json()
      setApiData(data)
    } catch (error) {
      console.error(error)
      toast.error(i18n.t('error.get-api-detail'))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >,
  ) => {
    const { name, value } = event.target
    setApiData((prevData) => ({ ...prevData, [name as string]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    apiData.resBody = resBodyRef.current?.getData() || []
    onSave(apiData).then(() => {
      resBodyRef.current?.clearData()
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    )
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ '& > :not(style)': { m: 1 } }}
    >
      <Typography variant="h6">{t(`api-editor.${type}`)}</Typography>
      <TextField
        size="small"
        fullWidth
        label={t('api-editor.api-name')}
        name="name"
        value={apiData.name}
        onChange={handleInputChange}
        required
      />
      <TextField
        size="small"
        fullWidth
        label={t('api-editor.api-path')}
        name="path"
        value={apiData.path}
        onChange={handleInputChange}
        required
      />
      <FormControl fullWidth>
        <InputLabel id="method-select-label">
          {t('api-editor.request-method')}
        </InputLabel>
        <Select
          size="small"
          labelId="method-select-label"
          id="method-select"
          name="method"
          value={apiData.method}
          label={t('api-editor.request-method')}
          onChange={(event: SelectChangeEvent<string>) =>
            handleInputChange(
              event as React.ChangeEvent<
                HTMLInputElement | { name?: string; value: unknown }
              >,
            )
          }
          required
        >
          {HTTP_METHODS.map((method) => (
            <MenuItem key={method} value={method}>
              {method}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        size="small"
        className="w-1/2"
        label={t('api-editor.api-description')}
        name="description"
        value={apiData.description}
        onChange={handleInputChange}
        multiline
        rows={4}
      />
      <Typography variant="h6" className='mb-1'>{t('api-editor.response-data')}</Typography>
      <div className='flex items-center gap-2'>
      <Select
        size="small"
        labelId="editor-type-label"
        id="editor-type-select"
        value={apiData.resResponseType}
        label={t('api-editor.editor-type')}
        onChange={e => setApiData({
          ...apiData,
          resResponseType: e.target.value
        })}
      >
          <MenuItem value="json">{t('api-editor.structured-editor')}</MenuItem>
          <MenuItem value="json-text">{t('api-editor.text-editor')}</MenuItem>
        </Select>
        <HelpButton helpKey='api-editor.help' />
      </div>
      {
        apiData.resResponseType === 'json'
         ? <JsonEditor initData={apiData.resBody as JsonNode[]} ref={resBodyRef} />
         : <ReactShikiEditor
          language='json'
          theme='dark'
          value={apiData.resBodyText}
          onChange={value => setApiData({
            ...apiData,
            resBodyText: value
          })}
         />
      }
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="contained" type="submit">
          {t(`api-editor.${type === 'update' ? 'update' : 'create'}`)}
        </Button>
      </Box>
    </Box>
  )
}

export default ApiEditor
