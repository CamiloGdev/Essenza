import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type { DiagnosticReport, FilterCriteria, FilterResult } from '../../domain'
import type { FilterWorkerMessage, FilterWorkerResponse } from '../workers'
import { useDebounce } from './useDebounce'

const DEBOUNCE_DELAY = 300

interface UseFilteredReportsOptions {
  reports: DiagnosticReport[] | undefined
  initialCriteria?: FilterCriteria
}

interface UseFilteredReportsReturn {
  filteredReports: DiagnosticReport[]
  filterCriteria: FilterCriteria
  setSearchText: (text: string) => void
  isFiltering: boolean
  totalCount: number
  filteredCount: number
}

export function useFilteredReports({
  reports,
  initialCriteria = { searchText: '' },
}: UseFilteredReportsOptions): UseFilteredReportsReturn {
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria>(initialCriteria)
  const [filterResult, setFilterResult] = useState<FilterResult | null>(null)

  const workerRef = useRef<Worker | null>(null)
  const debouncedSearchText = useDebounce(filterCriteria.searchText, DEBOUNCE_DELAY)

  const isFiltering = filterCriteria.searchText !== debouncedSearchText

  useEffect(() => {
    workerRef.current = new Worker(new URL('../workers/filterReports.worker.ts', import.meta.url), { type: 'module' })

    workerRef.current.onmessage = (event: MessageEvent<FilterWorkerResponse>) => {
      if (event.data.type === 'FILTER_RESULT') {
        setFilterResult(event.data.payload)
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    if (!reports || !workerRef.current) return

    const message: FilterWorkerMessage = {
      type: 'FILTER',
      payload: {
        reports,
        criteria: { searchText: debouncedSearchText },
      },
    }

    workerRef.current.postMessage(message)
  }, [reports, debouncedSearchText])

  const setSearchText = useCallback((text: string) => {
    setFilterCriteria((prev) => ({ ...prev, searchText: text }))
  }, [])

  const result = useMemo(() => {
    if (filterResult) {
      return {
        filteredReports: filterResult.reports,
        totalCount: filterResult.totalCount,
        filteredCount: filterResult.filteredCount,
      }
    }

    return {
      filteredReports: reports ?? [],
      totalCount: reports?.length ?? 0,
      filteredCount: reports?.length ?? 0,
    }
  }, [filterResult, reports])

  return {
    ...result,
    filterCriteria,
    setSearchText,
    isFiltering,
  }
}
