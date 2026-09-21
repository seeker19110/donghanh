// lessons/toan10c8.ts — Toán 10, Chương 8: Đại số tổ hợp.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN10_C8_LESSONS: MathLesson[] = [
  {
    id: 'toan10-c8-b1',
    grade: '10',
    chapterNumber: 8,
    chapterTitle: 'Đại số tổ hợp',
    lessonNumber: 1,
    title: 'Hoán vị, chỉnh hợp và tổ hợp',
    hook:
      'Lớp bạn có 30 người. Chọn 3 bạn đi trực nhật thì có bao nhiêu cách? Còn chọn 3 bạn làm lớp trưởng, lớp phó, ' +
      'thủ quỹ thì có bao nhiêu cách? Nghe thì giống nhau, nhưng đáp số của câu sau lớn gấp 6 lần câu trước. Hiểu vì ' +
      'sao gấp đúng 6 lần là hiểu toàn bộ chương này.',
    theory:
      'HAI QUY TẮC ĐẾM NỀN TẢNG\n' +
      '— Quy tắc CỘNG: công việc có thể làm theo phương án A (m cách) HOẶC phương án B (n cách), hai phương án ' +
      'không trùng nhau, thì có m + n cách. Dấu hiệu: "hoặc", các trường hợp loại trừ nhau.\n' +
      '— Quy tắc NHÂN: công việc gồm giai đoạn 1 (m cách) RỒI giai đoạn 2 (n cách), thì có m·n cách. Dấu hiệu: "và", ' +
      'các bước nối tiếp nhau.\n' +
      'Phân biệt sai hai quy tắc này là nguồn sai lầm lớn nhất của chương. Hãy tự hỏi: các lựa chọn THAY THẾ nhau ' +
      '(cộng) hay NỐI TIẾP nhau (nhân)?\n\n' +
      'BA KHÁI NIỆM VÀ SỰ KHÁC NHAU CỐT LÕI\n' +
      '1. HOÁN VỊ Pₙ = n! — sắp xếp TOÀN BỘ n phần tử theo thứ tự.\n' +
      '2. CHỈNH HỢP Aᵏₙ = n!/(n−k)! — chọn k phần tử từ n rồi SẮP THỨ TỰ chúng.\n' +
      '3. TỔ HỢP Cᵏₙ = n!/(k!·(n−k)!) — chọn k phần tử từ n, KHÔNG quan tâm thứ tự.\n\n' +
      'VÌ SAO CHỈNH HỢP LỚN HƠN TỔ HỢP ĐÚNG k! LẦN\n' +
      'Mỗi nhóm k người được chọn ra có thể xếp thành k! thứ tự khác nhau. Tổ hợp gộp tất cả k! cách xếp ấy thành ' +
      'MỘT, còn chỉnh hợp đếm chúng riêng rẽ. Vậy A = C · k!. Với ví dụ đầu bài, k = 3 nên k! = 6 — đúng bằng hệ số ' +
      'gấp 6 lần.\n\n' +
      'CÂU HỎI CHẨN ĐOÁN KHI LÀM BÀI\n' +
      '"Đổi chỗ hai phần tử đã chọn thì có ra kết quả khác không?" Nếu CÓ (lớp trưởng ↔ lớp phó là hai phương án ' +
      'khác nhau) thì dùng chỉnh hợp. Nếu KHÔNG (ba bạn trực nhật đổi chỗ vẫn là ba bạn ấy) thì dùng tổ hợp. Hãy tập ' +
      'thói quen tự hỏi câu này trước khi viết công thức.\n\n' +
      'HAI TÍNH CHẤT HAY DÙNG CỦA TỔ HỢP\n' +
      '— Đối xứng: Cᵏₙ = Cⁿ⁻ᵏₙ. Vì chọn k phần tử để LẤY cũng là chọn n−k phần tử để BỎ.\n' +
      '— Pascal: Cᵏₙ = Cᵏ⁻¹₍ₙ₋₁₎ + Cᵏ₍ₙ₋₁₎. Xét một phần tử cố định: hoặc nó được chọn, hoặc không.\n\n' +
      'GIỚI HẠN: các công thức trên chỉ áp dụng khi n phần tử ĐÔI MỘT KHÁC NHAU và mỗi phần tử được lấy nhiều nhất ' +
      'một lần. Bài toán cho phép lặp lại (ví dụ lập số có chữ số trùng nhau) phải dùng quy tắc nhân trực tiếp.',
    animation: {
      title: 'Cây chọn hai phần tử: 6 chỉnh hợp gộp lại thành 3 tổ hợp',
      description:
        'Từ ba phần tử A, B, C, cây lựa chọn được dựng dần theo hai tầng. Tầng một mở ra ba nhánh ứng với ba cách chọn phần tử đứng trước. Tầng hai mỗi nhánh lại mở ra hai nhánh vì chỉ còn hai phần tử chưa dùng, cho đúng 3 nhân 2 bằng 6 kết quả có thứ tự: AB, AC, BA, BC, CA, CB. Đó là số chỉnh hợp chập 2 của 3. Sau đó các cặp cùng thành phần được nối lại với nhau: AB với BA, AC với CA, BC với CB. Mỗi tổ hợp bị đếm đúng 2 lần bằng 2 giai thừa, nên số tổ hợp chỉ còn 6 chia 2 bằng 3. Hình động cho thấy thứ mà công thức không nói ra: mẫu số 2 giai thừa không phải quy ước, nó đếm đúng số lần một tổ hợp bị lặp lại trên cây.',
      viewBoxWidth: 320,
      viewBoxHeight: 240,
      durationMs: 7500,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'goc',
          cx: 160,
          cy: 30,
          r: 6,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-goc',
          x: 160,
          y: 18,
          text: '{A, B, C}',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'line',
          id: 'n1',
          x1: 160,
          y1: 30,
          x2: 60,
          y2: 100,
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
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'n2',
          x1: 160,
          y1: 30,
          x2: 160,
          y2: 100,
          stroke: 'muted',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 700,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'n3',
          x1: 160,
          y1: 30,
          x2: 260,
          y2: 100,
          stroke: 'muted',
          strokeWidth: 2,
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
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'l1',
          x: 60,
          y: 112,
          text: 'A',
          size: 15,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'l2',
          x: 160,
          y: 112,
          text: 'B',
          size: 15,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'l3',
          x: 260,
          y: 112,
          text: 'C',
          size: 15,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'line',
          id: 'm1',
          x1: 60,
          y1: 120,
          x2: 30,
          y2: 168,
          stroke: 'muted',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2000,
              opacity: 0,
            },
            {
              atMs: 2400,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'm2',
          x1: 60,
          y1: 120,
          x2: 90,
          y2: 168,
          stroke: 'muted',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2000,
              opacity: 0,
            },
            {
              atMs: 2500,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'm3',
          x1: 160,
          y1: 120,
          x2: 130,
          y2: 168,
          stroke: 'muted',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2000,
              opacity: 0,
            },
            {
              atMs: 2600,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'm4',
          x1: 160,
          y1: 120,
          x2: 190,
          y2: 168,
          stroke: 'muted',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2000,
              opacity: 0,
            },
            {
              atMs: 2700,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'm5',
          x1: 260,
          y1: 120,
          x2: 230,
          y2: 168,
          stroke: 'muted',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2000,
              opacity: 0,
            },
            {
              atMs: 2800,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'm6',
          x1: 260,
          y1: 120,
          x2: 290,
          y2: 168,
          stroke: 'muted',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2000,
              opacity: 0,
            },
            {
              atMs: 2900,
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
          id: 'k1',
          x: 30,
          y: 184,
          text: 'AB',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3000,
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
          id: 'k2',
          x: 90,
          y: 184,
          text: 'AC',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3100,
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
          id: 'k3',
          x: 130,
          y: 184,
          text: 'BA',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3200,
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
          id: 'k4',
          x: 190,
          y: 184,
          text: 'BC',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3300,
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
          id: 'k5',
          x: 230,
          y: 184,
          text: 'CA',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3400,
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
          id: 'k6',
          x: 290,
          y: 184,
          text: 'CB',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3500,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'cap-1',
          x1: 30,
          y1: 196,
          x2: 130,
          y2: 196,
          stroke: 'correct',
          strokeWidth: 3,
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
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'cap-2',
          x1: 90,
          y1: 204,
          x2: 230,
          y2: 204,
          stroke: 'correct',
          strokeWidth: 3,
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
              atMs: 5200,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'cap-3',
          x1: 190,
          y1: 212,
          x2: 290,
          y2: 212,
          stroke: 'correct',
          strokeWidth: 3,
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
              atMs: 5500,
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
          id: 'ket',
          x: 160,
          y: 232,
          text: 'A²₃ = 3·2 = 6  →  C²₃ = 6 : 2! = 3',
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
              atMs: 5800,
              opacity: 0,
            },
            {
              atMs: 6300,
              opacity: 1,
            },
            {
              atMs: 7500,
              opacity: 1,
            },
          ],
        },
      ],
      captions: [
        {
          atMs: 600,
          text: 'Tầng 1: ba cách chọn phần tử đứng trước.',
        },
        {
          atMs: 2400,
          text: 'Tầng 2: mỗi nhánh còn 2 phần tử để chọn.',
        },
        {
          atMs: 3500,
          text: '3 · 2 = 6 kết quả CÓ THỨ TỰ — đó là chỉnh hợp A²₃.',
        },
        {
          atMs: 4900,
          text: 'Nối các cặp cùng thành phần: AB với BA, AC với CA, BC với CB.',
        },
        {
          atMs: 6300,
          text: 'Mỗi tổ hợp bị đếm 2! = 2 lần, nên C²₃ = 6 : 2 = 3.',
        },
      ],
    },
    workedExample: {
      problem:
        'Lớp có 30 học sinh. Tính số cách: (a) chọn 3 bạn đi trực nhật; (b) chọn 3 bạn giữ ba chức vụ lớp trưởng, ' +
        'lớp phó, thủ quỹ.',
      steps: [
        'Bước 1 — Phân loại câu (a): ba bạn trực nhật có vai trò như nhau, đổi chỗ không tạo ra phương án mới. Vậy ' +
          'đây là TỔ HỢP chập 3 của 30.',
        'Bước 2 — Tính: C³₃₀ = 30!/(3!·27!) = (30·29·28)/(3·2·1) = 24360/6 = 4060 cách.',
        'Bước 3 — Phân loại câu (b): ba chức vụ khác nhau, cùng ba bạn nhưng hoán đổi chức vụ là phương án khác. Vậy ' +
          'đây là CHỈNH HỢP chập 3 của 30.',
        'Bước 4 — Tính: A³₃₀ = 30·29·28 = 24360 cách.',
        'Bước 5 — Đối chiếu để kiểm tra: 24360 / 4060 = 6 = 3!, đúng bằng số cách xếp thứ tự cho mỗi nhóm 3 người. ' +
          'Tỉ lệ này là cách tự kiểm rất nhanh xem đã dùng đúng công thức chưa.',
      ],
      answer: '(a) 4060 cách; (b) 24360 cách.',
    },
    checkQuestions: [
      {
        prompt:
          'Từ 8 vận động viên, cần chọn ra 3 người để trao huy chương vàng, bạc, đồng. Có bao nhiêu cách?',
        answer: { kind: 'numeric', value: 336 },
        explain:
          'Ba loại huy chương KHÁC nhau nên thứ tự có ý nghĩa: dùng chỉnh hợp A³₈ = 8·7·6 = 336. Lỗi phổ biến là ' +
          'dùng tổ hợp C³₈ = 56, tức bỏ quên rằng "A vàng, B bạc" khác hẳn "B vàng, A bạc". Câu hỏi tự kiểm: đổi chỗ ' +
          'hai người đã chọn có ra kết quả khác không? Ở đây là CÓ, nên phải dùng chỉnh hợp.',
      },
      {
        prompt: 'Một tổ có 6 nam và 4 nữ. Chọn ra 3 bạn sao cho có ĐÚNG 2 nam. Có bao nhiêu cách?',
        answer: { kind: 'numeric', value: 60 },
        explain:
          'Chia thành hai giai đoạn nối tiếp nên dùng quy tắc NHÂN: chọn 2 nam trong 6 có C²₆ = 15 cách, chọn 1 nữ ' +
          'trong 4 có C¹₄ = 4 cách; tổng cộng 15·4 = 60. Lỗi thường gặp là CỘNG 15 + 4 = 19 vì thấy chữ "và". Hãy ' +
          'nhớ tiêu chí: hai việc NỐI TIẾP nhau (phải làm cả hai) thì nhân, hai phương án THAY THẾ nhau (chỉ làm một) ' +
          'thì cộng.',
      },
      {
        prompt: 'Giá trị của C⁷₁₀ bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 120 },
        explain:
          'Dùng tính chất đối xứng C⁷₁₀ = C³₁₀ = (10·9·8)/(3·2·1) = 120 — cách này nhanh hơn nhiều so với khai triển ' +
          '10!/(7!·3!) bằng tay. Lý do đối xứng đúng: chọn 7 bạn để đi cũng chính là chọn 3 bạn để ở lại, hai việc ' +
          'tương ứng một-một nên số cách bằng nhau.',
      },
    ],
    srsCards: [
      {
        hoi: 'Phân biệt chỉnh hợp và tổ hợp bằng một câu hỏi duy nhất?',
        dap: '"Đổi chỗ hai phần tử đã chọn có ra phương án khác không?" Có → chỉnh hợp; không → tổ hợp.',
      },
      {
        hoi: 'Quan hệ giữa chỉnh hợp và tổ hợp?',
        dap: 'Aᵏₙ = Cᵏₙ · k! — mỗi nhóm k phần tử xếp được k! thứ tự.',
      },
      {
        hoi: 'Khi nào dùng quy tắc cộng, khi nào dùng quy tắc nhân?',
        dap: 'Phương án thay thế nhau (hoặc) → cộng; các bước nối tiếp nhau (và) → nhân.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan10-c8-b2',
    grade: '10',
    chapterNumber: 8,
    chapterTitle: 'Đại số tổ hợp',
    lessonNumber: 2,
    title: 'Nhị thức Newton',
    hook:
      'Khai triển (a + b)² thì ai cũng thuộc. (a + b)³ thì hơi mất công. Nhưng (a + b)²⁰ thì nhân tay cả buổi cũng ' +
      'chưa xong — trong khi hệ số của một số hạng bất kỳ trong đó viết ra được chỉ trong ba giây, nếu bạn biết vì ' +
      'sao các hệ số ấy chính là số cách chọn.',
    theory:
      'CÔNG THỨC NHỊ THỨC NEWTON\n' +
      '(a + b)ⁿ = Σ (k từ 0 đến n) Cᵏₙ · aⁿ⁻ᵏ · bᵏ\n' +
      '= C⁰ₙaⁿ + C¹ₙaⁿ⁻¹b + C²ₙaⁿ⁻²b² + ... + Cⁿₙbⁿ.\n\n' +
      'VÌ SAO HỆ SỐ LẠI LÀ SỐ TỔ HỢP\n' +
      'Khai triển (a+b)ⁿ nghĩa là nhân n cặp ngoặc (a+b) với nhau. Mỗi số hạng của kết quả sinh ra bằng cách từ MỖI ' +
      'ngoặc chọn lấy a hoặc b. Muốn ra số hạng aⁿ⁻ᵏbᵏ, ta phải chọn b từ đúng k trong n cặp ngoặc — số cách làm ' +
      'việc đó chính là Cᵏₙ. Đó là toàn bộ lý do, và cũng là lý do tam giác Pascal (mỗi số bằng tổng hai số phía ' +
      'trên) cho ra đúng các hệ số này.\n\n' +
      'BỐN ĐIỀU CẦN NHỚ VỀ CẤU TRÚC\n' +
      '1. Khai triển có đúng n + 1 số hạng (k chạy từ 0 đến n).\n' +
      '2. Số hạng TỔNG QUÁT thứ k+1 là T₍ₖ₊₁₎ = Cᵏₙ · aⁿ⁻ᵏ · bᵏ. Chú ý chỉ số lệch 1: số hạng thứ 5 ứng với k = 4.\n' +
      '3. Tổng số mũ của a và b trong mỗi số hạng luôn bằng n — dùng để kiểm tra nhanh.\n' +
      '4. Hệ số đối xứng: Cᵏₙ = Cⁿ⁻ᵏₙ.\n\n' +
      'HỆ QUẢ HAY DÙNG\n' +
      '— Cho a = b = 1: C⁰ₙ + C¹ₙ + ... + Cⁿₙ = 2ⁿ. Ý nghĩa: một tập n phần tử có 2ⁿ tập con.\n' +
      '— Cho a = 1, b = −1: tổng đan dấu các hệ số bằng 0 (với n ≥ 1).\n\n' +
      'DẠNG BÀI QUAN TRỌNG NHẤT: tìm hệ số của xᵐ trong khai triển. Cách làm là viết số hạng tổng quát, GOM số mũ ' +
      'của x lại thành một biểu thức theo k, cho bằng m rồi giải tìm k.\n' +
      'GIỚI HẠN: k tìm được phải là số NGUYÊN và thoả 0 ≤ k ≤ n. Nếu k không phải số nguyên (ví dụ 7/2) thì số hạng chứa xᵐ KHÔNG tồn ' +
      'tại, và đáp số đúng là "hệ số bằng 0" chứ không phải làm tròn k.',
    animation: {
      title: 'Tam giác Pascal mọc từng hàng, mỗi số là tổng hai số phía trên',
      description:
        'Tam giác Pascal được dựng từng hàng một, từ hàng 0 đến hàng 5. Mỗi hàng bắt đầu và kết thúc bằng số 1; mỗi số ở giữa bằng tổng đúng hai số nằm chéo phía trên nó. Khi tới hàng 5, hai mũi tên chỉ rõ phép cộng 4 cộng 6 bằng 10 lấy từ hàng 4 xuống. Hàng 4 gồm 1, 4, 6, 4, 1 được tô sáng và viết lại thành khai triển (a + b) mũ 4 bằng a mũ 4 cộng 4a mũ 3 b cộng 6a bình b bình cộng 4ab mũ 3 cộng b mũ 4. Hình động cho thấy điều bảng số tĩnh không nói được: hệ số nhị thức không phải dãy số học thuộc, chúng SINH RA nhau bằng đúng một phép cộng, và vị trí của từng hệ số trong khai triển khớp với vị trí của nó trên hàng.',
      viewBoxWidth: 340,
      viewBoxHeight: 250,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'label',
          id: 'r0c0',
          x: 170,
          y: 30,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'r1c0',
          x: 153,
          y: 60,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 700,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r1c1',
          x: 187,
          y: 60,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 700,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r2c0',
          x: 136,
          y: 90,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1400,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r2c1',
          x: 170,
          y: 90,
          text: '2',
          size: 16,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1400,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r2c2',
          x: 204,
          y: 90,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1400,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r3c0',
          x: 119,
          y: 120,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2100,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r3c1',
          x: 153,
          y: 120,
          text: '3',
          size: 16,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2100,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r3c2',
          x: 187,
          y: 120,
          text: '3',
          size: 16,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2100,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r3c3',
          x: 221,
          y: 120,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2100,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'rect',
          id: 'to-hang4',
          x: 88,
          y: 134,
          w: 164,
          h: 24,
          rx: 6,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 5600,
              opacity: 0,
            },
            {
              atMs: 6100,
              opacity: 0.3,
            },
            {
              atMs: 8000,
              opacity: 0.3,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r4c0',
          x: 102,
          y: 150,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2800,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r4c1',
          x: 136,
          y: 150,
          text: '4',
          size: 16,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2800,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r4c2',
          x: 170,
          y: 150,
          text: '6',
          size: 16,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2800,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r4c3',
          x: 204,
          y: 150,
          text: '4',
          size: 16,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2800,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r4c4',
          x: 238,
          y: 150,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2800,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'cong-1',
          x1: 136,
          y1: 156,
          x2: 149,
          y2: 176,
          stroke: 'correct',
          strokeWidth: 2,
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
              atMs: 3900,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'cong-2',
          x1: 170,
          y1: 156,
          x2: 157,
          y2: 176,
          stroke: 'correct',
          strokeWidth: 2,
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
              atMs: 3900,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r5c0',
          x: 85,
          y: 180,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4400,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r5c1',
          x: 119,
          y: 180,
          text: '5',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4400,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r5c2',
          x: 153,
          y: 180,
          text: '10',
          size: 16,
          anchor: 'middle',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4400,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r5c3',
          x: 187,
          y: 180,
          text: '10',
          size: 16,
          anchor: 'middle',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4400,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r5c4',
          x: 221,
          y: 180,
          text: '5',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4400,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r5c5',
          x: 255,
          y: 180,
          text: '1',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4400,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'khai-trien',
          x: 170,
          y: 216,
          text: '(a + b)⁴ = a⁴ + 4a³b + 6a²b² + 4ab³ + b⁴',
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
              atMs: 6100,
              opacity: 0,
            },
            {
              atMs: 6600,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'chu-thich',
          x: 170,
          y: 240,
          text: 'hàng n của tam giác = hệ số của (a + b)ⁿ',
          size: 12,
          anchor: 'middle',
          fill: 'muted',
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Hàng 0 chỉ có số 1.',
        },
        {
          atMs: 1400,
          text: 'Số ở giữa mỗi hàng là tổng hai số chéo phía trên: 1 + 1 = 2.',
        },
        {
          atMs: 3900,
          text: 'Xuống hàng 5, số 10 sinh ra từ 4 + 6 của hàng 4.',
        },
        {
          atMs: 6100,
          text: 'Hàng 4 là 1, 4, 6, 4, 1.',
        },
        {
          atMs: 6600,
          text: 'Đó đúng là bộ hệ số của (a + b)⁴, theo thứ tự số mũ của a giảm dần.',
        },
      ],
    },
    workedExample: {
      problem: 'Tìm hệ số của x⁵ trong khai triển (2x + 3)⁸.',
      steps: [
        'Bước 1 — Viết số hạng tổng quát, đặt a = 2x và b = 3, n = 8: T₍ₖ₊₁₎ = Cᵏ₈ · (2x)⁸⁻ᵏ · 3ᵏ.',
        'Bước 2 — Tách phần chứa x ra để nhìn rõ số mũ: T₍ₖ₊₁₎ = Cᵏ₈ · 2⁸⁻ᵏ · 3ᵏ · x⁸⁻ᵏ. Bước tách này là mấu chốt — ' +
          'nhiều bạn quên nâng luỹ thừa cho hệ số 2 và chỉ lấy mỗi số tổ hợp.',
        'Bước 3 — Cho số mũ của x bằng 5: 8 − k = 5 ⇔ k = 3. Giá trị k = 3 là số nguyên và nằm trong [0; 8] nên số ' +
          'hạng này tồn tại.',
        'Bước 4 — Thay k = 3 vào: hệ số = C³₈ · 2⁵ · 3³ = 56 · 32 · 27.',
        'Bước 5 — Tính ra số: 56 · 32 = 1792; 1792 · 27 = 48384.',
      ],
      answer: 'Hệ số của x⁵ là 48384.',
    },
    checkQuestions: [
      {
        prompt: 'Khai triển (x + 2)¹⁰ có tất cả bao nhiêu số hạng?',
        answer: { kind: 'numeric', value: 11 },
        explain:
          'Khai triển (a+b)ⁿ có n + 1 số hạng vì k chạy từ 0 đến n, nên ở đây là 11. Lỗi phổ biến là trả lời 10 do ' +
          'quên số hạng ứng với k = 0. Kiểm tra bằng ví dụ nhỏ: (a+b)² = a² + 2ab + b² có 3 số hạng, đúng bằng 2 + 1.',
      },
      {
        prompt: 'Tính tổng C⁰₆ + C¹₆ + C²₆ + C³₆ + C⁴₆ + C⁵₆ + C⁶₆.',
        answer: { kind: 'numeric', value: 64 },
        explain:
          'Thay a = b = 1 vào nhị thức Newton được (1+1)⁶ = 2⁶ = 64. Không cần cộng tay từng số. Ý nghĩa tổ hợp: tập ' +
          '6 phần tử có đúng 64 tập con, vì mỗi phần tử có 2 lựa chọn "lấy hoặc không lấy".',
      },
      {
        prompt: 'Trong khai triển (x² + 1/x)⁹, hệ số của số hạng chứa x⁴ bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Đây là câu bẫy cố ý. Số hạng tổng quát: Cᵏ₉ · (x²)⁹⁻ᵏ · x⁻ᵏ = Cᵏ₉ · x¹⁸⁻³ᵏ. Cho 18 − 3k = 4 được k = 14/3, ' +
          'KHÔNG phải số nguyên. Vậy khai triển này không hề có số hạng chứa x⁴ và hệ số cần tìm bằng 0. Rất nhiều ' +
          'bạn làm tròn k về 4 hoặc 5 rồi tính ra một con số — sai bản chất. Luôn kiểm k có nguyên và thuộc [0; n] ' +
          'hay không trước khi thay vào.',
      },
    ],
    srsCards: [
      {
        hoi: 'Số hạng tổng quát của khai triển (a+b)ⁿ?',
        dap: 'T₍ₖ₊₁₎ = Cᵏₙ · aⁿ⁻ᵏ · bᵏ; số hạng thứ k+1 ứng với chỉ số k.',
      },
      {
        hoi: 'Vì sao hệ số khai triển lại là số tổ hợp?',
        dap: 'Vì để có aⁿ⁻ᵏbᵏ phải chọn b từ đúng k trong n cặp ngoặc, số cách là Cᵏₙ.',
      },
      {
        hoi: 'Tổng tất cả các hệ số Cᵏₙ với k từ 0 đến n bằng bao nhiêu?',
        dap: '2ⁿ — thay a = b = 1 vào nhị thức Newton.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
