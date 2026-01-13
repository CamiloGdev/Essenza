import axios from 'axios'
import type { DiagnosticReport, DiagnosticReportRepository } from '../domain'

const API_BASE_URL = '/api/diagnostic-reports'

export function createApiDiagnosticReportRepository(): DiagnosticReportRepository {
  return {
    save: async (report: DiagnosticReport): Promise<void> => {
      await axios.post(API_BASE_URL, report)
    },

    getAll: async (): Promise<DiagnosticReport[]> => {
      const response = await axios.get<DiagnosticReport[]>(API_BASE_URL)
      return response.data
    },
  }
}

export const apiDiagnosticReportRepository = createApiDiagnosticReportRepository()
