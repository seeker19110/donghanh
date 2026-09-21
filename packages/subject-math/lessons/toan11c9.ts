// lessons/toan11c9.ts — Toán 11, Chương 9: Đạo hàm.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN11_C9_LESSONS: MathLesson[] = [
  {
    id: 'toan11-c9-b1',
    grade: '11',
    chapterNumber: 9,
    chapterTitle: 'Đạo hàm',
    lessonNumber: 1,
    title: 'Khái niệm đạo hàm và ý nghĩa hình học',
    hook:
      'Đồng hồ tốc độ trên xe máy chỉ 40 km/h — nhưng đó là tốc độ TẠI KHOẢNH KHẮC NÀY, chứ không phải quãng đường ' +
      'chia thời gian của cả chuyến đi. Làm sao tính được tốc độ tại đúng một khoảnh khắc, khi mà trong một khoảnh ' +
      'khắc thì quãng đường bằng 0 và thời gian cũng bằng 0? Đạo hàm chính là lời giải cho nghịch lý ấy.',
    theory:
      'ĐỊNH NGHĨA\n' +
      "f'(x₀) = lim [f(x) − f(x₀)]/(x − x₀) khi x → x₀, nếu giới hạn này tồn tại và hữu hạn.\n" +
      'Đặt Δx = x − x₀ (số gia đối số) và Δy = f(x₀ + Δx) − f(x₀) (số gia hàm số), ta viết gọn ' +
      "f'(x₀) = lim (Δy/Δx) khi Δx → 0.\n\n" +
      'VÌ SAO PHẢI DÙNG GIỚI HẠN MÀ KHÔNG THAY THẲNG Δx = 0\n' +
      'Thay Δx = 0 cho 0/0 — vô nghĩa. Ý tưởng của đạo hàm là: thay vì hỏi "tốc độ tại đúng một điểm", ta hỏi "tốc ' +
      'độ trung bình trên một khoảng CỰC NGẮN", rồi cho khoảng ấy co lại dần về 0 và xem con số tiến tới đâu. Giới ' +
      'hạn ấy chính là tốc độ tức thời.\n\n' +
      'BA Ý NGHĨA PHẢI NẮM\n' +
      "1. HÌNH HỌC: f'(x₀) là HỆ SỐ GÓC của tiếp tuyến với đồ thị tại điểm M(x₀; f(x₀)). Tỉ số Δy/Δx là hệ số góc " +
      'của cát tuyến qua hai điểm; khi điểm thứ hai trượt về trùng điểm đầu, cát tuyến xoay dần thành tiếp tuyến.\n' +
      "2. VẬT LÍ: nếu s(t) là quãng đường thì s'(t) là vận tốc tức thời; v'(t) là gia tốc.\n" +
      '3. TỔNG QUÁT: đạo hàm đo TỐC ĐỘ THAY ĐỔI của một đại lượng theo đại lượng khác — tốc độ tăng dân số, tốc độ ' +
      'nguội của một vật, tốc độ lan của dịch bệnh.\n\n' +
      'PHƯƠNG TRÌNH TIẾP TUYẾN tại điểm M(x₀; y₀) thuộc đồ thị:\n' +
      "y = f'(x₀)(x − x₀) + y₀.\n" +
      'PHẠM VI ÁP DỤNG (rất hay bị bỏ qua): công thức này chỉ dùng khi x₀ là hoành độ TIẾP ĐIỂM. Nếu đề cho "tiếp tuyến đi qua điểm ' +
      'A" mà A không thuộc đồ thị thì phải đặt tiếp điểm làm ẩn rồi giải phương trình — đây là hai dạng bài khác hẳn ' +
      'nhau và bị nhầm rất nhiều.\n\n' +
      'BẢNG ĐẠO HÀM CƠ BẢN\n' +
      "(c)' = 0; (x)' = 1; (xⁿ)' = n·xⁿ⁻¹; (√x)' = 1/(2√x) với x > 0; (1/x)' = −1/x² với x ≠ 0;\n" +
      "(sin x)' = cos x; (cos x)' = −sin x (chú ý dấu trừ).\n\n" +
      'QUY TẮC TÍNH\n' +
      "(u ± v)' = u' ± v'; (u·v)' = u'v + uv'; (u/v)' = (u'v − uv')/v².\n" +
      "CẢNH BÁO: (u·v)' KHÔNG bằng u'·v'. Kiểm bằng ví dụ: với u = v = x thì (x·x)' = (x²)' = 2x, trong khi " +
      "u'·v' = 1·1 = 1. Khác hẳn nhau. Quy tắc đạo hàm tích có hai số hạng là vì cả hai thừa số đều đang thay đổi.\n" +
      "ĐẠO HÀM HÀM HỢP: [f(u(x))]' = f'(u)·u'(x) — đạo hàm lớp ngoài nhân đạo hàm lớp trong.",
    // Hoạt ảnh tính SẴN theo hình học thật: đường cong là y = 192 − 6u − 2u² (u = (x−70)/30) trên toạ độ
    // viewBox; tại MỖI mốc thời gian, điểm B nằm ĐÚNG trên đường cong và cát tuyến được xoay + tịnh tiến
    // để thực sự đi qua cả A và B. Mốc cuối khớp đúng tiếp tuyến tại A (hệ số góc −14/30 ≈ −0,467).
    animation: {
      title: 'Cát tuyến xoay dần thành tiếp tuyến',
      description:
        'Trên đồ thị một đường cong có điểm M cố định và điểm B nằm xa hơn về bên phải. Đường thẳng nối hai điểm ' +
        'là cát tuyến, hệ số góc của nó bằng Δy/Δx — độ dốc TRUNG BÌNH trên đoạn từ M tới B. Khi B trượt dọc ' +
        'đường cong về sát M, đường thẳng luôn đi qua đúng hai điểm ấy và xoay dần: độ dốc của nó đi từ −0,80 ' +
        'qua −0,73; −0,67; −0,60; −0,53; −0,50 rồi tiến tới −0,47. Lúc B trùng M, cát tuyến dừng lại ở đúng một ' +
        'vị trí giới hạn duy nhất — đó là tiếp tuyến, và hệ số góc giới hạn ấy chính là đạo hàm tại M.',
      viewBoxWidth: 380,
      viewBoxHeight: 240,
      durationMs: 7000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'ox',
          x1: 30,
          y1: 200,
          x2: 360,
          y2: 200,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'oy',
          x1: 60,
          y1: 200,
          x2: 60,
          y2: 20,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'polyline',
          id: 'duongCong',
          points: [
            [70, 192],
            [100, 184],
            [130, 172],
            [160, 156],
            [190, 136],
            [220, 112],
            [250, 84],
            [280, 52],
            [310, 16],
          ],
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'line',
          id: 'catTuyen',
          x1: 100,
          y1: 190,
          x2: 300,
          y2: 40,
          stroke: 'accent',
          strokeWidth: 3,
          // Đoạn gốc dài 250, tâm (200; 115), hướng −36,87°. Mỗi mốc: rotate = góc(B − A) − (−36,87°),
          // còn dx/dy đẩy tâm đoạn về vị trí A + 87,5·vector đơn vị AB để đường thẳng tựa đúng lên A và B.
          keyframes: [
            { atMs: 0, rotate: -1.79, dx: -1.67, dy: 2.34 },
            { atMs: 1000, rotate: 0.62, dx: 0.56, dy: 5.26 },
            { atMs: 2000, rotate: 3.18, dx: 2.8, dy: 8.46 },
            { atMs: 3000, rotate: 5.91, dx: 5.03, dy: 11.98 },
            { atMs: 4000, rotate: 8.8, dx: 7.21, dy: 15.82 },
            { atMs: 4700, rotate: 10.31, dx: 8.26, dy: 17.87 },
            { atMs: 5400, rotate: 11.85, dx: 9.29, dy: 20 },
            { atMs: 7000, rotate: 11.85, dx: 9.29, dy: 20 },
          ],
        },
        { kind: 'circle', id: 'diemCoDinh', cx: 130, cy: 172, r: 6, fill: 'primary' },
        {
          kind: 'circle',
          id: 'diemChay',
          cx: 280,
          cy: 52,
          r: 6,
          fill: 'warn',
          // B luôn nằm TRÊN đường cong: các mốc ứng với u = 7 · 6 · 5 · 4 · 3 · 2,5 · 2 (u = 2 là trùng A).
          keyframes: [
            { atMs: 0, dx: 0, dy: 0 },
            { atMs: 1000, dx: -30, dy: 32 },
            { atMs: 2000, dx: -60, dy: 60 },
            { atMs: 3000, dx: -90, dy: 84 },
            { atMs: 4000, dx: -120, dy: 104 },
            { atMs: 4700, dx: -135, dy: 112.5 },
            { atMs: 5400, dx: -150, dy: 120 },
            { atMs: 7000, dx: -150, dy: 120 },
          ],
        },
        {
          kind: 'label',
          id: 'nhanM',
          x: 122,
          y: 168,
          text: 'M',
          size: 15,
          anchor: 'end',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanKetLuan',
          x: 200,
          y: 228,
          text: "hệ số góc tiến tới f'(x₀)",
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 4600, opacity: 0 },
            { atMs: 5400, opacity: 1 },
            { atMs: 7000, opacity: 1 },
          ],
        },
      ],
      captions: [
        { atMs: 0, text: 'Đường thẳng qua hai điểm của đồ thị là cát tuyến.' },
        { atMs: 2000, text: 'Hệ số góc cát tuyến chính là tỉ số Δy/Δx.' },
        { atMs: 4000, text: 'Cho điểm thứ hai trượt lại gần điểm M.' },
        { atMs: 5400, text: 'Cát tuyến tiến tới tiếp tuyến; hệ số góc của nó là đạo hàm.' },
      ],
    },
    workedExample: {
      problem:
        'Cho hàm số y = x² − 3x + 2. Viết phương trình tiếp tuyến của đồ thị tại điểm có hoành độ x₀ = 2.',
      steps: [
        'Bước 1 — Tìm tung độ tiếp điểm (cần cho công thức): y₀ = 2² − 3·2 + 2 = 4 − 6 + 2 = 0. Vậy tiếp điểm là ' +
          'M(2; 0).',
        "Bước 2 — Tính đạo hàm bằng bảng và quy tắc tổng: y' = 2x − 3. Chọn cách này thay vì dùng định nghĩa giới " +
          'hạn vì hàm đa thức đã có công thức sẵn, nhanh và không sai sót.',
        "Bước 3 — Tính hệ số góc tại tiếp điểm: y'(2) = 2·2 − 3 = 1. Con số 1 này chính là độ dốc của đồ thị ngay " +
          'tại điểm M.',
        'Bước 4 — Thay vào công thức tiếp tuyến y = k(x − x₀) + y₀: y = 1·(x − 2) + 0 = x − 2.',
        'Bước 5 — Kiểm chứng: thay x = 2 vào tiếp tuyến được y = 0, đúng đi qua M. Ngoài ra parabol có đỉnh tại ' +
          'x = 1,5; điểm x = 2 nằm bên phải đỉnh nên đồ thị đang đi lên, hệ số góc phải dương — kết quả k = 1 > 0 ' +
          'phù hợp.',
      ],
      answer: 'Tiếp tuyến có phương trình y = x − 2.',
    },
    checkQuestions: [
      {
        prompt: "Cho f(x) = x³ − 2x. Tính f'(1).",
        answer: { kind: 'numeric', value: 1 },
        explain:
          "f'(x) = 3x² − 2, nên f'(1) = 3 − 2 = 1. Lỗi hay gặp: quên hạ số mũ (viết 3x³) hoặc đạo hàm của −2x ra −2x " +
          'thay vì −2. Nhớ quy tắc: số mũ nhảy xuống làm hệ số rồi giảm đi 1 đơn vị.',
      },
      {
        prompt: 'Cho u(x) = x và v(x) = x. Giá trị đạo hàm của tích u·v tại x = 3 bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 6 },
        explain:
          "Đây là bẫy kiểm tra hiểu quy tắc tích. Nhiều bạn tính u'·v' = 1·1 = 1. SAI: đạo hàm của tích KHÔNG bằng " +
          "tích các đạo hàm. Quy tắc đúng: (uv)' = u'v + uv' = 1·x + x·1 = 2x, tại x = 3 cho 6. Kiểm độc lập: " +
          "u·v = x², mà (x²)' = 2x = 6 tại x = 3, khớp. Lý do có hai số hạng: cả hai thừa số đều đang biến thiên nên " +
          'mỗi cái đóng góp một phần vào sự thay đổi của tích.',
      },
      {
        prompt:
          'Tiếp tuyến của đồ thị hàm y = x² tại điểm có hoành độ x₀ = 3 có hệ số góc bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 6 },
        explain:
          "Hệ số góc của tiếp tuyến chính là giá trị đạo hàm tại tiếp điểm: y' = 2x, nên y'(3) = 6. Lỗi thường gặp " +
          'là trả lời 9, tức lấy TUNG ĐỘ của điểm (y = 3² = 9) thay vì độ dốc. Hãy phân biệt rõ: tung độ cho biết ' +
          'điểm đó CAO bao nhiêu, còn đạo hàm cho biết đồ thị tại đó DỐC bao nhiêu.',
      },
    ],
    srsCards: [
      {
        hoi: 'Ý nghĩa hình học của đạo hàm tại một điểm?',
        dap: 'Là hệ số góc của tiếp tuyến với đồ thị tại điểm đó.',
      },
      {
        hoi: 'Phương trình tiếp tuyến tại điểm có hoành độ x₀?',
        dap: "y = f'(x₀)(x − x₀) + f(x₀); chỉ dùng khi x₀ là hoành độ TIẾP ĐIỂM.",
      },
      {
        hoi: "Quy tắc đạo hàm của tích (u·v)'?",
        dap: "u'v + uv' — KHÔNG phải u'·v'.",
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
