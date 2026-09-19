# 0373 — 2026-09-19 — Theo dõi nợ S09-1: rà lại "ba lỗi merge tinh tế" đã ghi nợ

- **Bối cảnh:** `PROGRESS.md` mục "Nợ kỹ thuật còn mở" (dòng thêm 2026-09-15, dẫn
  `docs/changelog/0334-2026-09-15-s09-1-version-idempotency-dong-bo.md`, Q6 của đặc tả
  `docs/specs/2026-09-15-learning-ux-s09-dong-bo-version-retry-xung-dot.md`) ghi ba lỗi merge
  tinh tế bị **cố ý** không sửa trong S09-1 vì "trộn đổi luật merge với thêm version làm PR
  không kiểm được". Đợt này rà lại TỪNG lỗi độc lập để xem lỗi nào sửa được cục bộ, lỗi nào
  thật sự cần đặc tả/quyết định sản phẩm riêng.

## Ba lỗi, đánh giá độc lập

### F7 — `mergeSrsMap` cho client thắng khi HOÀ `reps`, có thể lùi `due` về quá khứ — **ĐÃ SỬA**

`apps/server/src/api/_lib/progressMerge.ts:24` (trước sửa): khi `reps` của 2 bên bằng nhau,
điều kiện `bReps >= aReps` luôn đúng nên bản **client** (`b`) thắng vô điều kiện, kể cả khi
`due` (mốc lịch ôn kế tiếp, epoch ms do CLIENT SINH khi tính SRS ở `apps/dhcb/src/lib/srs.ts`)
của client CŨ HƠN bản server đang có. Ca thật: máy A ôn thẻ, `reps` tăng, `due` đẩy xa; máy B
đồng bộ CHẬM gửi lên bản `reps` bằng nhau nhưng `due` cũ hơn → merge cũ ghi đè, lùi lịch ôn về
quá khứ — đúng lỗi "mất tiến độ" mà cả file `progressMerge.ts` được viết ra để chặn.

**Vì sao sửa được cục bộ, không cần đặc tả mới:** `due` là số epoch-ms client tự tính (KHÔNG
phải đồng hồ hệ thống của 2 thiết bị — khác hẳn F8 dưới đây), cùng một thang đo với `reps`
trong CÙNG một field SRS; giữ bản có `due` lớn hơn khi hoà `reps` là hệ luận trực tiếp của luật
đã có sẵn trong file ("tiến độ chỉ tăng, không giảm") — không đổi hợp đồng API, không đổi hành
vi khi `reps` KHÁC nhau (đường đi phổ biến), chỉ khép lại đúng ca biên hiếm (hoà `reps`).

**Sửa:** hoà `reps` → so thêm `due`, giữ bản có `due` lớn hơn (thiếu `due` số hợp lệ coi như
thua, giữ nguyên hành vi cũ cho ca dữ liệu sai dạng). Test canh mới (`progressMerge.test.ts`,
describe `mergeSrsMap`, 4 ca thêm): hoà reps + due client cũ hơn → server thắng; hoà reps + due
client mới hơn/bằng → client thắng (không đổi hành vi có lợi); thiếu `due` một/cả hai bên →
không throw, coi như thua.

### F6 — `hard` ghi đè theo THỨ TỰ ĐẾN của request, không theo mốc sửa thật — **GIỮ NỢ**

`apps/server/src/api/core/progress.ts` (comment ở `progressMerge.ts` dòng 9–14): `hard` là
nhãn lọc hiển thị "từ khó", được quyết định GIỮ ghi đè (không union) từ 2026-08-13 — nhưng ghi
đè theo **request nào tới server sau cùng**, không theo mốc người dùng thực sự bấm đổi nhãn.
Hai tab/2 thiết bị sửa gần như đồng thời → thiết bị có độ trễ mạng thấp hơn "thắng" dù bấm
trước.

**Vì sao KHÔNG tự sửa trong đợt này:** sau S09-1, mỗi dòng `english.learning_progress` đã có
`client_updated_at` (migration `0083`) — đủ dữ liệu để so theo mốc sửa thật thay vì thứ tự
đến. Nhưng đây là **thay đổi luật merge** (đổi từ "ghi đè theo request cuối" sang "ghi đè theo
mốc sửa client mới nhất"), đúng loại rủi ro mà Q6 của đặc tả S09 đã nêu tên: "trộn đổi luật
merge với thêm version làm PR không kiểm được". Cụ thể còn hở: `client_updated_at` do CLIENT
gửi lên — nếu dùng làm trọng tài duy nhất thì lại có nguy cơ dính đúng lớp lỗi của F8 (đồng hồ
2 thiết bị lệch nhau); cần quyết định xem có cần mốc SERVER-SIDE riêng cho từng trường hay
dùng `version` (đơn điệu, do SQL tăng, không phụ thuộc đồng hồ client) làm trọng tài thay
`client_updated_at`. Đây đúng là quyết định sản phẩm/kiến trúc cần một đặc tả riêng (S09 đã tự
nhận trong `docs/changelog/0334-*.md`: "đủ dữ liệu cho một slice riêng sửa theo mốc
server-side") — không tự chế đặc tả (CLAUDE.md mục 5 + 12).

**Đề xuất hướng xử lý (không thi hành ở đây):** viết đặc tả nhỏ (theo khuôn
`docs/templates/dac-ta-tinh-nang.md`) cho "trọng tài ghi đè theo trường" — chốt trước ít nhất 2
câu hỏi: (1) `hard` dùng `version` của CÙNG request nào lớn hơn (đã có sẵn, đơn điệu, miễn
nhiễm lệch đồng hồ) thay vì `client_updated_at`? (2) Có cần áp dụng cùng cách cho `placement`/
`weeklyGoal` (F8 dưới đây) trong cùng đặc tả, vì cùng một họ lỗi?

### F8 — `mergeByTimestamp` so chuỗi ISO do CLIENT sinh, lệch đồng hồ 2 thiết bị quyết định bên thắng — **GIỮ NỢ**

`apps/server/src/api/_lib/progressMerge.ts` (`mergeByTimestamp`, dùng cho `placement` và
`weeklyGoal`): so trực tiếp 2 chuỗi ISO (`lastAt`/`updatedAt`) do TỪNG THIẾT BỊ tự sinh bằng
đồng hồ hệ thống của nó. Thiết bị có đồng hồ chạy nhanh hơn (sai lệch NTP, múi giờ cấu hình
sai, người dùng chỉnh tay đồng hồ máy…) luôn "thắng" merge dù thao tác của nó xảy ra TRƯỚC về
mặt thời gian thực — ngược đúng ý định hàm này ("giữ bản MỚI HƠN").

**Vì sao KHÔNG tự sửa trong đợt này:** khác F7 (số client tự tính nhưng đo TƯƠNG ĐỐI trong
cùng một field, không phải mốc đồng hồ hệ thống), lỗi F8 nằm ở chính TRỤC ĐO — sửa đúng cần
thay trục "thời gian do client tự khai" bằng một trục không phụ thuộc đồng hồ client, ví dụ:
(a) dùng thời điểm SERVER nhận request thay `lastAt`/`updatedAt` của client, hoặc (b) dùng
`version` (đã đơn điệu từ S09-1) làm trọng tài thay timestamp. Cả 2 hướng đều đổi Ý NGHĨA của
`lastAt`/`updatedAt` đang lưu (hiện là "client tự nói lúc nào" — đổi rủi ro phá vỡ chỗ khác
đang đọc field này để hiển thị, ví dụ màn hình đặt mục tiêu tuần đang hiển thị "cập nhật lúc
…"). Đây là quyết định ảnh hưởng RỘNG (đổi ngữ nghĩa 1 field lưu DB dùng cho hiển thị + merge),
đúng loại việc phải dừng và hỏi theo CLAUDE.md mục 12 ("mâu thuẫn với thiết kế hiện có… nhiều
giải pháp đánh đổi khác nhau đáng kể"), không tự quyết trong phạm vi một PR sửa lỗi cục bộ.

**Đề xuất hướng xử lý (không thi hành ở đây):** gộp chung vào đặc tả đề xuất ở F6 phía trên —
"trọng tài merge server-side dùng chung cho `hard`/`placement`/`weeklyGoal`" — vì cả ba đều
thuộc cùng họ lỗi (tin tưởng dữ liệu do CLIENT tự khai làm trọng tài quyết định thắng-thua), và
nền tảng kỹ thuật (`version` đơn điệu, `client_updated_at` để đối chiếu) đã có sẵn từ S09-1.

## Bằng chứng kiểm chứng

```
npm ci                 ✅ (lockfile khớp trong worktree phiên này)
npm run typecheck       ✅ 0 lỗi
npm run lint             ✅ 0 cảnh báo
npm run format           ✅ (mọi file unchanged)
npm run build            ✅ (client + hub + server đều build xong, exit 0)
npx vitest run apps/server/src/api/_lib/progressMerge.test.ts apps/server/src/api/core/progress.test.ts
                          ✅ 58/58 pass (2 file)
npm test                 ✅ <điền số liệu thật ở PR — xem log CI/local>
```

## Kết luận

Một trong ba lỗi (F7) là lỗi cục bộ, không đổi hợp đồng, sửa kèm test canh trong đợt này. Hai
lỗi còn lại (F6, F8) đúng là loại cần quyết định sản phẩm/đặc tả riêng như Q6 đã dự đoán —
**vẫn giữ nợ**, có hướng xử lý đề xuất cụ thể ở trên để đợt sau viết đặc tả.
