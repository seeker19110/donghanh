// lessons/toan12c2.ts — Toán 12, Chương 2: Vectơ và hệ trục toạ độ trong không gian.
// Nội dung tự soạn theo công thức chuẩn (sự thật toán học), KHÔNG chép ví dụ SGK.
// Trạng thái `draft` — chờ người có chuyên môn Toán duyệt qua quy trình lessonReview.
import type { MathLesson } from '../lessonTypes.js'

const CHUONG = 'Vectơ và hệ trục toạ độ trong không gian'

export const TOAN12_C2_LESSONS: MathLesson[] = [
  {
    id: 'toan12-c2-b1',
    grade: '12',
    chapterNumber: 2,
    chapterTitle: CHUONG,
    lessonNumber: 1,
    title: 'Vectơ trong không gian và các phép toán',
    hook:
      'Một chiếc flycam cất cánh từ sân trường, bay chếch về phía cổng 30 mét, rồi vọt thẳng lên thêm 40 mét. ' +
      'Người điều khiển chỉ muốn biết một điều: từ chỗ đứng tới chỗ flycam đang treo là bao xa, và theo hướng nào. ' +
      'Hai chặng bay ấy chính là hai vectơ, và câu trả lời nằm gọn trong phép CỘNG vectơ trong không gian.',
    theory:
      'VECTƠ TRONG KHÔNG GIAN LÀ GÌ\n' +
      'Vectơ trong không gian cũng là một đoạn thẳng có hướng, hoàn toàn giống vectơ trong mặt phẳng: có điểm đầu, ' +
      'điểm cuối, có phương, chiều và độ dài. Điểm khác duy nhất là nó được tự do di chuyển trong không gian ba ' +
      'chiều chứ không bị ép nằm trên một mặt phẳng.\n' +
      'Hai vectơ bằng nhau khi CÙNG HƯỚNG và CÙNG ĐỘ DÀI — vị trí đặt không quan trọng. Chính tính "tự do dời chỗ" ' +
      'này khiến mọi quy tắc học ở mặt phẳng vẫn dùng lại được nguyên vẹn.\n\n' +
      'PHÉP CỘNG — QUY TẮC BA ĐIỂM\n' +
      'Với ba điểm M, N, P bất kì (không cần thẳng hàng, không cần đồng phẳng):\n' +
      'MN→ + NP→ = MP→.\n' +
      'VÌ SAO ĐÚNG: đi từ M tới N rồi từ N tới P thì kết quả cuối cùng của hành trình đúng bằng đi thẳng từ M tới P. ' +
      'Vectơ ghi lại ĐỘ DỜI, mà độ dời thì cộng dồn được — đó là toàn bộ lí do, không phải quy ước.\n' +
      'Hệ quả hay dùng: MN→ = −NM→; và với điểm O tuỳ ý thì MN→ = ON→ − OM→ (chèn thêm điểm O vào giữa).\n\n' +
      'PHÉP TRỪ\n' +
      'a⃗ − b⃗ = a⃗ + (−b⃗). Với hai vectơ chung điểm đầu: OA→ − OB→ = BA→. Cách nhớ: hiệu chạy TỪ điểm cuối của ' +
      'vectơ đứng SAU (vectơ trừ) TỚI điểm cuối của vectơ đứng TRƯỚC.\n\n' +
      'NHÂN VECTƠ VỚI MỘT SỐ\n' +
      'Với số thực k ≠ 0, vectơ k·a⃗ cùng phương với a⃗, có độ dài |k|·|a⃗|; cùng hướng khi k > 0, ngược hướng khi ' +
      'k < 0. Do đó hai vectơ khác 0⃗ CÙNG PHƯƠNG khi và chỉ khi tồn tại k sao cho b⃗ = k·a⃗ — đây là công cụ chuẩn ' +
      'để chứng minh ba điểm thẳng hàng: A, B, C thẳng hàng ⇔ AC→ = k·AB→.\n\n' +
      'QUY TẮC HÌNH HỘP (đặc sản của không gian)\n' +
      'Cho hình hộp ABCD.A′B′C′D′. Khi đó AB→ + AD→ + AA′→ = AC′→.\n' +
      'VÌ SAO: ba vectơ xuất phát từ A chạy theo ba cạnh KHÔNG ĐỒNG PHẲNG của hình hộp; cộng liên tiếp hai lần theo ' +
      'quy tắc ba điểm sẽ đưa ta men theo các cạnh tới đúng đỉnh đối diện C′. Quy tắc hình bình hành trong mặt phẳng ' +
      'chỉ cộng được hai vectơ; ra không gian ta cộng được ba, và đường chéo hình hộp đóng vai trò tổng.\n\n' +
      'TRUNG ĐIỂM VÀ TRỌNG TÂM (hai đẳng thức phải thuộc)\n' +
      '— I là trung điểm AB ⇔ IA→ + IB→ = 0⃗ ⇔ với O bất kì: OA→ + OB→ = 2·OI→.\n' +
      '— G là trọng tâm tam giác ABC ⇔ GA→ + GB→ + GC→ = 0⃗ ⇔ OA→ + OB→ + OC→ = 3·OG→.\n' +
      'LỖI HAY MẮC: viết MN→ + PQ→ = MQ→ khi N và P là hai điểm khác nhau. Quy tắc ba điểm chỉ áp dụng khi điểm ' +
      'CUỐI của vectơ trước TRÙNG điểm ĐẦU của vectơ sau — phải chèn điểm trung gian cho khớp trước đã.',
    animation: {
      title: 'Quy tắc hình hộp: ba cạnh cộng lại thành đường chéo',
      description:
        'Một hình hộp được vẽ ở dạng phối cảnh. Ba mũi tên xuất phát từ đỉnh A chạy dọc ba cạnh tới các đỉnh B, D ' +
        'và A phẩy lần lượt hiện ra, sau đó một mũi tên dài nối thẳng từ A tới đỉnh đối diện C phẩy xuất hiện, cho ' +
        'thấy tổng của ba vectơ cạnh chính là vectơ đường chéo của hình hộp.',
      viewBoxWidth: 360,
      viewBoxHeight: 240,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'polyline',
          id: 'matTruoc',
          points: [
            [60, 90],
            [200, 90],
            [200, 190],
            [60, 190],
          ],
          closed: true,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'polyline',
          id: 'matSau',
          points: [
            [120, 50],
            [260, 50],
            [260, 150],
            [120, 150],
          ],
          closed: true,
          stroke: 'muted',
          strokeWidth: 2,
        },
        { kind: 'line', id: 'noi1', x1: 60, y1: 90, x2: 120, y2: 50, stroke: 'muted' },
        { kind: 'line', id: 'noi2', x1: 200, y1: 90, x2: 260, y2: 50, stroke: 'muted' },
        { kind: 'line', id: 'noi3', x1: 200, y1: 190, x2: 260, y2: 150, stroke: 'muted' },
        { kind: 'line', id: 'noi4', x1: 60, y1: 190, x2: 120, y2: 150, stroke: 'muted' },
        {
          kind: 'arrow',
          id: 'vecAB',
          x1: 60,
          y1: 190,
          x2: 200,
          y2: 190,
          stroke: 'primary',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 600, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'arrow',
          id: 'vecAD',
          x1: 60,
          y1: 190,
          x2: 120,
          y2: 150,
          stroke: 'primary',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1600, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'arrow',
          id: 'vecAA',
          x1: 60,
          y1: 190,
          x2: 60,
          y2: 90,
          stroke: 'primary',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 2600, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'arrow',
          id: 'vecCheo',
          x1: 60,
          y1: 190,
          x2: 260,
          y2: 50,
          stroke: 'accent',
          strokeWidth: 4,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3800, opacity: 0 },
            { atMs: 4400, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        { kind: 'label', id: 'nA', x: 52, y: 205, text: 'A', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nB', x: 205, y: 205, text: 'B', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nD', x: 124, y: 143, text: 'D', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nA2', x: 46, y: 86, text: "A'", size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nC2', x: 266, y: 44, text: "C'", size: 14, fill: 'neutral' },
      ],
      captions: [
        { atMs: 600, text: 'Vectơ thứ nhất chạy dọc cạnh AB.' },
        { atMs: 1600, text: 'Vectơ thứ hai chạy dọc cạnh AD.' },
        { atMs: 2600, text: "Vectơ thứ ba chạy dọc cạnh đứng AA'." },
        { atMs: 4400, text: "Tổng ba vectơ là đường chéo AC' của hình hộp." },
      ],
    },
    workedExample: {
      problem:
        'Cho hình hộp chữ nhật ABCD.A′B′C′D′ có AB = 2, AD = 3, AA′ = 6. Tính độ dài của vectơ tổng ' +
        'u⃗ = AB→ + AD→ + AA′→.',
      steps: [
        'Bước 1 — Nhận dạng: ba vectơ đều xuất phát từ A và chạy dọc ba cạnh không đồng phẳng của hình hộp, đúng ' +
          'khuôn quy tắc hình hộp.',
        'Bước 2 — Áp quy tắc hình hộp: AB→ + AD→ + AA′→ = AC′→, tức tổng chính là vectơ đường chéo của hình hộp.',
        'Bước 3 — Việc còn lại chỉ là tính độ dài đường chéo. Vì hình hộp là hình hộp CHỮ NHẬT nên ba cạnh đôi một ' +
          'vuông góc, dùng định lí Pythagore hai lần: AC² = AB² + AD² = 4 + 9 = 13.',
        'Bước 4 — Tiếp tục với cạnh đứng: AC′² = AC² + AA′² = 13 + 36 = 49, suy ra AC′ = 7.',
        'Bước 5 — Kết luận: |u⃗| = 7. Lưu ý điều kiện "chữ nhật" đã được dùng ở bước 3; với hình hộp xiên thì công ' +
          'thức Pythagore không còn áp được và phải dùng tích vô hướng.',
      ],
      answer: '|u⃗| = |AC′→| = 7.',
    },
    checkQuestions: [
      {
        prompt:
          'Cho hình hộp chữ nhật ABCD.A′B′C′D′ có AB = 1, AD = 2, AA′ = 2. Tính độ dài của vectơ ' +
          'AB→ + AD→ + AA′→.',
        answer: { kind: 'numeric', value: 3 },
        explain:
          'Theo quy tắc hình hộp, tổng ba vectơ cạnh xuất phát từ A chính là vectơ đường chéo AC′→. Vì hình hộp là ' +
          'hình hộp chữ nhật nên ba cạnh đôi một vuông góc, độ dài đường chéo bằng căn bậc hai của tổng bình phương ' +
          'ba cạnh: √(1² + 2² + 2²) = √9 = 3. Sai lầm phổ biến là cộng thẳng ba độ dài thành 1 + 2 + 2 = 5 — tổng ' +
          'vectơ KHÔNG phải tổng độ dài, vì ba vectơ không cùng hướng.',
      },
      {
        prompt:
          'Cho bốn điểm M, N, P, Q. Biểu thức MN→ + NP→ + PQ→ rút gọn được thành vectơ nào? ' +
          'Chọn đáp án đúng.',
        choices: [
          { id: 'A', label: 'MQ→' },
          { id: 'B', label: 'QM→' },
          { id: 'C', label: 'MP→' },
          { id: 'D', label: '0⃗' },
        ],
        answer: { kind: 'choice', correctIds: ['A'] },
        explain:
          'Áp quy tắc ba điểm lần lượt: MN→ + NP→ = MP→ (điểm cuối N của vectơ trước trùng điểm đầu của vectơ sau), ' +
          'rồi MP→ + PQ→ = MQ→. Bản chất là cộng dồn độ dời: đi M → N → P → Q thì kết quả bằng đi thẳng M → Q, bất kể ' +
          'bốn điểm có đồng phẳng hay không. Đáp án QM→ là kết quả ngược hướng, sai dấu.',
      },
      {
        prompt:
          'Cho hình lập phương cạnh 4. Tính độ dài vectơ tổng của ba vectơ chạy dọc ba cạnh cùng xuất phát từ một ' +
          'đỉnh của hình lập phương. Làm tròn đến hàng phần trăm.',
        answer: { kind: 'numeric', value: 6.93, tolerance: { mode: 'absolute', eps: 0.01 } },
        explain:
          'Vẫn là quy tắc hình hộp: tổng bằng đường chéo của hình lập phương, độ dài bằng a√3 với a là cạnh. Ở đây ' +
          'a = 4 nên kết quả là 4√3 = 6,928… ≈ 6,93. Nếu nhớ nhầm đường chéo MẶT (a√2 ≈ 5,66) thì sẽ thiếu mất một ' +
          'chiều — đường chéo hình lập phương nối hai đỉnh đối diện qua RUỘT khối, không nằm trên mặt nào cả.',
      },
      {
        prompt:
          'Cho ba điểm A, B, C thẳng hàng và AC→ = 3·AB→. Biết AB = 5, tính độ dài đoạn thẳng AC.',
        answer: { kind: 'numeric', value: 15 },
        explain:
          'Khi b⃗ = k·a⃗ thì |b⃗| = |k|·|a⃗|. Ở đây k = 3 > 0 nên AC→ cùng hướng AB→ và AC = 3·AB = 3·5 = 15. ' +
          'Đẳng thức AC→ = k·AB→ chính là điều kiện chuẩn để ba điểm A, B, C thẳng hàng; dấu của k cho biết C nằm ' +
          'cùng phía hay khác phía với B so với A.',
      },
    ],
    srsCards: [
      {
        hoi: 'Phát biểu quy tắc ba điểm cho vectơ trong không gian.',
        dap: 'MN→ + NP→ = MP→ với M, N, P bất kì — vì vectơ ghi lại độ dời và độ dời cộng dồn được.',
      },
      {
        hoi: 'Quy tắc hình hộp nói gì?',
        dap: 'Với hình hộp ABCD.A′B′C′D′: AB→ + AD→ + AA′→ = AC′→ (tổng ba cạnh từ A là đường chéo).',
      },
      {
        hoi: 'Điều kiện để ba điểm A, B, C thẳng hàng, viết bằng vectơ?',
        dap: 'Tồn tại số thực k sao cho AC→ = k·AB→ (hai vectơ cùng phương).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan12-c2-b2',
    grade: '12',
    chapterNumber: 2,
    chapterTitle: CHUONG,
    lessonNumber: 2,
    title: 'Toạ độ của điểm và của vectơ trong không gian Oxyz',
    hook:
      'Một kho hàng ở khu công nghiệp đánh số vị trí kệ theo ba con số: dãy thứ mấy, hàng thứ mấy, tầng thứ mấy. ' +
      'Chỉ ba con số ấy là robot lấy hàng tìm đúng thùng giữa hàng nghìn thùng giống hệt nhau. Hệ trục Oxyz làm ' +
      'đúng việc đó cho toàn bộ không gian: biến một vị trí thành một bộ ba số tính toán được.',
    theory:
      'HỆ TRỤC TOẠ ĐỘ Oxyz\n' +
      'Gồm ba trục Ox, Oy, Oz đôi một VUÔNG GÓC, cắt nhau tại gốc O. Trên mỗi trục đặt một vectơ đơn vị: i⃗ trên Ox, ' +
      'j⃗ trên Oy, k⃗ trên Oz. Ba vectơ này đôi một vuông góc và đều có độ dài 1.\n\n' +
      'TOẠ ĐỘ CỦA VECTƠ\n' +
      'Vì i⃗, j⃗, k⃗ không đồng phẳng nên MỌI vectơ u⃗ trong không gian viết được DUY NHẤT dưới dạng\n' +
      'u⃗ = x·i⃗ + y·j⃗ + z·k⃗, và ta viết gọn u⃗ = (x; y; z).\n' +
      'VÌ SAO "duy nhất" là điều then chốt: nhờ tính duy nhất mà hai vectơ bằng nhau KHI VÀ CHỈ KHI ba thành phần ' +
      'toạ độ tương ứng bằng nhau. Toàn bộ việc "giải bài hình bằng đại số" dựa trên đúng câu đó.\n\n' +
      'TOẠ ĐỘ CỦA ĐIỂM\n' +
      'Điểm M có toạ độ (x; y; z) nghĩa là vectơ OM→ = (x; y; z). Nói cách khác, toạ độ của điểm chính là toạ độ ' +
      'của vectơ nối từ GỐC O tới điểm đó. Đây là chỗ nhiều bạn lẫn: điểm và vectơ viết giống nhau nhưng điểm cần ' +
      'gốc O làm mốc, còn vectơ thì không.\n\n' +
      'TOẠ ĐỘ VECTƠ NỐI HAI ĐIỂM — CÔNG THỨC DÙNG NHIỀU NHẤT CẢ CHƯƠNG\n' +
      'Với A(x_A; y_A; z_A) và B(x_B; y_B; z_B):\n' +
      'AB→ = (x_B − x_A; y_B − y_A; z_B − z_A) — "toạ độ ĐIỂM CUỐI trừ toạ độ ĐIỂM ĐẦU".\n' +
      'CHỨNG MINH một dòng: AB→ = OB→ − OA→ (hệ quả quy tắc ba điểm), mà trừ hai vectơ thì trừ theo từng thành phần.\n' +
      'LỖI SỐ MỘT CỦA CẢ CHƯƠNG: trừ ngược thành "đầu trừ cuối", ra vectơ đối. Mẹo kiểm nhanh: đi từ A(0;0;0) tới ' +
      'B(1;0;0) thì phải được (1;0;0) chứ không phải (−1;0;0).\n\n' +
      'TRUNG ĐIỂM VÀ TRỌNG TÂM BẰNG TOẠ ĐỘ\n' +
      '— Trung điểm I của AB: mỗi toạ độ là TRUNG BÌNH CỘNG hai toạ độ tương ứng, I((x_A+x_B)/2; (y_A+y_B)/2; ' +
      '(z_A+z_B)/2).\n' +
      '— Trọng tâm G của tam giác ABC: mỗi toạ độ là trung bình cộng BA toạ độ tương ứng.\n' +
      'Cả hai suy thẳng từ đẳng thức vectơ OA→ + OB→ = 2·OI→ và OA→ + OB→ + OC→ = 3·OG→ ở bài trước — không cần ' +
      'học thuộc rời rạc.',
    animation: {
      title: 'Ba bước đi tới điểm M(3; 4; 5) trong không gian Oxyz',
      description:
        'Hệ trục Oxyz được vẽ theo lối hình chiếu trục đo: trục Ox chếch về phía trước bên trái, trục Oy sang phải, trục Oz thẳng đứng lên trên. Để tới điểm M(3; 4; 5), ba bước đi lần lượt hiện ra đúng theo thứ tự ba toạ độ. Bước một đi 3 đơn vị dọc trục Ox tới điểm A(3; 0; 0). Bước hai rẽ theo phương Oy thêm 4 đơn vị tới B(3; 4; 0), là hình chiếu của M trên mặt phẳng Oxy. Bước ba đi lên theo phương Oz thêm 5 đơn vị thì đúng tới M. Cuối cùng vectơ OM được vẽ thẳng từ gốc tới M. Hình động cho thấy điều dãy ba con số không nói ra: toạ độ của một điểm chính là ba quãng đường nối tiếp theo ba phương của ba trục, và vectơ OM bằng 3i cộng 4j cộng 5k đúng theo quy tắc hình hộp chứ không phải một kí hiệu trừu tượng.',
      viewBoxWidth: 280,
      viewBoxHeight: 245,
      durationMs: 7000,
      loop: true,
      shapes: [
        {
          kind: 'arrow',
          id: 'truc-x',
          x1: 100,
          y1: 170,
          x2: 32.5,
          y2: 210.5,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'arrow',
          id: 'truc-y',
          x1: 100,
          y1: 170,
          x2: 243,
          y2: 203,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'arrow',
          id: 'truc-z',
          x1: 100,
          y1: 170,
          x2: 100,
          y2: 38,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'nhan-x',
          x: 14,
          y: 214,
          text: 'x',
          size: 14,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'nhan-y',
          x: 252,
          y: 210,
          text: 'y',
          size: 14,
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'nhan-z',
          x: 100,
          y: 30,
          text: 'z',
          size: 14,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'circle',
          id: 'goc-o',
          cx: 100,
          cy: 170,
          r: 4,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-o',
          x: 106,
          y: 186,
          text: 'O',
          size: 13,
          fill: 'neutral',
        },
        {
          kind: 'arrow',
          id: 'buoc-1',
          x1: 100,
          y1: 170,
          x2: 55,
          y2: 197,
          stroke: 'primary',
          strokeWidth: 3,
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
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-a',
          x: 56,
          y: 227,
          text: 'A(3; 0; 0)',
          size: 12,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 900,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'buoc-2',
          x1: 55,
          y1: 197,
          x2: 159,
          y2: 221,
          stroke: 'accent',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1800,
              opacity: 0,
            },
            {
              atMs: 2200,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-b',
          x: 170,
          y: 232,
          text: 'B(3; 4; 0)',
          size: 12,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2500,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'buoc-3',
          x1: 159,
          y1: 221,
          x2: 159,
          y2: 111,
          stroke: 'correct',
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
              atMs: 3800,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'diem-m',
          cx: 159,
          cy: 111,
          r: 6,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4200,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-m',
          x: 168,
          y: 104,
          text: 'M(3; 4; 5)',
          size: 13,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4200,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'vt-om',
          x1: 100,
          y1: 170,
          x2: 159,
          y2: 111,
          stroke: 'warn',
          strokeWidth: 4,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 5000,
              opacity: 0,
            },
            {
              atMs: 5500,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ct',
          x: 140,
          y: 62,
          text: 'OM = 3i + 4j + 5k',
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
              atMs: 5500,
              opacity: 0,
            },
            {
              atMs: 6000,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ghi-chu',
          x: 140,
          y: 243,
          text: 'toạ độ = ba quãng đi theo ba trục, nối tiếp nhau',
          size: 12,
          anchor: 'middle',
          fill: 'muted',
        },
      ],
      captions: [
        {
          atMs: 600,
          text: 'Bước 1: đi 3 đơn vị theo Ox tới A(3; 0; 0).',
        },
        {
          atMs: 2200,
          text: 'Bước 2: rẽ theo Oy thêm 4 đơn vị tới B(3; 4; 0) — hình chiếu của M trên mặt Oxy.',
        },
        {
          atMs: 3800,
          text: 'Bước 3: đi lên theo Oz thêm 5 đơn vị thì tới đúng M.',
        },
        {
          atMs: 5500,
          text: 'Nối thẳng O với M được vectơ OM.',
        },
        {
          atMs: 6000,
          text: 'OM = 3i + 4j + 5k — đúng ba bước vừa đi, gộp lại theo quy tắc hình hộp.',
        },
      ],
    },
    workedExample: {
      problem:
        'Trong không gian Oxyz cho A(1; 2; 3) và B(3; 5; 9). Tìm toạ độ vectơ AB→ và toạ độ trung điểm I của đoạn AB.',
      steps: [
        'Bước 1 — Xác định rõ đâu là điểm đầu, đâu là điểm cuối: vectơ AB→ đi TỪ A TỚI B, nên A là điểm đầu.',
        'Bước 2 — Lấy toạ độ điểm cuối trừ toạ độ điểm đầu theo từng thành phần: hoành độ 3 − 1 = 2, tung độ ' +
          '5 − 2 = 3, cao độ 9 − 3 = 6.',
        'Bước 3 — Vậy AB→ = (2; 3; 6). Kiểm nhanh bằng cảm giác: cả ba toạ độ của B đều lớn hơn của A nên ba thành ' +
          'phần đều dương, hợp lí.',
        'Bước 4 — Trung điểm I lấy trung bình cộng từng cặp toạ độ: (1+3)/2 = 2; (2+5)/2 = 3,5; (3+9)/2 = 6.',
        'Bước 5 — Kết luận: AB→ = (2; 3; 6) và I(2; 3,5; 6). Chú ý I là ĐIỂM nên viết trong ngoặc như một vị trí, ' +
          'còn AB→ là VECTƠ chỉ độ dời — hai đối tượng khác nhau dù cách viết giống nhau.',
      ],
      answer: 'AB→ = (2; 3; 6); trung điểm I(2; 3,5; 6).',
    },
    checkQuestions: [
      {
        prompt:
          'Trong không gian Oxyz cho A(1; 2; −3) và B(4; −2; 0). Tính HOÀNH ĐỘ (thành phần theo trục Ox) của ' +
          'vectơ AB→.',
        answer: { kind: 'numeric', value: 3 },
        explain:
          'Toạ độ vectơ nối hai điểm lấy điểm cuối trừ điểm đầu theo từng thành phần, nên hoành độ của AB→ bằng ' +
          'x_B − x_A = 4 − 1 = 3. Nếu trừ ngược thành 1 − 4 = −3 thì được vectơ BA→, tức vectơ ngược hướng — đây là ' +
          'lỗi phổ biến nhất của cả chương, luôn đọc kĩ tên vectơ để biết điểm nào là điểm đầu.',
      },
      {
        prompt:
          'Trong không gian Oxyz cho A(1; 2; −3) và B(4; −2; 0). Tính TUNG ĐỘ (thành phần theo trục Oy) của ' +
          'vectơ AB→.',
        answer: { kind: 'numeric', value: -4 },
        explain:
          'Tung độ của AB→ bằng y_B − y_A = (−2) − 2 = −4. Kết quả âm hoàn toàn bình thường: nó cho biết khi đi từ ' +
          'A sang B ta lùi ngược chiều dương của trục Oy. Sai lầm hay gặp là bỏ quên dấu ngoặc và tính thành ' +
          '−2 + 2 = 0, hoặc lấy giá trị tuyệt đối vì "độ dài không âm" — thành phần toạ độ không phải độ dài.',
      },
      {
        prompt:
          'Trong không gian Oxyz cho M(2; −1; 4) và N(6; 3; 4). Tính CAO ĐỘ (thành phần theo trục Oz) của trung ' +
          'điểm đoạn thẳng MN.',
        answer: { kind: 'numeric', value: 4 },
        explain:
          'Mỗi toạ độ của trung điểm là trung bình cộng hai toạ độ tương ứng, nên cao độ bằng (4 + 4)/2 = 4. Điều ' +
          'này hợp lí về mặt hình học: hai điểm có cùng cao độ nên cả đoạn thẳng nằm trong một mặt phẳng song song ' +
          'mặt phẳng Oxy, mọi điểm của nó đều có cao độ 4. Đừng nhầm trung điểm với vectơ MN→ (ở đó ta TRỪ chứ ' +
          'không lấy trung bình).',
      },
      {
        prompt:
          'Toạ độ của điểm M trong không gian Oxyz chính là toạ độ của vectơ nào? Chọn đáp án đúng.',
        choices: [
          { id: 'A', label: 'Vectơ OM→ nối gốc toạ độ O tới M' },
          { id: 'B', label: 'Vectơ MO→ nối M tới gốc toạ độ O' },
          { id: 'C', label: 'Vectơ đơn vị i⃗ của trục Ox' },
          { id: 'D', label: 'Vectơ 0⃗' },
        ],
        answer: { kind: 'choice', correctIds: ['A'] },
        explain:
          'Theo định nghĩa, M(x; y; z) nghĩa là OM→ = x·i⃗ + y·j⃗ + z·k⃗, tức toạ độ điểm là toạ độ vectơ đi TỪ GỐC ' +
          'O TỚI điểm đó. Chọn MO→ là chọn vectơ ngược hướng nên mọi toạ độ đổi dấu. Đây cũng là lí do vectơ không ' +
          'cần gốc mốc còn điểm thì có: điểm luôn được đo từ O.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức toạ độ vectơ AB→ theo toạ độ hai điểm A, B?',
        dap: 'AB→ = (x_B − x_A; y_B − y_A; z_B − z_A) — điểm cuối trừ điểm đầu.',
      },
      {
        hoi: 'Toạ độ điểm M nghĩa là gì?',
        dap: 'Là toạ độ của vectơ OM→, với O là gốc toạ độ.',
      },
      {
        hoi: 'Toạ độ trung điểm I của đoạn AB tính thế nào?',
        dap: 'Mỗi toạ độ của I là trung bình cộng hai toạ độ tương ứng của A và B.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan12-c2-b3',
    grade: '12',
    chapterNumber: 2,
    chapterTitle: CHUONG,
    lessonNumber: 3,
    title: 'Biểu thức toạ độ của phép toán vectơ và tích vô hướng',
    hook:
      'Hai chiếc cần cẩu cùng kéo một khối bê tông theo hai hướng chếch nhau trong không gian. Muốn biết chúng ' +
      '"hợp sức" hay đang kéo ghì nhau, kĩ sư không đo góc bằng thước — họ nhân từng cặp toạ độ rồi cộng lại. ' +
      'Một phép tính vài giây thay cho cả buổi đo đạc: đó là tích vô hướng.',
    theory:
      'BIỂU THỨC TOẠ ĐỘ CỦA CÁC PHÉP TOÁN\n' +
      'Cho a⃗ = (a₁; a₂; a₃), b⃗ = (b₁; b₂; b₃) và số thực k:\n' +
      '— a⃗ + b⃗ = (a₁+b₁; a₂+b₂; a₃+b₃)\n' +
      '— a⃗ − b⃗ = (a₁−b₁; a₂−b₂; a₃−b₃)\n' +
      '— k·a⃗ = (k·a₁; k·a₂; k·a₃)\n' +
      'VÌ SAO: mọi vectơ đều viết theo i⃗, j⃗, k⃗; cộng hai vectơ chỉ là gom các hệ số đứng trước cùng một vectơ đơn ' +
      'vị. Nói ngắn gọn, phép toán vectơ làm việc ĐỘC LẬP trên từng trục.\n' +
      'Hệ quả: a⃗ = b⃗ ⇔ ba thành phần bằng nhau đôi một; a⃗ cùng phương b⃗ ⇔ tồn tại k để a⃗ = k·b⃗ (tức ba tỉ số ' +
      'thành phần bằng nhau, khi các mẫu khác 0).\n\n' +
      'ĐỘ DÀI VECTƠ\n' +
      '|a⃗| = √(a₁² + a₂² + a₃²).\n' +
      'VÌ SAO: ba trục đôi một vuông góc nên áp định lí Pythagore hai lần — một lần trong mặt phẳng Oxy cho được ' +
      'a₁² + a₂², một lần nữa với thành phần đứng a₃.\n\n' +
      'TÍCH VÔ HƯỚNG — HAI CÁCH VIẾT, MỘT ĐẠI LƯỢNG\n' +
      'Định nghĩa hình học: a⃗·b⃗ = |a⃗|·|b⃗|·cos θ, với θ là góc giữa hai vectơ.\n' +
      'Biểu thức toạ độ: a⃗·b⃗ = a₁b₁ + a₂b₂ + a₃b₃.\n' +
      'Kết quả của tích vô hướng là một SỐ THỰC, không phải vectơ — tên gọi "vô hướng" nói đúng điều đó.\n' +
      'Chính vì hai cách viết cùng chỉ một đại lượng mà ta rút ra được công thức tính góc:\n' +
      'cos θ = (a⃗·b⃗)/(|a⃗|·|b⃗|) = (a₁b₁ + a₂b₂ + a₃b₃)/(√(a₁²+a₂²+a₃²)·√(b₁²+b₂²+b₃²)).\n\n' +
      'HỆ QUẢ QUAN TRỌNG NHẤT — ĐIỀU KIỆN VUÔNG GÓC\n' +
      'Với a⃗, b⃗ khác 0⃗: a⃗ ⊥ b⃗ ⇔ a⃗·b⃗ = 0 ⇔ a₁b₁ + a₂b₂ + a₃b₃ = 0.\n' +
      'VÌ SAO: hai vectơ khác 0⃗ nên |a⃗|·|b⃗| ≠ 0, tích bằng 0 buộc cos θ = 0, tức θ = 90°. Đây là công cụ chứng ' +
      'minh vuông góc mạnh nhất trong không gian: chỉ cần ba phép nhân và hai phép cộng, không cần dựng hình.\n\n' +
      'DẤU CỦA TÍCH VÔ HƯỚNG CHO BIẾT GÌ\n' +
      '— Dương: góc nhọn (hai vectơ "cùng phe").\n' +
      '— Bằng 0: vuông góc.\n' +
      '— Âm: góc tù (hai vectơ kéo ngược nhau).\n' +
      'LỖI HAY MẮC: nhân từng thành phần rồi giữ nguyên thành bộ ba số. Không có phép "nhân từng thành phần" nào ' +
      'cho ra vectơ ở đây — phải CỘNG ba tích lại thành một số duy nhất.',
    workedExample: {
      problem:
        'Cho a⃗ = (1; 1; 0) và b⃗ = (1; 0; 1). Tính a⃗·b⃗, độ dài mỗi vectơ và số đo góc giữa chúng.',
      steps: [
        'Bước 1 — Tích vô hướng theo toạ độ: a⃗·b⃗ = 1·1 + 1·0 + 0·1 = 1. Kết quả dương nên đoán trước được góc ' +
          'giữa hai vectơ là góc nhọn.',
        'Bước 2 — Độ dài: |a⃗| = √(1² + 1² + 0²) = √2 và |b⃗| = √(1² + 0² + 1²) = √2.',
        'Bước 3 — Thay vào công thức góc: cos θ = 1/(√2·√2) = 1/2.',
        'Bước 4 — Vì góc giữa hai vectơ luôn lấy trong đoạn từ 0° đến 180°, từ cos θ = 1/2 suy ra θ = 60°.',
        'Bước 5 — Kiểm tra tính hợp lí: 60° là góc nhọn, khớp với dự đoán ở bước 1 từ dấu dương của tích vô hướng.',
      ],
      answer: 'a⃗·b⃗ = 1; |a⃗| = |b⃗| = √2; góc giữa hai vectơ bằng 60°.',
    },
    checkQuestions: [
      {
        prompt: 'Cho a⃗ = (2; −1; 2) và b⃗ = (1; 2; 2). Tính tích vô hướng a⃗·b⃗.',
        answer: { kind: 'numeric', value: 4 },
        explain:
          'Nhân từng cặp thành phần tương ứng rồi CỘNG lại: 2·1 + (−1)·2 + 2·2 = 2 − 2 + 4 = 4. Kết quả phải là ' +
          'một SỐ chứ không phải bộ ba số — nếu ra (2; −2; 4) là đã quên bước cộng. Giá trị dương cho biết góc giữa ' +
          'hai vectơ là góc nhọn.',
      },
      {
        prompt: 'Cho a⃗ = (2; −1; 2). Tính độ dài |a⃗|.',
        answer: { kind: 'numeric', value: 3 },
        explain:
          'Độ dài bằng căn bậc hai của tổng bình phương ba thành phần: √(2² + (−1)² + 2²) = √(4 + 1 + 4) = √9 = 3. ' +
          'Bình phương làm dấu âm biến mất, nên thành phần −1 vẫn đóng góp 1 vào tổng. Lỗi hay gặp là cộng thẳng ' +
          '2 + (−1) + 2 = 3 rồi tưởng trùng đáp án — trùng chỉ là ngẫu nhiên, cách làm sai.',
      },
      {
        prompt:
          'Cho u⃗ = (1; 2; −1) và v⃗ = (3; −1; 1). Tính u⃗·v⃗ để kiểm tra hai vectơ có vuông góc hay không.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'u⃗·v⃗ = 1·3 + 2·(−1) + (−1)·1 = 3 − 2 − 1 = 0. Vì cả hai vectơ đều khác vectơ-không, tích vô hướng bằng 0 ' +
          'buộc cos của góc giữa chúng bằng 0, tức hai vectơ VUÔNG GÓC. Đây là cách chứng minh vuông góc trong ' +
          'không gian nhanh nhất: chỉ ba phép nhân và hai phép cộng, không phải dựng hình hay đo đạc gì.',
      },
      {
        prompt:
          'Cho a⃗ = (1; 1; 0) và b⃗ = (1; 0; 1). Tính số đo góc giữa hai vectơ (kết quả tính bằng độ, chỉ nhập số).',
        answer: { kind: 'numeric', value: 60 },
        explain:
          'Ta có a⃗·b⃗ = 1·1 + 1·0 + 0·1 = 1, còn |a⃗| = |b⃗| = √2. Suy ra cos θ = 1/(√2·√2) = 1/2. Góc giữa hai vectơ ' +
          'luôn được chọn trong đoạn từ 0° đến 180° nên θ = 60°. Nếu quên điều kiện đó có thể nhầm sang −60° hoặc ' +
          '300°, những giá trị không bao giờ được dùng làm góc giữa hai vectơ.',
      },
    ],
    srsCards: [
      {
        hoi: 'Biểu thức toạ độ của tích vô hướng trong Oxyz?',
        dap: 'a⃗·b⃗ = a₁b₁ + a₂b₂ + a₃b₃ — kết quả là một số thực, không phải vectơ.',
      },
      {
        hoi: 'Công thức độ dài vectơ a⃗ = (a₁; a₂; a₃)?',
        dap: '|a⃗| = √(a₁² + a₂² + a₃²), suy từ định lí Pythagore áp hai lần.',
      },
      {
        hoi: 'Điều kiện để hai vectơ khác 0⃗ vuông góc nhau?',
        dap: 'Tích vô hướng bằng 0: a₁b₁ + a₂b₂ + a₃b₃ = 0.',
      },
      {
        hoi: 'Công thức tính góc giữa hai vectơ theo toạ độ?',
        dap: 'cos θ = (a⃗·b⃗)/(|a⃗|·|b⃗|), với θ lấy trong đoạn 0° đến 180°.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan12-c2-b4',
    grade: '12',
    chapterNumber: 2,
    chapterTitle: CHUONG,
    lessonNumber: 4,
    title: 'Ứng dụng toạ độ: khoảng cách giữa hai điểm và góc giữa hai đường thẳng',
    hook:
      'Hai máy bay đang bay trong vùng trời Nội Bài, radar báo về vị trí mỗi chiếc bằng ba con số: kinh độ quy ' +
      'đổi, vĩ độ quy đổi và độ cao. Kiểm soát viên phải trả lời trong một giây: hai chiếc cách nhau bao xa, hai đường bay ' +
      'chếch nhau góc nào. Cả hai câu hỏi ấy đều quy về một phép tính toạ độ duy nhất.',
    theory:
      'KHOẢNG CÁCH GIỮA HAI ĐIỂM\n' +
      'Với A(x_A; y_A; z_A) và B(x_B; y_B; z_B):\n' +
      'AB = |AB→| = √((x_B−x_A)² + (y_B−y_A)² + (z_B−z_A)²).\n' +
      'VÌ SAO: khoảng cách giữa hai điểm chính là ĐỘ DÀI vectơ nối chúng, mà độ dài vectơ đã có công thức ở bài ' +
      'trước. Không cần nhớ thêm công thức mới — chỉ là ghép hai thứ đã biết.\n' +
      'Vì có bình phương nên thứ tự trừ KHÔNG ảnh hưởng kết quả: AB = BA, đúng như trực giác về khoảng cách. Đây ' +
      'là chỗ duy nhất trong chương mà trừ ngược không gây sai — mọi chỗ khác đều gây sai dấu.\n\n' +
      'VECTƠ CHỈ PHƯƠNG CỦA ĐƯỜNG THẲNG\n' +
      'Một vectơ khác 0⃗ có giá song song hoặc trùng với đường thẳng d gọi là vectơ chỉ phương của d. Đường thẳng ' +
      'đi qua hai điểm A, B nhận AB→ làm vectơ chỉ phương. Một đường thẳng có VÔ SỐ vectơ chỉ phương, chúng cùng ' +
      'phương với nhau (hơn kém nhau một hệ số k ≠ 0).\n\n' +
      'GÓC GIỮA HAI ĐƯỜNG THẲNG\n' +
      'Cho hai đường thẳng có vectơ chỉ phương u⃗ và v⃗. Khi đó:\n' +
      'cos(góc giữa hai đường thẳng) = |u⃗·v⃗| / (|u⃗|·|v⃗|).\n' +
      'CHÚ Ý DẤU GIÁ TRỊ TUYỆT ĐỐI — đây là điểm khác biệt quan trọng nhất so với góc giữa hai VECTƠ:\n' +
      '— Góc giữa hai VECTƠ nằm trong đoạn 0° đến 180°, giữ nguyên dấu của tích vô hướng.\n' +
      '— Góc giữa hai ĐƯỜNG THẲNG chỉ nằm trong đoạn 0° đến 90°, vì đường thẳng không có chiều: đổi u⃗ thành −u⃗ ' +
      'vẫn là cùng một đường thẳng. Lấy trị tuyệt đối chính là cách loại bỏ sự tuỳ ý về chiều đó.\n' +
      'Hệ quả: hai đường thẳng vuông góc ⇔ u⃗·v⃗ = 0 (không cần trị tuyệt đối vì 0 không có dấu).\n\n' +
      'GHI NHỚ VỀ PHẠM VI ÁP DỤNG\n' +
      'Công thức góc trên dùng được cho cả hai đường thẳng CHÉO NHAU (không cắt nhau, không song song) — đó là ưu ' +
      'thế lớn của phương pháp toạ độ: không cần hai đường phải gặp nhau mới đo được góc, vì ta chỉ so hai vectơ ' +
      'chỉ phương, mà vectơ thì dời chỗ tự do được.\n' +
      'LỖI HAY MẮC: quên trị tuyệt đối rồi kết luận góc giữa hai đường thẳng bằng 120° — một con số không thể có, ' +
      'vì góc giữa hai đường thẳng không bao giờ vượt quá 90°. Gặp kết quả tù thì lấy góc bù 180° trừ đi.',
    workedExample: {
      problem:
        'Trong không gian Oxyz cho A(0; 1; −2) và B(4; 5; 5). Tính độ dài đoạn AB, rồi tính số đo góc giữa đường ' +
        'thẳng AB và đường thẳng d có vectơ chỉ phương v⃗ = (4; 4; 7).',
      steps: [
        'Bước 1 — Tìm vectơ AB→ bằng cách lấy toạ độ B trừ toạ độ A: (4−0; 5−1; 5−(−2)) = (4; 4; 7). Chú ý dấu ở ' +
          'thành phần thứ ba: trừ số âm thành cộng.',
        'Bước 2 — Tính độ dài: AB = √(4² + 4² + 7²) = √(16 + 16 + 49) = √81 = 9.',
        'Bước 3 — Nhận xét vectơ chỉ phương: AB→ = (4; 4; 7) trùng đúng v⃗, nghĩa là đường thẳng AB và d cùng phương ' +
          'với nhau.',
        'Bước 4 — Áp công thức góc cho chắc chắn: |AB→·v⃗| = |16 + 16 + 49| = 81, còn |AB→|·|v⃗| = 9·9 = 81, nên ' +
          'cos của góc bằng 81/81 = 1.',
        'Bước 5 — Kết luận: góc giữa hai đường thẳng bằng 0°, tức chúng song song hoặc trùng nhau. Kết quả khớp với ' +
          'nhận xét ở bước 3, đây là cách tự kiểm tra tốt.',
      ],
      answer: 'AB = 9; góc giữa hai đường thẳng bằng 0° (hai đường cùng phương).',
    },
    checkQuestions: [
      {
        prompt: 'Trong không gian Oxyz cho A(0; 1; −2) và B(4; 5; 5). Tính độ dài đoạn thẳng AB.',
        answer: { kind: 'numeric', value: 9 },
        explain:
          'Trước hết AB→ = (4−0; 5−1; 5−(−2)) = (4; 4; 7); chú ý 5 − (−2) = 7 chứ không phải 3. Khi đó ' +
          'AB = √(16 + 16 + 49) = √81 = 9. Khoảng cách giữa hai điểm chính là độ dài vectơ nối chúng, nên không cần ' +
          'nhớ thêm công thức nào ngoài công thức độ dài vectơ.',
      },
      {
        prompt: 'Trong không gian Oxyz, tính khoảng cách từ gốc toạ độ O đến điểm M(3; 4; 12).',
        answer: { kind: 'numeric', value: 13 },
        explain:
          'Khoảng cách OM chính là độ dài vectơ OM→ = (3; 4; 12), bằng √(9 + 16 + 144) = √169 = 13. Vì gốc toạ độ ' +
          'có mọi thành phần bằng 0 nên phép trừ không làm đổi gì, toạ độ điểm dùng thẳng được. Đây là trường hợp ' +
          'riêng dễ nhất của công thức khoảng cách hai điểm.',
      },
      {
        prompt:
          'Hai đường thẳng có vectơ chỉ phương lần lượt là u⃗ = (2; 1; 2) và v⃗ = (1; 2; −2). Tính số đo góc giữa ' +
          'hai đường thẳng đó (tính bằng độ, chỉ nhập số).',
        answer: { kind: 'numeric', value: 90 },
        explain:
          'Tính tích vô hướng trước: u⃗·v⃗ = 2·1 + 1·2 + 2·(−2) = 2 + 2 − 4 = 0. Tích vô hướng của hai vectơ chỉ ' +
          'phương bằng 0 nên hai đường thẳng vuông góc, góc bằng 90°. Với trường hợp này không cần quan tâm trị ' +
          'tuyệt đối vì số 0 không mang dấu.',
      },
      {
        prompt:
          'Vì sao trong công thức tính góc giữa hai ĐƯỜNG THẲNG lại phải lấy trị tuyệt đối của tích vô hướng? ' +
          'Chọn giải thích đúng.',
        choices: [
          { id: 'A', label: 'Vì độ dài vectơ luôn dương nên tử số cũng phải dương' },
          {
            id: 'B',
            label:
              'Vì đường thẳng không có chiều: đổi vectơ chỉ phương sang vectơ đối vẫn là đường đó, nên góc phải ' +
              'nằm trong đoạn 0° đến 90°',
          },
          { id: 'C', label: 'Vì hai đường thẳng trong không gian luôn chéo nhau' },
          { id: 'D', label: 'Vì tích vô hướng của hai vectơ luôn không âm' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Một đường thẳng có vô số vectơ chỉ phương, trong đó có cả những cặp ngược hướng nhau. Nếu giữ nguyên dấu ' +
          'thì cùng một cặp đường thẳng lại cho hai kết quả bù nhau (chẳng hạn 60° và 120°), tuỳ người giải chọn ' +
          'vectơ nào — vô lí. Lấy trị tuyệt đối ép kết quả về đoạn 0° đến 90°, làm cho góc giữa hai đường thẳng xác ' +
          'định duy nhất. Phương án D sai vì tích vô hướng hoàn toàn có thể âm.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức khoảng cách giữa hai điểm A, B trong Oxyz?',
        dap: 'AB = √((x_B−x_A)² + (y_B−y_A)² + (z_B−z_A)²) — chính là độ dài vectơ AB→.',
      },
      {
        hoi: 'Công thức góc giữa hai đường thẳng có vectơ chỉ phương u⃗, v⃗?',
        dap: 'cos góc = |u⃗·v⃗|/(|u⃗|·|v⃗|); kết quả luôn trong đoạn 0° đến 90°.',
      },
      {
        hoi: 'Góc giữa hai VECTƠ và góc giữa hai ĐƯỜNG THẲNG khác nhau chỗ nào?',
        dap: 'Góc giữa hai vectơ thuộc 0°–180° (giữ dấu); góc giữa hai đường thẳng thuộc 0°–90° (lấy trị tuyệt đối).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
