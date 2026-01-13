export const ALLOWED_FILE_EXTENSIONS = ['pdf', 'csv', 'xml', 'txt'] as const

export type AllowedFileExtension = (typeof ALLOWED_FILE_EXTENSIONS)[number]

export function isDiagnosticReportFileExtensionValid(extension: string): boolean {
  const normalizedExtension = extension.toLowerCase().replace(/^\./, '')

  return ALLOWED_FILE_EXTENSIONS.includes(normalizedExtension as AllowedFileExtension)
}

export function DiagnosticReportFileExtensionNotValidError(extension: string): Error {
  return new Error(
    `File extension "${extension}" is not allowed. Allowed extensions: ${ALLOWED_FILE_EXTENSIONS.join(', ')}`,
  )
}

export function extractFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.')
  if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
    return ''
  }

  return fileName.slice(lastDotIndex + 1).toLowerCase()
}
