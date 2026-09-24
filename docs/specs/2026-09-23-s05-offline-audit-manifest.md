# S05 — Thiết kế audit offline và manifest nghiệm thu

> **Technical implementation approved sau khi PR bổ sung 24/09 merge; expert/Product
> acceptance vẫn WAITING.**
> Bổ sung §4 của [spec S03–S05](2026-09-23-uiux-s03-s05-tinh-dung-bai-tap.md).
> Manifest 40 mẫu và audit khả thi đã có; builder runtime, review chuyên gia và bằng
> chứng release S05 vẫn chưa có tại thời điểm duyệt kỹ thuật.
> Không thay trạng thái S04; source S05 đi theo quyết định kỹ thuật bổ sung ngày
> 24/09 trong spec gốc, chỉ sau khi PR đặc tả đó merge.

## 1. Phạm vi và bằng chứng cấu trúc

Đọc dữ liệu public đã version control, không tải API, learner storage, credentials,
production hay gọi provider. PR này chỉ tài liệu; interface script dưới đây là thiết kế,
chưa phải lệnh đã triển khai. Không sửa từ điển để đạt ngưỡng.

Baseline đọc: `422c9134b05a41ef5df525ee689b5c1225677d3c`.
Git tree của `apps/dhcb/public/data/dictionary`:
`0e9a2f1ef11d5ab8ed2bbfac46a31dab452abd3a`.

| Đếm cấu trúc thực tế                |         Kết quả |
| ----------------------------------- | --------------: |
| File `chunk-*.json`                 |              10 |
| Entries                             |          12.153 |
| `ex_en` / `ex_vi` có giá trị truthy | 12.153 / 12.153 |
| Có object `forms`                   |           8.251 |
| Có `base`                           |             465 |
| `vi` chứa dấu phẩy hoặc chấm phẩy   |           4.651 |
| `vi` chứa whitespace                |          11.614 |

Đây là **inventory**, không phải số câu hợp lệ. `forms` có thể chỉ chứa boolean;
whitespace không chứng minh cụm từ dạy học hợp lệ. Các nhóm có thể giao nhau.
Schema thật ở `apps/dhcb/src/types.ts` và loader ở
`packages/subject-english/dictionaryData.ts`: bảy trường form dạng chuỗi,
hai cờ boolean và `base` riêng. Không có id entry ổn định được khai báo trong schema.
Không suy dạng Việt từ forms Anh; không lần theo `base` để tự bổ sung đáp án.

Ví dụ dữ liệu đọc thật: `bank` → `ngân hàng`, câu Việt “Tôi cần đi đến ngân hàng.”;
`hello` → `xin chào`, câu Việt “Xin chào, bạn khỏe không?”. B cần match có dấu,
không phân biệt hoa thường, nguyên cụm. 4.651 nghĩa có dấu phân cách cho thấy cần
báo riêng nhóm này; chưa chứng minh tất cả bị loại hoặc tỷ lệ B hợp lệ.

Tái lập inventory trong PowerShell tại baseline trên:

```powershell
$files = Get-ChildItem apps/dhcb/public/data/dictionary/chunk-*.json
$entries = @($files | ForEach-Object { Get-Content -Raw $_.FullName | ConvertFrom-Json })
[pscustomobject]@{
  chunks = $files.Count
  entries = $entries.Count
  ex_en = @($entries | Where-Object { $_.ex_en }).Count
  ex_vi = @($entries | Where-Object { $_.ex_vi }).Count
  forms = @($entries | Where-Object { $_.forms }).Count
  base = @($entries | Where-Object { $_.base }).Count
  viSeparators = @($entries | Where-Object { $_.vi -match '[,;]' }).Count
  viPhrases = @($entries | Where-Object { $_.vi -match '\s' }).Count
} | ConvertTo-Json
```

## 2. Interface script đề xuất

Sau approval riêng, triển khai `scripts/audit-fillblank.ts` qua Node 22/tsx:

```text
npx tsx scripts/audit-fillblank.ts --direction both --samples 20 --seed s05-v1 --out <local-output-dir>
npx tsx scripts/audit-fillblank.ts --direction both --samples 20 --seed s05-v1 --pool-fixture <tracked-public-fixture.json> --out <local-output-dir>
```

Mặc định input chỉ là các chunk public, xếp tên file tăng theo code-unit như loader;
không nhận URL hoặc đường dẫn dữ liệu người dùng. Fixture phải là file public đã track,
chứa danh sách `entryRef`, không uid/email/history; từ chối ref không tồn tại/trùng.
Không tự tạo fixture “pool học thật” từ toàn từ điển. Practice hiện lọc learning path
theo learned words; dưới 12 lấy 80 từ đầu. Mô phỏng bằng fixture sạch phải ghi cách
dựng và SHA curriculum; kiểm lại sau S04. Không đọc localStorage của người thật.

Script dùng cùng pure builder với runtime sau khi builder được duyệt, không viết bản
match thứ hai rồi coi là proof runtime. Audit không shuffle/cap trước validation.
Sinh `summary.json`, `candidates.jsonl`, `review-manifest.json`; output cục bộ, không
commit generated output vào repo. Evidence lưu qua artifact CI/PR kèm SHA256.
Không overwrite artifact cũ; directory đã có output thì exit 2.

Exit 0 = audit kỹ thuật chạy hợp lệ, **không đồng nghĩa release pass**; exit 1 = bất
biến kỹ thuật sai; exit 2 = input/schema/IO/argument lỗi. Thiếu mẫu/chuyên gia được
ghi trạng thái WAITING rõ trong summary dù audit exit 0. Reviewer phải đọc trạng thái.

Metadata: schemaVersion, ruleVersion, seed, Node version, sourceCommit, builderCommit,
dirtyPaths (gate yêu cầu rỗng), SHA256 từng file input và script/builder, datasetDigest
(SHA256 của JSON compact danh sách `[path, sha256]` đã sort), scope, command và output
hashes. Timestamp nằm ngoài payload canonical dùng kiểm determinism.

## 3. Luật kiểm toán và tổng đối soát

Mỗi entry ở mỗi chiều là một candidate; `entryRef = relativeChunkPath#index0`.
Ref chỉ có nghĩa cùng datasetDigest. Lưu word/pos và hash nội dung để phát hiện drift.
Normalize câu bằng NFC; đáp án ứng viên trim/NFC, so sánh lowercase Unicode bằng
`toLowerCase()` không locale. Đây là phép so sánh của rule v1, không tuyên bố full
Unicode case folding. Span UTF-16 luôn tham chiếu câu NFC gốc; không lấy offset từ
chuỗi lowercase nếu độ dài thay đổi. Implementation phải có test case này.

A xét word và bảy string forms; B chỉ nguyên `vi`, không split comma/semicolon.
Khử trùng candidate rồi span; boundary chữ/mark/số Unicode. Hai span chồng nhau nhưng
khác start/end vẫn bị loại. Cùng một vị trí được word và form nhận diện chỉ tính một.

Mỗi candidate có đúng một primary reason theo thứ tự:
`invalid_entry`, `missing_sentence`, `empty_target`, `no_match`, `multiple_spans`,
`invalid_span`, `insufficient_distractors`, `invariant_failed`, hoặc `accepted`.
Thông tin phụ là tags, không cộng vào tổng loại. JSON sai/schema top-level sai dừng
exit 2; field entry sai được ghi `invalid_entry`. Bỏ boolean forms, không ép thành text.

Distractor lấy label đích entry khác trong cùng input pool, loại rỗng, mọi label/form
của nguồn, khử trùng trim/NFC/lowercase, rồi lấy ba theo thứ tự hash quy định dưới đây.
IDs theo entryRef và direction; kiểm bốn id và bốn label chuẩn hóa duy nhất. Đáp án là
slice nguyên gốc của span, kể cả biến hình/hoa thường. Khôi phục bằng prefix/answer/suffix;
không replace marker đầu tiên vì câu có thể vốn chứa `_____`.

Summary từng chiều: tổng entry; số example truthy cũ; số sentence không rỗng sau NFC/trim;
count theo primary reason; accepted trước cap; phân bố tags/forms/multiword/diacritics;
tỷ lệ accepted/tổng entry và accepted/sentence không rỗng (mẫu số 0 → null).
Đối soát `total = accepted + sum(rejections)`. “Trước” là eligibility cũ có example,
không gọi đó là câu hợp lệ; “sau” là builder mới, chưa có số liệu ở PR thiết kế này.
Pool fixture báo riêng với digest, accepted count và khả năng mở phiên; không suy
tỷ lệ lỗi phiên thực từ tỷ lệ toàn từ điển. SESSION_SIZE hiện 8, tối thiểu 4.

## 4. Lấy đúng 20 mẫu mỗi chiều, tái lập được

Rank mỗi candidate bằng SHA256 của UTF-8 `JSON.stringify(["s05-v1", seed, direction,
entryRef])`; sort hex tăng, tie-break entryRef code-unit. Không dùng Math.random,
localeCompare, thời gian hay thứ tự filesystem. Distractor rank thêm source entryRef
và distractor entryRef vào tuple; thứ tự options dùng tuple riêng có tag `option`.

Tập review chính chỉ lấy **accepted real-data**, không lấy fixture bù số lượng.
A: chọn hai mẫu form-only (span không match headword), rồi hai mẫu answer multiword;
B: chọn hai mẫu answer có dấu tiếng Việt, rồi hai mẫu answer multiword. Mỗi lượt bỏ
mẫu đã chọn, xét theo rank; sau đó điền theo rank chung đến 20. Thiếu strata ghi
`stratum_shortfall` và lấy phần còn lại theo rank; không che thiếu bằng gán tag sai.
Hai chiều có tập và thứ tự độc lập; tất cả mẫu giữ nguyên bộ options đã tạo.

Nếu accepted <20, chọn toàn bộ, ghi `sample_shortfall = 20 - count`, không lặp mẫu.
Strata rỗng được giải thích bằng inventory và fixture bổ sung cho kỹ thuật, nhưng
reviewer phải chấp nhận ngoại lệ strata bằng văn bản; không miễn ngưỡng 20 real-data.
Lấy thêm tối đa hai rejected candidate mỗi primary reason theo rank để kiểm loại bỏ;
nhóm này tách khỏi 20 mẫu accepted và không tăng mẫu số review chính.

Không loại mẫu bị expert đánh fail rồi bốc lại để đạt pass. Mọi vòng sửa phải giữ
manifest cũ, ghi revision và chạy lại toàn bộ selection trên input/rule mới; reviewer
phải thấy diff các ref đã đổi và lý do. Determinism: hai run cùng metadata cho payload
canonical byte-identical sau bỏ timestamp/path output.

## 5. Manifest và thẩm quyền review

Mỗi row lưu `entryRef`, direction, source (`dictionary`/`public_fixture`), tags, rank,
sourceWord, sentenceNfc, span hoặc null, answer hoặc null, blanked hoặc null, options
`[{id,label,sourceRef}]`, correctOptionId, primaryReason và rule/input hashes.
Rejected row giữ diagnostics; không bịa span/options cho câu chưa dựng được.

| Nhóm       | Trường bắt buộc                                                                                                                                                                   | Chủ thể                                            |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| Kỹ thuật   | status PASS/FAIL, spanBoundary, roundTrip, uniqueLabels, uniqueIds, correctIdCount, resultEvidence, checker, checkedAt                                                            | Script và reviewer kỹ thuật                        |
| Chuyên môn | status WAITING/PASS/FAIL, reviewerName, qualificationOrRole, reviewedAt, targetMeaning, grammarNaturalness, ageSuitability, ambiguityNotes, restorationTaskSuitability, rationale | Người duyệt ngôn ngữ/sư phạm được Product chỉ định |
| Nghiệm thu | status WAITING/PASS/FAIL, sourceHead, manifestDigest, productReviewer, signedAt, unresolved                                                                                       | Product/chủ sản phẩm                               |

Expert mặc định WAITING, identity/date null. Agent chỉ ghi technical và đề xuất notes;
không tự điền tên chuyên gia hoặc suy expert PASS từ đúng span. Trường chuyên môn dùng
PASS/FAIL/WAITING từng mục; không có checkbox mặc định đạt. “Một từ khác cũng hợp câu”
phải ghi ambiguityNotes; reviewer đánh suitability cho nhiệm vụ **khôi phục câu ví dụ
đã học**, không chứng nhận đây là cloze khảo thí một đáp án duy nhất.

## 6. Pass/fail và chiều B độ phủ thấp

- Technical PASS: đối soát đúng, mọi emitted question đúng bất biến, deterministic,
  test negative cases qua. Một invariant fail làm technical FAIL dù 20 mẫu đẹp.
- Expert PASS mỗi chiều: đủ 20 real-data accepted riêng biệt, mọi mẫu được người có
  chuyên môn review PASS với rationale; rejected review không phát hiện loại sai.
  Một mẫu FAIL giữ gate FAIL; chưa review giữ WAITING.
- Release S05 PASS chỉ khi S04 dependency có evidence, spec được duyệt/merge, technical
  và expert cả A/B PASS, UI/score/empty/keyboard/full gate của spec gốc PASS trên source
  head đó. CI của PR tài liệu không đáp ứng bất kỳ gate source nào.
- B toàn dictionary hoặc fixture nghiệm thu có <20 accepted: `WAITING_B_COVERAGE`,
  vẫn công bố toàn bộ mẫu và lý do. Không giảm ngưỡng, không copy A, không sinh câu,
  không split nghĩa hoặc dùng fixture thay real-data. Product cần batch nội dung riêng
  có review hoặc đặc tả rollout giới hạn riêng được duyệt; PR này không cho ngoại lệ.
- Runtime pool B có 0–3 câu: empty có đường về hub, không score 0, không retry hứa sửa
  dữ liệu. Có 4–7: phiên ngắn đúng số; từ 8: cap 8 sau validate. Toàn dictionary đủ 20
  không bảo đảm pool từng người đủ 4; hai ngưỡng phục vụ hai mục đích khác nhau.

## 7. Handoff, kiểm tra và rollback

Owner agent S05: triển khai script/builder sau approval, chạy offline, nộp artifact.
Owner Product: chỉ định chuyên gia và duyệt acceptance; chuyên gia ký phần chuyên môn.
Chưa chỉ định reviewer, chưa chạy audit builder, chưa có 20 mẫu: giữ Draft/WAITING.

Test script tương lai: hash/tie order; Unicode offset và NFC/NFD; forms boolean;
dedupe span; labels trùng; filter trước cap; accounting mỗi reason; strata chồng nhau;
19/20/21 candidates; deterministic repeat; file order đảo; fixture ref sai; schema lỗi;
không overwrite; metadata thay khi input/rule đổi. Không network/provider trong test.

PR này kiểm Prettier và diff; inventory chỉ dùng JSON public. Không sửa source hoặc
worktree S04, không migration. Revert file thiết kế và changelog để rollback tài liệu.
