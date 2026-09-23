# Baseline UI/UX và sư phạm — 23/09/2026

Nguồn cho [kế hoạch nâng cấp](../goals/2026-09-23-uiux-su-pham.md).
Commit khảo sát `main`: `1d9e247e`. Không coi báo cáo này là chứng nhận toàn site.

## 1. Bằng chứng đã có

Audit Chromium local trên 3 màn Hôm nay/bài STEM/kết quả × 3 theme
blue-sky/dark-blue/kid × 390/1440px: 18 lượt, không tràn ngang; cả 18 báo
`meta-viewport` và có `color-contrast` trong `incomplete`. Incomplete không phải pass.
Đã xem trực tiếp ảnh mobile/desktop, kiểm tra lỗi mất mạng và ôn thẻ nhiều môn.
Tất cả request API chưa mock và HTTPS ngoài đã bị chặn trong script kiểm chứng.

| ID  | Hiện trạng                                                         | Bằng chứng/điểm chạm                                                          | Mức xác minh                                                                      |
| --- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| F1  | Placement kẹt ở tải câu hỏi khi mất mạng, không retry              | `Placement.tsx:94`, `dialoguesLoader.ts:9`                                    | Chromium: chặn dialogues.json, nhận Failed to fetch, spinner còn, 0 retry         |
| F2  | Lưu trình độ lỗi vẫn ghi cache và điều hướng                       | `lib/cloud.ts:142`, `Placement.tsx:171`                                       | Đọc luồng mã; onboarding cũng gọi cùng hàm tại `pages/core/Onboarding.tsx:115`    |
| F3  | Khóa zoom; gate bỏ qua meta-viewport                               | `apps/dhcb/index.html:11`, `src/index.css:113`, `e2e/a11y.spec.ts`            | Vi phạm trong 18/18 lượt                                                          |
| F4  | Đáp án đúng/sai chỉ đổi CSS, thiếu phản hồi cho trình đọc màn hình | `components/ExamQuestionCard.tsx:123`, `components/studyTabs/QuizTab.tsx:241` | Đọc cấu trúc component; chưa kiểm NVDA/VoiceOver                                  |
| F5  | Gate AAA dùng matches nên bỏ span nằm trong p                      | `e2e/a11y-aaa.spec.ts:84`                                                     | Negative control: chữ #666 cỡ 16px trên trắng bị axe bắt; selector gate trả false |
| F6  | Trang ôn một môn lấy thẻ mọi môn, cap trước lọc                    | `pages/learning/StemReview.tsx:41`, `lib/stemSrs.ts:102`                      | Chromium: trang Vật lí cap=1 hiển thị “Hoá học nghiên cứu về gì?”                 |
| F7  | Điền từ dùng nguyên nghĩa từ điển/dạng gốc thay vào câu            | `pages/learning/practice/FillBlankQuiz.tsx:23–42`                             | Trong 12.153 ví dụ mỗi chiều, 80 EN và 7.385 VI không chứa nguyên chuỗi đáp án    |
| F8  | Ngôn ngữ UI làm đổi ngôn ngữ bài luyện                             | `pages/learning/Practice.tsx:77`, `practice/FillBlankQuiz.tsx:31`             | Đọc đường truyền isA từ useLang tới bộ chọn câu/đáp án                            |

Các đường dẫn rút gọn trên thuộc `apps/dhcb/src/`, trừ khi đã ghi `apps/` hoặc `e2e/`.
Số của F7 là ứng viên rủi ro trong từ điển, không phải tỷ lệ lỗi phiên học:
pool thật phụ thuộc lộ trình/từ đã học. F2/F4/F8 cần tái hiện tương tác khi triển khai.

Ảnh bài mẫu: mobile 4.469px, kết quả 6.053px; desktop 3.418/4.498px.
Mục lục trong bài và giảm lặp lời giải là giả thuyết cải thiện cần đo, chưa phải
bằng chứng người học thật gặp khó khăn.

## 2. Giới hạn và lưu bằng chứng

Audit dùng Node Windows 24.19.0, chưa kiểm Node 22 như CI. Dependency đã đồng bộ
lockfile; chưa chạy full build/typecheck/lint/unit/E2E vì không sửa source.
Chưa đo voice thật, thiết bị thật, hiệu lực CEFR/IELTS, CWV production hoặc hiệu quả học.

Artifact gốc được lưu ngoài repo trên máy thực hiện tại
`C:\Users\liend\.codex\audit-uiux-20260923`: `BAO-CAO.md`, `matrix.jsonl`,
`data-audit.py`, `data-audit.json`, `audit.mts`, `matrix.mts`, `probes.mts`,
`probes2.mts` và ảnh. Đây là vị trí cục bộ, không giả định CI/máy khác truy cập được.
Trước PR sửa, đưa ca tái hiện cần thiết vào test của repo và đính kèm artifact sạch
với SHA đang kiểm; không dùng ảnh hay kết quả cũ để chứng minh bản sửa đạt.

## 3. Nguồn và cách áp dụng

Đối chiếu ngày 23/09/2026:

- [W3C Resize Text](https://www.w3.org/WAI/WCAG21/Understanding/resize-text):
  kiểm phóng to chữ 200%, không mất nội dung/chức năng.
- [W3C Reflow](https://www.w3.org/WAI/WCAG21/Understanding/reflow):
  kiểm đọc ở bề rộng tương đương 320 CSS px, giữ ngoại lệ nội dung hai chiều hợp lệ.
- [W3C Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html):
  thêm chữ/ký hiệu có nghĩa cho phản hồi, không chỉ đổi màu.
- [W3C Contrast Enhanced](https://www.w3.org/WAI/WCAG22/Understanding/contrast-enhanced.html):
  phân biệt AAA của W3C với quy định dự án 7:1 cho cả tiêu đề lớn.
- [EEF Teacher Feedback](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/feedback):
  thiết kế phản hồi giúp người học thực hiện bước cải thiện tiếp theo.
- [EEF Metacognition](https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/metacognition):
  đưa lập kế hoạch, tự theo dõi và tự đánh giá vào hoạt động học cụ thể.

Đây là nguyên tắc định hướng thiết kế; không suy ra mức tăng điểm số hay retention
cho Đồng Hành từ hiệu quả trung bình của nghiên cứu khác.
