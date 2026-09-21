# Đặc tả — Bài học thật cho hướng `game`, trọn bốn chặng S1–S4

> Ngày: 2026-09-21 · Trạng thái: **APPROVED FOR IMPLEMENTATION** (chủ dự án duyệt ngày 2026-09-21)
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`. Tham khảo cấu trúc:
> `docs/specs/2026-09-17-devops-s3-bai-hoc-that.md`,
> `docs/specs/2026-09-16-systems-s1-bai-hoc-that.md`,
> `docs/specs/2026-09-17-security-s3-bai-hoc-that.md`.

## 0. Một câu

Hướng `game` (`packages/subject-programming/specializations/game.ts`) có bản đồ 4 chặng ×
4 module đầy đủ nhưng KHÔNG unit bài học nào — học viên chọn hướng này gặp mảng rỗng; đặc tả
này lấp cả bốn chặng bằng 16 unit / ≥ 32 lesson Python mô phỏng tất định (vòng lặp, va chạm,
ECS, vật lý bước cố định, AI, đường ống dựng hình, ngân sách khung hình, mạng chơi nhiều
người) — phần cần Godot/Unity/GPU/shader/thiết bị thật chỉ nằm ở rubric bài tập về nhà, KHÔNG
chạy trong sandbox.

## ① Phạm vi

**LÀM:**

- 16 unit mới, dải id đã cấp tạm (chờ duyệt ở mục ⑧):
  - `game-s1` → `p6-u242, p6-u243, p6-u244, p6-u245` (bám `game-s1-m1..m4`)
  - `game-s2` → `p6-u246, p6-u247, p6-u248, p6-u249` (bám `game-s2-m1..m4`)
  - `game-s3` → `p6-u250, p6-u251, p6-u252, p6-u253` (bám `game-s3-m1..m4`)
  - `game-s4` → `p6-u254, p6-u255, p6-u256, p6-u257` (bám `game-s4-m1..m4`)
- Mỗi unit ứng đúng MỘT module của chặng (không gộp — bốn module của `game` không trùng lặp
  chủ đề như một số hướng khác từng gộp m3+m4), mỗi unit ≥ 2 lesson theo vòng 8 bước hiện có
  (hook, theory, worked example, Predict, Parsons, Make, homework, thẻ SRS).
- Simulator Python thuần, tất định, bounded, fail closed cho từng cơ chế của module (bảng chi
  tiết ở mục ③). Mỗi Make có ca hiện + ca ẩn + **ca âm**; output là một dòng
  `"<decision>: <reason>"`.
- Nối `SPEC_STAGE_UNITS['game-s1'..'game-s4']`, `lessons.ts` (registry đồng bộ),
  `curriculum.ts` (bậc P6), sinh lại `lessonsLazy.ts` bằng `npm run gen:lesson-index`.
- Semantic gate riêng cho từng lát cắt PR (mục ⑦): `gameS1S2Lessons.test.ts` và
  `gameS3S4Lessons.test.ts`.
- Homework của mỗi unit phải trỏ rõ artifact ngoài sandbox tương ứng (Godot/Unity thật, chạy
  đo FPS thật, dựng server thật…) và ghi nhãn "MÔ PHỎNG" cho phần chạy trong sandbox — theo
  đúng khuôn đã dùng ở `systems-s1` cho phần C thật.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- Không chạy Godot, Unity, bất kỳ engine đồ hoạ, GPU, shader thật, driver, hay thiết bị/tay
  cầm thật. Không dựng WebGL/WebGPU canvas thật trong bài — mọi "khung hình" là số nguyên đếm
  bước, mọi "shader" là hàm Python tính chi phí mili-giây khai báo trước, không render pixel
  thật.
- Không network, filesystem, subprocess, biến môi trường, `datetime.now`, đồng hồ hệ thống,
  hay `random` toàn cục không seed trong code chạy được — mọi ngẫu nhiên (sinh nội dung thủ
  tục, AI, matchmaking) phải qua `random.Random(seed)` cục bộ truyền tường minh.
- Không mô phỏng mạng thật (socket, độ trễ thật) — độ trễ và mất gói ở `game-s4-m1` là tham số
  đầu vào cố định của hàm thuần, không phải I/O mạng thật.
- Không đụng hướng/chặng khác đã có bài (`web-*`, `backend-*`, `devops-*`…), không tái dùng
  unit id đã phát hành ở hướng khác.
- Không hứa simulator là "engine thật" hay "profiler thật" — nhãn MÔ PHỎNG bắt buộc trong tên
  hàm/docstring/nội dung lesson.
- Không quyết định nối `game-s1..s4` vào một lộ trình (`learningPaths/`) nào — hướng `game`
  hiện không nằm trong bất kỳ `learningPaths/*.ts` nào (đã kiểm bằng `grep`), khác
  `devops-s3` vốn là module dùng chung của lộ trình `principal-ai`. Quyết định có/không nối
  và nối vào đâu để ở mục ⑧.

## ② Điểm chạm

| Việc | Đường dẫn file                                               | Ghi chú                                                    |
| ---- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u242.ts`             | `game-s1-m1` Vòng lặp game                                 |
| Thêm | `packages/subject-programming/lessons/p6u243.ts`             | `game-s1-m2` Toán cho game                                 |
| Thêm | `packages/subject-programming/lessons/p6u244.ts`             | `game-s1-m3` Cảm giác chơi                                 |
| Thêm | `packages/subject-programming/lessons/p6u245.ts`             | `game-s1-m4` Tài nguyên và phát hành                       |
| Thêm | `packages/subject-programming/lessons/p6u246.ts`             | `game-s2-m1` Kiến trúc (ECS/data-driven)                   |
| Thêm | `packages/subject-programming/lessons/p6u247.ts`             | `game-s2-m2` Vật lý bước cố định                           |
| Thêm | `packages/subject-programming/lessons/p6u248.ts`             | `game-s2-m3` AI trong game                                 |
| Thêm | `packages/subject-programming/lessons/p6u249.ts`             | `game-s2-m4` Nội dung và công cụ                           |
| Thêm | `packages/subject-programming/lessons/p6u250.ts`             | `game-s3-m1` Đường ống dựng hình                           |
| Thêm | `packages/subject-programming/lessons/p6u251.ts`             | `game-s3-m2` Shader (ngân sách, không GLSL thật)           |
| Thêm | `packages/subject-programming/lessons/p6u252.ts`             | `game-s3-m3` Hiệu năng (ngân sách khung hình)              |
| Thêm | `packages/subject-programming/lessons/p6u253.ts`             | `game-s3-m4` 3D nền tảng (quaternion, animation blend)     |
| Thêm | `packages/subject-programming/lessons/p6u254.ts`             | `game-s4-m1` Mạng trong game                               |
| Thêm | `packages/subject-programming/lessons/p6u255.ts`             | `game-s4-m2` Công cụ và quy trình đội                      |
| Thêm | `packages/subject-programming/lessons/p6u256.ts`             | `game-s4-m3` Thiết kế trò chơi có số liệu                  |
| Thêm | `packages/subject-programming/lessons/p6u257.ts`             | `game-s4-m4` Phát hành thương mại                          |
| Thêm | `packages/subject-programming/gameS1S2Lessons.test.ts`       | Semantic gate PR1 (S1+S2)                                  |
| Thêm | `packages/subject-programming/gameS3S4Lessons.test.ts`       | Semantic gate PR2 (S3+S4)                                  |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts` | Thêm 4 khoá `game-s1..game-s4`                             |
| Sửa  | `packages/subject-programming/lessons.ts`                    | Đăng ký 16 unit vào registry đồng bộ                       |
| Sửa  | `packages/subject-programming/curriculum.ts`                 | Gắn 16 unit vào bậc P6                                     |
| Sửa  | `packages/subject-programming/lessonsLazy.ts`                | **SINH LẠI** bằng `npm run gen:lesson-index`, không gõ tay |

**Ảnh hưởng lan ra (chạy `npm run codemap -- impact packages/subject-programming/specializations/stageUnits.ts` trước khi sửa mỗi PR):**

- `stageUnits.test.ts` (kiểm chéo curriculum ↔ lessons), `lessonsLazy.test.ts`,
  `lessonsPython.test.ts`, `specializations.test.ts`.
- Trang chọn/xem chặng hướng `game` (route qua `programmingRoutes.ts` + trang chặng chung của
  môn Lập trình) tự hiện nút "Vào học" khi `unitsOfStage('game-sN')` khác rỗng — không có
  route/props nào cần sửa tay, nhưng test UI liên quan (nếu có) phải được đọc lại để xác nhận
  số liệu đếm chặng có bài không đổi ý nghĩa.
- `game` hiện KHÔNG xuất hiện trong `learningPaths/*.ts` (đã `grep` xác nhận) nên không có
  mẫu số tiến độ lộ trình nào bị ảnh hưởng, trừ khi mục ⑧ quyết định nối vào một lộ trình.

## ③ Hợp đồng dữ liệu

**Vào (hằng biên dịch trong `stageUnits.ts`):**

```ts
const GAME_S1_UNIT_IDS = ['p6-u242', 'p6-u243', 'p6-u244', 'p6-u245'] as const
const GAME_S2_UNIT_IDS = ['p6-u246', 'p6-u247', 'p6-u248', 'p6-u249'] as const
const GAME_S3_UNIT_IDS = ['p6-u250', 'p6-u251', 'p6-u252', 'p6-u253'] as const
const GAME_S4_UNIT_IDS = ['p6-u254', 'p6-u255', 'p6-u256', 'p6-u257'] as const
SPEC_STAGE_UNITS['game-s1'] = [...GAME_S1_UNIT_IDS]
SPEC_STAGE_UNITS['game-s2'] = [...GAME_S2_UNIT_IDS]
SPEC_STAGE_UNITS['game-s3'] = [...GAME_S3_UNIT_IDS]
SPEC_STAGE_UNITS['game-s4'] = [...GAME_S4_UNIT_IDS]
```

**Hợp đồng từng unit** (mọi cơ chế "thời gian" là số nguyên/hữu tỉ bước, không đồng hồ thật;
mọi "khung hình", "mili-giây" là tham số khai báo, không đo thật):

| Unit      | Module                                | Hợp đồng simulator và ca biên BẮT BUỘC                                                                                                                                                                                                                                                                                                                                                                                            |
| --------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u242` | `game-s1-m1` Vòng lặp game            | Cập nhật vị trí = `velocity * dt` (không hằng số cộng thẳng); máy trạng thái nhân vật (idle/run/jump/duck) với bảng chuyển tiếp hợp lệ. Chuyển tiếp không có trong bảng → `deny`; `dt <= 0` hoặc `dt` phi số → `invalid`; nhập liệu qua lớp trung gian trả về hành động trừu tượng, không đọc mã phím thẳng → phím lạ không khai báo → `unknown`.                                                                                 |
| `p6-u243` | `game-s1-m2` Toán cho game            | Vector chuẩn hoá trước khi nhân tốc độ (chéo không nhanh hơn thẳng); AABB × AABB và circle × circle; camera lerp có hệ số `t ∈ [0,1]`. Vector độ dài 0 chuẩn hoá → `invalid` (không chia 0); `t` ngoài `[0,1]` → `clamp` + cảnh báo; hai AABB chồng lấn trên mọi trục → `hit`, một trục tách → `miss`.                                                                                                                            |
| `p6-u244` | `game-s1-m3` Cảm giác chơi            | Tham số hoá gia tốc/ma sát/lực nhảy; coyote time = cửa sổ khung hình còn nhảy được sau khi rời mép; jump buffer = cửa sổ nhớ lệnh nhảy bấm sớm. Nhảy trong cửa sổ coyote → `allow`; ngoài cửa sổ và không đứng đất → `deny`; cửa sổ cấu hình âm hoặc bằng 0 → `invalid`.                                                                                                                                                          |
| `p6-u245` | `game-s1-m4` Tài nguyên và phát hành  | Đóng gói atlas (tổng kích thước ảnh rời so với ngân sách atlas) và bản lưu điểm cao có số phiên bản. Vượt ngân sách atlas → `reject`; bản lưu đọc bởi phiên bản mới hơn → `migrate` theo bảng nâng cấp khai báo; phiên bản bản lưu không nhận dạng được → `deny` (fail closed, không đoán).                                                                                                                                       |
| `p6-u246` | `game-s2-m1` Kiến trúc                | Hệ thống chạy theo thứ tự cố định trên tập thành phần entity (data-driven, không kế thừa cứng); thêm loại entity chỉ bằng dữ liệu. Entity thiếu thành phần hệ thống cần đọc → hệ thống bỏ qua entity đó, không lỗi; hai hệ thống cùng ghi một thành phần trong cùng bước → `deny` (vi phạm "hệ thống chỉ ghi thành phần đã khai báo").                                                                                            |
| `p6-u247` | `game-s2-m2` Vật lý                   | Bước vật lý cố định (fixed timestep) tách khỏi bước vẽ; phát lại (replay) từ hạt giống + chuỗi input phải khớp hash trạng thái cuối. Bước thời gian thay đổi theo tốc độ máy giả lập → vẫn ra cùng hash → `match`; replay lệch hash → `mismatch`; thiếu hạt giống hoặc chuỗi input rỗng → `invalid`.                                                                                                                              |
| `p6-u248` | `game-s2-m3` AI trong game            | Máy trạng thái/cây hành vi kẻ địch chỉ đọc dữ liệu trong "tầm quan sát" khai báo (vị trí, tường chắn tầm nhìn); tìm đường A\* trên lưới. AI đọc trường dữ liệu ngoài tầm quan sát (ví dụ vị trí người chơi khi bị tường chắn) → `deny` (gian lận, fail closed); không có đường đi trên lưới → `unreachable`, không crash.                                                                                                         |
| `p6-u249` | `game-s2-m4` Nội dung và công cụ      | Định dạng màn chơi có số phiên bản; validator chặn màn thiếu lối đi lúc lưu; sinh nội dung thủ tục dùng `random.Random(seed)` cục bộ. Màn không có đường từ điểm vào tới điểm ra → `reject` ngay lúc lưu; nạp tệp phiên bản không nhận dạng được → `deny`; cùng seed sinh hai lần → kết quả giống hệt → khác `mismatch`.                                                                                                          |
| `p6-u250` | `game-s3-m1` Đường ống dựng hình      | Đếm/gộp lô lệnh vẽ theo vật liệu; luật thứ tự vẽ (đục trước, trong suốt sau theo khoảng cách xa→gần). Vẽ trong suốt trước đục hoặc gần trước xa → `reject` (vi phạm thứ tự); gộp lô làm đổi tập vật liệu hiển thị → `invalid` (gộp phải giữ nguyên hình ảnh).                                                                                                                                                                     |
| `p6-u251` | `game-s3-m2` Shader (ngân sách)       | Hàm "shader" khai báo chi phí mili-giây cố định theo số điểm ảnh/đỉnh xử lý; kiểm tổng chi phí so với ngân sách khung hình. Một shader vượt ngân sách riêng đã khai báo → `exceed`; tổng nhiều shader vượt ngân sách khung hình còn lại sau CPU → `deny`; biến "đồng nhất" bị gán theo từng đỉnh (nhầm loại biến) → `invalid`.                                                                                                    |
| `p6-u252` | `game-s3-m3` Hiệu năng                | Chia ngân sách 16,6ms cho CPU/GPU; cắt tỉa vật ngoài tầm nhìn trước khi tính LOD theo khoảng cách. Vật ngoài tầm nhìn → `cull` (không tính LOD); vật trong tầm nhìn chọn đúng mức LOD theo ngưỡng khoảng cách khai báo → `render(lod=k)`; tổng thời gian CPU+GPU một khung vượt ngân sách → `deny` + báo bên nào vượt.                                                                                                            |
| `p6-u253` | `game-s3-m4` 3D nền tảng              | Quaternion cho phép quay (không Euler, tránh gimbal lock); hoà trộn hoạt ảnh có hệ số thời gian. Chuẩn quaternion khác 1 quá sai số cho phép → `invalid` (phải chuẩn hoá trước khi dùng); hoà trộn giữa hai clip không cùng hệ xương khai báo → `reject`; hệ số hoà trộn ngoài `[0,1]` → `clamp`.                                                                                                                                 |
| `p6-u254` | `game-s4-m1` Mạng trong game          | Server là nguồn quyết định duy nhất; client gửi Ý ĐỊNH kèm số thứ tự (sequence), server xác thực trước khi áp dụng; độ trễ là tham số cố định truyền vào hàm hoà giải. Ý định có sequence lùi so với đã xử lý → `reject` (chống replay); ý định vượt giới hạn vật lý khai báo (ví dụ dịch chuyển quá xa trong một bước) → `deny` (chống gian lận); server luôn `allow`/`deny`, không bao giờ client tự quyết.                     |
| `p6-u255` | `game-s4-m2` Công cụ và quy trình đội | Build pipeline mô phỏng: mỗi bước (biên dịch, đóng gói, kiểm tra) trả trạng thái; asset lớn được gắn cờ "phải qua kho tệp lớn" theo ngưỡng kích thước. Asset vượt ngưỡng nhưng không gắn cờ kho tệp lớn → `deny`; một bước pipeline lỗi → các bước sau không chạy, trả `blocked: <bước>`; toàn bộ bước qua → `pass`.                                                                                                              |
| `p6-u256` | `game-s4-m3` Thiết kế có số liệu      | Tính tỉ lệ bỏ cuộc theo màn từ dữ liệu lượt chơi; mô phỏng kinh tế trong game qua các bước rời rạc; rà cơ chế kiếm tiền theo danh sách tiêu chí "gây áp lực tâm lý" (đếm ngược ép mua, ẩn giá thật bằng tiền ảo nhiều lớp…). Cơ chế khớp ≥ 1 tiêu chí bóc lột đã khai báo → `refuse`; mẫu lượt chơi rỗng hoặc dưới ngưỡng tối thiểu → `unknown`, cấm quy về 0%; kinh tế mô phỏng vượt trần lạm phát khai báo sau N bước → `deny`. |
| `p6-u257` | `game-s4-m4` Phát hành thương mại     | Checklist yêu cầu kỹ thuật nền tảng (kích thước build, tỉ lệ khung hình tối thiểu, có tuỳ chọn trợ năng…); kiểm độ dài chuỗi đã bản địa hoá so với khung UI khai báo. Thiếu ≥ 1 mục checklist bắt buộc → `reject`; chuỗi dịch vượt độ dài khung UI → `overflow`; đủ checklist và không chuỗi nào tràn → `pass`.                                                                                                                   |

**Ra (mọi simulator):** một dòng quyết định xác định, dạng `"<decision>: <reason>"` với
`decision ∈ {allow, deny, reject, refuse, invalid, unknown, clamp, migrate, match, mismatch,
hit, miss, cull, render, exceed, unreachable, blocked, pass, overflow}` — mỗi unit chỉ dùng
tập con liên quan (khai trong docstring của lesson, không dùng lẫn từ unit khác).

**Ca lỗi (là một phần hợp đồng, không phải phụ lục):**

| Tình huống                                                      | Mã / hành vi | Hành vi mong đợi                                                     |
| --------------------------------------------------------------- | ------------ | -------------------------------------------------------------------- |
| Input rỗng, thiếu trường, sai kiểu                              | `invalid`    | In một dòng `invalid: <trường>`, không ném exception, không treo     |
| Mẫu/dữ liệu ít hơn ngưỡng tối thiểu                             | `unknown`    | Trả `unknown`, **cấm** quy về 0/mặc định coi như "ổn"                |
| Hai luật mâu thuẫn (ví dụ hai hệ thống cùng ghi một thành phần) | `deny`       | Thứ tự ưu tiên tường minh, tất định; không phụ thuộc thứ tự dict/set |
| Trạng thái/phiên bản không nhận dạng được                       | `deny`       | Fail closed, không đoán hoặc nội suy                                 |
| Client gửi hành động vượt giới hạn vật lý (chỉ `p6-u254`)       | `deny`       | Server không bao giờ áp dụng, không có nhánh "tin tạm rồi sửa sau"   |

## ④ Tiêu chí chấp nhận

- [ ] `unitsOfStage('game-s1'|'game-s2'|'game-s3'|'game-s4').length === 4`, mỗi unit ≥ 2 lesson —
      `npx vitest run packages/subject-programming/specializations/stageUnits.test.ts`
- [ ] 32 lesson đều là làn `python`, đều có Make với ca hiện + ca ẩn + ca âm —
      `npx vitest run packages/subject-programming/gameS1S2Lessons.test.ts packages/subject-programming/gameS3S4Lessons.test.ts`
- [ ] Code mẫu và ca Predict chạy Python THẬT và qua toàn bộ test-case —
      `npx vitest run packages/subject-programming/lessonsPython.test.ts`
- [ ] Không lesson nào chỉ "đọc hiểu": mỗi unit có đủ hỗn hợp predict / debug / build / measure / decide
- [ ] Executable code không có `import os`, `import sys`, `open(`, `socket`, `subprocess`,
      `requests`, `random.random()`/`random.seed()` toàn cục (chỉ cho phép `random.Random(seed)`
      cục bộ ở `p6-u249`), `datetime.now` — gate kiểm bằng chuỗi cấm
- [ ] Markers bắt buộc xuất hiện theo unit: `delta time`/`dt`, `coyote`, `AABB`, `fixed timestep`,
      `hash`, `tầm quan sát`, `A*`, `seed`, `draw call`, `ngân sách`, `LOD`, `quaternion`,
      `sequence`, `server`, `chống gian lận`, `bỏ cuộc`, `bản địa hoá`
- [ ] `unitsOfStage('game-sN')` tra được cho cả 4 chặng, không unit id nào trùng dải đã cấp ở
      hướng khác — `npx vitest run packages/subject-programming/specializations.test.ts`
- [ ] `lessonsLazy.ts` được SINH LẠI, không sửa tay — `npm run gen:lesson-index` rồi `git diff`
      chỉ hiện phần sinh
- [ ] Make dùng `match: 'contains'` (runner echo stdin, so khớp tuyệt đối sẽ đỏ giả)
- [ ] Mỗi unit có ≥ 1 mục homework trỏ rõ artifact ngoài sandbox (Godot/Unity/GPU/thiết bị
      thật) và không lesson nào tự nhận simulator là engine/profiler thật

**Lệnh chứng minh (chạy đủ sau khi cả hai PR gộp; PR1 chỉ chạy phần S1+S2):**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/gameS1S2Lessons.test.ts
npx vitest run packages/subject-programming/gameS3S4Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npx vitest run packages/subject-programming/lessonsLazy.test.ts
npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                                         | Test nào canh nó                                            |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Chỉ khai chặng có bài khi unit thật đã tồn tại                                   | `specializations/stageUnits.test.ts`                        |
| Chỉ mục nạp lười khớp registry đồng bộ                                           | `lessonsLazy.test.ts`                                       |
| Mọi lesson Python có code mẫu chạy qua hết test-case                             | `lessonsPython.test.ts`                                     |
| Simulator không có I/O ngoài, không đọc đồng hồ thật, không mạng thật            | `gameS1S2Lessons.test.ts` / `gameS3S4Lessons.test.ts` (mới) |
| `game-s4-m1`: server luôn quyết, không nhánh nào để client tự áp dụng trạng thái | `gameS3S4Lessons.test.ts`                                   |
| `game-s2-m3`: AI không đọc trường ngoài tầm quan sát khai báo                    | `gameS1S2Lessons.test.ts`                                   |
| Không unit id nào trùng/tái dùng dải đã cấp ở hướng khác                         | `specializations.test.ts`, `curriculum.test.ts`             |

## ⑥ Quy ước dự án liên quan

- Import xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi `.js`; import nội bộ gói dùng đường
  tương đối CÓ đuôi `.js`.
- Thêm/đổi bài học xong **bắt buộc** chạy `npm run gen:lesson-index`; quên thì
  `lessonsLazy.test.ts` đỏ với đúng câu nhắc đó.
- Comment trong file bài học viết tiếng Việt, giải thích "vì sao", không mô tả lại code.
- Cổng test của CI là `npm run test:coverage` (có ngưỡng chặn), không phải `npm test`.
- Trước lần push cuối mỗi PR: `rm -rf packages/*/dist dist dist-server` rồi chạy lại
  `npm run typecheck` để tái hiện checkout sạch của CI.
- Tiêu đề PR dùng scope chữ thường, ví dụ `feat(programming): ...`; mô tả phải có đủ 6 tiêu đề
  của cổng `metadata` và trỏ tới chính file đặc tả này kèm cụm "Approved for implementation"
  (chỉ sau khi chủ dự án đã duyệt — xem mục ⑧).
- Nhãn "MÔ PHỎNG" và tên biến/hàm không được mượn tên thương hiệu thật (không gọi hàm là
  `unity_physics_step` hay tương tự) — tránh học viên hiểu nhầm đã dùng engine thật.

## ⑦ Rollout và rollback

**Vì đây là 4 chặng trong một lát cắt lớn (16 unit, 32 lesson), chia HAI PR theo đúng thứ tự
học (S1 → S2 → S3 → S4), không làm một PR khổng lồ:**

1. **PR1 — `game-s1` + `game-s2`** (`p6-u242…u249`, 8 unit, ≥16 lesson,
   `gameS1S2Lessons.test.ts`). Làm trước vì đây là nền: vòng lặp, toán, cảm giác chơi, kiến
   trúc ECS, vật lý bước cố định — mọi chặng sau đều giả định các khái niệm này đã có bài.
2. **PR2 — `game-s3` + `game-s4`** (`p6-u250…u257`, 8 unit, ≥16 lesson,
   `gameS3S4Lessons.test.ts`), mở SAU KHI PR1 đã merge. Đồ hoạ/hiệu năng và mạng nhiều người
   chơi là hai mảng chuyên sâu nhất, tách riêng để review không bị quá tải một lượt và để PR1
   có thể lên sản phẩm sớm dù PR2 còn đang sửa.

Mỗi PR tự chạy `npm run gen:lesson-index` trong chính PR đó (không gộp sinh index của cả 16
unit vào một lần) để `lessonsLazy.ts` luôn khớp đúng những gì PR đó thêm.

**Rollback:** revert trọn PR tương ứng rồi chạy lại `npm run gen:lesson-index`. Revert PR2
không ảnh hưởng PR1 (hai PR không sửa chung file lesson nào, chỉ cùng sửa `stageUnits.ts`/
`lessons.ts`/`curriculum.ts` — revert dùng diff theo dòng, không xoá nhầm khoá của PR kia).
KHÔNG xoá tiến độ/artifact của người học và KHÔNG tái sử dụng unit id đã cấp dù PR bị revert.
Rủi ro lớn nhất là học viên nhầm simulator với engine/mạng thật; nhãn MÔ PHỎNG, semantic gate
và rubric bài tập về nhà (yêu cầu dựng bằng Godot/Unity/mạng thật NGOÀI sandbox) là ba lớp
chặn, giống tiền lệ `systems-s1` ngăn nhầm mô phỏng C với gdb/Valgrind thật.

## ⑧ Quyết định đã duyệt (chủ dự án, 2026-09-21)

**Chủ dự án đã DUYỆT TOÀN BỘ các mục dưới đây ngày 2026-09-21** (một lượt duyệt chung cho
cả sáu đặc tả của đợt lấp 19 chặng P6). Ba quyết định xuyên suốt:

1. ✅ **Khoá dải unit id**: `game-s1…s4` = `p6-u242…u257`. Dải này đã được đối chiếu bằng máy với toàn bộ
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

1. **Cấp dải `p6-u242…u257` cho hướng `game`** (16 unit, đã kiểm bằng `grep` là chưa dùng ở
   bất kỳ hướng/chặng nào khác tại thời điểm viết đặc tả này — 2026-09-21).
2. **Có nối `game-s1..s4` vào một `learningPaths/*.ts` nào không?** Hướng `game` hiện KHÔNG
   xuất hiện trong lộ trình nào (`principal-ai`, `pathStages`…) — khác `devops-s3` vốn được
   nối thêm vào `principal-ai-p4` vì DevOps là hạ tầng dùng chung. Game là một hướng sản phẩm
   độc lập (giống `web`, `backend`), nên đề xuất mặc định là **KHÔNG nối vào lộ trình nào**,
   giữ nguyên là hướng chuyên sâu độc lập chọn qua trang chọn hướng — nhưng quyết định cuối
   thuộc chủ dự án.
3. **Duyệt việc chia 2 PR (S1+S2 rồi S3+S4)** thay vì 1 PR duy nhất cho cả 16 unit, hoặc 4 PR
   nhỏ theo từng chặng — đề xuất 2 PR để cân bằng giữa kích thước review và tốc độ lên sản
   phẩm (lý do nêu ở mục ⑦).
4. **Danh sách decision vocab dùng ở `p6-u256` (rà cơ chế kiếm tiền bóc lột)** — đây là chỗ
   duy nhất trong lát cắt này chấm một phán đoán có tính đạo đức/thiết kế (không thuần kỹ
   thuật như các unit khác); chủ dự án xác nhận danh sách tiêu chí "gây áp lực tâm lý" nêu ở
   mục ③ (đếm ngược ép mua, ẩn giá thật bằng tiền ảo nhiều lớp) là đủ và đúng hướng trước khi
   viết cứng vào ca kiểm của lesson.

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ:
