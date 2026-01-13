export const MAX_FILE_SIZE_MB = 30
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

export function isDiagnosticReportFileSizeValid(sizeInBytes: number): boolean {
  return sizeInBytes > 0 && sizeInBytes <= MAX_FILE_SIZE_BYTES
}

export function DiagnosticReportFileSizeNotValidError(sizeInBytes: number): Error {
  const sizeMB = (sizeInBytes / (1024 * 1024)).toFixed(2)

  return new Error(`File size ${sizeMB}MB exceeds the maximum allowed size of ${MAX_FILE_SIZE_MB}MB`)
}

export function formatFileSize(sizeInBytes: number): string {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes}B`
  }
  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)}KB`
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)}MB`
}
