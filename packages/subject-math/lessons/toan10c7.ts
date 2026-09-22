// lessons/toan10c7.ts — Toán 10, Chương 7: Phương pháp toạ độ trong mặt phẳng.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN10_C7_LESSONS: MathLesson[] = [
  {
    id: 'toan10-c7-b1',
    grade: '10',
    chapterNumber: 7,
    chapterTitle: 'Phương pháp toạ độ trong mặt phẳng',
    lessonNumber: 1,
    title: 'Phương trình đường thẳng và khoảng cách từ điểm đến đường thẳng',
    hook:
      'Ứng dụng gọi xe trên điện thoại của bạn phải trả lời hàng nghìn lần mỗi giây một câu hỏi: tài xế này cách ' +
      'tuyến đường đó bao xa? Máy không cầm thước đi đo — nó chỉ có hai con số toạ độ và một phương trình đường ' +
      'thẳng. Bài học này là công thức mà phần mềm ấy dùng.',
    theory:
      'HAI LOẠI VECTƠ ĐẶC TRƯNG\n' +
      '— Vectơ chỉ phương u→ của đường thẳng: vectơ khác 0→ có giá SONG SONG hoặc trùng với đường thẳng.\n' +
      '— Vectơ pháp tuyến n→: vectơ khác 0→ VUÔNG GÓC với đường thẳng.\n' +
      'Quan hệ chuyển đổi: nếu u→ = (a; b) thì n→ = (−b; a) hoặc (b; −a). Kiểm nhanh bằng tích vô hướng: ' +
      'a·(−b) + b·a = 0, đúng là vuông góc. Nhớ mẹo "đổi chỗ, đổi một dấu".\n\n' +
      'BA DẠNG PHƯƠNG TRÌNH VÀ KHI NÀO DÙNG\n' +
      '1. Tham số: x = x₀ + at, y = y₀ + bt (đi qua M(x₀; y₀), chỉ phương (a; b)). Dùng khi cần mô tả CHUYỂN ĐỘNG ' +
      'hoặc khi tìm giao điểm.\n' +
      '2. Tổng quát: ax + by + c = 0 với n→ = (a; b) là pháp tuyến. Dùng khi xét vị trí tương đối và tính khoảng cách.\n' +
      '3. Hệ số góc: y = kx + m. Tiện khi làm việc với góc, NHƯNG có giới hạn nghiêm trọng: đường thẳng ĐỨNG ' +
      '(song song trục tung) không có hệ số góc. Vì thế dạng tổng quát mới là dạng phổ quát nhất.\n\n' +
      'KHOẢNG CÁCH TỪ ĐIỂM ĐẾN ĐƯỜNG THẲNG\n' +
      'd(M; Δ) = |ax₀ + by₀ + c| / √(a² + b²) với M(x₀; y₀) và Δ: ax + by + c = 0.\n' +
      'Ý nghĩa từng phần: tử số ax₀ + by₀ + c đo "mức độ lệch" của M so với đường thẳng; mẫu số √(a² + b²) chính là ' +
      'độ dài vectơ pháp tuyến, chia cho nó để chuẩn hoá về đơn vị độ dài thật. Dấu giá trị tuyệt đối là bắt buộc vì ' +
      'khoảng cách không âm — bỏ quên nó là lỗi phổ biến nhất khi giải bài tham số.\n\n' +
      'ĐIỀU KIỆN ÁP DỤNG: phương trình phải ở dạng TỔNG QUÁT với vế phải bằng 0. Nếu đề cho y = 2x + 1 thì phải ' +
      'chuyển thành 2x − y + 1 = 0 rồi mới thay vào công thức.\n\n' +
      'VỊ TRÍ TƯƠNG ĐỐI VÀ GÓC\n' +
      'Hai đường thẳng song song khi hai pháp tuyến cùng phương nhưng phương trình không tương đương; vuông góc khi ' +
      'n₁→ · n₂→ = 0. Góc giữa hai đường thẳng tính bằng cos α = |n₁→ · n₂→| / (|n₁→|·|n₂→|) — chú ý giá trị tuyệt ' +
      'đối, vì góc giữa hai ĐƯỜNG THẲNG luôn thuộc [0°; 90°], khác với góc giữa hai VECTƠ thuộc [0°; 180°].',
    animation: {
      title: 'Khoảng cách từ điểm tới đường thẳng là đoạn vuông góc ngắn nhất',
      description:
        'Đường thẳng d: 3x + 4y − 12 = 0 được vẽ qua hai điểm dễ dựng là (4; 0) và (0; 3). Điểm M(4; 5) nằm phía trên đường thẳng. Từ M ba đoạn nối xuống d lần lượt hiện ra: hai đoạn xiên rồi đoạn vuông góc MH, trong đó H(1,6; 1,8) là chân đường vuông góc. Đoạn vuông góc luôn là đoạn ngắn nhất, và độ dài của nó chính bằng giá trị công thức: trị tuyệt đối của 3 nhân 4 cộng 4 nhân 5 trừ 12, chia cho căn bậc hai của 3 bình cộng 4 bình, tức 20 chia 5 bằng 4. Hình động phá quan niệm rằng công thức khoảng cách là một biểu thức trời cho phải học thuộc: nó chỉ là độ dài của đúng đoạn MH mà mắt đang nhìn thấy.',
      viewBoxWidth: 300,
      viewBoxHeight: 240,
      durationMs: 6500,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'ox',
          x1: 20,
          y1: 190,
          x2: 285,
          y2: 190,
          stroke: 'muted',
          strokeWidth: 1,
          dash: '4 4',
        },
        {
          kind: 'line',
          id: 'oy',
          x1: 50,
          y1: 30,
          x2: 50,
          y2: 225,
          stroke: 'muted',
          strokeWidth: 1,
          dash: '4 4',
        },
        {
          kind: 'line',
          id: 'duong-d',
          x1: 25,
          y1: 96.25,
          x2: 175,
          y2: 208.75,
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'nhan-d',
          x: 186,
          y: 214,
          text: 'd: 3x + 4y − 12 = 0',
          size: 13,
          fill: 'primary',
        },
        {
          kind: 'circle',
          id: 'diem-m',
          cx: 150,
          cy: 65,
          r: 5,
          fill: 'accent',
        },
        {
          kind: 'label',
          id: 'nhan-m',
          x: 158,
          y: 58,
          text: 'M(4; 5)',
          size: 13,
          fill: 'accent',
        },
        {
          kind: 'line',
          id: 'xien-1',
          x1: 150,
          y1: 65,
          x2: 50,
          y2: 115,
          stroke: 'muted',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1600,
              opacity: 0,
            },
            {
              atMs: 2000,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-xien1',
          x: 88,
          y: 82,
          text: '≈ 4,47',
          size: 12,
          anchor: 'middle',
          fill: 'muted',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2200,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'xien-2',
          x1: 150,
          y1: 65,
          x2: 150,
          y2: 190,
          stroke: 'muted',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 600,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-xien2',
          x: 158,
          y: 132,
          text: '= 5',
          size: 12,
          fill: 'muted',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 800,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'doan-mh',
          x1: 150,
          y1: 65,
          x2: 90,
          y2: 145,
          stroke: 'correct',
          strokeWidth: 4,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3200,
              opacity: 0,
            },
            {
              atMs: 3700,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'diem-h',
          cx: 90,
          cy: 145,
          r: 4,
          fill: 'correct',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3700,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-h',
          x: 82,
          y: 162,
          text: 'H(1,6; 1,8)',
          size: 12,
          anchor: 'end',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4000,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'rect',
          id: 'goc-vuong',
          x: 88,
          y: 131,
          w: 13,
          h: 13,
          stroke: 'neutral',
          strokeWidth: 1.5,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4200,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ct',
          x: 150,
          y: 30,
          text: 'd(M, d) = |3·4 + 4·5 − 12| / 5 = 20/5 = 4',
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
              atMs: 5000,
              opacity: 0,
            },
            {
              atMs: 5500,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
      ],
      captions: [
        {
          atMs: 600,
          text: 'Nối M thẳng xuống d theo phương đứng: đoạn này dài 5.',
        },
        {
          atMs: 2000,
          text: 'Đổi sang một đoạn xiên khác: dài ≈ 4,47 — ngắn hơn, nhưng vẫn chưa phải ngắn nhất.',
        },
        {
          atMs: 3700,
          text: 'Đoạn vuông góc MH với H(1,6; 1,8) mới là đoạn ngắn nhất.',
        },
        {
          atMs: 5500,
          text: 'Độ dài MH đúng bằng công thức: |3·4 + 4·5 − 12| / √(3² + 4²) = 4.',
        },
      ],
    },
    workedExample: {
      problem:
        'Cho điểm M(3; 1) và đường thẳng Δ: 3x − 4y + 5 = 0. Tính khoảng cách từ M đến Δ, rồi viết phương trình ' +
        'đường thẳng d đi qua M và song song với Δ.',
      steps: [
        'Bước 1 — Kiểm tra dạng phương trình: Δ đã ở dạng tổng quát ax + by + c = 0 với a = 3, b = −4, c = 5, nên ' +
          'dùng ngay công thức khoảng cách được.',
        'Bước 2 — Thay số: d(M; Δ) = |3·3 − 4·1 + 5| / √(3² + (−4)²) = |9 − 4 + 5| / √25 = 10/5 = 2.',
        'Bước 3 — Với đường thẳng d song song Δ: hai đường song song có CÙNG vectơ pháp tuyến, nên d có dạng ' +
          '3x − 4y + c′ = 0. Đây là lý do ta chỉ cần tìm một hằng số thay vì dựng lại từ đầu.',
        'Bước 4 — Dùng điều kiện d đi qua M(3; 1): 3·3 − 4·1 + c′ = 0 ⇔ 5 + c′ = 0 ⇔ c′ = −5.',
        'Bước 5 — Kết luận và tự kiểm: d: 3x − 4y − 5 = 0. Kiểm lại bằng khoảng cách giữa hai đường song song: ' +
          '|5 − (−5)|/5 = 2, đúng bằng khoảng cách vừa tính ở bước 2.',
      ],
      answer: 'd(M; Δ) = 2 và d: 3x − 4y − 5 = 0.',
    },
    checkQuestions: [
      {
        prompt: 'Tính khoảng cách từ điểm A(1; 2) đến đường thẳng 3x + 4y − 5 = 0.',
        answer: { kind: 'numeric', value: 1.2 },
        explain:
          'd = |3·1 + 4·2 − 5| / √(3² + 4²) = |3 + 8 − 5|/5 = 6/5 = 1,2. Hai lỗi hay gặp: quên căn ở mẫu (chia cho ' +
          '25 ra 0,24) và quên giá trị tuyệt đối ở tử khi kết quả trong ngoặc âm. Khoảng cách không bao giờ âm, nên ' +
          'nếu ra số âm là chắc chắn sai.',
      },
      {
        prompt:
          'Đường thẳng d có vectơ chỉ phương u→ = (2; −3). Vectơ nào sau đây là một vectơ pháp tuyến của d?',
        choices: [
          { id: 'a', label: '(3; 2)' },
          { id: 'b', label: '(2; −3)' },
          { id: 'c', label: '(−2; 3)' },
          { id: 'd', label: '(2; 3)' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain:
          'Pháp tuyến phải vuông góc với chỉ phương, kiểm bằng tích vô hướng: (2;−3)·(3;2) = 6 − 6 = 0, đúng. Đáp án ' +
          'b và c sai vì chúng cùng phương với u→ (chúng là chỉ phương, không phải pháp tuyến) — đây là nhầm lẫn phổ ' +
          'biến nhất ở chương này. Đáp án d cho tích vô hướng 4 − 9 = −5 ≠ 0. Quy tắc nhanh: đổi chỗ hai toạ độ rồi ' +
          'đổi dấu MỘT trong hai.',
      },
      {
        prompt:
          'Đường thẳng đi qua hai điểm A(1; 0) và B(1; 5) có hệ số góc bằng bao nhiêu? Nhập 0 nếu đường thẳng KHÔNG ' +
          'có hệ số góc.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Hai điểm có cùng hoành độ x = 1 nên đường thẳng AB thẳng đứng, phương trình là x = 1. Đường thẳng đứng ' +
          'KHÔNG có hệ số góc vì công thức k = (y₂ − y₁)/(x₂ − x₁) có mẫu bằng 0. Nhiều bạn trả lời "hệ số góc bằng ' +
          '0" theo nghĩa số học — nhưng k = 0 là đường NẰM NGANG, hoàn toàn khác. Đây chính là lý do dạng tổng quát ' +
          'ax + by + c = 0 được ưu tiên: nó mô tả được cả đường thẳng đứng.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức khoảng cách từ M(x₀;y₀) đến đường thẳng ax + by + c = 0?',
        dap: 'd = |ax₀ + by₀ + c| / √(a² + b²); phương trình phải ở dạng tổng quát, vế phải bằng 0.',
      },
      {
        hoi: 'Từ vectơ chỉ phương (a; b) suy ra vectơ pháp tuyến thế nào?',
        dap: 'Đổi chỗ hai toạ độ rồi đổi dấu một cái: (−b; a) hoặc (b; −a).',
      },
      {
        hoi: 'Đường thẳng nào không có hệ số góc?',
        dap: 'Đường thẳng đứng dạng x = m, vì mẫu số x₂ − x₁ bằng 0.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan10-c7-b2',
    grade: '10',
    chapterNumber: 7,
    chapterTitle: 'Phương pháp toạ độ trong mặt phẳng',
    lessonNumber: 2,
    title: 'Phương trình đường tròn',
    hook:
      'Một trạm phát sóng ở Đà Lạt phủ tín hiệu trong bán kính 3 km. Muốn biết một bản làng có bắt được sóng hay ' +
      'không, kỹ sư chỉ cần thay toạ độ bản làng vào một phương trình duy nhất rồi so sánh với số 9. Vì sao lại là ' +
      'số 9 chứ không phải 3?',
    theory:
      'PHƯƠNG TRÌNH CHÍNH TẮC\n' +
      'Đường tròn tâm I(a; b), bán kính R có phương trình (x − a)² + (y − b)² = R².\n' +
      'Gốc gác của nó chỉ là định nghĩa đường tròn viết bằng toạ độ: điểm M(x; y) nằm trên đường tròn khi IM = R. ' +
      'Bình phương hai vế công thức khoảng cách √((x−a)² + (y−b)²) = R ta được đúng phương trình trên. Ta bình ' +
      'phương để bỏ căn — cũng vì thế vế phải là R² chứ không phải R, và đó là câu trả lời cho số 9 ở đầu bài.\n\n' +
      'DẠNG KHAI TRIỂN VÀ CÁCH NHẬN BIẾT\n' +
      'Khai triển ra: x² + y² − 2ax − 2by + c = 0 với c = a² + b² − R².\n' +
      'Ngược lại, cho phương trình x² + y² − 2ax − 2by + c = 0, ta có tâm I(a; b) và R² = a² + b² − c.\n' +
      'ĐIỀU KIỆN BẮT BUỘC: phương trình chỉ là đường tròn khi a² + b² − c > 0. Nếu biểu thức đó bằng 0 thì tập hợp ' +
      'chỉ còn MỘT điểm; nếu âm thì KHÔNG có điểm nào. Bỏ qua điều kiện này là lỗi mất điểm nặng trong bài tham số.\n' +
      'Dấu hiệu nhận dạng nhanh một phương trình bậc hai hai ẩn có thể là đường tròn: hệ số của x² và y² phải BẰNG ' +
      'NHAU và KHÔNG có số hạng chứa tích xy.\n\n' +
      'VỊ TRÍ TƯƠNG ĐỐI GIỮA ĐƯỜNG THẲNG VÀ ĐƯỜNG TRÒN\n' +
      'So sánh d(I; Δ) với R:\n' +
      '— d > R: không cắt nhau.\n' +
      '— d = R: TIẾP XÚC (đường thẳng là tiếp tuyến).\n' +
      '— d < R: cắt nhau tại hai điểm.\n' +
      'Cách này nhanh hơn nhiều so với giải hệ phương trình, và đó là lý do nên thuộc công thức khoảng cách trước.\n\n' +
      'TIẾP TUYẾN TẠI MỘT ĐIỂM TRÊN ĐƯỜNG TRÒN\n' +
      'Tiếp tuyến tại M₀(x₀; y₀) thuộc đường tròn tâm I nhận IM₀→ làm vectơ pháp tuyến — vì bán kính luôn vuông góc ' +
      'với tiếp tuyến tại tiếp điểm. Từ đó viết ngay được phương trình mà không cần đặt ẩn.',
    animation: {
      title: 'Đường thẳng trượt dần và ba vị trí tương đối với đường tròn',
      description:
        'Một đường tròn cố định và một đường thẳng nằm ngang trượt từ ngoài vào trong. Ban đầu khoảng cách từ tâm ' +
        'tới đường thẳng lớn hơn bán kính nên chúng không cắt nhau; khi khoảng cách bằng đúng bán kính thì đường ' +
        'thẳng chạm đường tròn tại một điểm duy nhất, đó là tiếp tuyến; trượt tiếp thì khoảng cách nhỏ hơn bán kính ' +
        'và đường thẳng cắt đường tròn tại hai điểm.',
      viewBoxWidth: 320,
      viewBoxHeight: 240,
      durationMs: 7500,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'duongTron',
          cx: 160,
          cy: 120,
          r: 65,
          stroke: 'primary',
          strokeWidth: 3,
          fill: 'surface',
          opacity: 0.5,
        },
        { kind: 'circle', id: 'tam', cx: 160, cy: 120, r: 4, fill: 'neutral' },
        {
          kind: 'line',
          id: 'banKinh',
          x1: 160,
          y1: 120,
          x2: 160,
          y2: 55,
          stroke: 'muted',
          strokeWidth: 2,
          dash: '4 3',
        },
        {
          kind: 'line',
          id: 'duongThang',
          x1: 30,
          y1: 20,
          x2: 290,
          y2: 20,
          stroke: 'accent',
          strokeWidth: 3,
          keyframes: [
            { atMs: 0, dy: 0 },
            { atMs: 2500, dy: 35 },
            { atMs: 4500, dy: 35 },
            { atMs: 7500, dy: 85 },
          ],
        },
        {
          kind: 'label',
          id: 'nhanR',
          x: 150,
          y: 92,
          text: 'R',
          size: 14,
          anchor: 'end',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'trangThai',
          x: 160,
          y: 225,
          text: 'd > R: không cắt nhau',
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
          keyframes: [
            { atMs: 0, opacity: 1 },
            { atMs: 2000, opacity: 1 },
            { atMs: 2500, opacity: 0 },
            { atMs: 7500, opacity: 0 },
          ],
        },
        {
          kind: 'label',
          id: 'trangThaiTiepXuc',
          x: 160,
          y: 225,
          text: 'd = R: tiếp xúc tại đúng một điểm',
          size: 14,
          anchor: 'middle',
          fill: 'primary',
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 2000, opacity: 0 },
            { atMs: 2500, opacity: 1 },
            { atMs: 4500, opacity: 1 },
            { atMs: 5000, opacity: 0 },
            { atMs: 7500, opacity: 0 },
          ],
        },
        {
          kind: 'label',
          id: 'trangThaiCat',
          x: 160,
          y: 225,
          text: 'd < R: cắt tại hai điểm',
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 4500, opacity: 0 },
            { atMs: 5000, opacity: 1 },
            { atMs: 7500, opacity: 1 },
          ],
        },
      ],
      captions: [
        { atMs: 0, text: 'Khoảng cách d từ tâm tới đường thẳng lớn hơn R — chưa chạm nhau.' },
        { atMs: 2500, text: 'd = R: đường thẳng chạm đường tròn đúng một điểm, đó là tiếp tuyến.' },
        { atMs: 5000, text: 'd < R: đường thẳng cắt đường tròn tại hai điểm.' },
      ],
    },
    workedExample: {
      problem:
        'Cho phương trình x² + y² − 4x + 6y − 12 = 0. Xác định tâm và bán kính; sau đó xét xem điểm A(5; 1) nằm ' +
        'trong, trên hay ngoài đường tròn.',
      steps: [
        'Bước 1 — Nhận dạng: hệ số của x² và y² bằng nhau (đều bằng 1) và không có số hạng xy, nên phương trình có ' +
          'thể là đường tròn. Đối chiếu dạng x² + y² − 2ax − 2by + c = 0 ta có −2a = −4 nên a = 2; −2b = 6 nên ' +
          'b = −3; c = −12.',
        'Bước 2 — Kiểm tra điều kiện tồn tại trước khi kết luận: R² = a² + b² − c = 4 + 9 + 12 = 25 > 0, thoả mãn. ' +
          'Vậy đây thật sự là đường tròn tâm I(2; −3), bán kính R = 5.',
        'Bước 3 — Xét vị trí điểm A: so sánh IA với R. IA² = (5 − 2)² + (1 + 3)² = 9 + 16 = 25. Ta so sánh BÌNH ' +
          'PHƯƠNG để khỏi phải khai căn — nhanh và tránh sai số.',
        'Bước 4 — Kết luận: IA² = 25 = R², nên IA = R và điểm A nằm CHÍNH TRÊN đường tròn. Kiểm chứng độc lập bằng ' +
          'cách thay A vào phương trình gốc: 25 + 1 − 20 + 6 − 12 = 0, đúng bằng 0.',
      ],
      answer: 'Tâm I(2; −3), bán kính R = 5; điểm A(5; 1) nằm trên đường tròn.',
    },
    checkQuestions: [
      {
        prompt: 'Đường tròn (x − 1)² + (y + 2)² = 16 có bán kính bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 4 },
        explain:
          'Vế phải của phương trình chính tắc là R² chứ không phải R, nên R = √16 = 4. Bẫy kinh điển là trả lời 16. ' +
          'Hãy nhớ lý do: phương trình sinh ra từ việc BÌNH PHƯƠNG hai vế của công thức khoảng cách để khử căn. ' +
          'Nhân tiện, tâm là I(1; −2) chứ không phải (1; 2) — dấu trong ngoặc luôn ngược với toạ độ tâm.',
      },
      {
        prompt: 'Phương trình x² + y² − 2x + 4y + 10 = 0 biểu diễn hình gì?',
        choices: [
          { id: 'duong_tron', label: 'Một đường tròn bán kính dương' },
          { id: 'mot_diem', label: 'Đúng một điểm' },
          { id: 'rong', label: 'Không có điểm nào' },
        ],
        answer: { kind: 'choice', correctIds: ['rong'] },
        explain:
          'Ta có a = 1, b = −2, c = 10 nên R² = a² + b² − c = 1 + 4 − 10 = −5 < 0. Không có số thực nào bình phương ' +
          'ra số âm, nên tập hợp điểm là RỖNG. Lỗi phổ biến là thấy phương trình "đúng dạng đường tròn" liền kết ' +
          'luận ngay đó là đường tròn mà bỏ qua điều kiện a² + b² − c > 0. Luôn kiểm điều kiện này, nhất là khi đề ' +
          'có tham số.',
      },
      {
        prompt:
          'Đường tròn tâm I(0; 0) bán kính R = 5 và đường thẳng Δ: 3x + 4y − 25 = 0 có vị trí tương đối thế nào? ' +
          'Nhập 0 nếu không cắt nhau, 1 nếu tiếp xúc, 2 nếu cắt tại hai điểm.',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'd(I; Δ) = |3·0 + 4·0 − 25| / √(9 + 16) = 25/5 = 5 = R, nên đường thẳng TIẾP XÚC với đường tròn. Cách này ' +
          'nhanh hơn hẳn việc giải hệ hai phương trình rồi biện luận số nghiệm. Lỗi hay gặp là quên giá trị tuyệt ' +
          'đối ở tử, ra −5 rồi kết luận d < R và cho rằng cắt nhau tại hai điểm.',
      },
    ],
    srsCards: [
      {
        hoi: 'Phương trình chính tắc của đường tròn tâm I(a;b) bán kính R?',
        dap: '(x − a)² + (y − b)² = R² — vế phải là R bình phương, không phải R.',
      },
      {
        hoi: 'Khi nào x² + y² − 2ax − 2by + c = 0 mới là đường tròn?',
        dap: 'Khi a² + b² − c > 0; bằng 0 chỉ cho một điểm, âm thì không có điểm nào.',
      },
      {
        hoi: 'Cách xét vị trí tương đối giữa đường thẳng và đường tròn?',
        dap: 'So sánh d(I; Δ) với R: lớn hơn thì không cắt, bằng thì tiếp xúc, nhỏ hơn thì cắt tại hai điểm.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
