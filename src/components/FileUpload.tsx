import { useCallback } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { ALLOWED_FILE_EXTENSIONS, MAX_FILE_SIZE_MB } from '@/modules/diagnostic-reports/domain'
import { useCreateReportMutation } from '@/modules/diagnostic-reports/infrastructure'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

const ACCEPTED_MIME_TYPES: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'text/csv': ['.csv'],
  'application/xml': ['.xml'],
  'text/xml': ['.xml'],
  'text/plain': ['.txt'],
}

export function FileUpload() {
  const { mutate: uploadReport } = useCreateReportMutation()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        uploadReport(file)
      })
    },
    [uploadReport],
  )

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    fileRejections.forEach(({ file, errors }) => {
      const errorMessages = errors.map((e) => e.message).join(', ')
      toast.error(`File "${file.name}" rejected`, { description: errorMessages })
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    onDropRejected,
    accept: ACCEPTED_MIME_TYPES,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    multiple: true,
  })

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
        isDragActive && !isDragReject && 'border-primary bg-primary/5',
        isDragReject && 'border-destructive bg-destructive/5',
        !isDragActive && 'hover:border-primary/50',
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            'p-4 rounded-full',
            isDragReject ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary',
          )}
        >
          <Upload className="h-8 w-8" />
        </div>
        <div>
          <p className="text-lg font-medium">
            {isDragActive ? (isDragReject ? 'File type not supported' : 'Drop files here') : 'Click to upload'}
            <span className="text-muted-foreground font-normal"> or drag and drop</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {ALLOWED_FILE_EXTENSIONS.map((ext) => ext.toUpperCase()).join(', ')} (max {MAX_FILE_SIZE_MB}MB)
          </p>
        </div>
      </div>
    </Card>
  )
}
