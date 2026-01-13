import { DIAGNOSTIC_REPORT_TYPES, type DiagnosticReportTypeValue } from '../../domain'

export function getRandomDiagnosticReportType(): DiagnosticReportTypeValue {
  const randomIndex = Math.floor(Math.random() * DIAGNOSTIC_REPORT_TYPES.length)
  return DIAGNOSTIC_REPORT_TYPES[randomIndex]
}
