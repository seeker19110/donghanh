# 0383 — 2026-09-20 — ADR-0008: sửa lại hướng thi hành B3 cho html/dom/fetch

## Tóm tắt

Trước khi giao subagent thi hành B3 (97 bài JavaScript/TypeScript/html/dom/fetch), đọc lại kỹ
`domPrelude.ts`/`fetchPrelude.ts` thì phát hiện hướng đã chốt trước đó ("sửa `domPrelude.ts`/
`fetchPrelude.ts` từ `new Function` sang `vm.createContext`") có một sai sót kỹ thuật: hai hàm
`chayBaiDom()`/`chayBaiFetch()` trong đó là mã DÙNG CHUNG cho CẢ Worker trình duyệt
(`apps/dhcb/src/workers/domWorker.ts`/`fetchWorker.ts` — chấm xem trước phía học viên) LẪN cổng
nội dung CI. `node:vm` là module riêng của Node.js, KHÔNG tồn tại trong trình duyệt — sửa thẳng
import sẽ vỡ bundle client ngay khi build.

Sửa lại ADR: giữ nguyên `domPrelude.ts`/`fetchPrelude.ts` (Worker trình duyệt vẫn cách ly bằng
`terminate()` như hiện tại, không đổi), viết một bộ chấm-lại-ở-SERVER RIÊNG dùng lại các hàm
thuần sẵn có (`thucHien()`, `moTaCayDom()`, `taoFetchGia()`/`taoFetchCuaHang()`, `parseHTML`)
nhưng thay dòng thực thi script học viên bằng `vm.createContext`/`vm.runInContext` — đúng khuôn
mẫu đã có với Python (client Pyodide, server `python3` thật, hai engine khác nhau cùng bộ
test-case qua `grading.ts`).

## Issue / outcome

Nếu không sửa trước, subagent thi hành B3 theo đúng chữ ADR cũ sẽ sửa nhầm file dùng chung và
làm vỡ bundle `apps/dhcb` — phát hiện TRƯỚC khi giao việc, không phải sau khi CI đỏ.

## Research / spec

`docs/adr/0008-cham-lai-server-lap-trinh-ngoai-p1-p4.md` (mục "Ba câu hỏi — ĐÃ CHỐT" câu 1, sửa
lại 2026-09-20).

## Validation

- `grep -rn "chayBaiDom\|chayBaiFetch" apps/ packages/` xác nhận cả hai hàm được gọi từ
  `apps/dhcb/src/workers/domWorker.ts` và `fetchWorker.ts` (Worker trình duyệt) — bằng chứng
  trực tiếp cho lý do không được sửa tại chỗ.
- `npm run lint` — xanh (chỉ đổi tài liệu).

## Rủi ro, rollout và rollback

- **Rủi ro:** tài liệu quyết định, không đổi hành vi hệ thống trong PR này.
- **Rollout:** không áp dụng — B3 thi hành ở PR riêng theo hướng đã sửa.
- **Rollback:** revert PR nếu chủ dự án muốn viết lại theo hướng khác.

## Definition of Done

- [x] ADR-0008 phản ánh đúng ràng buộc kỹ thuật thật (browser không có `node:vm`).
- [x] Hướng thi hành mới không đụng `domPrelude.ts`/`fetchPrelude.ts`/hành vi Worker.
- [x] Bằng chứng grep xác nhận việc dùng chung trước khi kết luận.
