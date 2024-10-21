import { IconButton } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import TranslateIcon from '@mui/icons-material/Translate'
import GitHubIcon from '@mui/icons-material/GitHub'
import i18n from '../utils/i18n'

interface HeaderProps {
  openKeyDialog: () => void
}

function Header({ openKeyDialog }: HeaderProps) {
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'zh' : 'en'
    i18n.changeLanguage(newLang)
  }
  return (
    <div className="w-full h-8 mb-4 z-10 flex items-center justify-end">
      <IconButton color="inherit" onClick={openKeyDialog}>
        <SettingsIcon />
      </IconButton>
      <IconButton onClick={toggleLanguage} color="inherit">
        <TranslateIcon />
      </IconButton>
      <IconButton
        href="https://github.com/ray-d-song/faker-server"
        target="_blank"
        rel="noopener noreferrer"
        color="inherit"
      >
        <GitHubIcon />
      </IconButton>
    </div>
  )
}

export default Header
