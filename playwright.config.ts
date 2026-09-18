import { existsSync } from 'node:fs'
import { defineConfig, devices } from '@playwright/test'

// Cổng server riêng cho E2E (tránh đụng 5173 nếu đang chạy dev tay).
const PORT = 5179
const baseURL = `http://localhost:${PORT}`
// Mặc định dùng Vite dev để vòng lặp phát triển cục bộ nhanh. CI đặt E2E_SERVER=production
// để chạy đúng Express đã biên dịch: cùng static artifact và API routing như lúc phát hành.
// Không dùng `vite preview`: nó chỉ phục vụ file tĩnh nên không có `/api/*` cho E2E.
const useProductionServer = process.env.E2E_SERVER === 'production'

// Dùng Chromium cài sẵn của môi trường nếu có (KHÔNG chạy "playwright install");
// nếu không (vd. CI tự cài browser), để trống cho Playwright tự tìm bản của nó.
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH || '/opt/pw-browsers/chromium'
const launchOptions = existsSync(chromiumPath) ? { executablePath: chromiumPath } : {}

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Trên CI mỗi mảnh (shard) chạy trên một runner 4 nhân riêng → 2 worker là an toàn và
  // nhanh gấp đôi so với 1. Đổi 2026-08-27 cùng lúc với việc chia E2E thành 4 mảnh.
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions,
      },
    },
  ],
  webServer: {
    command: useProductionServer
      ? 'node dist-server/server.js'
      : `npm run dev -- --port ${PORT} --strictPort`,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    // Production E2E không được đọc `.env` local hay kết nối dịch vụ thật. Các test cần dữ liệu
    // đã tự mock ở biên API; endpoint không mock sẽ đi qua handler production với DB giả.
    ...(useProductionServer
      ? {
          env: {
            PORT: String(PORT),
            NODE_ENV: 'production',
            DATABASE_URL: 'postgres://fake:fake@127.0.0.1:5/fake',
            DATABASE_URL_READ: 'postgres://fake:fake@127.0.0.1:5/fake',
            TTS_ENCRYPTION_MASTER_KEY: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=',
            REMINDER_SCHEDULER: 'off',
            // Chặn tường minh mọi credential của provider: E2E chỉ dùng fake ở biên API,
            // nên không được tiêu tiền hay gửi dữ liệu ra dịch vụ ngoài nếu máy có `.env`.
            ANTHROPIC_API_KEY: '',
            AZURE_SPEECH_KEY: '',
            ELEVENLABS_API_KEY: '',
            GEMINI_API_KEY: '',
            GOOGLE_TTS_API_KEY: '',
            GOOGLE_TTS_API_KEYS: '',
            GROQ_API_KEY: '',
            OPENAI_API_KEY: '',
            R2_ACCESS_KEY_ID: '',
            R2_SECRET_ACCESS_KEY: '',
            REDIS_URL: '',
            VAPID_PRIVATE_KEY: '',
            VAPID_PUBLIC_KEY: '',
          },
        }
      : {}),
  },
})
