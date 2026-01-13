import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { useUploadStore } from '@/stores'
import { cn } from '@/lib/utils'

function getStatusMessage(upload: { fileName: string; status: string; progress: number; error?: string }): string {
  switch (upload.status) {
    case 'uploading':
      return `Uploading ${upload.fileName}, ${Math.round(upload.progress)}% complete`
    case 'success':
      return `${upload.fileName} uploaded successfully`
    case 'error':
      return `${upload.fileName} upload failed: ${upload.error ?? 'Unknown error'}`
    default:
      return ''
  }
}

export function UploadProgress() {
  const { uploads, removeUpload } = useUploadStore()

  if (uploads.length === 0) return null

  return (
    <div className="space-y-3" role="region" aria-label="Upload progress">
      {uploads.map((upload) => (
        <Card key={upload.id} className="p-4" role="article" aria-label={`Upload: ${upload.fileName}`}>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                'p-2 rounded-lg shrink-0',
                upload.status === 'uploading' && 'bg-primary/10 text-primary',
                upload.status === 'success' && 'bg-green-500/10 text-green-500',
                upload.status === 'error' && 'bg-destructive/10 text-destructive',
              )}
              aria-hidden="true"
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
                  aria-label={`Remove ${upload.fileName} from upload list`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {upload.status === 'uploading' && (
                <div
                  className="mt-2 space-y-1"
                  role="progressbar"
                  aria-valuenow={Math.round(upload.progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${upload.fileName} upload progress`}
                >
                  <Progress value={upload.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{Math.round(upload.progress)}% uploaded</p>
                </div>
              )}

              {upload.status === 'success' && <p className="text-sm text-green-600 mt-1">Upload complete</p>}

              {upload.status === 'error' && (
                <p className="text-sm text-destructive mt-1" role="alert">
                  {upload.error ?? 'Upload failed'}
                </p>
              )}

              <span className="sr-only" role="status" aria-live="polite">
                {getStatusMessage(upload)}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
