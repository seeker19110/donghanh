# S11 — Ma trận quay lại nguồn v1

Đối chiếu source tại `f07820aa`; chưa chạy E2E. Không tạo sổ lỗi hoặc API mới.

| Nguồn            | Định danh hiện có                                                  | Builder/đích                                                                    | Nhãn trung thực                         | Phần chưa có bằng chứng                                 |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------- |
| STEM bốn môn     | subjectId/contentId/questionIndex                                  | `duongDanCauSaiStem` → `/goc-hoc-tap/{subject}/bai-hoc/{content}#cau-{index+1}` | Tự thử lại câu này                      | Focus, return path, nguồn bị xóa, nháp và retry cần E2E |
| English chat     | source=chat                                                        | `duongDanOnLaiLoiAnh` → `/goc-hoc-tap/english/tro-truyen`                       | Mở phần trò chuyện                      | Không có câu/turn đích; không hứa đúng câu              |
| English writing  | source=writing                                                     | cùng builder → `/goc-hoc-tap/english/luyen-viet`                                | Mở phần luyện viết                      | Không có bài/câu đích                                   |
| English speaking | source=speaking                                                    | cùng builder → `/goc-hoc-tap/english/luyen-noi`                                 | Mở phần luyện nói                       | Không có câu/audio đích                                 |
| Lập trình        | lesson id tồn tại ở curriculum; chưa chứng minh lỗi mang lesson id | `programmingRoutes.duongDanBaiHoc` dùng lesson đã lookup, giữ `?khoa=`          | Mở bài học (chỉ khi có metadata hợp lệ) | Không tự bịa route câu; cần audit caller và schema lỗi  |

`evidenceMistakes.ts` dùng khóa `${subjectId}:${contentId}:${questionIndex}` và evidence
đúng mới hơn gỡ lỗi. Không dùng index sau sort/filter làm định danh. `#cau-N` là contract
hiện hữu; prototype giữ nguyên. ID bị xóa không được redirect lặng lẽ sang môn khác.
Đích phục hồi là danh sách bài đúng môn, có thông báo không tìm thấy bài/câu.

## Ma trận thao tác / bằng chứng cần thu

| Ca                  | Thao tác                         | Kỳ vọng                                             | Evidence hiện tại |
| ------------------- | -------------------------------- | --------------------------------------------------- | ----------------- |
| Sai → tự thử        | Mở câu → trả lời mới → nộp       | Attempt mới theo caller; chỉ evidence hợp lệ gỡ lỗi | Chưa chạy         |
| Pending             | Mở câu khi lượt trước chưa gửi   | Giữ pending, không tự ghi completed                 | Chưa chạy         |
| Retry mất response  | Gửi lại cùng lượt                | Cùng attempt id, không nhân đôi                     | Chưa chạy         |
| Làm lại             | Bắt đầu lượt luyện mới           | Attempt mới; không lộ lời giải mặc định             | Chưa chạy         |
| Nguồn không tồn tại | Mở content/question đã xóa       | Báo rõ + về danh sách đúng môn                      | Chưa chạy         |
| Không có lỗi        | Mở sổ lỗi rỗng                   | Nói rõ không có lỗi cần ôn, còn đường về bài        | Chưa chạy         |
| Xen kẽ môn cap=1    | Toán/Lí/Hoá/Sinh rồi lọc một môn | Không lấy câu môn khác; hub ôn tổng còn hoạt động   | Chờ S03           |
| Hết phiên           | Gửi khi auth hết hạn             | Giữ bản nháp/pending theo contract; đăng nhập lại   | Chưa chạy         |
| Bàn phím quay về    | Mở nguồn, Back về sổ             | Focus control hợp lý, không bị header che           | Chưa chạy         |
| Hẹn ôn lặp          | Nhấn hai lần/lỗi mạng rồi retry  | Không thẻ trùng; nhãn lưu đúng storage              | Chưa chạy         |

Click CTA, mở lời giải và tự đánh giá thẻ không là bằng chứng làm đúng mới. `reviewSlot`
là chỗ cắm UI, không cho phép tự cập nhật mastery. `onRetry` của ActivityResult là làm
lại; retry gửi pending thuộc contract evidence, không nối nhầm hai hành động.
