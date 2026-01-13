import type { DiagnosticReport } from './DiagnosticReport'

export interface FilterCriteria {
  searchText: string
}

export interface FilterResult {
  reports: DiagnosticReport[]
  totalCount: number
  filteredCount: number
}

export function createEmptyFilterCriteria(): FilterCriteria {
  return {
    searchText: '',
  }
}

export function isFilterActive(criteria: FilterCriteria): boolean {
  return criteria.searchText.trim().length > 0
}
