import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { Dashboard } from '@/components'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/query-client'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="absolute top-4 right-4 z-50">
          <ModeToggle />
        </div>
        <Dashboard />
        <Toaster richColors position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
