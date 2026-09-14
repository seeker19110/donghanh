// lessons/toan10c5.ts — Toán 10, Chương 5: Các số đặc trưng của mẫu số liệu KHÔNG ghép nhóm.
// Số liệu và tình huống tự soạn, KHÔNG chép ví dụ SGK.
// Phân biệt với Toán 11 chương 3 và Toán 12 chương 3: ở đây dữ liệu còn NGUYÊN từng giá trị rời
// rạc nên mọi đặc trưng đọc thẳng từ dãy đã sắp xếp, không cần công thức nội suy.
// Trạng thái `draft` — chờ người có chuyên môn Toán duyệt qua quy trình lessonReview.
import type { MathLesson } from '../lessonTypes.js'

const CHUONG = 'Các số đặc trưng của mẫu số liệu không ghép nhóm'

export const TOAN10_C5_LESSONS: MathLesson[] = [
  {
    id: 'toan10-c5-b1',
    grade: '10',
    chapterNumber: 5,
    chapterTitle: CHUONG,
    lessonNumber: 1,
    title: 'Số gần đúng và sai số',
    hook:
      'Bạn cầm thước dây đo chiều dài phòng học và đọc được 7,2 m. Một bạn khác đo lại, ra 7,25 m. ' +
      'Không ai sai cả — chiều dài THẬT của căn phòng là một con số mà không dụng cụ nào đọc ra trọn ' +
      'vẹn được. Vậy thay vì cãi nhau xem ai đúng, toán học hỏi câu khác hay hơn: con số ta ghi lại ' +
      'lệch khỏi sự thật nhiều nhất là bao nhiêu, và ghi bao nhiêu chữ số thì mới trung thực?',
    theory:
      'VÌ SAO PHẢI HỌC VỀ SỐ GẦN ĐÚNG\n' +
      'Rất nhiều đại lượng trong đời sống không bao giờ có mặt ở dạng một số viết hết được: chiều dài ' +
      'đo bằng thước, dân số một tỉnh, số π. Con số ta dùng khi đó là SỐ GẦN ĐÚNG, kí hiệu a; con số ' +
      'thật (không biết được) kí hiệu ā. Toán học không né tránh chuyện đó mà đo luôn khoảng cách ' +
      'giữa hai con số ấy.\n\n' +
      'SAI SỐ TUYỆT ĐỐI\n' +
      'Δa = |ā − a|.\n' +
      'Đây là khoảng cách thật giữa số gần đúng và số đúng. Trớ trêu ở chỗ: vì không biết ā nên ta ' +
      'cũng KHÔNG tính được Δa. Thứ ta làm được là chặn nó lại.\n\n' +
      'ĐỘ CHÍNH XÁC d\n' +
      'Nếu Δa ≤ d thì d gọi là độ chính xác của số gần đúng, viết gọn ā = a ± d.\n' +
      'Cách viết này nói đúng một điều: số thật nằm đâu đó trong đoạn [a − d; a + d], không hơn. d ' +
      'càng nhỏ thì lời hứa càng chặt. Chú ý d là một cái CHẶN TRÊN, không phải sai số thật.\n\n' +
      'SAI SỐ TƯƠNG ĐỐI\n' +
      'δa = Δa/|a| ≤ d/|a|, thường viết dưới dạng phần trăm.\n' +
      'VÌ SAO CẦN THÊM ĐẠI LƯỢNG NÀY: sai số tuyệt đối một mình không nói lên chất lượng của phép đo. ' +
      'Lệch 1 cm khi đo cái bút là thảm hoạ; lệch 1 cm khi đo sân bóng thì không ai bận tâm. Sai số ' +
      'tương đối so phần lệch với chính độ lớn của đại lượng, nên nó mới là thước đo ĐỘ TIN CẬY và nó ' +
      'không có đơn vị — nhờ vậy so sánh được hai phép đo của hai đại lượng khác nhau.\n\n' +
      'QUY TRÒN SỐ GẦN ĐÚNG\n' +
      'Quy tắc quy tròn quen thuộc: chữ số ngay sau hàng quy tròn nếu ≥ 5 thì tăng chữ số ở hàng quy ' +
      'tròn thêm 1, nếu < 5 thì giữ nguyên; mọi chữ số phía sau bỏ đi.\n' +
      'Nhưng quy tròn đến hàng NÀO mới đúng? Luật cho số gần đúng a có độ chính xác d: quy tròn a đến ' +
      'hàng thấp nhất mà d còn nhỏ hơn một đơn vị của hàng đó.\n' +
      'VÌ SAO: viết thêm một chữ số ở hàng mà bản thân d đã lớn hơn một đơn vị của hàng ấy là nói dối ' +
      'người đọc — chữ số đó hoàn toàn có thể sai. Ghi ít chữ số hơn sự thật thì phí thông tin, ghi ' +
      'nhiều hơn thì bịa. Luật trên chọn đúng ranh giới giữa hai điều đó.\n\n' +
      'BA LỖI HAY MẮC\n' +
      '— Nói "sai số của phép đo là d". Sai: d chỉ chặn trên sai số, sai số thật Δa có thể nhỏ hơn ' +
      'nhiều.\n' +
      '— Lấy sai số tương đối rồi gắn đơn vị vào. Nó là tỉ số nên không có đơn vị.\n' +
      '— Quy tròn xong rồi mới tính toán tiếp qua nhiều bước: sai số bị khuếch đại. Nên tính hết rồi ' +
      'mới quy tròn ở bước cuối.',
    animation: {
      title: 'Số đúng luôn nằm trong đoạn a ± d',
      description:
        'Một trục số nằm ngang. Điểm a được đánh dấu ở giữa. Hai vạch lùi ra hai bên đúng khoảng d ' +
        'xuất hiện, tạo thành một đoạn được tô sáng. Cuối cùng một dấu chấm hỏi đại diện cho số đúng ' +
        'hiện ra bên trong đoạn đó, nhắc rằng ta chỉ biết số đúng nằm trong đoạn chứ không biết nó ' +
        'đứng chính xác ở đâu.',
      viewBoxWidth: 360,
      viewBoxHeight: 180,
      durationMs: 6000,
      loop: true,
      shapes: [
        { kind: 'line', id: 'truc', x1: 20, y1: 100, x2: 340, y2: 100, stroke: 'muted' },
        {
          kind: 'rect',
          id: 'doan',
          x: 120,
          y: 86,
          w: 120,
          h: 28,
          rx: 4,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1800, opacity: 0 },
            { atMs: 2600, opacity: 0.4 },
            { atMs: 6000, opacity: 0.4 },
          ],
        },
        {
          kind: 'line',
          id: 'vachA',
          x1: 180,
          y1: 80,
          x2: 180,
          y2: 120,
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'line',
          id: 'vachTrai',
          x1: 120,
          y1: 84,
          x2: 120,
          y2: 116,
          stroke: 'primary',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1000, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'line',
          id: 'vachPhai',
          x1: 240,
          y1: 84,
          x2: 240,
          y2: 116,
          stroke: 'primary',
          strokeWidth: 2,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1000, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'label',
          id: 'nhanA',
          x: 180,
          y: 140,
          text: 'a',
          size: 15,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanTrai',
          x: 120,
          y: 140,
          text: 'a − d',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanPhai',
          x: 240,
          y: 140,
          text: 'a + d',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'soDung',
          x: 210,
          y: 72,
          text: 'ā ở đâu đó trong đây',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3600, opacity: 0 },
            { atMs: 4200, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
      ],
      captions: [
        { atMs: 1000, text: 'Lùi ra hai bên đúng khoảng d.' },
        { atMs: 2600, text: 'Mọi giá trị trong đoạn đều có thể là số đúng.' },
        { atMs: 4200, text: 'Ta chỉ biết ā nằm trong đoạn, không biết nó ở đâu.' },
      ],
    },
    workedExample: {
      problem:
        'Một tổ đo chiều dài đường chạy của sân trường và ghi được a = 132,457 m với độ chính xác ' +
        'd = 0,05 m. Hãy nêu đoạn chứa chiều dài thật, ước lượng sai số tương đối và quy tròn kết quả ' +
        'cho đúng mức tin cậy.',
      steps: [
        'Bước 1 — Viết lại kết quả đo: ā = 132,457 ± 0,05, nghĩa là chiều dài thật nằm trong đoạn ' +
          '[132,407; 132,507] mét.',
        'Bước 2 — Sai số tương đối không vượt quá d/|a| = 0,05/132,457 ≈ 0,00038, tức khoảng 0,038%. ' +
          'Con số bé xíu này cho thấy phép đo rất đáng tin so với độ dài đang đo.',
        'Bước 3 — Chọn hàng quy tròn. Xét hàng phần trăm: một đơn vị của hàng này là 0,01, mà ' +
          'd = 0,05 > 0,01 nên chữ số hàng phần trăm không đáng tin. Xét hàng phần mười: một đơn vị là ' +
          '0,1, và d = 0,05 < 0,1 — đây chính là hàng thấp nhất thoả điều kiện.',
        'Bước 4 — Quy tròn 132,457 đến hàng phần mười: chữ số ngay sau hàng phần mười là 5 nên tăng ' +
          'chữ số 4 lên thành 5, được 132,5.',
        'Bước 5 — Kết luận và diễn giải: ghi 132,5 m là trung thực; nếu cố ghi 132,457 m thì hai chữ ' +
          'số cuối chỉ là trang trí, vì bản thân độ chính xác đã lớn gấp năm lần một đơn vị hàng phần ' +
          'trăm rồi.',
      ],
      answer: 'ā ∈ [132,407; 132,507]; δa ≲ 0,038%; quy tròn được 132,5 m.',
    },
    checkQuestions: [
      {
        prompt:
          'Số đúng của một đại lượng là ā = 4,37. Người ta dùng số gần đúng a = 4,4. Tính sai số ' +
          'tuyệt đối Δa.',
        answer: { kind: 'numeric', value: 0.03 },
        explain:
          'Sai số tuyệt đối theo định nghĩa là khoảng cách giữa số đúng và số gần đúng: ' +
          'Δa = |ā − a| = |4,37 − 4,4| = 0,03. Ở bài này ta tính được Δa vì đề cho sẵn số đúng — tình ' +
          'huống hiếm gặp trong thực tế, nơi ā luôn nằm ngoài tầm với và ta chỉ chặn được Δa bằng độ ' +
          'chính xác d. Lưu ý phải lấy giá trị tuyệt đối, sai số không bao giờ mang dấu âm.',
      },
      {
        prompt:
          'Một số gần đúng a = 250 được cho kèm độ chính xác d = 5. Sai số tương đối của phép đo này ' +
          'không vượt quá bao nhiêu? (Nhập dưới dạng số thập phân, ví dụ 0,01 cho 1%.)',
        answer: { kind: 'numeric', value: 0.02 },
        explain:
          'Sai số tương đối δa = Δa/|a|, mà Δa ≤ d nên δa ≤ d/|a| = 5/250 = 0,02, tức 2%. Con số này ' +
          'không mang đơn vị vì nó là tỉ số giữa hai đại lượng cùng đơn vị, và chính điều đó khiến nó ' +
          'so sánh được giữa các phép đo khác nhau: lệch 5 trên nền 250 là 2%, nhưng lệch 5 trên nền ' +
          '20 đã là 25% — cùng một sai số tuyệt đối mà chất lượng khác hẳn.',
      },
      {
        prompt:
          'Cho số gần đúng a = 132,457 với độ chính xác d = 0,05. Quy tròn a theo đúng quy tắc quy ' +
          'tròn số gần đúng thì được số nào?',
        answer: { kind: 'numeric', value: 132.5 },
        explain:
          'Luật là quy tròn đến hàng thấp nhất mà d còn nhỏ hơn một đơn vị của hàng đó. Với hàng phần ' +
          'trăm, một đơn vị bằng 0,01 và d = 0,05 lớn hơn nên không đạt; với hàng phần mười, một đơn ' +
          'vị bằng 0,1 và d = 0,05 nhỏ hơn nên đạt. Quy tròn 132,457 đến hàng phần mười: chữ số kế ' +
          'tiếp là 5 nên làm tròn lên, được 132,5. Giữ lại nhiều chữ số hơn là tự nhận một độ chính ' +
          'xác mà phép đo không hề có.',
      },
      {
        prompt:
          'Một mảnh đất có diện tích đo được là 48 m² với độ chính xác 0,6 m². Diện tích thật lớn ' +
          'nhất có thể là bao nhiêu m²? (Chỉ nhập số.)',
        answer: { kind: 'numeric', value: 48.6 },
        explain:
          'Cách viết ā = a ± d nghĩa là số đúng nằm trong đoạn [a − d; a + d] = [47,4; 48,6]. Do đó ' +
          'giá trị lớn nhất mà diện tích thật có thể nhận là 48 + 0,6 = 48,6 m². Đây là lí do ký hiệu ' +
          '± hữu ích: nó không cho ta một con số mà cho ta một KHOẢNG, và mọi kết luận về sau chỉ được ' +
          'phép nói những điều đúng cho toàn bộ khoảng đó.',
      },
      {
        prompt:
          'Phép đo P cho kết quả 2 m với sai số tuyệt đối không quá 0,02 m; phép đo Q cho kết quả ' +
          '500 m với sai số tuyệt đối không quá 0,2 m. Phép đo nào chính xác hơn và vì sao? Chọn đáp ' +
          'án đúng.',
        choices: [
          { id: 'A', label: 'Phép đo P, vì sai số tuyệt đối của nó nhỏ hơn (0,02 < 0,2)' },
          {
            id: 'B',
            label:
              'Phép đo Q, vì sai số tương đối của nó nhỏ hơn: 0,2/500 = 0,04% so với 0,02/2 = 1%',
          },
          { id: 'C', label: 'Hai phép đo chính xác như nhau vì cùng đo chiều dài' },
          { id: 'D', label: 'Không so sánh được vì hai đại lượng có độ lớn khác nhau' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Sai số tuyệt đối một mình không đủ để xếp hạng chất lượng phép đo, vì nó chưa tính đến độ ' +
          'lớn của thứ đang đo. Quy về sai số tương đối: phép đo P lệch tới 0,02/2 = 0,01 tức 1% chiều ' +
          'dài, còn phép đo Q chỉ lệch 0,2/500 = 0,0004 tức 0,04%. Vậy Q chính xác hơn hẳn dù sai số ' +
          'tuyệt đối của nó lớn gấp mười lần. Phương án A là cái bẫy phổ biến nhất của bài này; C và D ' +
          'sai vì chính sai số tương đối được sinh ra để so sánh được các phép đo có độ lớn khác nhau.',
      },
    ],
    srsCards: [
      {
        hoi: 'Sai số tuyệt đối và độ chính xác khác nhau ở chỗ nào?',
        dap: 'Δa = |ā − a| là sai số thật (không tính được vì không biết ā); d là số chặn trên: Δa ≤ d.',
      },
      {
        hoi: 'Công thức sai số tương đối và vì sao cần nó?',
        dap: 'δa = Δa/|a| ≤ d/|a|. Nó không có đơn vị nên so sánh được độ tin cậy của các phép đo khác nhau.',
      },
      {
        hoi: 'Quy tròn số gần đúng a có độ chính xác d đến hàng nào?',
        dap: 'Hàng thấp nhất mà d còn nhỏ hơn một đơn vị của hàng đó — ghi thêm chữ số là bịa độ chính xác.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan10-c5-b2',
    grade: '10',
    chapterNumber: 5,
    chapterTitle: CHUONG,
    lessonNumber: 2,
    title: 'Số trung bình, trung vị, tứ phân vị và mốt của mẫu số liệu không ghép nhóm',
    hook:
      'Lớp 10A khảo sát thời gian đi từ nhà đến trường. Hầu hết các bạn mất khoảng mười mấy phút, ' +
      'riêng một bạn ở huyện xa mất tới gần một tiếng. Khi bạn lớp trưởng báo cáo "trung bình cả lớp ' +
      '16 phút", nhiều bạn thấy vô lí vì chính mình đi có 10 phút. Không ai tính sai cả — chỉ là một ' +
      'con số trung tâm không bao giờ đủ để kể hết câu chuyện.',
    theory:
      'MẪU SỐ LIỆU KHÔNG GHÉP NHÓM\n' +
      'Là mẫu mà ta còn giữ được TỪNG giá trị cụ thể, chẳng hạn 9 con số thời gian đi học của 9 bạn. ' +
      'Khác hẳn mẫu ghép nhóm (lớp 11, lớp 12) chỉ còn tần số của từng khoảng — ở đây không cần nội ' +
      'suy gì cả, mọi đặc trưng đọc thẳng từ dãy đã sắp xếp.\n\n' +
      'SỐ TRUNG BÌNH\n' +
      'x̄ = (x₁ + x₂ + … + xₙ)/n.\n' +
      'Hiểu theo nghĩa vật lí, x̄ là điểm cân bằng của dãy số liệu: tổng các độ lệch về hai phía của ' +
      'nó triệt tiêu nhau. Chính vì phải cân với MỌI giá trị nên một giá trị lớn bất thường đủ sức kéo ' +
      'x̄ đi xa.\n\n' +
      'TRUNG VỊ Mₑ\n' +
      'Sắp mẫu theo thứ tự không giảm rồi:\n' +
      '— n lẻ: Mₑ là số đứng ở vị trí (n + 1)/2, tức số chính giữa.\n' +
      '— n chẵn: Mₑ là trung bình cộng của hai số đứng ở vị trí n/2 và n/2 + 1.\n' +
      'Trung vị chỉ quan tâm ai đứng giữa hàng, không quan tâm người đứng cuối hàng cao bao nhiêu. Nhờ ' +
      'vậy nó BỀN VỮNG với giá trị bất thường, trong khi số trung bình thì không.\n\n' +
      'TỨ PHÂN VỊ Q₁, Q₂, Q₃\n' +
      'Q₂ chính là trung vị. Sau khi xác định Q₂, chia dãy đã sắp xếp thành nửa dưới và nửa trên — nếu ' +
      'n lẻ thì KHÔNG tính số chính giữa vào nửa nào cả. Khi đó Q₁ là trung vị của nửa dưới, Q₃ là ' +
      'trung vị của nửa trên.\n' +
      'Ba mốc này chia mẫu thành bốn phần, mỗi phần chứa khoảng 25% số giá trị, nên chúng cho ta bức ' +
      'tranh về cách số liệu trải ra chứ không chỉ một điểm trung tâm.\n\n' +
      'MỐT M₀\n' +
      'Là giá trị xuất hiện nhiều lần nhất trong mẫu. Một mẫu có thể có nhiều mốt, hoặc không có mốt ' +
      'nào đáng kể nếu mọi giá trị đều khác nhau. Mốt là đặc trưng DUY NHẤT dùng được cho dữ liệu định ' +
      'tính (màu áo được chọn nhiều nhất, cỡ giày bán chạy nhất) vì nó không cần phép cộng.\n\n' +
      'CHỌN ĐẶC TRƯNG NÀO\n' +
      '— Dữ liệu khá đối xứng, không có giá trị lạ: dùng x̄, vì nó tận dụng mọi số liệu.\n' +
      '— Dữ liệu lệch hoặc có giá trị bất thường (thu nhập, thời gian chờ): dùng Mₑ.\n' +
      '— Dữ liệu định tính hoặc muốn biết "phương án phổ biến nhất": dùng M₀.\n\n' +
      'HAI LỖI HAY MẮC\n' +
      '— Quên sắp xếp trước khi tìm trung vị và tứ phân vị. Mọi công thức trên đều giả định dãy đã sắp ' +
      'xếp không giảm.\n' +
      '— Với n lẻ, vẫn nhét số chính giữa vào cả hai nửa khi tìm Q₁ và Q₃, làm hai mốc này bị kéo về ' +
      'phía trung vị.',
    workedExample: {
      problem:
        'Số buổi đến thư viện trong một tháng của 10 bạn lần lượt là: 2; 5; 3; 8; 5; 6; 4; 5; 7; 5. ' +
        'Tìm số trung bình, trung vị, hai tứ phân vị Q₁, Q₃ và mốt.',
      steps: [
        'Bước 1 — Sắp xếp không giảm: 2; 3; 4; 5; 5; 5; 5; 6; 7; 8. Đây là bước bắt buộc, bỏ qua là ' +
          'sai ngay từ đầu.',
        'Bước 2 — Số trung bình: tổng bằng 2 + 3 + 4 + 5 + 5 + 5 + 5 + 6 + 7 + 8 = 50, chia cho n = 10 ' +
          'được x̄ = 5 (buổi).',
        'Bước 3 — Trung vị: n = 10 chẵn nên lấy trung bình cộng hai số ở vị trí thứ 5 và thứ 6, tức ' +
          '(5 + 5)/2 = 5.',
        'Bước 4 — Tứ phân vị: nửa dưới là năm số đầu 2; 3; 4; 5; 5 nên Q₁ là số chính giữa của nó, ' +
          'bằng 4. Nửa trên là 5; 5; 6; 7; 8 nên Q₃ = 6.',
        'Bước 5 — Mốt: giá trị 5 xuất hiện 4 lần, nhiều hơn mọi giá trị khác, nên M₀ = 5.',
        'Bước 6 — Đọc kết quả: ba đặc trưng trung tâm đều bằng 5 nên mẫu này khá cân đối; khoảng cách ' +
          'từ Q₁ = 4 đến Q₃ = 6 cho biết một nửa số bạn đi thư viện từ 4 đến 6 buổi mỗi tháng.',
      ],
      answer: 'x̄ = 5; Mₑ = 5; Q₁ = 4; Q₃ = 6; M₀ = 5.',
    },
    checkQuestions: [
      {
        prompt:
          'Thời gian đi từ nhà đến trường (phút) của 9 bạn lớp 10A là: 5; 8; 10; 10; 12; 15; 18; 20; ' +
          '46. Tính số trung bình x̄.',
        answer: { kind: 'numeric', value: 16 },
        explain:
          'Cộng toàn bộ rồi chia cho cỡ mẫu: (5 + 8 + 10 + 10 + 12 + 15 + 18 + 20 + 46)/9 = 144/9 = 16 ' +
          'phút. Đáng chú ý là chỉ có hai bạn đi lâu hơn 16 phút, nghĩa là con số trung bình này không ' +
          'đại diện cho đa số — bạn đi mất 46 phút đã một mình kéo nó lên. Đó chính là điểm yếu cố hữu ' +
          'của số trung bình: nó phải cân với mọi giá trị, kể cả giá trị lạc lõng.',
      },
      {
        prompt:
          'Vẫn mẫu trên (5; 8; 10; 10; 12; 15; 18; 20; 46 — đã sắp xếp, n = 9). Tính trung vị Mₑ.',
        answer: { kind: 'numeric', value: 12 },
        explain:
          'Dãy đã sắp xếp không giảm và n = 9 là số lẻ, nên trung vị là số đứng ở vị trí (9 + 1)/2 = 5, ' +
          'tức giá trị 12 phút. So sánh với số trung bình 16 phút cho thấy rõ sự khác nhau về bản chất: ' +
          'trung vị chỉ hỏi "ai đứng giữa hàng" nên giá trị 46 phút dù lớn đến đâu cũng chỉ được tính ' +
          'là một người đứng cuối, không kéo được Mₑ đi.',
      },
      {
        prompt: 'Vẫn mẫu 5; 8; 10; 10; 12; 15; 18; 20; 46 (n = 9). Tính tứ phân vị thứ nhất Q₁.',
        answer: { kind: 'numeric', value: 9 },
        explain:
          'Vì n lẻ nên khi chia đôi ta KHÔNG tính số chính giữa (12) vào nửa nào. Nửa dưới gồm bốn số ' +
          '5; 8; 10; 10; số phần tử là chẵn nên Q₁ bằng trung bình cộng hai số giữa của nửa đó: ' +
          '(8 + 10)/2 = 9 phút. Lỗi thường gặp là kéo luôn giá trị 12 vào nửa dưới, khi đó Q₁ thành 10 ' +
          '— sai vì trung vị không thuộc về nửa nào cả.',
      },
      {
        prompt: 'Vẫn mẫu 5; 8; 10; 10; 12; 15; 18; 20; 46 (n = 9). Tính tứ phân vị thứ ba Q₃.',
        answer: { kind: 'numeric', value: 19 },
        explain:
          'Nửa trên gồm bốn số 15; 18; 20; 46, cũng có số phần tử chẵn nên Q₃ = (18 + 20)/2 = 19 phút. ' +
          'Đặt cạnh Q₁ = 9, ta đọc được một điều mà số trung bình không nói: một nửa số bạn ở giữa đi ' +
          'học mất từ 9 đến 19 phút. Chú ý giá trị 46 tuy rất lớn nhưng cũng chỉ đóng vai trò một số ' +
          'trong nửa trên, không làm Q₃ phồng lên.',
      },
      {
        prompt: 'Vẫn mẫu 5; 8; 10; 10; 12; 15; 18; 20; 46. Tìm mốt M₀ của mẫu này.',
        answer: { kind: 'numeric', value: 10 },
        explain:
          'Mốt là giá trị xuất hiện nhiều lần nhất. Ở đây chỉ giá trị 10 xuất hiện hai lần, mọi giá ' +
          'trị còn lại đều xuất hiện đúng một lần, nên M₀ = 10 phút. Mốt trả lời câu hỏi "con số nào ' +
          'gặp nhiều nhất", khác hẳn trung bình (điểm cân bằng) và trung vị (người đứng giữa hàng) — ' +
          'ba đặc trưng cùng đo xu thế trung tâm nhưng theo ba nghĩa hoàn toàn khác nhau.',
      },
      {
        prompt:
          'Khi báo cáo về thu nhập của người dân một xã, trong đó có vài hộ kinh doanh lớn thu nhập ' +
          'cao vượt trội, nên dùng đặc trưng nào để mô tả mức thu nhập điển hình? Chọn đáp án đúng.',
        choices: [
          { id: 'A', label: 'Số trung bình, vì nó dùng hết mọi số liệu nên luôn chính xác nhất' },
          {
            id: 'B',
            label: 'Trung vị, vì nó không bị vài giá trị lớn bất thường kéo lệch',
          },
          { id: 'C', label: 'Giá trị lớn nhất, vì nó cho thấy tiềm năng của xã' },
          { id: 'D', label: 'Không đặc trưng nào dùng được khi có giá trị bất thường' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Số trung bình phải cân bằng với mọi giá trị nên chỉ cần vài hộ thu nhập rất cao là nó bị ' +
          'kéo lên trên mức của đại đa số, dẫn tới một con số mà hầu như không ai đạt tới — đúng như ' +
          'trường hợp mẫu thời gian đi học ở trên. Trung vị chỉ phụ thuộc thứ tự đứng nên mấy hộ đó vẫn ' +
          'chỉ là mấy người cuối hàng, không làm lệch kết quả. Phương án A nhầm "dùng hết số liệu" với ' +
          '"đại diện tốt"; C không phải đặc trưng trung tâm; D sai vì trung vị sinh ra chính cho tình ' +
          'huống này.',
      },
    ],
    srsCards: [
      {
        hoi: 'Trung vị của mẫu không ghép nhóm tìm thế nào?',
        dap: 'Sắp xếp không giảm; n lẻ lấy số ở vị trí (n+1)/2, n chẵn lấy trung bình hai số ở vị trí n/2 và n/2+1.',
      },
      {
        hoi: 'Khi n lẻ, tìm Q₁ và Q₃ cần lưu ý gì?',
        dap: 'Không tính số chính giữa (trung vị) vào nửa nào; Q₁ là trung vị nửa dưới, Q₃ là trung vị nửa trên.',
      },
      {
        hoi: 'Khi nào nên dùng trung vị thay cho số trung bình?',
        dap: 'Khi mẫu lệch hoặc có giá trị bất thường — trung vị bền vững, số trung bình bị kéo theo giá trị lạ.',
      },
      {
        hoi: 'Mốt có gì đặc biệt so với hai đặc trưng còn lại?',
        dap: 'Là giá trị xuất hiện nhiều nhất; dùng được cho cả dữ liệu định tính vì không cần phép cộng.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan10-c5-b3',
    grade: '10',
    chapterNumber: 5,
    chapterTitle: CHUONG,
    lessonNumber: 3,
    title: 'Khoảng biến thiên, phương sai, độ lệch chuẩn và giá trị ngoại lệ',
    hook:
      'Hai bạn cùng có điểm trung bình môn Toán là 8,0. Một bạn điểm nào cũng 8; bạn kia có bài 4 ' +
      'có bài 10. Cùng một con số trung bình mà thầy cô nhìn vào lại thấy hai câu chuyện hoàn toàn ' +
      'khác nhau về sự ổn định. Muốn nói được sự khác biệt đó thành con số, ta cần các đại lượng đo ' +
      'ĐỘ PHÂN TÁN.',
    theory:
      'KHOẢNG BIẾN THIÊN\n' +
      'R = giá trị lớn nhất − giá trị nhỏ nhất.\n' +
      'Đo bề rộng toàn bộ dải số liệu, tính trong vài giây. Nhược điểm: chỉ phụ thuộc đúng hai giá ' +
      'trị ở hai đầu, nên một số liệu lạc lõng cũng đủ làm R phồng lên và che mất sự đồng đều của phần ' +
      'còn lại.\n\n' +
      'KHOẢNG TỨ PHÂN VỊ\n' +
      'Δ_Q = Q₃ − Q₁.\n' +
      'Đo bề rộng của 50% số liệu Ở GIỮA. Vì đã cắt bỏ 25% nhỏ nhất và 25% lớn nhất trước khi đo nên ' +
      'nó gần như miễn nhiễm với giá trị bất thường — đó là lí do nó được ưa dùng hơn R khi dữ liệu ' +
      'nghi có số liệu lạ.\n\n' +
      'PHƯƠNG SAI VÀ ĐỘ LỆCH CHUẨN\n' +
      's² = (1/n)·[(x₁ − x̄)² + (x₂ − x̄)² + … + (xₙ − x̄)²];   s = √(s²).\n' +
      'Đọc từng mảnh: (xᵢ − x̄) là độ lệch của một giá trị so với trung bình; phải BÌNH PHƯƠNG vì tổng ' +
      'các độ lệch có dấu luôn bằng 0 (chính là tính chất điểm cân bằng của x̄), cộng thẳng thì mẫu nào ' +
      'cũng ra 0; chia cho n để lấy mức lệch trung bình.\n' +
      'VÌ SAO CÒN CẦN s: phương sai mang đơn vị BÌNH PHƯƠNG (số liệu tính bằng phút thì s² tính bằng ' +
      'phút bình phương — không diễn giải được). Lấy căn đưa đơn vị về đúng đơn vị gốc, nhờ đó s đặt ' +
      'cạnh x̄ so sánh được ngay.\n' +
      'Ý nghĩa: s càng nhỏ thì số liệu càng bám sát trung bình; s = 0 khi và chỉ khi mọi giá trị bằng ' +
      'nhau.\n\n' +
      'GIÁ TRỊ NGOẠI LỆ\n' +
      'Giá trị x của mẫu bị coi là ngoại lệ nếu\n' +
      'x < Q₁ − 1,5·Δ_Q  hoặc  x > Q₃ + 1,5·Δ_Q.\n' +
      'Hai mốc Q₁ − 1,5Δ_Q và Q₃ + 1,5Δ_Q là hai "hàng rào"; nằm ngoài rào thì giá trị đó lệch xa phần ' +
      'đông một cách đáng ngờ. Hệ số 1,5 là một quy ước thống kê đủ rộng để không bắt oan, đủ chặt để ' +
      'không bỏ sót.\n' +
      'RẤT QUAN TRỌNG: phát hiện ngoại lệ KHÔNG có nghĩa là được phép xoá nó. Ngoại lệ có thể do ghi ' +
      'nhầm số liệu (thì sửa), nhưng cũng có thể là một sự thật quan trọng nhất của mẫu — bạn học sinh ' +
      'nhà ở xa thật sự tồn tại. Việc đúng đắn là tách ra xem xét và nói rõ trong báo cáo.\n\n' +
      'HAI LỖI HAY MẮC\n' +
      '— Gọi phương sai là độ lệch chuẩn (quên lấy căn): hai đại lượng khác nhau cả về giá trị lẫn ' +
      'đơn vị.\n' +
      '— Kết luận "mẫu A tốt hơn mẫu B" chỉ vì s nhỏ hơn. Độ lệch chuẩn nói về sự ĐỀU ĐẶN, phải đọc ' +
      'cùng với số trung bình mới kết luận được tốt hay xấu.',
    workedExample: {
      problem:
        'Số quyển vở bán được mỗi ngày của một quầy tạp hoá trong 8 ngày là: 2; 4; 4; 4; 5; 5; 7; 9. ' +
        'Tính khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn và xét xem mẫu có giá ' +
        'trị ngoại lệ không.',
      steps: [
        'Bước 1 — Dãy đã sắp xếp không giảm. Khoảng biến thiên R = 9 − 2 = 7 (quyển).',
        'Bước 2 — Tứ phân vị: n = 8 chẵn nên nửa dưới là 2; 4; 4; 4 và nửa trên là 5; 5; 7; 9. Vậy ' +
          'Q₁ = (4 + 4)/2 = 4 và Q₃ = (5 + 7)/2 = 6, suy ra Δ_Q = 6 − 4 = 2.',
        'Bước 3 — Số trung bình: (2 + 4 + 4 + 4 + 5 + 5 + 7 + 9)/8 = 40/8 = 5 (quyển).',
        'Bước 4 — Bình phương các độ lệch so với 5: 9; 1; 1; 1; 0; 0; 4; 16. Tổng bằng 32.',
        'Bước 5 — Phương sai s² = 32/8 = 4, độ lệch chuẩn s = √4 = 2 (quyển).',
        'Bước 6 — Hàng rào ngoại lệ: mốc dưới Q₁ − 1,5Δ_Q = 4 − 3 = 1, mốc trên Q₃ + 1,5Δ_Q = 6 + 3 = 9. ' +
          'Giá trị nhỏ nhất 2 vẫn lớn hơn 1 và giá trị lớn nhất 9 không vượt quá 9, nên mẫu KHÔNG có ' +
          'giá trị ngoại lệ.',
      ],
      answer: 'R = 7; Δ_Q = 2; x̄ = 5; s² = 4; s = 2; không có giá trị ngoại lệ.',
    },
    checkQuestions: [
      {
        prompt:
          'Số quyển vở bán mỗi ngày trong 8 ngày: 2; 4; 4; 4; 5; 5; 7; 9. Tính khoảng biến thiên R.',
        answer: { kind: 'numeric', value: 7 },
        explain:
          'Khoảng biến thiên là hiệu giữa giá trị lớn nhất và nhỏ nhất: R = 9 − 2 = 7 quyển. Đại lượng ' +
          'này cho biết toàn bộ số liệu trải trên một dải rộng 7 quyển, nhưng nó chỉ nhìn vào đúng hai ' +
          'con số ở hai đầu nên không nói gì về việc sáu giá trị còn lại chụm hay tản — đó là lí do ' +
          'phải học thêm các đại lượng khác trong bài này.',
      },
      {
        prompt: 'Vẫn mẫu 2; 4; 4; 4; 5; 5; 7; 9 (n = 8). Tính khoảng tứ phân vị Δ_Q.',
        answer: { kind: 'numeric', value: 2 },
        explain:
          'Vì n = 8 chẵn nên nửa dưới là bốn số đầu 2; 4; 4; 4 cho Q₁ = (4 + 4)/2 = 4, nửa trên là ' +
          '5; 5; 7; 9 cho Q₃ = (5 + 7)/2 = 6. Do đó Δ_Q = 6 − 4 = 2 quyển. So với R = 7, con số 2 cho ' +
          'thấy một nửa số ngày ở giữa rất chụm nhau; phần lớn bề rộng của mẫu là do hai ngày ở hai ' +
          'cực tạo ra.',
      },
      {
        prompt: 'Vẫn mẫu 2; 4; 4; 4; 5; 5; 7; 9, có số trung bình x̄ = 5. Tính phương sai s².',
        answer: { kind: 'numeric', value: 4 },
        explain:
          'Bình phương từng độ lệch so với x̄ = 5: (2−5)² = 9; (4−5)² = 1 (ba lần); (5−5)² = 0 (hai ' +
          'lần); (7−5)² = 4; (9−5)² = 16. Tổng bằng 9 + 1 + 1 + 1 + 0 + 0 + 4 + 16 = 32, chia cho n = 8 ' +
          'được s² = 4. Phải bình phương chứ không cộng thẳng độ lệch, vì tổng các độ lệch có dấu luôn ' +
          'bằng 0 với mọi mẫu nên chẳng đo được gì.',
      },
      {
        prompt: 'Vẫn mẫu trên, biết phương sai s² = 4. Tính độ lệch chuẩn s (chỉ nhập số).',
        answer: { kind: 'numeric', value: 2 },
        explain:
          'Độ lệch chuẩn là căn bậc hai của phương sai: s = √4 = 2 quyển. Bước lấy căn không phải hình ' +
          'thức: phương sai mang đơn vị "quyển bình phương" nên không diễn giải trực tiếp được, còn s ' +
          'cùng đơn vị với số liệu nên đặt cạnh trung bình 5 quyển ta đọc ngay được rằng mỗi ngày số ' +
          'vở bán ra dao động điển hình khoảng 2 quyển quanh mức 5.',
      },
      {
        prompt:
          'Thời gian đi học (phút) của 9 bạn có Q₁ = 9 và Q₃ = 19. Tính mốc trên của hàng rào ngoại ' +
          'lệ, tức giá trị Q₃ + 1,5·Δ_Q.',
        answer: { kind: 'numeric', value: 34 },
        explain:
          'Trước hết Δ_Q = Q₃ − Q₁ = 19 − 9 = 10 phút. Mốc trên của hàng rào là ' +
          'Q₃ + 1,5·Δ_Q = 19 + 1,5·10 = 19 + 15 = 34 phút. Mọi giá trị lớn hơn 34 bị coi là ngoại lệ — ' +
          'chẳng hạn bạn đi mất 46 phút. Nhớ rằng phải nhân 1,5 với KHOẢNG tứ phân vị Δ_Q chứ không ' +
          'phải với Q₃; nhầm chỗ này là lỗi tính toán phổ biến nhất của phần giá trị ngoại lệ.',
      },
      {
        prompt:
          'Trong một mẫu khảo sát thời gian đi học, phát hiện giá trị 46 phút là giá trị ngoại lệ. ' +
          'Cách xử lí nào là đúng đắn nhất? Chọn đáp án đúng.',
        choices: [
          { id: 'A', label: 'Xoá ngay giá trị đó khỏi mẫu để các đặc trưng đẹp hơn' },
          {
            id: 'B',
            label:
              'Kiểm tra lại xem có ghi nhầm không; nếu là số liệu thật thì giữ lại, tách ra phân tích ' +
              'riêng và nói rõ trong báo cáo',
          },
          { id: 'C', label: 'Thay giá trị đó bằng số trung bình của mẫu' },
          { id: 'D', label: 'Bỏ toàn bộ mẫu và khảo sát lại từ đầu' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Hàng rào Q₁ − 1,5Δ_Q và Q₃ + 1,5Δ_Q chỉ là công cụ ĐÁNH DẤU những giá trị đáng để xem lại, ' +
          'không phải lệnh xoá. Một ngoại lệ có thể sinh ra do ghi nhầm đơn vị hay gõ sai — trường hợp ' +
          'đó thì sửa; nhưng cũng hoàn toàn có thể là sự thật quan trọng nhất của mẫu, chẳng hạn thật ' +
          'sự có bạn nhà ở xa. Xoá hay thay số liệu thật (phương án A và C) là bóp méo dữ liệu để ' +
          'chiều kết quả mong muốn; còn bỏ cả mẫu (D) thì lãng phí và không giải quyết được gì.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức phương sai của mẫu không ghép nhóm?',
        dap: 's² = (1/n)·Σ(xᵢ − x̄)²; độ lệch chuẩn s = √(s²) để đưa đơn vị về đúng đơn vị gốc.',
      },
      {
        hoi: 'Khi nào một giá trị x bị coi là ngoại lệ?',
        dap: 'Khi x < Q₁ − 1,5·Δ_Q hoặc x > Q₃ + 1,5·Δ_Q, với Δ_Q = Q₃ − Q₁.',
      },
      {
        hoi: 'Vì sao khoảng tứ phân vị đáng tin hơn khoảng biến thiên khi có giá trị lạ?',
        dap: 'Vì Δ_Q chỉ đo 50% giá trị ở giữa, đã cắt bỏ 25% nhỏ nhất và 25% lớn nhất nên không bị kéo lệch.',
      },
      {
        hoi: 'Phát hiện giá trị ngoại lệ thì làm gì?',
        dap: 'Kiểm tra lỗi ghi chép; nếu là số liệu thật thì giữ, tách phân tích riêng và ghi rõ — không tự ý xoá.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
