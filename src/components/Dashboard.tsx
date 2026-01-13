import { FileUpload } from './FileUpload'
import { UploadProgress } from './UploadProgress'
import { ReportsTable } from './ReportsTable'

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Essenza Manager</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Manage your diagnostic files and view system reports.</p>
        </div>

        <div className="space-y-6">
          <FileUpload />
          <UploadProgress />
          <ReportsTable />
        </div>
      </main>
    </div>
  )
}
