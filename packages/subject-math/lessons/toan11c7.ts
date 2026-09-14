// lessons/toan11c7.ts — Toán 11, Chương 7: Quan hệ vuông góc trong không gian.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN11_C7_LESSONS: MathLesson[] = [
  {
    id: 'toan11-c7-b1',
    grade: '11',
    chapterNumber: 7,
    chapterTitle: 'Quan hệ vuông góc trong không gian',
    lessonNumber: 1,
    title: 'Đường thẳng vuông góc với mặt phẳng',
    hook:
      'Vì sao cột cờ giữa sân trường đứng thẳng tắp mà không cần chống đỡ, trong khi một cây gậy dựng nghiêng thì đổ ' +
      'ngay? Người thợ dựng cột chỉ kiểm tra hai hướng vuông góc là yên tâm — họ không đo hết 360 hướng. Cơ sở toán ' +
      'học cho việc "chỉ cần hai" ấy là định lí quan trọng nhất của chương này.',
    theory:
      'ĐỊNH NGHĨA\n' +
      'Đường thẳng d vuông góc với mặt phẳng (P) khi d vuông góc với MỌI đường thẳng nằm trong (P). Ký hiệu d ⊥ (P).\n' +
      'Định nghĩa này đẹp nhưng không dùng để chứng minh được — không ai kiểm tra nổi vô hạn đường thẳng. Vì thế cần ' +
      'một tiêu chuẩn thực dụng.\n\n' +
      'ĐỊNH LÍ ĐIỀU KIỆN ĐỦ (dùng nhiều nhất cả chương)\n' +
      'Nếu d vuông góc với HAI đường thẳng CẮT NHAU cùng nằm trong (P) thì d ⊥ (P).\n' +
      'HAI CHỮ "CẮT NHAU" LÀ SINH TỬ. Nếu hai đường ấy song song thì kết luận SAI hoàn toàn: một cây gậy có thể ' +
      'vuông góc với hai thanh ray song song mà vẫn nằm nghiêng, thậm chí nằm sát mặt đất. Chỉ khi hai đường cắt ' +
      'nhau, chúng mới "khoá" đủ hai chiều để xác định mặt phẳng. Đây là lý do người thợ chỉ cần kiểm hai hướng — ' +
      'nhưng phải là hai hướng KHÁC nhau, không song song.\n\n' +
      'CÁC HỆ QUẢ HAY DÙNG\n' +
      '— Nếu d ⊥ (P) thì d vuông góc với mọi đường thẳng trong (P), kể cả đường không đi qua chân đường vuông góc.\n' +
      '— Hai đường thẳng cùng vuông góc với một mặt phẳng thì song song với nhau.\n' +
      '— Hai mặt phẳng cùng vuông góc với một đường thẳng thì song song với nhau.\n\n' +
      'ĐỊNH LÍ BA ĐƯỜNG VUÔNG GÓC\n' +
      'Cho a ⊄ (P), gọi a′ là hình chiếu vuông góc của a lên (P), và b là đường thẳng nằm trong (P). Khi đó ' +
      'b ⊥ a ⇔ b ⊥ a′.\n' +
      'Công dụng: chuyển một bài toán vuông góc trong KHÔNG GIAN (khó hình dung) về bài toán vuông góc trong MẶT ' +
      'PHẲNG (dễ vẽ, dễ tính). Đây là chìa khoá của hầu hết bài tập tính khoảng cách và góc.\n\n' +
      'GÓC GIỮA ĐƯỜNG THẲNG VÀ MẶT PHẲNG\n' +
      'Là góc giữa đường thẳng đó và HÌNH CHIẾU của nó trên mặt phẳng. Góc này luôn thuộc [0°; 90°]. Nếu đường thẳng ' +
      'vuông góc với mặt phẳng thì quy ước góc bằng 90°.\n\n' +
      'CHIẾN LƯỢC LÀM BÀI: muốn chứng minh d ⊥ (P), hãy đi tìm hai đường thẳng cắt nhau trong (P) cùng vuông góc với ' +
      'd. Thường một đường lấy từ giả thiết hình chóp (cạnh bên vuông góc đáy), đường còn lại lấy từ tính chất của ' +
      'đa giác đáy (đường chéo hình vuông, đường cao tam giác cân).',
    animation: {
      title: 'Vuông góc với hai đường cắt nhau thì vuông góc với cả mặt phẳng',
      description:
        'Mặt phẳng (P) được vẽ dưới dạng hình bình hành, điểm I nằm trong mặt phẳng. Đường thẳng d dựng thẳng đứng từ I lên. Trước hết d được chứng tỏ vuông góc với đường a đi qua I, rồi vuông góc với đường b cũng đi qua I, hai đường a và b CẮT NHAU tại I chứ không song song. Từ đó một đường c thứ ba nằm trong mặt phẳng bắt đầu quay quanh I, quét qua mọi phương có thể; ở mọi vị trí, kí hiệu góc vuông giữa d và c vẫn còn nguyên. Hình động phá đúng chỗ học sinh mất điểm nhiều nhất: điều kiện d vuông góc với HAI đường CẮT NHAU là không thể bỏ bớt. Vuông góc với một đường thôi thì chưa đủ, và vuông góc với hai đường song song cũng chỉ ngang bằng vuông góc với một đường mà thôi.',
      viewBoxWidth: 320,
      viewBoxHeight: 250,
      durationMs: 7000,
      loop: true,
      shapes: [
        {
          kind: 'polyline',
          id: 'mat-phang',
          points: [
            [40, 150],
            [230, 150],
            [280, 210],
            [90, 210],
          ],
          closed: true,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'nhan-mp',
          x: 288,
          y: 208,
          text: '(P)',
          size: 13,
          fill: 'muted',
        },
        {
          kind: 'circle',
          id: 'diem-i',
          cx: 160,
          cy: 180,
          r: 5,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-i',
          x: 150,
          y: 196,
          text: 'I',
          size: 14,
          anchor: 'end',
          fill: 'neutral',
        },
        {
          kind: 'arrow',
          id: 'duong-d',
          x1: 160,
          y1: 180,
          x2: 160,
          y2: 40,
          stroke: 'primary',
          strokeWidth: 4,
        },
        {
          kind: 'label',
          id: 'nhan-d',
          x: 168,
          y: 46,
          text: 'd',
          size: 15,
          fill: 'primary',
        },
        {
          kind: 'line',
          id: 'duong-a',
          x1: 70,
          y1: 165,
          x2: 250,
          y2: 195,
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
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-a',
          x: 258,
          y: 200,
          text: 'a',
          size: 14,
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
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'rect',
          id: 'vuong-a',
          x: 148,
          y: 166,
          w: 12,
          h: 12,
          stroke: 'correct',
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
              atMs: 1300,
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
          id: 'duong-b',
          x1: 100,
          y1: 205,
          x2: 220,
          y2: 155,
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
          x: 228,
          y: 152,
          text: 'b',
          size: 14,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
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
          kind: 'rect',
          id: 'vuong-b',
          x: 162,
          y: 166,
          w: 12,
          h: 12,
          stroke: 'correct',
          strokeWidth: 2,
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
              atMs: 3000,
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
          id: 'duong-c',
          x1: 95,
          y1: 180,
          x2: 225,
          y2: 180,
          stroke: 'warn',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
              rotate: 0,
            },
            {
              atMs: 3600,
              opacity: 0,
              rotate: 0,
            },
            {
              atMs: 4000,
              opacity: 1,
              rotate: 0,
            },
            {
              atMs: 5000,
              opacity: 1,
              rotate: 55,
            },
            {
              atMs: 6000,
              opacity: 1,
              rotate: 120,
            },
            {
              atMs: 7000,
              opacity: 1,
              rotate: 180,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-c',
          x: 160,
          y: 232,
          text: 'c quay quanh I: d ⊥ c ở MỌI vị trí',
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
              atMs: 4200,
              opacity: 0,
            },
            {
              atMs: 4700,
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
          id: 'ket',
          x: 160,
          y: 248,
          text: 'd ⊥ a, d ⊥ b, a ∩ b = I  ⇒  d ⊥ (P)',
          size: 13,
          anchor: 'middle',
          fill: 'accent',
        },
      ],
      captions: [
        {
          atMs: 500,
          text: 'Đường a nằm trong (P) và đi qua I.',
        },
        {
          atMs: 1300,
          text: 'Kiểm được d ⊥ a.',
        },
        {
          atMs: 2200,
          text: 'Đường b cũng nằm trong (P), CẮT a tại I chứ không song song.',
        },
        {
          atMs: 3000,
          text: 'Kiểm tiếp d ⊥ b. Hai điều kiện đã đủ.',
        },
        {
          atMs: 4700,
          text: 'Cho c quay quanh I quét hết mọi phương trong (P): d vẫn vuông góc với c.',
        },
        {
          atMs: 6600,
          text: 'Đó chính là nghĩa của d ⊥ (P). Bỏ chữ "cắt nhau" là kết luận sai ngay.',
        },
      ],
    },
    workedExample: {
      problem:
        'Cho hình chóp S.ABCD có đáy ABCD là hình vuông và SA vuông góc với mặt phẳng đáy. Chứng minh BD vuông góc ' +
        'với mặt phẳng (SAC).',
      steps: [
        'Bước 1 — Xác định mục tiêu và công cụ: muốn chứng minh BD ⊥ (SAC), theo định lí điều kiện đủ ta cần tìm HAI ' +
          'đường thẳng CẮT NHAU nằm trong (SAC) mà BD vuông góc với cả hai. Hai ứng viên hiển nhiên là AC và SA.',
        'Bước 2 — Chứng minh BD ⊥ AC: ABCD là hình vuông nên hai đường chéo vuông góc với nhau. Đây là tính chất của ' +
          'đáy, lấy được ngay từ giả thiết.',
        'Bước 3 — Chứng minh BD ⊥ SA: theo giả thiết SA ⊥ (ABCD), mà BD là một đường thẳng NẰM TRONG mặt phẳng ' +
          '(ABCD), nên SA vuông góc với BD. Đây là áp dụng trực tiếp định nghĩa đường vuông góc mặt phẳng.',
        'Bước 4 — Kiểm điều kiện "cắt nhau", bước không được bỏ qua: AC và SA cùng nằm trong mặt phẳng (SAC) và ' +
          'chúng cắt nhau tại điểm A. Nếu hai đường này song song thì lập luận sẽ sụp đổ.',
        'Bước 5 — Kết luận: BD vuông góc với hai đường thẳng cắt nhau AC và SA thuộc (SAC), nên BD ⊥ (SAC). ' +
          'Hệ quả tiện dùng về sau: BD vuông góc với MỌI đường thẳng trong (SAC), chẳng hạn BD ⊥ SC.',
      ],
      answer: 'BD ⊥ (SAC) vì BD vuông góc với hai đường cắt nhau AC và SA nằm trong mặt phẳng đó.',
    },
    checkQuestions: [
      {
        prompt:
          'Đường thẳng d vuông góc với hai đường thẳng a và b cùng nằm trong mặt phẳng (P). Có thể kết luận ' +
          'd ⊥ (P) hay không?',
        choices: [
          { id: 'luon', label: 'Luôn kết luận được' },
          { id: 'cat_nhau', label: 'Chỉ khi a và b cắt nhau' },
          { id: 'song_song', label: 'Chỉ khi a và b song song' },
          { id: 'khong', label: 'Không bao giờ kết luận được' },
        ],
        answer: { kind: 'choice', correctIds: ['cat_nhau'] },
        explain:
          'Điều kiện "hai đường CẮT NHAU" là bắt buộc và là chỗ sai nhiều nhất. Phản ví dụ khi a song song b: hãy ' +
          'tưởng tượng hai thanh ray song song trên mặt đất; một cây gậy đặt nằm ngang vuông góc với cả hai thanh ' +
          'ray vẫn nằm sát mặt đất chứ không hề dựng đứng. Hai đường song song chỉ "khoá" được một chiều; phải cắt ' +
          'nhau mới khoá đủ hai chiều để xác định mặt phẳng.',
      },
      {
        prompt:
          'Hình chóp S.ABC có SA ⊥ (ABC). Góc giữa cạnh SA và mặt phẳng đáy (ABC) bằng bao nhiêu độ?',
        answer: { kind: 'numeric', value: 90 },
        explain:
          'Khi đường thẳng vuông góc với mặt phẳng thì theo quy ước góc giữa chúng bằng 90°. Có thể hiểu qua định ' +
          'nghĩa: hình chiếu của SA lên đáy co lại thành một ĐIỂM (điểm A), không tạo ra được đường thẳng để đo góc, ' +
          'nên ta quy ước lấy giá trị lớn nhất có thể là 90°. Lưu ý góc giữa đường thẳng và mặt phẳng luôn nằm trong ' +
          'đoạn từ 0° đến 90°, không bao giờ tù.',
      },
      {
        prompt:
          'Hai đường thẳng a và b cùng vuông góc với mặt phẳng (P). Quan hệ giữa a và b là gì?',
        choices: [
          { id: 'song_song', label: 'Song song hoặc trùng nhau' },
          { id: 'vuong_goc', label: 'Vuông góc với nhau' },
          { id: 'cheo_nhau', label: 'Chéo nhau' },
          { id: 'bat_ky', label: 'Có thể ở vị trí bất kỳ' },
        ],
        answer: { kind: 'choice', correctIds: ['song_song'] },
        explain:
          'Hai đường thẳng cùng vuông góc với một mặt phẳng thì song song (hoặc trùng nhau). Hình dung: hai cột điện ' +
          'cùng dựng thẳng đứng trên một mặt sân phẳng thì luôn song song. Nhiều bạn chọn "vuông góc với nhau" vì bị ' +
          'từ "vuông góc" trong đề dẫn dắt — nhưng cùng vuông góc với một vật thể thứ ba thì hai vật kia lại song ' +
          'song với nhau, không phải vuông góc với nhau.',
      },
    ],
    srsCards: [
      {
        hoi: 'Điều kiện đủ để d ⊥ (P)?',
        dap: 'd vuông góc với hai đường thẳng CẮT NHAU nằm trong (P); nếu hai đường song song thì kết luận sai.',
      },
      {
        hoi: 'Định lí ba đường vuông góc dùng để làm gì?',
        dap: 'Chuyển bài toán vuông góc trong không gian về bài toán vuông góc với hình chiếu trong mặt phẳng.',
      },
      {
        hoi: 'Góc giữa đường thẳng và mặt phẳng được định nghĩa thế nào?',
        dap: 'Là góc giữa đường thẳng và hình chiếu vuông góc của nó lên mặt phẳng, luôn thuộc [0°; 90°].',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
