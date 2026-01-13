import { create } from 'zustand'

export interface UploadItem {
  id: string
  fileName: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  error?: string
}

interface UploadState {
  uploads: UploadItem[]
  addUpload: (upload: UploadItem) => void
  updateUpload: (id: string, updates: Partial<UploadItem>) => void
  removeUpload: (id: string) => void
  clearCompleted: () => void
}

export const useUploadStore = create<UploadState>((set) => ({
  uploads: [],

  addUpload: (upload) =>
    set((state) => ({
      uploads: [...state.uploads, upload],
    })),

  updateUpload: (id, updates) =>
    set((state) => ({
      uploads: state.uploads.map((upload) => (upload.id === id ? { ...upload, ...updates } : upload)),
    })),

  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((upload) => upload.id !== id),
    })),

  clearCompleted: () =>
    set((state) => ({
      uploads: state.uploads.filter((upload) => upload.status === 'uploading'),
    })),
}))
