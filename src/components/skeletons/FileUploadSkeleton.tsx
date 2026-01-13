import { Card } from '@/components/ui/card'

export function FileUploadSkeleton() {
  return (
    <Card className="border-2 border-dashed p-8">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="p-4 rounded-full bg-muted h-16 w-16" />
        <div className="space-y-2 text-center">
          <div className="h-5 w-48 bg-muted rounded mx-auto" />
          <div className="h-4 w-32 bg-muted rounded mx-auto" />
        </div>
      </div>
    </Card>
  )
}
