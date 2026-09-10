import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Homepage from './homepage.tsx'

// Clear purchased sheets on page load/refresh so user always starts in unpurchased ("Buy") state
try {
  localStorage.removeItem('purchased_sheets');
  localStorage.removeItem('purchased_sheets_dates');
  sessionStorage.removeItem('purchased_sheets');
} catch {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Homepage />
  </StrictMode>,
)
