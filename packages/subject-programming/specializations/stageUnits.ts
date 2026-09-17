// specializations/stageUnits.ts — CẦU NỐI giữa BẢN ĐỒ HƯỚNG và BÀI HỌC THẬT.
//
// Bản đồ hướng (`registry.ts`) nói "chặng web-s1 dạy những gì"; dòng bài học 8 bước
// (`lessons/`) mới là chỗ học viên gõ code. Hai tầng cố ý tách nhau: bản đồ phủ đủ 14 hướng
// từ ngày đầu, còn nội dung soạn dần từng chặng. File này ghi lại chặng nào ĐÃ có bài, để
// giao diện hiện nút "Vào học" đúng chỗ thay vì hứa suông ở cả 52 chặng.
//
// Luật: chỉ thêm một dòng vào đây KHI unit đã có bài thật — test `stageUnits.test.ts` kiểm
// chéo với curriculum và với `lessons.ts`, nên khai sai là CI đỏ chứ không phải trang trắng.
import type { SpecializationId } from './types.js'

/** Các unit trong dòng bài học 8 bước thuộc về một chặng của hướng. */
export const SPEC_STAGE_UNITS: Record<string, string[]> = {
  // Hướng Web, chặng S1 — soạn 2026-08-27 (3 unit).
  'web-s1': ['p6-u16', 'p6-u17', 'p6-u18'],
  // Hướng Kiến trúc, chặng S1 — soạn 2026-08-27 (3 unit).
  'architecture-s1': ['p6-u19', 'p6-u20', 'p6-u21'],
  // Hướng Web, chặng S4 — soạn 2026-08-27 (3 unit). Đặc tả:
  // `docs/specs/2026-08-27-chang-s4-13-huong.md`.
  'web-s4': ['p6-u22', 'p6-u23', 'p6-u24'],
  // Hướng Backend, chặng S1 — soạn 2026-08-27 (3 unit). Dải `p6-u61…p6-u93` dành cho S1 của
  // 11 hướng còn lại; đặc tả: `docs/specs/2026-08-27-dai-ma-unit-s1-cac-huong-con-lai.md`.
  'backend-s1': ['p6-u61', 'p6-u62', 'p6-u63'],
  // Hướng AI, chặng S1 — soạn 2026-08-31. p6-u1 đã có TỪ TRƯỚC (module m1 gọi mô hình + m2
  // RAG); p6-u64/u65 khép nốt module m3 (đánh giá tự động) + m4 (an toàn & chi phí) của
  // `specializations/ai.ts`.
  'ai-s1': ['p6-u1', 'p6-u64', 'p6-u65'],
  // 4 chặng RIÊNG của lộ trình "Kỹ Sư Trưởng AI", giai đoạn P5 "Tầm trưởng" — soạn 2026-08-31
  // (đợt 4). Không phải hướng chuyên sâu — xem `learningPaths/pathStages.ts`. Đặc tả:
  // `docs/specs/2026-08-31-dot-4-p5-tam-truong.md`.
  'principal-s1': ['p6-u94', 'p6-u95'],
  'principal-s2': ['p6-u96', 'p6-u97'],
  'principal-s3': ['p6-u98', 'p6-u99'],
  'principal-s4': ['p6-u100', 'p6-u101'],
  // Hướng Dữ liệu, chặng S1 — soạn 2026-08-31 (3 unit, 4 module: p6-u66 = m1, p6-u67 = m2,
  // p6-u68 gộp m3+m4 — đúng tiền lệ web-s1 gộp module khi hợp lý).
  'data-s1': ['p6-u66', 'p6-u67', 'p6-u68'],
  // Hướng Dữ liệu, chặng S2 — soạn 2026-08-31 (3 unit, 4 module: p6-u120 = m1 (ETL/ELT),
  // p6-u121 = m2 (mô hình hoá kho dữ liệu), p6-u122 gộp m3+m4 (điều phối + chất lượng dữ
  // liệu — cả hai cùng trả lời "đường ống sai thì làm sao BIẾT và làm sao SỬA"). Đúng tiền lệ
  // backend-s2/s3/s4 gộp m3+m4 thành unit cuối chặng.
  'data-s2': ['p6-u120', 'p6-u121', 'p6-u122'],
  // Hướng Dữ liệu, chặng S3 — soạn 2026-08-31 (3 unit, 4 module: p6-u126 = m1 (dữ liệu lớn
  // hơn RAM), p6-u127 = m2 (luồng thời gian thực), p6-u128 gộp m3+m4 (thực nghiệm + chi phí
  // & quản trị — cả hai cùng trả lời "con số này đáng bao nhiêu"). Đúng tiền lệ
  // backend-s2/s3/s4 gộp m3+m4 thành unit cuối chặng.
  'data-s3': ['p6-u126', 'p6-u127', 'p6-u128'],
  // Hướng Backend, chặng S2 — soạn 2026-08-31 (3 unit, 4 module: p6-u102 = m1, p6-u103 = m2,
  // p6-u104 gộp m3+m4 — đúng tiền lệ web-s1 gộp module khi hợp lý).
  'backend-s2': ['p6-u102', 'p6-u103', 'p6-u104'],
  // Hướng Backend, chặng S3 — soạn 2026-08-31 (3 unit, 4 module: p6-u105 = m1, p6-u106 = m2,
  // p6-u107 gộp m3+m4 — đúng tiền lệ web-s1 gộp module khi hợp lý).
  'backend-s3': ['p6-u105', 'p6-u106', 'p6-u107'],
  // Hướng Backend, chặng S4 — soạn 2026-08-31 (3 unit, 4 module: p6-u108 = m1, p6-u109 = m2,
  // p6-u110 gộp m3+m4 — đúng tiền lệ web-s1 gộp module khi hợp lý).
  'backend-s4': ['p6-u108', 'p6-u109', 'p6-u110'],
  // Hướng Web, chặng S2 — soạn 2026-08-31 (3 unit, 5 module: p6-u111 = m1, p6-u112 gộp
  // m2+m3 (CSDL quan hệ + Xác thực & phiên), p6-u113 gộp m4+m5 (tải dữ liệu client + deploy)).
  'web-s2': ['p6-u111', 'p6-u112', 'p6-u113'],
  // Hướng Web, chặng S3 — soạn 2026-08-31 (3 unit, 5 module: p6-u114 = m1, p6-u115 gộp
  // m2+m4 (render + kiến trúc — cả hai là quyết định CẤU TRÚC lớn), p6-u116 gộp m3+m5
  // (kiểm thử + bảo mật — cả hai là gác CHẤT LƯỢNG/AN TOÀN trước khi release)).
  'web-s3': ['p6-u114', 'p6-u115', 'p6-u116'],
  // Hướng Kiến trúc, chặng S2 — soạn 2026-08-31 (3 unit, 4 module: p6-u117 = m1 (mô hình hoá
  // miền), p6-u118 = m2 (hợp đồng kiểm được), p6-u119 gộp m3+m4 (tiến hoá không phá + dữ liệu
  // là phần khó đổi nhất — cả hai cùng trả lời "đổi hợp đồng đã có người dùng thế nào cho an
  // toàn"). Đúng tiền lệ web-s1/backend-s2 gộp module khi hợp lý.
  'architecture-s2': ['p6-u117', 'p6-u118', 'p6-u119'],
  // Hướng Kiến trúc, chặng S3 — soạn 2026-08-31 (3 unit, 4 module: p6-u123 = m1 (đặc tả
  // kín), p6-u124 = m2 (giao việc cho AI/người mới), p6-u125 gộp m3+m4 (nghiệm thu + sổ
  // quyết định ADR — cả hai cùng trả lời "giữ đúng kết quả code mình không tự gõ", một ở
  // lượt này, một qua các lượt sau). Đúng tiền lệ web-s1/backend-s3 gộp module khi hợp lý.
  'architecture-s3': ['p6-u123', 'p6-u124', 'p6-u125'],
  'architecture-s4': ['p6-u190', 'p6-u191', 'p6-u192', 'p6-u193'],
  // Hướng DI ĐỘNG, chặng S1 — soạn 2026-08-31 (3 unit, 4 module). Đây là chặng ĐẦU TIÊN của
  // hướng Di động có bài học thật, nên không có tiền lệ `mobile-*` nào để theo; cách gộp lấy
  // theo tiền lệ chung của các hướng khác: p6-u131 = m1 (chọn nền tảng & vòng đời app),
  // p6-u132 = m2 (giao diện khai báo), p6-u133 gộp m3+m4 (điều hướng & trạng thái + lưu trữ
  // cục bộ — cả hai cùng trả lời "cái gì phải sống sót, và sống sót ở đâu": m3 lo trong một
  // phiên, m4 lo qua các phiên). Bài dùng làn `typescript` vì `kotlin`/`swift` chưa có bài nào
  // nên chưa cổng CI nào chứng minh bộ mô phỏng chấm đúng — nguyên lý dạy là nguyên lý chung
  // cho cả Android lẫn iOS. Đặc tả: `docs/specs/2026-08-31-bai-hoc-chang-s1-huong-di-dong.md`.
  'mobile-s1': ['p6-u131', 'p6-u132', 'p6-u133'],
  // Hướng Toán học cho Lập trình, chặng S1 — bốn module tách thành bốn unit để mỗi cơ chế
  // có ca biên và bằng chứng chạy thật riêng. Đặc tả:
  // `docs/specs/2026-09-16-mathforcode-s1-bai-hoc-that.md`.
  'mathforcode-s1': ['p6-u134', 'p6-u135', 'p6-u136', 'p6-u137'],
  'mathforcode-s2': ['p6-u138', 'p6-u139', 'p6-u140', 'p6-u141'],
  'algo-s1': ['p6-u142', 'p6-u143', 'p6-u144', 'p6-u145'],
  'algo-s2': ['p6-u162', 'p6-u163', 'p6-u164', 'p6-u165'],
  'systems-s1': ['p6-u146', 'p6-u147', 'p6-u148', 'p6-u149'],
  'systems-s2': ['p6-u150', 'p6-u151', 'p6-u152', 'p6-u153'],
  // DevOps S1 — bốn module được tách để mỗi policy vận hành có ca âm riêng. Mô phỏng Python
  // chỉ chuẩn bị quyết định; rubric Linux/VPS thật vẫn nằm ở `details/devops-s1.ts`.
  'devops-s1': ['p6-u154', 'p6-u155', 'p6-u156', 'p6-u157'],
  'devops-s2': ['p6-u178', 'p6-u179', 'p6-u180', 'p6-u181'],
  'mathforcode-s3': ['p6-u158', 'p6-u159'],
  'mathforcode-s4': ['p6-u160', 'p6-u161'],
  'ai-s2': ['p6-u166', 'p6-u167', 'p6-u168', 'p6-u169'],
  'ai-s3': ['p6-u170', 'p6-u171', 'p6-u172', 'p6-u173'],
  'ai-s4': ['p6-u174', 'p6-u175', 'p6-u176', 'p6-u177'],
  'security-s1': ['p6-u182', 'p6-u183', 'p6-u184', 'p6-u185'],
  'security-s2': ['p6-u186', 'p6-u187', 'p6-u188', 'p6-u189'],
}

/** Unit của một chặng; mảng RỖNG nghĩa là chặng chưa có bài (giao diện phải nói rõ điều đó). */
export function unitsOfStage(stageId: string): string[] {
  return SPEC_STAGE_UNITS[stageId.trim().toLowerCase()] ?? []
}

/** Hướng này đã có bài học thật ở chặng nào chưa — dùng để gắn nhãn "đã có bài" ở danh sách. */
export function specHasLessons(specId: SpecializationId): boolean {
  return Object.keys(SPEC_STAGE_UNITS).some((k) => k.startsWith(`${specId}-`))
}
