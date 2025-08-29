import Router from "./router"
import { ThemeProvider } from "./contexts/ThemeContext"
import { LanguageProvider } from "./contexts/LanguageContext"
import { ToastProvider } from "./contexts/ToastContext"

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <Router />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App