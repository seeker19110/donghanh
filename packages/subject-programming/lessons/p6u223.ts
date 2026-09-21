// lessons/p6u223.ts — P6-U223: HƯỚNG DI ĐỘNG, chặng S4 — Quan sát từ xa
// (module `mobile-s4-m2`).
//
// MÔ PHỎNG: bộ giải mã stack trace + cờ tính năng viết bằng TypeScript thuần, tất định. Không
// gọi dịch vụ thu thập sự cố thật, không tải cấu hình từ xa thật. Việc bật thu thập sự cố trên
// bản phát hành và tạo một sự cố cố ý nằm ở bài tập về nhà.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U223_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u223-l1',
    unitId: 'p6-u223',
    language: 'typescript',
    title: 'Stack trace đã làm rối mã: không có bản đồ giải mã thì đừng đoán',
    hook: 'Bảng theo dõi sự cố hiện 4.000 lần sập ở hàm tên "a.b.c". Một người trong đội nói "chắc là màn thanh toán". Đội sửa màn thanh toán suốt hai ngày. Lỗi thật nằm ở bộ đồng bộ danh bạ.',
    theory:
      'Bản phát hành của app di động luôn được LÀM RỐI MÃ (obfuscate): tên lớp, tên hàm, tên biến bị thay bằng ký tự ngắn để gói nhẹ hơn và khó dịch ngược hơn. Cái giá phải trả là mọi stack trace gửi về đều vô nghĩa với người đọc.\n\nCầu nối là **bản đồ giải mã** — tệp ánh xạ tên rối về tên gốc, sinh ra lúc build. Quy tắc vận hành quan trọng nhất và cũng hay bị quên nhất: bản đồ đó phải được LƯU LẠI THEO TỪNG BẢN BUILD, ngay lúc build. Build lại cùng mã nguồn có thể cho bản đồ khác, nên mất bản đồ của một bản đã phát nghĩa là mọi sự cố từ bản đó vĩnh viễn không đọc được.\n\nLuật của bài, và là nội dung chính: không có bản đồ thì trả về **unresolved**, TUYỆT ĐỐI không đoán tên hàm. Đoán ở đây tệ hơn im lặng vì nó tạo ra một manh mối trông như thật, và cả đội sẽ đi theo nó — đúng câu chuyện ở phần mở đầu. Một dòng "không giải mã được" trung thực dẫn người ta đi tìm bản đồ; một cái tên đoán bừa dẫn người ta đi sửa nhầm chỗ.\n\nPhép giải mã tự nó rất đơn giản: tra từng khung trong stack trace qua bản đồ. Điểm thiết kế đáng chú ý là khi bản đồ CÓ nhưng THIẾU một khung cụ thể — lúc đó giữ nguyên tên rối cho khung đó và đánh dấu rõ, thay vì bỏ khung đi. Bỏ khung làm stack trace ngắn lại và người đọc sẽ hiểu sai luồng gọi; giữ lại tên rối thì ít nhất họ biết chỗ đó có một khung chưa tra được.',
    workedExample: {
      code: `interface BanDo {
  [tenRoi: string]: string
}

function giaiMa(khung: string[], banDo: BanDo): string {
  if (khung.length === 0) return "invalid: stack trace rong"
  // Khong co ban do thi NOI THANG, dung doan ten ham.
  if (Object.keys(banDo).length === 0) return "unresolved: thieu ban do giai ma"
  const ten: string[] = []
  for (const k of khung) {
    // Thieu mot khung thi giu nguyen ten roi + danh dau, KHONG bo khung di.
    const goc: string | undefined = banDo[k]
    ten.push(goc === undefined ? k + "(?)" : goc)
  }
  return "allow: " + ten.join(" > ")
}

const banDo: BanDo = { "a.b.c": "DanhBaSync.doiChieu", "d.e": "MangClient.goi" }
console.log(giaiMa(["a.b.c", "d.e"], banDo))
console.log(giaiMa(["a.b.c", "x.y"], banDo))
console.log(giaiMa(["a.b.c"], {}))
console.log(giaiMa([], banDo))`,
      stdinLines: [],
    },
    predict: {
      code: `interface BanDo {
  [tenRoi: string]: string
}
function giaiMa(khung: string[], banDo: BanDo): string {
  if (khung.length === 0) return "invalid: stack trace rong"
  if (Object.keys(banDo).length === 0) return "unresolved: thieu ban do giai ma"
  const ten: string[] = []
  for (const k of khung) {
    const goc: string | undefined = banDo[k]
    ten.push(goc === undefined ? k + "(?)" : goc)
  }
  return "allow: " + ten.join(" > ")
}
console.log(giaiMa(["a.b.c", "x.y"], { "a.b.c": "DanhBaSync.doiChieu" }))`,
      question: 'Bản đồ có khung đầu nhưng thiếu khung "x.y". In ra gì?',
      choices: [
        'allow: DanhBaSync.doiChieu > x.y(?)',
        'allow: chi con khung DanhBaSync.doiChieu (bo khung khong tra duoc)',
        'unresolved: thieu ban do giai ma',
        'invalid: stack trace rong',
      ],
      answerIndex: 0,
      explain:
        'Khung tra được thì thay bằng tên gốc, khung không tra được thì giữ nguyên tên rối kèm dấu hỏi. Bỏ hẳn khung đó đi (phương án thứ hai) sẽ làm stack trace ngắn lại và người đọc hiểu sai luồng gọi — mất thông tin còn tệ hơn hiển thị một cái tên xấu.',
    },
    parsons: {
      prompt:
        'Xếp lại bộ giải mã: chặn stack rỗng, chặn thiếu bản đồ, rồi tra từng khung và nối lại.',
      lines: [
        'function giaiMa(khung: string[], banDo: BanDo): string {',
        '  if (khung.length === 0) return "invalid: stack trace rong"',
        '  if (Object.keys(banDo).length === 0) return "unresolved: thieu ban do giai ma"',
        '  const ten: string[] = []',
        '  for (const k of khung) {',
        '    const goc: string | undefined = banDo[k]',
        '    ten.push(goc === undefined ? k + "(?)" : goc)',
        '  }',
        '  return "allow: " + ten.join(" > ")',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết giaiMa(khung, banDo):\n\n1. khung rỗng → "invalid: stack trace rong"\n2. bản đồ rỗng (Object.keys(banDo).length === 0) → "unresolved: thieu ban do giai ma"\n3. tra từng khung: có trong bản đồ thì lấy tên gốc, không có thì giữ tên rối và thêm "(?)" vào cuối\n4. trả về "allow: " + các tên nối bằng " > "\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface BanDo {
  [tenRoi: string]: string
}

function giaiMa(khung: string[], banDo: BanDo): string {
  // TODO: chan rong, chan thieu ban do, roi tra tung khung
  return "allow: "
}

// ---- Đừng sửa phần dưới đây ----
const banDo: BanDo = { "a.b.c": "DanhBaSync.doiChieu", "d.e": "MangClient.goi" }
console.log("Ca 1:", giaiMa(["a.b.c", "d.e"], banDo))
console.log("Ca 2:", giaiMa(["a.b.c", "x.y"], banDo))
console.log("Ca 3:", giaiMa(["a.b.c"], {}))
console.log("Ca 4:", giaiMa([], banDo))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: allow: DanhBaSync.doiChieu > MangClient.goi',
          match: 'contains',
          hidden: false,
          label: 'Tra được cả hai khung: đọc ra tên gốc',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: unresolved: thieu ban do giai ma',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: không có bản đồ thì nói thẳng, cấm đoán tên hàm',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: allow: DanhBaSync.doiChieu > x.y(?)',
          match: 'contains',
          hidden: false,
          label: 'Thiếu một khung: giữ tên rối kèm dấu hỏi, không bỏ khung',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: DanhBaSync.doiChieu > MangClient.goi\nCa 2: allow: DanhBaSync.doiChieu > x.y(?)\nCa 3: unresolved: thieu ban do giai ma\nCa 4: invalid: stack trace rong',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: cả bốn đường ra của bộ giải mã',
        },
      ],
      hints: [
        'Lấy giá trị bằng banDo[k] rồi so với undefined — khung không có trong bản đồ sẽ cho undefined.',
        'Nối kết quả bằng ten.join(" > ") với đúng khoảng trắng hai bên dấu lớn hơn.',
        'Object.keys(banDo).length đếm số cặp trong bản đồ; bằng 0 nghĩa là bản đồ rỗng.',
      ],
      sampleSolution: `interface BanDo {
  [tenRoi: string]: string
}

function giaiMa(khung: string[], banDo: BanDo): string {
  if (khung.length === 0) return "invalid: stack trace rong"
  if (Object.keys(banDo).length === 0) return "unresolved: thieu ban do giai ma"
  const ten: string[] = []
  for (const k of khung) {
    const goc: string | undefined = banDo[k]
    ten.push(goc === undefined ? k + "(?)" : goc)
  }
  return "allow: " + ten.join(" > ")
}

// ---- Đừng sửa phần dưới đây ----
const banDo: BanDo = { "a.b.c": "DanhBaSync.doiChieu", "d.e": "MangClient.goi" }
console.log("Ca 1:", giaiMa(["a.b.c", "d.e"], banDo))
console.log("Ca 2:", giaiMa(["a.b.c", "x.y"], banDo))
console.log("Ca 3:", giaiMa(["a.b.c"], {}))
console.log("Ca 4:", giaiMa([], banDo))`,
    },
    homework:
      'Bật thu thập sự cố (Crashlytics, Sentry hoặc tương đương) cho một bản build phát hành của app bạn. Tạo một sự cố CỐ Ý (một nút gây lỗi, để trong màn ẩn), cài bản đó lên máy thật và bấm. Xác nhận sự cố hiện lên bảng theo dõi, và quan trọng hơn: xác nhận tên hàm hiện ra là tên GỐC chứ không phải tên rối. Nếu là tên rối, bạn chưa tải bản đồ giải mã lên.',
    srsCards: [
      {
        hoi: 'Vì sao stack trace của bản phát hành lại không đọc được?',
        dap: 'Vì bản phát hành được làm rối mã: tên lớp, hàm, biến bị thay bằng ký tự ngắn để gói nhẹ và khó dịch ngược hơn, nên mọi khung gửi về đều mang tên vô nghĩa với người đọc.',
      },
      {
        hoi: 'Quy tắc vận hành nào về bản đồ giải mã hay bị quên nhất?',
        dap: 'Phải lưu bản đồ theo từng bản build ngay lúc build, vì build lại cùng mã nguồn có thể cho bản đồ khác. Mất bản đồ của một bản đã phát nghĩa là mọi sự cố từ bản đó vĩnh viễn không đọc được.',
      },
      {
        hoi: 'Vì sao đoán tên hàm khi thiếu bản đồ còn tệ hơn im lặng?',
        dap: 'Vì cái tên đoán ra trông như một manh mối thật và cả đội sẽ đi theo nó, có khi sửa nhầm chỗ mất nhiều ngày. Một dòng nói thẳng là không giải mã được sẽ dẫn người ta đi tìm bản đồ.',
      },
    ],
  },
  {
    id: 'p6-u223-l2',
    unitId: 'p6-u223',
    language: 'typescript',
    title: 'Cờ tính năng: tắt được từ xa, và fail closed khi không lấy được cấu hình',
    hook: 'Tính năng mới gây sập 9% phiên. Đội có cờ tính năng nên chỉ cần tắt từ xa là xong — nhưng máy nào không tải được cấu hình lại mặc định BẬT mọi cờ. Với đúng những người mạng kém, tính năng hỏng vẫn chạy.',
    theory:
      'Cờ tính năng (feature flag) là cách duy nhất để tắt một tính năng trên app ĐÃ CÀI mà không chờ chợ ứng dụng duyệt bản vá. Nó biến một sự cố kéo dài hai ngày thành một sự cố kéo dài hai phút — nếu được thiết kế đúng.\n\nHai luật làm nên phần "nếu được thiết kế đúng" đó:\n\n**1. Giá trị mặc định phải là giá trị AN TOÀN, nhúng sẵn trong app.** Khi không lấy được cấu hình từ xa (mạng hỏng, dịch vụ cấu hình sập, người dùng vừa cài xong chưa kịp đồng bộ), app phải dùng giá trị an toàn đã khai trong chính gói cài, chứ không bật bừa mọi thứ. Trong bài đây là nhánh **use-safe-default**. Nhánh này đứng ĐẦU vì khi chưa đọc được cấu hình thì mọi ngưỡng trong đó cũng không đọc được — phán gì cũng là phán dựa trên số không có.\n\n**2. Tự tắt theo ngưỡng.** Nối cờ với số liệu sự cố: tỉ lệ crash vượt ngưỡng đã cấu hình thì tự tắt cờ, không chờ người trực dậy. Đây là nhánh **auto-disable-flag**, và nó là lý do cờ tính năng đáng làm: giá trị của nó nằm ở tốc độ phản ứng, mà tốc độ thì máy nhanh hơn người.\n\nThứ tự đầy đủ của hàm:\n\n1. không lấy được cấu hình → **use-safe-default**\n2. ngưỡng crash chưa cấu hình → **unknown**\n3. tỉ lệ crash vượt ngưỡng → **auto-disable-flag**\n4. còn lại → **allow**\n\nMột điều đáng nhớ cuối cùng: "giá trị an toàn" không phải lúc nào cũng là tắt. Với một cờ bật tính năng mới thì an toàn là tắt; với một cờ kiểu "dùng máy chủ dự phòng" thì an toàn có thể là bật. Cho nên giá trị an toàn phải được KHAI RÕ cho từng cờ ngay lúc tạo cờ, chứ không suy ra theo một quy tắc chung — suy ra là chỗ sinh ra đúng loại lỗi ở phần mở đầu bài.',
    workedExample: {
      code: `interface CauHinhCo {
  layDuocCauHinh: boolean
  giaTriAnToan: boolean   // KHAI RO cho tung co, khong suy ra theo quy tac chung
  tiLeCrash: number
  nguongCrash: number
}

function quyetDinhCo(c: CauHinhCo): string {
  // Chua doc duoc cau hinh thi moi nguong ben trong cung chua doc duoc.
  if (!c.layDuocCauHinh) return "use-safe-default: dung gia tri an toan " + c.giaTriAnToan
  if (c.nguongCrash <= 0) return "unknown: chua cau hinh nguong crash"
  if (c.tiLeCrash > c.nguongCrash) return "auto-disable-flag: crash " + c.tiLeCrash + "% vuot nguong"
  return "allow: giu nguyen trang thai co"
}

const tot: CauHinhCo = { layDuocCauHinh: true, giaTriAnToan: false, tiLeCrash: 0.2, nguongCrash: 1 }
console.log(quyetDinhCo(tot))
console.log(quyetDinhCo({ ...tot, tiLeCrash: 9 }))
console.log(quyetDinhCo({ ...tot, layDuocCauHinh: false }))
console.log(quyetDinhCo({ ...tot, nguongCrash: 0 }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface CauHinhCo {
  layDuocCauHinh: boolean
  giaTriAnToan: boolean
  tiLeCrash: number
  nguongCrash: number
}
function quyetDinhCo(c: CauHinhCo): string {
  if (!c.layDuocCauHinh) return "use-safe-default: dung gia tri an toan " + c.giaTriAnToan
  if (c.nguongCrash <= 0) return "unknown: chua cau hinh nguong crash"
  if (c.tiLeCrash > c.nguongCrash) return "auto-disable-flag: crash " + c.tiLeCrash + "% vuot nguong"
  return "allow: giu nguyen trang thai co"
}
console.log(quyetDinhCo({ layDuocCauHinh: false, giaTriAnToan: false, tiLeCrash: 9, nguongCrash: 1 }))`,
      question: 'Không lấy được cấu hình, mà tỉ lệ crash cũng đang rất cao. In ra gì?',
      choices: [
        'use-safe-default: dung gia tri an toan false',
        'auto-disable-flag: crash 9% vuot nguong',
        'unknown: chua cau hinh nguong crash',
        'allow: giu nguyen trang thai co',
      ],
      answerIndex: 0,
      explain:
        'Nhánh an toàn đứng đầu và trả về ngay. Lý do không chỉ là thứ tự: khi không đọc được cấu hình thì ngưỡng crash trong cấu hình đó cũng không đáng tin, nên so sánh với nó là so với một con số không có cơ sở. Rơi về giá trị an toàn đã nhúng sẵn là hành động duy nhất còn chắc chắn.',
    },
    parsons: {
      prompt:
        'Xếp lại quyết định cờ: rơi về giá trị an toàn trước, rồi chặn thiếu ngưỡng, rồi tự tắt theo số liệu.',
      lines: [
        'function quyetDinhCo(c: CauHinhCo): string {',
        '  if (!c.layDuocCauHinh) return "use-safe-default: dung gia tri an toan " + c.giaTriAnToan',
        '  if (c.nguongCrash <= 0) return "unknown: chua cau hinh nguong crash"',
        '  if (c.tiLeCrash > c.nguongCrash) return "auto-disable-flag: crash " + c.tiLeCrash + "% vuot nguong"',
        '  return "allow: giu nguyen trang thai co"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết quyetDinhCo(c) theo thứ tự:\n\n1. không layDuocCauHinh → "use-safe-default: dung gia tri an toan <giaTriAnToan>"\n2. nguongCrash <= 0 → "unknown: chua cau hinh nguong crash"\n3. tiLeCrash > nguongCrash → "auto-disable-flag: crash <số>% vuot nguong"\n4. còn lại → "allow: giu nguyen trang thai co"\n\nNối boolean vào chuỗi bằng dấu cộng sẽ ra "true"/"false". Dùng starter code, đừng sửa phần dưới.',
      starterCode: `interface CauHinhCo {
  layDuocCauHinh: boolean
  giaTriAnToan: boolean
  tiLeCrash: number
  nguongCrash: number
}

function quyetDinhCo(c: CauHinhCo): string {
  // TODO: bon nhanh, nhanh an toan dung DAU TIEN
  return "allow: giu nguyen trang thai co"
}

// ---- Đừng sửa phần dưới đây ----
const tot: CauHinhCo = { layDuocCauHinh: true, giaTriAnToan: false, tiLeCrash: 0.2, nguongCrash: 1 }
console.log("Ca 1:", quyetDinhCo(tot))
console.log("Ca 2:", quyetDinhCo({ ...tot, tiLeCrash: 9 }))
console.log("Ca 3:", quyetDinhCo({ ...tot, layDuocCauHinh: false }))
console.log("Ca 4:", quyetDinhCo({ ...tot, layDuocCauHinh: false, giaTriAnToan: true }))
console.log("Ca 5:", quyetDinhCo({ ...tot, nguongCrash: 0 }))
console.log("Ca 6:", quyetDinhCo({ ...tot, tiLeCrash: 1 }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 2: auto-disable-flag: crash 9% vuot nguong',
          match: 'contains',
          hidden: false,
          label: 'Crash vượt ngưỡng: tự tắt cờ, không chờ người trực',
        },
        {
          stdinLines: [],
          expected: 'Ca 4: use-safe-default: dung gia tri an toan true',
          match: 'contains',
          hidden: false,
          label: 'Giá trị an toàn không phải lúc nào cũng là tắt — cờ này an toàn khi bật',
        },
        {
          stdinLines: [],
          expected: 'Ca 5: unknown: chua cau hinh nguong crash',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: ngưỡng chưa cấu hình thì không kết luận cờ đang an toàn',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: giu nguyen trang thai co\nCa 2: auto-disable-flag: crash 9% vuot nguong\nCa 3: use-safe-default: dung gia tri an toan false\nCa 4: use-safe-default: dung gia tri an toan true\nCa 5: unknown: chua cau hinh nguong crash\nCa 6: allow: giu nguyen trang thai co',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: sáu ca, gồm hai giá trị an toàn khác nhau',
        },
      ],
      hints: [
        'Ca 3 và Ca 4 chỉ khác giá trị an toàn: giá trị đó được KHAI cho từng cờ, hàm chỉ việc dùng lại chứ không tự quyết.',
        'Ca 6 có tỉ lệ crash đúng bằng ngưỡng: điều kiện là > nên nó chưa bị tắt.',
        'Nối boolean vào chuỗi bằng dấu cộng, JavaScript tự chuyển thành "true" hoặc "false".',
      ],
      sampleSolution: `interface CauHinhCo {
  layDuocCauHinh: boolean
  giaTriAnToan: boolean
  tiLeCrash: number
  nguongCrash: number
}

function quyetDinhCo(c: CauHinhCo): string {
  if (!c.layDuocCauHinh) return "use-safe-default: dung gia tri an toan " + c.giaTriAnToan
  if (c.nguongCrash <= 0) return "unknown: chua cau hinh nguong crash"
  if (c.tiLeCrash > c.nguongCrash) return "auto-disable-flag: crash " + c.tiLeCrash + "% vuot nguong"
  return "allow: giu nguyen trang thai co"
}

// ---- Đừng sửa phần dưới đây ----
const tot: CauHinhCo = { layDuocCauHinh: true, giaTriAnToan: false, tiLeCrash: 0.2, nguongCrash: 1 }
console.log("Ca 1:", quyetDinhCo(tot))
console.log("Ca 2:", quyetDinhCo({ ...tot, tiLeCrash: 9 }))
console.log("Ca 3:", quyetDinhCo({ ...tot, layDuocCauHinh: false }))
console.log("Ca 4:", quyetDinhCo({ ...tot, layDuocCauHinh: false, giaTriAnToan: true }))
console.log("Ca 5:", quyetDinhCo({ ...tot, nguongCrash: 0 }))
console.log("Ca 6:", quyetDinhCo({ ...tot, tiLeCrash: 1 }))`,
    },
    homework:
      'Chọn một tính năng trong app bạn đang làm và thiết kế cờ cho nó trên giấy: tên cờ, giá trị an toàn là gì và VÌ SAO, ngưỡng tự tắt là con số nào, ai được đổi cờ. Rồi trả lời câu khó nhất: khi cờ tắt giữa chừng, dữ liệu mà tính năng đó đã ghi dở xử lý thế nào? Tắt cờ không tự dọn dữ liệu — đó là phần người ta hay quên.',
    srsCards: [
      {
        hoi: 'Cờ tính năng giải quyết vấn đề gì riêng của app di động?',
        dap: 'Nó cho phép tắt một tính năng trên app ĐÃ CÀI mà không chờ chợ ứng dụng duyệt bản vá, biến một sự cố kéo dài hai ngày thành sự cố kéo dài hai phút.',
      },
      {
        hoi: 'Khi không lấy được cấu hình từ xa thì app phải làm gì?',
        dap: 'Dùng giá trị an toàn đã nhúng sẵn trong gói cài, không bật bừa mọi cờ. Chưa đọc được cấu hình thì các ngưỡng bên trong cũng không đáng tin, nên rơi về giá trị an toàn là hành động duy nhất còn chắc chắn.',
      },
      {
        hoi: 'Vì sao giá trị an toàn phải khai riêng cho từng cờ?',
        dap: 'Vì nó không phải lúc nào cũng là tắt: cờ bật tính năng mới thì an toàn là tắt, còn cờ chuyển sang máy chủ dự phòng thì an toàn có thể là bật. Suy ra theo một quy tắc chung là chỗ sinh lỗi.',
      },
    ],
  },
]
