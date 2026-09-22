// lessons/toan12c5.ts — Toán 12, Chương 5: Phương pháp toạ độ trong không gian.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN12_C5_LESSONS: MathLesson[] = [
  {
    id: 'toan12-c5-b1',
    grade: '12',
    chapterNumber: 5,
    chapterTitle: 'Phương pháp toạ độ trong không gian',
    lessonNumber: 1,
    title: 'Hệ toạ độ Oxyz và tích có hướng của hai vectơ',
    hook:
      'Máy bay của Vietnam Airlines báo vị trí bằng ba con số: kinh độ, vĩ độ và độ cao. Đài kiểm soát không lưu ' +
      'phải tính khoảng cách giữa hai máy bay và biết chúng có nguy cơ cắt đường bay nhau không — tất cả bằng tính ' +
      'toán trên ba con số ấy, không vẽ hình nào cả. Đó chính là sức mạnh của phương pháp toạ độ trong không gian.',
    theory:
      'HỆ TRỤC Oxyz\n' +
      'Gồm ba trục đôi một vuông góc với các vectơ đơn vị i→ = (1;0;0), j→ = (0;1;0), k→ = (0;0;1). Mỗi điểm M ứng ' +
      'với bộ ba (x; y; z).\n\n' +
      'CÁC CÔNG THỨC MỞ RỘNG TỰ NHIÊN TỪ MẶT PHẲNG\n' +
      '— Vectơ AB→ = (x_B − x_A; y_B − y_A; z_B − z_A).\n' +
      '— Độ dài: |u→| = √(x² + y² + z²).\n' +
      '— Tích vô hướng: u→·v→ = x₁x₂ + y₁y₂ + z₁z₂; vẫn giữ nguyên tính chất u→ ⊥ v→ ⇔ u→·v→ = 0.\n' +
      '— Trung điểm, trọng tâm: lấy trung bình cộng từng toạ độ.\n' +
      'Tất cả chỉ là "thêm một thành phần z" vào công thức đã học ở lớp 10 — đó là vì hệ ba trục cũng vuông góc đôi ' +
      'một như hệ hai trục, nên định lí Pythagore vẫn áp dụng được y hệt.\n\n' +
      'TÍCH CÓ HƯỚNG — CÔNG CỤ MỚI CHỈ CÓ TRONG KHÔNG GIAN\n' +
      '[u→, v→] = (y₁z₂ − z₁y₂; z₁x₂ − x₁z₂; x₁y₂ − y₁x₂).\n' +
      'ĐIỂM KHÁC CĂN BẢN VỚI TÍCH VÔ HƯỚNG: kết quả là một VECTƠ, không phải một số. Và vectơ ấy VUÔNG GÓC với cả ' +
      'u→ lẫn v→.\n' +
      'VÌ SAO CẦN NÓ: trong mặt phẳng, từ một vectơ ta suy ngay ra vectơ vuông góc bằng mẹo "đổi chỗ đổi dấu". Trong ' +
      'không gian, có VÔ SỐ hướng vuông góc với một vectơ cho trước, nên phải có hai vectơ mới xác định được hướng ' +
      'vuông góc duy nhất. Tích có hướng làm đúng việc đó, và nó là chìa khoá để viết phương trình mặt phẳng.\n\n' +
      'BỐN ỨNG DỤNG PHẢI THUỘC\n' +
      '1. [u→, v→] = 0→ ⇔ u→ và v→ CÙNG PHƯƠNG. Đây là cách kiểm ba điểm thẳng hàng.\n' +
      '2. Diện tích tam giác ABC = (1/2)·|[AB→, AC→]|.\n' +
      '3. Thể tích khối hộp = |[AB→, AD→]·AA′→| (tích hỗn tạp).\n' +
      '4. Thể tích tứ diện ABCD = (1/6)·|[AB→, AC→]·AD→|. Hệ quả: bốn điểm ĐỒNG PHẲNG khi và chỉ khi tích hỗn tạp ' +
      'bằng 0 (thể tích bằng 0).\n\n' +
      'LƯU Ý VỀ THỨ TỰ: tích có hướng KHÔNG giao hoán — [u→, v→] = −[v→, u→]. Đổi thứ tự thì vectơ đảo chiều. Điều ' +
      'này không ảnh hưởng khi tính diện tích hay thể tích (vì đã lấy giá trị tuyệt đối) nhưng ảnh hưởng khi ta cần ' +
      'chọn hướng pháp tuyến cụ thể.',
    workedExample: {
      problem: 'Cho ba điểm A(1; 0; 0), B(0; 2; 0), C(0; 0; 3). Tính diện tích tam giác ABC.',
      steps: [
        'Bước 1 — Lập hai vectơ xuất phát từ cùng một đỉnh (bắt buộc phải cùng gốc thì công thức mới đúng): ' +
          'AB→ = (0−1; 2−0; 0−0) = (−1; 2; 0) và AC→ = (−1; 0; 3).',
        'Bước 2 — Chọn công cụ: diện tích tam giác trong không gian không tính được bằng công thức đáy nhân cao nếu ' +
          'chưa biết chân đường cao; tích có hướng cho ngay kết quả nên ưu tiên dùng.',
        'Bước 3 — Tính [AB→, AC→] theo công thức: thành phần x = 2·3 − 0·0 = 6; thành phần y = 0·(−1) − (−1)·3 = 3; ' +
          'thành phần z = (−1)·0 − 2·(−1) = 2. Vậy [AB→, AC→] = (6; 3; 2).',
        'Bước 4 — Kiểm chứng nhanh kết quả bằng tính vuông góc: (6;3;2)·(−1;2;0) = −6 + 6 + 0 = 0, đúng vuông góc ' +
          'với AB→. Đây là cách tự kiểm rất đáng làm vì công thức tích có hướng dễ nhầm dấu.',
        'Bước 5 — Tính độ dài rồi chia đôi: |[AB→, AC→]| = √(36 + 9 + 4) = √49 = 7, nên diện tích tam giác ' +
          'S = 7/2 = 3,5.',
      ],
      answer: 'Diện tích tam giác ABC bằng 3,5 (đơn vị diện tích).',
    },
    checkQuestions: [
      {
        prompt: 'Cho A(1; 2; 3) và B(4; 6; 15). Tính độ dài đoạn thẳng AB.',
        answer: { kind: 'numeric', value: 13 },
        explain:
          'AB→ = (3; 4; 12) nên AB = √(9 + 16 + 144) = √169 = 13. Lỗi hay gặp là quên bình phương một thành phần, ' +
          'hoặc cộng thẳng 3 + 4 + 12 = 19. Công thức trong không gian chỉ là Pythagore áp dụng hai lần, nên vẫn ' +
          'phải bình phương đủ cả ba thành phần rồi mới khai căn.',
      },
      {
        prompt: 'Kết quả của tích có hướng [u→, v→] là một số hay một vectơ?',
        choices: [
          { id: 'so', label: 'Một số thực' },
          { id: 'vecto', label: 'Một vectơ vuông góc với cả u→ và v→' },
          { id: 'vecto_cung', label: 'Một vectơ cùng phương với u→' },
        ],
        answer: { kind: 'choice', correctIds: ['vecto'] },
        explain:
          'Đây là nhầm lẫn hay gặp nhất khi mới học vì hai phép toán có tên gần giống nhau. Tích VÔ HƯỚNG cho một ' +
          'SỐ (dùng để xét góc và tính độ dài); tích CÓ HƯỚNG cho một VECTƠ vuông góc với cả hai vectơ ban đầu (dùng ' +
          'để tìm pháp tuyến mặt phẳng, tính diện tích, thể tích). Mẹo nhớ: "có hướng" nghĩa là kết quả CÓ hướng, ' +
          'tức là vectơ.',
      },
      {
        prompt:
          'Cho u→ = (1; 2; 3) và v→ = (2; 4; 6). Tích có hướng [u→, v→] bằng vectơ không. Điều đó cho biết hai vectơ ' +
          'này có quan hệ gì?',
        choices: [
          { id: 'vuong', label: 'Vuông góc với nhau' },
          { id: 'cung_phuong', label: 'Cùng phương với nhau' },
          { id: 'khong_lien_quan', label: 'Không có quan hệ đặc biệt' },
        ],
        answer: { kind: 'choice', correctIds: ['cung_phuong'] },
        explain:
          'Tích có hướng bằng vectơ không khi và chỉ khi hai vectơ CÙNG PHƯƠNG. Ở đây thấy ngay v→ = 2u→. Bẫy ở chỗ ' +
          'nhiều bạn nhớ nhầm sang quy tắc của tích VÔ HƯỚNG: tích vô hướng bằng 0 mới là vuông góc. Hai quy tắc ' +
          'ngược nhau về ý nghĩa nên rất dễ lẫn — hãy gắn với hình ảnh: hai vectơ cùng phương không "căng" ra được ' +
          'một mặt phẳng nào, nên không có hướng vuông góc để trả về.',
      },
    ],
    srsCards: [
      {
        hoi: 'Tích có hướng của hai vectơ cho ra cái gì?',
        dap: 'Một VECTƠ vuông góc với cả hai vectơ ban đầu (khác tích vô hướng cho một số).',
      },
      {
        hoi: 'Diện tích tam giác ABC tính bằng tích có hướng thế nào?',
        dap: 'S = (1/2)·|[AB→, AC→]| với hai vectơ cùng xuất phát từ A.',
      },
      {
        hoi: '[u→, v→] = 0→ có nghĩa gì?',
        dap: 'Hai vectơ cùng phương. (Còn u→·v→ = 0 mới là vuông góc.)',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan12-c5-b2',
    grade: '12',
    chapterNumber: 5,
    chapterTitle: 'Phương pháp toạ độ trong không gian',
    lessonNumber: 2,
    title: 'Phương trình mặt phẳng và mặt cầu',
    hook:
      'Máy in 3D dựng một vật thể bằng cách cắt nó thành hàng nghìn lát mỏng song song. Mỗi lát là giao của vật thể ' +
      'với một MẶT PHẲNG, và phần mềm phải mô tả mỗi mặt phẳng ấy bằng đúng bốn con số. Bốn con số nào, và vì sao ' +
      'chỉ cần bốn?',
    theory:
      'PHƯƠNG TRÌNH TỔNG QUÁT CỦA MẶT PHẲNG\n' +
      'Ax + By + Cz + D = 0 với A, B, C không đồng thời bằng 0. Vectơ n→ = (A; B; C) là VECTƠ PHÁP TUYẾN, tức vectơ ' +
      'vuông góc với mặt phẳng.\n' +
      'VÌ SAO CHỈ CẦN BỐN SỐ: một mặt phẳng được xác định hoàn toàn bởi HAI thông tin — hướng (do pháp tuyến quyết ' +
      'định, ba số A, B, C) và vị trí (một số D cho biết mặt phẳng cách gốc bao xa theo hướng ấy). Đó chính là bốn ' +
      'số máy in 3D cần.\n\n' +
      'MẶT PHẲNG QUA ĐIỂM M₀(x₀; y₀; z₀) CÓ PHÁP TUYẾN n→ = (A; B; C):\n' +
      'A(x − x₀) + B(y − y₀) + C(z − z₀) = 0.\n' +
      'Cách dựng công thức: điểm M thuộc mặt phẳng khi M₀M→ vuông góc với n→, tức tích vô hướng bằng 0. Không cần ' +
      'học thuộc, chỉ cần nhớ điều kiện vuông góc.\n\n' +
      'CÁCH TÌM PHÁP TUYẾN TRONG BA TÌNH HUỐNG THƯỜNG GẶP\n' +
      '1. Mặt phẳng qua ba điểm A, B, C: lấy n→ = [AB→, AC→] (tích có hướng).\n' +
      '2. Mặt phẳng song song với mặt phẳng đã cho: dùng CHUNG pháp tuyến, chỉ đổi D.\n' +
      '3. Mặt phẳng vuông góc với một đường thẳng: lấy vectơ chỉ phương của đường thẳng ấy làm pháp tuyến.\n\n' +
      'KHOẢNG CÁCH TỪ ĐIỂM ĐẾN MẶT PHẲNG\n' +
      'd(M; (P)) = |Ax₀ + By₀ + Cz₀ + D| / √(A² + B² + C²).\n' +
      'Cấu trúc giống hệt công thức trong mặt phẳng, chỉ thêm thành phần z. Vẫn phải có dấu giá trị tuyệt đối, và ' +
      'phương trình phải ở dạng vế phải bằng 0.\n\n' +
      'MẶT CẦU\n' +
      'Tâm I(a; b; c), bán kính R: (x − a)² + (y − b)² + (z − c)² = R².\n' +
      'Dạng khai triển x² + y² + z² − 2ax − 2by − 2cz + d = 0 là mặt cầu khi và chỉ khi a² + b² + c² − d > 0, và khi ' +
      'đó R = √(a² + b² + c² − d). Điều kiện này bắt buộc phải kiểm, y như với đường tròn ở lớp 10.\n\n' +
      'VỊ TRÍ TƯƠNG ĐỐI GIỮA MẶT PHẲNG VÀ MẶT CẦU: so sánh d(I; (P)) với R. Lớn hơn thì không cắt; bằng thì TIẾP ' +
      'XÚC tại một điểm; nhỏ hơn thì cắt theo một ĐƯỜNG TRÒN có bán kính r = √(R² − d²) — công thức này chỉ là ' +
      'Pythagore trong tam giác vuông tạo bởi bán kính mặt cầu, khoảng cách d và bán kính đường tròn giao tuyến.',
    animation: {
      title: 'So d với R để biết mặt cầu cắt, tiếp xúc hay rời mặt phẳng',
      description:
        'Hình vẽ là lát cắt vuông góc: mặt phẳng (P) hiện ra thành một đường thẳng, mặt cầu tâm I bán kính R = 45 đơn vị hiện ra thành một đường tròn, còn vectơ pháp tuyến n dựng vuông góc với (P). Mặt cầu hạ dần xuống qua ba vị trí. Vị trí đầu, tâm I cách (P) 110 đơn vị, lớn hơn R, đường tròn không chạm đường thẳng: mặt cầu và mặt phẳng không có điểm chung. Vị trí giữa, khoảng cách đúng bằng 45 tức bằng R, đường tròn chạm đường thẳng tại đúng một điểm: tiếp xúc, và điểm chạm chính là hình chiếu của I trên (P). Vị trí cuối, khoảng cách còn 25 nhỏ hơn R, đường tròn cắt đường thẳng ở hai chỗ: giao tuyến là một đường tròn thật. Hình động cho thấy cả ba trường hợp là MỘT hiện tượng liên tục, chỉ phân biệt bằng phép so d với R.',
      viewBoxWidth: 320,
      viewBoxHeight: 240,
      durationMs: 7500,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'mat-phang',
          x1: 20,
          y1: 190,
          x2: 300,
          y2: 190,
          stroke: 'muted',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'nhan-mp',
          x: 14,
          y: 208,
          text: '(P): Ax + By + Cz + D = 0',
          size: 12,
          anchor: 'start',
          fill: 'muted',
        },
        {
          kind: 'arrow',
          id: 'phap-tuyen',
          x1: 60,
          y1: 190,
          x2: 60,
          y2: 140,
          stroke: 'accent',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'nhan-n',
          x: 68,
          y: 146,
          text: 'n',
          size: 13,
          fill: 'accent',
        },
        {
          kind: 'circle',
          id: 'mat-cau',
          cx: 180,
          cy: 80,
          r: 45,
          stroke: 'primary',
          strokeWidth: 3,
          keyframes: [
            {
              atMs: 0,
              dy: 0,
            },
            {
              atMs: 2000,
              dy: 0,
            },
            {
              atMs: 3200,
              dy: 65,
            },
            {
              atMs: 5000,
              dy: 65,
            },
            {
              atMs: 6000,
              dy: 85,
            },
            {
              atMs: 7500,
              dy: 85,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'tam-i',
          cx: 180,
          cy: 80,
          r: 4,
          fill: 'primary',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
            },
            {
              atMs: 2000,
              dy: 0,
            },
            {
              atMs: 3200,
              dy: 65,
            },
            {
              atMs: 5000,
              dy: 65,
            },
            {
              atMs: 6000,
              dy: 85,
            },
            {
              atMs: 7500,
              dy: 85,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-i',
          x: 190,
          y: 76,
          text: 'I, R = 45',
          size: 13,
          fill: 'primary',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
            },
            {
              atMs: 2000,
              dy: 0,
            },
            {
              atMs: 3200,
              dy: 65,
            },
            {
              atMs: 5000,
              dy: 65,
            },
            {
              atMs: 6000,
              dy: 85,
            },
            {
              atMs: 7500,
              dy: 85,
            },
          ],
        },
        {
          kind: 'line',
          id: 'khoang-cach',
          x1: 180,
          y1: 35,
          x2: 180,
          y2: 190,
          stroke: 'muted',
          strokeWidth: 2,
          dash: '5 4',
          keyframes: [
            {
              atMs: 0,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'th-1',
          x: 60,
          y: 22,
          text: 'd = 110 > R: không điểm chung',
          size: 13,
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 400,
              opacity: 1,
            },
            {
              atMs: 2000,
              opacity: 1,
            },
            {
              atMs: 2400,
              opacity: 0,
            },
            {
              atMs: 7500,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'th-2',
          x: 60,
          y: 22,
          text: 'd = 45 = R: tiếp xúc tại 1 điểm',
          size: 13,
          fill: 'accent',
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
              atMs: 3600,
              opacity: 1,
            },
            {
              atMs: 5000,
              opacity: 1,
            },
            {
              atMs: 5400,
              opacity: 0,
            },
            {
              atMs: 7500,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'th-3',
          x: 60,
          y: 22,
          text: 'd = 25 < R: cắt theo một đường tròn',
          size: 13,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 6000,
              opacity: 0,
            },
            {
              atMs: 6400,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'diem-tiep',
          cx: 180,
          cy: 190,
          r: 5,
          fill: 'correct',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3400,
              opacity: 0,
            },
            {
              atMs: 3600,
              opacity: 1,
            },
            {
              atMs: 5200,
              opacity: 1,
            },
            {
              atMs: 5400,
              opacity: 0,
            },
            {
              atMs: 7500,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ct',
          x: 160,
          y: 232,
          text: 'd(I, (P)) = |Ax₀ + By₀ + Cz₀ + D| / √(A² + B² + C²)',
          size: 13,
          anchor: 'middle',
          fill: 'primary',
        },
      ],
      captions: [
        {
          atMs: 400,
          text: 'Tâm I cách (P) 110 đơn vị, lớn hơn R = 45: mặt cầu treo hẳn phía trên.',
        },
        {
          atMs: 3600,
          text: 'Hạ xuống đến khi d = R = 45: chạm đúng một điểm, chính là hình chiếu của I.',
        },
        {
          atMs: 6400,
          text: 'Hạ tiếp, d = 25 < R: lát cắt cho hai giao điểm, tức mặt cầu cắt (P) theo một đường tròn.',
        },
        {
          atMs: 7200,
          text: 'Cả ba trường hợp chỉ khác nhau ở phép so d với R.',
        },
      ],
    },
    workedExample: {
      problem:
        'Viết phương trình mặt phẳng đi qua ba điểm A(1; 0; 0), B(0; 2; 0), C(0; 0; 3), rồi tính khoảng cách từ gốc ' +
        'toạ độ O đến mặt phẳng đó.',
      steps: [
        'Bước 1 — Lập hai vectơ chỉ phương nằm trong mặt phẳng: AB→ = (−1; 2; 0) và AC→ = (−1; 0; 3).',
        'Bước 2 — Tìm pháp tuyến bằng tích có hướng (chọn cách này vì pháp tuyến phải vuông góc với cả hai vectơ ' +
          'trên): n→ = [AB→, AC→] = (6; 3; 2), đã tính ở bài trước.',
        'Bước 3 — Viết phương trình qua điểm A(1; 0; 0) với pháp tuyến vừa tìm: 6(x − 1) + 3(y − 0) + 2(z − 0) = 0, ' +
          'rút gọn thành 6x + 3y + 2z − 6 = 0.',
        'Bước 4 — Kiểm chứng bằng cách thay hai điểm còn lại: với B(0;2;0) được 0 + 6 + 0 − 6 = 0, đúng; với ' +
          'C(0;0;3) được 0 + 0 + 6 − 6 = 0, đúng. Cả ba điểm đều thuộc mặt phẳng.',
        'Bước 5 — Tính khoảng cách từ O(0;0;0): d = |6·0 + 3·0 + 2·0 − 6| / √(36 + 9 + 4) = 6/7 ≈ 0,857.',
      ],
      answer: 'Mặt phẳng 6x + 3y + 2z − 6 = 0; khoảng cách từ O bằng 6/7.',
    },
    checkQuestions: [
      {
        prompt: 'Mặt phẳng 2x − 3y + z − 5 = 0 có một vectơ pháp tuyến là vectơ nào?',
        choices: [
          { id: 'a', label: '(2; −3; 1)' },
          { id: 'b', label: '(2; −3; 1; −5)' },
          { id: 'c', label: '(−5; 2; −3)' },
          { id: 'd', label: '(2; 3; 1)' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain:
          'Pháp tuyến lấy đúng ba hệ số của x, y, z theo thứ tự, KHÔNG lấy hằng số tự do: n→ = (2; −3; 1). Hai lỗi ' +
          'hay gặp: kéo cả số −5 vào (vectơ trong không gian chỉ có ba thành phần, và D chỉ quyết định vị trí chứ ' +
          'không quyết định hướng); và bỏ mất dấu âm của hệ số y.',
      },
      {
        prompt:
          'Tính khoảng cách từ điểm M(1; 1; 1) đến mặt phẳng x + 2y + 2z − 12 = 0. ' +
          '(Nhập dạng phân số tối giản, ví dụ 5/3.)',
        answer: { kind: 'fraction', num: 7, den: 3 },
        explain:
          'd = |1 + 2 + 2 − 12| / √(1 + 4 + 4) = |−7|/3 = 7/3 ≈ 2,33. Hai lỗi kinh điển: quên giá trị tuyệt đối rồi ' +
          'ghi đáp số âm (khoảng cách không bao giờ âm), và quên khai căn ở mẫu (chia cho 9 ra 0,78).',
      },
      {
        prompt:
          'Phương trình x² + y² + z² − 2x + 4y − 6z + 20 = 0 có biểu diễn một mặt cầu không? ' +
          'Nhập 1 nếu CÓ, 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Đối chiếu dạng chuẩn: a = 1, b = −2, c = 3, d = 20. Điều kiện tồn tại mặt cầu là a² + b² + c² − d > 0, ' +
          'nhưng ở đây 1 + 4 + 9 − 20 = −6 < 0. Không có điểm nào thoả mãn, nên đây KHÔNG phải mặt cầu. Bẫy là thấy ' +
          'phương trình "đúng dạng" liền kết luận ngay — luôn phải kiểm điều kiện, nhất là trong bài có tham số. ' +
          'Nếu biểu thức ấy bằng đúng 0 thì tập hợp chỉ còn một điểm duy nhất.',
      },
    ],
    srsCards: [
      {
        hoi: 'Phương trình mặt phẳng qua M₀ với pháp tuyến (A;B;C)?',
        dap: 'A(x−x₀) + B(y−y₀) + C(z−z₀) = 0 — xuất phát từ điều kiện M₀M→ vuông góc pháp tuyến.',
      },
      {
        hoi: 'Cách tìm pháp tuyến của mặt phẳng qua ba điểm A, B, C?',
        dap: 'Lấy tích có hướng n→ = [AB→, AC→].',
      },
      {
        hoi: 'Khi mặt phẳng cắt mặt cầu, bán kính đường tròn giao tuyến bằng bao nhiêu?',
        dap: 'r = √(R² − d²) với d là khoảng cách từ tâm mặt cầu tới mặt phẳng.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
