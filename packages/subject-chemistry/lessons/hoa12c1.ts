// lessons/hoa12c1.ts — Hoá học 12, Chương 1: Ester - Lipid (3 bài).
// Đối chiếu mục lục thật: tai-lieu-sgk/SGK-Hoa/12/page_0004.png (OCR 2026-08-31).
// reviewStatus='draft' — soạn từ docs/research/kho-kien-thuc-hoa-gdpt2018.md §3, chưa duyệt.
import type { ChemLesson } from '../lessonTypes.js'

export const HOA12_C1_LESSONS: ChemLesson[] = [
  {
    id: 'hoa12-c1-b1',
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Ester - Lipid',
    lessonNumber: 1,
    title: 'Ester - Lipid',
    hook:
      'Mùi chuối chín thơm phức là do isoamyl acetate, mùi hoa nhài dịu nhẹ là benzyl acetate. ' +
      'Đó đều là các ester — hợp chất chịu trách nhiệm cho các hương thơm ngọt ngào trong tự nhiên.',
    theory:
      'KHÁI NIỆM VÀ DANH PHÁP ESTER:\n' +
      "— Khi thay thế nhóm −OH ở nhóm carboxyl của carboxylic acid bằng nhóm −OR' của alcohol ta thu được ester. Công thức tổng quát đơn giản nhất: RCOOR'.\n" +
      '— Công thức chung của ester no, đơn chức, mạch hở: CₙH₂ₙO₂ (n ≥ 2).\n' +
      '— Gọi tên ester: [Tên gốc alkyl R\'] + [Tên gốc acid RCOO] (đuôi "ate"). Ví dụ: CH₃COOC₂H₅ gọi là ethyl acetate.\n\n' +
      'TÍNH CHẤT HOÁ HỌC CỦA ESTER:\n' +
      '1. Phản ứng thuỷ phân trong môi trường acid (thuận nghịch, t°, xúc tác H₂SO₄):\n' +
      "   RCOOR' + H₂O ⇌ RCOOH + R'OH.\n" +
      '2. Phản ứng thuỷ phân trong môi trường kiềm (một chiều, phản ứng xà phòng hoá, t°):\n' +
      "   RCOOR' + NaOH → RCOONa (muối của acid) + R'OH.\n\n" +
      'KHÁI NIỆM VÀ PHÂN LOẠI LIPID (CHẤT BÉO):\n' +
      '— Lipid là những hợp chất hữu cơ có trong tế bào sống, không tan trong nước nhưng tan nhiều trong dung môi hữu cơ không phân cực.\n' +
      '— Chất béo (triglyceride) là triester của glycerol với các acid béo (acid đơn chức, mạch carbon dài, không phân nhánh, có số C chẵn từ C12 đến C24).\n' +
      '— Các acid béo thường gặp: acid palmitic (C₁₅H₃₁COOH), acid stearic (C₁₇H₃₅COOH) (no); acid oleic (C₁₇H₃₃COOH), acid linoleic (C₁₇H₃₁COOH) (không no).\n' +
      '— Tính chất: Chất béo lỏng (dầu thực vật, chứa nhiều acid béo không no); Chất béo rắn (mỡ động vật, chứa nhiều acid béo no). Phản ứng hiđro hoá chuyển dầu lỏng thành mỡ rắn.',
    workedExample: {
      problem:
        'Cho 8,8 gam ethyl acetate (CH₃COOC₂H₅, M=88) tác dụng hoàn toàn với dung dịch NaOH vừa đủ, đun nóng. ' +
        'Tính khối lượng muối sodium acetate (CH₃COONa, M=82) thu được.',
      steps: [
        'Tính số mol ethyl acetate: n = 8,8 / 88 = 0,1 mol.',
        'Viết phương trình phản ứng xà phòng hoá: CH₃COOC₂H₅ + NaOH → CH₃COONa + C₂H₅OH.',
        'Theo phương trình, tỉ lệ phản ứng là 1:1, nên số mol muối CH₃COONa thu được là 0,1 mol.',
        'Tính khối lượng muối sodium acetate: m = 0,1 * 82 = 8,2 gam.',
      ],
      answer: '8,2 gam',
    },
    checkQuestions: [
      {
        prompt: 'Công thức chung của ester no, đơn chức, mạch hở là gì?',
        choices: [
          { id: 'cnh2n_2_o2', label: 'CₙH₂ₙ₋₂O₂ (n ≥ 3)' },
          { id: 'cnh2n_o2', label: 'CₙH₂ₙO₂ (n ≥ 2)' },
          { id: 'cnh2n_plus2_o2', label: 'CₙH₂ₙ₊₂O₂ (n ≥ 1)' },
        ],
        answer: { kind: 'choice', correctIds: ['cnh2n_o2'] },
        explain:
          'Ester no, đơn chức, mạch hở được tạo từ acid no đơn chức và alcohol no đơn chức, có công thức chung CₙH₂ₙO₂ với n ≥ 2.',
      },
      {
        prompt: 'Chất béo là triester của acid béo với alcohol nào sau đây?',
        choices: [
          { id: 'methanol', label: 'Methanol (CH₃OH)' },
          { id: 'ethanol', label: 'Ethanol (C₂H₅OH)' },
          { id: 'glycerol', label: 'Glycerol (C₃H₅(OH)₃)' },
          { id: 'glycol', label: 'Ethylene glycol (C₂H₄(OH)₂)' },
        ],
        answer: { kind: 'choice', correctIds: ['glycerol'] },
        explain: 'Chất béo (triglyceride) là triester của glycerol và các acid béo.',
      },
    ],
    srsCards: [
      { hoi: 'Ester no đơn chức mạch hở có công thức chung là gì?', dap: 'CₙH₂ₙO₂ (n ≥ 2).' },
      {
        hoi: 'Sự khác nhau giữa thuỷ phân ester trong môi trường acid và kiềm?',
        dap: 'Trong môi trường acid là phản ứng thuận nghịch; trong môi trường kiềm là phản ứng một chiều (xà phòng hoá).',
      },
      { hoi: 'Glycerol có mấy nhóm hydroxyl?', dap: 'Có 3 nhóm hydroxyl (−OH).' },
    ],
    animation: {
      title: 'Ester hoá và thuỷ phân: phân tử nước ra đi từ đâu',
      description:
        'Bên trái là acetic acid CH₃COOH, bên phải là ethanol C₂H₅OH. Hai mảnh sáng lên: nhóm OH của acid và nguyên tử H của nhóm OH bên alcohol. Chính hai mảnh đó tách ra, ghép lại thành một phân tử H₂O rơi xuống, còn hai phần còn lại nối trực tiếp với nhau qua oxygen thành ester CH₃COOC₂H₅. Mũi tên giữa phương trình có hai chiều: xúc tác H₂SO₄ đặc đun nóng đẩy sang phải tạo ester, còn khi cho dư nước hoặc đun với dung dịch acid loãng thì phản ứng chạy ngược lại — ester bị thuỷ phân trả về acid và alcohol. Điểm dễ nhầm mà hình làm rõ: nước sinh ra lấy nhóm OH từ ACID chứ không phải từ alcohol.',
      viewBoxWidth: 470,
      viewBoxHeight: 230,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'label',
          id: 'acid',
          x: 80,
          y: 80,
          text: 'CH₃CO–',
          size: 15,
          anchor: 'end',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'acidoh',
          x: 84,
          y: 80,
          text: 'OH',
          size: 15,
          anchor: 'start',
          fill: 'accent',
        },
        {
          kind: 'label',
          id: 'alc',
          x: 250,
          y: 80,
          text: 'H',
          size: 15,
          anchor: 'end',
          fill: 'accent',
        },
        {
          kind: 'label',
          id: 'alco',
          x: 254,
          y: 80,
          text: '–O–C₂H₅',
          size: 15,
          anchor: 'start',
          fill: 'neutral',
        },
        {
          kind: 'circle',
          id: 'v1',
          cx: 100,
          cy: 74,
          r: 18,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          opacity: 0.001,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 800,
              opacity: 0.9,
            },
            {
              atMs: 2600,
              opacity: 0.9,
            },
            {
              atMs: 3000,
              opacity: 0,
            },
            {
              atMs: 8000,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'v2',
          cx: 244,
          cy: 74,
          r: 14,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          opacity: 0.001,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 800,
              opacity: 0.9,
            },
            {
              atMs: 2600,
              opacity: 0.9,
            },
            {
              atMs: 3000,
              opacity: 0,
            },
            {
              atMs: 8000,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nuoc',
          x: 172,
          y: 150,
          text: 'H₂O',
          size: 15,
          anchor: 'middle',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
              dy: -60,
            },
            {
              atMs: 2600,
              opacity: 0,
              dy: -60,
            },
            {
              atMs: 3000,
              opacity: 1,
              dy: -40,
            },
            {
              atMs: 4200,
              opacity: 1,
              dy: 0,
            },
            {
              atMs: 8000,
              opacity: 1,
              dy: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ester',
          x: 235,
          y: 120,
          text: 'CH₃COOC₂H₅',
          size: 17,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4200,
              opacity: 0,
            },
            {
              atMs: 4700,
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
          id: 'estert',
          x: 235,
          y: 140,
          text: 'ethyl acetate — mùi thơm trái cây',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4200,
              opacity: 0,
            },
            {
              atMs: 4700,
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
          id: 'phai',
          x1: 120,
          y1: 186,
          x2: 340,
          y2: 186,
          stroke: 'primary',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'phait',
          x: 230,
          y: 176,
          text: 'H₂SO₄ đặc, t° → ester hoá',
          size: 11,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'arrow',
          id: 'trai',
          x1: 340,
          y1: 208,
          x2: 120,
          y2: 208,
          stroke: 'accent',
          strokeWidth: 2,
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
          id: 'trait',
          x: 230,
          y: 226,
          text: 'H₂O dư, acid loãng, t° → thuỷ phân',
          size: 11,
          anchor: 'middle',
          fill: 'neutral',
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
          id: 'luu',
          x: 400,
          y: 52,
          text: 'OH đến từ ACID',
          size: 11,
          anchor: 'end',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3000,
              opacity: 0,
            },
            {
              atMs: 3500,
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
          id: 'luu2',
          x: 400,
          y: 70,
          text: 'H đến từ alcohol',
          size: 11,
          anchor: 'end',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3000,
              opacity: 0,
            },
            {
              atMs: 3500,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
      ],
      captions: [
        {
          atMs: 800,
          text: 'Sáng lên: nhóm OH của acid và nguyên tử H của alcohol.',
        },
        {
          atMs: 3000,
          text: 'Hai mảnh đó tách ra ghép thành H₂O — OH lấy từ acid, H lấy từ alcohol.',
        },
        {
          atMs: 4200,
          text: 'Phần còn lại nối qua oxygen thành ester CH₃COOC₂H₅.',
        },
        {
          atMs: 5800,
          text: 'Phản ứng thuận nghịch: dư nước và acid loãng thì ester bị thuỷ phân ngược lại.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa12-c1-b2',
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Ester - Lipid',
    lessonNumber: 2,
    title: 'Xà phòng và chất giặt rửa',
    hook:
      'Nước thông thường không thể tự gột rửa các vết dầu mỡ bám bẩn. Nhưng xà phòng có thể kéo bay ' +
      'dầu mỡ dễ dàng nhờ cấu trúc phân tử mang hai đầu "đối lập" kì lạ.',
    theory:
      'KHÁI NIỆM VỀ XÀ PHÒNG VÀ CHẤT GIẶT RỬA TỔNG HỢP:\n' +
      '— Xà phòng: là hỗn hợp các muối sodium hoặc potassium của các acid béo (thường là sodium stearate, sodium palmitate...).\n' +
      '— Chất giặt rửa tổng hợp: là chất giặt rửa được tổng hợp hoá học từ dầu mỏ (ví dụ: sodium alkylbenzene sulfonate).\n\n' +
      'CẤU TRÚC PHÂN TỬ VÀ CƠ CHẾ GIẶT RỬA:\n' +
      '— Phân tử chất giặt rửa gồm hai phần chính:\n' +
      '  1. Đầu ưa nước (hydrophilic): là nhóm phân cực (như −COONa, −SO₃Na) dễ tan trong nước.\n' +
      '  2. Đuôi kị nước (hydrophobic): là gốc hydrocarbon dài, không phân cực, dễ tan trong dầu mỡ.\n\n' +
      '— Cơ chế tẩy rửa: Đuôi kị nước đâm sâu vào vết dầu mỡ bám trên vải, đầu ưa nước hướng ra ngoài nước lỏng. Lực khuấy nhẹ làm dầu mỡ phân tán thành những hạt micelle rất nhỏ lơ lửng trong nước và bị rửa trôi đi.\n\n' +
      'SO SÁNH XÀ PHÒNG VÀ CHẤT GIẶT RỬA TỔNG HỢP:\n' +
      '— Ưu điểm chất giặt rửa tổng hợp: Không bị mất tác dụng trong nước cứng (nước chứa nhiều ion Ca²⁺, Mg²⁺) vì muối calcium, magnesium của sulfonate tan được trong nước. Xà phòng bị mất tác dụng trong nước cứng do tạo kết tủa dạng cặn của muối carboxylate của Ca²⁺/Mg²⁺.',
    workedExample: {
      problem: 'Giải thích vì sao xà phòng mất khả năng giặt rửa khi dùng trong nước cứng.',
      steps: [
        'Nước cứng là nước chứa nhiều ion Ca²⁺ và Mg²⁺.',
        'Thành phần chính của xà phòng là các muối carboxylate của acid béo như C₁₇H₃₅COONa.',
        'Khi gặp Ca²⁺ và Mg²⁺, phản ứng trao đổi tạo ra muối carboxylate calcium/magnesium kết tủa không tan dạng cặn trắng:\n  2C₁₇H₃₅COO⁻ + Ca²⁺ → (C₁₇H₃₅COO)₂Ca↓.',
        'Sự tạo cặn này làm mất đi các phân tử xà phòng hoạt động bề mặt, bám bẩn thêm vào sợi vải và làm mất khả năng giặt rửa.',
      ],
      answer: 'Tạo kết tủa không tan với ion Ca²⁺ và Mg²⁺',
    },
    checkQuestions: [
      {
        prompt: 'Thành phần chính của xà phòng thông thường là gì?',
        choices: [
          { id: 'axit', label: 'Các acid béo tự do' },
          { id: 'muoi_natri', label: 'Muối sodium hoặc potassium của các acid béo' },
          { id: 'ester', label: 'Ester của acid béo và glycerol' },
        ],
        answer: { kind: 'choice', correctIds: ['muoi_natri'] },
        explain: 'Xà phòng là hỗn hợp các muối sodium hoặc potassium của acid béo.',
      },
      {
        prompt:
          'Vì sao chất giặt rửa tổng hợp (như bột giặt) vẫn giặt sạch được trong nước cứng còn xà phòng thông thường thì không?',
        choices: [
          {
            id: 'a',
            label: 'Vì muối calcium/magnesium của chất giặt rửa tổng hợp tan tốt trong nước',
          },
          { id: 'b', label: 'Vì chất giặt rửa tổng hợp chứa ít chất béo hơn' },
          { id: 'c', label: 'Vì chất giặt rửa tổng hợp có tính acid mạnh hơn' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain:
          'Các muối calcium và magnesium của gốc sulfonate (trong chất giặt rửa tổng hợp) tan được trong nước cứng, không tạo kết tủa cặn như gốc carboxylate của xà phòng.',
      },
    ],
    srsCards: [
      { hoi: 'Xà phòng là gì?', dap: 'Muối sodium hoặc potassium của các acid béo.' },
      {
        hoi: 'Hai phần chính trong phân tử chất hoạt động bề mặt?',
        dap: 'Đầu ưa nước (phân cực) và Đuôi kị nước (gốc hydrocarbon dài).',
      },
      {
        hoi: 'Tại sao xà phòng không dùng được trong nước cứng?',
        dap: 'Vì tạo cặn kết tủa với các ion Ca²⁺ và Mg²⁺.',
      },
    ],
    animation: {
      title: 'Cơ chế giặt của xà phòng: phân tử hai đầu bao giọt dầu thành micelle',
      description:
        'Một phân tử xà phòng được vẽ thành hai phần rõ rệt: đầu tròn là nhóm COO⁻Na⁺ ưa nước, đuôi dài là mạch hydrocarbon kị nước. Trên mặt vải có một giọt dầu bẩn mà nước không cuốn đi được, vì dầu và nước không tan vào nhau. Các phân tử xà phòng kéo tới, cắm đuôi kị nước vào trong giọt dầu và chĩa đầu ưa nước ra phía ngoài. Kết quả là giọt dầu bị bọc kín trong một lớp vỏ toàn đầu tích điện âm — gọi là micelle. Bề mặt micelle bây giờ ưa nước nên nước cuốn được nó đi, đồng thời các micelle cùng mang điện âm đẩy nhau nên không dính trở lại vào vải. Xà phòng không hoà tan dầu, nó làm trung gian nối dầu với nước.',
      viewBoxWidth: 460,
      viewBoxHeight: 240,
      durationMs: 9000,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'dau1',
          cx: 80,
          cy: 60,
          r: 10,
          fill: 'primary',
        },
        {
          kind: 'line',
          id: 'duoi1',
          x1: 90,
          y1: 60,
          x2: 148,
          y2: 60,
          stroke: 'accent',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'dt1',
          x: 80,
          y: 38,
          text: 'đầu ưa nước',
          size: 10,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'dt2',
          x: 150,
          y: 38,
          text: 'đuôi kị nước',
          size: 10,
          anchor: 'start',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'dt3',
          x: 80,
          y: 84,
          text: 'COO⁻Na⁺',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'rect',
          id: 'vai',
          x: 40,
          y: 200,
          w: 380,
          h: 30,
          fill: 'muted',
          rx: 3,
          opacity: 0.4,
        },
        {
          kind: 'label',
          id: 'vait',
          x: 80,
          y: 220,
          text: 'sợi vải',
          size: 11,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'circle',
          id: 'giot',
          cx: 250,
          cy: 168,
          r: 34,
          fill: 'accent',
          opacity: 0.4,
        },
        {
          kind: 'label',
          id: 'giott',
          x: 250,
          y: 172,
          text: 'dầu bẩn',
          size: 11,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'circle',
          id: 'xp1',
          cx: 250,
          cy: 168,
          r: 8,
          fill: 'primary',
          keyframes: [
            {
              atMs: 0,
              dx: -110,
              dy: -100,
            },
            {
              atMs: 2600,
              dx: -46,
              dy: -42,
            },
            {
              atMs: 9000,
              dx: -46,
              dy: -42,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'xp2',
          cx: 250,
          cy: 168,
          r: 8,
          fill: 'primary',
          keyframes: [
            {
              atMs: 0,
              dx: 120,
              dy: -100,
            },
            {
              atMs: 3000,
              dx: 46,
              dy: -42,
            },
            {
              atMs: 9000,
              dx: 46,
              dy: -42,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'xp3',
          cx: 250,
          cy: 168,
          r: 8,
          fill: 'primary',
          keyframes: [
            {
              atMs: 0,
              dx: -130,
              dy: 40,
            },
            {
              atMs: 3400,
              dx: -62,
              dy: 6,
            },
            {
              atMs: 9000,
              dx: -62,
              dy: 6,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'xp4',
          cx: 250,
          cy: 168,
          r: 8,
          fill: 'primary',
          keyframes: [
            {
              atMs: 0,
              dx: 140,
              dy: 40,
            },
            {
              atMs: 3800,
              dx: 62,
              dy: 6,
            },
            {
              atMs: 9000,
              dx: 62,
              dy: 6,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'xp5',
          cx: 250,
          cy: 168,
          r: 8,
          fill: 'primary',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: -140,
            },
            {
              atMs: 4200,
              dx: 0,
              dy: -48,
            },
            {
              atMs: 9000,
              dx: 0,
              dy: -48,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'vo',
          cx: 250,
          cy: 168,
          r: 48,
          fill: 'surface',
          stroke: 'primary',
          strokeWidth: 2,
          dash: '5 4',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4600,
              opacity: 0,
            },
            {
              atMs: 5200,
              opacity: 1,
            },
            {
              atMs: 9000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'mic',
          x: 250,
          y: 112,
          text: 'micelle — vỏ ngoài ưa nước',
          size: 11,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 5200,
              opacity: 0,
            },
            {
              atMs: 5700,
              opacity: 1,
            },
            {
              atMs: 8990,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'cuon',
          x1: 306,
          y1: 168,
          x2: 400,
          y2: 140,
          stroke: 'primary',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 6400,
              opacity: 0,
            },
            {
              atMs: 6900,
              opacity: 1,
            },
            {
              atMs: 8990,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'cuont',
          x: 400,
          y: 122,
          text: 'nước cuốn đi',
          size: 11,
          anchor: 'end',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 6400,
              opacity: 0,
            },
            {
              atMs: 6900,
              opacity: 1,
            },
            {
              atMs: 8990,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'day',
          x: 230,
          y: 30,
          text: 'Các micelle cùng mang điện âm nên đẩy nhau, không dính lại vào vải',
          size: 11,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 7200,
              opacity: 0,
            },
            {
              atMs: 7700,
              opacity: 1,
            },
            {
              atMs: 8990,
              opacity: 1,
            },
          ],
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Phân tử xà phòng có hai đầu trái tính: đầu ưa nước, đuôi kị nước.',
        },
        {
          atMs: 2600,
          text: 'Đuôi kị nước cắm vào giọt dầu, đầu ưa nước quay ra ngoài.',
        },
        {
          atMs: 5200,
          text: 'Giọt dầu bị bọc kín thành micelle, bề mặt ngoài ưa nước.',
        },
        {
          atMs: 6600,
          text: 'Nước cuốn micelle đi; các micelle tích điện âm đẩy nhau nên không bám lại.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa12-c1-b3',
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Ester - Lipid',
    lessonNumber: 3,
    title: 'Ôn tập chương 1 — Ester - Lipid',
    hook:
      'Chương 1 trang bị kiến thức về Ester và Lipid, hai lớp chất béo chi phối dinh dưỡng sinh học và ' +
      'ngành công nghiệp xà phòng tẩy rửa thiết yếu.',
    theory:
      'HỆ THỐNG HOÁ KIẾN THỨC CHƯƠNG 1:\n' +
      "1. Ester (RCOOR'): No đơn chức CₙH₂ₙO₂ (n≥2). Thuỷ phân acid (⇌ tạo acid + alcohol), thuỷ phân kiềm (xà phòng hoá → muối + alcohol).\n" +
      '2. Lipid (chất béo): Triester của glycerol và acid béo. Thể lỏng (không no, dầu ăn), thể rắn (no, mỡ). Phản ứng hidro hoá chuyển lỏng thành rắn.\n' +
      '3. Xà phòng: Muối carboxylate của kiềm với acid béo. Mất tác dụng trong nước cứng.\n' +
      '4. Chất giặt rửa tổng hợp: Gốc sulfonate, dùng được trong nước cứng nhờ muối Ca²⁺/Mg²⁺ của nó tan tốt.',
    workedExample: {
      problem:
        'Thuỷ phân hoàn toàn triolein (chất béo không no, M=884) trong dung dịch NaOH dư, đun nóng. ' +
        'Tính khối lượng glycerol (M=92) thu được từ 8,84 gam triolein.',
      steps: [
        'Tính số mol triolein: n = 8,84 / 884 = 0,01 mol.',
        'Viết phương trình xà phòng hoá: (C₁₇H₃₃COO)₃C₃H₅ + 3NaOH → 3C₁₇H₃₃COONa + C₃H₅(OH)₃.',
        'Theo phương trình, 1 mol triolein sinh ra 1 mol glycerol.',
        'Số mol glycerol thu được = 0,01 mol.',
        'Tính khối lượng glycerol: m = 0,01 * 92 = 0,92 gam.',
      ],
      answer: '0,92 gam',
    },
    checkQuestions: [
      {
        prompt:
          'Thuỷ phân hoàn toàn ethyl formate (HCOOC₂H₅) trong môi trường acid thu được hỗn hợp sản phẩm gồm những chất nào?',
        choices: [
          { id: 'a', label: 'Formic acid (HCOOH) và ethanol (C₂H₅OH)' },
          { id: 'b', label: 'Acetic acid (CH₃COOH) và methanol (CH₃OH)' },
          { id: 'c', label: 'Formic acid (HCOOH) và methanol (CH₃OH)' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain:
          'Ester HCOOC₂H₅ thuỷ phân trong môi trường acid tạo acid formic HCOOH và cồn ethyl alcohol C₂H₅OH.',
      },
      {
        prompt: 'Chất béo triolein có chứa gốc acid béo nào sau đây?',
        choices: [
          { id: 'palmitic', label: 'Gốc acid palmitic' },
          { id: 'stearic', label: 'Gốc acid stearic' },
          { id: 'oleic', label: 'Gốc acid oleic' },
        ],
        answer: { kind: 'choice', correctIds: ['oleic'] },
        explain: 'Triolein là triester của glycerol và acid oleic, có công thức (C₁₇H₃₃COO)₃C₃H₅.',
      },
    ],
    srsCards: [
      {
        hoi: 'Mỡ động vật chứa nhiều loại chất béo nào?',
        dap: 'Chất béo no (thể rắn ở nhiệt độ thường).',
      },
      {
        hoi: 'Dầu thực vật chứa nhiều loại chất béo nào?',
        dap: 'Chất béo không no (thể lỏng ở nhiệt độ thường).',
      },
      {
        hoi: 'Chất dùng để chuyển hoá dầu lỏng thành mỡ rắn?',
        dap: 'Khí hydrogen (H₂), xúc tác Ni, nhiệt độ.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
