# 0358 — 2026-09-17 — Gộp spec E2E resume STEM vào spec resume chung

| Thuộc tính | Giá trị                                                                                  |
| ---------- | ---------------------------------------------------------------------------------------- |
| PR         | (điền khi tạo PR)                                                                        |
| Đặc tả     | Không có đặc tả mới — dọn nợ kỹ thuật đã ghi sẵn ngay trong comment của file cũ          |
| Nền        | S08-2 #961 (Lập trình) và S08-4 #? (CEFR) đã vào `main`, S08-3 #962 (STEM) đã vào `main` |

## Việc đã làm

- Gộp `e2e/learning-session-resume-stem.spec.ts` (3 ca, môn STEM) vào
  `e2e/learning-session-resume.spec.ts` (7 ca, môn Lập trình + cấp CEFR môn Anh) — đúng theo
  ghi chú để lại trong file cũ lúc PR S08-3 #962 mở: "Khi #961 đã vào `main`, gộp ba ca dưới đây
  vào file đó và xoá file này." #961 đã vào `main` từ trước, nên gộp lại theo đúng dự định ban đầu.
- Ba ca STEM giữ NGUYÊN nội dung kiểm tra (đáp án tự kiểm tra sống qua reload, câu tự luận
  chưa chấm thì không bị chấm sau reload, chỉ sinh đúng một khoá phiên học) — chỉ đổi tên hằng số
  cục bộ (`BAI_STEM`, `TIEN_TO_PHIEN_STEM`, `khungCauHoiStem`) và tên hàm `khungCauHoi` để không
  đụng tên với các hằng/hàm cùng tên trong file đích, và thêm tiền tố "STEM:" vào tên ca cho nhất
  quán với tiền tố "Lập trình:"/"CEFR:" đã có.
- Xoá file `e2e/learning-session-resume-stem.spec.ts`.
- **Không gộp bằng `describe.each`/tham số hoá theo môn** vì ba nhóm ca (Lập trình, CEFR, STEM)
  kiểm ba luồng UI khác hẳn nhau (ô CodeMirror · tab/hoạt động của trang cấp CEFR · khối "Tự kiểm
  tra" của bài STEM) — dùng chung MỘT khung `LearningSession`/`useLearningSession` chứ không cùng
  một hành vi có thể lặp qua danh sách môn. Gộp file là đúng mức: một spec nói về "phiên học
  sống qua reload" cho cả nền tảng, các ca bên trong vẫn độc lập theo môn.

## Bằng chứng

- Số ca trước gộp: `learning-session-resume.spec.ts` 7 ca + `learning-session-resume-stem.spec.ts`
  3 ca = **10 ca** (đếm bằng `grep -c "^test("`).
- Số ca sau gộp: `learning-session-resume.spec.ts` **10 ca** (`npx playwright test
e2e/learning-session-resume.spec.ts --list` liệt kê đủ 10, không thiếu ca nào).
- `npm run typecheck` ✅.
- `npx eslint e2e/learning-session-resume.spec.ts --max-warnings 0` ✅ (không cảnh báo).
- **Không chạy được thật** `npx playwright test e2e/learning-session-resume.spec.ts` trong môi
  trường làm việc này: `npx playwright install chromium` bị chặn mạng (proxy trả 403 cho
  `cdn.playwright.dev`), không tải được trình duyệt. Cần CI hoặc máy có mạng ra ngoài chạy lại để
  xác nhận cả 10 ca xanh thật (không chỉ xanh về mặt liệt kê).

## Rủi ro

- Rủi ro thấp: chỉ di chuyển/đổi tên biến cục bộ trong file test, không đổi logic sản phẩm, không
  đổi hành vi được kiểm tra.
- Nếu CI chạy `learning-session-resume.spec.ts` mà đỏ ở phần STEM (ví dụ do khác biệt môi trường
  giữa hai file cũ mà lúc đọc code không thấy được), cần tách lại thay vì cố sửa cho xanh —
  xem lại giả định "cùng khung `LearningSession`".
