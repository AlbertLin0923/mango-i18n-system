import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { createRoot } from 'react-dom/client'
import '@mango-kit/components/styles'

import './locales'
import './icons'
import App from './app'
import './styles/globals.scss'

const root = createRoot(document.getElementById('root')!)

root.render(<App />)
