// Khởi động bản Express ĐÃ BIÊN DỊCH cho Playwright production-E2E.
// Không dùng provider thật: job E2E phải cấp Postgres disposable. Server hiện gọi
// `dotenv.config()` với mặc định `override: false`, nên đặt mọi khoá provider thành chuỗi
// rỗng trong child environment sẽ chặn cả credential kế thừa lẫn `.env` cục bộ mà không
// cần đọc hoặc in secret.
import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import process from 'node:process'

const requiredFiles = ['dist/index.html', 'dist-server/server.js']
const forbiddenEnvironment = [
  'ANTHROPIC_API_KEY',
  'APPLE_CLIENT_ID',
  'AWS_ACCESS_KEY_ID',
  'AWS_SECRET_ACCESS_KEY',
  'AZURE_SPEECH_KEY',
  'ELEVENLABS_API_KEY',
  'FACEBOOK_APP_ID',
  'FACEBOOK_APP_SECRET',
  'FEATURE_STATUS_CRON_KEY',
  'GEMINI_API_KEY',
  'GEMINI_LIVE_WS_URL',
  'GOOGLE_TTS_API_KEY',
  'GOOGLE_TTS_API_KEYS',
  'GOOGLE_CLIENT_ID',
  'GROQ_API_KEY',
  'GROQ_CHAT_MODEL',
  'MICROSOFT_CLIENT_ID',
  'OPENAI_API_KEY',
  'R2_ACCESS_KEY_ID',
  'R2_ACCOUNT_ID',
  'R2_BUCKET',
  'R2_PUBLIC_BASE_URL',
  'R2_SECRET_ACCESS_KEY',
  'REDIS_URL',
  'SENTRY_DSN',
  'SEPAY_BANK_ACCOUNT',
  'SEPAY_BANK_CODE',
  'SEPAY_WEBHOOK_API_KEY',
  'SMTP_FALLBACK_HOST',
  'SMTP_FROM',
  'SMTP_HOST',
  'SMTP_PASS',
  'SMTP_USER',
  'VAPID_EMAIL',
  'VAPID_PRIVATE_KEY',
  'VAPID_PUBLIC_KEY',
  'USER_DATA_MASTER_KEY',
  'USER_DATA_MASTER_KEY_V1',
  'USER_DATA_MASTER_KEY_V2',
  'DATABASE_URL_READ',
  'CRON_SECRET',
  'SKIP_AUTH',
]

const missing = requiredFiles.filter((file) => !existsSync(file))
if (missing.length > 0) {
  console.error(`Production E2E cần build trước: thiếu ${missing.join(', ')}`)
  process.exit(1)
}

if (!process.env.DATABASE_URL?.trim()) {
  console.error('Production E2E cần DATABASE_URL của PostgreSQL disposable.')
  process.exit(1)
}

if (!process.env.TTS_ENCRYPTION_MASTER_KEY?.trim()) {
  console.error('Production E2E cần TTS_ENCRYPTION_MASTER_KEY thử nghiệm.')
  process.exit(1)
}

const sanitizedEnvironment = { ...process.env }
for (const key of forbiddenEnvironment) sanitizedEnvironment[key] = ''

const child = spawn(process.execPath, ['dist-server/server.js'], {
  stdio: 'inherit',
  env: {
    ...sanitizedEnvironment,
    NODE_ENV: 'production',
    PORT: process.env.PORT || '5179',
    REMINDER_SCHEDULER: 'off',
    STORAGE_DRIVER: 'local',
  },
})

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal))
}

child.on('exit', (code, signal) => process.exit(code ?? (signal ? 1 : 0)))
