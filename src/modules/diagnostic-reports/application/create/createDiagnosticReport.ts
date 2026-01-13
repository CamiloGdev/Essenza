import type { DiagnosticReportRepository, DiagnosticReport } from '../../domain'
import { createDiagnosticReportFromFile, generateDiagnosticReportId, createDiagnosticReportDate } from '../../domain'
import { getRandomDiagnosticReportType } from './getRandomReportType'

export async function createDiagnosticReport(
  repository: DiagnosticReportRepository,
  file: File,
): Promise<DiagnosticReport> {
  const id = generateDiagnosticReportId()
  const date = createDiagnosticReportDate()
  const type = getRandomDiagnosticReportType()

  const report = createDiagnosticReportFromFile(id, file, type, date)

  await repository.save(report)

  return report
}
