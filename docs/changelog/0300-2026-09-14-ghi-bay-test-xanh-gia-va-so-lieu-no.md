# 0300 — 2026-09-14 — Ghi bẫy "test tự kiểm bằng chính dữ liệu" + đính chính số liệu nợ nội dung

**PR:** #901 · **Nhánh:** `claude/optimistic-pasteur-goh7vb`
**Không có đặc tả trước** — việc phát sinh từ yêu cầu trong phiên: kiểm chứng con số nợ nội dung
"442 câu trắc nghiệm (60%; Sinh 169/170)" xem có chính xác không.

## Bối cảnh: đợt này GIAO NHAU với PR #900

Phiên này khởi động khi `main` còn ở #899 và đi tới kết luận độc lập rằng cổng tự chấm 4 môn STEM
là xanh giả. Trong lúc chạy cổng thì #900 merge vào `main` với **đúng chẩn đoán đó, sửa sâu hơn
nhiều**: gom cổng về `packages/core-grading/selfGrade.ts` có lớp đối chiếu độc lập vào `explain`,
tìm ra 9 đáp án Vật lí chấm sai học sinh trả lời đúng, và bù cổng cho môn Sinh.

Xử lý: **bỏ phần trùng, dựng lại nhánh trên `main` mới**, chỉ giữ 3 việc #900 chưa làm. Ghi lại
ở đây vì đây là bài học vận hành: hai phiên chạy song song trên cùng một vùng nợ thì phiên về
sau phải đọc `main` rồi thu hẹp phạm vi, không merge chồng bản sửa yếu hơn lên bản sửa mạnh hơn.

## Việc đã làm (phần còn lại sau khi trừ #900)

1. **`TRAPS.md` mục 4** — #900 sửa mã và viết báo cáo audit, nhưng chưa ghi vào sổ bẫy. Mục này
   ghi khuôn lỗi **hai tầng**: tầng 1 là test mù (suy đầu vào từ chính trường bị kiểm, kèm bẫy
   phụ "cách sửa hiển nhiên cũng mù, chỉ mù chiều ngược lại"); tầng 2 nguy hiểm hơn — **tài liệu
   viện dẫn cổng máy đó làm lý do bỏ khâu duyệt của người**. Câu rà gọn thành một câu dùng được
   cho mọi test tự nhận là kiểm chất lượng dữ liệu: _đầu vào của bài kiểm tra có ĐỘC LẬP với
   trường đang bị kiểm không?_
2. **Đính chính số liệu trong `PROGRESS.md`.** Đếm bằng script nạp thẳng registry: tỉ lệ trắc
   nghiệm là **66,5%** (442/665), không phải 60%. Thêm phân bổ theo môn để biết duyệt môn nào
   trước — Toán 17/105 · Lí 119/208 · Hoá 137/182 · **Sinh 169/170 = 99,4%**. Và ghi rõ nợ duyệt
   rộng hơn phần trắc nghiệm: `reviewed` = **0/294 bài**.
3. **Ca test `reviewStatus` cho môn Sinh** — ba môn kia có từ #893, Sinh thiếu. #900 bù cổng tự
   chấm cho Sinh nhưng không bù ca này.

## Bằng chứng kiểm chứng

```
npm ci                 ✅  (lockfile khớp)
rm -rf packages/*/dist dist dist-server && npm run typecheck  ✅  (tái hiện checkout sạch của CI)
npm run lint           ✅  0 cảnh báo
npm run format         ✅  Prettier: unchanged
npm run test:coverage  ✅  590 tệp / 12305 test — stmt 94,53% · branch 90,61% · func 94,78% · line 94,93%
npm run build          ✅
```

Không chạy `eval:tutor` / `eval:code-feedback` (không đụng prompt hay `aiConfig.ts`), không chạy
Tầng 8b (không chạm giao diện).

## Còn nợ

Không đổi: **442 câu trắc nghiệm chưa ai có chuyên môn đọc**, 0/294 bài `reviewed`. Cổng
`selfGrade.ts` của #900 kiểm được tính đúng SỐ HỌC, không kiểm được tính đúng KIẾN THỨC — với câu
trắc nghiệm nó chỉ xác nhận `correctIds` nằm trong `choices`. Việc tiếp theo đáng làm: đặc tả quy
trình duyệt chuyên môn theo lô (chia theo chương, mẫu ghi nhận, điều kiện lật `draft` →
`reviewed`), ưu tiên **môn Sinh** vì 99,4% nội dung kiểm tra của nó nằm ngoài tầm mọi cổng máy.
