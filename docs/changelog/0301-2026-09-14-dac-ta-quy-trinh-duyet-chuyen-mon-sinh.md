# 0301 — 2026-09-14 — Đặc tả quy trình duyệt chuyên môn, chạy trước cho môn Sinh

**PR:** (điền khi tạo) · **Nhánh:** `claude/optimistic-pasteur-goh7vb`
**Đặc tả sinh ra từ đợt này:** `docs/specs/2026-09-14-quy-trinh-duyet-chuyen-mon-mon-sinh.md`

## Việc đã làm

Trả nợ đã ghi ở `0300`: 442/665 câu trắc nghiệm và 0/294 bài `reviewed` — không cổng máy nào
kiểm được tính đúng kiến thức, nên phải có **quy trình cho người**. Đợt này viết đặc tả cho quy
trình đó, chạy trước cho **môn Sinh** (169/170 câu là trắc nghiệm — môn nằm ngoài tầm cổng máy
nhiều nhất). Đợt này **chỉ viết đặc tả**, chưa thi hành. Ba câu hỏi mở của ô ⓪.5 đã được người dùng chốt
NGAY TRONG PHIÊN, nên đặc tả được viết lại theo câu trả lời thật thay vì theo phỏng đoán:
**Q1 = duyệt trong `/admin`, và duyệt ngay trong trang bài học cũng được** · **Q2 = AI được sàng
lọc nhưng phải làm thật kỹ** · Q3 đã xong ở PR #902.

Nội dung đặc tả: bản ghi duyệt có kiểm chứng được (ai duyệt · ngày · phiên bản tiêu chí · phiếu ·
băm nội dung) · bộ tiêu chí duyệt môn Sinh 7 câu `sinh-v1` · chia 8 lô theo mật độ rủi ro ·
5 bất biến kèm test canh · `npm run review:status` để đọc tiến độ thật thay vì chép tay.

## Quyết định

1. **Chia lô theo MẬT ĐỘ RỦI RO, không theo thứ tự lớp.** Lô 1 là `sinh12-c1` (cơ chế di truyền
   và biến dị) — chương nhiều bài nhất lớp 12 và trừu tượng nhất, nên là phép thử tốt nhất cho
   bộ tiêu chí. Lô 1 đồng thời là **cổng của chính đặc tả**: tiêu chí tỏ ra thiếu/thừa thì sửa
   đặc tả trước, chưa chạy tiếp lô 2.
2. **THÊM trường `review?`, KHÔNG đổi hình `reviewStatus`.** Bản nháp đầu của đặc tả định đổi
   `reviewStatus` từ enum thành bản ghi có cấu trúc. PR #902 merge giữa chừng đã **nối trường đó
   ra giao diện** (3 chỗ so sánh `=== 'draft'` + chỉ mục nạp lười), nên đổi hình nay là breaking
   change chạm UI. Đổi hướng: giữ enum nguyên vẹn, thêm trường mới không bắt buộc, cổng CI canh
   hai trường luôn ăn khớp. Đổi lại: **không phải di trú 294 file dữ liệu**, không phải chụp lại
   Tầng 8b.
3. **Băm nội dung (`bamNoiDung`) là trường bắt buộc của bản ghi duyệt.** Không có nó thì một đợt
   sửa nội dung về sau đi qua bài đã duyệt, chữ `reviewed` ở lại, không ai biết nó đã hết đúng —
   đúng khuôn bẫy `TRAPS.md` mục 4 ở dạng khác: trạng thái nói một đằng, dữ liệu một nẻo.
4. **AI được sàng lọc vòng 1 nhưng KHÔNG bao giờ được ghi `reviewed`** (người dùng chốt Q2).
   Trạng thái `ai-sang-loc` vẫn tính là `draft`, người học vẫn thấy nhãn "Bản nháp" của #902.
5. **"Thật kỹ" phải đo được, không để là lời hứa** (ô ③bis): rà từng câu một chứ không theo bài ·
   mỗi kết luận kèm căn cứ dẫn đúng mệnh đề nghi sai · hai lượt độc lập cho câu bị gắn cờ, lệch
   nhau thì đẩy lên người · chỉ gắn cờ không sửa nội dung · và **ca thử 13 câu** (10 câu đúng +
   3 câu cố ý làm sai) để chứng minh khâu sàng lọc không phải rác trước khi tin nó.
6. **DB là nơi ghi, repo là nguồn sự thật cuối** (ô ②bis). Duyệt trong app ghi xuống Postgres,
   `npm run review:sync` đưa về file dữ liệu và in diff cho người xem trước khi commit. Không có
   đường nào cho một bài thành `reviewed` mà không đi qua một commit — nếu để app đọc thẳng trạng
   thái từ DB thì lại sinh đúng bẫy `TRAPS.md` mục 4 ở dạng mới: DB nói một đằng, repo một nẻo.

## Số liệu đo được (không chép tay)

Chia lô được kiểm bằng script nạp thẳng registry: 8 lô cộng lại đúng **84 bài / 170 câu** bằng
tổng của registry, **0 bài rơi ngoài lô nào**.

| Lô  | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | Tổng    |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ------- |
| Bài | 7   | 12  | 6   | 8   | 5   | 14  | 18  | 14  | **84**  |
| Câu | 14  | 24  | 12  | 16  | 10  | 28  | 36  | 30  | **170** |

## Bằng chứng kiểm chứng

(điền sau khi chạy — xem mô tả PR)

## Còn nợ

Đặc tả đã đủ điều kiện giao việc (ô ⓪.5 chốt xong), nhưng **đợt này không thi hành** — phần thi
hành có migration + API + giao diện, phải là PR riêng và phải qua Tầng 8b.
Nợ nội dung không đổi cho tới khi lô 1 chạy xong: 442 câu trắc nghiệm, 0/294 bài `reviewed`.

**Một giới hạn đã ghi thẳng vào đặc tả, không giấu:** khâu AI sàng lọc giúp người đọc NHANH hơn,
không giúp người đọc ÍT hơn — chính AI đã soạn nội dung này nên nó mù đúng ở chỗ nó đã sai.
