// lessons/toan10c3.ts — Toán 10, Chương 3: Hệ thức lượng trong tam giác.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN10_C3_LESSONS: MathLesson[] = [
  {
    id: 'toan10-c3-b1',
    grade: '10',
    chapterNumber: 3,
    chapterTitle: 'Hệ thức lượng trong tam giác',
    lessonNumber: 1,
    title: 'Định lí côsin và định lí sin',
    hook:
      'Muốn đo khoảng cách từ bờ bên này sông Hàn sang một cột mốc bên kia bờ, ta không thể kéo thước qua sông. ' +
      'Nhưng chỉ cần đứng ở hai điểm trên bờ, đo khoảng cách giữa chúng và hai góc ngắm, là tính ra được khoảng cách ' +
      'kia chính xác đến từng mét. Toàn bộ ngành trắc địa dựng trên hai định lí của bài học này.',
    theory:
      'HAI ĐỊNH LÍ NỀN TẢNG\n' +
      'Cho tam giác ABC có các cạnh a = BC, b = CA, c = AB.\n\n' +
      '1) ĐỊNH LÍ CÔSIN: a² = b² + c² − 2bc·cosA (và hai hệ thức tương tự cho b², c²).\n' +
      'VÌ SAO có số hạng −2bc·cosA? Hãy coi định lí Pythagore là trường hợp riêng: khi A = 90° thì cosA = 0, công ' +
      'thức thu về a² = b² + c². Số hạng −2bc·cosA chính là phần "sửa chữa" cho việc góc A không vuông: góc A nhọn ' +
      '(cosA > 0) làm cạnh đối a NGẮN đi so với Pythagore; góc A tù (cosA < 0) làm a DÀI ra. Nhớ được ý nghĩa này ' +
      'thì không bao giờ nhầm dấu.\n' +
      'Hệ quả tính góc: cosA = (b² + c² − a²) / (2bc).\n\n' +
      '2) ĐỊNH LÍ SIN: a/sinA = b/sinB = c/sinC = 2R, với R là bán kính đường tròn ngoại tiếp.\n' +
      'Ý nghĩa: trong một tam giác, cạnh lớn hơn luôn đối diện góc lớn hơn, và tỉ lệ ấy là hằng số bằng đúng đường ' +
      'kính đường tròn ngoại tiếp. Đây là cầu nối giữa tam giác và đường tròn.\n\n' +
      'DÙNG CÁI NÀO KHI NÀO — ĐÂY LÀ PHẦN QUAN TRỌNG NHẤT\n' +
      '— Biết hai cạnh và góc XEN GIỮA chúng → dùng định lí CÔSIN để tìm cạnh thứ ba.\n' +
      '— Biết cả ba cạnh → dùng hệ quả côsin để tìm góc.\n' +
      '— Biết một cạnh và hai góc, hoặc hai cạnh và góc ĐỐI DIỆN một trong hai → dùng định lí SIN.\n\n' +
      'GIỚI HẠN PHẢI CẨN THẬN: khi dùng định lí sin để tìm GÓC, phương trình sinX = k có thể cho hai nghiệm bù nhau ' +
      '(ví dụ 30° và 150°) vì sin của hai góc bù bằng nhau. Phải đối chiếu thêm điều kiện (tổng ba góc bằng 180°, ' +
      'cạnh lớn đối góc lớn) để loại nghiệm. Ngược lại, hàm côsin đơn điệu trên (0°; 180°) nên tìm góc bằng định lí ' +
      'côsin luôn cho duy nhất một nghiệm — đó là lý do nên ưu tiên côsin khi tìm góc.\n\n' +
      'CÁC CÔNG THỨC DIỆN TÍCH\n' +
      'S = (1/2)ab·sinC = abc/(4R) = pr = √(p(p−a)(p−b)(p−c)) với p là nửa chu vi (công thức Heron). Chọn công thức ' +
      'theo dữ kiện đang có: biết ba cạnh thì dùng Heron, biết hai cạnh và góc xen giữa thì dùng (1/2)ab·sinC.',
    animation: {
      title: 'Cùng hai cạnh, đổi góc xen giữa thì cạnh thứ ba đổi theo',
      description:
        'Hai tam giác được dựng lần lượt từ cùng một đỉnh A với hai cạnh giữ nguyên: AB = 5 và AC = 8. Tam giác thứ nhất có góc A = 60 độ, cạnh đối diện tính theo định lí côsin là a bình phương bằng 25 cộng 64 trừ 2 nhân 5 nhân 8 nhân cos 60 độ, tức 89 trừ 40 bằng 49, nên a = 7. Sau đó cạnh AC quay lên vị trí vuông góc với AB: góc A = 90 độ, số hạng trừ biến mất vì cos 90 độ bằng 0, nên a bình phương bằng đúng 89 và a khoảng 9,43. Hình động phá bẫy quen thuộc là tưởng ba cạnh quyết định lẫn nhau một cách cố định: hai cạnh giữ nguyên mà cạnh thứ ba vẫn dài ra khi góc xen giữa mở rộng, và định lí Pytago chỉ là trường hợp riêng khi góc đó bằng 90 độ.',
      viewBoxWidth: 360,
      viewBoxHeight: 260,
      durationMs: 7000,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'dinh-a',
          cx: 60,
          cy: 200,
          r: 4,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-a',
          x: 48,
          y: 218,
          text: 'A',
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'line',
          id: 'canh-ab',
          x1: 60,
          y1: 200,
          x2: 160,
          y2: 200,
          stroke: 'primary',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 500,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-b',
          x: 168,
          y: 214,
          text: 'B',
          size: 14,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-c5',
          x: 105,
          y: 220,
          text: 'c = 5',
          size: 13,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'line',
          id: 'canh-ac',
          x1: 60,
          y1: 200,
          x2: 140,
          y2: 61,
          stroke: 'accent',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1200,
              opacity: 0,
            },
            {
              atMs: 1600,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-c',
          x: 146,
          y: 54,
          text: 'C',
          size: 14,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-b8',
          x: 86,
          y: 124,
          text: 'b = 8',
          size: 13,
          anchor: 'end',
          fill: 'accent',
        },
        {
          kind: 'line',
          id: 'canh-bc',
          x1: 160,
          y1: 200,
          x2: 140,
          y2: 61,
          stroke: 'correct',
          strokeWidth: 4,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2200,
              opacity: 0,
            },
            {
              atMs: 2700,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-a7',
          x: 176,
          y: 130,
          text: 'a = 7',
          size: 14,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3000,
              opacity: 0,
            },
            {
              atMs: 3400,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'goc-60',
          x: 92,
          y: 186,
          text: 'A = 60°',
          size: 12,
          fill: 'muted',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1600,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'canh-ac2',
          x1: 60,
          y1: 200,
          x2: 60,
          y2: 40,
          stroke: 'accent',
          strokeWidth: 3,
          dash: '6 4',
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
              atMs: 4700,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'canh-bc2',
          x1: 160,
          y1: 200,
          x2: 60,
          y2: 40,
          stroke: 'warn',
          strokeWidth: 4,
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
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-c2',
          x: 52,
          y: 34,
          text: "C'",
          size: 14,
          anchor: 'end',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4700,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-a943',
          x: 118,
          y: 106,
          text: 'a ≈ 9,43',
          size: 14,
          anchor: 'end',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 5800,
              opacity: 0,
            },
            {
              atMs: 6200,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ct',
          x: 180,
          y: 244,
          text: 'a² = b² + c² − 2bc·cosA',
          size: 15,
          anchor: 'middle',
          fill: 'primary',
        },
      ],
      captions: [
        {
          atMs: 300,
          text: 'Từ đỉnh A dựng cạnh AB = 5.',
        },
        {
          atMs: 1600,
          text: 'Dựng tiếp AC = 8 hợp với AB một góc 60°.',
        },
        {
          atMs: 2700,
          text: 'Nối B với C: a² = 25 + 64 − 2·5·8·cos60° = 49, vậy a = 7.',
        },
        {
          atMs: 4700,
          text: 'Giữ nguyên hai cạnh, mở góc A lên 90°: điểm C trượt tới C′.',
        },
        {
          atMs: 6200,
          text: 'cos90° = 0 nên số hạng trừ biến mất: a² = 89, a ≈ 9,43. Pytago chỉ là một ca riêng.',
        },
      ],
    },
    workedExample: {
      problem:
        'Để đo khoảng cách AB qua một con sông, người ta chọn điểm C ở cùng bờ với A, đo được AC = 120 m, ' +
        'góc BAC = 60°, góc ACB = 45°. Tính khoảng cách AB (làm tròn đến mét).',
      steps: [
        'Bước 1 — Tìm góc còn lại vì định lí sin cần cặp cạnh–góc đối diện: góc ABC = 180° − 60° − 45° = 75°. ' +
          'Cạnh AC đối diện góc B, cạnh AB đối diện góc C, nên ta có đủ một cặp để lập tỉ lệ.',
        'Bước 2 — Chọn công cụ: bài cho MỘT cạnh và HAI góc, đây đúng là trường hợp của định lí sin (định lí côsin ' +
          'không dùng được vì chỉ biết một cạnh).',
        'Bước 3 — Lập tỉ lệ: AB / sin(ACB) = AC / sin(ABC), tức AB / sin45° = 120 / sin75°.',
        'Bước 4 — Tính: AB = 120 · sin45° / sin75° = 120 · 0,7071 / 0,9659 ≈ 87,85 m.',
        'Bước 5 — Kiểm tra tính hợp lý: góc C = 45° nhỏ hơn góc B = 75°, nên cạnh AB đối diện C phải NGẮN hơn cạnh ' +
          'AC = 120 m đối diện B. Kết quả 87,85 m nhỏ hơn 120 m, phù hợp.',
      ],
      answer: 'AB ≈ 88 m.',
    },
    checkQuestions: [
      {
        prompt: 'Tam giác ABC có b = 8, c = 5 và góc A = 60°. Tính độ dài cạnh a.',
        answer: { kind: 'numeric', value: 7 },
        explain:
          'Dùng định lí côsin vì đề cho hai cạnh và góc XEN GIỮA: a² = 8² + 5² − 2·8·5·cos60° = 64 + 25 − 80·0,5 = 49, ' +
          'suy ra a = 7. Lỗi thường gặp là cộng nhầm thành 64 + 25 + 40 = 129 (sai dấu) hoặc dùng thẳng Pythagore ra ' +
          '√89. Hãy nhớ: góc A = 60° là góc nhọn nên cạnh đối a phải NGẮN hơn √89 ≈ 9,43 — kết quả 7 phù hợp.',
      },
      {
        prompt: 'Tam giác ABC có a = 7, b = 8, c = 13. Số đo góc C bằng bao nhiêu độ?',
        answer: { kind: 'numeric', value: 120 },
        explain:
          'Biết cả ba cạnh nên dùng hệ quả côsin: cosC = (a² + b² − c²)/(2ab) = (49 + 64 − 169)/(2·7·8) = −56/112 = −0,5, ' +
          'suy ra C = 120°. Nhiều bạn thấy kết quả âm liền cho là tính sai và đổi dấu thành +0,5 để ra 60°. Giá trị ' +
          'cosin ÂM là hoàn toàn bình thường: nó báo rằng góc C tù. Dấu hiệu kiểm tra: c = 13 là cạnh lớn nhất và ' +
          'c² = 169 > a² + b² = 113, đúng là tam giác tù tại C.',
      },
      {
        prompt:
          'Tam giác ABC có góc A = 30° và bán kính đường tròn ngoại tiếp R = 6. Cạnh a bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 6 },
        explain:
          'Theo định lí sin, a = 2R·sinA = 2·6·sin30° = 12·0,5 = 6. Bẫy ở đây là công thức a/sinA = 2R chứ không ' +
          'phải a/sinA = R; ai nhớ thiếu hệ số 2 sẽ ra 3. Cách kiểm nhanh: khi A = 90° thì a phải là đường kính, ' +
          'tức a = 2R — chỉ công thức có hệ số 2 mới thoả điều đó.',
      },
    ],
    srsCards: [
      {
        hoi: 'Định lí côsin phát biểu thế nào và trở thành định lí nào khi góc A vuông?',
        dap: 'a² = b² + c² − 2bc·cosA; khi A = 90° thì cosA = 0, thu về định lí Pythagore.',
      },
      {
        hoi: 'Khi nào nên dùng định lí sin, khi nào dùng định lí côsin?',
        dap: 'Côsin khi biết hai cạnh và góc xen giữa, hoặc biết ba cạnh; sin khi có cặp cạnh – góc đối diện.',
      },
      {
        hoi: 'Vì sao tìm góc bằng định lí côsin an toàn hơn bằng định lí sin?',
        dap: 'Côsin đơn điệu trên (0°;180°) nên cho nghiệm duy nhất; sin cho hai góc bù nhau, dễ nhận nhầm nghiệm.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
