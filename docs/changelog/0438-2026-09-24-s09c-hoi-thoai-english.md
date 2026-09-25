# S09c — Bài hội thoại mẫu English: mở đúng bài/lượt bằng URL, huỷ audio/đóng vai khi điều hướng

- **Ngày:** 2026-09-24 → 2026-09-25 · **PR:** (điền khi mở PR)
- **Đặc tả:** [docs/specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md](../specs/2026-09-23-uiux-s09-s12-trai-nghiem-va-nghiem-thu.md)
  §2.7 (contract B2) + fixture S09-EN-AC01..AC06; duyệt triển khai ở §2.1b mục 3.
- **Write set:** `apps/dhcb/src/pages/subjects/english/Lessons.tsx`,
  `pages/subjects/english/lessons/{LessonView.tsx,useRolePlay.ts,TrongBaiHoiThoai.tsx (mới)}`,
  `data/lessons/loader.ts`, `lib/englishLessonAnchors.ts` (mới) + test; thêm prop tuỳ chọn
  `landmark` cho `components/EvaluationResultView.tsx` (mặc định giữ nguyên hành vi Chat/Speaking);
  E2E mới `e2e/english-lesson-deep-link.spec.ts`; thêm route bài mở theo URL vào hai cổng
  `e2e/a11y.spec.ts` + `e2e/a11y-aaa.spec.ts`; sửa locator mơ hồ ở `e2e/continue-viewing.spec.ts`; test canh caller
  `components/EvaluationResultView.test.tsx`. KHÔNG chạm CEFR, prompt/model, rubric, chấm, SRS,
  schema, sổ lỗi.

## Vấn đề (tái hiện bằng test đỏ trước khi sửa)

1. **Bài đang mở chỉ nằm ở state.** `?lesson=1#luot-20` bị bỏ qua, mở ra danh sách; tải lại,
   Back/Forward, chia sẻ link đều mất chỗ đứng. Không có đích `#luot-N`/`#ket-qua` nào trong DOM.
2. **Loader tin mù.** Không kiểm HTTP status (503 thành `SyntaxError`), nhận `chunk[meta.idx]`
   TRƯỚC khi kiểm id (chỉ mục lệch chunk → mở NHẦM bài khác), lời hứa lỗi bị cache mãi, trang
   không có nhánh lỗi/Thử lại (spinner vô hạn).
3. **Audio/đóng vai chạy tiếp sau khi rời chỗ.** Cờ `stopRef`/`rpStopRef` boolean bị lượt mới đặt
   lại `false` trong khi vòng cũ còn chờ giọng đọc → hai vòng song song; STT/chấm điểm về muộn vẫn
   ghi transcript, hiện điểm và **cộng lượt dùng** sau khi đã đổi bài; `LessonView` không có `key`
   nên kết quả chấm của bài trước lộ sang bài sau / owner khác.
4. **Kết quả chấm thay cả màn**, lại dựng thêm một `<main>` lồng trong `<main>` của trang (desktop).

Đỏ trước sửa (Vitest, test mới chạy trên mã nguồn `origin/main` fd15ecb1 — thay tạm các file
nguồn bằng bản `main`, chạy, rồi trả lại):

- `data/lessons/loader.test.ts`: **10/12 đỏ** — vd `expected SyntaxError: Unexpected token 'o',
"oops"… to match object { kind: 'http', status: 503 }`, `expected TypeError: Failed to fetch to
match object { kind: 'network' }`, `expected { id: 9, … } to match object { id: 1 }` (chính là
  lỗi mở nhầm bài). 2 ca xanh là ca đường vui (index hợp lệ, chunk được cache).
- `useRolePlay.ts` bản `main` (chỉ thêm bí danh `huyTheoDieuHuong = stopRolePlay` để trang gọi
  được): ca "đổi bài khi đang chấm" **đỏ** — `expected "vi.fn()" to not be called at all, but
actually been called 1 times` (phản hồi chấm về muộn vẫn **cộng lượt dùng** sau khi rời bài).
- `pages/subjects/english/Lessons.s09c.test.tsx`: **27/27 đỏ** trên 5 file nguồn bản `main`
  (không đích nào tồn tại, URL bị bỏ qua).

## Đã làm

- **URL là nguồn sự thật** (`lib/englishLessonAnchors.ts`, hàm thuần): `lesson` chỉ nhận MỘT số
  nguyên dương viết chuẩn (`0`, `abc`, rỗng, lặp, `01`, `+1` → sai); danh sách trắng hash
  `#dau-bai · #hoi-thoai · #luot-N · #ket-qua`, N từ 1 theo thứ tự nguồn, ngoài phạm vi → về tiêu
  đề bài (không kẹp sang lượt cuối). Trang chỉ `getElementById` id đã qua danh sách trắng.
- **Thứ tự nạp** ở `Lessons.tsx`: chỉ mục → xác minh mã → nạp chunk → kiểm `lesson.id` → LessonView
  giải hash sau render. Mã sai: thông báo "Không mở được bài này" tại danh sách + focus heading,
  không nạp chunk, không mở bài khác. Lỗi mạng/HTTP/dữ liệu: khối "Không tải được…" + **Thử lại**
  riêng (chỉ mục và bài tách nhau), mobile thêm "Về danh sách". "Đang tải" được SUY RA từ việc kết
  quả nạp không khớp bài/lần tải → response bài cũ không bao giờ được nhận.
- **History:** chọn bài/đích khác = đúng 1 entry; chọn lại cùng đích chỉ focus (bộ đếm `lanNhay`,
  hash "đang chờ" chống entry trùng khi bấm nhanh). "Danh sách" bỏ `lesson` + hash xác định, giữ
  query khác, focus lại thẻ bài vừa mở (không còn hiện thì heading danh sách). Link cũ `/bai-hoc`
  giữ query + hash (redirect có sẵn, nay có E2E). Không thêm resume bền cho hội thoại; "Tiếp tục"
  vẫn là gợi ý bài CHƯA XEM.
- **Focus/cuộn:** đích có `tabIndex=-1`, lượt có `role="group"` + nhãn "Lượt N — người nói"
  (chiều B: "Turn N — …"); focus `preventScroll` rồi cuộn `instant` với `scroll-margin-top` tính
  từ header + thanh điều khiển sticky (desktop) hoặc khoảng thở trong panel (mobile). Cuộn theo dòng
  đang đọc khi "Phát tất cả" nay tôn trọng `prefers-reduced-motion`.
- **Mục "Trong bài"** (`TrongBaiHoiThoai.tsx`) nằm trên thanh điều khiển: Đầu bài · Hội thoại ·
  Kết quả + lưới "Tới lượt" 1..N → tới bất kỳ lượt nào trong **2 kích hoạt**. Disclosure APG:
  chọn đích đóng menu và focus đích; Escape/Đóng trả focus nút mở. Bản STEM (#1163) chưa vào
  `main` nên dựng riêng, không import mã chưa merge.
- **Huỷ khi điều hướng:** thế hệ `phatRef` (trình phát) + `theHeRef` (đóng vai) thay cờ boolean;
  mọi đoạn sau `await` (TTS, 250/400/500 ms, micro, STT, chấm) so lại thế hệ. Mọi điều hướng lên
  bài đang mở dừng phát, huỷ recorder, bỏ STT/chấm đang chờ; đóng vai kết thúc CHƯA hoàn thành
  (không thanh chấm, không điểm, không cộng lượt). Micro xin quyền xong mà đã điều hướng → nhả
  ngay. `LessonView` có `key = bài:owner:chiều` → đổi một trong ba là remount sạch.
  Bộ ghi đang chờ STT được nhả khỏi ref trước khi `await` để lệnh huỷ không `stop()` lần hai
  (E2E với MediaRecorder giả đã bắt được một lượt `/api/stt` thứ hai trước khi sửa).
- **`#ket-qua` luôn có**, hiện tại chỗ dưới hội thoại: kết quả trong bộ nhớ của đúng lần mở
  bài, hoặc "Chưa có kết quả trong lần mở bài này." + link về hội thoại. Chấm xong → điều hướng
  tới `#ket-qua`; đóng → `#hoi-thoai` (giữ reset đóng vai cũ). Lỗi không gắn vào lượt (chưa có
  định danh lượt). `EvaluationResultView` nhận `landmark={false}` ở đây để không lồng `<main>`.
- **markViewed** chạy theo mã bài, không theo hash (test đếm đúng 1 lần qua nhiều lần nhảy lượt).
- Tên bài thành `<h1>` trong nội dung (trang chi tiết trước đây không có h1); header không nhắc
  lại tên bài để tránh lặp chữ. Badge tốc độ `1×` tăng lên `text-sky-200` ở theme tối (đo 6.68:1
  ở dark-blue khi cổng AAA lần đầu quét trang chi tiết).

## Bằng chứng

- Cổng máy (2026-09-25, sau khi gộp `origin/main` fd15ecb1): `npm run typecheck` exit 0 ·
  `npm run lint` exit 0 (0 cảnh báo) · `prettier --check` các file đổi: sạch · `npm run
test:coverage` exit 0 — **746 file / 17 027 test xanh** (1 file + 2 test skip sẵn có), phủ
  stmts/branches/funcs/lines 94.65/90.55/95.39/95.16 · `npm run build` exit 0 · `size-limit`
  Initial JS 152.1/160 kB, CSS 23.62/26 kB.
- Vitest mục tiêu: `englishLessonAnchors.test.ts` 13/13, `loader.test.ts` 12/12,
  `Lessons.s09c.test.tsx` 27/27, `components/EvaluationResultView.test.tsx` 2/2 (canh caller
  Chat/Speaking/CEFR: không truyền `landmark` vẫn là `<main>`; hai lỗi trùng `original` hiện đủ).
- E2E mới `english-lesson-deep-link.spec.ts`: **25 test, `--repeat-each=3` → 75/75 xanh**,
  dev server riêng cổng 5291. Đếm side effect: `/api/agent` 0 ở AC02/AC05, đúng 1 ở AC06 (đóng kết quả
  không chấm lại); `/api/stt` đúng 1 khi đổi bài lúc STT đang chờ; số request `/api/tts` không
  tăng trong 1,5 s sau khi nhảy lượt/đổi bài lúc đang "Phát tất cả". Mọi nhà cung cấp trả phí đều
  mock (page.route + MediaRecorder giả).
- Cổng a11y `-g bai-hoc` (AA + AAA): **36/36 xanh** — gồm route mới
  `/goc-hoc-tap/english/bai-hoc?lesson=1#ket-qua` × 3 theme ở cả hai cổng; AA thêm cho menu mở +
  kết quả nhúng × 3 theme ở 390px (trong spec mới).
- E2E hồi quy liên quan (bottomnav, continue-viewing, lesson-list-visibility,
  header-back-touch-target, mobile-layout-guards, route-alias, reduced-motion, a11y-modals): lượt
  đầu 72/73 — `continue-viewing` "Lessons" đỏ 6/6 lần lặp: bài đang mở nay nằm trên URL nên router
  áp điều hướng ở lượt render SAU cú bấm; ngay sau click, nút "Tiếp tục" (còn tên bài 1) và thẻ bài 1
  cùng khớp `getByRole('button', { name: /Giới thiệu bản thân/ })` → strict-mode ném lỗi tức thì,
  không chờ. Sửa locator thành `#lesson-card-1` (hợp đồng `aria-current` giữ nguyên) và cho gợi ý
  "Tiếp tục" bỏ qua bài đang mở ngay trong lượt render → `--repeat-each=5` 10/10 xanh.
- Tầng 8b: ảnh trước/sau 390 + 1440 × blue-sky/dark-blue/kid (thư mục scratchpad của phiên, không
  commit). Nhận xét: không còn lặp tên bài giữa header và nội dung; lượt 20 hiện ngay dưới thanh
  điều khiển có viền focus; menu mở đẩy nội dung xuống ở mobile (disclosure, không che). Ảnh
  1440 của mã sai lộ câu "Hãy chọn một bài bên dưới" trong khi danh sách nằm ở CỘT TRÁI → đã sửa
  chữ theo khuôn ("ở cột bên trái" ở desktop).

## Ma trận nghiệm thu

| AC                                                                     | Trạng thái                                                      |
| ---------------------------------------------------------------------- | --------------------------------------------------------------- |
| S09-EN-AC01 bài 1 `#luot-20`, A/B, direct/reload/history, ≤2 kích hoạt | PASS (E2E 390/1440 × A/B)                                       |
| S09-EN-AC02 bài 2 đổi bài/hash khi audio/đóng vai chạy                 | PASS (E2E audio + STT chờ; unit chấm chờ)                       |
| S09-EN-AC03 bài 11 tải chậm → bài 1; HTTP lỗi + Thử lại                | PASS                                                            |
| S09-EN-AC04 mã/hash sai                                                | PASS                                                            |
| S09-EN-AC05 `#ket-qua` rỗng sau reload; owner/chiều khác không lộ      | PASS (owner + chiều: unit)                                      |
| S09-EN-AC06 kết quả tổng hợp giải thích dài                            | PASS mức kỹ thuật — dữ liệu mock, KHÔNG phải bằng chứng sư phạm |
| S09-AC09 audio English hai chiều A/B không hồi quy                     | PASS mức E2E/unit hiện có                                       |
| Screen reader thật (NVDA/VoiceOver), thiết bị thật, zoom 200% / 320px  | **WAITING**                                                     |

## Còn chờ / rủi ro

- **WAITING:** kiểm bằng trình đọc màn hình và thiết bị di động thật; audio thật (TTS Google, STT
  Whisper) chưa chạy với nhà cung cấp — chỉ mock.
- Lượt chấm đang chờ bị bỏ khi điều hướng vẫn đã tốn một lượt gọi AI phía server (không hoàn lại
  được từ client); chỉ không hiện điểm/không cộng lượt ở client.
- Giải thích lỗi dài chưa thu gọn (spec cho phép, không bắt buộc) — giữ nguyên để không đổi
  `EvaluationResultView` của Chat/Speaking.
- Cổng AAA trang chi tiết mất ~22–30 s/theme (mỗi chữ là một span karaoke) → đặt `test.slow()`
  riêng cho route này.
- Thẻ bài trong danh sách ghi "10 lượt thoại" (`turnCount / 2`, tức số CẶP lời) trong khi trang
  bài và mục "Trong bài" đếm "20 lượt" / "Lượt 20" theo đặc tả. Hai chữ "lượt" hai nghĩa —
  `LessonList.tsx` nằm ngoài write set S09c nên chưa sửa; đề xuất đổi chữ ở thẻ (vd "10 cặp lời").
- Menu "Trong bài" đang mở thì đổi hash từ ngoài (gõ URL, Back) không tự đóng menu — chỉ chọn
  đích trong menu mới đóng.
