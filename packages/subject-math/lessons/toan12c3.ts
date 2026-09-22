// lessons/toan12c3.ts — Toán 12, Chương 3: Các số đặc trưng đo mức độ phân tán của mẫu số liệu
// ghép nhóm. Số liệu và tình huống tự soạn, KHÔNG chép ví dụ SGK.
// Trạng thái `draft` — chờ người có chuyên môn Toán duyệt qua quy trình lessonReview.
import type { MathLesson } from '../lessonTypes.js'

const CHUONG = 'Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm'

export const TOAN12_C3_LESSONS: MathLesson[] = [
  {
    id: 'toan12-c3-b1',
    grade: '12',
    chapterNumber: 3,
    chapterTitle: CHUONG,
    lessonNumber: 1,
    title: 'Khoảng biến thiên và khoảng tứ phân vị của mẫu số liệu ghép nhóm',
    hook:
      'Ban giám hiệu khảo sát thời gian tự học mỗi tuần của 40 học sinh, nhưng phiếu chỉ hỏi "khoảng mấy giờ" nên ' +
      'kết quả thu về là các nhóm chứ không phải từng con số. Thầy hiệu trưởng vẫn muốn biết: nhóm học sinh ở giữa ' +
      'trải rộng thế nào, và có ai lệch hẳn ra ngoài không. Mất dữ liệu chi tiết mà vẫn đo được độ phân tán — đó là ' +
      'việc của chương này.',
    theory:
      'MẪU SỐ LIỆU GHÉP NHÓM LÀ GÌ\n' +
      'Thay vì liệt kê từng giá trị, ta chia trục số thành các nhóm (lớp) liên tiếp dạng [a; b) rồi chỉ ghi lại TẦN ' +
      'SỐ, tức có bao nhiêu giá trị rơi vào mỗi nhóm. Cách ghi này gọn và bảo vệ riêng tư, nhưng ta MẤT vị trí ' +
      'chính xác của từng giá trị bên trong nhóm. Mọi công thức dưới đây đều là cách tốt nhất có thể làm với phần ' +
      'thông tin còn lại.\n\n' +
      'KHOẢNG BIẾN THIÊN\n' +
      'R = (đầu mút PHẢI của nhóm cuối cùng) − (đầu mút TRÁI của nhóm đầu tiên).\n' +
      'Nó đo bề rộng toàn bộ dải số liệu. Ưu điểm: tính trong ba giây. Nhược điểm chí mạng: chỉ phụ thuộc hai đầu ' +
      'mút, nên MỘT giá trị bất thường (một bạn học 15 giờ/tuần) đủ kéo R phồng lên dù 39 bạn còn lại rất giống ' +
      'nhau. Vì thế R không bao giờ được dùng một mình để kết luận về độ đồng đều.\n\n' +
      'TỨ PHÂN VỊ — BA CÁI MỐC CHIA MẪU THÀNH BỐN PHẦN BẰNG NHAU\n' +
      'Sắp số liệu tăng dần, ba mốc Q₁, Q₂, Q₃ chia mẫu thành bốn phần, mỗi phần chứa khoảng 25% số giá trị. Q₂ ' +
      'chính là trung vị.\n' +
      'CÁCH TÌM Qₖ TRONG MẪU GHÉP NHÓM (k = 1, 2, 3), gồm ba bước:\n' +
      '1. Tính vị trí cần tìm: t = k·n/4, với n là cỡ mẫu.\n' +
      '2. Cộng dồn tần số để tìm nhóm ĐẦU TIÊN có tần số tích luỹ ≥ t; gọi nó là [u; v), tần số f, tần số tích luỹ ' +
      'của các nhóm ĐỨNG TRƯỚC là C.\n' +
      '3. Nội suy tuyến tính bên trong nhóm đó:\n' +
      'Qₖ = u + (t − C)/f · (v − u).\n' +
      'VÌ SAO NỘI SUY: ta không biết f giá trị trong nhóm nằm đâu, nên giả định chúng RẢI ĐỀU trên cả nhóm. Khi đó ' +
      'muốn đi tiếp (t − C) giá trị nữa trong tổng f giá trị của nhóm thì phải tiến thêm đúng tỉ lệ ấy của bề rộng ' +
      'nhóm. Đây là giả định, không phải sự thật tuyệt đối — nên Qₖ tính ra là GIÁ TRỊ XẤP XỈ, và nó hoàn toàn có ' +
      'thể không trùng bất kì số liệu gốc nào.\n\n' +
      'KHOẢNG TỨ PHÂN VỊ\n' +
      'Δ_Q = Q₃ − Q₁.\n' +
      'Nó đo bề rộng của 50% số liệu Ở GIỮA. Vì cắt bỏ 25% thấp nhất và 25% cao nhất, Δ_Q gần như không bị giá trị ' +
      'bất thường làm nhiễu — đó là lí do người ta thích dùng nó hơn khoảng biến thiên khi dữ liệu có ngoại lệ.\n' +
      'Δ_Q càng nhỏ thì nhóm ở giữa càng chụm, mẫu càng đồng đều.\n\n' +
      'HAI LỖI HAY MẮC\n' +
      '— Lấy R bằng hiệu hai GIÁ TRỊ ĐẠI DIỆN (trung điểm) của nhóm đầu và nhóm cuối. Sai: phải dùng mép ngoài ' +
      'cùng của hai nhóm đó.\n' +
      '— Nhầm vị trí t với giá trị Qₖ. t chỉ là "số thứ tự" trong dãy đã sắp xếp; còn Qₖ là giá trị đọc trên trục ' +
      'số, phải qua bước nội suy mới có.',
    animation: {
      title: 'Ba tứ phân vị chia mẫu số liệu thành bốn phần bằng nhau',
      description:
        'Một dải ngang biểu diễn toàn bộ mẫu số liệu đã sắp xếp tăng dần. Ba vạch dọc Q một, Q hai, Q ba lần lượt ' +
        'xuất hiện chia dải thành bốn phần, mỗi phần chứa một phần tư số giá trị. Cuối cùng đoạn nằm giữa Q một và ' +
        'Q ba được tô đậm để cho thấy khoảng tứ phân vị chính là bề rộng của nửa số liệu ở giữa.',
      viewBoxWidth: 360,
      viewBoxHeight: 200,
      durationMs: 6500,
      loop: true,
      shapes: [
        { kind: 'rect', id: 'dai', x: 30, y: 70, w: 300, h: 40, rx: 4, fill: 'surface' },
        { kind: 'line', id: 'truc', x1: 30, y1: 130, x2: 330, y2: 130, stroke: 'muted' },
        {
          kind: 'line',
          id: 'q1',
          x1: 105,
          y1: 60,
          x2: 105,
          y2: 120,
          stroke: 'primary',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 900, opacity: 1 },
            { atMs: 6500, opacity: 1 },
          ],
        },
        {
          kind: 'line',
          id: 'q2',
          x1: 180,
          y1: 60,
          x2: 180,
          y2: 120,
          stroke: 'primary',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1900, opacity: 1 },
            { atMs: 6500, opacity: 1 },
          ],
        },
        {
          kind: 'line',
          id: 'q3',
          x1: 255,
          y1: 60,
          x2: 255,
          y2: 120,
          stroke: 'primary',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 2900, opacity: 1 },
            { atMs: 6500, opacity: 1 },
          ],
        },
        {
          kind: 'rect',
          id: 'hopGiua',
          x: 105,
          y: 70,
          w: 150,
          h: 40,
          rx: 4,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 4000, opacity: 0 },
            { atMs: 4600, opacity: 0.45 },
            { atMs: 6500, opacity: 0.45 },
          ],
        },
        {
          kind: 'label',
          id: 'nq1',
          x: 105,
          y: 150,
          text: 'Q₁',
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nq2',
          x: 180,
          y: 150,
          text: 'Q₂',
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nq3',
          x: 255,
          y: 150,
          text: 'Q₃',
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanDQ',
          x: 180,
          y: 52,
          text: 'ΔQ = Q₃ − Q₁',
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanMin',
          x: 30,
          y: 150,
          text: 'nhỏ nhất',
          size: 12,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanMax',
          x: 330,
          y: 150,
          text: 'lớn nhất',
          size: 12,
          anchor: 'end',
          fill: 'neutral',
        },
      ],
      captions: [
        { atMs: 900, text: 'Q₁ cắt ra 25% giá trị nhỏ nhất.' },
        { atMs: 1900, text: 'Q₂ là trung vị, chia mẫu làm đôi.' },
        { atMs: 2900, text: 'Q₃ cắt ra 25% giá trị lớn nhất.' },
        { atMs: 4600, text: 'ΔQ = Q₃ − Q₁ đo bề rộng của 50% ở giữa.' },
      ],
    },
    workedExample: {
      problem:
        'Khảo sát thời gian tự học mỗi tuần (đơn vị: giờ) của 40 học sinh thu được bảng ghép nhóm: [0; 4) có 6 ' +
        'học sinh; [4; 8) có 10; [8; 12) có 16; [12; 16) có 8. Tính khoảng biến thiên và khoảng tứ phân vị.',
      steps: [
        'Bước 1 — Khoảng biến thiên lấy theo hai mép ngoài cùng: R = 16 − 0 = 16 (giờ).',
        'Bước 2 — Lập tần số tích luỹ để biết mỗi nhóm "kết thúc" ở giá trị thứ mấy: 6; 16; 32; 40. Cỡ mẫu n = 40.',
        'Bước 3 — Tìm Q₁: vị trí t = 40/4 = 10. Nhóm đầu tiên có tần số tích luỹ ≥ 10 là [4; 8), với C = 6, f = 10, ' +
          'bề rộng 4. Nội suy: Q₁ = 4 + (10 − 6)/10 · 4 = 4 + 1,6 = 5,6.',
        'Bước 4 — Tìm Q₃: vị trí t = 3·40/4 = 30. Nhóm đầu tiên có tần số tích luỹ ≥ 30 là [8; 12), với C = 16, ' +
          'f = 16, bề rộng 4. Nội suy: Q₃ = 8 + (30 − 16)/16 · 4 = 8 + 3,5 = 11,5.',
        'Bước 5 — Khoảng tứ phân vị: Δ_Q = 11,5 − 5,6 = 5,9 (giờ). So với R = 16, con số 5,9 cho thấy nửa số học ' +
          'sinh ở giữa thật ra khá chụm; phần lớn bề rộng 16 giờ là do hai nhóm đầu và cuối kéo ra.',
      ],
      answer: 'R = 16 giờ; Q₁ = 5,6; Q₃ = 11,5; Δ_Q = 5,9 giờ.',
    },
    checkQuestions: [
      {
        prompt:
          'Cho mẫu ghép nhóm về thời gian tự học (giờ/tuần) của 40 học sinh: [0; 4) có 6; [4; 8) có 10; [8; 12) ' +
          'có 16; [12; 16) có 8. Tính khoảng biến thiên R.',
        answer: { kind: 'numeric', value: 16 },
        explain:
          'Khoảng biến thiên của mẫu ghép nhóm lấy mép phải của nhóm cuối trừ mép trái của nhóm đầu: R = 16 − 0 = 16. ' +
          'Lỗi hay gặp là lấy hiệu hai giá trị đại diện (trung điểm) của nhóm đầu và nhóm cuối, tức 14 − 2 = 12 — ' +
          'cách đó bỏ sót hai nửa nhóm ngoài cùng nên luôn cho kết quả nhỏ hơn thực tế.',
      },
      {
        prompt:
          'Vẫn mẫu ghép nhóm trên ([0;4): 6; [4;8): 10; [8;12): 16; [12;16): 8, n = 40). Tính tứ phân vị thứ nhất Q₁.',
        answer: { kind: 'numeric', value: 5.6 },
        explain:
          'Vị trí cần tìm là t = n/4 = 10. Tần số tích luỹ lần lượt là 6; 16; 32; 40 nên nhóm đầu tiên đạt ngưỡng ' +
          '10 là [4; 8) với C = 6 và f = 10. Nội suy tuyến tính: Q₁ = 4 + (10 − 6)/10 · (8 − 4) = 4 + 1,6 = 5,6. ' +
          'Nhớ rằng t = 10 chỉ là số THỨ TỰ trong dãy đã sắp xếp, còn 5,6 mới là giá trị đọc trên trục số.',
      },
      {
        prompt:
          'Vẫn mẫu ghép nhóm trên ([0;4): 6; [4;8): 10; [8;12): 16; [12;16): 8, n = 40). Tính tứ phân vị thứ ba Q₃.',
        answer: { kind: 'numeric', value: 11.5 },
        explain:
          'Vị trí t = 3n/4 = 30. Tần số tích luỹ 6; 16; 32; 40 cho thấy nhóm đầu tiên đạt ngưỡng 30 là [8; 12) với ' +
          'C = 16 và f = 16. Nội suy: Q₃ = 8 + (30 − 16)/16 · (12 − 8) = 8 + 3,5 = 11,5. Sai lầm thường gặp là lấy ' +
          'luôn mép nhóm 12 cho gọn — làm vậy là bỏ qua bước nội suy và luôn cho kết quả lệch lên trên.',
      },
      {
        prompt: 'Vẫn mẫu ghép nhóm trên, biết Q₁ = 5,6 và Q₃ = 11,5. Tính khoảng tứ phân vị Δ_Q.',
        answer: { kind: 'numeric', value: 5.9 },
        explain:
          'Theo định nghĩa Δ_Q = Q₃ − Q₁ = 11,5 − 5,6 = 5,9 giờ. Con số này đo bề rộng của 50% số liệu nằm giữa, ' +
          'nhỏ hơn hẳn khoảng biến thiên 16 giờ. Chênh lệch lớn giữa hai đại lượng là dấu hiệu cho thấy phần lớn ' +
          'bề rộng của mẫu do các giá trị ở hai cực tạo ra, còn đám đông ở giữa thì khá chụm.',
      },
      {
        prompt:
          'Vì sao khi mẫu số liệu có giá trị bất thường (quá lớn hoặc quá nhỏ), người ta thích dùng khoảng tứ phân ' +
          'vị hơn khoảng biến thiên? Chọn đáp án đúng.',
        choices: [
          { id: 'A', label: 'Vì khoảng tứ phân vị luôn lớn hơn khoảng biến thiên nên dễ so sánh' },
          {
            id: 'B',
            label:
              'Vì khoảng tứ phân vị chỉ xét 50% giá trị ở giữa, đã cắt bỏ 25% nhỏ nhất và 25% lớn nhất nên ít bị ' +
              'giá trị bất thường làm nhiễu',
          },
          { id: 'C', label: 'Vì khoảng tứ phân vị tính nhanh hơn khoảng biến thiên' },
          { id: 'D', label: 'Vì khoảng biến thiên không tính được cho mẫu ghép nhóm' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Khoảng biến thiên chỉ phụ thuộc đúng hai mép ngoài cùng, nên một giá trị lạc lõng cũng đủ kéo nó phồng ' +
          'lên và che mất sự đồng đều của phần còn lại. Khoảng tứ phân vị cắt bỏ hai phần tư ngoài cùng trước khi ' +
          'đo nên bền vững hơn hẳn. Phương án A sai về mặt số học (Δ_Q luôn không vượt quá R), còn C và D sai về ' +
          'bản chất: khoảng biến thiên mới là cái tính nhanh nhất, và nó vẫn tính được cho mẫu ghép nhóm.',
      },
    ],
    srsCards: [
      {
        hoi: 'Khoảng biến thiên của mẫu ghép nhóm tính thế nào?',
        dap: 'R = mép phải nhóm cuối − mép trái nhóm đầu (không dùng giá trị đại diện).',
      },
      {
        hoi: 'Công thức nội suy tìm tứ phân vị Qₖ của mẫu ghép nhóm?',
        dap: 'Qₖ = u + (t − C)/f · (v − u), với t = k·n/4, [u; v) là nhóm chứa Qₖ, C là tần số tích luỹ trước nhóm đó.',
      },
      {
        hoi: 'Khoảng tứ phân vị Δ_Q là gì và đo điều gì?',
        dap: 'Δ_Q = Q₃ − Q₁, đo bề rộng của 50% số liệu ở giữa nên ít bị giá trị bất thường làm nhiễu.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan12-c3-b2',
    grade: '12',
    chapterNumber: 3,
    chapterTitle: CHUONG,
    lessonNumber: 2,
    title: 'Phương sai và độ lệch chuẩn của mẫu số liệu ghép nhóm',
    hook:
      'Hai quán ăn cùng báo thời gian chờ trung bình là 25 phút. Một quán khách nào cũng chờ đúng khoảng đó; quán ' +
      'kia khi thì 5 phút, khi thì 45 phút. Trung bình giống hệt nhau nhưng trải nghiệm khác hẳn. Cần một con số ' +
      'đo xem số liệu "bám sát" hay "văng xa" khỏi trung bình — đó chính là phương sai.',
    theory:
      'GIÁ TRỊ ĐẠI DIỆN CỦA NHÓM\n' +
      'Với nhóm [a; b), ta lấy giá trị đại diện x = (a + b)/2, tức TRUNG ĐIỂM của nhóm, rồi coi như cả f giá trị ' +
      'trong nhóm đều bằng x.\n' +
      'VÌ SAO CHỌN TRUNG ĐIỂM: ta không biết chúng nằm đâu trong nhóm, nên chọn điểm sao cho sai số lớn nhất có ' +
      'thể mắc phải là nhỏ nhất — đó là điểm chính giữa. Đây là phép XẤP XỈ có kiểm soát, nên mọi kết quả ' +
      'ở bài này đều là giá trị gần đúng, và nhóm càng hẹp thì càng sát thực tế.\n\n' +
      'SỐ TRUNG BÌNH\n' +
      'x̄ = (1/n)·Σ nᵢxᵢ, với xᵢ là giá trị đại diện nhóm thứ i, nᵢ là tần số, n = Σ nᵢ.\n' +
      'Hiểu đúng: đây là trung bình CÓ TRỌNG SỐ — nhóm đông người kéo trung bình về phía nó mạnh hơn. Lấy trung ' +
      'bình cộng suông của các xᵢ mà bỏ quên tần số là lỗi kinh điển.\n\n' +
      'PHƯƠNG SAI\n' +
      's² = (1/n)·Σ nᵢ(xᵢ − x̄)².\n' +
      'Đọc từng mảnh cho dễ nhớ: (xᵢ − x̄) là độ lệch của nhóm so với trung bình; bình phương lên để độ lệch âm và ' +
      'dương không triệt tiêu nhau (nếu không bình phương thì tổng luôn bằng 0, chẳng đo được gì); nhân với nᵢ vì ' +
      'nhóm đông thì độ lệch đó lặp lại nhiều lần; chia cho n để lấy trung bình.\n' +
      'Công thức tính nhanh thường dùng khi bấm máy: s² = (1/n)·Σ nᵢxᵢ² − x̄².\n\n' +
      'ĐỘ LỆCH CHUẨN\n' +
      's = √(s²).\n' +
      'VÌ SAO CẦN THÊM MỘT ĐẠI LƯỢNG NỮA: phương sai mang ĐƠN VỊ BÌNH PHƯƠNG (nếu số liệu tính bằng phút thì s² ' +
      'tính bằng phút bình phương — vô nghĩa khi diễn giải). Lấy căn đưa đơn vị trở về đúng đơn vị gốc, nhờ vậy s ' +
      'so sánh trực tiếp được với số trung bình và với các giá trị của mẫu.\n\n' +
      'Ý NGHĨA\n' +
      's càng nhỏ thì số liệu càng bám sát trung bình, mẫu càng đồng đều; s = 0 khi và chỉ khi mọi giá trị đại diện ' +
      'đều bằng x̄.\n' +
      'HAI LỖI HAY MẮC: (1) quên nhân tần số nᵢ trước khi cộng; (2) quên lấy căn ở bước cuối rồi gọi phương sai là ' +
      'độ lệch chuẩn — hai đại lượng khác nhau về cả giá trị lẫn đơn vị.',
    workedExample: {
      problem:
        'Thời gian chờ món (đơn vị: phút) của 10 khách tại một quán được ghép nhóm: [0; 10) có 1 khách; [10; 20) ' +
        'có 1; [20; 30) có 6; [30; 40) có 1; [40; 50) có 1. Tính số trung bình, phương sai và độ lệch chuẩn.',
      steps: [
        'Bước 1 — Lấy giá trị đại diện là trung điểm mỗi nhóm: 5; 15; 25; 35; 45.',
        'Bước 2 — Tính tổng có trọng số: 1·5 + 1·15 + 6·25 + 1·35 + 1·45 = 5 + 15 + 150 + 35 + 45 = 250. Cỡ mẫu ' +
          'n = 10 nên x̄ = 250/10 = 25 (phút).',
        'Bước 3 — Tính độ lệch của từng nhóm so với x̄ rồi bình phương: (5−25)² = 400; (15−25)² = 100; (25−25)² = 0; ' +
          '(35−25)² = 100; (45−25)² = 400.',
        'Bước 4 — Nhân với tần số rồi cộng: 1·400 + 1·100 + 6·0 + 1·100 + 1·400 = 1000.',
        'Bước 5 — Phương sai s² = 1000/10 = 100; độ lệch chuẩn s = √100 = 10 (phút).',
        'Bước 6 — Diễn giải: thời gian chờ xoay quanh 25 phút với mức dao động điển hình khoảng 10 phút. Chú ý s ' +
          'tính bằng phút còn s² tính bằng phút bình phương, nên khi nói với khách hàng phải dùng s chứ không dùng s².',
      ],
      answer: 'x̄ = 25 phút; s² = 100; s = 10 phút.',
    },
    checkQuestions: [
      {
        prompt:
          'Mẫu ghép nhóm thời gian chờ món (phút) của 10 khách: [0;10): 1; [10;20): 1; [20;30): 6; [30;40): 1; ' +
          '[40;50): 1. Tính số trung bình x̄.',
        answer: { kind: 'numeric', value: 25 },
        explain:
          'Giá trị đại diện là trung điểm các nhóm: 5; 15; 25; 35; 45. Trung bình có trọng số bằng ' +
          '(1·5 + 1·15 + 6·25 + 1·35 + 1·45)/10 = 250/10 = 25 phút. Nếu lấy trung bình cộng suông của năm giá trị ' +
          'đại diện thì cũng ra 25 nhưng chỉ là trùng hợp do bảng đối xứng — cách làm đó sai vì bỏ quên tần số.',
      },
      {
        prompt:
          'Vẫn mẫu trên (đại diện 5; 15; 25; 35; 45 với tần số 1; 1; 6; 1; 1, x̄ = 25). Tính phương sai s².',
        answer: { kind: 'numeric', value: 100 },
        explain:
          'Bình phương độ lệch từng nhóm: (5−25)² = 400; (15−25)² = 100; (25−25)² = 0; (35−25)² = 100; ' +
          '(45−25)² = 400. Nhân tần số rồi cộng: 400 + 100 + 0 + 100 + 400 = 1000. Chia cho n = 10 được s² = 100. ' +
          'Bước dễ quên nhất là nhân tần số — ở đây nhóm giữa có tới 6 khách nhưng độ lệch bằng 0 nên không đóng ' +
          'góp gì, khiến kết quả nhìn có vẻ giống như bỏ qua tần số.',
      },
      {
        prompt:
          'Vẫn mẫu trên, biết phương sai s² = 100. Tính độ lệch chuẩn s (đơn vị phút, chỉ nhập số).',
        answer: { kind: 'numeric', value: 10 },
        explain:
          'Độ lệch chuẩn là căn bậc hai của phương sai: s = √100 = 10 phút. Phải lấy căn vì phương sai mang đơn vị ' +
          'phút bình phương, không diễn giải trực tiếp được; sau khi lấy căn thì s cùng đơn vị với số liệu nên so ' +
          'sánh được ngay với trung bình 25 phút. Nhầm lẫn s với s² là lỗi mất điểm phổ biến nhất của bài này.',
      },
      {
        prompt:
          'Trong công thức phương sai của mẫu ghép nhóm, vì sao phải BÌNH PHƯƠNG độ lệch (xᵢ − x̄) thay vì cộng ' +
          'thẳng các độ lệch? Chọn đáp án đúng.',
        choices: [
          {
            id: 'A',
            label: 'Vì tổng các độ lệch có dấu luôn bằng 0, không đo được mức phân tán',
          },
          { id: 'B', label: 'Vì bình phương làm cho kết quả nhỏ lại, dễ tính hơn' },
          { id: 'C', label: 'Vì độ lệch của nhóm đông người luôn âm' },
          { id: 'D', label: 'Vì quy ước của sách, không có lí do toán học' },
        ],
        answer: { kind: 'choice', correctIds: ['A'] },
        explain:
          'Theo đúng định nghĩa của số trung bình, tổng có trọng số của các độ lệch Σ nᵢ(xᵢ − x̄) luôn bằng 0: các ' +
          'độ lệch dương và âm triệt tiêu nhau hoàn toàn. Nếu cộng thẳng thì mọi mẫu đều cho kết quả 0, không phân ' +
          'biệt được mẫu chụm với mẫu tản. Bình phương biến mọi độ lệch thành số không âm nên chúng cộng dồn thay ' +
          'vì khử nhau; cái giá phải trả là đơn vị bị bình phương, và đó chính là lí do sau đó ta lấy căn để có độ ' +
          'lệch chuẩn.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức phương sai của mẫu số liệu ghép nhóm?',
        dap: 's² = (1/n)·Σ nᵢ(xᵢ − x̄)², với xᵢ là trung điểm (giá trị đại diện) của nhóm thứ i.',
      },
      {
        hoi: 'Vì sao cần độ lệch chuẩn khi đã có phương sai?',
        dap: 'Vì s = √(s²) đưa đơn vị về đúng đơn vị gốc của số liệu, còn phương sai mang đơn vị bình phương.',
      },
      {
        hoi: 'Giá trị đại diện của nhóm [a; b) lấy bằng bao nhiêu và vì sao?',
        dap: 'Lấy trung điểm (a+b)/2, vì không biết vị trí thật của các giá trị nên chọn điểm giữa cho sai lệch nhỏ nhất.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan12-c3-b3',
    grade: '12',
    chapterNumber: 3,
    chapterTitle: CHUONG,
    lessonNumber: 3,
    title: 'So sánh độ phân tán giữa hai mẫu số liệu và vận dụng thực tế',
    hook:
      'Một xưởng may ở Nam Định cần chọn một trong hai tổ để giao đơn hàng gấp. Bảng thống kê cho thấy thời gian ' +
      'hoàn thành trung bình của hai tổ bằng nhau đúng 25 phút một sản phẩm. Quản đốc vẫn phải chọn một tổ, và ' +
      'lựa chọn đúng không nằm ở số trung bình mà nằm ở chỗ tổ nào ÍT DAO ĐỘNG hơn.',
    theory:
      'VÌ SAO SỐ TRUNG BÌNH KHÔNG ĐỦ\n' +
      'Hai mẫu có thể có cùng số trung bình mà trải nghiệm thực tế khác hẳn nhau. Số trung bình cho biết "tâm" của ' +
      'dữ liệu; các số đo phân tán cho biết dữ liệu "bám" quanh tâm đó chặt hay lỏng. Khi phải ra quyết định về ' +
      'rủi ro, độ ổn định hay chất lượng đồng đều, phần phân tán mới là phần quyết định.\n\n' +
      'QUY TẮC SO SÁNH\n' +
      'Với hai mẫu ĐO CÙNG MỘT ĐẠI LƯỢNG và có số trung bình xấp xỉ nhau:\n' +
      '— Mẫu nào có độ lệch chuẩn s NHỎ HƠN thì đồng đều hơn, ổn định hơn, dễ dự đoán hơn.\n' +
      '— Mẫu nào có s lớn hơn thì tản hơn: có cả trường hợp rất tốt lẫn rất tệ.\n' +
      'Khoảng tứ phân vị Δ_Q dùng song song để kiểm chứng, đặc biệt khi nghi ngờ có giá trị bất thường: nếu s lớn ' +
      'mà Δ_Q lại nhỏ thì rất có thể chỉ một vài giá trị cực đoan đang thổi phồng s.\n\n' +
      'ĐIỀU KIỆN ĐỂ SO SÁNH CÓ NGHĨA — PHẦN HAY BỊ BỎ QUA\n' +
      '1. Hai mẫu phải đo cùng đại lượng, cùng đơn vị. So độ lệch chuẩn của chiều cao với của cân nặng là vô nghĩa.\n' +
      '2. Số trung bình phải xấp xỉ nhau. Nếu lệch nhiều thì so s thô là sai lầm: sai số 5 phút trên nền trung bình ' +
      '10 phút nghiêm trọng hơn hẳn 5 phút trên nền 200 phút. Khi đó phải so tỉ lệ s/x̄ (hệ số biến thiên) chứ ' +
      'không so s.\n' +
      '3. Cỡ mẫu quá nhỏ thì kết luận yếu, vì một giá trị cũng đủ làm đảo kết quả.\n\n' +
      'DIỄN GIẢI ĐÚNG MỰC\n' +
      '"Đồng đều hơn" KHÔNG đồng nghĩa với "tốt hơn" trong mọi tình huống. Với dây chuyền sản xuất hay thời gian ' +
      'giao hàng, ổn định là tốt. Nhưng với điểm thi của một lớp, độ lệch chuẩn nhỏ có thể chỉ nghĩa là cả lớp đều ' +
      'thấp như nhau. Luôn đọc độ phân tán CÙNG với số trung bình, không bao giờ đọc rời.\n' +
      'LỖI HAY MẮC: kết luận "tổ A làm nhanh hơn" khi chỉ có s nhỏ hơn. s nói về sự ĐỀU ĐẶN, không nói về nhanh hay ' +
      'chậm — cái đó thuộc về số trung bình.',
    workedExample: {
      problem:
        'Tổ X có 8 công nhân, thời gian hoàn thành một sản phẩm (phút) ghép nhóm: [10; 20): 1; [20; 30): 6; ' +
        '[30; 40): 1. Tổ Y có 16 công nhân: [5; 15): 3; [15; 25): 5; [25; 35): 5; [35; 45): 3. So sánh độ đồng đều ' +
        'của hai tổ.',
      steps: [
        'Bước 1 — Tổ X, giá trị đại diện 15; 25; 35 với tần số 1; 6; 1. Trung bình: (15 + 150 + 35)/8 = 200/8 = 25 ' +
          'phút.',
        'Bước 2 — Phương sai tổ X: 1·(15−25)² + 6·(25−25)² + 1·(35−25)² = 100 + 0 + 100 = 200; chia cho 8 được ' +
          's²_X = 25, nên s_X = 5 phút.',
        'Bước 3 — Tổ Y, giá trị đại diện 10; 20; 30; 40 với tần số 3; 5; 5; 3. Trung bình: ' +
          '(30 + 100 + 150 + 120)/16 = 400/16 = 25 phút — đúng bằng tổ X.',
        'Bước 4 — Phương sai tổ Y: 3·(10−25)² + 5·(20−25)² + 5·(30−25)² + 3·(40−25)² = 675 + 125 + 125 + 675 = 1600; ' +
          'chia cho 16 được s²_Y = 100, nên s_Y = 10 phút.',
        'Bước 5 — So sánh: hai tổ cùng trung bình 25 phút nhưng s_X = 5 < s_Y = 10, nên tổ X làm đều tay hơn, thời ' +
          'gian dễ dự đoán hơn. Với một đơn hàng gấp cần giao đúng hẹn, nên chọn tổ X.',
        'Bước 6 — Lưu ý diễn giải: kết luận trên KHÔNG có nghĩa tổ X làm nhanh hơn — tốc độ trung bình hai tổ bằng ' +
          'nhau, khác biệt nằm ở mức dao động.',
      ],
      answer: 'x̄_X = x̄_Y = 25 phút; s_X = 5 phút < s_Y = 10 phút, nên tổ X đồng đều hơn.',
    },
    checkQuestions: [
      {
        prompt:
          'Tổ Y gồm 16 công nhân, thời gian hoàn thành một sản phẩm (phút) ghép nhóm: [5;15): 3; [15;25): 5; ' +
          '[25;35): 5; [35;45): 3. Tính số trung bình x̄ của tổ Y.',
        answer: { kind: 'numeric', value: 25 },
        explain:
          'Giá trị đại diện là trung điểm: 10; 20; 30; 40. Trung bình có trọng số bằng ' +
          '(3·10 + 5·20 + 5·30 + 3·40)/16 = (30 + 100 + 150 + 120)/16 = 400/16 = 25 phút. Phải nhân tần số trước ' +
          'khi cộng; lấy trung bình cộng suông của bốn giá trị đại diện chỉ đúng khi các nhóm có tần số bằng nhau.',
      },
      {
        prompt:
          'Vẫn tổ Y (đại diện 10; 20; 30; 40 với tần số 3; 5; 5; 3, x̄ = 25, n = 16). Tính phương sai s² của tổ Y.',
        answer: { kind: 'numeric', value: 100 },
        explain:
          'Bình phương độ lệch nhân tần số: 3·(10−25)² = 3·225 = 675; 5·(20−25)² = 5·25 = 125; 5·(30−25)² = 125; ' +
          '3·(40−25)² = 675. Tổng bằng 1600, chia cho n = 16 được s² = 100. Chú ý các nhóm xa trung bình đóng góp ' +
          'rất lớn do bị bình phương — đây chính là cơ chế khiến phương sai nhạy với giá trị cực đoan.',
      },
      {
        prompt:
          'Vẫn tổ Y, biết phương sai s² = 100. Tính độ lệch chuẩn s của tổ Y (đơn vị phút, chỉ nhập số).',
        answer: { kind: 'numeric', value: 10 },
        explain:
          's = √(s²) = √100 = 10 phút. Đặt cạnh trung bình 25 phút, con số này nói rằng thời gian làm một sản phẩm ' +
          'của tổ Y dao động điển hình khoảng 10 phút quanh mức 25 phút — biên độ khá rộng so với chính mức trung ' +
          'bình, nên đơn hàng cần đúng hẹn sẽ rủi ro.',
      },
      {
        prompt:
          'Tổ X có x̄ = 25 phút và s = 5 phút; tổ Y có x̄ = 25 phút và s = 10 phút. Tổ nào làm đồng đều (ổn định) ' +
          'hơn? Nhập 1 nếu là tổ X, nhập 2 nếu là tổ Y.',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'Hai tổ có cùng số trung bình nên so sánh trực tiếp độ lệch chuẩn là hợp lệ. Tổ X có s = 5 nhỏ hơn ' +
          's = 10 của tổ Y, nghĩa là thời gian làm việc của tổ X bám sát mức 25 phút hơn, ít trường hợp quá nhanh ' +
          'hoặc quá chậm. Cần nói cho đúng: tổ X ĐỀU TAY hơn chứ không phải nhanh hơn — tốc độ trung bình hai tổ ' +
          'bằng nhau.',
      },
      {
        prompt:
          'Khi hai mẫu số liệu có số trung bình chênh lệch nhiều, so sánh độ phân tán bằng cách nào là hợp lí nhất? ' +
          'Chọn đáp án đúng.',
        choices: [
          { id: 'A', label: 'So sánh trực tiếp hai độ lệch chuẩn s' },
          { id: 'B', label: 'So sánh tỉ lệ s/x̄ (hệ số biến thiên) của mỗi mẫu' },
          { id: 'C', label: 'So sánh cỡ mẫu n của hai mẫu' },
          { id: 'D', label: 'So sánh giá trị lớn nhất của hai mẫu' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Độ lệch chuẩn mang đơn vị của số liệu nên ý nghĩa của nó phụ thuộc vào nền trung bình: dao động 5 phút ' +
          'quanh mức 10 phút là rất lớn, còn 5 phút quanh mức 200 phút thì gần như không đáng kể. Khi hai nền trung ' +
          'bình khác xa nhau, phải quy về tỉ lệ s/x̄ mới so được. Cỡ mẫu và giá trị lớn nhất không phải là thước đo ' +
          'độ phân tán tương đối.',
      },
    ],
    srsCards: [
      {
        hoi: 'Hai mẫu cùng số trung bình, mẫu nào ổn định hơn?',
        dap: 'Mẫu có độ lệch chuẩn s nhỏ hơn — số liệu bám sát trung bình hơn, dễ dự đoán hơn.',
      },
      {
        hoi: 'Khi hai mẫu có số trung bình chênh lệch nhiều thì so độ phân tán thế nào?',
        dap: 'So hệ số biến thiên s/x̄ thay vì so thẳng độ lệch chuẩn.',
      },
      {
        hoi: 'Độ lệch chuẩn nhỏ có luôn nghĩa là "tốt hơn" không?',
        dap: 'Không. Nó chỉ nói mẫu đồng đều; phải đọc cùng số trung bình mới kết luận được tốt hay xấu.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
