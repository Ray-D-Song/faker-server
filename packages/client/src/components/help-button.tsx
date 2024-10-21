import HelpIcon from '@mui/icons-material/Help'
import { Dialog } from '@mui/material'
import Button from '@mui/material/Button'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface HelpButtonProps {
  // i18n key
  helpKey: string
}

function HelpButton({ helpKey }: HelpButtonProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="small"
        variant="text"
        color="primary"
        onClick={() => {
          setOpen(true)
        }}
      >
        <HelpIcon />
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <pre className="p-2">{t(helpKey)}</pre>
      </Dialog>
    </>
  )
}

export default HelpButton
