'use client'

interface StatusSelectProps<T extends string> {
  label: string
  value: T
  options: readonly T[]
  onChange: (value: T) => void
  disabled?: boolean
  testId: string
}

/** 房東 / 看房狀態下拉：可任意切換至清單中任一狀態（含往回改） */
export function StatusSelect<T extends string>({
  label,
  value,
  options,
  onChange,
  disabled,
  testId,
}: StatusSelectProps<T>) {
  return (
    <select
      className="select select-compact"
      aria-label={label}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as T)}
      data-testid={testId}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}
