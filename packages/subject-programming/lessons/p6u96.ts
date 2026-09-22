// lessons/p6u96.ts — Chặng "principal-s2: Hệ tác tử & MCP", unit p6-u96 "Vòng lặp agent tối
// giản" (docs/specs/2026-08-31-dot-4-p5-tam-truong.md mục principal-s2).
//
// Cả 2 bài đều language: 'javascript' vì mô phỏng agent gọi tool hợp tự nhiên với object JS
// (bảng tên -> hàm). Chạy qua wrapJavaScript()/node:vm như mọi bài JS khác (jsPrelude.ts).
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6_U96_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u96-l1',
    unitId: 'p6-u96',
    language: 'javascript',
    title: 'Vòng lặp agent tối giản — bảng tool và dispatch theo tên',
    hook: 'ChatGPT trả lời được "hôm nay Hà Nội bao nhiêu độ" không phải vì nó biết thời tiết — nó GỌI MỘT TOOL (công cụ: một hàm lấy dữ liệu thời tiết) rồi đọc kết quả. Bản đầu tiên của mọi agent chỉ gồm hai thứ: một BẢNG TOOL ánh xạ tên sang hàm, và một hàm dispatch (điều phối) tra bảng theo đúng tên được gọi.',
    theory:
      'AGENT (tác tử) ở mức đơn giản nhất không có gì huyền bí: nó là một CHƯƠNG TRÌNH có thể gọi TOOL (công cụ — thực chất là một hàm) theo TÊN, thay vì chỉ chạy một đường logic cứng.\n\nHai mảnh ghép cần có:\n1. BẢNG TOOL — một object JavaScript ánh xạ TÊN (chuỗi) sang HÀM: { congTien: (x) => x + 10, ... }. Mỗi tool là một hàm bình thường, chỉ khác ở chỗ nó được gọi GIÁN TIẾP qua tên.\n2. DISPATCH (điều phối) — hàm nhận vào tên tool cùng tham số, TRA BẢNG để tìm hàm tương ứng rồi gọi hàm đó. tools[ten] trả về hàm nếu có, hoặc undefined nếu tên không tồn tại trong bảng.\n\nĐiểm mấu chốt để agent AN TOÀN: đừng bao giờ giả định tool luôn tồn tại. Tên tool có thể sai chính tả, bị AI "bịa" ra, hoặc chưa được đăng ký. Vì vậy dispatch phải KIỂM tools[ten] === undefined trước, rồi trả về LỖI RÕ RÀNG thay vì để chương trình sập (gọi undefined như gọi hàm sẽ ném TypeError khó hiểu).\n\nĐây chính là bước đầu của vòng lặp agent đầy đủ (nghĩ -> gọi tool -> đọc kết quả -> lặp, học ở bài sau): mỗi lần "nghĩ xong một bước", agent cần MỘT LẦN dispatch như thế này.',
    workedExample: {
      code: `// Bang tool: ten -> ham xu ly
const tools = {
  cong10: (x) => x + 10,
  nhan2: (x) => x * 2,
};

// Dispatch: tra bang theo ten, tra loi ro neu khong co
function goiTool(ten, thamSo) {
  const ham = tools[ten];
  if (ham === undefined) {          // ten khong co trong bang
    return "Loi: khong co tool " + ten;
  }
  return "Ket qua: " + ham(thamSo); // co trong bang -> goi ham
}

console.log(goiTool("cong10", 5));  // 5 + 10 = 15
console.log(goiTool("xyz", 5));     // "xyz" khong co trong bang`,
      stdinLines: [],
    },
    predict: {
      code: `const tools = { nhan2: (x) => x * 2 };
const ham = tools["nhan2"];
console.log(ham(7));`,
      question: 'Đoạn code tra bảng tools theo tên "nhan2" rồi gọi hàm đó với 7. In ra gì?',
      choices: ['14', '7', 'undefined', 'NaN'],
      answerIndex: 0,
      explain:
        'tools["nhan2"] trả về hàm (x) => x * 2; gọi hàm đó với 7 được 14, nên đáp án là 14. Phương án 7 là nhầm với chính tham số đầu vào; undefined chỉ xảy ra nếu tên tool không có trong bảng; NaN chỉ xảy ra khi phép nhân gặp giá trị không phải số. Đây chính là cơ chế dispatch: không gọi thẳng nhan2(7) trong code, mà tra bảng qua chuỗi tên rồi mới gọi.',
    },
    parsons: {
      prompt:
        'Xếp đúng hàm dispatch: định nghĩa bảng tool -> tra bảng theo tên -> kiểm trường hợp không có -> gọi hàm.',
      lines: [
        'const tools = { cong10: (x) => x + 10, nhan2: (x) => x * 2 };',
        'function goiTool(ten, thamSo) {',
        '    const ham = tools[ten];',
        '    if (ham === undefined) {',
        '        return "Loi: khong co tool " + ten;',
        '    }',
        '    return "Ket qua: " + ham(thamSo);',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết hàm dispatch gọi tool theo tên, có sẵn bảng tool "cong10" (cộng 10 vào tham số) và "nhan2" (nhân đôi tham số).\n\nChương trình đọc 2 dòng input():\n- Dòng 1: tên tool (chuỗi).\n- Dòng 2: tham số (một số).\n\nNếu tên tool KHÔNG có trong bảng, in đúng 1 dòng:\nLoi: khong co tool <ten>\n\nNếu có, in đúng 1 dòng:\nKet qua: <ket qua sau khi ap dung tool>',
      starterCode: `const tools = {
  cong10: (x) => x + 10,
  nhan2: (x) => x * 2,
};
const ten = input("");
const thamSo = Number(input(""));
// Tra bang tools theo ten:
// - khong co -> in "Loi: khong co tool <ten>"
// - co -> in "Ket qua: <ket qua>"
`,
      testCases: [
        {
          stdinLines: ['cong10', '5'],
          expected: 'Ket qua: 15',
          match: 'contains',
          hidden: false,
          label: 'cong10 với tham số 5 -> 15',
        },
        {
          stdinLines: ['nhan2', '8'],
          expected: 'Ket qua: 16',
          match: 'contains',
          hidden: false,
          label: 'nhan2 với tham số 8 -> 16',
        },
        {
          stdinLines: ['xyz', '3'],
          expected: 'Loi: khong co tool xyz',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: tên tool không có trong bảng -> báo lỗi rõ ràng',
        },
      ],
      hints: [
        'Bảng tool đã có sẵn ở starterCode — hãy dùng tools[ten] để tra, đừng tự viết if/else so sánh từng tên.',
        'tools[ten] trả về undefined khi tên không tồn tại trong object — kiểm === undefined trước khi gọi hàm.',
        'In bằng console.log("Loi: khong co tool " + ten) hoặc console.log("Ket qua: " + tools[ten](thamSo)) — nhớ Number(input("")) để tham số là số, không phải chuỗi.',
      ],
      sampleSolution: `const tools = {
  cong10: (x) => x + 10,
  nhan2: (x) => x * 2,
};
const ten = input("");
const thamSo = Number(input(""));
const ham = tools[ten];
if (ham === undefined) {
  console.log("Loi: khong co tool " + ten);
} else {
  console.log("Ket qua: " + ham(thamSo));
}`,
    },
    homework:
      'Nghĩ ra 3 tool thật sự hữu ích cho một "trợ lý học tập" (ví dụ: tra từ điển, tính điểm trung bình, đổi đơn vị). Với mỗi tool, viết tên, một câu mô tả nó làm gì, và nó cần mấy tham số. Đây chính là những gì bạn sẽ cần khi làm việc với MCP (Model Context Protocol — chuẩn khai báo tool cho AI, học ở bài sau): mọi tool thật đều bắt đầu từ một mô tả rõ ràng như thế này.',
    srsCards: [
      {
        hoi: 'Bảng tool của agent là gì?',
        dap: 'Một object JavaScript ánh xạ TÊN (chuỗi) sang HÀM xử lý (ví dụ { cong10: (x) => x + 10 }). Agent gọi tool GIÁN TIẾP qua tên, không gọi thẳng tên hàm trong code.',
      },
      {
        hoi: 'Vì sao dispatch phải kiểm tools[ten] === undefined trước khi gọi?',
        dap: 'Tên tool có thể sai hoặc chưa được đăng ký. Gọi một giá trị undefined như gọi hàm sẽ ném lỗi khó hiểu; kiểm trước cho phép trả về thông báo lỗi RÕ RÀNG ("khong co tool <ten>") thay vì làm sập chương trình.',
      },
      {
        hoi: 'Dispatch theo tên khác gọi hàm trực tiếp ở điểm nào?',
        dap: 'Gọi trực tiếp: tên hàm cố định trong code lúc viết (nhan2(7)). Dispatch: tên là MỘT CHUỖI DỮ LIỆU (có thể đến từ input hoặc từ AI), tra bảng lúc CHẠY rồi mới gọi — nhờ vậy thêm hay bớt tool mà không phải sửa logic gọi.',
      },
    ],
  },
  {
    id: 'p6-u96-l2',
    unitId: 'p6-u96',
    language: 'javascript',
    title: 'Vòng lặp agent nhiều bước — điều kiện dừng',
    hook: 'Một agent thật không dừng sau MỘT lần gọi tool — nó lặp: gọi tool, đọc kết quả, quyết định bước tiếp theo, cho tới khi xong VIỆC hoặc chạm giới hạn an toàn. Thiếu điều kiện dừng rõ ràng, agent có thể lặp vô hạn và đốt tiền API thật.',
    theory:
      'VÒNG LẶP AGENT đầy đủ: nghĩ -> gọi tool -> đọc kết quả -> lặp. Bài trước đã cài xong phần "gọi tool"; bài này cài phần VÒNG LẶP và ĐIỀU KIỆN DỪNG.\n\nMột vòng lặp agent AN TOÀN cần HAI điều kiện dừng, không được thiếu cái nào:\n1. Dừng "tự nhiên" — gặp một tool đặc biệt báo "xong", hoặc kết quả cho thấy việc đã hoàn thành. Đây là đường dừng bình thường.\n2. Dừng "an toàn" — chạy hết số bước tối đa cho phép, dù chưa gặp "xong". Đây là LƯỚI CHẶN chống lặp vô hạn khi logic sai hoặc khi AI cứ "nghĩ" mãi mà không quyết định là xong.\n\nMỗi bước trong vòng lặp nên được GHI LOG (số thứ tự bước, tool nào, kết quả gì). Log là thứ duy nhất giúp người sửa lỗi hiểu agent đã làm gì khi nó chạy sai. Vòng lặp không ghi log gì cả là một hộp đen không ai sửa được.\n\nKhi một bước GẶP LỖI (ví dụ tool không tồn tại) giữa lúc đang chạy nhiều bước, cách an toàn là DỪNG NGAY chứ không chạy tiếp các bước còn lại — vì bước sau thường phụ thuộc vào kết quả bước trước, chạy tiếp trên dữ liệu sai chỉ làm mọi thứ tệ hơn.',
    workedExample: {
      code: `// Vong lap agent nhieu buoc, dung khi gap "xong" hoac het danh sach
const tools = {
  cong10: (x) => x + 10,
  nhan2: (x) => x * 2,
};

function chayAgent(danhSachTool) {
  let giaTri = 0; // bat dau tu 0
  for (let i = 0; i < danhSachTool.length; i++) {
    const ten = danhSachTool[i];
    const buoc = i + 1;
    if (ten === "xong") {           // dieu kien dung tu nhien
      console.log("Buoc " + buoc + ": xong -> dung");
      return;
    }
    const ham = tools[ten];
    if (ham === undefined) {        // gap loi -> dung ngay, khong chay tiep
      console.log("Buoc " + buoc + ": loi " + ten);
      return;
    }
    giaTri = ham(giaTri);
    console.log("Buoc " + buoc + ": " + ten + " -> " + giaTri);
  }
}

chayAgent(["cong10", "nhan2", "xong", "cong10"]);`,
      stdinLines: [],
    },
    predict: {
      code: `let giaTri = 0;
giaTri = giaTri + 10;
giaTri = giaTri * 2;
console.log(giaTri);`,
      question: 'Bắt đầu từ 0, cộng 10 rồi nhân 2 — in ra gì?',
      choices: ['20', '10', '40', '30'],
      answerIndex: 0,
      explain:
        '(0 + 10) * 2 = 20 nên đáp án là 20. Phương án 10 là dừng lại ở bước cộng mà quên nhân; 40 là nhầm thứ tự thành (0 + 10) * 2 * 2; 30 là nhầm phép nhân thành nhân 3. Đây đúng là cách vòng lặp agent áp dụng tuần tự từng tool lên giaTri.',
    },
    parsons: {
      prompt:
        'Xếp đúng vòng lặp nhiều bước: duyệt từng tên -> gặp "xong" thì dừng -> nếu không thì áp dụng tool và ghi log.',
      lines: [
        'for (let i = 0; i < danhSachTool.length; i++) {',
        '    const ten = danhSachTool[i];',
        '    const buoc = i + 1;',
        '    if (ten === "xong") {',
        '        console.log("Buoc " + buoc + ": xong -> dung");',
        '        return;',
        '    }',
        '    giaTri = tools[ten](giaTri);',
        '    console.log("Buoc " + buoc + ": " + ten + " -> " + giaTri);',
        '}',
      ],
    },
    make: {
      prompt:
        'Mô phỏng agent chạy nhiều bước với bảng tool "cong10"/"nhan2" như bài trước.\n\nChương trình đọc 1 dòng input(): danh sách tên tool cách nhau bởi dấu phẩy, ví dụ "cong10,nhan2,xong,cong10".\n\nChạy lần lượt từ giá trị 0. Với MỖI bước, in đúng 1 dòng:\nBuoc <so thu tu tu 1>: <ten tool> -> <gia tri sau khi ap dung>\n\nKhi gặp tool "xong": in đúng 1 dòng "Buoc <so>: xong -> dung" RỒI DỪNG NGAY (không chạy tiếp các tool còn lại trong danh sách).\n\nKhi gặp tên tool LẠ (không có trong bảng): in đúng 1 dòng "Buoc <so>: loi <ten>" RỒI DỪNG NGAY.\n\nNếu hết danh sách mà chưa gặp "xong" hay lỗi thì vòng lặp tự kết thúc bình thường.',
      starterCode: `const tools = {
  cong10: (x) => x + 10,
  nhan2: (x) => x * 2,
};
const danhSach = input("").split(",");
let giaTri = 0;
// Duyet tung ten trong danhSach:
// - "xong" -> in "Buoc N: xong -> dung" roi dung han
// - ten la -> in "Buoc N: loi <ten>" roi dung han
// - ten hop le -> cap nhat giaTri, in "Buoc N: <ten> -> <giaTri>"
`,
      testCases: [
        {
          stdinLines: ['cong10,nhan2,xong,cong10'],
          expected: 'Buoc 1: cong10 -> 10\nBuoc 2: nhan2 -> 20\nBuoc 3: xong -> dung',
          match: 'contains',
          hidden: false,
          label: 'Dừng đúng lúc gặp "xong", không chạy thêm tool thứ 4',
        },
        {
          stdinLines: ['nhan2,cong10'],
          expected: 'Buoc 1: nhan2 -> 0\nBuoc 2: cong10 -> 10',
          match: 'contains',
          hidden: false,
          label: 'Hết danh sách mà không gặp "xong" thì tự kết thúc',
        },
        {
          stdinLines: ['cong10,xyz,nhan2'],
          expected: 'Buoc 1: cong10 -> 10\nBuoc 2: loi xyz',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: gặp tool lạ thì báo lỗi và dừng ngay, không chạy bước 3',
        },
      ],
      hints: [
        'Dùng vòng for với biến đếm i từ 0, số bước hiển thị là i + 1 (đánh số từ 1, không phải từ 0).',
        'Kiểm "xong" TRƯỚC khi tra bảng tools — đây là tên đặc biệt, không phải tên một tool thật.',
        'Kiểm tools[ten] === undefined để bắt tên lạ; dùng "break" (hoặc "return" nếu vòng lặp nằm trong một hàm riêng) để dừng hẳn ngay khi gặp "xong" hoặc gặp lỗi.',
      ],
      sampleSolution: `const tools = {
  cong10: (x) => x + 10,
  nhan2: (x) => x * 2,
};
const danhSach = input("").split(",");
let giaTri = 0;
for (let i = 0; i < danhSach.length; i++) {
  const ten = danhSach[i];
  const buoc = i + 1;
  if (ten === "xong") {
    console.log("Buoc " + buoc + ": xong -> dung");
    break;
  }
  const ham = tools[ten];
  if (ham === undefined) {
    console.log("Buoc " + buoc + ": loi " + ten);
    break;
  }
  giaTri = ham(giaTri);
  console.log("Buoc " + buoc + ": " + ten + " -> " + giaTri);
}`,
    },
    homework:
      'Vòng lặp bài này dừng khi hết danh sách. Trong đời thật agent không có sẵn danh sách, nó phải TỰ QUYẾT ĐỊNH bước tiếp theo dựa trên kết quả bước trước. Hãy viết 3-4 câu trả lời: nếu thêm một GIỚI HẠN SỐ BƯỚC TỐI ĐA (ví dụ tối đa 5 bước) vào đúng logic hiện tại, bạn sẽ sửa điều kiện của vòng for ở đâu, và vì sao giới hạn này vẫn cần thiết dù agent "có vẻ" luôn dừng đúng lúc?',
    srsCards: [
      {
        hoi: 'Vòng lặp agent đầy đủ gồm 4 bước nào?',
        dap: 'Nghĩ -> gọi tool -> đọc kết quả -> lặp. Lặp lại từ đầu cho tới khi đạt điều kiện dừng.',
      },
      {
        hoi: 'Vì sao vòng lặp agent cần HAI điều kiện dừng, không chỉ một?',
        dap: 'Dừng "tự nhiên" (gặp tín hiệu hoàn thành như tool "xong") lo ca bình thường; dừng "an toàn" (giới hạn số bước tối đa) là lưới chặn chống lặp vô hạn khi logic sai hoặc khi agent không bao giờ quyết định là xong.',
      },
      {
        hoi: 'Khi một bước trong vòng lặp agent gặp lỗi (ví dụ tool không tồn tại), nên làm gì?',
        dap: 'Dừng ngay, không chạy tiếp các bước còn lại — vì các bước sau thường phụ thuộc kết quả bước trước, chạy tiếp trên dữ liệu sai chỉ làm tình trạng tệ hơn. Nhớ ghi log rõ bước nào lỗi để người sửa lỗi lần ra được.',
      },
    ],
  },
]
