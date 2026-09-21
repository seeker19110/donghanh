// lessons/hoa12c8.ts — Hoá học 12, Chương 8: Sơ lược về dãy kim loại chuyển tiếp thứ nhất và phức chất (4 bài).
// Đối chiếu mục lục thật: tai-lieu-sgk/SGK-Hoa/12/page_0005.png (OCR 2026-08-31).
// reviewStatus='draft' — soạn từ docs/research/kho-kien-thuc-hoa-gdpt2018.md §3, chưa duyệt.
import type { ChemLesson } from '../lessonTypes.js'

export const HOA12_C8_LESSONS: ChemLesson[] = [
  {
    id: 'hoa12-c8-b27',
    grade: '12',
    chapterNumber: 8,
    chapterTitle: 'Sơ lược về kim loại chuyển tiếp d và phức chất',
    lessonNumber: 27,
    title: 'Đại cương về kim loại chuyển tiếp dãy thứ nhất',
    hook:
      'Sắt chế tạo máy móc, đồng dẫn điện, chromium chống gỉ sét, manganese tăng độ cứng của thép. ' +
      'Tất cả chúng đều là các kim loại chuyển tiếp nhóm d, nằm ở trung tâm bảng tuần hoàn.',
    theory:
      'VỊ TRÍ VÀ CẤU HÌNH ELECTRON NGUYÊN TỬ:\n' +
      '— Kim loại chuyển tiếp d thuộc các nhóm từ IIIB đến IIB (tức nhóm 3 đến nhóm 12 của bảng tuần hoàn), nằm ở các chu kì 4, 5, 6, 7.\n' +
      '— Dãy chuyển tiếp thứ nhất nằm ở chu kì 4, từ Scandium (Sc, Z = 21) đến Zinc (Zn, Z = 30). Cấu hình electron hoá trị của chúng có dạng (n−1)d¹⁻¹⁰ns² (electron hoá trị nằm ở cả phân lớp d sát ngoài cùng lẫn phân lớp s ngoài cùng).\n' +
      '   * Ngoại lệ cấu hình bán bão hoà và bão hoà bền vững: Chromium (Cr, Z = 24): [Ar]3d⁵4s¹; Copper (Cu, Z = 29): [Ar]3d¹⁰4s¹.\n\n' +
      'ĐẶC ĐIỂM TÍNH CHẤT VẬT LÍ:\n' +
      '— Đều là kim loại. So với kim loại nhóm IA và IIA, kim loại chuyển tiếp d có nhiệt độ nóng chảy cao hơn, độ cứng lớn hơn, khối lượng riêng lớn hơn nhiều, vì các electron ở phân lớp d cũng tham gia vào liên kết kim loại.\n\n' +
      'ĐẶC ĐIỂM TÍNH CHẤT HOÁ HỌC:\n' +
      '1. Có nhiều trạng thái oxi hoá khác nhau trong các hợp chất (do các electron 3d có năng lượng gần với 4s, đều có thể tham gia liên kết). Ví dụ: Fe (+2, +3); Cu (+1, +2); Cr (+2, +3, +6); Mn (+2, +4, +6, +7).\n' +
      '2. Các hợp chất thường có màu sắc đặc trưng sinh động: dung dịch muối Cu²⁺ màu xanh lam; Fe³⁺ màu vàng nâu; Fe²⁺ màu xanh lục nhạt; ion MnO₄⁻ màu tím.',
    workedExample: {
      problem: 'Viết cấu hình electron của nguyên tử Iron (sắt, Fe, Z = 26) và cation Fe³⁺.',
      steps: [
        'Nguyên tử Fe có Z = 26 electron. Viết phân bố electron theo mức năng lượng tăng dần: 1s²2s²2p⁶3s²3p⁶4s²3d⁶.',
        'Sắp xếp lại theo lớp electron để có cấu hình chính thức của Fe: [Ar] 3d⁶ 4s² (trong đó [Ar] viết tắt cho 1s²2s²2p⁶3s²3p⁶).',
        'Khi nguyên tử Fe nhường 3 electron để tạo cation Fe³⁺: electron sẽ bị tách ở lớp ngoài cùng (4s) trước, rồi mới tách tiếp ở phân lớp sát ngoài cùng (3d).',
        'Fe nhường 2e ở phân lớp 4s và 1e ở phân lớp 3d. Cấu hình electron của Fe³⁺ là: [Ar] 3d⁵ (đây là phân lớp d bán bão hoà bền vững).',
      ],
      answer: 'Fe: [Ar] 3d⁶ 4s²; Fe³⁺: [Ar] 3d⁵',
    },
    checkQuestions: [
      {
        prompt:
          'Cấu hình electron hoá trị của nguyên tử Copper (Cu, Z = 29) ở trạng thái cơ bản là gì?',
        choices: [
          { id: 'a', label: '[Ar] 3d⁹ 4s²' },
          { id: 'b', label: '[Ar] 3d¹⁰ 4s¹' },
          { id: 'c', label: '[Ar] 3d⁸ 4s² 4p¹' },
        ],
        answer: { kind: 'choice', correctIds: ['b'] },
        explain:
          'Theo thứ tự mức năng lượng, Cu lẽ ra là [Ar] 3d⁹ 4s². Nhưng một electron chuyển từ 4s sang 3d để phân lớp d đạt trạng thái bão hoà 3d¹⁰ bền vững hơn, nên cấu hình thật là [Ar] 3d¹⁰ 4s¹. Phương án còn lại sai vì Cu ở chu kì 4 chưa có electron ở phân lớp 4p.',
      },
      {
        prompt:
          'Ion kim loại chuyển tiếp nào sau đây có màu xanh lam đặc trưng khi hoà tan trong nước?',
        choices: [
          { id: 'fe3', label: 'Fe³⁺' },
          { id: 'fe2', label: 'Fe²⁺' },
          { id: 'cu2', label: 'Cu²⁺' },
          { id: 'zn2', label: 'Zn²⁺' },
        ],
        answer: { kind: 'choice', correctIds: ['cu2'] },
        explain:
          'Trong nước, ion Cu²⁺ tạo phức chất với các phân tử nước, [Cu(H₂O)₆]²⁺, cho màu xanh lam đặc trưng. Ba ion kia màu khác hẳn: Fe³⁺ vàng nâu, Fe²⁺ xanh lục nhạt, còn Zn²⁺ không màu vì phân lớp 3d đã bão hoà.',
      },
    ],
    srsCards: [
      { hoi: 'Cấu hình electron của Chromium (Z = 24)?', dap: '[Ar] 3d⁵ 4s¹ (bán bão hoà).' },
      {
        hoi: 'Tại sao kim loại chuyển tiếp d có nhiều số oxi hoá?',
        dap: 'Vì các electron ở phân lớp sát ngoài cùng (n−1)d có mức năng lượng gần với lớp ngoài cùng ns, dễ tham gia liên kết.',
      },
      { hoi: 'Cấu hình electron của Fe²⁺?', dap: '[Ar] 3d⁶ (mất 2 electron ở phân lớp 4s).' },
    ],
    animation: {
      title: 'Manganese: một nguyên tố, nhiều số oxi hoá, mỗi mức một màu dung dịch',
      description:
        'Trục ngang xếp bốn số oxi hoá thường gặp của manganese và bên dưới mỗi mức là một ống nghiệm màu khác nhau, lần lượt sáng lên. Mức +2 ứng với ion Mn²⁺ cho dung dịch hồng rất nhạt; mức +4 ứng với MnO₂ là chất rắn đen không tan; mức +6 ứng với ion manganate MnO₄²⁻ màu xanh lục; mức +7 ứng với ion permanganate MnO₄⁻ màu tím đặc trưng của thuốc tím. Nguyên nhân của dãy số oxi hoá dài này nằm ở chỗ các electron lớp 3d và lớp 4s có mức năng lượng xấp xỉ nhau, nên kim loại chuyển tiếp nhường được nhiều số electron khác nhau — khác hẳn kim loại nhóm IA chỉ có đúng một mức +1. Chính vì thay đổi số oxi hoá dễ dàng mà các kim loại chuyển tiếp làm xúc tác rất tốt.',
      viewBoxWidth: 470,
      viewBoxHeight: 230,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'arrow',
          id: 'truc',
          x1: 40,
          y1: 60,
          x2: 440,
          y2: 60,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 't1',
          x1: 100,
          y1: 52,
          x2: 100,
          y2: 68,
          stroke: 'muted',
          strokeWidth: 1.5,
        },
        {
          kind: 'line',
          id: 't2',
          x1: 200,
          y1: 52,
          x2: 200,
          y2: 68,
          stroke: 'muted',
          strokeWidth: 1.5,
        },
        {
          kind: 'line',
          id: 't3',
          x1: 300,
          y1: 52,
          x2: 300,
          y2: 68,
          stroke: 'muted',
          strokeWidth: 1.5,
        },
        {
          kind: 'line',
          id: 't4',
          x1: 400,
          y1: 52,
          x2: 400,
          y2: 68,
          stroke: 'muted',
          strokeWidth: 1.5,
        },
        {
          kind: 'label',
          id: 's1',
          x: 100,
          y: 44,
          text: '+2',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 's2',
          x: 200,
          y: 44,
          text: '+4',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 's3',
          x: 300,
          y: 44,
          text: '+6',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 's4',
          x: 400,
          y: 44,
          text: '+7',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'trt',
          x: 235,
          y: 24,
          text: 'số oxi hoá của manganese tăng dần →',
          size: 11,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'rect',
          id: 'o1',
          x: 78,
          y: 84,
          w: 44,
          h: 78,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          rx: 4,
        },
        {
          kind: 'rect',
          id: 'd1',
          x: 82,
          y: 114,
          w: 36,
          h: 44,
          fill: 'primary',
          rx: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 800,
              opacity: 0.18,
            },
            {
              atMs: 8000,
              opacity: 0.18,
            },
          ],
        },
        {
          kind: 'label',
          id: 'n1',
          x: 100,
          y: 180,
          text: 'Mn²⁺',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 800,
              opacity: 0,
            },
            {
              atMs: 1200,
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
          id: 'n1b',
          x: 100,
          y: 200,
          text: 'hồng rất nhạt',
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
              atMs: 800,
              opacity: 0,
            },
            {
              atMs: 1200,
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
          id: 'o2',
          x: 178,
          y: 84,
          w: 44,
          h: 78,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          rx: 4,
        },
        {
          kind: 'rect',
          id: 'd2',
          x: 182,
          y: 114,
          w: 36,
          h: 44,
          fill: 'neutral',
          rx: 2,
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
              atMs: 2800,
              opacity: 0.85,
            },
            {
              atMs: 8000,
              opacity: 0.85,
            },
          ],
        },
        {
          kind: 'label',
          id: 'n2',
          x: 200,
          y: 180,
          text: 'MnO₂',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
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
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'n2b',
          x: 200,
          y: 200,
          text: 'rắn đen, không tan',
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
              atMs: 2800,
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
          kind: 'rect',
          id: 'o3',
          x: 278,
          y: 84,
          w: 44,
          h: 78,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          rx: 4,
        },
        {
          kind: 'rect',
          id: 'd3',
          x: 282,
          y: 114,
          w: 36,
          h: 44,
          fill: 'correct',
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
              atMs: 4400,
              opacity: 0.55,
            },
            {
              atMs: 8000,
              opacity: 0.55,
            },
          ],
        },
        {
          kind: 'label',
          id: 'n3',
          x: 300,
          y: 180,
          text: 'MnO₄²⁻',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
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
              atMs: 4800,
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
          id: 'n3b',
          x: 300,
          y: 200,
          text: 'xanh lục',
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
              atMs: 4400,
              opacity: 0,
            },
            {
              atMs: 4800,
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
          id: 'o4',
          x: 378,
          y: 84,
          w: 44,
          h: 78,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          rx: 4,
        },
        {
          kind: 'rect',
          id: 'd4',
          x: 382,
          y: 114,
          w: 36,
          h: 44,
          fill: 'accent',
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
              atMs: 6000,
              opacity: 0.8,
            },
            {
              atMs: 8000,
              opacity: 0.8,
            },
          ],
        },
        {
          kind: 'label',
          id: 'n4',
          x: 400,
          y: 180,
          text: 'MnO₄⁻',
          size: 12,
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
          id: 'n4b',
          x: 400,
          y: 200,
          text: 'tím (thuốc tím)',
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
          id: 'kl',
          x: 235,
          y: 222,
          text: 'Electron 3d và 4s xấp xỉ năng lượng → nhiều số oxi hoá → xúc tác tốt',
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
              atMs: 6800,
              opacity: 0,
            },
            {
              atMs: 7300,
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
          text: 'Mn²⁺: dung dịch hồng rất nhạt.',
        },
        {
          atMs: 2800,
          text: 'MnO₂ (Mn +4): chất rắn đen, không tan.',
        },
        {
          atMs: 4400,
          text: 'MnO₄²⁻ (Mn +6): xanh lục. MnO₄⁻ (Mn +7): tím — thuốc tím.',
        },
        {
          atMs: 6800,
          text: 'Electron 3d và 4s xấp xỉ nhau nên kim loại chuyển tiếp có nhiều số oxi hoá.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa12-c8-b28',
    grade: '12',
    chapterNumber: 8,
    chapterTitle: 'Sơ lược về kim loại chuyển tiếp d và phức chất',
    lessonNumber: 28,
    title: 'Sơ lược về phức chất',
    hook:
      'Chất hemoglobin trong máu người mang sắt (Fe²⁺) liên kết phối trí với khí oxygen để nuôi cơ thể.' +
      ' Chất diệp lục của cây xanh mang magnesium. Chúng đều thuộc một nhóm hợp chất đặc biệt gọi là phức chất.',
    theory:
      'KHÁI NIỆM PHỨC CHẤT:\n' +
      '— Phức chất (coordination compound) là hợp chất có chứa cầu phức, được hình thành từ một ion kim loại trung tâm liên kết với các phối tử xung quanh bằng liên kết phối trí.\n\n' +
      'CẤU TRÚC PHỨC CHẤT (ví dụ: [Cu(NH₃)₄]²⁺):\n' +
      '1. Ion trung tâm (central ion): Thường là cation kim loại chuyển tiếp d (như Cu²⁺, Ag⁺, Fe²⁺, Co³⁺) có các orbital trống.\n' +
      '2. Phối tử (ligand): Là các phân tử hoặc anion có cặp electron tự do chưa liên kết (như H₂O, NH₃, Cl⁻, OH⁻, CN⁻) để nhường vào orbital trống của ion trung tâm.\n' +
      '3. Liên kết phối trí (coordinate bond): Liên kết cho - nhận electron giữa phối tử và ion trung tâm (phối tử cho cặp electron, ion trung tâm nhận).\n' +
      '4. Số phối trí (coordination number): Số liên kết phối trí trực tiếp của ion trung tâm với phối tử. Thường gặp: 2, 4, 6.\n' +
      '5. Điện tích của cầu phức: Bằng tổng điện tích của ion trung tâm và các phối tử.',
    workedExample: {
      problem:
        'Xác định ion trung tâm, phối tử, số phối trí và số oxi hoá của ion trung tâm trong phức chất [Ag(NH₃)₂]⁺.',
      steps: [
        'Cầu phức là [Ag(NH₃)₂]⁺.',
        'Ion trung tâm là cation kim loại đứng đầu cầu phức: Ag.',
        'Phối tử là các phân tử liên kết xung quanh: NH₃.',
        'Có 2 phân tử NH₃ liên kết phối trí trực tiếp với Ag ⇒ Số phối trí của phức chất là 2.',
        'Phối tử NH₃ là phân tử trung hoà điện (điện tích = 0). Do đó, điện tích của cầu phức (+1) chính là điện tích của ion trung tâm Ag⁺ ⇒ Số oxi hoá của Ag là +1.',
      ],
      answer: 'Ion trung tâm Ag⁺, phối tử NH₃, số phối trí 2, số oxi hoá +1',
    },
    checkQuestions: [
      {
        prompt: 'Trong phức chất [Cu(NH₃)₄]²⁺, phối tử (ligand) là phân tử nào?',
        choices: [
          { id: 'cu', label: 'Ion Copper (Cu²⁺)' },
          { id: 'nh3', label: 'Phân tử Ammonia (NH₃)' },
          { id: 'h2o', label: 'Nước (H₂O)' },
        ],
        answer: { kind: 'choice', correctIds: ['nh3'] },
        explain:
          'Trong phức chất trên, Cu²⁺ là ion trung tâm, còn 4 phân tử NH₃ đóng vai trò là phối tử liên kết xung quanh.',
      },
      {
        prompt: 'Xác định số phối trí của ion trung tâm Fe trong phức chất [Fe(CN)₆]⁴⁻.',
        answer: { kind: 'numeric', value: 6 },
        explain:
          'Có 6 phối tử CN⁻ tạo 6 liên kết phối trí với ion sắt trung tâm, do đó số phối trí bằng 6.',
      },
    ],
    srsCards: [
      {
        hoi: 'Phức chất gồm những phần cấu tạo nào?',
        dap: 'Ion trung tâm (cation kim loại) và các phối tử (ligands) liên kết xung quanh.',
      },
      {
        hoi: 'Bản chất liên kết trong phức chất là gì?',
        dap: 'Liên kết phối trí (cho - nhận cặp electron từ phối tử vào orbital trống của ion trung tâm).',
      },
      {
        hoi: 'Cách tính điện tích của cầu phức?',
        dap: 'Bằng tổng đại số điện tích của ion trung tâm và các phối tử.',
      },
    ],
    animation: {
      title: 'Phức chất bát diện và tứ diện: phối tử vây quanh nguyên tử trung tâm',
      description:
        'Ở giữa bên trái là ion Fe³⁺ làm nguyên tử trung tâm. Sáu phối tử lần lượt bay vào từ sáu hướng vuông góc nhau — trên, dưới, trái, phải, trước, sau — và neo lại quanh ion trung tâm. Mỗi phối tử đều mang một cặp electron chưa liên kết và cho hẳn cặp đó vào orbital trống của ion kim loại, tạo liên kết cho–nhận; đó là lý do mũi tên liên kết trong phức chất luôn chỉ từ phối tử vào trung tâm chứ không phải hai chiều. Khi đủ sáu phối tử, hình khối tạo thành là bát diện đều. Bên phải là trường hợp chỉ có bốn phối tử, chúng xếp thành tứ diện. Số phối tử vây quanh gọi là số phối trí — thường gặp nhất là 6 và 4 — và chính số phối trí cùng bản chất phối tử quyết định hình dạng lẫn màu của phức chất.',
      viewBoxWidth: 470,
      viewBoxHeight: 240,
      durationMs: 8000,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'tt',
          cx: 130,
          cy: 110,
          r: 22,
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'ttt',
          x: 130,
          y: 116,
          text: 'Fe³⁺',
          size: 13,
          anchor: 'middle',
          fill: 'surface',
        },
        {
          kind: 'circle',
          id: 'p1',
          cx: 130,
          cy: 46,
          r: 13,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dy: -36,
              opacity: 0,
            },
            {
              atMs: 600,
              dy: -36,
              opacity: 0,
            },
            {
              atMs: 1400,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 8000,
              dy: 0,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'p2',
          cx: 130,
          cy: 174,
          r: 13,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dy: 36,
              opacity: 0,
            },
            {
              atMs: 600,
              dy: 36,
              opacity: 0,
            },
            {
              atMs: 1400,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 8000,
              dy: 0,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'p3',
          cx: 66,
          cy: 110,
          r: 13,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: -36,
              opacity: 0,
            },
            {
              atMs: 1000,
              dx: -36,
              opacity: 0,
            },
            {
              atMs: 1800,
              dx: 0,
              opacity: 1,
            },
            {
              atMs: 8000,
              dx: 0,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'p4',
          cx: 194,
          cy: 110,
          r: 13,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: 36,
              opacity: 0,
            },
            {
              atMs: 1000,
              dx: 36,
              opacity: 0,
            },
            {
              atMs: 1800,
              dx: 0,
              opacity: 1,
            },
            {
              atMs: 8000,
              dx: 0,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'p5',
          cx: 86,
          cy: 66,
          r: 13,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: -26,
              dy: -26,
              opacity: 0,
            },
            {
              atMs: 1400,
              dx: -26,
              dy: -26,
              opacity: 0,
            },
            {
              atMs: 2200,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 8000,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'p6',
          cx: 174,
          cy: 154,
          r: 13,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: 26,
              dy: 26,
              opacity: 0,
            },
            {
              atMs: 1400,
              dx: 26,
              dy: 26,
              opacity: 0,
            },
            {
              atMs: 2200,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 8000,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'b1',
          x1: 130,
          y1: 60,
          x2: 130,
          y2: 86,
          stroke: 'accent',
          strokeWidth: 1.8,
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
              atMs: 2900,
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
          id: 'b2',
          x1: 130,
          y1: 160,
          x2: 130,
          y2: 134,
          stroke: 'accent',
          strokeWidth: 1.8,
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
              atMs: 2900,
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
          id: 'b3',
          x1: 80,
          y1: 110,
          x2: 106,
          y2: 110,
          stroke: 'accent',
          strokeWidth: 1.8,
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
              atMs: 2900,
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
          id: 'b4',
          x1: 180,
          y1: 110,
          x2: 154,
          y2: 110,
          stroke: 'accent',
          strokeWidth: 1.8,
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
              atMs: 2900,
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
          id: 'cn',
          x: 130,
          y: 206,
          text: 'phối tử CHO cặp electron vào ion trung tâm',
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
              atMs: 2400,
              opacity: 0,
            },
            {
              atMs: 2900,
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
          id: 'batdien',
          x: 130,
          y: 228,
          text: 'số phối trí 6 — hình bát diện đều',
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
          kind: 'line',
          id: 'chia',
          x1: 250,
          y1: 40,
          x2: 250,
          y2: 224,
          stroke: 'muted',
          strokeWidth: 1.5,
          dash: '5 5',
        },
        {
          kind: 'circle',
          id: 'tt2',
          cx: 356,
          cy: 110,
          r: 20,
          fill: 'primary',
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
              atMs: 5100,
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
          id: 'tt2t',
          x: 356,
          y: 116,
          text: 'Zn²⁺',
          size: 12,
          anchor: 'middle',
          fill: 'surface',
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
              atMs: 5100,
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
          cx: 356,
          cy: 56,
          r: 12,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
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
              atMs: 8000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'q2',
          cx: 306,
          cy: 146,
          r: 12,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
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
        {
          kind: 'circle',
          id: 'q3',
          cx: 406,
          cy: 146,
          r: 12,
          fill: 'surface',
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
          kind: 'circle',
          id: 'q4',
          cx: 396,
          cy: 78,
          r: 12,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 5800,
              opacity: 0,
            },
            {
              atMs: 6300,
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
          id: 'e1',
          x1: 356,
          y1: 68,
          x2: 356,
          y2: 90,
          stroke: 'accent',
          strokeWidth: 1.8,
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
          kind: 'line',
          id: 'e2',
          x1: 316,
          y1: 138,
          x2: 342,
          y2: 122,
          stroke: 'accent',
          strokeWidth: 1.8,
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
          kind: 'line',
          id: 'e3',
          x1: 396,
          y1: 138,
          x2: 370,
          y2: 122,
          stroke: 'accent',
          strokeWidth: 1.8,
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
          kind: 'line',
          id: 'e4',
          x1: 388,
          y1: 88,
          x2: 370,
          y2: 100,
          stroke: 'accent',
          strokeWidth: 1.8,
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
          id: 'tudien',
          x: 356,
          y: 190,
          text: 'số phối trí 4 — hình tứ diện',
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
              atMs: 6400,
              opacity: 0,
            },
            {
              atMs: 6900,
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
          id: 'tudien2',
          x: 356,
          y: 212,
          text: 'ví dụ [Zn(OH)₄]²⁻',
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
              atMs: 6400,
              opacity: 0,
            },
            {
              atMs: 6900,
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
          text: 'Ion kim loại ở giữa làm nguyên tử trung tâm của phức chất.',
        },
        {
          atMs: 1400,
          text: 'Sáu phối tử bay vào từ sáu hướng vuông góc nhau.',
        },
        {
          atMs: 2400,
          text: 'Mỗi phối tử CHO một cặp electron vào orbital trống — liên kết cho–nhận.',
        },
        {
          atMs: 3400,
          text: 'Đủ sáu phối tử thì khối tạo thành là bát diện đều.',
        },
        {
          atMs: 5200,
          text: 'Chỉ bốn phối tử thì chúng xếp thành tứ diện, ví dụ [Zn(OH)₄]²⁻.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa12-c8-b29',
    grade: '12',
    chapterNumber: 8,
    chapterTitle: 'Sơ lược về kim loại chuyển tiếp d và phức chất',
    lessonNumber: 29,
    title: 'Một số tính chất và ứng dụng của phức chất',
    hook:
      'Nhỏ ammonia (amoniac) vào cốc dung dịch copper(II) sulfate CuSO₄ màu xanh nhạt: đầu tiên có kết tủa, ' +
      'nhỏ thêm nữa thì kết tủa lại tan hết và dung dịch chuyển màu xanh lam thẫm. Sự tạo phức chất đã làm đổi hẳn tính tan của hợp chất đồng.',
    theory:
      'SỰ TẠO THÀNH PHỨC CHẤT TRONG DUNG DỊCH:\n' +
      '1. Phức chất của Copper (đồng):\n' +
      '   — Khi nhỏ dung dịch NH₃ từ từ vào dung dịch CuSO₄, ban đầu tạo kết tủa xanh nhạt Cu(OH)₂. Khi NH₃ dư, kết tủa tan tạo dung dịch phức chất màu xanh lam thẫm đặc trưng:\n' +
      '     Cu(OH)₂↓ + 4NH₃ → [Cu(NH₃)₄]²⁺ + 2OH⁻ (phức chất tetraamminecopper(II)).\n' +
      '2. Phức chất của Silver (bạc):\n' +
      '   — Kết tủa AgCl màu trắng ít tan trong nước, nhưng tan dễ dàng trong dung dịch NH₃ dư nhờ tạo phức chất không màu diamminesilver(I):\n' +
      '     AgCl↓ + 2NH₃ → [Ag(NH₃)₂]⁺ + Cl⁻.\n\n' +
      'HẰNG SỐ BỀN (K_b):\n' +
      '— Độ bền của phức chất trong dung dịch được đánh giá bằng hằng số bền K_b (hoặc hằng số tạo thành β). Trị số K_b càng lớn thì phức chất càng bền vững, phối tử khó bị thay thế bởi các tác nhân khác.\n\n' +
      'ỨNG DỤNG CỦA PHỨC CHẤT:\n' +
      '— Trong hoá phân tích: Nhận biết, tách và định lượng các ion kim loại (ví dụ: dùng thuốc thử Tollens chứa phức chất bạc để nhận biết aldehyde).\n' +
      '— Trong y học: Dùng chất tạo phức chelate (như muối EDTA) để giải độc kim loại nặng bằng cách "bẫy" ion kim loại độc hại thành phức chất tan, đào thải qua nước tiểu.\n' +
      '— Xúc tác trong công nghiệp hoá chất.',
    workedExample: {
      problem:
        'Giải thích vì sao kết tủa copper(II) hydroxide Cu(OH)₂ màu xanh nhạt lại tan trong dung dịch ammonia dư.',
      steps: [
        'Cu(OH)₂ là chất rắn kết tủa ít tan trong nước.',
        'Khi cho ammonia (NH₃) vào dung dịch, phân tử NH₃ có cặp electron tự do trên nguyên tử N nhường vào orbital trống của ion Cu²⁺.',
        'Phản ứng tạo phức chất [Cu(NH₃)₄]²⁺ tan tốt trong nước theo phương trình:\n  Cu(OH)₂↓ + 4NH₃ → [Cu(NH₃)₄]²⁺ + 2OH⁻.',
        'Nhờ sự hình thành cầu phức tan này, kết tủa xanh nhạt Cu(OH)₂ bị hoà tan hoàn toàn và dung dịch chuyển sang màu xanh lam thẫm.',
      ],
      answer: 'Do tạo phức chất tan [Cu(NH₃)₄]²⁺ màu xanh lam thẫm',
    },
    checkQuestions: [
      {
        prompt:
          'Hoà tan kết tủa AgCl màu trắng bằng dung dịch ammonia (NH₃) dư thì thu được phức chất nào sau đây?',
        choices: [
          { id: 'ag_nh3', label: '[Ag(NH₃)₂]⁺ (không màu)' },
          { id: 'cu_nh3', label: '[Cu(NH₃)₄]²⁺ (xanh thẫm)' },
          { id: 'fe_cn', label: '[Fe(CN)₆]³⁻' },
        ],
        answer: { kind: 'choice', correctIds: ['ag_nh3'] },
        explain:
          'Silver chloride phản ứng với NH₃ tạo phức chất diamminesilver(I) tan tốt, không màu: AgCl + 2NH₃ → [Ag(NH₃)₂]⁺ + Cl⁻. Hai phương án kia là phức chất của đồng và của sắt, trong dung dịch này không có hai kim loại đó.',
      },
      {
        prompt:
          'Giá trị hằng số bền (K_b) của phức chất biểu thị đặc tính nào của phức chất trong dung dịch?',
        choices: [
          { id: 'doc', label: 'Độ độc hại đối với cơ thể' },
          { id: 'ben', label: 'Độ bền vững (khó phân li) của phức chất' },
          { id: 'tan', label: 'Độ tan của phức chất trong nước' },
        ],
        answer: { kind: 'choice', correctIds: ['ben'] },
        explain:
          'Hằng số bền K_b đặc trưng cho cân bằng tạo phức. K_b càng lớn nghĩa là phức chất phân li ra ion trung tâm và phối tử càng ít, tức là phức chất càng bền vững.',
      },
    ],
    srsCards: [
      {
        hoi: 'Kết tủa Cu(OH)₂ tan trong dung dịch NH₃ tạo dung dịch màu gì?',
        dap: 'Xanh lam thẫm.',
      },
      {
        hoi: 'Hằng số bền K_b càng lớn thể hiện điều gì?',
        dap: 'Phức chất càng bền vững trong dung dịch.',
      },
      {
        hoi: 'EDTA có ứng dụng gì trong y học?',
        dap: 'Dùng giải độc chì, thuỷ ngân bằng cách tạo phức bền chelate tan được để đào thải.',
      },
    ],
    animation: {
      title: 'Thay phối tử làm đổi màu: từ [Cu(H₂O)₆]²⁺ sang [Cu(NH₃)₄]²⁺',
      description:
        'Ống nghiệm bên trái chứa dung dịch muối đồng: thực chất trong nước ion Cu²⁺ không đứng một mình mà đã là phức chất [Cu(H₂O)₆]²⁺ với sáu phân tử nước làm phối tử, cho màu xanh lam nhạt. Nhỏ dung dịch ammonia dư vào: các phân tử NH₃ có cặp electron cho mạnh hơn nước nên chúng đẩy phối tử H₂O ra khỏi vị trí và chiếm chỗ. Trong hình, bốn phối tử nước lần lượt rời đi và bốn phối tử NH₃ vào thế chỗ, đồng thời màu dung dịch chuyển sang xanh lam đậm của [Cu(NH₃)₄]²⁺. Điều đáng chú ý: ion trung tâm vẫn nguyên là Cu²⁺, số oxi hoá không đổi, không có phản ứng oxi hoá khử nào xảy ra — chỉ đổi phối tử mà màu đã khác hẳn. Màu của phức chất do cặp ion trung tâm và phối tử cùng quyết định, và đó là cơ sở để nhận biết ion kim loại bằng thuốc thử tạo phức.',
      viewBoxWidth: 470,
      viewBoxHeight: 240,
      durationMs: 9000,
      loop: true,
      shapes: [
        {
          kind: 'rect',
          id: 'ong1',
          x: 44,
          y: 60,
          w: 56,
          h: 110,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          rx: 4,
        },
        {
          kind: 'rect',
          id: 'dd1',
          x: 48,
          y: 96,
          w: 48,
          h: 70,
          fill: 'primary',
          rx: 2,
          opacity: 0.25,
          keyframes: [
            {
              atMs: 0,
              opacity: 0.25,
            },
            {
              atMs: 4400,
              opacity: 0.25,
            },
            {
              atMs: 6400,
              opacity: 0.85,
            },
            {
              atMs: 9000,
              opacity: 0.85,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ong1t',
          x: 72,
          y: 190,
          text: 'dung dịch muối Cu²⁺',
          size: 10,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'ong1b',
          x: 72,
          y: 212,
          text: 'xanh lam nhạt → xanh lam đậm',
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
              atMs: 6400,
              opacity: 0,
            },
            {
              atMs: 6900,
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
          id: 'nh3',
          x: 72,
          y: 42,
          text: 'nhỏ NH₃ dư',
          size: 11,
          anchor: 'middle',
          fill: 'accent',
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
              atMs: 9000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'cu',
          cx: 250,
          cy: 106,
          r: 20,
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'cut',
          x: 250,
          y: 112,
          text: 'Cu²⁺',
          size: 12,
          anchor: 'middle',
          fill: 'surface',
        },
        {
          kind: 'circle',
          id: 'w1',
          cx: 250,
          cy: 54,
          r: 13,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 2600,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 4400,
              dx: -30,
              dy: -34,
              opacity: 0,
            },
            {
              atMs: 9000,
              dx: -30,
              dy: -34,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'w2',
          cx: 250,
          cy: 158,
          r: 13,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 2600,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 4400,
              dx: 30,
              dy: 34,
              opacity: 0,
            },
            {
              atMs: 9000,
              dx: 30,
              dy: 34,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'w3',
          cx: 198,
          cy: 106,
          r: 13,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 4800,
              dx: -34,
              dy: 0,
              opacity: 0,
            },
            {
              atMs: 9000,
              dx: -34,
              dy: 0,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'w4',
          cx: 302,
          cy: 106,
          r: 13,
          fill: 'surface',
          stroke: 'muted',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 4800,
              dx: 34,
              dy: 0,
              opacity: 0,
            },
            {
              atMs: 9000,
              dx: 34,
              dy: 0,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'wt',
          x: 250,
          y: 196,
          text: 'phối tử H₂O',
          size: 10,
          anchor: 'middle',
          fill: 'neutral',
          keyframes: [
            {
              atMs: 0,
              opacity: 1,
            },
            {
              atMs: 4400,
              opacity: 1,
            },
            {
              atMs: 5000,
              opacity: 0,
            },
            {
              atMs: 9000,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'a1',
          cx: 250,
          cy: 54,
          r: 13,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: 40,
              dy: -40,
              opacity: 0,
            },
            {
              atMs: 4600,
              dx: 40,
              dy: -40,
              opacity: 0,
            },
            {
              atMs: 5800,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 9000,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'a2',
          cx: 250,
          cy: 158,
          r: 13,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: -40,
              dy: 40,
              opacity: 0,
            },
            {
              atMs: 4600,
              dx: -40,
              dy: 40,
              opacity: 0,
            },
            {
              atMs: 5800,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 9000,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'a3',
          cx: 198,
          cy: 106,
          r: 13,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: -44,
              dy: 0,
              opacity: 0,
            },
            {
              atMs: 5000,
              dx: -44,
              dy: 0,
              opacity: 0,
            },
            {
              atMs: 6200,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 9000,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'a4',
          cx: 302,
          cy: 106,
          r: 13,
          fill: 'surface',
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            {
              atMs: 0,
              dx: 44,
              dy: 0,
              opacity: 0,
            },
            {
              atMs: 5000,
              dx: 44,
              dy: 0,
              opacity: 0,
            },
            {
              atMs: 6200,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
            {
              atMs: 9000,
              dx: 0,
              dy: 0,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'at',
          x: 250,
          y: 196,
          text: 'phối tử NH₃ thế chỗ',
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
              atMs: 6200,
              opacity: 0,
            },
            {
              atMs: 6700,
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
          id: 'ct1',
          x: 390,
          y: 84,
          text: '[Cu(H₂O)₆]²⁺',
          size: 13,
          anchor: 'middle',
          fill: 'primary',
          keyframes: [
            {
              atMs: 0,
              opacity: 1,
            },
            {
              atMs: 4400,
              opacity: 1,
            },
            {
              atMs: 5000,
              opacity: 0,
            },
            {
              atMs: 9000,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ct2',
          x: 390,
          y: 84,
          text: '[Cu(NH₃)₄]²⁺',
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
              atMs: 6200,
              opacity: 0,
            },
            {
              atMs: 6700,
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
          id: 'ct3',
          x: 390,
          y: 118,
          text: 'Cu vẫn là +2',
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
              atMs: 7000,
              opacity: 0,
            },
            {
              atMs: 7500,
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
          id: 'ct4',
          x: 390,
          y: 138,
          text: 'không có oxi hoá khử',
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
              atMs: 7000,
              opacity: 0,
            },
            {
              atMs: 7500,
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
          id: 'ct5',
          x: 390,
          y: 168,
          text: 'đổi phối tử là đổi màu',
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
              atMs: 7500,
              opacity: 0,
            },
            {
              atMs: 8000,
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
          id: 'ct6',
          x: 390,
          y: 188,
          text: '→ dùng nhận biết ion kim loại',
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
              atMs: 7500,
              opacity: 0,
            },
            {
              atMs: 8000,
              opacity: 1,
            },
            {
              atMs: 9000,
              opacity: 1,
            },
          ],
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Trong nước, Cu²⁺ đã là phức [Cu(H₂O)₆]²⁺ màu xanh lam nhạt.',
        },
        {
          atMs: 2400,
          text: 'Nhỏ ammonia dư: NH₃ cho electron mạnh hơn H₂O.',
        },
        {
          atMs: 4600,
          text: 'Phối tử H₂O bị đẩy ra, NH₃ vào thế chỗ.',
        },
        {
          atMs: 6400,
          text: 'Dung dịch chuyển xanh lam đậm của [Cu(NH₃)₄]²⁺.',
        },
        {
          atMs: 7200,
          text: 'Cu vẫn ở số oxi hoá +2 — chỉ đổi phối tử, không phải oxi hoá khử.',
        },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa12-c8-b30',
    grade: '12',
    chapterNumber: 8,
    chapterTitle: 'Sơ lược về kim loại chuyển tiếp d và phức chất',
    lessonNumber: 30,
    title: 'Ôn tập chương 8 — Sơ lược về kim loại chuyển tiếp d và phức chất',
    hook:
      'Chương 8 giới thiệu các kim loại chuyển tiếp d và phức chất — hai nội dung giải thích vì sao dung dịch muối kim loại lại có nhiều màu đến thế. ' +
      'Bài này ôn lại toàn bộ chương.',
    theory:
      'HỆ THỐNG HOÁ KIẾN THỨC CHƯƠNG 8:\n' +
      '1. Kim loại chuyển tiếp d chu kì 4 (Sc đến Zn): cấu hình electron hoá trị (n−1)d¹⁻¹⁰ns². Cr ([Ar]3d⁵4s¹) và Cu ([Ar]3d¹⁰4s¹) cấu hình đặc biệt. Tính chất: độ cứng cao, nóng chảy cao, nhiều số oxi hoá, hợp chất có màu đặc trưng.\n' +
      '2. Phức chất: Gồm ion trung tâm (cation d) liên kết phối trí với phối tử ligand (H₂O, NH₃, Cl⁻...). Số phối trí là số liên kết phối trí (2, 4, 6).\n' +
      '3. Sự tạo phức trong nước: Cu(OH)₂ tan trong NH₃ tạo [Cu(NH₃)₄]²⁺ màu xanh lam thẫm; AgCl tan trong NH₃ tạo [Ag(NH₃)₂]⁺ không màu.\n' +
      '4. Hằng số bền K_b càng lớn phức chất càng bền. Ứng dụng phân tích định lượng, giải độc kim loại y học (EDTA), chất xúc tác.',
    workedExample: {
      problem:
        'Xác định số oxi hoá và số phối trí của ion trung tâm Nickel (Ni) trong phức chất [Ni(NH₃)₆]Cl₂.',
      steps: [
        'Cầu phức là [Ni(NH₃)₆]²⁺, bên ngoài cầu phức có 2 Cl⁻ mang điện tích −2.',
        'Ion trung tâm là Ni.',
        'Có 6 phối tử NH₃ liên kết phối trí trực tiếp với Ni ⇒ Số phối trí của ion trung tâm Ni bằng 6.',
        'Phối tử NH₃ là phân tử trung hoà điện tích (0). Điện tích cầu phức bằng +2. Do đó, điện tích của ion trung tâm Ni cũng bằng +2 ⇒ Số oxi hoá của Ni trong phức chất là +2.',
      ],
      answer: 'Số oxi hoá +2, số phối trí 6',
    },
    checkQuestions: [
      {
        prompt: 'Phức chất [Cr(H₂O)₆]³⁺ có số phối trí của ion trung tâm chromium bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 6 },
        explain:
          'Có 6 phối tử nước H₂O liên kết phối trí trực tiếp với ion trung tâm Cr³⁺, do đó số phối trí bằng 6.',
      },
      {
        prompt: 'Nguyên tố nào sau đây thuộc dãy kim loại chuyển tiếp thứ nhất của phân nhóm d?',
        choices: [
          { id: 'na', label: 'Sodium (Na)' },
          { id: 'ca', label: 'Calcium (Ca)' },
          { id: 'fe', label: 'Iron (Fe)' },
          { id: 'al', label: 'Aluminium (Al)' },
        ],
        answer: { kind: 'choice', correctIds: ['fe'] },
        explain:
          'Iron (Fe, Z = 26) nằm ở nhóm VIIIB, chu kì 4, nên thuộc dãy kim loại chuyển tiếp thứ nhất. Sodium, calcium và aluminium đều là nguyên tố nhóm A (IA, IIA, IIIA), không phải kim loại chuyển tiếp.',
      },
    ],
    srsCards: [
      { hoi: 'Phức chất của đồng với ammonia có màu gì?', dap: 'Màu xanh lam thẫm, đó là phức [Cu(NH₃)₄]²⁺.' },
      {
        hoi: 'Phối tử là gì?',
        dap: 'Là phân tử hoặc anion còn cặp electron chưa liên kết, đem cho cặp electron đó vào orbital trống của ion trung tâm để tạo liên kết phối trí.',
      },
      { hoi: 'Số phối trí thường gặp trong phức chất?', dap: '2, 4, và 6.' },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
