// lessons/hoa10c7.ts — Hoá học 10, Chương 7: Nhóm halogen (2 bài).
import type { ChemLesson } from '../lessonTypes.js'

export const HOA10_C7_LESSONS: ChemLesson[] = [
  {
    id: 'hoa10-c7-b16',
    grade: '10',
    chapterNumber: 7,
    chapterTitle: 'Nhóm halogen',
    lessonNumber: 16,
    title: 'Nhóm halogen',
    hook:
      'Nước máy có mùi Chlorine — chính nguyên tố này khử trùng nước sinh hoạt của hàng tỷ ' +
      'người mỗi ngày. Vì sao nhóm halogen lại có tính oxi hoá mạnh đến vậy?',
    theory:
      'NHÓM HALOGEN (nhóm VIIA) gồm: Fluorine (F), Chlorine (Cl), Bromine (Br), Iodine (I) — ' +
      'đều có 7 electron lớp ngoài cùng, chỉ cần nhận thêm 1 electron để đạt octet.\n\n' +
      'Vì vậy halogen có TÍNH OXI HOÁ MẠNH (dễ nhận electron) — tính oxi hoá GIẢM DẦN theo ' +
      'chiều F > Cl > Br > I (đúng xu hướng độ âm điện giảm dần khi đi xuống nhóm).\n\n' +
      'Đơn chất halogen tồn tại ở dạng PHÂN TỬ HAI NGUYÊN TỬ (X₂), liên kết cộng hoá trị ' +
      'không cực. Trạng thái ở điều kiện thường: F₂ (khí), Cl₂ (khí), Br₂ (lỏng), I₂ (rắn) — ' +
      'màu sắc và trạng thái biến đổi theo chiều tăng khối lượng phân tử.\n\n' +
      'Tính chất hoá học đặc trưng: halogen phản ứng được với hầu hết kim loại tạo muối ' +
      'halide, phản ứng với hydrogen tạo hydrogen halide (HX), và các halogen mạnh hơn có ' +
      'thể ĐẨY halogen yếu hơn ra khỏi muối halide của nó (Cl₂ đẩy được Br₂ ra khỏi dung ' +
      'dịch muối bromide, do Cl có tính oxi hoá mạnh hơn Br).',
    workedExample: {
      problem: 'Cho khí Cl₂ vào dung dịch NaBr. Dự đoán hiện tượng xảy ra và giải thích.',
      steps: [
        'So sánh tính oxi hoá: Cl có độ âm điện lớn hơn Br (Cl đứng trên Br trong nhóm VIIA) ' +
          '⇒ Cl₂ có tính oxi hoá MẠNH HƠN Br₂.',
        'Chất có tính oxi hoá mạnh hơn sẽ đẩy được chất có tính oxi hoá yếu hơn ra khỏi muối ' +
          'của nó.',
        'Phản ứng xảy ra: Cl₂ + 2NaBr → 2NaCl + Br₂.',
        'Hiện tượng: dung dịch chuyển màu (xuất hiện Br₂ màu nâu đỏ/vàng cam).',
      ],
      answer: 'Cl₂ + 2NaBr → 2NaCl + Br₂ — dung dịch chuyển màu do Br₂ sinh ra.',
    },
    checkQuestions: [
      {
        prompt: 'Tính oxi hoá của các halogen biến đổi theo chiều nào (từ mạnh đến yếu)?',
        choices: [
          { id: 'a', label: 'F > Cl > Br > I' },
          { id: 'b', label: 'I > Br > Cl > F' },
          { id: 'c', label: 'Cl > F > I > Br' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain:
          'Đúng xu hướng độ âm điện giảm dần khi đi xuống nhóm VIIA: F có tính oxi hoá mạnh nhất, I yếu nhất trong 4 halogen phổ biến.',
      },
      {
        prompt: 'Nguyên tử halogen cần nhận thêm bao nhiêu electron để đạt cấu hình octet bền?',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'Halogen có 7 electron lớp ngoài cùng, chỉ cần thêm 1e để đủ 8 — đây là lý do chúng có tính oxi hoá mạnh, dễ nhận electron.',
      },
    ],
    srsCards: [
      {
        hoi: 'Nhóm halogen gồm những nguyên tố nào?',
        dap: 'Fluorine (F), Chlorine (Cl), Bromine (Br), Iodine (I) — nhóm VIIA.',
      },
      {
        hoi: 'Tính oxi hoá của halogen biến đổi thế nào từ F đến I?',
        dap: 'Giảm dần: F > Cl > Br > I.',
      },
      {
        hoi: 'Đơn chất halogen tồn tại ở dạng gì?',
        dap: 'Phân tử hai nguyên tử (X₂), liên kết cộng hoá trị không cực.',
      },
    ],
    animation: {
      title: 'Từ F₂ đến I₂: nhiệt độ sôi tăng và trạng thái đổi từ khí sang rắn',
      description:
        'Trục dọc là nhiệt độ sôi tính bằng độ C, bốn cột lần lượt là F₂, Cl₂, Br₂, I₂. Các điểm hiện lên theo thứ tự và đi lên rất rõ: F₂ sôi ở −188 °C, Cl₂ ở −34 °C, Br₂ ở 59 °C, I₂ ở 184 °C. Một đường ngang ở mức 25 °C cắt qua đường đi lên đó và chia bốn halogen thành ba nhóm trạng thái ở điều kiện thường: F₂ và Cl₂ nằm dưới đường nên là chất khí, Br₂ ở ngay trên là chất lỏng, I₂ ở cao nhất là chất rắn. Nguyên nhân là phân tử càng nặng thì tương tác van der Waals giữa các phân tử càng mạnh, chứ không phải liên kết trong phân tử thay đổi.',
      viewBoxWidth: 440,
      viewBoxHeight: 240,
      durationMs: 7000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'tx',
          x1: 50,
          y1: 210,
          x2: 420,
          y2: 210,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'ty',
          x1: 50,
          y1: 210,
          x2: 50,
          y2: 40,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'tyt',
          x: 55,
          y: 36,
          text: 'nhiệt độ sôi (°C)',
          size: 10,
          anchor: 'start',
          fill: 'muted',
        },
        {
          kind: 'line',
          id: 'phong',
          x1: 50,
          y1: 150,
          x2: 420,
          y2: 150,
          stroke: 'muted',
          strokeWidth: 1.5,
          dash: '5 4',
        },
        {
          kind: 'label',
          id: 'phongt',
          x: 415,
          y: 144,
          text: '25 °C (nhiệt độ thường)',
          size: 10,
          anchor: 'end',
          fill: 'muted',
        },
        {
          kind: 'polyline',
          id: 'duong',
          points: [
            [110, 196],
            [190, 142],
            [270, 109],
            [350, 65],
          ],
          stroke: 'primary',
          strokeWidth: 2.5,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 400,
              opacity: 0,
            },
            {
              atMs: 3400,
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
          id: 'p1',
          cx: 110,
          cy: 196,
          r: 7,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 400,
              opacity: 0,
            },
            {
              atMs: 800,
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
          id: 'p2',
          cx: 190,
          cy: 142,
          r: 7,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1200,
              opacity: 0,
            },
            {
              atMs: 1600,
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
          id: 'p3',
          cx: 270,
          cy: 109,
          r: 7,
          fill: 'primary',
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
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'p4',
          cx: 350,
          cy: 65,
          r: 7,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2800,
              opacity: 0,
            },
            {
              atMs: 3200,
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
          id: 'l1',
          x: 110,
          y: 228,
          text: 'F₂',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'l2',
          x: 190,
          y: 228,
          text: 'Cl₂',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'l3',
          x: 270,
          y: 228,
          text: 'Br₂',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'l4',
          x: 350,
          y: 228,
          text: 'I₂',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'v1',
          x: 110,
          y: 188,
          text: '−188',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'v2',
          x: 190,
          y: 134,
          text: '−34',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'v3',
          x: 270,
          y: 101,
          text: '59',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'v4',
          x: 350,
          y: 57,
          text: '184',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 's1',
          x: 150,
          y: 172,
          text: 'khí',
          size: 11,
          anchor: 'middle',
          fill: 'muted',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4000,
              opacity: 0,
            },
            {
              atMs: 4500,
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
          id: 's2',
          x: 270,
          y: 172,
          text: 'lỏng',
          size: 11,
          anchor: 'middle',
          fill: 'muted',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4500,
              opacity: 0,
            },
            {
              atMs: 5000,
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
          id: 's3',
          x: 350,
          y: 172,
          text: 'rắn',
          size: 11,
          anchor: 'middle',
          fill: 'muted',
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
      ],
      captions: [
        {
          atMs: 0,
          text: 'Nhiệt độ sôi tăng đều từ F₂ (−188 °C) tới I₂ (184 °C).',
        },
        {
          atMs: 3400,
          text: 'Phân tử càng nặng, tương tác van der Waals càng mạnh, càng khó tách rời.',
        },
        {
          atMs: 4400,
          text: 'Ở nhiệt độ thường: F₂, Cl₂ là khí; Br₂ lỏng; I₂ rắn.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa10-c7-b17',
    grade: '10',
    chapterNumber: 7,
    chapterTitle: 'Nhóm halogen',
    lessonNumber: 17,
    title: 'Hydrogen halide và một số phản ứng của ion halide',
    hook:
      'Acid trong dạ dày (HCl) giúp tiêu hoá thức ăn, nhưng cũng là hydrogen halide — cùng ' +
      'họ hoá chất với acid dùng để khắc kính (HF).',
    theory:
      'HYDROGEN HALIDE (HX, với X = F, Cl, Br, I) là hợp chất giữa hydrogen và halogen, liên ' +
      'kết cộng hoá trị CÓ CỰC (do halogen có độ âm điện lớn hơn hydrogen).\n\n' +
      'Khi tan trong nước, hydrogen halide tạo thành HYDROHALIC ACID (dung dịch acid). Độ ' +
      'mạnh acid tăng dần: HF (acid yếu, do liên kết H-F ngắn và bền) < HCl < HBr < HI (acid ' +
      'mạnh nhất).\n\n' +
      'PHẢN ỨNG NHẬN BIẾT ION HALIDE (Cl⁻, Br⁻, I⁻) bằng dung dịch AgNO₃: tạo kết tủa với ' +
      'màu sắc đặc trưng khác nhau —\n' +
      '— AgCl: kết tủa TRẮNG\n' +
      '— AgBr: kết tủa VÀNG NHẠT\n' +
      '— AgI: kết tủa VÀNG ĐẬM\n' +
      '(F⁻ không tạo kết tủa với Ag⁺ do AgF tan trong nước — đây là ngoại lệ đáng nhớ.)\n\n' +
      'Phản ứng tổng quát: X⁻ + Ag⁺ → AgX↓ (X = Cl, Br, I).',
    workedExample: {
      problem:
        'Có 2 dung dịch không màu đựng riêng biệt: NaCl và NaBr. Nêu cách phân biệt hai dung ' +
        'dịch này bằng một thuốc thử.',
      steps: [
        'Chọn thuốc thử: dung dịch AgNO₃ (bạc nitrate).',
        'Nhỏ AgNO₃ vào từng mẫu thử.',
        'Nếu xuất hiện kết tủa TRẮNG (AgCl) ⇒ mẫu đó là dung dịch NaCl.',
        'Nếu xuất hiện kết tủa VÀNG NHẠT (AgBr) ⇒ mẫu đó là dung dịch NaBr.',
      ],
      answer: 'Dùng AgNO₃: NaCl cho kết tủa trắng (AgCl), NaBr cho kết tủa vàng nhạt (AgBr).',
    },
    checkQuestions: [
      {
        prompt: 'Ion Cl⁻ tạo kết tủa màu gì khi phản ứng với dung dịch AgNO₃?',
        choices: [
          { id: 'trang', label: 'Trắng' },
          { id: 'vangnhat', label: 'Vàng nhạt' },
          { id: 'vangdam', label: 'Vàng đậm' },
        ],
        answer: { kind: 'choice', correctIds: ['trang'] },
        explain:
          'AgCl là kết tủa TRẮNG — dùng để nhận biết ion Cl⁻ (khác với AgBr vàng nhạt, AgI vàng đậm).',
      },
      {
        prompt: 'Trong 4 acid HF, HCl, HBr, HI, acid nào MẠNH NHẤT?',
        choices: [
          { id: 'HF', label: 'HF' },
          { id: 'HI', label: 'HI' },
        ],
        answer: { kind: 'choice', correctIds: ['HI'] },
        explain:
          'Độ mạnh acid tăng dần HF < HCl < HBr < HI — HI mạnh nhất do liên kết H-I dài, dễ phân li H⁺ nhất.',
      },
    ],
    srsCards: [
      { hoi: 'Kết tủa của AgCl có màu gì?', dap: 'Trắng.' },
      { hoi: 'Kết tủa của AgBr có màu gì?', dap: 'Vàng nhạt.' },
      { hoi: 'Ion halide nào KHÔNG tạo kết tủa với Ag⁺?', dap: 'F⁻ (vì AgF tan trong nước).' },
      {
        hoi: 'Độ mạnh acid của các hydrohalic acid tăng theo chiều nào?',
        dap: 'HF < HCl < HBr < HI.',
      },
    ],
    animation: {
      title: 'Nhiệt độ sôi bất thường của HF và trật tự tính acid HF < HCl < HBr < HI',
      description:
        'Đường nét đứt là dự đoán ngây thơ: phân tử càng nhẹ thì sôi càng thấp, nên HF lẽ ra phải nằm thấp nhất, khoảng −100 °C. Đường nét liền là số liệu thật: HCl sôi ở −85 °C, HBr ở −67 °C, HI ở −35 °C đúng như dự đoán, nhưng HF lại vọt lên +19,5 °C — cao hơn cả HI. Lý do hiện ở góc: giữa các phân tử HF có liên kết hydrogen nối F của phân tử này với H của phân tử kia, phải phá thêm lực đó mới bay hơi được. Thanh bên dưới cho thấy tính acid trong dung dịch lại đi theo chiều ngược của mạnh yếu liên kết H–X: HF là acid yếu, còn HCl, HBr, HI đều là acid mạnh và mạnh dần xuống HI.',
      viewBoxWidth: 470,
      viewBoxHeight: 250,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'tx',
          x1: 55,
          y1: 175,
          x2: 430,
          y2: 175,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'ty',
          x1: 55,
          y1: 175,
          x2: 55,
          y2: 30,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'tyt',
          x: 60,
          y: 28,
          text: 'nhiệt độ sôi (°C)',
          size: 10,
          anchor: 'start',
          fill: 'muted',
        },
        {
          kind: 'polyline',
          id: 'dudoan',
          points: [
            [100, 160],
            [190, 140],
            [280, 122],
            [370, 100],
          ],
          stroke: 'muted',
          strokeWidth: 2,
          dash: '5 4',
        },
        {
          kind: 'label',
          id: 'ddt',
          x: 100,
          y: 172,
          text: 'dự đoán',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'polyline',
          id: 'that',
          points: [
            [100, 52],
            [190, 140],
            [280, 122],
            [370, 100],
          ],
          stroke: 'primary',
          strokeWidth: 2.5,
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
              atMs: 2400,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'q1',
          cx: 100,
          cy: 52,
          r: 7,
          fill: 'primary',
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
              atMs: 1800,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'q2',
          cx: 190,
          cy: 140,
          r: 7,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 400,
              opacity: 0,
            },
            {
              atMs: 800,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'q3',
          cx: 280,
          cy: 122,
          r: 7,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 700,
              opacity: 0,
            },
            {
              atMs: 1100,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'q4',
          cx: 370,
          cy: 100,
          r: 7,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1000,
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
          id: 'x1',
          x: 100,
          y: 194,
          text: 'HF',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'x2',
          x: 190,
          y: 194,
          text: 'HCl',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'x3',
          x: 280,
          y: 194,
          text: 'HBr',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'x4',
          x: 370,
          y: 194,
          text: 'HI',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'v1',
          x: 100,
          y: 42,
          text: '+19,5',
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
              atMs: 1400,
              opacity: 0,
            },
            {
              atMs: 1800,
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
          id: 'v2',
          x: 190,
          y: 132,
          text: '−85',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'v4',
          x: 370,
          y: 92,
          text: '−35',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'lh',
          x: 300,
          y: 50,
          text: 'liên kết hydrogen F···H–F giữ HF lại',
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
              atMs: 2600,
              opacity: 0,
            },
            {
              atMs: 3200,
              opacity: 1,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'lhn',
          x1: 232,
          y1: 56,
          x2: 292,
          y2: 56,
          stroke: 'accent',
          strokeWidth: 1.5,
          dash: '3 3',
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
              atMs: 3200,
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
          id: 'acid',
          x1: 100,
          y1: 224,
          x2: 370,
          y2: 224,
          stroke: 'accent',
          strokeWidth: 2,
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
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'acidt',
          x: 235,
          y: 244,
          text: 'tính acid tăng: HF yếu → HCl, HBr, HI mạnh dần',
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
              atMs: 4600,
              opacity: 0,
            },
            {
              atMs: 5200,
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
          text: 'HCl, HBr, HI sôi cao dần theo khối lượng phân tử — đúng như dự đoán.',
        },
        {
          atMs: 1400,
          text: 'HF thì vọt lên +19,5 °C, phá vỡ quy luật.',
        },
        {
          atMs: 2600,
          text: 'Nguyên nhân: liên kết hydrogen giữa các phân tử HF, phải phá thêm mới bay hơi.',
        },
        {
          atMs: 4800,
          text: 'Ngược lại về tính acid: HF là acid yếu, HI mạnh nhất trong dãy.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
]
