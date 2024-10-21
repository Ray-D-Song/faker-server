import { Box } from '@mui/material'
import { useState, useRef, useContext } from 'react'
import { toast, Toaster } from 'react-hot-toast'
import ApiEditor, { ApiData } from './components/api-editor'
import { useTranslation } from 'react-i18next'
import SideBar from './components/side-bar'
import KeyContext from './ctx/key'
import Header from './components/header'

export default function Dashboard() {
  const { t } = useTranslation()
  const [selectedApiId, setSelectedApiId] = useState<string | null>(null)
  const [type, setType] = useState<'create' | 'update'>('create')
  const { apiKey } = useContext(KeyContext)

  const sideBarRef = useRef<{ openKeyDialog: () => void; refresh: () => void }>(
    null,
  )

  const handleApiSelect = (id: string) => {
    setSelectedApiId(id)
    setType('update')
  }

  const handleSave = async (api: ApiData) => {
    try {
      const url = api._id ? '/api/update' : '/api/create'
      const method = 'POST'
      const body = JSON.stringify(api)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Faker-Server-Key': apiKey,
        },
        body,
      })

      if (!response.ok) {
        switch (response.status) {
          case 400:
            throw new Error(t('error.api-path-and-method-unique'))
          default:
            throw new Error(t('error.save-api'))
        }
      }

      if (api._id) {
        toast.success(t('success.api-update'))
      } else {
        toast.success(t('success.api-create'))
      }

      setSelectedApiId(null)
      setType('create')
      sideBarRef.current?.refresh()
    } catch (error) {
      console.error(error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error(t('error.save-api'))
      }
      throw error
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toaster position="top-center" />
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        <SideBar
          onSelectItem={handleApiSelect}
          onSelectCreate={() => {
            setSelectedApiId(null)
            setType('create')
          }}
          ref={sideBarRef}
        />
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, pt: 1, overflow: 'auto' }}
        >
          <Header openKeyDialog={() => sideBarRef.current?.openKeyDialog()} />
          <ApiEditor
            type={type}
            onSave={handleSave}
            apiId={selectedApiId}
            apiKey={apiKey}
          />
        </Box>
      </Box>
    </Box>
  )
}
