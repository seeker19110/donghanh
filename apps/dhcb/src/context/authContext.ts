import { createContext } from 'react'
import type { User } from '../types'

export interface AuthContextValue {
  user: User | null
  loading: boolean
  refresh: () => Promise<void> // gọi sau khi login/logout để cập nhật lại
  /** Xác nhận lại đúng tài khoản; lỗi tạm thời giữ phiên hiện tại. */
  refreshVerified: (expectedUserId: string) => Promise<User>
  /** `true` khi `user` là khách vãng lai (chưa đăng nhập) — xem context/AuthProvider.tsx. */
  isGuest: boolean
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  refresh: async () => {},
  refreshVerified: async () => {
    throw new Error('AuthProvider chưa sẵn sàng')
  },
  isGuest: false,
})
