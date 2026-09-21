// lessons/p6u219.ts — P6-U219: HƯỚNG DI ĐỘNG, chặng S3 — Pin, bộ nhớ, dung lượng
// (module `mobile-s3-m2`).
//
// MÔ PHỎNG: bộ rà tài nguyên viết bằng TypeScript thuần, tất định. Không gọi WorkManager /
// BackgroundTasks thật, không đo pin thật. Việc đo mức pin tiêu thụ khi app chạy nền một giờ
// trên thiết bị nằm ở bài tập về nhà.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U219_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u219-l1',
    unitId: 'p6-u219',
    language: 'typescript',
    title: 'Công việc nền: để hệ điều hành xếp lịch, đừng tự hẹn giờ',
    hook: 'App đồng bộ dữ liệu mỗi 60 giây bằng bộ hẹn giờ tự viết. Trên giấy tờ thì "gần như thời gian thực". Trên máy người dùng thì pin tụt 18% mỗi đêm, và app xuất hiện đầu bảng "ứng dụng hao pin" của hệ thống — chỗ dẫn thẳng tới nút Gỡ cài đặt.',
    theory:
      'Nguồn hao pin lớn nhất của app di động hiếm khi là tính toán. Nó là ĐÁNH THỨC: mỗi lần app bật dậy, bộ xử lý rời trạng thái ngủ sâu, sóng di động bật lên, và cái giá đó phải trả đủ dù app chỉ làm một việc nửa giây.\n\nVì vậy cả Android lẫn iOS đều chuyển sang cùng một mô hình: app KHÔNG tự quyết chạy lúc nào. App khai báo "tôi cần làm việc này, cần mạng, cần đang sạc" rồi giao cho hệ điều hành — WorkManager trên Android, BackgroundTasks trên iOS. Hệ điều hành gom việc của nhiều app lại, chạy chúng trong cùng một lần đánh thức, ưu tiên lúc máy đang sạc và có wifi. Một lần đánh thức phục vụ mười app thay vì mười lần đánh thức.\n\nTự hẹn giờ riêng phá đúng cơ chế đó, nên trong bộ rà của bài nó là **deny** thẳng — không phải cảnh báo. Lý do xếp vào nhóm chặn: hậu quả rơi lên người dùng (pin) chứ không rơi lên đội phát triển, và nó không lộ ra ở máy dev đang cắm sạc.\n\nCó một ngoại lệ đáng nhớ: việc PHẢI đúng giờ vì người dùng đã hẹn (báo thức, nhắc uống thuốc) thì dùng cơ chế báo thức chính xác của hệ điều hành, và trên Android hiện đại nó cần quyền riêng. Ngoại lệ đó hẹp: "dữ liệu phải mới" không phải là đúng giờ — nó là mong muốn của lập trình viên, không phải lời hứa với người dùng.\n\nBộ rà của bài xét ba nguồn hao theo thứ tự: cơ chế nền sai → **deny**; rò bộ nhớ → **leak**; gói cài quá nặng → **oversize**; sạch cả ba → **allow**. Xếp cơ chế nền trước vì nó là thứ duy nhất trong ba cái có thể làm app bị hệ điều hành hạn chế chạy nền — tức là hỏng luôn cả tính năng, không chỉ tốn pin.',
    workedExample: {
      code: `type CoCheNen = "workmanager" | "backgroundtasks" | "hen-gio-rieng"

interface HoSoTaiNguyen {
  coCheNen: CoCheNen
  allocationConSong: number  // so doi tuong con song sau khi man dong
  dungLuongMb: number
  nguongMb: number
}

function raTaiNguyen(h: HoSoTaiNguyen): string {
  if (h.nguongMb <= 0) return "unknown: chua cau hinh nguong dung luong"
  // Tu hen gio pha co che gom viec cua he dieu hanh -> chan, khong phai canh bao.
  if (h.coCheNen === "hen-gio-rieng") return "deny: tu hen gio rieng, hao pin"
  if (h.allocationConSong > 0) return "leak: con " + h.allocationConSong + " doi tuong song"
  if (h.dungLuongMb > h.nguongMb) return "oversize: goi " + h.dungLuongMb + "MB vuot nguong"
  return "allow: ba nguon hao deu dat"
}

const tot: HoSoTaiNguyen = { coCheNen: "workmanager", allocationConSong: 0, dungLuongMb: 40, nguongMb: 60 }
console.log(raTaiNguyen(tot))
console.log(raTaiNguyen({ ...tot, coCheNen: "hen-gio-rieng" }))
console.log(raTaiNguyen({ ...tot, allocationConSong: 3 }))
console.log(raTaiNguyen({ ...tot, dungLuongMb: 95 }))`,
      stdinLines: [],
    },
    predict: {
      code: `type CoCheNen = "workmanager" | "backgroundtasks" | "hen-gio-rieng"
interface HoSoTaiNguyen {
  coCheNen: CoCheNen
  allocationConSong: number
  dungLuongMb: number
  nguongMb: number
}
function raTaiNguyen(h: HoSoTaiNguyen): string {
  if (h.nguongMb <= 0) return "unknown: chua cau hinh nguong dung luong"
  if (h.coCheNen === "hen-gio-rieng") return "deny: tu hen gio rieng, hao pin"
  if (h.allocationConSong > 0) return "leak: con " + h.allocationConSong + " doi tuong song"
  if (h.dungLuongMb > h.nguongMb) return "oversize: goi " + h.dungLuongMb + "MB vuot nguong"
  return "allow: ba nguon hao deu dat"
}
console.log(raTaiNguyen({ coCheNen: "backgroundtasks", allocationConSong: 3, dungLuongMb: 95, nguongMb: 60 }))`,
      question: 'App vừa rò bộ nhớ vừa quá nặng, nhưng cơ chế nền đúng chuẩn. In ra gì?',
      choices: [
        'leak: con 3 doi tuong song',
        'oversize: goi 95MB vuot nguong',
        'deny: tu hen gio rieng, hao pin',
        'allow: ba nguon hao deu dat',
      ],
      answerIndex: 0,
      explain:
        'Cơ chế nền hợp lệ nên nhánh deny không khớp; nhánh leak đứng trước nhánh oversize nên nó thắng. Thứ tự ấy có lý do: rò bộ nhớ làm app bị hệ điều hành giết giữa chừng, còn gói nặng chỉ làm người ta ngại tải — một cái hỏng khi đang dùng, một cái hỏng trước khi dùng.',
    },
    parsons: {
      prompt:
        'Xếp lại bộ rà tài nguyên: chặn ngưỡng chưa cấu hình, rồi cơ chế nền, rồi rò bộ nhớ, rồi dung lượng.',
      lines: [
        'function raTaiNguyen(h: HoSoTaiNguyen): string {',
        '  if (h.nguongMb <= 0) return "unknown: chua cau hinh nguong dung luong"',
        '  if (h.coCheNen === "hen-gio-rieng") return "deny: tu hen gio rieng, hao pin"',
        '  if (h.allocationConSong > 0) return "leak: con " + h.allocationConSong + " doi tuong song"',
        '  if (h.dungLuongMb > h.nguongMb) return "oversize: goi " + h.dungLuongMb + "MB vuot nguong"',
        '  return "allow: ba nguon hao deu dat"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết raTaiNguyen(h) theo thứ tự:\n\n1. nguongMb <= 0 → "unknown: chua cau hinh nguong dung luong"\n2. coCheNen là "hen-gio-rieng" → "deny: tu hen gio rieng, hao pin"\n3. allocationConSong > 0 → "leak: con <số> doi tuong song"\n4. dungLuongMb > nguongMb → "oversize: goi <số>MB vuot nguong"\n5. còn lại → "allow: ba nguon hao deu dat"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `type CoCheNen = "workmanager" | "backgroundtasks" | "hen-gio-rieng"

interface HoSoTaiNguyen {
  coCheNen: CoCheNen
  allocationConSong: number
  dungLuongMb: number
  nguongMb: number
}

function raTaiNguyen(h: HoSoTaiNguyen): string {
  // TODO: nam nhanh theo dung thu tu
  return "allow: ba nguon hao deu dat"
}

// ---- Đừng sửa phần dưới đây ----
const tot: HoSoTaiNguyen = { coCheNen: "workmanager", allocationConSong: 0, dungLuongMb: 40, nguongMb: 60 }
console.log("Ca 1:", raTaiNguyen(tot))
console.log("Ca 2:", raTaiNguyen({ ...tot, coCheNen: "hen-gio-rieng" }))
console.log("Ca 3:", raTaiNguyen({ ...tot, allocationConSong: 3 }))
console.log("Ca 4:", raTaiNguyen({ ...tot, dungLuongMb: 95 }))
console.log("Ca 5:", raTaiNguyen({ ...tot, dungLuongMb: 60 }))
console.log("Ca 6:", raTaiNguyen({ ...tot, nguongMb: 0 }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 2: deny: tu hen gio rieng, hao pin',
          match: 'contains',
          hidden: false,
          label: 'Tự hẹn giờ riêng: chặn, vì nó phá cơ chế gom việc của hệ điều hành',
        },
        {
          stdinLines: [],
          expected: 'Ca 5: allow: ba nguon hao deu dat',
          match: 'contains',
          hidden: false,
          label: 'Ca biên: dung lượng đúng bằng ngưỡng vẫn đạt',
        },
        {
          stdinLines: [],
          expected: 'Ca 6: unknown: chua cau hinh nguong dung luong',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: ngưỡng chưa cấu hình thì không kết luận đạt',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: ba nguon hao deu dat\nCa 2: deny: tu hen gio rieng, hao pin\nCa 3: leak: con 3 doi tuong song\nCa 4: oversize: goi 95MB vuot nguong\nCa 5: allow: ba nguon hao deu dat\nCa 6: unknown: chua cau hinh nguong dung luong',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: cả sáu ca, gồm hai ca đạt khác nhau',
        },
      ],
      hints: [
        'So sánh chuỗi cơ chế bằng === với đúng giá trị "hen-gio-rieng" — hai giá trị còn lại đều hợp lệ.',
        'Ca 5 dùng dung lượng đúng bằng ngưỡng: dấu > chứ không phải >=, nếu không bản build vừa đủ chuẩn sẽ bị báo quá nặng.',
        'Nhánh unknown đứng đầu vì không có ngưỡng thì câu hỏi "quá nặng chưa" không có câu trả lời nào đúng.',
      ],
      sampleSolution: `type CoCheNen = "workmanager" | "backgroundtasks" | "hen-gio-rieng"

interface HoSoTaiNguyen {
  coCheNen: CoCheNen
  allocationConSong: number
  dungLuongMb: number
  nguongMb: number
}

function raTaiNguyen(h: HoSoTaiNguyen): string {
  if (h.nguongMb <= 0) return "unknown: chua cau hinh nguong dung luong"
  if (h.coCheNen === "hen-gio-rieng") return "deny: tu hen gio rieng, hao pin"
  if (h.allocationConSong > 0) return "leak: con " + h.allocationConSong + " doi tuong song"
  if (h.dungLuongMb > h.nguongMb) return "oversize: goi " + h.dungLuongMb + "MB vuot nguong"
  return "allow: ba nguon hao deu dat"
}

// ---- Đừng sửa phần dưới đây ----
const tot: HoSoTaiNguyen = { coCheNen: "workmanager", allocationConSong: 0, dungLuongMb: 40, nguongMb: 60 }
console.log("Ca 1:", raTaiNguyen(tot))
console.log("Ca 2:", raTaiNguyen({ ...tot, coCheNen: "hen-gio-rieng" }))
console.log("Ca 3:", raTaiNguyen({ ...tot, allocationConSong: 3 }))
console.log("Ca 4:", raTaiNguyen({ ...tot, dungLuongMb: 95 }))
console.log("Ca 5:", raTaiNguyen({ ...tot, dungLuongMb: 60 }))
console.log("Ca 6:", raTaiNguyen({ ...tot, nguongMb: 0 }))`,
    },
    homework:
      'Vào phần thống kê pin của điện thoại bạn, xem ba app hao pin nhất trong 24 giờ qua và mức hoạt động nền của từng app. Chọn một app trong đó, tắt quyền chạy nền của nó rồi dùng bình thường một ngày. Ghi lại: tính năng nào hỏng, tính năng nào không đổi. Đó là câu trả lời thật cho câu hỏi "việc nền này có đáng không".',
    srsCards: [
      {
        hoi: 'Nguồn hao pin lớn nhất của app di động thường là gì?',
        dap: 'Là mỗi lần app được đánh thức: bộ xử lý rời trạng thái ngủ sâu và sóng di động bật lên, cái giá đó phải trả đủ ngay cả khi app chỉ làm một việc nửa giây.',
      },
      {
        hoi: 'Vì sao nên khai báo việc nền cho hệ điều hành thay vì tự hẹn giờ?',
        dap: 'Vì hệ điều hành gom việc của nhiều app vào cùng một lần đánh thức và chọn lúc máy đang sạc, có wifi. Một lần đánh thức phục vụ nhiều app thay vì mỗi app tự đánh thức máy một lần.',
      },
      {
        hoi: 'Ngoại lệ nào thật sự cần cơ chế báo thức chính xác?',
        dap: 'Việc phải đúng giờ vì người dùng đã hẹn, như báo thức hay nhắc uống thuốc. "Dữ liệu phải luôn mới" không thuộc nhóm này — đó là mong muốn của lập trình viên, không phải lời hứa với người dùng.',
      },
    ],
  },
  {
    id: 'p6-u219-l2',
    unitId: 'p6-u219',
    language: 'typescript',
    title: 'Đếm tham chiếu còn sống — cách phát hiện rò bộ nhớ mà không cần profiler',
    hook: 'Mở màn chi tiết sản phẩm, quay ra, mở lại. Làm 30 lần. App chậm dần rồi tắt ngang. Không có lỗi nào trong log — chỉ là 30 màn hình đã đóng vẫn còn sống trong bộ nhớ vì mỗi màn để lại một listener chưa ai gỡ.',
    theory:
      'Rò bộ nhớ trên di động hầu như luôn cùng một khuôn: một đối tượng SỐNG LÂU giữ tham chiếu tới một đối tượng SỐNG NGẮN. Đối tượng sống ngắn (màn hình, view) đáng lẽ chết khi người dùng quay ra, nhưng vì còn bị nắm nên bộ thu gom rác không dọn được.\n\nBốn nguồn kinh điển, cả Android lẫn iOS:\n\n- listener/observer đăng ký lúc mở màn mà không gỡ lúc đóng\n- callback của một tác vụ nền vẫn trỏ về màn hình đã đóng\n- đối tượng tĩnh (singleton) giữ ngữ cảnh của màn hình\n- vòng tham chiếu hai chiều mà không bên nào là tham chiếu yếu\n\nCách phát hiện thì đơn giản đến bất ngờ và KHÔNG cần công cụ đặc biệt: đếm. Mở màn hình, đóng nó, đếm xem còn bao nhiêu đối tượng thuộc màn đó sống sót. Lặp lại N lần: nếu con số tăng tuyến tính theo N thì đó là rò, không phải nhiễu. Một màn còn sống có thể là do bộ thu gom rác chưa chạy; ba mươi màn còn sống sau ba mươi lần mở thì không có cách giải thích nào khác.\n\nBài này viết đúng phép đo đó thành hàm: nhận số lần mở và số đối tượng còn sống, rồi kết luận. Ba đường ra:\n\n- **unknown** — số lần mở quá ít (dưới ngưỡng mẫu tối thiểu): chưa đủ dữ liệu để phân biệt rò với nhiễu, và nói "sạch" lúc này là bịa.\n- **leak** — số còn sống lớn hơn hoặc bằng số lần mở: mỗi lần mở để lại một xác.\n- **allow** — đủ mẫu và số còn sống không tăng theo số lần mở.\n\nNhánh unknown ở đây không phải chi tiết kỹ thuật. Nó là nội dung chính: một phép đo chạy trên hai mẫu rồi kết luận "không rò" chính là cách người ta tự trấn an mình bằng dữ liệu không đủ.',
    workedExample: {
      code: `const MAU_TOI_THIEU = 10  // duoi nguong nay thi khong phan biet duoc ro voi nhieu

function doRo(soLanMo: number, soConSong: number): string {
  if (soLanMo < 0 || soConSong < 0) return "invalid: so dem am"
  if (soLanMo < MAU_TOI_THIEU) return "unknown: moi " + soLanMo + " lan mo, chua du mau"
  // Moi lan mo de lai mot xac -> so con song tang tuyen tinh theo so lan mo.
  if (soConSong >= soLanMo) return "leak: " + soConSong + " man con song sau " + soLanMo + " lan mo"
  return "allow: " + soConSong + " man con song, khong tang theo so lan mo"
}

console.log(doRo(30, 30))
console.log(doRo(30, 1))
console.log(doRo(2, 2))
console.log(doRo(-1, 0))`,
      stdinLines: [],
    },
    predict: {
      code: `const MAU_TOI_THIEU = 10
function doRo(soLanMo: number, soConSong: number): string {
  if (soLanMo < 0 || soConSong < 0) return "invalid: so dem am"
  if (soLanMo < MAU_TOI_THIEU) return "unknown: moi " + soLanMo + " lan mo, chua du mau"
  if (soConSong >= soLanMo) return "leak: " + soConSong + " man con song sau " + soLanMo + " lan mo"
  return "allow: " + soConSong + " man con song, khong tang theo so lan mo"
}
console.log(doRo(2, 2))`,
      question: 'Chạy thử 2 lần, thấy 2 màn còn sống. Hàm kết luận gì?',
      choices: [
        'unknown: moi 2 lan mo, chua du mau',
        'leak: 2 man con song sau 2 lan mo',
        'allow: 2 man con song, khong tang theo so lan mo',
        'invalid: so dem am',
      ],
      answerIndex: 0,
      explain:
        'Hai mẫu thì chưa phân biệt được rò với việc bộ thu gom rác chưa kịp chạy, nên nhánh unknown chặn trước cả nhánh leak. Đây là điểm quan trọng nhất của bài: kết luận "rò" từ hai mẫu cũng thiếu cơ sở y như kết luận "sạch" từ hai mẫu.',
    },
    parsons: {
      prompt:
        'Xếp lại phép đo rò bộ nhớ: chặn số âm, chặn thiếu mẫu, rồi mới kết luận rò hay sạch.',
      lines: [
        'function doRo(soLanMo: number, soConSong: number): string {',
        '  if (soLanMo < 0 || soConSong < 0) return "invalid: so dem am"',
        '  if (soLanMo < MAU_TOI_THIEU) return "unknown: moi " + soLanMo + " lan mo, chua du mau"',
        '  if (soConSong >= soLanMo) return "leak: " + soConSong + " man con song sau " + soLanMo + " lan mo"',
        '  return "allow: " + soConSong + " man con song, khong tang theo so lan mo"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết doRo(soLanMo, soConSong) với MAU_TOI_THIEU = 10:\n\n1. số nào âm → "invalid: so dem am"\n2. soLanMo < 10 → "unknown: moi <soLanMo> lan mo, chua du mau"\n3. soConSong >= soLanMo → "leak: <soConSong> man con song sau <soLanMo> lan mo"\n4. còn lại → "allow: <soConSong> man con song, khong tang theo so lan mo"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `const MAU_TOI_THIEU = 10

function doRo(soLanMo: number, soConSong: number): string {
  // TODO: bon nhanh, unknown phai chan TRUOC leak
  return "allow: 0 man con song, khong tang theo so lan mo"
}

// ---- Đừng sửa phần dưới đây ----
console.log("Ca 1:", doRo(30, 30))
console.log("Ca 2:", doRo(30, 1))
console.log("Ca 3:", doRo(2, 2))
console.log("Ca 4:", doRo(10, 12))
console.log("Ca 5:", doRo(-1, 0))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: leak: 30 man con song sau 30 lan mo',
          match: 'contains',
          hidden: false,
          label: 'Mỗi lần mở để lại một xác: rò rõ ràng',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: unknown: moi 2 lan mo, chua du mau',
          match: 'contains',
          hidden: false,
          label: 'Hai mẫu: chưa đủ để kết luận rò, cũng chưa đủ để kết luận sạch',
        },
        {
          stdinLines: [],
          expected: 'Ca 5: invalid: so dem am',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: số đếm âm là dữ liệu hỏng',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: leak: 30 man con song sau 30 lan mo\nCa 2: allow: 1 man con song, khong tang theo so lan mo\nCa 3: unknown: moi 2 lan mo, chua du mau\nCa 4: leak: 12 man con song sau 10 lan mo\nCa 5: invalid: so dem am',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: năm ca, gồm ca đúng bằng ngưỡng mẫu tối thiểu',
        },
      ],
      hints: [
        'Ca 4 dùng soLanMo đúng bằng 10: điều kiện thiếu mẫu là < MAU_TOI_THIEU, nên 10 mẫu là đủ để kết luận.',
        'Ca 2 có 1 màn còn sống sau 30 lần mở — đó là nhiễu bình thường, không phải rò, vì con số không tăng theo số lần mở.',
        'Ghép chuỗi có nhiều biến thì cứ nối liên tiếp bằng dấu cộng, chú ý khoảng trắng giữa các phần.',
      ],
      sampleSolution: `const MAU_TOI_THIEU = 10

function doRo(soLanMo: number, soConSong: number): string {
  if (soLanMo < 0 || soConSong < 0) return "invalid: so dem am"
  if (soLanMo < MAU_TOI_THIEU) return "unknown: moi " + soLanMo + " lan mo, chua du mau"
  if (soConSong >= soLanMo) return "leak: " + soConSong + " man con song sau " + soLanMo + " lan mo"
  return "allow: " + soConSong + " man con song, khong tang theo so lan mo"
}

// ---- Đừng sửa phần dưới đây ----
console.log("Ca 1:", doRo(30, 30))
console.log("Ca 2:", doRo(30, 1))
console.log("Ca 3:", doRo(2, 2))
console.log("Ca 4:", doRo(10, 12))
console.log("Ca 5:", doRo(-1, 0))`,
    },
    homework:
      'Chọn một màn hình trong app bạn đang làm (hoặc một app mẫu). Mở và đóng nó 30 lần liên tục, quan sát mức bộ nhớ app chiếm trong phần thông tin của hệ thống trước và sau. Ghi lại hai con số. Rồi liệt kê mọi listener/observer màn đó đăng ký và chỉ ra chỗ gỡ tương ứng — chỗ nào không tìm được lệnh gỡ là ứng viên rò.',
    srsCards: [
      {
        hoi: 'Khuôn chung của mọi ca rò bộ nhớ trên di động là gì?',
        dap: 'Một đối tượng sống lâu giữ tham chiếu tới một đối tượng sống ngắn, thường là màn hình hoặc view đã đóng, khiến bộ thu gom rác không dọn được dù người dùng đã quay ra.',
      },
      {
        hoi: 'Phép đo đơn giản nào phân biệt được rò thật với nhiễu?',
        dap: 'Mở và đóng cùng một màn hình N lần rồi đếm số đối tượng còn sống. Nếu con số tăng tuyến tính theo N thì là rò; một vài đối tượng lẻ có thể chỉ do bộ thu gom rác chưa chạy.',
      },
      {
        hoi: 'Vì sao nhánh "chưa đủ mẫu" phải chặn trước cả kết luận rò?',
        dap: 'Vì với quá ít lần lặp thì cả kết luận rò lẫn kết luận sạch đều thiếu cơ sở như nhau. Chạy hai mẫu rồi tuyên bố không rò chính là tự trấn an bằng dữ liệu không đủ.',
      },
    ],
  },
]
