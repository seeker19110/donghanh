# 0323 — 2026-09-15 — Companion khôi phục lại hội thoại cũ dưới StrictMode

**PR:** (điền khi tạo) · **Loại:** trả nợ kỹ thuật ghi ở [0322 §5](./0322-2026-09-15-renderer-cau-tra-loi-va-don-hai-no.md)
· **Base:** `main` sau #924

## Việc đã làm

Nợ này lộ ra **giữa đợt 0322**, lúc dựng ảnh Tầng 8b: câu trả lời mock không chịu hiện. Lần
theo thì ra một lỗi thật, không liên quan gì tới việc đang làm — nên nó được **ghi lại chứ
không gộp vào** PR đó. Đây là đợt trả nó.

**`Companion.tsx` không khôi phục được hội thoại cũ dưới `StrictMode`** — tức trong
`npm run dev`, và trong **mọi phép đo chạy bằng dev server, E2E gồm trong đó**.

## Cơ chế

Effect nạp lịch sử có **hai** lớp chống-chạy-hai-lần, và chúng triệt tiêu nhau:

```
useEffect(() => {
  if (historyLoadedRef.current) return     // ← lượt HAI dừng ở đây
  historyLoadedRef.current = true
  let cancelled = false
  fetchCompanionHistory().then((h) => { if (cancelled) return; … })
  return () => { cancelled = true }        // ← cleanup lượt MỘT chạy TRƯỚC khi response về
}, [])
```

StrictMode gọi mount → unmount → mount. Lượt MỘT bật khoá rồi gọi `fetch`; cleanup của nó đặt
`cancelled = true`; lượt HAI bị chính cái khoá đó chặn nên không gọi lại. Response về tới nơi
thì không còn ai nhận. Hội thoại cũ **không bao giờ** hiện ra.

## Vì sao vẫn đáng sửa dù production không cắn

React chỉ gọi effect hai lần ở chế độ phát triển, nên bản build production khôi phục lịch sử
bình thường — **người dùng thật không mất gì**. Vẫn sửa vì hai lý do:

1. Khuôn "ref chặn + cờ cancelled" **sai về bản chất**: effect phải **lũy đẳng**, không được
   phụ thuộc vào việc đếm đúng số lần nó chạy.
2. Nó **giấu một luồng thật khỏi mọi cổng E2E** của dự án, vì E2E chạy trên dev server. Một
   tính năng không đo được là một tính năng không ai biết là đã hỏng.

## Sửa

Bỏ hẳn `historyLoadedRef`, dùng `AbortController` huỷ lượt cũ trong cleanup — đúng khuôn
`Subjects.tsx`/`SubjectDetail.tsx` (đợt 0322). Việc chống chèn hai lần — **lý do cái khoá cũ
tồn tại** — chuyển sang chỗ nó thuộc về: **lọc theo `id` lúc gộp**, nên gộp bao nhiêu lần cũng
ra một kết quả. `fetchCompanionHistory` nhận thêm `{ signal }`, cùng chữ ký với
`listSubjects`/`getSubjectDetails`.

## Quyết định

**Cổng đặt ở tầng E2E, KHÔNG phải unit — có chủ đích.** Lỗi này chỉ tồn tại khi React chạy
effect hai lần, tức dưới `StrictMode`. Một unit test render component MỘT lần sẽ **xanh trong
khi trang thật hỏng** — đúng loại cổng làm người ta yên tâm nhầm. `e2e/companion-history.spec.ts`
chạy trên dev server nên nó thấy đúng cái mà người dùng dev thấy.

**Hai phép đo trong một test, cố ý.** `toBeVisible()` canh vế "lịch sử phải hiện ra" (vế bản cũ
hỏng); `toHaveCount(1)` canh vế "đúng một lần" (vế mà cái khoá cũ sinh ra để giữ — bỏ nó đi mà
không thay bằng gì thì StrictMode chèn hội thoại cũ thành hai bản). Thiếu phép đo thứ hai thì
bản sửa có thể đổi lỗi này lấy lỗi kia mà cổng vẫn xanh.

## Bằng chứng: tái hiện → sửa → xanh

Viết `e2e/companion-history.spec.ts` **TRƯỚC** khi sửa:

- Trên mã cũ: ca "mở trang thấy lại hội thoại cũ, mỗi tin ĐÚNG MỘT LẦN" **ĐỎ**
  (`element(s) not found`); hai ca còn lại (lịch sử rỗng · lỗi 503) xanh.
- Sau khi sửa: **3/3 xanh**.

| Cổng                                                                | Kết quả                                                          |
| ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| `npm run build`                                                     | ✅                                                               |
| `npm run typecheck` (sau `rm -rf packages/*/dist dist dist-server`) | ✅                                                               |
| `npm run lint`                                                      | ✅ 0 cảnh báo                                                    |
| `npm run format:check`                                              | ✅                                                               |
| `npm run test:coverage`                                             | ✅ **609 file / 12557 test** (thêm 3 ca `fetchCompanionHistory`) |
| `npm run size`                                                      | ✅ JS **128.76 kB / 140 kB**, CSS **18.13 kB / 20 kB**           |
| E2E `companion-history` (mới)                                       | ✅ 3/3                                                           |
