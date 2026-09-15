# 0322 — 2026-09-15 — Renderer câu trả lời Companion (sau review) + trả hai món nợ

**PR:** #924 · **Slice:** S03-3 của [GOAL-2026-0915-LEARNING-UX](../goals/2026-09-15-learning-ux.md)
· **Đặc tả:** [nền §④ B](../specs/2026-09-15-learning-ux-foundation.md) gạch 4–6 · **Base:** `main` sau #923 (S03-2)

## 0. Lượt REVIEW trước, mã sau

Đặc tả §④ B gạch 5 viết: _"Không cài parser mới nếu chưa review bundle/dependency"_. Đợt này
bắt đầu bằng đúng lượt review đó. Ba câu hỏi, ba câu trả lời có bằng chứng:

**(a) Điểm hiển thị nào THẬT SỰ cần renderer?** Đọc hết `StudioDialogue.tsx` (548 dòng): chỉ
**MỘT** chỗ in nội dung do AI sinh ra — `<div className="…whitespace-pre-wrap">{msg.text}</div>`.
Chỗ thứ hai (bảng "Trạng thái Companion" của chế độ giọng nói) chỉ in **một dòng xem trước** của
lượt cuối, nên giữ nguyên chữ thường là đúng: nó là dòng trạng thái, không phải chỗ để đọc.

Nội dung ở đó CÓ markdown thật, không phải giả định: `COMPANION_SYSTEM_PROMPT`
(`packages/core-personal/companionRuntime.ts`) yêu cầu trả lời _"có cấu trúc mạch lạc"_ và không
hề cấm markdown. Ngay tin chào cứng của trang cũng đã hiện ra `**Bạn Đồng Hành AI**` với nguyên
hai cặp dấu sao — xem ảnh trước/sau ở mục 4.

**(b) Có cần cài parser mới không? KHÔNG.** Dự án đã có `apps/dhcb/src/lib/lessonMarkdown.ts` —
bộ đọc markdown tối giản viết ra **chính vì ràng buộc này** (ngân sách bundle mỏng, nợ kỹ thuật
#6), đã qua cổng test trên dữ liệu thật của 68 bài học. Nó đọc đúng năm cấu trúc mà câu trả lời
chat dùng. `react-markdown` + `rehype-sanitize` là vài chục kB cho cùng năm cấu trúc đó.

Kiểm luôn phần phụ thuộc đang có: `grep dangerouslySetInnerHTML` trên toàn `apps/` + `packages/`
trả về **0 kết quả**, và `package.json` **không có** thư viện markdown/sanitizer/highlight nào.
Nghĩa là bất biến "không dùng raw HTML từ AI" hiện đang đúng — việc của đợt này là giữ nó đúng,
không phải dựng nó lên.

**(c) Thiếu gì? ĐO TRƯỚC KHI SỬA.** Chạy bộ đọc hiện có trên một câu trả lời mẫu có rào ```
(`scratchpad/probe.ts`, kết quả dán trong đầu `lessonMarkdown.ts`): hai dòng thụt lề 0 rơi ra
thành **đoạn văn**, dòng thụt lề 4 thành **một khối code lạc lõng**, và hai dòng rào thành hai
đoạn văn chứa ba dấu huyền. Đúng cái "làm hỏng code hiển thị cho học viên" mà luật số 1 của
chính file đó cấm. Thiếu đúng một thứ: **khối code rào**.

**(d) Việc CỐ Ý KHÔNG làm trong đợt này:** công thức toán (LaTeX `$…$`). Đặc tả nói _"công thức
hợp lệ được trình bày dễ đọc"_, nhưng làm được điều đó cần KaTeX — đúng loại "renderer lớn" mà
gạch 5 bắt tách spec/PR riêng và ghi rõ dependency. Hiện tại công thức đi qua như chữ thường,
tức là **"giữ nguyên công thức không hiểu được"** — vế còn lại của cùng gạch đó.

## 1. S03-3 — việc đã làm

**`lib/lessonMarkdown.ts`:**

- Thêm khối code **rào ```**: mọi thứ tới rào đóng là code nguyên văn, không phân tích gì bên
  trong. Đặt TRƯỚC nhánh thụt lề vì thân rào có thể thụt lề bất kỳ. Rào thiếu dấu đóng (LLM bị
  cắt vì hết token) vẫn ra khối code chứ không rớt ra chữ; rào rỗng không sinh ô code trống.
- Thêm tiêu đề `##`/`###` **có cờ bật, mặc định TẮT**. Chỉ khung chat bật.

**`components/CompanionStudios/ChatProse.tsx` (mới)** — dựng khối ra JSX, dùng lại `CodeSurface`
của môn Lập trình để khối code ở đâu cũng một hình dạng (luật N2). Tiêu đề hạ xuống `h4`/`h5`,
không phải `h2`: bong bóng chat nằm dưới `h1` trang và `h3` khu vực, đặt `h2` sẽ phá `heading-order`.

**`StudioDialogue.tsx`** — CHỈ lượt của Companion đi qua bộ đọc.

## 2. Quyết định

**`#` MỘT cấp không bao giờ là tiêu đề, kể cả khi bật cờ.** Đếm lại trên kho bài học:
**305 dòng** bắt đầu bằng `#` trong `packages/subject-programming/lessons/`, **tất cả** là comment
Python trong code (`# --- Lop an: h = ReLU(...)`, `# RESHAPE: cat day phang thanh tung hang`).
Hiểu `#` là tiêu đề sẽ nuốt mất 305 dòng comment. Cờ `headings` đã không bật cho bài học, nhưng
giới hạn "từ hai dấu thăng trở lên" là **lớp chặn thứ hai** — comment lọt ra ngoài rào vẫn là chữ.
Có test canh đúng ca đó.

**Lượt của NGƯỜI DÙNG giữ nguyên chữ thường.** Hai lý do, cả hai đều tự đứng được: (1) người dùng
gõ chữ thường chứ không viết markdown — diễn giải dấu sao của họ là **sửa lời họ vừa nói**;
(2) bong bóng người dùng có nền gradient sáng, các lớp `text-zinc-*` của `ChatProse` không đạt
tương phản trên nền đó.

**An toàn đo bằng cây DOM, không bằng chuỗi.** Bản test đầu viết `expect(html).not.toContain('href=')`
và **đỏ với đúng đầu ra đúng**: chuỗi `href=` vẫn có mặt trong HTML an toàn, dưới dạng chữ đã
thoát (`&lt;a href=&quot;…`). Phép đo đúng là dựng HTML thành DOM rồi đếm `querySelectorAll('a')`.

## 3. Trả hai món nợ đã ghi (dọn dẹp, độc lập với S03-3)

**Nợ 1 — `SubjectDetail.tsx` nuốt lỗi rồi đá người dùng về trang danh sách (ghi ở S03-1).**
`.catch(() => goToSubjects(nav))` biến mất mạng / 503 / payload sai thành một cú điều hướng im
lặng. Tệ hơn ca của `Subjects.tsx` (chỉ nói dối là danh mục trống) ở chỗ người dùng còn **mất
luôn đường dẫn môn mình vừa chọn** — phải mò lại từ đầu, và rất dễ tin là môn đã bị gỡ. Nay ba
trạng thái tách bạch + `LoadError` + "Thử lại" gọi lại ĐÚNG môn đang xem, cùng khuôn `Subjects.tsx`.
Thêm luôn `AbortController` chống race khi chuyển nhanh Toán → Lý.

**Nợ 2 — `Landing.tsx`/`LandingEn.tsx` thiếu `id={MAIN_CONTENT_ID}` (phát hiện ở S03-2).**
`SkipLink` render TOÀN CỤC trong `App.tsx`, còn `MAIN_CONTENT_ID` chỉ được đặt trong `PageShell`.
Hai trang giới thiệu tự dựng `<main>` nên liên kết trỏ vào `#noi-dung-chinh` **không tồn tại**:
người dùng bàn phím bấm Tab lần đầu, thấy liên kết, bấm Enter và **không có gì xảy ra** — hỏng
lặng lẽ, không cổng nào đỏ (cổng axe xanh vì luật `bypass` chấp nhận landmark `<main>` là đủ).
Thêm `id` + `tabIndex={-1}` + cổng E2E canh đúng hai trang đó.

## 4. Bằng chứng kiểm chứng

| Cổng                                                                 | Kết quả                                                                                                                                          |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run build`                                                      | ✅                                                                                                                                               |
| `npm run typecheck`                                                  | ✅                                                                                                                                               |
| `npm run lint`                                                       | ✅ 0 cảnh báo                                                                                                                                    |
| `npm run format`                                                     | ✅                                                                                                                                               |
| `npm run test:coverage`                                              | ✅ **609 file / 12554 test**, ngưỡng đạt                                                                                                         |
| `npm run size`                                                       | ✅ JS **128.8 kB / 140 kB**, CSS **18.13 kB / 20 kB** — KHÔNG đổi (`ChatProse` nằm trong chunk lazy của `StudioDialogue`, không chạm initial JS) |
| E2E `skip-link` + `mobile-layout-guards` + `subjects-catalog-states` | ✅ 24/24                                                                                                                                         |
| E2E `a11y` + `a11y-aaa` (15 trang × 5 theme)                         | ✅                                                                                                                                               |

**Tầng 8b — ẢNH TRƯỚC/SAU** (1440px + 390px, nguồn: MOCK route `/api/companion`, câu trả lời SSE
dựng sẵn có đủ đậm · tiêu đề · danh sách đánh số · rào ```python · gạch đầu dòng · code trong dòng):

- **Trước:** hiện nguyên `**ba bước**`, `## Cách làm`, ` ```python `, và mọi dấu huyền quanh code
  trong dòng; khối code mất hẳn hình khối, thụt lề trôi vào chữ thường.
- **Sau:** chữ đậm thật, tiêu đề thật, danh sách `<ol>`/`<ul>` thật, khối code trong `CodeSurface`
  (nền tối cố định, cuộn ngang riêng, Tab tới được), `code` trong dòng thành chip.

Ảnh còn cho thấy MỘT bằng chứng ngoài dự tính: **tin chào cứng của trang** — thứ mọi người dùng
mở trang đều thấy — cũng đã hiện ra `**Bạn Đồng Hành AI**` với nguyên hai cặp dấu sao suốt từ
trước tới nay.

## 5. Nợ MỚI phát hiện (ghi, KHÔNG sửa trong đợt này)

> **[Cập nhật] ĐÃ TRẢ ngay sau đó — xem `0323-2026-09-15-companion-khoi-phuc-hoi-thoai.md`.**

Lúc dựng ảnh chụp: `Companion.tsx` **không khôi phục được lịch sử hội thoại trong chế độ dev**.
Effect nạp lịch sử dùng `historyLoadedRef` để chặn chạy lần hai, nhưng dưới `StrictMode` React
gọi mount → unmount → mount: cleanup của lần MỘT đặt `cancelled = true`, còn lần HAI bị ref chặn
— nên response về tới nơi thì bị bỏ. Bản production không double-invoke effect nên **không cắn
người dùng thật**, nhưng khuôn "ref chặn + cờ cancelled" là sai về bản chất (effect không lũy
đẳng). Đã ghi vào `PROGRESS.md`; sửa nó là đợt riêng, không gộp vào đây.
