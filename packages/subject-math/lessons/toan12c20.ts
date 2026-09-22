// lessons/toan12c20.ts — Chuyên đề bồi dưỡng HSG cấp QUỐC GIA (track: 'advanced', tier 'hsg-quoc-gia').
// Kỹ thuật chuyên sâu: phương trình hàm Cauchy, nguyên lý cực hạn và bất biến trong tổ hợp.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN12_C20_LESSONS: MathLesson[] = [
  {
    id: 'toan12-c20-b1',
    grade: '12',
    chapterNumber: 20,
    chapterTitle: 'Chuyên đề bồi dưỡng học sinh giỏi quốc gia',
    lessonNumber: 1,
    title: 'Phương trình hàm Cauchy và kỹ thuật thế giá trị đặc biệt',
    hook:
      'Đề bài không cho một phương trình với ẩn là SỐ, mà cho một phương trình với ẩn là cả một HÀM SỐ: "tìm mọi ' +
      'hàm f thoả f(x + y) = f(x) + f(y)". Ta phải tìm ra toàn bộ những hàm thoả mãn, và chứng minh không còn hàm ' +
      'nào khác. Đây là dạng bài đặc trưng của kỳ thi học sinh giỏi quốc gia.',
    theory:
      'PHƯƠNG TRÌNH HÀM CAUCHY CỘNG TÍNH\n' +
      'f(x + y) = f(x) + f(y) với mọi x, y thuộc ℝ.\n' +
      'Nghiệm hiển nhiên là f(x) = ax. Câu hỏi thật sự là: còn nghiệm nào khác không?\n' +
      'TRẢ LỜI CHÍNH XÁC (rất quan trọng, và hay bị nói sai): trên ℝ, nếu KHÔNG có thêm điều kiện gì thì phương ' +
      'trình có những nghiệm "bệnh hoạn" không phải hàm tuyến tính (chúng tồn tại nhờ tiên đề chọn, đồ thị của ' +
      'chúng trù mật khắp mặt phẳng). Nhưng chỉ cần THÊM MỘT trong các điều kiện sau là nghiệm duy nhất trở thành ' +
      'f(x) = ax:\n' +
      '— f liên tục tại một điểm bất kỳ; hoặc\n' +
      '— f đơn điệu trên một khoảng; hoặc\n' +
      '— f bị chặn trên (hoặc dưới) trên một khoảng có độ dài dương.\n' +
      'Đề thi luôn cho một trong các điều kiện ấy, và người làm bài PHẢI dùng tới nó — lời giải không nhắc tới giả ' +
      'thiết liên tục là lời giải chưa chặt.\n\n' +
      'BỐN BƯỚC KINH ĐIỂN TỪ ℕ LÊN ℝ\n' +
      '1. Thay y = x rồi quy nạp: f(nx) = n·f(x) với mọi n nguyên dương. Đặt x = 1 được f(n) = n·f(1).\n' +
      '2. Thay x = y = 0 được f(0) = 0; thay y = −x được f(−x) = −f(x), mở rộng sang số nguyên âm.\n' +
      '3. Với hữu tỉ p/q: từ q·f(p/q) = f(p) = p·f(1) suy ra f(p/q) = (p/q)·f(1). Vậy trên ℚ, hàm chắc chắn tuyến tính.\n' +
      '4. Dùng điều kiện bổ sung (liên tục/đơn điệu/bị chặn) cùng với việc ℚ TRÙ MẬT trong ℝ để mở rộng kết luận từ ' +
      'ℚ lên toàn ℝ. Đây là bước duy nhất cần giải tích, và là bước phân loại thí sinh.\n\n' +
      'BỘ CÔNG CỤ CHUNG CHO MỌI PHƯƠNG TRÌNH HÀM\n' +
      '— THẾ GIÁ TRỊ ĐẶC BIỆT: x = 0, y = 0, x = y, y = −x, y = 1. Mỗi phép thế cho một thông tin mới; hãy thử có ' +
      'hệ thống thay vì ngẫu hứng.\n' +
      '— XÉT TÍNH ĐƠN ÁNH / TOÀN ÁNH: nếu chứng minh được f đơn ánh thì từ f(A) = f(B) suy ra ngay A = B, thường ' +
      'phá vỡ bài toán.\n' +
      '— ĐỔI VAI TRÒ HAI BIẾN: thay (x; y) bởi (y; x) rồi so sánh hai kết quả.\n' +
      '— TÌM ĐIỂM CỐ ĐỊNH: tính f(0), f(1), rồi xét xem f có nhận giá trị 0 tại điểm nào khác không.\n\n' +
      'BƯỚC CUỐI KHÔNG ĐƯỢC QUÊN: THỬ LẠI. Mọi biến đổi trên chỉ chứng minh "nếu f thoả đề thì f phải có dạng này" ' +
      '— tức điều kiện CẦN. Phải thay dạng tìm được vào phương trình gốc để xác nhận nó thật sự thoả. Bỏ bước này ' +
      'thì lời giải chưa hoàn chỉnh và bị trừ điểm.',
    workedExample: {
      problem:
        'Tìm tất cả các hàm f: ℝ → ℝ liên tục thoả mãn f(x + y) = f(x) + f(y) với mọi x, y thực và f(1) = 3.',
      steps: [
        'Bước 1 — Lấy thông tin đầu tiên bằng phép thế đơn giản nhất: cho x = y = 0 được f(0) = 2f(0), suy ra ' +
          'f(0) = 0. Đây luôn là phép thế nên thử đầu tiên với phương trình cộng tính.',
        'Bước 2 — Mở rộng lên số nguyên dương bằng quy nạp: giả sử f(nx) = n·f(x), thay y = nx vào đề được ' +
          'f((n+1)x) = f(x) + f(nx) = (n+1)f(x). Vậy f(n) = n·f(1) = 3n với mọi n nguyên dương.',
        'Bước 3 — Mở rộng sang số âm: cho y = −x được f(0) = f(x) + f(−x) = 0, suy ra f(−x) = −f(x). Kết hợp bước 2 ' +
          'cho f(n) = 3n với mọi n nguyên.',
        'Bước 4 — Mở rộng sang hữu tỉ: với q nguyên dương, q·f(1/q) = f(1) = 3 nên f(1/q) = 3/q; từ đó ' +
          'f(p/q) = p·f(1/q) = 3p/q. Vậy f(r) = 3r với mọi r hữu tỉ.',
        'Bước 5 — Mở rộng lên ℝ bằng giả thiết LIÊN TỤC (đây chính là chỗ phải dùng tới nó): mỗi số thực x là giới ' +
          'hạn của một dãy số hữu tỉ rₙ. Vì f liên tục nên f(x) = lim f(rₙ) = lim 3rₙ = 3x.',
        'Bước 6 — Thử lại để hoàn tất: với f(x) = 3x thì f(x+y) = 3(x+y) = 3x + 3y = f(x) + f(y), đúng; và ' +
          'f(1) = 3, đúng. Vậy f(x) = 3x là nghiệm duy nhất.',
      ],
      answer: 'f(x) = 3x là hàm duy nhất thoả mãn.',
    },
    checkQuestions: [
      {
        prompt:
          'Cho f: ℝ → ℝ thoả f(x + y) = f(x) + f(y) với mọi x, y. Giá trị f(0) bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Thay x = y = 0 được f(0) = f(0) + f(0) = 2f(0), suy ra f(0) = 0. Đây là phép thế đầu tiên nên làm với mọi ' +
          'phương trình hàm cộng tính vì nó gần như luôn cho thông tin. Lưu ý kết luận này KHÔNG cần bất kỳ giả ' +
          'thiết liên tục nào — nó đúng cho mọi nghiệm, kể cả các nghiệm bệnh hoạn.',
      },
      {
        prompt:
          'Một bạn giải xong phương trình hàm và tìm được f(x) = 2x + 1. Bạn ấy có cần thay ngược vào phương trình ' +
          'gốc để kiểm tra không? Nhập 1 nếu CÓ CẦN, 0 nếu KHÔNG CẦN.',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'BẮT BUỘC phải thử lại. Mọi phép thế giá trị đặc biệt chỉ cho điều kiện CẦN: chúng suy ra "nếu f thoả đề ' +
          'thì f phải có dạng này", chứ chưa khẳng định dạng ấy thật sự thoả. Với chính ví dụ trên, f(x) = 2x + 1 ' +
          'KHÔNG thoả phương trình cộng tính: f(x+y) = 2x+2y+1 trong khi f(x)+f(y) = 2x+2y+2, lệch nhau 1 đơn vị. ' +
          'Bỏ bước thử lại là lỗi bị trừ điểm nặng ở kỳ thi quốc gia.',
      },
      {
        prompt:
          'Phương trình f(x+y) = f(x) + f(y) trên ℝ, KHÔNG kèm bất kỳ điều kiện nào khác, có duy nhất nghiệm dạng ' +
          'f(x) = ax hay không? Nhập 1 nếu DUY NHẤT, 0 nếu KHÔNG duy nhất.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'KHÔNG duy nhất — đây là hiểu nhầm rất phổ biến kể cả ở học sinh giỏi. Nếu không có thêm điều kiện, tồn ' +
          'tại những nghiệm phi tuyến tính, dựng được nhờ tiên đề chọn (coi ℝ là không gian vectơ trên ℚ rồi chọn ' +
          'một cơ sở Hamel). Những hàm ấy có đồ thị TRÙ MẬT trong mặt phẳng, không liên tục tại bất kỳ điểm nào. ' +
          'Vì thế lời giải chỉ chặt khi ta THỰC SỰ dùng tới giả thiết bổ sung (liên tục, đơn điệu, hoặc bị chặn ' +
          'trên một khoảng) — và trong bài thi phải chỉ rõ đã dùng nó ở bước nào.',
      },
    ],
    srsCards: [
      {
        hoi: 'Bốn bước chuẩn giải phương trình hàm Cauchy?',
        dap: 'Quy nạp lên ℕ → mở sang ℤ nhờ f(−x) = −f(x) → mở sang ℚ → dùng liên tục và tính trù mật của ℚ để lên ℝ.',
      },
      {
        hoi: 'Vì sao phải có điều kiện liên tục/đơn điệu/bị chặn?',
        dap: 'Vì không có nó, phương trình Cauchy còn các nghiệm phi tuyến tính dựng bằng cơ sở Hamel.',
      },
      {
        hoi: 'Bước cuối bắt buộc của mọi bài phương trình hàm?',
        dap: 'Thử lại nghiệm vào phương trình gốc — các phép thế chỉ cho điều kiện cần.',
      },
    ],
    track: 'advanced',
    advancedTier: 'hsg-quoc-gia',
    reviewStatus: 'draft',
  },
  {
    id: 'toan12-c20-b2',
    grade: '12',
    chapterNumber: 20,
    chapterTitle: 'Chuyên đề bồi dưỡng học sinh giỏi quốc gia',
    lessonNumber: 2,
    title: 'Bất biến và đơn biến trong bài toán tổ hợp',
    hook:
      'Trên bảng viết các số 1, 2, 3, ..., 100. Mỗi lượt, xoá hai số bất kỳ rồi viết thay vào trị tuyệt đối của ' +
      'hiệu hai số ấy. Sau 99 lượt còn đúng một số. Số cuối cùng ấy có thể bằng 0 không? Ta không thể thử hết ' +
      'hàng tỉ cách xoá — nhưng chỉ cần nhìn ra MỘT đại lượng không bao giờ thay đổi là trả lời được trong ba dòng.',
    theory:
      'Ý TƯỞNG CỦA BẤT BIẾN (invariant)\n' +
      'Khi một quá trình có vô số cách thực hiện, đừng cố duyệt hết. Hãy tìm một đại lượng KHÔNG ĐỔI qua mỗi bước. ' +
      'Nếu trạng thái đầu và trạng thái đích có giá trị bất biến khác nhau thì không có cách nào đi từ đầu tới đích ' +
      '— chứng minh xong, bất kể quá trình phức tạp đến đâu.\n' +
      'Sức mạnh của phương pháp nằm ở chỗ nó chứng minh điều KHÔNG THỂ, thứ mà việc thử từng trường hợp không bao ' +
      'giờ làm được.\n\n' +
      'NĂM LOẠI BẤT BIẾN THƯỜNG GẶP\n' +
      '1. TÍNH CHẴN LẺ (bất biến hay dùng nhất). Ví dụ: tổng các số trên bảng có chẵn lẻ không đổi khi thay a, b ' +
      'bởi a − b, vì (a + b) và (a − b) luôn cùng tính chẵn lẻ.\n' +
      '2. SỐ DƯ theo một modulo khéo chọn (mod 3, mod 4, mod 9).\n' +
      '3. TÔ MÀU: tô bàn cờ theo ô đen trắng hoặc nhiều màu rồi đếm số quân trên mỗi màu — công cụ chuẩn cho bài ' +
      'lát gạch, quân mã, domino.\n' +
      '4. TỔNG CÓ TRỌNG SỐ: gán cho mỗi ô/vị trí một trọng số rồi xét tổng.\n' +
      '5. SỐ LẦN NGHỊCH THẾ (dùng cho bài xếp thứ tự, trò chơi 15).\n\n' +
      'ĐƠN BIẾN (monovariant) — ANH EM CỦA BẤT BIẾN\n' +
      'Là đại lượng chỉ thay đổi theo MỘT chiều (luôn tăng hoặc luôn giảm). Nếu nó nhận giá trị nguyên không âm và ' +
      'luôn giảm ngặt thì quá trình BẮT BUỘC phải dừng sau hữu hạn bước — vì không có dãy số nguyên không âm giảm ' +
      'vô hạn. Đây là công cụ chuẩn để chứng minh "quá trình kết thúc" hoặc "tồn tại trạng thái cuối".\n\n' +
      'NGUYÊN LÝ CỰC HẠN\n' +
      'Trong một tập hữu hạn khác rỗng luôn có phần tử lớn nhất và nhỏ nhất. Chiến thuật: giả sử phản chứng, xét ' +
      'cấu hình "cực đoan" nhất (điểm cao nhất, khoảng cách ngắn nhất, số nhỏ nhất thoả tính chất), rồi chỉ ra ta ' +
      'dựng được cấu hình còn cực đoan hơn — mâu thuẫn. Kinh điển nhất là bài toán Sylvester về các điểm thẳng hàng.\n\n' +
      'QUY TRÌNH TÌM BẤT BIẾN KHI LÀM BÀI\n' +
      '1. Làm thử vài bước nhỏ, ghi lại trạng thái. 2. Tính thử vài đại lượng đơn giản (tổng, tích, tổng mod 2, số ' +
      'phần tử lẻ) trên các trạng thái đó. 3. Đại lượng nào giữ nguyên qua mọi bước thì đó là ứng viên. 4. CHỨNG ' +
      'MINH tổng quát rằng nó bất biến, không được chỉ kiểm vài trường hợp. 5. So sánh giá trị ở trạng thái đầu và ' +
      'trạng thái đích.',
    workedExample: {
      problem:
        'Trên bảng viết các số 1, 2, ..., 100. Mỗi lượt xoá hai số a, b rồi viết thay vào |a − b|. Sau 99 lượt còn ' +
        'lại một số. Hỏi số đó có thể bằng 0 không?',
      steps: [
        'Bước 1 — Tìm ứng viên bất biến bằng cách quan sát phép biến đổi: thay a, b bởi |a − b| làm tổng các số trên ' +
          'bảng giảm đi a + b − |a − b|, tức giảm đi 2·min(a; b) — một số CHẴN.',
        'Bước 2 — Rút ra bất biến: tổng các số trên bảng luôn giảm một lượng chẵn, nên TÍNH CHẴN LẺ của tổng không ' +
          'bao giờ thay đổi. Đây chính là bất biến của bài toán.',
        'Bước 3 — Tính giá trị bất biến ở trạng thái đầu: S = 1 + 2 + ... + 100 = 100·101/2 = 5050, là số CHẴN.',
        'Bước 4 — Xét trạng thái đích: khi còn đúng một số, tổng trên bảng chính là số đó. Vì tính chẵn lẻ được bảo ' +
          'toàn nên số cuối cùng BẮT BUỘC phải chẵn.',
        'Bước 5 — Kết luận: số 0 là số chẵn nên bất biến KHÔNG loại trừ nó; câu trả lời là CÓ THỂ. Nhưng bất biến ' +
          'mới chỉ cho điều kiện cần, ta phải chỉ ra một cách làm cụ thể: ghép 1 với 2 được 1, ghép 3 với 4 được 1, ' +
          '... tạo được 50 số 1; rồi ghép các số 1 đôi một để triệt tiêu hết, còn 0.',
        'Bước 6 — Nhận xét mở rộng: nếu dãy ban đầu là 1 đến 101 thì tổng bằng 5151 lẻ, khi ấy số cuối cùng chắc ' +
          'chắn LẺ nên không thể bằng 0. Cùng một bất biến, hai kết luận trái ngược — đó là lý do phải tính giá trị ' +
          'cụ thể chứ không suy đoán.',
      ],
      answer:
        'Có thể bằng 0, vì tổng ban đầu 5050 là số chẵn và tính chẵn lẻ của tổng là bất biến.',
    },
    checkQuestions: [
      {
        prompt:
          'Trên bảng viết các số từ 1 đến 101. Mỗi lượt xoá hai số a, b và viết thay |a − b|. Số cuối cùng còn lại ' +
          'có thể bằng 0 không? Nhập 1 nếu CÓ THỂ, 0 nếu KHÔNG THỂ.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Tổng ban đầu 1 + 2 + ... + 101 = 101·102/2 = 5151, là số LẺ. Phép biến đổi làm tổng giảm một lượng chẵn ' +
          'nên tính chẵn lẻ được bảo toàn; số cuối cùng bắt buộc phải LẺ, do đó không thể bằng 0. Lỗi tư duy thường ' +
          'gặp là cố thử vài chục cách xoá rồi kết luận theo cảm giác — thử nghiệm không bao giờ chứng minh được ' +
          'điều không thể, chỉ bất biến mới làm được.',
      },
      {
        prompt:
          'Một bàn cờ 8×8 bị cắt bỏ hai ô ở hai góc đối diện nhau. Có lát kín 62 ô còn lại bằng 31 quân domino ' +
          '1×2 được không? Nhập 1 nếu ĐƯỢC, 0 nếu KHÔNG ĐƯỢC.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Bài toán kinh điển của phương pháp tô màu. Tô bàn cờ đen trắng xen kẽ: mỗi quân domino luôn phủ đúng MỘT ' +
          'ô đen và MỘT ô trắng, nên 31 quân phủ 31 đen và 31 trắng. Nhưng hai ô góc ĐỐI DIỆN nhau luôn CÙNG MÀU, ' +
          'nên sau khi cắt còn 32 ô màu này và 30 ô màu kia — không cân bằng. Vậy không lát được. Nhiều bạn chỉ đếm ' +
          '62 = 31·2 rồi kết luận "chia hết nên làm được"; điều kiện chia hết chỉ là cần, chưa đủ.',
      },
      {
        prompt:
          'Một đại lượng nguyên không âm và giảm ngặt sau mỗi bước của một quá trình. Có thể kết luận quá trình đó ' +
          'dừng sau hữu hạn bước không? Nhập 1 nếu CÓ, 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'CÓ — đây là toàn bộ ý tưởng của đơn biến. Không tồn tại dãy số nguyên không âm giảm ngặt vô hạn, vì nó ' +
          'sẽ phải đi xuống dưới 0. Lưu ý ba điều kiện đều cần: NGUYÊN (dãy số thực dương có thể giảm mãi, như ' +
          '1/2, 1/4, 1/8, ...), KHÔNG ÂM (số nguyên âm giảm mãi được), và giảm NGẶT (giảm không ngặt thì có thể ' +
          'đứng yên mãi). Thiếu bất kỳ điều nào, kết luận sụp đổ.',
      },
    ],
    srsCards: [
      {
        hoi: 'Bất biến dùng để chứng minh điều gì?',
        dap: 'Chứng minh một trạng thái KHÔNG thể đạt tới, bằng cách chỉ ra giá trị bất biến ở đầu và đích khác nhau.',
      },
      {
        hoi: 'Đơn biến nguyên không âm giảm ngặt cho kết luận gì?',
        dap: 'Quá trình phải dừng sau hữu hạn bước — không có dãy nguyên không âm giảm ngặt vô hạn.',
      },
      {
        hoi: 'Bất biến nào hay dùng nhất và ví dụ điển hình?',
        dap: 'Tính chẵn lẻ; điển hình là bài lát domino trên bàn cờ bị cắt hai ô cùng màu.',
      },
    ],
    track: 'advanced',
    advancedTier: 'hsg-quoc-gia',
    reviewStatus: 'draft',
  },
]
