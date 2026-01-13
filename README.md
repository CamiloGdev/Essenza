# Essenza - Diagnostic Reports Manager

[🇪🇸 Español](README.es.md)

A diagnostic reports management system with drag & drop file upload, real-time filtering using Web Workers, and clean architecture based on Domain-Driven Design.

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss)

## 📋 Description

Essenza is a frontend application for managing diagnostic reports. Users can upload files (PDF, CSV, XML, TXT), view them in an interactive table, and filter them in real-time. The project implements a modular architecture following Clean Architecture and Domain-Driven Design principles.

## 🏗️ Architecture

The project follows a **hexagonal architecture** organized by domain modules:

```text
src/
├── modules/
│   └── diagnostic-reports/
│       ├── domain/           # Entities, Value Objects, contracts
│       ├── application/      # Use cases
│       └── infrastructure/   # Concrete implementations, hooks, workers
├── components/               # Reusable UI components
├── stores/                   # Global state (Zustand)
├── mocks/                    # Mock Service Worker + IndexedDB
└── lib/                      # Shared utilities
```

### Architecture Layers

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **Domain** | Pure business rules, entities, value objects | `DiagnosticReport`, `FilterCriteria` |
| **Application** | Use cases, orchestration | `createDiagnosticReport`, `getAllDiagnosticReports` |
| **Infrastructure** | Technical implementations, adapters | `ApiDiagnosticReportRepository`, Web Workers |
| **UI** | React components, presentation | `ReportsTable`, `FileUpload` |

## 🎯 Design Patterns Implemented

### Repository Pattern

Data access abstraction through interfaces in the domain and concrete implementations in infrastructure.

```typescript
// Domain - Contract
interface DiagnosticReportRepository {
  save(report: DiagnosticReport): Promise<void>
  getAll(): Promise<DiagnosticReport[]>
}

// Infrastructure - Implementation
class ApiDiagnosticReportRepository implements DiagnosticReportRepository { ... }
```

### Strategy Pattern

Extensible file type handling with interchangeable strategies:

- **FileTypeValidationStrategy** (Domain): Validation of allowed extensions and maximum sizes
- **FileTypePresentationStrategy** (UI): Icons and colors based on file type

### Dependency Injection

Repository injection in use cases to facilitate testing and decoupling.

### Value Objects

Encapsulation of validation rules in immutable value objects:

- `DiagnosticReportId` - UUID validation
- `DiagnosticReportFileName` - Length and valid characters
- `DiagnosticReportFileExtension` - Allowed extensions
- `DiagnosticReportFileSize` - Maximum size (30MB)

## ⚡ Technical Features

### Web Workers for Filtering

Report filtering runs in a **Web Worker** separate from the main thread, preventing UI blocking even with large data volumes.

```text
[Input] → [Debounce 300ms] → [Worker.postMessage] → [Filter] → [UI Update]
```

### Lazy Loading & Code Splitting

Heavy components are loaded lazily with `React.lazy` and `Suspense`:

```typescript
const FileUpload = lazy(() => import('./FileUpload'))
const ReportsTable = lazy(() => import('./ReportsTable'))
```

### Error Boundaries

Robust error handling with `ErrorBoundary` components that capture errors in the component tree.

### Drag & Drop File Upload

Implemented with **react-dropzone** featuring type and size validation, visual feedback for drag states, and error notifications.

### Mock API with Persistence

- **MSW (Mock Service Worker)**: Intercepts HTTP requests simulating a REST API
- **IndexedDB**: Browser data persistence using `idb-keyval` pattern

### Global State

**Zustand** for upload state management with a minimalist, boilerplate-free store.

### Server State

**TanStack Query** for caching, synchronization, and server state management.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | React 19 | UI Library |
| **Language** | TypeScript 5.9 | Type Safety |
| **Build Tool** | Vite 7 | Dev Server & Bundling |
| **Styling** | TailwindCSS 4 | Utility-first CSS |
| **Components** | shadcn/ui + Radix | Accessible components |
| **Icons** | Lucide React | Iconography |
| **State (Global)** | Zustand | Upload state |
| **State (Server)** | TanStack Query | Caching & fetching |
| **HTTP Client** | Axios | HTTP requests |
| **File Upload** | react-dropzone | Drag & Drop |
| **Notifications** | Sonner | Toast notifications |
| **Mock API** | MSW | Service Worker mocking |
| **Linting** | ESLint + Prettier | Code quality |

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+
- pnpm 8+

### Clone the repository

```bash
git clone https://github.com/your-username/essenza.git
cd essenza
```

### Install dependencies

```bash
pnpm install
```

### Development Mode

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Production Build

```bash
pnpm build
```

### Build Preview

```bash
pnpm preview
```

### Linting & Formatting

```bash
pnpm lint          # Run ESLint
pnpm format        # Format code with Prettier
pnpm format:check  # Check formatting
```

## 📁 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Compile TypeScript and generate production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |

## 💡 Technical Discussion: Scalability for Files >1GB

If reports exceeded 1GB in size, the following strategies would be implemented:

### 1. **Chunked Upload**

Split the file into 5-10MB chunks and upload them sequentially or in parallel:

```typescript
async function uploadInChunks(file: File, chunkSize = 5 * 1024 * 1024) {
  const totalChunks = Math.ceil(file.size / chunkSize)
  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize)
    await uploadChunk(chunk, i, totalChunks)
  }
}
```

### 2. **Streaming with Web Streams API**

Process the file as a stream without loading it entirely into memory:

```typescript
const stream = file.stream()
const reader = stream.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  await processChunk(value)
}
```

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.
