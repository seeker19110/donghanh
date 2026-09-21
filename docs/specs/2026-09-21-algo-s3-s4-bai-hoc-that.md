# Đặc tả — `algo-s3` và `algo-s4`: quy hoạch động/kỹ thuật nâng cao và thuật toán trong hệ thống thật

> Ngày: 2026-09-21 · Trạng thái: **APPROVED FOR IMPLEMENTATION** (chủ dự án duyệt ngày 2026-09-21)
> Goal: `GOAL-2026-ASA` (cùng chuỗi `algo-s1`/`algo-s2`), lát cắt đề xuất `M2/S1j` — hai chặng
> CUỐI của hướng Thuật toán, khép hướng chuyên sâu này lại đủ bốn chặng S1–S4.
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`, cùng bộ khung với
> `docs/specs/2026-09-17-devops-s3-bai-hoc-that.md`,
> `docs/specs/2026-09-16-algo-s1-bai-hoc-that.md`, `docs/specs/2026-09-16-algo-s2-bai-hoc-that.md`.

## 0. Một câu

Lấp hai chặng rỗng cuối cùng của hướng Thuật toán bằng tám unit / mười sáu bài Python MÔ PHỎNG,
tất định và bounded: `algo-s3` dạy quy hoạch động, chuỗi, toán rời rạc và cấu trúc dữ liệu truy
vấn khoảng; `algo-s4` dạy cấu trúc xác suất, xấp xỉ NP-khó, thuật toán thân thiện bộ nhớ và kỹ
năng trình bày lời giải — tất cả chấm được bằng oracle/differential test thay vì chỉ đọc lý
thuyết.

## ① Phạm vi

**LÀM:**

- Tám unit mới, mỗi unit hai lesson theo vòng tám bước hiện có (hook, theory, worked example,
  predict, Parsons, make, test cases, homework/SRS), bám đúng một module của
  `packages/subject-programming/specializations/algo.ts` (dòng 166–210 cho `algo-s3`, dòng
  220–264 cho `algo-s4`) và nội dung đã duyệt trong
  `packages/subject-programming/specializations/details/algo-s3.ts` +
  `.../details/algo-s4.ts`.
- `algo-s3` — bốn unit `p6-u226..p6-u229`:
  - `p6-u226` / `algo-s3-m1` **Quy hoạch động**: đặt trạng thái + công thức chuyển TRƯỚC khi viết
    code; chuyển đệ quy có nhớ (memo) sang bản lặp bottom-up, giảm chiều bộ nhớ từ 2D xuống 1D
    cho một bài dạng ba lô/LIS.
  - `p6-u227` / `algo-s3-m2` **Chuỗi**: KMP đếm số lần khớp mẫu trong văn bản; băm chuỗi hai bộ
    (double hashing) để tự tạo va chạm và thấy vì sao một bộ băm là không đủ; khoảng cách chỉnh
    sửa (edit distance) áp vào gợi ý sửa lỗi chính tả.
  - `p6-u228` / `algo-s3-m3` **Toán rời rạc ứng dụng**: luỹ thừa/nghịch đảo mô-đun tất định; sàng
    nguyên tố; giao đoạn thẳng bằng tích có hướng SỐ NGUYÊN (không dùng số thực) để tránh sai số
    dấu phẩy động.
  - `p6-u229` / `algo-s3-m4` **Cấu trúc dữ liệu nâng cao**: cây phân đoạn có cập nhật lười (range
    update, range query) đối chứng với thao tác trên mảng thô (oracle); sparse table cho truy vấn
    min/max tĩnh (RMQ), từ chối cập nhật sau khi đã build.
- `algo-s4` — bốn unit `p6-u230..p6-u233`:
  - `p6-u230` / `algo-s4-m1` **Cấu trúc dữ liệu xác suất**: Bloom filter đo tỉ lệ báo nhầm thực
    tế qua nhiều seed, đối chứng với `set` chuẩn; băm tự viết bằng đa thức mô-đun cố định (KHÔNG
    dùng `hash()` built-in của Python vì không tất định giữa các tiến trình).
  - `p6-u231` / `algo-s4-m2` **Tối ưu và NP-khó**: nhận diện một bài ba lô 0/1 kích thước lớn là
    không khả thi vét cạn, chuyển sang heuristic tham lam + cải thiện cục bộ, so với cận trên tính
    được (LP relaxation/fractional bound) để biết còn cách bao xa.
  - `p6-u232` / `algo-s4-m3` **Song song và bộ nhớ**: đếm số lần "đổi khối nhớ" mô phỏng khi duyệt
    ma trận theo hàng so với theo cột (đếm phép toán, KHÔNG đo thời gian tường); chia N đơn vị
    công việc thành k phần độc lập và kiểm tải lệch tối đa — mô phỏng chia-để-trị song song bằng
    số học, không dùng thread/process thật.
  - `p6-u233` / `algo-s4-m4` **Phỏng vấn và truyền đạt**: rút ràng buộc từ một đặc tả bài toán và
    quyết định "cần làm rõ trường nào" trước khi ước lượng; ước lượng dung lượng kiểu thiết kế hệ
    thống (QPS × kích thước × thời gian) bằng số học tất định; kiểm một bản giải thích lại có đủ
    thành phần bắt buộc (giả định, đánh đổi, ví dụ) hay thiếu.
- Đăng ký cả tám unit vào curriculum, lesson registry/lazy index chỉ sau khi toàn bộ mười sáu bài
  thật tồn tại và xanh — cùng thứ tự rollout đã dùng ở `algo-s1`/`algo-s2`.
- Giữ nguyên rubric 80/15/5 và metadata trong `details/algo-s3.ts`/`details/algo-s4.ts` làm chuẩn
  bằng chứng cuối chặng (thi đấu thật, tối ưu hệ thống thật) — lesson là bệ tập luyện, không thay
  thế rubric.

**KHÔNG LÀM:**

- Không dựng cluster/GPU/hệ thống production thật cho `algo-s4-m3`; "song song" và "bộ nhớ lớn hơn
  RAM" chỉ là mô phỏng số học (đếm phép toán, chia công việc), không dùng `threading`,
  `multiprocessing`, `concurrent.futures` hay đo `time.time()`/`perf_counter()` làm điều kiện
  pass/fail.
- Không dùng `hash()` built-in của Python cho chuỗi ở `p6-u227`/`p6-u230` (không tất định giữa
  các tiến trình do `PYTHONHASHSEED` ngẫu nhiên) — băm phải tự viết bằng công thức đa thức mô-đun
  cố định.
- Không dùng số thực (`float`) để so sánh giao/không giao trong hình học của `p6-u228`; chỉ dùng
  số nguyên và tích có hướng.
- Không mở sang bài toán NP-khó tổng quát ngoài phạm vi bài chọn (không cài solver LP/ILP thật,
  không gọi thư viện tối ưu ngoài); cận trên/cận dưới tính bằng công thức đóng hoặc vét cạn bounded
  đã kiểm.
- Không tuyên bố mười sáu lesson này thay cho rubric 4 tiêu chí mỗi chặng (thi đấu thật ≥10 kỳ ở
  `algo-s3-r1`, cải thiện đo được ≥10 lần ở hệ thống thật cho `algo-s4-r1`…) — lesson chỉ luyện kỹ
  năng nền, artifact rubric vẫn cần nộp riêng.
- Không dùng NumPy/SciPy/Hypothesis hay thư viện ngoài chuẩn của Python; không phụ thuộc mạng,
  LeetCode/Codeforces thật hay bất kỳ dịch vụ ngoài nào trong code chạy được.
- Không đổi/tái dùng unit id đã phát hành (`p6-u142..u145` của `algo-s1`, `p6-u162..u165` của
  `algo-s2`) và không đổi id phase/stage/module/quiz đã có trong `specializations/algo.ts`.
- Không tự quyết việc nối `algo-s3`/`algo-s4` vào lộ trình `principal-ai` hay lộ trình nào khác —
  xem mục ⑧.

## ② Điểm chạm

| Việc | Đường dẫn file                                                    | Ghi chú                                                 |
| ---- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u226.ts`                  | DP: trạng thái/chuyển, memo → lặp, giảm bộ nhớ          |
| Thêm | `packages/subject-programming/lessons/p6u227.ts`                  | KMP, double hashing, edit distance                      |
| Thêm | `packages/subject-programming/lessons/p6u228.ts`                  | Mô-đun, sàng nguyên tố, giao đoạn thẳng số nguyên       |
| Thêm | `packages/subject-programming/lessons/p6u229.ts`                  | Segment tree lazy, sparse table RMQ                     |
| Thêm | `packages/subject-programming/lessons/p6u230.ts`                  | Bloom filter, băm tự viết, đối chứng `set`              |
| Thêm | `packages/subject-programming/lessons/p6u231.ts`                  | Ba lô xấp xỉ, cận trên, negative control                |
| Thêm | `packages/subject-programming/lessons/p6u232.ts`                  | Mô phỏng cache-miss theo thứ tự duyệt, chia tải         |
| Thêm | `packages/subject-programming/lessons/p6u233.ts`                  | Làm rõ đề, ước lượng dung lượng, checklist trình bày    |
| Thêm | `packages/subject-programming/algoS3Lessons.test.ts`              | Semantic gate `algo-s3`: oracle, seed, negative control |
| Thêm | `packages/subject-programming/algoS4Lessons.test.ts`              | Semantic gate `algo-s4`: cùng khuôn cho bốn unit        |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts`      | Thêm khoá `algo-s3` và `algo-s4`                        |
| Sửa  | `packages/subject-programming/specializations/stageUnits.test.ts` | Khoá đủ tám unit theo đúng thứ tự                       |
| Sửa  | `packages/subject-programming/lessons.ts`                         | Đăng ký mười sáu bài vào registry đồng bộ               |
| Sửa  | `packages/subject-programming/curriculum.ts`                      | Gắn tám unit vào bậc P6                                 |
| Sinh | `packages/subject-programming/lessonsLazy.ts`                     | `npm run gen:lesson-index`, KHÔNG gõ tay                |
| Thêm | `docs/changelog/`                                                 | Nhật ký riêng của PR source                             |

**Ảnh hưởng lan ra (chạy `npm run codemap -- impact packages/subject-programming/specializations/stageUnits.ts` trước khi sửa):**

- Trang stage/path tự mở nút "Vào học" khi `unitsOfStage('algo-s3')`/`unitsOfStage('algo-s4')`
  không còn rỗng — cùng cơ chế đã quan sát ở `algo-s1`.
- `lessonsLoader.ts` nạp bài qua chỉ mục lazy sinh ra; `lessons.ts` phục vụ server/test/script.
- `lessonsPython.test.ts` chạy Python thật cho sample solution, worked example và Predict của cả
  mười sáu bài; `lessons.test.ts`, `curriculum.test.ts`, `lessonsLazy.test.ts`, `srsCards.test.ts`
  và test markdown kiểm chéo dữ liệu mới.
- Quiz (nếu `algo-s3`/`algo-s4` có quiz trong `learningPaths/stageQuizzes.ts` — kiểm lại trước khi
  sửa), rubric trong `details/algo-s3.ts`/`details/algo-s4.ts` và metadata trong
  `specializations/algo.ts` giữ nguyên; bài học phải cụ thể hoá chúng, không tạo nguồn sự thật thứ
  hai.

## ③ Hợp đồng dữ liệu

**Vào:** metadata module đã phát hành (`algo-s3-m1..m4`, `algo-s4-m1..m4`) và dữ liệu stdin hữu
hạn qua fixture/generator có seed; không nhận dữ liệu mạng.

```ts
type AlgoS3ModuleId = 'algo-s3-m1' | 'algo-s3-m2' | 'algo-s3-m3' | 'algo-s3-m4'
type AlgoS4ModuleId = 'algo-s4-m1' | 'algo-s4-m2' | 'algo-s4-m3' | 'algo-s4-m4'

const ALGO_S3_UNIT_IDS = ['p6-u226', 'p6-u227', 'p6-u228', 'p6-u229'] as const
const ALGO_S4_UNIT_IDS = ['p6-u230', 'p6-u231', 'p6-u232', 'p6-u233'] as const
```

**Ra:** mỗi file export đúng hai `ProgrammingLesson` có `language: 'python'`;
`SPEC_STAGE_UNITS['algo-s3'] === ALGO_S3_UNIT_IDS`, `SPEC_STAGE_UNITS['algo-s4'] ===
ALGO_S4_UNIT_IDS`. Mọi simulator/Make in một dòng quyết định tất định dạng `"<decision>:
<reason>"`.

**Hợp đồng từng unit (bảng bắt buộc theo khuôn `docs/templates/dac-ta-tinh-nang.md`):**

| Unit      | Module       | Hợp đồng simulator và ca biên BẮT BUỘC (gồm ca âm)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u226` | `algo-s3-m1` | Ba lô 0/1 hoặc LIS bounded (n, trọng số/giá trị đều có trần khai báo). DP bottom-up phải khớp tuyệt đối oracle đệ quy vét cạn trên toàn miền nhỏ và trên ≥100 ca random có seed. `n=0`/danh sách rỗng → `tu-choi: rong`; trọng số/giá trị âm khi bài không cho phép → `tu-choi: gia-tri-am`; n vượt trần cấu hình → `tu-choi: qua-lon`. **Ca âm:** một bản DP cài thiếu một transition (off-by-one trên chỉ số trạng thái) phải bị oracle bắt sai ở ít nhất một seed.                                                                                                                                                                                                                                                                                     |
| `p6-u227` | `algo-s3-m2` | KMP đếm occurrences của pattern trong text bounded độ dài; kết quả phải khớp brute-force substring scan (oracle) trên toàn ca hiện/ẩn và ≥100 ca random có seed. Double hashing (hai mô-đun, hai cơ số cố định, KHÔNG dùng `hash()` built-in) dùng để lọc trước, KMP xác nhận lại — không được báo khớp chỉ dựa một hash. `pattern` rỗng → `tu-choi: pattern-rong`; `text` rỗng → `tim-thay: 0`. **Ca âm:** dùng chỉ một hash (bỏ hash thứ hai) trên bộ dữ liệu cố ý gây va chạm phải cho kết quả SAI so với oracle — chứng minh vì sao cần hai bộ.                                                                                                                                                                                                       |
| `p6-u228` | `algo-s3-m3` | Luỹ thừa/nghịch đảo mô-đun: `m<=0` → `tu-choi: modulo-khong-hop-le`; cần nghịch đảo mà `gcd(a,m)!=1` → `tu-choi: khong-ton-tai-nghich-dao`. Sàng nguyên tố: `n<2` → `tu-choi: khong-co-so-nguyen-to`; kết quả đối chứng với kiểm tra nguyên tố ngây thơ trên toàn miền nhỏ. Giao đoạn thẳng dùng tích có hướng SỐ NGUYÊN: trả `cat-nhau`/`khong-cat-nhau`/`trung-nhau` (chồng lên nhau/song song trùng), không dùng `float`. **Ca âm:** một bản kiểm giao dùng so sánh `float` bằng dấu `==` phải bị test differential trên ca cố ý sát ngưỡng bắt sai so với bản số nguyên.                                                                                                                                                                              |
| `p6-u229` | `algo-s3-m4` | Cây phân đoạn có cập nhật lười (range-add, range-sum hoặc range-min) và sparse table (range-min tĩnh) đối chứng với thao tác trực tiếp trên mảng Python (oracle) qua ≥100 chuỗi thao tác random có seed. Truy vấn/khoảng ngoài biên `[0, n)` → `tu-choi: ngoai-bien`; gọi update trên sparse table sau khi đã build → `tu-choi: cau-truc-tinh`. **Ca âm:** lazy propagation quên đẩy (push-down) xuống con trước khi đọc phải cho kết quả SAI so với oracle mảng thô ở ít nhất một chuỗi thao tác.                                                                                                                                                                                                                                                        |
| `p6-u230` | `algo-s4-m1` | Bloom filter tham số `m` (số bit) và `k` (số hàm băm) cố định, dùng `k` hàm băm đa thức mô-đun tự viết (không `hash()` built-in). Tỉ lệ báo nhầm đo qua ≥5 seed khác nhau phải nằm trong khoảng lý thuyết ±dung sai đã khai; đối chứng "chắc chắn không có" luôn đúng so với `set` chuẩn (không âm tính giả). `m<=0` hoặc `k<=0` → `tu-choi: tham-so-khong-hop-le`; thêm phần tử vượt sức chứa cấu hình → `tu-choi: qua-tai`. **Ca âm:** đặt `k=1` trên dữ liệu cố ý gây va chạm bit phải cho tỉ lệ báo nhầm cao hơn hẳn ngưỡng lý thuyết của `k` khuyến nghị — chứng minh vì sao cần nhiều hàm băm.                                                                                                                                                      |
| `p6-u231` | `algo-s4-m2` | Ba lô 0/1 kích thước lớn hơn trần vét cạn: heuristic tham lam theo tỉ suất giá trị/trọng lượng + cải thiện cục bộ (local search bounded số bước), so với cận trên fractional-knapsack (LP relaxation dạng đóng, tính được bằng công thức). Input rỗng hoặc sức chứa `<=0` → `tu-choi: input-khong-hop-le`; n vượt trần cấu hình cho oracle vét cạn → BẮT BUỘC khai `khong-kiem-tra-toi-uu` trong output, không được im lặng coi là tối ưu. **Ca âm:** một biến thể heuristic bỏ bước cải thiện cục bộ phải cho khoảng cách tới cận trên XẤU hơn bản đủ bước trên cùng bộ dữ liệu — chứng minh cải thiện cục bộ có tác dụng đo được.                                                                                                                       |
| `p6-u232` | `algo-s4-m3` | Đếm số lần "đổi khối nhớ" mô phỏng (kích thước khối cố định khai báo) khi duyệt ma trận 2D theo hàng so với theo cột trên cùng dữ liệu — quyết định `chon: row-major`/`chon: column-major` theo số đổi khối thấp hơn, KHÔNG đo `time.time()`. Chia N đơn vị công việc thành `k` phần bằng số học (không thread/process thật), báo `can-bang: <chenh-lech-tai-toi-da>`; `k<=0` hoặc `k>N` → `tu-choi: k-khong-hop-le`. **Ca âm:** một cách chia cố ý lệch tải (dồn phần dư vào một phần) phải cho `chenh-lech-tai-toi-da` LỚN hơn cách chia đều, bắt được bằng so sánh trực tiếp hai chiến lược.                                                                                                                                                           |
| `p6-u233` | `algo-s4-m4` | Đầu vào là đặc tả bài toán dạng dict có tập trường bắt buộc đã khai báo (vd `qps`, `kich-thuoc-ban-ghi`, `thoi-gian-luu`); thiếu trường → `can-lam-ro: <ten-truong>` (chỉ trường ĐẦU TIÊN thiếu theo thứ tự cố định, tất định). Đủ trường và mọi giá trị dương → tính dung lượng bằng công thức đóng (`qps × kich_thuoc × giay_trong_ngay`), trả `uoc-luong: <so-byte>`. Giá trị `<=0` → `tu-choi: tham-so-khong-hop-le`. Bài kiểm bản giải thích: input là danh sách thành phần đã nêu (giả định/đánh đổi/ví dụ), thiếu thành phần bắt buộc → `thieu: <ten-thanh-phan>`, đủ → `dat: <so-thanh-phan>`. **Ca âm:** một đặc tả có đúng các trường bắt buộc nhưng một giá trị bằng 0 phải bị từ chối, không được tính ra ước lượng bằng 0 rồi coi là hợp lệ. |

**Ra (mọi simulator):** một dòng quyết định tất định, dạng `"<decision>: <reason>"` với
`decision` thuộc bộ từ vựng cố định của từng unit nêu trong bảng trên (tiếng Việt không dấu, gạch
nối, ví dụ `tu-choi`, `ket-qua`, `can-lam-ro`).

**Ca lỗi (áp dụng chung cả tám unit, là một phần hợp đồng):**

| Tình huống                                                               | Cổng phát hiện                                                     | Hành vi mong đợi                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------ |
| Unit id trùng hoặc chưa có trong curriculum                              | `curriculum.test.ts`, `stageUnits.test.ts`                         | CI đỏ, không merge                         |
| Code mẫu, Predict hoặc Make sai                                          | `lessonsPython.test.ts`                                            | Chạy bằng Python thật và CI đỏ             |
| Make thiếu test hiện/ẩn hoặc thiếu ca âm                                 | `lessons.test.ts`, `algoS3Lessons.test.ts`/`algoS4Lessons.test.ts` | Test nội dung từ chối bài                  |
| DP/segment tree/Bloom/KMP lệch oracle nhưng không in seed/input tái hiện | `algoS3Lessons.test.ts`/`algoS4Lessons.test.ts`                    | CI đỏ, không chấp nhận lỗi "ngẫu nhiên"    |
| Dùng `hash()` built-in, `float ==`, `time.time()`, thread/process thật   | gate chuỗi cấm trong `lessonsPython.test.ts` hoặc semantic gate    | CI đỏ với thông báo cụ thể chuỗi bị cấm    |
| Negative control (bản cài lỗi cố ý) không bị bắt                         | `algoS3Lessons.test.ts`/`algoS4Lessons.test.ts`                    | CI đỏ — chứng minh harness không xanh rỗng |
| Nội dung/SRS sai schema hoặc tự lộ đáp án                                | `lessons.test.ts`, `srsCards.test.ts`                              | CI đỏ                                      |

## ④ Tiêu chí chấp nhận

- [ ] Có đúng tám unit mới (`algo-s3`: 4, `algo-s4`: 4) và đúng mười sáu lesson; mỗi unit hai
      lesson, không id trùng, không tái dùng id `algo-s1`/`algo-s2`.
- [ ] Tám module gốc phủ một-một theo thứ tự m1 → m4 của mỗi chặng, khớp `algo.ts` và
      `details/algo-s3.ts`/`details/algo-s4.ts`.
- [ ] Mọi worked example, Predict và Make chạy bằng Python thật; mỗi Make có visible + hidden
      test, gồm ca biên và ĐÚNG một ca âm (negative control) theo bảng ③.
- [ ] `p6-u226` DP bottom-up khớp tuyệt đối oracle đệ quy vét cạn trên ≥100 ca random có seed;
      bản DP thiếu transition bị bắt sai.
- [ ] `p6-u227` KMP khớp brute-force substring; bản chỉ dùng một hash bị bắt sai trên dữ liệu va
      chạm cố ý.
- [ ] `p6-u228` không dùng `float` cho kiểm tra giao đoạn thẳng; sàng nguyên tố đối chứng đúng
      trên toàn miền nhỏ; nghịch đảo mô-đun từ chối đúng khi không tồn tại.
- [ ] `p6-u229` segment tree lazy và sparse table đối chứng đúng thao tác mảng thô trên ≥100 chuỗi
      thao tác random có seed; bản quên push-down bị bắt sai.
- [ ] `p6-u230` không gọi `hash()` built-in; tỉ lệ báo nhầm Bloom filter đo trên ≥5 seed nằm trong
      dung sai đã khai; không có âm tính giả so với `set` chuẩn.
- [ ] `p6-u231` khoảng cách tới cận trên tính được cho mọi ca; ca vượt trần oracle khai rõ
      `khong-kiem-tra-toi-uu`; bản bỏ cải thiện cục bộ cho kết quả xấu hơn đo được.
- [ ] `p6-u232` không gọi `time.time()`/`perf_counter()`/thread/process thật; quyết định
      row-major/column-major và cân bằng tải đều bằng đếm số học tất định.
- [ ] `p6-u233` phát hiện đúng trường thiếu đầu tiên theo thứ tự cố định; từ chối tham số `<=0`,
      không tính ra ước lượng 0 rồi coi là hợp lệ.
- [ ] `unitsOfStage('algo-s3')` trả đúng `p6-u226..p6-u229`; `unitsOfStage('algo-s4')` trả đúng
      `p6-u230..p6-u233`. UI không còn ghi hai chặng này là "đang soạn".
- [ ] Không có dependency, API, migration, dữ liệu người học hoặc thay đổi quiz/rubric mới.

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/algoS3Lessons.test.ts
npx vitest run packages/subject-programming/algoS4Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npx vitest run packages/subject-programming/lessonsLazy.test.ts
npm run typecheck
npm run lint
npm run format:check
npm run test:coverage
npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                                                                | Test canh                                                    |
| ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Mọi bài khớp `LessonSchema`, unit tồn tại và Make có ca hiện/ẩn                                         | `lessons.test.ts`                                            |
| Python mẫu/đáp án/test-case chạy thật                                                                   | `lessonsPython.test.ts`                                      |
| Oracle và lời giải tối ưu/heuristic cùng hợp đồng input/output                                          | `algoS3Lessons.test.ts`, `algoS4Lessons.test.ts`             |
| Ngẫu nhiên nhận seed, kết quả tái hiện được và có negative control                                      | `algoS3Lessons.test.ts`, `algoS4Lessons.test.ts`             |
| Không dùng `hash()` built-in, `float ==`, thời gian tường hoặc thread/process thật trong code chạy được | gate chuỗi cấm trong `lessonsPython.test.ts`/semantic gate   |
| Unit không thuộc hai stage và stage chỉ trỏ tới unit có bài                                             | `stageUnits.test.ts`                                         |
| Curriculum giữ id duy nhất và thứ tự ổn định                                                            | `curriculum.test.ts`                                         |
| Lazy registry đồng bộ với registry nguồn                                                                | `lessonsLazy.test.ts`, lệnh sinh index                       |
| SRS hỏi một ý, không lộ đáp án, nội dung đủ nghĩa                                                       | `srsCards.test.ts`                                           |
| Id lộ trình/phase/stage/module/quiz cũ không đổi                                                        | `learningPaths.test.ts` (nếu có chạm), quiz test             |
| Rubric 80/15/5 và cờ `crossCutting` của hướng thuật toán không đổi                                      | review `details/algo-s3.ts`, `details/algo-s4.ts`, `algo.ts` |

## ⑥ Quy ước dự án liên quan

- Nội dung giải thích bằng tiếng Việt; code Python dùng tên không dấu, rõ nghĩa và hàm thuần
  (không side effect ngoài giá trị trả về/in một dòng quyết định).
- Không lấy một lần đo thời gian làm chứng minh — cả `p6-u232` lẫn phần "đo trước khi tối ưu" của
  `algo-s4-r1`/`algo-s4-m3` đều dùng bộ đếm phép toán/khối nhớ, không dùng đồng hồ tường trong
  code chạy được; benchmark thời gian thật chỉ nằm ở hoạt động homework quan sát, ngoài sandbox.
- Predict chỉ có đúng một đáp án; lựa chọn nhiễu không được là chuỗi con gây khớp giả.
- Make không đọc file, mạng, thời gian hệ thống hoặc random không seed; mọi random dùng
  `random.Random(seed)` tường minh, không đọc random toàn cục.
- Differential/oracle test so giá trị trả về đã chuẩn hoá, không so text trang trí; gặp lệch phải
  dừng và in seed cùng input nhỏ nhất đã gặp để điều tra được (cùng quy ước `algo-s1`/`algo-s2`).
- Miền dữ liệu của oracle vét cạn bị chặn đủ nhỏ để toàn bộ visible/hidden test hoàn tất trong
  timeout hiện có; lời giải nhanh (DP/segment tree/Bloom/heuristic) vẫn phải xử lý đúng rỗng, một
  phần tử, trùng lặp và giá trị biên đã nêu trong bảng ③.
- Mỗi bài nối với một lỗi thực tế cụ thể: DP thiếu transition, hash đơn bị va chạm cố ý, so sánh
  `float` sai ngưỡng, quên push-down, false positive Bloom filter không kiểm soát, heuristic thiếu
  bước cải thiện, chia tải lệch, hoặc bắt tay vào code trước khi làm rõ đề.
- Import xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi `.js`; import nội bộ gói dùng đường tương
  đối CÓ đuôi `.js`.
- Thêm/đổi bài học xong **bắt buộc** chạy `npm run gen:lesson-index`; quên thì `lessonsLazy.test.ts`
  đỏ với đúng câu nhắc đó.
- Make dùng `match: 'contains'` (runner echo stdin, so khớp tuyệt đối sẽ đỏ giả).
- Cổng test của CI là `npm run test:coverage` (có ngưỡng chặn), không phải `npm test`.
- Trước lần push cuối: `rm -rf packages/*/dist dist dist-server` rồi chạy lại `npm run typecheck`
  để tái hiện checkout sạch của CI.
- Tiêu đề PR dùng scope chữ thường, ví dụ `feat(programming): ...`; mô tả phải có đủ 6 tiêu đề của
  cổng `metadata` và trỏ tới chính file đặc tả này kèm cụm "Approved for implementation" — CHỈ khi
  chủ dự án đã thật sự duyệt (xem mục ⑧), không tự đổi trạng thái file đặc tả.

## ⑦ Rollout và rollback

1. Thêm tám unit và mười sáu lesson nhưng chưa ánh xạ stage; chạy `lessonsPython.test.ts` và hai
   semantic gate `algoS3Lessons.test.ts`/`algoS4Lessons.test.ts` tới khi xanh, gồm mọi negative
   control.
2. Sinh lại `lessonsLazy.ts`, kiểm registry nguồn–lazy đồng bộ.
3. Cuối cùng mới thêm `SPEC_STAGE_UNITS['algo-s3']` và `['algo-s4']` cùng test thứ tự — điểm làm
   nút "Vào học" xuất hiện, cùng khuôn `algo-s1`.
4. Chạy toàn bộ cổng ở mục ④; PR source chỉ merge khi `quality` và `e2e` bắt buộc xanh.
5. Có thể tách thành hai PR (một cho `algo-s3`, một cho `algo-s4`) hoặc gộp một PR — không ảnh
   hưởng tới hợp đồng vì hai chặng độc lập nhau, không unit nào phụ thuộc chặng kia.

**Rollback:**

- Lỗi trước merge: bỏ riêng thay đổi source của lát cắt, không sửa metadata/quiz/rubric đã phát
  hành và không thu hồi dải id cho lát cắt khác.
- Lỗi sau merge: revert PR source trọn lát cắt để xoá ánh xạ `algo-s3`/`algo-s4`, tám unit, mười
  sáu lesson và chỉ mục lazy sinh tương ứng; không xoá dữ liệu người học vì lát cắt không tạo
  schema hay ghi authoritative state.
- Sau rollback, chạy lại `npm run gen:lesson-index`, test `stageUnits`/lesson và build để xác nhận
  stage trở về trạng thái chưa có bài mà các stage song song vẫn hoạt động.

## ⑧ Quyết định đã duyệt (chủ dự án, 2026-09-21)

**Chủ dự án đã DUYỆT TOÀN BỘ các mục dưới đây ngày 2026-09-21** (một lượt duyệt chung cho
cả sáu đặc tả của đợt lấp 19 chặng P6). Ba quyết định xuyên suốt:

1. ✅ **Khoá dải unit id**: `algo-s3` = `p6-u226…u233` (algo-s3 = u226–u229, algo-s4 = u230–u233). Dải này đã được đối chiếu bằng máy với toàn bộ
   id đã phát hành và với năm đặc tả còn lại của cùng đợt — rời nhau tuyệt đối, không
   đụng dải cao nhất cũ (`p6-u213`).
2. ✅ **KHÔNG nối các chặng của lát cắt này vào bất kỳ `learningPaths/*.ts` nào.** Hướng
   đứng độc lập, học viên vào qua trang hướng chuyên sâu. Lý do: khác `devops-s3` (chỉ
   thêm một chặng vào lộ trình đang chạy), ở đây phải quyết cho nhiều chặng liên tiếp
   cùng lúc, đổi mẫu số tiến độ hiển thị ngay từ chặng đầu. Nếu sau này muốn nối thì
   làm ở một đợt riêng, có đặc tả riêng.
3. ✅ **Nhịp PR** theo đúng đề xuất ở mục ⑦ của chính đặc tả này.

Các quyết định riêng của lát cắt (nếu mục dưới còn liệt kê) cũng được duyệt theo đúng
phương án mà đặc tả đề xuất mặc định.

### Danh sách gốc các mục đã đưa ra duyệt

1. **Cấp dải id `p6-u226..p6-u229` cho `algo-s3` và `p6-u230..p6-u233` cho `algo-s4`.** Đã kiểm
   không trùng với mọi unit id hiện có trong `stageUnits.ts`/`lessons.ts` (`grep` không ra kết
   quả) tại thời điểm viết đặc tả này (2026-09-21); nếu có lát cắt khác chiếm dải này trước khi
   PR source mở, cần cấp lại.
2. **Có nối `algo-s3`/`algo-s4` vào một lộ trình (vd `principal-ai`) hay để hai chặng đứng độc
   lập, chỉ truy cập qua trang hướng chuyên sâu?** `algo-s1`/`algo-s2` đã có mặt trong
   `principal-ai-p4` (`packages/subject-programming/learningPaths/principal-ai.ts` dòng 44, 49);
   nếu nối thêm hai chặng này, mẫu số tiến độ của lộ trình đó sẽ đổi — cần xác nhận trước khi thêm
   `PathStageRef` mới, cùng cách `devops-s3` đã xin duyệt riêng mục này.
3. **Tách một PR hay hai PR** cho `algo-s3` và `algo-s4` (mục ⑦ bước 5) — không ảnh hưởng hợp
   đồng kỹ thuật, chỉ ảnh hưởng nhịp review; đề xuất một PR vì cả hai đều nhỏ (4 unit) và cùng một
   nhật ký changelog sẽ gọn hơn, nhưng để chủ dự án chọn.
4. **Dung sai chấp nhận cho tỉ lệ báo nhầm Bloom filter** ở `p6-u230` (bảng ③) — đề xuất ±20% so
   với công thức lý thuyết `(1 - e^(-kn/m))^k` trên ≥5 seed, nhưng con số cụ thể cần chủ dự án
   chốt để tránh test flaky do phương sai thống kê ở seed nhỏ.

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ: artifact rubric 80/15/5 và mười kỳ thi thật của `algo-s3`, tối ưu hệ thống thật ×10
  lần của `algo-s4` — hai artifact này KHÔNG nằm trong phạm vi đặc tả này.
