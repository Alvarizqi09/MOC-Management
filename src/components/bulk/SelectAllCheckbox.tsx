interface SelectAllCheckboxProps {
  checked: boolean
  indeterminate?: boolean
  onChange: () => void
  label?: string
}

export function SelectAllCheckbox({
  checked,
  indeterminate = false,
  onChange,
  label = 'Pilih semua',
}: SelectAllCheckboxProps) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <input
        type="checkbox"
        checked={checked}
        ref={(el) => {
          if (el) el.indeterminate = indeterminate
        }}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-orange-600 focus:ring-orange-500"
      />
      <span>{label}</span>
    </label>
  )
}
