// lessons/toan12c1.ts — Toán 12, Chương 1: Ứng dụng đạo hàm để khảo sát hàm số.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN12_C1_LESSONS: MathLesson[] = [
  {
    id: 'toan12-c1-b1',
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
    lessonNumber: 1,
    title: 'Tính đơn điệu và cực trị của hàm số',
    hook:
      'Biểu đồ giá xăng trong nước suốt một năm lên xuống chằng chịt. Nhà báo chỉ cần trả lời hai câu: giá tăng ' +
      'trong những giai đoạn nào, và đỉnh giá rơi vào ngày nào. Cả hai câu hỏi ấy, dù nhìn vào bao nhiêu con số cũng ' +
      'khó trả lời chính xác, lại được giải gọn chỉ bằng dấu của một đại lượng: đạo hàm.',
    theory:
      'TÍNH ĐƠN ĐIỆU\n' +
      "Cho hàm f có đạo hàm trên khoảng K. Nếu f'(x) > 0 với mọi x thuộc K thì f ĐỒNG BIẾN (tăng) trên K; nếu " +
      "f'(x) < 0 với mọi x thuộc K thì f NGHỊCH BIẾN (giảm) trên K.\n" +
      "VÌ SAO: đạo hàm là hệ số góc tiếp tuyến. Tiếp tuyến dốc lên (f' > 0) thì đồ thị đang đi lên. Đây không phải " +
      'quy ước, nó là hệ quả trực tiếp của ý nghĩa hình học.\n' +
      "LƯU Ý TINH TẾ: hàm vẫn có thể đồng biến khi f'(x) = 0 tại MỘT SỐ HỮU HẠN điểm. Ví dụ y = x³ có y' = 3x² ≥ 0, " +
      "bằng 0 chỉ tại x = 0, nhưng hàm vẫn đồng biến trên toàn ℝ. Vì thế điều kiện chuẩn để hàm đồng biến là f'(x) ≥ 0 " +
      'và dấu bằng chỉ xảy ra tại hữu hạn điểm.\n\n' +
      'CỰC TRỊ\n' +
      "Điểm x₀ là điểm cực trị khi f' ĐỔI DẤU qua x₀:\n" +
      "— f' đổi từ dương sang âm → x₀ là điểm cực ĐẠI.\n" +
      "— f' đổi từ âm sang dương → x₀ là điểm cực TIỂU.\n" +
      "CHỖ SAI SỐ MỘT CỦA CHƯƠNG: f'(x₀) = 0 chỉ là điều kiện CẦN, KHÔNG ĐỦ. Hàm y = x³ có y'(0) = 0 nhưng x = 0 " +
      "KHÔNG phải cực trị, vì y' = 3x² không đổi dấu (luôn ≥ 0) — đồ thị chỉ 'chững lại' rồi tiếp tục đi lên. Phải " +
      "kiểm dấu ĐỔI, không được thấy f' = 0 là kết luận ngay.\n" +
      "Ngược lại, hàm có thể đạt cực trị tại điểm KHÔNG có đạo hàm: y = |x| đạt cực tiểu tại x = 0 dù y'(0) không " +
      'tồn tại. Vì thế bảng xét dấu phải liệt kê cả các điểm hàm không có đạo hàm.\n\n' +
      'QUY TẮC LÀM BÀI (bốn bước)\n' +
      "1. Tìm tập xác định. 2. Tính f' và tìm các điểm f' = 0 hoặc f' không xác định. 3. Lập bảng xét dấu f'. " +
      '4. Đọc kết luận về khoảng đơn điệu và cực trị từ bảng.\n\n' +
      'GIÁ TRỊ LỚN NHẤT – NHỎ NHẤT TRÊN ĐOẠN [a; b]\n' +
      "Với hàm liên tục trên [a; b]: tính f tại các điểm f'(x) = 0 thuộc (a; b) VÀ tại hai đầu mút a, b, rồi so sánh " +
      'chọn số lớn nhất/nhỏ nhất. Bỏ quên hai đầu mút là lỗi mất điểm kinh điển — cực trị địa phương chưa chắc là ' +
      'giá trị lớn nhất trên đoạn.\n' +
      'PHÂN BIỆT: "cực đại" là so với các điểm LÂN CẬN (tính chất địa phương); "giá trị lớn nhất" là so với TOÀN BỘ ' +
      'miền đang xét (tính chất toàn cục). Một hàm có thể có cực đại mà không có giá trị lớn nhất.',
    animation: {
      title: 'Dấu của đạo hàm quyết định chiều đi của đồ thị',
      description:
        'Đồ thị một hàm bậc ba được vẽ cùng bảng dấu của đạo hàm phía dưới. Ở đoạn đạo hàm mang dấu dương, đồ thị đi ' +
        'lên; tại điểm đạo hàm bằng không và đổi từ dương sang âm, đồ thị đạt đỉnh cực đại rồi quay đầu đi xuống; ' +
        'tại điểm đạo hàm đổi từ âm sang dương, đồ thị chạm đáy cực tiểu rồi lại đi lên.',
      viewBoxWidth: 380,
      viewBoxHeight: 260,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'ox',
          x1: 30,
          y1: 130,
          x2: 360,
          y2: 130,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'polyline',
          id: 'dothi',
          points: [
            [40, 120],
            [70, 92],
            [100, 70],
            [130, 58],
            [160, 62],
            [190, 82],
            [220, 108],
            [250, 128],
            [280, 136],
            [310, 126],
            [340, 100],
          ],
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'circle',
          id: 'cucDai',
          cx: 130,
          cy: 58,
          r: 6,
          fill: 'warn',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1800, opacity: 0 },
            { atMs: 2500, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'circle',
          id: 'cucTieu',
          cx: 280,
          cy: 136,
          r: 6,
          fill: 'correct',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3600, opacity: 0 },
            { atMs: 4300, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'line',
          id: 'bangDau',
          x1: 40,
          y1: 190,
          x2: 340,
          y2: 190,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'dauCong1',
          x: 85,
          y: 212,
          text: "f' > 0",
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'dauTru',
          x: 205,
          y: 212,
          text: "f' < 0",
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'dauCong2',
          x: 315,
          y: 212,
          text: "f' > 0",
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanCD',
          x: 130,
          y: 44,
          text: 'cực đại',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanCT',
          x: 280,
          y: 158,
          text: 'cực tiểu',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
      ],
      captions: [
        { atMs: 0, text: "Đoạn đầu f' > 0 nên đồ thị đi lên." },
        { atMs: 2500, text: "f' đổi dấu từ + sang − → điểm cực đại." },
        { atMs: 4300, text: "f' đổi dấu từ − sang + → điểm cực tiểu." },
        { atMs: 5200, text: "Chỉ ĐỔI DẤU mới cho cực trị; f' = 0 thôi thì chưa đủ." },
      ],
    },
    workedExample: {
      problem: 'Tìm các khoảng đơn điệu và các điểm cực trị của hàm số y = x³ − 3x² + 1.',
      steps: [
        'Bước 1 — Tập xác định: hàm đa thức nên xác định với mọi x thuộc ℝ.',
        "Bước 2 — Tính đạo hàm: y' = 3x² − 6x = 3x(x − 2).",
        "Bước 3 — Giải y' = 0: 3x(x − 2) = 0 ⇔ x = 0 hoặc x = 2. Đây mới là các điểm NGHI NGỜ, chưa chắc là cực trị.",
        "Bước 4 — Xét dấu y' bằng cách thử điểm ở ba khoảng: tại x = −1 được y' = 9 > 0; tại x = 1 được y' = −3 < 0; " +
          "tại x = 3 được y' = 9 > 0. Vậy hàm đồng biến trên (−∞; 0) và (2; +∞), nghịch biến trên (0; 2).",
        'Bước 5 — Kết luận cực trị dựa vào việc ĐỔI DẤU: qua x = 0 đạo hàm đổi từ + sang − nên đây là điểm cực đại, ' +
          'giá trị cực đại y(0) = 1. Qua x = 2 đạo hàm đổi từ − sang + nên là điểm cực tiểu, y(2) = 8 − 12 + 1 = −3.',
      ],
      answer:
        'Đồng biến trên (−∞;0) và (2;+∞); nghịch biến trên (0;2); cực đại y = 1 tại x = 0; cực tiểu y = −3 tại x = 2.',
    },
    checkQuestions: [
      {
        prompt:
          "Hàm số y = x³ có y'(0) = 0. Điểm x = 0 có phải là điểm cực trị của hàm số không? " +
          'Nhập 1 nếu PHẢI, 0 nếu KHÔNG PHẢI.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          "Đây là bẫy quan trọng nhất của cả chương. Rất nhiều bạn thấy y'(x₀) = 0 là kết luận ngay có cực trị. " +
          "Nhưng y' = 3x² ≥ 0 với mọi x, chỉ bằng 0 tại đúng x = 0 mà KHÔNG ĐỔI DẤU. Đồ thị y = x³ chỉ 'chững lại' " +
          'một chút rồi tiếp tục đi lên, không hề có đỉnh hay đáy. Điều kiện đủ để có cực trị là đạo hàm ĐỔI DẤU, ' +
          "còn f'(x₀) = 0 mới chỉ là điều kiện cần.",
      },
      {
        prompt: 'Tìm giá trị lớn nhất của hàm số y = x³ − 3x trên đoạn [0; 3].',
        answer: { kind: 'numeric', value: 18 },
        explain:
          "y' = 3x² − 3 = 0 ⇔ x = ±1; chỉ x = 1 thuộc (0; 3). Tính giá trị tại điểm nghi ngờ và CẢ HAI ĐẦU MÚT: " +
          'y(0) = 0; y(1) = −2; y(3) = 27 − 9 = 18. Lớn nhất là 18 tại x = 3, tức tại đầu mút chứ không phải tại ' +
          'điểm cực trị. Lỗi kinh điển là chỉ tính tại các điểm cực trị rồi kết luận — luôn phải cộng thêm hai đầu mút.',
      },
      {
        prompt:
          'Hàm số y = f(x) có đạo hàm f′(x) = (x − 1)²(x + 3). Hàm số có bao nhiêu điểm cực trị?',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'Đạo hàm bằng 0 tại x = 1 và x = −3, nên nhiều bạn trả lời 2. Nhưng phải xét ĐỔI DẤU: thừa số (x − 1)² ' +
          'luôn không âm nên không làm đổi dấu; dấu của f′ hoàn toàn do (x + 3) quyết định. Vậy f′ chỉ đổi dấu một ' +
          'lần, tại x = −3 (từ âm sang dương → cực tiểu). Nghiệm BỘI CHẴN không cho cực trị — đây là quy tắc cần ' +
          'thuộc: chỉ nghiệm bội LẺ mới làm đạo hàm đổi dấu.',
      },
    ],
    srsCards: [
      {
        hoi: 'Điều kiện đủ để x₀ là điểm cực trị?',
        dap: "Đạo hàm ĐỔI DẤU khi đi qua x₀. Chỉ f'(x₀) = 0 thôi là chưa đủ (ví dụ y = x³ tại x = 0).",
      },
      {
        hoi: 'Khi tìm GTLN/GTNN trên đoạn [a;b], phải tính giá trị hàm tại những điểm nào?',
        dap: "Tại các điểm f'(x) = 0 trong (a;b) VÀ tại hai đầu mút a, b.",
      },
      {
        hoi: 'Nghiệm bội chẵn của đạo hàm có cho cực trị không?',
        dap: 'Không — nó không làm đạo hàm đổi dấu. Chỉ nghiệm bội lẻ mới cho cực trị.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan12-c1-b2',
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số',
    lessonNumber: 2,
    title: 'Đường tiệm cận của đồ thị hàm số',
    hook:
      'Một cốc cà phê nóng đặt trong phòng 25°C sẽ nguội dần: nhanh lúc đầu, rồi chậm lại, và mãi mãi không bao giờ ' +
      'xuống dưới 25°C. Đồ thị nhiệt độ theo thời gian tiến sát một đường nằm ngang mà không bao giờ chạm tới. ' +
      'Đường ấy gọi là tiệm cận, và nó cho biết "số phận lâu dài" của cả quá trình.',
    theory:
      'TIỆM CẬN NGANG\n' +
      'Đường thẳng y = b là tiệm cận ngang của đồ thị hàm y = f(x) nếu lim f(x) = b khi x → +∞ hoặc khi x → −∞.\n' +
      'Ý nghĩa: khi biến chạy ra rất xa, giá trị hàm ổn định lại quanh một mức nào đó. Với cốc cà phê, mức ấy là ' +
      'nhiệt độ phòng.\n\n' +
      'TIỆM CẬN ĐỨNG\n' +
      'Đường thẳng x = a là tiệm cận đứng nếu ít nhất một trong các giới hạn một bên của f(x) khi x → a là +∞ hoặc −∞.\n' +
      'Ý nghĩa: gần điểm a, giá trị hàm bùng nổ không giới hạn.\n\n' +
      'VỚI HÀM PHÂN THỨC y = (ax + b)/(cx + d), c ≠ 0 VÀ ad − bc ≠ 0:\n' +
      '— Tiệm cận đứng: x = −d/c (nghiệm của mẫu).\n' +
      '— Tiệm cận ngang: y = a/c (tỉ số hai hệ số bậc cao nhất).\n' +
      'ĐIỀU KIỆN ad − bc ≠ 0 LÀ BẮT BUỘC: nếu ad = bc thì phân thức rút gọn được thành hằng số, đồ thị là một đường ' +
      'thẳng nằm ngang bị thủng một điểm, KHÔNG có tiệm cận nào cả.\n\n' +
      'CẢNH BÁO QUAN TRỌNG NHẤT: nghiệm của mẫu chưa chắc cho tiệm cận đứng. Nếu nghiệm ấy đồng thời là nghiệm của ' +
      'tử và bị rút gọn hết, thì tại đó đồ thị chỉ bị "thủng một lỗ" chứ không bùng nổ ra vô cực. Ví dụ ' +
      'y = (x² − 1)/(x − 1) = x + 1 với x ≠ 1: mẫu triệt tiêu tại x = 1 nhưng KHÔNG có tiệm cận đứng. Luôn RÚT GỌN ' +
      'phân thức trước khi kết luận.\n\n' +
      'QUY TẮC TỔNG QUÁT CHO PHÂN THỨC ĐA THỨC bậc tử m, bậc mẫu p:\n' +
      '— m < p: tiệm cận ngang y = 0.\n' +
      '— m = p: tiệm cận ngang y = tỉ số hệ số bậc cao nhất.\n' +
      '— m > p: KHÔNG có tiệm cận ngang (hàm tiến ra vô cực); khi m = p + 1 thì có tiệm cận XIÊN.\n\n' +
      'GHI NHỚ VỀ BẢN CHẤT: tiệm cận là đường mà đồ thị tiến SÁT tuỳ ý, không có nghĩa là không bao giờ cắt. Đồ thị ' +
      'vẫn có thể cắt tiệm cận NGANG ở vùng hữu hạn rồi mới tiến sát về nó ở vô cực; riêng tiệm cận ĐỨNG thì đồ thị ' +
      'không bao giờ cắt vì tại đó hàm không xác định.',
    animation: {
      title: 'Điểm chạy trên nhánh hypebol dán mãi vào tiệm cận mà không chạm',
      description:
        'Đồ thị hàm y = (2x + 1)/(x − 1) được vẽ với hai nhánh tách rời nhau bởi đường tiệm cận đứng x = 1, cùng đường tiệm cận ngang y = 2 vẽ nét đứt. Viết lại hàm thành 2 cộng 3/(x − 1) để thấy phần dư 3/(x − 1) chính là khoảng cách từ đồ thị tới mức 2. Một điểm chạy men theo nhánh phải, khởi hành ở gần tiệm cận đứng nơi tung độ lên tới khoảng 7,5, rồi trượt dần sang phải: tại x = 4 tung độ đã là 3, tại x = 6 chỉ còn 2,6, càng đi càng ép sát mức 2 mà không bao giờ cắt qua. Hình động phá cách hiểu sai rằng tiệm cận là đường biên chặn đồ thị lại: nó không chặn gì cả, nó chỉ là mức mà khoảng cách tiến về 0 khi x ra vô cực.',
      viewBoxWidth: 300,
      viewBoxHeight: 250,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'ox',
          x1: 5,
          y1: 160,
          x2: 290,
          y2: 160,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'oy',
          x1: 100,
          y1: 10,
          x2: 100,
          y2: 240,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'tc-dung',
          x1: 130,
          y1: 10,
          x2: 130,
          y2: 240,
          stroke: 'accent',
          strokeWidth: 2,
          dash: '6 4',
        },
        {
          kind: 'line',
          id: 'tc-ngang',
          x1: 5,
          y1: 124,
          x2: 290,
          y2: 124,
          stroke: 'accent',
          strokeWidth: 2,
          dash: '6 4',
        },
        {
          kind: 'label',
          id: 'nhan-tcd',
          x: 136,
          y: 22,
          text: 'x = 1',
          size: 12,
          fill: 'accent',
        },
        {
          kind: 'label',
          id: 'nhan-tcn',
          x: 284,
          y: 118,
          text: 'y = 2',
          size: 12,
          anchor: 'end',
          fill: 'accent',
        },
        {
          kind: 'polyline',
          id: 'nhanh-phai',
          points: [
            [146.5, 25.8],
            [151, 46.9],
            [157, 64],
            [163, 74.9],
            [172, 85.4],
            [184, 94],
            [202, 101.5],
            [220, 106],
            [244, 109.8],
            [280, 113.2],
          ],
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'polyline',
          id: 'nhanh-trai',
          points: [
            [10, 137.5],
            [40, 142],
            [58, 146.5],
            [76, 154],
            [88, 162.6],
            [97, 173.1],
            [103, 184],
            [109, 201.1],
            [113.5, 222.1],
          ],
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'ham',
          x: 200,
          y: 40,
          text: 'y = (2x + 1)/(x − 1) = 2 + 3/(x − 1)',
          size: 13,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'circle',
          id: 'diem-chay',
          cx: 151,
          cy: 47,
          r: 6,
          fill: 'correct',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 6,
              dy: 17,
            },
            {
              atMs: 1500,
              dx: 12,
              dy: 28,
            },
            {
              atMs: 2250,
              dx: 21,
              dy: 38.5,
            },
            {
              atMs: 3000,
              dx: 33,
              dy: 47,
            },
            {
              atMs: 3750,
              dx: 51,
              dy: 54.5,
            },
            {
              atMs: 4500,
              dx: 69,
              dy: 59,
            },
            {
              atMs: 5250,
              dx: 93,
              dy: 62.8,
            },
            {
              atMs: 6000,
              dx: 129,
              dy: 66.2,
            },
          ],
        },
        {
          kind: 'label',
          id: 'do-1',
          x: 232,
          y: 100,
          text: 'x = 4 → y = 3',
          size: 12,
          anchor: 'start',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4200,
              opacity: 0,
            },
            {
              atMs: 4600,
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
          id: 'do-2',
          x: 232,
          y: 140,
          text: 'x = 6 → y = 2,6',
          size: 12,
          anchor: 'start',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 5400,
              opacity: 0,
            },
            {
              atMs: 5700,
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
          x: 150,
          y: 246,
          text: 'khoảng cách tới y = 2 là 3/(x−1) → 0, không bao giờ bằng 0',
          size: 12,
          anchor: 'middle',
          fill: 'muted',
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Sát tiệm cận đứng x = 1, tung độ vọt lên rất lớn.',
        },
        {
          atMs: 2250,
          text: 'Điểm trượt sang phải, đồ thị hạ xuống nhanh.',
        },
        {
          atMs: 4600,
          text: 'Tại x = 4 tung độ đã là 3 — chỉ còn cách mức 2 đúng 1 đơn vị.',
        },
        {
          atMs: 5700,
          text: 'Tại x = 6 còn 2,6. Phần dư 3/(x−1) teo dần nhưng không bao giờ bằng 0.',
        },
      ],
    },
    workedExample: {
      problem: 'Tìm các đường tiệm cận của đồ thị hàm số y = (2x + 3)/(x − 1).',
      steps: [
        'Bước 1 — Kiểm điều kiện trước khi áp công thức: a = 2, b = 3, c = 1, d = −1. Ta có ad − bc = 2·(−1) − 3·1 = ' +
          '−5 ≠ 0, nên phân thức không rút gọn được và đồ thị thực sự là một hypebol có đủ hai tiệm cận.',
        'Bước 2 — Tìm tiệm cận đứng: mẫu bằng 0 khi x = 1. Kiểm tử tại x = 1: 2·1 + 3 = 5 ≠ 0, nên tử không triệt ' +
          'tiêu cùng mẫu, hàm thật sự bùng nổ tại đó. Vậy x = 1 là tiệm cận đứng.',
        'Bước 3 — Xác nhận bằng giới hạn: khi x → 1⁺ thì tử tiến tới 5 còn mẫu dương rất nhỏ, nên y → +∞; khi x → 1⁻ ' +
          'thì mẫu âm rất nhỏ, y → −∞. Đúng là tiệm cận đứng.',
        'Bước 4 — Tìm tiệm cận ngang bằng cách chia cả tử và mẫu cho x: y = (2 + 3/x)/(1 − 1/x) → 2/1 = 2 khi ' +
          'x → ±∞. Vậy y = 2 là tiệm cận ngang. Kết quả khớp quy tắc "tỉ số hai hệ số bậc cao nhất".',
      ],
      answer: 'Tiệm cận đứng x = 1 và tiệm cận ngang y = 2.',
    },
    checkQuestions: [
      {
        prompt:
          'Đồ thị hàm số y = (3x − 1)/(x + 2) có tiệm cận ngang là đường thẳng y = k. Giá trị k bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 3 },
        explain:
          'Tiệm cận ngang của hàm bậc nhất trên bậc nhất là tỉ số hai hệ số của x: k = 3/1 = 3. Lỗi hay gặp là lấy ' +
          'tỉ số hai hằng số tự do (−1)/2 hoặc lấy nghiệm mẫu −2. Nhớ phân vai: hằng số tự do liên quan tiệm cận ' +
          'ĐỨNG (qua nghiệm mẫu), còn hệ số bậc cao nhất quyết định tiệm cận NGANG.',
      },
      {
        prompt: 'Đồ thị hàm số y = (x² − 4)/(x − 2) có bao nhiêu đường tiệm cận đứng?',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Bẫy cố ý. Mẫu bằng 0 tại x = 2 nên nhiều bạn kết luận ngay có một tiệm cận đứng. Nhưng tử cũng bằng 0 tại ' +
          'đó: x² − 4 = (x−2)(x+2), rút gọn cho y = x + 2 với mọi x ≠ 2. Đồ thị là đường thẳng y = x + 2 bị THỦNG ' +
          'một điểm tại x = 2, giá trị hàm tiến tới 4 chứ không hề ra vô cực. Vậy không có tiệm cận đứng nào. Quy ' +
          'tắc: luôn RÚT GỌN phân thức trước khi kết luận về tiệm cận.',
      },
      {
        prompt:
          'Đồ thị hàm số y = (x² + 1)/(x − 3) có tiệm cận ngang không? Nhập 1 nếu CÓ, 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Bậc tử là 2, bậc mẫu là 1, tức bậc tử LỚN HƠN bậc mẫu. Khi x → ±∞ thì y cũng tiến ra vô cực chứ không ổn ' +
          'định về một số hữu hạn nào, nên KHÔNG có tiệm cận ngang. Trường hợp này (bậc tử hơn bậc mẫu đúng 1 đơn ' +
          'vị) lại có tiệm cận XIÊN, tìm được bằng phép chia đa thức. Lỗi thường gặp là máy móc lấy tỉ số hệ số bậc ' +
          'cao nhất mà không so bậc trước.',
      },
    ],
    srsCards: [
      {
        hoi: 'Tiệm cận đứng và tiệm cận ngang của y = (ax+b)/(cx+d)?',
        dap: 'Đứng x = −d/c, ngang y = a/c — với điều kiện ad − bc ≠ 0.',
      },
      {
        hoi: 'Nghiệm của mẫu có luôn cho tiệm cận đứng không?',
        dap: 'Không. Nếu tử cũng triệt tiêu và rút gọn hết thì đồ thị chỉ bị thủng một điểm.',
      },
      {
        hoi: 'Khi nào đồ thị hàm phân thức không có tiệm cận ngang?',
        dap: 'Khi bậc tử lớn hơn bậc mẫu; nếu hơn đúng 1 bậc thì có tiệm cận xiên.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
