// lessons/p6u97.ts — Chặng "principal-s2: Hệ tác tử & MCP", unit p6-u97 "Tool-use an toàn &
// MCP" (docs/specs/2026-08-31-dot-4-p5-tam-truong.md mục principal-s2).
//
// Cả 2 bài đều language: 'javascript', nối tiếp trực tiếp bảng tool + dispatch của p6-u96.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6_U97_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u97-l1',
    unitId: 'p6-u97',
    language: 'javascript',
    title: 'Gọi tool an toàn — allowlist và kiểm tham số trước khi chạy',
    hook: 'Một AI agent được nối mạng có thể bị dụ gõ "gọi tool xoaHetDuLieu" — nếu code của bạn chỉ biết tra bảng rồi gọi, nó sẽ làm theo. Cách tự vệ: đừng bao giờ chạy tool trước khi kiểm hai thứ — tên tool có nằm trong danh sách được phép không, và tham số có hợp lệ không.',
    theory:
      'Bài trước dispatch tool theo tên mà chưa kiểm gì cả. Ở đời thật, "tên tool" và "tham số" thường đến từ MỘT AI khác hoặc từ người dùng gõ tay — đó là dữ liệu KHÔNG ĐÁNG TIN, phải kiểm trước khi chạy.\n\nHai lớp kiểm, theo ĐÚNG THỨ TỰ (kiểm cái rẻ và nhanh trước):\n1. ALLOWLIST (danh sách cho phép) — chỉ những tên tool nằm trong một danh sách CÓ SẴN mới được chạy. Allowlist khác bảng tool (thứ mà dispatch tra) ở chỗ nó là một RANH GIỚI BẢO MẬT rõ ràng: nó thường nhỏ hơn hoặc bằng bảng tool đầy đủ, vì có thể có tool "nội bộ" mà ta không cho AI tự gọi.\n2. VALIDATE (kiểm hợp lệ) THAM SỐ — dù tên tool hợp lệ, tham số vẫn phải đúng định dạng. Ví dụ tool cần MỘT SỐ thì phải kiểm chuỗi đưa vào có đổi được sang số không: Number(chuoi) rồi kiểm Number.isNaN(ket_qua) — chuỗi không phải số (ví dụ "abc") sẽ cho NaN.\n\nCả hai lớp đều phải TỪ CHỐI RÕ RÀNG khi thất bại: không chạy tool, và không ném ra lỗi mơ hồ. Đây là nền tảng để bài sau (MCP) xây tiếp: một "máy chủ tool" đáng tin cậy luôn TỪ CHỐI trước, chạy sau.',
    workedExample: {
      code: `// Allowlist: chi cho phep goi cac tool trong danh sach nay
const allowlist = ["cong10", "nhan2"];
const tools = {
  cong10: (x) => x + 10,
  nhan2: (x) => x * 2,
};

function goiToolAnToan(ten, thamSoChuoi) {
  if (!allowlist.includes(ten)) {           // (a) chan tool ngoai allowlist
    return "Tu choi: tool " + ten + " khong trong allowlist";
  }
  const thamSo = Number(thamSoChuoi);
  if (Number.isNaN(thamSo)) {               // (b) chan tham so khong phai so
    return "Tu choi: tham so khong hop le";
  }
  return "Ket qua: " + tools[ten](thamSo);  // (c) hop le -> chay that
}

console.log(goiToolAnToan("cong10", "5"));
console.log(goiToolAnToan("xoaHetDuLieu", "1"));
console.log(goiToolAnToan("nhan2", "abc"));`,
      stdinLines: [],
    },
    predict: {
      code: `console.log(Number.isNaN(Number("abc")));`,
      question: 'Number("abc") đổi một chuỗi không phải số sang số. Dòng này in ra gì?',
      choices: ['true', 'false', 'NaN', 'undefined'],
      answerIndex: 0,
      explain:
        'Number("abc") cho ra NaN (Not a Number — không phải một số), và Number.isNaN(NaN) trả về true, nên dòng này in true. Phương án false chỉ đúng khi chuỗi đổi được sang số; NaN và undefined đều sai vì console.log in ra giá trị của Number.isNaN, mà hàm này luôn trả về true/false. Đây chính là cách kiểm tham số hợp lệ: đổi sang số rồi hỏi "có phải NaN không", chứ không so sánh trực tiếp với chuỗi "NaN".',
    },
    parsons: {
      prompt: 'Xếp đúng thứ tự kiểm: allowlist trước, tham số sau, chạy thật sau cùng.',
      lines: [
        'if (!allowlist.includes(ten)) {',
        '    console.log("Tu choi: tool " + ten + " khong trong allowlist");',
        '} else {',
        '    const thamSo = Number(thamSoChuoi);',
        '    if (Number.isNaN(thamSo)) {',
        '        console.log("Tu choi: tham so khong hop le");',
        '    } else {',
        '        console.log("Ket qua: " + tools[ten](thamSo));',
        '    }',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết hàm gọi tool AN TOÀN với allowlist chỉ gồm "cong10" và "nhan2".\n\nChương trình đọc 2 dòng input():\n- Dòng 1: tên tool.\n- Dòng 2: tham số (chuỗi — có thể KHÔNG phải số).\n\nKiểm theo đúng thứ tự:\n(a) Nếu tên tool KHÔNG nằm trong allowlist ["cong10", "nhan2"], in đúng 1 dòng:\nTu choi: tool <ten> khong trong allowlist\n(b) Nếu tên hợp lệ nhưng tham số đổi sang số bị NaN (dùng Number(...) rồi Number.isNaN(...)), in đúng 1 dòng:\nTu choi: tham so khong hop le\n(c) Nếu cả hai đều hợp lệ, chạy tool và in đúng 1 dòng:\nKet qua: <ket qua>',
      starterCode: `const allowlist = ["cong10", "nhan2"];
const tools = {
  cong10: (x) => x + 10,
  nhan2: (x) => x * 2,
};
const ten = input("");
const thamSoChuoi = input("");
// (a) ten khong trong allowlist -> "Tu choi: tool <ten> khong trong allowlist"
// (b) tham so khong phai so (Number.isNaN) -> "Tu choi: tham so khong hop le"
// (c) hop le ca hai -> "Ket qua: <ket qua>"
`,
      testCases: [
        {
          stdinLines: ['cong10', '5'],
          expected: 'Ket qua: 15',
          match: 'contains',
          hidden: false,
          label: 'Tool hợp lệ, tham số hợp lệ -> chạy thật',
        },
        {
          stdinLines: ['xyz', '5'],
          expected: 'Tu choi: tool xyz khong trong allowlist',
          match: 'contains',
          hidden: false,
          label: 'Tool ngoài allowlist bị từ chối ngay, không xét tham số',
        },
        {
          stdinLines: ['nhan2', 'abc'],
          expected: 'Tu choi: tham so khong hop le',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: tool hợp lệ nhưng tham số không đổi được sang số',
        },
      ],
      hints: [
        'allowlist.includes(ten) trả về true/false — dùng dấu ! để kiểm "không nằm trong".',
        'Đổi tham số bằng Number(thamSoChuoi) rồi kiểm Number.isNaN(...) — "5" đổi thành 5 (không phải NaN), còn "abc" đổi thành NaN.',
        'Kiểm allowlist TRƯỚC, tham số SAU: dùng if / else lồng nhau đúng thứ tự (a) -> (b) -> (c).',
      ],
      sampleSolution: `const allowlist = ["cong10", "nhan2"];
const tools = {
  cong10: (x) => x + 10,
  nhan2: (x) => x * 2,
};
const ten = input("");
const thamSoChuoi = input("");
if (!allowlist.includes(ten)) {
  console.log("Tu choi: tool " + ten + " khong trong allowlist");
} else {
  const thamSo = Number(thamSoChuoi);
  if (Number.isNaN(thamSo)) {
    console.log("Tu choi: tham so khong hop le");
  } else {
    console.log("Ket qua: " + tools[ten](thamSo));
  }
}`,
    },
    homework:
      'Tìm 2 ví dụ ngoài đời nơi "allowlist" (danh sách cho phép) đang được dùng để bảo vệ một hệ thống — ví dụ: wifi công ty chỉ cho thiết bị đã đăng ký kết nối, hay toà nhà chỉ mở cửa cho thẻ từ đã cấp. Với mỗi ví dụ, trả lời: nếu KHÔNG có allowlist, điều tệ nhất có thể xảy ra là gì?',
    srsCards: [
      {
        hoi: 'Vì sao chỉ có bảng tool (dispatch) là chưa đủ an toàn cho một agent thật?',
        dap: 'Tên tool và tham số thường đến từ dữ liệu KHÔNG ĐÁNG TIN (một AI khác, hoặc người dùng gõ tay). Không kiểm trước, agent có thể bị dụ gọi tool nguy hiểm hoặc chạy với tham số sai định dạng.',
      },
      {
        hoi: 'Hai lớp kiểm an toàn trước khi chạy một tool là gì, theo đúng thứ tự?',
        dap: 'Allowlist trước (tên tool có nằm trong danh sách được phép không), rồi mới kiểm tham số (đúng định dạng, ví dụ dùng Number.isNaN để biết có phải số hợp lệ không). Kiểm cái rẻ và nhanh trước, chỉ chạy thật khi cả hai lớp đều qua.',
      },
      {
        hoi: 'Trong JavaScript, kiểm một chuỗi có đổi được sang số hợp lệ không bằng cách nào?',
        dap: 'Dùng Number(chuoi) rồi kiểm Number.isNaN(ket_qua) — chuỗi không phải số (ví dụ "abc") sẽ cho NaN, và Number.isNaN(NaN) trả về true.',
      },
    ],
  },
  {
    id: 'p6-u97-l2',
    unitId: 'p6-u97',
    language: 'javascript',
    title: 'MCP là gì — hợp đồng liệt kê tool và gọi tool',
    hook: 'Mỗi công ty AI từng tự bịa ra một cách riêng để nối AI với tool: định dạng khác nhau, tên hàm khác nhau, không bên nào đọc được của bên nào. MCP (Model Context Protocol — giao thức ngữ cảnh cho mô hình) giải quyết đúng MỘT vấn đề: chuẩn hoá hai việc — "máy có tool gì" và "gọi một tool theo tên" — để MỌI AI nói được với MỌI máy chủ tool, không cần biết trước nó viết bằng ngôn ngữ gì.',
    theory:
      'MCP (Model Context Protocol) KHÔNG phải một thư viện, cũng không phải một AI — nó là một HỢP ĐỒNG (giao thức): bộ luật chung về cách AI và "máy chủ tool" (MCP server) nói chuyện với nhau. Bạn không cần dựng server thật để hiểu nó. Chỉ cần thấy đây chính là BẢNG TOOL của bài p6-u96, nhưng được CHUẨN HOÁ để mọi bên dùng chung.\n\nMột MCP server, bóc gọn lại, chỉ cần trả lời được HAI câu hỏi:\n1. LIỆT KÊ (list tools) — "máy có những tool nào?" Server trả về một danh sách, mỗi tool có TÊN và MÔ TẢ, để AI biết tool đó dùng để làm gì mà không cần đọc code.\n2. GỌI (call tool) — "hãy chạy tool tên X". AI gọi đúng TÊN, server tìm tool đó rồi thực thi.\n\nVì sao chuẩn hoá lại quan trọng: trước khi có MCP, mỗi AI (Claude, GPT, Gemini...) muốn dùng một tool mới (ví dụ "đọc file Google Drive") thì phải viết riêng một lớp tích hợp cho AI đó. Có MCP, chỉ cần ai đó làm một MCP server cho Google Drive MỘT LẦN, mọi AI hỗ trợ MCP đều dùng được ngay — giống như cổng USB chuẩn hoá cách cắm thiết bị vào máy tính, không hãng nào phải làm một kiểu cắm riêng.\n\nBài này mô phỏng đúng 2 hành vi cốt lõi đó bằng MỘT OBJECT JavaScript cố định: không dựng server thật, không cần mạng, để bạn nắm chắc phần gốc rễ trước khi dùng công cụ thật ngoài đời.',
    workedExample: {
      code: `// "May chu" MCP toi gian: chi la MOT OBJECT mo ta cac tool no co
const server = {
  tools: [
    { name: "congTien", mota: "Cong hai khoan tien lai" },
    { name: "tru", mota: "Tru hai so tien" },
  ],
};

// (1) Liet ke: AI hoi "may co tool gi?" -> doc danh sach nay
for (const tool of server.tools) {
  console.log(tool.name + ": " + tool.mota);
}

// (2) Goi theo ten: AI noi "goi tool congTien" -> tim trong danh sach
const timThay = server.tools.some((t) => t.name === "congTien");
console.log(timThay ? "Da goi: congTien" : "Loi: khong co tool congTien");`,
      stdinLines: [],
    },
    predict: {
      code: `const server = { tools: [{ name: "a", mota: "x" }, { name: "b", mota: "y" }] };
console.log(server.tools.some((t) => t.name === "b"));`,
      question:
        'server.tools.some(...) kiểm "có PHẦN TỬ nào khớp điều kiện không". Dòng này in ra gì?',
      choices: ['true', 'false', 'b', 'undefined'],
      answerIndex: 0,
      explain:
        'server.tools có phần tử { name: "b", mota: "y" } khớp điều kiện t.name === "b", nên .some(...) trả về true. Phương án false chỉ đúng nếu không phần tử nào khớp; "b" là nhầm với .find (trả về phần tử) chứ .some chỉ trả true/false; undefined là kết quả của .find khi không tìm thấy. Đây chính là cách một MCP server "tìm xem có tool này không" trước khi gọi.',
    },
    parsons: {
      prompt:
        'Xếp đúng phần xử lý lệnh MCP tối giản: "list" thì liệt kê hết, "call <ten>" thì tìm rồi báo kết quả.',
      lines: [
        'const lenh = input("");',
        'if (lenh === "list") {',
        '    for (const tool of server.tools) {',
        '        console.log(tool.name + ": " + tool.mota);',
        '    }',
        '} else if (lenh.startsWith("call ")) {',
        '    const ten = lenh.slice(5);',
        '    const timThay = server.tools.some((t) => t.name === ten);',
        '    console.log(timThay ? "Da goi: " + ten : "Loi: khong co tool " + ten);',
        '}',
      ],
    },
    make: {
      prompt:
        'Mô phỏng hai hành vi cốt lõi của MCP trên một "server" đã mô tả sẵn (biến server trong starterCode).\n\nChương trình đọc 1 dòng input() là một LỆNH:\n- Nếu lệnh là "list": in từng dòng "<ten>: <mo ta>" cho MỖI tool, theo ĐÚNG thứ tự khai báo trong server.tools.\n- Nếu lệnh bắt đầu bằng "call " (có dấu cách): lấy phần sau "call " làm tên tool. Nếu tên đó CÓ trong server.tools, in đúng 1 dòng "Da goi: <ten>"; nếu KHÔNG có, in đúng 1 dòng "Loi: khong co tool <ten>".',
      starterCode: `const server = {
  tools: [
    { name: "congTien", mota: "Cong hai khoan tien lai" },
    { name: "tru", mota: "Tru hai so tien" },
  ],
};
const lenh = input("");
// lenh === "list" -> in tung dong "<ten>: <mo ta>" theo dung thu tu server.tools
// lenh bat dau "call " -> lay ten sau "call ", kiem co trong server.tools khong
//   co -> "Da goi: <ten>" ; khong co -> "Loi: khong co tool <ten>"
`,
      testCases: [
        {
          stdinLines: ['list'],
          expected: 'congTien: Cong hai khoan tien lai\ntru: Tru hai so tien',
          match: 'contains',
          hidden: false,
          label: 'Lệnh "list" in đủ 2 tool đúng thứ tự khai báo',
        },
        {
          stdinLines: ['call congTien'],
          expected: 'Da goi: congTien',
          match: 'contains',
          hidden: false,
          label: 'Gọi đúng tên một tool có sẵn',
        },
        {
          stdinLines: ['call xyz'],
          expected: 'Loi: khong co tool xyz',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: gọi tên không có trong server.tools',
        },
      ],
      hints: [
        'Duyệt server.tools bằng "for (const tool of server.tools)" — mỗi phần tử có tool.name và tool.mota.',
        'lenh.startsWith("call ") kiểm lệnh có bắt đầu bằng "call " (kèm dấu cách) không; lenh.slice(5) lấy phần còn lại sau 5 ký tự đầu, vì "call " dài đúng 5 ký tự.',
        'Dùng server.tools.some((t) => t.name === ten) để kiểm tên có tồn tại trong danh sách không, rồi in đúng thông báo tương ứng.',
      ],
      sampleSolution: `const server = {
  tools: [
    { name: "congTien", mota: "Cong hai khoan tien lai" },
    { name: "tru", mota: "Tru hai so tien" },
  ],
};
const lenh = input("");
if (lenh === "list") {
  for (const tool of server.tools) {
    console.log(tool.name + ": " + tool.mota);
  }
} else if (lenh.startsWith("call ")) {
  const ten = lenh.slice(5);
  const timThay = server.tools.some((t) => t.name === ten);
  console.log(timThay ? "Da goi: " + ten : "Loi: khong co tool " + ten);
}`,
    },
    homework:
      'Tìm hiểu thêm (chỉ đọc, không cần code) về một MCP server thật đang được nói tới trong cộng đồng — ví dụ server cho hệ thống file, cho trình duyệt, hay cho cơ sở dữ liệu. Nó cũng trả lời hai câu hỏi "có tool gì" và "gọi thế nào" giống bài này. Hãy liệt kê 3 tool nó có thể có, mỗi tool một mô tả ngắn, theo đúng khuôn "<ten>: <mo ta>" đã luyện ở bài này.',
    srsCards: [
      {
        hoi: 'MCP (Model Context Protocol) là gì, nói trong một câu?',
        dap: 'Một hợp đồng (giao thức) chuẩn hoá cách AI và "máy chủ tool" nói chuyện: bất kỳ AI nào hỗ trợ MCP cũng gọi được bất kỳ MCP server nào theo cùng một cách, không cần biết trước server đó viết bằng ngôn ngữ gì.',
      },
      {
        hoi: 'MCP server phải trả lời được ĐÚNG hai câu hỏi nào?',
        dap: 'Liệt kê (list tools) — máy có những tool nào, mỗi tool gồm tên và mô tả. Gọi (call tool) — chạy một tool theo đúng tên được yêu cầu.',
      },
      {
        hoi: 'Vì sao chuẩn hoá (như MCP) tốt hơn việc mỗi AI tự viết lớp tích hợp riêng?',
        dap: 'Không chuẩn hoá: một tool mới phải được tích hợp riêng cho TỪNG AI. Có chuẩn hoá: một MCP server viết MỘT LẦN, mọi AI hỗ trợ MCP dùng được ngay — giống cổng USB chuẩn hoá cách cắm thiết bị, không hãng nào phải làm một kiểu riêng.',
      },
    ],
  },
]
