export const FILE_NAME_MIN_LENGTH = 1
export const FILE_NAME_MAX_LENGTH = 255

const VALID_FILE_NAME_REGEX = /^[a-zA-Z0-9_\-. ]+$/

export function isDiagnosticReportFileNameValid(fileName: string): boolean {
  if (fileName.length < FILE_NAME_MIN_LENGTH || fileName.length > FILE_NAME_MAX_LENGTH) {
    return false
  }

  return VALID_FILE_NAME_REGEX.test(fileName)
}

export function DiagnosticReportFileNameNotValidError(fileName: string): Error {
  return new Error(
    `File name "${fileName}" is not valid. Must be between ${FILE_NAME_MIN_LENGTH} and ${FILE_NAME_MAX_LENGTH} characters and contain only alphanumeric characters, spaces, underscores, hyphens, and dots.`,
  )
}

export function sanitizeDiagnosticReportFileName(fileName: string): string {
  return fileName.replace(/\s+/g, '_')
}
