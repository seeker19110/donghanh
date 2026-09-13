// lessons/ly11c2.ts — Vật lí 11, Chương 2: Sóng (8 bài).
import type { PhysicsLesson } from '../lessonTypes.js'

export const LY11_C2_LESSONS: PhysicsLesson[] = [
  {
    id: 'ly11-c2-b8',
    // Chấm đỏ đứng yên một chỗ chỉ nhấp nhô lên xuống trong khi hình dạng sóng chạy sang phải:
    // đây là chỗ hiểu sai nhiều nhất của cả chương sóng.
    animation: {
      title: 'Sóng chạy đi, phần tử môi trường chỉ nhấp nhô tại chỗ',
      description:
        'Đường cong hình sin là mặt nước (hoặc sợi dây) tại một thời điểm, và nó trườn đều sang phải với tốc độ truyền sóng v. Chấm tròn đậm là MỘT phần tử nước cố định, được đánh dấu bằng một vạch thẳng đứng để dễ theo dõi: nó chỉ đi lên rồi đi xuống quanh vị trí cân bằng của mình, không hề trôi sang phải theo sóng. Cái chạy đi là HÌNH DẠNG dao động và NĂNG LƯỢNG, còn vật chất thì đứng tại chỗ — giống hệt chiếc lá trên mặt hồ chỉ nhấp nhô khi sóng đi qua chứ không bị đẩy vào bờ. Mỗi lần sóng trườn đi được đúng một bước sóng λ thì phần tử đó thực hiện trọn một dao động, mất đúng một chu kì T; từ đó suy ra v = λ/T = λ·f.',
      viewBoxWidth: 420,
      viewBoxHeight: 240,
      durationMs: 2000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'muc-can-bang',
          x1: 0,
          y1: 120,
          x2: 420,
          y2: 120,
          stroke: 'muted',
          strokeWidth: 1,
          dash: '4 4',
        },
        {
          kind: 'polyline',
          id: 'mat-song',
          points: [
            [-180, 120],
            [-160, 87.9],
            [-140, 70.8],
            [-120, 76.7],
            [-100, 102.9],
            [-80, 137.1],
            [-60, 163.3],
            [-40, 169.2],
            [-20, 152.1],
            [0, 120],
            [20, 87.9],
            [40, 70.8],
            [60, 76.7],
            [80, 102.9],
            [100, 137.1],
            [120, 163.3],
            [140, 169.2],
            [160, 152.1],
            [180, 120],
            [200, 87.9],
            [220, 70.8],
            [240, 76.7],
            [260, 102.9],
            [280, 137.1],
            [300, 163.3],
            [320, 169.2],
            [340, 152.1],
            [360, 120],
            [380, 87.9],
            [400, 70.8],
          ],
          stroke: 'primary',
          strokeWidth: 3,
          keyframes: [
            { atMs: 0, dx: 0 },
            { atMs: 2000, dx: 180 },
          ],
        },
        {
          kind: 'line',
          id: 'vach-danh-dau',
          x1: 90,
          y1: 60,
          x2: 90,
          y2: 180,
          stroke: 'muted',
          strokeWidth: 1,
          dash: '3 3',
        },
        {
          kind: 'circle',
          id: 'phan-tu-nuoc',
          cx: 90,
          cy: 70,
          r: 8,
          fill: 'accent',
          keyframes: [
            { atMs: 0, dy: 50 },
            { atMs: 250, dy: 14.6 },
            { atMs: 500, dy: 0 },
            { atMs: 750, dy: 14.6 },
            { atMs: 1000, dy: 50 },
            { atMs: 1250, dy: 85.4 },
            { atMs: 1500, dy: 100 },
            { atMs: 1750, dy: 85.4 },
            { atMs: 2000, dy: 50 },
          ],
        },
        {
          kind: 'arrow',
          id: 'chieu-truyen',
          x1: 280,
          y1: 40,
          x2: 360,
          y2: 40,
          stroke: 'neutral',
          strokeWidth: 3,
        },
        {
          kind: 'arrow',
          id: 'chieu-dao-dong',
          x1: 122,
          y1: 100,
          x2: 122,
          y2: 60,
          stroke: 'accent',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'nhan-v',
          x: 274,
          y: 36,
          text: 'sóng truyền đi: v',
          size: 12,
          anchor: 'end',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-phan-tu',
          x: 132,
          y: 56,
          text: 'phần tử nước chỉ lên xuống',
          size: 12,
          anchor: 'start',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'nhan-lambda',
          x: 210,
          y: 214,
          text: 'bước sóng λ = quãng đường sóng đi trong 1 chu kì',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
      ],
      captions: [
        { atMs: 0, text: 'Phần tử được đánh dấu đang ở đỉnh sóng.' },
        {
          atMs: 1000,
          text: 'Sóng trườn sang phải nửa bước sóng; phần tử đã xuống tới đáy rồi lên lại.',
        },
        { atMs: 2000, text: 'Sóng đi được đúng λ, phần tử vừa xong một chu kì T. Suy ra v = λ/T.' },
      ],
    },
    grade: '11',
    chapterNumber: 2,
    chapterTitle: 'Sóng',
    lessonNumber: 8,
    title: 'Mô tả sóng',
    hook:
      'Ném một hòn sỏi xuống hồ nước yên tĩnh, những gợn sóng tròn đồng tâm lan rộng ra xa. ' +
      'Nhưng kì lạ thay, một chiếc lá rụng trôi nổi trên mặt hồ chỉ nhấp nhô lên xuống tại chỗ chứ không bị đẩy trôi ra xa cùng sóng. ' +
      'Bản chất sóng là gì?',
    theory:
      'ĐỊNH NGHĨA SÓNG CƠ (MECHANICAL WAVE):\\n' +
      '— Sóng cơ là sự lan truyền dao động cơ (biến dạng đàn hồi) trong một môi trường vật chất theo thời gian.\\n' +
      '— Lưu ý quan trọng: Khi sóng truyền đi, các phần tử môi trường chỉ dao động xung quanh vị trí cân bằng của chúng, ' +
      'chứ không chuyển động tịnh tiến theo sóng. Chỉ có pha dao động và năng lượng sóng được truyền đi.\\n\\n' +
      'CÁC ĐẠI LƯỢNG ĐẶC TRƯNG CỦA SÓNG:\\n' +
      '1. Chu kì (T), Tần số (f): Là chu kì và tần số dao động của các phần tử môi trường có sóng truyền qua (bằng đúng chu kì/tần số của nguồn phát sóng).\\n' +
      '2. Tốc độ truyền sóng (v): Tốc độ lan truyền pha dao động (khác với tốc độ dao động của các phần tử môi trường). ' +
      'Tốc độ này chỉ phụ thuộc vào bản chất môi trường (tính đàn hồi, nhiệt độ, khối lượng riêng).\\n' +
      '3. Bước sóng (λ): Quãng đường sóng truyền đi được trong một chu kì: λ = v.T = v / f.\\n' +
      '  — Định nghĩa khác: Bước sóng là khoảng cách ngắn nhất giữa hai phần tử trên cùng một phương truyền sóng dao động cùng pha với nhau.',
    workedExample: {
      problem:
        'Một sóng âm truyền trong không khí với tần số f = 1000 Hz. Biết tốc độ truyền âm trong không khí là v = 340 m/s. ' +
        'Tính bước sóng λ của sóng âm này.',
      steps: [
        'Xác định các đại lượng đã biết: tần số f = 1000 Hz, tốc độ v = 340 m/s.',
        'Áp dụng công thức liên hệ bước sóng: λ = v / f.',
        'Thay số: λ = 340 / 1000 = 0,34 m = 34 cm.',
        'Kết luận: Bước sóng của sóng âm trong không khí là 0,34 m.',
      ],
      answer: 'λ = 0,34 m.',
    },
    checkQuestions: [
      {
        prompt: 'Viết công thức tính bước sóng λ theo tốc độ truyền sóng v và tần số f.',
        choices: [
          { id: 'w_1', label: 'λ = v / f' },
          { id: 'w_2', label: 'λ = v * f' },
          { id: 'w_3', label: 'λ = f / v' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['w_1'],
        },
        explain: 'Bước sóng là quãng đường sóng truyền đi trong một chu kì: λ = v.T = v/f.',
      },
      {
        prompt:
          'Một sóng cơ truyền trên mặt nước với tốc độ v = 2 m/s, tần số f = 50 Hz. Tính bước sóng λ của sóng nước này.',
        answer: {
          kind: 'numeric',
          value: 0.04,
          unit: 'm',
        },
        explain: 'λ = v / f = 2 / 50 = 0,04 m = 4 cm.',
      },
      {
        // Câu bẫy: tưởng phần tử môi trường bị sóng cuốn đi theo phương truyền sóng.
        prompt:
          'Một chiếc lá nổi trên mặt hồ. Sóng nước truyền từ giữa hồ vào bờ đi qua chỗ chiếc lá. Chiếc lá sẽ chuyển động thế nào?',
        choices: [
          { id: 'vao_bo', label: 'Bị sóng cuốn dần vào bờ với đúng tốc độ truyền sóng' },
          { id: 'tai_cho', label: 'Chỉ nhấp nhô lên xuống tại chỗ quanh vị trí cũ của nó' },
          { id: 'ra_giua', label: 'Bị đẩy ngược ra giữa hồ vì sóng phản xạ' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['tai_cho'],
        },
        explain:
          'Sóng cơ truyền đi DAO ĐỘNG và NĂNG LƯỢNG chứ không mang theo vật chất. Mỗi phần tử nước chỉ dao động quanh vị trí cân bằng của chính nó rồi kéo phần tử bên cạnh dao động theo, nên cái "chạy" vào bờ là hình dạng gợn sóng, không phải khối nước. ' +
          'Vì thế chiếc lá chỉ nhô lên hụp xuống tại chỗ. Nếu nước thật sự bị cuốn đi với tốc độ truyền sóng thì mặt hồ đã cạn về một phía từ lâu. ' +
          'Hãy tách bạch hai tốc độ rất khác nhau: tốc độ truyền sóng v = λ·f (của hình dạng sóng, không đổi trong một môi trường) và tốc độ dao động của phần tử (biến thiên, cực đại khi qua vị trí cân bằng, bằng 0 ở hai biên).',
      },
    ],
    srsCards: [
      {
        hoi: 'Khi sóng cơ truyền qua, các phần tử vật chất của môi trường có di chuyển đi theo sóng không?',
        dap: 'Không, chúng chỉ dao động tại chỗ quanh vị trí cân bằng riêng của mình.',
      },
      {
        hoi: 'Tốc độ truyền sóng phụ thuộc vào yếu tố nào?',
        dap: 'Phụ thuộc hoàn toàn vào tính chất vật lí của môi trường truyền sóng (như nhiệt độ, mật độ, tính đàn hồi).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly11-c2-b9',
    grade: '11',
    chapterNumber: 2,
    chapterTitle: 'Sóng',
    lessonNumber: 9,
    title: 'Sóng ngang. Sóng dọc. Sự truyền năng lượng của sóng cơ',
    hook:
      'Khi xảy ra động đất, lòng đất truyền đi hai loại sóng: Sóng P nén dọc lớp đá như lò xo co giãn, ' +
      'và sóng S rung lắc ngang mặt đất. Đó chính là sóng dọc và sóng ngang.',
    theory:
      'SÓNG NGANG (TRANSVERSE WAVE):\\n' +
      '— Là sóng trong đó các phần tử môi trường dao động theo phương vuông góc với phương truyền sóng.\\n' +
      '— Môi trường truyền: Sóng ngang chỉ truyền được trong chất rắn và trên bề mặt chất lỏng (không truyền được trong chất khí và lòng chất lỏng).\\n\\n' +
      'SÓNG DỌC (LONGITUDINAL WAVE):\\n' +
      '— Là sóng trong đó các phần tử môi trường dao động theo phương trùng với phương truyền sóng.\\n' +
      '— Môi trường truyền: Sóng dọc truyền được trong cả chất rắn, chất lỏng và chất khí.\\n\\n' +
      'SỰ TRUYỀN NĂNG LƯỢNG CỦA SÓNG CƠ:\\n' +
      '— Nguồn sóng dao động thực hiện công cung cấp năng lượng cho các phần tử lân cận dao động tuần hoàn, năng lượng này lan toả ra khắp không gian.\\n' +
      '— Càng ra xa nguồn, mật độ năng lượng sóng càng giảm do sóng trải rộng trên diện tích lớn dần và một phần bị môi trường hấp thụ chuyển hoá thành nhiệt năng.',
    workedExample: {
      problem:
        'Một sợi dây cao su dài căng ngang. Người ta kích thích một đầu dây dao động thẳng đứng theo phương vuông góc với dây. ' +
        'Sóng truyền trên dây là sóng ngang hay sóng dọc? Tại sao?',
      steps: [
        'Xác định phương truyền sóng: dọc theo sợi dây (nằm ngang).',
        'Xác định phương dao động của phần tử dây: thẳng đứng (do đầu dây được kích thích dao động thẳng đứng).',
        'So sánh: Phương dao động (thẳng đứng) vuông góc với phương truyền sóng (nằm ngang).',
        'Kết luận: Sóng truyền trên dây là sóng ngang.',
      ],
      answer: 'Sóng ngang (do phương dao động vuông góc với phương truyền sóng).',
    },
    checkQuestions: [
      {
        prompt: 'Sóng cơ học lan truyền trong chất khí luôn luôn là loại sóng nào?',
        choices: [
          { id: 'ty_1', label: 'Sóng dọc' },
          { id: 'ty_2', label: 'Sóng ngang' },
          { id: 'ty_3', label: 'Cả sóng dọc và sóng ngang' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['ty_1'],
        },
        explain:
          'Trong chất khí (và lòng chất lỏng), lực đàn hồi chống biến dạng lệch không có, chỉ có biến dạng nén dãn nên chỉ truyền được sóng dọc.',
      },
      {
        prompt:
          'Sóng ngang là sóng có phương dao động của các phần tử môi trường như thế nào so với phương truyền sóng?',
        choices: [
          { id: 'dir_1', label: 'Vuông góc' },
          { id: 'dir_2', label: 'Trùng nhau' },
          { id: 'dir_3', label: 'Song song' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['dir_1'],
        },
        explain: 'Sóng ngang có phương dao động vuông góc với phương truyền sóng.',
      },
    ],
    srsCards: [
      {
        hoi: 'Sóng dọc có thể truyền qua những trạng thái môi trường nào?',
        dap: 'Truyền được qua cả 3 trạng thái: Rắn, Lỏng và Khí.',
      },
      {
        hoi: 'Sóng ngang có thể truyền qua lòng chất lỏng hay chất khí không?',
        dap: 'Không, sóng ngang chỉ truyền được trong chất rắn và trên bề mặt chất lỏng.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly11-c2-b10',
    grade: '11',
    chapterNumber: 2,
    chapterTitle: 'Sóng',
    lessonNumber: 10,
    title: 'Thực hành: Đo tần số của sóng âm',
    hook:
      'Làm thế nào để xác định nốt nhạc của một chiếc đàn guitar có đúng tần số chuẩn hay không? ' +
      'Trong phòng thí nghiệm, ta sử dụng micrô và dao động kí điện tử để "chụp ảnh" sóng âm và đo đạc tần số.',
    theory:
      'NGUYÊN LÝ ĐO TẦN SỐ SÓNG ÂM:\\n' +
      '— Sóng âm từ nguồn phát (ví dụ âm thoa) được thu bằng một micrô. Micrô chuyển dao động áp suất âm thanh thành dao động điện thế cùng tần số.\\n' +
      '— Điện tín hiệu này được đưa vào cổng vào (Y) của dao động kí điện tử.\\n\\n' +
      'CÁCH ĐỌC DAO ĐỘNG KÝ:\\n' +
      '— Màn hình hiển thị đường cong dạng sin biểu diễn li độ điện áp theo thời gian.\\n' +
      '— Ta đếm số ô chia dọc theo trục thời gian (trục nằm ngang) cho một chu kì dao động toàn phần (N ô).\\n' +
      '— Nhân số ô N này với hệ số quét thời gian (Time/Div) đã thiết lập trên máy để có chu kì T (giây): T = N * (Time/Div).\\n' +
      '— Tần số f được xác định bằng công thức: f = 1 / T.',
    workedExample: {
      problem:
        'Khi đo tần số sóng âm phát ra từ một nguồn âm, đường đồ thị dao động trên màn hình dao động kí có 1 chu kì ứng với 4 ô ngang. ' +
        'Biết núm xoay hệ số quét thời gian chỉ vào vạch 0,5 ms/ô. Tính chu kì và tần số của sóng âm đó.',
      steps: [
        'Xác định số ô ứng với một chu kì: N = 4 ô.',
        'Hệ số quét thời gian: Time/Div = 0,5 ms/ô = 0,0005 s/ô.',
        'Tính chu kì T: T = 4 * 0,5 ms = 2 ms = 0,002 s.',
        'Tính tần số f: f = 1 / T = 1 / 0,002 = 500 Hz.',
      ],
      answer: 'T = 0,002 s; f = 500 Hz.',
    },
    checkQuestions: [
      {
        prompt:
          'Thiết bị nào trong phòng thí nghiệm dùng để hiển thị đồ thị dao động điện áp theo thời gian nhằm đo chu kì sóng?',
        choices: [
          { id: 'eq_1', label: 'Dao động kí điện tử' },
          { id: 'eq_2', label: 'Nguồn điện xoay chiều' },
          { id: 'eq_3', label: 'Lực kế cảm biến' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['eq_1'],
        },
        explain:
          'Dao động kí điện tử hiển thị dạng sóng điện áp theo thời gian giúp đo trực tiếp chu kì dao động.',
      },
      {
        prompt:
          'Nếu một sóng âm hiển thị trên màn hình dao động kí có chu kì đo được là 0,0025 s, hãy tính tần số của sóng âm này.',
        answer: {
          kind: 'numeric',
          value: 400,
          unit: 'Hz',
        },
        explain: 'f = 1 / T = 1 / 0,0025 = 400 Hz.',
      },
    ],
    srsCards: [
      {
        hoi: 'Vai trò của micrô trong thí nghiệm đo tần số sóng âm là gì?',
        dap: 'Chuyển đổi dao động cơ học của sóng âm thành tín hiệu điện dao động có cùng tần số.',
      },
      {
        hoi: 'Nếu hệ số quét Time/Div trên dao động kí là 2 ms/ô, và một chu kì chiếm 5 ô, chu kì sóng bằng bao nhiêu?',
        dap: 'T = 5 * 2 ms = 10 ms = 0,01 s.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly11-c2-b11',
    grade: '11',
    chapterNumber: 2,
    chapterTitle: 'Sóng',
    lessonNumber: 11,
    title: 'Sóng điện từ',
    hook:
      'Sóng Wi-Fi trong phòng khách, ánh sáng từ Mặt Trời sưởi ấm Trái Đất và tia X chụp xương trong bệnh viện đều cùng một bản chất vật lí. ' +
      'Chúng có thể truyền qua khoảng chân không vũ trụ bao la với tốc độ ánh sáng.',
    theory:
      'ĐỊNH NGHĨA SÓNG ĐIỆN TỪ (ELECTROMAGNETIC WAVE):\\n' +
      '— Sóng điện từ là điện từ trường lan truyền trong không gian dưới dạng sóng.\\n\\n' +
      'ĐẶC ĐIỂM CỦA SÓNG ĐIỆN TỪ:\\n' +
      '— Truyền được trong chân không (khác biệt cơ bản với sóng cơ cần môi trường vật chất vật lí). ' +
      'Tốc độ truyền sóng điện từ trong chân không lớn nhất, bằng tốc độ ánh sáng c ≈ 3 * 10⁸ m/s.\\n' +
      '— Sóng điện từ là sóng ngang: Vectơ cường độ điện trường E và vectơ cảm ứng từ B luôn vuông góc với nhau và vuông góc với phương truyền sóng v. ' +
      'Ba vectơ E, B, v tạo thành một tam diện thuận.\\n' +
      '— Điện trường E và từ trường B biến thiên cùng tần số và luôn cùng pha với nhau.\\n\\n' +
      'THANG SÓNG ĐIỆN TỪ (phân theo bước sóng giảm dần):\\n' +
      '— Sóng vô tuyến (Radio) -> Tia hồng ngoại -> Ánh sáng nhìn thấy (Đỏ đến Tím) -> Tia tử ngoại (UV) -> Tia X -> Tia Gamma (γ).',
    workedExample: {
      problem:
        'Một sóng vô tuyến phát ra từ một đài phát thanh có tần số f = 100 MHz (10⁸ Hz) truyền trong chân không. ' +
        'Tính bước sóng λ của sóng vô tuyến này.',
      steps: [
        'Xác định tốc độ sóng trong chân không c = 3 * 10⁸ m/s.',
        'Xác định tần số sóng f = 100 MHz = 10⁸ Hz.',
        'Áp dụng công thức liên hệ bước sóng: λ = c / f.',
        'Thay số: λ = 3 * 10⁸ / 10⁸ = 3 m.',
        'Kết luận: Bước sóng của sóng vô tuyến này là 3 m.',
      ],
      answer: 'λ = 3 m.',
    },
    checkQuestions: [
      {
        prompt:
          'Sóng điện từ là loại sóng nào dựa trên mối quan hệ giữa phương dao động của trường với phương truyền sóng?',
        choices: [
          { id: 'ew_1', label: 'Sóng ngang' },
          { id: 'ew_2', label: 'Sóng dọc' },
          { id: 'ew_3', label: 'Không thuộc hai loại trên' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['ew_1'],
        },
        explain:
          'Sóng điện từ là sóng ngang vì cả vectơ điện trường E và từ trường B đều dao động vuông góc với phương truyền sóng v.',
      },
      {
        prompt:
          'Trong chân không, một sóng ánh sáng có tần số 5 * 10¹⁴ Hz. Tính bước sóng của sóng ánh sáng này (lấy tốc độ ánh sáng c = 3 * 10⁸ m/s).',
        answer: {
          kind: 'numeric',
          value: 6e-7,
          unit: 'm',
        },
        explain:
          'λ = c / f = 3 * 10⁸ / (5 * 10¹⁴) = 0,6 * 10⁻⁶ m = 6 * 10⁻⁷ m (600 nm, ánh sáng màu cam).',
      },
    ],
    srsCards: [
      {
        hoi: 'Vectơ điện trường E và vectơ từ trường B dao động như thế nào về mặt pha trong sóng điện từ?',
        dap: 'Chúng biến thiên cùng tần số và luôn luôn cùng pha với nhau.',
      },
      {
        hoi: 'Sắp xếp sóng vô tuyến, tia hồng ngoại, tia X và tia tử ngoại theo thứ tự tần số tăng dần.',
        dap: 'Sóng vô tuyến -> Tia hồng ngoại -> Tia tử ngoại -> Tia X (tần số tăng tương ứng bước sóng giảm).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly11-c2-b12',
    // Vẽ đúng bức tranh học sinh nhìn thấy trong khay nước: các gợn tròn từ hai nguồn chồng lên
    // nhau, sinh ra những đường đứng yên (cực tiểu) xen kẽ những đường dao động mạnh (cực đại).
    animation: {
      title: 'Hai nguồn kết hợp và những đường cực đại, cực tiểu',
      description:
        'Hai mũi nhọn S₁ và S₂ chạm mặt nước cùng lúc, cùng tần số và cùng pha. Từ mỗi nguồn, các gợn tròn lan ra đều đặn, cứ hai gợn liên tiếp cách nhau một bước sóng λ. Ở những điểm mà hiệu đường đi tới hai nguồn bằng một số nguyên lần bước sóng (d₂ − d₁ = kλ), hai sóng luôn tới cùng pha nên chồng lên nhau và nước dao động rất mạnh: đó là các đường CỰC ĐẠI, trong hình là đường thẳng giữa (k = 0) và hai nhánh cong hai bên (k = ±1). Ở những điểm có d₂ − d₁ = (k + ½)λ, hai sóng luôn ngược pha nên triệt tiêu nhau và mặt nước gần như đứng yên: đó là các đường CỰC TIỂU, vẽ bằng nét đứt. Hình ảnh này cố định theo thời gian, chỉ có các gợn chạy qua nó — vì thế ta nhìn thấy được vân giao thoa bằng mắt thường.',
      viewBoxWidth: 420,
      viewBoxHeight: 260,
      durationMs: 3000,
      loop: true,
      shapes: [
        { kind: 'circle', id: 'nguon-1', cx: 140, cy: 130, r: 6, fill: 'neutral' },
        { kind: 'circle', id: 'nguon-2', cx: 280, cy: 130, r: 6, fill: 'neutral' },
        {
          kind: 'circle',
          id: 'gon-1a',
          cx: 140,
          cy: 130,
          r: 10,
          stroke: 'primary',
          strokeWidth: 2,
          keyframes: [
            { atMs: 0, scale: 0.2, opacity: 0.9 },
            { atMs: 3000, scale: 12, opacity: 0.1 },
          ],
        },
        {
          kind: 'circle',
          id: 'gon-1b',
          cx: 140,
          cy: 130,
          r: 10,
          stroke: 'primary',
          strokeWidth: 2,
          keyframes: [
            { atMs: 0, scale: 4.2, opacity: 0.6 },
            { atMs: 2000, scale: 12, opacity: 0.1 },
            { atMs: 2001, scale: 0.2, opacity: 0.9 },
            { atMs: 3000, scale: 4.2, opacity: 0.6 },
          ],
        },
        {
          kind: 'circle',
          id: 'gon-2a',
          cx: 280,
          cy: 130,
          r: 10,
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            { atMs: 0, scale: 0.2, opacity: 0.9 },
            { atMs: 3000, scale: 12, opacity: 0.1 },
          ],
        },
        {
          kind: 'circle',
          id: 'gon-2b',
          cx: 280,
          cy: 130,
          r: 10,
          stroke: 'accent',
          strokeWidth: 2,
          keyframes: [
            { atMs: 0, scale: 4.2, opacity: 0.6 },
            { atMs: 2000, scale: 12, opacity: 0.1 },
            { atMs: 2001, scale: 0.2, opacity: 0.9 },
            { atMs: 3000, scale: 4.2, opacity: 0.6 },
          ],
        },
        {
          kind: 'line',
          id: 'cuc-dai-0',
          x1: 210,
          y1: 16,
          x2: 210,
          y2: 244,
          stroke: 'correct',
          strokeWidth: 3,
        },
        {
          kind: 'polyline',
          id: 'cuc-dai-phai',
          points: [
            [282.5, 20],
            [271.7, 42],
            [261.7, 64],
            [253.2, 86],
            [247.2, 108],
            [245, 130],
            [247.2, 152],
            [253.2, 174],
            [261.7, 196],
            [271.7, 218],
            [282.5, 240],
          ],
          stroke: 'correct',
          strokeWidth: 3,
        },
        {
          kind: 'polyline',
          id: 'cuc-tieu-phai',
          points: [
            [243.4, 20],
            [238.7, 42],
            [234.4, 64],
            [230.9, 86],
            [228.4, 108],
            [227.5, 130],
            [228.4, 152],
            [230.9, 174],
            [234.4, 196],
            [238.7, 218],
            [243.4, 240],
          ],
          stroke: 'muted',
          strokeWidth: 2,
          dash: '6 5',
        },
        {
          kind: 'polyline',
          id: 'cuc-tieu-trai',
          points: [
            [176.6, 20],
            [181.3, 42],
            [185.6, 64],
            [189.1, 86],
            [191.6, 108],
            [192.5, 130],
            [191.6, 152],
            [189.1, 174],
            [185.6, 196],
            [181.3, 218],
            [176.6, 240],
          ],
          stroke: 'muted',
          strokeWidth: 2,
          dash: '6 5',
        },
        {
          kind: 'label',
          id: 'nhan-s1',
          x: 140,
          y: 152,
          text: 'S₁',
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-s2',
          x: 280,
          y: 152,
          text: 'S₂',
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-cd',
          x: 210,
          y: 12,
          text: 'cực đại k = 0',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-ct',
          x: 300,
          y: 256,
          text: 'nét đứt: cực tiểu',
          size: 12,
          anchor: 'middle',
          fill: 'muted',
        },
      ],
      captions: [
        { atMs: 0, text: 'Hai nguồn dao động cùng pha, gợn tròn bắt đầu lan ra.' },
        { atMs: 1500, text: 'Các gợn gặp nhau: chỗ hai đỉnh gặp đỉnh thì nước vồng lên mạnh.' },
        {
          atMs: 3000,
          text: 'Vân giao thoa đứng yên tại chỗ: đường liền = cực đại, nét đứt = cực tiểu.',
        },
      ],
    },
    grade: '11',
    chapterNumber: 2,
    chapterTitle: 'Sóng',
    lessonNumber: 12,
    title: 'Giao thoa sóng',
    hook:
      'Khi hai con sóng cùng gặp nhau trên hồ nước, chúng không đơn giản hòa vào nhau. ' +
      'Chúng tạo thành một mạng lưới hình học kì ảo: những điểm sóng vọt lên rất cao xen kẽ những điểm nước phẳng lặng như gương. ' +
      'Hiện tượng này gọi là Giao thoa.',
    theory:
      'NGUỒN KẾT HỢP (COHERENT SOURCES):\\n' +
      '— Hai nguồn kết hợp là hai nguồn sóng dao động cùng phương, cùng tần số và có độ lệch pha không đổi theo thời gian.\\n' +
      '— Giao thoa là sự gặp nhau của hai sóng từ hai nguồn kết hợp tạo thành các cực đại và cực tiểu cố định trong không gian.\\n\\n' +
      'ĐIỀU KIỆN CỰC ĐẠI - CỰC TIỂU GIA THOA (hai nguồn đồng pha):\\n' +
      '— Xét một điểm M có khoảng cách tới hai nguồn sóng lần lượt là d₁ và d₂.\\n' +
      '1. Cực đại giao thoa: Hai sóng tăng cường lẫn nhau, biên độ cực đại. ' +
      'Hiệu đường đi bằng một số nguyên lần bước sóng: d₂ - d₁ = k.λ (với k = 0, ±1, ±2...).\\n' +
      '2. Cực tiểu giao thoa: Hai sóng triệt tiêu lẫn nhau, biên độ cực tiểu (bằng 0). ' +
      'Hiệu đường đi bằng một số bán nguyên lần bước sóng: d₂ - d₁ = (k + 0,5).λ (với k = 0, ±1, ±2...).',
    workedExample: {
      problem:
        'Tại hai điểm A và B trên mặt nước có hai nguồn sóng kết hợp dao động cùng pha với tần số f = 50 Hz. ' +
        'Tốc độ truyền sóng v = 1,5 m/s. Điểm M cách nguồn A một đoạn d₁ = 12 cm, cách nguồn B một đoạn d₂ = 15 cm. ' +
        'Hỏi điểm M là cực đại hay cực tiểu giao thoa?',
      steps: [
        'Tính bước sóng λ: λ = v / f = 1,5 m/s / 50 Hz = 150 cm/s / 50 Hz = 3 cm.',
        'Tính hiệu đường đi từ M tới hai nguồn: d₂ - d₁ = 15 - 12 = 3 cm.',
        'So sánh hiệu đường đi với bước sóng: (d₂ - d₁) / λ = 3 / 3 = 1 (là một số nguyên k = 1).',
        'Vì hiệu đường đi bằng đúng 1 lần bước sóng (d₂ - d₁ = 1.λ), theo lí thuyết, M là cực đại giao thoa (bậc 1).',
      ],
      answer: 'M là cực đại giao thoa.',
    },
    checkQuestions: [
      {
        prompt:
          'Với hai nguồn kết hợp cùng pha phát sóng bước sóng λ, vị trí các cực đại giao thoa thoả mãn hiệu đường đi d₂ - d₁ bằng:',
        choices: [
          { id: 'it_1', label: 'k * λ (k nguyên)' },
          { id: 'it_2', label: '(k + 0,5) * λ (k nguyên)' },
          { id: 'it_3', label: 'k * λ / 2 (k nguyên)' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['it_1'],
        },
        explain: 'Hiệu đường đi của cực đại giao thoa bằng số nguyên lần bước sóng: d₂ - d₁ = kλ.',
      },
      {
        prompt:
          'Hai nguồn kết hợp cùng pha tạo ra sóng có bước sóng 4 cm trên mặt nước. Điểm M cách nguồn 1 một đoạn 10 cm, cách nguồn 2 một đoạn 16 cm. Tính tỉ số (d₂ - d₁) / λ để xác định M là cực đại hay cực tiểu.',
        answer: {
          kind: 'numeric',
          value: 1.5,
          unit: '',
        },
        explain:
          'Hiệu đường đi d₂ - d₁ = 16 - 10 = 6 cm. Tỉ số (d₂ - d₁) / λ = 6 / 4 = 1,5. Đây là số bán nguyên nên M là cực tiểu giao thoa.',
      },
    ],
    srsCards: [
      {
        hoi: 'Điều kiện để hai sóng giao thoa được với nhau là gì?',
        dap: 'Hai sóng phải xuất phát từ hai nguồn kết hợp (cùng phương, cùng tần số, hiệu pha không đổi).',
      },
      {
        hoi: 'Tại sao các điểm cực tiểu giao thoa có nước phẳng lặng không dao động?',
        dap: 'Vì tại đó hai sóng từ hai nguồn truyền tới ngược pha nhau và triệt tiêu biên độ của nhau hoàn toàn.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly11-c2-b13',
    grade: '11',
    chapterNumber: 2,
    chapterTitle: 'Sóng',
    lessonNumber: 13,
    title: 'Sóng dừng',
    hook:
      'Gảy một sợi dây đàn guitar, âm thanh thánh thót vang lên. Trên dây đàn xuất hiện các điểm đứng im xen kẽ ' +
      'các bó sóng phồng to rung động mãnh liệt. Đó là Sóng dừng, nền tảng vật lí của mọi nhạc cụ dây.',
    theory:
      'ĐỊNH NGHĨA SÓNG DỰNG (STANDING WAVE):\\n' +
      '— Sóng dừng là sóng có các nút sóng (điểm luôn đứng yên) và bụng sóng (điểm luôn dao động với biên độ cực đại) cố định trong không gian, ' +
      'sinh ra do sự giao thoa giữa sóng tới và sóng phản xạ trên cùng một phương truyền.\\n\\n' +
      'KHOẢNG CÁCH ĐẶC BIỆT TRÊN SÓNG DỰNG:\\n' +
      '— Khoảng cách giữa hai nút sóng liên tiếp (hoặc hai bụng sóng liên tiếp) bằng nửa bước sóng (λ / 2).\\n' +
      '— Khoảng cách giữa một nút sóng và một bụng sóng liên tiếp gần nhất bằng một phần tư bước sóng (λ / 4).\\n\\n' +
      'ĐIỀU KIỆN ĐỂ CÓ SÓNG DỪNG TRÊN DÂY CHIỀU DÀI L:\\n' +
      '1. Sợi dây có hai đầu cố định (hai đầu đều là nút sóng):\\n' +
      '   — L = k * (λ / 2) (với k = 1, 2, 3... là số bó sóng/bụng sóng).\\n' +
      '2. Sợi dây có một đầu cố định, một đầu tự do (đầu cố định là nút, đầu tự do là bụng):\\n' +
      '   — L = (2k + 1) * (λ / 4) (với k = 0, 1, 2... là số bó sóng nguyên).',
    workedExample: {
      problem:
        'Một sợi dây dài L = 1,2 m căng ngang có hai đầu cố định. Người ta tạo ra một sóng dừng trên dây có 3 bụng sóng. ' +
        'Tính bước sóng λ của sóng truyền trên dây.',
      steps: [
        'Xác định loại liên kết: hai đầu cố định, chiều dài dây L = 1,2 m.',
        'Số bụng sóng bằng số bó sóng k = 3.',
        'Áp dụng công thức hai đầu cố định: L = k * (λ / 2).',
        'Thay số tìm λ: 1,2 = 3 * (λ / 2) ⇔ λ / 2 = 1,2 / 3 = 0,4 m ⇔ λ = 0,8 m = 80 cm.',
      ],
      answer: 'λ = 0,8 m.',
    },
    checkQuestions: [
      {
        prompt:
          'Trong hiện tượng sóng dừng trên một sợi dây, khoảng cách giữa hai nút sóng liên tiếp bằng:',
        choices: [
          { id: 'st_1', label: 'Nửa bước sóng (λ / 2)' },
          { id: 'st_2', label: 'Một bước sóng (λ)' },
          { id: 'st_3', label: 'Một phần tư bước sóng (λ / 4)' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['st_1'],
        },
        explain:
          'Khoảng cách giữa hai nút sóng liên tiếp (hoặc hai bụng liên tiếp) luôn bằng nửa bước sóng (λ / 2).',
      },
      {
        prompt:
          'Một sợi dây cao su dài 1,5 m có hai đầu cố định. Khi xảy ra sóng dừng có tần số xác định, người ta quan sát thấy trên dây có 3 bó sóng (k = 3). Tính bước sóng của sóng truyền trên dây.',
        answer: {
          kind: 'numeric',
          value: 1,
          unit: 'm',
        },
        explain: 'L = k * λ / 2 ⇔ 1,5 = 3 * λ / 2 ⇔ λ = 1 m.',
      },
    ],
    srsCards: [
      {
        hoi: 'Nút sóng và bụng sóng trong sóng dừng là gì?',
        dap: 'Nút sóng là điểm luôn đứng yên (biên độ bằng 0). Bụng sóng là điểm luôn dao động với biên độ cực đại.',
      },
      {
        hoi: 'Khoảng cách từ một nút sóng đến bụng sóng gần nhất là bao nhiêu?',
        dap: 'Bằng một phần tư bước sóng (λ / 4).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly11-c2-b14',
    grade: '11',
    chapterNumber: 2,
    chapterTitle: 'Sóng',
    lessonNumber: 14,
    title: 'Bài tập về sóng',
    hook:
      'Luyện tập tổng hợp các bài toán về sóng cơ, giao thoa sóng và sóng dừng ' +
      'sẽ giúp bạn nhuần nhuyễn kĩ năng giải toán lý thuyết lẫn thực tế.',
    theory:
      'TỔNG HỢP CÔNG THỨC SÓNG CẦN NHỚ:\\n' +
      '— Mối liên hệ chu kì, tần số, tốc độ và bước sóng: λ = v.T = v / f.\\n' +
      '— Giao thoa sóng: d₂ - d₁ = k.λ (Cực đại); d₂ - d₁ = (k + 0,5).λ (Cực tiểu) (với hai nguồn cùng pha).\\n' +
      '— Sóng dừng hai đầu cố định: L = k.λ / 2 (k = số bụng sóng). Tần số tối thiểu để có sóng dừng: f_min = v / 2L.\\n' +
      '— Sóng dừng một đầu cố định, một đầu tự do: L = (2k + 1).λ / 4.',
    workedExample: {
      problem:
        'Một sợi dây dài 1 m treo thẳng đứng có đầu trên cố định và đầu dưới tự do. Một máy rung tạo dao động trên dây ' +
        'với tốc độ truyền sóng v = 8 m/s. Tính tần số nhỏ nhất để trên dây có sóng dừng.',
      steps: [
        'Dây có một đầu cố định, một đầu tự do. Chiều dài L = 1 m, tốc độ v = 8 m/s.',
        'Áp dụng công thức L = (2k + 1) * (λ / 4).',
        'Tần số nhỏ nhất tương ứng với k nhỏ nhất (k = 0).',
        'Khi đó: L = 1 * (λ / 4) ⇔ λ = 4L = 4 * 1 = 4 m.',
        'Tính tần số tối thiểu f_min: f_min = v / λ = 8 / 4 = 2 Hz.',
      ],
      answer: 'f_min = 2 Hz.',
    },
    checkQuestions: [
      {
        prompt:
          'Một sóng cơ có tần số f = 500 Hz và tốc độ truyền sóng v = 350 m/s. Tính bước sóng của sóng này.',
        answer: {
          kind: 'numeric',
          value: 0.7,
          unit: 'm',
        },
        explain: 'λ = v / f = 350 / 500 = 0,7 m.',
      },
      {
        prompt:
          'Một sợi dây thép dài 0,6 m có hai đầu cố định. Khi xảy ra sóng dừng trên dây với bước sóng λ = 0,4 m. Hãy tính số bụng sóng quan sát được trên dây.',
        answer: {
          kind: 'numeric',
          value: 3,
          unit: '',
        },
        explain: 'L = k * λ / 2 ⇔ 0,6 = k * 0,4 / 2 ⇔ 0,6 = k * 0,2 ⇔ k = 3 bụng.',
      },
    ],
    srsCards: [
      {
        hoi: 'Viết công thức tính tần số nhỏ nhất f_min để có sóng dừng trên dây hai đầu cố định chiều dài L, tốc độ truyền sóng v.',
        dap: 'f_min = v / (2L).',
      },
      {
        hoi: 'Viết công thức liên hệ bước sóng λ và chiều dài L cho sóng dừng một đầu cố định, một đầu tự do với k bó sóng nguyên.',
        dap: 'L = (2k + 1) * λ / 4.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly11-c2-b15',
    grade: '11',
    chapterNumber: 2,
    chapterTitle: 'Sóng',
    lessonNumber: 15,
    title: 'Thực hành: Đo tốc độ truyền âm',
    hook:
      'Làm thế nào để đo tốc độ truyền âm của không khí ngay tại lớp học bằng một ống nhựa rỗng đựng nước? ' +
      'Chúng ta sử dụng một âm thoa phát âm thanh chuẩn và tìm các điểm cộng hưởng cột khí.',
    theory:
      'NGUYÊN LÝ CỘT KHÍ CỘNG HƯỞNG (RESONANCE TUBE):\\n' +
      '— Một ống thủy tinh chứa nước, có thể điều chỉnh độ cao mặt nước để thay đổi chiều dài cột khí L từ mặt nước đến miệng ống.\\n' +
      '— Đặt một âm thoa dao động tần số f sát miệng ống. Sóng âm truyền vào ống phản xạ tại mặt nước (đầu cố định - nút sóng) ' +
      'và giao thoa với sóng tới ở miệng ống (đầu tự do - bụng sóng).\\n' +
      '— Khi hạ dần mặt nước, âm thanh nghe được đột ngột to lên tại các vị trí cộng hưởng đầu tiên L₁ và thứ hai L₂.\\n' +
      '— Khoảng cách giữa hai vị trí cộng hưởng liên tiếp bằng nửa bước sóng: L₂ - L₁ = λ / 2.\\n' +
      '— Tính bước sóng: λ = 2 * (L₂ - L₁).\\n' +
      '— Tốc độ truyền âm trong không khí: v = λ * f = 2 * (L₂ - L₁) * f.',
    workedExample: {
      problem:
        'Trong thí nghiệm đo tốc độ truyền âm bằng ống cộng hưởng với âm thoa có tần số f = 500 Hz, người ta tìm được hai vị trí ' +
        'cộng hưởng liên tiếp có chiều dài cột khí tương ứng là L₁ = 17 cm và L₂ = 51 cm. Tính tốc độ truyền âm đo được.',
      steps: [
        'Xác định các thông số: f = 500 Hz, L₁ = 17 cm = 0,17 m, L₂ = 51 cm = 0,51 m.',
        'Tính nửa bước sóng: λ / 2 = L₂ - L₁ = 0,51 - 0,17 = 0,34 m.',
        'Tính bước sóng λ: λ = 2 * 0,34 = 0,68 m.',
        'Tính tốc độ truyền âm v: v = λ * f = 0,68 * 500 = 340 m/s.',
      ],
      answer: 'v = 340 m/s.',
    },
    checkQuestions: [
      {
        prompt:
          'Trong thí nghiệm ống cộng hưởng, khoảng cách giữa hai chiều dài cột khí cho âm thanh to nhất liên tiếp bằng:',
        choices: [
          { id: 'rs_1', label: 'Nửa bước sóng (λ / 2)' },
          { id: 'rs_2', label: 'Một bước sóng (λ)' },
          { id: 'rs_3', label: 'Một phần tư bước sóng (λ / 4)' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['rs_1'],
        },
        explain:
          'Cột khí cộng hưởng giống như sóng dừng với một đầu nút và một đầu bụng. Hai vị trí cộng hưởng liên tiếp cách nhau λ/2.',
      },
      {
        prompt:
          'Khi sử dụng âm thoa f = 1000 Hz, khoảng cách giữa hai mức nước cộng hưởng liên tiếp đo được là 0,17 m. Tính tốc độ truyền âm đo được trong không khí.',
        answer: {
          kind: 'numeric',
          value: 340,
          unit: 'm/s',
        },
        explain: 'λ = 2 * 0,17 = 0,34 m. v = λ * f = 0,34 * 1000 = 340 m/s.',
      },
    ],
    srsCards: [
      {
        hoi: 'Tại sao mặt nước trong ống cộng hưởng luôn đóng vai trò là một nút sóng?',
        dap: 'Vì mặt nước là một biên cứng cố định phản xạ sóng âm ngược pha.',
      },
      {
        hoi: 'Tại sao miệng ống của cột khí cộng hưởng đóng vai trò là một bụng sóng?',
        dap: 'Vì miệng ống tiếp giáp tự do với không khí bên ngoài, cho phép các phần tử khí dao động tự do với biên độ lớn nhất.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
