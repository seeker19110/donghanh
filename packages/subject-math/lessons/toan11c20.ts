// lessons/toan11c20.ts — Chuyên đề bồi dưỡng HSG cấp TỈNH (track: 'advanced', tier 'hsg-tinh').
// Nâng một bậc so với cấp trường: Cauchy–Schwarz, phương tích – trục đẳng phương, đếm bằng song ánh.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN11_C20_LESSONS: MathLesson[] = [
  {
    id: 'toan11-c20-b1',
    grade: '11',
    chapterNumber: 20,
    chapterTitle: 'Chuyên đề bồi dưỡng học sinh giỏi cấp tỉnh',
    lessonNumber: 1,
    title: 'Bất đẳng thức Cauchy–Schwarz và kỹ thuật Cauchy–Schwarz dạng Engel',
    hook:
      'Có những bất đẳng thức mà AM–GM bó tay: khi biểu thức chứa tổng các phân số có tử là bình phương, áp AM–GM ' +
      'kiểu nào cũng ra chặn dưới không đạt được. Đề thi cấp tỉnh rất hay ra đúng dạng ấy, vì nó phân loại được ai ' +
      'chỉ thuộc một công cụ với ai có cả bộ đồ nghề.',
    theory:
      'DẠNG CƠ BẢN (Cauchy–Schwarz)\n' +
      '(a₁² + a₂² + ... + aₙ²)(b₁² + b₂² + ... + bₙ²) ≥ (a₁b₁ + a₂b₂ + ... + aₙbₙ)².\n' +
      'Dấu bằng xảy ra khi hai bộ số TỈ LỆ với nhau: a₁/b₁ = a₂/b₂ = ... = aₙ/bₙ.\n' +
      'Ý NGHĨA HÌNH HỌC giúp nhớ không cần học vẹt: viết lại là |u→|·|v→| ≥ |u→·v→|, chính là hệ quả của công thức ' +
      'u→·v→ = |u→||v→|cosα với |cosα| ≤ 1. Dấu bằng khi cosα = ±1, tức hai vectơ cùng phương — đúng là điều kiện ' +
      'tỉ lệ ở trên.\n\n' +
      'DẠNG ENGEL (còn gọi là "Cauchy–Schwarz dạng cộng mẫu" hay bất đẳng thức Cauchy–Bunyakovsky dạng phân thức)\n' +
      'Với mọi x₁, ..., xₙ và mọi y₁, ..., yₙ DƯƠNG:\n' +
      'x₁²/y₁ + x₂²/y₂ + ... + xₙ²/yₙ ≥ (x₁ + x₂ + ... + xₙ)² / (y₁ + y₂ + ... + yₙ).\n' +
      'Dấu bằng khi x₁/y₁ = x₂/y₂ = ... = xₙ/yₙ.\n' +
      'ĐIỀU KIỆN MẪU DƯƠNG LÀ BẮT BUỘC — dạng này sai hoàn toàn nếu có mẫu âm.\n\n' +
      'VÌ SAO DẠNG ENGEL LÀ VŨ KHÍ MẠNH NHẤT Ở CẤP TỈNH\n' +
      'Nó gom một TỔNG nhiều phân số thành MỘT phân số duy nhất. Khi đề cho ràng buộc dạng "a + b + c = 1", mẫu số ' +
      'sau khi gom thường rút gọn thành hằng số, và bài toán xong trong hai dòng. AM–GM không làm được việc gom ấy ' +
      'vì nó chỉ so tổng với tích.\n\n' +
      'KỸ THUẬT BIẾN ĐỔI VỀ DẠNG ENGEL\n' +
      'Biểu thức a/b không sẵn dạng x²/y, nhưng viết được thành a²/(ab). Tương tự 1/a = 1²/a. Thủ thuật "nhân thêm ' +
      'để tạo bình phương ở tử" này là bước đi đầu tiên của hầu hết lời giải.\n\n' +
      'CÁCH KIỂM TRA LỜI GIẢI TRƯỚC KHI VIẾT VÀO BÀI THI\n' +
      'Thay bộ giá trị làm dấu bằng xảy ra vào cả hai vế: chúng phải bằng nhau. Nếu không bằng thì chặn tìm được ' +
      'không chặt, tức chưa phải đáp số. Bước kiểm này mất 30 giây và cứu được rất nhiều bài.',
    workedExample: {
      problem: 'Cho a, b, c là các số dương thoả a + b + c = 1. Chứng minh 1/a + 1/b + 1/c ≥ 9.',
      steps: [
        'Bước 1 — Nhận dạng: vế trái là tổng các phân số có tử bằng 1, ràng buộc lại cho TỔNG các mẫu. Đây đúng là ' +
          'cấu hình mà dạng Engel xử lý gọn nhất.',
        'Bước 2 — Đưa về dạng chuẩn bằng cách viết tử thành bình phương: 1/a = 1²/a, tương tự cho b và c.',
        'Bước 3 — Áp dụng Engel với xᵢ = 1 và yᵢ là a, b, c (đều dương nên điều kiện thoả): ' +
          '1²/a + 1²/b + 1²/c ≥ (1 + 1 + 1)²/(a + b + c) = 9/(a + b + c).',
        'Bước 4 — Thay ràng buộc a + b + c = 1: vế phải bằng 9/1 = 9. Vậy 1/a + 1/b + 1/c ≥ 9.',
        'Bước 5 — Xác định và KIỂM dấu bằng: dấu bằng khi 1/a = 1/b = 1/c, tức a = b = c; kết hợp ràng buộc cho ' +
          'a = b = c = 1/3. Thay lại vế trái: 3 + 3 + 3 = 9, đúng bằng vế phải. Vậy chặn 9 là chặt và bài toán hoàn tất.',
      ],
      answer: 'Bất đẳng thức đúng; dấu bằng xảy ra khi a = b = c = 1/3.',
    },
    checkQuestions: [
      {
        prompt:
          'Cho a, b dương thoả a + b = 4. Áp dụng bất đẳng thức dạng Engel, giá trị nhỏ nhất của 1/a + 1/b bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 1 },
        explain:
          '1/a + 1/b = 1²/a + 1²/b ≥ (1+1)²/(a+b) = 4/4 = 1, dấu bằng khi a = b = 2. Kiểm lại: 1/2 + 1/2 = 1, khớp. ' +
          'Lỗi hay gặp là dùng AM–GM thành 1/a + 1/b ≥ 2/√(ab) rồi kẹt lại vì √(ab) chưa bị ràng buộc trực tiếp — ' +
          'phải đi thêm một bước nữa. Dạng Engel cho kết quả thẳng vì nó khai thác được đúng dữ kiện tổng a + b.',
      },
      {
        prompt:
          'Trong bất đẳng thức Cauchy–Schwarz dạng Engel, điều kiện nào là bắt buộc đối với các mẫu số yᵢ?',
        choices: [
          { id: 'duong', label: 'Tất cả phải dương' },
          { id: 'khac_khong', label: 'Chỉ cần khác 0' },
          { id: 'nguyen', label: 'Phải là số nguyên' },
          { id: 'khong_can', label: 'Không cần điều kiện gì' },
        ],
        answer: { kind: 'choice', correctIds: ['duong'] },
        explain:
          'Các mẫu phải DƯƠNG, không chỉ khác 0. Phản ví dụ khi cho phép mẫu âm: với x₁ = x₂ = 1, y₁ = 1, y₂ = −1 ' +
          'thì vế trái bằng 1 − 1 = 0 còn vế phải là 4/0 — vô nghĩa; đổi chút số liệu sẽ cho vế trái nhỏ hơn hẳn vế ' +
          'phải, bất đẳng thức sụp đổ. Trong bài thi, nếu chưa chắc mẫu dương thì phải chứng minh trước khi áp dụng.',
      },
      {
        prompt:
          'Cho a, b, c dương với a + b + c = 3. Giá trị nhỏ nhất của a²/(a+b) + b²/(b+c) + c²/(c+a) bằng bao nhiêu? ' +
          '(Nhập dạng phân số hoặc số thập phân.)',
        answer: { kind: 'fraction', num: 3, den: 2 },
        explain:
          'Áp Engel: tổng ≥ (a+b+c)²/[(a+b)+(b+c)+(c+a)] = 9/(2·3) = 9/6 = 3/2. Dấu bằng khi a/(a+b) = b/(b+c) = ' +
          'c/(c+a), thoả khi a = b = c = 1; kiểm lại mỗi số hạng bằng 1/2, tổng đúng 3/2. Bẫy ở đây là mẫu số tổng ' +
          'cộng lại cho 2(a+b+c) chứ không phải (a+b+c) — quên nhân 2 sẽ ra 3, một chặn KHÔNG đạt được.',
      },
    ],
    srsCards: [
      {
        hoi: 'Phát biểu bất đẳng thức Cauchy–Schwarz dạng Engel?',
        dap: 'Σ(xᵢ²/yᵢ) ≥ (Σxᵢ)²/(Σyᵢ) với mọi yᵢ DƯƠNG; dấu bằng khi các tỉ số xᵢ/yᵢ bằng nhau.',
      },
      {
        hoi: 'Khi nào nên chọn Engel thay vì AM–GM?',
        dap: 'Khi biểu thức là tổng các phân số và ràng buộc cho tổng các mẫu — Engel gom được về một phân số.',
      },
      {
        hoi: 'Bước kiểm bắt buộc sau khi tìm ra chặn dưới?',
        dap: 'Thay bộ giá trị làm dấu bằng vào cả hai vế; phải bằng nhau thì chặn mới chặt.',
      },
    ],
    track: 'advanced',
    advancedTier: 'hsg-tinh',
    reviewStatus: 'draft',
  },
  {
    id: 'toan11-c20-b2',
    grade: '11',
    chapterNumber: 20,
    chapterTitle: 'Chuyên đề bồi dưỡng học sinh giỏi cấp tỉnh',
    lessonNumber: 2,
    title: 'Phương tích của một điểm và trục đẳng phương',
    hook:
      'Cho hai đường tròn cắt nhau tại hai điểm. Vì sao đường thẳng nối hai giao điểm ấy lại có một tính chất lạ: ' +
      'mọi điểm trên nó đều "cách đều" hai đường tròn theo một nghĩa nhất định — kể cả những điểm nằm rất xa, ở ' +
      'ngoài cả hai đường tròn? Trả lời được câu này là mở khoá được cả một lớp bài hình học thi tỉnh.',
    theory:
      'ĐỊNH NGHĨA PHƯƠNG TÍCH\n' +
      'Cho đường tròn (O; R) và điểm M. Phương tích của M đối với (O) là:\n' +
      'P_(O)(M) = MO² − R².\n' +
      'Dấu của nó nói ngay vị trí: dương khi M nằm NGOÀI, bằng 0 khi M nằm TRÊN, âm khi M nằm TRONG đường tròn.\n\n' +
      'TÍNH CHẤT CỐT LÕI (lý do phương tích hữu dụng)\n' +
      'Với mọi đường thẳng qua M cắt (O) tại hai điểm A, B thì tích vô hướng MA→ · MB→ luôn bằng MO² − R², KHÔNG phụ ' +
      'thuộc vào việc chọn đường thẳng nào.\n' +
      'VÌ SAO: kẻ đường thẳng qua M và tâm O, cắt đường tròn tại hai đầu đường kính. Với cát tuyến đặc biệt này, ' +
      'tích các độ dài đúng bằng (MO − R)(MO + R) = MO² − R². Tính bất biến với mọi cát tuyến khác suy ra từ tính ' +
      'đồng dạng của hai tam giác tạo bởi hai cát tuyến (góc nội tiếp cùng chắn một cung).\n' +
      'HỆ QUẢ TIẾP TUYẾN: nếu MT là tiếp tuyến với tiếp điểm T thì MT² = MO² − R², tức MT² = MA · MB. Đây là công ' +
      'cụ chính để chứng minh một đường thẳng là tiếp tuyến.\n\n' +
      'TRỤC ĐẲNG PHƯƠNG\n' +
      'Tập hợp các điểm có phương tích BẰNG NHAU đối với hai đường tròn không đồng tâm là một ĐƯỜNG THẲNG vuông góc ' +
      'với đường nối hai tâm. Đường thẳng ấy gọi là trục đẳng phương.\n' +
      'Chứng minh bằng toạ độ chỉ mất hai dòng: viết hai phương trình đường tròn dạng khai triển rồi TRỪ vế theo vế, ' +
      'các số hạng x² và y² triệt tiêu, còn lại đúng một phương trình bậc nhất — tức một đường thẳng.\n' +
      '— Hai đường tròn CẮT nhau: trục đẳng phương chính là đường thẳng qua hai giao điểm (vì tại giao điểm cả hai ' +
      'phương tích đều bằng 0). Đó là lời giải cho câu hỏi ở đầu bài.\n' +
      '— Hai đường tròn TIẾP XÚC: trục đẳng phương là tiếp tuyến chung tại tiếp điểm.\n' +
      '— Hai đường tròn KHÔNG giao nhau: trục đẳng phương vẫn tồn tại, nằm giữa hai đường tròn và không cắt đường ' +
      'tròn nào. Đây là điểm khiến khái niệm này mạnh hơn hẳn "đường nối hai giao điểm".\n\n' +
      'TÂM ĐẲNG PHƯƠNG: ba trục đẳng phương của ba đường tròn đôi một (tâm không thẳng hàng) ĐỒNG QUY tại một điểm. ' +
      'Đây là công cụ chuẩn để chứng minh ba đường thẳng đồng quy — một dạng bài rất hay ra ở đề thi tỉnh.',
    workedExample: {
      problem:
        'Cho đường tròn (O) bán kính R = 5 và điểm M cách tâm O một khoảng OM = 13. Từ M kẻ tiếp tuyến MT tới đường ' +
        'tròn và một cát tuyến cắt đường tròn tại A, B với MA = 8. Tính MT và MB.',
      steps: [
        'Bước 1 — Tính phương tích của M, đại lượng bất biến của cả bài: P = OM² − R² = 169 − 25 = 144. Giá trị dương ' +
          'khẳng định M nằm ngoài đường tròn, nên tiếp tuyến MT tồn tại.',
        'Bước 2 — Dùng hệ quả tiếp tuyến: MT² = P = 144, suy ra MT = 12. Chọn cách này thay vì dựng tam giác vuông ' +
          'OTM rồi Pythagore vì hai cách cho cùng kết quả nhưng phương tích dùng lại được ngay ở bước sau.',
        'Bước 3 — Dùng tính bất biến với cát tuyến: MA · MB = P = 144. Điểm mấu chốt là phương tích KHÔNG phụ thuộc ' +
          'cát tuyến nào được chọn, nên vẫn đúng bằng 144.',
        'Bước 4 — Thay MA = 8: 8 · MB = 144 ⇔ MB = 18.',
        'Bước 5 — Kiểm tính hợp lý: MB − MA = 10, chính là độ dài dây cung AB, phải không vượt quá đường kính ' +
          '2R = 10. Ở đây bằng đúng 10, nghĩa là cát tuyến này đi qua tâm O — kết quả nhất quán (thật vậy, ' +
          'MA = OM − R = 8 và MB = OM + R = 18).',
      ],
      answer: 'MT = 12 và MB = 18.',
    },
    checkQuestions: [
      {
        prompt:
          'Cho đường tròn (O; R = 3) và điểm M với OM = 5. Phương tích của M đối với đường tròn bằng bao nhiêu?',
        answer: { kind: 'numeric', value: 16 },
        explain:
          'P = OM² − R² = 25 − 9 = 16. Lỗi hay gặp là lấy OM − R = 2 (quên bình phương). Giá trị dương cho biết M ' +
          'nằm ngoài đường tròn, và độ dài tiếp tuyến từ M bằng √16 = 4.',
      },
      {
        prompt:
          'Điểm M nằm BÊN TRONG đường tròn. Phương tích của M đối với đường tròn đó mang dấu gì?',
        choices: [
          { id: 'duong', label: 'Dương' },
          { id: 'am', label: 'Âm' },
          { id: 'khong', label: 'Bằng 0' },
          { id: 'tuy', label: 'Tuỳ trường hợp' },
        ],
        answer: { kind: 'choice', correctIds: ['am'] },
        explain:
          'M nằm trong nên OM < R, do đó OM² − R² < 0. Nhiều bạn cho rằng phương tích là "một độ dài" nên phải không ' +
          'âm — đó là hiểu nhầm: phương tích là một SỐ CÓ DẤU, và chính cái dấu ấy mang thông tin về vị trí. Chỉ khi ' +
          'phương tích dương thì nó mới bằng bình phương độ dài tiếp tuyến (vì khi M nằm trong thì không kẻ được ' +
          'tiếp tuyến nào).',
      },
      {
        prompt:
          'Hai đường tròn KHÔNG có điểm chung và không đồng tâm. Trục đẳng phương của chúng có tồn tại không? ' +
          'Nhập 1 nếu CÓ, 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 1 },
        explain:
          'CÓ. Đây là hiểu nhầm phổ biến nhất về khái niệm này: nhiều bạn đồng nhất trục đẳng phương với "đường ' +
          'thẳng qua hai giao điểm", nên nghĩ không giao nhau thì không có trục. Thực ra trục đẳng phương được định ' +
          'nghĩa bằng ĐIỀU KIỆN PHƯƠNG TÍCH BẰNG NHAU, không cần giao điểm. Trừ hai phương trình đường tròn vế theo ' +
          'vế luôn cho một phương trình bậc nhất, miễn hai tâm khác nhau. Với hai đường tròn rời nhau, trục đẳng ' +
          'phương nằm giữa chúng và không cắt đường tròn nào.',
      },
    ],
    srsCards: [
      {
        hoi: 'Định nghĩa phương tích của điểm M với đường tròn (O;R)?',
        dap: 'P = MO² − R²; dương khi M ngoài, bằng 0 khi trên, âm khi trong đường tròn.',
      },
      {
        hoi: 'Tính chất bất biến quan trọng nhất của phương tích?',
        dap: 'Với mọi cát tuyến qua M cắt đường tròn tại A, B thì MA·MB luôn bằng phương tích, không đổi theo cát tuyến.',
      },
      {
        hoi: 'Trục đẳng phương của hai đường tròn tìm bằng cách nào?',
        dap: 'Trừ vế theo vế hai phương trình dạng khai triển; các số hạng bậc hai triệt tiêu, còn lại một đường thẳng.',
      },
    ],
    track: 'advanced',
    advancedTier: 'hsg-tinh',
    reviewStatus: 'draft',
  },
]
