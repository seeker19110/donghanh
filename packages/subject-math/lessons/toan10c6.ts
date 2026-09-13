// lessons/toan10c6.ts — Toán 10, Chương 6: Hàm số bậc hai và dấu của tam thức bậc hai.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN10_C6_LESSONS: MathLesson[] = [
  {
    id: 'toan10-c6-b1',
    grade: '10',
    chapterNumber: 6,
    chapterTitle: 'Hàm số, đồ thị và ứng dụng',
    lessonNumber: 1,
    title: 'Hàm số bậc hai và đồ thị parabol',
    hook:
      'Cầu Trường Tiền ở Huế, vòi nước phun ở hồ Gươm, đường bay của quả bóng trong một cú sút phạt — ba hình ảnh ' +
      'chẳng liên quan gì nhau nhưng đều có chung một dáng cong. Dáng cong ấy không phải ngẫu nhiên: nó là đồ thị ' +
      'của cùng một loại hàm số, và biết được đỉnh của nó nằm ở đâu là biết bóng lên cao nhất bao nhiêu mét.',
    theory:
      'DẠNG VÀ ĐIỀU KIỆN\n' +
      'Hàm số bậc hai có dạng y = ax² + bx + c với ĐIỀU KIỆN BẮT BUỘC a ≠ 0. Nếu a = 0 thì hàm rơi xuống bậc nhất và ' +
      'đồ thị là đường thẳng, không còn là parabol nữa. Bài toán có tham số luôn phải xét riêng trường hợp a = 0 — ' +
      'đây là chỗ mất điểm phổ biến nhất.\n\n' +
      'ĐỈNH PARABOL — TỪ ĐÂU RA CÔNG THỨC\n' +
      'Biến đổi về dạng chính tắc bằng cách hoàn thành bình phương:\n' +
      'y = a(x + b/(2a))² − (b² − 4ac)/(4a) = a(x − x₀)² + y₀ với x₀ = −b/(2a), y₀ = −Δ/(4a), Δ = b² − 4ac.\n' +
      'Vì (x − x₀)² ≥ 0 và dấu bằng chỉ xảy ra khi x = x₀, giá trị y₀ chính là giá trị NHỎ NHẤT khi a > 0 (parabol ' +
      'quay bề lõm lên trên) và LỚN NHẤT khi a < 0 (bề lõm quay xuống). Đó là toàn bộ lý do vì sao đỉnh lại là điểm ' +
      'cực trị — không cần học thuộc, chỉ cần nhớ cách hoàn thành bình phương.\n\n' +
      'CÁC YẾU TỐ CỦA ĐỒ THỊ\n' +
      '— Trục đối xứng: đường thẳng x = −b/(2a).\n' +
      '— Giao với trục tung: điểm (0; c).\n' +
      '— Giao với trục hoành: nghiệm của ax² + bx + c = 0, có 2 điểm khi Δ > 0, 1 điểm khi Δ = 0, không có khi Δ < 0.\n' +
      '— Bảng biến thiên: với a > 0 hàm nghịch biến trên (−∞; x₀) rồi đồng biến trên (x₀; +∞); với a < 0 thì ngược lại.\n\n' +
      'GIÁ TRỊ LỚN NHẤT – NHỎ NHẤT TRÊN MỘT ĐOẠN\n' +
      'ĐÂY LÀ GIỚI HẠN QUAN TRỌNG: công thức y₀ = −Δ/(4a) chỉ cho cực trị trên TOÀN TRỤC SỐ. Khi bài hỏi giá trị lớn ' +
      'nhất/nhỏ nhất trên đoạn [m; n], phải kiểm xem đỉnh x₀ có nằm trong đoạn đó không. Nếu đỉnh nằm ngoài đoạn thì ' +
      'hàm đơn điệu trên cả đoạn, và cực trị rơi vào HAI ĐẦU MÚT chứ không phải tại đỉnh.',
    animation: {
      title: 'Parabol đổi dáng khi hệ số a thay đổi',
      description:
        'Ba parabol cùng đỉnh được vẽ chồng lên nhau và lần lượt hiện ra: đường mảnh ứng với a nhỏ nên parabol mở ' +
        'rộng, đường dày ứng với a lớn nên parabol hẹp lại, và đường cuối cùng có a âm nên bề lõm quay xuống dưới. ' +
        'Hình cho thấy dấu của a quyết định hướng bề lõm, còn độ lớn của a quyết định parabol hẹp hay rộng.',
      viewBoxWidth: 360,
      viewBoxHeight: 260,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'truc_ox',
          x1: 20,
          y1: 130,
          x2: 340,
          y2: 130,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'truc_oy',
          x1: 180,
          y1: 20,
          x2: 180,
          y2: 245,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'polyline',
          id: 'pa_rong',
          points: [
            [60, 58],
            [90, 85],
            [120, 106],
            [150, 123],
            [180, 130],
            [210, 123],
            [240, 106],
            [270, 85],
            [300, 58],
          ],
          stroke: 'primary',
          strokeWidth: 3,
          keyframes: [
            { atMs: 0, opacity: 1 },
            { atMs: 8000, opacity: 1 },
          ],
        },
        {
          kind: 'polyline',
          id: 'pa_hep',
          points: [
            [120, 26],
            [135, 60],
            [150, 88],
            [165, 116],
            [180, 130],
            [195, 116],
            [210, 88],
            [225, 60],
            [240, 26],
          ],
          stroke: 'accent',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 2400, opacity: 0 },
            { atMs: 3200, opacity: 1 },
            { atMs: 8000, opacity: 1 },
          ],
        },
        {
          kind: 'polyline',
          id: 'pa_am',
          points: [
            [60, 202],
            [90, 175],
            [120, 154],
            [150, 137],
            [180, 130],
            [210, 137],
            [240, 154],
            [270, 175],
            [300, 202],
          ],
          stroke: 'correct',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 5000, opacity: 0 },
            { atMs: 5800, opacity: 1 },
            { atMs: 8000, opacity: 1 },
          ],
        },
        { kind: 'circle', id: 'dinh', cx: 180, cy: 130, r: 5, fill: 'neutral' },
        {
          kind: 'label',
          id: 'nhan_rong',
          x: 66,
          y: 48,
          text: 'a = 0,3',
          size: 13,
          anchor: 'start',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'nhan_hep',
          x: 246,
          y: 30,
          text: 'a = 1,2',
          size: 13,
          anchor: 'start',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3200, opacity: 0 },
            { atMs: 3800, opacity: 1 },
            { atMs: 8000, opacity: 1 },
          ],
        },
        {
          kind: 'label',
          id: 'nhan_am',
          x: 66,
          y: 218,
          text: 'a = −0,3',
          size: 13,
          anchor: 'start',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 5800, opacity: 0 },
            { atMs: 6400, opacity: 1 },
            { atMs: 8000, opacity: 1 },
          ],
        },
      ],
      captions: [
        { atMs: 0, text: 'Với a = 0,3 > 0, parabol quay bề lõm lên trên và khá rộng.' },
        { atMs: 3200, text: 'Tăng a lên 1,2: cùng đỉnh nhưng parabol hẹp lại rõ rệt.' },
        { atMs: 5800, text: 'Đổi a sang âm: bề lõm lật xuống, đỉnh thành điểm cao nhất.' },
      ],
    },
    workedExample: {
      problem:
        'Một quả bóng được sút lên, độ cao (mét) sau t giây là h(t) = −5t² + 20t. Hỏi bóng lên cao nhất bao nhiêu ' +
        'mét và sau bao lâu thì chạm đất?',
      steps: [
        'Bước 1 — Nhận dạng: h là hàm bậc hai theo t với a = −5 < 0, nên đồ thị là parabol bề lõm quay xuống và ' +
          'ĐỈNH chính là điểm cao nhất. Đây là lý do ta đi tìm đỉnh chứ không thử từng giá trị t.',
        'Bước 2 — Tìm hoành độ đỉnh: t₀ = −b/(2a) = −20/(2·(−5)) = 2 giây.',
        'Bước 3 — Thay vào để lấy độ cao lớn nhất: h(2) = −5·4 + 20·2 = −20 + 40 = 20 mét.',
        'Bước 4 — Tìm lúc chạm đất, tức h(t) = 0: −5t² + 20t = 0 ⇔ −5t(t − 4) = 0 ⇔ t = 0 hoặc t = 4. Loại t = 0 vì ' +
          'đó là thời điểm bắt đầu sút, nên bóng chạm đất sau 4 giây.',
        'Bước 5 — Kiểm tra tính hợp lý: quỹ đạo đối xứng qua trục t = 2, mà 2 nằm đúng giữa 0 và 4 — điều này khớp ' +
          'với tính chất đối xứng của parabol, nên kết quả đáng tin.',
      ],
      answer: 'Bóng lên cao nhất 20 m sau 2 giây và chạm đất sau 4 giây.',
    },
    checkQuestions: [
      {
        prompt: 'Tìm hoành độ đỉnh của parabol y = 2x² − 8x + 1.',
        answer: { kind: 'numeric', value: 2 },
        explain:
          'x₀ = −b/(2a) = −(−8)/(2·2) = 8/4 = 2. Hai lỗi hay gặp: quên dấu trừ ở tử (ra −2) và quên nhân 2 dưới mẫu ' +
          '(ra 4). Mẹo kiểm tra: thay x = 2 vào ta được y = 8 − 16 + 1 = −7; thử x = 1 và x = 3 đều cho y = −5, hai ' +
          'giá trị bằng nhau đối xứng quanh x = 2 nên đỉnh đúng ở đó.',
      },
      {
        prompt: 'Tìm giá trị nhỏ nhất của hàm số y = x² − 6x + 5 trên đoạn [0; 2].',
        answer: { kind: 'numeric', value: -3 },
        explain:
          'Đây là câu bẫy. Đỉnh nằm tại x₀ = 3 với giá trị −4, nên rất nhiều bạn trả lời ngay −4. Nhưng x₀ = 3 KHÔNG ' +
          'thuộc đoạn [0; 2]! Vì a = 1 > 0 và đoạn nằm hoàn toàn bên trái đỉnh nên hàm NGHỊCH BIẾN trên [0; 2], giá ' +
          'trị nhỏ nhất rơi vào đầu mút phải: y(2) = 4 − 12 + 5 = −3. Quy tắc: luôn kiểm xem đỉnh có nằm trong đoạn ' +
          'được hỏi hay không trước khi dùng công thức −Δ/(4a).',
      },
      {
        prompt: 'Parabol y = x² − 4x + m cắt trục hoành tại đúng MỘT điểm khi m bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 4 },
        explain:
          'Cắt trục hoành tại đúng một điểm nghĩa là phương trình x² − 4x + m = 0 có nghiệm kép, tức Δ = 0. ' +
          'Δ = 16 − 4m = 0 ⇔ m = 4. Lỗi thường gặp là dùng điều kiện Δ > 0 (hai giao điểm) hoặc Δ < 0 (không có ' +
          'giao điểm). Cách phân biệt: "đúng một điểm" ứng với việc parabol TIẾP XÚC trục hoành, chính là nghiệm kép.',
      },
    ],
    srsCards: [
      {
        hoi: 'Toạ độ đỉnh parabol y = ax² + bx + c?',
        dap: 'x₀ = −b/(2a), y₀ = −Δ/(4a) với Δ = b² − 4ac.',
      },
      {
        hoi: 'Khi tìm GTLN/GTNN trên một đoạn, phải kiểm tra điều gì trước?',
        dap: 'Đỉnh có nằm trong đoạn hay không; nếu không thì cực trị rơi vào hai đầu mút.',
      },
      {
        hoi: 'Dấu của a ảnh hưởng thế nào tới parabol?',
        dap: 'a > 0: bề lõm lên trên, đỉnh là điểm thấp nhất; a < 0: bề lõm xuống dưới, đỉnh là điểm cao nhất.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan10-c6-b2',
    grade: '10',
    chapterNumber: 6,
    chapterTitle: 'Hàm số, đồ thị và ứng dụng',
    lessonNumber: 2,
    title: 'Dấu của tam thức bậc hai và bất phương trình bậc hai',
    hook:
      'Một nhà vườn ở Bến Tre tính được lợi nhuận theo số cây trồng thêm là L(x) = −x² + 30x − 200 (triệu đồng). ' +
      'Ông không cần biết lợi nhuận chính xác là bao nhiêu — ông chỉ cần biết trồng thêm trong khoảng nào thì KHÔNG ' +
      'bị lỗ. Câu hỏi "khi nào biểu thức dương" ấy chính là bài toán xét dấu tam thức.',
    theory:
      'TAM THỨC BẬC HAI là biểu thức f(x) = ax² + bx + c với a ≠ 0.\n\n' +
      'ĐỊNH LÍ VỀ DẤU\n' +
      'Đặt Δ = b² − 4ac.\n' +
      '— Δ < 0: f(x) LUÔN CÙNG DẤU với a, với mọi x. (Parabol không cắt trục hoành nên nằm trọn một phía.)\n' +
      '— Δ = 0: f(x) cùng dấu với a với mọi x ≠ −b/(2a), và bằng 0 tại điểm đó. (Parabol chỉ chạm trục hoành.)\n' +
      '— Δ > 0: gọi x₁ < x₂ là hai nghiệm. Khi đó f(x) TRÁI DẤU với a khi x nằm TRONG khoảng (x₁; x₂), và CÙNG DẤU ' +
      'với a khi x nằm NGOÀI đoạn [x₁; x₂].\n\n' +
      'VÌ SAO NHỚ ĐƯỢC MÀ KHÔNG CẦN HỌC VẸT\n' +
      'Hãy hình dung parabol. Khi a > 0, parabol mở lên, phần "võng xuống" dưới trục hoành nằm GIỮA hai nghiệm; hai ' +
      'cánh vươn lên nằm ngoài. Câu thần chú của học sinh Việt Nam: "TRONG TRÁI, NGOÀI CÙNG" — trong khoảng hai ' +
      'nghiệm thì trái dấu a, ngoài thì cùng dấu a. Nhưng hãy hiểu bằng hình vẽ, vì câu thần chú không dùng được khi ' +
      'Δ ≤ 0.\n\n' +
      'GIẢI BẤT PHƯƠNG TRÌNH BẬC HAI — BỐN BƯỚC\n' +
      '1. Chuyển hết về một vế để có dạng f(x) > 0 (hoặc ≥, <, ≤) với vế phải bằng 0. Bước này bắt buộc: xét dấu chỉ ' +
      'có nghĩa khi so với số 0.\n' +
      '2. Tính Δ và tìm nghiệm (nếu có).\n' +
      '3. Lập bảng xét dấu.\n' +
      '4. Đọc nghiệm theo yêu cầu, chú ý dấu bằng ở đầu mút.\n\n' +
      'ỨNG DỤNG QUAN TRỌNG — BÀI TOÁN THAM SỐ\n' +
      'f(x) > 0 với MỌI x ⇔ a > 0 và Δ < 0. f(x) ≥ 0 với mọi x ⇔ a > 0 và Δ ≤ 0.\n' +
      'GIỚI HẠN PHẢI NHỚ: hai điều kiện trên chỉ áp dụng cho tam thức thật sự bậc hai. Khi hệ số a chứa tham số, phải ' +
      'xét thêm trường hợp a = 0 riêng, lúc đó biểu thức thành bậc nhất và kết luận có thể khác hẳn.',
    workedExample: {
      problem:
        'Nhà vườn có lợi nhuận L(x) = −x² + 30x − 200 (triệu đồng) khi trồng thêm x cây. Tìm các giá trị x để nhà ' +
        'vườn có lãi (L(x) > 0).',
      steps: [
        'Bước 1 — Đưa về bài toán xét dấu: cần giải bất phương trình −x² + 30x − 200 > 0. Vế phải đã bằng 0 nên ' +
          'chuyển sang xét dấu tam thức được ngay.',
        'Bước 2 — Tìm nghiệm: Δ = 30² − 4·(−1)·(−200) = 900 − 800 = 100 > 0, nên có hai nghiệm phân biệt ' +
          'x = (−30 ± 10)/(2·(−1)), cho x₁ = 10 và x₂ = 20.',
        'Bước 3 — Xét dấu: hệ số a = −1 < 0. Theo quy tắc, tam thức TRÁI dấu với a (tức là DƯƠNG) khi x nằm TRONG ' +
          'khoảng hai nghiệm. Vậy L(x) > 0 ⇔ 10 < x < 20.',
        'Bước 4 — Đối chiếu thực tế: x là số cây trồng thêm nên phải nguyên dương, vậy nhà vườn có lãi khi trồng ' +
          'thêm từ 11 đến 19 cây. Trồng đúng 10 hoặc 20 cây thì hoà vốn, trồng quá 20 cây thì lỗ (chi phí chăm sóc ' +
          'vượt doanh thu).',
      ],
      answer: 'Có lãi khi 10 < x < 20, tức trồng thêm từ 11 đến 19 cây.',
    },
    checkQuestions: [
      {
        prompt: 'Tập nghiệm của bất phương trình x² − 5x + 6 < 0 là gì?',
        choices: [
          { id: 'a', label: '(2; 3)' },
          { id: 'b', label: '(−∞; 2) ∪ (3; +∞)' },
          { id: 'c', label: '[2; 3]' },
          { id: 'd', label: 'Rỗng' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain:
          'Hai nghiệm là 2 và 3, hệ số a = 1 > 0. Bất phương trình đòi biểu thức ÂM, tức trái dấu với a, nên nghiệm ' +
          'nằm TRONG khoảng hai nghiệm: (2; 3). Đáp án b là lỗi đảo ngược "trong – ngoài", đáp án c là lỗi thêm dấu ' +
          'bằng dù bất phương trình dùng dấu < nghiêm ngặt (tại x = 2 và x = 3 biểu thức bằng 0, không âm).',
      },
      {
        prompt:
          'Tam thức f(x) = x² + 2x + m luôn dương với mọi x thực khi m thoả điều kiện m > k. Giá trị của k là bao nhiêu?',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'Điều kiện để tam thức luôn dương là a > 0 (ở đây a = 1, đã thoả) VÀ Δ < 0. Ta có Δ = 4 − 4m < 0 ⇔ m > 1, ' +
          'nên k = 1. Lỗi thường gặp là chỉ xét Δ < 0 mà quên kiểm dấu của a — nếu a âm thì dù Δ < 0 tam thức lại ' +
          'luôn ÂM. Lỗi thứ hai là dùng Δ ≤ 0: khi m = 1 tam thức thành (x+1)², bằng 0 tại x = −1 nên không "luôn dương".',
      },
      {
        prompt: 'Bất phương trình x² + 1 < 0 có bao nhiêu nghiệm thực?',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Δ = 0 − 4 = −4 < 0 và a = 1 > 0, nên tam thức luôn CÙNG DẤU với a, tức luôn dương với mọi x. Không có x ' +
          'nào làm nó âm, tập nghiệm rỗng. Bẫy ở đây là thói quen "cứ có bất phương trình bậc hai là phải tìm được ' +
          'khoảng nghiệm"; khi Δ < 0 thì dấu của tam thức không đổi trên toàn trục số, và kết luận có thể là "vô ' +
          'nghiệm" hoặc "mọi x" chứ không phải một khoảng.',
      },
    ],
    srsCards: [
      {
        hoi: 'Khi Δ > 0, tam thức mang dấu gì trong khoảng hai nghiệm?',
        dap: 'Trái dấu với hệ số a. Ngoài đoạn hai nghiệm thì cùng dấu với a ("trong trái, ngoài cùng").',
      },
      {
        hoi: 'Điều kiện để ax² + bx + c > 0 với mọi x?',
        dap: 'a > 0 và Δ < 0 (phải kiểm cả hai; nếu a chứa tham số thì xét riêng trường hợp a = 0).',
      },
      {
        hoi: 'Khi Δ < 0 thì dấu tam thức thế nào?',
        dap: 'Không đổi trên toàn trục số và luôn cùng dấu với a.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
