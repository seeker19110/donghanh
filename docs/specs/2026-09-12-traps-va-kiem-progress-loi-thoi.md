# Đặc tả: `TRAPS.md` + cổng kiểm `PROGRESS.md` lỗi thời

| Thuộc tính   | Giá trị                                     |
| ------------ | ------------------------------------------- |
| Issue        | —（yêu cầu trực tiếp trong phiên）          |
| Spec owner   | Claude (phiên `amazing-bohr-uwn6km`)        |
| Trạng thái   | **Approved for implementation**             |
| Người duyệt  | Người dùng (chốt trực tiếp trong hội thoại) |
| Ngày duyệt   | 2026-09-12                                  |
| Lần cập nhật | 2026-09-12                                  |

## 1. Tóm tắt quyết định

Đọc repo `seeker19110/project-template` (bộ khung phát triển của cùng tác giả, nguồn của
`docs/framework/KHUNG-*` mà `donghanh` đang dùng) thấy hai cơ chế quy trình chưa có ở `donghanh`
và đáng mang qua:

1. **`TRAPS.md`** — sổ bẫy đã mắc THẬT (khác `docs/adr/` ghi quyết định): mỗi mục có ngày/PR,
   khuôn lỗi, cách rà, cổng chốt chặn. Tra trước khi debug lại từ đầu.
2. **Cổng kiểm `PROGRESS.md` lỗi thời** — `PROGRESS.md` là văn xuôi sửa tay, không có gì đối
   chiếu với git thật; PR merge xong mà không ai quay lại sửa thì phiên sau đọc phải trạng thái
   sai (tưởng nhánh đã merge còn "đang làm"). `donghanh` từng dính đúng lỗi này thật (xem
   `PROGRESS.md` mục 2 dưới "Việc tay/nợ" — nhánh `claude/chirp-3-hd-voice-upgrade-c06eds` từng
   bị ghi "chưa merge" trong khi đã merge từ lâu, phát hiện tay 2026-09-03).

Cả hai chỉ thêm **tài liệu + một script bash + một bước CI nhẹ** — không đụng code sản phẩm,
không cần `eval:tutor`/`eval:code-feedback`, không ảnh hưởng người dùng cuối.

## 2. Vấn đề và bằng chứng

- `PROGRESS.md` dòng 314–317 (hiện trạng, trước đợt việc này) là bằng chứng SỐNG của đúng lỗi
  template mô tả: một mục từng ghi "nhánh X chưa merge, PHẢI chạy đủ cổng trước khi merge" —
  **sai từ lâu**, chỉ phát hiện khi có người chủ động chạy `git ls-remote --heads origin` để
  đối chiếu. Không có gì tự động nhắc việc đối chiếu đó.
- `donghanh` chưa có nơi tập trung "lỗi đã mắc" theo khuôn máy đọc được — bài học nằm rải rác
  trong `docs/changelog/*.md` (mỗi đợt việc một file, không tra cứu chéo theo triệu chứng lỗi
  được) và trong `PROGRESS.md` (văn xuôi tự do).

## 3. Phương án và quyết định

| Phương án                                                                                                                                                                                                                                                                         | Lợi ích                                                                           | Chi phí/rủi ro                                                                                 | Kết luận |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | -------- |
| Không làm                                                                                                                                                                                                                                                                         | 0 chi phí                                                                         | Lỗi "PROGRESS.md lỗi thời" tái diễn không cảnh báo                                             | Từ chối  |
| Copy nguyên `check-progress-freshness.sh` của template (yêu cầu dòng "SHA đã đối chiếu")                                                                                                                                                                                          | Bám sát nguồn                                                                     | `donghanh` không dùng quy ước đó — phải đổi cấu trúc `PROGRESS.md`, rủi ro lớn cho ích lợi nhỏ | Từ chối  |
| **Viết lại script theo đúng quy ước THẬT của `donghanh`: quét tên nhánh dạng `xxx/yyy` trong dấu backtick, bỏ qua nhánh đã có nhãn giải quyết (`ĐÃ MERGE`, `đã merge`, `không còn nhánh`, `đã xoá`, bọc `~~gạch ngang~~`), còn lại thì đối chiếu `git ls-remote --heads origin`** | Khớp quy ước đang dùng thật (đã thấy ở dòng 314–317), không cần đổi cấu trúc file | Heuristic, có thể bỏ sót cách diễn đạt khác                                                    | **Chọn** |

`TRAPS.md`: copy khuôn mục (ngày/PR · khuôn lỗi · cách rà · cổng chốt chặn) nguyên văn từ
template, seed 2 mục đầu bằng lỗi THẬT đã xảy ra ở `donghanh` (đối chiếu changelog/PROGRESS):
xung đột `PROGRESS.md` 2026-08-26 (đã có chốt chặn: tách `docs/changelog/`) và nhánh lỗi thời
2026-09-03.

## 4. Scope

### In scope

- `TRAPS.md` ở gốc repo, 2 mục seed đầu tiên.
- `scripts/check-progress-freshness.sh` — quét `PROGRESS.md`, in cảnh báo (không chặn CI ở lượt
  đầu — xem mục Rollout).
- Gắn bước gọi script vào job `audit` trong `.github/workflows/ci.yml`, chỉ chạy khi
  `github.event_name == 'push'` (đúng nhánh `main`) — lý do: đang mở PR thì nhánh feature còn
  tồn tại là bình thường, kiểm lúc đó báo oan (giống lý do template nêu).
- Nhắc `TRAPS.md` trong `CLAUDE.md` mục 2 (danh sách tài liệu).

### Không làm

- Không đổi cấu trúc `PROGRESS.md` (không thêm dòng "SHA đã đối chiếu" — không khớp quy ước
  hiện tại, chi phí lớn hơn lợi ích ở quy mô 1 script).
- Không chặn CI ngay từ đầu (script mới, heuristic có thể có false positive) — chạy dạng cảnh
  báo (`::warning`, không `exit 1`) trong đợt này; siết thành chặn cứng để đợt sau nếu chạy vài
  tuần không có false positive.

## 5. Tiêu chí chấp nhận

- AC-1 — Given `PROGRESS.md` có nhánh đã đánh dấu "ĐÃ MERGE"/gạch ngang, When script chạy,
  Then KHÔNG cảnh báo nhánh đó (đã có nhãn giải quyết).
- AC-2 — Given `PROGRESS.md` có tên nhánh trong backtick không kèm nhãn giải quyết và nhánh đó
  không tồn tại trên remote, When script chạy, Then in `::warning` nêu rõ tên nhánh + dòng.
- AC-3 — Given không có nhánh nào lệch, When script chạy trên `donghanh` hiện tại, Then thoát
  mã 0, không cảnh báo giả trên các nhánh đã gắn nhãn có sẵn.
- AC-4 — CI job `audit` chạy script này ở bước push lên `main`, không chạy ở `pull_request`.

## 6. Test plan

| Lớp    | Trường hợp                                                                       | Bằng chứng                               |
| ------ | -------------------------------------------------------------------------------- | ---------------------------------------- |
| Manual | Chạy `bash scripts/check-progress-freshness.sh` trên `PROGRESS.md` thật          | Output đính trong PR                     |
| Manual | Giả lập nhánh lỗi thời (sửa tạm 1 dòng thêm nhánh giả không tồn tại, không nhãn) | Script cảnh báo đúng dòng, sau đó revert |

## 7. Rollout và rollback

Cảnh báo (không chặn) trong đợt này. Rollback: xoá bước CI + 2 file, không ảnh hưởng gì khác.

## 8. Phê duyệt

**Kết luận:** Approved for implementation — người dùng yêu cầu trực tiếp "soạn đặc tả rồi thêm
hai cái đó vào donghanh".
