export function isDiagnosticReportDateValid(date: string): boolean {
  const parsedDate = new Date(date)

  return !isNaN(parsedDate.getTime())
}

export function DiagnosticReportDateNotValidError(date: string): Error {
  return new Error(`Date "${date}" is not a valid date format`)
}

export function createDiagnosticReportDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function formatDiagnosticReportDate(date: string): string {
  const parsedDate = new Date(date)

  return parsedDate.toISOString().split('T')[0]
}
