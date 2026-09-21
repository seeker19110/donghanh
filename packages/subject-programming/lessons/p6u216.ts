// lessons/p6u216.ts — P6-U216: HƯỚNG DI ĐỘNG, chặng S2 — Quyền và cảm biến
// (module `mobile-s2-m3`).
//
// MÔ PHỎNG: cây quyết định xin quyền viết bằng TypeScript thuần, tất định. Không gọi API
// quyền thật của Android/iOS, không đọc cảm biến. Việc chạy app thật với mọi quyền bị từ chối
// tay nằm ở bài tập về nhà.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U216_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u216-l1',
    unitId: 'p6-u216',
    language: 'typescript',
    title: 'Xin quyền đúng lúc — và cái giá của việc xin sai lúc',
    hook: 'Mở app lần đầu, chưa kịp thấy màn hình nào, đã bị hỏi liên tiếp: cho phép vị trí, cho phép thông báo, cho phép camera, cho phép danh bạ. Phản xạ của mọi người dùng là bấm Từ chối hết — và trên iOS lẫn Android hiện đại, từ chối rồi thì app hầu như không được hỏi lại nữa.',
    theory:
      'Quyền trên điện thoại là tài nguyên MỘT LẦN: mỗi lần hỏi là một lần tiêu, và số lần được hỏi rất ít. Cho nên xin quyền không phải chuyện gọi đúng hàm API, mà là chuyện quyết định KHI NÀO được phép gọi.\n\nBa điều kiện phải thoả trước khi mở hộp thoại hệ thống:\n\n1. **Quyền phải được KHAI BÁO** trong manifest (Android) hoặc Info.plist (iOS). Không khai mà vẫn xin thì hệ điều hành từ chối thẳng, và đây là lỗi lập trình chứ không phải lựa chọn của người dùng — nên nó thuộc nhánh **invalid**, không phải deny.\n2. **Phải có LÝ DO hiện trước** cho người dùng đọc, bằng ngôn ngữ của họ, ngay trong giao diện app (không phải trong hộp thoại hệ thống). Xin quyền trần trụi không kèm lý do thì tỉ lệ đồng ý rất thấp, và mỗi lần bị từ chối là mất vĩnh viễn một cơ hội — nên luật ở đây là **deny** ngay từ phía app: app tự chặn mình, không để lệnh xin đi tới hệ điều hành.\n3. **Phải ĐÚNG THỜI ĐIỂM** — xin camera lúc người dùng vừa bấm nút chụp ảnh, không phải lúc mở app. Lúc đó lý do tự nó hiển nhiên, người dùng đang muốn làm đúng việc cần quyền ấy.\n\nBốn đường ra của bài này, theo thứ tự ưu tiên:\n\n- **invalid** — quyền chưa khai báo (lỗi của lập trình viên)\n- **blocked** — đã hỏi quá số lần hệ điều hành cho phép; hỏi thêm cũng không có hộp thoại nào hiện ra, việc đúng phải làm là dẫn người dùng sang phần Cài đặt\n- **deny** — chưa hiện lý do: app tự chặn để dành cơ hội cho lần sau\n- **grant** — đủ điều kiện, mở hộp thoại hệ thống\n\nĐể ý thứ tự: blocked đứng trước deny. Vì khi đã hết lượt hỏi thì có hiện lý do cũng vô ích — cây quyết định phải nói đúng việc cần làm tiếp theo, và trong trường hợp đó việc cần làm là mở Cài đặt chứ không phải viết thêm màn giải thích.',
    workedExample: {
      code: `interface YeuCauQuyen {
  quyen: string       // vd "camera"
  coLyDo: boolean     // da hien man giai thich ly do chua
  soLanDaXin: number  // da mo hop thoai he thong bao nhieu lan
  gioiHan: number     // so lan he dieu hanh con cho hoi
}

function xinQuyen(y: YeuCauQuyen, daKhaiBao: string[]): string {
  if (daKhaiBao.indexOf(y.quyen) < 0) return "invalid: quyen chua khai bao"  // loi lap trinh
  if (y.soLanDaXin >= y.gioiHan) return "blocked: het luot hoi, dan sang Cai dat"
  if (!y.coLyDo) return "deny: chua hien ly do, khong tieu co hoi hoi"
  return "grant: mo hop thoai he thong"
}

const khaiBao: string[] = ["camera", "vi-tri"]
console.log(xinQuyen({ quyen: "camera", coLyDo: true, soLanDaXin: 0, gioiHan: 2 }, khaiBao))
console.log(xinQuyen({ quyen: "camera", coLyDo: false, soLanDaXin: 0, gioiHan: 2 }, khaiBao))
console.log(xinQuyen({ quyen: "camera", coLyDo: true, soLanDaXin: 2, gioiHan: 2 }, khaiBao))
console.log(xinQuyen({ quyen: "danh-ba", coLyDo: true, soLanDaXin: 0, gioiHan: 2 }, khaiBao))`,
      stdinLines: [],
    },
    predict: {
      code: `interface YeuCauQuyen {
  quyen: string
  coLyDo: boolean
  soLanDaXin: number
  gioiHan: number
}
function xinQuyen(y: YeuCauQuyen, daKhaiBao: string[]): string {
  if (daKhaiBao.indexOf(y.quyen) < 0) return "invalid: quyen chua khai bao"
  if (y.soLanDaXin >= y.gioiHan) return "blocked: het luot hoi, dan sang Cai dat"
  if (!y.coLyDo) return "deny: chua hien ly do, khong tieu co hoi hoi"
  return "grant: mo hop thoai he thong"
}
console.log(xinQuyen({ quyen: "camera", coLyDo: false, soLanDaXin: 5, gioiHan: 2 }, ["camera"]))`,
      question: 'Vừa hết lượt hỏi, vừa chưa hiện lý do. Kết quả nào thắng?',
      choices: [
        'blocked: het luot hoi, dan sang Cai dat',
        'deny: chua hien ly do, khong tieu co hoi hoi',
        'grant: mo hop thoai he thong',
        'invalid: quyen chua khai bao',
      ],
      answerIndex: 0,
      explain:
        'blocked đứng trước deny trong cây quyết định, và đó là lựa chọn có chủ ý: khi hệ điều hành không còn cho hiện hộp thoại nữa thì viết thêm màn giải thích lý do cũng vô ích. Việc đúng phải làm là dẫn người dùng sang phần Cài đặt của hệ thống.',
    },
    parsons: {
      prompt:
        'Xếp lại cây quyết định xin quyền: lỗi lập trình trước, hết lượt hỏi, thiếu lý do, rồi mới được mở hộp thoại.',
      lines: [
        'function xinQuyen(y: YeuCauQuyen, daKhaiBao: string[]): string {',
        '  if (daKhaiBao.indexOf(y.quyen) < 0) return "invalid: quyen chua khai bao"',
        '  if (y.soLanDaXin >= y.gioiHan) return "blocked: het luot hoi, dan sang Cai dat"',
        '  if (!y.coLyDo) return "deny: chua hien ly do, khong tieu co hoi hoi"',
        '  return "grant: mo hop thoai he thong"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết xinQuyen(y, daKhaiBao) trả về đúng một dòng, theo thứ tự ưu tiên:\n\n1. y.quyen không nằm trong daKhaiBao → "invalid: quyen chua khai bao"\n2. y.soLanDaXin >= y.gioiHan → "blocked: het luot hoi, dan sang Cai dat"\n3. y.coLyDo là false → "deny: chua hien ly do, khong tieu co hoi hoi"\n4. còn lại → "grant: mo hop thoai he thong"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface YeuCauQuyen {
  quyen: string
  coLyDo: boolean
  soLanDaXin: number
  gioiHan: number
}

function xinQuyen(y: YeuCauQuyen, daKhaiBao: string[]): string {
  // TODO: bon nhanh theo dung thu tu uu tien
  return "grant: mo hop thoai he thong"
}

// ---- Đừng sửa phần dưới đây ----
const khaiBao: string[] = ["camera", "vi-tri"]
console.log("Ca 1:", xinQuyen({ quyen: "camera", coLyDo: true, soLanDaXin: 0, gioiHan: 2 }, khaiBao))
console.log("Ca 2:", xinQuyen({ quyen: "camera", coLyDo: false, soLanDaXin: 0, gioiHan: 2 }, khaiBao))
console.log("Ca 3:", xinQuyen({ quyen: "vi-tri", coLyDo: true, soLanDaXin: 2, gioiHan: 2 }, khaiBao))
console.log("Ca 4:", xinQuyen({ quyen: "danh-ba", coLyDo: true, soLanDaXin: 0, gioiHan: 2 }, khaiBao))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: grant: mo hop thoai he thong',
          match: 'contains',
          hidden: false,
          label: 'Đủ ba điều kiện: mới được mở hộp thoại hệ thống',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: deny: chua hien ly do, khong tieu co hoi hoi',
          match: 'contains',
          hidden: false,
          label: 'Chưa hiện lý do: app tự chặn mình để dành cơ hội',
        },
        {
          stdinLines: [],
          expected: 'Ca 4: invalid: quyen chua khai bao',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: quyền không khai báo là lỗi lập trình, không phải lựa chọn người dùng',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: grant: mo hop thoai he thong\nCa 2: deny: chua hien ly do, khong tieu co hoi hoi\nCa 3: blocked: het luot hoi, dan sang Cai dat\nCa 4: invalid: quyen chua khai bao',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: cả bốn đường ra của cây quyết định',
        },
      ],
      hints: [
        'Kiểm khai báo bằng daKhaiBao.indexOf(y.quyen) < 0 — mảng không chứa thì indexOf trả về -1.',
        'Ca 3 dùng soLanDaXin bằng đúng gioiHan: dùng dấu >= chứ không phải >, vì đã dùng hết lượt nghĩa là không còn lượt nào.',
        'Thứ tự bốn nhánh chính là nội dung bài — đảo blocked xuống dưới deny thì Ca 3 vẫn có thể đúng, nhưng ca kết hợp trong bài Predict sẽ sai.',
      ],
      sampleSolution: `interface YeuCauQuyen {
  quyen: string
  coLyDo: boolean
  soLanDaXin: number
  gioiHan: number
}

function xinQuyen(y: YeuCauQuyen, daKhaiBao: string[]): string {
  if (daKhaiBao.indexOf(y.quyen) < 0) return "invalid: quyen chua khai bao"
  if (y.soLanDaXin >= y.gioiHan) return "blocked: het luot hoi, dan sang Cai dat"
  if (!y.coLyDo) return "deny: chua hien ly do, khong tieu co hoi hoi"
  return "grant: mo hop thoai he thong"
}

// ---- Đừng sửa phần dưới đây ----
const khaiBao: string[] = ["camera", "vi-tri"]
console.log("Ca 1:", xinQuyen({ quyen: "camera", coLyDo: true, soLanDaXin: 0, gioiHan: 2 }, khaiBao))
console.log("Ca 2:", xinQuyen({ quyen: "camera", coLyDo: false, soLanDaXin: 0, gioiHan: 2 }, khaiBao))
console.log("Ca 3:", xinQuyen({ quyen: "vi-tri", coLyDo: true, soLanDaXin: 2, gioiHan: 2 }, khaiBao))
console.log("Ca 4:", xinQuyen({ quyen: "danh-ba", coLyDo: true, soLanDaXin: 0, gioiHan: 2 }, khaiBao))`,
    },
    homework:
      'Cài một app mới và đếm: nó hỏi quyền gì, vào lúc nào, có giải thích lý do trước không. Rồi từ chối HẾT và dùng tiếp — app còn chạy được không hay có màn nào trắng/sập. Viết 5 câu: với app bạn định làm, quyền nào thật sự bắt buộc và quyền nào có thể bỏ mà tính năng vẫn dùng được ở mức thấp hơn.',
    srsCards: [
      {
        hoi: 'Vì sao lời nhắc lý do phải hiện TRONG app trước khi mở hộp thoại hệ thống?',
        dap: 'Vì hộp thoại hệ thống không cho tuỳ biến nội dung và mỗi lần hỏi là một lần tiêu trong số rất ít lần được phép. Màn giải thích trong app dùng ngôn ngữ của người dùng, nâng tỉ lệ đồng ý trước khi tiêu cơ hội đó.',
      },
      {
        hoi: 'Xin một quyền chưa khai báo trong manifest thì xếp vào nhánh nào, vì sao?',
        dap: 'Nhánh invalid, vì đó là lỗi của lập trình viên chứ không phải lựa chọn của người dùng. Hệ điều hành từ chối thẳng và không có hộp thoại nào hiện ra, nên gọi nó là deny sẽ che mất nguyên nhân thật.',
      },
      {
        hoi: 'Khi đã hết lượt hỏi của hệ điều hành thì việc đúng phải làm tiếp là gì?',
        dap: 'Dẫn người dùng sang phần Cài đặt của hệ thống để bật quyền bằng tay, vì gọi xin thêm sẽ không hiện hộp thoại nào và viết thêm màn giải thích lý do cũng vô ích.',
      },
    ],
  },
  {
    id: 'p6-u216-l2',
    unitId: 'p6-u216',
    language: 'typescript',
    title: 'Bị từ chối quyền không phải dấu chấm hết — thiết kế đường lui',
    hook: 'Người dùng từ chối quyền camera. App hiện màn hình trắng kèm dòng "Cần quyền camera để tiếp tục" và một nút duy nhất: Thoát. Trong khi đó họ có sẵn ảnh chụp giấy tờ trong thư viện — chỉ cần một nút "Chọn ảnh có sẵn" là xong việc.',
    theory:
      'Phần lớn app xử lý việc bị từ chối quyền theo kiểu được ăn cả ngã về không: có quyền thì chạy, không có thì chặn. Đó là thiết kế lười, và nó biến một lựa chọn hợp lý của người dùng thành ngõ cụt.\n\nLuật thiết kế: mỗi quyền phải đi kèm câu trả lời cho "nếu không có thì sao". Có ba dạng trả lời, và phải chọn TRƯỚC khi viết màn hình:\n\n- **Có đường lui tương đương** — camera thì thay bằng chọn ảnh có sẵn; vị trí chính xác thì thay bằng gõ địa chỉ tay hoặc vị trí gần đúng. Đây là **fallback**: tính năng vẫn dùng được, chỉ khác cách vào.\n- **Tính năng suy giảm nhưng app vẫn sống** — không cho thông báo thì vẫn dùng được app, chỉ là không được nhắc. Không chặn gì cả.\n- **Thật sự không có đường lui** — app quét mã QR mà không có camera. Lúc này mới được chặn, nhưng phải chặn ĐÚNG MỘT MÀN, không phải chặn cả app, và phải nói rõ cách bật lại.\n\nCây quyết định của bài mở rộng thêm nhánh fallback, đặt SAU các nhánh chặn và TRƯỚC nhánh grant:\n\n1. quyền chưa khai báo → **invalid**\n2. hết lượt hỏi VÀ có đường lui → **fallback** (dùng đường lui, đừng dẫn đi lòng vòng)\n3. hết lượt hỏi, không đường lui → **blocked** (dẫn sang Cài đặt)\n4. đã bị từ chối một lần VÀ có đường lui → **fallback**\n5. chưa hiện lý do → **deny**\n6. còn lại → **grant**\n\nĐiểm quan trọng nhất: fallback thắng blocked khi cả hai cùng khớp. Dẫn người dùng đi mười bước vào Cài đặt trong khi có sẵn một nút làm xong việc ngay là thiết kế tệ, dù mỗi nhánh riêng lẻ đều "đúng".',
    workedExample: {
      code: `interface YeuCauQuyen {
  quyen: string
  coLyDo: boolean
  soLanDaXin: number
  gioiHan: number
  daTuChoi: boolean      // nguoi dung da bam Tu choi lan nao chua
  coDuongLui: boolean    // tinh nang nay co cach lam khac khong can quyen khong
}

function xinQuyen(y: YeuCauQuyen, daKhaiBao: string[]): string {
  if (daKhaiBao.indexOf(y.quyen) < 0) return "invalid: quyen chua khai bao"
  // fallback THANG blocked: co san duong lui thi dung dan nguoi dung di vong vao Cai dat.
  if (y.soLanDaXin >= y.gioiHan && y.coDuongLui) return "fallback: dung duong lui, khong can quyen"
  if (y.soLanDaXin >= y.gioiHan) return "blocked: het luot hoi, dan sang Cai dat"
  if (y.daTuChoi && y.coDuongLui) return "fallback: dung duong lui, khong can quyen"
  if (!y.coLyDo) return "deny: chua hien ly do, khong tieu co hoi hoi"
  return "grant: mo hop thoai he thong"
}

const khaiBao: string[] = ["camera"]
const goc: YeuCauQuyen = { quyen: "camera", coLyDo: true, soLanDaXin: 2, gioiHan: 2, daTuChoi: true, coDuongLui: true }
console.log(xinQuyen(goc, khaiBao))
console.log(xinQuyen({ ...goc, coDuongLui: false }, khaiBao))
console.log(xinQuyen({ ...goc, soLanDaXin: 0, daTuChoi: false }, khaiBao))`,
      stdinLines: [],
    },
    predict: {
      code: `interface YeuCauQuyen {
  quyen: string
  coLyDo: boolean
  soLanDaXin: number
  gioiHan: number
  daTuChoi: boolean
  coDuongLui: boolean
}
function xinQuyen(y: YeuCauQuyen, daKhaiBao: string[]): string {
  if (daKhaiBao.indexOf(y.quyen) < 0) return "invalid: quyen chua khai bao"
  if (y.soLanDaXin >= y.gioiHan && y.coDuongLui) return "fallback: dung duong lui, khong can quyen"
  if (y.soLanDaXin >= y.gioiHan) return "blocked: het luot hoi, dan sang Cai dat"
  if (y.daTuChoi && y.coDuongLui) return "fallback: dung duong lui, khong can quyen"
  if (!y.coLyDo) return "deny: chua hien ly do, khong tieu co hoi hoi"
  return "grant: mo hop thoai he thong"
}
console.log(xinQuyen({ quyen: "camera", coLyDo: false, soLanDaXin: 9, gioiHan: 2, daTuChoi: true, coDuongLui: true }, ["camera"]))`,
      question: 'Hết lượt hỏi, đã bị từ chối, chưa hiện lý do, nhưng CÓ đường lui. In ra gì?',
      choices: [
        'fallback: dung duong lui, khong can quyen',
        'blocked: het luot hoi, dan sang Cai dat',
        'deny: chua hien ly do, khong tieu co hoi hoi',
        'grant: mo hop thoai he thong',
      ],
      answerIndex: 0,
      explain:
        'Ba nhánh cùng khớp nhưng fallback đứng trước cả blocked lẫn deny. Khi đã có sẵn một cách làm xong việc mà không cần quyền, mọi lời khuyên "vào Cài đặt bật lên" đều là bắt người dùng đi vòng vô ích.',
    },
    parsons: {
      prompt:
        'Xếp lại cây quyết định có đường lui: fallback phải đứng trước blocked, deny đứng sát trước grant.',
      lines: [
        'function xinQuyen(y: YeuCauQuyen, daKhaiBao: string[]): string {',
        '  if (daKhaiBao.indexOf(y.quyen) < 0) return "invalid: quyen chua khai bao"',
        '  if (y.soLanDaXin >= y.gioiHan && y.coDuongLui) return "fallback: dung duong lui, khong can quyen"',
        '  if (y.soLanDaXin >= y.gioiHan) return "blocked: het luot hoi, dan sang Cai dat"',
        '  if (y.daTuChoi && y.coDuongLui) return "fallback: dung duong lui, khong can quyen"',
        '  if (!y.coLyDo) return "deny: chua hien ly do, khong tieu co hoi hoi"',
        '  return "grant: mo hop thoai he thong"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết xinQuyen(y, daKhaiBao) với SÁU nhánh theo đúng thứ tự:\n\n1. quyền chưa khai báo → "invalid: quyen chua khai bao"\n2. hết lượt hỏi VÀ có đường lui → "fallback: dung duong lui, khong can quyen"\n3. hết lượt hỏi (không đường lui) → "blocked: het luot hoi, dan sang Cai dat"\n4. đã bị từ chối VÀ có đường lui → "fallback: dung duong lui, khong can quyen"\n5. chưa hiện lý do → "deny: chua hien ly do, khong tieu co hoi hoi"\n6. còn lại → "grant: mo hop thoai he thong"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface YeuCauQuyen {
  quyen: string
  coLyDo: boolean
  soLanDaXin: number
  gioiHan: number
  daTuChoi: boolean
  coDuongLui: boolean
}

function xinQuyen(y: YeuCauQuyen, daKhaiBao: string[]): string {
  // TODO: sau nhanh, fallback phai thang blocked
  return "grant: mo hop thoai he thong"
}

// ---- Đừng sửa phần dưới đây ----
const khaiBao: string[] = ["camera"]
const goc: YeuCauQuyen = { quyen: "camera", coLyDo: true, soLanDaXin: 2, gioiHan: 2, daTuChoi: true, coDuongLui: true }
console.log("Ca 1:", xinQuyen(goc, khaiBao))
console.log("Ca 2:", xinQuyen({ ...goc, coDuongLui: false }, khaiBao))
console.log("Ca 3:", xinQuyen({ ...goc, soLanDaXin: 0, daTuChoi: true, coDuongLui: true }, khaiBao))
console.log("Ca 4:", xinQuyen({ ...goc, soLanDaXin: 0, daTuChoi: false, coLyDo: false }, khaiBao))
console.log("Ca 5:", xinQuyen({ ...goc, soLanDaXin: 0, daTuChoi: false }, khaiBao))
console.log("Ca 6:", xinQuyen({ ...goc, quyen: "mic" }, khaiBao))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: fallback: dung duong lui, khong can quyen',
          match: 'contains',
          hidden: false,
          label: 'Hết lượt nhưng có đường lui: dùng đường lui, không dẫn vào Cài đặt',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: blocked: het luot hoi, dan sang Cai dat',
          match: 'contains',
          hidden: false,
          label: 'Hết lượt và KHÔNG đường lui: lúc này mới dẫn sang Cài đặt',
        },
        {
          stdinLines: [],
          expected: 'Ca 6: invalid: quyen chua khai bao',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: quyền không khai báo vẫn chặn trước mọi nhánh khác',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: fallback: dung duong lui, khong can quyen\nCa 2: blocked: het luot hoi, dan sang Cai dat\nCa 3: fallback: dung duong lui, khong can quyen\nCa 4: deny: chua hien ly do, khong tieu co hoi hoi\nCa 5: grant: mo hop thoai he thong\nCa 6: invalid: quyen chua khai bao',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: cả sáu nhánh, gồm hai đường vào fallback khác nhau',
        },
      ],
      hints: [
        'Hai nhánh fallback trả về CÙNG một chuỗi nhưng đứng ở hai chỗ khác nhau — một cho ca hết lượt, một cho ca vừa bị từ chối.',
        'Ca 1 và Ca 2 chỉ khác nhau ở coDuongLui: đó là toàn bộ nội dung của luật "fallback thắng blocked".',
        'Dùng toán tử && để ghép hai điều kiện trong một câu if, thứ tự hai vế không đổi kết quả.',
      ],
      sampleSolution: `interface YeuCauQuyen {
  quyen: string
  coLyDo: boolean
  soLanDaXin: number
  gioiHan: number
  daTuChoi: boolean
  coDuongLui: boolean
}

function xinQuyen(y: YeuCauQuyen, daKhaiBao: string[]): string {
  if (daKhaiBao.indexOf(y.quyen) < 0) return "invalid: quyen chua khai bao"
  if (y.soLanDaXin >= y.gioiHan && y.coDuongLui) return "fallback: dung duong lui, khong can quyen"
  if (y.soLanDaXin >= y.gioiHan) return "blocked: het luot hoi, dan sang Cai dat"
  if (y.daTuChoi && y.coDuongLui) return "fallback: dung duong lui, khong can quyen"
  if (!y.coLyDo) return "deny: chua hien ly do, khong tieu co hoi hoi"
  return "grant: mo hop thoai he thong"
}

// ---- Đừng sửa phần dưới đây ----
const khaiBao: string[] = ["camera"]
const goc: YeuCauQuyen = { quyen: "camera", coLyDo: true, soLanDaXin: 2, gioiHan: 2, daTuChoi: true, coDuongLui: true }
console.log("Ca 1:", xinQuyen(goc, khaiBao))
console.log("Ca 2:", xinQuyen({ ...goc, coDuongLui: false }, khaiBao))
console.log("Ca 3:", xinQuyen({ ...goc, soLanDaXin: 0, daTuChoi: true, coDuongLui: true }, khaiBao))
console.log("Ca 4:", xinQuyen({ ...goc, soLanDaXin: 0, daTuChoi: false, coLyDo: false }, khaiBao))
console.log("Ca 5:", xinQuyen({ ...goc, soLanDaXin: 0, daTuChoi: false }, khaiBao))
console.log("Ca 6:", xinQuyen({ ...goc, quyen: "mic" }, khaiBao))`,
    },
    homework:
      'Chọn một app có dùng camera hoặc vị trí. Vào Cài đặt hệ thống, TẮT quyền đó, rồi mở app và đi trọn luồng cần quyền. Ghi lại: app có đường lui không, nó nói gì, có dẫn được bạn tới đúng chỗ bật lại không. Viết 5 câu thiết kế đường lui cho một tính năng cần quyền trong app của bạn, nói rõ tính năng suy giảm đến mức nào mà vẫn dùng được.',
    srsCards: [
      {
        hoi: 'Mỗi quyền phải đi kèm câu trả lời nào ngay từ lúc thiết kế?',
        dap: 'Câu trả lời cho "nếu không có quyền này thì sao": có đường lui tương đương, tính năng suy giảm mà app vẫn sống, hay thật sự không có đường lui. Chọn trước khi viết màn hình, không phải chữa sau.',
      },
      {
        hoi: 'Khi vừa hết lượt hỏi vừa có sẵn đường lui thì chọn nhánh nào?',
        dap: 'Chọn fallback. Dẫn người dùng đi nhiều bước vào Cài đặt trong khi có sẵn một nút làm xong việc ngay là bắt họ đi vòng vô ích, dù nhánh blocked xét riêng vẫn đúng.',
      },
      {
        hoi: 'Khi thật sự không có đường lui thì được chặn tới mức nào?',
        dap: 'Chỉ chặn đúng một màn hình cần quyền đó, không chặn cả app, và phải nói rõ cách bật lại quyền trong Cài đặt. Chặn cả app biến một lựa chọn hợp lý của người dùng thành ngõ cụt.',
      },
    ],
  },
]
