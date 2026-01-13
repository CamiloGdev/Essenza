const UUID_REGEX = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi

export function isDiagnosticReportIdValid(id: string): boolean {
  return UUID_REGEX.test(id)
}

export function DiagnosticReportIdNotValidError(id: string): Error {
  return new Error(`Diagnostic Report Id "${id}" is not a valid UUID`)
}

export function generateDiagnosticReportId(): string {
  return crypto.randomUUID()
}
