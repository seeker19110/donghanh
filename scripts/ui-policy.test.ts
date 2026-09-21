// scripts/ui-policy.test.ts — TEST CANH GÁC luật UI/UX của CLAUDE.md mục 4 (chạy trong
// `npm test`, nên CI đỏ ngay khi có vi phạm mới).
//
// Vì sao là test chứ không phải lint rule: hai luật dưới đây nói về GIÁ TRỊ TUỲ Ý trong
// chuỗi class Tailwind (`text-[10px]`, `max-h-[90vh]`) — ESLint không đọc được ngữ nghĩa đó,
// còn quét văn bản thì đúng một vòng ~0,1 giây cho toàn bộ `apps/**/src/**/*.tsx`.
//
// Bối cảnh: audit UI/UX 2026-08-31 (`docs/research/audit-ui-ux-desktop-mobile-2026-08-31.md`)
// mục A6 (217 chỗ dưới sàn chữ 11px) và A4 (`vh` tràn dưới thanh URL trên iOS).
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

// `process.cwd()` = gốc repo khi chạy `npm test` (cùng cách scripts/ci-workflow-policy.test.ts
// làm). Không dùng `import.meta.url` vì môi trường test là happy-dom, URL không theo scheme file.
const ROOT = process.cwd()
const APPS_DIR = join(ROOT, 'apps')

/** Liệt kê mọi file .tsx trong apps/<app>/src (bỏ node_modules/dist). */
function listTsxFiles(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === 'dist' || name === 'dist-server') continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...listTsxFiles(full))
    else if (name.endsWith('.tsx')) out.push(full)
  }
  return out
}

const FILES = readdirSync(APPS_DIR)
  .map((app) => join(APPS_DIR, app, 'src'))
  .filter((d) => {
    try {
      return statSync(d).isDirectory()
    } catch {
      return false
    }
  })
  .flatMap(listTsxFiles)

/** Tìm mọi vi phạm của một biểu thức trong toàn bộ file .tsx, trả về "đường-dẫn:dòng". */
function findViolations(re: RegExp): string[] {
  const hits: string[] = []
  for (const file of FILES) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, i) => {
      // Bản sao regex mỗi lần dùng để cờ `g` không giữ lastIndex giữa các dòng.
      if (new RegExp(re.source).test(line)) {
        // relative() dùng `\\` trên Windows, trong khi baseline được lưu theo POSIX `/`
        // để ổn định trên mọi runner CI. Chuẩn hoá trước khi so với baseline.
        hits.push(`${relative(ROOT, file).replaceAll('\\', '/')}:${i + 1}`)
      }
    })
  }
  return hits
}

describe('luật UI: sàn chữ 11px', () => {
  it('không có class cỡ chữ dưới 11px (text-[9px] / text-[10px])', () => {
    // Đã codemod toàn bộ về 11px — danh sách này PHẢI rỗng vĩnh viễn. Chữ nhỏ hơn 11px
    // không đọc nổi trên điện thoại và là vi phạm chuẩn nội bộ (CLAUDE.md mục 13, hệ theme).
    expect(findViolations(/text-\[(9|10)px\]/)).toEqual([])
  })
})

describe('luật UI: chiều cao viewport dùng dvh, không dùng vh', () => {
  // Vì sao: trên iOS Safari `100vh` KHÔNG trừ thanh URL/thanh công cụ, nên hộp thoại
  // `max-h-[90vh]` vẫn tràn khỏi màn hình thật; `dvh` (dynamic viewport height) co giãn
  // đúng theo phần nhìn thấy được. Mẫu đúng đã có sẵn: `Modal.tsx` dùng `max-h-[90dvh]`.
  //
  // Baseline tạm (audit A4) đã dọn xong 2026-09-21 — cả 3 file còn lại đều đổi sang `dvh`.
  // Danh sách miễn trừ đã xoá theo đúng ghi chú cũ; giữ luật cấm `vh` mới tuyệt đối.
  it('không có `max-h-[NNvh]` ở bất kỳ đâu', () => {
    expect(findViolations(/max-h-\[\d+vh\]/)).toEqual([])
  })
})
