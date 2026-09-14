// lessons/hoa11c6.ts — Hoá học 11, Chương 6: Hợp chất carbonyl - Carboxylic acid (3 bài).
// Đối chiếu mục lục thật: tai-lieu-sgk/SGK-Hoa/11/page_0005.png (OCR 2026-08-31).
// reviewStatus='draft' — soạn từ docs/research/kho-kien-thuc-hoa-gdpt2018.md §3, chưa duyệt.
import type { ChemLesson } from '../lessonTypes.js'

export const HOA11_C6_LESSONS: ChemLesson[] = [
  {
    id: 'hoa11-c6-b23',
    grade: '11',
    chapterNumber: 6,
    chapterTitle: 'Hợp chất carbonyl - Carboxylic acid',
    lessonNumber: 23,
    title: 'Hợp chất carbonyl',
    hook:
      'Dung dịch formalin dùng để bảo quản xác sinh vật chứa formaldehyde. Nước rửa sơn móng tay có mùi thơm chứa acetone. ' +
      'Cả hai đều chứa nhóm chức carbonyl linh hoạt bậc nhất trong hoá hữu cơ.',
    theory:
      'KHÁI NIỆM VÀ PHÂN LOẠI:\n' +
      '— Hợp chất carbonyl là hợp chất hữu cơ trong phân tử có chứa nhóm carbonyl (C=O).\n' +
      '— Aldehyde: nhóm carbonyl liên kết với ít nhất một nguyên tử hydrogen (R−CHO, với chất đơn giản nhất là HCHO).\n' +
      "— Ketone: nhóm carbonyl liên kết với hai gốc hydrocarbon (R−CO−R').\n\n" +
      'TÍNH CHẤT HOÁ HỌC:\n' +
      '1. Phản ứng khử (cộng H₂):\n' +
      '   — Aldehyde bị khử bởi H₂ (Ni, t°) tạo alcohol bậc I: R−CHO + H₂ → R−CH₂OH.\n' +
      "   — Ketone bị khử bởi H₂ (Ni, t°) tạo alcohol bậc II: R−CO−R' + H₂ → R−CH(OH)−R'.\n" +
      '2. Phản ứng oxi hoá (chỉ có ở aldehyde, ketone bền vững với chất oxi hoá yếu):\n' +
      '   — Phản ứng tráng bạc: Aldehyde tác dụng với thuốc thử Tollens [Ag(NH₃)₂]OH tạo ra lớp kim loại bạc sáng bóng như gương bám vào thành ống nghiệm (tráng gương):\n' +
      '     R−CHO + 2[Ag(NH₃)₂]OH → R−COONH₄ + 2Ag↓ + 3NH₃ + H₂O (t°).\n' +
      '     (Riêng HCHO phản ứng tạo ra 4Ag do nhóm −CHO ở cả hai đầu của cấu trúc vô cơ trung gian).\n' +
      '   — Phản ứng với Cu(OH)₂ trong môi trường kiềm nóng: Aldehyde tạo kết tủa đỏ gạch Cu₂O:\n' +
      '     R−CHO + 2Cu(OH)₂ + NaOH → R−COONa + Cu₂O↓ + 3H₂O (t°).',
    workedExample: {
      problem:
        'Cho 4,4 gam acetaldehyde (CH₃CHO, M=44) phản ứng hoàn toàn với lượng dư thuốc thử Tollens ' +
        'trong dung dịch NH₃ đun nóng. Tính khối lượng bạc (Ag, M=108) tạo thành.',
      steps: [
        'Tính số mol acetaldehyde: n = 4,4 / 44 = 0,1 mol.',
        'Viết phương trình phản ứng tráng bạc của mono-aldehyde: CH₃CHO + 2[Ag(NH₃)₂]OH → CH₃COONH₄ + 2Ag↓ + 3NH₃ + H₂O.',
        'Từ phương trình, tỉ lệ phản ứng là: 1 mol aldehyde tạo ra 2 mol Ag.',
        'Tính số mol Ag thu được: nAg = 2 * n(acetaldehyde) = 2 * 0,1 = 0,2 mol.',
        'Tính khối lượng bạc tạo thành: mAg = 0,2 * 108 = 21,6 gam.',
      ],
      answer: '21,6 gam',
    },
    checkQuestions: [
      {
        prompt: 'Nhóm chức carbonyl có cấu tạo như thế nào?',
        choices: [
          { id: 'co', label: 'C=O (carbon liên kết đôi với oxygen)' },
          { id: 'oh', label: 'C−O−H (hydroxyl)' },
          { id: 'cho', label: 'C=O và đính thêm H (formyl)' },
        ],
        answer: { kind: 'choice', correctIds: ['co'] },
        explain:
          'Hợp chất carbonyl đặc trưng bởi nhóm carbonyl C=O. Aldehyde có nhóm −CHO, ketone có nhóm −CO−.',
      },
      {
        prompt:
          'Khi cho 1 mol acetaldehyde (CH₃CHO) tham gia phản ứng tráng bạc hoàn toàn với thuốc thử Tollens dư, số mol Ag kết tủa tối đa thu được là bao nhiêu?',
        answer: { kind: 'numeric', value: 2 },
        explain:
          'Mỗi nhóm −CHO của mono-aldehyde thông thường (như CH₃CHO) khi bị oxi hoá sẽ nhường electron khử 2 ion Ag⁺ thành 2 nguyên tử Ag kết tủa.',
      },
    ],
    srsCards: [
      { hoi: 'Carbonyl gồm những lớp chất nào?', dap: "Aldehyde (R−CHO) và Ketone (R−CO−R')." },
      {
        hoi: 'Hiện tượng phản ứng tráng bạc của aldehyde?',
        dap: 'Có lớp kim loại bạc (Ag) sáng bóng bám vào thành ống nghiệm.',
      },
      {
        hoi: 'Sự khác biệt khi oxi hoá aldehyde và ketone bằng thuốc thử nhẹ?',
        dap: 'Aldehyde dễ bị oxi hoá tạo Ag hoặc Cu₂O đỏ gạch, Ketone không phản ứng.',
      },
    ],
    animation: {
      title: 'Nhóm C=O phân cực và phản ứng cộng hydrogen của aldehyde, ketone',
      description:
        'Nhóm carbonyl được vẽ phóng to: hai vạch nối carbon với oxygen. Vì oxygen có độ âm điện lớn hơn nhiều, cặp electron của nối đôi bị kéo lệch về phía oxygen — dấu δ− hiện ở oxygen và dấu δ+ hiện ở carbon. Chính carbon mang điện tích dương một phần đó là nơi tác nhân mang electron tìm đến. Phần dưới cho thấy hệ quả: cộng hydrogen với xúc tác Ni và đun nóng, nối đôi C=O mở ra, H gắn vào carbon còn H gắn vào oxygen thành nhóm OH. Aldehyde CH₃CHO cho alcohol bậc một CH₃CH₂OH, còn ketone CH₃COCH₃ cho alcohol bậc hai CH₃CH(OH)CH₃ — khác nhau ở chỗ carbon mang OH nối với mấy carbon khác.',
      viewBoxWidth: 460,
      viewBoxHeight: 240,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'cc',
          cx: 150,
          cy: 66,
          r: 24,
          fill: 'surface',
          stroke: 'primary',
          strokeWidth: 2,
        },
        {
          kind: 'circle',
          id: 'oo',
          cx: 250,
          cy: 66,
          r: 24,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'cct',
          x: 150,
          y: 72,
          text: 'C',
          size: 17,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'oot',
          x: 250,
          y: 72,
          text: 'O',
          size: 17,
          anchor: 'middle',
          fill: 'accent',
        },
        {
          kind: 'line',
          id: 'nd1',
          x1: 174,
          y1: 60,
          x2: 226,
          y2: 60,
          stroke: 'primary',
          strokeWidth: 2.5,
        },
        {
          kind: 'line',
          id: 'nd2',
          x1: 174,
          y1: 72,
          x2: 226,
          y2: 72,
          stroke: 'primary',
          strokeWidth: 2.5,
        },
        {
          kind: 'arrow',
          id: 'keo',
          x1: 196,
          y1: 40,
          x2: 232,
          y2: 40,
          stroke: 'accent',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 900,
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
          id: 'keot',
          x: 196,
          y: 28,
          text: 'electron bị kéo về oxygen',
          size: 10,
          anchor: 'end',
          fill: 'muted',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 900,
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
          id: 'dp',
          x: 150,
          y: 108,
          text: 'δ+',
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
              atMs: 1600,
              opacity: 0,
            },
            {
              atMs: 2100,
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
          id: 'dm',
          x: 250,
          y: 108,
          text: 'δ−',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1600,
              opacity: 0,
            },
            {
              atMs: 2100,
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
          id: 'tancong',
          x: 200,
          y: 130,
          text: 'carbon δ+ là nơi bị tấn công',
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
              atMs: 2200,
              opacity: 0,
            },
            {
              atMs: 2700,
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
          id: 'pu1',
          x: 40,
          y: 172,
          text: 'CH₃CHO + H₂',
          size: 13,
          anchor: 'start',
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
              atMs: 3800,
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
          id: 'mt1',
          x1: 160,
          y1: 168,
          x2: 216,
          y2: 168,
          stroke: 'primary',
          strokeWidth: 2,
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
              atMs: 4200,
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
          id: 'mt1t',
          x: 188,
          y: 158,
          text: 'Ni, t°',
          size: 9,
          anchor: 'middle',
          fill: 'muted',
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
              atMs: 4200,
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
          id: 'kq1',
          x: 226,
          y: 172,
          text: 'CH₃CH₂OH',
          size: 13,
          anchor: 'start',
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
              atMs: 4600,
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
          id: 'kq1b',
          x: 400,
          y: 172,
          text: 'alcohol bậc I',
          size: 10,
          anchor: 'end',
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
              atMs: 4600,
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
          id: 'pu2',
          x: 40,
          y: 210,
          text: 'CH₃COCH₃ + H₂',
          size: 13,
          anchor: 'start',
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
              atMs: 5600,
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
          id: 'mt2',
          x1: 160,
          y1: 206,
          x2: 216,
          y2: 206,
          stroke: 'primary',
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
              atMs: 6000,
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
          id: 'mt2t',
          x: 188,
          y: 196,
          text: 'Ni, t°',
          size: 9,
          anchor: 'middle',
          fill: 'muted',
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
              atMs: 6000,
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
          id: 'kq2',
          x: 226,
          y: 210,
          text: 'CH₃CH(OH)CH₃',
          size: 13,
          anchor: 'start',
          fill: 'primary',
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
              atMs: 6400,
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
          id: 'kq2b',
          x: 420,
          y: 210,
          text: 'alcohol bậc II',
          size: 10,
          anchor: 'end',
          fill: 'muted',
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
              atMs: 6400,
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
          id: 'h1',
          cx: 150,
          cy: 66,
          r: 7,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
              dx: -70,
              dy: 40,
            },
            {
              atMs: 3400,
              opacity: 0,
              dx: -70,
              dy: 40,
            },
            {
              atMs: 3600,
              opacity: 1,
              dx: -70,
              dy: 40,
            },
            {
              atMs: 4200,
              opacity: 1,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 4600,
              opacity: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 8000,
              opacity: 0,
              dx: 0,
              dy: 0,
            },
          ],
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Nối đôi C=O: oxygen âm điện mạnh hơn nên kéo lệch electron về phía nó.',
        },
        {
          atMs: 1800,
          text: 'Carbon mang δ+, oxygen mang δ− — đó là chỗ phản ứng xảy ra.',
        },
        {
          atMs: 3600,
          text: 'Cộng H₂ (Ni, t°): aldehyde CH₃CHO cho alcohol bậc I.',
        },
        {
          atMs: 5600,
          text: 'Cũng phản ứng đó, ketone CH₃COCH₃ cho alcohol bậc II.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa11-c6-b24',
    grade: '11',
    chapterNumber: 6,
    chapterTitle: 'Hợp chất carbonyl - Carboxylic acid',
    lessonNumber: 24,
    title: 'Carboxylic acid',
    hook:
      'Giấm ăn có vị chua thanh nhẹ nhờ chứa acetic acid. Kiến đốt truyền nọc độc formic acid gây sưng rát. ' +
      'Cả hai đều là những axit hữu cơ thuộc nhóm axit carboxylic.',
    theory:
      'KHÁI NIỆM:\n' +
      '— Carboxylic acid là hợp chất hữu cơ trong phân tử có nhóm carboxyl (−COOH) liên kết trực tiếp với nguyên tử carbon hoặc hydrogen.\n' +
      '— Công thức chung của acid no, đơn chức, mạch hở: CₙH₂ₙ₊₁COOH (n ≥ 0).\n\n' +
      'TÍNH CHẤT VẬT LÍ (Nhiệt độ sôi rất cao):\n' +
      '— Nhiệt độ sôi của carboxylic acid cao hơn alcohol có cùng phân tử khối vì các phân tử acid tạo được LIÊN KẾT HYDROGEN liên phân tử dạng vòng (dimer) hoặc dạng mạch bền vững hơn nhiều.\n\n' +
      'TÍNH CHẤT HOÁ HỌC:\n' +
      '1. Tính acid yếu (đầy đủ tính chất acid):\n' +
      '   — Làm quỳ tím hoá đỏ. Tác dụng với kim loại giải phóng H₂: 2CH₃COOH + Zn → (CH₃COO)₂Zn + H₂.\n' +
      '   — Tác dụng với muối carbonate giải phóng khí CO₂ (dùng nhận biết acid): 2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂↑ + H₂O.\n' +
      '2. Phản ứng ester hoá (phản ứng với alcohol):\n' +
      '   — Phản ứng xảy ra thuận nghịch dưới tác dụng của xúc tác H₂SO₄ đặc và đun nóng:\n' +
      "     R−COOH + R'−OH ⇌ R−COOR' (ester) + H₂O.\n" +
      '     Ví dụ: CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ (ethyl acetate, mùi chuối chín) + H₂O.',
    workedExample: {
      problem:
        'Đun nóng hỗn hợp gồm 6,0 gam acetic acid (CH₃COOH, M=60) và lượng dư ethanol (C₂H₅OH) ' +
        'với xúc tác H₂SO₄ đặc. Biết hiệu suất phản ứng ester hoá đạt 80%. Tính khối lượng ' +
        'ethyl acetate (CH₃COOC₂H₅, M=88) thu được.',
      steps: [
        'Tính số mol acetic acid ban đầu: n = 6,0 / 60 = 0,1 mol.',
        'Viết phương trình phản ứng ester hoá: CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O.',
        'Theo lý thuyết (hiệu suất 100%), số mol ester thu được bằng số mol acid phản ứng = 0,1 mol.',
        'Vì hiệu suất phản ứng chỉ đạt 80% nên số mol ester thực tế thu được là: n_thucte = 0,1 * 80% = 0,08 mol.',
        'Tính khối lượng ester thực tế thu được: m = 0,08 * 88 = 7,04 gam.',
      ],
      answer: '7,04 gam',
    },
    checkQuestions: [
      {
        prompt: 'Vì sao carboxylic acid có nhiệt độ sôi cao hơn alcohol có cùng phân tử khối?',
        choices: [
          {
            id: 'a',
            label:
              'Do phân tử phân cực hơn và tạo liên kết hydrogen bền hơn dưới dạng dimer/polymer',
          },
          { id: 'b', label: 'Do liên kết C−C của acid khó bị bẻ gãy hơn' },
          { id: 'c', label: 'Do khối lượng của nguyên tố oxygen trong acid lớn hơn' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain:
          'Carboxylic acid tạo được liên kết hydrogen bền vững dạng dimer vòng kép hoặc polymer chuỗi dài, đòi hỏi nhiều nhiệt lượng để phá vỡ hơn alcohol.',
      },
      {
        prompt:
          'Phản ứng ester hoá giữa acetic acid và cồn ethanol (xúc tác H₂SO₄ đặc, nóng) tạo ra ester nào sau đây?',
        choices: [
          { id: 'methyl', label: 'Methyl acetate' },
          { id: 'ethyl', label: 'Ethyl acetate' },
          { id: 'propyl', label: 'Propyl acetate' },
        ],
        answer: { kind: 'choice', correctIds: ['ethyl'] },
        explain:
          'Phản ứng giữa gốc axetat (CH₃COO−) và gốc etyl (−C₂H₅) tạo ra ethyl acetate (CH₃COOC₂H₅).',
      },
    ],
    srsCards: [
      {
        hoi: 'Carboxylic acid là gì?',
        dap: 'Hợp chất hữu cơ có chứa nhóm carboxyl (−COOH) liên kết với carbon hoặc hydrogen.',
      },
      {
        hoi: 'Lớp chất hữu cơ nào có nhiệt độ sôi cao nhất trong các chất có cùng phân tử khối?',
        dap: 'Carboxylic acid (do liên kết hydrogen siêu bền dạng dimer).',
      },
      {
        hoi: 'Phản ứng ester hoá là gì?',
        dap: 'Là phản ứng thuận nghịch giữa acid và alcohol (xúc tác H₂SO₄ đặc) tạo ra ester và nước.',
      },
    ],
    animation: {
      title: 'Hai liên kết hydrogen khoá acetic acid thành dimer, đẩy nhiệt độ sôi lên 118 °C',
      description:
        'Hai phân tử acetic acid tiến lại gần nhau và quay ngược đầu: nhóm OH của phân tử này chìa sang oxygen của nhóm C=O của phân tử kia, và ngược lại. Hai đường nét đứt hiện ra — đó là hai liên kết hydrogen cùng lúc, khoá hai phân tử thành một dimer vòng. Muốn hoá hơi thì phải phá cả hai liên kết ấy, nên acetic acid sôi tới 118 °C. Cột so sánh bên phải làm rõ mức độ bất thường: ethanol chỉ tạo được một liên kết hydrogen mỗi phía và sôi ở 78 °C dù phân tử khối 46 không kém acetic acid 60 là bao, còn propane không có liên kết hydrogen nào thì sôi ở tận −42 °C. Nhiệt độ sôi không do phân tử khối một mình quyết định.',
      viewBoxWidth: 460,
      viewBoxHeight: 240,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'label',
          id: 'p1',
          x: 90,
          y: 76,
          text: 'CH₃–C',
          size: 14,
          anchor: 'end',
          fill: 'neutral',
          keyframes: [
            {
              atMs: 0,
              dx: -40,
            },
            {
              atMs: 2400,
              dx: 0,
            },
            {
              atMs: 8000,
              dx: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'p1o',
          x: 118,
          y: 62,
          text: 'O',
          size: 13,
          anchor: 'middle',
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: -40,
            },
            {
              atMs: 2400,
              dx: 0,
            },
            {
              atMs: 8000,
              dx: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'p1oh',
          x: 118,
          y: 96,
          text: 'O–H',
          size: 13,
          anchor: 'start',
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: -40,
            },
            {
              atMs: 2400,
              dx: 0,
            },
            {
              atMs: 8000,
              dx: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'p2',
          x: 260,
          y: 76,
          text: 'H–O',
          size: 13,
          anchor: 'end',
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 40,
            },
            {
              atMs: 2400,
              dx: 0,
            },
            {
              atMs: 8000,
              dx: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'p2o',
          x: 262,
          y: 110,
          text: 'O',
          size: 13,
          anchor: 'middle',
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 40,
            },
            {
              atMs: 2400,
              dx: 0,
            },
            {
              atMs: 8000,
              dx: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'p2c',
          x: 292,
          y: 96,
          text: 'C–CH₃',
          size: 14,
          anchor: 'start',
          fill: 'neutral',
          keyframes: [
            {
              atMs: 0,
              dx: 40,
            },
            {
              atMs: 2400,
              dx: 0,
            },
            {
              atMs: 8000,
              dx: 0,
            },
          ],
        },
        {
          kind: 'line',
          id: 'hb1',
          x1: 132,
          y1: 62,
          x2: 236,
          y2: 72,
          stroke: 'accent',
          strokeWidth: 2,
          dash: '4 3',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2400,
              opacity: 0,
            },
            {
              atMs: 3000,
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
          id: 'hb2',
          x1: 146,
          y1: 94,
          x2: 250,
          y2: 106,
          stroke: 'accent',
          strokeWidth: 2,
          dash: '4 3',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2400,
              opacity: 0,
            },
            {
              atMs: 3000,
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
          id: 'hbt',
          x: 190,
          y: 140,
          text: '2 liên kết hydrogen — dimer vòng',
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
          kind: 'line',
          id: 'tx',
          x1: 60,
          y1: 214,
          x2: 420,
          y2: 214,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'rect',
          id: 'c1',
          x: 100,
          y: 176,
          w: 40,
          h: 38,
          fill: 'muted',
          rx: 2,
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
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'c1t',
          x: 120,
          y: 232,
          text: 'propane (M 44)',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'c1v',
          x: 120,
          y: 168,
          text: '−42 °C',
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
              atMs: 4000,
              opacity: 0,
            },
            {
              atMs: 4500,
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
          id: 'c2',
          x: 220,
          y: 128,
          w: 40,
          h: 86,
          fill: 'primary',
          rx: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4800,
              opacity: 0,
            },
            {
              atMs: 5300,
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
          id: 'c2t',
          x: 240,
          y: 232,
          text: 'ethanol (M 46)',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'c2v',
          x: 240,
          y: 120,
          text: '78 °C',
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
              atMs: 4800,
              opacity: 0,
            },
            {
              atMs: 5300,
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
          id: 'c3',
          x: 340,
          y: 96,
          w: 40,
          h: 118,
          fill: 'primary',
          rx: 2,
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
          id: 'c3t',
          x: 360,
          y: 232,
          text: 'acetic acid (M 60)',
          size: 10,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'c3v',
          x: 360,
          y: 88,
          text: '118 °C',
          size: 10,
          anchor: 'middle',
          fill: 'primary',
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
          id: 'kl',
          x: 240,
          y: 30,
          text: 'Càng nhiều liên kết hydrogen, càng khó bay hơi',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Hai phân tử acetic acid quay ngược đầu, ghép lại với nhau.',
        },
        {
          atMs: 2600,
          text: 'Chúng bị khoá bởi HAI liên kết hydrogen, thành một dimer vòng.',
        },
        {
          atMs: 4200,
          text: 'Propane không có liên kết hydrogen: sôi −42 °C.',
        },
        {
          atMs: 5800,
          text: 'Acetic acid phải phá hai liên kết mới bay hơi: sôi tới 118 °C.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa11-c6-b25',
    grade: '11',
    chapterNumber: 6,
    chapterTitle: 'Hợp chất carbonyl - Carboxylic acid',
    lessonNumber: 25,
    title: 'Ôn tập chương 6 — Hợp chất carbonyl - Carboxylic acid',
    hook:
      'Ôn tập và liên kết hai lớp dẫn xuất chứa oxygen đỉnh cao: hợp chất carbonyl và carboxylic acid, ' +
      'hoàn thành lộ trình Hoá học hữu cơ lớp 11 của chúng ta.',
    theory:
      'TỔNG KẾT KIẾN THỨC CHƯƠNG 6:\n' +
      "1. Hợp chất carbonyl: Có nhóm C=O. Gồm aldehyde (R−CHO) và ketone (R−CO−R').\n" +
      '   — Khử bởi H₂ tạo alcohol tương ứng.\n' +
      '   — Aldehyde có tính khử: tráng gương (tạo Ag), phản ứng Cu(OH)₂/NaOH nóng (tạo Cu₂O đỏ gạch). Ketone trơ với các phản ứng này.\n' +
      '2. Carboxylic acid (R−COOH): Có nhóm −COOH. Nhiệt độ sôi rất cao nhờ dimer liên kết hydrogen. Thể hiện đầy đủ tính acid (làm đỏ quỳ, tác dụng kim loại trước H, phản ứng giải phóng khí CO₂ từ muối carbonate). Phản ứng ester hoá với alcohol là phản ứng thuận nghịch.',
    workedExample: {
      problem:
        'Nhận biết 3 chất lỏng đựng trong các lọ mất nhãn: acetaldehyde, acetone, và acetic acid bằng ' +
        'các thuốc thử đơn giản.',
      steps: [
        'Trích mẫu thử của 3 dung dịch.',
        'Nhỏ dung dịch NaHCO₃ (hoặc Na₂CO₃) vào 3 mẫu thử ⇒ Mẫu sủi bọt khí CO₂ thoát ra là acetic acid.',
        'Với 2 mẫu còn lại (acetaldehyde, acetone), cho tác dụng với thuốc thử Tollens đun nóng nhẹ.',
        'Mẫu tạo lớp bạc sáng bóng tráng gương bám thành ống nghiệm là acetaldehyde.',
        'Mẫu không có hiện tượng gì là acetone.',
      ],
      answer: 'Dùng NaHCO₃ và thuốc thử Tollens',
    },
    checkQuestions: [
      {
        prompt:
          'Thuốc thử nào thích hợp nhất để phân biệt nhanh dung dịch acetic acid với dung dịch acetaldehyde và dung dịch acetone?',
        choices: [
          { id: 'quỳ', label: 'Quỳ tím hoặc dung dịch muối Na₂CO₃ (sủi bọt khí)' },
          { id: 'tollens', label: 'Thuốc thử Tollens' },
          { id: 'h2', label: 'Khí hydrogen (Ni, t°)' },
        ],
        answer: { kind: 'choice', correctIds: ['quỳ'] },
        explain:
          'Acetic acid là một acid nên làm đỏ quỳ và giải phóng khí CO₂ khi gặp muối carbonate. Acetaldehyde và acetone không có tính axit này.',
      },
      {
        prompt: 'Chất nào sau đây tham gia phản ứng tráng bạc tạo gương sáng bóng?',
        choices: [
          { id: 'ace', label: 'Acetaldehyde (CH₃CHO)' },
          { id: 'act', label: 'Acetone (CH₃COCH₃)' },
          { id: 'aca', label: 'Acetic acid (CH₃COOH)' },
        ],
        answer: { kind: 'choice', correctIds: ['ace'] },
        explain:
          'Chỉ có aldehyde (có nhóm −CHO) mới tham gia phản ứng tráng bạc với thuốc thử Tollens. Ketone và carboxylic acid không phản ứng.',
      },
    ],
    srsCards: [
      {
        hoi: 'Sản phẩm khử aldehyde và ketone bằng H₂?',
        dap: 'Aldehyde tạo alcohol bậc I; Ketone tạo alcohol bậc II.',
      },
      {
        hoi: 'Phản ứng dùng để nhận biết tính khử của aldehyde?',
        dap: 'Phản ứng tráng gương (thuốc thử Tollens) hoặc Cu(OH)₂ đun nóng.',
      },
      {
        hoi: 'Tại sao acid tác dụng với muối carbonate giải phóng khí?',
        dap: 'Vì carboxylic acid mạnh hơn carbonic acid (H₂CO₃), đẩy H₂CO₃ ra ngoài tự phân huỷ thành CO₂ và H₂O.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
