import { useState } from 'react'
import { CheckCircle2, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AlertDialog } from '@/components/ui/AlertDialog'
import {
  useOptimisticBulkDelete,
  useOptimisticBulkUpdate,
} from '@/hooks/useOptimisticTask'

interface BulkActionBarProps {
  selectedCount: number
  selectedIds: string[]
  onClear: () => void
}

export function BulkActionBar({
  selectedCount,
  selectedIds,
  onClear,
}: BulkActionBarProps) {
  const bulkUpdate = useOptimisticBulkUpdate()
  const bulkDelete = useOptimisticBulkDelete()

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  if (selectedCount === 0) return null

  const handleMarkDone = () => {
    bulkUpdate.mutate(
      { ids: selectedIds, updates: { status: 'done' } },
      { onSuccess: () => onClear() },
    )
  }

  const confirmDelete = () => {
    bulkDelete.mutate(selectedIds, { onSuccess: () => {
      setIsDeleteDialogOpen(false)
      onClear()
    }})
  }

  const isLoading = bulkUpdate.isPending || bulkDelete.isPending

  return (
    <>
      <div className="animate-slide-up fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
          <span className="text-sm font-medium text-slate-700">
            {selectedCount} task dipilih
          </span>
          <div className="h-4 w-px bg-slate-200" />
          <Button
            variant="secondary"
            size="sm"
            onClick={handleMarkDone}
            isLoading={bulkUpdate.isPending}
            disabled={isLoading}
          >
            <CheckCircle2 className="h-4 w-4" />
            Tandai Selesai
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            isLoading={bulkDelete.isPending}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Hapus
          </Button>
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Batalkan seleksi"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Task Sekaligus"
        description={`Apakah Anda yakin ingin menghapus ${selectedCount} task terpilih? Aksi ini tidak dapat dibatalkan.`}
        isLoading={bulkDelete.isPending}
      />
    </>
  )
}
