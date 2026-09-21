// lessons/toan11c6.ts — Toán 11, Chương 6: Hàm số mũ và hàm số lôgarit.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN11_C6_LESSONS: MathLesson[] = [
  {
    id: 'toan11-c6-b1',
    grade: '11',
    chapterNumber: 6,
    chapterTitle: 'Hàm số mũ và hàm số lôgarit',
    lessonNumber: 1,
    title: 'Lôgarit và các quy tắc tính',
    hook:
      'Trận động đất 7 độ Richter mạnh hơn trận 6 độ bao nhiêu lần? Câu trả lời không phải "hơn 1 độ" mà là "biên độ ' +
      'rung gấp 10 lần". Độ ồn tính bằng decibel, độ chua pH của nước mắm, độ sáng của các vì sao — tất cả đều dùng cùng ' +
      'một thang đo nén những con số khổng lồ về cỡ dễ đọc. Thang đó là lôgarit.',
    theory:
      'ĐỊNH NGHĨA\n' +
      'Với a > 0, a ≠ 1 và b > 0: log_a b = α ⇔ aᵅ = b.\n' +
      'Nói cách khác, lôgarit trả lời câu hỏi "phải nâng a lên luỹ thừa bao nhiêu để được b?". Nó là phép toán NGƯỢC ' +
      'của phép nâng luỹ thừa, giống như phép chia ngược với phép nhân.\n\n' +
      'VÌ SAO CÓ CÁC ĐIỀU KIỆN NGẶT NGHÈO ĐÓ\n' +
      '— b > 0: vì aᵅ với a dương luôn cho kết quả dương, nên không có luỹ thừa nào của 2 bằng −8. log của số âm ' +
      'hoặc số 0 KHÔNG tồn tại.\n' +
      '— a > 0: nếu a âm thì aᵅ không xác định với nhiều số mũ (ví dụ (−2)^0,5).\n' +
      '— a ≠ 1: vì 1ᵅ luôn bằng 1, nên phương trình 1ᵅ = b hoặc vô nghiệm hoặc vô số nghiệm — không xác định được ' +
      'một giá trị duy nhất.\n' +
      'Đây là ĐIỀU KIỆN XÁC ĐỊNH, phải viết ra đầu mỗi bài giải phương trình lôgarit, nếu không sẽ nhận nghiệm ngoại lai.\n\n' +
      'BA QUY TẮC TÍNH CỐT LÕI\n' +
      '1. log_a(xy) = log_a x + log_a y — biến NHÂN thành CỘNG.\n' +
      '2. log_a(x/y) = log_a x − log_a y — biến CHIA thành TRỪ.\n' +
      '3. log_a(xᵅ) = α·log_a x — biến LUỸ THỪA thành NHÂN.\n' +
      'Cả ba đều là hệ quả trực tiếp của quy tắc luỹ thừa: aᵐ·aⁿ = aᵐ⁺ⁿ. Chính khả năng "hạ cấp phép toán" này đã ' +
      'làm nên giá trị lịch sử của lôgarit — trước khi có máy tính, người ta nhân những số rất lớn bằng cách tra ' +
      'bảng lôgarit rồi cộng lại.\n\n' +
      'ĐỔI CƠ SỐ: log_a b = log_c b / log_c a. Nhờ nó, máy tính chỉ cần hai phím log (cơ số 10) và ln (cơ số e) là ' +
      'tính được lôgarit cơ số bất kỳ.\n\n' +
      'CẢNH BÁO VỀ NHỮNG "QUY TẮC" KHÔNG TỒN TẠI\n' +
      'log(x + y) KHÔNG bằng log x + log y. log(x·y) mới bằng log x + log y. Đây là lỗi sai số một của chương. Kiểm ' +
      'chứng bằng số: log₁₀(10 + 90) = log₁₀ 100 = 2, trong khi log₁₀10 + log₁₀90 = 1 + 1,95 = 2,95. Khác hẳn nhau.\n' +
      'Tương tự, (log x)² khác log(x²): cái sau bằng 2log x.\n\n' +
      'TÍNH ĐƠN ĐIỆU — QUAN TRỌNG KHI GIẢI BẤT PHƯƠNG TRÌNH\n' +
      'Hàm log_a x ĐỒNG BIẾN khi a > 1 và NGHỊCH BIẾN khi 0 < a < 1. Vì thế khi bỏ log ở hai vế bất phương trình, ' +
      'nếu cơ số nhỏ hơn 1 thì phải ĐỔI CHIỀU dấu bất đẳng thức.',
    animation: {
      title: 'Đồ thị lôgarit là ảnh gương của đồ thị mũ qua đường y = x',
      description:
        'Hai đường cong được vẽ chung một hệ trục: đường mũ y = 2 mũ x đi lên rất nhanh, và đường lôgarit y = log cơ số 2 của x đi lên rất chậm. Đường phân giác y = x được vẽ nét đứt ở giữa. Một điểm sáng đặt tại vị trí (1; 2) trên đường mũ trượt qua đường phân giác và dừng đúng tại (2; 1) trên đường lôgarit: hai toạ độ đổi chỗ cho nhau. Hình động cho thấy thứ mà bảng quy tắc tính lôgarit không nói: lôgarit không phải một phép tính mới cần học thuộc, nó là phép NGƯỢC của luỹ thừa, nên 2 mũ 1 bằng 2 và log cơ số 2 của 2 bằng 1 là cùng một sự thật đọc theo hai chiều. Cũng vì thế đường mũ cắt trục tung tại 1 còn đường lôgarit cắt trục hoành tại 1, và lôgarit chỉ nhận đối số dương.',
      viewBoxWidth: 250,
      viewBoxHeight: 255,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'ox',
          x1: 0,
          y1: 180,
          x2: 240,
          y2: 180,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'oy',
          x1: 60,
          y1: 20,
          x2: 60,
          y2: 248,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'phan-giac',
          x1: 0,
          y1: 240,
          x2: 150,
          y2: 90,
          stroke: 'muted',
          strokeWidth: 1.5,
          dash: '5 4',
        },
        {
          kind: 'label',
          id: 'nhan-pg',
          x: 158,
          y: 88,
          text: 'y = x',
          size: 12,
          fill: 'muted',
        },
        {
          kind: 'polyline',
          id: 'duong-mu',
          points: [
            [0, 172.5],
            [30, 165],
            [45, 158.8],
            [60, 150],
            [75, 137.6],
            [90, 120],
            [105, 95.2],
            [120, 60],
            [126, 42.1],
          ],
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'nhan-mu',
          x: 134,
          y: 38,
          text: 'y = 2ˣ',
          size: 13,
          fill: 'primary',
        },
        {
          kind: 'polyline',
          id: 'duong-log',
          points: [
            [72, 219.7],
            [75, 210],
            [81.2, 195],
            [90, 180],
            [102.4, 165],
            [120, 150],
            [144.8, 135],
            [180, 120],
            [197.9, 114],
          ],
          stroke: 'accent',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'nhan-log',
          x: 206,
          y: 110,
          text: 'y = log₂x',
          size: 13,
          fill: 'accent',
        },
        {
          kind: 'circle',
          id: 'diem-mu',
          cx: 90,
          cy: 120,
          r: 5,
          fill: 'primary',
        },
        {
          kind: 'circle',
          id: 'diem-log',
          cx: 120,
          cy: 150,
          r: 5,
          fill: 'accent',
        },
        {
          kind: 'circle',
          id: 'diem-truot',
          cx: 90,
          cy: 120,
          r: 7,
          fill: 'correct',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 2600,
              dx: 15,
              dy: 15,
            },
            {
              atMs: 3800,
              dx: 30,
              dy: 30,
            },
            {
              atMs: 6000,
              dx: 30,
              dy: 30,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-p1',
          x: 82,
          y: 112,
          text: '(1; 2)',
          size: 12,
          anchor: 'end',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'nhan-p2',
          x: 130,
          y: 158,
          text: '(2; 1)',
          size: 12,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3800,
              opacity: 0,
            },
            {
              atMs: 4200,
              opacity: 1,
            },
            {
              atMs: 6000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ket',
          x: 125,
          y: 252,
          text: '2¹ = 2  ⇔  log₂2 = 1',
          size: 14,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4400,
              opacity: 0,
            },
            {
              atMs: 4900,
              opacity: 1,
            },
            {
              atMs: 6000,
              opacity: 1,
            },
          ],
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Đường mũ y = 2ˣ luôn dương và cắt trục tung tại 1.',
        },
        {
          atMs: 1500,
          text: 'Đường log₂x chỉ tồn tại khi x > 0 và cắt trục hoành tại 1.',
        },
        {
          atMs: 2600,
          text: 'Điểm (1; 2) trên đường mũ trượt qua đường phân giác y = x.',
        },
        {
          atMs: 4200,
          text: 'Nó dừng tại (2; 1): hai toạ độ đổi chỗ — hai đồ thị đối xứng nhau.',
        },
        {
          atMs: 4900,
          text: 'Vì thế 2¹ = 2 và log₂2 = 1 là cùng một điều, đọc theo hai chiều.',
        },
      ],
    },
    workedExample: {
      problem: 'Tính giá trị của A = log₂ 8 + log₃ 9 − log₅ 1, rồi rút gọn B = log₂ 40 − log₂ 5.',
      steps: [
        'Bước 1 — Dùng định nghĩa cho từng số hạng của A. log₂ 8: hỏi 2 mũ mấy bằng 8? Vì 2³ = 8 nên bằng 3.',
        'Bước 2 — log₃ 9: vì 3² = 9 nên bằng 2. log₅ 1: vì 5⁰ = 1 nên bằng 0. Ghi nhớ log_a 1 = 0 với mọi cơ số hợp lệ.',
        'Bước 3 — Cộng lại: A = 3 + 2 − 0 = 5.',
        'Bước 4 — Với B, chọn quy tắc hiệu hai lôgarit CÙNG CƠ SỐ (điều kiện cùng cơ số là bắt buộc): ' +
          'B = log₂(40/5) = log₂ 8.',
        'Bước 5 — Tính: log₂ 8 = 3. Lưu ý cách làm này gọn hơn nhiều so với tính riêng log₂ 40 ≈ 5,32 rồi trừ ' +
          'log₂ 5 ≈ 2,32 — vừa nhanh vừa cho kết quả chính xác tuyệt đối thay vì gần đúng.',
      ],
      answer: 'A = 5 và B = 3.',
    },
    checkQuestions: [
      {
        prompt: 'Tính log₃ 81.',
        answer: { kind: 'numeric', value: 4 },
        explain:
          'Hỏi 3 mũ mấy bằng 81: vì 3⁴ = 81 nên log₃ 81 = 4. Lỗi hay gặp là nhầm thành 81/3 = 27 hoặc nhớ sai thành ' +
          '3. Hãy luôn quay về định nghĩa: lôgarit chính là SỐ MŨ cần tìm.',
      },
      {
        prompt:
          'Biết log₁₀ 2 ≈ 0,30. Giá trị của log₁₀ 5 xấp xỉ bằng bao nhiêu? (Làm tròn 2 chữ số thập phân.)',
        answer: { kind: 'numeric', value: 0.7, tolerance: { mode: 'absolute', eps: 0.01 } },
        explain:
          'Mẹo: 5 = 10/2 nên log₁₀ 5 = log₁₀ 10 − log₁₀ 2 = 1 − 0,30 = 0,70. Biến phép chia thành phép trừ chính ' +
          'là công dụng chủ lực của lôgarit. Lỗi hay gặp là lấy 0,30 · 5 hoặc 1/0,30 — cả hai đều không có cơ sở ' +
          'quy tắc nào.',
      },
      {
        prompt: 'Khẳng định "log(3 + 7) = log 3 + log 7" đúng hay sai? Nhập 1 nếu ĐÚNG, 0 nếu SAI.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'SAI — đây là lỗi phổ biến nhất của cả chương. Quy tắc đúng là log(x·y) = log x + log y, áp cho phép NHÂN ' +
          'chứ không phải phép CỘNG. Kiểm bằng số: vế trái là log 10 = 1; vế phải là log 3 + log 7 = log 21 ≈ 1,322. ' +
          'Hai vế khác nhau rõ ràng. Không có quy tắc nào tách được lôgarit của một TỔNG.',
      },
    ],
    srsCards: [
      {
        hoi: 'Định nghĩa log_a b và các điều kiện?',
        dap: 'log_a b = α ⇔ aᵅ = b, với a > 0, a ≠ 1 và b > 0.',
      },
      {
        hoi: 'Ba quy tắc tính lôgarit?',
        dap: 'log(xy) = log x + log y; log(x/y) = log x − log y; log(xᵅ) = α·log x.',
      },
      {
        hoi: 'log(x + y) có bằng log x + log y không?',
        dap: 'KHÔNG. Quy tắc cộng chỉ áp cho phép nhân bên trong, không cho phép cộng.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan11-c6-b2',
    grade: '11',
    chapterNumber: 6,
    chapterTitle: 'Hàm số mũ và hàm số lôgarit',
    lessonNumber: 2,
    title: 'Phương trình mũ và phương trình lôgarit',
    hook:
      'Một khoản vay tín dụng 10 triệu đồng với lãi 2% mỗi tháng, nếu không trả gì cả thì sau bao lâu nợ thành 20 ' +
      'triệu? Ẩn số nằm ở SỐ MŨ, và không có phép biến đổi đại số quen thuộc nào lôi được nó xuống. Đó chính là lúc ' +
      'lôgarit trở thành công cụ duy nhất.',
    theory:
      'PHƯƠNG TRÌNH MŨ CƠ BẢN\n' +
      'aˣ = b (a > 0, a ≠ 1):\n' +
      '— Nếu b > 0: nghiệm duy nhất x = log_a b.\n' +
      '— Nếu b ≤ 0: VÔ NGHIỆM, vì aˣ luôn dương. Đây là bước kiểm tra phải làm đầu tiên.\n\n' +
      'BA PHƯƠNG PHÁP GIẢI CHÍNH\n' +
      '1. ĐƯA VỀ CÙNG CƠ SỐ: aᶠ⁽ˣ⁾ = aᵍ⁽ˣ⁾ ⇔ f(x) = g(x). Được phép "bỏ cơ số" vì hàm mũ ĐƠN ĐIỆU nghiêm ngặt, tức ' +
      'mỗi giá trị chỉ ứng với đúng một số mũ. Ưu tiên cách này khi hai vế viết được về cùng một cơ số.\n' +
      '2. LÔGARIT HOÁ hai vế: dùng khi không đưa được về cùng cơ số, ví dụ 2ˣ = 5 ⇒ x = log₂ 5.\n' +
      '3. ĐẶT ẨN PHỤ: khi phương trình có dạng bậc hai theo aˣ, ví dụ 4ˣ − 5·2ˣ + 4 = 0. Đặt t = 2ˣ với ĐIỀU KIỆN ' +
      't > 0 (bắt buộc, vì luỹ thừa luôn dương). Quên điều kiện t > 0 sẽ nhận nghiệm ngoại lai.\n\n' +
      'PHƯƠNG TRÌNH LÔGARIT\n' +
      'log_a x = b ⇔ x = aᵇ.\n' +
      'log_a f(x) = log_a g(x) ⇔ f(x) = g(x) KÈM điều kiện f(x) > 0.\n' +
      'BƯỚC BẮT BUỘC KHÔNG ĐƯỢC BỎ: đặt điều kiện xác định TRƯỚC khi biến đổi, rồi ĐỐI CHIẾU nghiệm tìm được với ' +
      'điều kiện ấy ở cuối bài.\n' +
      'VÌ SAO nghiệm ngoại lai xuất hiện: các phép biến đổi như log a + log b = log(ab) làm MỞ RỘNG tập xác định. ' +
      'Vế trái đòi a > 0 và b > 0; vế phải chỉ đòi tích ab > 0, nên chấp nhận cả trường hợp cả hai cùng âm. Những ' +
      'giá trị "mới sinh ra" ấy chính là nghiệm ngoại lai.\n\n' +
      'ỨNG DỤNG THỰC TẾ: bài toán lãi kép. Số tiền sau n kỳ là A = P(1 + r)ⁿ. Muốn tìm n thì lôgarit hoá hai vế: ' +
      'n = log(A/P) / log(1 + r). Cùng công thức ấy dùng cho tăng trưởng dân số, phân rã phóng xạ, hạ nhiệt của vật.',
    workedExample: {
      problem:
        'Vay 10 triệu đồng với lãi kép 2% mỗi tháng. Sau bao nhiêu tháng thì số nợ vượt 20 triệu đồng?',
      steps: [
        'Bước 1 — Lập mô hình: sau n tháng, nợ là A = 10·(1 + 0,02)ⁿ = 10·1,02ⁿ (triệu đồng). Dạng nhân liên tiếp ' +
          'với cùng một hệ số chính là hàm mũ.',
        'Bước 2 — Lập bất phương trình: 10·1,02ⁿ > 20 ⇔ 1,02ⁿ > 2. Ẩn nằm ở SỐ MŨ nên phép biến đổi đại số thông ' +
          'thường bó tay; phải lôgarit hoá.',
        'Bước 3 — Lấy lôgarit hai vế. Được phép giữ nguyên chiều bất đẳng thức vì cơ số 10 lớn hơn 1 nên hàm log ' +
          'đồng biến: n·log 1,02 > log 2.',
        'Bước 4 — Chia hai vế cho log 1,02 ≈ 0,0086. Vì số này DƯƠNG nên chiều bất đẳng thức giữ nguyên (nếu nó âm ' +
          'thì phải đổi chiều — đây là chỗ hay sai): n > log 2 / log 1,02 ≈ 0,3010 / 0,0086 ≈ 35,0.',
        'Bước 5 — Vì n là số tháng nguyên nên n ≥ 36. Kiểm chứng: 1,02³⁵ ≈ 1,9999 (chưa tới 2) còn 1,02³⁶ ≈ 2,0399 ' +
          '(đã vượt). Vậy sau 36 tháng, tức 3 năm, số nợ vượt gấp đôi.',
      ],
      answer: 'Sau 36 tháng (3 năm) nợ vượt 20 triệu đồng.',
    },
    checkQuestions: [
      {
        prompt: 'Giải phương trình 2ˣ = 32. Nghiệm x bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 5 },
        explain:
          'Đưa về cùng cơ số: 32 = 2⁵ nên 2ˣ = 2⁵ ⇔ x = 5. Được phép "bỏ cơ số" vì hàm mũ đơn điệu nghiêm ngặt, mỗi ' +
          'giá trị chỉ ứng với đúng một số mũ. Cách khác cho cùng kết quả: x = log₂ 32 = 5.',
      },
      {
        prompt: 'Phương trình 3ˣ = −9 có bao nhiêu nghiệm thực?',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'VÔ NGHIỆM. Bẫy ở đây là thấy 9 = 3² rồi vội viết x = −2. Nhưng thử lại: 3⁻² = 1/9, là số DƯƠNG, không phải ' +
          '−9. Hàm mũ aˣ với a > 0 luôn cho giá trị dương với mọi x, nên không bao giờ bằng một số âm. Luôn kiểm ' +
          'điều kiện b > 0 trước khi giải aˣ = b.',
      },
      {
        prompt: 'Giải phương trình log₂(x − 1) = 3. Nghiệm x bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 9 },
        explain:
          'Điều kiện xác định: x − 1 > 0 ⇔ x > 1. Theo định nghĩa lôgarit: x − 1 = 2³ = 8 ⇔ x = 9. Đối chiếu điều ' +
          'kiện: 9 > 1, thoả mãn, nên nhận nghiệm. Lỗi thường gặp là tính 2³ ra 6 (nhầm luỹ thừa với phép nhân), ' +
          'hoặc quên cộng lại 1 và trả lời 8. Thói quen tốt: luôn thay nghiệm ngược lại vào đề để kiểm — ' +
          'log₂(9 − 1) = log₂ 8 = 3, đúng.',
      },
    ],
    srsCards: [
      {
        hoi: 'Phương trình aˣ = b có nghiệm khi nào?',
        dap: 'Chỉ khi b > 0, khi đó x = log_a b; với b ≤ 0 thì vô nghiệm vì aˣ luôn dương.',
      },
      {
        hoi: 'Vì sao phương trình lôgarit hay sinh nghiệm ngoại lai?',
        dap: 'Vì các phép gộp lôgarit làm mở rộng tập xác định; phải đặt điều kiện trước và đối chiếu nghiệm sau.',
      },
      {
        hoi: 'Khi đặt ẩn phụ t = aˣ phải kèm điều kiện gì?',
        dap: 't > 0, vì luỹ thừa của số dương luôn dương.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
