import { Card } from '@/components/ui/card'

export function ReportsTableSkeleton() {
  return (
    <Card className="animate-pulse">
      <div className="p-4 border-b flex flex-col sm:flex-row gap-4">
        <div className="h-10 w-64 bg-muted rounded" />
        <div className="flex gap-2 ml-auto">
          <div className="h-10 w-20 bg-muted rounded" />
          <div className="h-10 w-20 bg-muted rounded" />
        </div>
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-5 w-5 bg-muted rounded" />
            <div className="h-4 w-48 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-24 bg-muted rounded" />
            <div className="h-4 w-16 bg-muted rounded ml-auto" />
          </div>
        ))}
      </div>
    </Card>
  )
}
