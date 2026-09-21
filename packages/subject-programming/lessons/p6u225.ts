// lessons/p6u225.ts — P6-U225: HƯỚNG DI ĐỘNG, chặng S4 — Bảo mật ứng dụng di động
// (module `mobile-s4-m4`).
//
// MÔ PHỎNG: bộ rà bí mật + chống rò dữ liệu, viết bằng TypeScript thuần, tất định. KHÔNG có
// khoá thật nào trong file này — mọi giá trị là chuỗi giả dùng để dạy luật rà. Việc dịch ngược
// gói cài thật của chính mình nằm ở bài tập về nhà.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U225_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u225-l1',
    unitId: 'p6-u225',
    language: 'typescript',
    title: 'Mọi thứ trong gói cài đều đọc được — kể cả "khoá bí mật"',
    hook: 'Một bạn sinh viên tải gói cài của app, giải nén, và trong mười phút tìm ra khoá API thanh toán nằm nguyên trong một hằng số tên là API_SECRET. Khoá đó dùng được thật, và nó đã ở đó suốt tám tháng.',
    theory:
      'Luật nền của bảo mật di động, ngắn và tuyệt đối: **gói cài nằm trên máy người dùng, nên mọi thứ trong đó đều đọc được**. Làm rối mã làm chậm người đọc lại vài giờ, không ngăn được ai. Mã hoá chuỗi trong app cũng vô ích vì khoá giải mã phải nằm ngay cạnh để app dùng được.\n\nHệ quả thẳng: app KHÔNG được chứa bí mật dùng được. Cái được phép nằm trong app chỉ gồm định danh công khai (khoá công khai, mã ứng dụng, địa chỉ máy chủ) — những thứ lộ ra cũng không cho ai làm được gì vì server vẫn kiểm quyền riêng. Mọi thao tác cần bí mật thật thì phải đi qua server của bạn: app gọi server, server giữ khoá và gọi tiếp bên thứ ba.\n\nĐiều này dẫn tới một luật rà rất cụ thể, đúng thứ bài này viết thành code: một mục cấu hình có **giá trị** khoá nằm trong gói là vi phạm; một mục chỉ có **tham chiếu** tới server (kiểu "hỏi server để lấy") thì hợp lệ. Bộ rà không cần hiểu ngữ nghĩa khoá, chỉ cần trả lời một câu: giá trị dùng được có nằm trong gói không.\n\nHai chỗ đáng cảnh báo riêng khi đọc code của bài:\n\n- Danh sách rỗng trả về **unknown**, không phải allow — không quét được mục nào nghĩa là bộ rà chưa chạy đúng chỗ, và báo "sạch" lúc đó chính là loại hỏng im lặng nguy hiểm nhất trong bảo mật.\n- Báo cáo nêu TÊN mục vi phạm nhưng TUYỆT ĐỐI không in giá trị. In ra để "dễ kiểm tra" là tự tay đẩy bí mật vào log của hệ thống ghi nhật ký — nơi nhiều người đọc được hơn hẳn mã nguồn.',
    workedExample: {
      code: `interface MucCauHinh {
  ten: string
  giaTriTrongGoi: string   // chuoi GIA de day luat ra, khong phai khoa that
  laThamChieuServer: boolean
}

function raBiMat(muc: MucCauHinh[]): string {
  // Khong quet duoc muc nao = chua chay dung cho, KHONG phai "sach".
  if (muc.length === 0) return "unknown: khong co muc cau hinh de ra"
  const viPham: string[] = []
  for (const m of muc) {
    if (!m.laThamChieuServer && m.giaTriTrongGoi.trim() !== "") viPham.push(m.ten)
  }
  // Neu ten muc, TUYET DOI khong in gia tri — log co nhieu nguoi doc hon ma nguon.
  if (viPham.length > 0) return "deny: bi mat nam trong goi o " + viPham.join(",")
  return "allow: khong co bi mat dung duoc trong goi"
}

const sach: MucCauHinh[] = [
  { ten: "api_base_url", giaTriTrongGoi: "https://api.vi-du", laThamChieuServer: true },
  { ten: "khoa_thanh_toan", giaTriTrongGoi: "", laThamChieuServer: true },
]
console.log(raBiMat(sach))
console.log(raBiMat([{ ten: "khoa_thanh_toan", giaTriTrongGoi: "gia-tri-gia", laThamChieuServer: false }]))
console.log(raBiMat([]))`,
      stdinLines: [],
    },
    predict: {
      code: `interface MucCauHinh {
  ten: string
  giaTriTrongGoi: string
  laThamChieuServer: boolean
}
function raBiMat(muc: MucCauHinh[]): string {
  if (muc.length === 0) return "unknown: khong co muc cau hinh de ra"
  const viPham: string[] = []
  for (const m of muc) {
    if (!m.laThamChieuServer && m.giaTriTrongGoi.trim() !== "") viPham.push(m.ten)
  }
  if (viPham.length > 0) return "deny: bi mat nam trong goi o " + viPham.join(",")
  return "allow: khong co bi mat dung duoc trong goi"
}
console.log(raBiMat([{ ten: "api_base_url", giaTriTrongGoi: "https://api.vi-du", laThamChieuServer: true }]))`,
      question: 'Mục này có giá trị trong gói nhưng là tham chiếu server. Kết quả là gì?',
      choices: [
        'allow: khong co bi mat dung duoc trong goi',
        'deny: bi mat nam trong goi o api_base_url',
        'unknown: khong co muc cau hinh de ra',
        'deny: bi mat nam trong goi o https://api.vi-du',
      ],
      answerIndex: 0,
      explain:
        'Địa chỉ máy chủ là định danh công khai: lộ ra cũng không cho ai làm được gì vì server vẫn kiểm quyền riêng. Để ý cả phương án cuối cùng — một báo cáo in ra GIÁ TRỊ thay vì tên mục chính là cách đẩy bí mật vào log, nơi nhiều người đọc được hơn mã nguồn.',
    },
    parsons: {
      prompt: 'Xếp lại bộ rà bí mật: chặn danh sách rỗng, gom tên mục vi phạm, rồi kết luận.',
      lines: [
        'function raBiMat(muc: MucCauHinh[]): string {',
        '  if (muc.length === 0) return "unknown: khong co muc cau hinh de ra"',
        '  const viPham: string[] = []',
        '  for (const m of muc) {',
        '    if (!m.laThamChieuServer && m.giaTriTrongGoi.trim() !== "") viPham.push(m.ten)',
        '  }',
        '  if (viPham.length > 0) return "deny: bi mat nam trong goi o " + viPham.join(",")',
        '  return "allow: khong co bi mat dung duoc trong goi"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết raBiMat(muc):\n\n1. mảng rỗng → "unknown: khong co muc cau hinh de ra"\n2. gom TÊN những mục KHÔNG phải tham chiếu server mà vẫn có giá trị (sau trim) trong gói, theo thứ tự xuất hiện\n3. có vi phạm → "deny: bi mat nam trong goi o " + các tên nối bằng dấu phẩy\n4. không có → "allow: khong co bi mat dung duoc trong goi"\n\nTUYỆT ĐỐI không in giá trị, chỉ in tên. Dùng starter code, đừng sửa phần dưới.',
      starterCode: `interface MucCauHinh {
  ten: string
  giaTriTrongGoi: string
  laThamChieuServer: boolean
}

function raBiMat(muc: MucCauHinh[]): string {
  // TODO: chan mang rong, gom TEN vi pham (khong gom gia tri), roi ket luan
  return "allow: khong co bi mat dung duoc trong goi"
}

// ---- Đừng sửa phần dưới đây ----
const sach: MucCauHinh[] = [
  { ten: "api_base_url", giaTriTrongGoi: "https://api.vi-du", laThamChieuServer: true },
  { ten: "khoa_thanh_toan", giaTriTrongGoi: "", laThamChieuServer: true },
]
console.log("Ca 1:", raBiMat(sach))
console.log("Ca 2:", raBiMat([{ ten: "khoa_thanh_toan", giaTriTrongGoi: "gia-tri-gia", laThamChieuServer: false }]))
console.log("Ca 3:", raBiMat([]))
console.log("Ca 4:", raBiMat([{ ten: "ma_ung_dung", giaTriTrongGoi: "app-123", laThamChieuServer: true }, { ten: "khoa_ky", giaTriTrongGoi: "x", laThamChieuServer: false }]))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: allow: khong co bi mat dung duoc trong goi',
          match: 'contains',
          hidden: false,
          label: 'Chỉ có định danh công khai và tham chiếu server: hợp lệ',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: deny: bi mat nam trong goi o khoa_thanh_toan',
          match: 'contains',
          hidden: false,
          label: 'Giá trị khoá nằm trong gói: chặn, và báo cáo chỉ nêu TÊN mục',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: unknown: khong co muc cau hinh de ra',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: không quét được mục nào thì không được báo sạch',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: khong co bi mat dung duoc trong goi\nCa 2: deny: bi mat nam trong goi o khoa_thanh_toan\nCa 3: unknown: khong co muc cau hinh de ra\nCa 4: deny: bi mat nam trong goi o khoa_ky',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: bốn ca, gồm danh sách trộn mục hợp lệ với mục vi phạm',
        },
      ],
      hints: [
        'Điều kiện vi phạm cần hai vế: KHÔNG phải tham chiếu server VÀ giá trị không rỗng.',
        'Ca 4 có một mục hợp lệ đứng trước một mục vi phạm — chỉ mục vi phạm được đưa vào báo cáo.',
        'Push m.ten chứ tuyệt đối đừng push m.giaTriTrongGoi, kể cả để gỡ lỗi.',
      ],
      sampleSolution: `interface MucCauHinh {
  ten: string
  giaTriTrongGoi: string
  laThamChieuServer: boolean
}

function raBiMat(muc: MucCauHinh[]): string {
  if (muc.length === 0) return "unknown: khong co muc cau hinh de ra"
  const viPham: string[] = []
  for (const m of muc) {
    if (!m.laThamChieuServer && m.giaTriTrongGoi.trim() !== "") viPham.push(m.ten)
  }
  if (viPham.length > 0) return "deny: bi mat nam trong goi o " + viPham.join(",")
  return "allow: khong co bi mat dung duoc trong goi"
}

// ---- Đừng sửa phần dưới đây ----
const sach: MucCauHinh[] = [
  { ten: "api_base_url", giaTriTrongGoi: "https://api.vi-du", laThamChieuServer: true },
  { ten: "khoa_thanh_toan", giaTriTrongGoi: "", laThamChieuServer: true },
]
console.log("Ca 1:", raBiMat(sach))
console.log("Ca 2:", raBiMat([{ ten: "khoa_thanh_toan", giaTriTrongGoi: "gia-tri-gia", laThamChieuServer: false }]))
console.log("Ca 3:", raBiMat([]))
console.log("Ca 4:", raBiMat([{ ten: "ma_ung_dung", giaTriTrongGoi: "app-123", laThamChieuServer: true }, { ten: "khoa_ky", giaTriTrongGoi: "x", laThamChieuServer: false }]))`,
    },
    homework:
      'Dịch ngược gói cài THẬT của chính app bạn (chỉ app của bạn, không của người khác): với Android giải nén tệp APK và xem phần tài nguyên cùng chuỗi trong mã; với iOS xem phần tài nguyên trong gói ứng dụng. Tìm mọi chuỗi trông như khoá. Với từng chuỗi tìm được, trả lời: nếu tôi cầm chuỗi này thì tôi làm được gì? Cái nào trả lời được bằng một việc có hại thì đó là lỗ hổng phải sửa ngay.',
    srsCards: [
      {
        hoi: 'Vì sao không được để bí mật dùng được trong gói cài?',
        dap: 'Vì gói cài nằm trên máy người dùng nên mọi thứ trong đó đều đọc được; làm rối mã chỉ làm chậm người đọc vài giờ, còn mã hoá chuỗi thì vô ích vì khoá giải mã phải nằm ngay cạnh để app dùng được.',
      },
      {
        hoi: 'Những giá trị nào được phép nằm trong app?',
        dap: 'Chỉ định danh công khai như khoá công khai, mã ứng dụng hay địa chỉ máy chủ — lộ ra cũng không cho ai làm được gì vì server vẫn kiểm quyền riêng. Thao tác cần bí mật thật thì đi qua server của mình.',
      },
      {
        hoi: 'Vì sao báo cáo rà bí mật chỉ được nêu tên mục, không in giá trị?',
        dap: 'Vì in giá trị ra là tự tay đẩy bí mật vào hệ thống ghi nhật ký, nơi nhiều người đọc được hơn hẳn mã nguồn — một chỗ rò mới sinh ra từ chính công cụ đi tìm chỗ rò.',
      },
    ],
  },
  {
    id: 'p6-u225-l2',
    unitId: 'p6-u225',
    language: 'typescript',
    title: 'Hai đường rò dữ liệu ít ai nhớ: ảnh chụp màn hình và bản sao lưu tự động',
    hook: 'App ngân hàng bảo mật rất kỹ: mã hoá, sinh trắc học, khoá phiên. Rồi người dùng bấm nút chuyển app, và màn hình số dư hiện nguyên trong khung xem trước đa nhiệm — cùng với ảnh chụp đó được hệ điều hành lưu lại trên đĩa.',
    theory:
      'Hai đường rò dưới đây không nằm trong mã bạn viết, mà nằm trong những việc hệ điều hành tự làm giúp bạn. Chính vì thế chúng hay bị bỏ quên.\n\n**1. Ảnh chụp màn hình khi chuyển app.** Để vẽ khung xem trước trong màn đa nhiệm, hệ điều hành chụp lại màn hình cuối cùng của app và LƯU ẢNH ĐÓ. Với màn hình chứa số dư, mã OTP, thông tin y tế thì bức ảnh ấy là một bản sao dữ liệu nhạy cảm nằm ngoài mọi lớp mã hoá của bạn. Cách xử lý: đánh dấu màn nhạy cảm là chống chụp màn (Android có cờ bảo mật cho cửa sổ; iOS thì che nội dung khi app rời trạng thái hoạt động).\n\n**2. Bản sao lưu tự động.** Cả hai hệ điều hành mặc định sao lưu dữ liệu app lên đám mây của người dùng. Rất tiện cho cài lại máy, và cũng rất tiện cho việc đưa dữ liệu nhạy cảm ra khỏi vùng bạn kiểm soát. Token, khoá, dữ liệu y tế phải được LOẠI TRỪ khỏi sao lưu một cách tường minh.\n\nBộ rà cuối chặng gộp cả ba luật của unit, và thứ tự phản ánh mức thiệt hại nếu lọt:\n\n1. không có mục nào để rà → **unknown**\n2. bí mật nằm trong gói → **deny** (ai cũng lấy được, không cần chạm vào máy nạn nhân)\n3. màn nhạy cảm không chống chụp màn → **deny** (cần chạm được máy)\n4. trường nhạy cảm nằm trong sao lưu → **deny** (cần chiếm được tài khoản đám mây)\n5. sạch cả ba → **allow**\n\nThứ tự đó chính là thứ tự "kẻ tấn công cần bao nhiêu công sức", và nó là cách xếp ưu tiên đáng dùng cho mọi danh sách lỗ hổng: sửa trước cái mà ai cũng khai thác được, không phải cái nghe đáng sợ nhất.',
    workedExample: {
      code: `interface HoSoBaoMat {
  soMucBiMatTrongGoi: number
  manNhayCamKhongChongChupMan: string[]
  truongNhayCamTrongBackup: string[]
  tongMucDaRa: number
}

function raBaoMat(h: HoSoBaoMat): string {
  if (h.tongMucDaRa === 0) return "unknown: bo ra chua quet duoc muc nao"
  // Thu tu = cong suc ke tan cong can bo ra, it nhat truoc.
  if (h.soMucBiMatTrongGoi > 0) return "deny: " + h.soMucBiMatTrongGoi + " bi mat nam trong goi"
  if (h.manNhayCamKhongChongChupMan.length > 0) return "deny: chua chong chup man o " + h.manNhayCamKhongChongChupMan.join(",")
  if (h.truongNhayCamTrongBackup.length > 0) return "deny: du lieu nhay cam trong backup o " + h.truongNhayCamTrongBackup.join(",")
  return "allow: ba duong ro deu da bit"
}

const tot: HoSoBaoMat = { soMucBiMatTrongGoi: 0, manNhayCamKhongChongChupMan: [], truongNhayCamTrongBackup: [], tongMucDaRa: 12 }
console.log(raBaoMat(tot))
console.log(raBaoMat({ ...tot, manNhayCamKhongChongChupMan: ["so-du", "otp"] }))
console.log(raBaoMat({ ...tot, truongNhayCamTrongBackup: ["refresh_token"] }))
console.log(raBaoMat({ ...tot, tongMucDaRa: 0 }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface HoSoBaoMat {
  soMucBiMatTrongGoi: number
  manNhayCamKhongChongChupMan: string[]
  truongNhayCamTrongBackup: string[]
  tongMucDaRa: number
}
function raBaoMat(h: HoSoBaoMat): string {
  if (h.tongMucDaRa === 0) return "unknown: bo ra chua quet duoc muc nao"
  if (h.soMucBiMatTrongGoi > 0) return "deny: " + h.soMucBiMatTrongGoi + " bi mat nam trong goi"
  if (h.manNhayCamKhongChongChupMan.length > 0) return "deny: chua chong chup man o " + h.manNhayCamKhongChongChupMan.join(",")
  if (h.truongNhayCamTrongBackup.length > 0) return "deny: du lieu nhay cam trong backup o " + h.truongNhayCamTrongBackup.join(",")
  return "allow: ba duong ro deu da bit"
}
console.log(raBaoMat({ soMucBiMatTrongGoi: 2, manNhayCamKhongChongChupMan: ["so-du"], truongNhayCamTrongBackup: ["refresh_token"], tongMucDaRa: 12 }))`,
      question: 'App dính cả ba đường rò cùng lúc. Báo cáo nêu đường nào trước?',
      choices: [
        'deny: 2 bi mat nam trong goi',
        'deny: chua chong chup man o so-du',
        'deny: du lieu nhay cam trong backup o refresh_token',
        'allow: ba duong ro deu da bit',
      ],
      answerIndex: 0,
      explain:
        'Bí mật trong gói đứng đầu vì nó là thứ AI CŨNG khai thác được — chỉ cần tải app về, không cần chạm vào máy nạn nhân hay chiếm tài khoản đám mây của họ. Xếp danh sách lỗ hổng theo công sức kẻ tấn công cần bỏ ra là cách ưu tiên đúng, thay vì theo cái nghe đáng sợ nhất.',
    },
    parsons: {
      prompt:
        'Xếp lại bộ rà cuối chặng: chưa quét được gì, rồi ba đường rò theo công sức tấn công tăng dần.',
      lines: [
        'function raBaoMat(h: HoSoBaoMat): string {',
        '  if (h.tongMucDaRa === 0) return "unknown: bo ra chua quet duoc muc nao"',
        '  if (h.soMucBiMatTrongGoi > 0) return "deny: " + h.soMucBiMatTrongGoi + " bi mat nam trong goi"',
        '  if (h.manNhayCamKhongChongChupMan.length > 0) return "deny: chua chong chup man o " + h.manNhayCamKhongChongChupMan.join(",")',
        '  if (h.truongNhayCamTrongBackup.length > 0) return "deny: du lieu nhay cam trong backup o " + h.truongNhayCamTrongBackup.join(",")',
        '  return "allow: ba duong ro deu da bit"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết raBaoMat(h) theo thứ tự:\n\n1. tongMucDaRa === 0 → "unknown: bo ra chua quet duoc muc nao"\n2. soMucBiMatTrongGoi > 0 → "deny: <số> bi mat nam trong goi"\n3. manNhayCamKhongChongChupMan không rỗng → "deny: chua chong chup man o " + tên nối bằng dấu phẩy\n4. truongNhayCamTrongBackup không rỗng → "deny: du lieu nhay cam trong backup o " + tên nối bằng dấu phẩy\n5. còn lại → "allow: ba duong ro deu da bit"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface HoSoBaoMat {
  soMucBiMatTrongGoi: number
  manNhayCamKhongChongChupMan: string[]
  truongNhayCamTrongBackup: string[]
  tongMucDaRa: number
}

function raBaoMat(h: HoSoBaoMat): string {
  // TODO: nam nhanh, xep theo cong suc ke tan cong can bo ra
  return "allow: ba duong ro deu da bit"
}

// ---- Đừng sửa phần dưới đây ----
const tot: HoSoBaoMat = { soMucBiMatTrongGoi: 0, manNhayCamKhongChongChupMan: [], truongNhayCamTrongBackup: [], tongMucDaRa: 12 }
console.log("Ca 1:", raBaoMat(tot))
console.log("Ca 2:", raBaoMat({ ...tot, manNhayCamKhongChongChupMan: ["so-du", "otp"] }))
console.log("Ca 3:", raBaoMat({ ...tot, truongNhayCamTrongBackup: ["refresh_token"] }))
console.log("Ca 4:", raBaoMat({ ...tot, soMucBiMatTrongGoi: 2, truongNhayCamTrongBackup: ["refresh_token"] }))
console.log("Ca 5:", raBaoMat({ ...tot, tongMucDaRa: 0 }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 2: deny: chua chong chup man o so-du,otp',
          match: 'contains',
          hidden: false,
          label: 'Màn nhạy cảm chưa chống chụp màn: ảnh xem trước là bản sao ngoài mọi lớp mã hoá',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: deny: du lieu nhay cam trong backup o refresh_token',
          match: 'contains',
          hidden: false,
          label: 'Token lọt vào sao lưu tự động: phải loại trừ tường minh',
        },
        {
          stdinLines: [],
          expected: 'Ca 5: unknown: bo ra chua quet duoc muc nao',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: bộ rà chưa quét được gì thì không được kết luận an toàn',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: ba duong ro deu da bit\nCa 2: deny: chua chong chup man o so-du,otp\nCa 3: deny: du lieu nhay cam trong backup o refresh_token\nCa 4: deny: 2 bi mat nam trong goi\nCa 5: unknown: bo ra chua quet duoc muc nao',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: năm ca, gồm ca dính hai đường rò cùng lúc',
        },
      ],
      hints: [
        'Kiểm mảng rỗng bằng .length > 0, nối tên bằng .join(",") không có khoảng trắng.',
        'Ca 4 dính hai đường rò: nhánh bí mật trong gói phải thắng vì nó cần ít công sức tấn công nhất.',
        'Ca 5 dùng tongMucDaRa bằng 0 — nhánh này phải đứng đầu, trước cả các nhánh deny.',
      ],
      sampleSolution: `interface HoSoBaoMat {
  soMucBiMatTrongGoi: number
  manNhayCamKhongChongChupMan: string[]
  truongNhayCamTrongBackup: string[]
  tongMucDaRa: number
}

function raBaoMat(h: HoSoBaoMat): string {
  if (h.tongMucDaRa === 0) return "unknown: bo ra chua quet duoc muc nao"
  if (h.soMucBiMatTrongGoi > 0) return "deny: " + h.soMucBiMatTrongGoi + " bi mat nam trong goi"
  if (h.manNhayCamKhongChongChupMan.length > 0) return "deny: chua chong chup man o " + h.manNhayCamKhongChongChupMan.join(",")
  if (h.truongNhayCamTrongBackup.length > 0) return "deny: du lieu nhay cam trong backup o " + h.truongNhayCamTrongBackup.join(",")
  return "allow: ba duong ro deu da bit"
}

// ---- Đừng sửa phần dưới đây ----
const tot: HoSoBaoMat = { soMucBiMatTrongGoi: 0, manNhayCamKhongChongChupMan: [], truongNhayCamTrongBackup: [], tongMucDaRa: 12 }
console.log("Ca 1:", raBaoMat(tot))
console.log("Ca 2:", raBaoMat({ ...tot, manNhayCamKhongChongChupMan: ["so-du", "otp"] }))
console.log("Ca 3:", raBaoMat({ ...tot, truongNhayCamTrongBackup: ["refresh_token"] }))
console.log("Ca 4:", raBaoMat({ ...tot, soMucBiMatTrongGoi: 2, truongNhayCamTrongBackup: ["refresh_token"] }))
console.log("Ca 5:", raBaoMat({ ...tot, tongMucDaRa: 0 }))`,
    },
    homework:
      'Mở một app ngân hàng hoặc ví điện tử tới màn số dư, rồi bấm nút chuyển app và nhìn khung xem trước trong màn đa nhiệm: số dư có hiện không? Làm tiếp với hai app khác nhau và so sánh. Rồi với app của bạn, liệt kê mọi màn hình cần chống chụp màn và mọi trường dữ liệu cần loại khỏi sao lưu tự động — viết thành danh sách kiểm trước khi phát hành.',
    srsCards: [
      {
        hoi: 'Vì sao màn hình nhạy cảm cần được đánh dấu chống chụp màn?',
        dap: 'Vì hệ điều hành tự chụp màn hình cuối của app để vẽ khung xem trước trong màn đa nhiệm và lưu ảnh đó lại, tạo ra một bản sao dữ liệu nhạy cảm nằm ngoài mọi lớp mã hoá của app.',
      },
      {
        hoi: 'Bản sao lưu tự động của hệ điều hành gây rủi ro gì?',
        dap: 'Nó mặc định đưa dữ liệu app lên đám mây của người dùng, nên token, khoá và dữ liệu y tế ra khỏi vùng mình kiểm soát nếu không được loại trừ khỏi sao lưu một cách tường minh.',
      },
      {
        hoi: 'Nên xếp thứ tự ưu tiên một danh sách lỗ hổng theo tiêu chí nào?',
        dap: 'Theo công sức kẻ tấn công cần bỏ ra: sửa trước thứ ai cũng khai thác được như bí mật nằm trong gói tải về, sau đó mới tới thứ cần chạm được máy nạn nhân hay chiếm được tài khoản đám mây.',
      },
    ],
  },
]
