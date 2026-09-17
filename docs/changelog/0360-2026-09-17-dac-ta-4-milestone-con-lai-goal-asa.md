# 0360 — 2026-09-17 — Viết nốt đặc tả cho 4 milestone còn BACKLOG của goal Kiến trúc sư phần mềm & AI

**PR:** (điền khi tạo) · **Loại:** docs — chỉ tài liệu, không đổi source, không đổi runtime.

## Bối cảnh

Câu hỏi bắt đầu từ người dùng: khoá `/lap-trinh/lo-trinh/principal-ai--kien-truc-su-phan-mem-ai`
đã hoàn thành chưa. `docs/goals/2026-09-15-ai-systems-architect.md` ghi bốn milestone M3/M5/M6/M7 ở
trạng thái BACKLOG với cột Spec là "viết trước slice" — nghĩa là chưa ai biết chính xác còn thiếu
những gì.

Đếm lại từ `packages/subject-programming/specializations/stageUnits.ts` tại commit `3e92a78` cho ra
một sự thật khác hẳn tài liệu: **cả 27 chặng mà `principal-ai` đang tham chiếu đều ĐÃ có unit thật**.
Baseline "13/27 chặng" ở mục 1 của goal đã lỗi thời từ lâu.

Khoảng trống thật nằm ở chỗ khác: bốn chặng mà đặc tả chương trình
(`docs/specs/2026-09-15-khoa-kien-truc-su-phan-mem-ai.md` §4) đòi cho Giai đoạn 3/5/6 nhưng lộ trình
CHƯA tham chiếu và bản đồ hướng còn rỗng — `devops-s3`, `devops-s4`, `data-s4`, `security-s4`.

## Đã làm

Bốn đặc tả mới trong `docs/specs/`, đều theo khuôn 6 ô của `docs/templates/dac-ta-tinh-nang.md`,
đều ở trạng thái **CHỜ CHỦ DỰ ÁN DUYỆT** (không tự duyệt):

- `2026-09-17-devops-s3-bai-hoc-that.md` — M3/S2. Bốn unit `p6-u194…u197`: hợp đồng workload
  Kubernetes, GitOps và trôi cấu hình, quan sát, SLI/SLO + error budget + chaos.
- `2026-09-17-devops-s4-ai-platform-bai-hoc-that.md` — M5/S1. Bốn unit `p6-u198…u201`: lối đi lát
  sẵn + DORA, SBOM/ký/xuất xứ, ước lượng bộ nhớ GPU + định tuyến thác + chi phí trên mỗi lần thành
  công, đo lường vận hành AI + post-mortem.
- `2026-09-17-data-s4-security-s4-bai-hoc-that.md` — M6/S1a + M6/S1b. Tám unit `p6-u202…u209`.
- `2026-09-17-capstone-va-audit-toan-khoa.md` — M7/S1. Không cấp unit mới; là dữ liệu rubric 12
  thành phần + 8 hạng mục 100 điểm, giao diện capstone, cổng bất biến đóng goal và audit 11 tầng.

Cập nhật `docs/goals/2026-09-15-ai-systems-architect.md`: bảng milestone (thêm dòng M3/S1 đã merge
ở PR #989, tách M6 thành S1a/S1b, điền cột Spec cho cả bốn), viết lại mục 5 "Current truth" theo số
đếm thật, thêm Iteration 8.

## Quyết định đề xuất (ba câu hỏi chờ chủ dự án chốt)

1. **Loại hẳn `security-s3` khỏi khoá.** Chặng đó là bảo mật tấn công chuyên sâu — dịch ngược, khai
   thác bộ nhớ, ROP, fuzzing tìm lỗ hổng thật. Nó mâu thuẫn trực tiếp với ranh giới an toàn đã chốt
   ở `security-s1`/`security-s2` (không dò quét, không khai thác, không tạo payload) và không phục
   vụ chuẩn đầu ra nào trong tám năng lực ở §3. Cần chốt thành văn bản để lần audit sau không đọc
   "security-s3 rỗng" thành nợ chưa trả.
2. **`devops-s4` giữ bốn module nền tảng, lấy phục vụ mô hình làm lab**, KHÔNG soạn lại agent
   runtime / hợp đồng công cụ / ngân sách vòng lặp — những thứ đó đã nằm ở `ai-s4` (`p6-u174…u177`,
   PR #976). Soạn lại là tự tạo hai nguồn sự thật, đúng rủi ro "nhân bản nội dung giữa 4 tầng
   curriculum" trong risk register.
3. **Capstone dùng lại `phaseId = 'principal-ai-p5'`** đã hợp lệ trong registry, nên không cần
   migration cho bảng artifact (0074).

Kèm theo: nối bốn chặng mới vào `principal-ai` đưa lộ trình từ 27 lên 31 chặng. Chỉ cộng thêm,
không đổi `pathId`/`phaseId`/`stageId` nào đã phát hành, nhưng mẫu số tiến độ hiển thị sẽ đổi.

## Rủi ro đã ghi sẵn vào đặc tả thay vì để phát hiện lại

- **Ngân sách bundle sát trần** (nợ #2: 135,4 kB / trần 140 kB, đã quá mốc cảnh báo 133 kB). Panel
  capstone bắt buộc nạp lười và phải dán số `npm run budget` trước/sau vào mô tả PR.
- **Cổng bất biến của M7 sẽ đỏ nếu chạy trước M3/M5/M6** — đây là chủ đích, nó chính là thước đo
  goal, nên M7 phải là lát cuối.
- **Tầng 8b bắt buộc**: chuỗi PR #861/#862/#863 từng tìm ra bốn lỗi lặp nội dung mà không cổng nào
  bắt được và đọc mã cũng không thấy.

## Bằng chứng kiểm chứng

```
npm run format:check   # PASS (4 đặc tả mới + goal + changelog)
```

Đợt này chỉ là tài liệu — không chạm source nên không có typecheck/test/build liên quan để chạy.
Dải unit đề xuất `p6-u194…u209` đã đối chiếu với `stageUnits.ts`: id cao nhất đang dùng là `p6-u193`
(`architecture-s4`), nên không đè lên id nào đã cấp.

## Còn để ngỏ

Bốn đặc tả chưa được duyệt nên chưa slice nào chuyển sang thi hành. Thứ tự thi hành sau khi duyệt:
M3/S2 → M5/S1 → M6/S1a → M6/S1b → M7/S1.
