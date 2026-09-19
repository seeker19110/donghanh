// scripts/check-spec-paths.ts — chặn đặc tả "nói suông": mọi đường dẫn file liệt kê trong mục
// "② Điểm chạm" của một đặc tả ĐÃ "Approved for implementation" (docs/specs/*.md, khuôn
// docs/templates/dac-ta-tinh-nang.md) phải trỏ tới file/thư mục THẬT SỰ tồn tại trong repo.
//
// VÌ SAO CẦN: CLAUDE.md mục 5 "Chống ảo giác" hiện chỉ dựa vào kỷ luật đọc code trước khi
// khẳng định — không có gác tự động nào cho riêng NỘI DUNG ĐẶC TẢ. Một đặc tả ghi "Approved"
// nhưng trỏ tới file đã đổi tên/xoá, hoặc gõ sai đường dẫn, sẽ khiến người/](AI) thi hành đoán
// sai điểm chạm mà không ai phát hiện cho tới khi code không chạy. Tham khảo ý tưởng
// seeker19110/projects-template scripts/spec-compiler.py (2026-09-19) — viết lại bằng TypeScript,
// phạm vi hẹp hơn nhiều bản gốc (chỉ kiểm path tồn tại, không biên dịch spec thành test).
//
// GIỚI HẠN CỐ Ý: chỉ kiểm CƠ HỌC (đường dẫn có tồn tại không) — không kiểm nội dung đặc tả có
// đúng/đủ hay không. Chỉ quét đặc tả đã "Approved for implementation" (Draft/In review được
// phép trỏ tới file chưa tồn tại — đó là kế hoạch, không phải đã chốt).
//
// Dùng: npx tsx scripts/check-spec-paths.ts [--ci]
//   --ci  thoát mã 1 nếu có đường dẫn thiếu (dùng trong CI job `audit`); không có cờ này thì
//         chỉ CẢNH BÁO (thoát 0) — dùng khi rà tay.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const SPEC_DIR = join(ROOT, 'docs/specs')
const CI_MODE = process.argv.includes('--ci')

function isApproved(content: string): boolean {
  return /Trạng thái:\*\*\s*Approved for implementation|Kết luận:\*\*\s*Approved for implementation/.test(
    content,
  )
}

// Trích đường dẫn CHỈ từ đúng cột "Đường dẫn file" của bảng theo khuôn
// docs/templates/dac-ta-tinh-nang.md mục ②: "| Sửa/Thêm/Xoá | `<path>` | ghi chú |".
// KHÔNG quét toàn văn — thử ban đầu quét mọi backtick cho ra rất nhiều khớp nhầm: route URL
// (`/bat-dau`), gọi hàm (`nav('/x')`), truy cập thuộc tính (`profiles.goal`), số dòng
// (`file.ts:216/268`), thuộc tính HTML (`fieldset/legend`)... Chỉ ô bảng đúng vị trí mới đáng
// tin là một đường dẫn file thật. Yêu cầu thêm: có đuôi file đã biết (loại route/package import
// không đuôi) và không chứa `(`, `'`, khoảng trắng, hoặc số dòng dạng `:123`.
const KNOWN_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|json|sql|md|css|yml|yaml|sh)$/
function extractPaths(content: string): string[] {
  const paths = new Set<string>()
  const rowRe = /^\|\s*(?:Sửa|Thêm|Xoá|Xóa)\s*\|\s*`([^`]+)`\s*\|/gmu
  let m: RegExpExecArray | null
  while ((m = rowRe.exec(content))) {
    const raw = m[1]
    if (!raw) continue
    const candidate = raw.trim()
    if (candidate.includes('(') || candidate.includes("'") || /\s/.test(candidate)) continue
    if (candidate.includes(':')) continue // "file.ts:12-34" — số dòng, không kiểm được cơ học
    if (!KNOWN_EXT.test(candidate)) continue
    paths.add(candidate)
  }
  return [...paths]
}

function main() {
  if (!existsSync(SPEC_DIR)) {
    console.log('OK — không có docs/specs/, bỏ qua.')
    return
  }
  const files = readdirSync(SPEC_DIR).filter((f) => f.endsWith('.md') && f !== 'README.md')
  let missingTotal = 0
  const report: string[] = []

  for (const file of files) {
    const full = join(SPEC_DIR, file)
    const content = readFileSync(full, 'utf8')
    if (!isApproved(content)) continue

    // Chỉ kiểm path trong mục "② Điểm chạm" nếu có, để tránh khớp nhầm path ví dụ minh hoạ ở
    // mục hợp đồng dữ liệu (③); không có mục đó → kiểm toàn văn (đặc tả cũ trước khi có khuôn).
    const sectionMatch = content.match(/## ②[\s\S]*?(?=\n## |$)/)
    const scope = sectionMatch ? sectionMatch[0] : content
    const candidatePaths = extractPaths(scope)

    const missing = candidatePaths.filter((p) => !existsSync(join(ROOT, p)))
    if (missing.length > 0) {
      missingTotal += missing.length
      report.push(`- docs/specs/${file}:`)
      for (const p of missing) report.push(`    thiếu: ${p}`)
    }
  }

  if (missingTotal === 0) {
    console.log(`OK — đã kiểm ${files.length} đặc tả, không có đường dẫn thiếu ở đặc tả Approved.`)
    return
  }

  console.log(
    `Tìm thấy ${missingTotal} đường dẫn KHÔNG TỒN TẠI trong đặc tả đã "Approved for implementation":`,
  )
  console.log(report.join('\n'))
  console.log(
    '\n→ Đặc tả đã chốt nhưng trỏ tới file không có thật (đổi tên/xoá sau khi duyệt, hoặc gõ sai). Sửa đặc tả hoặc tạo lại file.',
  )
  if (CI_MODE) process.exit(1)
}

main()
