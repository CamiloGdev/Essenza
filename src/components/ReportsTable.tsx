import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Filter, ArrowDownToLine, Loader2 } from 'lucide-react'
import { EmptyState } from './EmptyState'
import { getFileTypePresentationStrategy } from './strategies'
import { useDiagnosticReportsQuery } from '@/modules/diagnostic-reports/infrastructure'
import { formatFileSize } from '@/modules/diagnostic-reports/domain'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function ReportsTable() {
  const { data: reports, isLoading, error } = useDiagnosticReportsQuery()

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading reports...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-destructive">
          <p>Failed to load reports</p>
          <p className="text-sm mt-1">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search files..." className="max-w-sm" disabled />
        <div className="flex gap-2 ml-auto">
          <Button variant="outline" disabled>
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" disabled>
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {!reports || reports.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Filename</TableHead>
                <TableHead>Diagnostics Type</TableHead>
                <TableHead>Date Uploaded</TableHead>
                <TableHead className="text-right">Size</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => {
                const presentationStrategy = getFileTypePresentationStrategy(report.extension)
                const IconComponent = presentationStrategy.icon

                return (
                  <TableRow key={report.id}>
                    <TableCell>
                      <IconComponent className={`h-5 w-5 ${presentationStrategy.colorClass}`} />
                    </TableCell>
                    <TableCell className="font-medium">
                      {report.name}.{report.extension}
                    </TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{formatDate(report.date)}</TableCell>
                    <TableCell className="text-right">{formatFileSize(report.size)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>

          <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing 1-{reports.length} of {reports.length} results
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  )
}
