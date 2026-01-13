import { Suspense, lazy } from 'react'
import { UploadProgress } from './UploadProgress'
import { FileUploadSkeleton, ReportsTableSkeleton } from './skeletons'
import { ErrorBoundary } from './ErrorBoundary'

const FileUpload = lazy(() => import('./FileUpload').then((module) => ({ default: module.FileUpload })))

const ReportsTable = lazy(() => import('./ReportsTable').then((module) => ({ default: module.ReportsTable })))

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
          <ErrorBoundary>
            <Suspense fallback={<FileUploadSkeleton />}>
              <FileUpload />
            </Suspense>
          </ErrorBoundary>

          <UploadProgress />

          <ErrorBoundary>
            <Suspense fallback={<ReportsTableSkeleton />}>
              <ReportsTable />
            </Suspense>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  )
}
