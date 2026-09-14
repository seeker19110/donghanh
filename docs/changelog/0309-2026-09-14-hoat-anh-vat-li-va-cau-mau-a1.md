# 0309 — 2026-09-14 — Hoạt ảnh Vật lí (F6 đợt 1) + câu mẫu từ vựng A1 (F3 đợt 0)

**PR:** (điền khi tạo) · **Nhánh:** `claude/pensive-mccarthy-x1naux`
**Đặc tả:** `docs/specs/2026-09-14-hoat-anh-minh-hoa-stem.md` ·
`docs/specs/2026-09-14-cau-mau-cho-vong-tu-vung-cefr.md`

Hai đợt việc đi chung MỘT PR vì nhánh phát triển của phiên này là cố định; chúng chạm hai vùng
mã tách biệt (`packages/subject-physics` + `packages/core-contracts` và `apps/dhcb/src/data`),
không có điểm giao nào.

## Việc đã làm

### F6 đợt 1 — hoạt ảnh minh hoạ môn Vật lí

Thêm hoạt ảnh cho **22 bài** (12 bài lớp 12, 10 bài lớp 10), tái dùng **hoàn toàn**
`LessonAnimationSchema` + `LessonAnimation.tsx` sẵn có: không thêm thư viện, không sửa schema,
không sửa trình vẽ.

|                     | trước         | sau               |
| ------------------- | ------------- | ----------------- |
| Vật lí (bài `core`) | 14/85 (16,5%) | **36/85 (42,4%)** |
| — lớp 10            | 6/34 (17,6%)  | 16/34 (47,1%)     |
| — lớp 12            | 2/25 (8,0%)   | **14/25 (56,0%)** |

Chọn bài theo tiêu chí ô ③ của đặc tả (chuyển động/biến thiên · quan hệ hình học vô hình · quá
trình nhiều bước · đồ thị theo tham số). Bài ôn tập và bài luyện tính **cố ý để trống** — với
loại bài đó, không có hoạt ảnh mới là đáp án đúng.

Hai cổng mới chặn CI:

- **Ratchet độ phủ** trong `packages/subject-physics/lessons.test.ts`:
  `TOI_THIEU_PHU_HOAT_ANH = 36`, `TOI_THIEU_PHU_HOAT_ANH_LOP_12 = 14` — đặt **đúng bằng mức đạt
  được**, không làm tròn lên để khỏi tạo nợ. Hằng số chỉ được TĂNG.
- **Chất lượng hoạt ảnh** — gói mới `packages/core-contracts/animationQuality.ts`: mô tả ≥ 20 ký
  tự, mô tả không được chép lại tiêu đề, hoạt ảnh `loop` không lời dẫn thì mô tả phải ≥ 80 ký tự.
  Ba luật đều xuất phát từ một cách hỏng thật: người dùng trình đọc màn hình và người bật
  `prefers-reduced-motion` chỉ còn phần mô tả để hiểu hình động.

### F3 đợt 0 — câu mẫu cho vòng từ vựng bậc A1

**34 vòng A1 × 3 câu = 102 câu song ngữ**, khôi phục lời hứa sư phạm ghi ở đầu `curriculum.ts`
("học từ xong là ráp được câu ngay"). Tổng vòng có câu mẫu: **89 → 123/677**.

**Viết tay, KHÔNG gọi AI** — container thi hành không có khoá AI (`.env` không tồn tại, đã kiểm
chứng). Ghi trung thực vào dữ liệu: `generatedWith.model = "viet-tay (khong goi AI…)"`. Các bậc
A2–C2 để lại đợt sau; test chỉ ép các bậc trong `levelsDone` nên thêm bậc mới không phải sửa test.

**Không đổi schema:** `Circle.sentences` giữ nguyên; chỉ thêm một bản đồ `circleId → câu[]` ghép
vào đúng MỘT chỗ khi dựng `FOUNDATION`. Căn cứ: codemap cho thấy `curriculum.ts` có **47 file**
phụ thuộc — bề mặt rủi ro phải giữ nhỏ nhất có thể.

10 bất biến chặn CI, trong đó hai cái then chốt: **golden hash khoá 89 vòng thủ công** (không
được đụng) và **`public/data/curriculum.json` phải đồng bộ từng câu** với nguồn.

## Bằng chứng kiểm chứng

```
npx vitest run packages/subject-physics packages/core-contracts apps/dhcb/src/data
  + sentenceQuality.test.ts                → 80 file / 1339 test XANH
npm run build                              → exit 0
npm run budget  → Initial JS 126,02/140 kB (trước đợt 126,07 — KHÔNG tăng)
                  Initial CSS 18,11/20 kB · coverage 94,55/90,61/94,80/94,96 đều trên ngưỡng
npm run gen:stem-lesson-index              → physics hasAnimation 14 → 36
npx tsx scripts/archive/gen-curriculum-json.ts → 677 vòng, 11 917 từ

Đo lại độc lập ở phiên chính (không tin báo cáo của worker):
  A1: 34/34 vòng có câu mẫu · 102 câu · 102/102 có bản dịch tiếng Việt
  Tổng vòng có câu mẫu: 123/677
  Vật lí core có hoạt ảnh: 36/85 · bài nhánh HSG có hoạt ảnh: 0 (đúng — không đụng HSG)
```

**Tầng 8b — đã NHÌN trang thật** (bắt buộc với đợt chạm giao diện): chụp
`/mon-hoc/physics/bai-hoc/ly12-c3-b13--luc-tu-cam-ung-tu` ở **1440px và 390px** qua Playwright
với `mockLogin`. Hoạt ảnh hiện đúng: đường sức (dấu ×), vectơ I, vectơ F vuông góc, công thức,
chú thích, phần mô tả văn bản tương đương và nút "Tạm dừng hoạt ảnh". Banner "Bản nháp — chưa
duyệt chuyên môn" vẫn hiển thị đúng.

## Cả hai đợt đều viết TEST TRƯỚC, chứng kiến ĐỎ rồi mới làm nội dung

```
Hoạt ảnh: "Độ phủ hoạt ảnh Vật lí tụt: 14/85 bài core, ngưỡng là 36" (expected 14 >= 36)
          "Vật lí 12 chỉ còn 2/25 bài có hoạt ảnh, ngưỡng là 14"
Câu mẫu:  PHAI_DU_CAU_MAU — 34 vòng A1 có 0 câu
          KHONG_LUI_DO_PHU — expected 89 to be greater than or equal to 123
```

Đáng chú ý: sau khi đổ 102 câu vào thì **`PUBLIC_JSON_DONG_BO` vẫn đỏ** — đúng cái bẫy lớn nhất
của đợt việc (app đọc `public/data/curriculum.json`, không đọc thẳng nguồn). Không cổng nào khác
bắt được nó. Chạy lại script sinh JSON mới xanh.

## Phát hiện phụ, KHÔNG sửa trong đợt này

1. **Nhãn trong hoạt ảnh khó đọc ở 390px.** Nhìn ảnh chụp thì nhãn dài (size 11–12 trong viewBox 440) co lại rất nhỏ trên điện thoại. Đã kiểm: đây **KHÔNG phải lỗi mới** — bài `ly11-c2-b8`
   (lớp 11, đợt này không đụng) đã có nhãn 48 ký tự ở size 12 từ trước. Sửa tận gốc phải đụng
   `LessonAnimation.tsx`, mà đặc tả cấm. Đo được: **29/150 nhãn chữ dài hơn 24 ký tự**. Cần một
   đợt riêng, xem "Nợ kỹ thuật".
2. **Test flaky có sẵn:** `apps/dhcb/src/lib/programmingSrs.test.ts > "limit cắt đúng số thẻ cho
một phiên ôn"` đỏ khi chạy cả `apps/dhcb/src`, nhưng chạy riêng file thì 9/9 xanh. Nó dùng
   `vi.setSystemTime` và không liên quan gì tới đợt này. Đã ghi vào nợ kỹ thuật.

## Còn để ngỏ

- **F3 còn 6 đợt**: A2 (65 vòng) · B1 (120) · B2 (140) · C1 (82) · C2 (147) — 554 vòng, cần khoá
  AI hoặc nhiều đợt viết tay nữa.
- **F6 còn 3 đợt**: Lí lớp 11 (đang 23,1%), rồi Hoá/Sinh, rồi Toán. Gói `animationQuality` mới
  hiện chỉ nối vào test môn Lí; các môn khác dữ liệu đã sạch sẵn nên đợt sau chỉ thêm một dòng gọi.
