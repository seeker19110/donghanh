# S09–S12 — Bộ chuẩn bị triển khai v1

Trạng thái: **Draft / reviewable**, base `f07820aa`, ngày 2026-09-23. Đây là tài liệu
và prototype cục bộ, chưa phải tính năng đã tích hợp. Không thay source production,
không gọi provider, không thay mastery/evidence/lịch ôn.

| Slice | Đầu ra hiện có                                                                                                                                                                                | Còn chặn triển khai/nghiệm thu                                                          |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| S09   | [Prototype](prototype.html), [fixture thật](fixtures.json), quyết định anchor/focus bên dưới                                                                                                  | M1/M2; spec Approved và merged; caller contract; ảnh và E2E trên app thật               |
| S10   | [40 ca](rubric-40.json), [rubric và negative controls](rubric-review.md); **S10b:** [phản hồi ứng viên](candidate-feedback.json) sinh từ mã nguồn + [sàng lọc agent](agent-screening-s10b.md) | Chuyên gia duyệt từng ca; English cần chạy provider hoặc mẫu viết tay                   |
| S11   | [Ma trận routing](routing-matrix.md)                                                                                                                                                          | S03/S09/S10; xác minh metadata lập trình; spec Approved và merged                       |
| S12   | [Protocol, phiếu nhiệm vụ, báo cáo](acceptance-protocol.md)                                                                                                                                   | S01–S11 tích hợp; audit thật; 8 người lớn tự nguyện; ngày 7/14; chủ sản phẩm nghiệm thu |

## Quyết định chuẩn bị đã chốt

- Mục lục mang nhãn “Trong bài”; giữ mục lục khóa hiện có. Mở mục lục rồi chọn đích là
  hai lần kích hoạt. Chọn đích đóng mục lục và focus heading đích; đóng bằng nút trả
  focus về nút mở. Không thay điểm/nháp khi jump.
- Giữ `#cau-N` của STEM (`neoCauHoi`, N = questionIndex + 1). Anchor section mới đề xuất
  `#ly-thuyet`, `#vi-du`, `#tu-kiem`, `#ket-qua`, `#dau-bai`. Đây là contract prototype;
  cần kiểm xung đột heading/caller trước source. Không dùng thứ tự hiển thị câu sai
  làm khóa. Sắp câu sai trước nhưng giữ nhãn câu gốc.
- Hash hợp lệ focus đích; Back/Forward dùng cùng xử lý; hash không tồn tại về đầu bài.
  Prototype không có storage: nháp chỉ sống trong lần mở trang và không tuyên bố
  phục hồi qua reload. App thật phải giữ contract nháp của từng caller.
- Kết quả tóm tắt trạng thái luôn hiện, lời giải mở theo từng câu. Chỉ `passed` dùng
  “hoàn thành”; `failed/pending/local/error` không bị đổi thành thành công. Ngưỡng
  đạt và lỗi server vẫn có chữ. Live region chỉ chứa tóm tắt.
- Tái dùng `LessonProse`, `ActivityResult`, `MistakeBank`, `mistakeRoutes` và cơ chế ôn
  hiện có khi nối production. Prototype dùng HTML tự chứa để review interaction,
  không phải component thay thế hoặc hệ theme thứ hai.

## Cách review prototype

Mở `prototype.html` bằng trình duyệt. Thử chọn năm trạng thái, nhập nháp, dùng mục lục,
nhấn Back/Forward, mở URL `#cau-1` và `#khong-ton-tai`. Xác nhận nháp không đổi trong
navigation, heading có focus, mục lục đóng đúng cách, lời giải không bị đọc toàn bộ
khi chỉ đổi trạng thái. “Gửi lại” và “Làm lại” không được mô phỏng thành đã lưu.

Ma trận cần chạy: 320/390/768/1440px × ba theme; zoom 200%; bàn phím; reduced motion.
Prototype có lựa chọn theme phục vụ review, không khẳng định parity theme production.
Ảnh trước/sau và phép đo contrast trên app thật vẫn **chưa chạy**. Bốn fixture STEM
trỏ bài đầu môn; English id 1 có hội thoại dài; lập trình `p1-u1-l1` có predict/parsons.
Các fixture xác minh bằng source, không đại diện đủ mọi bài hoặc mọi trình độ.

## Ranh giới bàn giao

Exclusive write set: `docs/ux-upgrade/s09-s12/**`; spec nhóm chỉ sửa khi cần hiệu đính,
không tự chuyển Approved. Root tích hợp/review/publish; không tự merge/deploy/pilot.
`AGENTS.md` yêu cầu spec được nghiên cứu, review, Approved và merge trước source;
việc giao subagent không tự đáp ứng điều kiện đó. S10/S12 không thể DONE bằng agent
chấm thay chuyên gia hoặc dữ liệu người học giả.

## Review browser của agent điều phối

Node 22 + Chromium: sáu tổ hợp 390/1440px × sáng/tối/ấm không tràn ngang;
đổi mục lục tới kết quả đưa focus đúng heading, giữ ô nháp; năm trạng thái hiển thị
đúng fixture; quay lại câu và Back trả focus đúng. Đã xem ảnh mobile sáng.
Đây là kiểm prototype HTML độc lập, không phải nghiệm thu UI production hoặc pilot.
Ảnh local: `C:/Users/liend/.codex/uiux-implementation/prototype-review/`.
