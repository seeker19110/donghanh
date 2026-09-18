import { existsSync } from 'node:fs'
import { chromium } from '@playwright/test'

const WORKER_MODULES = [
  '/src/workers/pyodideWorker.ts?worker_file&type=module',
  '/src/workers/jsWorker.ts?worker_file&type=module',
  '/src/workers/sqlWorker.ts?worker_file&type=module',
]

const RUNTIME_ASSETS = [
  '/pyodide/pyodide.mjs',
  '/pyodide/pyodide.asm.wasm',
  '/pyodide/python_stdlib.zip',
  '/sqljs/sql-wasm.wasm',
]

/** @param {string} baseURL @param {string[]} paths */
async function assertFetchable(page, baseURL, paths) {
  const failures = await page.evaluate(
    async ({ baseURL: origin, paths: requestedPaths }) => {
      const results = await Promise.all(
        requestedPaths.map(async (path) => {
          const response = await fetch(new URL(path, origin))
          return response.ok ? null : `${path} (${response.status})`
        }),
      )
      return results.filter((result) => result !== null)
    },
    { baseURL, paths },
  )

  if (failures.length > 0) {
    throw new Error(`Không làm nóng được tài nguyên E2E: ${failures.join(', ')}`)
  }
}

/** @param {import('@playwright/test').FullConfig} config */
export default async function prewarmE2eRuntime(config) {
  const baseURL = config.projects[0]?.use.baseURL
  if (typeof baseURL !== 'string') {
    throw new Error('E2E prewarm cần baseURL của Playwright')
  }

  const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH || '/opt/pw-browsers/chromium'
  const browser = await chromium.launch(
    existsSync(chromiumPath) ? { executablePath: chromiumPath } : undefined,
  )

  try {
    // Context này chỉ khởi động Vite. Không seed đăng nhập, không mock API và không tái sử dụng
    // nó cho test, nên state/cookie/localStorage giữa các test vẫn hoàn toàn độc lập.
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' })

    // Fetch các entry worker theo đúng query Vite sinh cho `new Worker(new URL(...))` để cache
    // transform ở dev server. Không chạy code học viên hay giữ worker sống qua test.
    await assertFetchable(page, baseURL, WORKER_MODULES)
    await assertFetchable(page, baseURL, RUNTIME_ASSETS)
    await context.close()
  } finally {
    await browser.close()
  }
}
