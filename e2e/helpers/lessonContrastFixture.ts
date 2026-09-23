import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Page } from '@playwright/test'
import { z } from 'zod'
import {
  COLORS,
  getColor,
  PAGE_SIZE,
} from '../../apps/dhcb/src/pages/subjects/english/lessons/shared'

const metadataSchema = z.array(
  z.object({
    id: z.number().int().positive(),
    title: z.string(),
    situation: z.string(),
    turnCount: z.number().int().nonnegative(),
    speakerAGender: z.enum(['female', 'male']).nullable(),
    speakerBGender: z.enum(['female', 'male']).nullable(),
    chunk: z.number().int().nonnegative(),
    idx: z.number().int().nonnegative(),
  }),
)

/**
 * Trạng thái hữu hạn của cổng contrast: một trang metadata THẬT, đủ mọi palette.
 * Cuộn đo chữ không được biến thành vòng tải vô hạn 350 bài. Luồng tải thêm thật
 * vẫn được kiểm riêng trong lesson-list-visibility.spec.ts; đây không phải bằng
 * chứng tương phản của mọi bản ghi trong kho bài học.
 */
export async function mockLessonContrastSample(page: Page): Promise<void> {
  const all = metadataSchema.parse(
    JSON.parse(readFileSync(resolve('apps/dhcb/public/data/lessons/index.json'), 'utf8')),
  )
  const sample = all.slice(0, PAGE_SIZE)
  if (
    sample.length !== PAGE_SIZE ||
    new Set(sample.map((lesson) => lesson.id)).size !== sample.length ||
    COLORS.some((palette) => !sample.some((lesson) => getColor(lesson.id) === palette))
  ) {
    throw new Error('Mẫu contrast phải có ID duy nhất và phủ đầy đủ palette của danh sách bài học')
  }
  await page.route('**/data/lessons/index.json', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(sample) }),
  )
}
