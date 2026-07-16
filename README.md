# TaskFlow Manager

Aplikasi manajemen task berbasis Kanban (gaya Trello/Jira) untuk **Master Online Community (MOC)** — technical test Frontend Developer.

> **⚠️ PERHATIAN UNTUK PENILAI (TESTER):**  
> Aplikasi ini sengaja disimulasikan memiliki **10% kemungkinan *error* (gagal)** setiap kali ada action untuk membuat, mengedit, atau menghapus task (Mutasi). Hal ini dibuat secara sengaja di dalam *Mock API Layer* untuk mendemonstrasikan fitur *Error Handling*, *Toast Notification*, dan ***Rollback* otomatis** pada *Optimistic Update*. Jadi, jika sewaktu-waktu muncul notifikasi merah "Gagal menyimpan/memperbarui task", **itu bukanlah sebuah *bug***, melainkan fitur simulasi server. Silakan coba klik sekali lagi.

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

terdapat juga fitur (Sign Up) untuk membuat kredensial baru.

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
- **@base-ui/react/dialog** — headless UI untuk sistem Drawer (Sidebar Mobile)
- **Zustand** (+ `persist`) — auth session, filter, UI preferences
- **TanStack React Query** — server state, caching, optimistic updates
- **Axios** — HTTP client dengan custom mock adapter
- **react-hook-form** + **Zod** — form validation (single source of truth)
- **@dnd-kit** — drag-and-drop Kanban
- **date-fns** — due date & timeline
- **sonner** — toast notifications
- **lucide-react** — icons

---

## Struktur Folder & Arsitektur

Pemisahan tegas tiga lapisan:

```
src/
├── components/     # UI Layer — render & interaksi, tidak tahu localStorage
│   ├── board/      # KanbanBoard, KanbanColumn, TaskCard
│   ├── task/       # TaskFormModal, TaskEditModal
│   ├── search/     # SearchBar, FilterTabs
│   ├── notifications/ # NotificationBell, NotificationPanel, NotificationItem
│   ├── bulk/       # BulkActionBar, SelectAllCheckbox
│   ├── timeline/   # TimelineView
│   ├── layout/     # Sidebar, DashboardLayout, ProtectedRoute
│   └── ui/         # Button, Input, Modal, Skeleton, AlertDialog
├── pages/          # Page Layer — BoardPage, TimelinePage, TaskDetailPage, LoginPage, SignupPage
├── hooks/          # Custom hooks (React Query, optimistic update, bulk select)
├── store/          # Zustand — auth, filter, selection state
├── lib/
│   ├── axios-instance.ts   # Axios + auth interceptor
│   ├── mock-api/           # Mock API Layer (delay, error sim, routing, auth)
│   └── validators/         # Zod schemas
├── storage/        # db.ts — abstraksi localStorage (hanya dipanggil Mock API)
└── types/          # TypeScript interfaces
```

### UI Layer (`components/` & `pages/`)

Komponen murni presentational + interaksi. Tidak pernah memanggil `localStorage` atau mengetahui detail penyimpanan data.

### State Layer (`store/` + `hooks/`)

- **Zustand**: sesi auth (persist), filter pencarian/status, seleksi bulk, UI notification panel
- **React Query**: data task & notifikasi, loading/error state, cache invalidation, optimistic updates dengan rollback

### Mock API Layer (`lib/mock-api/`)

Satu-satunya lapisan yang berinteraksi dengan `storage/db.ts`:

- Delay 800–1000ms per request
- ~10% error rate pada mutasi (create/update/delete)
- Validasi token mock via axios interceptor
- Mock routing untuk login, registrasi (signup), CRUD task, dan notifikasi (generate dari due date task)

---

## Fitur

- **Autentikasi** — Login, pendaftaran akun baru (Signup), dengan session persist
- **Mobile Responsive & Drawer Sidebar** — Dukungan penuh untuk *mobile/smartphone* menggunakan sistem laci (*Sheet Drawer*) berlapis dari ShadCN UI yang kokoh.
- **Kanban board** 3 kolom (To Do / In Progress / Done) dengan drag-and-drop yang aman untuk horizontal scrolling di perangkat sentuh.
- **Detail Task** — Halaman khusus detail task dengan struktur tab (Info, Aktivitas, Komentar)
- **Optimistic updates & Async Loading** — kartu langsung pindah kolom saat drag-and-drop, sedangkan aksi destruktif (Delete) menggunakan async loading yang aman.
- **CRUD task** — create, edit, delete, mark as done
- **Global search** — cari by ticket ID (`MOCM-1042` atau `1042`), judul, deskripsi
- **Filter** — Semua / Selesai / Belum Selesai (client-side, debounced search)
- **Bulk actions** — multi-select, tandai selesai / hapus sekaligus
- **Timeline & Activity Log** — visualisasi kalender interaktif dan riwayat aktivitas (Create, Edit, Move, Delete) secara kronologis
- **Dark & Light Mode** — Pengaturan tema tampilan (tersimpan otomatis) yang disempurnakan dengan *custom variant* Tailwind CSS v4.
- **Notification System** — Notifikasi otomatis berdasarkan due date task (overdue, due today, deadline approaching). Lonceng di TopNav menampilkan unread count; klik membuka panel slide-out dengan grouping Today & Earlier. Read status dipersist di localStorage. Menggunakan React Query (optimistic mark-read) + Axios mock API.

---

## Asumsi

1. **Kredensial Default** disediakan (`admin` / `admin123`), namun pendaftaran akun baru juga bisa dilakukan via Mock API.
2. **Token mock** tidak memiliki expiry sungguhan; invalidasi hanya jika token kosong atau format tidak valid (`mock-token-*`).
3. **Data task** disimpan di `localStorage` browser — clearing storage = kehilangan data.
4. **Error simulasi 10%** hanya pada mutasi, untuk demonstrasi error handling & rollback.
5. **Filter & search** diterapkan di memori (client-side) terhadap cache React Query, bukan query ulang ke API.
6. **Notifikasi** digenerate dari data task di localStorage setiap kali endpoint `GET /notifications` dipanggil. Read status dipersist secara terpisah di localStorage key `taskflow_notifications_read`.

---

## Tantangan & Keputusan Teknis

1. **Optimistic Update vs Async Loading** 
   Drag-and-drop dan perubahan status task menggunakan *Optimistic Update* agar transisi terasa instan tanpa jeda loading. Sebaliknya, aksi destruktif seperti hapus (Single/Bulk Delete) sengaja menggunakan standar *Async* (menunggu respons API) demi UX yang lebih aman dan jelas, mencegah kebingungan pengguna apabila proses penghapusan massal gagal di tengah jalan.

2. **Pemisahan Concern (Architectural Abstraction)** 
   Tantangan terbesar sekaligus poin krusial adalah memastikan UI layer sama sekali tidak menyentuh `localStorage`. Seluruh pertukaran data dilewatkan melalui `apiClient` (Axios) -> `mockAdapter` -> `db.ts`. Keputusan ini diambil agar codebase frontend *production-ready*; jika backend REST API yang asli sudah siap, nantinya kita hanya perlu membuang `mockAdapter` tanpa mengubah satu baris pun kode di komponen UI.

3. **Integrasi Kanban dengan Filter Status** 
   Adanya mapping untuk status `done` = Selesai, dan `todo` + `in_progress` = Belum Selesai. Hal ini membuat aplikasi menggunakan satu *source of truth* status tanpa mengorbankan fungsionalitas drag-and-drop.

4. **Desain Halaman Detail Task** 
   Untuk memberikan pengalaman yang lebih baik dari sekadar *modal* popup, saya membangun halaman Detail Task khusus (mirip gaya Jobtracker/Trello) di mana pengguna dapat melihat info lengkap, mengedit, hingga menghapus task. Aksi edit dan hapus dari halaman ini tetap terhubung secara asinkron (optimistic & async) dengan arsitektur React Query di baliknya.

5. **Scope Fitur "Pilih Semua" (Bulk Action)** 
   Tombol "Pilih Semua" sengaja dibatasi hanya untuk memilih task yang **sedang tampil** sesuai filter dan pencarian aktif, bukan seluruh entri di database, demi menjaga konsistensi dengan intensi pencarian pengguna.

6. **Keputusan Desain & Estetika Visual** 
   Penggunaan palet warna utama bernuansa hangat (*orange-500* hingga *orange-600*) dipilih secara khusus untuk merepresentasikan dan selaras dengan identitas *brand* MOC (Master Online Community). Warna oranye ini diaplikasikan secara hati-hati sebagai aksen kuat pada elemen-elemen interaktif (*Call to Action*, tombol utama, garis aktif) di atas fondasi warna latar yang bersih dan netral (*slate/white*). Pendekatan ini membuat aplikasi terasa premium, tidak *generic*, dan secara visual langsung memancarkan identitas "MOC".

7. **Sistem Notifikasi Berbasis Due Date**
   Notifikasi tidak memerlukan cronjob atau backend scheduler. Setiap kali React Query me-refetch endpoint `/notifications`, mock API membaca task dari localStorage dan menghasilkan notifikasi berdasarkan due date secara real-time. Read status di-persist di localStorage terpisah agar tidak hilang saat refresh. Arsitektur ini mengikuti pola tiga lapisan yang sama: UI (`NotificationBell/Panel/Item`) → React Query (`useNotifications`, optimistic mark-read) → Mock API (`notification.mock.ts`).

8. **Sistem Sidebar Mobile (Drawer)**
   Agar aplikasi terasa *native* layaknya aplikasi betulan di *smartphone*, saya mengganti panel samping biasa dengan komponen *Drawer/Sheet* bergaya *off-canvas* yang diadaptasi dari ekosistem ShadCN UI (ditenagai oleh `@base-ui/react/dialog`). Solusi ini memecahkan masalah *overlap layout* dan z-index kompleks yang sering terjadi pada Tailwind murni, sekaligus menyediakan *accessibility* bawaan, fokus trap, dan animasi *slide-in* yang sangat mulus.

---

## Lisensi

Project ini dibuat secara khusus untuk keperluan *Technical Test* MOC Group.

---

## Author

**Alvarizqi**
- ✉️ Email: [alvarizki80@gmail.com](mailto:alvarizki80@gmail.com)
- 🌐 Website: [www.alvarizqi.com](https://www.alvarizqi.com)
