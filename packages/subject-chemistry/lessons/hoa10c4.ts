// lessons/hoa10c4.ts — Hoá học 10, Chương 4: Phản ứng oxi hoá - khử (1 bài).
// Mục lục thật: tai-lieu-sgk/SGK-Hoa/10/page_0005.png (OCR 2026-08-31).
import type { ChemLesson } from '../lessonTypes.js'

export const HOA10_C4_LESSONS: ChemLesson[] = [
  {
    id: 'hoa10-c4-b13',
    grade: '10',
    chapterNumber: 4,
    chapterTitle: 'Phản ứng oxi hoá - khử',
    lessonNumber: 13,
    title: 'Phản ứng oxi hoá - khử',
    hook:
      'Đinh sắt bị gỉ, pin điện thoại phóng điện, và ngọn lửa cháy — ba hiện tượng tưởng ' +
      'chẳng liên quan đều cùng một bản chất hoá học: SỰ CHUYỂN ELECTRON giữa các chất.',
    theory:
      'SỐ OXI HOÁ là điện tích giả định của một nguyên tử trong phân tử/ion, tính theo quy ' +
      'ước: nguyên tố tự do (đơn chất) có số oxi hoá 0; trong hợp chất, kim loại kiềm luôn +1, ' +
      'kiềm thổ luôn +2, F luôn −1; H thường +1 (trừ hydride kim loại như NaH thì −1); O thường ' +
      '−2 (ngoại lệ: peroxide H₂O₂ là −1, còn trong OF₂ thì O mang +2 vì F âm điện hơn O); ' +
      'tổng số oxi hoá trong phân tử trung hoà = 0, trong ion = điện tích ion.\n\n' +
      'VÌ SAO phải quy ước như vậy? Vì electron trong liên kết cộng hoá trị không thuộc hẳn về ' +
      'nguyên tử nào. Ta "giả vờ" gán cả cặp electron dùng chung cho nguyên tử có độ âm điện ' +
      'lớn hơn, rồi đếm điện tích còn lại — nhờ vậy mới theo dõi được electron đi đâu trong ' +
      'phản ứng. Số oxi hoá KHÔNG phải điện tích thật của nguyên tử.\n\n' +
      'CHẤT KHỬ (chất bị oxi hoá): chất NHƯỜNG electron, có số oxi hoá TĂNG sau phản ứng.\n' +
      'CHẤT OXI HOÁ (chất bị khử): chất NHẬN electron, có số oxi hoá GIẢM sau phản ứng.\n\n' +
      'PHẢN ỨNG OXI HOÁ – KHỬ là phản ứng có sự THAY ĐỔI SỐ OXI HOÁ của ít nhất một nguyên ' +
      'tố — luôn xảy ra ĐỒNG THỜI quá trình oxi hoá (nhường e) và quá trình khử (nhận e), số ' +
      'electron nhường = số electron nhận.\n\n' +
      'PHƯƠNG PHÁP THĂNG BẰNG ELECTRON để cân bằng PTHH oxi hoá-khử:\n' +
      '1. Xác định số oxi hoá của nguyên tố thay đổi.\n' +
      '2. Viết quá trình oxi hoá và quá trình khử.\n' +
      '3. Tìm hệ số sao cho số electron nhường = số electron nhận (nhân chéo bội số chung ' +
      'nhỏ nhất).\n' +
      '4. Đặt hệ số vào phương trình, kiểm tra cân bằng nguyên tố khác.',
    workedExample: {
      problem: 'Xác định chất khử, chất oxi hoá trong phản ứng: Zn + CuSO₄ → ZnSO₄ + Cu.',
      steps: [
        'Xác định số oxi hoá trước phản ứng: Zn (đơn chất) = 0; Cu trong CuSO₄ = +2.',
        'Xác định số oxi hoá sau phản ứng: Zn trong ZnSO₄ = +2; Cu (đơn chất) = 0.',
        'Zn: số oxi hoá tăng từ 0 lên +2 (nhường 2e) ⇒ Zn là CHẤT KHỬ (bị oxi hoá).',
        'Cu: số oxi hoá giảm từ +2 xuống 0 (nhận 2e) ⇒ Cu²⁺ là CHẤT OXI HOÁ (bị khử).',
      ],
      answer: 'Chất khử: Zn. Chất oxi hoá: Cu²⁺ (trong CuSO₄).',
    },
    checkQuestions: [
      {
        prompt: 'Chất khử là chất có đặc điểm gì trong phản ứng oxi hoá - khử?',
        choices: [
          { id: 'a', label: 'Nhường electron, số oxi hoá tăng' },
          { id: 'b', label: 'Nhận electron, số oxi hoá giảm' },
          { id: 'c', label: 'Không thay đổi số oxi hoá' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain: 'Chất khử = chất bị oxi hoá = chất NHƯỜNG electron ⇒ số oxi hoá TĂNG.',
      },
      {
        prompt:
          'Trong phản ứng Fe + 2HCl → FeCl₂ + H₂, số oxi hoá của Fe thay đổi từ 0 lên bao nhiêu?',
        answer: { kind: 'numeric', value: 2 },
        explain:
          'Fe (đơn chất, số oxi hoá 0) nhường 2e tạo Fe²⁺ trong FeCl₂ ⇒ số oxi hoá Fe tăng lên +2.',
      },
      {
        // Câu BẪY 1: học sinh hay lấy "1 Al nhường 3e" rồi quên nhân hệ số cân bằng.
        prompt:
          'Cân bằng phản ứng: Al + O₂ → Al₂O₃ bằng phương pháp thăng bằng electron. Hỏi hệ số ' +
          'của Al trong phương trình đã cân bằng là bao nhiêu? (chỉ nhập số)',
        answer: { kind: 'numeric', value: 4 },
        explain:
          'Nhiều bạn dừng ở "Al → Al³⁺ + 3e, O₂ + 4e → 2O²⁻" rồi ghi ngay hệ số 3 và 4 nhầm chỗ. ' +
          'Làm đúng: bội chung nhỏ nhất của 3 (e nhường) và 4 (e nhận) là 12 ⇒ cần 4 nguyên tử ' +
          'Al (4×3 = 12e nhường) và 3 phân tử O₂ (3×4 = 12e nhận). Phương trình cân bằng là ' +
          '4Al + 3O₂ → 2Al₂O₃. Hệ số của Al là 4. Luôn kiểm lại số nguyên tử hai vế sau khi đặt ' +
          'hệ số — quên bước này là lỗi mất điểm phổ biến nhất của dạng bài này.',
      },
      {
        // Câu BẪY 2: nhầm "số oxi hoá của O luôn bằng −2".
        prompt:
          'Số oxi hoá của nguyên tố oxygen trong hợp chất H₂O₂ (hydrogen peroxide) bằng bao ' +
          'nhiêu? (nhập số, kèm dấu nếu âm)',
        answer: { kind: 'numeric', value: -1 },
        explain:
          'Bẫy ở chỗ "O luôn là −2". Trong H₂O₂ mỗi H là +1, tổng số oxi hoá bằng 0 ⇒ 2(+1) + ' +
          '2x = 0 ⇒ x = −1. Lý do sâu xa: trong H₂O₂ có liên kết O–O giữa hai nguyên tử giống ' +
          'nhau, cặp electron đó chia đôi chứ không gán hết cho bên nào.',
      },
    ],
    srsCards: [
      { hoi: 'Chất khử là gì?', dap: 'Chất nhường electron, có số oxi hoá tăng sau phản ứng.' },
      { hoi: 'Chất oxi hoá là gì?', dap: 'Chất nhận electron, có số oxi hoá giảm sau phản ứng.' },
      {
        hoi: 'Nguyên tắc cân bằng phương trình bằng phương pháp thăng bằng electron?',
        dap: 'Số electron chất khử nhường = số electron chất oxi hoá nhận.',
      },
    ],
    animation: {
      title: 'Zn nhường 2 electron cho Cu²⁺ (Zn + CuSO₄ → ZnSO₄ + Cu)',
      description:
        'Bên trái là lá kẽm Zn nhúng trong dung dịch chứa ion Cu²⁺ (bên phải). Hai electron rời ' +
        'khỏi nguyên tử Zn và chạy sang ion Cu²⁺. Zn mất 2 electron nên số oxi hoá tăng từ 0 lên ' +
        '+2 (Zn là chất khử, bị oxi hoá); Cu²⁺ nhận đúng 2 electron đó nên số oxi hoá giảm từ +2 ' +
        'xuống 0, bám lên lá kẽm thành lớp đồng đỏ (Cu²⁺ là chất oxi hoá, bị khử). Hai quá trình ' +
        'xảy ra đồng thời và số electron nhường luôn bằng số electron nhận — đó là nguyên tắc ' +
        'của phương pháp thăng bằng electron.',
      viewBoxWidth: 420,
      viewBoxHeight: 200,
      durationMs: 5000,
      loop: true,
      shapes: [
        { kind: 'rect', id: 'la-zn', x: 60, y: 40, w: 46, h: 120, rx: 4, fill: 'muted' },
        {
          kind: 'label',
          id: 'zn-t',
          x: 83,
          y: 105,
          text: 'Zn',
          size: 16,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'zn-so',
          x: 83,
          y: 182,
          text: 'số oxi hoá 0 → +2',
          size: 11,
          anchor: 'middle',
          fill: 'neutral',
        },
        { kind: 'circle', id: 'cu-ion', cx: 320, cy: 100, r: 28, fill: 'accent', opacity: 0.5 },
        {
          kind: 'label',
          id: 'cu-t',
          x: 320,
          y: 105,
          text: 'Cu²⁺',
          size: 15,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'cu-so',
          x: 320,
          y: 182,
          text: 'số oxi hoá +2 → 0',
          size: 11,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'circle',
          id: 'e-a',
          cx: 116,
          cy: 80,
          r: 6,
          fill: 'correct',
          keyframes: [
            { atMs: 0, dx: 0 },
            { atMs: 2200, dx: 176 },
            { atMs: 2500, dx: 176, opacity: 0 },
            { atMs: 5000, dx: 176, opacity: 0 },
          ],
        },
        {
          kind: 'circle',
          id: 'e-b',
          cx: 116,
          cy: 120,
          r: 6,
          fill: 'correct',
          keyframes: [
            { atMs: 0, dx: 0 },
            { atMs: 300, dx: 0 },
            { atMs: 2500, dx: 176 },
            { atMs: 2800, dx: 176, opacity: 0 },
            { atMs: 5000, dx: 176, opacity: 0 },
          ],
        },
        {
          kind: 'arrow',
          id: 'huong-e',
          x1: 120,
          y1: 58,
          x2: 280,
          y2: 58,
          stroke: 'muted',
          strokeWidth: 1.5,
        },
        {
          kind: 'label',
          id: 'chu-2e',
          x: 200,
          y: 48,
          text: '2 electron',
          size: 12,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'kl',
          x: 210,
          y: 20,
          text: 'chất khử nhường e  ⇌  chất oxi hoá nhận e (đúng bằng nhau)',
          size: 11,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3000, opacity: 1 },
            { atMs: 5000, opacity: 1 },
          ],
        },
      ],
      captions: [
        { atMs: 0, text: 'Zn đứng trước Cu trong dãy hoạt động nên đẩy được Cu ra khỏi muối.' },
        { atMs: 2600, text: 'Zn nhường 2e (bị oxi hoá) — Cu²⁺ nhận đúng 2e đó (bị khử).' },
      ],
    },
    track: 'core',
    reviewStatus: 'draft',
  },
]
