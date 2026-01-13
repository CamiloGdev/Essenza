import { DiagnosticReportIdNotValidError, isDiagnosticReportIdValid } from './DiagnosticReportId'
import {
  DiagnosticReportFileNameNotValidError,
  isDiagnosticReportFileNameValid,
  sanitizeDiagnosticReportFileName,
} from './DiagnosticReportFileName'
import {
  DiagnosticReportFileExtensionNotValidError,
  extractFileExtension,
  isDiagnosticReportFileExtensionValid,
  type AllowedFileExtension,
} from './DiagnosticReportFileExtension'
import { DiagnosticReportFileSizeNotValidError, isDiagnosticReportFileSizeValid } from './DiagnosticReportFileSize'
import {
  DiagnosticReportTypeNotValidError,
  isDiagnosticReportTypeValid,
  type DiagnosticReportTypeValue,
} from './DiagnosticReportType'
import { DiagnosticReportDateNotValidError, isDiagnosticReportDateValid } from './DiagnosticReportDate'

export interface DiagnosticReport {
  id: string
  name: string
  size: number
  extension: AllowedFileExtension
  type: DiagnosticReportTypeValue
  date: string
}

export interface DiagnosticReportPrimitives {
  id: string
  name: string
  size: number
  extension: string
  type: string
  date: string
}

export function ensureDiagnosticReportIsValid(report: DiagnosticReportPrimitives): void {
  if (!isDiagnosticReportIdValid(report.id)) {
    throw DiagnosticReportIdNotValidError(report.id)
  }

  if (!isDiagnosticReportFileNameValid(report.name)) {
    throw DiagnosticReportFileNameNotValidError(report.name)
  }

  if (!isDiagnosticReportFileExtensionValid(report.extension)) {
    throw DiagnosticReportFileExtensionNotValidError(report.extension)
  }

  if (!isDiagnosticReportFileSizeValid(report.size)) {
    throw DiagnosticReportFileSizeNotValidError(report.size)
  }

  if (!isDiagnosticReportTypeValid(report.type)) {
    throw DiagnosticReportTypeNotValidError(report.type)
  }

  if (!isDiagnosticReportDateValid(report.date)) {
    throw DiagnosticReportDateNotValidError(report.date)
  }
}

export function createDiagnosticReport(primitives: DiagnosticReportPrimitives): DiagnosticReport {
  ensureDiagnosticReportIsValid(primitives)

  return {
    id: primitives.id,
    name: sanitizeDiagnosticReportFileName(primitives.name),
    size: primitives.size,
    extension: primitives.extension as AllowedFileExtension,
    type: primitives.type as DiagnosticReportTypeValue,
    date: primitives.date,
  }
}

export function createDiagnosticReportFromFile(id: string, file: File, type: string, date: string): DiagnosticReport {
  const extension = extractFileExtension(file.name)
  const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '')

  return createDiagnosticReport({
    id,
    name: nameWithoutExtension,
    size: file.size,
    extension,
    type,
    date,
  })
}
