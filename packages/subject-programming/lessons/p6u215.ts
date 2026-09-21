// lessons/p6u215.ts — P6-U215: HƯỚNG DI ĐỘNG, chặng S2 — Xác thực trên điện thoại
// (module `mobile-s2-m2`).
//
// MÔ PHỎNG: máy trạng thái phiên đăng nhập viết bằng TypeScript thuần, tất định. Không gọi
// OAuth thật, không đụng Keychain/Keystore, không đọc đồng hồ hệ thống — "bây giờ" luôn là
// tham số truyền vào. Việc lưu token thật vào kho an toàn của thiết bị nằm ở bài tập về nhà.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U215_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u215-l1',
    unitId: 'p6-u215',
    language: 'typescript',
    title: 'Ba đường ra của một phiên: cho qua, làm mới, hay bắt đăng nhập lại',
    hook: 'App ngân hàng đá người dùng ra màn hình đăng nhập giữa lúc họ đang xem số dư — chỉ vì access token vừa hết hạn sau 15 phút. Refresh token trong máy còn hạn tới 30 ngày, nhưng không ai dùng tới nó. Đăng nhập lại mỗi 15 phút là cách nhanh nhất để mất người dùng.',
    theory:
      'Đăng nhập trên điện thoại không phải một lần bật/tắt mà là một MÁY TRẠNG THÁI chạy suốt vòng đời app. Hai loại vé khác hẳn nhau:\n\n- **access token** — vé đi kèm mọi request tới server. Sống rất ngắn (phút), vì nó bị gửi đi liên tục nên khả năng lộ cao; hết hạn nhanh thì thiệt hại của việc lộ cũng ngắn theo.\n- **refresh token** — vé dùng để XIN access token mới. Sống dài (ngày, tuần), hầu như không rời khỏi máy, và phải nằm trong kho an toàn của hệ điều hành (Keychain trên iOS, Keystore/EncryptedSharedPreferences trên Android) chứ không phải file cấu hình thường.\n\nTrước mỗi request, app hỏi một câu duy nhất và nhận về một trong ba đường ra:\n\n1. **allow** — access còn hạn, đi thẳng.\n2. **refresh** — access hết hạn nhưng refresh còn hạn: lặng lẽ xin vé mới, người dùng không thấy gì cả. Đây là đường phải chạy phần lớn thời gian, và là thứ phân biệt app làm nghiêm túc với app bắt đăng nhập lại suốt ngày.\n3. **logout** — cả hai đều hết hạn: hết cách, phải hỏi lại người dùng.\n\nHạn dùng so bằng một MỐC THỜI GIAN TRUYỀN VÀO, không phải đồng hồ đọc bên trong hàm. Lý do thực dụng: máy trạng thái này là chỗ sinh ra những lỗi tệ nhất trong app (đăng xuất oan, hoặc tệ hơn là cho qua khi đáng lẽ phải chặn), nên nó phải test được với mọi mốc thời gian, kể cả đúng giây hết hạn.\n\nQuy ước biên phải chốt rõ và viết vào hợp đồng: token hết hạn ĐÚNG tại thời điểm đang xét thì coi là HẾT HẠN, không phải còn hạn. Chọn "còn hạn" ở biên nghĩa là để lọt một vé đã chết, và đó là hướng sai của fail closed — ở chỗ nào có thể hiểu hai cách, an toàn luôn thắng tiện lợi.',
    workedExample: {
      code: `interface Phien {
  accessHetHan: number   // moc thoi gian (giay) access het han
  refreshHetHan: number  // moc thoi gian (giay) refresh het han
}

// "bayGio" la THAM SO, khong doc dong ho ben trong: nho vay test duoc moi moc, ke ca dung bien.
function kiemPhien(p: Phien, bayGio: number): string {
  if (bayGio < p.accessHetHan) return "allow: access con han"
  if (bayGio < p.refreshHetHan) return "refresh: access het han, xin ve moi lang le"
  return "logout: ca hai ve deu het han"
}

const p: Phien = { accessHetHan: 1000, refreshHetHan: 9000 }
console.log(kiemPhien(p, 500))   // con han
console.log(kiemPhien(p, 1000))  // DUNG bien: coi la het han
console.log(kiemPhien(p, 9500))  // ca hai het`,
      stdinLines: [],
    },
    predict: {
      code: `interface Phien {
  accessHetHan: number
  refreshHetHan: number
}
function kiemPhien(p: Phien, bayGio: number): string {
  if (bayGio < p.accessHetHan) return "allow: access con han"
  if (bayGio < p.refreshHetHan) return "refresh: access het han, xin ve moi lang le"
  return "logout: ca hai ve deu het han"
}
console.log(kiemPhien({ accessHetHan: 1000, refreshHetHan: 9000 }, 1000))`,
      question: 'Thời điểm đang xét TRÙNG ĐÚNG giây access hết hạn. Kết quả là gì?',
      choices: [
        'refresh: access het han, xin ve moi lang le',
        'allow: access con han',
        'logout: ca hai ve deu het han',
        'invalid: moc thoi gian',
      ],
      answerIndex: 0,
      explain:
        'Điều kiện là bayGio < accessHetHan, và 1000 < 1000 là sai — nên access bị coi là hết hạn. Refresh vẫn còn (1000 < 9000) nên rơi vào nhánh làm mới. Nếu viết dấu <= thì vé đã chết vẫn được cho qua trong đúng một giây; ở biên, luôn chọn hướng an toàn.',
    },
    parsons: {
      prompt: 'Xếp lại máy kiểm phiên theo đúng ba đường ra: cho qua, làm mới, rồi mới đăng xuất.',
      lines: [
        'function kiemPhien(p: Phien, bayGio: number): string {',
        '  if (bayGio < p.accessHetHan) return "allow: access con han"',
        '  if (bayGio < p.refreshHetHan) return "refresh: access het han, xin ve moi lang le"',
        '  return "logout: ca hai ve deu het han"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết kiemPhien(p, bayGio) trả về đúng một dòng "<quyết định>: <lý do>".\n\n- bayGio < p.accessHetHan → "allow: access con han"\n- ngược lại, bayGio < p.refreshHetHan → "refresh: access het han, xin ve moi lang le"\n- ngược lại → "logout: ca hai ve deu het han"\n\nLƯU Ý BIÊN: trùng đúng mốc hết hạn thì coi là ĐÃ hết hạn.\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface Phien {
  accessHetHan: number
  refreshHetHan: number
}

function kiemPhien(p: Phien, bayGio: number): string {
  // TODO: ba nhanh, chu y dau < chu khong phai <=
  return "logout: ca hai ve deu het han"
}

// ---- Đừng sửa phần dưới đây ----
const p: Phien = { accessHetHan: 1000, refreshHetHan: 9000 }
console.log("Ca 1:", kiemPhien(p, 500))
console.log("Ca 2:", kiemPhien(p, 1000))
console.log("Ca 3:", kiemPhien(p, 5000))
console.log("Ca 4:", kiemPhien(p, 9000))
console.log("Ca 5:", kiemPhien(p, 12000))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: allow: access con han',
          match: 'contains',
          hidden: false,
          label: 'Access còn hạn: đi thẳng',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: refresh: access het han, xin ve moi lang le',
          match: 'contains',
          hidden: false,
          label: 'Ca biên: trùng đúng giây hết hạn thì phải làm mới, không được cho qua',
        },
        {
          stdinLines: [],
          expected: 'Ca 4: logout: ca hai ve deu het han',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: trùng đúng giây refresh hết hạn thì phải đăng xuất',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: access con han\nCa 2: refresh: access het han, xin ve moi lang le\nCa 3: refresh: access het han, xin ve moi lang le\nCa 4: logout: ca hai ve deu het han\nCa 5: logout: ca hai ve deu het han',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: cả năm mốc thời gian, gồm hai ca biên',
        },
      ],
      hints: [
        'Chỉ cần hai câu if rồi một return cuối — nhánh logout là nhánh mặc định khi hai điều kiện kia đều trượt.',
        'Dùng dấu < chứ đừng dùng <=. Ca 2 và Ca 4 tồn tại đúng để bắt lỗi này.',
        'Đừng đọc thời gian bên trong hàm: bayGio đã là tham số, và đó là thứ khiến hàm test được.',
      ],
      sampleSolution: `interface Phien {
  accessHetHan: number
  refreshHetHan: number
}

function kiemPhien(p: Phien, bayGio: number): string {
  if (bayGio < p.accessHetHan) return "allow: access con han"
  if (bayGio < p.refreshHetHan) return "refresh: access het han, xin ve moi lang le"
  return "logout: ca hai ve deu het han"
}

// ---- Đừng sửa phần dưới đây ----
const p: Phien = { accessHetHan: 1000, refreshHetHan: 9000 }
console.log("Ca 1:", kiemPhien(p, 500))
console.log("Ca 2:", kiemPhien(p, 1000))
console.log("Ca 3:", kiemPhien(p, 5000))
console.log("Ca 4:", kiemPhien(p, 9000))
console.log("Ca 5:", kiemPhien(p, 12000))`,
    },
    homework:
      'Đăng nhập một app có tài khoản, để yên qua đêm rồi mở lại vào sáng hôm sau. App có bắt đăng nhập lại không? Thử tiếp: đăng nhập xong thì gỡ app rồi cài lại — còn đăng nhập không? Viết 4 câu suy ra: app đó để refresh token sống bao lâu, và nó lưu token ở chỗ sống sót qua lần gỡ cài đặt hay không (kho an toàn của hệ điều hành thì không sống sót, bản sao lưu đám mây thì có).',
    srsCards: [
      {
        hoi: 'Access token và refresh token khác nhau ở điểm nào về tuổi thọ và nơi lưu?',
        dap: 'Access token sống ngắn theo phút vì bị gửi kèm mọi request nên rủi ro lộ cao; refresh token sống dài theo ngày hoặc tuần, hầu như không rời máy và phải nằm trong kho an toàn của hệ điều hành như Keychain hoặc Keystore.',
      },
      {
        hoi: 'Đường "refresh" phục vụ trải nghiệm gì mà thiếu nó thì app hỏng?',
        dap: 'Nó cho phép xin vé mới lặng lẽ khi access hết hạn, người dùng không thấy gì. Thiếu nó thì app bắt đăng nhập lại mỗi vài phút — đúng khoảng sống của access token.',
      },
      {
        hoi: 'Token hết hạn ĐÚNG tại thời điểm đang xét thì xử lý theo hướng nào?',
        dap: 'Coi là đã hết hạn. Chọn hướng ngược lại nghĩa là để lọt một vé đã chết trong đúng khoảnh khắc đó, trái với nguyên tắc fail closed: chỗ nào hiểu được hai cách thì an toàn thắng tiện lợi.',
      },
    ],
  },
  {
    id: 'p6-u215-l2',
    unitId: 'p6-u215',
    language: 'typescript',
    title: 'Làm mới thất bại vì mạng — tuyệt đối đừng đá người dùng ra',
    hook: 'Người dùng vào thang máy. Access token hết hạn, app gọi làm mới, request rớt vì mất sóng. App hiểu nhầm "gọi không được" thành "vé bị từ chối" và xoá sạch phiên. Ra khỏi thang máy, họ phải đăng nhập lại — trong khi chẳng có vé nào hết hạn cả.',
    theory:
      'Đây là lỗi kinh điển nhất của tầng xác thực di động, và nó sinh ra từ việc GỘP HAI THỨ KHÁC HẲN NHAU vào một nhánh:\n\n- **Server trả lời rằng refresh token không hợp lệ** (bị thu hồi, đã dùng rồi, người dùng đổi mật khẩu). Đây là câu trả lời DỨT KHOÁT: vé chết thật, phải đăng xuất.\n- **Không nhận được câu trả lời nào** (mất sóng, hết giờ chờ, DNS hỏng). Đây KHÔNG phải câu trả lời. Ta không biết gì về vé cả.\n\nTrộn hai cái thành "refresh thất bại thì logout" nghĩa là biến mọi lần mất sóng thành một lần đăng xuất. Nên máy trạng thái có thêm một đường ra thứ tư:\n\n4. **retry-refresh** — chưa biết, giữ nguyên phiên, thử lại sau (có backoff, đúng như bài p6-u214). Không xoá token, không chuyển màn hình đăng nhập.\n\nThứ tự ưu tiên của cả hàm, tường minh và tất định:\n\n1. dữ liệu phiên sai (mốc thời gian âm, thiếu trường) → **invalid**\n2. access còn hạn → **allow**\n3. refresh đã hết hạn → **logout**\n4. gọi làm mới gặp lỗi MẠNG → **retry-refresh**\n5. server từ chối vé dứt khoát → **logout**\n6. còn lại → **refresh**\n\nĐiểm đáng dừng lại: fail closed KHÔNG có nghĩa là "cứ nghi ngờ thì đăng xuất". Fail closed nghĩa là không CẤP THÊM quyền khi chưa chắc chắn. Giữ nguyên phiên cũ trong lúc chờ thử lại không cấp thêm quyền gì — access token cũ vẫn hết hạn, request vẫn bị server chặn. Cái giá của việc nhầm hướng ở đây là người dùng bị đuổi oan, còn lợi ích an ninh thì bằng không.',
    workedExample: {
      code: `interface Phien {
  accessHetHan: number
  refreshHetHan: number
}
type KetQuaGoi = "chua-goi" | "loi-mang" | "bi-tu-choi" | "thanh-cong"

function kiemPhien(p: Phien, bayGio: number, ketQua: KetQuaGoi): string {
  if (p.accessHetHan < 0 || p.refreshHetHan < 0) return "invalid: moc thoi gian"
  if (bayGio < p.accessHetHan) return "allow: access con han"
  if (bayGio >= p.refreshHetHan) return "logout: refresh het han"
  // "khong nhan duoc tra loi" KHAC "bi tu choi" — gop hai cai lai la loi kinh dien.
  if (ketQua === "loi-mang") return "retry-refresh: chua biet, giu nguyen phien"
  if (ketQua === "bi-tu-choi") return "logout: server thu hoi refresh token"
  return "refresh: xin ve moi"
}

const p: Phien = { accessHetHan: 1000, refreshHetHan: 9000 }
console.log(kiemPhien(p, 5000, "loi-mang"))
console.log(kiemPhien(p, 5000, "bi-tu-choi"))
console.log(kiemPhien(p, 5000, "chua-goi"))
console.log(kiemPhien({ accessHetHan: -1, refreshHetHan: 9000 }, 5000, "chua-goi"))`,
      stdinLines: [],
    },
    predict: {
      code: `interface Phien {
  accessHetHan: number
  refreshHetHan: number
}
type KetQuaGoi = "chua-goi" | "loi-mang" | "bi-tu-choi" | "thanh-cong"
function kiemPhien(p: Phien, bayGio: number, ketQua: KetQuaGoi): string {
  if (p.accessHetHan < 0 || p.refreshHetHan < 0) return "invalid: moc thoi gian"
  if (bayGio < p.accessHetHan) return "allow: access con han"
  if (bayGio >= p.refreshHetHan) return "logout: refresh het han"
  if (ketQua === "loi-mang") return "retry-refresh: chua biet, giu nguyen phien"
  if (ketQua === "bi-tu-choi") return "logout: server thu hoi refresh token"
  return "refresh: xin ve moi"
}
console.log(kiemPhien({ accessHetHan: 1000, refreshHetHan: 9000 }, 12000, "loi-mang"))`,
      question: 'Refresh đã hết hạn VÀ lần gọi làm mới lại gặp lỗi mạng. Hàm in ra gì?',
      choices: [
        'logout: refresh het han',
        'retry-refresh: chua biet, giu nguyen phien',
        'logout: server thu hoi refresh token',
        'refresh: xin ve moi',
      ],
      answerIndex: 0,
      explain:
        'Nhánh hết hạn đứng trước nhánh lỗi mạng, và đó là đúng: khi vé đã hết hạn theo đồng hồ thì kết quả gọi mạng không còn ý nghĩa gì nữa — có gọi được cũng không cứu được. Thử lại mãi một vé đã chết chỉ làm hao pin.',
    },
    parsons: {
      prompt:
        'Xếp lại máy trạng thái đầy đủ: chặn dữ liệu sai, cho qua, hết hạn, rồi mới phân biệt lỗi mạng với bị từ chối.',
      lines: [
        'function kiemPhien(p: Phien, bayGio: number, ketQua: KetQuaGoi): string {',
        '  if (p.accessHetHan < 0 || p.refreshHetHan < 0) return "invalid: moc thoi gian"',
        '  if (bayGio < p.accessHetHan) return "allow: access con han"',
        '  if (bayGio >= p.refreshHetHan) return "logout: refresh het han"',
        '  if (ketQua === "loi-mang") return "retry-refresh: chua biet, giu nguyen phien"',
        '  if (ketQua === "bi-tu-choi") return "logout: server thu hoi refresh token"',
        '  return "refresh: xin ve moi"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết kiemPhien(p, bayGio, ketQua) theo ĐÚNG thứ tự ưu tiên sau:\n\n1. accessHetHan < 0 hoặc refreshHetHan < 0 → "invalid: moc thoi gian"\n2. bayGio < p.accessHetHan → "allow: access con han"\n3. bayGio >= p.refreshHetHan → "logout: refresh het han"\n4. ketQua là "loi-mang" → "retry-refresh: chua biet, giu nguyen phien"\n5. ketQua là "bi-tu-choi" → "logout: server thu hoi refresh token"\n6. còn lại → "refresh: xin ve moi"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface Phien {
  accessHetHan: number
  refreshHetHan: number
}
type KetQuaGoi = "chua-goi" | "loi-mang" | "bi-tu-choi" | "thanh-cong"

function kiemPhien(p: Phien, bayGio: number, ketQua: KetQuaGoi): string {
  // TODO: 6 nhanh theo dung thu tu uu tien
  return "refresh: xin ve moi"
}

// ---- Đừng sửa phần dưới đây ----
const p: Phien = { accessHetHan: 1000, refreshHetHan: 9000 }
console.log("Ca 1:", kiemPhien(p, 500, "chua-goi"))
console.log("Ca 2:", kiemPhien(p, 5000, "loi-mang"))
console.log("Ca 3:", kiemPhien(p, 5000, "bi-tu-choi"))
console.log("Ca 4:", kiemPhien(p, 5000, "chua-goi"))
console.log("Ca 5:", kiemPhien(p, 12000, "loi-mang"))
console.log("Ca 6:", kiemPhien({ accessHetHan: -1, refreshHetHan: 9000 }, 5000, "chua-goi"))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 2: retry-refresh: chua biet, giu nguyen phien',
          match: 'contains',
          hidden: false,
          label: 'Lỗi mạng khi làm mới: giữ phiên, KHÔNG đá ra đăng nhập',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: logout: server thu hoi refresh token',
          match: 'contains',
          hidden: false,
          label: 'Server từ chối dứt khoát: lúc này mới được đăng xuất',
        },
        {
          stdinLines: [],
          expected: 'Ca 6: invalid: moc thoi gian',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: mốc thời gian âm là dữ liệu hỏng, chặn trước mọi luật khác',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: access con han\nCa 2: retry-refresh: chua biet, giu nguyen phien\nCa 3: logout: server thu hoi refresh token\nCa 4: refresh: xin ve moi\nCa 5: logout: refresh het han\nCa 6: invalid: moc thoi gian',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: sáu ca, gồm ca hết hạn thắng lỗi mạng',
        },
      ],
      hints: [
        'Ca 2 và Ca 3 chỉ khác nhau ở giá trị ketQua — đó chính là hai thứ mà app hỏng hay gộp làm một.',
        'Ca 5 kiểm thứ tự: refresh đã hết hạn thì kết quả gọi mạng không còn ý nghĩa, nên nhánh hết hạn phải đứng trước.',
        'Nhánh invalid đứng đầu tiên: dữ liệu phiên đã hỏng thì mọi so sánh thời gian phía sau đều vô nghĩa.',
      ],
      sampleSolution: `interface Phien {
  accessHetHan: number
  refreshHetHan: number
}
type KetQuaGoi = "chua-goi" | "loi-mang" | "bi-tu-choi" | "thanh-cong"

function kiemPhien(p: Phien, bayGio: number, ketQua: KetQuaGoi): string {
  if (p.accessHetHan < 0 || p.refreshHetHan < 0) return "invalid: moc thoi gian"
  if (bayGio < p.accessHetHan) return "allow: access con han"
  if (bayGio >= p.refreshHetHan) return "logout: refresh het han"
  if (ketQua === "loi-mang") return "retry-refresh: chua biet, giu nguyen phien"
  if (ketQua === "bi-tu-choi") return "logout: server thu hoi refresh token"
  return "refresh: xin ve moi"
}

// ---- Đừng sửa phần dưới đây ----
const p: Phien = { accessHetHan: 1000, refreshHetHan: 9000 }
console.log("Ca 1:", kiemPhien(p, 500, "chua-goi"))
console.log("Ca 2:", kiemPhien(p, 5000, "loi-mang"))
console.log("Ca 3:", kiemPhien(p, 5000, "bi-tu-choi"))
console.log("Ca 4:", kiemPhien(p, 5000, "chua-goi"))
console.log("Ca 5:", kiemPhien(p, 12000, "loi-mang"))
console.log("Ca 6:", kiemPhien({ accessHetHan: -1, refreshHetHan: 9000 }, 5000, "chua-goi"))`,
    },
    homework:
      'Đăng nhập một app rồi bật chế độ máy bay và dùng app trong 5 phút (lướt các màn hình cần dữ liệu). App có đá bạn ra đăng nhập không? Nếu có, nó đang gộp "mất mạng" với "vé bị từ chối". Viết 4 câu: bạn sẽ hiện gì cho người dùng trong lúc app ở trạng thái retry-refresh, để họ biết là chưa mất phiên chứ không phải app treo.',
    srsCards: [
      {
        hoi: 'Hai tình huống nào hay bị gộp sai thành một ở tầng làm mới token?',
        dap: 'Server trả lời dứt khoát rằng refresh token không hợp lệ (phải đăng xuất) và không nhận được câu trả lời nào do mất sóng hay hết giờ chờ (chưa biết gì, phải giữ phiên và thử lại). Gộp hai cái biến mọi lần mất sóng thành một lần đăng xuất.',
      },
      {
        hoi: 'Vì sao giữ nguyên phiên khi làm mới gặp lỗi mạng vẫn đúng tinh thần fail closed?',
        dap: 'Fail closed nghĩa là không cấp thêm quyền khi chưa chắc chắn, chứ không phải cứ nghi ngờ là đăng xuất. Giữ phiên cũ không cấp thêm gì vì access token cũ vẫn hết hạn và server vẫn chặn request.',
      },
      {
        hoi: 'Khi refresh token đã hết hạn theo đồng hồ, kết quả lần gọi mạng có còn quan trọng không?',
        dap: 'Không. Vé đã chết thì gọi được hay không cũng không cứu được, nên nhánh hết hạn phải đứng trước nhánh lỗi mạng; thử lại mãi một vé đã chết chỉ hao pin và hao băng thông.',
      },
    ],
  },
]
