'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.css'

const navItems = [
  { href: '/houses', label: '房屋列表', icon: '🏠' },
  { href: '/considered', label: '考慮列表', icon: '⭐' },
]

/** Navigation rail（M3）：對應 Activity 的 房屋列表 ↔ 考慮列表 */
export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside data-testid="sidebar" className={styles.rail}>
      <div className={styles.brand}>Rentttt</div>
      <nav data-testid="sidebar-nav" className={styles.nav} aria-label="主要導覽">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.item} ${active ? styles.active : ''}`}
              aria-current={active ? 'page' : undefined}
              data-testid={`nav-${item.href.slice(1)}`}
            >
              <span className={styles.indicator} aria-hidden>
                {item.icon}
              </span>
              <span className={styles.label}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
