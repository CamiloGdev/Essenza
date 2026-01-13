import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Filter, ArrowDownToLine, Loader2, Search, X } from 'lucide-react'
import { EmptyState } from './EmptyState'
import { getFileTypePresentationStrategy } from './strategies'
import { useDiagnosticReportsQuery, useFilteredReports } from '@/modules/diagnostic-reports/infrastructure'
import { formatFileSize, isFilterActive } from '@/modules/diagnostic-reports/domain'

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

  const { filteredReports, filterCriteria, setSearchText, isFiltering, totalCount, filteredCount } = useFilteredReports(
    { reports },
  )

  const hasActiveFilter = isFilterActive(filterCriteria)

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
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-9 pr-9"
            value={filterCriteria.searchText}
            onChange={(e) => setSearchText(e.target.value)}
            aria-label="Search diagnostic reports"
          />
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchText('')}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {isFiltering && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
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

      {filteredReports.length === 0 ? (
        hasActiveFilter ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No reports match your search criteria.</p>
            <Button variant="link" onClick={() => setSearchText('')} className="mt-2">
              Clear search
            </Button>
          </div>
        ) : (
          <EmptyState />
        )
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
              {filteredReports.map((report) => {
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
              {hasActiveFilter
                ? `Showing ${filteredCount} of ${totalCount} results`
                : `Showing 1-${totalCount} of ${totalCount} results`}
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
