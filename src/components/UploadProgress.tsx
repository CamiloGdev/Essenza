import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useUploadStore } from '@/stores'
import { cn } from '@/lib/utils'

export function UploadProgress() {
  const { uploads, removeUpload } = useUploadStore()

  if (uploads.length === 0) return null

  return (
    <div className="space-y-3">
      {uploads.map((upload) => (
        <Card key={upload.id} className="p-4">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'p-2 rounded-lg shrink-0',
                upload.status === 'uploading' && 'bg-primary/10 text-primary',
                upload.status === 'success' && 'bg-green-500/10 text-green-500',
                upload.status === 'error' && 'bg-destructive/10 text-destructive',
              )}
            >
              {upload.status === 'uploading' && <Loader2 className="h-5 w-5 animate-spin" />}
              {upload.status === 'success' && <CheckCircle className="h-5 w-5" />}
              {upload.status === 'error' && <AlertCircle className="h-5 w-5" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium truncate">{upload.fileName}</p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0"
                  onClick={() => removeUpload(upload.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {upload.status === 'uploading' && (
                <div className="mt-2 space-y-1">
                  <Progress value={upload.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{Math.round(upload.progress)}% uploaded</p>
                </div>
              )}

              {upload.status === 'success' && <p className="text-sm text-green-600 mt-1">Upload complete</p>}

              {upload.status === 'error' && (
                <p className="text-sm text-destructive mt-1">{upload.error ?? 'Upload failed'}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
