# Đặc tả GĐ2 — VIP học tự do (môn Anh), Free đi tuần tự — CHỐT CHẶN Ở SERVER

**Ngày:** 2026-09-12 · **Trạng thái:** 🟡 Đã chốt hướng, **nhưng phải chia đôi** (xem §0.2) ·
**Phụ thuộc:** GĐ1 merge trước

## 0. Một câu

**VIP** vào thẳng bất kỳ cấp CEFR nào (A1→C2); **Free** đi tuần tự A1→C2, thi đạt mới lên cấp —
và điều đó được **server cưỡng chế**, không phải chỉ ẩn/hiện ở giao diện.

## 0.0. Đã chốt (chủ dự án, 2026-09-12)

1. **Đơn vị khoá = CẤP CEFR**: A1 · A2 · B1 · B2 · C1 · C2. Không khoá mịn tới từng bài.
2. **Chốt chặn đặt ở SERVER** (phương án A), không phải chỉ trợ giúp giao diện. Nghĩa là người
   sửa localStorage hoặc gọi thẳng API **không** vượt được.

## 0.2. ⚠️ HỆ QUẢ CỦA QUYẾT ĐỊNH "CHẶN Ở SERVER" — ĐỌC TRƯỚC KHI ƯỚC LƯỢNG

Khi khảo sát sâu (2026-09-12) mới thấy việc này **lớn hơn** mô tả ban đầu. Không chỉ luật khoá
nằm ở client — **cả việc CHẤM THI cũng ở client**:

```
apps/dhcb/src/lib/cefrExam.ts:114     scoreExam(correct, total)        ← chấm điểm TRONG TRÌNH DUYỆT
apps/dhcb/src/lib/cefrExam.ts:90      saveExamAttempt(uid, level, pct) ← client tự quyết "đạt"
apps/server/.../core/progress.ts:176  cefrExams: mergeExamMap(...)     ← server CHỈ LƯU HỘ kết quả client gửi
apps/server/.../core/progress.ts:197  cefrUnlocked: mergeArrayUnion(…) ← server CHỈ LƯU HỘ mảng cấp đã mở
```

Server **có** dữ liệu `cefr_exams` nhưng **chưa bao giờ kiểm chứng** nó — client POST lên "đã đạt
C2" là server ghi nhận. Vì vậy chỉ sửa `computeLockedMap` phía client là **không** đạt yêu cầu
"chặn ở server": vẫn giả một dòng `cefrExams` là mở hết.

**Chặn thật hoàn toàn đòi hỏi chuyển việc chấm thi về server**: đề thi phải sinh/lưu ở server
(không thì server không biết đáp án đúng để chấm) → đổi luồng thi → đổi hợp đồng API → migration
lưu đề + lượt thi.

**→ Bắt buộc chia đôi, KHÔNG gộp một PR:**

| PR       | Nội dung                                                                                                                                              | Quy mô                 |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| **GĐ2a** | Server cưỡng chế **quyền mở cấp** dựa trên `cefr_exams` đã có + gói VIP. Chặn được: sửa localStorage, gọi thẳng `/api/progress` để bịa `cefrUnlocked` | Vừa                    |
| **GĐ2b** | Chuyển **chấm thi** về server (đề + đáp án + chấm ở server). Chặn nốt lỗ cuối: bịa `cefrExams`                                                        | Lớn — cần đặc tả riêng |

Đặc tả này mô tả **GĐ2a**. GĐ2b chỉ ghi phần khung ở §⑦.

**Góp ý thẳng:** GĐ2a **đã đóng phần lớn lỗ hổng thực tế**. GĐ2b nên hoãn tới khi có người học
thật và có dấu hiệu gian lận thật, vì nó đổi cả luồng làm bài của người dùng lương thiện và
**làm mất khả năng thi offline** (xem §⑦). Quyết định cuối là của chủ dự án.

## ① Phạm vi (GĐ2a)

### LÀM

1. **Server tự tính** tập cấp được mở cho mỗi user, không nhận từ client:
   - `plan === 'vip'` → mở cả 6 cấp.
   - ngược lại → A1 luôn mở; `L(n+1)` mở khi `cefr_exams[L(n)].passed === true`.
   - cộng thêm tập **grandfather** đã lưu (xem §③).
2. `/api/progress` **từ chối ghi** `cefrUnlocked` do client gửi — trường này thành **chỉ đọc từ
   server** (server trả xuống, client hiển thị).
3. Client bỏ tự tính khoá, dùng thẳng danh sách server trả về.
4. Giao diện: VIP thấy nhãn "Mở tự do (VIP)" ở cấp mà Free sẽ thấy ổ khoá.
5. Hạ VIP → Free: cấp **thi đạt thật** vẫn mở; cấp chỉ mở nhờ VIP thì khoá lại (server tính lại
   mỗi lần, không lưu "đã mở nhờ VIP" vào đâu cả).

### KHÔNG làm (để GĐ2b)

- Không chuyển chấm thi về server — `cefrExams` vẫn do client ghi (lỗ hổng còn lại, **nói rõ**).
- Không đụng điều kiện **dự thi** (`isExamEligible`: ≥70% từ vựng + 100% ngữ pháp) — vẫn ở client,
  vì nó chỉ bật/tắt nút Thi, không cấp quyền gì.
- Không đụng môn Lập trình / 4 trụ.

## ② Điểm chạm (đã đọc mã xác minh 2026-09-12)

| File                                                                 | Sửa gì                                                                                                                                                                                                                            |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/core-learner/` (file mới, vd `cefrUnlock.ts`)              | Hàm **thuần** `computeUnlockedLevels({ plan, exams, grandfathered })` — **dùng chung server + client** (client chỉ để hiển thị lạc quan, server là nguồn sự thật)                                                                 |
| `apps/server/src/api/core/progress.ts`                               | Dòng 197: **bỏ** `cefrUnlocked: mergeArrayUnion(existing, d.cefrUnlocked)`, thay bằng tính từ `cefr_exams` + `plan` + grandfather. Đọc `plan` qua `resolvePlan()`. Schema Zod (~dòng 39): `cefrUnlocked` **không nhận từ client** |
| `apps/dhcb/src/lib/cefrProgress.ts`                                  | `computeLockedMapPersisted` đổi thành đọc danh sách server trả về; **bỏ** ghi `et_cefr_unlocked_*`                                                                                                                                |
| `apps/dhcb/src/lib/progressSync.ts`                                  | Ngừng gửi `cefrUnlocked` lên server                                                                                                                                                                                               |
| `CefrLevelPage.tsx`, `EnglishHome.tsx`, `RoadmapTab.tsx`, `Home.tsx` | Nhận danh sách mở từ server; nhãn "Mở tự do (VIP)"                                                                                                                                                                                |

**Bắt buộc chạy trước khi sửa:** `npm run codemap -- impact apps/server/src/api/core/progress.ts`
— file này **vừa sửa ở PR #883** (Daily Plan completion, có transaction + row lock). Đọc kỹ phần
transaction trước khi chèn logic mới.

## ③ Hợp đồng dữ liệu

**Cần migration** để giữ grandfather: hôm nay tập "đã từng mở" nằm ở `localStorage`
(`et_cefr_unlocked_*`) và ở cột `cefr_unlocked`. Khi server ngừng tin client, phải **đóng băng tập
hiện có** làm grandfather, nếu không người dùng cũ mất quyền đã có.

```sql
-- Migration 00NN: đóng băng quyền mở cấp đã có làm grandfather.
-- cefr_unlocked hiện là mảng client tự khai; từ nay server không nhận ghi mới nữa,
-- nhưng giá trị ĐANG CÓ được giữ nguyên làm "quyền đã cấp" (chống hồi tố).
alter table public.learning_progress
  add column if not exists cefr_unlocked_grandfathered text[] default '{}';

update public.learning_progress
   set cefr_unlocked_grandfathered = coalesce(cefr_unlocked, '{}')
 where cefr_unlocked_grandfathered = '{}';
```

**Rollback:** giữ nguyên cột `cefr_unlocked` cũ (không xoá) → quay lại chỉ cần cho server nhận ghi
trở lại. Cột `_grandfathered` để lại vô hại.

⚠️ **Chạy migration TRƯỚC khi deploy mã mới.** Ngược thứ tự = người dùng cũ mất quyền trong vài
phút giữa hai bước.

## ④ Tiêu chí chấp nhận (đo được)

1. VIP chưa thi cấp nào → `/api/progress` trả `cefrUnlocked = [A1,A2,B1,B2,C1,C2]`.
2. Free chưa thi cấp nào → trả `[A1]`.
3. Free đã có `cefr_exams.A1.passed = true` → trả `[A1, A2]`.
4. **Chống giả mạo:** Free POST `/api/progress` kèm `cefrUnlocked: [A1..C2]` → server **bỏ qua**,
   lần đọc kế tiếp vẫn trả `[A1]`. **Đây là test quan trọng nhất của cả đợt.**
5. User cũ có `cefr_unlocked = [A1,A2,B1]` trước migration → sau migration vẫn mở đúng 3 cấp đó
   dù chưa thi cấp nào (grandfather).
6. VIP mở B2, hết hạn VIP → lần đọc sau B2 khoá lại; cấp thi đạt thật vẫn mở.
7. Test cũ `cefrProgress.test.ts` còn xanh, hoặc sửa **có chủ đích kèm lý do ghi trong PR**.

## ⑤ Bất biến không được phá

- **Không ai mất quyền đã có** (tiêu chí 5) — bài học chống hồi tố ghi ở `cefrProgress.ts`
  dòng 183–188.
- **Không tin client** — chính là mục đích của đợt này (CLAUDE.md mục 4.2).
- Transaction/row lock của `progress.ts` do PR #883 đặt ra **phải còn nguyên**; logic mới không
  được phá tính lũy đẳng của merge tiến độ.
- Hàm tính quyền phải **thuần**, test được không cần DB.
- **Fail-safe đúng chiều:** server lỗi đọc `plan` → coi như **Free** (khoá chặt), KHÔNG phải mở
  hết. Khác `checkAndConsumeUsage` (fail-open) — ở đây fail-open nghĩa là phát không gói VIP.

## ⑥ Quy ước dự án liên quan

- `feat(billing)` hoặc `feat(english)` → mô tả PR trỏ file này + "Approved for implementation".
- Migration → **thêm dòng vào `postgres/migrations/README.md`** (bẫy đã dính ở PR #883).
- Chạm giao diện → **Tầng 8b bắt buộc** (ảnh 1440px + 390px trước/sau).
- Nhật ký `docs/changelog/` + cập nhật `PROGRESS.md`.

## ⑦ Khung cho GĐ2b (chấm thi ở server — chưa viết đặc tả đầy đủ)

Việc phải giải khi bắt tay:

- Đề thi sinh ở đâu: server sinh và lưu, hay server giữ đáp án của bộ đề tĩnh?
- Chống xem trước đáp án: API trả đề **không kèm đáp án**.
- Chống thi lại vô hạn để dò đáp án: giới hạn lượt / thời gian chờ.
- Người đang thi dở lúc deploy thì sao?
- **Offline/PWA: hiện thi được offline — chuyển lên server là MẤT khả năng đó.** Cần quyết định
  trước, vì đây là mất tính năng thật với người dùng lương thiện để chặn người gian lận.

## Nghiệm thu

- [x] §0.0 đã chốt: đơn vị = cấp CEFR · chốt chặn ở server — chủ dự án 2026-09-12
- [ ] Đã xác nhận chia đôi GĐ2a/GĐ2b (§0.2) trước khi bắt đầu
- [ ] Đã chạy migration TRƯỚC khi deploy mã
- [ ] 7 tiêu chí §④ đạt, đặc biệt tiêu chí 4 (chống giả mạo) · [ ] Có ảnh chụp Tầng 8b
