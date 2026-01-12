import { ThemeProvider } from '@/components/theme-provider'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <h1 className="text-4xl font-bold">Essenza</h1>
        <p className="text-muted-foreground">Vite + React + Shadcn/ui + Tailwind</p>
        <Button>Click me</Button>
      </div>
    </ThemeProvider>
  )
}

export default App
