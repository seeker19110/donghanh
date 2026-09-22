// Profile.test.tsx — cổng canh P0-4 AC-5: mục "Không gian" liệt kê đủ STUDIOS.length mục.
//
// VÌ SAO CẦN (P0-4, 2026-09-17): bộ chuyển Studio ("⌘K") bị ẩn khỏi header dưới 1024px
// (xem `components/Layout.tsx`) — nội dung của nó dời hẳn vào trang Hồ sơ để người dùng
// mobile không mất đường sang 5 Studio nền tảng. Mock mọi con nặng ký (auth/toast/cloud
// sync/rewards) để cô lập đúng phần đang canh, theo cùng khuôn `Home.test.tsx`.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'
import { STUDIOS } from '../../lib/studios'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

vi.mock('../../components/Layout.js', () => ({ default: () => null }))
vi.mock('../../components/ReferralSection.js', () => ({ default: () => null }))
vi.mock('../../components/CompanionLinkSection.js', () => ({ default: () => null }))
vi.mock('../../components/QuestsPanel.js', () => ({ default: () => null }))
vi.mock('../../components/EmailVerifySection.js', () => ({ default: () => null }))
vi.mock('../../components/TwoFactorSection.js', () => ({ default: () => null }))
vi.mock('../../components/UpgradeSection.js', () => ({ default: () => null }))
vi.mock('../../components/PricePromoBanner.js', () => ({ default: () => null }))
vi.mock('../../components/FeedbackModal.js', () => ({ default: () => null }))
vi.mock('../../components/ThemeToggle.js', () => ({ default: () => null }))
vi.mock('../../lib/useCloudSync', () => ({ useCloudSync: () => 0 }))
vi.mock('../../lib/usePageTitle', () => ({ usePageTitle: () => undefined }))
vi.mock('../../lib/useIsDesktopViewport', () => ({ useIsDesktopViewport: () => false }))
vi.mock('@core/ToastProvider', () => ({
  useToast: () => ({ success: () => {}, error: () => {} }),
}))
vi.mock('../../lib/achievementRewards', () => ({
  fetchAchievementRewards: async () => [],
  claimAchievementReward: async () => null,
}))
vi.mock('../../lib/achievements', () => ({
  checkNewAchievements: () => [],
  achievementMessage: () => '',
  getEarnedAchievements: () => new Set<string>(),
}))
vi.mock('../../lib/storage', () => ({ getStreak: () => 0 }))
vi.mock('../../lib/vocab', () => ({ getLearnedCount: () => 0 }))
vi.mock('../../context/useLang', () => ({
  useLang: () => ({ T: { logout: 'Đăng xuất' }, lang: 'vi' as const }),
}))

function mockAuth(user: { id: string; name: string; email: string } | null) {
  vi.doMock('../../context/useAuth', () => ({
    useAuth: () => ({ user, refresh: async () => {} }),
  }))
}

describe('Profile — mục "Không gian" liệt kê đủ STUDIOS (P0-4 AC-5)', () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.resetModules()
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.doUnmock('../../context/useAuth')
  })

  async function hien() {
    const { default: ProfileAfterMock } = await import('./Profile')
    root = createRoot(container)
    act(() => {
      root.render(
        <MemoryRouter initialEntries={['/trang-ca-nhan']}>
          <ProfileAfterMock />
        </MemoryRouter>,
      )
    })
  }

  it('render đúng STUDIOS.length mục dưới tiêu đề "Không gian"', async () => {
    mockAuth({ id: 'u1', name: 'An', email: 'an@vd.vn' })
    await hien()

    const heading = Array.from(container.querySelectorAll('h2')).find(
      (h) => h.textContent === 'Không gian',
    )
    expect(heading, 'không thấy tiêu đề "Không gian"').toBeTruthy()

    const section = heading?.closest('section')
    expect(section, 'tiêu đề "Không gian" không nằm trong <section>').toBeTruthy()

    const titles = STUDIOS.map((st) => st.title)
    for (const title of titles) {
      expect(section?.textContent, `thiếu mục Studio "${title}"`).toContain(title)
    }
    // [2026-09-22] Khối "Không Gian Chuyên Biệt (Hubs)" đã gộp vào đây (audit UI/UX P1-3):
    // ngoài STUDIOS còn đúng 2 đích chưa có trong STUDIOS là Bạn bè · Tin nhắn. Không được
    // có mục trùng đích.
    const buttons = section?.querySelectorAll('button') ?? []
    expect(buttons.length).toBe(STUDIOS.length + 2)
    expect(section?.textContent).toContain('Bạn bè')
    expect(section?.textContent).toContain('Tin nhắn')
    const hs = Array.from(container.querySelectorAll('h2')).map((h) => h.textContent)
    expect(hs).not.toContain('Không Gian Chuyên Biệt (Hubs)')
  })
})
