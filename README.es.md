# Essenza - Gestor de Informes Diagnósticos

[🇺🇸 English](README.md)

Sistema de gestión de informes diagnósticos con soporte para carga de archivos mediante drag & drop, filtrado en tiempo real con Web Workers, y arquitectura limpia basada en Domain-Driven Design.

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss)

## 📋 Descripción

Essenza es una aplicación frontend que permite gestionar informes diagnósticos. Los usuarios pueden subir archivos (PDF, CSV, XML, TXT), visualizarlos en una tabla interactiva y filtrarlos en tiempo real. El proyecto implementa una arquitectura modular siguiendo principios de Clean Architecture y Domain-Driven Design.

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura hexagonal** organizada por módulos de dominio:

```text
src/
├── modules/
│   └── diagnostic-reports/
│       ├── domain/           # Entidades, Value Objects, contratos
│       ├── application/      # Casos de uso
│       └── infrastructure/   # Implementaciones concretas, hooks, workers
├── components/               # Componentes de UI reutilizables
├── stores/                   # Estado global (Zustand)
├── mocks/                    # Mock Service Worker + IndexedDB
└── lib/                      # Utilidades compartidas
```

### Capas de la Arquitectura

| Capa | Responsabilidad | Ejemplo |
|------|-----------------|---------|
| **Domain** | Reglas de negocio puras, entidades, value objects | `DiagnosticReport`, `FilterCriteria` |
| **Application** | Casos de uso, orquestación | `createDiagnosticReport`, `getAllDiagnosticReports` |
| **Infrastructure** | Implementaciones técnicas, adaptadores | `ApiDiagnosticReportRepository`, Web Workers |
| **UI** | Componentes React, presentación | `ReportsTable`, `FileUpload` |

## 🎯 Patrones de Diseño Implementados

### Repository Pattern

Abstracción del acceso a datos mediante interfaces en el dominio e implementaciones concretas en infraestructura.

```typescript
// Domain - Contrato
interface DiagnosticReportRepository {
  save(report: DiagnosticReport): Promise<void>
  getAll(): Promise<DiagnosticReport[]>
}

// Infrastructure - Implementación
class ApiDiagnosticReportRepository implements DiagnosticReportRepository { ... }
```

### Strategy Pattern

Manejo extensible de tipos de archivo con estrategias intercambiables:

- **FileTypeValidationStrategy** (Domain): Validación de extensiones permitidas y tamaños máximos
- **FileTypePresentationStrategy** (UI): Iconos y colores según tipo de archivo

### Dependency Injection

Inyección de repositorios en casos de uso para facilitar testing y desacoplamiento.

### Value Objects

Encapsulación de reglas de validación en objetos de valor inmutables:

- `DiagnosticReportId` - Validación UUID
- `DiagnosticReportFileName` - Longitud y caracteres válidos
- `DiagnosticReportFileExtension` - Extensiones permitidas
- `DiagnosticReportFileSize` - Tamaño máximo (30MB)

## ⚡ Características Técnicas

### Web Workers para Filtrado

El filtrado de reportes se ejecuta en un **Web Worker** separado del hilo principal, evitando bloqueos de UI incluso con grandes volúmenes de datos.

```text
[Input] → [Debounce 300ms] → [Worker.postMessage] → [Filter] → [UI Update]
```

### Lazy Loading & Code Splitting

Componentes pesados se cargan de forma diferida con `React.lazy` y `Suspense`:

```typescript
const FileUpload = lazy(() => import('./FileUpload'))
const ReportsTable = lazy(() => import('./ReportsTable'))
```

### Error Boundaries

Manejo robusto de errores con componentes `ErrorBoundary` que capturan errores en el árbol de componentes.

### Drag & Drop File Upload

Implementado con **react-dropzone** con validación de tipos y tamaños, feedback visual para estados de arrastre, y notificaciones de error.

### Mock API con Persistencia

- **MSW (Mock Service Worker)**: Intercepta requests HTTP simulando una API REST
- **IndexedDB**: Persistencia de datos en el navegador mediante `idb-keyval` pattern

### Estado Global

**Zustand** para gestión de estado de uploads con store minimalista y sin boilerplate.

### Server State

**TanStack Query** para caché, sincronización y gestión del estado del servidor.

## 🛠️ Stack Tecnológico

| Categoría | Tecnología | Propósito |
|-----------|------------|-----------|
| **Framework** | React 19 | UI Library |
| **Lenguaje** | TypeScript 5.9 | Type Safety |
| **Build Tool** | Vite 7 | Dev Server & Bundling |
| **Styling** | TailwindCSS 4 | Utility-first CSS |
| **Components** | shadcn/ui + Radix | Componentes accesibles |
| **Icons** | Lucide React | Iconografía |
| **State (Global)** | Zustand | Estado de uploads |
| **State (Server)** | TanStack Query | Caché y fetching |
| **HTTP Client** | Axios | Requests HTTP |
| **File Upload** | react-dropzone | Drag & Drop |
| **Notifications** | Sonner | Toast notifications |
| **Mock API** | MSW | Service Worker mocking |
| **Linting** | ESLint + Prettier | Code quality |

## 🚀 Instalación y Ejecución

### Prerrequisitos

- Node.js 18+
- pnpm 8+

### Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/essenza.git
cd essenza
```

### Instalar dependencias

```bash
pnpm install
```

### Modo Desarrollo

```bash
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build de Producción

```bash
pnpm build
```

### Preview del Build

```bash
pnpm preview
```

### Linting y Formateo

```bash
pnpm lint          # Ejecutar ESLint
pnpm format        # Formatear código con Prettier
pnpm format:check  # Verificar formato
```

## 📁 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Inicia servidor de desarrollo |
| `pnpm build` | Compila TypeScript y genera build de producción |
| `pnpm preview` | Preview del build de producción |
| `pnpm lint` | Ejecuta ESLint |
| `pnpm format` | Formatea código con Prettier |

## 💡 Discusión Técnica: Escalabilidad para Archivos >1GB

Si los informes superaran el tamaño de 1GB, se implementarían las siguientes estrategias:

### 1. **Chunked Upload (Carga por Fragmentos)**

Dividir el archivo en chunks de 5-10MB y subirlos secuencialmente o en paralelo:

```typescript
async function uploadInChunks(file: File, chunkSize = 5 * 1024 * 1024) {
  const totalChunks = Math.ceil(file.size / chunkSize)
  for (let i = 0; i < totalChunks; i++) {
    const chunk = file.slice(i * chunkSize, (i + 1) * chunkSize)
    await uploadChunk(chunk, i, totalChunks)
  }
}
```

### 2. **Streaming con Web Streams API**

Procesar el archivo como stream sin cargarlo completamente en memoria:

```typescript
const stream = file.stream()
const reader = stream.getReader()
while (true) {
  const { done, value } = await reader.read()
  if (done) break
  await processChunk(value)
}
```

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles.
