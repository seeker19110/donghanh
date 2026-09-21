# Đặc tả — `desktop-s1..s4`: bài học thật cho hướng chuyên sâu Desktop

> Ngày: 2026-09-21 · Trạng thái: **CHỜ CHỦ DỰ ÁN DUYỆT**
> Phạm vi: cả bốn chặng `desktop-s1..desktop-s4` — hướng `desktop` hiện có bản đồ (`specializations/desktop.ts`)
> và nội dung chi tiết (`specializations/details/desktop-s1..s4.ts`) nhưng CHƯA có bài học nào (`SPEC_STAGE_UNITS`
> không có khoá `desktop-*`).
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`, theo đúng cấu trúc `docs/specs/2026-09-17-devops-s3-bai-hoc-that.md`
> và `docs/specs/2026-09-16-systems-s1-bai-hoc-that.md`.

## 0. Một câu

Lấp trọn bốn chặng rỗng của hướng Desktop: mười sáu unit / ba mươi hai bài Python MÔ PHỎNG (vòng
đời cửa sổ, việc nền tách khỏi UI, lưu trữ có phiên bản, đồng bộ ngoại tuyến, quyền hệ thống, đóng
gói/ký/cập nhật có rollback) — không đụng Electron/Tauri/Qt/WinUI hay hệ điều hành thật, những thứ
đó chỉ nằm ở rubric bài tập về nhà ngoài sandbox.

## ① Phạm vi

**LÀM:**

- Mười sáu unit `p6-u274…p6-u289` (bốn unit mỗi chặng), mỗi unit hai lesson theo vòng 8 bước hiện
  có (`hook/theory/workedCode/predict*/makePrompt/testCases/sampleSolution/homework/cards`), bám
  đúng một-một bốn module của từng chặng trong `specializations/desktop.ts`.
- Simulator Python deterministic, bounded, fail closed cho từng cơ chế (chọn nền tảng, ghi tệp an
  toàn, migration lưu trữ, đóng gói/cập nhật, luồng nền, undo/redo, đồng bộ xung đột, chẩn đoán từ
  xa, dữ liệu lớn, khởi động/plugin, kiểm thử đa nền, cấp phép, cập nhật có rollback, bảo mật máy
  khách, hỗ trợ người dùng); mỗi Make có ca hiện + ca ẩn + **ca âm**.
- Nối `SPEC_STAGE_UNITS['desktop-s1'..'desktop-s4']`, đăng ký vào `lessons.ts`, gắn vào bậc P6 ở
  `curriculum.ts`, sinh lại `lessonsLazy.ts`.
- Bốn semantic gate riêng, một file test mỗi chặng (theo đúng khuôn `devopsS3Lessons.test.ts`):
  `desktopS1Lessons.test.ts` … `desktopS4Lessons.test.ts`.
- KHÔNG nối `desktop-*` vào bất kỳ `learningPaths/*.ts` nào trong PR này — hướng `desktop` hiện
  không được path nào tham chiếu (đã kiểm bằng `grep -rl "desktop-s" packages/subject-programming/learningPaths/*.ts`
  → rỗng); việc có nối vào lộ trình nào hay không để nguyên trạng "chặng chuyên sâu tra trực tiếp
  qua `specializations`", không tự quyết thêm — xem mục ⑧.

**KHÔNG LÀM (quan trọng ngang mục trên):**

- Không chạy Electron, Tauri, Qt, WinUI, `.NET` desktop runtime, trình cài đặt thật, ký mã thật
  hay bất kỳ hệ điều hành/cluster thật nào. Bài là MÔ PHỎNG hợp đồng quyết định trên mô hình đồ
  chơi, không phải lab đóng gói ứng dụng thật.
- Không network, filesystem thật, subprocess, biến môi trường, đồng hồ hệ thống (`datetime.now`)
  hay random toàn cục trong code chạy được — cùng ranh giới đã chốt ở `devops-s1..s3`/`systems-s1`.
- Không tái dùng hay đổi unit id đã phát hành của hướng khác; chỉ dùng đúng dải được cấp cho
  `desktop` dưới đây.
- Không thêm hệ plugin thật, không chạy trình cài đặt hay bộ cấp phép thật; tất cả là bảng quyết
  định có input/khoá/ngưỡng tường minh.
- Không hứa simulator là bằng chứng "app đã sẵn sàng bán" — nhãn MÔ PHỎNG bắt buộc, rubric bài tập
  về nhà mới là nơi yêu cầu chạy trên máy/hệ điều hành thật.

## ② Điểm chạm

| Việc | Đường dẫn file                                               | Ghi chú                                                    |
| ---- | ------------------------------------------------------------ | ---------------------------------------------------------- |
| Thêm | `packages/subject-programming/lessons/p6u274.ts`             | `desktop-s1-m1` Chọn nền tảng                              |
| Thêm | `packages/subject-programming/lessons/p6u275.ts`             | `desktop-s1-m2` Làm việc với tệp                           |
| Thêm | `packages/subject-programming/lessons/p6u276.ts`             | `desktop-s1-m3` Lưu trữ cục bộ                             |
| Thêm | `packages/subject-programming/lessons/p6u277.ts`             | `desktop-s1-m4` Đóng gói và cài đặt                        |
| Thêm | `packages/subject-programming/lessons/p6u278.ts`             | `desktop-s2-m1` Đa luồng trong ứng dụng GUI                |
| Thêm | `packages/subject-programming/lessons/p6u279.ts`             | `desktop-s2-m2` Trải nghiệm chuyên nghiệp                  |
| Thêm | `packages/subject-programming/lessons/p6u280.ts`             | `desktop-s2-m3` Đồng bộ tuỳ chọn                           |
| Thêm | `packages/subject-programming/lessons/p6u281.ts`             | `desktop-s2-m4` Chẩn đoán từ xa                            |
| Thêm | `packages/subject-programming/lessons/p6u282.ts`             | `desktop-s3-m1` Dữ liệu lớn trên máy đơn                   |
| Thêm | `packages/subject-programming/lessons/p6u283.ts`             | `desktop-s3-m2` Tối ưu khởi động và bộ nhớ                 |
| Thêm | `packages/subject-programming/lessons/p6u284.ts`             | `desktop-s3-m3` Hệ thống mở rộng (plugin)                  |
| Thêm | `packages/subject-programming/lessons/p6u285.ts`             | `desktop-s3-m4` Kiểm thử ứng dụng desktop                  |
| Thêm | `packages/subject-programming/lessons/p6u286.ts`             | `desktop-s4-m1` Phân phối và cấp phép                      |
| Thêm | `packages/subject-programming/lessons/p6u287.ts`             | `desktop-s4-m2` Cập nhật an toàn                           |
| Thêm | `packages/subject-programming/lessons/p6u288.ts`             | `desktop-s4-m3` Bảo mật máy khách                          |
| Thêm | `packages/subject-programming/lessons/p6u289.ts`             | `desktop-s4-m4` Hỗ trợ người dùng                          |
| Thêm | `packages/subject-programming/desktopS1Lessons.test.ts`      | Semantic gate S1                                           |
| Thêm | `packages/subject-programming/desktopS2Lessons.test.ts`      | Semantic gate S2                                           |
| Thêm | `packages/subject-programming/desktopS3Lessons.test.ts`      | Semantic gate S3                                           |
| Thêm | `packages/subject-programming/desktopS4Lessons.test.ts`      | Semantic gate S4                                           |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts` | Thêm bốn khoá `desktop-s1..s4`                             |
| Sửa  | `packages/subject-programming/lessons.ts`                    | Đăng ký 16 unit vào registry đồng bộ                       |
| Sửa  | `packages/subject-programming/curriculum.ts`                 | Gắn 16 unit vào bậc P6                                     |
| Sửa  | `packages/subject-programming/lessonsLazy.ts`                | **SINH LẠI** bằng `npm run gen:lesson-index`, không gõ tay |

**Ảnh hưởng lan ra** (chạy `npm run codemap -- impact packages/subject-programming/specializations/stageUnits.ts`
trước khi sửa, và lặp lại cho `lessons.ts`/`curriculum.ts`):

- `specializations/stageUnits.test.ts`, `lessonsLazy.test.ts`, `lessonsPython.test.ts`,
  `specializations/specializations.test.ts` — đều kiểm chéo curriculum ↔ lessons, phải xanh với
  bốn chặng mới.
- Không trang React nào hiển thị số chặng đã hoàn thành của `desktop` theo mẫu số cố định (khác
  `devops-s3` từng đổi mẫu số `principal-ai-p4`), vì `desktop` chưa nằm trong `learningPaths` nào;
  nhưng trang liệt kê chặng của một hướng (`ProgrammingSpecializationPage`/tương đương — đọc lại
  tên file thật trước khi sửa) có thể đổi từ "0/4 chặng có bài" sang "4/4", cần đọc lại test của
  trang đó nếu có đếm số chặng có bài học.

## ③ Hợp đồng dữ liệu

**Vào (hằng biên dịch trong `stageUnits.ts`):**

```ts
const DESKTOP_S1_UNIT_IDS = ['p6-u274', 'p6-u275', 'p6-u276', 'p6-u277'] as const
const DESKTOP_S2_UNIT_IDS = ['p6-u278', 'p6-u279', 'p6-u280', 'p6-u281'] as const
const DESKTOP_S3_UNIT_IDS = ['p6-u282', 'p6-u283', 'p6-u284', 'p6-u285'] as const
const DESKTOP_S4_UNIT_IDS = ['p6-u286', 'p6-u287', 'p6-u288', 'p6-u289'] as const
SPEC_STAGE_UNITS['desktop-s1'] = [...DESKTOP_S1_UNIT_IDS]
SPEC_STAGE_UNITS['desktop-s2'] = [...DESKTOP_S2_UNIT_IDS]
SPEC_STAGE_UNITS['desktop-s3'] = [...DESKTOP_S3_UNIT_IDS]
SPEC_STAGE_UNITS['desktop-s4'] = [...DESKTOP_S4_UNIT_IDS]
```

**Ra (mọi simulator):** một dòng quyết định tất định, dạng `"<decision>: <reason>"` với
`decision ∈ {allow, deny, reject, refuse, drift, freeze, redact, rollback, invalid, unknown}`
(tập giữ chung phong cách các lát trước, mở rộng `rollback` cho S4 vì có "quay lui bản cập nhật").

**Hợp đồng từng unit:**

| Unit      | Module                                    | Hợp đồng simulator và ca biên BẮT BUỘC                                                                                                                                                                                                                                                                                                                                                                             |
| --------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `p6-u274` | `desktop-s1-m1` Chọn nền tảng             | Fixture `packageSizeMb/ramMb/hasTray/hasShortcut`. Vượt trần kích thước gói HOẶC RAM đã khai (ngưỡng cố định, ví dụ 300MB/500MB) → `deny: budget exceeded`; thiếu tray/shortcut không tự nó fail, chỉ ghi cảnh báo trong `reason`; phím tắt toàn cục trùng danh sách phím hệ điều hành đã khai (tập cố định) → `reject: shortcut conflict`.                                                                        |
| `p6-u275` | `desktop-s1-m2` Làm việc với tệp          | Ghi an toàn: fixture `hasTempFile/renamedOk/pathHasInvalidChar`. Ghi trực tiếp không qua tệp tạm → `deny: unsafe write`; ký tự đường dẫn không hợp lệ theo hệ đang mô phỏng (`windows`/`posix`, tập ký tự cấm khai rõ) → `reject: invalid path char`; đổi tên thất bại giữa chừng → `unknown` (không suy đoán tệp gốc còn nguyên hay hỏng).                                                                        |
| `p6-u276` | `desktop-s1-m3` Lưu trữ cục bộ            | Fixture `schemaVersion/dataVersion/hasMigration`. `dataVersion > schemaVersion` (dữ liệu mới hơn app biết) → `deny: data newer than app`; có bước chuyển thiếu (`hasMigration=no` mà `dataVersion < schemaVersion`) → `refuse: missing migration step`; migration đủ bước → `allow: migrate`.                                                                                                                      |
| `p6-u277` | `desktop-s1-m4` Đóng gói và cài đặt       | Fixture `signed/checksumOk/targetOsSupported`. Chưa ký → `deny: unsigned package`; checksum sai → `reject: checksum mismatch`; hệ điều hành đích không nằm trong danh sách hỗ trợ đã khai → `refuse: unsupported os`; đủ cả ba → `allow: install`.                                                                                                                                                                 |
| `p6-u278` | `desktop-s2-m1` Đa luồng trong GUI        | Fixture `runsOnUiThread/cancelRequested/cancelHonoredWithinMs`. Việc nặng chạy trên luồng UI (`runsOnUiThread=yes`) → `deny: blocks ui thread` bất kể các trường khác (ưu tiên tuyệt đối); đã yêu cầu huỷ nhưng không dừng trong ngưỡng thời gian cố định → `reject: cancel not honored`; còn lại → `allow: run background`.                                                                                       |
| `p6-u279` | `desktop-s2-m2` Trải nghiệm chuyên nghiệp | Fixture `undoStackDepth/redoAfterNewActionAllowed/shortcutsFollowOsConvention`. Yêu cầu redo sau khi đã có thao tác mới xen vào (`redoAfterNewActionAllowed=yes` là SAI theo hợp đồng) → `deny: redo after new action`; phím tắt tự chế lệch quy ước hệ (`shortcutsFollowOsConvention=no`) → `reject: shortcut violates os convention`; ngăn xếp hoàn tác rỗng mà vẫn gọi undo → `unknown`.                        |
| `p6-u280` | `desktop-s2-m3` Đồng bộ tuỳ chọn          | Fixture `localVersion/remoteVersion/fieldsChangedLocal/fieldsChangedRemote/encryptedBeforeSend`. Chưa mã hoá trước khi gửi → `deny: not encrypted`; hai bên sửa cùng trường (giao của hai tập trường đổi khác rỗng) → `drift: manual merge required`, KHÔNG tự ghi đè; một bên không đổi gì → `allow: fast-forward`; version bằng nhau mà nội dung khác → `unknown` (không suy đoán ai đúng).                      |
| `p6-u281` | `desktop-s2-m4` Chẩn đoán từ xa           | Fixture `userConsented/logContainsPii/configCorrupt`. Chưa xin sự đồng ý mà đòi gửi log → `deny: no consent`; log chứa PII (dấu hiệu cố định trong fixture, ví dụ email/đường dẫn cá nhân) → `redact: pii found`; `configCorrupt=yes` → `allow: safe mode` (khởi động vẫn được, không `deny`); còn lại → `allow: send diagnostics`.                                                                                |
| `p6-u282` | `desktop-s3-m1` Dữ liệu lớn trên máy đơn  | Fixture `fileSizeMb/readsStreamed/rowsVirtualized/indexBuilt`. Tệp vượt ngưỡng cố định (ví dụ 500MB) mà không đọc theo luồng → `deny: full load exceeds budget`; danh sách vượt ngưỡng dòng cố định mà không ảo hoá → `reject: unvirtualized list`; tìm kiếm toàn văn gọi khi chưa có chỉ mục → `refuse: index missing`; đủ điều kiện → `allow: stream`.                                                           |
| `p6-u283` | `desktop-s3-m2` Tối ưu khởi động          | Fixture `startupMs/laziestModulesDeferred/ramIdleMb`. `startupMs` vượt ngân sách cố định (ví dụ 2000ms) mà module có thể tải lười lại không tải lười → `deny: startup budget exceeded`; RAM ở trạng thái nghỉ vượt trần cố định → `reject: idle ram exceeded`; đạt cả hai ngân sách → `allow: within budget`.                                                                                                      |
| `p6-u284` | `desktop-s3-m3` Hệ thống mở rộng (plugin) | Fixture `apiVersion/pluginRequiresVersion/sandboxed/pluginCrashed`. Plugin chạy ngoài hộp cát (`sandboxed=no`) → `deny: plugin not sandboxed` (ưu tiên tuyệt đối, kể cả version khớp); version API không tương thích (khác major) → `reject: incompatible api version`; plugin crash trong hộp cát → `allow: host survives` (host sống, plugin bị cô lập, không phải "app crash"); còn lại → `allow: load plugin`. |
| `p6-u285` | `desktop-s3-m4` Kiểm thử ứng dụng desktop | Fixture `platformsTested (danh sách con của {windows,macos,linux})/installFlowTested/updateFlowTested`. Thiếu bất kỳ nền tảng nào trong ba nền mục tiêu → `deny: platform coverage incomplete`; có đủ nền nhưng thiếu test luồng cập nhật → `reject: update flow untested`; đủ cả ba nền + cả hai luồng → `allow: release candidate`.                                                                              |
| `p6-u286` | `desktop-s4-m1` Phân phối và cấp phép     | Fixture `licenseValid/offlineActivationOk/clockRollbackDetected`. Phát hiện lùi đồng hồ để kéo dài dùng thử → `deny: clock rollback detected`; license không hợp lệ → `reject: invalid license`; offline mà không kích hoạt được → `refuse: offline activation unsupported`; còn lại → `allow: activate`.                                                                                                          |
| `p6-u287` | `desktop-s4-m2` Cập nhật an toàn          | Fixture `channel (stable/beta)/rolloutPercent/healthCheckFailedAfterUpdate`. Sau cập nhật health-check báo lỗi → `rollback: update failed health check` (ưu tiên tuyệt đối, bất kể channel/rollout); `rolloutPercent` ngoài khoảng 0–100 → `invalid: rolloutPercent`; còn lại → `allow: rollout`.                                                                                                                  |
| `p6-u288` | `desktop-s4-m3` Bảo mật máy khách         | Fixture `signatureValid/requestsAdminRights/dependencyHasKnownVuln`. Chữ ký sai hoặc thiếu → `deny: invalid signature` (ưu tiên tuyệt đối); đòi quyền quản trị cho thao tác thường ngày → `reject: unnecessary admin rights`; phụ thuộc có lỗ hổng đã biết → `refuse: dependency vulnerable`; còn lại → `allow: install update`.                                                                                   |
| `p6-u289` | `desktop-s4-m4` Hỗ trợ người dùng         | Fixture `hasDiagnosticBundle/reportContainsUserContent/affectedUserCount`. Báo cáo lẫn nội dung tài liệu người dùng (không chỉ chẩn đoán) → `redact: user content in report`; thiếu bundle chẩn đoán mà đòi xếp vào backlog → `refuse: cannot reproduce`; đủ điều kiện → `allow: triage` kèm reason nêu `affectedUserCount`.                                                                                       |

**Ca lỗi (là một phần hợp đồng, áp dụng cho cả 16 unit):**

| Tình huống                         | Mã / hành vi | Hành vi mong đợi                                                   |
| ---------------------------------- | ------------ | ------------------------------------------------------------------ |
| Input rỗng, thiếu trường, sai kiểu | `invalid`    | In một dòng `invalid: <trường>`, không ném exception, không treo   |
| Không đủ thông tin để kết luận     | `unknown`    | Trả `unknown`, **cấm** quy về `allow` hoặc suy đoán trạng thái tốt |
| Mâu thuẫn giữa hai luật            | —            | Thứ tự ưu tiên tường minh, tất định; không phụ thuộc thứ tự dict   |
| Trạng thái không nhận dạng được    | `deny`       | Fail closed                                                        |

## ④ Tiêu chí chấp nhận

- [ ] `unitsOfStage('desktop-s1'|'desktop-s2'|'desktop-s3'|'desktop-s4').length === 4` mỗi chặng,
      mỗi unit ≥ 2 lesson — `npx vitest run packages/subject-programming/specializations/stageUnits.test.ts`
- [ ] 32 lesson đều làn `python`, đều có Make với ca hiện + ca ẩn + ca âm —
      `npx vitest run packages/subject-programming/desktopS1Lessons.test.ts packages/subject-programming/desktopS2Lessons.test.ts packages/subject-programming/desktopS3Lessons.test.ts packages/subject-programming/desktopS4Lessons.test.ts`
- [ ] Code mẫu và ca Predict chạy Python THẬT và qua toàn bộ test-case —
      `npx vitest run packages/subject-programming/lessonsPython.test.ts`
- [ ] Không lesson nào chỉ "đọc hiểu": mỗi unit có đủ dạng predict / debug / build / measure / decide
      dàn trải qua 16 unit (không bắt buộc đủ 5 dạng trong MỖI unit, nhưng đủ trong MỖI chặng)
- [ ] Executable code không có `import os`, `import sys`, `open(`, `socket`, `subprocess`,
      `requests`, `random`, `datetime.now` — gate kiểm bằng chuỗi cấm
- [ ] Markers bắt buộc xuất hiện tối thiểu một lần mỗi chặng: S1 — `request`, `limit`-tương-đương
      (đổi cho đúng miền: `packageSizeMb`, `temp file`, `rename`, `schemaVersion`, `signed`,
      `checksum`); S2 — `ui thread`, `cancel`, `undo`, `redo`, `drift`, `encrypted`, `consent`,
      `pii`; S3 — `stream`, `virtualiz`, `index`, `startup`, `sandbox`, `api version`, `platform`;
      S4 — `license`, `clock rollback`, `rollback`, `signature`, `admin rights`, `vulnerable`,
      `affectedUserCount`. Danh sách chính xác chốt trong lúc viết semantic gate, không tự nới lỏng.
- [ ] `lessonsLazy.ts` được SINH LẠI, không sửa tay — `npm run gen:lesson-index` rồi `git diff`
      chỉ hiện phần sinh
- [ ] Make dùng `match: 'contains'` (runner echo stdin, so khớp tuyệt đối sẽ đỏ giả)
- [ ] Không unit nào của `desktop-s1..s4` bị thêm vào bất kỳ `learningPaths/*.ts` trong PR này
      (khớp mục ① — kiểm bằng `grep -rl "desktop-s" packages/subject-programming/learningPaths/*.ts` vẫn rỗng, TRỪ khi mục ⑧ được duyệt theo hướng khác)

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/desktopS1Lessons.test.ts
npx vitest run packages/subject-programming/desktopS2Lessons.test.ts
npx vitest run packages/subject-programming/desktopS3Lessons.test.ts
npx vitest run packages/subject-programming/desktopS4Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npx vitest run packages/subject-programming/lessonsLazy.test.ts
npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                      | Test nào canh nó                                                                                |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Chỉ khai chặng có bài khi unit thật đã tồn tại                | `specializations/stageUnits.test.ts`                                                            |
| Chỉ mục nạp lười khớp registry đồng bộ                        | `lessonsLazy.test.ts`                                                                           |
| Mọi lesson Python có code mẫu chạy qua hết test-case          | `lessonsPython.test.ts`                                                                         |
| Simulator không có I/O ngoài, không in giá trị bí mật/PII gốc | `desktopS1..S4Lessons.test.ts` (viết mới ở lát này)                                             |
| Id chặng/unit đã phát hành ở hướng khác không đổi             | `specializations/specializations.test.ts`, `stageUnits.test.ts`                                 |
| `desktop` không bị nối ngầm vào lộ trình nào khi chưa duyệt   | `learningPaths/learningPaths.test.ts` (không có tham chiếu `desktop-s*` trước khi ⑧ được duyệt) |

## ⑥ Quy ước dự án liên quan

- Import xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi `.js`; import nội bộ gói dùng đường tương
  đối CÓ đuôi `.js`.
- Thêm/đổi bài học xong **bắt buộc** chạy `npm run gen:lesson-index`; quên thì `lessonsLazy.test.ts`
  đỏ với đúng câu nhắc đó.
- Comment trong file bài học viết tiếng Việt, giải thích "vì sao", không mô tả lại code.
- Cổng test của CI là `npm run test:coverage` (có ngưỡng chặn), không phải `npm test`.
- Trước lần push cuối: `rm -rf packages/*/dist dist dist-server` rồi chạy lại `npm run typecheck`
  để tái hiện checkout sạch của CI.
- Tiêu đề PR dùng scope chữ thường, ví dụ `feat(programming): ...`; mô tả phải có đủ 6 tiêu đề của
  cổng `metadata`, trỏ tới chính file đặc tả này, VÀ chỉ dùng cụm "Approved for implementation"
  sau khi chủ dự án thật sự duyệt (mục ⑧) — không tự ghi cụm đó vào PR trước khi có xác nhận.

## ⑦ Rollout và rollback

Đề xuất **chia hai PR theo cặp chặng**, không gộp một PR cho cả bốn chặng — lát này gấp đôi số
unit của các lát trước (16 so với 4), review một PR 16 unit/32 bài khó soát kỹ hơn hai PR 8
unit/16 bài, và tách theo ranh giới tự nhiên "nền tảng (S1–S2)" / "chuyên sâu (S3–S4)":

1. **PR 1 — `desktop-s1` + `desktop-s2`** (`p6-u274…u281`, 16 bài): nền tảng chọn kỹ thuật, tệp,
   lưu trữ, đóng gói (S1) và đa luồng, trải nghiệm, đồng bộ, chẩn đoán (S2). Đi trước vì S3/S4 dựa
   trên khái niệm đã dựng ở đây (ví dụ "việc nền không chặn UI" ở S2-m1 là tiền đề để nói "tối ưu
   khởi động" ở S3-m2).
2. **PR 2 — `desktop-s3` + `desktop-s4`** (`p6-u282…u289`, 16 bài), mở sau khi PR 1 đã merge và
   xanh trên `main`, để tránh hai PR cùng sửa `stageUnits.ts`/`lessons.ts`/`curriculum.ts` xung đột
   nhau liên tục.

Mỗi PR tự chạy `npm run gen:lesson-index` sau khi thêm unit của mình. Rollback = revert trọn PR đó
rồi chạy lại `npm run gen:lesson-index`; KHÔNG xoá tiến độ/artifact của người học và KHÔNG tái sử
dụng unit id đã cấp dù PR có bị revert. Rủi ro lớn nhất là người học nhầm simulator với hành vi OS
thật (ví dụ tưởng "ký mã" trong bài đã là ký mã thật); nhãn MÔ PHỎNG, semantic gate riêng từng
chặng và rubric bài tập về nhà (yêu cầu chạy trên máy/hệ điều hành thật NGOÀI sandbox) là ba lớp
chặn giống các lát đã duyệt trước đó.

## ⑧ Quyết định cần chủ dự án duyệt

1. ⬜ Cấp dải `p6-u274…p6-u289` cho hướng `desktop` (bốn chặng, mỗi chặng bốn unit liên tục theo
   thứ tự S1→S4) — chưa có lát nào khác dùng dải này, đã kiểm bằng `grep`.
2. ⬜ Có nối `desktop-s1..s4` vào một `learningPaths/*.ts` nào không, hay giữ nguyên trạng hướng
   `desktop` là chặng tra trực tiếp qua trang hướng chuyên sâu (không thuộc lộ trình mục tiêu nào).
   Đặc tả này KHÔNG tự quyết thêm bước đó — khác `devops-s3` (đã có sẵn trong `principal-ai`, PR đó
   chỉ thêm 1 chặng vào lộ trình đang chạy); ở đây phải thêm cả bốn chặng liên tiếp, ảnh hưởng số
   đếm tiến độ của lộ trình đích ngay từ chặng đầu, nên cần quyết định rõ trước khi PR 1 mở, không
   để lặt vặt qua hai PR.
3. ⬜ Duyệt cách chia PR ở mục ⑦ (2 PR theo cặp chặng S1–S2 rồi S3–S4) thay vì 1 PR gộp bốn chặng
   hoặc 4 PR mỗi chặng một cái.
4. ⬜ Duyệt tập ngưỡng số cố định dùng trong simulator (kích thước gói 300MB, RAM 500MB, tệp lớn
   500MB, ngân sách khởi động 2000ms…) là hằng số MÔ PHỎNG cho mục đích dạy, không phải khuyến nghị
   vận hành thật — nêu rõ trong `theory` mỗi bài liên quan để không bị hiểu nhầm thành best practice
   sản xuất.

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ:
