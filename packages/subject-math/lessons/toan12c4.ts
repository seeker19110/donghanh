// lessons/toan12c4.ts — Toán 12, Chương 4: Nguyên hàm và tích phân.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN12_C4_LESSONS: MathLesson[] = [
  {
    id: 'toan12-c4-b1',
    grade: '12',
    chapterNumber: 4,
    chapterTitle: 'Nguyên hàm và tích phân',
    lessonNumber: 1,
    title: 'Nguyên hàm — phép toán ngược của đạo hàm',
    hook:
      'Đồng hồ tốc độ xe khách ghi lại vận tốc từng giây suốt chuyến Hà Nội – Vinh. Từ bảng vận tốc ấy, làm sao tính ' +
      'ngược ra quãng đường đã đi? Đạo hàm đưa ta từ quãng đường sang vận tốc; giờ ta cần đi ngược chiều mũi tên — ' +
      'và phép toán đi ngược ấy gọi là nguyên hàm.',
    theory:
      'ĐỊNH NGHĨA\n' +
      "Hàm F là một nguyên hàm của f trên khoảng K nếu F'(x) = f(x) với mọi x thuộc K.\n" +
      'VÌ SAO PHẢI NÓI "MỘT NGUYÊN HÀM" CHỨ KHÔNG PHẢI "NGUYÊN HÀM DUY NHẤT": vì đạo hàm của hằng số bằng 0, nên nếu ' +
      'F là nguyên hàm thì F + 5, F − 100, F + C cũng đều là nguyên hàm. Toàn bộ họ nguyên hàm của f được viết là ' +
      '∫f(x)dx = F(x) + C với C là hằng số tuỳ ý.\n' +
      'QUÊN "+ C" LÀ LỖI MẤT ĐIỂM PHỔ BIẾN NHẤT của chương này — và nó không phải chuyện hình thức: thiếu C là thiếu ' +
      'vô hạn nghiệm của bài toán.\n\n' +
      'BẢNG NGUYÊN HÀM CƠ BẢN (đọc ngược bảng đạo hàm)\n' +
      '∫0dx = C; ∫dx = x + C;\n' +
      '∫xᵅdx = xᵅ⁺¹/(α+1) + C với α ≠ −1;\n' +
      '∫(1/x)dx = ln|x| + C — trường hợp α = −1 phải tách riêng, vì công thức trên sẽ chia cho 0. Chú ý DẤU GIÁ TRỊ ' +
      'TUYỆT ĐỐI: hàm 1/x xác định cả với x âm, nên nguyên hàm phải là ln|x| chứ không phải ln x.\n' +
      '∫eˣdx = eˣ + C; ∫aˣdx = aˣ/ln a + C;\n' +
      '∫cos x dx = sin x + C; ∫sin x dx = −cos x + C (chú ý dấu trừ, hay bị bỏ sót).\n\n' +
      'TÍNH CHẤT\n' +
      '∫[f(x) ± g(x)]dx = ∫f(x)dx ± ∫g(x)dx; ∫k·f(x)dx = k·∫f(x)dx với k là hằng số.\n' +
      'CẢNH BÁO: KHÔNG có quy tắc nào cho nguyên hàm của TÍCH hay THƯƠNG. ∫(u·v)dx không bằng ∫u dx · ∫v dx. Gặp ' +
      'tích thì phải dùng đổi biến hoặc nguyên hàm từng phần.\n\n' +
      'HAI PHƯƠNG PHÁP CHÍNH\n' +
      '1. ĐỔI BIẾN: khi biểu thức có dạng f(u(x))·u′(x), đặt t = u(x) thì dt = u′(x)dx. Dấu hiệu nhận biết: trong ' +
      'biểu thức xuất hiện một hàm và ĐẠO HÀM của nó (sai khác hằng số).\n' +
      '2. NGUYÊN HÀM TỪNG PHẦN: ∫u dv = uv − ∫v du. Dùng khi biểu thức là tích của hai loại hàm khác nhau, ví dụ ' +
      'x·eˣ hay x·ln x. Quy tắc chọn u theo thứ tự ưu tiên "lôgarit → đa thức → lượng giác → mũ": chọn u là hàm ' +
      'đứng trước trong danh sách, vì đạo hàm của nó sẽ đơn giản dần.\n\n' +
      'CÁCH TỰ KIỂM TRA KẾT QUẢ: lấy đạo hàm kết quả vừa tìm, phải ra đúng hàm ban đầu. Đây là cách kiểm chắc chắn ' +
      '100%, nên hãy làm mỗi khi còn nghi ngờ.',
    animation: {
      title: 'Hằng số C tịnh tiến đồ thị mà không đổi hệ số góc tiếp tuyến',
      description:
        'Với f(x) = 2x, mọi nguyên hàm đều có dạng F(x) = x² + C. Ba parabol cùng hình dạng được vẽ chồng nhau, lệch nhau theo phương thẳng đứng ứng với C bằng −1, 0 và 2. Một parabol thứ tư trượt lên xuống qua các mức ấy để thấy rõ chúng chỉ khác nhau một phép tịnh tiến dọc. Tại x = 1, hai tiếp tuyến được vẽ trên hai parabol khác nhau: chúng song song khít nhau, vì hệ số góc của cả hai đều bằng F phẩy (1) = 2 nhân 1 = 2, không phụ thuộc C. Hình động giải thích thứ mà kí hiệu cộng C không tự nói: đạo hàm chỉ nhìn ĐỘ DỐC nên nó xoá sạch mọi thông tin về độ cao; vì thế phép ngược của nó buộc phải trả về cả một họ đường cong, và chỉ một điều kiện ban đầu như F(0) = 1 mới chốt được C.',
      viewBoxWidth: 300,
      viewBoxHeight: 230,
      durationMs: 6500,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'ox',
          x1: 40,
          y1: 190,
          x2: 280,
          y2: 190,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'oy',
          x1: 140,
          y1: 20,
          x2: 140,
          y2: 220,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'polyline',
          id: 'p-c0',
          points: [
            [60, 110],
            [80, 145],
            [100, 170],
            [120, 185],
            [140, 190],
            [160, 185],
            [180, 170],
            [200, 145],
            [220, 110],
          ],
          stroke: 'muted',
          strokeWidth: 2,
          dash: '5 4',
        },
        {
          kind: 'polyline',
          id: 'p-cam1',
          points: [
            [60, 130],
            [80, 165],
            [100, 190],
            [120, 205],
            [140, 210],
            [160, 205],
            [180, 190],
            [200, 165],
            [220, 130],
          ],
          stroke: 'muted',
          strokeWidth: 2,
          dash: '5 4',
        },
        {
          kind: 'polyline',
          id: 'p-c2',
          points: [
            [60, 70],
            [80, 105],
            [100, 130],
            [120, 145],
            [140, 150],
            [160, 145],
            [180, 130],
            [200, 105],
            [220, 70],
          ],
          stroke: 'muted',
          strokeWidth: 2,
          dash: '5 4',
        },
        {
          kind: 'polyline',
          id: 'p-truot',
          points: [
            [60, 130],
            [80, 165],
            [100, 190],
            [120, 205],
            [140, 210],
            [160, 205],
            [180, 190],
            [200, 165],
            [220, 130],
          ],
          stroke: 'primary',
          strokeWidth: 3,
          keyframes: [
            {
              atMs: 0,
              dy: 0,
            },
            {
              atMs: 1600,
              dy: -20,
            },
            {
              atMs: 3200,
              dy: -60,
            },
            {
              atMs: 4800,
              dy: -20,
            },
            {
              atMs: 6500,
              dy: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-c2',
          x: 228,
          y: 68,
          text: 'C = 2',
          size: 12,
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'nhan-c0',
          x: 228,
          y: 108,
          text: 'C = 0',
          size: 12,
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'nhan-cam1',
          x: 228,
          y: 128,
          text: 'C = −1',
          size: 12,
          fill: 'muted',
        },
        {
          kind: 'line',
          id: 'tt-1',
          x1: 150,
          y1: 200,
          x2: 210,
          y2: 140,
          stroke: 'correct',
          strokeWidth: 3,
        },
        {
          kind: 'circle',
          id: 'tiep-1',
          cx: 180,
          cy: 170,
          r: 5,
          fill: 'correct',
        },
        {
          kind: 'line',
          id: 'tt-2',
          x1: 150,
          y1: 160,
          x2: 210,
          y2: 100,
          stroke: 'accent',
          strokeWidth: 3,
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
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'tiep-2',
          cx: 180,
          cy: 130,
          r: 5,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3900,
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
          id: 'ham',
          x: 160,
          y: 34,
          text: "F(x) = x² + C,  F'(x) = 2x",
          size: 14,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'ket',
          x: 160,
          y: 226,
          text: 'hai tiếp tuyến tại x = 1 đều có hệ số góc 2',
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
              atMs: 4400,
              opacity: 0,
            },
            {
              atMs: 4900,
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
          atMs: 0,
          text: 'Ba parabol y = x² + C với C = −1, 0, 2 — cùng hình dạng, khác độ cao.',
        },
        {
          atMs: 1600,
          text: 'Đổi C chỉ là tịnh tiến đồ thị lên xuống, không bóp méo gì.',
        },
        {
          atMs: 3900,
          text: 'Tiếp tuyến tại x = 1 trên hai parabol khác nhau lại song song khít.',
        },
        {
          atMs: 4900,
          text: "Vì F'(1) = 2·1 = 2 với mọi C — đạo hàm không thấy độ cao.",
        },
        {
          atMs: 5800,
          text: 'Nên nguyên hàm phải kèm +C, và cần một điều kiện như F(0) = 1 mới chốt được C.',
        },
      ],
    },
    workedExample: {
      problem: 'Tìm nguyên hàm F(x) của f(x) = 3x² + 2cos x, biết F(0) = 5.',
      steps: [
        'Bước 1 — Tách tổng, vì nguyên hàm có tính chất cộng: ∫(3x² + 2cos x)dx = 3∫x²dx + 2∫cos x dx.',
        'Bước 2 — Áp bảng cho từng phần: ∫x²dx = x³/3 (dùng công thức xᵅ⁺¹/(α+1) với α = 2), và ∫cos x dx = sin x.',
        'Bước 3 — Ghép lại, chỉ viết MỘT hằng số C cho cả biểu thức: F(x) = 3·(x³/3) + 2·sin x + C = x³ + 2sin x + C.',
        'Bước 4 — Dùng điều kiện F(0) = 5 để xác định C (đây chính là lý do phải giữ C lại): ' +
          'F(0) = 0 + 2·sin 0 + C = C = 5.',
        "Bước 5 — Kết luận và kiểm tra: F(x) = x³ + 2sin x + 5. Lấy đạo hàm kiểm lại: F'(x) = 3x² + 2cos x, đúng " +
          'bằng f(x) ban đầu. Vậy kết quả chắc chắn đúng.',
      ],
      answer: 'F(x) = x³ + 2sin x + 5.',
    },
    checkQuestions: [
      {
        prompt: 'Nguyên hàm của f(x) = x⁴ là x^k/k + C. Giá trị của k bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 5 },
        explain:
          'Áp công thức ∫xᵅdx = xᵅ⁺¹/(α+1) + C với α = 4: ta được x⁵/5 + C, nên k = 5. Lỗi hay gặp là làm ngược quy ' +
          'tắc đạo hàm (giảm số mũ, ra x³/3). Hãy nhớ nguyên hàm là phép NGƯỢC của đạo hàm, nên số mũ phải TĂNG chứ ' +
          'không giảm. Kiểm nhanh bằng cách đạo hàm lại: (x⁵/5)′ = 5x⁴/5 = x⁴, đúng.',
      },
      {
        prompt: 'Nguyên hàm của f(x) = sin x là gì?',
        choices: [
          { id: 'a', label: 'cos x + C' },
          { id: 'b', label: '−cos x + C' },
          { id: 'c', label: 'sin x + C' },
          { id: 'd', label: '−sin x + C' },
        ],
        answer: { kind: 'choice', correctIds: ['b'] },
        explain:
          'Dấu trừ ở đây là chỗ sai nhiều nhất cả chương. Cách kiểm chắc chắn: đạo hàm của −cos x là −(−sin x) = ' +
          'sin x, đúng bằng hàm ban đầu. Còn nếu chọn cos x + C thì đạo hàm ra −sin x, sai dấu. Mẹo nhớ: khi đi ' +
          'theo chiều đạo hàm sin → cos không có dấu trừ, nên khi đi NGƯỢC lại phải thêm dấu trừ.',
      },
      {
        prompt:
          'Biểu thức ∫(1/x)dx bằng ln|x| + C hay x⁰/0 + C? Nhập 1 nếu là ln|x| + C, nhập 0 nếu là x⁰/0 + C.',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'Công thức ∫xᵅdx = xᵅ⁺¹/(α+1) + C KHÔNG áp dụng được khi α = −1, vì mẫu số α + 1 sẽ bằng 0 — biểu thức ' +
          'x⁰/0 vô nghĩa. Đây chính là lý do trường hợp 1/x phải tách riêng thành ln|x| + C. Lưu ý thêm dấu giá trị ' +
          'tuyệt đối: hàm 1/x xác định cả với x âm, mà ln của số âm không tồn tại, nên phải viết ln|x|.',
      },
    ],
    srsCards: [
      {
        hoi: 'Vì sao nguyên hàm luôn phải kèm "+ C"?',
        dap: 'Vì đạo hàm hằng số bằng 0, nên F + C cũng là nguyên hàm với mọi hằng số C.',
      },
      {
        hoi: 'Công thức ∫xᵅdx và ngoại lệ của nó?',
        dap: 'xᵅ⁺¹/(α+1) + C với α ≠ −1; riêng α = −1 cho ∫(1/x)dx = ln|x| + C.',
      },
      {
        hoi: 'Cách chắc chắn nhất để kiểm tra một nguyên hàm?',
        dap: 'Lấy đạo hàm kết quả; phải ra đúng hàm ban đầu.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan12-c4-b2',
    grade: '12',
    chapterNumber: 4,
    chapterTitle: 'Nguyên hàm và tích phân',
    lessonNumber: 2,
    title: 'Tích phân và ứng dụng tính diện tích, thể tích',
    hook:
      'Muốn tính diện tích một thửa ruộng có một cạnh là bờ sông cong queo, người ta không có công thức nào cả. Cách ' +
      'làm của người xưa: chia thửa ruộng thành thật nhiều dải hẹp, mỗi dải coi như hình chữ nhật rồi cộng lại. Chia ' +
      'càng nhỏ càng chính xác. Đẩy ý tưởng ấy tới vô hạn, ta được tích phân.',
    theory:
      'ĐỊNH NGHĨA VÀ CÔNG THỨC NEWTON – LEIBNIZ\n' +
      'Nếu F là một nguyên hàm của f trên [a; b] và f liên tục trên đoạn đó thì:\n' +
      '∫(từ a đến b) f(x)dx = F(b) − F(a).\n' +
      'Công thức này là cây cầu nối hai thế giới tưởng chừng không liên quan: phép tính DIỆN TÍCH (hình học, cộng vô ' +
      'hạn mảnh nhỏ) và phép tính NGUYÊN HÀM (đại số, đi ngược đạo hàm). Đây là một trong những kết quả đẹp nhất của ' +
      'toán học, thường gọi là Định lí cơ bản của giải tích.\n' +
      'LƯU Ý: tích phân xác định là một SỐ, không phải một họ hàm — nên KHÔNG có "+ C" ở đây. Hằng số C tự triệt ' +
      'tiêu khi lấy hiệu F(b) − F(a).\n\n' +
      'TÍNH CHẤT\n' +
      '∫(a→a) f = 0; ∫(a→b) f = −∫(b→a) f; ∫(a→b) f = ∫(a→c) f + ∫(c→b) f với mọi c.\n' +
      'Tính chất tách đoạn là công cụ chủ lực khi hàm có dấu giá trị tuyệt đối hoặc cho bởi nhiều công thức.\n\n' +
      'DIỆN TÍCH HÌNH PHẲNG — CHỖ SAI PHỔ BIẾN NHẤT\n' +
      'Diện tích hình giới hạn bởi y = f(x), trục hoành và hai đường x = a, x = b là:\n' +
      'S = ∫(a→b) |f(x)|dx — có DẤU GIÁ TRỊ TUYỆT ĐỐI.\n' +
      'VÌ SAO: tích phân của phần đồ thị nằm DƯỚI trục hoành cho giá trị ÂM, và khi cộng vào nó sẽ TRỪ BỚT phần dương ' +
      '— kết quả không còn là diện tích thật. Diện tích luôn là số không âm.\n' +
      'CÁCH LÀM ĐÚNG: giải f(x) = 0 để tìm các điểm đồ thị cắt trục hoành trong (a; b), tách tích phân thành từng ' +
      'đoạn theo các điểm đó, rồi lấy giá trị tuyệt đối từng phần và cộng lại.\n' +
      'Diện tích giữa hai đường: S = ∫(a→b) |f(x) − g(x)|dx, với a, b là hoành độ hai giao điểm.\n\n' +
      'THỂ TÍCH KHỐI TRÒN XOAY\n' +
      'Quay hình phẳng giới hạn bởi y = f(x), trục Ox, x = a, x = b quanh trục Ox:\n' +
      'V = π∫(a→b) [f(x)]²dx.\n' +
      'Ở đây KHÔNG cần giá trị tuyệt đối vì đã bình phương — bình phương luôn không âm. Đó là một khác biệt quan ' +
      'trọng so với công thức diện tích, và cũng là chỗ nhiều bạn máy móc thêm dấu tuyệt đối vào cho "an toàn".',
    animation: {
      title: 'Chia nhỏ dần các hình chữ nhật để xấp xỉ diện tích dưới đường cong',
      description:
        'Diện tích dưới một đường cong được lấp bằng các hình chữ nhật đứng. Ban đầu chỉ có ba hình chữ nhật to nên ' +
        'phần thừa và phần thiếu so với đường cong còn rất rõ. Sau đó số hình chữ nhật tăng lên và bề rộng mỗi hình ' +
        'hẹp lại, phần sai lệch co nhỏ dần cho tới khi các hình chữ nhật lấp gần khít vùng dưới đường cong — đó ' +
        'chính là ý tưởng của tích phân.',
      viewBoxWidth: 380,
      viewBoxHeight: 220,
      durationMs: 7000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'ox',
          x1: 30,
          y1: 180,
          x2: 360,
          y2: 180,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'oy',
          x1: 50,
          y1: 180,
          x2: 50,
          y2: 20,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'rect',
          id: 'cot1',
          x: 50,
          y: 140,
          w: 90,
          h: 40,
          fill: 'primary',
          opacity: 0.5,
          stroke: 'primary',
          strokeWidth: 1,
          // Lớp thô nhường chỗ cho lớp mịn — soi ảnh 2026-09-22 thấy hai lớp chồng nhau ở cảnh cuối.
          keyframes: [
            { atMs: 0, opacity: 0.5 },
            { atMs: 3000, opacity: 0.5 },
            { atMs: 4000, opacity: 0.12 },
            { atMs: 7000, opacity: 0.12 },
          ],
        },
        {
          kind: 'rect',
          id: 'cot2',
          x: 140,
          y: 104,
          w: 90,
          h: 76,
          fill: 'primary',
          opacity: 0.5,
          stroke: 'primary',
          strokeWidth: 1,
          // Lớp thô nhường chỗ cho lớp mịn — soi ảnh 2026-09-22 thấy hai lớp chồng nhau ở cảnh cuối.
          keyframes: [
            { atMs: 0, opacity: 0.5 },
            { atMs: 3000, opacity: 0.5 },
            { atMs: 4000, opacity: 0.12 },
            { atMs: 7000, opacity: 0.12 },
          ],
        },
        {
          kind: 'rect',
          id: 'cot3',
          x: 230,
          y: 58,
          w: 90,
          h: 122,
          fill: 'primary',
          opacity: 0.5,
          stroke: 'primary',
          strokeWidth: 1,
          // Lớp thô nhường chỗ cho lớp mịn — soi ảnh 2026-09-22 thấy hai lớp chồng nhau ở cảnh cuối.
          keyframes: [
            { atMs: 0, opacity: 0.5 },
            { atMs: 3000, opacity: 0.5 },
            { atMs: 4000, opacity: 0.12 },
            { atMs: 7000, opacity: 0.12 },
          ],
        },
        {
          kind: 'rect',
          id: 'min1',
          x: 50,
          y: 152,
          w: 45,
          h: 28,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3000, opacity: 0 },
            { atMs: 3800, opacity: 0.6 },
            { atMs: 7000, opacity: 0.6 },
          ],
        },
        {
          kind: 'rect',
          id: 'min2',
          x: 95,
          y: 134,
          w: 45,
          h: 46,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3000, opacity: 0 },
            { atMs: 4000, opacity: 0.6 },
            { atMs: 7000, opacity: 0.6 },
          ],
        },
        {
          kind: 'rect',
          id: 'min3',
          x: 140,
          y: 112,
          w: 45,
          h: 68,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3000, opacity: 0 },
            { atMs: 4200, opacity: 0.6 },
            { atMs: 7000, opacity: 0.6 },
          ],
        },
        {
          kind: 'rect',
          id: 'min4',
          x: 185,
          y: 84,
          w: 45,
          h: 96,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3000, opacity: 0 },
            { atMs: 4400, opacity: 0.6 },
            { atMs: 7000, opacity: 0.6 },
          ],
        },
        {
          kind: 'rect',
          id: 'min5',
          x: 230,
          y: 68,
          w: 45,
          h: 112,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3000, opacity: 0 },
            { atMs: 4600, opacity: 0.6 },
            { atMs: 7000, opacity: 0.6 },
          ],
        },
        {
          kind: 'rect',
          id: 'min6',
          x: 275,
          y: 44,
          w: 45,
          h: 136,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3000, opacity: 0 },
            { atMs: 4800, opacity: 0.6 },
            { atMs: 7000, opacity: 0.6 },
          ],
        },
        {
          kind: 'polyline',
          id: 'duongCong',
          points: [
            [50, 158],
            [95, 150],
            [140, 138],
            [185, 120],
            [230, 96],
            [275, 68],
            [320, 34],
          ],
          stroke: 'neutral',
          strokeWidth: 3,
        },
      ],
      captions: [
        { atMs: 0, text: 'Chia miền thành ba hình chữ nhật rộng — sai lệch còn lớn.' },
        { atMs: 3000, text: 'Tăng số hình chữ nhật lên, mỗi hình hẹp lại.' },
        { atMs: 4800, text: 'Phần thừa thiếu co nhỏ dần; tổng diện tích tiến tới diện tích thật.' },
        { atMs: 6000, text: 'Cho bề rộng tiến về 0, tổng ấy chính là tích phân.' },
      ],
    },
    workedExample: {
      problem:
        'Tính diện tích hình phẳng giới hạn bởi đồ thị hàm y = x² − 1, trục hoành và hai đường thẳng x = 0, x = 2.',
      steps: [
        'Bước 1 — Kiểm dấu của hàm trên đoạn lấy tích phân, bước bắt buộc trước khi tính diện tích: giải x² − 1 = 0 ' +
          'được x = ±1, trong đó x = 1 nằm trong đoạn [0; 2]. Vậy hàm ĐỔI DẤU bên trong đoạn.',
        'Bước 2 — Xác định dấu trên từng đoạn con: trên [0; 1] lấy x = 0,5 cho giá trị âm (đồ thị nằm dưới trục ' +
          'hoành); trên [1; 2] lấy x = 1,5 cho giá trị dương.',
        'Bước 3 — Tách tích phân và lấy giá trị tuyệt đối từng phần (nếu tính một mạch từ 0 đến 2 thì phần âm sẽ trừ ' +
          'bớt phần dương, cho kết quả nhỏ hơn diện tích thật): S = |∫(0→1)(x²−1)dx| + |∫(1→2)(x²−1)dx|.',
        'Bước 4 — Tính nguyên hàm F(x) = x³/3 − x, rồi tính từng phần: ∫(0→1) = (1/3 − 1) − 0 = −2/3, lấy trị tuyệt ' +
          'đối được 2/3. ∫(1→2) = (8/3 − 2) − (1/3 − 1) = 2/3 + 2/3 = 4/3.',
        'Bước 5 — Cộng lại: S = 2/3 + 4/3 = 2. Đối chiếu: nếu tính sai một mạch sẽ được ∫(0→2) = 2/3, nhỏ hơn hẳn — ' +
          'đó chính là hậu quả của việc quên dấu giá trị tuyệt đối.',
      ],
      answer: 'Diện tích bằng 2 (đơn vị diện tích).',
    },
    checkQuestions: [
      {
        prompt: 'Tính tích phân của hàm f(x) = 2x trên đoạn từ 0 đến 3.',
        answer: { kind: 'numeric', value: 9 },
        explain:
          'Nguyên hàm là F(x) = x², nên tích phân bằng F(3) − F(0) = 9 − 0 = 9. Kiểm bằng hình học: miền cần tính là ' +
          'tam giác vuông có hai cạnh góc vuông 3 và 6, diện tích 3·6/2 = 9, khớp. Lưu ý tích phân xác định là một ' +
          'SỐ nên không kèm "+ C".',
      },
      {
        prompt:
          'Tính diện tích hình phẳng giới hạn bởi đồ thị y = x² − 4, trục hoành và hai đường x = 0, x = 2. ' +
          '(Nhập dạng phân số, ví dụ 16/3.)',
        answer: { kind: 'fraction', num: 16, den: 3 },
        explain:
          'Trên [0; 2] hàm x² − 4 luôn ÂM (tại x = 0 cho −4, tại x = 2 cho 0), nên đồ thị nằm dưới trục hoành. ' +
          'Tích phân cho (8/3 − 8) − 0 = −16/3, là số âm. Diện tích phải là giá trị tuyệt đối của nó: 16/3. Đây là ' +
          'bẫy trọng tâm của bài: nhiều bạn ghi thẳng đáp số âm. Diện tích không bao giờ âm — thấy kết quả âm là dấu ' +
          'hiệu đã quên dấu giá trị tuyệt đối.',
      },
      {
        prompt:
          'Thể tích khối tròn xoay khi quay hình giới hạn bởi y = x, trục Ox, x = 0, x = 3 quanh trục Ox bằng kπ. ' +
          'Giá trị k bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 9 },
        explain:
          'V = π∫(0→3) x²dx = π·[x³/3] = π·(27/3 − 0) = 9π, nên k = 9. Kiểm bằng hình học: khối tạo thành là hình ' +
          'nón có bán kính đáy 3 và chiều cao 3, thể tích πr²h/3 = π·9·3/3 = 9π, khớp. Lỗi hay gặp là quên BÌNH ' +
          'PHƯƠNG hàm số (tính π∫x dx ra 4,5π) hoặc quên nhân π.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức Newton – Leibniz?',
        dap: '∫(a→b) f(x)dx = F(b) − F(a) với F là một nguyên hàm của f; kết quả là một số, không có "+ C".',
      },
      {
        hoi: 'Vì sao công thức diện tích phải có dấu giá trị tuyệt đối?',
        dap: 'Vì phần đồ thị dưới trục hoành cho tích phân âm, sẽ trừ bớt phần dương nếu không lấy trị tuyệt đối.',
      },
      {
        hoi: 'Thể tích khối tròn xoay quanh Ox?',
        dap: 'V = π∫(a→b) [f(x)]²dx — đã bình phương nên không cần dấu giá trị tuyệt đối.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
