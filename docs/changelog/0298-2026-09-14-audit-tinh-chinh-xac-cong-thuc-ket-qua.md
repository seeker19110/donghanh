# 0298 — 2026-09-14 — Audit tính chính xác công thức và kết quả mọi bài học

**PR:** (đang mở) · **Nhánh:** `claude/audit-course-quality-vj5pcu`
**Báo cáo:** `docs/audit/2026-09-14-tinh-chinh-xac-cong-thuc-va-ket-qua.md`
**Nối tiếp:** đợt 0297 (đủ/sạch) — đợt này hỏi nội dung có ĐÚNG không.

## Việc đã làm

Bốn máy kiểm chạy trên dữ liệu thật: chấm lại 665 đáp án bằng chính `@dhcb/core-grading`; tính
lại 327 chuỗi đẳng thức số trong lời giải; cân bằng nguyên tố 33 phương trình hoá; đối chiếu 212
đáp án numeric với con số lời giải kết luận. Mọi cờ đỏ đều đối chiếu tay với mã nguồn trước khi
ghi báo cáo. Không sửa gì.

## Phát hiện chính

- 🔴 **9 câu Vật lí chấm SAI học sinh trả lời ĐÚNG.** Chúng lưu `value` ở đơn vị hiển thị, trong
  khi `core-grading/types.ts:41` chốt "`value` LUÔN ở đơn vị SI cơ sở". Học sinh gõ đúng con số
  mà chính lời giải của bài viết ra vẫn nhận `WRONG_VALUE`. Đây là **9/10 = 90% số câu có đơn vị
  hệ số ≠ 1** trong cả 4 môn STEM. Cách sửa đã kiểm chứng: thay bằng giá trị SI, cả 9 trả về
  `CORRECT`.
- 🔴 **Cổng canh của loại lỗi này là XANH GIẢ.** `lessons.test.ts` của cả 4 môn dựng bài làm
  "học sinh" bằng `(value - offset) / factor`, tức **giả định sẵn `value` đã ở SI** — nó nạp
  `866 cm` cho câu đáp án `8,66 cm` rồi báo đạt. Test mã hoá đúng cái hiểu lầm nó sinh ra để
  bắt, nên không thể đỏ. Nghiêm trọng vì đặc tả 2026-09-13 viện dẫn chính cổng này làm lý do bỏ
  khâu duyệt của người.
- 🟡 `hoa10-c2-b7#q1` — đề đòi "chỉ nhập số", lời giải trả lời bằng số La Mã "VI".

## Kết luận dương tính (đã kiểm, không có lỗi)

0 lỗi số học trên 327 chuỗi đẳng thức (20 cờ máy báo đều đã đối chiếu tay, đều là hạn chế của bộ
trích: `√`, chỉ số dưới `F_1`, dấu `·` nhân). 33 phương trình hoá cân bằng đúng — chỗ duy nhất
chưa cân là sơ đồ cố ý ở bước 1 của bài dạy thăng bằng electron. 442 câu trắc nghiệm sạch tuyệt
đối về vệ sinh dữ liệu. Môn Lập trình: 373/373 `sampleSolution` chạy thật qua bộ chấm đúng ngôn
ngữ, đạt 100% test-case.

## Giới hạn đã ghi rõ trong báo cáo

Máy chỉ kiểm được tính nhất quán nội bộ. 442 câu trắc nghiệm (60% tổng số câu; riêng môn Sinh là
169/170 = 99%) vẫn cần người có chuyên môn đọc — lượt này KHÔNG thay được khâu đó.

## Bằng chứng kiểm chứng

```
npx vitest run packages/subject-{math,physics,chemistry,biology,english}  → 122/122 xanh
npx vitest run packages/subject-programming                               → 4417/4417 xanh
```
