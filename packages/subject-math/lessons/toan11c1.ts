// lessons/toan11c1.ts — Toán 11, Chương 1: Hàm số lượng giác và phương trình lượng giác.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN11_C1_LESSONS: MathLesson[] = [
  {
    id: 'toan11-c1-b1',
    grade: '11',
    chapterNumber: 1,
    chapterTitle: 'Hàm số lượng giác và phương trình lượng giác',
    lessonNumber: 1,
    title: 'Giá trị lượng giác của góc lượng giác và đường tròn lượng giác',
    hook:
      'Mực nước thuỷ triều ở cảng Hải Phòng lên xuống đều đặn hai lần mỗi ngày, năm này qua năm khác. Đồ thị mực ' +
      'nước theo thời gian không phải đường thẳng cũng chẳng phải parabol — nó là một đường lượn sóng lặp lại mãi. ' +
      'Muốn mô tả bất cứ thứ gì LẶP LẠI theo chu kỳ, loài người chỉ có một bộ công cụ: các hàm lượng giác.',
    theory:
      'GÓC LƯỢNG GIÁC — VÌ SAO CẦN MỞ RỘNG KHÁI NIỆM GÓC\n' +
      'Ở cấp hai, góc chỉ nằm trong khoảng 0° đến 180°. Nhưng một bánh xe quay được 3 vòng rưỡi thì góc quay là bao ' +
      'nhiêu? Góc lượng giác cho phép góc NHẬN MỌI GIÁ TRỊ THỰC, kể cả âm (quay ngược chiều kim đồng hồ là dương, ' +
      'cùng chiều kim đồng hồ là âm) và lớn hơn 360°.\n' +
      'Hai góc lượng giác có cùng tia đầu và tia cuối thì hơn kém nhau bội nguyên của 2π: α + k2π (k ∈ ℤ).\n\n' +
      'ĐƠN VỊ RADIAN\n' +
      '1 radian là góc chắn cung có độ dài bằng bán kính. Đổi đơn vị: π rad = 180°.\n' +
      'VÌ SAO DÙNG RADIAN CHỨ KHÔNG DÙNG ĐỘ? Vì độ là quy ước tuỳ tiện của người Babylon (chia vòng tròn thành 360 ' +
      'phần), còn radian sinh ra từ chính hình học của đường tròn. Mọi công thức đạo hàm, giới hạn lượng giác ở lớp ' +
      '11–12 chỉ đúng khi dùng radian.\n\n' +
      'ĐƯỜNG TRÒN LƯỢNG GIÁC\n' +
      'Là đường tròn bán kính 1, tâm O, có chiều dương ngược chiều kim đồng hồ. Điểm M ứng với góc α có toạ độ ' +
      '(cos α; sin α). Định nghĩa này giải thích luôn mọi tính chất:\n' +
      '— Vì M nằm trên đường tròn bán kính 1 nên −1 ≤ sin α ≤ 1 và −1 ≤ cos α ≤ 1.\n' +
      '— Vì OM = 1 nên sin²α + cos²α = 1 (chính là định lí Pythagore).\n' +
      '— Dấu của sin, cos theo phần tư chính là dấu của tung độ, hoành độ điểm M.\n' +
      '— Quay thêm một vòng thì M trở về chỗ cũ, nên sin và cos tuần hoàn chu kỳ 2π.\n\n' +
      'CÁC CÔNG THỨC CƠ BẢN\n' +
      'tan α = sin α / cos α (điều kiện cos α ≠ 0, tức α ≠ π/2 + kπ); cot α = cos α / sin α (α ≠ kπ).\n' +
      '1 + tan²α = 1/cos²α; 1 + cot²α = 1/sin²α.\n\n' +
      'CUNG LIÊN KẾT — CÁCH NHỚ KHÔNG CẦN HỌC VẸT\n' +
      '— Hai góc ĐỐI nhau (α và −α): cos giữ nguyên, các giá trị khác đổi dấu (vì phép đối xứng qua trục hoành giữ ' +
      'nguyên hoành độ, đổi dấu tung độ).\n' +
      '— Hai góc BÙ nhau (α và π−α): sin giữ nguyên, còn lại đổi dấu.\n' +
      '— Hai góc hơn kém π: sin và cos đều đổi dấu, tan và cot giữ nguyên.\n' +
      '— Hai góc PHỤ nhau (α và π/2−α): sin ↔ cos, tan ↔ cot.\n' +
      'Mọi công thức trên đọc thẳng ra được từ hình vẽ đường tròn lượng giác — hãy vẽ hình thay vì cố nhớ bảng.',
    animation: {
      title: 'Điểm chạy trên đường tròn lượng giác sinh ra đồ thị hàm sin',
      description:
        'Một điểm chạy ngược chiều kim đồng hồ trên đường tròn lượng giác bán kính một đơn vị. Hình chiếu của điểm ' +
        'đó xuống trục tung chính là giá trị sin của góc; khi điểm quay đều thì hình chiếu ấy dao động lên xuống ' +
        'giữa âm một và một, vẽ nên đường hình sin tuần hoàn ở bên phải. Đây là lý do sin bị chặn trong đoạn từ âm ' +
        'một đến một và lặp lại sau mỗi vòng quay.',
      viewBoxWidth: 420,
      viewBoxHeight: 220,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'vongTron',
          cx: 90,
          cy: 110,
          r: 60,
          stroke: 'muted',
          strokeWidth: 2,
          fill: 'surface',
          opacity: 0.4,
        },
        {
          kind: 'line',
          id: 'truc_x',
          x1: 20,
          y1: 110,
          x2: 400,
          y2: 110,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'truc_y',
          x1: 90,
          y1: 35,
          x2: 90,
          y2: 190,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'banKinhQuay',
          x1: 90,
          y1: 110,
          x2: 150,
          y2: 110,
          stroke: 'primary',
          strokeWidth: 3,
          keyframes: [
            { atMs: 0, rotate: 0 },
            { atMs: 8000, rotate: -360 },
          ],
        },
        {
          kind: 'polyline',
          id: 'dothiSin',
          points: [
            [170, 110],
            [190, 81],
            [210, 60],
            [230, 52],
            [250, 60],
            [270, 81],
            [290, 110],
            [310, 139],
            [330, 160],
            [350, 168],
            [370, 160],
            [390, 139],
          ],
          stroke: 'accent',
          strokeWidth: 3,
        },
        {
          kind: 'line',
          id: 'mucTren',
          x1: 20,
          y1: 50,
          x2: 400,
          y2: 50,
          stroke: 'muted',
          strokeWidth: 1,
          dash: '4 4',
        },
        {
          kind: 'line',
          id: 'mucDuoi',
          x1: 20,
          y1: 170,
          x2: 400,
          y2: 170,
          stroke: 'muted',
          strokeWidth: 1,
          dash: '4 4',
        },
        {
          kind: 'label',
          id: 'nhanMot',
          x: 14,
          y: 46,
          text: '1',
          size: 13,
          anchor: 'start',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanAmMot',
          x: 8,
          y: 184,
          text: '−1',
          size: 13,
          anchor: 'start',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanSin',
          x: 280,
          y: 202,
          text: 'y = sin x',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
        },
      ],
      captions: [
        { atMs: 0, text: 'Bán kính quay đều ngược chiều kim đồng hồ.' },
        { atMs: 2000, text: 'Tung độ của điểm chính là sin của góc quay.' },
        { atMs: 4000, text: 'Tung độ ấy luôn nằm giữa −1 và 1 vì bán kính bằng 1.' },
        { atMs: 6500, text: 'Hết một vòng, mọi giá trị lặp lại: chu kỳ 2π.' },
      ],
    },
    workedExample: {
      problem: 'Cho sin α = 3/5 với π/2 < α < π. Tính cos α, tan α và sin(π − α).',
      steps: [
        'Bước 1 — Dùng hệ thức cơ bản để tìm cos: từ sin²α + cos²α = 1 suy ra cos²α = 1 − 9/25 = 16/25, ' +
          'nên cos α = ±4/5. Vẫn còn hai khả năng, chưa kết luận vội.',
        'Bước 2 — Dùng điều kiện về góc để CHỌN DẤU (đây là bước học sinh hay bỏ qua nhất): π/2 < α < π nghĩa là α ' +
          'thuộc phần tư thứ hai. Điểm M khi đó nằm bên TRÁI trục tung nên hoành độ âm, tức cos α < 0. Vậy cos α = −4/5.',
        'Bước 3 — Tính tan: tan α = sin α / cos α = (3/5)/(−4/5) = −3/4. Kết quả âm là hợp lý vì ở phần tư thứ hai ' +
          'sin dương còn cos âm.',
        'Bước 4 — Tính sin(π − α): hai góc α và π − α là hai góc BÙ nhau, mà với góc bù thì sin giữ nguyên. Vậy ' +
          'sin(π − α) = sin α = 3/5. Không cần tính α cụ thể.',
      ],
      answer: 'cos α = −4/5; tan α = −3/4; sin(π − α) = 3/5.',
    },
    checkQuestions: [
      {
        prompt: 'Đổi góc 150° sang radian, kết quả là kπ/6. Giá trị của k bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 5 },
        explain:
          'Dùng tỉ lệ 180° = π rad: 150° = 150·π/180 = 5π/6, nên k = 5. Cách nhớ nhanh: chia số đo độ cho 180 rồi ' +
          'nhân π. Lỗi thường gặp là nhân với 180 thay vì chia, ra con số rất lớn — hãy kiểm bằng cảm giác: 150° nhỏ ' +
          'hơn 180° = π ≈ 3,14 rad, mà 5π/6 ≈ 2,6 rad, phù hợp.',
      },
      {
        prompt:
          'Biết cos α = 1/2 và −π/2 < α < 0. Giá trị của sin α bằng bao nhiêu? (Nhập số thập phân làm tròn 2 chữ số.)',
        answer: { kind: 'numeric', value: -0.87, tolerance: { mode: 'absolute', eps: 0.01 } },
        explain:
          'Từ sin²α = 1 − 1/4 = 3/4 ta có sin α = ±√3/2 ≈ ±0,87. Đây chính là bẫy: phải dùng điều kiện về góc để ' +
          'chọn dấu. Góc α thuộc khoảng (−π/2; 0) tức phần tư thứ tư, điểm nằm PHÍA DƯỚI trục hoành nên tung độ âm, ' +
          'do đó sin α = −0,87. Rất nhiều bạn dừng ở bước khai căn và lấy luôn giá trị dương.',
      },
      {
        prompt: 'Giá trị của biểu thức sin²35° + cos²35° bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'Hệ thức cơ bản sin²α + cos²α = 1 đúng với MỌI góc α, không cần biết α cụ thể — nó chính là định lí ' +
          'Pythagore áp dụng cho điểm nằm trên đường tròn bán kính 1. Nhiều bạn cố bấm máy tính từng giá trị rồi ' +
          'cộng, vừa mất thời gian vừa sai số. Lưu ý sin²α nghĩa là (sin α)², không phải sin(α²).',
      },
    ],
    srsCards: [
      {
        hoi: 'Vì sao sin²α + cos²α = 1?',
        dap: 'Vì (cos α; sin α) là toạ độ điểm nằm trên đường tròn bán kính 1; đó chính là định lí Pythagore.',
      },
      {
        hoi: 'Khi tính giá trị lượng giác từ hệ thức cơ bản, phải làm thêm bước gì?',
        dap: 'Dùng điều kiện về khoảng chứa góc để chọn DẤU, vì khai căn cho hai khả năng.',
      },
      {
        hoi: 'Quan hệ giữa hai góc bù nhau α và π − α?',
        dap: 'sin giữ nguyên, còn cos, tan, cot đều đổi dấu.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan11-c1-b2',
    grade: '11',
    chapterNumber: 1,
    chapterTitle: 'Hàm số lượng giác và phương trình lượng giác',
    lessonNumber: 2,
    title: 'Phương trình lượng giác cơ bản',
    hook:
      'Một guồng nước ở Hoà Bình quay đều, độ cao của một gàu nước so với mặt sông là h(t) = 2 + 3sin(πt/6) mét. ' +
      'Người ta cần biết vào những thời điểm nào gàu nước ở đúng độ cao 3,5 mét để đặt máng hứng. Câu hỏi ấy không ' +
      'có một đáp số — nó có VÔ HẠN đáp số, lặp lại đều đặn, và ta phải viết được tất cả chúng bằng một công thức.',
    theory:
      'VÌ SAO NGHIỆM LƯỢNG GIÁC LUÔN VÔ HẠN\n' +
      'Hàm sin và cos tuần hoàn chu kỳ 2π: nếu x₀ là nghiệm thì x₀ + k2π cũng là nghiệm với mọi k nguyên. Vì thế ' +
      'đáp án bắt buộc phải kèm "+ k2π (k ∈ ℤ)" — thiếu phần này là thiếu vô hạn nghiệm, và bị trừ điểm.\n\n' +
      'BỐN CÔNG THỨC NGHIỆM CƠ BẢN\n' +
      '1. sin x = sin α ⇔ x = α + k2π HOẶC x = π − α + k2π.\n' +
      '2. cos x = cos α ⇔ x = ±α + k2π.\n' +
      '3. tan x = tan α ⇔ x = α + kπ.\n' +
      '4. cot x = cot α ⇔ x = α + kπ.\n\n' +
      'VÌ SAO SIN CÓ HAI HỌ NGHIỆM CÒN TAN CHỈ CÓ MỘT\n' +
      'Nhìn đường tròn lượng giác: hai điểm có CÙNG tung độ (cùng sin) đối xứng nhau qua trục tung, ứng với α và ' +
      'π − α — đó là hai họ nghiệm. Hai điểm cùng hoành độ (cùng cos) đối xứng qua trục hoành, ứng với α và −α, ' +
      'gộp lại viết gọn thành ±α. Còn tan có chu kỳ chỉ π (không phải 2π) nên hai điểm cách nhau nửa vòng đã cho ' +
      'cùng giá trị, gộp được thành MỘT họ nghiệm x = α + kπ.\n\n' +
      'ĐIỀU KIỆN CÓ NGHIỆM\n' +
      'sin x = m và cos x = m chỉ có nghiệm khi −1 ≤ m ≤ 1, vì sin và cos luôn bị chặn. Phương trình sin x = 2 vô ' +
      'nghiệm — đừng cố bấm máy tính. Trong khi đó tan x = m và cot x = m có nghiệm với MỌI m thực.\n\n' +
      'BA TRƯỜNG HỢP ĐẶC BIỆT NÊN THUỘC\n' +
      'sin x = 0 ⇔ x = kπ; sin x = 1 ⇔ x = π/2 + k2π; sin x = −1 ⇔ x = −π/2 + k2π.\n' +
      'cos x = 0 ⇔ x = π/2 + kπ; cos x = 1 ⇔ x = k2π; cos x = −1 ⇔ x = π + k2π.\n\n' +
      'LƯU Ý VỀ ĐIỀU KIỆN XÁC ĐỊNH: phương trình chứa tan phải có cos x ≠ 0, chứa cot phải có sin x ≠ 0. Giải xong ' +
      'phải ĐỐI CHIẾU điều kiện để loại nghiệm ngoại lai.',
    animation: {
      title: 'Vì sao sin x = 1/2 có HAI họ nghiệm chứ không phải một',
      description:
        'Trên đường tròn lượng giác, một điểm chạy hết một vòng từ góc 0 độ theo chiều dương. Đường thẳng nằm ngang ứng với tung độ bằng 1/2 cắt đường tròn tại đúng hai điểm: điểm ở góc 30 độ tức pi chia 6, và điểm ở góc 150 độ tức 5pi chia 6. Khi điểm chạy đi qua mỗi giao điểm, giao điểm đó sáng lên. Hình động phá lỗi phổ biến nhất của chương: bấm máy tính ra pi chia 6 rồi tưởng đó là toàn bộ nghiệm. Mắt nhìn thấy rõ đường ngang cắt đường tròn hai lần, nên phải có hai họ nghiệm x = pi/6 cộng k2pi và x = 5pi/6 cộng k2pi; số hạng k2pi chính là việc điểm chạy quay thêm nguyên vòng và rơi lại đúng chỗ cũ.',
      viewBoxWidth: 300,
      viewBoxHeight: 260,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'duong-tron',
          cx: 120,
          cy: 130,
          r: 90,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'ox',
          x1: 15,
          y1: 130,
          x2: 225,
          y2: 130,
          stroke: 'muted',
          strokeWidth: 1,
          dash: '4 4',
        },
        {
          kind: 'line',
          id: 'oy',
          x1: 120,
          y1: 25,
          x2: 120,
          y2: 235,
          stroke: 'muted',
          strokeWidth: 1,
          dash: '4 4',
        },
        {
          kind: 'line',
          id: 'muc-nua',
          x1: 15,
          y1: 85,
          x2: 240,
          y2: 85,
          stroke: 'accent',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'nhan-muc',
          x: 248,
          y: 90,
          text: 'y = 1/2',
          size: 13,
          fill: 'accent',
        },
        {
          kind: 'circle',
          id: 'giao-1',
          cx: 198,
          cy: 85,
          r: 6,
          fill: 'correct',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 400,
              opacity: 0,
            },
            {
              atMs: 600,
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
          id: 'nhan-g1',
          x: 208,
          y: 72,
          text: 'π/6',
          size: 14,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 600,
              opacity: 0,
            },
            {
              atMs: 900,
              opacity: 1,
            },
            {
              atMs: 6000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'giao-2',
          cx: 42,
          cy: 85,
          r: 6,
          fill: 'correct',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2300,
              opacity: 0,
            },
            {
              atMs: 2600,
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
          id: 'nhan-g2',
          x: 32,
          y: 72,
          text: '5π/6',
          size: 14,
          anchor: 'end',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2600,
              opacity: 0,
            },
            {
              atMs: 2900,
              opacity: 1,
            },
            {
              atMs: 6000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'goc-o',
          cx: 120,
          cy: 130,
          r: 3,
          fill: 'neutral',
        },
        {
          kind: 'circle',
          id: 'diem-chay',
          cx: 210,
          cy: 130,
          r: 7,
          fill: 'primary',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 500,
              dx: -12.06,
              dy: -45,
            },
            {
              atMs: 1000,
              dx: -45,
              dy: -77.94,
            },
            {
              atMs: 1500,
              dx: -90,
              dy: -90,
            },
            {
              atMs: 2000,
              dx: -135,
              dy: -77.94,
            },
            {
              atMs: 2500,
              dx: -167.94,
              dy: -45,
            },
            {
              atMs: 3000,
              dx: -180,
              dy: 0,
            },
            {
              atMs: 3500,
              dx: -167.94,
              dy: 45,
            },
            {
              atMs: 4000,
              dx: -135,
              dy: 77.94,
            },
            {
              atMs: 4500,
              dx: -90,
              dy: 90,
            },
            {
              atMs: 5000,
              dx: -45,
              dy: 77.94,
            },
            {
              atMs: 5500,
              dx: -12.06,
              dy: 45,
            },
            {
              atMs: 6000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nghiem-1',
          x: 150,
          y: 245,
          text: 'x = π/6 + k2π',
          size: 14,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'nghiem-2',
          x: 150,
          y: 258,
          text: 'x = 5π/6 + k2π',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Điểm chạy xuất phát ở góc 0 và quay theo chiều dương.',
        },
        {
          atMs: 600,
          text: 'Lần cắt thứ nhất: góc π/6, vì sin(π/6) = 1/2.',
        },
        {
          atMs: 2600,
          text: 'Lần cắt thứ hai trong cùng một vòng: góc 5π/6, cũng có sin = 1/2.',
        },
        {
          atMs: 4500,
          text: 'Nửa dưới đường tròn có tung độ âm nên không cắt mức 1/2 lần nào nữa.',
        },
        {
          atMs: 5800,
          text: 'Quay hết vòng thì lặp lại: mỗi giao điểm sinh một họ nghiệm cộng k2π.',
        },
      ],
    },
    workedExample: {
      problem:
        'Guồng nước có độ cao gàu h(t) = 2 + 3sin(πt/6) (mét, t tính bằng giờ). Tìm các thời điểm t trong 12 giờ ' +
        'đầu để gàu ở độ cao 3,5 mét.',
      steps: [
        'Bước 1 — Lập phương trình: 2 + 3sin(πt/6) = 3,5 ⇔ 3sin(πt/6) = 1,5 ⇔ sin(πt/6) = 0,5. Kiểm điều kiện có ' +
          'nghiệm: 0,5 nằm trong [−1; 1] nên phương trình có nghiệm.',
        'Bước 2 — Đưa về dạng chuẩn: 0,5 = sin(π/6), nên phương trình thành sin(πt/6) = sin(π/6).',
        'Bước 3 — Viết HAI họ nghiệm (sin luôn cho hai họ): πt/6 = π/6 + k2π hoặc πt/6 = π − π/6 + k2π = 5π/6 + k2π.',
        'Bước 4 — Giải ra t bằng cách nhân hai vế với 6/π: t = 1 + 12k hoặc t = 5 + 12k, với k nguyên.',
        'Bước 5 — Lọc theo yêu cầu 0 ≤ t ≤ 12: với k = 0 được t = 1 và t = 5; với k = 1 được t = 13 và t = 17, đều ' +
          'vượt quá 12 nên loại. Vậy trong 12 giờ đầu gàu ở độ cao 3,5 m vào giờ thứ 1 và giờ thứ 5. Chu kỳ 12 giờ ' +
          'khớp với việc guồng quay một vòng hết 12 giờ — kết quả hợp lý.',
      ],
      answer: 'Tại t = 1 giờ và t = 5 giờ (rồi lặp lại sau mỗi 12 giờ).',
    },
    checkQuestions: [
      {
        prompt: 'Phương trình sin x = 3/2 có bao nhiêu nghiệm thực?',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Giá trị 3/2 = 1,5 nằm NGOÀI đoạn [−1; 1], mà sin x luôn thuộc đoạn này (vì nó là tung độ của điểm trên ' +
          'đường tròn bán kính 1). Vậy phương trình VÔ NGHIỆM. Bẫy ở đây là thói quen cứ thấy phương trình lượng ' +
          'giác là lao vào viết công thức nghiệm. Luôn kiểm điều kiện −1 ≤ m ≤ 1 TRƯỚC. Lưu ý tan x = 1,5 thì lại có ' +
          'vô số nghiệm, vì tan không bị chặn.',
      },
      {
        prompt:
          'Phương trình cos x = 1 có tập nghiệm dạng x = k·mπ với k nguyên. Giá trị của m bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 2 },
        explain:
          'cos x = 1 khi điểm trên đường tròn lượng giác trùng đúng điểm (1; 0), tức x = k2π, nên m = 2. Lỗi phổ ' +
          'biến là viết x = kπ — nhưng với x = π thì cos π = −1 chứ không phải 1. Hãy phân biệt: cos x = 1 cho ' +
          'x = k2π, còn cos x = 0 mới cho chu kỳ π, tức x = π/2 + kπ.',
      },
      {
        prompt: 'Trong khoảng (0; 2π), phương trình sin x = 1/2 có bao nhiêu nghiệm?',
        answer: { kind: 'numeric', value: 2 },
        explain:
          'Hai họ nghiệm x = π/6 + k2π và x = 5π/6 + k2π; trong khoảng (0; 2π) mỗi họ đóng góp đúng một nghiệm, ' +
          'tổng cộng 2 nghiệm là π/6 và 5π/6. Lỗi kinh điển là chỉ nhớ MỘT họ nghiệm và trả lời 1. Hãy hình dung ' +
          'đường thẳng y = 1/2 cắt đồ thị hàm sin trong một chu kỳ: nó cắt hai lần, một lần khi đồ thị đi lên và một ' +
          'lần khi đi xuống. Đó chính là hai họ nghiệm.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức nghiệm của sin x = sin α?',
        dap: 'x = α + k2π hoặc x = π − α + k2π (k ∈ ℤ) — luôn có HAI họ nghiệm.',
      },
      {
        hoi: 'Vì sao tan x = tan α chỉ có một họ nghiệm x = α + kπ?',
        dap: 'Vì hàm tan tuần hoàn với chu kỳ π chứ không phải 2π.',
      },
      {
        hoi: 'Điều kiện để sin x = m có nghiệm?',
        dap: '−1 ≤ m ≤ 1. Với tan x = m thì mọi m thực đều có nghiệm.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
