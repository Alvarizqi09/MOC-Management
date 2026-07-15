import { Search, X } from 'lucide-react'
import { useFilterStore } from '@/store/useFilterStore'

export function SearchBar() {
  const searchKeyword = useFilterStore((s) => s.searchKeyword)
  const setSearchKeyword = useFilterStore((s) => s.setSearchKeyword)

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        placeholder="Cari ticket ID, judul, atau deskripsi..."
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-10 text-sm text-slate-900 outline-none transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        aria-label="Cari task"
      />
      {searchKeyword ? (
        <button
          type="button"
          onClick={() => setSearchKeyword('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-600"
          aria-label="Hapus pencarian"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  )
}
