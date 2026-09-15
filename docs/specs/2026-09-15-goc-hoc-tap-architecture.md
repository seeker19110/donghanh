# Góc học tập: kiến trúc môn học và chuyển URL tương thích

## 0. Một câu

Đưa mọi môn vào Góc học tập, để người học tìm đúng môn và tiếp tục nội dung cũ mà không mất dữ liệu.

**Trạng thái: Approved for implementation — chỉ PR 01, hiệu lực sau khi spec merge.** Phạm vi phê duyệt triển khai của tài liệu này chỉ là **01** sau merge; 02–04 là quyết định hướng sản phẩm và yêu cầu discovery, chưa READY. Base discovery: `f5beb7a1` (#924), ngày 15/09/2026. Goal: [learning-ux](../goals/2026-09-15-learning-ux.md).

Người dùng đã chốt: đổi tên không gian “Phòng Học” thành **“Góc học tập”**, URL `/goc-hoc-tap`; tiếng Anh là một môn ngang hàng các môn khác, không phải không gian cấp nền tảng. Chủ sản phẩm đã cho phép triển khai tuần tự, mỗi subagent một PR, auto-merge và deployment sau khi các cổng đạt.

## ④ Tiêu chí chấp nhận — PR 01

- [ ] Route danh mục, môn và bài STEM có tiền tố `/goc-hoc-tap`; đổi nhãn không gian ở sidebar, bottom nav, breadcrumb, studio, Profile/About và hub. Giữ “môn học” khi là danh từ nội dung; không thay ví dụ ngôn ngữ hoặc “phòng học nhóm”.
- [ ] Bảng chuyển URL §③ đúng cả điều hướng React và reload trực tiếp; query không bị parse rồi mất giá trị/lặp tham số; hash được giữ phía browser. Redirect không thêm history entry, Back không mắc vòng lặp.
- [ ] Kiểm thử host mode bật/tắt, localhost, preview, canonical host, subjects host, hostname giả mạo hậu tố. Không bật cấu hình host hoặc đổi DNS/chứng chỉ.
- [ ] Giữ origin của từng nhóm nội dung theo bảng ownership; không chuyển nháp/local progress sang origin mới. Không thay ID môn/bài, key storage, API, auth, quyền hay trạng thái hoàn thành.
- [ ] Các alias cũ hợp lệ đi thẳng tới đích cuối, không qua chuỗi `/mon-hoc` rồi route cũ; URL không hợp lệ không được suy thành môn tiếng Anh hoặc trang bài giả. Không redirect API/assets/POST.
- [ ] Các link nội bộ mới không phát sinh `/mon-hoc`; giữ chuỗi đó ở alias, kiểm thử tương thích và tài liệu lịch sử. Active nav chỉ khớp biên đoạn, `/goc-hoc-tap-abc` không được chọn.
- [ ] E2E khách và tài khoản: mở link cũ, reload bài STEM, Back/Forward, câu hỏi nháp qua điều hướng, hành vi đăng nhập hiện hữu không hồi quy. Không gửi AI chỉ vì đổi URL.
- [ ] Ảnh trước/sau 390 và 1440px; kiểm tra 320px, năm theme, focus và điều hướng mobile. Chạy cổng đầy đủ; không dùng kết quả #924 làm chứng cứ cho PR mới.

## ① Phạm vi và phân kỳ

**01 làm:** chuyển tên/URL cho không gian học tập và các route `/mon-hoc` đang có, route builder và host router đồng bộ, alias tương thích và các consumer điều hướng/metadata. Chưa thay bố cục học, taxonomy hoặc workflow môn.

Giữ freeze nội dung mới trong PROGRESS: tái cấu trúc trải nghiệm catalog đang có, không thêm môn/khóa hoặc biên soạn bài.

**Không làm trong 01:** di chuyển hoạt động tiếng Anh/lập trình sang URL lồng mới; bỏ entry tiếng Anh; đổi onboarding; migration dữ liệu; thêm parser toán; mục lục toàn khóa; thay DNS hoặc chính sách cookie. Những thay đổi này có slice riêng, không coi đổi nhãn là đã hoàn tất tái cấu trúc.

| Slice | Outcome                                                             | Điều kiện READY                                                                     |
| ----- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| 0S    | Spec này + goal đúng main                                           | Review agent chính và merge docs                                                    |
| 01    | Góc học tập với URL và nhãn thống nhất                              | ✅ **ĐÃ THI HÀNH** — `docs/changelog/0324-2026-09-15-goc-hoc-tap-doi-ten-va-url.md` |
| 02    | Tiếng Anh là môn, bỏ entry cấp không gian; tổng quan môn cùng khung | ✅ **ĐÃ THI HÀNH** — `docs/changelog/0326-*.md`                                     |
| 03    | Công cụ tiếng Anh nằm trong môn; công cụ chung có context           | ✅ **ĐÃ THI HÀNH** — `docs/changelog/0327-*.md`                                     |
| 04    | Platform không mặc định tiếng Anh                                   | ✅ **ĐÃ THI HÀNH** — `docs/changelog/0327-*.md`                                     |

Sau 04 ưu tiên mục lục độc lập shellbar (S07), rồi resume, Home/onboarding, tutor, completion/sync và ôn tập theo goal. Đặc tả mục lục cần payload catalog và nguồn evidence riêng.

## ② Discovery và điểm chạm

| Nguồn thực tế                                                                                                        | Hành vi hiện tại / việc cần làm                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `apps/dhcb/src/lib/subjectsHost.ts`                                                                                  | `VITE_SUBJECTS_HOSTNAME` mặc định rỗng; subjects host bỏ prefix thành `/` hoặc `/:subjectId`; `navigateTo` nhận chuỗi cũ. Đổi builder nhưng giữ tương thích input cũ.                                                                            |
| `apps/server/src/subjectsRouting.ts`, `apps/server/src/server.ts`                                                    | `SUBJECTS_HOSTNAME` tắt thì không redirect; bật thì chỉ root/một segment môn ở subjects host; đường sâu quay canonical; programming có exception `/lap-trinh`. Sửa route ownership có chiều sâu rõ ràng, không dùng wildcard nhận mọi app route. |
| `apps/dhcb/src/App.tsx`                                                                                              | `/mon-hoc`, `/mon-hoc/:subjectId`, `/bai-hoc` con, alias `/subjects`, `/phong-hoc`, `/hoc-mon-hoc`; root và `/:subjectId` có hành vi riêng trên subjects host. Đặt routes cụ thể trước fallback.                                                 |
| `apps/dhcb/src/lib/studios.ts`, `navPaths.ts`, `navTree.ts`, `breadcrumb.ts`                                         | Registry studio tiếng Anh riêng; nhận diện môn theo nhiều prefix. 01 chỉ đổi học tập; 02 mới hợp nhất English.                                                                                                                                   |
| `apps/dhcb/src/components/Layout.tsx`, `pages/core/Profile.tsx`, `pages/core/About.tsx`, các consumer `subjectsHost` | Link/nhãn không gian; rà toàn repo để bắt CTA và metadata không đi qua helper.                                                                                                                                                                   |
| `apps/hub/src/App.tsx`                                                                                               | CTA `/mon-hoc`, tiếng Anh `/hoc-tieng-anh`; anchor nội bộ `#mon-hoc` là anchor đã phát hành, giữ alias/đích hoạt động. Không tự đổi mọi anchor theo đường app.                                                                                   |
| `packages/core-learner/subjectRegistry.ts`                                                                           | Sáu môn thật; `english.isDefault: true`. `rg isDefault apps packages` ở base chỉ thấy manifest và schema, chưa thấy consumer runtime khác; đây không chứng minh hết fallback English.                                                            |
| `packages/core-contracts/subjectManifest.ts`                                                                         | `isDefault` optional. 04 bỏ dấu mặc định trong registry sau khi rà API consumer; không đổi enum/ID môn.                                                                                                                                          |
| `apps/dhcb/src/lib/storage.ts`, `guestProgress.ts`, `learningQuestionDraft.ts`                                       | `et_direction`, key theo uid, `dhcb_prog_progress_`, nháp `dhcb_learning_question_draft_v1` trong sessionStorage. Origin là ranh giới, đổi path không phải migration storage.                                                                    |

Chạy `npm run codemap -- impact apps/dhcb/src/lib/subjectsHost.ts` và impact từng hotspot trước source; codemap là dữ liệu phụ, vẫn tìm literal route bằng `rg`. Không đọc `.env` để suy cấu hình production. Bằng chứng đọc công khai do agent chính kiểm tra 15/09/2026 lúc 09:20 UTC: `HEAD https://www.donghanhcungban.org/mon-hoc` trả 301 tới `https://hoc-tap.donghanhcungban.org/`, đích trả 200. Host mode đang bật tại thời điểm kiểm tra; không đọc secrets. Codemap helper trả 81 file ảnh hưởng trực tiếp/gián tiếp, gồm SubjectsLink, Layout, Home, Profile, About, Subjects, SubjectDetail, Practice, ProgrammingHome, App và tests.

## ③ Hợp đồng route và ownership — PR 01

### URL chuẩn

Canonical **path** giữ `/goc-hoc-tap` trên mọi host; host được chọn theo cấu hình hiện có. Định nghĩa:

- **App host**: canonical hostname đang cấu hình; localhost/preview là origin hiện tại.
- **Subjects host**: chỉ dùng nếu đã bật theo cơ chế hiện có.
- **Catalog owner**: subjects host khi bật, app/current origin khi tắt.
- **STEM lesson owner**: app host, giữ origin đang phục vụ các route bài sâu hiện tại. Không mở rộng subjects host nhận bài sâu trong 01.
- **Programming owner**: app host, giữ `/lap-trinh` và các URL con.
- **English activities owner**: app host, giữ toàn bộ URL hoạt động trong 01. Trang manifest English hiện có vẫn thuộc catalog owner; hợp nhất ở 02 phải giải quyết rõ hai entry này.

| Input cũ hoặc mới                                                                      | Đích cuối                                                           |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `/mon-hoc`, `/subjects`, `/phong-hoc`, `/hoc-mon-hoc`                                  | catalog owner `/goc-hoc-tap`                                        |
| `/mon-hoc/:subjectId` với ID registry hợp lệ, trừ programming                          | catalog owner `/goc-hoc-tap/:subjectId`                             |
| `/mon-hoc/:subjectId/bai-hoc` và `/mon-hoc/:subjectId/bai-hoc/:lessonSlug` đang hỗ trợ | app host `/goc-hoc-tap/:subjectId/bai-hoc[/<lessonSlug>]`           |
| `/mon-hoc/programming` hoặc `/goc-hoc-tap/programming`                                 | app host `/lap-trinh` (tương thích tạm đến spec adapter lập trình)  |
| subjects host `/` và `/:subjectId` cũ                                                  | đích catalog chuẩn trên cùng host, programming tới app `/lap-trinh` |
| app host `/goc-hoc-tap[/<subjectId>]` khi host mode bật                                | catalog owner với nguyên prefix mới                                 |
| subjects host `/goc-hoc-tap/:subjectId/bai-hoc[/<slug>]`                               | app host với nguyên prefix mới                                      |
| app host `/english`, `/tieng-anh`, `/hoc-tieng-anh` và công cụ English                 | giữ hành vi hiện hữu trong 01; không bị rule catalog nuốt           |
| `/:subjectId` trên localhost/app host                                                  | không thêm alias toàn cục; tránh nuốt route platform                |

Mọi chuyển prefix giữ nguyên phần hậu tố và search/hash khi tương ứng; route lạ không được dựng metadata hoặc redirect thành một bài có thật. Với đường cũ không hợp lệ, giữ cơ chế not-found/fallback hiện hữu, không tự phát minh nội dung. Nhận prefix theo biên đoạn, không dùng `includes`.

Hợp đồng helper giữ discriminated union hiện có:

```ts
type NavigationTarget = { kind: 'path'; value: string } | { kind: 'url'; value: string }
// path: cùng origin, dùng navigate. url: origin do cấu hình tin cậy chọn, location.assign.
// search/hash lấy từ location, không chứa draft. ID/path không được dùng làm hostname.
```

Server chỉ xử lý GET/HEAD page requests, giữ search nguyên văn; fragment không gửi lên server nên browser/client phải giữ và được E2E kiểm tra. Không đưa hash/draft vào log hoặc query để “chuyển dữ liệu”. Giữ asset/API exemptions hiện có. Không thêm redirect nhận URL đích tùy ý từ người dùng. Dùng redirect tạm thời 302 cho migration mới ở server để rollback không mắc cache 301; client dùng replace cho alias (React navigate replace hoặc location.replace khi đổi origin); thao tác chủ động goToSubjects vẫn dùng assign để Back quay đúng trang nguồn. Chỉ nâng lên permanent sau vòng nghiệm thu riêng.

### Auth và dữ liệu

01 không hứa sửa toàn bộ auth-return: Login hiện có đường về Home phải được giữ; nháp hỏi nhanh #921 vẫn hiện khi về Home. Không thay `RequireAccount`/`AllowGuest`, không mở API private. Spec 02/04 phải định nghĩa safe relative return target để login trở về bài, với allowlist và test open redirect, nếu thay hành vi.

Không đổi key/localStorage/sessionStorage/ID/guest ownership hay schema. Snapshot dữ liệu test trước/sau route migration phải khớp; dùng guest fixture và tài khoản mock. Nếu phát hiện một route bị chuyển origin mới ngoài ownership bảng trên, dừng thay đổi route đó và bổ sung spec chuyển dữ liệu, không dùng query hoặc cross-origin postMessage tùy tiện.

### Hướng kiến trúc cho 02–04 (chưa phê duyệt source)

- Cây thông tin: Góc học tập → Tiếng Anh/Toán/Vật lý/Hóa/Sinh/Lập trình → taxonomy môn → bài/hoạt động. Shell chỉ sở hữu điều hướng nền tảng; mục lục toàn môn/khóa thuộc vùng nội dung.
- Đích tổng quan English `/goc-hoc-tap/english` cần thuộc app host để giữ dữ liệu origin hoạt động. 02 phải quyết định redirect trang manifest cũ ở subjects host và giữ dữ liệu khách tại đó; không khẳng định cookie chung làm localStorage chung.
- 02 phải sửa đồng bộ consumer `studioPath('english')` ở breadcrumb và `studio('english')` ở DesktopSidebar; chỉ xóa registry studio sẽ làm lookup throw. Đổi CTA “Vào Không Gian Học Tiếng Anh” ở Subjects cùng slice, không chỉ ẩn một mục sidebar.
- Inventory 03 bắt đầu từ `/tro-truyen`, `/luyen-viet`, `/luyen-noi`, `/lo-trinh-hoc/:levelId`, `/tu-dien`, `/tu-vung/:word`, `/bai-hoc`, `/cau-thong-dung`, `/luyen-nghe`, `/truyen-song-ngu/:id`, `/placement`, `/thu-thach`, `/cai-dat`. Phân loại từ component/API thật; `/luyen-tap`, `/tien-do`, `/lich-su-hoc`, `/so-tay-loi-sai` phải rà trước, không mặc định chung hoặc English chỉ vì tên.
- 04 rà Home, Onboarding/Intake, practice, daily plan, progress, Companion, `getDirection` và các default `'english'`. Thiếu context thì chọn môn hoặc tổng hợp có nguồn; dữ liệu legacy English vẫn gắn English qua adapter tường minh. Không đổi default API lịch sử toàn cục trước kiểm tra contract.
- Giữ hai chiều Việt ⇄ Anh là cấu hình môn; ngôn ngữ giao diện nền tảng không lấy ngầm từ chiều học. Chưa chọn môn không bị vào onboarding tiếng Anh.

## ⑤ Bất biến và bằng chứng

| Bất biến                                | Cổng cần giữ/mở rộng trong implementation                                                        |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Host, prefix, query, assets, không loop | `subjectsHost.test.ts`, `subjectsRouting.test.ts`; thêm ma trận ownership/alias/invalid ID       |
| Active nav/breadcrumb đúng và link thật | test `navPaths`, `navTree`, `breadcrumb`, `studios` và E2E route tương thích mới                 |
| Không mất nháp/guest progress           | `learningQuestionDraft.test.ts`, `guestProgress.test.ts`; E2E snapshot storage và login hiện hữu |
| Mobile/focus/theme                      | `e2e/mobile-layout-guards.spec.ts`, a11y AA/AAA, ảnh trước/sau                                   |
| Domain/server là authority              | Không sửa endpoint, completion, billing/entitlement; review diff và regression suite             |

## ⑥ Quy ước, validation và rollout

Node22; TypeScript strict, reuse core-ui/token/năm theme; không thêm dependency. Mỗi PR source chạy build/typecheck/lint/format/test và E2E phù hợp theo AGENTS. Reviewer phải kiểm tra ảnh thật, không chỉ test selector. Không test provider trả phí hoặc dùng dữ liệu production.

Triển khai client/server/hub trong cùng PR và release 01 trên main; giữ alias để bundle cũ/mới cùng hoạt động trong khoảng deploy và cache, không giả định cập nhật cả ba là atomic. Đi qua PR, required checks `quality`, `e2e`, `metadata`, auto-merge được cấp quyền. Kiểm tra deploy và smoke các URL cũ/mới trước PR kế. Không sửa DNS/config production. Nếu lỗi: ưu tiên forward fix; rollback code cả client/server/hub cùng phiên bản, giữ alias `/goc-hoc-tap` làm compatibility patch nếu link mới đã phát hành. Không rollback/xóa learner data vì không có migration dữ liệu.

## Nghiệm thu đặc tả

- 0S chỉ docs, chưa đổi hành vi sản phẩm.
- Reviewer: agent chính (root), technical review ngày 15/09/2026 đạt cho PR 01; 02–04 chưa được phê duyệt source.
- Validation trước review: Node22.23.2, Prettier ba file PASS; `git diff --check` PASS. Sẽ chạy lại nếu review sửa docs.
- 02–04, mục lục, resume và parser toán vẫn cần spec nhỏ trước source.
