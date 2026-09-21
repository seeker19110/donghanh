// lessons/p6u214.ts — P6-U214: HƯỚNG DI ĐỘNG, chặng S2 "App nối mạng và có tài khoản" —
// Mạng ở môi trường xấu (module `mobile-s2-m1`).
//
// MÔ PHỎNG: đây là simulator TypeScript thuần, tất định — KHÔNG phải hành vi thật của
// OkHttp/URLSession/Retrofit. Điều bài này dạy là CÂY QUYẾT ĐỊNH của một hàng đợi thao tác
// offline (gửi hay không, gửi lại mấy lần, khi nào phải bỏ), thứ đúng như nhau ở Android lẫn
// iOS vì nó là logic nghiệp vụ chứ không phải API thư viện. Phần cần máy thật (bật chế độ máy
// bay giữa lúc gửi đơn) nằm ở bài tập về nhà.
//
// Vì sao chọn làn `typescript`: giữ nguyên quyết định đã chốt ở `mobile-s1` (p6-u131) — làn
// kotlin/swift chưa bài nào dùng nên chưa cổng CI nào chứng minh chấm đúng.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U214_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u214-l1',
    unitId: 'p6-u214',
    language: 'typescript',
    title: 'Gửi lại hay bỏ — luật quyết định của một thao tác offline',
    hook: 'Người dùng bấm "Gửi đơn" trong thang máy. Mạng rớt. App thử lại, thử lại, thử lại — và cuối cùng server nhận BA đơn giống hệt nhau. Lỗi không nằm ở mạng: nằm ở chỗ app không có luật nào nói "khi nào thì thôi" và "cái gì thì không gửi lần hai".',
    theory:
      'Trên điện thoại, mạng KHÔNG phải trạng thái bật/tắt mà là một dải xám: 4G yếu, wifi có sóng nhưng không ra internet, đang chuyển từ wifi sang 4G. Cho nên app di động không hỏi "có mạng không" rồi gửi — nó xếp thao tác vào HÀNG ĐỢI và để một luật quyết định số phận từng thao tác.\n\nBốn quyết định của một thao tác, theo đúng thứ tự ưu tiên:\n\n1. **invalid** — dữ liệu mô tả thao tác đã sai từ đầu (thiếu khoá, số lần thử lại âm, khoảng chờ bằng 0). Sai từ đầu thì gửi kiểu gì cũng sai, nên chặn TRƯỚC mọi luật khác.\n2. **dedup** — thao tác này đã gửi thành công rồi. Mỗi thao tác mang một KHOÁ IDEMPOTENT (ví dụ mã đơn) do client sinh ra; server thấy khoá đã xử lý thì trả lại kết quả cũ thay vì tạo bản ghi mới. Không có khoá này thì mọi cơ chế retry đều là máy nhân bản đơn hàng.\n3. **fail** — đã thử đủ số lần cho phép mà vẫn không được. Phải dừng và báo cho người dùng, vì thử vô hạn chỉ làm hết pin và làm server ngập.\n4. **send** — còn lượt, gửi (lại) sau một khoảng chờ.\n\nKhoảng chờ đó là BACKOFF, và nó phải TĂNG DẦN chứ không cố định: mạng vừa hỏng thì cả triệu máy cùng thử lại ngay lập tức sẽ đánh sập chính cái server vừa hồi. Khoảng chờ bằng 0 hoặc âm là vô nghĩa, nên bài xếp nó vào nhánh invalid.\n\nThứ tự ưu tiên là phần dễ sai nhất và cũng là phần quan trọng nhất. Nếu kiểm "hết lượt thử" TRƯỚC khi kiểm "đã gửi rồi", một thao tác đã thành công nhưng cạn lượt sẽ bị báo là thất bại cho người dùng — đúng lúc tiền đã trừ. Luật chung: nhánh nào NGĂN được hậu quả không đảo ngược thì đứng trước.',
    workedExample: {
      code: `interface ThaoTac {
  khoa: string        // khoa idempotent do client sinh: server dung no de khong tao ban ghi trung
  soLanDaThu: number  // da thu bao nhieu lan roi
  maxRetries: number  // tran so lan thu, vuot la bo
  backoffMs: number   // khoang cho truoc lan thu ke tiep
}

// Tra ve DUNG MOT dong "<quyet dinh>: <ly do>". Thu tu if la thu tu uu tien.
function quyetDinh(t: ThaoTac, daGui: string[]): string {
  if (t.khoa.trim() === "") return "invalid: khoa"          // sai tu dau, chan truoc het
  if (t.maxRetries < 0) return "invalid: maxRetries"
  if (t.backoffMs <= 0) return "invalid: backoffMs"         // cho 0ms = bao server chet lan hai
  if (daGui.indexOf(t.khoa) >= 0) return "dedup: khoa da gui, khong gui lan hai"
  if (t.soLanDaThu >= t.maxRetries) return "fail: het luot thu lai"
  return "send: con luot, cho " + t.backoffMs + "ms roi gui"
}

const daGui: string[] = ["don-88"]
console.log(quyetDinh({ khoa: "don-90", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }, daGui))
console.log(quyetDinh({ khoa: "don-88", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }, daGui))
console.log(quyetDinh({ khoa: "don-91", soLanDaThu: 3, maxRetries: 3, backoffMs: 200 }, daGui))
console.log(quyetDinh({ khoa: "", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }, daGui))`,
      stdinLines: [],
    },
    predict: {
      code: `interface ThaoTac {
  khoa: string
  soLanDaThu: number
  maxRetries: number
  backoffMs: number
}
function quyetDinh(t: ThaoTac, daGui: string[]): string {
  if (t.khoa.trim() === "") return "invalid: khoa"
  if (t.maxRetries < 0) return "invalid: maxRetries"
  if (t.backoffMs <= 0) return "invalid: backoffMs"
  if (daGui.indexOf(t.khoa) >= 0) return "dedup: khoa da gui, khong gui lan hai"
  if (t.soLanDaThu >= t.maxRetries) return "fail: het luot thu lai"
  return "send: con luot, cho " + t.backoffMs + "ms roi gui"
}
console.log(quyetDinh({ khoa: "don-88", soLanDaThu: 5, maxRetries: 3, backoffMs: 400 }, ["don-88"]))`,
      question: 'Thao tác này VỪA đã gửi rồi VỪA cạn lượt thử. Dòng duy nhất in ra là gì?',
      choices: [
        'dedup: khoa da gui, khong gui lan hai',
        'fail: het luot thu lai',
        'send: con luot, cho 400ms roi gui',
        'invalid: maxRetries',
      ],
      answerIndex: 0,
      explain:
        'Hai luật cùng khớp, và thứ tự if quyết định ai thắng: nhánh dedup đứng trước nhánh fail nên kết quả là dedup. Đó là lựa chọn CÓ CHỦ Ý — thao tác đã thành công mà bị báo "thất bại" thì người dùng sẽ bấm gửi lại lần nữa, đúng thứ ta đang cố tránh.',
    },
    parsons: {
      prompt:
        'Xếp lại hàm quyết định theo đúng thứ tự ưu tiên: chặn dữ liệu sai trước, rồi chống trùng, rồi mới tới cạn lượt.',
      lines: [
        'function quyetDinh(t: ThaoTac, daGui: string[]): string {',
        '  if (t.khoa.trim() === "") return "invalid: khoa"',
        '  if (t.backoffMs <= 0) return "invalid: backoffMs"',
        '  if (daGui.indexOf(t.khoa) >= 0) return "dedup: khoa da gui, khong gui lan hai"',
        '  if (t.soLanDaThu >= t.maxRetries) return "fail: het luot thu lai"',
        '  return "send: con luot, cho " + t.backoffMs + "ms roi gui"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết hàm quyetDinh(t, daGui) trả về ĐÚNG MỘT chuỗi "<quyết định>: <lý do>".\n\nThứ tự ưu tiên bắt buộc:\n1. khoa rỗng (sau trim) → "invalid: khoa"\n2. maxRetries < 0 → "invalid: maxRetries"\n3. backoffMs <= 0 → "invalid: backoffMs"\n4. khoa đã nằm trong daGui → "dedup: khoa da gui, khong gui lan hai"\n5. soLanDaThu >= maxRetries → "fail: het luot thu lai"\n6. còn lại → "send: con luot, cho <backoffMs>ms roi gui"\n\nKHÔNG ném lỗi ở bất kỳ nhánh nào. Dùng starter code, đừng sửa phần dưới.',
      starterCode: `interface ThaoTac {
  khoa: string
  soLanDaThu: number
  maxRetries: number
  backoffMs: number
}

function quyetDinh(t: ThaoTac, daGui: string[]): string {
  // TODO: 6 nhanh theo dung thu tu uu tien
  return "send: con luot, cho 0ms roi gui"
}

// ---- Đừng sửa phần dưới đây ----
const daGui: string[] = ["don-88"]
console.log("Ca 1:", quyetDinh({ khoa: "don-90", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }, daGui))
console.log("Ca 2:", quyetDinh({ khoa: "don-88", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }, daGui))
console.log("Ca 3:", quyetDinh({ khoa: "don-91", soLanDaThu: 3, maxRetries: 3, backoffMs: 200 }, daGui))
console.log("Ca 4:", quyetDinh({ khoa: "don-92", soLanDaThu: 0, maxRetries: 3, backoffMs: 0 }, daGui))
console.log("Ca 5:", quyetDinh({ khoa: "   ", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }, daGui))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: send: con luot, cho 200ms roi gui',
          match: 'contains',
          hidden: false,
          label: 'Thao tác mới, còn lượt: gửi sau 200ms',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: dedup: khoa da gui, khong gui lan hai',
          match: 'contains',
          hidden: false,
          label: 'Khoá idempotent đã gửi: không gửi lần hai',
        },
        {
          stdinLines: [],
          expected: 'Ca 4: invalid: backoffMs',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: khoảng chờ 0ms là dữ liệu sai, không được coi là "gửi ngay"',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: send: con luot, cho 200ms roi gui\nCa 2: dedup: khoa da gui, khong gui lan hai\nCa 3: fail: het luot thu lai\nCa 4: invalid: backoffMs\nCa 5: invalid: khoa',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: cả năm ca đúng, gồm khoá chỉ toàn khoảng trắng',
        },
      ],
      hints: [
        'Viết từng nhánh theo đúng thứ tự trong đề — thứ tự chính là nội dung bài, đảo là sai dù mỗi luật riêng lẻ đều đúng.',
        'Khoá "   " không rỗng nhưng trim() xong thì rỗng. Ca 5 tồn tại đúng để bắt lỗi này.',
        'Nhánh cuối ghép chuỗi: "send: con luot, cho " + t.backoffMs + "ms roi gui". Số tự chuyển thành chuỗi khi nối bằng dấu cộng.',
      ],
      sampleSolution: `interface ThaoTac {
  khoa: string
  soLanDaThu: number
  maxRetries: number
  backoffMs: number
}

function quyetDinh(t: ThaoTac, daGui: string[]): string {
  if (t.khoa.trim() === "") return "invalid: khoa"
  if (t.maxRetries < 0) return "invalid: maxRetries"
  if (t.backoffMs <= 0) return "invalid: backoffMs"
  if (daGui.indexOf(t.khoa) >= 0) return "dedup: khoa da gui, khong gui lan hai"
  if (t.soLanDaThu >= t.maxRetries) return "fail: het luot thu lai"
  return "send: con luot, cho " + t.backoffMs + "ms roi gui"
}

// ---- Đừng sửa phần dưới đây ----
const daGui: string[] = ["don-88"]
console.log("Ca 1:", quyetDinh({ khoa: "don-90", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }, daGui))
console.log("Ca 2:", quyetDinh({ khoa: "don-88", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }, daGui))
console.log("Ca 3:", quyetDinh({ khoa: "don-91", soLanDaThu: 3, maxRetries: 3, backoffMs: 200 }, daGui))
console.log("Ca 4:", quyetDinh({ khoa: "don-92", soLanDaThu: 0, maxRetries: 3, backoffMs: 0 }, daGui))
console.log("Ca 5:", quyetDinh({ khoa: "   ", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }, daGui))`,
    },
    homework:
      'Mở một app đặt đồ ăn hoặc chuyển tiền. Bật chế độ máy bay ĐÚNG LÚC vừa bấm nút xác nhận, đợi 30 giây rồi tắt chế độ máy bay. Ghi lại: app báo gì lúc mất mạng, đơn có tự gửi lại khi có mạng không, và có bị TẠO HAI ĐƠN không. Nếu có hai đơn, app đó đang thiếu đúng nhánh dedup của bài này.',
    srsCards: [
      {
        hoi: 'Khoá idempotent trong hàng đợi thao tác offline giải quyết chuyện gì?',
        dap: 'Client sinh một khoá cho mỗi thao tác; server thấy khoá đã xử lý thì trả lại kết quả cũ thay vì tạo bản ghi mới. Không có nó thì mọi cơ chế thử lại đều trở thành máy nhân bản đơn hàng.',
      },
      {
        hoi: 'Vì sao nhánh chống trùng phải đứng TRƯỚC nhánh cạn lượt thử?',
        dap: 'Vì một thao tác đã gửi thành công nhưng cạn lượt sẽ bị báo thất bại, khiến người dùng bấm gửi lại lần nữa. Nhánh ngăn được hậu quả không đảo ngược luôn đứng trước trong cây quyết định.',
      },
      {
        hoi: 'Vì sao khoảng chờ giữa hai lần thử lại phải tăng dần thay vì cố định?',
        dap: 'Mạng vừa hồi thì hàng loạt máy cùng thử lại một lúc sẽ đánh sập chính server vừa sống lại. Backoff tăng dần trải các lần thử ra theo thời gian, và khoảng chờ bằng 0 là dữ liệu sai chứ không phải "gửi ngay".',
      },
    ],
  },
  {
    id: 'p6-u214-l2',
    unitId: 'p6-u214',
    language: 'typescript',
    title: 'Cả hàng đợi, không phải một thao tác — và cái bẫy hàng đợi rỗng',
    hook: 'Mạng có lại. App nhấp nháy "Đang đồng bộ..." rồi hiện "Đồng bộ xong" — trong khi hàng đợi rỗng từ đầu, chẳng có gì để gửi. Một thông báo vô nghĩa, nhưng nó cho thấy tầng hàng đợi đang không phân biệt được "không có việc" với "đã làm xong việc".',
    theory:
      'Bài trước quyết định số phận MỘT thao tác. Thực tế app luôn cầm cả một hàng đợi, và tầng hàng đợi có những quyết định riêng mà tầng thao tác không nhìn thấy.\n\nBa quyết định của tầng hàng đợi:\n\n- **offline** — chưa có mạng thì chưa làm gì cả. Quan trọng: KHÔNG xoá hàng đợi, không báo lỗi cho người dùng. Mất mạng là trạng thái bình thường của điện thoại, không phải sự cố.\n- **noop** — có mạng, nhưng hàng đợi rỗng. Đây là nhánh dễ quên nhất và cũng là nhánh bài này muốn đóng đinh: "không có gì để làm" phải là một quyết định TƯỜNG MINH, khác hẳn "đã làm xong". Lẫn hai cái là nguồn của thông báo giả, của số liệu đồng bộ sai, và tệ hơn là của vòng lặp đánh thức app mỗi phút để không làm gì.\n- **xu-ly** — có mạng và có việc: chạy luật của bài trước cho từng thao tác theo thứ tự vào trước ra trước.\n\nCòn một điều nữa về backoff. Khoảng chờ nhân đôi sau mỗi lần thất bại (200, 400, 800...) nhưng phải có TRẦN: không có trần thì đến lần thứ mười hai app sẽ hẹn thử lại sau vài tiếng, tức là thực tế không bao giờ gửi nữa. Hàm backoffTiepTheo ở bài này vì thế nhận cả trần và luôn trả về giá trị nằm trong khoảng hợp lệ — đó là nghĩa của "bounded": mọi con số sinh ra đều có chặn trên và chặn dưới biết trước.\n\nĐể ý là cả hai hàm đều TẤT ĐỊNH: cùng đầu vào cho cùng đầu ra, không đọc đồng hồ hệ thống, không random. Đây không phải để cho dễ chấm bài — đây là cách duy nhất để viết test hồi quy cho tầng đồng bộ. Đọc Date.now() ngay trong hàm quyết định thì test chỉ xanh vào đúng thời điểm nó được viết.',
    workedExample: {
      code: `interface ThaoTac {
  khoa: string
  soLanDaThu: number
  maxRetries: number
  backoffMs: number
}

// Tang hang doi: ba quyet dinh, "khong co gi de lam" la mot quyet dinh tuong minh.
function xuLyHangDoi(hangDoi: ThaoTac[], coMang: boolean): string {
  if (!coMang) return "offline: giu nguyen hang doi, khong bao loi"
  if (hangDoi.length === 0) return "noop: khong co gi de gui"
  return "xu-ly: " + hangDoi.length + " thao tac cho gui"
}

// Backoff nhan doi nhung CO TRAN — khong tran thi lan thu 12 hen sau vai tieng.
function backoffTiepTheo(hienTai: number, tran: number): number {
  const nhanDoi = hienTai * 2
  return nhanDoi > tran ? tran : nhanDoi
}

console.log(xuLyHangDoi([], true))
console.log(xuLyHangDoi([{ khoa: "don-1", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }], false))
console.log("Backoff:", backoffTiepTheo(200, 1000), backoffTiepTheo(800, 1000))`,
      stdinLines: [],
    },
    predict: {
      code: `function backoffTiepTheo(hienTai: number, tran: number): number {
  const nhanDoi = hienTai * 2
  return nhanDoi > tran ? tran : nhanDoi
}
let cho = 200
let dau = ""
for (let i = 0; i < 4; i++) {
  dau = dau + cho + " "
  cho = backoffTiepTheo(cho, 1000)
}
console.log("Chuoi cho: " + dau.trim())`,
      question: 'Bốn khoảng chờ đầu tiên, bắt đầu từ 200ms với trần 1000ms, in ra thế nào?',
      choices: [
        'Chuoi cho: 200 400 800 1000',
        'Chuoi cho: 200 400 800 1600',
        'Chuoi cho: 400 800 1000 1000',
        'Chuoi cho: 200 200 200 200',
      ],
      answerIndex: 0,
      explain:
        'Giá trị được ghi vào chuỗi TRƯỚC khi nhân đôi, nên số đầu tiên là 200. Sau đó 400, 800, rồi 1600 bị trần chặn lại còn 1000. Trần chính là thứ biến một dãy tăng vô hạn thành một dãy bị chặn — không có nó, lần thử thứ mười đã hẹn sau ba tiếng.',
    },
    parsons: {
      prompt:
        'Xếp lại hàm tầng hàng đợi: chưa có mạng thì dừng sớm, rỗng thì nói rõ là rỗng, còn lại mới xử lý.',
      lines: [
        'function xuLyHangDoi(hangDoi: ThaoTac[], coMang: boolean): string {',
        '  if (!coMang) return "offline: giu nguyen hang doi, khong bao loi"',
        '  if (hangDoi.length === 0) return "noop: khong co gi de gui"',
        '  return "xu-ly: " + hangDoi.length + " thao tac cho gui"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết hai hàm.\n\n1. xuLyHangDoi(hangDoi, coMang): trả về\n   - "offline: giu nguyen hang doi, khong bao loi" khi coMang là false\n   - "noop: khong co gi de gui" khi có mạng nhưng hàng đợi rỗng\n   - "xu-ly: <số> thao tac cho gui" khi có mạng và có việc\n\n2. backoffTiepTheo(hienTai, tran): nhân đôi hienTai, nhưng không vượt quá tran. Nếu tran <= 0 thì trả về 0 (tham số vô nghĩa thì không sinh khoảng chờ nào).\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface ThaoTac {
  khoa: string
  soLanDaThu: number
  maxRetries: number
  backoffMs: number
}

function xuLyHangDoi(hangDoi: ThaoTac[], coMang: boolean): string {
  // TODO: ba nhanh, "rong" phai la quyet dinh rieng
  return "noop: khong co gi de gui"
}

function backoffTiepTheo(hienTai: number, tran: number): number {
  // TODO: nhan doi nhung bi tran chan; tran <= 0 thi tra ve 0
  return hienTai
}

// ---- Đừng sửa phần dưới đây ----
const mot: ThaoTac = { khoa: "don-1", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }
console.log("Ca 1:", xuLyHangDoi([], true))
console.log("Ca 2:", xuLyHangDoi([mot], false))
console.log("Ca 3:", xuLyHangDoi([mot, mot], true))
console.log("Ca 4:", backoffTiepTheo(200, 1000))
console.log("Ca 5:", backoffTiepTheo(800, 1000))
console.log("Ca 6:", backoffTiepTheo(200, 0))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: noop: khong co gi de gui',
          match: 'contains',
          hidden: false,
          label: 'Có mạng, hàng đợi rỗng: nói rõ là không có gì để làm',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: offline: giu nguyen hang doi, khong bao loi',
          match: 'contains',
          hidden: false,
          label: 'Mất mạng: giữ nguyên hàng đợi, không coi là sự cố',
        },
        {
          stdinLines: [],
          expected: 'Ca 6: 0',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: trần vô nghĩa thì không sinh khoảng chờ nào',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: noop: khong co gi de gui\nCa 2: offline: giu nguyen hang doi, khong bao loi\nCa 3: xu-ly: 2 thao tac cho gui\nCa 4: 400\nCa 5: 1000\nCa 6: 0',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: cả sáu ca, gồm trần chặn 1600 xuống còn 1000',
        },
      ],
      hints: [
        'Nhánh !coMang phải đứng trước nhánh rỗng: chưa có mạng thì việc hàng đợi rỗng hay không chẳng đổi được gì.',
        'backoffTiepTheo: kiểm tran <= 0 trước, rồi mới tính nhân đôi và so với trần.',
        'Ca 5 là chỗ trần thật sự hoạt động: 800 * 2 = 1600 lớn hơn 1000 nên phải trả về 1000, không phải 1600.',
      ],
      sampleSolution: `interface ThaoTac {
  khoa: string
  soLanDaThu: number
  maxRetries: number
  backoffMs: number
}

function xuLyHangDoi(hangDoi: ThaoTac[], coMang: boolean): string {
  if (!coMang) return "offline: giu nguyen hang doi, khong bao loi"
  if (hangDoi.length === 0) return "noop: khong co gi de gui"
  return "xu-ly: " + hangDoi.length + " thao tac cho gui"
}

function backoffTiepTheo(hienTai: number, tran: number): number {
  if (tran <= 0) return 0
  const nhanDoi = hienTai * 2
  return nhanDoi > tran ? tran : nhanDoi
}

// ---- Đừng sửa phần dưới đây ----
const mot: ThaoTac = { khoa: "don-1", soLanDaThu: 0, maxRetries: 3, backoffMs: 200 }
console.log("Ca 1:", xuLyHangDoi([], true))
console.log("Ca 2:", xuLyHangDoi([mot], false))
console.log("Ca 3:", xuLyHangDoi([mot, mot], true))
console.log("Ca 4:", backoffTiepTheo(200, 1000))
console.log("Ca 5:", backoffTiepTheo(800, 1000))
console.log("Ca 6:", backoffTiepTheo(200, 0))`,
    },
    homework:
      'Chọn một app ghi chú có đồng bộ. Tạo ba ghi chú khi đang bật chế độ máy bay, rồi bật mạng lại và quan sát: app gửi cả ba cùng lúc hay lần lượt, có hiện trạng thái "chờ gửi" cho từng ghi chú không. Viết 5 câu mô tả bạn sẽ thiết kế màn hình "hàng đợi chờ gửi" thế nào cho người dùng thấy được việc gì chưa lên server — kể cả khi hàng đợi rỗng.',
    srsCards: [
      {
        hoi: 'Vì sao "hàng đợi rỗng" phải là một quyết định tường minh chứ không gộp vào "đã xong"?',
        dap: 'Gộp hai cái thì app báo đồng bộ thành công trong khi chẳng gửi gì, số liệu đồng bộ sai, và tệ nhất là app tự đánh thức định kỳ để không làm gì — hao pin mà không ai truy ra nguyên nhân.',
      },
      {
        hoi: 'Backoff nhân đôi mà không có trần thì hỏng ở chỗ nào?',
        dap: 'Khoảng chờ tăng theo cấp số nhân nên chỉ sau chục lần thất bại là hẹn lại sau vài tiếng, tức là thực tế không bao giờ gửi nữa. Trần biến dãy tăng vô hạn thành dãy bị chặn, giữ app còn thử lại trong thời gian có nghĩa.',
      },
      {
        hoi: 'Vì sao hàm quyết định đồng bộ không được đọc đồng hồ hệ thống bên trong?',
        dap: 'Đọc thời gian bên trong làm hàm mất tính tất định: cùng đầu vào cho kết quả khác nhau tuỳ lúc chạy, nên không viết được test hồi quy. Thời điểm phải là tham số truyền vào, do tầng gọi quyết định.',
      },
    ],
  },
]
