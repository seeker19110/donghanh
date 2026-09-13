// lessons/toan10c2.ts — Toán 10, Chương 2: Bất phương trình và hệ bất phương trình bậc nhất hai ẩn.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN10_C2_LESSONS: MathLesson[] = [
  {
    id: 'toan10-c2-b1',
    grade: '10',
    chapterNumber: 2,
    chapterTitle: 'Bất phương trình và hệ bất phương trình bậc nhất hai ẩn',
    lessonNumber: 1,
    title: 'Miền nghiệm của bất phương trình bậc nhất hai ẩn',
    hook:
      'Một quán bún bò ở Huế mỗi sáng chỉ có 6 giờ để nấu. Một nồi bún nhỏ tốn 2 giờ, một nồi lớn tốn 3 giờ. Chủ ' +
      'quán muốn biết tất cả các cách phân chia số nồi nhỏ và nồi lớn sao cho vẫn kịp giờ mở cửa. Câu hỏi ấy không ' +
      'có MỘT đáp số — nó có cả một MIỀN đáp số, và ta vẽ được miền ấy ra giấy.',
    theory:
      'DẠNG TỔNG QUÁT\n' +
      'Bất phương trình bậc nhất hai ẩn có dạng ax + by + c < 0 (hoặc ≤, >, ≥) với a, b không đồng thời bằng 0. ' +
      'Mỗi cặp số (x₀; y₀) làm bất phương trình đúng gọi là một nghiệm; tập tất cả nghiệm gọi là MIỀN NGHIỆM.\n\n' +
      'VÌ SAO MIỀN NGHIỆM LUÔN LÀ MỘT NỬA MẶT PHẲNG\n' +
      'Đường thẳng d: ax + by + c = 0 chia mặt phẳng thành hai nửa. Xét biểu thức f(x; y) = ax + by + c. Khi điểm ' +
      'chạy liên tục từ nửa này sang nửa kia, f phải đi qua giá trị 0, tức là phải cắt d. Vậy trong mỗi nửa mặt ' +
      'phẳng (không kể d) dấu của f KHÔNG ĐỔI. Đó là lý do chỉ cần thử MỘT điểm đại diện là biết cả nửa mặt phẳng ' +
      'đó có thuộc miền nghiệm hay không.\n\n' +
      'QUY TRÌNH BA BƯỚC\n' +
      '1. Vẽ đường thẳng d: ax + by + c = 0 (nét liền nếu bất phương trình có dấu bằng, nét đứt nếu không — vì khi ' +
      'không có dấu bằng thì các điểm trên d KHÔNG phải nghiệm).\n' +
      '2. Chọn một điểm thử không nằm trên d. Gốc O(0; 0) là lựa chọn tốt nhất vì thay số cực nhanh; chỉ khi d đi ' +
      'qua gốc mới phải chọn điểm khác, ví dụ (1; 0).\n' +
      '3. Thay toạ độ điểm thử vào bất phương trình. Nếu đúng thì nửa mặt phẳng CHỨA điểm thử là miền nghiệm; nếu ' +
      'sai thì nửa còn lại là miền nghiệm.\n\n' +
      'HỆ BẤT PHƯƠNG TRÌNH\n' +
      'Miền nghiệm của hệ là GIAO của các miền nghiệm thành phần — vì một điểm phải thoả đồng thời mọi bất phương ' +
      'trình. Trong bài toán thực tế thường có thêm ràng buộc x ≥ 0, y ≥ 0 (số nồi bún không thể âm), nên miền ' +
      'nghiệm nằm gọn trong góc phần tư thứ nhất và thường là một đa giác.\n\n' +
      'ỨNG DỤNG — BÀI TOÁN TỐI ƯU\n' +
      'Khi miền nghiệm là một MIỀN ĐA GIÁC LỒI, giá trị lớn nhất và nhỏ nhất của biểu thức F = mx + ny đạt được tại ' +
      'một ĐỈNH của đa giác. Lý do: đường mức F = const là một họ đường thẳng song song; trượt đường thẳng ấy qua ' +
      'miền, vị trí cực trị luôn chạm miền ở một đỉnh (hoặc cả một cạnh, khi đường mức song song cạnh đó). Nhờ vậy ' +
      'chỉ cần tính F tại vài đỉnh thay vì thử vô hạn điểm.\n\n' +
      'GIỚI HẠN: kết luận "cực trị tại đỉnh" chỉ đúng khi miền nghiệm ĐÓNG và BỊ CHẶN. Miền không bị chặn có thể ' +
      'không có giá trị lớn nhất.',
    animation: {
      title: 'Thử điểm gốc toạ độ để xác định nửa mặt phẳng nghiệm',
      description:
        'Đường thẳng 2x + 3y = 6 được vẽ trên hệ trục. Một chấm tròn đại diện cho điểm thử O(0; 0) nhấp nháy, ' +
        'sau đó nửa mặt phẳng chứa gốc toạ độ được tô sáng lên để cho thấy đó chính là miền nghiệm của bất phương ' +
        'trình 2x + 3y ≤ 6 cùng với hai ràng buộc x ≥ 0 và y ≥ 0.',
      viewBoxWidth: 320,
      viewBoxHeight: 260,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'ox',
          x1: 40,
          y1: 210,
          x2: 300,
          y2: 210,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'oy',
          x1: 40,
          y1: 210,
          x2: 40,
          y2: 20,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'polyline',
          id: 'mienNghiem',
          points: [
            [40, 210],
            [220, 210],
            [40, 90],
          ],
          closed: true,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3200, opacity: 0 },
            { atMs: 4200, opacity: 0.35 },
            { atMs: 6000, opacity: 0.35 },
          ],
        },
        {
          kind: 'line',
          id: 'duongD',
          x1: 220,
          y1: 210,
          x2: 40,
          y2: 90,
          stroke: 'accent',
          strokeWidth: 3,
        },
        {
          kind: 'circle',
          id: 'diemThu',
          cx: 40,
          cy: 210,
          r: 7,
          fill: 'warn',
          keyframes: [
            { atMs: 0, opacity: 0.2 },
            { atMs: 800, opacity: 1 },
            { atMs: 1600, opacity: 0.2 },
            { atMs: 2400, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'label',
          id: 'nhanO',
          x: 28,
          y: 228,
          text: 'O(0;0)',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanD',
          x: 232,
          y: 120,
          text: '2x + 3y = 6',
          size: 13,
          anchor: 'start',
          fill: 'accent',
        },
        {
          kind: 'label',
          id: 'ketLuan',
          x: 110,
          y: 178,
          text: '0 ≤ 6 → nhận nửa này',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 4200, opacity: 0 },
            { atMs: 4800, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
      ],
      captions: [
        { atMs: 0, text: 'Vẽ đường thẳng biên 2x + 3y = 6.' },
        { atMs: 1600, text: 'Chọn điểm thử O(0; 0) vì thay số nhanh nhất.' },
        { atMs: 3200, text: 'Thay vào: 2·0 + 3·0 = 0 ≤ 6 — đúng.' },
        { atMs: 4200, text: 'Vậy nửa mặt phẳng chứa O là miền nghiệm.' },
      ],
    },
    workedExample: {
      problem:
        'Quán bún có 6 giờ nấu mỗi sáng. Mỗi nồi nhỏ tốn 2 giờ và lãi 300 nghìn đồng; mỗi nồi lớn tốn 3 giờ và lãi ' +
        '400 nghìn đồng. Gọi x, y lần lượt là số nồi nhỏ và nồi lớn. Hãy lập hệ ràng buộc và tìm cách nấu cho lãi ' +
        'cao nhất (x, y là số nguyên không âm).',
      steps: [
        'Bước 1 — Chuyển lời văn thành ràng buộc: tổng thời gian nấu không vượt quá 6 giờ, cho 2x + 3y ≤ 6. Số nồi ' +
          'không âm nên thêm x ≥ 0, y ≥ 0. Đây là hệ bất phương trình bậc nhất hai ẩn.',
        'Bước 2 — Viết hàm mục tiêu: tiền lãi F(x; y) = 300x + 400y (nghìn đồng). Ta cần giá trị lớn nhất của F trên ' +
          'miền nghiệm.',
        'Bước 3 — Xác định miền nghiệm: đó là tam giác với ba đỉnh O(0; 0), A(3; 0) và B(0; 2). Chọn cách vẽ này vì ' +
          'miền bị chặn nên chắc chắn tồn tại giá trị lớn nhất, và cực trị đạt tại đỉnh.',
        'Bước 4 — Tính F tại từng đỉnh: F(O) = 0; F(A) = 300·3 = 900; F(B) = 400·2 = 800. Lớn nhất là 900 tại A(3; 0).',
        'Bước 5 — Kiểm tra điều kiện nguyên: x = 3, y = 0 đều là số nguyên không âm nên phương án này thực hiện được. ' +
          '(Nếu đỉnh tối ưu có toạ độ lẻ thì phải dò thêm các điểm nguyên lân cận trong miền.)',
      ],
      answer: 'Nấu 3 nồi nhỏ, 0 nồi lớn; lãi lớn nhất 900 nghìn đồng.',
    },
    checkQuestions: [
      {
        prompt: 'Cặp số nào sau đây KHÔNG phải nghiệm của bất phương trình 2x − y > 3?',
        choices: [
          { id: 'a', label: '(3; 1)' },
          { id: 'b', label: '(2; 1)' },
          { id: 'c', label: '(0; −4)' },
          { id: 'd', label: '(5; 0)' },
        ],
        answer: { kind: 'choice', correctIds: ['b'] },
        explain:
          'Thay lần lượt: (3;1) cho 5 > 3 đúng; (2;1) cho 2·2 − 1 = 3, mà 3 > 3 là SAI vì bất phương trình không có ' +
          'dấu bằng; (0;−4) cho 4 > 3 đúng; (5;0) cho 10 > 3 đúng. Bẫy nằm ở chỗ nhiều bạn thấy đẳng thức xảy ra ' +
          'liền coi là "thoả". Dấu > nghiêm ngặt loại bỏ chính các điểm nằm TRÊN đường biên — đó cũng là lý do đường ' +
          'biên phải vẽ nét đứt.',
      },
      {
        prompt:
          'Miền nghiệm của hệ x ≥ 0, y ≥ 0, x + y ≤ 4 là một tam giác. Giá trị lớn nhất của F = 2x + 5y trên miền ' +
          'đó bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 20 },
        explain:
          'Ba đỉnh của miền là (0;0), (4;0), (0;4). Tính F tại từng đỉnh: 0; 8; 20. Vậy giá trị lớn nhất là 20 tại ' +
          '(0; 4). Lỗi hay gặp là cứ chọn đỉnh có x lớn nhất vì tưởng "đi xa gốc thì F lớn"; thực ra F phụ thuộc hệ ' +
          'số, ở đây hệ số của y lớn hơn nên ưu tiên dồn vào y. Luôn TÍNH F tại mọi đỉnh thay vì đoán.',
      },
      {
        prompt:
          'Khi vẽ miền nghiệm của bất phương trình 3x + y < 6, đường thẳng 3x + y = 6 phải được vẽ bằng nét liền hay ' +
          'nét đứt? Nhập 1 nếu nét liền, nhập 2 nếu nét đứt.',
        answer: { kind: 'numeric', value: 2 },
        explain:
          'Bất phương trình dùng dấu < nghiêm ngặt nên các điểm nằm ngay trên đường thẳng không thoả mãn, do đó phải ' +
          'vẽ nét ĐỨT để thể hiện biên bị loại. Nét liền chỉ dùng cho dấu ≤ hoặc ≥. Đây là chi tiết nhỏ nhưng bị trừ ' +
          'điểm trình bày rất thường xuyên.',
      },
    ],
    srsCards: [
      {
        hoi: 'Vì sao chỉ cần thử MỘT điểm là biết được cả nửa mặt phẳng có phải miền nghiệm không?',
        dap: 'Vì biểu thức ax + by + c giữ nguyên dấu trên toàn bộ mỗi nửa mặt phẳng do đường thẳng chia ra.',
      },
      {
        hoi: 'Giá trị lớn nhất/nhỏ nhất của F = mx + ny trên miền đa giác lồi bị chặn đạt ở đâu?',
        dap: 'Tại một đỉnh của đa giác — nên chỉ cần tính F tại các đỉnh.',
      },
      {
        hoi: 'Khi nào vẽ đường biên bằng nét đứt?',
        dap: 'Khi bất phương trình dùng dấu < hoặc > (không có dấu bằng), tức biên bị loại khỏi miền nghiệm.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
