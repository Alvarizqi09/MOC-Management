# TaskFlow Manager

Aplikasi manajemen task berbasis Kanban (gaya Trello/Jira) untuk **Master Online Community Management (MOC)** — technical test Frontend Developer.

Berjalan **100% offline** dengan simulasi API server: latensi jaringan, autentikasi token, dan error acak pada mutasi.

## Menjalankan Aplikasi

```bash
npm install
npm run dev
```

Buka [http://localhost:5173](http://localhost:5173)

### Kredensial Login (Demo)

| Field    | Value      |
| -------- | ---------- |
| Username | `admin`    |
| Password | `admin123` |

### Scripts

| Command         | Deskripsi              |
| --------------- | ---------------------- |
| `npm run dev`   | Development server     |
| `npm run build` | Production build       |
| `npm run preview` | Preview build        |
| `npm run lint`  | ESLint                 |

---

## Tech Stack

- **React 19** + **TypeScript** (Vite)
- **Tailwind CSS v4** — styling
- **Zustand** (+ `persist`) — auth session, filter, UI preferences
- **TanStack React Query** — server state, caching, optimistic updates
- **Axios** — HTTP client dengan custom mock adapter
- **react-hook-form** + **Zod** — form validation (single source of truth)
- **@dnd-kit** — drag-and-drop Kanban
- **date-fns** — due date & timeline
- **sonner** — toast notifications

---

## Struktur Folder & Arsitektur

Pemisahan tegas tiga lapisan:

```
src/
├── components/     # UI Layer — render & interaksi, tidak tahu localStorage
│   ├── board/      # KanbanBoard, KanbanColumn, TaskCard
│   ├── task/       # TaskFormModal, TaskDetail
│   ├── search/     # SearchBar, FilterTabs
│   ├── bulk/       # BulkActionBar, SelectAllCheckbox
│   ├── timeline/   # TimelineView
│   ├── layout/     # Header, ProtectedRoute
│   └── ui/         # Button, Input, Modal, Skeleton
├── hooks/          # Custom hooks (React Query, optimistic update, bulk select)
├── store/          # Zustand — auth, filter, selection state
├── lib/
│   ├── axios-instance.ts   # Axios + auth interceptor
│   ├── mock-api/           # Mock API Layer (delay, error sim, routing)
│   └── validators/         # Zod schemas
├── storage/        # db.ts — abstraksi localStorage (hanya dipanggil Mock API)
└── types/          # TypeScript interfaces
```

### UI Layer (`components/`)

Komponen murni presentational + interaksi. Tidak pernah memanggil `localStorage` atau mengetahui detail penyimpanan data.

### State Layer (`store/` + `hooks/`)

- **Zustand**: sesi auth (persist), filter pencarian/status, seleksi bulk
- **React Query**: data task, loading/error state, cache invalidation, optimistic updates dengan rollback

### Mock API Layer (`lib/mock-api/`)

Satu-satunya lapisan yang berinteraksi dengan `storage/db.ts`:

- Delay 800–1000ms per request
- ~10% error rate pada mutasi (create/update/delete)
- Validasi token mock via axios interceptor
- Kredensial hardcoded di `auth.mock.ts`

---

## Fitur

- **Login mock** dengan session persist (refresh halaman tetap login)
- **Kanban board** 3 kolom (To Do / In Progress / Done) dengan drag-and-drop
- **Optimistic updates** — kartu langsung pindah kolom, rollback otomatis jika API gagal
- **CRUD task** — create, edit, delete, mark as done
- **Global search** — cari by ticket ID (`TASKFLOW-1042` atau `1042`), judul, deskripsi
- **Filter** — Semua / Selesai / Belum Selesai (client-side, debounced search)
- **Bulk actions** — multi-select, tandai selesai / hapus sekaligus
- **Timeline view** — visualisasi task berdasarkan due date (mingguan)

---

## Asumsi

1. **Kredensial hardcoded** (`admin` / `admin123`) — tidak ada registrasi atau reset password.
2. **Token mock** tidak memiliki expiry sungguhan; invalidasi hanya jika token kosong atau format tidak valid (`mock-token-*`).
3. **Data task** disimpan di `localStorage` browser — clearing storage = kehilangan data.
4. **Error simulasi 10%** hanya pada mutasi, untuk demonstrasi error handling & rollback.
5. **Filter & search** diterapkan di memori (client-side) terhadap cache React Query, bukan query ulang ke API.

---

## Tantangan & Keputusan Teknis

1. **Optimistic update + drag-and-drop** — drag selesai langsung update cache React Query via `onMutate`, dengan rollback di `onError` jika mock API mensimulasikan kegagalan. `onSettled` selalu re-sync ke source of truth.

2. **Pemisahan concern** — komponen UI tidak import `storage/db.ts`; semua I/O data lewat `apiClient` → `mockAdapter` → `db.ts`, sehingga layer bisa diganti ke REST API sungguhan tanpa mengubah komponen.

3. **Filter vs Kanban** — filter status (`completed`/`incomplete`) kompatibel dengan kolom Kanban karena `done` = Selesai, `todo` + `in_progress` = Belum Selesai — satu model status, dua cara visualisasi.

4. **Bulk select scope** — "Pilih semua" hanya memilih task yang **sedang tampil** sesuai filter aktif, bukan seluruh database.

---

## Lisensi

Project ini dibuat untuk keperluan technical test MOC Group.
