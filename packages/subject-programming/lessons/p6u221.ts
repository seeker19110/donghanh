// lessons/p6u221.ts — P6-U221: HƯỚNG DI ĐỘNG, chặng S3 — Trải nghiệm chuẩn nền tảng
// (module `mobile-s3-m4`).
//
// MÔ PHỎNG: bộ rà trợ năng TĨNH viết bằng TypeScript thuần, tất định. Không dựng giao diện
// thật, không chạy TalkBack/VoiceOver. Việc đi trọn luồng chính bằng trình đọc màn hình trên
// thiết bị thật nằm ở bài tập về nhà — rà tĩnh KHÔNG thay thế được việc đó.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U221_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u221-l1',
    unitId: 'p6-u221',
    language: 'typescript',
    title: 'Nút chỉ có icon: thứ trình đọc màn hình đọc ra là "nút"',
    hook: 'Màn hình giỏ hàng có ba nút icon: thùng rác, trái tim, mũi tên. Người dùng TalkBack nghe được ba lần đúng một chữ: "nút", "nút", "nút". Họ không biết cái nào xoá đơn hàng, nên họ rời app.',
    theory:
      'Trình đọc màn hình (TalkBack trên Android, VoiceOver trên iOS) đọc NHÃN của thành phần, không đọc hình vẽ. Một icon thùng rác với người sáng mắt là hiển nhiên; với trình đọc màn hình nó là một hình không tên.\n\nVì vậy luật cứng: mọi thành phần chạm được mà không có chữ hiển thị đều PHẢI có nhãn mô tả (contentDescription trên Android, accessibilityLabel trên iOS). Nhãn tả HÀNH ĐỘNG, không tả hình vẽ: "Xoá khỏi giỏ hàng", không phải "biểu tượng thùng rác" — người nghe cần biết bấm vào thì việc gì xảy ra.\n\nMột luật phụ quan trọng ngang: thành phần chỉ để trang trí thì phải được đánh dấu ẩn khỏi trợ năng, chứ không phải gán cho nó một nhãn bừa. Đọc ra "hình nền màu xanh" giữa luồng thanh toán chỉ làm nhiễu.\n\nBài này viết phép rà tĩnh cho đúng luật chính: duyệt danh sách nút, tìm nút vừa không có chữ hiển thị vừa không có nhãn. Có hai điểm thiết kế đáng chú ý và cả hai đều là nội dung dạy:\n\n1. **Danh sách rỗng trả về unknown, không phải allow.** Màn hình không có nút nào để rà nghĩa là chưa có dữ liệu để kết luận — có thể bộ rà chưa chạy đúng chỗ. Báo "đạt" ở đây chính là kiểu hỏng im lặng khiến người ta tin vào một cổng không kiểm gì.\n2. **Báo cáo phải nói TÊN nút vi phạm.** Một dòng "có 3 nút thiếu nhãn" không giúp ai sửa được; phải chỉ đúng nút nào. Tên xếp theo thứ tự xuất hiện để hai lần chạy cho cùng một chuỗi — điều kiện để viết test.',
    workedExample: {
      code: `interface Nut {
  ten: string
  chuHienThi: string  // rong = nut chi co icon
  nhan: string        // nhan cho trinh doc man hinh
}

function raNhan(nut: Nut[]): string {
  // Khong co nut nao de ra = CHUA CO du lieu, khong phai "dat".
  if (nut.length === 0) return "unknown: khong co nut nao de ra"
  const thieu: string[] = []
  for (const n of nut) {
    if (n.chuHienThi.trim() === "" && n.nhan.trim() === "") thieu.push(n.ten)
  }
  // Bao cao phai chi DUNG NUT nao, dem so luong thi khong ai sua duoc.
  if (thieu.length > 0) return "deny: thieu nhan o " + thieu.join(",")
  return "allow: moi nut deu doc duoc"
}

const tot: Nut[] = [
  { ten: "xoa", chuHienThi: "", nhan: "Xoa khoi gio hang" },
  { ten: "luu", chuHienThi: "Luu", nhan: "" },
]
console.log(raNhan(tot))
console.log(raNhan([{ ten: "tim", chuHienThi: "", nhan: "" }, { ten: "chia-se", chuHienThi: "", nhan: "" }]))
console.log(raNhan([]))`,
      stdinLines: [],
    },
    predict: {
      code: `interface Nut {
  ten: string
  chuHienThi: string
  nhan: string
}
function raNhan(nut: Nut[]): string {
  if (nut.length === 0) return "unknown: khong co nut nao de ra"
  const thieu: string[] = []
  for (const n of nut) {
    if (n.chuHienThi.trim() === "" && n.nhan.trim() === "") thieu.push(n.ten)
  }
  if (thieu.length > 0) return "deny: thieu nhan o " + thieu.join(",")
  return "allow: moi nut deu doc duoc"
}
console.log(raNhan([{ ten: "luu", chuHienThi: "Luu", nhan: "" }, { ten: "tim", chuHienThi: "", nhan: "" }]))`,
      question: 'Nút "luu" có chữ hiển thị nhưng không nhãn; nút "tim" không có gì cả. In ra gì?',
      choices: [
        'deny: thieu nhan o tim',
        'deny: thieu nhan o luu,tim',
        'allow: moi nut deu doc duoc',
        'unknown: khong co nut nao de ra',
      ],
      answerIndex: 0,
      explain:
        'Nút có chữ hiển thị thì trình đọc màn hình đã có cái để đọc, nên nó không vi phạm dù trường nhãn trống. Điều kiện vi phạm cần CẢ HAI cùng trống — dùng && chứ không phải ||, nếu không bộ rà sẽ báo hàng loạt nút hoàn toàn bình thường và nhanh chóng bị mọi người bỏ qua.',
    },
    parsons: {
      prompt: 'Xếp lại bộ rà nhãn: chặn danh sách rỗng, gom tên nút thiếu nhãn, rồi kết luận.',
      lines: [
        'function raNhan(nut: Nut[]): string {',
        '  if (nut.length === 0) return "unknown: khong co nut nao de ra"',
        '  const thieu: string[] = []',
        '  for (const n of nut) {',
        '    if (n.chuHienThi.trim() === "" && n.nhan.trim() === "") thieu.push(n.ten)',
        '  }',
        '  if (thieu.length > 0) return "deny: thieu nhan o " + thieu.join(",")',
        '  return "allow: moi nut deu doc duoc"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết raNhan(nut):\n\n1. mảng rỗng → "unknown: khong co nut nao de ra"\n2. gom tên những nút có CẢ chuHienThi lẫn nhan rỗng (sau trim), theo thứ tự xuất hiện\n3. có nút vi phạm → "deny: thieu nhan o " + các tên nối bằng dấu phẩy\n4. không có → "allow: moi nut deu doc duoc"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface Nut {
  ten: string
  chuHienThi: string
  nhan: string
}

function raNhan(nut: Nut[]): string {
  // TODO: chan mang rong, gom ten vi pham, roi ket luan
  return "allow: moi nut deu doc duoc"
}

// ---- Đừng sửa phần dưới đây ----
const tot: Nut[] = [
  { ten: "xoa", chuHienThi: "", nhan: "Xoa khoi gio hang" },
  { ten: "luu", chuHienThi: "Luu", nhan: "" },
]
console.log("Ca 1:", raNhan(tot))
console.log("Ca 2:", raNhan([{ ten: "tim", chuHienThi: "", nhan: "" }, { ten: "chia-se", chuHienThi: "", nhan: "" }]))
console.log("Ca 3:", raNhan([]))
console.log("Ca 4:", raNhan([{ ten: "loc", chuHienThi: "  ", nhan: "  " }]))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: allow: moi nut deu doc duoc',
          match: 'contains',
          hidden: false,
          label: 'Nút có nhãn hoặc có chữ hiển thị: đều đọc được',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: deny: thieu nhan o tim,chia-se',
          match: 'contains',
          hidden: false,
          label: 'Báo cáo chỉ đúng tên từng nút vi phạm, theo thứ tự xuất hiện',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: unknown: khong co nut nao de ra',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: không có gì để rà thì không được báo đạt',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: moi nut deu doc duoc\nCa 2: deny: thieu nhan o tim,chia-se\nCa 3: unknown: khong co nut nao de ra\nCa 4: deny: thieu nhan o loc',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: bốn ca, gồm nhãn chỉ toàn khoảng trắng',
        },
      ],
      hints: [
        'Dùng vòng for...of duyệt mảng và push tên vào một mảng thieu khai báo trước vòng lặp.',
        'Điều kiện vi phạm cần && (cả hai cùng rỗng), không phải || — Ca 1 có nút chỉ thiếu một trong hai và vẫn hợp lệ.',
        'Ca 4 dùng chuỗi toàn khoảng trắng: phải trim() trước khi so với chuỗi rỗng.',
      ],
      sampleSolution: `interface Nut {
  ten: string
  chuHienThi: string
  nhan: string
}

function raNhan(nut: Nut[]): string {
  if (nut.length === 0) return "unknown: khong co nut nao de ra"
  const thieu: string[] = []
  for (const n of nut) {
    if (n.chuHienThi.trim() === "" && n.nhan.trim() === "") thieu.push(n.ten)
  }
  if (thieu.length > 0) return "deny: thieu nhan o " + thieu.join(",")
  return "allow: moi nut deu doc duoc"
}

// ---- Đừng sửa phần dưới đây ----
const tot: Nut[] = [
  { ten: "xoa", chuHienThi: "", nhan: "Xoa khoi gio hang" },
  { ten: "luu", chuHienThi: "Luu", nhan: "" },
]
console.log("Ca 1:", raNhan(tot))
console.log("Ca 2:", raNhan([{ ten: "tim", chuHienThi: "", nhan: "" }, { ten: "chia-se", chuHienThi: "", nhan: "" }]))
console.log("Ca 3:", raNhan([]))
console.log("Ca 4:", raNhan([{ ten: "loc", chuHienThi: "  ", nhan: "  " }]))`,
    },
    homework:
      'Bật TalkBack (Android) hoặc VoiceOver (iOS) trên máy bạn và đi trọn một luồng quen thuộc trong một app bất kỳ: tìm kiếm, thêm vào giỏ, thanh toán. Nhắm mắt ở đoạn cuối. Ghi lại mọi chỗ bạn nghe thấy "nút" trống rỗng hoặc bị kẹt không biết bấm gì. Đó là dữ liệu mà rà tĩnh trong bài không bao giờ thay được.',
    srsCards: [
      {
        hoi: 'Trình đọc màn hình đọc cái gì của một nút chỉ có icon?',
        dap: 'Nó đọc nhãn trợ năng của thành phần chứ không đọc hình vẽ, nên nút icon không nhãn chỉ được đọc là "nút" và người nghe không biết bấm vào thì việc gì xảy ra.',
      },
      {
        hoi: 'Nhãn trợ năng nên tả cái gì?',
        dap: 'Tả hành động sẽ xảy ra, ví dụ "Xoá khỏi giỏ hàng", chứ không tả hình vẽ như "biểu tượng thùng rác" — người nghe cần biết kết quả của việc bấm, không cần biết hình gì.',
      },
      {
        hoi: 'Thành phần chỉ để trang trí thì xử lý thế nào cho đúng?',
        dap: 'Đánh dấu ẩn khỏi trợ năng thay vì gán một nhãn bừa, vì đọc ra những thứ như "hình nền màu xanh" giữa một luồng thanh toán chỉ làm nhiễu người đang nghe.',
      },
    ],
  },
  {
    id: 'p6-u221-l2',
    unitId: 'p6-u221',
    language: 'typescript',
    title: 'Chiều cao cố định và cỡ chữ hệ thống — bố cục vỡ ở máy người khác',
    hook: 'Người dùng chỉnh cỡ chữ hệ thống lên mức lớn nhất vì mắt kém. Trong app, nút "Xác nhận thanh toán" bị cắt còn "Xác nhậ", và dòng giá tiền biến mất hẳn dưới mép khung. Không ai trong đội thấy lỗi này, vì máy của họ để cỡ chữ mặc định.',
    theory:
      'Cỡ chữ hệ thống là thiết lập trợ năng được dùng nhiều nhất trên điện thoại — nhiều hơn cả trình đọc màn hình. Và nó phá bố cục theo một kiểu rất đặc trưng: khung giữ nguyên, chữ to ra, phần thừa bị cắt.\n\nNguyên nhân gần như luôn là một trong hai:\n\n1. **Chiều cao cố định ở nơi chứa văn bản thay đổi được.** Đặt cứng một con số chiều cao cho khung chứa chữ là giả định rằng chữ sẽ luôn cao đúng chừng ấy. Giả định đó sai ngay khi người dùng phóng cỡ chữ, hoặc khi đổi ngôn ngữ (cùng một câu tiếng Việt và tiếng Đức chênh nhau đáng kể).\n2. **Không khai báo hỗ trợ phóng cỡ chữ.** Một số cách đặt cỡ chữ bỏ qua thiết lập hệ thống — chữ trong app đứng yên trong khi cả máy đã to lên. Với người cần nó, đó là app không dùng được.\n\nBộ rà của bài gộp cả hai cộng với yêu cầu chế độ tối, và thứ tự các nhánh phản ánh mức độ hỏng: không hỗ trợ phóng cỡ chữ → **deny** (người cần nó không dùng được app); chiều cao cố định với văn bản dài → **deny** (nội dung bị cắt); thiếu chế độ tối → **warn** (khó chịu, chói mắt ban đêm, nhưng vẫn dùng được).\n\nĐây cũng là chỗ nhắc lại đúng ranh giới của mọi bộ rà TĨNH: nó bắt được những gì khai báo trong mã, và chỉ thế thôi. Một màn hình khai đủ mọi thứ vẫn có thể vô dụng với trình đọc màn hình nếu thứ tự đọc lộn xộn hoặc tiêu điểm nhảy lung tung. Rà tĩnh lọc phần máy làm được để người tập trung vào phần chỉ người mới làm được — nó không thay được việc đi thật một lượt bằng trình đọc màn hình.',
    workedExample: {
      code: `interface ManHinh {
  hoTroPhongCoChu: boolean
  chieuCaoCoDinhVoiVanBanDai: boolean
  hoTroCheDoToi: boolean
}

function raBoCuc(m: ManHinh): string {
  // Thu tu theo muc do hong: khong dung duoc > noi dung bi cat > kho chiu.
  if (!m.hoTroPhongCoChu) return "deny: khong ho tro phong co chu he thong"
  if (m.chieuCaoCoDinhVoiVanBanDai) return "deny: chieu cao co dinh o noi co van ban dai"
  if (!m.hoTroCheDoToi) return "warn: chua ho tro che do toi"
  return "allow: bo cuc co gian duoc"
}

const tot: ManHinh = { hoTroPhongCoChu: true, chieuCaoCoDinhVoiVanBanDai: false, hoTroCheDoToi: true }
console.log(raBoCuc(tot))
console.log(raBoCuc({ ...tot, hoTroCheDoToi: false }))
console.log(raBoCuc({ ...tot, chieuCaoCoDinhVoiVanBanDai: true }))
console.log(raBoCuc({ ...tot, hoTroPhongCoChu: false }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface ManHinh {
  hoTroPhongCoChu: boolean
  chieuCaoCoDinhVoiVanBanDai: boolean
  hoTroCheDoToi: boolean
}
function raBoCuc(m: ManHinh): string {
  if (!m.hoTroPhongCoChu) return "deny: khong ho tro phong co chu he thong"
  if (m.chieuCaoCoDinhVoiVanBanDai) return "deny: chieu cao co dinh o noi co van ban dai"
  if (!m.hoTroCheDoToi) return "warn: chua ho tro che do toi"
  return "allow: bo cuc co gian duoc"
}
console.log(raBoCuc({ hoTroPhongCoChu: true, chieuCaoCoDinhVoiVanBanDai: true, hoTroCheDoToi: false }))`,
      question: 'Màn hình có chiều cao cố định VÀ thiếu chế độ tối. In ra gì?',
      choices: [
        'deny: chieu cao co dinh o noi co van ban dai',
        'warn: chua ho tro che do toi',
        'deny: khong ho tro phong co chu he thong',
        'allow: bo cuc co gian duoc',
      ],
      answerIndex: 0,
      explain:
        'Nhánh chặn đứng trước nhánh cảnh báo, nên vi phạm nặng hơn được báo. Xếp theo mức độ hỏng là nguyên tắc chung của mọi bộ rà: nội dung bị cắt khiến người dùng không hoàn thành được việc, còn thiếu chế độ tối chỉ gây khó chịu.',
    },
    parsons: {
      prompt:
        'Xếp lại bộ rà bố cục theo mức độ hỏng giảm dần: không dùng được, nội dung bị cắt, rồi khó chịu.',
      lines: [
        'function raBoCuc(m: ManHinh): string {',
        '  if (!m.hoTroPhongCoChu) return "deny: khong ho tro phong co chu he thong"',
        '  if (m.chieuCaoCoDinhVoiVanBanDai) return "deny: chieu cao co dinh o noi co van ban dai"',
        '  if (!m.hoTroCheDoToi) return "warn: chua ho tro che do toi"',
        '  return "allow: bo cuc co gian duoc"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết raBoCuc(m) theo thứ tự:\n\n1. không hoTroPhongCoChu → "deny: khong ho tro phong co chu he thong"\n2. chieuCaoCoDinhVoiVanBanDai → "deny: chieu cao co dinh o noi co van ban dai"\n3. không hoTroCheDoToi → "warn: chua ho tro che do toi"\n4. còn lại → "allow: bo cuc co gian duoc"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface ManHinh {
  hoTroPhongCoChu: boolean
  chieuCaoCoDinhVoiVanBanDai: boolean
  hoTroCheDoToi: boolean
}

function raBoCuc(m: ManHinh): string {
  // TODO: hai nhanh deny, mot nhanh warn, roi allow
  return "allow: bo cuc co gian duoc"
}

// ---- Đừng sửa phần dưới đây ----
const tot: ManHinh = { hoTroPhongCoChu: true, chieuCaoCoDinhVoiVanBanDai: false, hoTroCheDoToi: true }
console.log("Ca 1:", raBoCuc(tot))
console.log("Ca 2:", raBoCuc({ ...tot, hoTroCheDoToi: false }))
console.log("Ca 3:", raBoCuc({ ...tot, chieuCaoCoDinhVoiVanBanDai: true, hoTroCheDoToi: false }))
console.log("Ca 4:", raBoCuc({ ...tot, hoTroPhongCoChu: false, chieuCaoCoDinhVoiVanBanDai: true }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 2: warn: chua ho tro che do toi',
          match: 'contains',
          hidden: false,
          label: 'Thiếu chế độ tối: cảnh báo, vẫn dùng được app',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: deny: chieu cao co dinh o noi co van ban dai',
          match: 'contains',
          hidden: false,
          label: 'Chiều cao cố định: nội dung bị cắt, nặng hơn chế độ tối',
        },
        {
          stdinLines: [],
          expected: 'Ca 4: deny: khong ho tro phong co chu he thong',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: không phóng được cỡ chữ là vi phạm nặng nhất',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: bo cuc co gian duoc\nCa 2: warn: chua ho tro che do toi\nCa 3: deny: chieu cao co dinh o noi co van ban dai\nCa 4: deny: khong ho tro phong co chu he thong',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: bốn ca theo đúng thứ tự mức độ hỏng',
        },
      ],
      hints: [
        'Hai trường hoTro... kiểm bằng dấu ! vì vi phạm là khi KHÔNG hỗ trợ; trường chieuCaoCoDinh... thì ngược lại.',
        'Ca 3 và Ca 4 đều vi phạm nhiều thứ cùng lúc — thứ tự bốn nhánh quyết định cái nào được báo.',
        'Không cần else: mỗi câu if đều return nên nhánh cuối tự nhiên là trường hợp sạch.',
      ],
      sampleSolution: `interface ManHinh {
  hoTroPhongCoChu: boolean
  chieuCaoCoDinhVoiVanBanDai: boolean
  hoTroCheDoToi: boolean
}

function raBoCuc(m: ManHinh): string {
  if (!m.hoTroPhongCoChu) return "deny: khong ho tro phong co chu he thong"
  if (m.chieuCaoCoDinhVoiVanBanDai) return "deny: chieu cao co dinh o noi co van ban dai"
  if (!m.hoTroCheDoToi) return "warn: chua ho tro che do toi"
  return "allow: bo cuc co gian duoc"
}

// ---- Đừng sửa phần dưới đây ----
const tot: ManHinh = { hoTroPhongCoChu: true, chieuCaoCoDinhVoiVanBanDai: false, hoTroCheDoToi: true }
console.log("Ca 1:", raBoCuc(tot))
console.log("Ca 2:", raBoCuc({ ...tot, hoTroCheDoToi: false }))
console.log("Ca 3:", raBoCuc({ ...tot, chieuCaoCoDinhVoiVanBanDai: true, hoTroCheDoToi: false }))
console.log("Ca 4:", raBoCuc({ ...tot, hoTroPhongCoChu: false, chieuCaoCoDinhVoiVanBanDai: true }))`,
    },
    homework:
      'Vào Cài đặt hệ thống, chỉnh cỡ chữ và cỡ hiển thị lên mức LỚN NHẤT, rồi mở ba app bạn dùng nhiều nhất. Chụp màn hình mọi chỗ bị cắt chữ, chồng chữ, hoặc nút biến mất. Giữ nguyên thiết lập đó cả ngày để thấy nó ảnh hưởng thế nào tới việc dùng máy. Viết 5 câu về chỗ hỏng tệ nhất bạn tìm được và cách sửa nó.',
    srsCards: [
      {
        hoi: 'Cỡ chữ hệ thống phá bố cục theo kiểu đặc trưng nào?',
        dap: 'Khung giữ nguyên kích thước còn chữ to ra, nên phần thừa bị cắt: nút mất chữ, dòng nội dung biến mất dưới mép khung, trong khi máy của đội phát triển để cỡ mặc định nên không ai thấy.',
      },
      {
        hoi: 'Vì sao đặt cứng chiều cao cho khung chứa văn bản là sai?',
        dap: 'Vì nó giả định chữ luôn cao đúng chừng ấy, mà giả định đó sai ngay khi người dùng phóng cỡ chữ hoặc khi đổi ngôn ngữ, vì cùng một câu ở hai ngôn ngữ có độ dài chênh nhau đáng kể.',
      },
      {
        hoi: 'Bộ rà trợ năng tĩnh bắt được gì và KHÔNG bắt được gì?',
        dap: 'Nó chỉ bắt được những gì khai báo trong mã. Thứ tự đọc lộn xộn hay tiêu điểm nhảy lung tung vẫn lọt, nên nó lọc phần máy làm được chứ không thay được một lượt đi thật bằng trình đọc màn hình.',
      },
    ],
  },
]
