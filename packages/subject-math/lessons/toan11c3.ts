// lessons/toan11c3.ts — Toán 11, Chương 3: Các số đặc trưng đo xu thế trung tâm của mẫu số liệu
// GHÉP NHÓM. Số liệu và tình huống tự soạn, KHÔNG chép ví dụ SGK.
// Đây là nơi công thức nội suy tứ phân vị/trung vị được dạy LẦN ĐẦU; Toán 12 chương 3 dùng lại
// đúng công thức này cho phần "độ phân tán".
// Trạng thái `draft` — chờ người có chuyên môn Toán duyệt qua quy trình lessonReview.
import type { MathLesson } from '../lessonTypes.js'

const CHUONG = 'Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm'

export const TOAN11_C3_LESSONS: MathLesson[] = [
  {
    id: 'toan11-c3-b1',
    grade: '11',
    chapterNumber: 3,
    chapterTitle: CHUONG,
    lessonNumber: 1,
    title: 'Mẫu số liệu ghép nhóm và giá trị đại diện của nhóm',
    hook:
      'Khi làm phiếu khảo sát "mỗi ngày bạn dùng điện thoại bao nhiêu phút", ban tổ chức nhận ra ' +
      'không mấy ai chịu ghi con số chính xác, nhưng gần như ai cũng vui vẻ tích vào ô "từ 40 đến ' +
      'dưới 50 phút". Đổi lấy sự hợp tác đó, ta chấp nhận mất chi tiết từng người. Câu hỏi của cả ' +
      'chương này là: với phần thông tin còn lại, ta còn tính được những gì?',
    theory:
      'BẢNG TẦN SỐ GHÉP NHÓM\n' +
      'Thay vì liệt kê từng giá trị, ta chia trục số thành các NHÓM (còn gọi là lớp) liên tiếp, thường ' +
      'viết dạng nửa khoảng [a; b), rồi chỉ ghi lại TẦN SỐ của mỗi nhóm — tức có bao nhiêu giá trị rơi ' +
      'vào nhóm đó.\n' +
      'VÌ SAO DÙNG NỬA KHOẢNG [a; b): để các nhóm phủ kín trục số mà không chồng lên nhau. Nếu viết ' +
      '[40; 50] rồi [50; 60] thì giá trị đúng bằng 50 không biết tính cho nhóm nào — một giá trị chỉ ' +
      'được đếm đúng một lần.\n' +
      'ĐỘ RỘNG NHÓM là b − a. Thông thường ta chọn các nhóm cùng độ rộng cho dễ so sánh và dễ vẽ biểu ' +
      'đồ.\n\n' +
      'CÁCH GHÉP NHÓM MỘT MẪU SỐ LIỆU\n' +
      '1. Tìm giá trị nhỏ nhất và lớn nhất để biết dải số liệu.\n' +
      '2. Chọn số nhóm (thường 5 đến 10) rồi suy ra độ rộng sao cho các nhóm phủ hết dải.\n' +
      '3. Đếm số giá trị rơi vào từng nhóm.\n' +
      'Chọn ít nhóm quá thì bức tranh bị bẹt, mất hết chi tiết; chọn nhiều nhóm quá thì mỗi nhóm chỉ ' +
      'còn vài giá trị, bảng trở nên lởm chởm và ngẫu nhiên. Đây là một lựa chọn có đánh đổi, không ' +
      'có đáp án duy nhất.\n\n' +
      'GIÁ TRỊ ĐẠI DIỆN CỦA NHÓM\n' +
      'Với nhóm [a; b), giá trị đại diện là TRUNG ĐIỂM x = (a + b)/2, và ta coi như cả f giá trị trong ' +
      'nhóm đều bằng x.\n' +
      'VÌ SAO CHỌN TRUNG ĐIỂM: ta đã mất vị trí thật của từng giá trị, nên phải chọn một điểm thay thế. ' +
      'Giả định tự nhiên nhất là các giá trị RẢI ĐỀU trong nhóm; khi đó điểm chính giữa là điểm làm ' +
      'tổng sai lệch nhỏ nhất. Mọi kết quả tính từ giá trị đại diện vì thế đều là GIÁ TRỊ XẤP XỈ — ' +
      'nhóm càng hẹp thì càng sát sự thật.\n\n' +
      'TẦN SỐ TÍCH LUỸ\n' +
      'Tần số tích luỹ của một nhóm là tổng tần số của chính nó và mọi nhóm đứng trước. Nó trả lời câu ' +
      'hỏi "có bao nhiêu giá trị nhỏ hơn mép phải của nhóm này". Tần số tích luỹ của nhóm cuối cùng ' +
      'luôn bằng cỡ mẫu n. Đây là công cụ then chốt cho bài sau: muốn tìm trung vị hay tứ phân vị thì ' +
      'trước hết phải biết mốc cần tìm rơi vào nhóm nào, và chỉ tần số tích luỹ mới cho biết điều đó.\n\n' +
      'HAI LỖI HAY MẮC\n' +
      '— Lấy giá trị đại diện là mép trái a của nhóm cho "gọn". Làm vậy mọi đặc trưng tính ra đều bị ' +
      'lệch xuống đúng nửa độ rộng nhóm.\n' +
      '— Nhầm tần số với tần số tích luỹ. Tần số là số giá trị RIÊNG của nhóm, tần số tích luỹ là số ' +
      'giá trị CỘNG DỒN từ đầu tới hết nhóm đó.',
    animation: {
      title: 'Từ dãy số liệu rời rạc tới bảng tần số ghép nhóm',
      description:
        'Bốn cột của một biểu đồ tần số lần lượt mọc lên từ trục ngang, cao thấp khác nhau theo tần ' +
        'số bốn, sáu, sáu, bốn. Sau đó một dấu chấm hiện ra ở chính giữa đỉnh mỗi cột để chỉ giá trị ' +
        'đại diện, tức trung điểm của nhóm, cho thấy mỗi nhóm được thay thế bằng đúng một con số.',
      viewBoxWidth: 360,
      viewBoxHeight: 200,
      durationMs: 6500,
      loop: true,
      shapes: [
        { kind: 'line', id: 'truc', x1: 30, y1: 150, x2: 340, y2: 150, stroke: 'muted' },
        {
          kind: 'rect',
          id: 'cot1',
          x: 45,
          y: 90,
          w: 60,
          h: 60,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 700, opacity: 0.75 },
            { atMs: 6500, opacity: 0.75 },
          ],
        },
        {
          kind: 'rect',
          id: 'cot2',
          x: 115,
          y: 60,
          w: 60,
          h: 90,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1300, opacity: 0.75 },
            { atMs: 6500, opacity: 0.75 },
          ],
        },
        {
          kind: 'rect',
          id: 'cot3',
          x: 185,
          y: 60,
          w: 60,
          h: 90,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 1900, opacity: 0.75 },
            { atMs: 6500, opacity: 0.75 },
          ],
        },
        {
          kind: 'rect',
          id: 'cot4',
          x: 255,
          y: 90,
          w: 60,
          h: 60,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 2500, opacity: 0.75 },
            { atMs: 6500, opacity: 0.75 },
          ],
        },
        {
          kind: 'circle',
          id: 'dd1',
          cx: 75,
          cy: 90,
          r: 5,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3600, opacity: 0 },
            { atMs: 4200, opacity: 1 },
            { atMs: 6500, opacity: 1 },
          ],
        },
        {
          kind: 'circle',
          id: 'dd2',
          cx: 145,
          cy: 60,
          r: 5,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3600, opacity: 0 },
            { atMs: 4200, opacity: 1 },
            { atMs: 6500, opacity: 1 },
          ],
        },
        {
          kind: 'circle',
          id: 'dd3',
          cx: 215,
          cy: 60,
          r: 5,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3600, opacity: 0 },
            { atMs: 4200, opacity: 1 },
            { atMs: 6500, opacity: 1 },
          ],
        },
        {
          kind: 'circle',
          id: 'dd4',
          cx: 285,
          cy: 90,
          r: 5,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3600, opacity: 0 },
            { atMs: 4200, opacity: 1 },
            { atMs: 6500, opacity: 1 },
          ],
        },
        {
          kind: 'label',
          id: 'n1',
          x: 75,
          y: 170,
          text: '[30;40)',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'n2',
          x: 145,
          y: 170,
          text: '[40;50)',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'n3',
          x: 215,
          y: 170,
          text: '[50;60)',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'n4',
          x: 285,
          y: 170,
          text: '[60;70)',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhanDD',
          x: 185,
          y: 34,
          text: 'giá trị đại diện = trung điểm nhóm',
          size: 13,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 3600, opacity: 0 },
            { atMs: 4200, opacity: 1 },
            { atMs: 6500, opacity: 1 },
          ],
        },
      ],
      captions: [
        { atMs: 700, text: 'Mỗi cột cao bằng tần số của một nhóm.' },
        { atMs: 2500, text: 'Cả mẫu 20 giá trị gói lại thành bốn con số.' },
        { atMs: 4200, text: 'Mỗi nhóm được thay bằng trung điểm của nó.' },
      ],
    },
    workedExample: {
      problem:
        'Khảo sát thời gian dùng điện thoại mỗi ngày (đơn vị: phút) của 20 học sinh, thu được: 31; ' +
        '35; 38; 39; 42; 44; 45; 47; 48; 49; 51; 52; 55; 56; 58; 59; 61; 63; 66; 68. Hãy ghép thành ' +
        'các nhóm có độ rộng 10 bắt đầu từ 30, rồi lập bảng tần số ghép nhóm kèm giá trị đại diện và ' +
        'tần số tích luỹ.',
      steps: [
        'Bước 1 — Giá trị nhỏ nhất là 31, lớn nhất là 68 nên bốn nhóm [30; 40), [40; 50), [50; 60), ' +
          '[60; 70) phủ kín dải số liệu.',
        'Bước 2 — Đếm tần số từng nhóm: [30; 40) có 31; 35; 38; 39 nên tần số 4. [40; 50) có 42; 44; ' +
          '45; 47; 48; 49 nên tần số 6.',
        'Bước 3 — Tiếp tục: [50; 60) có 51; 52; 55; 56; 58; 59 nên tần số 6; [60; 70) có 61; 63; 66; ' +
          '68 nên tần số 4. Kiểm tra tổng: 4 + 6 + 6 + 4 = 20 đúng bằng cỡ mẫu.',
        'Bước 4 — Giá trị đại diện là trung điểm mỗi nhóm: (30 + 40)/2 = 35; rồi 45; 55; 65.',
        'Bước 5 — Tần số tích luỹ cộng dồn từ trái sang: 4; 4 + 6 = 10; 10 + 6 = 16; 16 + 4 = 20. Số ' +
          'cuối cùng bằng đúng n = 20, đây là cách kiểm tra nhanh xem có đếm sót không.',
        'Bước 6 — Đọc bảng: sau khi ghép nhóm ta không còn biết bạn nào dùng 47 phút, nhưng biết được ' +
          '12 trong 20 bạn nằm trong khoảng từ 40 đến dưới 60 phút — đủ cho hầu hết kết luận thống kê.',
      ],
      answer:
        'Tần số 4; 6; 6; 4 với giá trị đại diện 35; 45; 55; 65 và tần số tích luỹ 4; 10; 16; 20.',
    },
    checkQuestions: [
      {
        prompt:
          'Mẫu thời gian dùng điện thoại (phút) của 20 học sinh được ghép nhóm thành [30; 40), ' +
          '[40; 50), [50; 60), [60; 70). Độ rộng của mỗi nhóm bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 10 },
        explain:
          'Độ rộng của nhóm [a; b) bằng b − a, ở đây 40 − 30 = 10 phút, và cả bốn nhóm đều có cùng độ ' +
          'rộng này. Việc chọn các nhóm bằng nhau không bắt buộc về mặt toán học nhưng rất nên làm: ' +
          'khi đó chiều cao các cột trong biểu đồ so sánh được trực tiếp với nhau, còn nhóm rộng hẹp ' +
          'khác nhau thì cột cao chưa chắc đã đông hơn.',
      },
      {
        prompt:
          'Dãy số liệu 31; 35; 38; 39; 42; 44; 45; 47; 48; 49; 51; 52; 55; 56; 58; 59; 61; 63; 66; 68 ' +
          'được ghép thành các nhóm rộng 10 từ 30. Tần số của nhóm [40; 50) bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 6 },
        explain:
          'Các giá trị thoả 40 ≤ x < 50 là 42; 44; 45; 47; 48; 49, tổng cộng 6 giá trị. Chú ý nhóm ' +
          'viết dạng nửa khoảng nên mép trái 40 được tính vào nhóm này còn mép phải 50 thì không — nếu ' +
          'trong mẫu có giá trị đúng bằng 50 thì nó thuộc nhóm [50; 60). Quy ước này bảo đảm mỗi giá ' +
          'trị được đếm đúng một lần, không sót và không trùng.',
      },
      {
        prompt: 'Vẫn bảng ghép nhóm trên. Giá trị đại diện của nhóm [50; 60) bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 55 },
        explain:
          'Giá trị đại diện của nhóm [a; b) là trung điểm (a + b)/2 = (50 + 60)/2 = 55 phút. Ta chọn ' +
          'trung điểm vì sau khi ghép nhóm không còn biết sáu giá trị trong nhóm nằm cụ thể ở đâu, nên ' +
          'giả định chúng rải đều và lấy điểm chính giữa làm đại diện. Lấy mép trái 50 cho gọn là sai: ' +
          'mọi đặc trưng tính ra sau đó sẽ bị lệch xuống đúng 5 đơn vị, tức nửa độ rộng nhóm.',
      },
      {
        prompt:
          'Bảng tần số ghép nhóm có tần số lần lượt là 4; 6; 6; 4 ứng với [30; 40), [40; 50), ' +
          '[50; 60), [60; 70). Tần số tích luỹ tính đến hết nhóm [50; 60) bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 16 },
        explain:
          'Tần số tích luỹ là tổng tần số của nhóm đang xét và mọi nhóm đứng trước nó: ' +
          '4 + 6 + 6 = 16. Con số này nói rằng có 16 trong 20 học sinh dùng điện thoại dưới 60 phút ' +
          'mỗi ngày. Đừng nhầm với tần số riêng của nhóm [50; 60) là 6; tần số tích luỹ mới là thứ ' +
          'dùng ở bài sau để biết trung vị hay tứ phân vị rơi vào nhóm nào.',
      },
      {
        prompt:
          'Vì sao khi ghép nhóm người ta viết các nhóm dưới dạng nửa khoảng [a; b) chứ không viết ' +
          'đoạn [a; b]? Chọn đáp án đúng.',
        choices: [
          { id: 'A', label: 'Vì nửa khoảng cho tần số lớn hơn, bảng đẹp hơn' },
          {
            id: 'B',
            label:
              'Để các nhóm phủ kín trục số mà không chồng lên nhau, nhờ đó mỗi giá trị được đếm đúng ' +
              'một lần',
          },
          { id: 'C', label: 'Vì giá trị đại diện chỉ tính được cho nửa khoảng' },
          { id: 'D', label: 'Vì đó chỉ là quy ước viết, thay bằng đoạn cũng không sao' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Nếu viết [40; 50] rồi [50; 60] thì giá trị đúng bằng 50 thuộc cả hai nhóm, người đếm sẽ tuỳ ' +
          'tiện xếp nó vào một bên và tổng tần số có thể không còn bằng cỡ mẫu. Nửa khoảng [a; b) giải ' +
          'quyết triệt để: mép trái thuộc nhóm, mép phải thuộc nhóm kế tiếp, các nhóm ghép lại phủ kín ' +
          'dải mà không giao nhau. Phương án A vô nghĩa về thống kê, C sai vì trung điểm tính được cho ' +
          'cả hai cách viết, còn D bỏ qua đúng vấn đề mà quy ước này sinh ra để xử lí.',
      },
    ],
    srsCards: [
      {
        hoi: 'Giá trị đại diện của nhóm [a; b) lấy bằng bao nhiêu và vì sao?',
        dap: 'Trung điểm (a + b)/2, vì đã mất vị trí thật của các giá trị nên giả định chúng rải đều trong nhóm.',
      },
      {
        hoi: 'Vì sao nhóm ghép viết dạng nửa khoảng [a; b)?',
        dap: 'Để các nhóm phủ kín trục số mà không chồng nhau, mỗi giá trị được đếm đúng một lần.',
      },
      {
        hoi: 'Tần số tích luỹ của một nhóm là gì?',
        dap: 'Tổng tần số của nhóm đó và mọi nhóm đứng trước; nhóm cuối có tần số tích luỹ bằng cỡ mẫu n.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan11-c3-b2',
    grade: '11',
    chapterNumber: 3,
    chapterTitle: CHUONG,
    lessonNumber: 2,
    title: 'Số trung bình, trung vị, tứ phân vị và mốt của mẫu số liệu ghép nhóm',
    hook:
      'Ban tổ chức hội khoẻ Phù Đổng muốn biết "thành tích chạy điển hình" của khối 11, nhưng biên ' +
      'bản chỉ ghi mỗi nhóm thời gian có bao nhiêu bạn chứ không ghi thành tích từng người. Không có ' +
      'dãy số liệu để sắp xếp thì làm sao tìm được người đứng giữa? Câu trả lời là một phép nội suy ' +
      'gọn gàng, và nó vận hành trên đúng một giả định mà bài trước đã đặt ra.',
    theory:
      'ĐIỂM XUẤT PHÁT\n' +
      'Mọi công thức dưới đây đều dựa trên một giả định duy nhất: các giá trị trong mỗi nhóm RẢI ĐỀU ' +
      'trên nhóm đó. Đó là điều hợp lí nhất có thể làm khi đã mất dữ liệu chi tiết. Hệ quả: kết quả ' +
      'tính ra là GIÁ TRỊ XẤP XỈ và có thể không trùng bất kì số liệu gốc nào.\n\n' +
      'SỐ TRUNG BÌNH\n' +
      'x̄ = (n₁x₁ + n₂x₂ + … + nₖxₖ)/n, với xᵢ là giá trị đại diện (trung điểm) của nhóm thứ i, nᵢ là ' +
      'tần số, n = n₁ + … + nₖ.\n' +
      'Đây là trung bình CÓ TRỌNG SỐ: nhóm đông kéo trung bình về phía nó mạnh hơn. Lấy trung bình ' +
      'cộng suông các xᵢ mà quên tần số là lỗi kinh điển.\n\n' +
      'TRUNG VỊ\n' +
      'Mₑ = u + (n/2 − C)/f · (v − u),\n' +
      'trong đó [u; v) là nhóm ĐẦU TIÊN có tần số tích luỹ ≥ n/2, f là tần số của nhóm đó, C là tần số ' +
      'tích luỹ của các nhóm đứng TRƯỚC nó.\n' +
      'ĐỌC CÔNG THỨC CHO HIỂU: n/2 là "số thứ tự" cần đi tới trong dãy đã sắp xếp. Đi hết các nhóm ' +
      'trước ta mới tới được giá trị thứ C, còn thiếu (n/2 − C) giá trị nữa. Nhóm hiện tại có f giá ' +
      'trị rải đều trên bề rộng (v − u), nên muốn đi thêm (n/2 − C) giá trị thì phải tiến thêm đúng tỉ ' +
      'lệ (n/2 − C)/f của bề rộng ấy. Đó chính là phép NỘI SUY TUYẾN TÍNH.\n\n' +
      'TỨ PHÂN VỊ\n' +
      'Qₖ = u + (k·n/4 − C)/f · (v − u), với k = 1, 2, 3.\n' +
      'Cùng một cơ chế, chỉ đổi mốc cần đi tới từ n/2 thành k·n/4. Nhóm [u; v) được chọn là nhóm đầu ' +
      'tiên có tần số tích luỹ ≥ k·n/4. Dễ thấy Q₂ chính là trung vị.\n\n' +
      'MỐT\n' +
      'Gọi [u; v) là nhóm có tần số LỚN NHẤT, f_m là tần số của nó, f_t và f_s lần lượt là tần số của ' +
      'nhóm đứng trước và nhóm đứng sau (nếu không có thì coi bằng 0). Khi đó\n' +
      'M₀ = u + (f_m − f_t)/[(f_m − f_t) + (f_m − f_s)] · (v − u).\n' +
      'Ý TƯỞNG: mốt phải nằm trong nhóm đông nhất, nhưng nằm lệch về phía người hàng xóm đông hơn. Nếu ' +
      'nhóm trước đông hơn nhóm sau thì đỉnh thật của dữ liệu nghiêng về bên trái, và công thức trên ' +
      'chia bề rộng nhóm theo đúng tỉ lệ chênh lệch với hai hàng xóm. Khi hai hàng xóm bằng nhau, mốt ' +
      'rơi đúng vào trung điểm nhóm.\n\n' +
      'BA LỖI HAY MẮC\n' +
      '— Nhầm mốc n/2 (một số thứ tự) với chính trung vị (một giá trị đọc trên trục số). Phải qua nội ' +
      'suy mới có Mₑ.\n' +
      '— Lấy luôn mép v của nhóm chứa trung vị cho nhanh, tức bỏ bước nội suy; kết quả luôn lệch lên ' +
      'trên.\n' +
      '— Lấy mốt bằng trung điểm nhóm đông nhất mà không xét hai nhóm hàng xóm.',
    workedExample: {
      problem:
        'Số tiền tiết kiệm mỗi tháng (đơn vị: nghìn đồng) của 40 học sinh được ghép nhóm: [20; 40) ' +
        'có 4 bạn; [40; 60) có 10; [60; 80) có 16; [80; 100) có 10. Tính số trung bình, trung vị, tứ ' +
        'phân vị thứ nhất và mốt.',
      steps: [
        'Bước 1 — Giá trị đại diện là trung điểm các nhóm: 30; 50; 70; 90. Tần số tích luỹ cộng dồn: ' +
          '4; 14; 30; 40 (số cuối bằng n = 40, khớp).',
        'Bước 2 — Số trung bình: (4·30 + 10·50 + 16·70 + 10·90)/40 = (120 + 500 + 1120 + 900)/40 = ' +
          '2640/40 = 66 nghìn đồng.',
        'Bước 3 — Trung vị: mốc cần đi tới là n/2 = 20. Nhóm đầu tiên có tần số tích luỹ ≥ 20 là ' +
          '[60; 80) vì tích luỹ của nó là 30 còn nhóm trước mới 14. Vậy u = 60, v = 80, f = 16, C = 14.',
        'Bước 4 — Nội suy: Mₑ = 60 + (20 − 14)/16 · (80 − 60) = 60 + (6/16)·20 = 60 + 7,5 = 67,5 nghìn ' +
          'đồng.',
        'Bước 5 — Tứ phân vị thứ nhất: mốc n/4 = 10, nhóm đầu tiên có tích luỹ ≥ 10 là [40; 60) với ' +
          'C = 4, f = 10. Nội suy: Q₁ = 40 + (10 − 4)/10 · 20 = 40 + 12 = 52 nghìn đồng.',
        'Bước 6 — Mốt: nhóm đông nhất là [60; 80) với f_m = 16, hai hàng xóm đều có tần số 10. Vậy ' +
          'M₀ = 60 + (16 − 10)/[(16 − 10) + (16 − 10)] · 20 = 60 + (6/12)·20 = 70 nghìn đồng — rơi đúng ' +
          'trung điểm nhóm, đúng như dự đoán khi hai hàng xóm cân bằng.',
      ],
      answer: 'x̄ = 66; Mₑ = 67,5; Q₁ = 52; M₀ = 70 (nghìn đồng).',
    },
    checkQuestions: [
      {
        prompt:
          'Thành tích chạy 1000 m (đơn vị: giây) của 40 học sinh khối 11 được ghép nhóm: [240; 270) ' +
          'có 5 bạn; [270; 300) có 12; [300; 330) có 15; [330; 360) có 8. Tính số trung bình x̄.',
        answer: { kind: 'numeric', value: 304.5 },
        explain:
          'Giá trị đại diện là trung điểm các nhóm: 255; 285; 315; 345. Trung bình có trọng số bằng ' +
          '(5·255 + 12·285 + 15·315 + 8·345)/40 = (1275 + 3420 + 4725 + 2760)/40 = 12180/40 = 304,5 ' +
          'giây. Bắt buộc phải nhân tần số trước khi cộng; lấy trung bình cộng suông bốn giá trị đại ' +
          'diện sẽ ra 300, tức bỏ qua việc nhóm [300; 330) đông hơn hẳn các nhóm khác.',
      },
      {
        prompt:
          'Vẫn mẫu ghép nhóm thành tích chạy ([240;270): 5; [270;300): 12; [300;330): 15; [330;360): ' +
          '8, n = 40). Tính trung vị Mₑ.',
        answer: { kind: 'numeric', value: 306 },
        explain:
          'Mốc cần đi tới là n/2 = 20. Tần số tích luỹ lần lượt là 5; 17; 32; 40 nên nhóm đầu tiên đạt ' +
          'ngưỡng 20 là [300; 330), với C = 17, f = 15 và bề rộng 30. Nội suy tuyến tính: ' +
          'Mₑ = 300 + (20 − 17)/15 · 30 = 300 + 6 = 306 giây. Nhớ rằng 20 chỉ là số THỨ TỰ trong dãy ' +
          'giả định đã sắp xếp, còn 306 mới là giá trị đọc trên trục thời gian.',
      },
      {
        prompt:
          'Vẫn mẫu trên ([240;270): 5; [270;300): 12; [300;330): 15; [330;360): 8, n = 40). Tính tứ ' +
          'phân vị thứ nhất Q₁.',
        answer: { kind: 'numeric', value: 282.5 },
        explain:
          'Mốc cần đi tới là n/4 = 10. Tần số tích luỹ 5; 17; 32; 40 cho thấy nhóm đầu tiên đạt ngưỡng ' +
          '10 là [270; 300) với C = 5, f = 12, bề rộng 30. Nội suy: ' +
          'Q₁ = 270 + (10 − 5)/12 · 30 = 270 + 12,5 = 282,5 giây. Kết quả này nói rằng khoảng một phần ' +
          'tư số học sinh chạy nhanh hơn 282,5 giây — một con số không hề xuất hiện trong bảng, đúng ' +
          'với bản chất xấp xỉ của mẫu ghép nhóm.',
      },
      {
        prompt:
          'Vẫn mẫu trên ([240;270): 5; [270;300): 12; [300;330): 15; [330;360): 8, n = 40). Tính tứ ' +
          'phân vị thứ ba Q₃.',
        answer: { kind: 'numeric', value: 326 },
        explain:
          'Mốc cần đi tới là 3n/4 = 30. Tần số tích luỹ 5; 17; 32; 40 nên nhóm đầu tiên đạt ngưỡng 30 ' +
          'vẫn là [300; 330), với C = 17, f = 15, bề rộng 30. Nội suy: ' +
          'Q₃ = 300 + (30 − 17)/15 · 30 = 300 + 26 = 326 giây. Đặt cạnh Q₁ = 282,5 ta biết một nửa số ' +
          'học sinh ở giữa có thành tích nằm trong khoảng từ 282,5 đến 326 giây.',
      },
      {
        prompt:
          'Vẫn mẫu trên ([240;270): 5; [270;300): 12; [300;330): 15; [330;360): 8). Tính mốt M₀ của ' +
          'mẫu ghép nhóm này.',
        answer: { kind: 'numeric', value: 309 },
        explain:
          'Nhóm có tần số lớn nhất là [300; 330) với f_m = 15; nhóm trước có f_t = 12, nhóm sau có ' +
          'f_s = 8. Áp dụng công thức: ' +
          'M₀ = 300 + (15 − 12)/[(15 − 12) + (15 − 8)] · 30 = 300 + (3/10)·30 = 300 + 9 = 309 giây. ' +
          'Mốt lệch về phía trái của nhóm vì hàng xóm bên trái đông hơn hẳn hàng xóm bên phải; nếu lấy ' +
          'luôn trung điểm 315 cho gọn thì đã bỏ qua chính thông tin đó.',
      },
      {
        prompt:
          'Vì sao trung vị của mẫu ghép nhóm phải tính bằng nội suy tuyến tính chứ không lấy luôn một ' +
          'mép của nhóm chứa nó? Chọn đáp án đúng.',
        choices: [
          { id: 'A', label: 'Vì mép của nhóm luôn là số lẻ nên khó tính toán' },
          {
            id: 'B',
            label:
              'Vì ta giả định các giá trị rải đều trong nhóm, nên phải tiến vào nhóm đúng tỉ lệ phần ' +
              'giá trị còn thiếu so với tần số của nhóm',
          },
          { id: 'C', label: 'Vì trung vị bắt buộc phải trùng với một giá trị có thật trong mẫu' },
          { id: 'D', label: 'Vì nội suy làm kết quả nhỏ đi, phù hợp với số liệu thực tế hơn' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Sau khi ghép nhóm ta chỉ còn biết nhóm nào có bao nhiêu giá trị, không biết chúng nằm đâu ' +
          'bên trong. Giả định rải đều là cách hợp lí nhất để lấp chỗ trống, và nó dẫn thẳng tới công ' +
          'thức Mₑ = u + (n/2 − C)/f · (v − u): phần còn thiếu (n/2 − C) trên tổng f giá trị của nhóm ' +
          'tương ứng với đúng tỉ lệ ấy của bề rộng nhóm. Lấy mép v là ngầm coi mọi giá trị dồn hết về ' +
          'cuối nhóm nên luôn lệch lên trên. Phương án C sai vì kết quả xấp xỉ hoàn toàn có thể không ' +
          'trùng số liệu gốc nào, còn D thì nội suy không hề luôn làm kết quả nhỏ đi.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức trung vị của mẫu số liệu ghép nhóm?',
        dap: 'Mₑ = u + (n/2 − C)/f · (v − u), với [u; v) là nhóm đầu tiên có tần số tích luỹ ≥ n/2, C là tích luỹ trước đó.',
      },
      {
        hoi: 'Công thức tứ phân vị Qₖ của mẫu ghép nhóm?',
        dap: 'Qₖ = u + (k·n/4 − C)/f · (v − u); nhóm [u; v) là nhóm đầu tiên có tần số tích luỹ ≥ k·n/4.',
      },
      {
        hoi: 'Mốt của mẫu ghép nhóm tính thế nào?',
        dap: 'M₀ = u + (f_m − f_t)/[(f_m − f_t) + (f_m − f_s)] · (v − u) trên nhóm có tần số lớn nhất.',
      },
      {
        hoi: 'Mọi công thức xu thế trung tâm của mẫu ghép nhóm dựa trên giả định nào?',
        dap: 'Các giá trị rải đều trong mỗi nhóm — nên kết quả chỉ là giá trị xấp xỉ, nhóm càng hẹp càng sát.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
