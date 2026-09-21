// lessons/toan10c1.ts — Toán 10, Chương 1: Mệnh đề và tập hợp (2 bài).
import type { MathLesson } from '../lessonTypes.js'

export const TOAN10_C1_LESSONS: MathLesson[] = [
  {
    id: 'toan10-c1-b1',
    grade: '10',
    chapterNumber: 1,
    chapterTitle: 'Mệnh đề và tập hợp',
    lessonNumber: 1,
    title: 'Mệnh đề, mệnh đề kéo theo và mệnh đề phủ định',
    hook:
      'Trên bao bì một hộp sữa ở siêu thị có dòng chữ: "Nếu bảo quản lạnh dưới 6°C thì sữa giữ được 10 ngày". ' +
      'Hôm sau bạn thấy hộp sữa hỏng sau 4 ngày. Nhà sản xuất có nói sai không? Câu trả lời phụ thuộc vào một chuyện ' +
      'rất ít người để ý: hộp sữa đó có thật sự được để lạnh dưới 6°C hay không.',
    theory:
      'MỆNH ĐỀ LÀ GÌ\n' +
      'Mệnh đề (proposition) là một câu khẳng định mà ta xác định được nó ĐÚNG hay SAI, chứ không thể vừa đúng vừa sai. ' +
      '"Số 7 là số nguyên tố" là mệnh đề đúng. "Hà Nội nằm ở miền Nam" là mệnh đề sai. Còn "Mấy giờ rồi?" hay ' +
      '"Bài này khó quá!" KHÔNG phải mệnh đề vì không gán được giá trị đúng/sai.\n\n' +
      'VÌ SAO PHẢI ĐỊNH NGHĨA CHẶT NHƯ VẬY? Vì toàn bộ toán học được xây trên việc suy ra mệnh đề mới từ mệnh đề đã ' +
      'biết. Nếu một câu không xác định được đúng/sai thì không có gì để suy luận cả.\n\n' +
      'MỆNH ĐỀ CHỨA BIẾN\n' +
      '"x > 3" chưa đúng cũng chưa sai vì chưa biết x. Đó là mệnh đề chứa biến. Chỉ khi gán giá trị cho x, hoặc gắn ' +
      'thêm lượng từ (∀ — với mọi, ∃ — tồn tại), nó mới thành mệnh đề.\n\n' +
      'MỆNH ĐỀ KÉO THEO P ⇒ Q\n' +
      'Đọc là "nếu P thì Q". Quy ước bảng chân trị:\n' +
      '— P đúng, Q đúng → P ⇒ Q ĐÚNG.\n' +
      '— P đúng, Q sai  → P ⇒ Q SAI.\n' +
      '— P sai (dù Q đúng hay sai) → P ⇒ Q vẫn ĐÚNG.\n' +
      'Dòng cuối gây khó chịu nhất, nhưng nó có lý do: một lời hứa "nếu trời mưa thì tôi mang ô" chỉ bị coi là thất ' +
      'hứa khi trời ĐÃ mưa mà người đó không mang ô. Trời không mưa thì lời hứa không bị vi phạm. Đó chính là hộp sữa ' +
      'ở đầu bài: nếu hộp sữa không hề được để lạnh dưới 6°C thì giả thiết P sai, nên nhà sản xuất không nói sai.\n\n' +
      'ĐIỀU KIỆN CẦN VÀ ĐIỀU KIỆN ĐỦ\n' +
      'Với P ⇒ Q đúng: P là điều kiện ĐỦ để có Q; Q là điều kiện CẦN để có P. Ghi nhớ theo chiều mũi tên: cái đứng ' +
      'trước là đủ, cái đứng sau là cần.\n\n' +
      'MỆNH ĐỀ PHỦ ĐỊNH\n' +
      'Phủ định của P, ký hiệu P̄, đúng khi P sai và ngược lại. Hai quy tắc phải thuộc lòng:\n' +
      '— Phủ định của "∀x ∈ X, P(x)" là "∃x ∈ X, P(x) sai".\n' +
      '— Phủ định của "∃x ∈ X, P(x)" là "∀x ∈ X, P(x) sai".\n' +
      'Tức là khi phủ định, lượng từ ĐỔI (mọi ↔ tồn tại) và phần bên trong bị phủ định. Lý do rất tự nhiên: để bác bỏ ' +
      'câu "mọi học sinh lớp tôi đều cao trên 1m60", ta chỉ cần chỉ ra MỘT bạn cao dưới hoặc bằng 1m60, chứ không cần ' +
      'chứng minh cả lớp đều thấp.\n\n' +
      'GIỚI HẠN CẦN NHỚ: phủ định của "x > 3" là "x ≤ 3" chứ KHÔNG phải "x < 3". Quên dấu bằng là lỗi mất điểm ' +
      'thường gặp nhất ở chương này.',
    workedExample: {
      problem:
        'Cho mệnh đề P: "∀x ∈ ℝ, x² + 1 > 0". Hãy (a) xét tính đúng sai của P, (b) viết mệnh đề phủ định của P và ' +
        'xét tính đúng sai của nó.',
      steps: [
        'Bước 1 — Hiểu P đang nói gì: P khẳng định với MỌI số thực x, biểu thức x² + 1 luôn dương. Muốn P sai thì phải ' +
          'tìm được ít nhất một x làm x² + 1 ≤ 0.',
        'Bước 2 — Xét dấu biểu thức: với mọi x ∈ ℝ ta có x² ≥ 0 (bình phương một số thực không bao giờ âm), suy ra ' +
          'x² + 1 ≥ 1 > 0. Không tồn tại x nào làm biểu thức ≤ 0, nên P ĐÚNG.',
        'Bước 3 — Phủ định: đổi lượng từ ∀ thành ∃ và phủ định phần bên trong. Phủ định của "x² + 1 > 0" là ' +
          '"x² + 1 ≤ 0" (phải có dấu bằng). Vậy P̄: "∃x ∈ ℝ, x² + 1 ≤ 0".',
        'Bước 4 — Kết luận về P̄: vì P đúng nên P̄ sai. Kiểm chứng độc lập: ta vừa chứng minh x² + 1 ≥ 1 với mọi x, ' +
          'nên không có x nào thoả x² + 1 ≤ 0, đúng là P̄ sai.',
      ],
      answer: 'P đúng; P̄: "∃x ∈ ℝ, x² + 1 ≤ 0" và P̄ sai.',
    },
    checkQuestions: [
      {
        prompt: 'Mệnh đề phủ định của "∀x ∈ ℝ, x² > 5" là mệnh đề nào?',
        choices: [
          { id: 'a', label: '∃x ∈ ℝ, x² ≤ 5' },
          { id: 'b', label: '∃x ∈ ℝ, x² < 5' },
          { id: 'c', label: '∀x ∈ ℝ, x² ≤ 5' },
          { id: 'd', label: '∀x ∈ ℝ, x² < 5' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain:
          'Đây là câu bẫy đúp. Lỗi thứ nhất: giữ nguyên lượng từ ∀ (đáp án c, d) — phủ định phải ĐỔI ∀ thành ∃, vì bác ' +
          'bỏ "mọi x" chỉ cần chỉ ra MỘT phản ví dụ. Lỗi thứ hai: bỏ mất dấu bằng (đáp án b) — phủ định của "x² > 5" ' +
          'gồm cả trường hợp x² bằng đúng 5, nên phải là "x² ≤ 5". Cả hai lỗi gộp lại cho đáp án a là đúng.',
      },
      {
        prompt:
          'Biết mệnh đề "Nếu một tứ giác là hình vuông thì nó là hình thoi" là đúng. Trong hai khẳng định sau, ' +
          'khẳng định nào đúng: (1) "Là hình vuông" là điều kiện đủ để "là hình thoi"; (2) "Là hình vuông" là điều ' +
          'kiện cần để "là hình thoi"?',
        choices: [
          { id: 'du', label: 'Chỉ (1) đúng' },
          { id: 'can', label: 'Chỉ (2) đúng' },
          { id: 'ca_hai', label: 'Cả (1) và (2) đều đúng' },
        ],
        answer: { kind: 'choice', correctIds: ['du'] },
        explain:
          'Nhiều bạn nhầm "cần" và "đủ" vì cả hai đều nghe như "quan trọng". Hãy bám mũi tên P ⇒ Q: cái ĐỨNG TRƯỚC ' +
          'là điều kiện ĐỦ, cái ĐỨNG SAU là điều kiện CẦN. Ở đây P = "hình vuông", Q = "hình thoi", nên hình vuông là ' +
          'điều kiện đủ. Nó không phải điều kiện cần, vì có hình thoi (cạnh bằng nhau nhưng góc không vuông) mà không ' +
          'phải hình vuông.',
      },
      {
        prompt:
          'Mệnh đề kéo theo "Nếu 2 là số lẻ thì 2 + 2 = 5" có giá trị chân lý là gì? Nhập 1 nếu ĐÚNG, nhập 0 nếu SAI.',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'Rất nhiều bạn trả lời SAI vì thấy cả hai vế đều sai. Nhưng bảng chân trị quy ước: khi giả thiết P sai thì ' +
          'mệnh đề P ⇒ Q luôn ĐÚNG, bất kể Q. Ở đây P = "2 là số lẻ" sai, nên cả mệnh đề đúng. Cách nhớ theo đời ' +
          'thường: lời hứa chỉ bị vi phạm khi điều kiện đã xảy ra mà kết luận không xảy ra.',
      },
    ],
    srsCards: [
      {
        hoi: 'Khi nào mệnh đề P ⇒ Q sai?',
        dap: 'Chỉ khi P đúng và Q sai. Mọi trường hợp còn lại đều đúng.',
      },
      {
        hoi: 'Phủ định của "∀x ∈ X, P(x)" là gì?',
        dap: '"∃x ∈ X, P(x) sai" — đổi lượng từ và phủ định phần bên trong.',
      },
      {
        hoi: 'Trong P ⇒ Q đúng, cái nào là điều kiện cần, cái nào là điều kiện đủ?',
        dap: 'P (đứng trước) là điều kiện đủ; Q (đứng sau) là điều kiện cần.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan10-c1-b2',
    grade: '10',
    chapterNumber: 1,
    chapterTitle: 'Mệnh đề và tập hợp',
    lessonNumber: 2,
    title: 'Tập hợp và các phép toán trên tập hợp',
    hook:
      'Lớp 10A1 có 40 bạn. Khi đăng ký câu lạc bộ, 25 bạn chọn bóng đá, 18 bạn chọn cờ vua, 7 bạn chọn cả hai. ' +
      'Cô giáo cần biết còn bao nhiêu bạn chưa đăng ký câu lạc bộ nào để nhắc riêng. Cộng 25 + 18 = 43 thì lại nhiều ' +
      'hơn cả sĩ số lớp — chỗ nào đã bị đếm thừa?',
    theory:
      'TẬP HỢP VÀ CÁCH XÁC ĐỊNH\n' +
      'Tập hợp (set) là một nhóm các đối tượng được xác định rõ ràng. Hai cách viết:\n' +
      '— Liệt kê phần tử: A = {1; 2; 3; 6}.\n' +
      '— Nêu tính chất đặc trưng: A = {x ∈ ℕ | x là ước của 6}.\n' +
      'Hai cách này mô tả CÙNG một tập hợp. Cách liệt kê tiện khi ít phần tử; cách nêu tính chất bắt buộc phải dùng ' +
      'khi tập vô hạn, ví dụ B = {x ∈ ℝ | x ≥ 2}.\n\n' +
      'TẬP CON VÀ TẬP BẰNG NHAU\n' +
      'A ⊂ B khi mọi phần tử của A đều thuộc B. A = B khi A ⊂ B và B ⊂ A. Tập rỗng ∅ là tập con của MỌI tập hợp — ' +
      'vì để phủ định "∅ ⊂ B" ta phải tìm một phần tử của ∅ không thuộc B, mà ∅ không có phần tử nào.\n\n' +
      'BỐN PHÉP TOÁN\n' +
      '— Giao: A ∩ B = {x | x ∈ A VÀ x ∈ B} — phần dùng chung.\n' +
      '— Hợp: A ∪ B = {x | x ∈ A HOẶC x ∈ B} — gộp lại, phần chung chỉ tính MỘT lần.\n' +
      '— Hiệu: A \\ B = {x | x ∈ A và x ∉ B} — thuộc A nhưng không thuộc B.\n' +
      '— Phần bù: khi A ⊂ E thì C_E A = E \\ A.\n' +
      'Chú ý hợp và giao có tính giao hoán (A ∪ B = B ∪ A) nhưng HIỆU thì KHÔNG: A \\ B khác B \\ A.\n\n' +
      'CÔNG THỨC ĐẾM PHẦN TỬ (nguyên lý bù trừ)\n' +
      'n(A ∪ B) = n(A) + n(B) − n(A ∩ B).\n' +
      'VÌ SAO phải trừ đi n(A ∩ B)? Khi cộng n(A) + n(B), những phần tử nằm ở CẢ HAI tập đã bị đếm hai lần, nên phải ' +
      'trừ bớt một lần. Đây chính là lời giải cho tình huống đầu bài.\n\n' +
      'CÁC TẬP CON CỦA ℝ THƯỜNG DÙNG\n' +
      'Đoạn [a; b], khoảng (a; b), nửa khoảng [a; b) và (a; b]. Khi lấy giao/hợp các khoảng, nên VẼ TRỤC SỐ rồi đọc ' +
      'kết quả, đừng làm nhẩm trong đầu — đó là nguồn sai lầm chủ yếu ở dạng bài này. Lưu ý đầu mút: giao của [1; 3] ' +
      'và (3; 5) là ∅ vì số 3 không thuộc khoảng mở (3; 5).',
    animation: {
      title: 'Nguyên lý bù trừ trên biểu đồ Ven',
      description:
        'Hai hình tròn biểu diễn tập A (bóng đá, 25 bạn) và tập B (cờ vua, 18 bạn) tiến lại gần nhau rồi chồng lên ' +
        'nhau. Phần giao được tô đậm cho thấy 7 bạn nằm trong cả hai tập đã bị đếm hai lần khi cộng 25 + 18, nên ' +
        'phải trừ đi một lần để được số bạn tham gia ít nhất một câu lạc bộ là 36.',
      viewBoxWidth: 400,
      viewBoxHeight: 220,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'tapA',
          cx: 150,
          cy: 110,
          r: 70,
          stroke: 'primary',
          strokeWidth: 3,
          fill: 'surface',
          opacity: 0.6,
          keyframes: [
            { atMs: 0, dx: -40 },
            { atMs: 2500, dx: 0 },
            { atMs: 6000, dx: 0 },
          ],
        },
        {
          kind: 'circle',
          id: 'tapB',
          cx: 250,
          cy: 110,
          r: 70,
          stroke: 'accent',
          strokeWidth: 3,
          fill: 'surface',
          opacity: 0.6,
          keyframes: [
            { atMs: 0, dx: 40 },
            { atMs: 2500, dx: 0 },
            { atMs: 6000, dx: 0 },
          ],
        },
        {
          kind: 'circle',
          id: 'phanGiao',
          cx: 200,
          cy: 110,
          r: 26,
          fill: 'warn',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 2600, opacity: 0 },
            { atMs: 3600, opacity: 0.75 },
            { atMs: 6000, opacity: 0.75 },
          ],
        },
        {
          kind: 'label',
          id: 'nhanA',
          x: 118,
          y: 60,
          text: 'A: bóng đá (25)',
          size: 14,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'nhanB',
          x: 286,
          y: 60,
          text: 'B: cờ vua (18)',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
        },
        {
          kind: 'label',
          id: 'nhanGiao',
          x: 200,
          y: 115,
          text: '7',
          size: 18,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'ketQua',
          x: 200,
          y: 205,
          text: '25 + 18 − 7 = 36 bạn',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 4200, opacity: 0 },
            { atMs: 5000, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
      ],
      captions: [
        { atMs: 0, text: 'Hai câu lạc bộ ban đầu được đếm tách rời: 25 và 18.' },
        { atMs: 2600, text: 'Chúng chồng lên nhau — 7 bạn tham gia cả hai.' },
        { atMs: 3600, text: 'Vùng tô đậm này đã bị đếm HAI lần trong phép cộng.' },
        { atMs: 5000, text: 'Trừ bớt một lần: n(A ∪ B) = 25 + 18 − 7 = 36.' },
      ],
    },
    workedExample: {
      problem:
        'Lớp 10A1 có 40 học sinh: 25 bạn đăng ký câu lạc bộ bóng đá, 18 bạn đăng ký cờ vua, 7 bạn đăng ký cả hai. ' +
        'Hỏi có bao nhiêu bạn chưa đăng ký câu lạc bộ nào?',
      steps: [
        'Bước 1 — Đặt tên tập hợp để bài toán thành ngôn ngữ tập hợp: gọi A là tập các bạn đăng ký bóng đá, B là tập ' +
          'các bạn đăng ký cờ vua. Ta có n(A) = 25, n(B) = 18, n(A ∩ B) = 7, tổng số học sinh n(E) = 40.',
        'Bước 2 — Nhận ra câu hỏi thực chất hỏi gì: "chưa đăng ký câu lạc bộ nào" nghĩa là không thuộc A và cũng ' +
          'không thuộc B, tức là thuộc phần bù của A ∪ B trong lớp. Vậy phải tính n(A ∪ B) trước.',
        'Bước 3 — Áp dụng nguyên lý bù trừ (chọn công thức này vì hai tập có phần chung khác rỗng): ' +
          'n(A ∪ B) = n(A) + n(B) − n(A ∩ B) = 25 + 18 − 7 = 36. Nếu quên trừ 7 sẽ ra 43 > 40, vô lý — đây là mẹo ' +
          'tự kiểm tra rất nhanh.',
        'Bước 4 — Lấy phần bù: số bạn chưa đăng ký = n(E) − n(A ∪ B) = 40 − 36 = 4.',
      ],
      answer: 'Có 4 học sinh chưa đăng ký câu lạc bộ nào.',
    },
    checkQuestions: [
      {
        prompt: 'Cho A = [1; 5] và B = (3; 7). Xác định tập A ∩ B.',
        choices: [
          { id: 'a', label: '(3; 5]' },
          { id: 'b', label: '[3; 5]' },
          { id: 'c', label: '[1; 7)' },
          { id: 'd', label: '(3; 5)' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain:
          'Lỗi phổ biến nhất là bỏ qua kiểu đầu mút: nhiều bạn chọn [3; 5]. Số 3 KHÔNG thuộc B vì B = (3; 7) là ' +
          'khoảng mở, nên 3 không thể thuộc giao — đầu mút trái phải mở. Còn số 5 thuộc cả A (đoạn đóng) lẫn B ' +
          '(vì 3 < 5 < 7) nên đầu mút phải phải đóng. Kết quả là (3; 5]. Cách tránh sai: vẽ trục số, tô hai đoạn ' +
          'bằng hai màu rồi kiểm riêng từng đầu mút.',
      },
      {
        prompt:
          'Một tổ có 30 bạn: 20 bạn biết bơi, 15 bạn biết đi xe đạp, 3 bạn không biết cả hai kỹ năng. Hỏi có bao ' +
          'nhiêu bạn biết cả bơi lẫn đi xe đạp?',
        answer: { kind: 'numeric', value: 8 },
        explain:
          'Trước hết, số bạn biết ít nhất một kỹ năng là 30 − 3 = 27, đó chính là n(A ∪ B). Áp dụng nguyên lý bù trừ ' +
          'theo chiều ngược: n(A ∩ B) = n(A) + n(B) − n(A ∪ B) = 20 + 15 − 27 = 8. Lỗi hay gặp là lấy ngay ' +
          '20 + 15 − 30 = 5, tức là dùng nhầm sĩ số 30 thay cho 27 — nhưng 3 bạn không biết gì không nằm trong A ∪ B ' +
          'nên không được tính vào đó.',
      },
      {
        prompt: 'Cho A = {1; 2; 3; 4} và B = {3; 4; 5}. Tập A \\ B có bao nhiêu phần tử?',
        answer: { kind: 'numeric', value: 2 },
        explain:
          'A \\ B gồm các phần tử thuộc A mà không thuộc B, tức {1; 2}, có 2 phần tử. Bẫy ở đây là nhầm A \\ B với ' +
          'B \\ A = {5} (1 phần tử) hoặc coi hiệu có tính giao hoán như hợp và giao. Phép hiệu KHÔNG giao hoán: ' +
          'thứ tự viết quyết định kết quả.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức đếm số phần tử của hợp hai tập hợp?',
        dap: 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B); trừ đi phần chung vì nó đã bị đếm hai lần.',
      },
      {
        hoi: 'A \\ B và B \\ A có bằng nhau không?',
        dap: 'Không. Phép hiệu không giao hoán; A \\ B gồm phần thuộc A mà không thuộc B.',
      },
      {
        hoi: 'Giao của [1; 3] và (3; 5) bằng gì?',
        dap: 'Tập rỗng ∅, vì số 3 không thuộc khoảng mở (3; 5).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
