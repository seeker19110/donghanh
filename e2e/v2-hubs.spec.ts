// e2e/v2-hubs.spec.ts — E2E Tests for Platform V2 Hubs & Companion
import { test, expect } from '@playwright/test'
import { mockLogin } from './helpers/auth'

test.describe('Platform V2 Specialized Domain Hubs & Companion E2E', () => {
  test.beforeEach(async ({ page }) => {
    await mockLogin(page)

    // Mock Companion API — apps/dhcb/src/pages/Companion.tsx gửi { stream: true } và parse
    // SSE (event: <type>\ndata: <json>\n\n), xem apps/dhcb/src/lib/companionApi.ts#
    // sendCompanionMessageStream. Body phải đúng định dạng SSE, KHÔNG phải JSON thường — mock
    // JSON cũ khiến parser không bao giờ tách được sự kiện (không có "\n\n" trong JSON thô) nên
    // Companion không bao giờ nhận được onDone → text không hiện (đã gây CI đỏ, xem PR #602).
    await page.route('**/api/companion', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON()
        const response = {
          reply: `Phản hồi từ Bạn Đồng Hành AI cho miền: ${body.domain || 'all'}`,
          intent: 'career_planning',
          targetDomain: body.domain || 'career',
          proposedActions: [
            {
              id: 'pa-e2e-1',
              action: 'Cập nhật vị trí mục tiêu lên Senior Staff Engineer',
              targetDomain: 'career',
              riskLevel: 'low',
              status: 'pending',
              proposedPayload: { targetRole: 'Senior Staff Engineer' },
            },
          ],
          contextPackage: {
            summary: 'Ngữ cảnh thử nghiệm E2E',
            domain: 'career',
            tokenBudget: 2000,
            tokensUsed: 450,
            retrievedFacts: [
              {
                id: 'f-1',
                category: 'skill',
                key: 'English',
                value: 'C1 Fluent',
                confidence: 0.95,
                sensitivity: 'low',
                sourceType: 'user_declared',
              },
            ],
          },
        }
        const sse = `event: done\ndata: ${JSON.stringify(response)}\n\n`
        await route.fulfill({
          status: 200,
          contentType: 'text/event-stream; charset=utf-8',
          body: sse,
        })
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
      }
    })

    // Mock Proposed Actions confirmation/rejection
    await page.route('**/api/proposed-actions', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          action: {
            id: 'pa-e2e-1',
            action: 'Cập nhật vị trí mục tiêu lên Senior Staff Engineer',
            targetDomain: 'career',
            riskLevel: 'low',
            status: 'committed',
            proposedPayload: { targetRole: 'Senior Staff Engineer' },
          },
        }),
      })
    })

    // Mock Work API
    await page.route('**/api/work*', async (route) => {
      const url = route.request().url()
      if (url.includes('kind=projects')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            projects: [
              {
                id: 'proj-1',
                name: 'Platform V2 Core',
                description: 'Nâng cấp toàn diện kiến trúc AI Companion',
                status: 'active',
              },
            ],
          }),
        })
      } else if (url.includes('kind=tasks')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            tasks: [
              {
                id: 'task-1',
                title: 'Hoàn thiện E2E Tests',
                priority: 'urgent',
                status: 'todo',
              },
            ],
          }),
        })
      } else if (url.includes('kind=meetings')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            meetings: [
              {
                id: 'meet-1',
                title: 'V2 Architecture Sprint Sync',
                scheduledAt: new Date().toISOString(),
                durationMinutes: 45,
                summary: 'Rà soát 8 acceptance invariants',
                actionItems: ['Deploy staging drill'],
              },
            ],
          }),
        })
      } else if (url.includes('kind=documents')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            documents: [
              {
                id: 'doc-1',
                title: 'V2 Architecture Spec',
                documentType: 'spec',
                summary: 'Đặc tả 13 schemas và Life Graph',
              },
            ],
          }),
        })
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' })
      }
    })
  })

  test('Trang chủ hiển thị thẻ Bạn Đồng Hành AI, Không Gian Chuyên Biệt nằm ở trang Cá nhân', async ({
    page,
  }) => {
    // Khối "Không Gian Chuyên Biệt" đã dời khỏi Trang chủ sang /profile (Personal Command
    // Center) — xem PROGRESS.md mục "V2 UI — Multi-Subject Learning...". Trang chủ chỉ còn thẻ
    // "Bạn Đồng Hành AI" dẫn tới /dong-hanh.
    // Dùng heading (HomeAiBriefingCard <h2>"Bạn Đồng Hành AI"</h2> — từ đợt C 2026-09-03 banner
    // riêng đã gỡ, thẻ AI mở đầu trang chủ giữ tiêu đề này) thay vì getByText để tránh khớp
    // nhầm các đoạn mô tả khác trên trang cùng nhắc tới "Bạn Đồng Hành AI".
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Bạn Đồng Hành AI/ })).toBeVisible()

    // Trang Cá nhân nay liệt kê 2 thẻ trụ, vì cả hai cặp đều đã GỘP:
    //   · Work + Life  → "Công việc & Đời sống" (migration 0066)
    //   · Career + Startup → "Sự nghiệp & Khởi nghiệp" (2026-08-28)
    await page.goto('/profile')
    await expect(page.getByText('Sự nghiệp & Khởi nghiệp', { exact: true })).toBeVisible()
    await expect(page.getByText('Công việc & Đời sống', { exact: true })).toBeVisible()
    // Chốt chặn để không âm thầm quay lại kiểu cũ: bốn thẻ tách rời phải KHÔNG còn.
    for (const cu of ['Sự nghiệp', 'Khởi nghiệp', 'Công việc', 'Đời sống']) {
      await expect(page.getByText(cu, { exact: true })).toHaveCount(0)
    }
  })

  test('Luồng Bạn Đồng Hành AI: gửi tin nhắn, nhận phản hồi và duyệt Proposed Action', async ({
    page,
  }) => {
    await page.goto('/ban-dong-hanh')
    await expect(page.getByText('Bạn Đồng Hành Đa Lĩnh Vực')).toBeVisible()

    // Chọn Domain Sự nghiệp. `exact: true` vì sidebar desktop (P1-7) nay có nút
    // 'Mở rộng mục Sự nghiệp & Đời sống' chứa chuỗi con "Sự nghiệp" trùng lặp.
    await page.getByRole('button', { name: 'Sự nghiệp', exact: true }).click()

    // Gửi tin nhắn
    const input = page.getByPlaceholder(/Nhắn tin cho Bạn Đồng Hành AI/)
    await input.fill('Tư vấn lộ trình thăng tiến Senior lên Staff')
    await input.press('Enter')

    // Kiểm tra phản hồi
    await expect(page.getByText('Phản hồi từ Bạn Đồng Hành AI cho miền: career')).toBeVisible()

    // Kiểm tra thẻ Đề xuất hành động (Proposed Action) và nút duyệt
    await expect(page.getByText('Tác vụ đề xuất')).toBeVisible()
    const confirmBtn = page.getByRole('button', { name: 'Xác nhận' })
    await expect(confirmBtn).toBeVisible()
    await confirmBtn.click()
    await expect(page.getByText('Đã thực thi')).toBeVisible()
  })

  test('Luồng Ghi chú: chuyển đổi giữa các tab Việc, Dự án, Cuộc họp và Ghi chú', async ({
    page,
  }) => {
    // [2026-09-20] Trụ "Công việc" đổi tên hiển thị thành "Ghi chú" và đứng riêng ở `/ghi-chu`.
    // Route cũ /cong-viec chuyển hướng sang đó — kiểm luôn để link cũ không gãy im lặng.
    await page.goto('/cong-viec')
    await expect(page).toHaveURL(/\/ghi-chu$/)
    await expect(page.getByRole('heading', { name: 'Ghi chú', level: 1 })).toBeVisible()

    // Tab 1: việc cần làm
    await expect(page.getByText('Hoàn thiện E2E Tests')).toBeVisible()

    // Tab 2: Dự án
    await page.getByRole('button', { name: /Dự án/ }).click()
    await expect(page.getByRole('heading', { name: 'Platform V2 Core' })).toBeVisible()

    // Tab 3: Cuộc họp
    await page.getByRole('button', { name: /Cuộc họp/ }).click()
    await expect(page.getByText('V2 Architecture Sprint Sync')).toBeVisible()

    // Tab 4: Ghi chú (entity `document` của /api/work — tên hiển thị đổi, hợp đồng giữ nguyên)
    await page.getByRole('button', { name: /^Ghi chú \(/ }).click()
    await expect(page.getByText('V2 Architecture Spec')).toBeVisible()
  })

  test('URL cũ của ba trụ đã gỡ đều về Trang chủ, không thành 404', async ({ page }) => {
    for (const path of ['/su-nghiep', '/khoi-nghiep', '/cuoc-song', '/life-graph']) {
      await page.goto(path)
      await expect(page).toHaveURL(/\/$/)
    }
  })
})
