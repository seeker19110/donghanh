// lessons/toan11c8.ts — Toán 11, Chương 8: Các quy tắc tính xác suất.
// Nội dung tự soạn theo định nghĩa/công thức chuẩn (sự thật toán học), KHÔNG chép ví dụ SGK.
// Trạng thái `draft` — chờ người có chuyên môn Toán duyệt qua quy trình lessonReview.
import type { MathLesson } from '../lessonTypes.js'

const CHUONG = 'Các quy tắc tính xác suất'

export const TOAN11_C8_LESSONS: MathLesson[] = [
  {
    id: 'toan11-c8-b1',
    grade: '11',
    chapterNumber: 8,
    chapterTitle: CHUONG,
    lessonNumber: 1,
    title: 'Biến cố hợp, biến cố giao và biến cố độc lập',
    hook:
      'Lớp 11A đăng kí câu lạc bộ: một số bạn ghi tên bóng đá, một số ghi tên cầu lông, và có mấy bạn ghi cả ' +
      'hai. Khi cô giáo hỏi "bao nhiêu bạn có tham gia câu lạc bộ thể thao?", cộng thẳng hai danh sách là đếm ' +
      'thừa — mấy bạn ghi cả hai bị đếm hai lần. Toàn bộ chương xác suất này sinh ra để xử lí đúng chữ "cả hai" ' +
      'đó, bằng ngôn ngữ của biến cố hợp và biến cố giao.',
    theory:
      'NHẮC LẠI NGÔN NGỮ NỀN\n' +
      'Không gian mẫu Ω là tập tất cả kết quả có thể xảy ra của một phép thử. Một biến cố là một TẬP CON của Ω. ' +
      'Vì biến cố là tập hợp, mọi phép toán tập hợp đều dùng lại được nguyên vẹn — đó là lí do chương này học ' +
      'nhẹ nhàng hơn vẻ ngoài của nó.\n\n' +
      'BIẾN CỐ HỢP A ∪ B\n' +
      'A ∪ B là biến cố "A xảy ra HOẶC B xảy ra" (chỉ cần ít nhất một trong hai xảy ra là đủ).\n' +
      'Chú ý chữ "hoặc" ở đây là hoặc BAO GỒM: trường hợp cả hai cùng xảy ra vẫn được tính vào A ∪ B.\n\n' +
      'BIẾN CỐ GIAO A ∩ B\n' +
      'A ∩ B là biến cố "A VÀ B cùng xảy ra". Người ta hay viết gọn là AB.\n\n' +
      'HAI BIẾN CỐ XUNG KHẮC\n' +
      'A và B xung khắc khi chúng KHÔNG THỂ cùng xảy ra, tức A ∩ B = ∅.\n' +
      'Ví dụ đời thường: gieo một con xúc xắc, "được mặt 1 chấm" và "được mặt 6 chấm" là hai biến cố xung khắc.\n\n' +
      'BIẾN CỐ ĐỐI\n' +
      'Biến cố đối của A, kí hiệu A ngang, là biến cố "A không xảy ra", gồm đúng các phần tử của Ω không thuộc A. ' +
      'Luôn có P(A ngang) = 1 − P(A). Mẹo cực kì hay dùng: gặp cụm từ "có ÍT NHẤT một…" thì hãy nghĩ ngay tới ' +
      'biến cố đối "KHÔNG có cái nào…", vì biến cố đối thường dễ đếm hơn rất nhiều.\n\n' +
      'HAI BIẾN CỐ ĐỘC LẬP\n' +
      'A và B độc lập khi việc A xảy ra hay không KHÔNG làm thay đổi khả năng xảy ra của B, và ngược lại.\n' +
      'Nhận biết trong thực tế: hai phép thử tách rời nhau, không tác động lẫn nhau — hai lần tung đồng xu, hai ' +
      'xạ thủ bắn riêng, hai máy chạy độc lập, rút bi CÓ HOÀN LẠI.\n' +
      'Ngược lại, rút bi KHÔNG hoàn lại thì lần rút trước làm đổi thành phần trong hộp, nên hai lần rút KHÔNG ' +
      'độc lập.\n\n' +
      'PHÂN BIỆT XUNG KHẮC VÀ ĐỘC LẬP — CHỖ NHẦM SỐ MỘT CỦA CẢ CHƯƠNG\n' +
      'Hai khái niệm này nghe na ná nhưng nói về hai chuyện hoàn toàn khác nhau:\n' +
      '— Xung khắc: hai biến cố LOẠI TRỪ nhau, cái này xảy ra thì cái kia chắc chắn không.\n' +
      '— Độc lập: hai biến cố KHÔNG ẢNH HƯỞNG gì đến nhau.\n' +
      'Thật ra chúng gần như trái ngược: nếu A và B xung khắc và cả hai đều có xác suất dương, thì biết A xảy ra ' +
      'là biết chắc B không xảy ra — ảnh hưởng mạnh nhất có thể, nên A và B KHÔNG độc lập.\n\n' +
      'ĐẾM SỐ PHẦN TỬ CỦA BIẾN CỐ HỢP\n' +
      'n(A ∪ B) = n(A) + n(B) − n(A ∩ B).\n' +
      'VÌ SAO phải trừ đi n(A ∩ B): khi cộng n(A) với n(B), các kết quả vừa thuộc A vừa thuộc B đã bị đếm HAI ' +
      'lần, nên phải bớt đi đúng một lần. Đây là công thức bao hàm – loại trừ, chính là bản đếm của công thức ' +
      'cộng xác suất sẽ học ở bài sau.',
    workedExample: {
      problem:
        'Gieo một con xúc xắc cân đối sáu mặt. Gọi A là biến cố "số chấm xuất hiện là số chẵn", B là biến cố ' +
        '"số chấm xuất hiện chia hết cho 3". Hãy liệt kê A ∪ B, A ∩ B, cho biết A và B có xung khắc không, và ' +
        'tính n(A ∪ B) bằng hai cách.',
      steps: [
        'Bước 1 — Viết rõ không gian mẫu: Ω = {1; 2; 3; 4; 5; 6}, gồm 6 kết quả đồng khả năng.',
        'Bước 2 — Liệt kê từng biến cố: A = {2; 4; 6} nên n(A) = 3; B = {3; 6} nên n(B) = 2.',
        'Bước 3 — Biến cố giao gồm các kết quả thuộc CẢ HAI: A ∩ B = {6}, nên n(A ∩ B) = 1. Số 6 vừa chẵn vừa ' +
          'chia hết cho 3.',
        'Bước 4 — Vì A ∩ B khác rỗng nên A và B KHÔNG xung khắc: hoàn toàn có thể xảy ra đồng thời, đó là khi ' +
          'gieo được mặt 6 chấm.',
        'Bước 5 — Tính n(A ∪ B) cách 1 (liệt kê trực tiếp): A ∪ B = {2; 3; 4; 6}, đếm được 4 phần tử.',
        'Bước 6 — Tính n(A ∪ B) cách 2 (dùng công thức): n(A) + n(B) − n(A ∩ B) = 3 + 2 − 1 = 4. Hai cách cho ' +
          'cùng kết quả, xác nhận việc trừ đi phần giao là đúng: nếu quên trừ sẽ ra 5, tức đếm mặt 6 chấm hai lần.',
      ],
      answer: 'A ∪ B = {2; 3; 4; 6}, A ∩ B = {6}; A và B không xung khắc; n(A ∪ B) = 4.',
    },
    checkQuestions: [
      {
        prompt:
          'Gieo một con xúc xắc cân đối sáu mặt. Gọi A là biến cố "số chấm là số lẻ", B là biến cố "số chấm lớn ' +
          'hơn 3". Tính số phần tử của biến cố hợp A ∪ B.',
        answer: { kind: 'numeric', value: 5 },
        explain:
          'Không gian mẫu là {1; 2; 3; 4; 5; 6}. Ta có A = {1; 3; 5} nên n(A) = 3, còn B = {4; 5; 6} nên ' +
          'n(B) = 3. Phần giao gồm các kết quả vừa lẻ vừa lớn hơn 3, tức A ∩ B = {5} với n(A ∩ B) = 1. Áp dụng ' +
          'công thức bao hàm – loại trừ: n(A ∪ B) = 3 + 3 − 1 = 5. Kiểm lại bằng liệt kê: A ∪ B = {1; 3; 4; 5; 6}, ' +
          'đúng 5 phần tử. Cộng thẳng 3 + 3 = 6 là sai vì mặt 5 chấm bị đếm hai lần.',
      },
      {
        prompt:
          'Gieo một con xúc xắc cân đối sáu mặt. Gọi A là biến cố "số chấm là số chẵn", B là biến cố "số chấm ' +
          'chia hết cho 3". Tính số phần tử của biến cố giao A ∩ B.',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'Biến cố giao gồm các kết quả thoả mãn ĐỒNG THỜI cả hai điều kiện. Ta có A = {2; 4; 6} và B = {3; 6}, ' +
          'nên A ∩ B = {6}: chỉ mặt 6 chấm vừa là số chẵn vừa chia hết cho 3. Vậy n(A ∩ B) = 1. Sai lầm thường ' +
          'gặp là nhầm giao với hợp và trả lời 4 — nhớ rằng "giao" ứng với chữ VÀ, còn "hợp" ứng với chữ HOẶC.',
      },
      {
        prompt:
          'Vẫn với A là biến cố "số chấm là số chẵn" và B là biến cố "số chấm chia hết cho 3" khi gieo một con ' +
          'xúc xắc sáu mặt. Khẳng định nào sau đây đúng?',
        choices: [
          { id: 'A', label: 'A và B xung khắc vì chúng được định nghĩa khác nhau' },
          { id: 'B', label: 'A và B không xung khắc vì cùng xảy ra khi gieo được mặt 6 chấm' },
          { id: 'C', label: 'A và B xung khắc vì số chẵn không thể chia hết cho 3' },
          { id: 'D', label: 'A và B là hai biến cố đối của nhau' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Hai biến cố xung khắc khi và chỉ khi A ∩ B = ∅. Ở đây A ∩ B = {6} khác rỗng, nên A và B KHÔNG xung ' +
          'khắc: gieo được mặt 6 chấm là lúc cả hai cùng xảy ra. Phương án C sai ở kiến thức số học — số chẵn ' +
          'hoàn toàn có thể chia hết cho 3, ví dụ 6 hay 12. Phương án D cũng sai vì hai biến cố đối phải phủ kín ' +
          'toàn bộ không gian mẫu và không giao nhau, trong khi ở đây mặt 1 chấm và mặt 5 chấm không thuộc biến ' +
          'cố nào cả.',
      },
      {
        prompt: 'Cặp biến cố nào sau đây là hai biến cố ĐỘC LẬP?',
        choices: [
          {
            id: 'A',
            label:
              'Tung hai đồng xu cùng lúc: "đồng thứ nhất ra mặt sấp" và "đồng thứ hai ra mặt ngửa"',
          },
          {
            id: 'B',
            label: 'Gieo một con xúc xắc: "được mặt chẵn" và "được mặt 3 chấm"',
          },
          {
            id: 'C',
            label:
              'Rút liên tiếp hai viên bi KHÔNG hoàn lại: "viên thứ nhất màu đỏ" và "viên thứ hai màu đỏ"',
          },
          {
            id: 'D',
            label: 'Gieo một con xúc xắc: "được mặt lớn hơn 4" và "được mặt nhỏ hơn 2"',
          },
        ],
        answer: { kind: 'choice', correctIds: ['A'] },
        explain:
          'Hai đồng xu được tung tách rời nhau, kết quả của đồng này không tác động gì tới đồng kia, nên hai ' +
          'biến cố đó độc lập. Phương án C không độc lập vì rút không hoàn lại làm đổi thành phần bi còn lại ' +
          'trong hộp, khiến khả năng của lần rút thứ hai phụ thuộc vào lần thứ nhất. Hai phương án B và D là các ' +
          'cặp biến cố XUNG KHẮC (không thể cùng xảy ra) — mà xung khắc với xác suất dương thì chắc chắn KHÔNG ' +
          'độc lập, vì biết cái này xảy ra là biết ngay cái kia không xảy ra.',
      },
      {
        prompt:
          'Một lớp có 40 học sinh, trong đó 22 bạn đăng kí câu lạc bộ bóng đá, 18 bạn đăng kí câu lạc bộ cầu ' +
          'lông và 7 bạn đăng kí cả hai. Hỏi có bao nhiêu bạn đăng kí ít nhất một trong hai câu lạc bộ?',
        answer: { kind: 'numeric', value: 33 },
        explain:
          'Gọi A là tập các bạn đăng kí bóng đá và B là tập các bạn đăng kí cầu lông; "đăng kí ít nhất một câu ' +
          'lạc bộ" chính là biến cố hợp A ∪ B. Áp dụng công thức bao hàm – loại trừ: n(A ∪ B) = n(A) + n(B) − ' +
          'n(A ∩ B) = 22 + 18 − 7 = 33 bạn. Nếu cộng thẳng 22 + 18 = 40 thì 7 bạn ghi tên cả hai đã bị đếm hai ' +
          'lần, cho ra con số bằng đúng sĩ số lớp một cách vô lí — trong khi thực tế còn 7 bạn không đăng kí câu ' +
          'lạc bộ nào.',
      },
      {
        prompt:
          'Tung một đồng xu cân đối ba lần liên tiếp. Gọi A là biến cố "có ít nhất một lần xuất hiện mặt sấp". ' +
          'Biến cố đối của A là biến cố nào?',
        choices: [
          { id: 'A', label: 'Cả ba lần đều xuất hiện mặt sấp' },
          { id: 'B', label: 'Cả ba lần đều xuất hiện mặt ngửa' },
          { id: 'C', label: 'Có đúng một lần xuất hiện mặt sấp' },
          { id: 'D', label: 'Có nhiều nhất một lần xuất hiện mặt sấp' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Biến cố đối của A là "A KHÔNG xảy ra", tức là không có lần nào ra mặt sấp, nghĩa là cả ba lần đều ra ' +
          'mặt ngửa. Phủ định của "có ít nhất một" là "không có cái nào", chứ không phải "có đúng một" hay "cả ' +
          'ba đều là sấp". Đây là kĩ thuật quan trọng nhất khi tính xác suất dạng "ít nhất một": đếm biến cố ' +
          'đối gọn hơn hẳn, rồi dùng P(A) = 1 − P(A ngang).',
      },
    ],
    srsCards: [
      {
        hoi: 'Biến cố hợp A ∪ B và biến cố giao A ∩ B nghĩa là gì?',
        dap: 'A ∪ B = "A HOẶC B xảy ra" (ít nhất một). A ∩ B = "A VÀ B cùng xảy ra".',
      },
      {
        hoi: 'Hai biến cố xung khắc khác hai biến cố độc lập ở chỗ nào?',
        dap: 'Xung khắc = không thể cùng xảy ra (A ∩ B = ∅). Độc lập = không ảnh hưởng nhau. Xung khắc với xác suất dương thì KHÔNG độc lập.',
      },
      {
        hoi: 'Công thức đếm số phần tử của biến cố hợp?',
        dap: 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B) — trừ đi phần giao vì nó đã bị đếm hai lần.',
      },
      {
        hoi: 'Gặp cụm "có ít nhất một…" thì nên làm gì?',
        dap: 'Chuyển sang biến cố đối "không có cái nào…" rồi dùng P(A) = 1 − P(A ngang).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan11-c8-b2',
    grade: '11',
    chapterNumber: 8,
    chapterTitle: CHUONG,
    lessonNumber: 2,
    title: 'Công thức cộng xác suất',
    hook:
      'Một quán bún bò khảo sát khách quen: 40% khách hay gọi thêm giò, 50% khách hay gọi thêm trứng, 20% gọi ' +
      'cả hai. Chủ quán muốn biết bao nhiêu phần trăm khách gọi thêm ÍT NHẤT một món. Cộng 40% với 50% thành ' +
      '90% là sai — nhóm gọi cả hai đã bị tính hai lần. Công thức cộng xác suất chính là cách sửa lại con số ' +
      'đó cho đúng.',
    theory:
      'CÔNG THỨC CỘNG XÁC SUẤT (dạng tổng quát — luôn đúng)\n' +
      'P(A ∪ B) = P(A) + P(B) − P(A ∩ B).\n' +
      'VÌ SAO: xác suất trong mô hình đồng khả năng là tỉ số n(biến cố) / n(Ω). Chia cả hai vế của công thức đếm ' +
      'n(A ∪ B) = n(A) + n(B) − n(A ∩ B) cho n(Ω) là ra ngay công thức trên. Nghĩa của số hạng bị trừ vẫn y ' +
      'nguyên: phần giao đã bị cộng hai lần nên phải bớt đi một lần.\n\n' +
      'TRƯỜNG HỢP RIÊNG — HAI BIẾN CỐ XUNG KHẮC\n' +
      'Nếu A và B xung khắc thì A ∩ B = ∅ nên P(A ∩ B) = 0, công thức rút gọn thành\n' +
      'P(A ∪ B) = P(A) + P(B).\n' +
      'CẢNH BÁO: đây là trường hợp RIÊNG, không phải công thức chung. Áp thẳng phép cộng khi hai biến cố không ' +
      'xung khắc là lỗi sai nặng nhất của bài này, và kết quả luôn LỚN HƠN sự thật — có khi vượt quá 1, lúc đó ' +
      'thì nhìn là biết sai ngay.\n\n' +
      'BA CÁCH DÙNG CÔNG THỨC (cùng một công thức, ba chiều rút ẩn)\n' +
      '1. Biết P(A), P(B), P(A ∩ B) → tính P(A ∪ B).\n' +
      '2. Biết P(A), P(B), P(A ∪ B) → tính phần giao: P(A ∩ B) = P(A) + P(B) − P(A ∪ B).\n' +
      '3. Kết hợp biến cố đối: P("không xảy ra cả A lẫn B") = 1 − P(A ∪ B).\n\n' +
      'MẸO KIỂM TRA KẾT QUẢ TRƯỚC KHI GHI ĐÁP ÁN\n' +
      '— Mọi xác suất phải nằm trong đoạn từ 0 đến 1.\n' +
      '— P(A ∪ B) không bao giờ NHỎ HƠN P(A) hay P(B): tập hợp lớn hơn thì xác suất không thể nhỏ hơn.\n' +
      '— P(A ∩ B) không bao giờ LỚN HƠN P(A) hay P(B), vì phần giao nằm gọn trong từng biến cố.\n' +
      'Ba phép kiểm này mất ba giây nhưng bắt được gần hết lỗi cộng trừ nhầm dấu.',
    animation: {
      title: 'Vì sao phải trừ đi phần giao',
      description:
        'Hai hình tròn chồng lấn nhau theo kiểu biểu đồ Ven. Hình tròn thứ nhất sáng lên trước, rồi hình tròn ' +
        'thứ hai sáng lên; phần chồng lấn ở giữa được tô đậm để cho thấy nó vừa bị đếm hai lần, sau đó mờ đi ' +
        'tượng trưng cho việc trừ bớt một lần trong công thức cộng xác suất.',
      viewBoxWidth: 360,
      viewBoxHeight: 220,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'circle',
          id: 'vongA',
          cx: 145,
          cy: 110,
          r: 70,
          stroke: 'primary',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 700, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'circle',
          id: 'vongB',
          cx: 215,
          cy: 110,
          r: 70,
          stroke: 'accent',
          strokeWidth: 3,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1800, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'circle',
          id: 'phanGiao',
          cx: 180,
          cy: 110,
          r: 26,
          fill: 'warn',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3000, opacity: 0.85 },
            { atMs: 4600, opacity: 0.85 },
            { atMs: 5200, opacity: 0.15 },
            { atMs: 6000, opacity: 0.15 },
          ],
        },
        { kind: 'label', id: 'nhanA', x: 100, y: 60, text: 'A', size: 16, fill: 'neutral' },
        { kind: 'label', id: 'nhanB', x: 256, y: 60, text: 'B', size: 16, fill: 'neutral' },
        {
          kind: 'label',
          id: 'nhanGiao',
          x: 180,
          y: 200,
          text: 'A ∩ B',
          size: 14,
          anchor: 'middle',
          fill: 'neutral',
        },
      ],
      captions: [
        { atMs: 700, text: 'Cộng P(A): toàn bộ vòng tròn A được tính một lần.' },
        { atMs: 1800, text: 'Cộng thêm P(B): vòng tròn B cũng được tính một lần.' },
        { atMs: 3000, text: 'Phần chồng lấn đã bị tính HAI lần.' },
        { atMs: 5200, text: 'Nên phải trừ đi P(A ∩ B) đúng một lần.' },
      ],
    },
    workedExample: {
      problem:
        'Một hộp có 10 tấm thẻ giống nhau đánh số từ 1 đến 10. Rút ngẫu nhiên một tấm thẻ. Gọi A là biến cố ' +
        '"rút được thẻ ghi số chẵn", B là biến cố "rút được thẻ ghi số chia hết cho 5". Tính P(A ∪ B).',
      steps: [
        'Bước 1 — Xác định không gian mẫu: có 10 tấm thẻ đồng khả năng, nên n(Ω) = 10.',
        'Bước 2 — Liệt kê A = {2; 4; 6; 8; 10}, suy ra n(A) = 5 và P(A) = 5/10 = 0,5.',
        'Bước 3 — Liệt kê B = {5; 10}, suy ra n(B) = 2 và P(B) = 2/10 = 0,2.',
        'Bước 4 — Kiểm tra xung khắc: thẻ số 10 vừa chẵn vừa chia hết cho 5, nên A ∩ B = {10}, hai biến cố KHÔNG ' +
          'xung khắc. Do đó P(A ∩ B) = 1/10 = 0,1 và bắt buộc phải dùng công thức tổng quát.',
        'Bước 5 — Áp dụng công thức cộng: P(A ∪ B) = 0,5 + 0,2 − 0,1 = 0,6.',
        'Bước 6 — Kiểm tra lại bằng cách đếm trực tiếp: A ∪ B = {2; 4; 5; 6; 8; 10} gồm 6 thẻ, cho P = 6/10 = ' +
          '0,6. Khớp. Nếu quên trừ phần giao sẽ ra 0,7 — tức đếm thẻ số 10 hai lần.',
      ],
      answer: 'P(A ∪ B) = 0,6.',
    },
    checkQuestions: [
      {
        prompt:
          'Cho hai biến cố A và B với P(A) = 0,4; P(B) = 0,5 và P(A ∩ B) = 0,2. Tính P(A ∪ B).',
        answer: { kind: 'numeric', value: 0.7 },
        explain:
          'Áp dụng công thức cộng xác suất dạng tổng quát: P(A ∪ B) = P(A) + P(B) − P(A ∩ B) = 0,4 + 0,5 − 0,2 ' +
          '= 0,7. Vì P(A ∩ B) = 0,2 khác 0 nên hai biến cố KHÔNG xung khắc, bắt buộc phải trừ đi phần giao; cộng ' +
          'thẳng ra 0,9 là đếm hai lần phần chồng lấn. Kiểm nhanh kết quả: 0,7 nằm trong đoạn từ 0 đến 1 và lớn ' +
          'hơn cả P(A) lẫn P(B), đúng như mong đợi với một biến cố hợp.',
      },
      {
        prompt:
          'Một hộp có 10 tấm thẻ đánh số từ 1 đến 10, rút ngẫu nhiên một tấm. Tính xác suất rút được thẻ ghi số ' +
          'chẵn hoặc số chia hết cho 3.',
        answer: { kind: 'numeric', value: 0.7 },
        explain:
          'Gọi A là biến cố "số chẵn" với A = {2; 4; 6; 8; 10} nên P(A) = 0,5; gọi B là biến cố "chia hết cho 3" ' +
          'với B = {3; 6; 9} nên P(B) = 0,3. Phần giao là A ∩ B = {6} nên P(A ∩ B) = 0,1. Vậy P(A ∪ B) = 0,5 + ' +
          '0,3 − 0,1 = 0,7. Kiểm lại bằng liệt kê: A ∪ B = {2; 3; 4; 6; 8; 9; 10} gồm 7 thẻ trên tổng 10, cho ' +
          'đúng 0,7. Chữ "hoặc" trong đề là hoặc bao gồm, nên thẻ số 6 vẫn được tính vào.',
      },
      {
        prompt: 'Hai biến cố A và B xung khắc, biết P(A) = 0,25 và P(B) = 0,35. Tính P(A ∪ B).',
        answer: { kind: 'numeric', value: 0.6 },
        explain:
          'Hai biến cố xung khắc nghĩa là A ∩ B = ∅, do đó P(A ∩ B) = 0 và công thức cộng rút gọn thành ' +
          'P(A ∪ B) = P(A) + P(B) = 0,25 + 0,35 = 0,6. Cần nhớ rằng đây là TRƯỜNG HỢP RIÊNG chỉ dùng được khi ' +
          'đề khẳng định xung khắc; với hai biến cố bất kì mà cộng thẳng như vậy thì kết quả luôn lớn hơn sự ' +
          'thật. Lưu ý thêm: hai biến cố xung khắc này không phải hai biến cố đối, vì tổng xác suất mới là 0,6 ' +
          'chứ chưa bằng 1.',
      },
      {
        prompt:
          'Cho hai biến cố A và B với P(A) = 0,6; P(B) = 0,5 và P(A ∪ B) = 0,9. Tính P(A ∩ B).',
        answer: { kind: 'numeric', value: 0.2 },
        explain:
          'Vẫn là công thức cộng nhưng rút ẩn theo chiều ngược lại: từ P(A ∪ B) = P(A) + P(B) − P(A ∩ B) suy ra ' +
          'P(A ∩ B) = P(A) + P(B) − P(A ∪ B) = 0,6 + 0,5 − 0,9 = 0,2. Kiểm tra tính hợp lí: phần giao nằm gọn ' +
          'trong cả A lẫn B nên P(A ∩ B) phải nhỏ hơn hoặc bằng cả 0,6 và 0,5 — giá trị 0,2 thoả mãn. Vì phần ' +
          'giao khác 0 nên hai biến cố này không xung khắc.',
      },
      {
        prompt: 'Đẳng thức P(A ∪ B) = P(A) + P(B) đúng trong trường hợp nào?',
        choices: [
          { id: 'A', label: 'Khi A và B là hai biến cố xung khắc' },
          { id: 'B', label: 'Khi A và B là hai biến cố độc lập' },
          { id: 'C', label: 'Với mọi cặp biến cố A và B' },
          { id: 'D', label: 'Khi P(A) + P(B) không vượt quá 1' },
        ],
        answer: { kind: 'choice', correctIds: ['A'] },
        explain:
          'Công thức tổng quát luôn là P(A ∪ B) = P(A) + P(B) − P(A ∩ B), nên đẳng thức rút gọn chỉ đúng khi ' +
          'P(A ∩ B) = 0, tức A và B xung khắc. Phương án B là bẫy hay gặp nhất: ĐỘC LẬP là điều kiện của công ' +
          'thức NHÂN P(A ∩ B) = P(A)·P(B), không liên quan đến công thức cộng — thực ra hai biến cố độc lập có ' +
          'xác suất dương thì P(A ∩ B) > 0 nên đẳng thức trên lại càng sai. Phương án D chỉ là một điều kiện số ' +
          'học ngẫu nhiên, không nói gì về quan hệ giữa hai biến cố.',
      },
      {
        prompt:
          'Cho hai biến cố A và B với P(A) = 0,45; P(B) = 0,3 và P(A ∩ B) = 0,15. Tính xác suất để KHÔNG xảy ra ' +
          'cả A lẫn B.',
        answer: { kind: 'numeric', value: 0.4 },
        explain:
          'Biến cố "không xảy ra cả A lẫn B" chính là biến cố đối của biến cố hợp A ∪ B. Trước hết tính ' +
          'P(A ∪ B) = 0,45 + 0,3 − 0,15 = 0,6, sau đó lấy phần bù: 1 − 0,6 = 0,4. Cách làm này gộp hai công cụ ' +
          'của bài — công thức cộng và biến cố đối — và là khuôn mẫu cho mọi câu hỏi có chữ "không… nào cả". ' +
          'Sai lầm thường gặp là tính 1 − P(A ∩ B) = 0,85, nhưng đó là xác suất để KHÔNG xảy ra đồng thời cả ' +
          'hai, một biến cố hoàn toàn khác.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức cộng xác suất dạng tổng quát?',
        dap: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B), luôn đúng với mọi cặp biến cố.',
      },
      {
        hoi: 'Khi nào được viết P(A ∪ B) = P(A) + P(B)?',
        dap: 'Chỉ khi A và B XUNG KHẮC (A ∩ B = ∅). Độc lập không cho phép rút gọn kiểu này.',
      },
      {
        hoi: 'Biết P(A), P(B), P(A ∪ B) thì tính phần giao thế nào?',
        dap: 'P(A ∩ B) = P(A) + P(B) − P(A ∪ B).',
      },
      {
        hoi: 'Ba phép kiểm nhanh kết quả xác suất?',
        dap: 'Mọi xác suất trong [0; 1]; P(A ∪ B) ≥ P(A) và ≥ P(B); P(A ∩ B) ≤ P(A) và ≤ P(B).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan11-c8-b3',
    grade: '11',
    chapterNumber: 8,
    chapterTitle: CHUONG,
    lessonNumber: 3,
    title: 'Công thức nhân xác suất cho hai biến cố độc lập',
    hook:
      'Một xưởng may nhỏ ở Nam Định chạy hai máy vắt sổ đặt ở hai góc xưởng, dùng hai nguồn điện riêng, không ' +
      'liên quan gì nhau. Chủ xưởng biết mỗi máy có 5% khả năng hỏng trong ngày và muốn biết khả năng CẢ HAI ' +
      'cùng hỏng đúng hôm có đơn gấp. Câu trả lời không phải 5% cộng 5%, mà là 5% NHÂN 5% — nhỏ hơn rất nhiều, ' +
      'và đó chính là lí do người ta chịu tiền mua máy dự phòng.',
    theory:
      'CÔNG THỨC NHÂN XÁC SUẤT\n' +
      'Nếu A và B là hai biến cố ĐỘC LẬP thì\n' +
      'P(A ∩ B) = P(A) · P(B).\n' +
      'VÌ SAO NHÂN chứ không cộng: hãy hình dung 100 lần thử. Biến cố A xảy ra ở khoảng P(A)·100 lần. Trong ' +
      'riêng nhóm lần đó, vì B không bị A ảnh hưởng nên B vẫn xảy ra với tỉ lệ P(B) như thường. Lấy một tỉ lệ ' +
      'của một tỉ lệ thì phải NHÂN. Cộng chỉ dùng cho chữ "hoặc", nhân dùng cho chữ "và".\n\n' +
      'ĐIỀU KIỆN ĐỘC LẬP KHÔNG ĐƯỢC BỎ QUA\n' +
      'Công thức trên chỉ đúng khi hai biến cố độc lập. Với hai biến cố bất kì thì phải dùng xác suất có điều ' +
      'kiện (học ở lớp 12). Trước khi nhân, luôn tự hỏi: hai biến cố này có tác động lẫn nhau không? Dấu hiệu ' +
      'độc lập quen thuộc: hai phép thử tách rời, hai thiết bị chạy riêng, rút CÓ hoàn lại.\n\n' +
      'MỞ RỘNG CHO NHIỀU BIẾN CỐ\n' +
      'Nếu các biến cố A₁, A₂, …, Aₙ đôi một độc lập và độc lập toàn bộ thì\n' +
      'P(A₁ ∩ A₂ ∩ … ∩ Aₙ) = P(A₁)·P(A₂)·…·P(Aₙ).\n' +
      'Ví dụ tung đồng xu cân đối ba lần: xác suất cả ba lần đều ra mặt sấp là 0,5 · 0,5 · 0,5 = 0,125.\n\n' +
      'HAI HỆ QUẢ DÙNG NHIỀU NHẤT KHI GIẢI BÀI\n' +
      '1. Nếu A và B độc lập thì A và biến cố đối của B cũng độc lập; tương tự cho hai biến cố đối. Nhờ đó tính ' +
      'được xác suất "A xảy ra nhưng B không xảy ra" bằng P(A)·[1 − P(B)].\n' +
      '2. KHUÔN "ÍT NHẤT MỘT": với các biến cố độc lập, xác suất để có ít nhất một biến cố xảy ra bằng\n' +
      '1 − (xác suất KHÔNG cái nào xảy ra) = 1 − [1 − P(A)]·[1 − P(B)].\n' +
      'Đây là khuôn gặp nhiều nhất trong đề thi: hai xạ thủ cùng bắn, hai máy cùng chạy, hai học sinh cùng giải ' +
      'một bài toán. Đếm trực tiếp phải chia ba trường hợp, còn đi đường vòng qua biến cố đối chỉ mất một dòng.\n\n' +
      'ĐỘC LẬP KHÔNG PHẢI XUNG KHẮC — NHẮC LẠI VÌ HAY NHẦM\n' +
      '— Xung khắc: P(A ∩ B) = 0, dùng cho công thức CỘNG.\n' +
      '— Độc lập: P(A ∩ B) = P(A)·P(B), dùng cho công thức NHÂN.\n' +
      'Nếu P(A) > 0 và P(B) > 0 thì P(A)·P(B) > 0, nên hai biến cố độc lập KHÔNG THỂ xung khắc. Hai khái niệm ' +
      'này loại trừ nhau chứ không đi cùng nhau.',
    workedExample: {
      problem:
        'Hai bạn Lan và Bình cùng giải một bài toán một cách độc lập. Xác suất Lan giải được là 0,8; xác suất ' +
        'Bình giải được là 0,6. Tính xác suất để cả hai cùng giải được, và xác suất để bài toán được giải (tức ' +
        'có ít nhất một bạn giải được).',
      steps: [
        'Bước 1 — Đặt tên biến cố: A là "Lan giải được" với P(A) = 0,8; B là "Bình giải được" với P(B) = 0,6. ' +
          'Đề nói rõ hai bạn giải ĐỘC LẬP, nên được phép dùng công thức nhân.',
        'Bước 2 — Xác suất cả hai cùng giải được chính là P(A ∩ B) = P(A)·P(B) = 0,8 · 0,6 = 0,48.',
        'Bước 3 — Với câu hỏi "có ít nhất một bạn giải được", đi đường vòng qua biến cố đối cho nhanh: biến cố ' +
          'đối là "cả hai đều KHÔNG giải được".',
        'Bước 4 — Tính xác suất từng bạn không giải được: 1 − 0,8 = 0,2 và 1 − 0,6 = 0,4. Vì A, B độc lập nên ' +
          'hai biến cố đối cũng độc lập, cho phép nhân: 0,2 · 0,4 = 0,08.',
        'Bước 5 — Lấy phần bù: xác suất có ít nhất một bạn giải được là 1 − 0,08 = 0,92.',
        'Bước 6 — Kiểm chéo bằng công thức cộng: P(A ∪ B) = 0,8 + 0,6 − 0,48 = 0,92. Hai cách khớp nhau, xác ' +
          'nhận kết quả đúng. Cộng thẳng 0,8 + 0,6 = 1,4 là vô lí ngay vì xác suất không thể vượt quá 1.',
      ],
      answer:
        'Xác suất cả hai cùng giải được là 0,48; xác suất có ít nhất một bạn giải được là 0,92.',
    },
    checkQuestions: [
      {
        prompt:
          'Hai xạ thủ bắn độc lập vào cùng một bia. Xác suất bắn trúng của người thứ nhất là 0,8 và của người ' +
          'thứ hai là 0,7. Tính xác suất để cả hai người cùng bắn trúng.',
        answer: { kind: 'numeric', value: 0.56 },
        explain:
          'Hai người bắn độc lập nên biến cố "người thứ nhất trúng" và "người thứ hai trúng" là hai biến cố độc ' +
          'lập, áp dụng được công thức nhân: P(A ∩ B) = P(A)·P(B) = 0,8 · 0,7 = 0,56. Chữ "cả hai cùng" ứng với ' +
          'phép GIAO nên phải nhân, không được cộng. Chú ý kết quả 0,56 nhỏ hơn cả 0,8 lẫn 0,7 — điều này luôn ' +
          'đúng với biến cố giao và là cách kiểm tra nhanh rất hiệu quả.',
      },
      {
        prompt:
          'Vẫn với hai xạ thủ bắn độc lập có xác suất trúng lần lượt là 0,8 và 0,7. Tính xác suất để có ít nhất ' +
          'một người bắn trúng bia.',
        answer: { kind: 'numeric', value: 0.94 },
        explain:
          'Với dạng "ít nhất một", cách gọn nhất là đi qua biến cố đối "cả hai đều bắn trượt". Xác suất từng ' +
          'người trượt lần lượt là 1 − 0,8 = 0,2 và 1 − 0,7 = 0,3; vì hai biến cố gốc độc lập nên hai biến cố ' +
          'đối cũng độc lập, cho phép nhân: 0,2 · 0,3 = 0,06. Vậy xác suất cần tìm là 1 − 0,06 = 0,94. Kiểm chéo ' +
          'bằng công thức cộng: 0,8 + 0,7 − 0,56 = 0,94, khớp hoàn toàn.',
      },
      {
        prompt:
          'Tung một đồng xu cân đối và đồng chất ba lần liên tiếp. Tính xác suất để cả ba lần đều xuất hiện mặt sấp.',
        answer: { kind: 'numeric', value: 0.125 },
        explain:
          'Ba lần tung là ba phép thử tách rời, kết quả lần này không ảnh hưởng lần kia nên ba biến cố độc lập. ' +
          'Mỗi lần xác suất ra mặt sấp là 0,5, do đó xác suất cả ba lần đều sấp bằng 0,5 · 0,5 · 0,5 = 0,125, ' +
          'tức 1/8. Có thể kiểm lại bằng cách đếm: ba lần tung cho 2³ = 8 kết quả đồng khả năng, trong đó chỉ ' +
          'đúng một kết quả là sấp–sấp–sấp, cho 1/8. Hai cách tính khớp nhau.',
      },
      {
        prompt:
          'Hai máy hoạt động độc lập với nhau. Xác suất máy thứ nhất bị hỏng trong ngày là 0,1; xác suất máy ' +
          'thứ hai bị hỏng trong ngày là 0,05. Tính xác suất để trong ngày cả hai máy đều hoạt động tốt.',
        answer: { kind: 'numeric', value: 0.855 },
        explain:
          'Xác suất mỗi máy hoạt động tốt là phần bù của xác suất hỏng: 1 − 0,1 = 0,9 với máy thứ nhất và ' +
          '1 − 0,05 = 0,95 với máy thứ hai. Vì hai máy hoạt động độc lập nên hai biến cố "máy tốt" cũng độc lập, ' +
          'áp dụng công thức nhân: 0,9 · 0,95 = 0,855. Lỗi thường gặp là nhân thẳng hai xác suất hỏng rồi lấy ' +
          'phần bù, tức 1 − 0,1·0,05 = 0,995 — nhưng đó là xác suất để KHÔNG PHẢI cả hai cùng hỏng, tức vẫn cho ' +
          'phép một máy hỏng, một biến cố hoàn toàn khác.',
      },
      {
        prompt: 'Cho hai biến cố A và B độc lập với nhau. Khẳng định nào sau đây ĐÚNG?',
        choices: [
          { id: 'A', label: 'A và biến cố đối của B cũng độc lập với nhau' },
          { id: 'B', label: 'A và B chắc chắn xung khắc với nhau' },
          { id: 'C', label: 'Luôn có P(A ∪ B) = P(A) + P(B)' },
          { id: 'D', label: 'Luôn có P(A ∩ B) = 0' },
        ],
        answer: { kind: 'choice', correctIds: ['A'] },
        explain:
          'Tính độc lập được bảo toàn khi thay một biến cố bởi biến cố đối của nó: nếu A không ảnh hưởng tới ' +
          'việc B xảy ra thì nó cũng không ảnh hưởng tới việc B không xảy ra. Nhờ hệ quả này ta tính được ngay ' +
          'xác suất dạng "A xảy ra nhưng B không" bằng P(A)·[1 − P(B)]. Ba phương án còn lại đều nhầm độc lập ' +
          'với xung khắc: nếu P(A) và P(B) đều dương thì P(A ∩ B) = P(A)·P(B) > 0, nên A và B KHÔNG xung khắc ' +
          'và đẳng thức cộng rút gọn cũng không dùng được.',
      },
      {
        prompt:
          'Một hộp có 10 viên bi, trong đó có 4 viên màu đỏ. Rút ngẫu nhiên một viên, xem màu rồi TRẢ LẠI hộp, ' +
          'sau đó rút tiếp một viên nữa. Tính xác suất để cả hai lần đều rút được bi đỏ.',
        answer: { kind: 'numeric', value: 0.16 },
        explain:
          'Vì viên bi được TRẢ LẠI hộp nên trước mỗi lần rút, hộp luôn có đúng 10 viên với 4 viên đỏ; lần rút ' +
          'thứ nhất không làm thay đổi gì cho lần thứ hai, tức hai biến cố độc lập. Mỗi lần xác suất rút được bi ' +
          'đỏ là 4/10 = 0,4, nên xác suất cả hai lần đều đỏ là 0,4 · 0,4 = 0,16. Nếu đề nói rút KHÔNG hoàn lại ' +
          'thì hai lần rút không còn độc lập, phải tính theo xác suất có điều kiện và kết quả sẽ khác.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức nhân xác suất cho hai biến cố độc lập?',
        dap: 'P(A ∩ B) = P(A) · P(B). Chỉ dùng được khi A và B ĐỘC LẬP.',
      },
      {
        hoi: 'Khuôn tính xác suất "có ít nhất một" với các biến cố độc lập?',
        dap: '1 − [1 − P(A)]·[1 − P(B)] — đi qua biến cố đối "không cái nào xảy ra".',
      },
      {
        hoi: 'Hai biến cố độc lập có thể xung khắc không?',
        dap: 'Không, nếu cả hai có xác suất dương: khi đó P(A ∩ B) = P(A)·P(B) > 0 nên chúng cùng xảy ra được.',
      },
      {
        hoi: 'Rút bi có hoàn lại và không hoàn lại khác nhau thế nào về tính độc lập?',
        dap: 'Có hoàn lại: hai lần rút độc lập, được nhân xác suất. Không hoàn lại: không độc lập, phải dùng xác suất có điều kiện.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
