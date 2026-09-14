# 0299 — 2026-09-14 — Sửa cổng tự chấm xanh giả và 9 đáp án Vật lí sai hệ quy chiếu

**PR:** (đang mở) · **Nhánh:** `claude/audit-course-quality-vj5pcu`
**Báo cáo gốc:** `docs/audit/2026-09-14-tinh-chinh-xac-cong-thuc-va-ket-qua.md` (mục 9 = cách sửa)
**Thứ tự người dùng chốt:** sửa CỔNG trước, sửa DỮ LIỆU sau — để cổng tự chứng minh nó hết mù.

## Việc đã làm

### 1. Gom cổng tự chấm về một chỗ: `packages/core-grading/selfGrade.ts`

Bốn môn STEM mỗi môn tự viết lấy cổng này và đã lệch nhau ba kiểu: Hoá đúng · Toán/Lí **mù** ·
Sinh **không có**. Nay cả bốn gọi chung `timLoiTuCham()`.

Làm xong mới lộ ra điều báo cáo gốc chưa thấy: **cách sửa "nạp thẳng `${value} ${unit}`" cũng
SAI** — nó mù theo chiều ngược lại, báo đỏ oan bài khai chuẩn SI (`ly10-c4-b27`). Không chuỗi nào
suy được từ riêng `value` mà phân biệt được hai ca. Cổng buộc phải có **nguồn đối chiếu độc lập
với `value`**: lời giải `explain`, do tác giả viết tay bằng đơn vị hiển thị. Cổng mới hai lớp:

1. **Tự chấm** — đáp án suy từ `value` theo hợp đồng SI phải được engine chấm đúng.
2. **Đối chiếu độc lập** — với đơn vị lệch SI, số hiển thị suy từ `value` phải THẬT SỰ có trong
   `explain`. Khai nhầm hệ quy chiếu thì lệch đúng bằng hệ số đổi đơn vị nên trượt lớp này.

**Bằng chứng cổng hết mù:** chạy cổng mới trên dữ liệu CHƯA sửa → đỏ **đúng 9 câu**, và **không**
báo oan `ly10-c4-b27`.

### 2. Sửa 9 giá trị Vật lí — không chôn số ma thuật

Thêm `donViHienThi(value, unit)` vào `packages/core-grading/units.ts` để tác giả viết đúng con số
mình nghĩ, còn máy lo phần quy đổi:

```ts
value: donViHienThi(0.03038, 'amu'),   // thay cho value: 0.03038
```

Chín câu: `ly11-c1-b7` (cm) · `ly12-c1-b7` (°C) · `ly12-c2-b9`, `ly12-c2-b11` (atm, lít) ·
`ly12-c4-b21` (amu) · `ly12-c4-b23` (%) · `ly12-c4-b25` (ngày⁻¹, MeV). `ly10-c4-b27` cũng chuyển
sang `donViHienThi(80, '%')` — **giá trị y hệt cũ (0.8)**, nhưng nay tự nói ra nó nghĩa là 80 %,
để lần sau không ai "sửa" nhầm nó thành sai.

### 3. Bù cổng tự chấm cho môn Sinh

Môn duy nhất chưa từng có, dù `docs/specs/2026-09-13-hoan-thien-4-mon-stem.md` mục 3.1 lấy chính
cổng này làm biện pháp thay khâu duyệt của người.

### 4. `hoa10-c2-b7#q1`

Đề đòi "chỉ nhập số" mà lời giải chỉ có số La Mã. Nay ghi "hoá trị VI, tức nhập 6".

## Bằng chứng kiểm chứng

```
Build ✅ | Typecheck ✅ (xoá sạch dist trước khi chạy, tái hiện checkout sạch của CI)
Lint ✅ 0 cảnh báo | Format ✅
npm run test:coverage → 590 file, 12304/12304 xanh
size-limit → JS 135,09/140 kB · CSS 18,11/20 kB
```

Chạy lại chính script audit đã phát hiện lỗi: cả 10 câu có đơn vị lệch SI nay trả `CORRECT` cho
đúng chuỗi mà lời giải của bài viết ra.

## Quyết định

- `value` vẫn giữ hợp đồng SI (không đổi `types.ts`) — chỉ thêm hàm giúp khai cho đúng.
- Không đổi nội dung sư phạm của bài nào; chỉ đổi cách LƯU con số và câu chữ một lời giải.

## Cảnh báo phát sinh (KHÔNG do đợt này)

Ngân sách JS ở **135,09/140 kB = 96,5%**, vượt ngưỡng cảnh báo 95% của Tầng 1
`docs/framework/QUY-TRINH-AUDIT.md`. Đo ở HEAD trước khi sửa cũng 135,1 kB nên đợt này trung tính.
Nợ số 6 `PROGRESS.md` ghi "ngân sách BUNDLE nay rộng" — mô tả đó ĐÃ LỖI THỜI, chỉ còn 4,9 kB.
