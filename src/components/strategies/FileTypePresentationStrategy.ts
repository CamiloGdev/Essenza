import { FileText, FileSpreadsheet, FileCode, File, type LucideIcon } from 'lucide-react'
import type { AllowedFileExtension } from '@/modules/diagnostic-reports/domain'

export interface FileTypePresentationStrategy {
  readonly extension: AllowedFileExtension
  readonly icon: LucideIcon
  readonly colorClass: string
  readonly label: string
}

class PdfPresentationStrategy implements FileTypePresentationStrategy {
  readonly extension = 'pdf' as const
  readonly icon = FileText
  readonly colorClass = 'text-red-500'
  readonly label = 'PDF Document'
}

class CsvPresentationStrategy implements FileTypePresentationStrategy {
  readonly extension = 'csv' as const
  readonly icon = FileSpreadsheet
  readonly colorClass = 'text-green-500'
  readonly label = 'CSV Spreadsheet'
}

class XmlPresentationStrategy implements FileTypePresentationStrategy {
  readonly extension = 'xml' as const
  readonly icon = FileCode
  readonly colorClass = 'text-orange-500'
  readonly label = 'XML Document'
}

class TxtPresentationStrategy implements FileTypePresentationStrategy {
  readonly extension = 'txt' as const
  readonly icon = File
  readonly colorClass = 'text-blue-500'
  readonly label = 'Text File'
}

class DefaultPresentationStrategy implements FileTypePresentationStrategy {
  readonly extension = 'txt' as const
  readonly icon = File
  readonly colorClass = 'text-muted-foreground'
  readonly label = 'Unknown File'
}

const strategies: Record<AllowedFileExtension, FileTypePresentationStrategy> = {
  pdf: new PdfPresentationStrategy(),
  csv: new CsvPresentationStrategy(),
  xml: new XmlPresentationStrategy(),
  txt: new TxtPresentationStrategy(),
}

const defaultStrategy = new DefaultPresentationStrategy()

export function getFileTypePresentationStrategy(extension: string): FileTypePresentationStrategy {
  return strategies[extension as AllowedFileExtension] ?? defaultStrategy
}
