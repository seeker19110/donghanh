// lessons/toan11c4.ts — Toán 11, Chương 4: Quan hệ song song trong không gian.
// Nội dung tự soạn theo định nghĩa/định lí chuẩn (sự thật toán học), KHÔNG chép ví dụ SGK.
//
// LƯU Ý THIẾT KẾ CÂU HỎI (docs/specs/2026-09-14-mon-toan-bo-sung-lop10c5-lop11c3c4c8.md mục ①):
// phần lớn chương này là CHỨNG MINH / DỰNG HÌNH — không có đáp số để chấm tất định. Vì vậy bài 1
// và bài 3 dùng TOÀN BỘ câu `choice` (nhận biết vị trí tương đối, nhận biết tính chất), chỉ bài 2
// (định lí Thalès trong không gian) mới có câu `numeric` vì đó là chỗ DUY NHẤT của chương ra đáp
// số rõ ràng. Không ép câu chứng minh thành câu số — làm vậy là sai bản chất môn học.
//
// Trạng thái `draft` — chờ người có chuyên môn Toán duyệt qua quy trình lessonReview.
import type { MathLesson } from '../lessonTypes.js'

const CHUONG = 'Quan hệ song song trong không gian'

export const TOAN11_C4_LESSONS: MathLesson[] = [
  {
    id: 'toan11-c4-b1',
    grade: '11',
    chapterNumber: 4,
    chapterTitle: CHUONG,
    lessonNumber: 1,
    title: 'Xác định mặt phẳng và vị trí tương đối của hai đường thẳng trong không gian',
    hook:
      'Cái ghế đẩu ba chân ở quán cà phê vỉa hè không bao giờ bị cập kênh, còn cái ghế bốn chân thì thỉnh thoảng ' +
      'phải kê thêm mảnh bìa. Lí do không nằm ở tay thợ mộc mà nằm ở hình học: ba điểm luôn xác định đúng MỘT mặt ' +
      'phẳng, còn bốn điểm thì thường không cùng nằm trên một mặt phẳng nào cả. Toàn bộ hình học không gian bắt ' +
      'đầu từ nhận xét rất đời thường đó.',
    theory:
      'VÌ SAO PHẢI HỌC LẠI "VỊ TRÍ TƯƠNG ĐỐI"\n' +
      'Trong mặt phẳng, hai đường thẳng phân biệt chỉ có hai khả năng: cắt nhau hoặc song song. Ra không gian ' +
      'xuất hiện thêm một khả năng hoàn toàn mới — hai đường thẳng KHÔNG cùng nằm trên bất kì mặt phẳng nào. ' +
      'Bỏ sót khả năng thứ ba này là nguồn gốc của hầu hết lỗi sai khi mới học chương này.\n\n' +
      'BỐN CÁCH XÁC ĐỊNH MỘT MẶT PHẲNG\n' +
      '1. Ba điểm KHÔNG thẳng hàng.\n' +
      '2. Một đường thẳng và một điểm KHÔNG thuộc đường thẳng đó.\n' +
      '3. Hai đường thẳng CẮT NHAU.\n' +
      '4. Hai đường thẳng SONG SONG (phân biệt).\n' +
      'VÌ SAO cả bốn cách đều quy về cách 1: mỗi trường hợp còn lại đều lấy ra được ba điểm không thẳng hàng. ' +
      'Ví dụ hai đường thẳng cắt nhau tại I: lấy I, một điểm khác trên đường thứ nhất, một điểm khác trên đường ' +
      'thứ hai — ba điểm này chắc chắn không thẳng hàng.\n' +
      'CHÚ Ý ĐIỀU KIỆN: ba điểm THẲNG HÀNG thì KHÔNG xác định được mặt phẳng nào duy nhất — có vô số mặt phẳng ' +
      'chứa một đường thẳng, giống như vô số trang sách cùng chung một gáy.\n\n' +
      'HAI ĐƯỜNG THẲNG TRONG KHÔNG GIAN — BA TRƯỜNG HỢP ĐỒNG PHẲNG + MỘT TRƯỜNG HỢP MỚI\n' +
      'Cho hai đường thẳng a và b.\n' +
      '— Nếu CÓ một mặt phẳng chứa cả a và b (ta nói a, b ĐỒNG PHẲNG) thì rơi vào đúng ba khả năng quen thuộc: ' +
      'a ≡ b (trùng nhau), a ∥ b (song song, không có điểm chung), hoặc a cắt b tại đúng một điểm.\n' +
      '— Nếu KHÔNG có mặt phẳng nào chứa cả hai thì ta nói a và b CHÉO NHAU.\n' +
      'PHÂN BIỆT SỐNG CÒN: song song và chéo nhau đều "không có điểm chung", nên không thể dựa vào điểm chung ' +
      'để phân biệt. Khác nhau ở chỗ ĐỒNG PHẲNG hay không. Hai đường thẳng chéo nhau thì KHÔNG có mặt phẳng nào ' +
      'chứa được cả hai — con số là 0, không phải 1.\n\n' +
      'CÁCH NHẬN RA HAI ĐƯỜNG THẲNG CHÉO NHAU (mẹo dùng được ngay)\n' +
      'Nếu đường thẳng b nằm trong mặt phẳng (P), còn đường thẳng a cắt (P) tại điểm A mà A KHÔNG thuộc b, thì a ' +
      'và b chéo nhau.\n' +
      'VÌ SAO: giả sử có mặt phẳng (Q) chứa cả a và b. Vì (Q) chứa b nên (Q) và (P) có chung ít nhất đường thẳng ' +
      'b; vì (Q) chứa a nên (Q) chứa cả điểm A. Khi đó A vừa thuộc (P) vừa thuộc (Q), dẫn tới A phải nằm trên ' +
      'giao tuyến, tức nằm trên b — trái giả thiết. Vậy (Q) không tồn tại.\n' +
      'Áp dụng ngay vào hình chóp S.ABCD: cạnh bên SA cắt mặt đáy tại A, còn BC nằm trong mặt đáy và không đi qua ' +
      'A, nên SA và BC chéo nhau.\n\n' +
      'TÍNH CHẤT BẮC CẦU CỦA QUAN HỆ SONG SONG\n' +
      'Hai đường thẳng phân biệt cùng song song với một đường thẳng thứ ba thì song song với nhau. Tính chất này ' +
      'vẫn đúng trong không gian và là công cụ chứng minh song song dùng nhiều nhất cả chương.\n\n' +
      'GIAO TUYẾN CỦA HAI MẶT PHẲNG\n' +
      'Nếu hai mặt phẳng phân biệt có một điểm chung thì chúng có chung đúng MỘT đường thẳng đi qua điểm đó — ' +
      'đường thẳng ấy gọi là giao tuyến. Hệ quả thực dụng: muốn tìm giao tuyến, chỉ cần tìm HAI điểm chung của ' +
      'hai mặt phẳng rồi nối lại.\n' +
      'LỖI HAY MẮC: kết luận "a và b không cắt nhau nên a ∥ b" mà quên kiểm tra hai đường có đồng phẳng không. ' +
      'Trước khi viết dấu ∥, phải chỉ ra được một mặt phẳng chứa cả hai.',
    animation: {
      title: 'Hai đường thẳng chéo nhau trong một hình chóp',
      description:
        'Một hình chóp đáy tứ giác được vẽ ở dạng phối cảnh. Cạnh đáy BC sáng lên trước, sau đó cạnh bên SA sáng ' +
        'lên; hai cạnh này không cắt nhau và cũng không cùng nằm trên một mặt phẳng nào, minh hoạ khái niệm hai ' +
        'đường thẳng chéo nhau trong không gian.',
      viewBoxWidth: 360,
      viewBoxHeight: 240,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'polyline',
          id: 'day',
          points: [
            [70, 190],
            [220, 190],
            [290, 150],
            [140, 150],
          ],
          closed: true,
          stroke: 'muted',
          strokeWidth: 2,
        },
        { kind: 'line', id: 'canhSB', x1: 180, y1: 50, x2: 220, y2: 190, stroke: 'muted' },
        { kind: 'line', id: 'canhSC', x1: 180, y1: 50, x2: 290, y2: 150, stroke: 'muted' },
        { kind: 'line', id: 'canhSD', x1: 180, y1: 50, x2: 140, y2: 150, stroke: 'muted' },
        {
          kind: 'line',
          id: 'noiBC',
          x1: 220,
          y1: 190,
          x2: 290,
          y2: 150,
          stroke: 'primary',
          strokeWidth: 4,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 800, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        {
          kind: 'line',
          id: 'canhSA',
          x1: 180,
          y1: 50,
          x2: 70,
          y2: 190,
          stroke: 'accent',
          strokeWidth: 4,
          opacity: 0,
          keyframes: [
            { atMs: 0, opacity: 0 },
            { atMs: 2400, opacity: 0 },
            { atMs: 3000, opacity: 1 },
            { atMs: 6000, opacity: 1 },
          ],
        },
        { kind: 'label', id: 'nS', x: 176, y: 42, text: 'S', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nA', x: 58, y: 204, text: 'A', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nB', x: 224, y: 205, text: 'B', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nC', x: 296, y: 148, text: 'C', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nD', x: 126, y: 145, text: 'D', size: 14, fill: 'neutral' },
      ],
      captions: [
        { atMs: 800, text: 'Cạnh BC nằm trong mặt phẳng đáy.' },
        { atMs: 3000, text: 'Cạnh SA cắt mặt đáy tại A, mà A không thuộc BC.' },
        { atMs: 4600, text: 'Vậy SA và BC chéo nhau: không cắt nhau và không đồng phẳng.' },
      ],
    },
    workedExample: {
      problem:
        'Cho tứ diện ABCD. Hãy xác định vị trí tương đối của cặp đường thẳng AB và CD, và giải thích vì sao ' +
        'không thể kết luận chúng song song.',
      steps: [
        'Bước 1 — Nhắc lại giả thiết của tứ diện: bốn điểm A, B, C, D KHÔNG đồng phẳng. Đây là điều kiện mấu ' +
          'chốt, nếu bỏ qua thì lập luận phía sau không còn đúng.',
        'Bước 2 — Đặt (P) là mặt phẳng (BCD). Đường thẳng CD nằm trọn trong (P).',
        'Bước 3 — Xét đường thẳng AB. Vì A không thuộc (P) còn B thuộc (P) nên AB cắt (P) tại đúng điểm B.',
        'Bước 4 — Kiểm tra điểm cắt: B không nằm trên đường thẳng CD (nếu B thuộc CD thì ba điểm B, C, D thẳng ' +
          'hàng và bốn điểm sẽ đồng phẳng, trái giả thiết tứ diện).',
        'Bước 5 — Áp dấu hiệu nhận biết: đường thẳng AB cắt mặt phẳng chứa CD tại một điểm không thuộc CD, nên ' +
          'AB và CD chéo nhau.',
        'Bước 6 — Vì sao KHÔNG được nói "song song": hai đường thẳng song song bắt buộc phải đồng phẳng. Ở đây ' +
          'không tồn tại mặt phẳng nào chứa cả AB và CD, nên dù chúng không có điểm chung ta vẫn không được viết ' +
          'AB ∥ CD.',
      ],
      answer: 'AB và CD chéo nhau (không có điểm chung và không đồng phẳng).',
    },
    checkQuestions: [
      {
        prompt:
          'Cho hình chóp S.ABCD có đáy ABCD là hình bình hành. Hai đường thẳng SA và BC có vị trí tương đối nào?',
        choices: [
          { id: 'A', label: 'Cắt nhau' },
          { id: 'B', label: 'Song song' },
          { id: 'C', label: 'Chéo nhau' },
          { id: 'D', label: 'Trùng nhau' },
        ],
        answer: { kind: 'choice', correctIds: ['C'] },
        explain:
          'Đường thẳng BC nằm trong mặt phẳng đáy (ABCD). Đường thẳng SA cắt mặt phẳng đáy tại điểm A, mà A ' +
          'không nằm trên BC (vì ABCD là hình bình hành nên A, B, C không thẳng hàng). Theo dấu hiệu nhận biết, ' +
          'SA và BC chéo nhau. Nhiều bạn thấy hai đường không cắt nhau liền kết luận song song — sai, vì song ' +
          'song còn đòi thêm điều kiện đồng phẳng, mà ở đây không có mặt phẳng nào chứa được cả SA lẫn BC.',
      },
      {
        prompt:
          'Trong các trường hợp sau, trường hợp nào KHÔNG xác định được duy nhất một mặt phẳng?',
        choices: [
          { id: 'A', label: 'Ba điểm không thẳng hàng' },
          { id: 'B', label: 'Hai đường thẳng cắt nhau' },
          { id: 'C', label: 'Một đường thẳng và một điểm không thuộc đường thẳng đó' },
          { id: 'D', label: 'Ba điểm thẳng hàng' },
        ],
        answer: { kind: 'choice', correctIds: ['D'] },
        explain:
          'Ba điểm thẳng hàng thực chất chỉ cho ta MỘT đường thẳng, mà qua một đường thẳng có vô số mặt phẳng đi ' +
          'qua (hình dung các trang sách cùng chung một gáy). Ba trường hợp còn lại đều quy được về "ba điểm ' +
          'không thẳng hàng" nên xác định đúng một mặt phẳng: hai đường thẳng cắt nhau tại I cho ta I cùng hai ' +
          'điểm khác trên hai đường; một đường thẳng và một điểm ngoài nó cho ta hai điểm trên đường thẳng cộng ' +
          'điểm đó.',
      },
      {
        prompt:
          'Cho hai đường thẳng chéo nhau a và b. Có bao nhiêu mặt phẳng chứa đồng thời cả a và b?',
        choices: [
          { id: 'A', label: 'Không có mặt phẳng nào' },
          { id: 'B', label: 'Đúng một mặt phẳng' },
          { id: 'C', label: 'Đúng hai mặt phẳng' },
          { id: 'D', label: 'Vô số mặt phẳng' },
        ],
        answer: { kind: 'choice', correctIds: ['A'] },
        explain:
          'Đây chính là ĐỊNH NGHĨA của hai đường thẳng chéo nhau: không tồn tại mặt phẳng nào chứa cả hai. Nếu ' +
          'có dù chỉ một mặt phẳng như thế thì hai đường đã đồng phẳng và phải rơi vào một trong ba trường hợp ' +
          'cắt nhau, song song hoặc trùng nhau — mâu thuẫn. Lưu ý phân biệt với câu hỏi khác: qua hai đường ' +
          'thẳng chéo nhau vẫn dựng được mặt phẳng chứa đường này và SONG SONG với đường kia, nhưng mặt phẳng ' +
          'đó chỉ chứa một trong hai đường mà thôi.',
      },
      {
        prompt:
          'Cho hình chóp S.ABCD có đáy ABCD là hình bình hành. Hai đường thẳng AB và CD có vị trí tương đối nào?',
        choices: [
          { id: 'A', label: 'Chéo nhau' },
          { id: 'B', label: 'Song song' },
          { id: 'C', label: 'Cắt nhau' },
          { id: 'D', label: 'Trùng nhau' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Hai đường thẳng AB và CD cùng nằm trong mặt phẳng đáy (ABCD), tức là ĐỒNG PHẲNG, nên chỉ có thể cắt ' +
          'nhau, song song hoặc trùng nhau. Vì ABCD là hình bình hành nên theo định nghĩa AB ∥ CD. Đây là chỗ ' +
          'cần cẩn thận: cùng là cạnh của hình chóp nhưng cặp SA – BC thì chéo nhau, còn cặp AB – CD lại song ' +
          'song, khác nhau ở chỗ có tìm được mặt phẳng chứa cả hai hay không.',
      },
      {
        prompt:
          'Trong không gian, hai đường thẳng phân biệt a và b cùng song song với đường thẳng c. Kết luận nào đúng?',
        choices: [
          { id: 'A', label: 'a và b chéo nhau' },
          { id: 'B', label: 'a và b cắt nhau' },
          { id: 'C', label: 'a song song với b' },
          { id: 'D', label: 'Không kết luận được gì về a và b' },
        ],
        answer: { kind: 'choice', correctIds: ['C'] },
        explain:
          'Đây là tính chất BẮC CẦU của quan hệ song song, vẫn còn đúng khi ra không gian: hai đường thẳng phân ' +
          'biệt cùng song song với một đường thẳng thứ ba thì song song với nhau. Điều kiện "phân biệt" là bắt ' +
          'buộc — nếu a trùng b thì đương nhiên không nói là song song. Tính chất này là công cụ chứng minh song ' +
          'song được dùng nhiều nhất trong cả chương: muốn chứng minh hai đường song song, hãy đi tìm một đường ' +
          'thứ ba làm trung gian.',
      },
      {
        prompt:
          'Hai mặt phẳng phân biệt (P) và (Q) có một điểm chung M. Khẳng định nào sau đây đúng?',
        choices: [
          { id: 'A', label: 'M là điểm chung duy nhất của (P) và (Q)' },
          { id: 'B', label: '(P) và (Q) có chung một đường thẳng đi qua M' },
          { id: 'C', label: '(P) và (Q) trùng nhau' },
          { id: 'D', label: '(P) và (Q) song song với nhau' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Tính chất thừa nhận của hình học không gian: nếu hai mặt phẳng phân biệt có một điểm chung thì chúng ' +
          'có chung đúng một đường thẳng đi qua điểm đó, gọi là giao tuyến. Vì vậy hai mặt phẳng phân biệt không ' +
          'bao giờ cắt nhau tại đúng một điểm. Hệ quả rất thực dụng khi làm bài: muốn dựng giao tuyến, chỉ cần ' +
          'tìm HAI điểm cùng thuộc cả hai mặt phẳng rồi nối chúng lại. Đáp án "song song" bị loại ngay vì hai ' +
          'mặt phẳng song song thì không có điểm chung nào.',
      },
    ],
    srsCards: [
      {
        hoi: 'Kể bốn cách xác định một mặt phẳng.',
        dap: 'Ba điểm không thẳng hàng; một đường thẳng và một điểm ngoài nó; hai đường thẳng cắt nhau; hai đường thẳng song song.',
      },
      {
        hoi: 'Hai đường thẳng chéo nhau là gì? Khác song song ở điểm nào?',
        dap: 'Chéo nhau = không có mặt phẳng nào chứa cả hai. Song song cũng không có điểm chung nhưng BẮT BUỘC đồng phẳng.',
      },
      {
        hoi: 'Dấu hiệu nhanh nhận ra hai đường thẳng chéo nhau?',
        dap: 'b nằm trong (P), a cắt (P) tại A và A không thuộc b ⇒ a và b chéo nhau.',
      },
      {
        hoi: 'Muốn tìm giao tuyến của hai mặt phẳng thì làm gì?',
        dap: 'Tìm hai điểm chung của hai mặt phẳng rồi nối lại — đường thẳng đó là giao tuyến.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan11-c4-b2',
    grade: '11',
    chapterNumber: 4,
    chapterTitle: CHUONG,
    lessonNumber: 2,
    title: 'Quan hệ song song với mặt phẳng và định lí Thalès trong không gian',
    hook:
      'Thợ xây dựng nhà ống ở phố cổ căng một sợi dây ngang để đánh dấu mặt sàn tầng hai. Sợi dây ấy song song ' +
      'với mặt sàn tầng một, và điều kì lạ là: chỉ cần mấy sợi dây song song đó, người thợ chia đều được chiều ' +
      'cao của cả căn nhà mà không cần đo từng tầng. Cơ sở toán học của mẹo nghề đó là định lí Thalès trong ' +
      'không gian — cũng là phần duy nhất của chương này cho ra một con số cụ thể.',
    theory:
      'ĐƯỜNG THẲNG SONG SONG VỚI MẶT PHẲNG\n' +
      'Đường thẳng d song song với mặt phẳng (P), viết d ∥ (P), khi d và (P) KHÔNG có điểm chung nào.\n' +
      'ĐIỀU KIỆN NHẬN BIẾT (dùng gần như mọi bài): nếu d KHÔNG nằm trong (P) và d song song với MỘT đường thẳng ' +
      'a nào đó nằm trong (P) thì d ∥ (P).\n' +
      'VÌ SAO phải có vế "d không nằm trong (P)": một đường thẳng nằm trọn trong (P) thì có vô số điểm chung với ' +
      '(P), không thể gọi là song song. Đây là điều kiện bị quên nhiều nhất khi trình bày.\n\n' +
      'ĐỊNH LÍ VỀ GIAO TUYẾN (công cụ tạo ra đường song song)\n' +
      'Nếu đường thẳng d ∥ (P), mà mặt phẳng (Q) chứa d và cắt (P) theo giao tuyến a, thì a ∥ d.\n' +
      'VÌ SAO: a nằm trong (P) còn d song song với (P) nên d và a không thể có điểm chung; mặt khác cả d và a ' +
      'đều nằm trong (Q) nên chúng đồng phẳng. Không điểm chung cộng đồng phẳng, đúng bằng định nghĩa song song.\n' +
      'Đây là "máy sản xuất" đường song song: muốn có một đường song song với d, hãy cắt bằng một mặt phẳng chứa d.\n\n' +
      'HAI MẶT PHẲNG SONG SONG\n' +
      '(P) ∥ (Q) khi hai mặt phẳng không có điểm chung.\n' +
      'ĐIỀU KIỆN NHẬN BIẾT: nếu trong (P) có HAI đường thẳng CẮT NHAU cùng song song với (Q) thì (P) ∥ (Q).\n' +
      'VÌ SAO bắt buộc hai đường CẮT NHAU: hai đường song song với nhau chỉ "chỉ" được một phương duy nhất, ' +
      'không đủ khoá chặt hướng của cả mặt phẳng; phải có hai phương khác nhau mới ghim được mặt phẳng.\n' +
      'TÍNH CHẤT HAY DÙNG: nếu (R) cắt (P) thì (R) cũng cắt (Q), và hai giao tuyến SONG SONG với nhau.\n\n' +
      'ĐỊNH LÍ THALÈS TRONG KHÔNG GIAN — TRÁI TIM TÍNH TOÁN CỦA CHƯƠNG\n' +
      'Ba mặt phẳng đôi một song song chắn trên hai cát tuyến bất kì những đoạn thẳng TƯƠNG ỨNG TỈ LỆ.\n' +
      'Cụ thể, ba mặt phẳng song song cắt đường thẳng thứ nhất tại A, B, C và cắt đường thẳng thứ hai tại ' +
      'A′, B′, C′ thì\n' +
      'AB / A′B′ = BC / B′C′ = AC / A′C′.\n' +
      'DẠNG HAY GẶP HƠN — cắt tam giác bằng mặt phẳng song song: cho tam giác ABC, mặt phẳng song song với BC ' +
      'cắt AB tại M và AC tại N. Khi đó MN ∥ BC và\n' +
      'AM / AB = AN / AC = MN / BC.\n' +
      'VÌ SAO đúng: MN và BC cùng nằm trong mặt phẳng (ABC), lại không có điểm chung (theo định lí giao tuyến ở ' +
      'trên), nên MN ∥ BC; từ đó dùng đúng định lí Thalès quen thuộc trong mặt phẳng. Hình học không gian ở đây ' +
      'chỉ làm một việc: đưa bài toán về lại một mặt phẳng cụ thể.\n\n' +
      'CÁCH DÙNG TỈ LỆ CHO GỌN\n' +
      'Đặt k = AM / AB (gọi là hệ số tỉ lệ). Khi đó mọi đoạn tương ứng đều nhân với đúng k: AN = k·AC, ' +
      'MN = k·BC. Đặt tên cho k rồi mới thế số sẽ tránh được lỗi nhân nhầm cặp đoạn.\n' +
      'LỖI HAY MẮC SỐ 1: lẫn giữa AM/AB và AM/MB. Nếu đề cho AM = 3, MB = 5 thì AB = 8 và k = 3/8, chứ không ' +
      'phải 3/5. Luôn viết rõ mẫu số là đoạn TOÀN PHẦN hay đoạn CÒN LẠI trước khi tính.',
    animation: {
      title: 'Mặt phẳng song song với đáy cắt hình chóp theo tỉ lệ',
      description:
        'Một tam giác ABC được vẽ với đỉnh A ở trên và cạnh BC nằm ngang phía dưới. Một đoạn thẳng MN song song ' +
        'với BC xuất hiện và trượt dần lên xuống giữa đỉnh A và cạnh BC, cho thấy MN luôn song song với BC và độ ' +
        'dài của nó thay đổi theo đúng tỉ lệ khoảng cách từ đỉnh A.',
      viewBoxWidth: 360,
      viewBoxHeight: 240,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'polyline',
          id: 'tamGiac',
          points: [
            [180, 40],
            [60, 200],
            [300, 200],
          ],
          closed: true,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'canhBC',
          x1: 60,
          y1: 200,
          x2: 300,
          y2: 200,
          stroke: 'primary',
          strokeWidth: 4,
        },
        {
          kind: 'line',
          id: 'doanMN',
          x1: 120,
          y1: 120,
          x2: 240,
          y2: 120,
          stroke: 'accent',
          strokeWidth: 4,
          keyframes: [
            { atMs: 0, dy: 0, scale: 1 },
            { atMs: 2500, dy: -40, scale: 0.5 },
            { atMs: 5000, dy: 40, scale: 1.5 },
            { atMs: 6000, dy: 0, scale: 1 },
          ],
        },
        { kind: 'label', id: 'nA', x: 176, y: 32, text: 'A', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nB', x: 48, y: 214, text: 'B', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nC', x: 304, y: 214, text: 'C', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nM', x: 100, y: 116, text: 'M', size: 14, fill: 'neutral' },
        { kind: 'label', id: 'nN', x: 246, y: 116, text: 'N', size: 14, fill: 'neutral' },
      ],
      captions: [
        { atMs: 0, text: 'Đoạn MN luôn song song với cạnh BC.' },
        { atMs: 2500, text: 'Càng gần đỉnh A, tỉ lệ AM/AB càng nhỏ nên MN càng ngắn.' },
        { atMs: 5000, text: 'MN/BC luôn bằng đúng AM/AB — đó là định lí Thalès.' },
      ],
    },
    workedExample: {
      problem:
        'Cho tứ diện ABCD. Điểm M nằm trên cạnh AB sao cho AM = 2 và MB = 3. Mặt phẳng (α) đi qua M và song ' +
        'song với mặt phẳng (BCD), cắt AC tại N và cắt AD tại P. Biết BC = 20, tính độ dài MN.',
      steps: [
        'Bước 1 — Tính đoạn toàn phần: AB = AM + MB = 2 + 3 = 5. Đây là bước hay bị bỏ qua nhất, dẫn tới việc ' +
          'lấy nhầm tỉ lệ AM/MB = 2/3.',
        'Bước 2 — Đặt hệ số tỉ lệ k = AM / AB = 2 / 5.',
        'Bước 3 — Chỉ ra MN ∥ BC: mặt phẳng (α) song song với (BCD), mà mặt phẳng (ABC) chứa M và cắt (α) theo ' +
          'giao tuyến MN, cắt (BCD) theo giao tuyến BC. Hai giao tuyến của một mặt phẳng với hai mặt phẳng song ' +
          'song thì song song, nên MN ∥ BC.',
        'Bước 4 — Bài toán bây giờ nằm gọn trong MỘT mặt phẳng là (ABC), nên dùng được định lí Thalès quen ' +
          'thuộc: MN / BC = AM / AB = k.',
        'Bước 5 — Thế số: MN = k · BC = (2/5) · 20 = 8.',
        'Bước 6 — Kiểm tra hợp lí: k = 0,4 nhỏ hơn 1 nên MN phải NGẮN hơn BC, và 8 < 20, kết quả hợp lí. Nếu ' +
          'lỡ lấy k = 2/3 thì sẽ ra 13,33 — vẫn nhỏ hơn 20 nên phép kiểm này không cứu được, phải cẩn thận ngay ' +
          'từ bước 1.',
      ],
      answer: 'MN = 8.',
    },
    checkQuestions: [
      {
        prompt:
          'Cho tứ diện ABCD, điểm M thuộc cạnh AB với AM = 3 và MB = 5. Mặt phẳng đi qua M và song song với ' +
          'mặt phẳng (BCD) cắt AC tại N. Biết BC = 24, tính độ dài MN.',
        answer: { kind: 'numeric', value: 9 },
        explain:
          'Trước hết tính cạnh toàn phần AB = AM + MB = 3 + 5 = 8, nên hệ số tỉ lệ là k = AM/AB = 3/8. Vì mặt ' +
          'phẳng cắt song song với (BCD) nên giao tuyến MN song song với BC, và theo định lí Thalès trong không ' +
          'gian ta có MN/BC = AM/AB. Vậy MN = (3/8)·24 = 9. Lỗi phổ biến là lấy tỉ lệ AM/MB = 3/5 rồi ra 14,4 — ' +
          'mẫu số phải là đoạn TOÀN PHẦN AB, không phải đoạn còn lại MB.',
      },
      {
        prompt:
          'Ba mặt phẳng đôi một song song cắt đường thẳng d lần lượt tại A, B, C và cắt đường thẳng d′ lần lượt ' +
          'tại A′, B′, C′. Biết AB = 4, BC = 6 và A′B′ = 6. Tính độ dài B′C′.',
        answer: { kind: 'numeric', value: 9 },
        explain:
          'Định lí Thalès trong không gian nói rằng ba mặt phẳng đôi một song song chắn trên hai cát tuyến những ' +
          'đoạn thẳng tương ứng tỉ lệ: AB/A′B′ = BC/B′C′. Thế số: 4/6 = 6/B′C′, suy ra B′C′ = 6·6/4 = 9. Chú ý ' +
          'thứ tự các đoạn phải tương ứng đúng — cặp (AB, A′B′) đi với nhau vì cùng bị chắn bởi mặt phẳng thứ ' +
          'nhất và thứ hai; ghép nhầm thành AB/BC = A′B′/B′C′ tuy vẫn ra cùng đáp số ở đây nhưng là cách viết ' +
          'khác của cùng một tỉ lệ, cần hiểu rõ chứ không nên nhớ máy móc.',
      },
      {
        prompt:
          'Cho tam giác ABC nằm trong một mặt của hình chóp. Điểm M thuộc cạnh AB, điểm N thuộc cạnh AC sao cho ' +
          'MN song song với BC. Biết AM = 3, MB = 9 và AC = 20. Tính độ dài AN.',
        answer: { kind: 'numeric', value: 5 },
        explain:
          'Cạnh toàn phần AB = AM + MB = 3 + 9 = 12, nên hệ số tỉ lệ k = AM/AB = 3/12 = 1/4. Vì MN song song BC ' +
          'nên AN/AC = AM/AB = 1/4, suy ra AN = 20/4 = 5. Đặt tên cho hệ số k rồi mới thế số là cách chắc chắn ' +
          'nhất để không nhân nhầm cặp đoạn thẳng: mọi đoạn ở "phía đỉnh A" đều bằng k lần đoạn tương ứng ở ' +
          '"phía đáy".',
      },
      {
        prompt:
          'Đường thẳng d song song với mặt phẳng (P) khi và chỉ khi điều kiện nào sau đây được thoả mãn?',
        choices: [
          { id: 'A', label: 'd song song với một đường thẳng nào đó nằm trong (P)' },
          {
            id: 'B',
            label: 'd không nằm trong (P) và d song song với một đường thẳng nằm trong (P)',
          },
          { id: 'C', label: 'd vuông góc với một đường thẳng nằm trong (P)' },
          { id: 'D', label: 'd cắt (P) tại đúng một điểm' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Dấu hiệu nhận biết đầy đủ gồm HAI vế: d không nằm trong (P), VÀ d song song với một đường thẳng nào ' +
          'đó nằm trong (P). Vế đầu thường bị bỏ quên nhưng không thể thiếu: một đường thẳng nằm trọn trong (P) ' +
          'cũng song song với vô số đường thẳng khác của (P), nhưng nó có vô số điểm chung với (P) nên không thể ' +
          'gọi là song song với (P). Đáp án D mô tả trường hợp d CẮT (P), tức ngược hẳn với điều cần chứng minh.',
      },
      {
        prompt:
          'Cho hai mặt phẳng song song (P) ∥ (Q). Một mặt phẳng (R) cắt (P) theo giao tuyến a và cắt (Q) theo ' +
          'giao tuyến b. Khi đó hai giao tuyến a và b có quan hệ gì?',
        choices: [
          { id: 'A', label: 'a và b chéo nhau' },
          { id: 'B', label: 'a và b cắt nhau' },
          { id: 'C', label: 'a song song với b' },
          { id: 'D', label: 'a và b trùng nhau' },
        ],
        answer: { kind: 'choice', correctIds: ['C'] },
        explain:
          'Hai giao tuyến a và b cùng nằm trong mặt phẳng (R) nên chúng ĐỒNG PHẲNG, loại ngay khả năng chéo ' +
          'nhau. Mặt khác a nằm trong (P), b nằm trong (Q) mà (P) ∥ (Q) nên a và b không thể có điểm chung — nếu ' +
          'có thì điểm đó vừa thuộc (P) vừa thuộc (Q), trái với giả thiết hai mặt phẳng song song. Đồng phẳng và ' +
          'không có điểm chung, đúng bằng định nghĩa song song. Đây chính là tính chất tạo ra MN ∥ BC trong các ' +
          'bài toán Thalès ở trên.',
      },
    ],
    srsCards: [
      {
        hoi: 'Điều kiện để đường thẳng d song song với mặt phẳng (P)?',
        dap: 'd KHÔNG nằm trong (P) và d song song với một đường thẳng nằm trong (P).',
      },
      {
        hoi: 'Phát biểu định lí Thalès trong không gian.',
        dap: 'Ba mặt phẳng đôi một song song chắn trên hai cát tuyến những đoạn thẳng tương ứng tỉ lệ: AB/A′B′ = BC/B′C′.',
      },
      {
        hoi: 'Mặt phẳng song song với BC cắt AB tại M, AC tại N thì có tỉ lệ nào?',
        dap: 'AM/AB = AN/AC = MN/BC. Mẫu số là đoạn TOÀN PHẦN, không phải đoạn còn lại.',
      },
      {
        hoi: 'Vì sao điều kiện hai mặt phẳng song song đòi hai đường thẳng CẮT NHAU?',
        dap: 'Hai đường song song chỉ cho một phương, không ghim được hướng mặt phẳng; cần hai phương khác nhau.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'toan11-c4-b3',
    grade: '11',
    chapterNumber: 4,
    chapterTitle: CHUONG,
    lessonNumber: 3,
    title: 'Phép chiếu song song và hình biểu diễn của hình không gian',
    hook:
      'Buổi chiều nắng xiên, bóng của cái cổng sắt đổ dài trên sân gạch. Bóng đó méo đi: hình vuông thành hình ' +
      'thoi, góc vuông không còn vuông. Nhưng có mấy thứ không bao giờ méo — hai thanh sắt song song vẫn cho hai ' +
      'cái bóng song song, và điểm giữa thanh sắt vẫn đổ bóng đúng vào điểm giữa. Nắng chiếu chính là phép chiếu ' +
      'song song, và biết nó giữ lại gì là biết cách vẽ hình không gian cho đúng.',
    theory:
      'PHÉP CHIẾU SONG SONG LÀ GÌ\n' +
      'Cho mặt phẳng (P) và một đường thẳng Δ cắt (P). Với mỗi điểm M trong không gian, kẻ đường thẳng qua M và ' +
      'song song (hoặc trùng) với Δ; đường này cắt (P) tại một điểm M′ duy nhất. Điểm M′ gọi là hình chiếu song ' +
      'song của M lên (P) theo phương Δ. Mặt phẳng (P) là mặt phẳng chiếu, Δ là phương chiếu.\n' +
      'Điều kiện Δ CẮT (P) là bắt buộc: nếu Δ song song với (P) thì các đường chiếu chẳng bao giờ chạm tới (P), ' +
      'phép chiếu không xác định được.\n\n' +
      'PHÉP CHIẾU SONG SONG GIỮ LẠI NHỮNG GÌ\n' +
      '1. Ảnh của một đường thẳng là một đường thẳng — trừ khi đường thẳng đó SONG SONG hoặc TRÙNG với phương ' +
      'chiếu, khi ấy ảnh co lại thành MỘT ĐIỂM.\n' +
      '2. Bảo toàn tính THẲNG HÀNG và thứ tự các điểm: ba điểm thẳng hàng cho ba ảnh thẳng hàng, điểm nằm giữa ' +
      'vẫn cho ảnh nằm giữa.\n' +
      '3. Bảo toàn TÍNH SONG SONG: hai đường thẳng song song (và không song song với phương chiếu) có ảnh là hai ' +
      'đường thẳng song song hoặc trùng nhau.\n' +
      '4. Bảo toàn TỈ SỐ độ dài của hai đoạn thẳng cùng nằm trên một đường thẳng, hoặc nằm trên hai đường thẳng ' +
      'song song. Hệ quả hay dùng nhất: ảnh của trung điểm là trung điểm của ảnh.\n\n' +
      'PHÉP CHIẾU SONG SONG KHÔNG GIỮ NHỮNG GÌ\n' +
      '— KHÔNG bảo toàn ĐỘ DÀI: một đoạn thẳng dài 5 có thể cho ảnh dài 3 hoặc dài 7 tuỳ hướng chiếu.\n' +
      '— KHÔNG bảo toàn ĐỘ LỚN GÓC: góc vuông có thể cho ảnh là góc tù hoặc góc nhọn.\n' +
      '— Do đó KHÔNG bảo toàn tỉ số của hai đoạn thẳng nằm trên hai đường thẳng KHÔNG song song nhau.\n' +
      'VÌ SAO chỉ giữ được tỉ số trên cùng một phương: các đường chiếu song song cắt hai đường thẳng song song ' +
      'theo đúng cơ chế của định lí Thalès, nên mọi đoạn trên phương đó bị nhân với CÙNG MỘT hệ số. Đổi sang ' +
      'phương khác thì hệ số khác, nên so tỉ số giữa hai phương là vô nghĩa.\n\n' +
      'HÌNH BIỂU DIỄN — VÌ SAO VẼ HÌNH KHÔNG GIAN LÊN GIẤY LẠI ĐÚNG\n' +
      'Hình biểu diễn của một hình H trong không gian là hình chiếu song song của H lên mặt phẳng tờ giấy (hoặc ' +
      'một hình đồng dạng với hình chiếu đó). Quy tắc vẽ suy thẳng ra từ danh sách tính chất ở trên:\n' +
      '— Cạnh song song phải vẽ thành cạnh song song; trung điểm phải vẽ đúng ở giữa; tỉ lệ trên cùng một đường ' +
      'thẳng phải giữ nguyên.\n' +
      '— Nhưng độ dài và góc thì được phép vẽ sai, vì bản thân phép chiếu đã làm chúng sai rồi.\n' +
      'Hệ quả cụ thể: hình biểu diễn của hình bình hành vẫn là hình bình hành (vì tính song song được giữ); ' +
      'nhưng hình biểu diễn của hình vuông, hình chữ nhật, hình thoi cũng chỉ là một HÌNH BÌNH HÀNH bất kì — ' +
      'chúng ta không phân biệt được nữa vì góc và độ dài đã mất. Tương tự, hình biểu diễn của một tam giác bất ' +
      'kì (đều, vuông, cân) chỉ là một tam giác tuỳ ý.\n' +
      'LỖI HAY MẮC: cố vẽ hình vuông ra hình vuông trên giấy rồi đọc số đo góc trên hình vẽ để làm bài. Hình vẽ ' +
      'chỉ để định hướng suy nghĩ; mọi số đo góc và độ dài phải lấy từ giả thiết, tuyệt đối không đo trên hình.',
    animation: {
      title: 'Phép chiếu song song giữ trung điểm nhưng không giữ độ dài',
      description:
        'Đoạn thẳng AB nằm ngoài mặt phẳng chiếu, M là trung điểm của AB. Ba tia chiếu song song cùng phương xuất phát từ A, M, B đâm xuống mặt phẳng, cho ba ảnh lần lượt là A phẩy, M phẩy, B phẩy. Hình động cho thấy hai điều mà một câu định nghĩa không nói được: thứ nhất, ba tia luôn song song nên ảnh của ba điểm thẳng hàng vẫn thẳng hàng; thứ hai, ảnh M phẩy rơi đúng vào trung điểm của A phẩy B phẩy, dù đoạn A phẩy B phẩy ngắn hơn hẳn đoạn AB gốc. Nghĩa là phép chiếu song song bảo toàn TỈ SỐ trên một đường thẳng nhưng không bảo toàn độ dài, cũng không bảo toàn góc — đó là lí do hình vẽ không gian được phép méo mà vẫn đúng.',
      viewBoxWidth: 320,
      viewBoxHeight: 230,
      durationMs: 6500,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'mat-phang',
          x1: 60,
          y1: 175.7,
          x2: 280,
          y2: 144.3,
          stroke: 'muted',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'nhan-mp',
          x: 288,
          y: 140,
          text: '(P)',
          size: 13,
          fill: 'muted',
        },
        {
          kind: 'line',
          id: 'doan-ab',
          x1: 60,
          y1: 60,
          x2: 200,
          y2: 40,
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'circle',
          id: 'diem-a',
          cx: 60,
          cy: 60,
          r: 5,
          fill: 'primary',
        },
        {
          kind: 'circle',
          id: 'diem-b',
          cx: 200,
          cy: 40,
          r: 5,
          fill: 'primary',
        },
        {
          kind: 'circle',
          id: 'diem-m',
          cx: 130,
          cy: 50,
          r: 5,
          fill: 'accent',
        },
        {
          kind: 'label',
          id: 'nhan-a',
          x: 52,
          y: 54,
          text: 'A',
          size: 14,
          anchor: 'end',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-b',
          x: 208,
          y: 34,
          text: 'B',
          size: 14,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-m',
          x: 130,
          y: 36,
          text: 'M (trung điểm)',
          size: 12,
          anchor: 'middle',
          fill: 'accent',
        },
        {
          kind: 'arrow',
          id: 'tia-a',
          x1: 60,
          y1: 60,
          x2: 100,
          y2: 170,
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
              atMs: 700,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'tia-b',
          x1: 200,
          y1: 40,
          x2: 240,
          y2: 150,
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
              atMs: 1400,
              opacity: 0,
            },
            {
              atMs: 1800,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'tia-m',
          x1: 130,
          y1: 50,
          x2: 170,
          y2: 160,
          stroke: 'accent',
          strokeWidth: 2,
          dash: '5 4',
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
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'line',
          id: 'anh-ab',
          x1: 100,
          y1: 170,
          x2: 240,
          y2: 150,
          stroke: 'correct',
          strokeWidth: 4,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3600,
              opacity: 0,
            },
            {
              atMs: 4100,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'anh-a',
          cx: 100,
          cy: 170,
          r: 5,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1200,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'anh-b',
          cx: 240,
          cy: 150,
          r: 5,
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 2300,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'anh-m',
          cx: 170,
          cy: 160,
          r: 6,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3500,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-a2',
          x: 92,
          y: 190,
          text: "A'",
          size: 14,
          anchor: 'end',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-b2',
          x: 248,
          y: 168,
          text: "B'",
          size: 14,
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'nhan-m2',
          x: 170,
          y: 200,
          text: "M' vẫn là trung điểm của A'B'",
          size: 12,
          anchor: 'middle',
          fill: 'accent',
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
              atMs: 4900,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ket',
          x: 160,
          y: 222,
          text: 'giữ tỉ số — KHÔNG giữ độ dài, không giữ góc',
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
              atMs: 5400,
              opacity: 0,
            },
            {
              atMs: 5900,
              opacity: 1,
            },
            {
              atMs: 6500,
              opacity: 1,
            },
          ],
        },
      ],
      captions: [
        {
          atMs: 700,
          text: 'Tia chiếu qua A đâm xuống (P) cho ảnh A′.',
        },
        {
          atMs: 1800,
          text: 'Tia qua B SONG SONG với tia qua A, cho ảnh B′.',
        },
        {
          atMs: 3000,
          text: 'Tia qua trung điểm M, cũng cùng phương.',
        },
        {
          atMs: 4900,
          text: 'M′ rơi đúng trung điểm A′B′ — tỉ số được bảo toàn.',
        },
        {
          atMs: 5900,
          text: 'Nhưng A′B′ ngắn hơn AB: độ dài và góc thì không được bảo toàn.',
        },
      ],
    },
    workedExample: {
      problem:
        'Cho đoạn thẳng AB và điểm I là trung điểm của AB. Chiếu song song ba điểm A, I, B lên mặt phẳng (P) ' +
        'theo phương Δ không song song với AB, được ba ảnh A′, I′, B′. Hãy cho biết I′ nằm ở đâu trên A′B′ và ' +
        'giải thích vì sao không thể kết luận A′B′ = AB.',
      steps: [
        'Bước 1 — Vì AB không song song với phương chiếu Δ nên ảnh của đường thẳng AB là một đường thẳng thật ' +
          'sự (không co thành điểm). Ba điểm A, I, B thẳng hàng nên ba ảnh A′, I′, B′ cũng thẳng hàng.',
        'Bước 2 — Ba đoạn AI, IB, AB cùng nằm trên MỘT đường thẳng, nên phép chiếu song song bảo toàn tỉ số ' +
          'giữa chúng: A′I′ / A′B′ = AI / AB.',
        'Bước 3 — Vì I là trung điểm nên AI / AB = 1/2, suy ra A′I′ / A′B′ = 1/2, tức I′ là trung điểm của A′B′.',
        'Bước 4 — Còn về độ dài: phép chiếu song song KHÔNG bảo toàn độ dài. Tuỳ góc giữa AB và phương chiếu, ' +
          'đoạn A′B′ có thể ngắn hơn hoặc dài hơn AB.',
        'Bước 5 — Kết luận: giữ được TỈ SỐ (nên trung điểm vẫn là trung điểm) nhưng không giữ được GIÁ TRỊ ' +
          'tuyệt đối của độ dài. Đây đúng là lí do khi vẽ hình biểu diễn ta phải vẽ trung điểm đúng chỗ, còn độ ' +
          'dài thì vẽ ước lượng cũng được.',
      ],
      answer: 'I′ là trung điểm của A′B′; nhưng nói chung A′B′ ≠ AB vì độ dài không được bảo toàn.',
    },
    checkQuestions: [
      {
        prompt: 'Phép chiếu song song KHÔNG bảo toàn tính chất nào sau đây?',
        choices: [
          { id: 'A', label: 'Tính thẳng hàng của ba điểm' },
          { id: 'B', label: 'Tính song song của hai đường thẳng' },
          { id: 'C', label: 'Độ lớn của một góc' },
          { id: 'D', label: 'Tỉ số của hai đoạn thẳng nằm trên cùng một đường thẳng' },
        ],
        answer: { kind: 'choice', correctIds: ['C'] },
        explain:
          'Góc và độ dài là hai thứ phép chiếu song song làm méo: một góc vuông hoàn toàn có thể cho ảnh là góc ' +
          'nhọn hoặc góc tù, tuỳ hướng chiếu — giống bóng nắng của khung cửa sổ vuông đổ xuống sân thành hình ' +
          'thoi. Ba tính chất còn lại đều được bảo toàn, và chính nhờ chúng mà việc vẽ hình không gian lên giấy ' +
          'mới có ý nghĩa: cạnh song song vẫn vẽ song song, trung điểm vẫn nằm giữa.',
      },
      {
        prompt:
          'Cho hai đường thẳng a và b song song với nhau và đều không song song với phương chiếu. Ảnh của chúng ' +
          'qua phép chiếu song song là gì?',
        choices: [
          { id: 'A', label: 'Hai đường thẳng cắt nhau' },
          { id: 'B', label: 'Hai đường thẳng song song hoặc trùng nhau' },
          { id: 'C', label: 'Hai điểm phân biệt' },
          { id: 'D', label: 'Hai đường thẳng chéo nhau' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Phép chiếu song song bảo toàn tính song song, nên ảnh của hai đường song song vẫn song song. Phải ' +
          'thêm khả năng "trùng nhau" vì nếu a và b cùng nằm trong một mặt phẳng chứa phương chiếu thì hai ảnh ' +
          'sẽ chồng khít lên nhau. Đáp án "chéo nhau" bị loại ngay vì mọi ảnh đều nằm trong CÙNG mặt phẳng ' +
          'chiếu (P), mà hai đường cùng một mặt phẳng thì không bao giờ chéo nhau được.',
      },
      {
        prompt:
          'Điểm M là trung điểm của đoạn thẳng AB. Gọi A′, B′, M′ lần lượt là ảnh của A, B, M qua một phép chiếu ' +
          'song song, biết AB không song song với phương chiếu. Khẳng định nào đúng?',
        choices: [
          { id: 'A', label: 'M′ là trung điểm của A′B′' },
          { id: 'B', label: 'M′ trùng với A′' },
          { id: 'C', label: 'M′ nằm ngoài đoạn A′B′' },
          { id: 'D', label: 'Không xác định được vị trí của M′' },
        ],
        answer: { kind: 'choice', correctIds: ['A'] },
        explain:
          'Phép chiếu song song bảo toàn tỉ số của các đoạn thẳng nằm trên cùng một đường thẳng. Vì AM/AB = 1/2 ' +
          'nên A′M′/A′B′ cũng bằng 1/2, tức M′ là trung điểm của A′B′. Đây là tính chất được dùng nhiều nhất khi ' +
          'vẽ hình biểu diễn: giao điểm hai đường chéo hình bình hành, trọng tâm tam giác, trung điểm cạnh — tất ' +
          'cả đều phải vẽ đúng vị trí, trong khi độ dài các cạnh thì vẽ ước lượng được.',
      },
      {
        prompt:
          'Một tam giác đều nằm trong mặt phẳng không song song với phương chiếu. Hình biểu diễn của nó có thể ' +
          'là hình nào?',
        choices: [
          { id: 'A', label: 'Chỉ có thể là một tam giác đều' },
          { id: 'B', label: 'Chỉ có thể là một tam giác cân' },
          { id: 'C', label: 'Một tam giác bất kì' },
          { id: 'D', label: 'Một đoạn thẳng' },
        ],
        answer: { kind: 'choice', correctIds: ['C'] },
        explain:
          'Vì phép chiếu song song không giữ độ dài lẫn độ lớn góc, ba cạnh bằng nhau và ba góc 60 độ của tam ' +
          'giác đều đều có thể bị làm méo thành ba cạnh khác nhau và ba góc khác nhau. Chỉ tính thẳng hàng được ' +
          'giữ, nên ảnh vẫn là một tam giác — nhưng là tam giác tuỳ ý. Đáp án "một đoạn thẳng" chỉ xảy ra khi mặt ' +
          'phẳng chứa tam giác SONG SONG với phương chiếu, trường hợp đã bị giả thiết loại trừ.',
      },
      {
        prompt:
          'Một đường thẳng d song song với phương chiếu Δ. Ảnh của d qua phép chiếu song song lên mặt phẳng (P) là gì?',
        choices: [
          { id: 'A', label: 'Một đường thẳng song song với d' },
          { id: 'B', label: 'Một điểm' },
          { id: 'C', label: 'Toàn bộ mặt phẳng (P)' },
          { id: 'D', label: 'Tập rỗng' },
        ],
        answer: { kind: 'choice', correctIds: ['B'] },
        explain:
          'Các đường chiếu đều song song với Δ. Nếu d cũng song song với Δ thì mọi điểm của d đều được chiếu dọc ' +
          'theo CHÍNH đường thẳng d, nên tất cả cùng rơi vào đúng một điểm: giao điểm của d với mặt phẳng (P). ' +
          'Đây là ngoại lệ duy nhất của quy tắc "ảnh của đường thẳng là đường thẳng", và cũng là lí do khi vẽ ' +
          'hình biểu diễn ta phải chọn phương chiếu không trùng với bất kì cạnh quan trọng nào của hình — chọn ' +
          'trúng thì cạnh đó biến mất, hình vẽ mất thông tin.',
      },
      {
        prompt:
          'Hình biểu diễn của một hình bình hành nằm trong mặt phẳng không song song với phương chiếu là hình gì?',
        choices: [
          { id: 'A', label: 'Một hình bình hành' },
          { id: 'B', label: 'Một hình thang không phải hình bình hành' },
          { id: 'C', label: 'Một tứ giác bất kì' },
          { id: 'D', label: 'Một hình vuông' },
        ],
        answer: { kind: 'choice', correctIds: ['A'] },
        explain:
          'Hình bình hành được đặc trưng bởi hai cặp cạnh đối SONG SONG — mà tính song song thì được phép chiếu ' +
          'song song bảo toàn, nên ảnh vẫn có hai cặp cạnh đối song song, tức vẫn là hình bình hành. Ngược lại, ' +
          'hình vuông hay hình chữ nhật được đặc trưng bởi góc vuông và độ dài cạnh — hai thứ KHÔNG được bảo ' +
          'toàn — nên hình biểu diễn của chúng cũng chỉ là một hình bình hành bất kì, không nhận ra được nữa.',
      },
    ],
    srsCards: [
      {
        hoi: 'Phép chiếu song song bảo toàn những gì?',
        dap: 'Tính thẳng hàng, tính song song, và tỉ số hai đoạn trên cùng một đường thẳng (hoặc trên hai đường song song).',
      },
      {
        hoi: 'Phép chiếu song song KHÔNG bảo toàn những gì?',
        dap: 'Độ dài đoạn thẳng và độ lớn góc — nên hình vuông, tam giác đều không còn nhận ra được trên hình biểu diễn.',
      },
      {
        hoi: 'Khi nào ảnh của một đường thẳng co lại thành một điểm?',
        dap: 'Khi đường thẳng đó song song hoặc trùng với phương chiếu Δ.',
      },
      {
        hoi: 'Hình biểu diễn của hình bình hành là hình gì? Còn của hình vuông?',
        dap: 'Cả hai đều là một hình bình hành — vì góc và độ dài không được bảo toàn, không phân biệt được nữa.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
