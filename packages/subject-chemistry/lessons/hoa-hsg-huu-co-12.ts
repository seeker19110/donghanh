// lessons/hoa-hsg-huu-co-12.ts — NHÁNH NÂNG CAO (track 'advanced'): chuyên đề bồi dưỡng học
// sinh giỏi về HOÁ HỮU CƠ LỚP 12, gắn vào chương 1–4 (Ester–Lipid · Carbohydrate · Hợp chất
// chứa nitrogen · Polymer).
//
// Ba cấp tăng dần:
//   hsg-truong    — thuỷ phân ester và chất béo: chỉ số xà phòng hoá, xác định công thức.
//   hsg-tinh      — amine – amino acid – peptide: tính lưỡng tính, điểm đẳng điện, đếm peptide.
//   hsg-quoc-gia  — bài toán hỗn hợp: bảo toàn khối lượng/nguyên tố, quy đổi, hệ số polymer.
//
// Vì sao lớp 12 có HAI chuyên đề (đặc tả docs/specs/2026-09-14-chuyen-de-hsg-hoa-12.md, người
// dùng chốt 2026-09-14): lớp 12 gánh cả khối hữu cơ lẫn khối điện hoá/kim loại và là lớp dự thi
// quốc gia, nên lấy 2 chuyên đề để Hoá cân đối 3/6/6 bài cho lớp 10/11/12.
//
// reviewStatus='draft' — nội dung tự soạn, chưa qua giáo viên Hoá duyệt.
import type { ChemLesson } from '../lessonTypes.js'

export const HOA_HSG_HUU_CO_12_LESSONS: ChemLesson[] = [
  {
    id: 'hoa12-c93-b1',
    grade: '12',
    chapterNumber: 93,
    chapterTitle: 'Chuyên đề HSG — Hữu cơ lớp 12',
    lessonNumber: 1,
    title: 'HSG cấp trường: Thuỷ phân ester, chất béo và chỉ số xà phòng hoá',
    hook:
      'Một bánh xà phòng và một chai dầu ăn chỉ cách nhau đúng một phản ứng. Nhà máy nấu xà ' +
      'phòng phải biết chính xác cần bao nhiêu kilôgam xút cho mỗi tấn dầu — thiếu thì dầu còn ' +
      'dư, thừa thì xà phòng ăn da tay. Con số ấy có tên riêng: chỉ số xà phòng hoá.',
    theory:
      'PHẢN ỨNG THUỶ PHÂN ESTER có hai phiên bản, khác nhau ở một điểm quyết định:\n\n' +
      '• Trong môi trường acid (H₂SO₄ loãng, đun nóng): RCOOR′ + H₂O ⇌ RCOOH + R′OH — THUẬN ' +
      'NGHỊCH, không bao giờ chạy hết, muốn tăng hiệu suất phải lấy bớt sản phẩm ra.\n' +
      '• Trong môi trường base (NaOH, KOH): RCOOR′ + NaOH → RCOONa + R′OH — MỘT CHIỀU, chạy tới ' +
      'cùng. Gọi riêng là phản ứng xà phòng hoá.\n\n' +
      'Lý do một chiều: base trung hoà luôn acid vừa sinh ra thành muối carboxylate, sản phẩm bị ' +
      'rút khỏi cân bằng nên phản ứng nghịch không còn đường quay lại. Đây là chỗ đề hay hỏi ' +
      '"vì sao", không chỉ hỏi "ra chất gì".\n\n' +
      'TỈ LỆ MOL — chìa khoá của mọi bài xác định công thức:\n\n' +
      '    ester ĐƠN chức : NaOH = 1 : 1\n' +
      '    chất béo (triester của glycerol) : NaOH = 1 : 3, sinh 1 mol glycerol\n' +
      '    ester của phenol : NaOH = 1 : 2 (một để thuỷ phân, một để trung hoà phenol sinh ra)\n\n' +
      'Trường hợp ester của phenol là cái bẫy kinh điển: thấy ester đơn chức mà tiêu tốn gấp đôi ' +
      'NaOH thì phải nghĩ ngay tới nó, đừng vội kết luận đề sai.\n\n' +
      'XÁC ĐỊNH CÔNG THỨC ESTER từ dữ kiện mol: biết khối lượng m và số mol NaOH phản ứng, tính ' +
      'ngay được phân tử khối M = m/n(ester), với n(ester) suy từ tỉ lệ ở trên. Có M rồi thì ' +
      'ghép công thức: ester no, đơn chức, mạch hở có dạng CₙH₂ₙO₂ nên M = 14n + 32.\n\n' +
      'CHẤT BÉO là triester của glycerol với acid béo. Ba acid béo cần thuộc: palmitic C₁₅H₃₁COOH ' +
      '(no), stearic C₁₇H₃₅COOH (no), oleic C₁₇H₃₃COOH (một nối đôi). Chất béo chứa nhiều gốc ' +
      'không no thì ở thể lỏng (dầu thực vật), nhiều gốc no thì ở thể rắn (mỡ động vật) — vì nối ' +
      'đôi cis làm mạch gãy khúc, các phân tử khó xếp khít nên nhiệt độ nóng chảy thấp.\n\n' +
      'CHỈ SỐ XÀ PHÒNG HOÁ là số MILIGAM KOH cần để xà phòng hoá hoàn toàn 1 GAM chất béo. Đọc ' +
      'kỹ định nghĩa: đơn vị là mg, dùng KOH (M = 56) chứ không phải NaOH, và tính trên 1 gam. ' +
      'Ba chi tiết ấy là ba chỗ mất điểm. Công thức làm việc:\n\n' +
      '    chỉ số xà phòng hoá = n(KOH) × 56 × 1000 / m(chất béo, gam)\n\n' +
      'Cùng họ với nó là chỉ số acid (số mg KOH trung hoà acid béo TỰ DO trong 1 gam chất béo) — ' +
      'đừng lẫn hai khái niệm: một cái đo toàn bộ ester, một cái chỉ đo phần acid đã bị ôi.',
    workedExample: {
      problem:
        'Xà phòng hoá hoàn toàn 7,40 gam một ester đơn chức, mạch hở X cần vừa đủ 100 mL dung ' +
        'dịch NaOH 1,00 M. Xác định công thức phân tử của X.',
      steps: [
        'Tính số mol NaOH: n = 0,100 L × 1,00 M = 0,100 mol.',
        'X đơn chức nên tỉ lệ ester : NaOH = 1 : 1 ⇒ n(X) = 0,100 mol.',
        'Phân tử khối: M = m/n = 7,40/0,100 = 74 g/mol.',
        'X là ester no, đơn chức, mạch hở nên có dạng CₙH₂ₙO₂: 14n + 32 = 74 ⇒ n = 3.',
        'Công thức phân tử: C₃H₆O₂.',
        'Đối chiếu: hai đồng phân ester ứng với công thức này là HCOOC₂H₅ và CH₃COOCH₃ — dữ kiện ' +
          'đề chưa đủ để phân biệt, muốn chọn một thì cần thêm dữ kiện về sản phẩm (ví dụ có ' +
          'phản ứng tráng bạc hay không).',
      ],
      answer: 'M = 74 g/mol, công thức phân tử C₃H₆O₂ (HCOOC₂H₅ hoặc CH₃COOCH₃).',
    },
    checkQuestions: [
      {
        prompt:
          'Xà phòng hoá hoàn toàn 8,80 gam một ester đơn chức, mạch hở cần vừa đủ 100 mL dung ' +
          'dịch NaOH 1,00 M. Tính phân tử khối của ester (đơn vị g/mol, chỉ nhập số).',
        answer: { kind: 'numeric', value: 88, tolerance: { mode: 'absolute', eps: 0.5 } },
        explain:
          'n(NaOH) = 0,100 mol; ester đơn chức nên n(ester) = n(NaOH) = 0,100 mol. ' +
          'M = 8,80/0,100 = 88 g/mol, ứng với C₄H₈O₂ (14n + 32 = 88 ⇒ n = 4). Chỉ được đặt ' +
          'n(ester) = n(NaOH) khi ester ĐƠN chức và không phải ester của phenol — hai trường hợp ' +
          'đó tỉ lệ là 1 : 3 và 1 : 2.',
      },
      {
        prompt:
          'Tính chỉ số xà phòng hoá của triolein (C₅₇H₁₀₄O₆, M = 884 g/mol), biết KOH có ' +
          'M = 56 g/mol (chỉ nhập số, làm tròn tới hàng đơn vị).',
        answer: { kind: 'numeric', value: 190, tolerance: { mode: 'absolute', eps: 2 } },
        explain:
          'Xét đúng 1 gam triolein: n = 1/884 mol. Chất béo là triester nên cần 3 mol KOH cho mỗi ' +
          'mol chất béo ⇒ n(KOH) = 3/884 mol, khối lượng = 3 × 56/884 = 0,190 gam = 190 mg. Vậy ' +
          'chỉ số xà phòng hoá ≈ 190. Ba lỗi hay gặp: quên hệ số 3, dùng NaOH (M = 40) thay KOH, ' +
          'và quên đổi gam sang miligam.',
      },
      {
        // Câu BẪY trọng tâm: nhầm thuỷ phân base với thuỷ phân acid.
        prompt:
          'So sánh thuỷ phân ester trong dung dịch NaOH đun nóng với thuỷ phân trong H₂SO₄ loãng ' +
          'đun nóng. Phát biểu nào ĐÚNG?',
        choices: [
          { id: 'ca_hai_tn', label: 'Cả hai đều thuận nghịch, hiệu suất luôn dưới 100%' },
          {
            id: 'base_mot_chieu',
            label:
              'Thuỷ phân trong NaOH là một chiều vì base trung hoà acid sinh ra; trong acid thì thuận nghịch',
          },
          {
            id: 'acid_mot_chieu',
            label: 'Thuỷ phân trong H₂SO₄ là một chiều, còn trong NaOH thì thuận nghịch',
          },
          { id: 'cung_san_pham', label: 'Hai phản ứng cho cùng bộ sản phẩm vì cùng là thuỷ phân' },
        ],
        answer: { kind: 'choice', correctIds: ['base_mot_chieu'] },
        explain:
          'Bẫy là coi mọi phản ứng thuỷ phân như nhau. Trong NaOH, acid vừa sinh ra bị trung hoà ' +
          'ngay thành muối RCOONa — sản phẩm bị rút khỏi cân bằng nên phản ứng nghịch không xảy ' +
          'ra được, phản ứng chạy một chiều tới cùng. Trong H₂SO₄ loãng thì sản phẩm là RCOOH và ' +
          'R′OH vẫn có thể ester hoá trở lại, nên thuận nghịch. Đáp án cuối cũng sai: sản phẩm ' +
          'khác nhau (muối RCOONa so với acid RCOOH).',
      },
    ],
    srsCards: [
      {
        hoi: 'Vì sao xà phòng hoá là phản ứng một chiều còn thuỷ phân trong acid thì thuận nghịch?',
        dap: 'Base trung hoà acid sinh ra thành muối, rút sản phẩm khỏi cân bằng nên không có phản ứng nghịch.',
      },
      {
        hoi: 'Tỉ lệ mol ester : NaOH trong ba trường hợp hay gặp?',
        dap: 'Ester đơn chức 1:1; chất béo (triester) 1:3 và sinh 1 mol glycerol; ester của phenol 1:2.',
      },
      {
        hoi: 'Định nghĩa chỉ số xà phòng hoá?',
        dap: 'Số MILIGAM KOH cần xà phòng hoá hoàn toàn 1 GAM chất béo — nhớ đúng mg, KOH (M=56) và "trên 1 gam".',
      },
    ],
    track: 'advanced',
    advancedTier: 'hsg-truong',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa12-c94-b1',
    grade: '12',
    chapterNumber: 94,
    chapterTitle: 'Chuyên đề HSG — Hữu cơ lớp 12',
    lessonNumber: 1,
    title: 'HSG cấp tỉnh: Amine, amino acid, peptide và điểm đẳng điện',
    hook:
      'Cùng một phân tử glycine, thả vào dung dịch acid thì nó chạy về cực âm khi điện di, thả ' +
      'vào dung dịch base thì chạy về cực dương, còn ở một giá trị pH rất riêng thì nó đứng yên. ' +
      'Điểm pH ấy là thứ các phòng thí nghiệm dùng để tách từng loại protein ra khỏi nhau.',
    theory:
      'AMINO ACID LÀ CHẤT LƯỠNG TÍNH, và cách viết quen thuộc H₂N–CH(R)–COOH thật ra không mô tả ' +
      'đúng dạng tồn tại chính. Trong tinh thể và trong dung dịch nước, nhóm –COOH đã nhường ' +
      'proton cho nhóm –NH₂ ngay trong cùng phân tử, tạo ION LƯỠNG CỰC:\n\n' +
      '    H₃N⁺–CH(R)–COO⁻\n\n' +
      'Chính vì tồn tại dạng ion mà amino acid là chất rắn kết tinh, nhiệt độ nóng chảy cao và ' +
      'tan tốt trong nước — khác hẳn amine hay acid carboxylic có phân tử khối tương đương. Câu ' +
      'hỏi "vì sao glycine là chất rắn còn propanoic acid là chất lỏng" hỏi đúng chỗ này.\n\n' +
      'ĐIỂM ĐẲNG ĐIỆN pI là giá trị pH mà tại đó amino acid tồn tại chủ yếu ở dạng ion lưỡng cực ' +
      'trung hoà điện, không di chuyển trong điện trường. Với amino acid trung tính (một nhóm ' +
      '–NH₂, một nhóm –COOH):\n\n' +
      '    pI = (pKa₁ + pKa₂)/2\n\n' +
      'pKa₁ là của nhóm –COOH (khoảng 2,0–2,4), pKa₂ là của nhóm –NH₃⁺ (khoảng 9,0–9,8). Quy tắc ' +
      'đọc kết quả, quan trọng hơn công thức:\n\n' +
      '    pH < pI → amino acid tích điện DƯƠNG → điện di về CATOT (cực âm)\n' +
      '    pH = pI → trung hoà điện → đứng yên, và đây cũng là pH mà nó ÍT TAN NHẤT, dễ kết tủa\n' +
      '    pH > pI → tích điện ÂM → điện di về ANOT (cực dương)\n\n' +
      'Mẹo chống nhầm dấu: môi trường acid thì dư H⁺, phân tử "nhặt" thêm proton nên mang điện ' +
      'dương, mà điện dương thì bị hút về cực âm.\n\n' +
      'Với amino acid có nhóm chức acid thứ hai (glutamic acid) thì pI lệch về phía acid; có ' +
      'nhóm base thứ hai (lysine) thì pI lệch về phía base — lúc đó lấy trung bình hai pKa của ' +
      'hai nhóm CÙNG LOẠI kề nhau chứ không phải hai pKa bất kỳ.\n\n' +
      'PEPTIDE VÀ CÁCH ĐẾM. Liên kết peptide –CO–NH– nối các α-amino acid; n gốc amino acid tạo ' +
      'thành n-peptide và có (n − 1) liên kết peptide. Hai bài toán đếm phải phân biệt rạch ròi:\n\n' +
      '• Số n-peptide tạo được từ k loại amino acid, mỗi loại dùng bao nhiêu lần cũng được: kⁿ ' +
      '(mỗi vị trí trong mạch chọn độc lập).\n' +
      '• Số n-peptide chứa ĐỦ cả n loại khác nhau, mỗi loại đúng một lần: n! (hoán vị).\n\n' +
      'Thuỷ phân hoàn toàn peptide trong môi trường acid cho các amino acid; trong môi trường ' +
      'base cho muối của chúng. Thuỷ phân KHÔNG hoàn toàn cho hỗn hợp các peptide ngắn hơn — đề ' +
      'tỉnh hay cho các mảnh này rồi bắt ghép lại trật tự mạch ban đầu, làm như ghép chuỗi chữ ' +
      'chồng lấn. Phản ứng màu biuret (tạo phức tím với Cu(OH)₂ trong môi trường kiềm) chỉ dương ' +
      'tính từ TRIPEPTIDE trở lên, đipeptide không có — một dữ kiện nhận biết hay dùng.',
    workedExample: {
      problem:
        'Glycine có pKa₁ = 2,34 (nhóm –COOH) và pKa₂ = 9,60 (nhóm –NH₃⁺). (a) Tính pI của ' +
        'glycine. (b) Ở pH = 7,0, glycine di chuyển về điện cực nào khi điện di?',
      steps: [
        'Glycine là amino acid trung tính (một –NH₂, một –COOH) nên dùng được công thức ' +
          'pI = (pKa₁ + pKa₂)/2.',
        '(a) pI = (2,34 + 9,60)/2 = 11,94/2 = 5,97.',
        '(b) So sánh: pH = 7,0 > pI = 5,97.',
        'pH lớn hơn pI nghĩa là môi trường đủ base để lấy bớt proton, phân tử tích điện ÂM ' +
          '(dạng H₂N–CH₂–COO⁻ chiếm ưu thế).',
        'Hạt mang điện âm bị hút về cực dương ⇒ glycine di chuyển về ANOT.',
        'Ghi chú thực hành: muốn kết tủa glycine ra khỏi dung dịch thì chỉnh pH về đúng 5,97 — ' +
          'tại pI độ tan là nhỏ nhất.',
      ],
      answer: 'pI = 5,97; ở pH = 7,0 glycine tích điện âm nên di chuyển về anot (cực dương).',
    },
    checkQuestions: [
      {
        prompt:
          'Alanine có pKa₁ = 2,34 và pKa₂ = 9,69. Tính điểm đẳng điện pI của alanine (chỉ nhập ' +
          'số, làm tròn 2 chữ số thập phân).',
        answer: { kind: 'numeric', value: 6.02, tolerance: { mode: 'absolute', eps: 0.05 } },
        explain:
          'Alanine là amino acid trung tính nên pI = (pKa₁ + pKa₂)/2 = (2,34 + 9,69)/2 = 12,03/2 ' +
          '= 6,015 ≈ 6,02. Công thức trung bình cộng này CHỈ đúng cho amino acid trung tính; với ' +
          'glutamic acid hay lysine phải lấy trung bình hai pKa của hai nhóm cùng loại kề nhau.',
      },
      {
        prompt:
          'Có 3 loại α-amino acid khác nhau. Số tripeptide tối đa tạo được từ chúng, biết mỗi ' +
          'loại có thể dùng nhiều lần trong một mạch (chỉ nhập số).',
        answer: { kind: 'numeric', value: 27, tolerance: { mode: 'absolute', eps: 0.5 } },
        explain:
          'Mạch tripeptide có 3 vị trí, mỗi vị trí chọn độc lập 1 trong 3 loại nên số mạch là ' +
          '3³ = 27. Đừng lẫn với câu hỏi khác: nếu đề bắt mỗi loại dùng ĐÚNG MỘT lần (tripeptide ' +
          'chứa đủ cả 3 loại) thì đáp số là 3! = 6. Đọc kỹ "dùng nhiều lần" hay "đủ cả ba" là ' +
          'phân biệt được hai dạng.',
      },
      {
        // Câu BẪY trọng tâm: chiều di chuyển khi điện di.
        prompt:
          'Một amino acid trung tính có pI = 6,0 được điện di trong dung dịch đệm pH = 3,0. Phân ' +
          'tử tích điện gì và di chuyển về đâu?',
        choices: [
          { id: 'duong_catot', label: 'Tích điện dương, di chuyển về catot (cực âm)' },
          { id: 'am_anot', label: 'Tích điện âm, di chuyển về anot (cực dương)' },
          { id: 'trung_hoa', label: 'Trung hoà điện, đứng yên' },
          { id: 'duong_anot', label: 'Tích điện dương, di chuyển về anot (cực dương)' },
        ],
        answer: { kind: 'choice', correctIds: ['duong_catot'] },
        explain:
          'pH = 3,0 < pI = 6,0 nên môi trường dư H⁺: nhóm –COO⁻ nhận thêm proton thành –COOH, ' +
          'phân tử còn lại điện tích dương ở nhóm –NH₃⁺. Hạt dương bị hút về cực ÂM, tức catot. ' +
          'Hai bẫy trong câu này: nhầm dấu điện tích (nhớ "acid thì nhặt proton nên dương"), và ' +
          'nhầm hướng (hạt dương về cực âm, không phải về cực cùng tên).',
      },
    ],
    srsCards: [
      {
        hoi: 'Dạng tồn tại chính của amino acid trong nước và hệ quả?',
        dap: 'Ion lưỡng cực H₃N⁺–CH(R)–COO⁻ — vì vậy amino acid là chất rắn kết tinh, nóng chảy cao, tan tốt.',
      },
      {
        hoi: 'Công thức pI và quy tắc chiều điện di?',
        dap: 'pI = (pKa₁+pKa₂)/2 cho amino acid trung tính; pH < pI → dương → về catot; pH > pI → âm → về anot.',
      },
      {
        hoi: 'Số n-peptide từ k loại amino acid: dùng lặp lại được và dùng đủ mỗi loại một lần?',
        dap: 'Dùng lặp lại: kⁿ. Chứa đủ n loại khác nhau, mỗi loại một lần: n!.',
      },
    ],
    track: 'advanced',
    advancedTier: 'hsg-tinh',
    reviewStatus: 'draft',
  },
  {
    id: 'hoa12-c95-b1',
    grade: '12',
    chapterNumber: 95,
    chapterTitle: 'Chuyên đề HSG — Hữu cơ lớp 12',
    lessonNumber: 1,
    title: 'HSG cấp quốc gia: Bài toán hỗn hợp, quy đổi và biện luận polymer',
    hook:
      'Đề cho một hỗn hợp không nói rõ gồm những chất nào, số ẩn nhiều hơn số phương trình, và ' +
      'vẫn có đúng một đáp số. Thí sinh giỏi không giải nhanh hơn — họ chọn cách nhìn khiến phần ' +
      'lớn số ẩn biến mất trước khi đặt bút.',
    theory:
      'BA ĐỊNH LUẬT BẢO TOÀN là bộ khung của mọi bài toán hỗn hợp. Chúng mạnh vì đúng bất kể hỗn ' +
      'hợp gồm chất gì, tức là dùng được cả khi chưa biết thành phần:\n\n' +
      '• Bảo toàn KHỐI LƯỢNG: tổng khối lượng chất tham gia = tổng khối lượng sản phẩm. Dạng ' +
      'dùng nhiều nhất: m(chất béo) + m(NaOH) = m(xà phòng) + m(glycerol).\n' +
      '• Bảo toàn NGUYÊN TỐ: số mol mỗi nguyên tố không đổi. Đốt cháy hợp chất hữu cơ thì ' +
      'n(C) = n(CO₂), n(H) = 2·n(H₂O), và n(O) trong chất hữu cơ = 2·n(CO₂) + n(H₂O) − 2·n(O₂).\n' +
      '• Bảo toàn ELECTRON: tổng electron cho = tổng electron nhận, dùng khi có phản ứng oxi ' +
      'hoá – khử mà không muốn viết phương trình.\n\n' +
      'KỸ THUẬT QUY ĐỔI. Khi hỗn hợp có nhiều chất cùng dãy đồng đẳng hoặc khác nhau chỉ ở số ' +
      'nối đôi, ta thay hỗn hợp thật bằng một hỗn hợp GIẢ ĐỊNH đơn giản hơn nhưng có cùng số mol ' +
      'từng nguyên tố. Ví dụ hỗn hợp các chất béo có thể quy về (gốc no) + (số nhóm CH₂) + (số ' +
      'nối đôi π). Kết quả trung gian có thể ra số mol ÂM — điều đó không sai, vì chất quy đổi ' +
      'chỉ là công cụ tính chứ không phải chất có thật; chỉ đáp số cuối mới cần có nghĩa vật lý. ' +
      'Nhiều thí sinh bỏ cách làm đúng giữa chừng chỉ vì thấy số âm.\n\n' +
      'ĐỘ BẤT BÃO HOÀ k = (2C + 2 + N − H)/2 đếm tổng số vòng và liên kết π. Với ester no đơn ' +
      'chức mạch hở k = 1 (chỉ nhóm C=O); k = 2 có thể là ester không no một nối đôi hoặc ester ' +
      'hai chức — chính chỗ này đề bắt biện luận thay vì kết luận vội.\n\n' +
      'POLYMER VÀ HỆ SỐ TRÙNG HỢP. Polymer là chuỗi lặp của mắt xích monomer, nên:\n\n' +
      '    M(polymer) = n × M(mắt xích)\n\n' +
      'với n là hệ số trùng hợp (độ polymer hoá). Hai loại phản ứng cần phân biệt: TRÙNG HỢP ' +
      'không tách sản phẩm phụ nên mắt xích có cùng công thức với monomer; TRÙNG NGƯNG tách ra ' +
      'phân tử nhỏ (thường là H₂O) nên khối lượng mắt xích NHỎ HƠN monomer đúng bằng phần đã ' +
      'tách. Dùng nhầm công thức giữa hai loại là lỗi hệ thống ở dạng bài này.\n\n' +
      'THỨ TỰ LÀM BÀI nên theo: (1) viết dữ kiện thành số mol; (2) tìm xem bảo toàn nào cho ' +
      'phương trình mà không cần biết thành phần; (3) chỉ khi buộc phải đặt ẩn mới đặt, và đặt ' +
      'theo nhóm chứ không theo từng chất. Làm ngược thứ tự này là lý do một bài 15 phút bị kéo ' +
      'thành 40 phút.',
    workedExample: {
      problem:
        'Xà phòng hoá hoàn toàn 17,80 gam một chất béo trung tính cần vừa đủ 0,0600 mol NaOH, ' +
        'thu được m gam hỗn hợp muối và glycerol. Tính m (NaOH = 40; glycerol C₃H₈O₃ = 92).',
      steps: [
        'Chất béo là triester của glycerol nên tỉ lệ chất béo : NaOH = 1 : 3, và mỗi mol chất ' +
          'béo sinh 1 mol glycerol.',
        'Số mol glycerol = n(NaOH)/3 = 0,0600/3 = 0,0200 mol.',
        'Khối lượng glycerol = 0,0200 × 92 = 1,84 gam.',
        'Áp bảo toàn khối lượng: m(chất béo) + m(NaOH) = m(muối) + m(glycerol).',
        'Thay số: 17,80 + 0,0600 × 40 = m + 1,84 ⇒ 17,80 + 2,40 = m + 1,84.',
        'Suy ra m = 20,20 − 1,84 = 18,36 gam.',
        'Điểm đáng chú ý: không cần biết chất béo gồm những gốc acid nào — bảo toàn khối lượng ' +
          'cho đáp số mà không cần thành phần, đó chính là sức mạnh của phương pháp.',
      ],
      answer: 'm = 18,36 gam muối (xà phòng).',
    },
    checkQuestions: [
      {
        prompt:
          'Xà phòng hoá hoàn toàn 8,90 gam một chất béo trung tính cần vừa đủ 0,0300 mol NaOH, ' +
          'thu được m gam muối và glycerol. Tính m (NaOH = 40; glycerol = 92; đơn vị gam, chỉ ' +
          'nhập số).',
        answer: { kind: 'numeric', value: 9.18, tolerance: { mode: 'absolute', eps: 0.05 } },
        explain:
          'n(glycerol) = n(NaOH)/3 = 0,0300/3 = 0,0100 mol ⇒ m(glycerol) = 0,920 gam. Bảo toàn ' +
          'khối lượng: 8,90 + 0,0300 × 40 = m + 0,920 ⇒ 8,90 + 1,20 = m + 0,920 ⇒ m = 9,18 gam. ' +
          'Lỗi phổ biến là quên chia 3 khi tính glycerol, hoặc cộng nhầm khối lượng glycerol vào ' +
          'vế muối thay vì trừ ra.',
      },
      {
        prompt:
          'Poly(vinyl chloride) có phân tử khối trung bình 62 500 g/mol. Tính hệ số trùng hợp ' +
          'trung bình n, biết mắt xích là –CH₂–CHCl– (M = 62,5) (chỉ nhập số).',
        answer: { kind: 'numeric', value: 1000, tolerance: { mode: 'absolute', eps: 5 } },
        explain:
          'PVC tạo bởi phản ứng TRÙNG HỢP nên mắt xích có cùng công thức với monomer vinyl ' +
          'chloride CH₂=CHCl, M = 62,5. Do đó n = M(polymer)/M(mắt xích) = 62 500/62,5 = 1 000. ' +
          'Với polymer trùng NGƯNG (nylon-6,6, tơ lapsan) thì không làm vậy được: mỗi mắt xích đã ' +
          'tách bớt H₂O nên nhẹ hơn tổng monomer.',
      },
      {
        // Câu BẪY trọng tâm: quy đổi ra số mol âm thì có sai không.
        prompt:
          'Khi dùng kỹ thuật quy đổi cho một hỗn hợp chất béo, một bạn tính ra số mol của "chất ' +
          'quy đổi" là −0,02 mol. Nhận định nào ĐÚNG?',
        choices: [
          {
            id: 'sai_phai_lam_lai',
            label: 'Chắc chắn sai vì số mol không thể âm — phải làm lại từ đầu',
          },
          {
            id: 'chap_nhan',
            label:
              'Chấp nhận được: chất quy đổi chỉ là công cụ tính, không có thật; chỉ đáp số cuối mới cần có nghĩa',
          },
          { id: 'lay_tri_tuyet_doi', label: 'Lấy giá trị tuyệt đối 0,02 mol rồi tính tiếp' },
          { id: 'de_sai', label: 'Đề bài chắc chắn thiếu dữ kiện' },
        ],
        answer: { kind: 'choice', correctIds: ['chap_nhan'] },
        explain:
          'Đây là chỗ nhiều thí sinh bỏ dở một lời giải đúng. Hỗn hợp quy đổi là hỗn hợp GIẢ ' +
          'ĐỊNH, chỉ cần bảo toàn đúng số mol từng nguyên tố so với hỗn hợp thật; hệ số âm nghĩa ' +
          'là thành phần đó phải bớt đi để khớp, hoàn toàn hợp lệ về mặt đại số. Lấy trị tuyệt ' +
          'đối là sai hẳn vì làm hỏng cân bằng nguyên tố. Kiểm tra thật sự nằm ở ĐÁP SỐ CUỐI: ' +
          'khối lượng, số mol chất có thật phải dương và hợp lý.',
      },
    ],
    srsCards: [
      {
        hoi: 'Bảo toàn khối lượng trong xà phòng hoá chất béo viết thế nào?',
        dap: 'm(chất béo) + m(NaOH) = m(muối) + m(glycerol), với n(glycerol) = n(NaOH)/3.',
      },
      {
        hoi: 'Quy đổi hỗn hợp ra số mol âm thì xử lý sao?',
        dap: 'Chấp nhận — chất quy đổi là công cụ tính, không có thật. Chỉ đáp số cuối mới cần có nghĩa vật lý.',
      },
      {
        hoi: 'Tính hệ số trùng hợp n của polymer, và khác biệt giữa trùng hợp với trùng ngưng?',
        dap: 'n = M(polymer)/M(mắt xích). Trùng hợp: mắt xích ≡ monomer. Trùng ngưng: mắt xích nhẹ hơn vì đã tách H₂O.',
      },
    ],
    track: 'advanced',
    advancedTier: 'hsg-quoc-gia',
    reviewStatus: 'draft',
  },
]
