// lessons/hoa12c7.ts — Hoá học 12, Chương 7: Nguyên tố nhóm IA và nhóm IIA (3 bài).
// Đối chiếu mục lục thật: tai-lieu-sgk/SGK-Hoa/12/page_0005.png (OCR 2026-08-31).
// reviewStatus='draft' — soạn từ docs/research/kho-kien-thuc-hoa-gdpt2018.md §3, chưa duyệt.
import type { ChemLesson } from '../lessonTypes.js'

export const HOA12_C7_LESSONS: ChemLesson[] = [
  {
    id: 'hoa12-c7-b24',
    grade: '12',
    chapterNumber: 7,
    chapterTitle: 'Nguyên tố nhóm IA và nhóm IIA',
    lessonNumber: 24,
    title: 'Nguyên tố nhóm IA',
    hook:
      'Lithium vận hành pin điện thoại, Sodium (Natri) là thành phần cấu tạo muối ăn hằng ngày.' +
      ' Các kim loại kiềm này có hoạt tính hoá học cực mạnh, có thể bốc cháy hoặc nổ tung khi gặp nước.',
    theory:
      'VỊ TRÍ VÀ CẤU TẠO:\n' +
      '— Nhóm IA (kim loại kiềm) gồm: Lithium (Li), Sodium (Na), Potassium (K), Rubidium (Rb), Cesium (Cs). Nguyên tử của chúng đều có 1 electron ở lớp ngoài cùng (ns¹).\n\n' +
      'TÍNH CHẤT VẬT LÍ:\n' +
      '— Có nhiệt độ nóng chảy, nhiệt độ sôi thấp, khối lượng riêng nhỏ (Li nhẹ nhất trong các kim loại rắn) và độ cứng thấp (mềm, cắt được bằng dao) do liên kết kim loại trong mạng tinh thể lập phương tâm khối khá yếu.\n\n' +
      'TÍNH CHẤT HOÁ HỌC (Tính khử cực kì mạnh, tăng dần từ Li đến Cs):\n' +
      '— Trong các phản ứng, chúng dễ dàng nhường 1e để đạt cấu hình khí hiếm bền vững, thể hiện số oxi hoá +1.\n' +
      '1. Tác dụng với nước: Phản ứng mãnh liệt ở nhiệt độ thường giải phóng khí H₂ và tạo dung dịch kiềm mạnh: 2M + 2H₂O → 2M⁺ + 2OH⁻ + H₂↑. Vì thế, kim loại kiềm phải được bảo quản bằng cách ngâm ngập trong dầu hoả khan.\n' +
      '2. Tác dụng với phi kim: Bốc cháy trong khí chlorine, phản ứng mạnh với oxygen tạo oxit hoặc peroxide.\n\n' +
      'MỘT SỐ HỢP CHẤT QUAN TRỌNG:\n' +
      '— NaOH (caustic soda): Chất rắn màu trắng, hút ẩm mạnh, kiềm mạnh dùng trong dệt nhuộm, xà phòng.\n' +
      '— NaHCO₃ (baking soda): Chất bột trắng, dùng làm bột nở, thuốc đau dạ dày do thừa axit (phản ứng trung hoà nhẹ). Bị nhiệt phân huỷ: 2NaHCO₃ → Na₂CO₃ + CO₂↑ + H₂O (t°).\n' +
      '— Na₂CO₃ (soda): Hoá chất cơ bản dùng sản xuất thuỷ tinh, bột giặt, giấy.',
    workedExample: {
      problem:
        'Cho 4,6 gam kim loại Sodium (Na, M=23) phản ứng hoàn toàn với nước dư. ' +
        'Tính thể tích khí H₂ thoát ra ở điều kiện chuẩn (25 °C, 1 bar, thể tích mol 24,79 L/mol).',
      steps: [
        'Tính số mol Na: n = 4,6 / 23 = 0,2 mol.',
        'Viết phương trình phản ứng: 2Na + 2H₂O → 2NaOH + H₂↑.',
        'Theo tỉ lệ phương trình, số mol H₂ thu được bằng một nửa số mol Na phản ứng.',
        'Tính số mol H₂: nH₂ = 0,2 / 2 = 0,1 mol.',
        'Tính thể tích khí H₂ ở đkc: V = 0,1 * 24,79 = 2,479 L.',
      ],
      answer: '2,479 L',
    },
    checkQuestions: [
      {
        prompt:
          'Để bảo quản các kim loại kiềm như Sodium (Na) và Potassium (K) tránh tiếp xúc với không khí ẩm, người ta ngâm chúng trong chất lỏng nào sau đây?',
        choices: [
          { id: 'nuoc', label: 'Nước nguyên chất' },
          { id: 'dauhoa', label: 'Dầu hoả khan' },
          { id: 'ruou', label: 'Cồn cồn ethanol' },
        ],
        answer: { kind: 'choice', correctIds: ['dauhoa'] },
        explain:
          'Kim loại kiềm phản ứng mãnh liệt với nước và cả alcohol. Chúng không phản ứng với hydrocacbon trong dầu hoả nên được bảo quản bằng cách ngâm ngập trong dầu hoả.',
      },
      {
        prompt:
          'Khi đun nóng chất rắn sodium hydrogencarbonate (NaHCO₃), sản phẩm phân huỷ khí sinh ra là gì?',
        choices: [
          { id: 'o2', label: 'Khí oxygen (O₂)' },
          { id: 'co2', label: 'Khí carbon dioxide (CO₂)' },
          { id: 'h2', label: 'Khí hydrogen (H₂)' },
        ],
        answer: { kind: 'choice', correctIds: ['co2'] },
        explain:
          'Phản ứng nhiệt phân baking soda giải phóng khí CO₂ và hơi nước: 2NaHCO₃ → Na₂CO₃ + CO₂↑ + H₂O.',
      },
    ],
    srsCards: [
      {
        hoi: 'Các kim loại nhóm IA có mấy electron lớp ngoài cùng?',
        dap: 'Có 1 electron ở phân lớp ns¹.',
      },
      {
        hoi: 'Tại sao kim loại kiềm mềm và có nhiệt độ nóng chảy thấp?',
        dap: 'Do liên kết kim loại yếu trong cấu trúc mạng lập phương tâm khối.',
      },
      {
        hoi: 'Ứng dụng chính của NaHCO₃?',
        dap: 'Làm bột nở (baking soda), thuốc chữa đau dạ dày do thừa axit.',
      },
    ],
    animation: {
      title: 'Kim loại kiềm phản ứng với nước: càng xuống dưới nhóm càng mãnh liệt',
      description:
        'Ba cốc nước giống hệt nhau, mỗi cốc thả một mẩu kim loại kiềm. Phía trên là ba nguyên tử vẽ theo đúng tỉ lệ bán kính tăng dần: Li 152 pm, Na 186 pm, K 227 pm. Bán kính càng lớn thì electron hoá trị duy nhất càng ở xa hạt nhân và càng dễ bị mất, nên năng lượng ion hoá giảm dần từ Li xuống K. Hệ quả hiện ngay trong ba cốc: cốc Li chỉ sủi bọt đều đều, cốc Na sủi mạnh và mẩu kim loại nóng chảy thành giọt tròn chạy trên mặt nước, cốc K phản ứng dữ dội và khí hydrogen thoát ra bốc cháy ngay. Số bọt trong hình mỗi cốc một nhiều hơn. Cả ba đều theo cùng một phương trình 2M + 2H₂O → 2MOH + H₂, chỉ khác tốc độ.',
      viewBoxWidth: 470,
      viewBoxHeight: 240,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'at1',
          cx: 85,
          cy: 46,
          r: 15,
          fill: 'surface',
          stroke: 'primary',
          strokeWidth: 2,
        },
        {
          kind: 'circle',
          id: 'at2',
          cx: 235,
          cy: 46,
          r: 19,
          fill: 'surface',
          stroke: 'primary',
          strokeWidth: 2,
        },
        {
          kind: 'circle',
          id: 'at3',
          cx: 385,
          cy: 46,
          r: 23,
          fill: 'surface',
          stroke: 'primary',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'an1',
          x: 85,
          y: 50,
          text: 'Li',
          size: 11,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'an2',
          x: 235,
          y: 50,
          text: 'Na',
          size: 11,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'an3',
          x: 385,
          y: 50,
          text: 'K',
          size: 11,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'ar1',
          x: 85,
          y: 80,
          text: '152 pm',
          size: 9,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'ar2',
          x: 235,
          y: 80,
          text: '186 pm',
          size: 9,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'ar3',
          x: 385,
          y: 80,
          text: '227 pm',
          size: 9,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'rect',
          id: 'c1',
          x: 40,
          y: 100,
          w: 90,
          h: 90,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          rx: 4,
        },
        {
          kind: 'rect',
          id: 'w1',
          x: 44,
          y: 128,
          w: 82,
          h: 58,
          fill: 'primary',
          rx: 2,
          opacity: 0.3,
        },
        {
          kind: 'rect',
          id: 'c2',
          x: 190,
          y: 100,
          w: 90,
          h: 90,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          rx: 4,
        },
        {
          kind: 'rect',
          id: 'w2',
          x: 194,
          y: 128,
          w: 82,
          h: 58,
          fill: 'primary',
          rx: 2,
          opacity: 0.3,
        },
        {
          kind: 'rect',
          id: 'c3',
          x: 340,
          y: 100,
          w: 90,
          h: 90,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          rx: 4,
        },
        {
          kind: 'rect',
          id: 'w3',
          x: 344,
          y: 128,
          w: 82,
          h: 58,
          fill: 'primary',
          rx: 2,
          opacity: 0.3,
        },
        {
          kind: 'circle',
          id: 'b11',
          cx: 70,
          cy: 170,
          r: 4,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 4000,
              dy: -44,
              opacity: 0,
            },
            {
              atMs: 8000,
              dy: -44,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'b12',
          cx: 100,
          cy: 176,
          r: 4,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 5200,
              dy: -50,
              opacity: 0,
            },
            {
              atMs: 8000,
              dy: -50,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'b21',
          cx: 212,
          cy: 170,
          r: 5,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 2200,
              dy: -44,
              opacity: 0,
            },
            {
              atMs: 8000,
              dy: -44,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'b22',
          cx: 238,
          cy: 176,
          r: 5,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 2800,
              dy: -50,
              opacity: 0,
            },
            {
              atMs: 8000,
              dy: -50,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'b23',
          cx: 262,
          cy: 168,
          r: 5,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 3400,
              dy: -42,
              opacity: 0,
            },
            {
              atMs: 8000,
              dy: -42,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'b31',
          cx: 360,
          cy: 170,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 1200,
              dy: -46,
              opacity: 0,
            },
            {
              atMs: 8000,
              dy: -46,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'b32',
          cx: 386,
          cy: 176,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 1600,
              dy: -52,
              opacity: 0,
            },
            {
              atMs: 8000,
              dy: -52,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'b33',
          cx: 410,
          cy: 166,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 2000,
              dy: -42,
              opacity: 0,
            },
            {
              atMs: 8000,
              dy: -42,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'b34',
          cx: 372,
          cy: 180,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 2400,
              dy: -56,
              opacity: 0,
            },
            {
              atMs: 8000,
              dy: -56,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'r1',
          x: 85,
          y: 206,
          text: 'sủi bọt đều',
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
              atMs: 1400,
              opacity: 0,
            },
            {
              atMs: 1900,
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
          id: 'r2',
          x: 235,
          y: 206,
          text: 'sủi mạnh, kim loại chảy thành giọt',
          size: 10,
          anchor: 'middle',
          fill: 'neutral',
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
              atMs: 3100,
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
          id: 'r3',
          x: 385,
          y: 206,
          text: 'dữ dội, hydrogen bốc cháy',
          size: 10,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3800,
              opacity: 0,
            },
            {
              atMs: 4300,
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
          id: 'pt',
          x: 235,
          y: 232,
          text: '2M + 2H₂O → 2MOH + H₂↑ — cùng phương trình, khác tốc độ',
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
              atMs: 5400,
              opacity: 0,
            },
            {
              atMs: 5900,
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
          atMs: 0,
          text: 'Bán kính tăng dần Li → Na → K, electron hoá trị càng xa hạt nhân.',
        },
        {
          atMs: 1400,
          text: 'Càng dễ mất electron thì phản ứng với nước càng mạnh.',
        },
        {
          atMs: 3800,
          text: 'Li sủi đều, Na chảy thành giọt, K phản ứng dữ dội và bốc cháy.',
        },
        {
          atMs: 5400,
          text: 'Cả ba đều theo 2M + 2H₂O → 2MOH + H₂↑, chỉ khác tốc độ.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa12-c7-b25',
    grade: '12',
    chapterNumber: 7,
    chapterTitle: 'Nguyên tố nhóm IA và nhóm IIA',
    lessonNumber: 25,
    title: 'Nguyên tố nhóm IIA',
    hook:
      'Canxi (Calcium) cấu tạo nên bộ xương chắc khoẻ của chúng ta và kiến tạo nên những hang động đá vôi kỳ vĩ.' +
      ' Các kim loại kiềm thổ này ẩn chứa nhiều quy luật hoá học lý thú.',
    theory:
      'VỊ TRÍ VÀ CẤU TẠO:\n' +
      '— Nhóm IIA (kim loại kiềm thổ) gồm: Beryllium (Be), Magnesium (Mg), Calcium (Ca), Strontium (Sr), Barium (Ba). Có 2 electron ở lớp ngoài cùng (ns²).\n\n' +
      'TÍNH CHẤT HOÁ HỌC (Tính khử mạnh, tăng dần từ Be đến Ba):\n' +
      '— Nhường 2e trong các phản ứng hoá học, đạt số oxi hoá +2.\n' +
      '— Phản ứng với nước: Be không phản ứng; Mg phản ứng rất chậm với nước nóng; Ca, Sr, Ba phản ứng mạnh với nước ở nhiệt độ thường tạo dung dịch base: Ca + 2H₂O → Ca(OH)₂ + H₂↑.\n\n' +
      'SỰ TẠO THÀNH THẠCH NHŨ HANG ĐỘNG:\n' +
      '— Giải thích bằng phản ứng thuận nghịch: CaCO₃ + CO₂ + H₂O ⇌ Ca(HCO₃)₂.\n' +
      '   — Chiều thuận (đun nóng hoặc nhiều CO₂ trong nước mưa): Hoà tan đá vôi tạo hang động.\n' +
      '   — Chiều nghịch (nhiệt độ giảm, áp suất CO₂ giảm): Kết tủa lại CaCO₃ tạo nên các măng đá, thạch nhũ lấp lánh.\n\n' +
      'NƯỚC CỨNG (Hard Water):\n' +
      '— Định nghĩa: Là nước chứa nhiều ion Ca²⁺ và Mg²⁺ (nước chứa ít hoặc không chứa các ion này gọi là nước mềm).\n' +
      '— Phân loại:\n' +
      '  1. Nước cứng tạm thời: Chứa các muối Ca(HCO₃)₂ và Mg(HCO₃)₂. Gọi là tạm thời vì có thể loại bỏ tính cứng đơn giản bằng cách đun sôi (muối hidrocacbonate bị nhiệt phân tạo kết tủa CaCO₃/MgCO₃).\n' +
      '  2. Nước cứng vĩnh cửu: Chứa các ion Ca²⁺, Mg²⁺ cùng với các anion Cl⁻, SO₄²⁻. Đun sôi không làm mất tính cứng.\n' +
      '  3. Nước cứng toàn phần: Gồm cả tính cứng tạm thời và vĩnh cửu.\n' +
      '— Phương pháp làm mềm nước cứng: Phương pháp kết tủa (dùng các chất kiềm vừa đủ hoặc Na₂CO₃, Na₃PO₄ để tạo kết tủa lọc bỏ) và Phương pháp trao đổi ion (dùng hạt nhựa zeolite thế ion Ca²⁺/Mg²⁺ bằng Na⁺/H⁺).',
    workedExample: {
      problem:
        'Giải thích vì sao đun sôi nước có thể làm mềm nước cứng tạm thời, và viết phương trình minh hoạ.',
      steps: [
        'Nước cứng tạm thời chứa các muối calcium hydrogencarbonate Ca(HCO₃)₂ và magnesium hydrogencarbonate Mg(HCO₃)₂ tan được trong nước.',
        'Khi đun sôi nước, nhiệt độ cao làm phân huỷ các muối hydrogencarbonate kém bền nhiệt tạo thành muối carbonate kết tủa không tan:\n  Ca(HCO₃)₂ → CaCO₃↓ + CO₂↑ + H₂O (t°).\n  Mg(HCO₃)₂ → MgCO₃↓ + CO₂↑ + H₂O (t°).',
        'Lọc bỏ các chất kết tủa lắng xuống đáy, ta loại bỏ được phần lớn các ion Ca²⁺ và Mg²⁺ ra khỏi dung dịch nước.',
        'Nước sau đun sôi trở thành nước mềm.',
      ],
      answer: 'Do nhiệt phân muối hydrogencarbonate tạo kết tủa',
    },
    checkQuestions: [
      {
        prompt: 'Nước cứng là nước chứa nhiều loại ion nào sau đây?',
        choices: [
          { id: 'na_k', label: 'Sodium (Na⁺) và Potassium (K⁺)' },
          { id: 'ca_mg', label: 'Calcium (Ca²⁺) và Magnesium (Mg²⁺)' },
          { id: 'fe_al', label: 'Iron (Fe³⁺) và Aluminium (Al³⁺)' },
        ],
        answer: { kind: 'choice', correctIds: ['ca_mg'] },
        explain: 'Theo định nghĩa, nước cứng là nước có chứa hàm lượng cao các ion Ca²⁺ và Mg²⁺.',
      },
      {
        prompt:
          'Hoá chất nào sau đây có thể dùng để làm mềm cả nước cứng tạm thời và nước cứng vĩnh cửu bằng phương pháp kết tủa?',
        choices: [
          { id: 'hcl', label: 'Dung dịch acid HCl' },
          { id: 'na2co3', label: 'Dung dịch Sodium carbonate (Na₂CO₃)' },
          { id: 'nacl', label: 'Dung dịch muối ăn NaCl' },
        ],
        answer: { kind: 'choice', correctIds: ['na2co3'] },
        explain:
          'Na₂CO₃ cung cấp ion CO₃²⁻. Ion này kết hợp với Ca²⁺ và Mg²⁺ tạo kết tủa CaCO₃ và MgCO₃ không tan kể cả trong nước cứng vĩnh cửu, giúp làm mềm nước.',
      },
    ],
    srsCards: [
      { hoi: 'Kim loại nào thuộc nhóm IIA không phản ứng với nước?', dap: 'Beryllium (Be).' },
      {
        hoi: 'Phản ứng giải thích sự xâm thực đá vôi của nước mưa tạo hang động?',
        dap: 'CaCO₃ + CO₂ + H₂O ⇌ Ca(HCO₃)₂ (chiều thuận).',
      },
      {
        hoi: 'Thế nào là nước cứng vĩnh cửu?',
        dap: 'Nước chứa ion Ca²⁺, Mg²⁺ cùng với ion Cl⁻ hoặc SO₄²⁻.',
      },
    ],
    animation: {
      title: 'Nước cứng tạm thời: vì sao đun nước lại sinh cặn vôi',
      description:
        'Cốc bên trái đựng nước cứng tạm thời, trong suốt: ion Ca²⁺ và ion HCO₃⁻ đang tan hoàn toàn nên không nhìn thấy gì. Nguồn nhiệt bật lên dưới đáy cốc, nhiệt độ tăng làm ion HCO₃⁻ phân huỷ: Ca(HCO₃)₂ → CaCO₃↓ + CO₂↑ + H₂O. Bong bóng CO₂ nổi lên rồi thoát khỏi mặt nước, còn CaCO₃ không tan thì lắng xuống thành lớp cặn trắng bám đáy — đúng lớp cặn ta thấy trong ấm đun nước lâu ngày. Mũi tên bên phải cho thấy cùng phản ứng ấy chạy theo chiều ngược lại trong hang động: nước mưa có CO₂ hoà tan đá vôi thành Ca(HCO₃)₂ tan được, nước nhỏ giọt xuống hang mất CO₂ và CaCO₃ kết tinh lại, tích tụ hàng nghìn năm thành thạch nhũ. Một phương trình, hai chiều, giải thích cả cặn ấm nước lẫn nhũ đá.',
      viewBoxWidth: 470,
      viewBoxHeight: 240,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'rect',
          id: 'coc',
          x: 50,
          y: 66,
          w: 110,
          h: 110,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          rx: 4,
        },
        {
          kind: 'rect',
          id: 'nuoc',
          x: 54,
          y: 96,
          w: 102,
          h: 76,
          fill: 'primary',
          rx: 2,
          opacity: 0.28,
        },
        {
          kind: 'label',
          id: 'ion1',
          x: 105,
          y: 118,
          text: 'Ca²⁺ + HCO₃⁻ tan',
          size: 10,
          anchor: 'middle',
          fill: 'neutral',
          keyframes: [
            {
              atMs: 0,
              opacity: 1,
            },
            {
              atMs: 2600,
              opacity: 1,
            },
            {
              atMs: 3400,
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
          id: 'lua',
          x: 105,
          y: 194,
          text: 'đun nóng',
          size: 11,
          anchor: 'middle',
          fill: 'accent',
        },
        {
          kind: 'circle',
          id: 'co1',
          cx: 80,
          cy: 160,
          r: 5,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
              dy: 0,
            },
            {
              atMs: 2000,
              opacity: 1,
              dy: 0,
            },
            {
              atMs: 4200,
              opacity: 1,
              dy: -66,
            },
            {
              atMs: 4600,
              opacity: 0,
              dy: -76,
            },
            {
              atMs: 8000,
              opacity: 0,
              dy: -76,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'co2',
          cx: 118,
          cy: 164,
          r: 5,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
              dy: 0,
            },
            {
              atMs: 2600,
              opacity: 1,
              dy: 0,
            },
            {
              atMs: 4800,
              opacity: 1,
              dy: -70,
            },
            {
              atMs: 5200,
              opacity: 0,
              dy: -80,
            },
            {
              atMs: 8000,
              opacity: 0,
              dy: -80,
            },
          ],
        },
        {
          kind: 'label',
          id: 'cot',
          x: 105,
          y: 56,
          text: 'CO₂ bay ra',
          size: 10,
          anchor: 'middle',
          fill: 'neutral',
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
          kind: 'rect',
          id: 'can',
          x: 56,
          y: 164,
          w: 98,
          h: 8,
          fill: 'muted',
          rx: 2,
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
              atMs: 5000,
              opacity: 0.9,
            },
            {
              atMs: 8000,
              opacity: 0.9,
            },
          ],
        },
        {
          kind: 'label',
          id: 'cant',
          x: 105,
          y: 216,
          text: 'cặn CaCO₃ trắng bám đáy ấm',
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
              atMs: 5000,
              opacity: 0,
            },
            {
              atMs: 5500,
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
          id: 'pt',
          x: 300,
          y: 78,
          text: 'Ca(HCO₃)₂ → CaCO₃↓ + CO₂↑ + H₂O',
          size: 12,
          anchor: 'start',
          fill: 'primary',
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
          id: 'xuoi',
          x1: 220,
          y1: 122,
          x2: 430,
          y2: 122,
          stroke: 'primary',
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
          id: 'xuoit',
          x: 325,
          y: 112,
          text: 'đun nóng: cặn vôi trong ấm',
          size: 10,
          anchor: 'middle',
          fill: 'neutral',
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
          id: 'nguoc',
          x1: 430,
          y1: 152,
          x2: 220,
          y2: 152,
          stroke: 'accent',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 6000,
              opacity: 0,
            },
            {
              atMs: 6500,
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
          id: 'nguoct',
          x: 325,
          y: 170,
          text: 'nước mưa có CO₂ hoà tan đá vôi',
          size: 10,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 6000,
              opacity: 0,
            },
            {
              atMs: 6500,
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
          id: 'nhu',
          x: 325,
          y: 196,
          text: 'nước nhỏ giọt mất CO₂ → CaCO₃ kết tinh',
          size: 10,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 6600,
              opacity: 0,
            },
            {
              atMs: 7100,
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
          id: 'nhu2',
          x: 325,
          y: 216,
          text: 'tích tụ nghìn năm thành thạch nhũ',
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
              atMs: 6600,
              opacity: 0,
            },
            {
              atMs: 7100,
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
          atMs: 0,
          text: 'Nước cứng tạm thời trong suốt: Ca²⁺ và HCO₃⁻ đang tan hết.',
        },
        {
          atMs: 2000,
          text: 'Đun nóng: HCO₃⁻ phân huỷ, CO₂ sủi lên và bay ra khỏi nước.',
        },
        {
          atMs: 5000,
          text: 'CaCO₃ không tan lắng xuống thành cặn trắng bám đáy ấm.',
        },
        {
          atMs: 6200,
          text: 'Chiều ngược lại trong hang động tạo nên thạch nhũ.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa12-c7-b26',
    grade: '12',
    chapterNumber: 7,
    chapterTitle: 'Nguyên tố nhóm IA và nhóm IIA',
    lessonNumber: 26,
    title: 'Ôn tập chương 7 — Nguyên tố nhóm IA và nhóm IIA',
    hook:
      'Chương 7 đúc kết các thuộc tính hoá học của hai nhóm kim loại hoạt động mạnh mẽ nhất bảng tuần hoàn, ' +
      'ứng dụng thực tế của kiềm và các kỹ thuật xử lý nước cứng trong đời sống.',
    theory:
      'TỔNG KẾT KIẾN THỨC CHƯƠNG 7:\n' +
      '1. Kim loại kiềm (nhóm IA): Li, Na, K, Rb, Cs. Cấu hình ns¹. Hoạt tính cực mạnh, phản ứng mãnh liệt với nước tạo dung dịch kiềm mạnh và H₂. Bảo quản bằng cách ngâm dầu hoả. NaOH là kiềm mạnh; NaHCO₃ có tính lưỡng tính yếu, bị nhiệt phân giải phóng CO₂; Na₂CO₃ dùng làm mềm nước và sản xuất thuỷ tinh.\n' +
      '2. Kim loại kiềm thổ (nhóm IIA): Be, Mg, Ca, Sr, Ba. Cấu hình ns². Be trơ với nước, Mg phản ứng nóng, Ca/Sr/Ba phản ứng nguội. Phản ứng xâm thực đá vôi và tạo thạch nhũ hang động là phản ứng thuận nghịch của hệ CaCO₃/Ca(HCO₃)₂.\n' +
      '3. Nước cứng: Chứa nhiều Ca²⁺, Mg²⁺. Tạm thời (chứa HCO₃⁻, đun sôi làm mềm được). Vĩnh cửu (chứa Cl⁻, SO₄²⁻, đun sôi không làm mềm được). Làm mềm bằng cách dùng kết tủa (Na₂CO₃, Na₃PO₄) hoặc dùng nhựa trao đổi ion.',
    workedExample: {
      problem:
        'Cần thêm tối thiểu bao nhiêu gam dung dịch sodium carbonate Na₂CO₃ 10,6% vào nước cứng chứa ' +
        '0,01 mol ion Ca²⁺ để kết tủa hoàn toàn ion này?',
      steps: [
        'Viết phương trình phản ứng tạo kết tủa: Ca²⁺ + CO₃²⁻ → CaCO₃↓.',
        'Theo phương trình, số mol ion CO₃²⁻ cần dùng bằng số mol Ca²⁺ = 0,01 mol.',
        'Nguồn cung cấp CO₃²⁻ là muối Na₂CO₃, số mol Na₂CO₃ cần = 0,01 mol.',
        'Tính khối lượng chất tan Na₂CO₃ (M=106) cần dùng: m = 0,01 * 106 = 1,06 gam.',
        'Tính khối lượng dung dịch Na₂CO₃ 10,6% cần dùng: m_dd = m * 100 / 10,6 = 1,06 * 100 / 10,6 = 10 gam.',
      ],
      answer: '10 gam',
    },
    checkQuestions: [
      {
        prompt:
          'Trong các kim loại kiềm thổ sau, kim loại nào phản ứng mãnh liệt nhất với nước ở nhiệt độ thường?',
        choices: [
          { id: 'be', label: 'Beryllium (Be)' },
          { id: 'mg', label: 'Magnesium (Mg)' },
          { id: 'ba', label: 'Barium (Ba)' },
        ],
        answer: { kind: 'choice', correctIds: ['ba'] },
        explain:
          'Tính khử của kim loại kiềm thổ tăng dần từ Be đến Ba. Barium phản ứng mãnh liệt nhất với nước trong nhóm IIA ở nhiệt độ thường.',
      },
      {
        prompt: 'Chất nào sau đây không thể dùng để làm mềm nước cứng tạm thời?',
        choices: [
          { id: 'na2co3', label: 'Na₂CO₃' },
          { id: 'hcl', label: 'HCl' },
          { id: 'caoh2', label: 'Ca(OH)₂ (vừa đủ)' },
          { id: 'na3po4', label: 'Na₃PO₄' },
        ],
        answer: { kind: 'choice', correctIds: ['hcl'] },
        explain:
          'Axit HCl tác dụng với muối hydrogencarbonate giải phóng CO₂ nhưng không làm kết tủa ion Ca²⁺/Mg²⁺, ngược lại còn làm tăng nồng độ anion Cl⁻ trong nước, không làm mềm nước.',
      },
    ],
    srsCards: [
      { hoi: 'Muối baking soda có công thức hoá học là gì?', dap: 'NaHCO₃.' },
      {
        hoi: 'Măng đá, thạch nhũ cấu tạo chủ yếu từ hợp chất nào?',
        dap: 'Calcium carbonate (CaCO₃).',
      },
      {
        hoi: 'Hai phương pháp chính làm mềm nước cứng?',
        dap: 'Phương pháp kết tủa hoá học và phương pháp trao đổi ion.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
