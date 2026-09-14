// lessons/toan10c4.ts — Toán 10, Chương 4: Vectơ.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN10_C4_LESSONS: MathLesson[] = [
  {
    id: 'toan10-c4-b1',
    grade: '10',
    chapterNumber: 4,
    chapterTitle: 'Vectơ',
    lessonNumber: 1,
    title: 'Vectơ và phép cộng vectơ',
    hook:
      'Một chiếc phà sang sông Cửu Long luôn hướng mũi thẳng vuông góc với bờ, nhưng khi cập bến nó lại nằm lệch hẳn ' +
      'về phía hạ lưu. Máy phà không hỏng, người lái cũng không sai — chỉ là hai chuyển động đã CỘNG lại với nhau ' +
      'theo một quy tắc mà phép cộng số thông thường không mô tả nổi.',
    theory:
      'VECTƠ LÀ GÌ VÀ VÌ SAO CẦN NÓ\n' +
      'Có những đại lượng chỉ cần một con số là mô tả đủ (khối lượng, nhiệt độ) — gọi là đại lượng vô hướng. Nhưng ' +
      'vận tốc, lực, độ dịch chuyển thì "5" chưa đủ, còn phải biết THEO HƯỚNG NÀO. Vectơ (vector) là đoạn thẳng có ' +
      'hướng, mang đồng thời hai thông tin: độ dài (độ lớn) và hướng.\n\n' +
      'HAI VECTƠ BẰNG NHAU khi cùng hướng VÀ cùng độ dài. Điều then chốt: vị trí đặt KHÔNG quan trọng. Vectơ ở góc ' +
      'trái và vectơ ở góc phải trang giấy, nếu cùng hướng cùng độ dài, là MỘT vectơ. Nhờ tính chất này ta được phép ' +
      'tự do "dời" vectơ đi để ghép chúng lại khi tính toán.\n\n' +
      'PHÉP CỘNG — QUY TẮC BA ĐIỂM\n' +
      'AB→ + BC→ = AC→. Ý nghĩa vật lý: đi từ A tới B rồi từ B tới C thì kết quả là đi thẳng từ A tới C. Điều kiện ' +
      'áp dụng: điểm cuối của vectơ trước phải trùng điểm đầu của vectơ sau.\n\n' +
      'QUY TẮC HÌNH BÌNH HÀNH\n' +
      'Nếu ABCD là hình bình hành thì AB→ + AD→ = AC→. Dùng khi hai vectơ có CHUNG ĐIỂM ĐẦU — đúng tình huống hai lực ' +
      'cùng đặt vào một vật, hay chiếc phà chịu đồng thời lực đẩy của máy và dòng nước.\n' +
      'Hai quy tắc trên là một: quy tắc hình bình hành chỉ là quy tắc ba điểm sau khi dời một vectơ về đúng chỗ.\n\n' +
      'HIỆU HAI VECTƠ\n' +
      'a→ − b→ = a→ + (−b→), trong đó −b→ là vectơ ngược hướng và cùng độ dài với b→. Hệ quả rất hay dùng: ' +
      'MB→ − MA→ = AB→ với M bất kỳ (quy tắc trừ theo điểm chung).\n\n' +
      'ĐỘ DÀI CỦA TỔNG — CHỖ SAI LẦM KINH ĐIỂN\n' +
      '|a→ + b→| KHÔNG bằng |a→| + |b→|, trừ khi hai vectơ CÙNG HƯỚNG. Nói chung chỉ có bất đẳng thức tam giác: ' +
      '| |a→| − |b→| | ≤ |a→ + b→| ≤ |a→| + |b→|. Hai vectơ vuông góc có độ lớn 3 và 4 thì tổng có độ lớn 5 (định lí ' +
      'Pythagore), không phải 7.\n\n' +
      'TÍCH VỚI MỘT SỐ\n' +
      'k·a→ cùng hướng a→ khi k > 0, ngược hướng khi k < 0, và có độ dài |k|·|a→|. Hai vectơ khác 0→ cùng phương khi ' +
      'và chỉ khi tồn tại số k để b→ = k·a→ — đây là công cụ chuẩn để chứng minh ba điểm thẳng hàng.',
    animation: {
      title: 'Cộng vectơ theo quy tắc hình bình hành',
      description:
        'Vectơ vận tốc của phà hướng thẳng vuông góc với bờ và vectơ vận tốc dòng nước hướng xuôi dòng cùng xuất ' +
        'phát từ một điểm. Hình bình hành được dựng lên và đường chéo xuất hiện, chính là vectơ tổng: phà thực sự ' +
        'đi theo đường chéo đó nên cập bến lệch về phía hạ lưu, dù mũi phà luôn hướng vuông góc với bờ.',
      viewBoxWidth: 360,
      viewBoxHeight: 240,
      durationMs: 7000,
      loop: true,
      shapes: [
        {
          kind: 'arrow',
          id: 'vPha',
          x1: 60,
          y1: 200,
          x2: 60,
          y2: 80,
          stroke: 'primary',
          strokeWidth: 4,
        },
        {
          kind: 'arrow',
          id: 'vNuoc',
          x1: 60,
          y1: 200,
          x2: 220,
          y2: 200,
          stroke: 'accent',
          strokeWidth: 4,
        },
        {
          kind: 'line',
          id: 'canh1',
          x1: 60,
          y1: 80,
          x2: 220,
          y2: 80,
          stroke: 'muted',
          strokeWidth: 2,
          dash: '5 4',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 2000, opacity: 0 },
            { atMs: 3000, opacity: 1 },
            { atMs: 7000, opacity: 1 },
          ],
        },
        {
          kind: 'line',
          id: 'canh2',
          x1: 220,
          y1: 200,
          x2: 220,
          y2: 80,
          stroke: 'muted',
          strokeWidth: 2,
          dash: '5 4',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 2000, opacity: 0 },
            { atMs: 3000, opacity: 1 },
            { atMs: 7000, opacity: 1 },
          ],
        },
        {
          kind: 'arrow',
          id: 'vTong',
          x1: 60,
          y1: 200,
          x2: 220,
          y2: 80,
          stroke: 'correct',
          strokeWidth: 5,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3600, opacity: 0 },
            { atMs: 4600, opacity: 1 },
            { atMs: 7000, opacity: 1 },
          ],
        },
        {
          kind: 'label',
          id: 'nhanPha',
          x: 50,
          y: 140,
          text: 'v phà',
          size: 14,
          anchor: 'end',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'nhanNuoc',
          x: 140,
          y: 222,
          text: 'v dòng nước',
          size: 14,
          anchor: 'middle',
          fill: 'accent',
        },
        {
          kind: 'label',
          id: 'nhanTong',
          x: 236,
          y: 118,
          text: 'v thực tế',
          size: 14,
          anchor: 'start',
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
        { atMs: 0, text: 'Hai vectơ vận tốc cùng đặt tại vị trí của phà.' },
        { atMs: 3000, text: 'Dựng hình bình hành từ hai vectơ đó.' },
        { atMs: 4600, text: 'Đường chéo chính là vectơ tổng — hướng đi thật của phà.' },
        { atMs: 5400, text: 'Vì thế phà cập bến lệch về hạ lưu dù mũi luôn vuông góc bờ.' },
      ],
    },
    workedExample: {
      problem:
        'Một chiếc phà có vận tốc riêng 4 km/h hướng vuông góc với bờ, dòng nước chảy xuôi với vận tốc 3 km/h. ' +
        'Tính độ lớn vận tốc thực tế của phà so với bờ.',
      steps: [
        'Bước 1 — Nhận dạng: hai vận tốc cùng tác dụng lên một vật nên vận tốc thực tế là TỔNG VECTƠ của chúng, ' +
          'không phải tổng số học.',
        'Bước 2 — Chọn quy tắc: hai vectơ có chung điểm đầu (cùng đặt tại phà) nên dùng quy tắc hình bình hành. Vì ' +
          'chúng vuông góc nên hình bình hành ấy là hình chữ nhật.',
        'Bước 3 — Tính độ dài đường chéo bằng định lí Pythagore (áp dụng được nhờ góc vuông): ' +
          '|v→| = √(4² + 3²) = √25 = 5 km/h.',
        'Bước 4 — Đối chiếu bất đẳng thức tam giác để tự kiểm: kết quả phải nằm giữa |4 − 3| = 1 và 4 + 3 = 7. ' +
          'Giá trị 5 nằm trong khoảng đó nên hợp lý. Nếu ai cộng thẳng ra 7 thì tức là đã giả thiết sai rằng hai ' +
          'vectơ cùng hướng.',
      ],
      answer: 'Vận tốc thực tế của phà là 5 km/h.',
    },
    checkQuestions: [
      {
        prompt: 'Cho hai vectơ a→ và b→ vuông góc với nhau, |a→| = 6 và |b→| = 8. Tính |a→ + b→|.',
        answer: { kind: 'numeric', value: 10 },
        explain:
          'Đây chính là bẫy kinh điển: rất nhiều bạn trả lời 14 vì cộng thẳng độ dài. Độ dài của tổng vectơ chỉ bằng ' +
          'tổng độ dài khi hai vectơ CÙNG HƯỚNG. Ở đây chúng vuông góc, nên tổng là đường chéo hình chữ nhật: ' +
          '|a→ + b→| = √(6² + 8²) = 10. Bất đẳng thức tam giác cho biết kết quả luôn nằm trong [2; 14].',
      },
      {
        prompt: 'Với ba điểm M, N, P bất kỳ, đẳng thức nào sau đây luôn đúng?',
        choices: [
          { id: 'a', label: 'MN→ + NP→ = MP→' },
          { id: 'b', label: 'MN→ + NP→ = PM→' },
          { id: 'c', label: 'MN→ − NP→ = MP→' },
          { id: 'd', label: 'MN→ + MP→ = NP→' },
        ],
        answer: { kind: 'choice', correctIds: ['a'] },
        explain:
          'Quy tắc ba điểm yêu cầu điểm CUỐI của vectơ trước trùng điểm ĐẦU của vectơ sau, và kết quả là vectơ nối ' +
          'điểm đầu tiên tới điểm cuối cùng: MN→ + NP→ = MP→. Đáp án d sai vì hai vectơ có chung điểm ĐẦU M chứ không ' +
          'nối tiếp nhau — với dạng đó phải dùng quy tắc trừ: MP→ − MN→ = NP→.',
      },
      {
        prompt:
          'Cho hình bình hành ABCD. Biết |AB→| = 5 và |AD→| = 5, hỏi có thể kết luận |AC→| = 10 hay không? ' +
          'Nhập 1 nếu CÓ, nhập 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Không kết luận được. |AC→| = |AB→ + AD→| phụ thuộc vào GÓC giữa hai cạnh, mà đề chưa cho góc. Nếu góc ' +
          'BAD = 60° thì đường chéo dài 5√3 ≈ 8,66; nếu góc là 90° thì dài 5√2 ≈ 7,07. Chỉ khi hai vectơ cùng hướng ' +
          '(không tạo thành hình bình hành thật) độ dài mới cộng lại thành 10. Đây là lời nhắc: độ dài vectơ không ' +
          'cộng như số thường.',
      },
    ],
    srsCards: [
      {
        hoi: 'Hai vectơ bằng nhau khi nào?',
        dap: 'Khi cùng hướng và cùng độ dài; vị trí đặt trên mặt phẳng không quan trọng.',
      },
      {
        hoi: '|a→ + b→| có bằng |a→| + |b→| không?',
        dap: 'Chỉ khi hai vectơ cùng hướng. Nói chung | |a→|−|b→| | ≤ |a→+b→| ≤ |a→|+|b→|.',
      },
      {
        hoi: 'Điều kiện để hai vectơ khác không cùng phương?',
        dap: 'Tồn tại số k sao cho b→ = k·a→ — đây là công cụ chứng minh ba điểm thẳng hàng.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan10-c4-b2',
    grade: '10',
    chapterNumber: 4,
    chapterTitle: 'Vectơ',
    lessonNumber: 2,
    title: 'Tích vô hướng của hai vectơ',
    hook:
      'Kéo một thùng hàng đi 10 mét bằng một sợi dây chếch 60° so với mặt đất thì mệt hơn hay đỡ mệt hơn kéo bằng ' +
      'dây nằm ngang? Ai từng chuyển nhà đều cảm nhận được câu trả lời, nhưng để tính ra con số cụ thể thì cần một ' +
      'phép nhân đặc biệt: phép nhân hai vectơ cho ra một SỐ.',
    theory:
      'ĐỊNH NGHĨA\n' +
      'a→ · b→ = |a→|·|b→|·cos(a→, b→). Kết quả là một SỐ THỰC, không phải vectơ — vì thế mới gọi là tích VÔ HƯỚNG ' +
      '(scalar product).\n\n' +
      'Ý NGHĨA: VÌ SAO LẠI CÓ COSIN Ở ĐÓ\n' +
      'Tích vô hướng đo phần của vectơ này "đi theo hướng" vectơ kia. Khi kéo thùng hàng bằng dây chếch góc α, chỉ ' +
      'thành phần lực nằm ngang, tức |F|·cosα, mới thực sự làm thùng di chuyển; thành phần thẳng đứng chỉ nhấc thùng ' +
      'lên chứ không đẩy nó đi. Công sinh ra A = F→ · s→ chính là tích vô hướng. Góc càng lớn, cosα càng nhỏ, công ' +
      'càng ít — đúng với cảm nhận thực tế.\n\n' +
      'BIỂU THỨC TOẠ ĐỘ\n' +
      'Với a→ = (x₁; y₁) và b→ = (x₂; y₂) thì a→ · b→ = x₁x₂ + y₁y₂. Đây là công thức dùng nhiều nhất trong bài tập, ' +
      'vì nó biến một bài hình học thành phép tính số học thuần tuý.\n\n' +
      'BỐN HỆ QUẢ PHẢI THUỘC\n' +
      '1. a→ ⊥ b→ ⇔ a→ · b→ = 0 ⇔ x₁x₂ + y₁y₂ = 0. Đây là cách kiểm tra vuông góc nhanh nhất.\n' +
      '2. a→ · a→ = |a→|², suy ra |a→| = √(x² + y²).\n' +
      '3. cos(a→, b→) = (a→ · b→) / (|a→|·|b→|) — công thức tính góc giữa hai vectơ.\n' +
      '4. Dấu của tích vô hướng cho biết góc: dương → góc nhọn; bằng 0 → vuông; âm → góc tù.\n\n' +
      'TÍNH CHẤT VÀ GIỚI HẠN\n' +
      'Tích vô hướng có tính giao hoán và phân phối với phép cộng, nên khai triển (a→ + b→)² = a→² + 2a→·b→ + b→² ' +
      'giống hằng đẳng thức quen thuộc. NHƯNG có hai điều KHÔNG đúng: (i) không có phép chia cho vectơ, nên từ ' +
      'a→·b→ = a→·c→ KHÔNG suy ra được b→ = c→; (ii) không viết được (a→·b→)·c→ theo kiểu kết hợp, vì a→·b→ đã là ' +
      'một số rồi.',
    animation: {
      title: 'Tích vô hướng là hình chiếu, nên nó đổi dấu khi góc vượt 90°',
      description:
        'Từ gốc O vẽ vectơ u dài 8 nằm ngang sang phải. Vectơ v dài 5 xuất hiện, hợp với u một góc 60 độ; từ ngọn của v hạ đường vuông góc xuống giá của u, chân đường chiếu cách O đúng 5 nhân cos 60 độ bằng 2,5 đơn vị về phía dương. Tích vô hướng bằng 8 nhân 2,5 bằng 20, mang dấu dương. Sau đó v chuyển sang vị trí hợp với u góc 120 độ: hình chiếu lật sang phía âm, dài vẫn 2,5 nhưng ngược chiều u, nên tích vô hướng thành âm 20. Hình động cho thấy điều một câu văn khó nói: bản thân độ dài hai vectơ không đổi, chỉ VỊ TRÍ của chân hình chiếu nhảy sang bên kia gốc O, và đó chính là chỗ dấu của tích vô hướng sinh ra.',
      viewBoxWidth: 320,
      viewBoxHeight: 250,
      durationMs: 7000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'gia-u',
          x1: 0,
          y1: 200,
          x2: 300,
          y2: 200,
          stroke: 'muted',
          strokeWidth: 1,
          dash: '4 4',
        },
        {
          kind: 'circle',
          id: 'goc-o',
          cx: 60,
          cy: 200,
          r: 4,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-o',
          x: 56,
          y: 220,
          text: 'O',
          size: 13,
          anchor: 'end',
          fill: 'neutral',
        },
        {
          kind: 'arrow',
          id: 'vt-u',
          x1: 60,
          y1: 200,
          x2: 220,
          y2: 200,
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'nhan-u',
          x: 228,
          y: 205,
          text: 'u (8)',
          size: 13,
          fill: 'primary',
        },
        {
          kind: 'arrow',
          id: 'vt-v1',
          x1: 60,
          y1: 200,
          x2: 110,
          y2: 113,
          stroke: 'accent',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 500,
              opacity: 1,
            },
            {
              atMs: 3400,
              opacity: 1,
            },
            {
              atMs: 3600,
              opacity: 0,
            },
            {
              atMs: 7000,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-v1',
          x: 118,
          y: 108,
          text: 'v (5), góc 60°',
          size: 13,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 500,
              opacity: 1,
            },
            {
              atMs: 3400,
              opacity: 1,
            },
            {
              atMs: 3600,
              opacity: 0,
            },
            {
              atMs: 7000,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'line',
          id: 'chieu1',
          x1: 110,
          y1: 113,
          x2: 110,
          y2: 200,
          stroke: 'muted',
          strokeWidth: 2,
          dash: '5 4',
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
              atMs: 3400,
              opacity: 1,
            },
            {
              atMs: 3600,
              opacity: 0,
            },
            {
              atMs: 7000,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'hinh-chieu1',
          x1: 60,
          y1: 200,
          x2: 110,
          y2: 200,
          stroke: 'correct',
          strokeWidth: 5,
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
              atMs: 3400,
              opacity: 1,
            },
            {
              atMs: 3600,
              opacity: 0,
            },
            {
              atMs: 7000,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'kq1',
          x: 160,
          y: 55,
          text: 'u·v = 8 · (+2,5) = +20',
          size: 15,
          fill: 'primary',
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
              opacity: 1,
            },
            {
              atMs: 3400,
              opacity: 1,
            },
            {
              atMs: 3600,
              opacity: 0,
            },
            {
              atMs: 7000,
              opacity: 0,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'vt-v2',
          x1: 60,
          y1: 200,
          x2: 10,
          y2: 113,
          stroke: 'accent',
          strokeWidth: 3,
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
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-v2',
          x: 18,
          y: 102,
          text: "v' (5), góc 120°",
          size: 13,
          fill: 'accent',
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
          kind: 'line',
          id: 'chieu2',
          x1: 10,
          y1: 113,
          x2: 10,
          y2: 200,
          stroke: 'muted',
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
          kind: 'arrow',
          id: 'hinh-chieu2',
          x1: 60,
          y1: 200,
          x2: 10,
          y2: 200,
          stroke: 'danger',
          strokeWidth: 5,
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
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'kq2',
          x: 160,
          y: 55,
          text: "u·v' = 8 · (−2,5) = −20",
          size: 15,
          fill: 'accent',
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
              atMs: 6200,
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
          x: 160,
          y: 238,
          text: 'u·v = |u|·|v|·cos(u, v)',
          size: 14,
          anchor: 'middle',
          fill: 'primary',
        },
      ],
      captions: [
        {
          atMs: 500,
          text: 'u dài 8; v dài 5 hợp với u góc 60°.',
        },
        {
          atMs: 1600,
          text: 'Chiếu ngọn v xuống giá của u: chân chiếu cách O 5·cos60° = 2,5 về phía dương.',
        },
        {
          atMs: 2800,
          text: 'u·v = 8 · 2,5 = +20.',
        },
        {
          atMs: 4200,
          text: 'Giữ nguyên độ dài, mở góc lên 120°.',
        },
        {
          atMs: 5600,
          text: 'Chân chiếu nhảy sang bên trái O: hình chiếu mang dấu âm.',
        },
        {
          atMs: 6200,
          text: 'u·v′ = 8 · (−2,5) = −20. Dấu của tích vô hướng là dấu của cosin góc.',
        },
      ],
    },
    workedExample: {
      problem:
        'Trong mặt phẳng toạ độ cho A(1; 2), B(4; 3), C(2; 5). Chứng minh tam giác ABC vuông tại A và tính diện tích.',
      steps: [
        'Bước 1 — Chuyển giả thiết hình học thành vectơ toạ độ: AB→ = (4−1; 3−2) = (3; 1) và AC→ = (2−1; 5−2) = (1; 3). ' +
          'Chọn hai vectơ cùng xuất phát từ A vì ta cần xét góc TẠI A.',
        'Bước 2 — Kiểm tra vuông góc bằng tích vô hướng (nhanh hơn nhiều so với tính ba cạnh rồi dùng Pythagore đảo): ' +
          'AB→ · AC→ = 3·1 + 1·3 = 6. Kết quả khác 0 nên góc A KHÔNG vuông — giả thiết của đề chưa đúng với dữ liệu.',
        'Bước 3 — Kết luận trung thực và tính góc thật: |AB→| = √10, |AC→| = √10, nên ' +
          'cosA = 6/(√10·√10) = 0,6, suy ra góc A ≈ 53,13°. Tam giác cân tại A chứ không vuông tại A.',
        'Bước 4 — Tính diện tích bằng công thức S = (1/2)·|AB→|·|AC→|·sinA. Từ cosA = 0,6 suy ra sinA = 0,8, nên ' +
          'S = 0,5 · √10 · √10 · 0,8 = 4.',
        'Bước 5 — Bài học rút ra: luôn KIỂM CHỨNG giả thiết bằng tính toán thay vì tin ngay vào lời đề; tích vô ' +
          'hướng bằng 6 ≠ 0 là bằng chứng dứt khoát.',
      ],
      answer: 'Tam giác không vuông tại A (góc A ≈ 53,13°); diện tích bằng 4.',
    },
    checkQuestions: [
      {
        prompt: 'Cho a→ = (2; −3) và b→ = (4; 1). Tính a→ · b→.',
        answer: { kind: 'numeric', value: 5 },
        explain:
          'a→ · b→ = 2·4 + (−3)·1 = 8 − 3 = 5. Lỗi rất hay gặp là nhân "chéo" thành 2·1 + (−3)·4 = −10, hoặc quên dấu ' +
          'âm ra 11. Công thức là nhân hoành với hoành, tung với tung rồi CỘNG lại.',
      },
      {
        prompt: 'Tìm số m để hai vectơ u→ = (3; m) và v→ = (m; −12) vuông góc với nhau.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'Điều kiện vuông góc: u→ · v→ = 0, tức 3m + m·(−12) = 0 ⇔ 3m − 12m = 0 ⇔ −9m = 0 ⇔ m = 0. Vậy chỉ có một ' +
          'nghiệm duy nhất m = 0. Bẫy ở đây là thói quen "phương trình bậc nhất với tham số thì chắc phải có nghiệm ' +
          'đẹp khác không"; hãy rút gọn cẩn thận trước khi kết luận. Với m = 0 ta có u→ = (3;0), v→ = (0;−12), rõ ' +
          'ràng vuông góc.',
      },
      {
        prompt: 'Biết a→ · b→ < 0. Góc giữa hai vectơ a→ và b→ là góc gì?',
        choices: [
          { id: 'nhon', label: 'Góc nhọn' },
          { id: 'vuong', label: 'Góc vuông' },
          { id: 'tu', label: 'Góc tù' },
          { id: 'khong_xd', label: 'Không xác định được' },
        ],
        answer: { kind: 'choice', correctIds: ['tu'] },
        explain:
          'Vì |a→| và |b→| luôn dương, dấu của tích vô hướng chính là dấu của cosin góc giữa hai vectơ. Cosin âm ứng ' +
          'với góc thuộc khoảng (90°; 180°), tức góc tù. Nhiều bạn chọn "không xác định được" vì nghĩ cần biết độ dài ' +
          'cụ thể — không cần, độ dài chỉ ảnh hưởng độ lớn chứ không ảnh hưởng DẤU.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức toạ độ của tích vô hướng?',
        dap: 'a→ · b→ = x₁x₂ + y₁y₂ — nhân hoành với hoành, tung với tung rồi cộng.',
      },
      {
        hoi: 'Điều kiện để hai vectơ vuông góc?',
        dap: 'Tích vô hướng bằng 0: x₁x₂ + y₁y₂ = 0.',
      },
      {
        hoi: 'Dấu của a→ · b→ cho biết điều gì?',
        dap: 'Dương → góc nhọn; bằng 0 → góc vuông; âm → góc tù.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
