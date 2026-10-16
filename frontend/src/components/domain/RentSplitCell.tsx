import type { RentSplit } from '@/lib/types'
import styles from './domain.module.css'

/** 分租租金試算：依權重分攤，超出個人最高預算者標註（等於不算超出） */
export function RentSplitCell({ splits }: { splits: RentSplit[] }) {
  return (
    <ul className={styles.splits} data-testid="rent-splits">
      {splits.map((split) => (
        <li
          key={split.memberName}
          className={`${styles.split} ${split.overBudget ? styles.over : ''}`}
          data-testid={`rent-split-${split.memberName}`}
        >
          <span className={styles.splitName}>{split.memberName}</span>
          <span className={styles.splitAmount}>{split.amount.toLocaleString()}</span>
          {split.overBudget && (
            <span className={styles.overTag} data-testid="over-budget">
              超出預算
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
