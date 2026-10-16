import { redirect } from 'next/navigation'

export default function Home() {
  // 流程起點：房屋列表（未登入時由 (protected)/layout 導向 /login）
  redirect('/houses')
}
