import type { DiagnosticReportRepository, DiagnosticReport } from '../../domain'

export async function getAllDiagnosticReports(repository: DiagnosticReportRepository): Promise<DiagnosticReport[]> {
  return repository.getAll()
}
