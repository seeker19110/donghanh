# 0307 — 2026-09-14 — Đặc tả cho 3 khoản nội dung mới (F3 · F6 · F7)

**PR:** (điền khi tạo) · **Nhánh:** `claude/pensive-mccarthy-x1naux`
**Nguồn:** `docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md` — ba phát hiện 🟠/🟡 mà
báo cáo audit xếp vào nhóm "sinh nội dung mới, cần người dùng duyệt đặc tả trước".

## Việc đã làm

Soạn **ba đặc tả** theo khuôn `docs/templates/dac-ta-tinh-nang.md` (đủ 6 ô + ô nghiệm thu).
**Không sinh một dòng nội dung học nào** — đúng quy ước: nội dung mới phải có đặc tả được người
dùng duyệt trước.

| Đặc tả                        | Phát hiện | File                                                     |
| ----------------------------- | --------- | -------------------------------------------------------- |
| Câu mẫu cho vòng từ vựng CEFR | F3        | `docs/specs/2026-09-14-cau-mau-cho-vong-tu-vung-cefr.md` |
| Hoạt ảnh minh hoạ 4 môn STEM  | F6        | `docs/specs/2026-09-14-hoat-anh-minh-hoa-stem.md`        |
| Chuyên đề HSG Hoá lớp 12      | F7        | `docs/specs/2026-09-14-chuyen-de-hsg-hoa-12.md`          |

## Quyết định chính của từng đặc tả

**F3 — câu mẫu từ vựng.** Sinh **ngoại tuyến, tĩnh** (script chạy tay → file JSON commit vào
repo), KHÔNG gọi AI lúc chạy: nội dung cố định, kiểm được chất lượng trước khi lên, và app vẫn
chạy offline. 3 câu/vòng, đúng nhịp 89 vòng thủ công đang có. **Không đổi schema** —
`Circle.sentences` giữ nguyên, chỉ thêm một bản đồ `circleId → câu[]` ghép vào đúng một chỗ.
Chia 7 đợt theo bậc CEFR, đợt A1 (34 vòng) là cổng quyết định: không đạt thì dừng, mất 34 vòng
chứ không 588.

**F6 — hoạt ảnh STEM.** Tái dùng hoàn toàn `LessonAnimationSchema` + `LessonAnimation.tsx` sẵn
có, **không thêm thư viện đồ hoạ, không sửa schema, không sửa trình vẽ**. Có tiêu chí chọn bài
để chống "phủ bừa cho đủ số": bài ôn tập/danh pháp/luyện tính **để trống mới là đáp án đúng**.
Ưu tiên Vật lí (phủ thấp nhất). Cổng a11y (reduced-motion, văn bản thay thế) đã có sẵn test canh.

**F7 — HSG Hoá 12.** Bám đúng khuôn đo được từ 9 bài HSG Hoá hiện có (3 bài/chuyên đề ứng ba cấp
trường/tỉnh/quốc gia). Đề xuất 2 chuyên đề: Điện hoá và Hữu cơ 12. Thêm test bất biến ép **mỗi
lớp Hoá có đủ ba cấp** — biến F7 từ "lệch không ai biết" thành cổng chặn CI.

## Đính chính số liệu của báo cáo audit

Con số **"610/699 vòng"** của F3 là **SAI**. Đo lại hai lượt độc lập (subagent một lượt, phiên
chính một lượt) trên cùng dữ liệu: tổng **677** vòng = **588** `cefr-*` + **89** thủ công.
Bản chất phát hiện không đổi (0/588 vòng sinh tự động có câu mẫu). Đã ghi đính chính tại chỗ vào
`docs/audit/2026-09-14-chat-luong-noi-dung-cac-mon-hoc.md`.

Bài học: báo cáo audit cũng là tài liệu có thể sai — đặc tả **phải đo lại**, không chép số.

## Bằng chứng kiểm chứng

```
npx tsx (đếm vòng từ FOUNDATION)          → tong: 677 | tu dong: 588 | thu cong: 89
                                            tu dong co cau mau: 0 | thu cong co cau mau: 89
npm run codemap -- impact curriculum.ts              → 47 file bị ảnh hưởng
npm run codemap -- impact lessonAnimation.ts         → 124 file (schema)
npm run codemap -- impact core-ui/LessonAnimation.tsx→ 5 file (trình vẽ)
npm run codemap -- impact subject-chemistry/lessons.ts → 8 file
```

Ba kết quả codemap đã dán thẳng vào ô ② của từng đặc tả, thay cho ghi chú "chưa chạy được" của
lượt soạn đầu (container khi đó chưa `npm ci`).

## Còn để ngỏ — CẦN NGƯỜI DÙNG CHỐT

Cả ba đặc tả đang ở trạng thái **chờ duyệt**, chưa file nào mang cụm "Approved for
implementation". Chín câu hỏi chốt nằm ở đầu mỗi file; ba câu quan trọng nhất:

1. **HSG Hoá 12:** 2 chuyên đề (6 bài) hay 1 chuyên đề (3 bài)? Và có đổi Hữu cơ 12 sang
   Phức chất & kim loại chuyển tiếp không?
2. **Hoạt ảnh:** có chấp nhận ngưỡng phủ **chặn CI** không (sai là PR đỏ), và ai duyệt chuyên
   môn hoạt ảnh — hoạt ảnh vật lí sai còn hại hơn không có hoạt ảnh.
3. **Câu mẫu:** duyệt mẫu 10% ngưỡng ≥90% đạt có đủ chặt không.
