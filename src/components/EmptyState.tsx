import { FileSearch } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-full bg-muted mb-4">
        <FileSearch className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No reports found</h3>
      <p className="text-muted-foreground mt-1 max-w-sm">
        Your dashboard is clear. Upload a CSV, PDF, XML or TXT file above to generate your first diagnostic report.
      </p>
    </div>
  )
}
