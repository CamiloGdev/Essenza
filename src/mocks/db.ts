import type { DiagnosticReport } from '@/modules/diagnostic-reports/domain'

const DB_NAME = 'EssenzaDB'
const DB_VERSION = 1
const STORE_NAME = 'diagnostic-reports'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(new Error(request.error?.message ?? 'Failed to open database'))
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

export async function getAllReportsFromDB(): Promise<DiagnosticReport[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()

    request.onerror = () => reject(new Error(request.error?.message ?? 'Failed to get reports'))
    request.onsuccess = () => resolve(request.result as DiagnosticReport[])
  })
}

export async function saveReportToDB(report: DiagnosticReport): Promise<DiagnosticReport> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(report)

    request.onerror = () => reject(new Error(request.error?.message ?? 'Failed to save report'))
    request.onsuccess = () => resolve(report)
  })
}

export async function deleteReportFromDB(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onerror = () => reject(new Error(request.error?.message ?? 'Failed to delete report'))
    request.onsuccess = () => resolve()
  })
}
