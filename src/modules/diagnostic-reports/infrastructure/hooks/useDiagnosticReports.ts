import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiDiagnosticReportRepository } from '../ApiDiagnosticReportRepository'
import { createDiagnosticReport, getAllDiagnosticReports } from '../../application'
import { useUploadStore } from '@/stores'
import { generateDiagnosticReportId } from '../../domain'
import { toast } from 'sonner'

const REPORTS_QUERY_KEY = ['diagnostic-reports']

export function useDiagnosticReportsQuery() {
  return useQuery({
    queryKey: REPORTS_QUERY_KEY,
    queryFn: () => getAllDiagnosticReports(apiDiagnosticReportRepository),
  })
}

export function useCreateReportMutation() {
  const queryClient = useQueryClient()
  const { addUpload, updateUpload, removeUpload } = useUploadStore()

  return useMutation({
    mutationFn: async (file: File) => {
      const uploadId = generateDiagnosticReportId()

      addUpload({
        id: uploadId,
        fileName: file.name,
        progress: 0,
        status: 'uploading',
      })

      const progressInterval = setInterval(() => {
        updateUpload(uploadId, {
          progress: Math.min(
            90,
            Math.random() * 30 + (useUploadStore.getState().uploads.find((u) => u.id === uploadId)?.progress ?? 0),
          ),
        })
      }, 500)

      try {
        const report = await createDiagnosticReport(apiDiagnosticReportRepository, file)

        clearInterval(progressInterval)
        updateUpload(uploadId, { progress: 100, status: 'success' })

        setTimeout(() => {
          removeUpload(uploadId)
        }, 2000)

        return report
      } catch (error) {
        clearInterval(progressInterval)
        const errorMessage = error instanceof Error ? error.message : 'Upload failed'
        updateUpload(uploadId, { status: 'error', error: errorMessage })

        setTimeout(() => {
          removeUpload(uploadId)
        }, 5000)

        throw error
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: REPORTS_QUERY_KEY })
      toast.success('Report uploaded successfully')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to upload report'
      toast.error('Upload failed', { description: message })
    },
  })
}
