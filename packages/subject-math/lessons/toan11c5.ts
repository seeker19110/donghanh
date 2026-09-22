// lessons/toan11c5.ts — Toán 11, Chương 5: Giới hạn và hàm số liên tục.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN11_C5_LESSONS: MathLesson[] = [
  {
    id: 'toan11-c5-b1',
    grade: '11',
    chapterNumber: 5,
    chapterTitle: 'Giới hạn. Hàm số liên tục',
    lessonNumber: 1,
    title: 'Giới hạn của dãy số và tổng cấp số nhân lùi vô hạn',
    hook:
      'Cắt một tờ giấy làm đôi, lấy một nửa; cắt nửa đó làm đôi nữa, lấy một phần tư; cứ thế mãi. Cộng tất cả các ' +
      'mảnh đã lấy lại, bạn được bao nhiêu? Cộng vô hạn số dương mà tổng lại KHÔNG vô hạn — nó dừng đúng ở 1, ' +
      'nghĩa là đúng bằng tờ giấy ban đầu. Nghịch lý ấy được giải bằng khái niệm giới hạn.',
    theory:
      'GIỚI HẠN CỦA DÃY SỐ\n' +
      'Dãy (uₙ) có giới hạn L khi n → +∞ nếu uₙ tiến sát L tuỳ ý, miễn n đủ lớn. Ký hiệu lim uₙ = L.\n' +
      'Hiểu trực quan: dù bạn vẽ một "khoảng an toàn" nhỏ đến đâu quanh L, thì từ một chỉ số nào đó trở đi MỌI số ' +
      'hạng của dãy đều lọt vào khoảng ấy và không bao giờ thoát ra.\n\n' +
      'BA GIỚI HẠN CƠ BẢN PHẢI THUỘC\n' +
      '— lim (1/n) = 0, lim (1/nᵏ) = 0 với k > 0.\n' +
      '— lim qⁿ = 0 khi |q| < 1; dãy PHÂN KỲ (không có giới hạn hữu hạn) khi |q| > 1.\n' +
      '— lim c = c với dãy hằng.\n\n' +
      'KỸ THUẬT XỬ LÝ DẠNG VÔ ĐỊNH ∞/∞\n' +
      'Với dãy là thương hai đa thức của n, hãy CHIA CẢ TỬ VÀ MẪU cho luỹ thừa cao nhất của n. Vì sao cách này hiệu ' +
      'quả? Sau khi chia, mọi số hạng chứa n ở mẫu đều tiến về 0, chỉ còn lại các hệ số — vô định biến mất.\n' +
      'Kết quả có quy luật rõ: so sánh bậc tử m và bậc mẫu p. Nếu m < p thì giới hạn bằng 0; nếu m = p thì giới hạn ' +
      'bằng tỉ số hai hệ số bậc cao nhất; nếu m > p thì dãy tiến ra vô cực.\n\n' +
      'TỔNG CẤP SỐ NHÂN LÙI VÔ HẠN\n' +
      'Với cấp số nhân có |q| < 1 (gọi là lùi vô hạn), tổng vô hạn S = u₁/(1 − q).\n' +
      'TỪ ĐÂU RA: tổng n số hạng đầu là Sₙ = u₁(1 − qⁿ)/(1 − q). Khi n → +∞, vì |q| < 1 nên qⁿ → 0, phần tử số thành ' +
      'u₁·1. Công thức không phải phép màu, nó chỉ là giới hạn của công thức tổng hữu hạn đã học.\n' +
      'ĐIỀU KIỆN |q| < 1 LÀ TUYỆT ĐỐI BẮT BUỘC. Với q = 2 thì tổng 1 + 2 + 4 + ... rõ ràng vô hạn, nhưng công thức ' +
      'vẫn cho ra 1/(1−2) = −1 — một kết quả vô nghĩa. Đây là minh hoạ kinh điển cho việc áp công thức mà bỏ qua ' +
      'điều kiện.\n\n' +
      'ỨNG DỤNG: đổi số thập phân vô hạn tuần hoàn ra phân số. Ví dụ 0,333... = 3/10 + 3/100 + ... là cấp số nhân ' +
      'với u₁ = 3/10, q = 1/10, nên tổng bằng (3/10)/(9/10) = 1/3.',
    animation: {
      title: 'Tổng của dãy một nửa liên tiếp hội tụ về 1',
      description:
        'Một thanh ngang dài một đơn vị được lấp dần: đoạn đầu chiếm một nửa thanh, đoạn tiếp theo chiếm một phần ' +
        'tư, rồi một phần tám, một phần mười sáu. Mỗi đoạn mới ngắn bằng nửa đoạn trước nên phần trống co lại rất ' +
        'nhanh nhưng không bao giờ biến mất hoàn toàn; tổng các đoạn tiến sát tới đúng một, minh hoạ cho việc cộng ' +
        'vô hạn số dương vẫn có thể cho tổng hữu hạn.',
      viewBoxWidth: 400,
      viewBoxHeight: 180,
      durationMs: 7000,
      loop: true,
      shapes: [
        {
          kind: 'rect',
          id: 'khung',
          x: 30,
          y: 60,
          w: 340,
          h: 46,
          stroke: 'muted',
          strokeWidth: 2,
          fill: 'surface',
          opacity: 0.4,
        },
        { kind: 'rect', id: 'phan1', x: 30, y: 60, w: 170, h: 46, fill: 'primary', opacity: 0.75 },
        {
          kind: 'rect',
          id: 'phan2',
          x: 200,
          y: 60,
          w: 85,
          h: 46,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1500, opacity: 0 },
            { atMs: 2100, opacity: 0.75 },
            { atMs: 7000, opacity: 0.75 },
          ],
        },
        {
          kind: 'rect',
          id: 'phan3',
          x: 285,
          y: 60,
          w: 42.5,
          h: 46,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3000, opacity: 0 },
            { atMs: 3600, opacity: 0.75 },
            { atMs: 7000, opacity: 0.75 },
          ],
        },
        {
          kind: 'rect',
          id: 'phan4',
          x: 327.5,
          y: 60,
          w: 21.25,
          h: 46,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 4500, opacity: 0 },
            { atMs: 5100, opacity: 0.75 },
            { atMs: 7000, opacity: 0.75 },
          ],
        },
        {
          kind: 'label',
          id: 'nhan1',
          x: 115,
          y: 90,
          text: '1/2',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanTong',
          x: 200,
          y: 140,
          text: 'tổng tiến về 1',
          size: 15,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanMot',
          x: 374,
          y: 52,
          text: '1',
          size: 14,
          anchor: 'start',
          fill: 'neutral',
        },
      ],
      captions: [
        { atMs: 0, text: 'Lấy một nửa thanh: tổng đang là 1/2.' },
        { atMs: 2100, text: 'Thêm một phần tư: tổng thành 3/4.' },
        { atMs: 3600, text: 'Thêm một phần tám: tổng thành 7/8.' },
        { atMs: 5100, text: 'Phần trống luôn còn nhưng nhỏ dần vô hạn — tổng hội tụ về 1.' },
      ],
    },
    workedExample: {
      problem:
        'Tính lim (3n² + 2n − 1)/(n² − 5n) khi n → +∞, và tính tổng S = 1 + 1/3 + 1/9 + 1/27 + ...',
      steps: [
        'Bước 1 — Nhận dạng phần đầu: cả tử và mẫu đều tiến ra +∞, đây là dạng vô định ∞/∞ nên không được thay trực ' +
          'tiếp n = ∞.',
        'Bước 2 — Chọn kỹ thuật: chia cả tử và mẫu cho n² (luỹ thừa cao nhất xuất hiện) để mọi số hạng bậc thấp trở ' +
          'thành phân số có n ở mẫu và tiến về 0: (3 + 2/n − 1/n²)/(1 − 5/n).',
        'Bước 3 — Lấy giới hạn từng phần: 2/n → 0, 1/n² → 0, 5/n → 0. Vậy giới hạn bằng (3 + 0 − 0)/(1 − 0) = 3. ' +
          'Kết quả khớp quy luật "bậc tử bằng bậc mẫu thì lấy tỉ số hệ số cao nhất": 3/1 = 3.',
        'Bước 4 — Phần hai, nhận dạng: dãy 1; 1/3; 1/9; ... là cấp số nhân với u₁ = 1 và q = 1/3. Kiểm điều kiện ' +
          '|q| = 1/3 < 1 nên đây là cấp số nhân lùi vô hạn, dùng được công thức tổng.',
        'Bước 5 — Áp dụng: S = u₁/(1 − q) = 1/(1 − 1/3) = 1/(2/3) = 3/2 = 1,5. Kiểm tính hợp lý: cộng bốn số hạng ' +
          'đầu được 1 + 0,333 + 0,111 + 0,037 ≈ 1,481, đang tiến dần tới 1,5.',
      ],
      answer: 'Giới hạn bằng 3; tổng S = 3/2.',
    },
    checkQuestions: [
      {
        prompt: 'Tính lim (2n + 3)/(5n − 1) khi n tiến ra vô cực. (Nhập dạng phân số tối giản.)',
        answer: { kind: 'fraction', num: 2, den: 5 },
        explain:
          'Chia cả tử và mẫu cho n: (2 + 3/n)/(5 − 1/n) → 2/5. Vì bậc tử bằng bậc mẫu nên giới hạn là tỉ số hai hệ ' +
          'số bậc cao nhất. Lỗi hay gặp là lấy tỉ số các hằng số tự do 3/(−1) = −3, hoặc nghĩ rằng "cả hai đều ra vô ' +
          'cực nên giới hạn bằng 1".',
      },
      {
        prompt: 'Tổng của cấp số nhân lùi vô hạn 4 + 2 + 1 + 1/2 + ... bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 8 },
        explain:
          'Đây là cấp số nhân với u₁ = 4 và q = 1/2, thoả |q| < 1 nên S = u₁/(1 − q) = 4/(1 − 0,5) = 8. Lỗi thường ' +
          'gặp là dùng công thức tổng n số hạng rồi lúng túng, hoặc nhầm u₁ với q. Kiểm nhanh: 4 + 2 + 1 + 0,5 + ' +
          '0,25 = 7,75, đang tiến dần tới 8 — hợp lý.',
      },
      {
        prompt:
          'Có thể dùng công thức S = u₁/(1 − q) để tính tổng 1 + 3 + 9 + 27 + ... không? Nhập 1 nếu CÓ, 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'KHÔNG, vì q = 3 nên |q| = 3 > 1. Đây là bẫy cố ý: nếu cứ áp công thức sẽ ra 1/(1 − 3) = −1/2, một kết quả vô ' +
          'lý vì ta đang cộng toàn số dương ngày càng lớn. Tổng thực sự tiến ra +∞, dãy phân kỳ. Bài học: công thức ' +
          'tổng vô hạn CHỈ dùng khi |q| < 1, vì nó dựa trên việc qⁿ → 0.',
      },
    ],
    srsCards: [
      {
        hoi: 'Cách khử dạng vô định ∞/∞ với thương hai đa thức của n?',
        dap: 'Chia cả tử và mẫu cho luỹ thừa cao nhất của n; các số hạng có n ở mẫu sẽ tiến về 0.',
      },
      {
        hoi: 'Công thức tổng cấp số nhân lùi vô hạn và điều kiện?',
        dap: 'S = u₁/(1 − q), chỉ dùng khi |q| < 1 vì khi đó qⁿ → 0.',
      },
      {
        hoi: 'lim qⁿ bằng bao nhiêu?',
        dap: 'Bằng 0 khi |q| < 1; dãy phân kỳ khi |q| > 1.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan11-c5-b2',
    grade: '11',
    chapterNumber: 5,
    chapterTitle: 'Giới hạn. Hàm số liên tục',
    lessonNumber: 2,
    title: 'Giới hạn của hàm số và hàm số liên tục',
    hook:
      'Nhiệt độ không khí thay đổi liên tục suốt một ngày: không có khoảnh khắc nào nhiệt độ nhảy từ 25°C sang 30°C ' +
      'mà bỏ qua 27°C. Nhưng giá cước taxi thì lại nhảy bậc: đi 1,99 km và 2,01 km có thể chênh hẳn một mức giá. Sự ' +
      'khác nhau giữa hai hiện tượng ấy chính là khái niệm LIÊN TỤC.',
    theory:
      'GIỚI HẠN HÀM SỐ TẠI MỘT ĐIỂM\n' +
      'lim f(x) khi x → x₀ bằng L nghĩa là: khi x tiến sát x₀ (nhưng KHÔNG cần bằng x₀), giá trị f(x) tiến sát L.\n' +
      'Điểm mấu chốt: giới hạn tại x₀ KHÔNG phụ thuộc vào giá trị f(x₀), thậm chí f có thể không xác định tại x₀. ' +
      'Đó là lý do khử được dạng vô định 0/0.\n\n' +
      'KỸ THUẬT KHỬ DẠNG VÔ ĐỊNH 0/0\n' +
      'Khi thay x = x₀ mà được 0/0, nghĩa là (x − x₀) là nhân tử chung của cả tử và mẫu. Cách làm: PHÂN TÍCH THÀNH ' +
      'NHÂN TỬ rồi rút gọn nhân tử (x − x₀), sau đó mới thay số. Việc rút gọn hợp lệ vì x chỉ tiến tới x₀ chứ không ' +
      'bằng x₀, nên x − x₀ ≠ 0.\n' +
      'Với biểu thức chứa căn, dùng phép NHÂN LIÊN HỢP để biến hiệu hai căn thành hiệu hai bình phương.\n\n' +
      'HÀM SỐ LIÊN TỤC TẠI MỘT ĐIỂM — BA ĐIỀU KIỆN ĐỒNG THỜI\n' +
      'Hàm f liên tục tại x₀ khi và chỉ khi:\n' +
      '1. f xác định tại x₀ (tồn tại f(x₀));\n' +
      '2. Tồn tại giới hạn lim f(x) khi x → x₀ (giới hạn trái bằng giới hạn phải);\n' +
      '3. Giới hạn đó BẰNG f(x₀).\n' +
      'Thiếu bất kỳ điều nào cũng là gián đoạn. Với hàm cho bởi nhiều công thức, luôn phải xét giới hạn TRÁI và ' +
      'PHẢI riêng tại điểm nối — đây là dạng bài ra thi nhiều nhất.\n\n' +
      'TÍNH CHẤT QUAN TRỌNG NHẤT: ĐỊNH LÍ GIÁ TRỊ TRUNG GIAN\n' +
      'Nếu f liên tục trên đoạn [a; b] và f(a)·f(b) < 0 thì phương trình f(x) = 0 có ÍT NHẤT MỘT nghiệm trong ' +
      'khoảng (a; b).\n' +
      'Ý nghĩa hình học: đồ thị liên tục đi từ dưới trục hoành lên trên trục hoành thì bắt buộc phải CẮT trục hoành ' +
      'ở đâu đó — không thể "nhảy qua". Đây là công cụ chuẩn để chứng minh phương trình có nghiệm mà không cần giải.\n' +
      'HẠN CHẾ CỦA ĐỊNH LÍ: nó chỉ khẳng định CÓ nghiệm, không nói có bao nhiêu nghiệm và cũng không chỉ ra nghiệm ' +
      'ở đâu. Ngoài ra điều kiện liên tục là bắt buộc: hàm 1/x đổi dấu qua 0 nhưng không có nghiệm nào, vì nó gián ' +
      'đoạn tại 0.',
    animation: {
      title: 'Giới hạn tồn tại ngay cả khi hàm số không có giá trị tại điểm đó',
      description:
        'Đồ thị của hàm f(x) = (x² − 1)/(x − 1) là đường thẳng y = x + 1 nhưng bị THỦNG một lỗ tại x = 1, vì tại đó mẫu bằng 0 nên hàm không xác định; lỗ thủng được vẽ bằng một vòng tròn rỗng tại điểm (1; 2). Hai điểm chạy tiến về lỗ thủng: một điểm bò lên từ phía trái qua các giá trị x = 0 rồi 0,5 rồi 0,9; một điểm bò xuống từ phía phải qua x = 2 rồi 1,5 rồi 1,1. Cả hai cùng ép tung độ về sát mức 2 mà không bao giờ chạm tới lỗ. Hình động phá nhầm lẫn lớn nhất của chương: giới hạn KHÔNG phải giá trị của hàm tại điểm, nó là giá trị mà hàm hướng tới khi x lại gần điểm đó — nên lim bằng 2 dù f(1) hoàn toàn không tồn tại.',
      viewBoxWidth: 280,
      viewBoxHeight: 240,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'ox',
          x1: 15,
          y1: 200,
          x2: 265,
          y2: 200,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'oy',
          x1: 50,
          y1: 15,
          x2: 50,
          y2: 225,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'do-thi',
          x1: 25,
          y1: 175,
          x2: 175,
          y2: 25,
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'ham',
          x: 260,
          y: 150,
          text: 'f(x) = (x²−1)/(x−1)',
          size: 13,
          anchor: 'end',
          fill: 'primary',
        },
        {
          kind: 'line',
          id: 'muc-2',
          x1: 25,
          y1: 100,
          x2: 200,
          y2: 100,
          stroke: 'muted',
          strokeWidth: 1.5,
          dash: '5 4',
        },
        {
          kind: 'line',
          id: 'truc-1',
          x1: 100,
          y1: 35,
          x2: 100,
          y2: 210,
          stroke: 'muted',
          strokeWidth: 1.5,
          dash: '5 4',
        },
        {
          kind: 'label',
          id: 'nhan-2',
          x: 44,
          y: 105,
          text: '2',
          size: 13,
          anchor: 'end',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-1',
          x: 100,
          y: 222,
          text: '1',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'circle',
          id: 'lo-thung',
          cx: 100,
          cy: 100,
          r: 7,
          fill: 'surface',
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'circle',
          id: 'chay-trai',
          cx: 50,
          cy: 150,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1200,
              dx: 20,
              dy: -20,
            },
            {
              atMs: 2400,
              dx: 32,
              dy: -32,
            },
            {
              atMs: 3600,
              dx: 40,
              dy: -40,
            },
            {
              atMs: 4800,
              dx: 44,
              dy: -44,
            },
            {
              atMs: 6000,
              dx: 45,
              dy: -45,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'chay-phai',
          cx: 150,
          cy: 50,
          r: 6,
          fill: 'correct',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1200,
              dx: -20,
              dy: 20,
            },
            {
              atMs: 2400,
              dx: -32,
              dy: 32,
            },
            {
              atMs: 3600,
              dx: -40,
              dy: 40,
            },
            {
              atMs: 4800,
              dx: -44,
              dy: 44,
            },
            {
              atMs: 6000,
              dx: -45,
              dy: 45,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-trai',
          x: 30,
          y: 168,
          text: 'x → 1⁻',
          size: 12,
          fill: 'accent',
        },
        {
          kind: 'label',
          id: 'nhan-phai',
          x: 160,
          y: 40,
          text: 'x → 1⁺',
          size: 12,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'ket',
          x: 140,
          y: 236,
          text: 'lim f(x) = 2 khi x → 1, dù f(1) không tồn tại',
          size: 13,
          anchor: 'middle',
          fill: 'primary',
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
              atMs: 4400,
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
          text: 'Rút gọn được y = x + 1, nhưng x = 1 vẫn bị loại khỏi tập xác định.',
        },
        {
          atMs: 1200,
          text: 'Hai điểm cùng bò về phía lỗ thủng, một từ trái một từ phải.',
        },
        {
          atMs: 3600,
          text: 'Càng gần, tung độ của cả hai càng sát 2.',
        },
        {
          atMs: 4400,
          text: 'Giới hạn hai phía bằng nhau và bằng 2 — dù không điểm nào chạm được lỗ.',
        },
      ],
    },
    workedExample: {
      problem:
        'Cho hàm số f(x) = (x² − 4)/(x − 2) khi x ≠ 2, và f(2) = m. Tìm m để hàm số liên tục tại x = 2.',
      steps: [
        'Bước 1 — Kiểm điều kiện 1: f đã xác định tại x = 2 với giá trị m, nên điều kiện này tự thoả.',
        'Bước 2 — Tính giới hạn khi x → 2. Thay trực tiếp cho 0/0 nên phải khử: phân tích tử thành nhân tử ' +
          'x² − 4 = (x − 2)(x + 2).',
        'Bước 3 — Rút gọn nhân tử (x − 2), hợp lệ vì x → 2 nhưng x ≠ 2: f(x) = x + 2 với mọi x ≠ 2. Do đó ' +
          'lim f(x) = 2 + 2 = 4 khi x → 2.',
        'Bước 4 — Áp điều kiện 3: hàm liên tục khi giới hạn bằng giá trị tại điểm, tức m = 4.',
        'Bước 5 — Diễn giải ý nghĩa: đồ thị của f chính là đường thẳng y = x + 2 nhưng bị "thủng" một lỗ tại x = 2. ' +
          'Chọn m = 4 chính là VÁ cái lỗ ấy lại đúng chỗ để đường liền mạch. Nếu chọn m khác, đồ thị sẽ có một điểm ' +
          'lẻ nhảy ra ngoài đường thẳng.',
      ],
      answer: 'm = 4.',
    },
    checkQuestions: [
      {
        prompt: 'Tính giới hạn của (x² − 9)/(x − 3) khi x tiến tới 3.',
        answer: { kind: 'numeric', value: 6 },
        explain:
          'Thay trực tiếp cho 0/0 nên phải phân tích nhân tử: (x−3)(x+3)/(x−3) = x + 3 → 6. Bẫy phổ biến là kết ' +
          'luận "không tồn tại giới hạn vì mẫu bằng 0". Giới hạn KHÔNG quan tâm giá trị tại đúng điểm x = 3; dạng ' +
          '0/0 là dạng VÔ ĐỊNH, tức chưa kết luận được, phải biến đổi thêm.',
      },
      {
        prompt:
          'Hàm số f(x) = x³ − 3x + 1 liên tục trên ℝ. Biết f(0) = 1 và f(1) = −1. Phương trình f(x) = 0 chắc chắn ' +
          'có ít nhất bao nhiêu nghiệm trong khoảng (0; 1)?',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'Vì f liên tục trên [0; 1] và f(0)·f(1) = 1·(−1) = −1 < 0, theo định lí giá trị trung gian phương trình có ' +
          'ÍT NHẤT một nghiệm trong (0; 1). Lưu ý định lí chỉ bảo đảm "ít nhất một", không nói chính xác bao nhiêu ' +
          'và cũng không chỉ ra nghiệm nằm ở đâu. Nếu bỏ điều kiện liên tục thì kết luận sụp đổ ngay.',
      },
      {
        prompt:
          'Hàm f(x) bằng x + 1 khi x < 1 và bằng 3x khi x ≥ 1. Hàm có liên tục tại x = 1 không? ' +
          'Nhập 1 nếu CÓ, 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Giới hạn TRÁI khi x → 1⁻ là 1 + 1 = 2; giới hạn PHẢI khi x → 1⁺ là 3·1 = 3. Hai giới hạn một bên KHÁC ' +
          'nhau nên giới hạn tại x = 1 không tồn tại, hàm gián đoạn. Lỗi kinh điển là chỉ thay x = 1 vào một công ' +
          'thức (được 3), thấy "tính ra số" rồi kết luận liên tục. Với hàm cho bởi nhiều công thức, LUÔN phải xét ' +
          'cả hai phía tại điểm nối rồi so với giá trị tại điểm đó.',
      },
    ],
    srsCards: [
      {
        hoi: 'Ba điều kiện để hàm số liên tục tại x₀?',
        dap: 'Tồn tại f(x₀); tồn tại giới hạn khi x → x₀ (trái bằng phải); và giới hạn đó bằng f(x₀).',
      },
      {
        hoi: 'Vì sao được phép rút gọn nhân tử (x − x₀) khi tính giới hạn?',
        dap: 'Vì x chỉ tiến tới x₀ chứ không bằng x₀, nên x − x₀ khác 0.',
      },
      {
        hoi: 'Định lí giá trị trung gian dùng để làm gì?',
        dap: 'Chứng minh phương trình có nghiệm: f liên tục trên [a;b] và f(a)·f(b) < 0 thì có nghiệm trong (a;b).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
