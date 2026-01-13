import type { DiagnosticReport } from './DiagnosticReport'

export interface DiagnosticReportRepository {
  save: (report: DiagnosticReport) => Promise<void>
  getAll: () => Promise<DiagnosticReport[]>
}
