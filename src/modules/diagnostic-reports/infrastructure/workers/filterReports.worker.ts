import type { DiagnosticReport } from '../../domain/DiagnosticReport'
import type { FilterCriteria, FilterResult } from '../../domain/FilterCriteria'

export interface FilterWorkerMessage {
  type: 'FILTER'
  payload: {
    reports: DiagnosticReport[]
    criteria: FilterCriteria
  }
}

export interface FilterWorkerResponse {
  type: 'FILTER_RESULT'
  payload: FilterResult
}

function filterReports(reports: DiagnosticReport[], criteria: FilterCriteria): FilterResult {
  const searchText = criteria.searchText.toLowerCase().trim()

  if (!searchText) {
    return {
      reports,
      totalCount: reports.length,
      filteredCount: reports.length,
    }
  }

  const filtered = reports.filter((report) => {
    const searchableFields = [report.name, report.extension, report.type, report.date]

    return searchableFields.some((field) => field.toLowerCase().includes(searchText))
  })

  return {
    reports: filtered,
    totalCount: reports.length,
    filteredCount: filtered.length,
  }
}

self.onmessage = (event: MessageEvent<FilterWorkerMessage>) => {
  const { type, payload } = event.data

  if (type === 'FILTER') {
    const result = filterReports(payload.reports, payload.criteria)

    const response: FilterWorkerResponse = {
      type: 'FILTER_RESULT',
      payload: result,
    }

    self.postMessage(response)
  }
}
