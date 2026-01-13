export const DIAGNOSTIC_REPORT_TYPES = [
  'Vibration',
  'Thermal',
  'OilAnalysis',
  'Ultrasound',
  'MotorCurrent',
  'Alignment',
  'Balancing',
  'Wear',
  'Corrosion',
  'Fatigue',
] as const

export type DiagnosticReportTypeValue = (typeof DIAGNOSTIC_REPORT_TYPES)[number]

export function isDiagnosticReportTypeValid(type: string): boolean {
  return DIAGNOSTIC_REPORT_TYPES.includes(type as DiagnosticReportTypeValue)
}

export function DiagnosticReportTypeNotValidError(type: string): Error {
  return new Error(`Report type "${type}" is not valid. Valid types: ${DIAGNOSTIC_REPORT_TYPES.join(', ')}`)
}
