# S04 — Chiều học và ngôn ngữ giao diện trong Practice

- Mở một mode chốt chiều học A/B và tập câu của phiên. Đổi ngôn ngữ giao diện chỉ đổi nhãn; danh sách phát âm không trộn lại khi render. Về hub rồi mở mode mới mới đọc lại chiều học.
- Tám mode dùng `isA` cho dữ liệu học, TTS/STT và feedback; dùng `uiLang` cho chữ điều khiển, trạng thái và lỗi. Chấm phát âm chi tiết giữ phân biệt fallback và lỗi cứng; mã lỗi cấu trúc được bật riêng để consumer cũ không đổi kết quả.
- Phần tải nội dung có trạng thái đang tải/lỗi và nút thử lại; response của người dùng cũ không ghi sang phiên mới. Callback ghi âm/chấm muộn không hồi sinh UI của phiên đã rời; lượt provider đã gọi vẫn được tính theo hành vi hiện có.
- Kiểm bằng unit theo ma trận A/B × vi/en, callback muộn, Retry, guest và đổi user; E2E mô phỏng không gọi provider trả phí. Kiểm thực tế microphone, thiết bị và ba theme vẫn cần ghi bằng chứng riêng.
