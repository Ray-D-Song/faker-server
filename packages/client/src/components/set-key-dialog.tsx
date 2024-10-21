import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from '@mui/material'
import { t } from 'i18next'
import { useContext } from 'react'
import KeyContext from '../ctx/key'

interface SetKeyDialogProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  onSubmit: () => void
}

function SetKeyDialog({ visible, setVisible, onSubmit }: SetKeyDialogProps) {
  const { apiKey, setApiKey } = useContext(KeyContext)
  const handleKeySubmit = () => {
    localStorage.setItem('mockServerKey', apiKey)
    setVisible(false)
    onSubmit()
  }
  return (
    <Dialog open={visible} onClose={() => setVisible(false)}>
      <DialogTitle>{t('dashboard.input-key')}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t('dashboard.key')}
          type="password"
          fullWidth
          variant="outlined"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setVisible(false)}>{t('global.cancel')}</Button>
        <Button onClick={handleKeySubmit}>{t('global.confirm')}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default SetKeyDialog
