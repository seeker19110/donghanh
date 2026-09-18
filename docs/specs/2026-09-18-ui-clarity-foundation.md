# Feature spec: Nền tảng rõ ràng cho đợt tái thiết kế UI/UX

| Thuộc tính   | Giá trị                                                      |
| ------------ | ------------------------------------------------------------ |
| Issue        | Chưa tạo                                                     |
| Spec owner   | Agent chính Đồng Hành                                        |
| Trạng thái   | **Approved for implementation — chỉ lát UX-R1**              |
| Người duyệt  | Chủ dự án — yêu cầu bắt đầu tái thiết kế và chọn phương án A |
| Ngày duyệt   | 2026-09-18                                                   |
| Lần cập nhật | 2026-09-18                                                   |

> Quyết định A: sản phẩm tiếp tục có đúng ba theme `dark-blue`, `blue-sky`, `kid`. Không phục hồi
> `pink` hoặc `vibrant`; tài liệu và cổng kiểm thử mới phải phản ánh nguồn sự thật hiện hành này.

## 1. Tóm tắt quyết định

Tái thiết kế theo hướng **clarity first**: sửa lỗi chặn thao tác và trạng thái thất bại trước, sau
đó giảm tải nhận thức ở Trang chủ/Tiến độ và cuối cùng hợp nhất ngôn ngữ điều hướng. Không thêm
khối nội dung mới chỉ để giao diện trông phong phú hơn. Mỗi lát là một PR độc lập, có ảnh thật và
cổng accessibility.

Lát được duyệt để triển khai ngay là **UX-R1 — Progress reliability & touch foundation**. Các lát
UX-R2–UX-R4 cần đặc tả/ảnh trước–sau riêng trước khi sửa source.

## 2. Vấn đề, người dùng và bằng chứng

- Persona/job-to-be-done: người học cần biết việc quan trọng nhất, thao tác được bằng chạm/bàn phím
  và phục hồi được khi thiết bị hoặc mạng lỗi.
- Ảnh thật trên `main@2c9025a6`: Trang chủ thành viên cao 2.027px ở 390px; `/tien-do` cao 3.421px
  ở 390px. Hai màn có quá nhiều khối mang trọng lượng thị giác tương đương.
- Audit code tìm thấy các nút dưới chuẩn 44px, `localStorage` có thể ném lỗi làm vỡ QuickActions,
  và luồng bật/tắt nhắc học thiếu `catch/finally` nên có thể kẹt loading.
- Chuỗi redesign cũ đã merge 12/15 lát. P2-10 thêm `ProgressStory` nhưng không sửa lỗi nền và có
  thể tăng mật độ; vì vậy tạm hoãn lệnh 13 cho tới sau UX-R3.

## 3. Nghiên cứu hiện trạng

### Code và luồng hiện tại

- `/tien-do`: `pages/core/Dashboard.tsx` lắp `ActivityCalendarCard`, `QuickActions` và nhiều khối
  thống kê liên tiếp.
- `ActivityCalendarCard` dùng roving tabindex đúng mẫu bàn phím nhưng ô tương tác mobile không có
  chiều cao tối thiểu 44px. Bảy ô 44px cộng khoảng cách rộng hơn vùng card ở 320/390px, nên lưới
  phải cuộn **bên trong card**, không được làm tràn cả trang. Header thứ và lưới ô ngày nằm trong
  cùng scroll container, dùng cùng bảy cột `w-11` và cùng `gap-1.5` để không lệch nhãn.
- `QuickActions` đọc/ghi `localStorage` trực tiếp và không giữ error state khi thao tác Web Push.
- Design system hiện hành: `PageShell`, `TwoPane`, token trong `index.css`/`theme.css`; không tạo
  `DESIGN.md` hay bộ token thứ hai.

### Bằng chứng audit

| Lỗi                                        | Ở đâu                      | Mức      | Sửa                                                                  |
| ------------------------------------------ | -------------------------- | -------- | -------------------------------------------------------------------- |
| Ô ngày mobile nhỏ hơn 44px                 | `ActivityCalendarCard.tsx` | critical | Lưới `w-max`, ô `w-11 h-11`, cuộn nội bộ; focus tự cuộn vào tầm nhìn |
| CTA đổi mục tiêu nhỏ hơn 44px              | `Dashboard.tsx`            | critical | Dùng vùng chạm 44px và focus-visible tức thì                         |
| Storage bị chặn có thể làm vỡ QuickActions | `QuickActions.tsx`         | critical | Helper đọc/ghi có fallback, không throw                              |
| Push thất bại có thể kẹt loading           | `QuickActions.tsx`         | critical | `try/catch/finally`, giữ state cũ và cung cấp retry                  |

## 4. Phương án và quyết định

| Phương án            | Lợi ích                                          | Chi phí/rủi ro                                  | Kết luận           |
| -------------------- | ------------------------------------------------ | ----------------------------------------------- | ------------------ |
| Tiếp tục P2-10 ngay  | Theo đúng DAG cũ                                 | Thêm khối vào màn đang rối; không đóng critical | Hoãn               |
| A — giữ 3 theme      | Khớp code thật; ma trận kiểm thử nhỏ và đáng tin | Bỏ hai biến thể cũ                              | **Đã chọn**        |
| B — phục hồi 5 theme | Nhiều lựa chọn thị giác                          | Tăng 67% ma trận ảnh/a11y và nguy cơ hồi quy    | Không chọn         |
| UX-R1 trước          | Giảm lỗi thao tác và tạo nền tin cậy             | Chưa phải đợt thay đổi thị giác lớn             | **Thi hành trước** |

## 5. Outcome và guardrails

- UX-R1 target: 0 control mobile dưới 44px trong vùng chạm; storage/push failure không crash hoặc
  kẹt loading; người dùng thấy thông báo lỗi và thử lại được.
- Guardrails: không đổi API, quota, auth, payment, route, schema hoặc authority; không gọi provider
  trả phí; không nới cổng accessibility/bundle.
- Ba theme bắt buộc: `dark-blue`, `blue-sky`, `kid`.
- Rollback: revert PR UX-R1; dữ liệu và hợp đồng server không đổi.

## 6. Scope và non-goals

### In scope — UX-R1

- `ActivityCalendarCard`: vùng chạm mobile, bàn phím và chi tiết ngày giữ nguyên.
- `QuickActions`: storage fallback, push error/retry, loading luôn được giải phóng.
- `pushNotif.ts`: kết quả có kiểu phân biệt `success`, `denied`, `failed`, `partial`; không trả
  boolean mơ hồ cho component.
- CTA đổi mục tiêu trên Dashboard đạt 44px và focus-visible.
- Dọn comment runtime lỗi thời về 5 theme trong `theme.css`, `ThemeToggle.tsx` và các file UX-R1
  chạm tới; không quét cơ học toàn repository.
- Unit/component tests, full E2E a11y và ảnh 320/390/1440 trên ba theme.

### Không làm trong UX-R1

- Không đổi taxonomy điều hướng hoặc header.
- Không sắp lại toàn bộ Dashboard; việc này là UX-R3.
- Không thêm `ProgressStory`, AI, telemetry mới, migration hoặc dependency.
- Không phục hồi hai theme cũ.

## 7. User journeys và trạng thái

1. Người dùng mở `/tien-do`, chạm hoặc dùng phím mũi tên chọn ngày; phần chi tiết cập nhật. Trên
   mobile, lưới cuộn ngang bên trong card và ô được focus tự cuộn vào tầm nhìn.
2. Khi đọc storage bị chặn, giờ nhắc mặc định là 20:00. Khi ghi bị chặn sau khi chọn 18:00, hệ
   thống vẫn gửi 18:00 cho phiên đăng ký hiện tại, báo không thể lưu; reload quay về 20:00.
3. Khi đăng ký bị từ chối quyền, `pushOn=false` và UI hướng dẫn bật quyền trong cài đặt trình
   duyệt, không hiện Retry vô ích. Khi thất bại có thể phục hồi, UI cho Retry. Khi browser đã
   subscribe nhưng server thất bại, kết quả `partial`, UI nói nhắc học chưa bật hoàn tất và cho
   Retry.
4. Khi hủy, server xác nhận trước browser. Server fail giữ `pushOn=true`; server đã tắt nhưng
   browser unsubscribe fail thì `pushOn=false` kèm cảnh báo partial vì server không còn gửi.
5. Loading vô hiệu hóa đúng control, không làm mất focus, và luôn kết thúc trong `finally`.

## 8. Yêu cầu

### Functional requirements

- FR-1: mọi thao tác đọc/ghi giờ nhắc dùng helper không-throw.
- FR-2: đăng ký/hủy push trả đúng discriminated union sau; `denied` có hướng dẫn cài đặt, chỉ
  `failed|partial` hỗ trợ Retry.

```ts
type PushActionResult =
  | { status: 'success' }
  | { status: 'denied' }
  | { status: 'failed' }
  | { status: 'partial'; serverUpdated: boolean; browserUpdated: boolean }
```

- FR-3: ô ngày mobile và CTA đổi mục tiêu có vùng chạm ít nhất 44×44px.
- FR-4: roving tabindex, `aria-selected`, live region và chi tiết ngày không hồi quy.
- FR-5: `userId` đến sau lần render đầu phải nạp lại giờ theo đúng key người dùng.

### Non-functional requirements

- NFR-1: không ghi token, PII hoặc lỗi nhạy cảm vào UI/log.
- NFR-2: nội dung đạt AAA; control đạt AA; focus ring tức thì; reduced motion giữ nguyên.
- NFR-3: không animate width/height; không thêm `transition-all`.
- NFR-4: không dependency mới; `npm run budget` không vượt hard cap và PR ghi delta kB.

## 9. Acceptance criteria

- AC-1 — Khi `localStorage.getItem` ném `SecurityError`, QuickActions vẫn render với 20:00; khi
  user ID đổi từ rỗng sang ID thật, giờ của đúng người dùng được nạp lại.
- AC-2 — Khi `localStorage.setItem` ném sau khi chọn 18:00, subscribe vẫn nhận 18:00, UI báo không
  lưu được trên thiết bị và reload dùng fallback 20:00.
- AC-3 — Subscribe/unsubscribe phủ đủ `success`, `denied`, `failed`, `partial`; loading luôn kết
  thúc, `pushOn` tuân theo state machine §7; `denied` hướng dẫn mở cài đặt, chỉ `failed|partial`
  có Retry.
- AC-4 — Ở viewport 320px và 390px, ô ngày cùng CTA đổi mục tiêu có bounding box ít nhất 44×44px;
  lưới chỉ cuộn trong card, `documentElement.scrollWidth === innerWidth`.
- AC-5 — Arrow/Home/End trong calendar, một điểm Tab, live detail và desktop heatmap không hồi quy;
  ô nhận focus gọi `scrollIntoView({ block: 'nearest', inline: 'nearest' })`; sau khi cuộn, nhãn
  T2…CN vẫn thẳng cột với ô ngày.
- AC-6 — a11y AA/AAA xanh trên `/tien-do` ở ba theme; ảnh 320/390/1440 gồm data + push error,
  lưu ngoài repo và ghi manifest trong bằng chứng PR.
- AC-7 — Node 22: build, typecheck, lint, format, unit, `npm run budget`, targeted E2E và toàn bộ
  `npm run test:e2e` xanh.

## 10. UX, nội dung và accessibility

- Error copy nói việc gì không thực hiện được và mời thử lại; không lộ chi tiết kỹ thuật.
- `failed|partial` dùng `role="alert"`; Retry là button ≥44px. `denied` dùng status/alert kèm hướng
  dẫn bật quyền trong cài đặt trình duyệt, không giả làm lỗi có thể Retry.
- Mobile calendar dùng một `overflow-x-auto` bọc cả header thứ và cell grid; cả hai cùng bảy cột
  `w-11`, cùng `gap-1.5`, lưới `w-max`, không tràn document. Desktop giữ heatmap 16px hiện hành.
- Không dùng toast thành công cho trạng thái đã thấy trực tiếp.

## 11. Kiến trúc, API và data contract

- Không đổi API/data contract.
- Helper storage nằm cạnh QuickActions hoặc trong utility hiện có nếu impact map chứng minh tái sử
  dụng; không mở abstraction toàn cục cho một call site.
- `pushNotif.ts` đổi additive-internal từ boolean sang `PushActionResult`; hiện chỉ QuickActions
  gọi hai hàm nên không đổi API công khai. `partial` cho biết phía server/browser nào đã xong.

## 12. Security, privacy và abuse cases

- Không thay auth header, subscription payload hoặc permission model.
- Không lưu thêm dữ liệu; giờ nhắc hiện hành vẫn là số nguyên 0–23 theo user ID.
- Không hiển thị exception/message thô từ trình duyệt hoặc server.

## 13. Telemetry và vận hành

Không thêm telemetry trong UX-R1. CI và ảnh trước/sau là bằng chứng. Production verification chỉ
kiểm tra thủ công hành vi permission denied/offline; không dùng secret hoặc provider trả phí.

## 14. Test plan

| Lớp            | Trường hợp                                                         | Bằng chứng                |
| -------------- | ------------------------------------------------------------------ | ------------------------- |
| Unit/component | thêm test storage, typed push result, retry, finally, focus scroll | Vitest                    |
| Accessibility  | touch target, keyboard grid, role/label/live region                | Playwright + axe          |
| Visual         | `/tien-do` 320/390/1440 × ba theme                                 | ảnh ngoài repo + manifest |
| Regression     | regression hiện có + test component mới                            | targeted + full E2E       |

## 15. Kế hoạch triển khai

1. UX-R1 — reliability + touch foundation (**được duyệt**).
2. UX-R2 — giảm nhiễu Trang chủ; đặc tả/ảnh riêng, chưa được duyệt source.
3. UX-R3 — progressive disclosure cho Tiến độ; quyết định lại P2-10, chưa được duyệt source.
4. UX-R4 — taxonomy/header/navigation nhất quán, chưa được duyệt source.

## 16. Rollout và rollback

UX-R1 tương thích ngược, không flag/migration. Merge khi `quality` và `e2e` xanh; rollback bằng
revert một PR. Không deploy thủ công trong scope này.

## 17. Rủi ro và giả định

| Rủi ro/giả định               | Xác suất   | Ảnh hưởng  | Giảm thiểu/xác minh                   | Owner |
| ----------------------------- | ---------- | ---------- | ------------------------------------- | ----- |
| Ô 44px làm calendar quá cao   | Trung bình | Trung bình | Ảnh 320/390; chỉ áp mobile            | UI    |
| Browser khác nhau về Web Push | Trung bình | Cao        | Mock boundary; manual denied/offline  | Web   |
| Error copy thêm CLS           | Thấp       | Trung bình | Chừa `min-height`; ảnh trạng thái lỗi | UI    |

## 18. Câu hỏi mở và quyết định

| Mục      | Owner          | Hạn         | Quyết định                                    |
| -------- | -------------- | ----------- | --------------------------------------------- |
| Số theme | Chủ dự án      | 2026-09-18  | A — giữ đúng ba theme hiện hành               |
| P2-10    | Chủ dự án + UX | Trước UX-R3 | Tạm hoãn; chỉ giữ nếu thay vì làm tăng mật độ |

Không còn câu hỏi blocking cho UX-R1.

## 19. Phê duyệt

- [x] Product outcome và scope UX-R1
- [x] UX/accessibility
- [x] Architecture/API/data
- [x] Security/privacy/cost
- [x] Test/telemetry/rollout/rollback
- [x] Mọi câu hỏi blocking của UX-R1 đã đóng

**Kết luận:** **Approved for implementation — chỉ UX-R1**

**Người duyệt:** Chủ dự án  
**Ngày:** 2026-09-18  
**Ghi chú:** “Bắt đầu tái thiết kế” và chọn phương án A; các lát sau vẫn phải duyệt theo spec riêng.
