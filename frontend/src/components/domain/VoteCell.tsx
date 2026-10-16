'use client'

import type { VoteChoice, VoteResult } from '@/lib/types'
import styles from './domain.module.css'

const RESULT_CHIP: Record<VoteResult, string> = {
  列入考慮: 'chip chip-considered',
  不考慮: 'chip chip-rejected',
  投票中: 'chip chip-pending',
}

const CHOICES: VoteChoice[] = ['是', '否']

interface VoteCellProps {
  result: VoteResult
  myVote: VoteChoice | null
  onVote: (choice: VoteChoice) => void
  disabled?: boolean
}

/** 匿名投票：顯示結果與「我的投票」，不顯示他人投票或票數；可隨時改票 */
export function VoteCell({ result, myVote, onVote, disabled }: VoteCellProps) {
  return (
    <div className={styles.vote}>
      <span className={RESULT_CHIP[result]} data-testid="vote-result">
        {result}
      </span>
      <div className={styles.segmented} role="group" aria-label="我的投票：是否列入考慮">
        {CHOICES.map((choice) => (
          <button
            key={choice}
            type="button"
            className={`${styles.segment} ${myVote === choice ? styles.selected : ''}`}
            aria-pressed={myVote === choice}
            onClick={() => onVote(choice)}
            disabled={disabled || myVote === choice}
            data-testid={`vote-${choice === '是' ? 'yes' : 'no'}`}
          >
            {myVote === choice && <span aria-hidden>✓ </span>}
            {choice}
          </button>
        ))}
      </div>
      {myVote === null && (
        <span className={styles.hint} data-testid="my-vote-none">
          你尚未投票
        </span>
      )}
    </div>
  )
}
