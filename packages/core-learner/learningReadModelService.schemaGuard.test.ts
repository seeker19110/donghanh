// packages/core-learner/learningReadModelService.schemaGuard.test.ts
//
// Test CANH GÁC: đối chiếu cột thật SELECT bởi `getLearningReadModel` với danh sách cột
// THẬT của bảng `english.learning_progress` trong `postgres/schema.sql`.
//
// CỐ Ý ĐỎ (2026-09-19): `learningReadModelService.ts` đang SELECT cột `stats`, nhưng cột này
// KHÔNG tồn tại trong schema thật — xem `docs/adr/0005-read-model-stats.md` (Proposed, chưa
// chốt phương án sửa). Test unit hiện có (`learningReadModelService.test.ts`) mock `pool.query`
// và tự bịa field `stats` trong fixture nên không bắt được lỗi này (xanh giả).
//
// Test này KHÔNG cần Postgres thật — repo chưa có cơ chế chạy Postgres thật trong test (không
// docker-compose test DB, không CI job migrate-rồi-test). Thay vào đó nó đọc trực tiếp
// `postgres/schema.sql` (nguồn sự thật của schema) bằng regex đơn giản, rồi assert MỌI cột mà
// service SELECT đều nằm trong danh sách cột thật đó.
//
// KHI ADR-0005 ĐƯỢC CHỐT VÀ CODE ĐƯỢC SỬA: bỏ `describe.skip` → `describe`, chạy lại
// `npx vitest run packages/core-learner/learningReadModelService.schemaGuard.test.ts` để xác
// nhận xanh, rồi mới coi nợ S12 liên quan là đã đóng.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const REPO_ROOT = path.resolve(__dirname, '../..')

/** Trích danh sách tên cột thật của `english.learning_progress` từ `postgres/schema.sql`. */
function getRealColumnsOfLearningProgress(): string[] {
  const schemaSql = readFileSync(path.join(REPO_ROOT, 'postgres/schema.sql'), 'utf8')

  const createMatch = schemaSql.match(
    /create table if not exists english\.learning_progress\s*\(([\s\S]*?)\n\);/,
  )
  const body = createMatch?.[1]
  if (!body) {
    throw new Error('Không tìm thấy CREATE TABLE english.learning_progress trong schema.sql')
  }

  const columns: string[] = []
  for (const rawLine of body.split('\n')) {
    // Bỏ comment `-- ...` rồi bỏ dòng rỗng
    const line = rawLine.replace(/--.*$/, '').trim()
    if (!line) continue
    // Dòng ràng buộc bảng (unique/check/primary key ở mức bảng) không phải cột — bỏ qua
    if (/^(unique|check|primary key|foreign key|constraint)\b/i.test(line)) continue
    const columnMatch = line.match(/^([a-z_][a-z0-9_]*)\s+/i)
    const columnName = columnMatch?.[1]
    if (columnName) columns.push(columnName)
  }
  return columns
}

/** Trích danh sách cột trong câu SELECT ... from english.learning_progress của service. */
function getColumnsSelectedByService(): string[] {
  const serviceSrc = readFileSync(path.join(__dirname, 'learningReadModelService.ts'), 'utf8')
  // Tìm điểm "from english.learning_progress", rồi lùi lại tới dấu backtick GẦN NHẤT phía
  // trước nó — đó chính là điểm bắt đầu của câu SELECT tương ứng (tránh nuốt nhầm câu SELECT
  // khác, ví dụ SELECT từ public.profiles, đứng trước nó trong file).
  const fromIndex = serviceSrc.search(/from\s+english\.learning_progress/i)
  if (fromIndex === -1) {
    throw new Error('Không tìm thấy câu SELECT từ english.learning_progress trong service')
  }
  const backtickIndex = serviceSrc.lastIndexOf('`', fromIndex)
  const selectClause = serviceSrc.slice(backtickIndex + 1, fromIndex)
  const selectMatch = selectClause.match(/^select\s+([\s\S]*?)\s*$/i)
  const columnsRaw = selectMatch?.[1]
  if (!columnsRaw) {
    throw new Error('Không tìm thấy câu SELECT từ english.learning_progress trong service')
  }
  return columnsRaw
    .split(',')
    .map((column) => column.trim())
    .filter(Boolean)
}

// SKIP có chủ đích: test này CỐ Ý đỏ ngay bây giờ (cột `settings`/`stats` không có trong
// schema thật) chờ ADR-0005 (docs/adr/0005-read-model-stats.md) được chốt và
// `learningReadModelService.ts` được sửa theo phương án đã chọn. Không phải lỗi của PR này —
// PR này chỉ thêm test canh, KHÔNG sửa hành vi. Cách xác nhận nó đang đỏ: tạm đổi
// `describe.skip` thành `describe` rồi chạy
// `npx vitest run packages/core-learner/learningReadModelService.schemaGuard.test.ts`
// (xem chi tiết cách chạy trong changelog liên quan). Sau khi ADR-0005 được thi hành, bỏ
// `.skip` VĨNH VIỄN để test này bảo vệ contract lâu dài.
describe.skip('learningReadModelService — cột SELECT phải khớp schema thật (ADR-0005 chưa chốt)', () => {
  it('mọi cột SELECT từ english.learning_progress đều phải tồn tại trong postgres/schema.sql', () => {
    const realColumns = getRealColumnsOfLearningProgress()
    const selectedColumns = getColumnsSelectedByService()

    const missingColumns = selectedColumns.filter((column) => !realColumns.includes(column))

    expect(missingColumns).toEqual([])
  })
})
