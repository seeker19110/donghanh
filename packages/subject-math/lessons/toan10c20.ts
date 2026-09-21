// lessons/toan10c20.ts — Chuyên đề bồi dưỡng HSG cấp TRƯỜNG (track: 'advanced', tier 'hsg-truong').
// Hai chuyên đề đi thẳng lên từ chương trình chuẩn lớp 10: bất đẳng thức AM–GM, chia hết và đồng dư.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN10_C20_LESSONS: MathLesson[] = [
  {
    id: 'toan10-c20-b1',
    grade: '10',
    chapterNumber: 20,
    chapterTitle: 'Chuyên đề bồi dưỡng học sinh giỏi cấp trường',
    lessonNumber: 1,
    title: 'Bất đẳng thức AM–GM và kỹ thuật tìm giá trị nhỏ nhất',
    hook:
      'Với 20 mét lưới, bác nông dân muốn quây một mảnh vườn hình chữ nhật rộng nhất có thể. Quây dài và hẹp thì ' +
      'diện tích bé; quây vuông vắn thì diện tích lớn. Vì sao hình vuông lại thắng? Câu trả lời là một bất đẳng thức ' +
      'chỉ có hai dòng nhưng xuất hiện trong hầu hết đề thi học sinh giỏi.',
    theory:
      'PHÁT BIỂU (AM–GM, còn gọi là bất đẳng thức Cauchy ở Việt Nam)\n' +
      'Với hai số KHÔNG ÂM a, b: (a + b)/2 ≥ √(ab), tức a + b ≥ 2√(ab). Dấu bằng xảy ra khi và chỉ khi a = b.\n' +
      'Với ba số không âm: a + b + c ≥ 3·∛(abc), dấu bằng khi a = b = c.\n' +
      'Tổng quát cho n số không âm: trung bình CỘNG luôn lớn hơn hoặc bằng trung bình NHÂN.\n\n' +
      'CHỨNG MINH TRƯỜNG HỢP HAI SỐ (nên tự dựng lại được)\n' +
      'a + b − 2√(ab) = (√a − √b)² ≥ 0. Bình phương của một số thực luôn không âm, và bằng 0 khi và chỉ khi ' +
      '√a = √b, tức a = b. Toàn bộ bất đẳng thức chỉ là hằng đẳng thức bình phương viết lại.\n\n' +
      'ĐIỀU KIỆN BẮT BUỘC — CHỖ MẤT ĐIỂM SỐ MỘT\n' +
      'Các số phải KHÔNG ÂM. Với a = −1 và b = −4 thì a + b = −5 trong khi 2√(ab) = 4, bất đẳng thức sai hoàn toàn. ' +
      'Trước khi áp AM–GM, luôn phải khẳng định các đại lượng đang dương.\n\n' +
      'HAI KỸ THUẬT NỀN TẢNG\n' +
      '1. GHÉP CẶP NGHỊCH ĐẢO: với x > 0 thì x + 1/x ≥ 2, dấu bằng khi x = 1. Đây là dạng hay gặp nhất; nhận ra một ' +
      'biểu thức có tích của hai hạng tử là HẰNG SỐ là dấu hiệu áp dụng được ngay.\n' +
      '2. NGUYÊN LÝ CHUNG: tổng của các số dương có TÍCH không đổi thì nhỏ nhất khi các số bằng nhau; tích của các ' +
      'số dương có TỔNG không đổi thì lớn nhất khi các số bằng nhau. Bài toán mảnh vườn thuộc vế thứ hai: chu vi ' +
      '(tổng) cố định nên diện tích (tích) lớn nhất khi hai cạnh bằng nhau, tức hình vuông.\n\n' +
      'QUY TRÌNH TRÌNH BÀY CHUẨN (thiếu bước nào cũng bị trừ điểm)\n' +
      '1. Nêu điều kiện các biến dương. 2. Áp bất đẳng thức, ghi rõ dùng cho những số nào. 3. Tìm ĐIỀU KIỆN DẤU ' +
      'BẰNG và kiểm nó có xảy ra được trong miền xác định hay không. 4. Kết luận giá trị nhỏ nhất/lớn nhất kèm giá ' +
      'trị của biến.\n' +
      'BƯỚC 3 LÀ BƯỚC HAY BỊ BỎ QUÊN NHẤT: nếu điều kiện dấu bằng KHÔNG thoả được (ví dụ nó đòi x = 3 nhưng đề giới ' +
      'hạn x ≤ 2) thì con số tìm được chỉ là một chặn dưới, KHÔNG phải giá trị nhỏ nhất. Khi ấy phải dùng tính đơn ' +
      'điệu để xử lý thay vì AM–GM.',
    workedExample: {
      problem: 'Cho x > 0. Tìm giá trị nhỏ nhất của biểu thức P = x + 4/x.',
      steps: [
        'Bước 1 — Kiểm điều kiện áp dụng: đề cho x > 0 nên cả hai hạng tử x và 4/x đều dương. Điều kiện không âm của ' +
          'AM–GM được thoả.',
        'Bước 2 — Nhận dạng: tích hai hạng tử là x · (4/x) = 4, một HẰNG SỐ. Đây chính là dấu hiệu để dùng AM–GM cho ' +
          'hai số — nếu tích không phải hằng số thì kỹ thuật này không cho kết quả đẹp.',
        'Bước 3 — Áp dụng: P = x + 4/x ≥ 2√(x · 4/x) = 2√4 = 4.',
        'Bước 4 — Tìm và kiểm điều kiện dấu bằng: dấu bằng xảy ra khi x = 4/x ⇔ x² = 4 ⇔ x = 2 (loại x = −2 vì trái ' +
          'điều kiện x > 0). Giá trị x = 2 nằm trong miền xác định nên dấu bằng ĐẠT ĐƯỢC.',
        'Bước 5 — Kết luận: giá trị nhỏ nhất của P là 4, đạt tại x = 2. Kiểm chứng bằng vài giá trị: P(1) = 5, ' +
          'P(2) = 4, P(4) = 5 — đúng là 4 thấp nhất.',
      ],
      answer: 'Giá trị nhỏ nhất của P bằng 4, đạt được khi x = 2.',
    },
    checkQuestions: [
      {
        prompt: 'Cho x > 0. Giá trị nhỏ nhất của biểu thức x + 9/x bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 6 },
        explain:
          'Tích hai hạng tử bằng 9 là hằng số nên dùng AM–GM: x + 9/x ≥ 2√9 = 6, dấu bằng khi x = 3 (thoả x > 0). ' +
          'Lỗi hay gặp là trả lời 9 (nhầm lấy luôn hằng số trong biểu thức) hoặc 3 (quên nhân 2). Nhớ công thức ' +
          'a + b ≥ 2√(ab): phải khai căn tích RỒI nhân đôi.',
      },
      {
        prompt:
          'Cho hai số thực a = −1 và b = −4. Bất đẳng thức a + b ≥ 2√(ab) có đúng với cặp số này không? ' +
          'Nhập 1 nếu ĐÚNG, 0 nếu SAI.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'SAI, và đây chính là bẫy trọng tâm. Ta có a + b = −5 còn 2√(ab) = 2√4 = 4, rõ ràng −5 < 4. Lý do: AM–GM ' +
          'đòi hỏi các số KHÔNG ÂM, mà a, b ở đây đều âm. Rất nhiều bài thi mất điểm vì áp AM–GM cho biểu thức chưa ' +
          'chứng minh được là dương. Luôn nêu điều kiện dương trước khi viết dòng bất đẳng thức đầu tiên.',
      },
      {
        prompt:
          'Cho x ≥ 3. Giá trị nhỏ nhất của P = x + 4/x bằng bao nhiêu? (Nhập dạng phân số tối giản.)',
        answer: { kind: 'fraction', num: 13, den: 3 },
        explain:
          'Đây là bẫy tinh vi nhất của chuyên đề. AM–GM cho P ≥ 4 với dấu bằng tại x = 2, NHƯNG x = 2 không thoả ' +
          'điều kiện x ≥ 3, nên 4 chỉ là một chặn dưới không đạt được. Phải chuyển sang xét tính đơn điệu: với x ≥ 3 ' +
          'thì hàm x + 4/x đồng biến (vì đã vượt qua điểm cực tiểu x = 2), nên giá trị nhỏ nhất rơi vào đầu mút ' +
          'x = 3, cho P = 3 + 4/3 = 13/3 ≈ 4,33. Bài học: luôn KIỂM điều kiện dấu bằng có nằm trong miền xác định không.',
      },
    ],
    srsCards: [
      {
        hoi: 'Phát biểu AM–GM cho hai số và điều kiện áp dụng?',
        dap: 'a + b ≥ 2√(ab) với a, b KHÔNG ÂM; dấu bằng khi a = b.',
      },
      {
        hoi: 'Dấu hiệu nhận biết dùng được AM–GM cho hai hạng tử?',
        dap: 'Tích của hai hạng tử là một hằng số.',
      },
      {
        hoi: 'Bước nào hay bị quên nhất khi dùng AM–GM tìm giá trị nhỏ nhất?',
        dap: 'Kiểm xem điều kiện dấu bằng có xảy ra được trong miền xác định hay không.',
      },
    ],
    track: 'advanced',
    advancedTier: 'hsg-truong',
    reviewStatus: 'draft',
  },
  {
    id: 'toan10-c20-b2',
    grade: '10',
    chapterNumber: 20,
    chapterTitle: 'Chuyên đề bồi dưỡng học sinh giỏi cấp trường',
    lessonNumber: 2,
    title: 'Chia hết và đồng dư cơ bản trong số học',
    hook:
      'Hôm nay là thứ Ba. Hỏi 1000 ngày nữa là thứ mấy? Không ai đi đếm từng ngày cả — chỉ cần lấy 1000 chia 7 lấy ' +
      'phần dư. Cách nghĩ "chỉ quan tâm phần dư" ấy đơn giản đến bất ngờ, nhưng nó là nền của cả một nhánh toán học ' +
      'và là công cụ giải phần lớn bài số học trong đề thi học sinh giỏi.',
    theory:
      'QUAN HỆ CHIA HẾT\n' +
      'Số nguyên a chia hết cho b (b ≠ 0) nếu tồn tại số nguyên k sao cho a = bk. Ký hiệu b | a.\n' +
      'Tính chất nền: nếu b | a và b | c thì b | (a ± c) và b | (ma + nc) với mọi số nguyên m, n. Tính chất cuối ' +
      'cùng là công cụ chủ lực — nó cho phép "tổ hợp tuyến tính" hai biểu thức chia hết để tạo ra biểu thức đơn giản hơn.\n\n' +
      'ĐỒNG DƯ — NGÔN NGỮ GỌN CỦA PHÉP CHIA CÓ DƯ\n' +
      'Viết a ≡ b (mod n) khi a và b có cùng số dư khi chia cho n, tương đương n | (a − b).\n' +
      'BA QUY TẮC ĐƯỢC PHÉP LÀM: nếu a ≡ b và c ≡ d (mod n) thì a + c ≡ b + d, a − c ≡ b − d, và a·c ≡ b·d (mod n).\n' +
      'ĐIỀU KHÔNG ĐƯỢC PHÉP: KHÔNG rút gọn tuỳ tiện trong đồng dư. Từ 6 ≡ 12 (mod 6) không suy ra được 1 ≡ 2 (mod 6). ' +
      'Rút gọn chỉ hợp lệ khi thừa số chung nguyên tố cùng nhau với modulo.\n\n' +
      'VÌ SAO ĐỒNG DƯ MẠNH ĐẾN THẾ\n' +
      'Nó biến bài toán về những con số khổng lồ thành bài toán trên một tập HỮU HẠN chỉ n phần tử {0; 1; ...; n−1}. ' +
      'Tính 2¹⁰⁰⁰ là bất khả thi, nhưng tìm số dư của 2¹⁰⁰⁰ khi chia 7 thì chỉ mất ba dòng, vì luỹ thừa của 2 theo ' +
      'mod 7 lặp lại theo chu kỳ.\n\n' +
      'KỸ THUẬT TÌM CHU KỲ (dùng cho mọi bài "tìm chữ số tận cùng" hay "tìm số dư của luỹ thừa")\n' +
      'Tính lần lượt a¹, a², a³, ... theo mod n cho tới khi gặp lại số dư 1 hoặc gặp lại một số dư đã xuất hiện. Vì ' +
      'chỉ có hữu hạn số dư nên chu kỳ CHẮC CHẮN tồn tại — đây là áp dụng của nguyên lý ngăn kéo Dirichlet.\n\n' +
      'MỘT SỐ DẤU HIỆU HAY DÙNG\n' +
      '— Tích của k số nguyên liên tiếp luôn chia hết cho k!.\n' +
      '— Số chính phương chia 4 chỉ dư 0 hoặc 1; chia 3 chỉ dư 0 hoặc 1. Đây là công cụ chuẩn để CHỨNG MINH một ' +
      'phương trình không có nghiệm nguyên: chỉ cần chỉ ra hai vế cho số dư khác nhau theo một modulo khéo chọn.',
    workedExample: {
      problem: 'Tìm số dư khi chia 2¹⁰⁰⁰ cho 7.',
      steps: [
        'Bước 1 — Nhận định chiến lược: không thể tính trực tiếp 2¹⁰⁰⁰. Chuyển sang làm việc theo mod 7, nơi chỉ có ' +
          '7 giá trị dư có thể nên chắc chắn có chu kỳ.',
        'Bước 2 — Tìm chu kỳ bằng cách tính vài luỹ thừa đầu: 2¹ ≡ 2; 2² ≡ 4; 2³ ≡ 8 ≡ 1 (mod 7). Gặp số dư 1 ở mũ 3 ' +
          'nên chu kỳ có độ dài 3 — từ đây mọi thứ lặp lại.',
        'Bước 3 — Phân tích số mũ theo chu kỳ: 1000 = 3·333 + 1, tức số mũ chia 3 dư 1.',
        'Bước 4 — Dùng quy tắc nhân của đồng dư: 2¹⁰⁰⁰ = (2³)³³³ · 2¹ ≡ 1³³³ · 2 ≡ 2 (mod 7).',
        'Bước 5 — Kiểm chứng trên số nhỏ để yên tâm về phương pháp: 2⁴ = 16, mà 16 chia 7 dư 2; số mũ 4 cũng chia 3 ' +
          'dư 1, cho cùng kết quả 2. Phương pháp nhất quán.',
      ],
      answer: 'Số dư bằng 2.',
    },
    checkQuestions: [
      {
        prompt: 'Tìm số dư khi chia 3¹⁰⁰ cho 4.',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'Nhận xét 3 ≡ −1 (mod 4) — dùng số dư ÂM là mẹo rút ngắn rất mạnh. Khi đó 3¹⁰⁰ ≡ (−1)¹⁰⁰ = 1 (mod 4). ' +
          'Cách khác: 3² = 9 ≡ 1 (mod 4) nên chu kỳ bằng 2, mà 100 chẵn nên số dư là 1. Lỗi hay gặp là cố tính ' +
          '3¹⁰⁰ bằng máy tính rồi tràn số.',
      },
      {
        prompt:
          'Một số chính phương khi chia cho 4 có thể cho số dư bằng 2 hay không? Nhập 1 nếu CÓ, 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'KHÔNG. Xét n theo mod 2: nếu n chẵn, n = 2k thì n² = 4k² ≡ 0 (mod 4); nếu n lẻ, n = 2k+1 thì ' +
          'n² = 4k² + 4k + 1 ≡ 1 (mod 4). Vậy số chính phương chia 4 chỉ dư 0 hoặc 1, không bao giờ dư 2 hay 3. ' +
          'Đây là một trong những công cụ hữu ích nhất để chứng minh phương trình vô nghiệm nguyên: nếu một vế buộc ' +
          'phải dư 2 theo mod 4 thì nó không thể là số chính phương.',
      },
      {
        prompt:
          'Từ đồng dư 6 ≡ 12 (mod 6), có được phép chia cả hai vế cho 6 để suy ra 1 ≡ 2 (mod 6) không? ' +
          'Nhập 1 nếu ĐƯỢC, 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'KHÔNG được, và đây là sai lầm cực kỳ phổ biến khi mới học đồng dư. Kết quả 1 ≡ 2 (mod 6) hiển nhiên sai ' +
          'vì 6 không chia hết 1 − 2 = −1. Phép rút gọn chỉ hợp lệ khi thừa số chung NGUYÊN TỐ CÙNG NHAU với modulo; ' +
          'ở đây thừa số 6 và modulo 6 có ước chung là 6. Đồng dư cho phép cộng, trừ, nhân thoải mái, nhưng phép ' +
          'chia thì có điều kiện chặt.',
      },
    ],
    srsCards: [
      {
        hoi: 'Ba phép toán luôn hợp lệ với đồng dư?',
        dap: 'Cộng, trừ và nhân hai vế. Riêng phép chia cần thừa số nguyên tố cùng nhau với modulo.',
      },
      {
        hoi: 'Số chính phương chia 4 cho những số dư nào?',
        dap: 'Chỉ 0 hoặc 1 — công cụ chuẩn để chứng minh phương trình vô nghiệm nguyên.',
      },
      {
        hoi: 'Vì sao luỹ thừa theo một modulo luôn có chu kỳ?',
        dap: 'Vì chỉ có hữu hạn số dư, nên theo nguyên lý ngăn kéo phải có số dư lặp lại.',
      },
    ],
    track: 'advanced',
    advancedTier: 'hsg-truong',
    reviewStatus: 'draft',
  },
]
