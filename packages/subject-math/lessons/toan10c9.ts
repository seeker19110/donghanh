// lessons/toan10c9.ts — Toán 10, Chương 9: Tính xác suất theo định nghĩa cổ điển.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN10_C9_LESSONS: MathLesson[] = [
  {
    id: 'toan10-c9-b1',
    grade: '10',
    chapterNumber: 9,
    chapterTitle: 'Tính xác suất theo định nghĩa cổ điển',
    lessonNumber: 1,
    title: 'Không gian mẫu, biến cố và xác suất cổ điển',
    hook:
      'Trong một trò chơi hội chợ Tết, người ta úp 3 chiếc bát, dưới một chiếc có đồng xu. Bạn chọn một bát, người ' +
      'chủ trò lật một bát TRỐNG trong hai bát còn lại rồi hỏi: "Có muốn đổi không?" Trực giác bảo đổi hay không ' +
      'chẳng khác gì nhau. Trực giác sai — và bài học này cho bạn công cụ để chứng minh nó sai.',
    theory:
      'BA KHÁI NIỆM NỀN\n' +
      '— Phép thử ngẫu nhiên: hành động mà ta biết trước tập các kết quả có thể, nhưng không biết trước kết quả nào ' +
      'sẽ xảy ra.\n' +
      '— Không gian mẫu Ω: tập TẤT CẢ các kết quả có thể.\n' +
      '— Biến cố A: một tập con của Ω, gồm những kết quả mà ta quan tâm.\n\n' +
      'ĐỊNH NGHĨA CỔ ĐIỂN\n' +
      'P(A) = n(A) / n(Ω).\n' +
      'ĐIỀU KIỆN ÁP DỤNG CỰC KỲ QUAN TRỌNG: công thức này chỉ đúng khi các kết quả trong Ω ĐỒNG KHẢ NĂNG, tức khả ' +
      'năng xảy ra như nhau. Nếu không, đếm số phần tử rồi chia là sai hoàn toàn. Ví dụ tung hai đồng xu, nếu lấy ' +
      'Ω = {hai mặt giống nhau, hai mặt khác nhau} thì hai kết quả này KHÔNG đồng khả năng (khác nhau có xác suất ' +
      '1/2, giống nhau cũng 1/2 nhưng phải phân tích kỹ mới thấy). Cách an toàn: luôn mô tả Ω ở mức chi tiết nhất, ' +
      'phân biệt cả các vật giống hệt nhau.\n\n' +
      'TÍNH CHẤT\n' +
      '— 0 ≤ P(A) ≤ 1; P(∅) = 0; P(Ω) = 1.\n' +
      '— Biến cố đối: P(Ā) = 1 − P(A). Đây là công cụ mạnh nhất của chương: những bài có cụm "ít nhất một" thường ' +
      'nên tính qua biến cố đối "không có cái nào", vì biến cố đối chỉ có một trường hợp trong khi biến cố gốc có ' +
      'rất nhiều trường hợp.\n\n' +
      'QUY TRÌNH BỐN BƯỚC LÀM BÀI\n' +
      '1. Mô tả rõ phép thử và tính n(Ω) — thường bằng tổ hợp hoặc quy tắc nhân.\n' +
      '2. Phát biểu biến cố A bằng lời thật chính xác.\n' +
      '3. Đếm n(A), chú ý dùng đúng công cụ đếm ở chương 8.\n' +
      '4. Chia và kiểm tra kết quả có nằm trong [0; 1] không.\n\n' +
      'LỖI TƯ DUY PHỔ BIẾN NHẤT: nghĩ rằng "có hai khả năng nên mỗi khả năng xác suất 1/2". Trúng số có hai khả ' +
      'năng (trúng/không trúng) nhưng xác suất trúng chắc chắn không phải 1/2. Số khả năng không quyết định xác ' +
      'suất; tính ĐỒNG KHẢ NĂNG mới quyết định.',
    workedExample: {
      problem:
        'Một hộp có 5 bi đỏ và 3 bi xanh. Lấy ngẫu nhiên đồng thời 3 bi. Tính xác suất để (a) cả 3 bi đều đỏ; ' +
        '(b) có ít nhất 1 bi xanh.',
      steps: [
        'Bước 1 — Tính n(Ω): lấy 3 bi trong 8 bi, lấy đồng thời nên không kể thứ tự, dùng tổ hợp: ' +
          'n(Ω) = C³₈ = (8·7·6)/6 = 56. Ta coi 8 viên bi là ĐÔI MỘT KHÁC NHAU (dù cùng màu) để đảm bảo các kết quả ' +
          'đồng khả năng — đây là bước quan trọng nhất.',
        'Bước 2 — Câu (a): gọi A là biến cố "cả 3 bi đều đỏ". Số cách chọn 3 bi từ 5 bi đỏ là C³₅ = 10. ' +
          'Vậy P(A) = 10/56 = 5/28 ≈ 0,179.',
        'Bước 3 — Câu (b): gọi B là biến cố "có ít nhất 1 bi xanh". Nếu đếm trực tiếp phải cộng ba trường hợp ' +
          '(1 xanh, 2 xanh, 3 xanh) — dài và dễ sót. Nhận xét: biến cố đối của B chính là "không có bi xanh nào", ' +
          'tức là A ở câu trên.',
        'Bước 4 — Dùng biến cố đối: P(B) = 1 − P(A) = 1 − 5/28 = 23/28 ≈ 0,821.',
        'Bước 5 — Kiểm tra tính hợp lý: số bi đỏ nhiều hơn nhưng vẫn chỉ có 5 trong 8, nên việc bốc 3 viên mà không ' +
          'dính viên xanh nào là khá khó — xác suất 0,179 nhỏ, phù hợp trực giác. Cả hai kết quả đều nằm trong [0;1].',
      ],
      answer: '(a) P = 5/28 ≈ 0,179; (b) P = 23/28 ≈ 0,821.',
    },
    checkQuestions: [
      {
        prompt:
          'Gieo một con xúc xắc cân đối 1 lần. Tính xác suất để số chấm xuất hiện là số nguyên tố. ' +
          '(Nhập dưới dạng phân số tối giản, ví dụ 1/3.)',
        answer: { kind: 'fraction', num: 1, den: 2 },
        explain:
          'Không gian mẫu Ω = {1;2;3;4;5;6} có 6 phần tử đồng khả năng. Các số nguyên tố trong đó là 2, 3, 5 — ba ' +
          'phần tử. Vậy P = 3/6 = 1/2. Bẫy nằm ở số 1: rất nhiều bạn tính cả số 1 là số nguyên tố và ra 4/6 = 2/3. ' +
          'Số 1 KHÔNG phải số nguyên tố vì nó chỉ có đúng một ước dương, trong khi số nguyên tố phải có đúng hai ước ' +
          'là 1 và chính nó.',
      },
      {
        prompt:
          'Gieo hai đồng xu cân đối. Xác suất để cả hai đồng đều xuất hiện mặt ngửa là bao nhiêu? ' +
          '(Nhập dạng phân số, ví dụ 1/2.)',
        answer: { kind: 'fraction', num: 1, den: 4 },
        explain:
          'Đây là bẫy về tính ĐỒNG KHẢ NĂNG. Nhiều bạn mô tả Ω = {hai ngửa, hai sấp, một ngửa một sấp} rồi kết luận ' +
          'P = 1/3. Sai, vì ba kết quả đó không đồng khả năng: trường hợp "một ngửa một sấp" xảy ra theo HAI cách ' +
          '(NS và SN). Mô tả đúng phải phân biệt từng đồng xu: Ω = {NN, NS, SN, SS} với 4 kết quả đồng khả năng, nên ' +
          'P(NN) = 1/4. Bài học: luôn mô tả không gian mẫu ở mức chi tiết nhất.',
      },
      {
        prompt:
          'Một lớp có 20 bạn, trong đó 12 bạn biết bơi. Chọn ngẫu nhiên 1 bạn. Xác suất bạn đó KHÔNG biết bơi bằng ' +
          'bao nhiêu? (Nhập dạng phân số tối giản.)',
        answer: { kind: 'fraction', num: 2, den: 5 },
        explain:
          'Dùng biến cố đối: P(không biết bơi) = 1 − 12/20 = 8/20 = 2/5. Có thể đếm trực tiếp: 20 − 12 = 8 bạn không ' +
          'biết bơi, cho 8/20 = 2/5. Hai cách cho cùng kết quả, đó là kiểm chứng tốt. Lưu ý phải rút gọn phân số ' +
          'trước khi ghi đáp án cuối.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức xác suất cổ điển và điều kiện áp dụng?',
        dap: 'P(A) = n(A)/n(Ω), chỉ đúng khi các kết quả trong không gian mẫu đồng khả năng.',
      },
      {
        hoi: 'Khi nào nên dùng biến cố đối?',
        dap: 'Khi đề có cụm "ít nhất một" — biến cố đối "không có cái nào" thường chỉ một trường hợp, đếm nhanh hơn.',
      },
      {
        hoi: 'Vì sao xác suất hai đồng xu cùng ngửa là 1/4 chứ không phải 1/3?',
        dap: 'Vì phải phân biệt từng đồng xu: Ω = {NN, NS, SN, SS} mới gồm 4 kết quả đồng khả năng.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
