import { createRoot } from 'react-dom/client'
import '@mango-kit/components/styles'

import './locales'
import './icons'
import App from './app'
import './styles/globals.scss'

createRoot(document.getElementById('root')!)?.render(<App />)
