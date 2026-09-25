# S10b — Sàng lọc của agent trên phản hồi ứng viên

> **Agent screening, không phải review chuyên gia.** Tài liệu này không cho điểm và không kết luận
> đạt hay chưa đạt. Nó chỉ liệt kê các nghi vấn nhìn thấy được, để chuyên gia xét trước. Theo
> spec §3 và `rubric-review.md`, agent tự chấm chỉ là sàng lọc. Mọi ca vẫn ở trạng thái
> `WAITING_EXPERT_REVIEW`.

- **Nguồn:** `candidate-feedback.json`, sinh bằng `npx tsx scripts/s10-candidate-feedback.ts`.
  Cổng `scripts/s10-candidate-feedback.test.ts` đỏ khi bản này lỗi thời so với mã nguồn.
- **Ngày:** 2026-09-25.

## Phân bổ 40 ca theo đường phản hồi

| Đường                | Số ca | Ý nghĩa                                                                          |
| -------------------- | ----: | -------------------------------------------------------------------------------- |
| `APP_FEEDBACK`       |    19 | Chữ app hiện nguyên văn: 12 STEM, 4 lập trình, 3 hệ thống                        |
| `BLOCKED_UNANSWERED` |     4 | Ca STEM "chưa trả lời": app không chấm, chỉ hiện dòng chặn nộp                   |
| `NEEDS_PROVIDER_RUN` |    12 | English do AI sinh. Cần chạy provider (trả phí) theo prompt hiện hành mới có bản |
| `NO_APP_GRADER`      |     4 | R29, R30, R35, R36: app không có bước chấm loại câu trả lời này                  |
| `SYNTHETIC`          |     1 | R40: ActivityResult không có trạng thái tương ứng                                |

Như vậy chuyên gia hiện chấm được **22 ca**: 19 ca `APP_FEEDBACK` và 3 ca hệ thống. Bốn ca
`BLOCKED_UNANSWERED` chỉ cần xác nhận hành vi chặn. Các ca còn lại cần quyết định trước khi chấm:

- English: chạy provider, hay thay bằng phản hồi mẫu viết tay?
- Bốn ca `NO_APP_GRADER`: bỏ, hay đổi sang bước có chấm (Predict, Parsons, Make)?

## Nghi vấn gửi chuyên gia xét trước

1. **R34, Xếp code (Parsons).** Khi xếp sai, phản hồi luôn là "khai báo/đọc dữ liệu trước, rồi
   if → elif → else; dòng thụt lề…". Bài P1-U1 chỉ có ba lệnh `print` và không có `if`. Chữ này
   cố định cho mọi bài (`PARSONS_COPY.sai`), nên nguyên nhân nêu ra có thể không liên quan tới
   bài đang học. Trục cần xét: "Giải thích nguyên nhân".
2. **Ca ngộ nhận R16, R20, R24, R28.** Câu trắc nghiệm không nhận phần giải thích tự do của
   người học. Phản hồi vì thế giống hệt ca chỉ chọn sai, và không nhắm vào ngộ nhận cụ thể mà
   người học vừa nêu. Cần xét xem thiết kế ca có phù hợp với loại câu hỏi này không.
3. **Lời giải không theo lựa chọn.** Mỗi câu STEM chỉ có một `explain`, và nó hiện nguyên văn cho
   cả trường hợp đúng lẫn sai (so R13 với R14, R25 với R26).
   - Ở R26 (chọn "Di truyền học"), phản hồi chỉ định nghĩa sinh thái học mà không nói vì sao lựa
     chọn đã chọn chưa đúng.
   - Trục cần xét: "Giải thích nguyên nhân" (mức 1 là "chỉ nhắc đáp án").
4. **R13 (chọn đúng).** Phản hồi bắt đầu bằng "Đây là câu bẫy đúp. Lỗi thứ nhất: …", tức là nói về
   lỗi dù người học đã làm đúng. Cần xét xem phần ghi nhận điều làm đúng có đủ cụ thể không.
5. **Ca hệ thống R37–R39.** Các ca này phân biệt được lỗi mạng, hết phiên và máy chủ từ chối với
   lỗi của người học, và không giả xác nhận đã lưu. Cần chuyên gia xác nhận trục "Trung thực".
   Điểm 2/3 trong các câu này chỉ để minh hoạ.

## Không làm

- Không sửa chữ phản hồi hay nội dung bài. Mọi sửa đổi chỉ làm sau khi chuyên gia kết luận, bằng
  PR riêng, rồi sinh lại bản xuất.
- Không đổi `status`, `scores` hay `reviewer` trong `rubric-40.json`.
