import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DraggableList from './App'
import './styles.css'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element #root not found')

createRoot(rootElement).render(
  <StrictMode>
    <DraggableList items={'Lorem ipsum dolor sit'.split(' ')} />
  </StrictMode>,
)
