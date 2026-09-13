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
