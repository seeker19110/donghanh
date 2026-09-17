// orderSubjects.ts — sắp môn ĐANG HỌC lên đầu danh sách "Bộ môn & không gian" (P1-8).
//
// Vì sao có file này: đặc tả docs/specs/2026-09-17-redesign-trang-chu-thi-hanh.md §P1-8 — môn
// người dùng đang có tiến độ (`TodayPlan.subjectsSeen`) nên đứng trước môn chưa chạm tới, nhưng
// KHÔNG được mặc định đưa Tiếng Anh lên đầu khi chưa có bằng chứng gì (luật "không mặc định
// tiếng Anh" — CLAUDE.md §4.9, PROJECT.md).
//
// Hàm THUẦN: không React, không storage — nhận sẵn `seen` (đã tính từ TodayPlan) để test bằng
// bảng dữ liệu, ổn định (stable sort): trong từng nhóm (đang học / chưa học) giữ nguyên thứ tự
// đầu vào (thứ tự registry `SUBJECT_ENTRIES`).
import type { SubjectEntry } from '@dhcb/core-learner/subjectEntry'

/**
 * Sắp lại `entries`: môn có id nằm trong `seen` lên đầu, còn lại giữ nguyên thứ tự cũ.
 * Id lạ trong `seen` (không khớp môn nào trong `entries`) tự nhiên bị bỏ qua.
 */
export function orderSubjects(
  entries: readonly SubjectEntry[],
  seen: readonly string[],
): SubjectEntry[] {
  const seenSet = new Set(seen)
  const dangHoc: SubjectEntry[] = []
  const chuaHoc: SubjectEntry[] = []
  for (const entry of entries) {
    if (seenSet.has(entry.id)) {
      dangHoc.push(entry)
    } else {
      chuaHoc.push(entry)
    }
  }
  return [...dangHoc, ...chuaHoc]
}
