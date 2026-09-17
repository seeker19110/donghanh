# Đặc tả — `data-s4` + `security-s4`: nền tảng dữ liệu, quản trị, an toàn và tuân thủ

> Ngày: 2026-09-17 · Trạng thái: **CHỜ CHỦ DỰ ÁN DUYỆT**
> Goal: `docs/goals/2026-09-15-ai-systems-architect.md` — lát cắt `M6/S1a` (`data-s4`) và
> `M6/S1b` (`security-s4`).
> Khuôn: `docs/templates/dac-ta-tinh-nang.md`.

## 0. Một câu

Lấp hai chặng rỗng cuối của Giai đoạn 6 (Enterprise AI Architecture & Technical Leadership):
`data-s4` và `security-s4`, mỗi chặng bốn unit / tám bài Python MÔ PHỎNG, để người học ra được
quyết định cấp tổ chức về độ tin cậy số liệu, định nghĩa chỉ số, kiến trúc an toàn và quản trị rủi ro.

## 1. Phạm vi milestone M6 và chặng bị loại

Giai đoạn 6 theo đặc tả chương trình §4 gồm `architecture-s3..s4`, `data-s4`, `security-s4`,
`principal-s3..s4`. Bốn trong sáu đã có bài (`architecture-s3` = `p6-u123…u125`, `architecture-s4` =
`p6-u190…u193`, `principal-s3` = `p6-u98/u99`, `principal-s4` = `p6-u100/u101`). Lát cắt này làm nốt
hai chặng còn lại.

**`security-s3` cố ý NẰM NGOÀI khoá này và ngoài mọi milestone.** Chặng đó là bảo mật tấn công
chuyên sâu — dịch ngược, khai thác bộ nhớ, ROP, fuzzing tìm lỗ hổng thật. Nó mâu thuẫn trực tiếp với
ranh giới an toàn đã chốt ở `security-s1`/`security-s2` (không dò quét, không khai thác, không tạo
payload) và không phục vụ chuẩn đầu ra nào trong tám năng lực ở §3 của đặc tả chương trình. Chặng
vẫn tồn tại trong bản đồ hướng `security` cho người đi hướng đó, nhưng lộ trình `principal-ai`
không tham chiếu tới nó. **Phải ghi rõ điều này khi đóng goal**, để lần audit sau không đọc
"security-s3 rỗng" thành nợ chưa trả.

## ① Phạm vi

**LÀM:**

- `data-s4`: bốn unit `p6-u202…p6-u205`, bám bốn module trong `specializations/data.ts` (dòng 214–265).
- `security-s4`: bốn unit `p6-u206…p6-u209`, bám bốn module trong `specializations/security.ts` (dòng 228–285).
- Mỗi unit hai lesson 8 bước; simulator Python deterministic, bounded, fail closed; Make có ca hiện,
  ca ẩn, ca âm.
- Hai semantic gate riêng: `dataS4Lessons.test.ts`, `securityS4Lessons.test.ts`.
- **Nối cả hai chặng vào `principal-ai-p5`** (giai đoạn "Tầm trưởng"), đặt TRƯỚC `principal-s3`.

**KHÔNG LÀM:**

- Không `security-s3` (lý do ở mục 1).
- Không dò quét, khai thác, tạo payload, brute-force, phân tích mã độc, dịch ngược — kể cả mô phỏng.
  `security-s4` là chặng PHÒNG THỦ: phân loại, quyết định, quy trình.
- Không dữ liệu cá nhân thật, không dữ liệu production, không log thật. Mọi fixture là tổng hợp và
  đã che thông tin.
- Không network, filesystem, subprocess, đồng hồ hệ thống, random toàn cục trong code chạy được.
- Không tư vấn pháp lý: nội dung pháp luật chỉ ở mức KHÁI NIỆM và phải kèm câu "không thay thế ý
  kiến pháp lý".
- Không chấm artifact bằng AI (quyết định đã chốt ở đợt 3 của `pathArtifactService`).

## ② Điểm chạm

| Việc | Đường dẫn file                                                 | Ghi chú                              |
| ---- | -------------------------------------------------------------- | ------------------------------------ |
| Thêm | `packages/subject-programming/lessons/p6u202.ts` … `p6u205.ts` | Bốn unit `data-s4`                   |
| Thêm | `packages/subject-programming/lessons/p6u206.ts` … `p6u209.ts` | Bốn unit `security-s4`               |
| Thêm | `packages/subject-programming/dataS4Lessons.test.ts`           | Semantic gate `data-s4`              |
| Thêm | `packages/subject-programming/securityS4Lessons.test.ts`       | Semantic gate `security-s4`          |
| Sửa  | `packages/subject-programming/specializations/stageUnits.ts`   | Thêm hai khoá                        |
| Sửa  | `packages/subject-programming/lessons.ts`                      | Đăng ký 8 unit                       |
| Sửa  | `packages/subject-programming/curriculum.ts`                   | Gắn unit vào bậc P6                  |
| Sửa  | `packages/subject-programming/lessonsLazy.ts`                  | **SINH LẠI**, không gõ tay           |
| Sửa  | `packages/subject-programming/learningPaths/principal-ai.ts`   | Thêm hai chặng vào `principal-ai-p5` |

**Ảnh hưởng lan ra:** `stageUnits.test.ts`, `lessonsLazy.test.ts`, `lessonsPython.test.ts`,
`specializations.test.ts`, `learningPaths.test.ts`, `ProgrammingPathPage.tsx` (P5 từ 4 lên 6 chặng).
Chạy `npm run codemap -- impact packages/subject-programming/learningPaths/principal-ai.ts` trước khi sửa.

**Đề xuất tách PR:** hai PR độc lập (`data-s4` trước, `security-s4` sau) để mỗi PR còn review được;
cả hai đều chạm `stageUnits.ts`/`lessons.ts`/`lessonsLazy.ts` nên PR sau phải gộp `main` rồi sinh
lại chỉ mục trước khi push.

## ③ Hợp đồng dữ liệu

```ts
SPEC_STAGE_UNITS['data-s4'] = ['p6-u202', 'p6-u203', 'p6-u204', 'p6-u205']
SPEC_STAGE_UNITS['security-s4'] = ['p6-u206', 'p6-u207', 'p6-u208', 'p6-u209']
```

### `data-s4`

| Unit      | Module                          | Hợp đồng simulator và ca biên BẮT BUỘC                                                                                                                                                                                                                                                                                                                                               |
| --------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `p6-u202` | `data-s4-m1` Kiến trúc nền tảng | Danh mục bảng có chủ sở hữu, mô tả, phân loại; ảnh chụp bảng và du hành thời gian; sao lưu đa vùng theo RTO/RPO. Bảng thiếu chủ sở hữu hoặc phân loại → **không được publish**; khôi phục ngoài thời hạn lưu → `deny` kèm mốc gần nhất còn được; tiến hoá schema kiểu phá vỡ (xoá/đổi kiểu cột đang có người dùng) → `deny`, chỉ cho thêm cột.                                       |
| `p6-u203` | `data-s4-m2` Độ tin cậy dữ liệu | SLO độ tươi / đầy đủ / chính xác, tốc độ đốt, phát hiện bất thường trên chuỗi bounded, post-mortem số liệu sai. **Phân biệt 0 dòng với NULL với "chưa chạy"** — ba trạng thái khác nhau, gộp là sai; bất thường tính trên ít hơn ngưỡng mẫu → `unknown`; đường ống quá hạn độ tươi nhưng job báo "thành công" → phải ra `violated`, không được `healthy`.                            |
| `p6-u204` | `data-s4-m3` Định nghĩa chỉ số  | Tầng chỉ số: mỗi tên có đúng một định nghĩa (bộ lọc, hạt, mẫu số, múi giờ) kèm phiên bản. Hai định nghĩa cùng tên → `conflict` nêu rõ khác nhau ở đâu, **cấm** tự chọn một cái; đổi định nghĩa mà không tăng phiên bản → `deny`; so hai con số khác hạt hoặc khác múi giờ → `incomparable`.                                                                                          |
| `p6-u205` | `data-s4-m4` Đạo đức và pháp lý | Phân loại dữ liệu cá nhân, cơ sở pháp lý, giới hạn mục đích, thời hạn lưu; chênh lệch sai số giữa các nhóm; minh bạch giới hạn. Dữ liệu cá nhân không có cơ sở pháp lý + mục đích → `deny`; dùng lại ngoài mục đích đã khai → `deny`; nhóm nhỏ hơn ngưỡng k → `suppress` (không công bố số); kết luận rút từ mẫu lệch → bắt buộc kèm câu giới hạn. Không in giá trị dữ liệu cá nhân. |

### `security-s4`

| Unit      | Module                                | Hợp đồng simulator và ca biên BẮT BUỘC                                                                                                                                                                                                                                                                                                                                  |
| --------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `p6-u206` | `security-s4-m1` Kiến trúc an toàn    | Ranh giới tin cậy, phân đoạn, vòng đời khoá, cổng an toàn trong vòng phát triển. **Tin cậy dựa trên vị trí mạng → `deny`** (đúng nguyên lý zero trust); khoá quá hạn xoay vòng hoặc dùng chung giữa môi trường → `deny`; thay đổi chạm ranh giới tin cậy mà chưa có mô hình đe doạ → chặn phát hành. Chỉ tham chiếu khoá, không in giá trị.                             |
| `p6-u207` | `security-s4-m2` Phát hiện và ứng cứu | Luật phát hiện chạy trên nhật ký fixture; ánh xạ kỹ thuật ATT&CK; trình tự ngăn chặn → diệt trừ → phục hồi. Luật không bắt được ca dương tính nào trong fixture → `noisy`, không được bật; diệt trừ TRƯỚC khi thu thập chứng cứ → `block`; phục hồi khi chưa có nguyên nhân gốc → `incomplete`; tỉ lệ dương tính giả vượt ngưỡng → yêu cầu chỉnh luật.                  |
| `p6-u208` | `security-s4-m3` Điều tra số          | Toàn vẹn chứng cứ (chuỗi băm, chuỗi lưu giữ), dựng dòng thời gian từ nhiều nguồn nhật ký lệch đồng hồ, báo cáo cho lãnh đạo/cơ quan quản lý. Băm không khớp hoặc đứt chuỗi lưu giữ → `inadmissible`; mốc thời gian lệch múi giờ/lệch đồng hồ → chuẩn hoá về UTC và **gắn cờ độ bất định**, cấm im lặng sắp xếp; báo cáo còn dữ liệu cá nhân thô → `redact`.             |
| `p6-u209` | `security-s4-m4` Quản trị, tuân thủ   | Chấm rủi ro (khả năng × tác động), rủi ro bên thứ ba, ánh xạ khái niệm sang khung tuân thủ, đào tạo nhận thức. Rủi ro "chấp nhận" mà thiếu chủ sở hữu hoặc ngày hết hiệu lực → `invalid`; nhà cung cấp không có thoả thuận xử lý dữ liệu hoặc kế hoạch rút lui → rủi ro cao; kiểm soát khai là "đạt" mà không có bằng chứng → **`not-reported`, cấm quy thành `pass`**. |

**Ra (mọi simulator):** một dòng `"<decision>: <reason>"`, `decision ∈ {allow, deny, block,
violated, conflict, incomparable, suppress, redact, noisy, inadmissible, incomplete, invalid,
unknown, not-reported}`.

**Ca lỗi:** input sai kiểu/thiếu trường → `invalid`; mẫu dưới ngưỡng → `unknown`; hai luật mâu
thuẫn → thứ tự ưu tiên tất định; trạng thái lạ → fail closed. Không ném exception, không treo.

## ④ Tiêu chí chấp nhận

- [ ] `unitsOfStage('data-s4').length === 4` và `unitsOfStage('security-s4').length === 4`
- [ ] 16 lesson Python, mỗi Make có ca hiện + ẩn + âm; code mẫu qua hết test-case
- [ ] Executable code không có I/O ngoài, không random toàn cục, không `datetime.now`
- [ ] `securityS4Lessons.test.ts` chứng minh **không có từ vựng tấn công**: cấm `exploit`, `payload`,
      `shellcode`, `rop`, `bypass`, `scan`, `bruteforce`, `reverse engineer` trong code chạy được
- [ ] `dataS4Lessons.test.ts` chứng minh không in giá trị dữ liệu cá nhân; nhóm dưới ngưỡng k bị nén
- [ ] Markers `data-s4`: `owner`, `classification`, `retention`, `freshness`, `completeness`,
      `burn`, `conflict`, `version`, `grain`, `legal basis`, `purpose`, `k-anonymity`, `bias`
- [ ] Markers `security-s4`: `trust boundary`, `zero trust`, `segmentation`, `key lifecycle`,
      `rotate`, `detection rule`, `att&ck`, `containment`, `eradication`, `chain of custody`,
      `integrity`, `utc`, `redact`, `residual risk`, `third-party`, `evidence`
- [ ] Mọi nội dung pháp luật có câu "không thay thế ý kiến pháp lý" — gate kiểm chuỗi
- [ ] `principal-ai-p5` có `data-s4` và `security-s4` đặt trước `principal-s3`; không vòng lặp
      `requires`; `getSpecStage` tra được cả hai
- [ ] `lessonsLazy.ts` sinh lại bằng lệnh

**Lệnh chứng minh:**

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/dataS4Lessons.test.ts
npx vitest run packages/subject-programming/securityS4Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npx vitest run packages/subject-programming/specializations/stageUnits.test.ts
npm run typecheck && npm run lint && npm run format:check && npm run test:coverage && npm run build
```

## ⑤ Bất biến không được phá

| Bất biến                                                | Test nào canh nó                       |
| ------------------------------------------------------- | -------------------------------------- |
| Chỉ khai chặng có bài khi unit thật đã tồn tại          | `specializations/stageUnits.test.ts`   |
| Chỉ mục nạp lười khớp registry đồng bộ                  | `lessonsLazy.test.ts`                  |
| Lesson Python có code mẫu qua hết test-case             | `lessonsPython.test.ts`                |
| Bài bảo mật là phòng thủ, không thành playbook tấn công | `securityS4Lessons.test.ts` (viết mới) |
| Không rò dữ liệu cá nhân / giá trị khoá ra output       | hai gate mới                           |
| Id đã phát hành không đổi, không tái dùng               | `learningPaths/learningPaths.test.ts`  |

## ⑥ Quy ước dự án liên quan

- `npm run gen:lesson-index` sau mọi thay đổi bài học; PR thứ hai phải gộp `main` rồi sinh lại.
- Make dùng `match: 'contains'`.
- Cổng CI là `npm run test:coverage`.
- Import nội bộ gói có đuôi `.js`; xuyên gói dùng `@dhcb/<gói>/<file>` không đuôi.
- Nội dung nhạy cảm (dữ liệu cá nhân, an ninh) phải nói rõ ranh giới mô phỏng ngay trong bài.

## ⑦ Rollout và rollback

Hai PR, `data-s4` trước. Rollback = revert từng PR + sinh lại chỉ mục; không xoá tiến độ/artifact,
không tái dùng id. Hai rủi ro lớn nhất: (1) bài bảo mật trượt thành hướng dẫn tấn công — chặn bằng
danh sách từ vựng cấm trong gate và bằng việc loại hẳn `security-s3`; (2) bài pháp lý bị đọc như tư
vấn pháp luật — chặn bằng câu miễn trừ bắt buộc có test canh.

## ⑧ Câu hỏi duyệt

1. Đồng ý cấp dải `p6-u202…p6-u209`?
2. **Đồng ý loại hẳn `security-s3` khỏi khoá** và ghi thành quyết định đóng goal, thay vì để nó nằm
   như nợ chưa trả?
3. Đồng ý đặt `data-s4` và `security-s4` vào `principal-ai-p5` trước `principal-s3` (lộ trình lên 31
   chặng)?

---

## Nghiệm thu (bên giao việc điền SAU khi nhận kết quả)

- Lệnh đã chạy + kết quả thật:
- Tiêu chí ④ đạt hết chưa; cái nào chưa và vì sao:
- Có phá bất biến ⑤ nào không:
- Có mở rộng ngoài phạm vi ① không:
- Còn để ngỏ:
