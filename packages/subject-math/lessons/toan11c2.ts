// lessons/toan11c2.ts — Toán 11, Chương 2: Dãy số, cấp số cộng và cấp số nhân.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN11_C2_LESSONS: MathLesson[] = [
  {
    id: 'toan11-c2-b1',
    grade: '11',
    chapterNumber: 2,
    chapterTitle: 'Dãy số. Cấp số cộng và cấp số nhân',
    lessonNumber: 1,
    title: 'Cấp số cộng và cấp số nhân',
    hook:
      'Hai người bạn cùng gửi tiết kiệm 10 triệu đồng. Người thứ nhất mỗi năm được cộng thêm 1 triệu tiền lãi cố ' +
      'định. Người thứ hai gửi lãi kép 8% một năm, năm đầu chỉ được 800 nghìn — ít hơn hẳn. Sau 30 năm, ai nhiều ' +
      'tiền hơn? Đáp số chênh nhau tới hàng chục triệu, và lý do nằm ở sự khác biệt giữa CỘNG và NHÂN.',
    theory:
      'CẤP SỐ CỘNG (arithmetic progression)\n' +
      'Dãy (uₙ) là cấp số cộng khi mỗi số hạng bằng số hạng trước CỘNG thêm một hằng số d gọi là công sai: ' +
      'u₍ₙ₊₁₎ = uₙ + d.\n' +
      '— Số hạng tổng quát: uₙ = u₁ + (n − 1)d. Chú ý hệ số là (n − 1) chứ không phải n, vì từ u₁ đến uₙ ta chỉ cộng ' +
      'd đúng n − 1 lần.\n' +
      '— Tổng n số hạng đầu: Sₙ = n(u₁ + uₙ)/2 = n[2u₁ + (n−1)d]/2.\n' +
      'VÌ SAO CÓ CÔNG THỨC TỔNG ẤY: viết tổng hai lần, một lần xuôi một lần ngược rồi cộng lại theo cột. Mỗi cột đều ' +
      'cho u₁ + uₙ, có n cột, nên 2Sₙ = n(u₁ + uₙ). Đây chính là mẹo mà Gauss dùng khi còn bé để cộng 1 đến 100.\n' +
      '— Tính chất ba số liên tiếp: 2uₖ = u₍ₖ₋₁₎ + u₍ₖ₊₁₎ (mỗi số là trung bình CỘNG của hai số kề).\n\n' +
      'CẤP SỐ NHÂN (geometric progression)\n' +
      'Mỗi số hạng bằng số hạng trước NHÂN với hằng số q gọi là công bội: u₍ₙ₊₁₎ = uₙ · q, với u₁ ≠ 0 và q ≠ 0.\n' +
      '— Số hạng tổng quát: uₙ = u₁ · qⁿ⁻¹.\n' +
      '— Tổng n số hạng đầu: Sₙ = u₁(1 − qⁿ)/(1 − q) khi q ≠ 1; khi q = 1 thì Sₙ = n·u₁.\n' +
      'ĐIỀU KIỆN q ≠ 1 LÀ BẮT BUỘC — dùng công thức phân số khi q = 1 sẽ chia cho 0. Đây là chỗ mất điểm thường gặp ' +
      'trong bài có tham số.\n' +
      '— Tính chất ba số liên tiếp: uₖ² = u₍ₖ₋₁₎ · u₍ₖ₊₁₎.\n\n' +
      'SỰ KHÁC BIỆT CỐT LÕI GIỮA HAI LOẠI\n' +
      'Cấp số cộng tăng TUYẾN TÍNH (đồ thị là các điểm nằm trên một đường thẳng), cấp số nhân với q > 1 tăng theo ' +
      'HÀM MŨ (càng về sau càng dốc đứng). Trong ngắn hạn cấp số cộng có thể vượt lên, nhưng về dài hạn cấp số nhân ' +
      'luôn bỏ xa — đó là lý do lãi kép được gọi là "kỳ quan thứ tám".\n\n' +
      'CÁCH NHẬN BIẾT MỘT DÃY LÀ CẤP SỐ CỘNG HAY NHÂN\n' +
      'Xét hiệu u₍ₙ₊₁₎ − uₙ: nếu ra một HẰNG SỐ (không phụ thuộc n) thì là cấp số cộng. Xét thương u₍ₙ₊₁₎/uₙ: nếu ra ' +
      'hằng số thì là cấp số nhân. Phải chứng minh cho MỌI n, không được chỉ thử vài số hạng đầu rồi kết luận.',
    animation: {
      title: 'Cấp số cộng và cấp số nhân sau 30 chu kỳ',
      description:
        'Hai dãy điểm được vẽ trên cùng hệ trục. Dãy cấp số cộng nằm trên một đường thẳng, tăng đều mỗi bước một ' +
        'lượng như nhau. Dãy cấp số nhân ban đầu thấp hơn nhưng đường cong của nó mỗi lúc một dốc, cắt qua đường ' +
        'thẳng rồi vọt lên rất cao. Hình minh hoạ vì sao lãi kép thua trong ngắn hạn nhưng thắng áp đảo về dài hạn.',
      viewBoxWidth: 380,
      viewBoxHeight: 240,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'ox',
          x1: 40,
          y1: 200,
          x2: 360,
          y2: 200,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'oy',
          x1: 40,
          y1: 200,
          x2: 40,
          y2: 20,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'polyline',
          id: 'capSoCong',
          points: [
            [40, 186],
            [100, 164],
            [160, 142],
            [220, 120],
            [280, 98],
            [340, 76],
          ],
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'polyline',
          id: 'capSoNhan',
          points: [
            [40, 190],
            [100, 182],
            [160, 166],
            [220, 136],
            [280, 84],
            [340, 26],
          ],
          stroke: 'accent',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1500, opacity: 0 },
            { atMs: 2600, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'circle',
          id: 'diemCat',
          cx: 252,
          cy: 108,
          r: 6,
          fill: 'warn',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3600, opacity: 0 },
            { atMs: 4400, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'label',
          id: 'nhanCong',
          x: 346,
          y: 72,
          text: 'cấp số cộng',
          size: 13,
          anchor: 'end',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'nhanNhan',
          x: 346,
          y: 22,
          text: 'cấp số nhân',
          size: 13,
          anchor: 'end',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 2600, opacity: 0 },
            { atMs: 3200, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'label',
          id: 'nhanN',
          x: 200,
          y: 224,
          text: 'số năm gửi',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
      ],
      captions: [
        { atMs: 0, text: 'Cấp số cộng: mỗi năm cộng thêm đúng một lượng, đồ thị là đường thẳng.' },
        { atMs: 2600, text: 'Cấp số nhân khởi đầu thấp hơn vì lãi năm đầu ít hơn.' },
        { atMs: 4400, text: 'Đến một lúc hai đường cắt nhau — từ đây lãi kép vượt lên.' },
        { atMs: 5200, text: 'Càng về sau khoảng cách càng giãn rộng rất nhanh.' },
      ],
    },
    workedExample: {
      problem:
        'Một cấp số cộng có u₃ = 7 và u₇ = 19. Tìm số hạng đầu u₁, công sai d và tổng 10 số hạng đầu tiên S₁₀.',
      steps: [
        'Bước 1 — Viết hai số hạng theo u₁ và d (chọn cách này vì mọi số hạng đều biểu diễn được qua hai đại lượng ' +
          'ấy): u₃ = u₁ + 2d = 7 và u₇ = u₁ + 6d = 19.',
        'Bước 2 — Trừ hai phương trình để khử u₁: (u₁ + 6d) − (u₁ + 2d) = 19 − 7 ⇔ 4d = 12 ⇔ d = 3. Nhận xét: từ u₃ ' +
          'đến u₇ cách nhau 4 bước nên chênh lệch là 4d, đây là mẹo tính nhanh không cần lập hệ.',
        'Bước 3 — Thay d = 3 vào phương trình đầu: u₁ + 6 = 7 ⇔ u₁ = 1.',
        'Bước 4 — Tính S₁₀ bằng công thức tổng: S₁₀ = 10·[2·1 + 9·3]/2 = 5·(2 + 27) = 5·29 = 145.',
        'Bước 5 — Kiểm tra độc lập: u₁₀ = 1 + 9·3 = 28, và S₁₀ = 10(u₁ + u₁₀)/2 = 10·29/2 = 145. Hai công thức cho ' +
          'cùng kết quả nên đáng tin.',
      ],
      answer: 'u₁ = 1, d = 3, S₁₀ = 145.',
    },
    checkQuestions: [
      {
        prompt: 'Cấp số cộng có u₁ = 5 và công sai d = 4. Số hạng u₁₀ bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 41 },
        explain:
          'u₁₀ = u₁ + (10 − 1)d = 5 + 9·4 = 41. Lỗi rất phổ biến là nhân với 10 thay vì 9, ra 45. Hãy hiểu vì sao là ' +
          '9: để đi từ số hạng thứ nhất tới số hạng thứ mười, ta bước 9 bước chứ không phải 10 bước — giống như từ ' +
          'cột điện số 1 tới cột số 10 chỉ có 9 khoảng cách.',
      },
      {
        prompt: 'Cấp số nhân có u₁ = 3 và công bội q = 2. Tổng 5 số hạng đầu S₅ bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 93 },
        explain:
          'S₅ = u₁(1 − q⁵)/(1 − q) = 3(1 − 32)/(1 − 2) = 3·(−31)/(−1) = 93. Kiểm bằng cách cộng tay: ' +
          '3 + 6 + 12 + 24 + 48 = 93, khớp. Lỗi hay gặp là dùng q⁴ thay vì q⁵ do nhầm với công thức số hạng tổng ' +
          'quát (ở đó mới là qⁿ⁻¹).',
      },
      {
        prompt: 'Dãy số uₙ = 2ⁿ + 3 có phải cấp số cộng không? Nhập 1 nếu CÓ, nhập 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Đây là bẫy về sự "trông giống". Nhiều bạn thấy dãy 5; 7; 11; 19; ... rồi thấy các hiệu 2; 4; 8 đều là luỹ ' +
          'thừa của 2 và tưởng có quy luật đều. Nhưng để là cấp số cộng, HIỆU phải là một HẰNG SỐ: ' +
          'u₍ₙ₊₁₎ − uₙ = 2ⁿ⁺¹ − 2ⁿ = 2ⁿ, phụ thuộc n nên không phải hằng số. Dãy này cũng không phải cấp số nhân vì ' +
          'thương u₂/u₁ = 7/5 khác u₃/u₂ = 11/7. Bài học: luôn kiểm tra với n TỔNG QUÁT, không chỉ vài số hạng đầu.',
      },
    ],
    srsCards: [
      {
        hoi: 'Số hạng tổng quát của cấp số cộng và cấp số nhân?',
        dap: 'uₙ = u₁ + (n−1)d và uₙ = u₁·qⁿ⁻¹ — số mũ/hệ số đều là n−1, không phải n.',
      },
      {
        hoi: 'Công thức tổng n số hạng đầu của cấp số nhân và điều kiện của nó?',
        dap: 'Sₙ = u₁(1 − qⁿ)/(1 − q), chỉ dùng được khi q ≠ 1; nếu q = 1 thì Sₙ = n·u₁.',
      },
      {
        hoi: 'Cách chứng minh một dãy là cấp số cộng?',
        dap: 'Tính u₍ₙ₊₁₎ − uₙ với n tổng quát và chỉ ra kết quả là hằng số, không phụ thuộc n.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
