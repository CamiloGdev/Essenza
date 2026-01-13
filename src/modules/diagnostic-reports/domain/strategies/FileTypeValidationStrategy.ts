import type { AllowedFileExtension } from '../DiagnosticReportFileExtension'

export interface FileTypeValidationStrategy {
  readonly extension: AllowedFileExtension
  readonly mimeTypes: readonly string[]
  readonly maxSizeBytes: number
  validateMimeType(mimeType: string): boolean
  validateSize(sizeInBytes: number): boolean
  validate(file: File): ValidationResult
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

abstract class BaseFileTypeStrategy implements FileTypeValidationStrategy {
  abstract readonly extension: AllowedFileExtension
  abstract readonly mimeTypes: readonly string[]
  abstract readonly maxSizeBytes: number

  validateMimeType(mimeType: string): boolean {
    return this.mimeTypes.includes(mimeType)
  }

  validateSize(sizeInBytes: number): boolean {
    return sizeInBytes > 0 && sizeInBytes <= this.maxSizeBytes
  }

  validate(file: File): ValidationResult {
    const errors: string[] = []

    if (!this.validateMimeType(file.type)) {
      errors.push(
        `Invalid MIME type "${file.type}" for ${this.extension.toUpperCase()} files. Expected: ${this.mimeTypes.join(', ')}`,
      )
    }

    if (!this.validateSize(file.size)) {
      const maxMB = (this.maxSizeBytes / (1024 * 1024)).toFixed(0)
      const fileMB = (file.size / (1024 * 1024)).toFixed(2)
      errors.push(`File size ${fileMB}MB exceeds maximum ${maxMB}MB for ${this.extension.toUpperCase()} files`)
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

export class PdfValidationStrategy extends BaseFileTypeStrategy {
  readonly extension = 'pdf' as const
  readonly mimeTypes = ['application/pdf'] as const
  readonly maxSizeBytes = 30 * 1024 * 1024
}

export class CsvValidationStrategy extends BaseFileTypeStrategy {
  readonly extension = 'csv' as const
  readonly mimeTypes = ['text/csv', 'application/vnd.ms-excel'] as const
  readonly maxSizeBytes = 30 * 1024 * 1024
}

export class XmlValidationStrategy extends BaseFileTypeStrategy {
  readonly extension = 'xml' as const
  readonly mimeTypes = ['application/xml', 'text/xml'] as const
  readonly maxSizeBytes = 30 * 1024 * 1024
}

export class TxtValidationStrategy extends BaseFileTypeStrategy {
  readonly extension = 'txt' as const
  readonly mimeTypes = ['text/plain'] as const
  readonly maxSizeBytes = 30 * 1024 * 1024
}

const strategies: Record<AllowedFileExtension, FileTypeValidationStrategy> = {
  pdf: new PdfValidationStrategy(),
  csv: new CsvValidationStrategy(),
  xml: new XmlValidationStrategy(),
  txt: new TxtValidationStrategy(),
}

export function getFileTypeValidationStrategy(extension: string): FileTypeValidationStrategy | null {
  return strategies[extension as AllowedFileExtension] ?? null
}

export function validateFileWithStrategy(file: File, extension: string): ValidationResult {
  const strategy = getFileTypeValidationStrategy(extension)

  if (!strategy) {
    return {
      isValid: false,
      errors: [`No validation strategy found for extension "${extension}"`],
    }
  }

  return strategy.validate(file)
}
