import { http, HttpResponse, delay } from 'msw'
import { getAllReportsFromDB, saveReportToDB } from './db'
import type { DiagnosticReport } from '@/modules/diagnostic-reports/domain'

function getRandomDelay(): number {
  return Math.floor(Math.random() * (6000 - 2000 + 1)) + 2000
}

export const handlers = [
  http.get('/api/diagnostic-reports', async () => {
    await delay(500)
    const reports = await getAllReportsFromDB()
    return HttpResponse.json(reports)
  }),

  http.post('/api/diagnostic-reports', async ({ request }) => {
    const report = (await request.json()) as DiagnosticReport
    await delay(getRandomDelay())
    const saved = await saveReportToDB(report)
    return HttpResponse.json(saved, { status: 201 })
  }),
]
