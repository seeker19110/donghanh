// lessons/p6u218.ts — P6-U218: HƯỚNG DI ĐỘNG, chặng S3 "Nâng cao — mượt, nhẹ, tiết kiệm pin" —
// Hiệu năng giao diện (module `mobile-s3-m1`).
//
// MÔ PHỎNG: ngân sách khung hình tính bằng TypeScript thuần, tất định. Không đo profiler thật,
// không dựng danh sách thật. Việc đo số khung rơi thật trên máy đời thấp nằm ở bài tập về nhà —
// con số trong bài là con số cho trước, không phải con số đo được.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U218_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u218-l1',
    unitId: 'p6-u218',
    language: 'typescript',
    title: 'Ngân sách 16 mili-giây — con số quyết định app mượt hay giật',
    hook: 'App chạy mượt trên máy của lập trình viên, giật như ảnh chụp trên máy của người dùng. Không phải vì code khác — mà vì một khung hình chỉ có 16 mili-giây để hoàn thành, và máy đời thấp làm cùng công việc đó mất 30.',
    theory:
      'Màn hình điện thoại vẽ lại 60 lần mỗi giây (nhiều máy mới là 120). Một giây có 1000 mili-giây, chia cho 60 được khoảng 16,6ms: đó là toàn bộ thời gian app có để dựng xong MỘT khung hình. Xong sớm thì khung hình kịp lên màn, muộn hơn dù chỉ một chút thì khung đó bị bỏ, và mắt người thấy ngay là giật.\n\nNgân sách 16ms chia cho ba việc nối tiếp nhau:\n\n- **build** — tính xem cần hiện cái gì (dựng cây giao diện, chạy logic trạng thái)\n- **layout** — tính vị trí và kích thước từng thành phần\n- **draw** — vẽ thật lên bề mặt\n\nBa việc này CỘNG lại, không phải chạy song song. Nên câu hỏi đúng không bao giờ là "hàm này nhanh không" mà là "tổng ba việc có nằm trong ngân sách không". Đây cũng là lý do một tối ưu nhỏ ở chỗ chiếm 1ms thì vô nghĩa, còn cắt được 8ms ở chỗ build thì cứu cả màn hình.\n\nMột điểm dễ hiểu nhầm và phải nói rõ: vượt ngân sách KHÔNG phải lỗi, không có exception nào ném ra, app vẫn chạy. Nó chỉ làm rơi khung hình. Chính vì im lặng như vậy mà nó phải được đo và gác bằng một con số rõ ràng — không đo thì không ai biết, cho tới khi người dùng viết đánh giá một sao.\n\nVà vì đây là bài về đo đạc, luật "thiếu dữ liệu thì không kết luận" đặc biệt quan trọng: nếu một trong ba số đo âm (mô phỏng cho việc chưa đo được), hàm phải trả về **unknown** chứ không được cộng bừa. Cộng một số âm vào tổng sẽ làm ngân sách trông như còn dư — một màn hình đang giật sẽ được báo là đạt.',
    workedExample: {
      code: `interface KhungHinh {
  buildMs: number
  layoutMs: number
  drawMs: number
}

const NGAN_SACH_MS = 16  // 1000ms / 60 khung ~ 16,6ms; lay 16 cho chac

function danhGiaKhung(k: KhungHinh): string {
  // Chua do duoc thi noi thang, cong bua so am se lam ngan sach trong nhu con du.
  if (k.buildMs < 0 || k.layoutMs < 0 || k.drawMs < 0) return "unknown: thieu so do"
  const tong = k.buildMs + k.layoutMs + k.drawMs
  if (tong > NGAN_SACH_MS) return "drop-frame: tong " + tong + "ms vuot ngan sach"
  return "allow: tong " + tong + "ms trong ngan sach"
}

console.log(danhGiaKhung({ buildMs: 4, layoutMs: 3, drawMs: 5 }))
console.log(danhGiaKhung({ buildMs: 12, layoutMs: 6, drawMs: 5 }))
console.log(danhGiaKhung({ buildMs: 8, layoutMs: 5, drawMs: 3 }))   // dung bang 16: van dat
console.log(danhGiaKhung({ buildMs: -1, layoutMs: 5, drawMs: 3 }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface KhungHinh {
  buildMs: number
  layoutMs: number
  drawMs: number
}
const NGAN_SACH_MS = 16
function danhGiaKhung(k: KhungHinh): string {
  if (k.buildMs < 0 || k.layoutMs < 0 || k.drawMs < 0) return "unknown: thieu so do"
  const tong = k.buildMs + k.layoutMs + k.drawMs
  if (tong > NGAN_SACH_MS) return "drop-frame: tong " + tong + "ms vuot ngan sach"
  return "allow: tong " + tong + "ms trong ngan sach"
}
console.log(danhGiaKhung({ buildMs: 8, layoutMs: 5, drawMs: 3 }))`,
      question: 'Tổng ba số đo đúng bằng 16ms. Kết quả là gì?',
      choices: [
        'allow: tong 16ms trong ngan sach',
        'drop-frame: tong 16ms vuot ngan sach',
        'unknown: thieu so do',
        'allow: tong 17ms trong ngan sach',
      ],
      answerIndex: 0,
      explain:
        'Điều kiện là tong > NGAN_SACH_MS, và 16 > 16 là sai nên rơi vào nhánh đạt. Đúng bằng ngân sách vẫn kịp lên màn hình: khung hình chỉ rơi khi VƯỢT quá, không phải khi chạm tới. Ở đây biên nghiêng về phía cho qua vì hậu quả là một khung hình, không phải một lỗ hổng.',
    },
    parsons: {
      prompt:
        'Xếp lại hàm đánh giá khung hình: chặn số đo thiếu trước, rồi cộng ba phần, rồi so ngân sách.',
      lines: [
        'function danhGiaKhung(k: KhungHinh): string {',
        '  if (k.buildMs < 0 || k.layoutMs < 0 || k.drawMs < 0) return "unknown: thieu so do"',
        '  const tong = k.buildMs + k.layoutMs + k.drawMs',
        '  if (tong > NGAN_SACH_MS) return "drop-frame: tong " + tong + "ms vuot ngan sach"',
        '  return "allow: tong " + tong + "ms trong ngan sach"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết danhGiaKhung(k) với ngân sách 16ms:\n\n1. bất kỳ số đo nào âm → "unknown: thieu so do"\n2. tổng ba số > 16 → "drop-frame: tong <tổng>ms vuot ngan sach"\n3. còn lại → "allow: tong <tổng>ms trong ngan sach"\n\nĐúng bằng 16 thì vẫn ĐẠT. Dùng starter code, đừng sửa phần dưới.',
      starterCode: `interface KhungHinh {
  buildMs: number
  layoutMs: number
  drawMs: number
}

const NGAN_SACH_MS = 16

function danhGiaKhung(k: KhungHinh): string {
  // TODO: chan so do thieu, cong ba phan, so voi ngan sach
  return "allow: tong 0ms trong ngan sach"
}

// ---- Đừng sửa phần dưới đây ----
console.log("Ca 1:", danhGiaKhung({ buildMs: 4, layoutMs: 3, drawMs: 5 }))
console.log("Ca 2:", danhGiaKhung({ buildMs: 12, layoutMs: 6, drawMs: 5 }))
console.log("Ca 3:", danhGiaKhung({ buildMs: 8, layoutMs: 5, drawMs: 3 }))
console.log("Ca 4:", danhGiaKhung({ buildMs: 9, layoutMs: 5, drawMs: 3 }))
console.log("Ca 5:", danhGiaKhung({ buildMs: -1, layoutMs: 5, drawMs: 3 }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 2: drop-frame: tong 23ms vuot ngan sach',
          match: 'contains',
          hidden: false,
          label: 'Vượt ngân sách: khung hình bị rơi',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: allow: tong 16ms trong ngan sach',
          match: 'contains',
          hidden: false,
          label: 'Ca biên: đúng bằng 16ms vẫn kịp lên màn hình',
        },
        {
          stdinLines: [],
          expected: 'Ca 5: unknown: thieu so do',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: số đo âm thì không cộng bừa, nói thẳng là chưa đo được',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: tong 12ms trong ngan sach\nCa 2: drop-frame: tong 23ms vuot ngan sach\nCa 3: allow: tong 16ms trong ngan sach\nCa 4: drop-frame: tong 17ms vuot ngan sach\nCa 5: unknown: thieu so do',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: năm ca, gồm hai ca sát biên 16 và 17',
        },
      ],
      hints: [
        'Kiểm ba số đo bằng một câu if với hai toán tử || — chỉ cần một số âm là đủ để không kết luận được.',
        'Ca 3 và Ca 4 chỉ cách nhau 1ms: dùng > chứ không phải >=, nếu không thì ca đúng bằng ngân sách sẽ bị báo rơi khung oan.',
        'Tính tổng vào một biến const rồi mới dùng — vừa dễ đọc vừa khỏi cộng lại hai lần khi ghép chuỗi.',
      ],
      sampleSolution: `interface KhungHinh {
  buildMs: number
  layoutMs: number
  drawMs: number
}

const NGAN_SACH_MS = 16

function danhGiaKhung(k: KhungHinh): string {
  if (k.buildMs < 0 || k.layoutMs < 0 || k.drawMs < 0) return "unknown: thieu so do"
  const tong = k.buildMs + k.layoutMs + k.drawMs
  if (tong > NGAN_SACH_MS) return "drop-frame: tong " + tong + "ms vuot ngan sach"
  return "allow: tong " + tong + "ms trong ngan sach"
}

// ---- Đừng sửa phần dưới đây ----
console.log("Ca 1:", danhGiaKhung({ buildMs: 4, layoutMs: 3, drawMs: 5 }))
console.log("Ca 2:", danhGiaKhung({ buildMs: 12, layoutMs: 6, drawMs: 5 }))
console.log("Ca 3:", danhGiaKhung({ buildMs: 8, layoutMs: 5, drawMs: 3 }))
console.log("Ca 4:", danhGiaKhung({ buildMs: 9, layoutMs: 5, drawMs: 3 }))
console.log("Ca 5:", danhGiaKhung({ buildMs: -1, layoutMs: 5, drawMs: 3 }))`,
    },
    homework:
      'Tìm một màn hình giật trong app bạn dùng hàng ngày (thường là danh sách dài có ảnh). Mượn hoặc tìm một máy đời thấp, mở đúng màn đó và cuộn nhanh. Ghi lại: giật ở đoạn nào, lúc ảnh đang tải hay lúc đã tải xong. Nếu có công cụ profiler của nền tảng, bật lên và ghi lại số khung rơi trong 10 giây cuộn — đó là con số thật mà mô phỏng trong bài không thay thế được.',
    srsCards: [
      {
        hoi: 'Con số 16ms trong hiệu năng giao diện di động đến từ đâu?',
        dap: 'Màn hình vẽ lại 60 lần mỗi giây, 1000ms chia cho 60 ra khoảng 16,6ms — đó là toàn bộ thời gian app có để dựng xong một khung hình trước khi khung đó bị bỏ.',
      },
      {
        hoi: 'Vì sao phải hỏi "tổng ba giai đoạn có trong ngân sách không" thay vì "hàm này nhanh không"?',
        dap: 'Vì build, layout và draw chạy nối tiếp nên thời gian cộng lại. Tối ưu chỗ chỉ chiếm 1ms thì vô nghĩa, còn cắt được vài ms ở giai đoạn nặng nhất mới cứu được cả màn hình.',
      },
      {
        hoi: 'Vượt ngân sách khung hình biểu hiện ra ngoài như thế nào?',
        dap: 'Không có lỗi nào được ném ra, app vẫn chạy, chỉ là khung hình đó bị bỏ và mắt người thấy giật. Vì nó im lặng như vậy nên phải đo và gác bằng một con số, không đo thì không ai biết.',
      },
    ],
  },
  {
    id: 'p6-u218-l2',
    unitId: 'p6-u218',
    language: 'typescript',
    title: 'Hai lỗi giết hiệu năng danh sách: không ảo hoá và giải mã ảnh trên luồng chính',
    hook: 'Danh sách 5000 sản phẩm. Màn hình chỉ hiện được 8 dòng, nhưng app dựng đủ cả 5000 — rồi giải mã 5000 tấm ảnh ngay trên luồng vẽ giao diện. App đứng hình 12 giây, hệ điều hành hỏi người dùng có muốn tắt app không.',
    theory:
      'Bài trước đo tổng thời gian. Bài này tìm NGUYÊN NHÂN, và với danh sách trên di động thì hai nguyên nhân sau chiếm phần lớn các ca:\n\n**1. Không ảo hoá danh sách.** Ảo hoá nghĩa là chỉ dựng những dòng đang nhìn thấy (cộng một ít đệm trên dưới), rồi TÁI SỬ DỤNG chính các ô đó khi cuộn. Đây là lý do mọi nền tảng đều có thành phần danh sách riêng thay vì bảo bạn lặp qua mảng: RecyclerView/LazyColumn trên Android, UITableView/List trên iOS, FlatList trên React Native. Dấu hiệu nhận ra trong mô phỏng của bài: số ô được dựng BẰNG tổng số phần tử. Với danh sách ngắn thì không sao, nhưng vượt một ngưỡng thì chắc chắn là lỗi kiến trúc màn hình, không phải chuyện tối ưu vi mô.\n\n**2. Giải mã ảnh trên luồng chính.** Một tấm JPEG 3 MB phải được giải nén thành bitmap trước khi vẽ, và việc đó tốn hàng chục mili-giây. Luồng chính là luồng DUY NHẤT được phép chạm giao diện, nên mọi mili-giây tiêu ở đó là mili-giây lấy thẳng từ ngân sách 16ms. Việc đúng là giải mã ở luồng nền rồi mới đưa bitmap đã sẵn sàng sang luồng chính — đúng như mọi thư viện tải ảnh nghiêm túc vẫn làm.\n\nThứ tự ưu tiên của hàm rà soát, và lý do của thứ tự:\n\n1. số đo thiếu → **unknown**\n2. giải mã ảnh trên luồng chính → **deny**\n3. danh sách dài mà không ảo hoá → **deny**\n4. tổng thời gian vượt ngân sách → **drop-frame**\n5. còn lại → **allow**\n\nHai nhánh deny đứng TRƯỚC drop-frame vì chúng là nguyên nhân, còn drop-frame chỉ là triệu chứng. Báo triệu chứng khi đã biết nguyên nhân thì người đọc báo cáo phải tự đi tìm lại — mà chính cái đi tìm lại đó mới là phần tốn thời gian nhất của việc sửa hiệu năng.',
    workedExample: {
      code: `interface ManDanhSach {
  buildMs: number
  layoutMs: number
  drawMs: number
  soODung: number            // so o that su duoc dung
  tongPhanTu: number         // tong so phan tu cua danh sach
  giaiMaAnhTrenLuongChinh: boolean
}

const NGAN_SACH_MS = 16
const NGUONG_DAI = 50  // duoi nguong nay thi dung du ca danh sach cung khong sao

function raSoat(m: ManDanhSach): string {
  if (m.buildMs < 0 || m.layoutMs < 0 || m.drawMs < 0) return "unknown: thieu so do"
  // Nguyen nhan bao truoc trieu chung: nguoi doc bao cao khoi phai di tim lai.
  if (m.giaiMaAnhTrenLuongChinh) return "deny: giai ma anh tren luong chinh"
  if (m.tongPhanTu > NGUONG_DAI && m.soODung >= m.tongPhanTu) return "deny: danh sach dai khong ao hoa"
  const tong = m.buildMs + m.layoutMs + m.drawMs
  if (tong > NGAN_SACH_MS) return "drop-frame: tong " + tong + "ms vuot ngan sach"
  return "allow: man hinh dat ngan sach"
}

const tot: ManDanhSach = { buildMs: 4, layoutMs: 3, drawMs: 5, soODung: 12, tongPhanTu: 5000, giaiMaAnhTrenLuongChinh: false }
console.log(raSoat(tot))
console.log(raSoat({ ...tot, soODung: 5000 }))
console.log(raSoat({ ...tot, giaiMaAnhTrenLuongChinh: true }))
console.log(raSoat({ ...tot, drawMs: 20 }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface ManDanhSach {
  buildMs: number
  layoutMs: number
  drawMs: number
  soODung: number
  tongPhanTu: number
  giaiMaAnhTrenLuongChinh: boolean
}
const NGAN_SACH_MS = 16
const NGUONG_DAI = 50
function raSoat(m: ManDanhSach): string {
  if (m.buildMs < 0 || m.layoutMs < 0 || m.drawMs < 0) return "unknown: thieu so do"
  if (m.giaiMaAnhTrenLuongChinh) return "deny: giai ma anh tren luong chinh"
  if (m.tongPhanTu > NGUONG_DAI && m.soODung >= m.tongPhanTu) return "deny: danh sach dai khong ao hoa"
  const tong = m.buildMs + m.layoutMs + m.drawMs
  if (tong > NGAN_SACH_MS) return "drop-frame: tong " + tong + "ms vuot ngan sach"
  return "allow: man hinh dat ngan sach"
}
console.log(raSoat({ buildMs: 30, layoutMs: 20, drawMs: 40, soODung: 5000, tongPhanTu: 5000, giaiMaAnhTrenLuongChinh: true }))`,
      question: 'Màn hình này mắc cả ba lỗi cùng lúc. Báo cáo in ra lỗi nào?',
      choices: [
        'deny: giai ma anh tren luong chinh',
        'deny: danh sach dai khong ao hoa',
        'drop-frame: tong 90ms vuot ngan sach',
        'allow: man hinh dat ngan sach',
      ],
      answerIndex: 0,
      explain:
        'Hàm trả về ở nhánh khớp đầu tiên, và thứ tự được xếp theo NGUYÊN NHÂN trước TRIỆU CHỨNG. Tổng 90ms là hậu quả của hai lỗi kia, nên báo nó trước chỉ khiến người sửa phải tự đi tìm lại nguyên nhân — phần tốn thời gian nhất của việc sửa hiệu năng.',
    },
    parsons: {
      prompt:
        'Xếp lại hàm rà soát màn danh sách: thiếu số đo, rồi hai nguyên nhân, rồi mới tới triệu chứng.',
      lines: [
        'function raSoat(m: ManDanhSach): string {',
        '  if (m.buildMs < 0 || m.layoutMs < 0 || m.drawMs < 0) return "unknown: thieu so do"',
        '  if (m.giaiMaAnhTrenLuongChinh) return "deny: giai ma anh tren luong chinh"',
        '  if (m.tongPhanTu > NGUONG_DAI && m.soODung >= m.tongPhanTu) return "deny: danh sach dai khong ao hoa"',
        '  const tong = m.buildMs + m.layoutMs + m.drawMs',
        '  if (tong > NGAN_SACH_MS) return "drop-frame: tong " + tong + "ms vuot ngan sach"',
        '  return "allow: man hinh dat ngan sach"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết raSoat(m) với NGAN_SACH_MS = 16 và NGUONG_DAI = 50, theo thứ tự:\n\n1. số đo nào âm → "unknown: thieu so do"\n2. giaiMaAnhTrenLuongChinh → "deny: giai ma anh tren luong chinh"\n3. tongPhanTu > 50 VÀ soODung >= tongPhanTu → "deny: danh sach dai khong ao hoa"\n4. tổng ba số đo > 16 → "drop-frame: tong <tổng>ms vuot ngan sach"\n5. còn lại → "allow: man hinh dat ngan sach"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface ManDanhSach {
  buildMs: number
  layoutMs: number
  drawMs: number
  soODung: number
  tongPhanTu: number
  giaiMaAnhTrenLuongChinh: boolean
}

const NGAN_SACH_MS = 16
const NGUONG_DAI = 50

function raSoat(m: ManDanhSach): string {
  // TODO: nam nhanh, nguyen nhan truoc trieu chung
  return "allow: man hinh dat ngan sach"
}

// ---- Đừng sửa phần dưới đây ----
const tot: ManDanhSach = { buildMs: 4, layoutMs: 3, drawMs: 5, soODung: 12, tongPhanTu: 5000, giaiMaAnhTrenLuongChinh: false }
console.log("Ca 1:", raSoat(tot))
console.log("Ca 2:", raSoat({ ...tot, soODung: 5000 }))
console.log("Ca 3:", raSoat({ ...tot, giaiMaAnhTrenLuongChinh: true }))
console.log("Ca 4:", raSoat({ ...tot, drawMs: 20 }))
console.log("Ca 5:", raSoat({ ...tot, soODung: 20, tongPhanTu: 20 }))
console.log("Ca 6:", raSoat({ ...tot, layoutMs: -3 }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 2: deny: danh sach dai khong ao hoa',
          match: 'contains',
          hidden: false,
          label: 'Dựng đủ 5000 ô cho 5000 phần tử: lỗi kiến trúc màn hình',
        },
        {
          stdinLines: [],
          expected: 'Ca 5: allow: man hinh dat ngan sach',
          match: 'contains',
          hidden: false,
          label: 'Danh sách NGẮN dựng đủ thì không sao — ngưỡng tồn tại vì lý do này',
        },
        {
          stdinLines: [],
          expected: 'Ca 6: unknown: thieu so do',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: số đo âm chặn trước mọi kết luận khác',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: man hinh dat ngan sach\nCa 2: deny: danh sach dai khong ao hoa\nCa 3: deny: giai ma anh tren luong chinh\nCa 4: drop-frame: tong 27ms vuot ngan sach\nCa 5: allow: man hinh dat ngan sach\nCa 6: unknown: thieu so do',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: cả sáu ca, gồm ca danh sách ngắn không bị chặn',
        },
      ],
      hints: [
        'Nhánh không ảo hoá cần HAI điều kiện ghép bằng &&: danh sách phải dài hơn ngưỡng VÀ số ô dựng phải bằng tổng phần tử.',
        'Ca 5 là ca dễ làm sai nhất: danh sách 20 phần tử dựng đủ 20 ô vẫn hợp lệ, vì 20 không lớn hơn ngưỡng 50.',
        'Giữ đúng thứ tự năm nhánh — Ca 3 có cả ảnh trên luồng chính lẫn danh sách 5000 phần tử ảo hoá tốt, nên chỉ nhánh ảnh mới khớp.',
      ],
      sampleSolution: `interface ManDanhSach {
  buildMs: number
  layoutMs: number
  drawMs: number
  soODung: number
  tongPhanTu: number
  giaiMaAnhTrenLuongChinh: boolean
}

const NGAN_SACH_MS = 16
const NGUONG_DAI = 50

function raSoat(m: ManDanhSach): string {
  if (m.buildMs < 0 || m.layoutMs < 0 || m.drawMs < 0) return "unknown: thieu so do"
  if (m.giaiMaAnhTrenLuongChinh) return "deny: giai ma anh tren luong chinh"
  if (m.tongPhanTu > NGUONG_DAI && m.soODung >= m.tongPhanTu) return "deny: danh sach dai khong ao hoa"
  const tong = m.buildMs + m.layoutMs + m.drawMs
  if (tong > NGAN_SACH_MS) return "drop-frame: tong " + tong + "ms vuot ngan sach"
  return "allow: man hinh dat ngan sach"
}

// ---- Đừng sửa phần dưới đây ----
const tot: ManDanhSach = { buildMs: 4, layoutMs: 3, drawMs: 5, soODung: 12, tongPhanTu: 5000, giaiMaAnhTrenLuongChinh: false }
console.log("Ca 1:", raSoat(tot))
console.log("Ca 2:", raSoat({ ...tot, soODung: 5000 }))
console.log("Ca 3:", raSoat({ ...tot, giaiMaAnhTrenLuongChinh: true }))
console.log("Ca 4:", raSoat({ ...tot, drawMs: 20 }))
console.log("Ca 5:", raSoat({ ...tot, soODung: 20, tongPhanTu: 20 }))
console.log("Ca 6:", raSoat({ ...tot, layoutMs: -3 }))`,
    },
    homework:
      'Mở một app thương mại điện tử và cuộn thật nhanh qua danh sách sản phẩm dài. Quan sát: ô ảnh hiện ngay hay hiện khung xám rồi mới có ảnh (khung xám là dấu hiệu tốt — ảnh đang được tải và giải mã ở luồng nền). Viết 5 câu: nếu phải dựng màn hình đó, bạn sẽ giới hạn số ô dựng cùng lúc thế nào, và hiện gì trong lúc ảnh chưa sẵn sàng.',
    srsCards: [
      {
        hoi: 'Ảo hoá danh sách nghĩa là làm gì?',
        dap: 'Chỉ dựng những dòng đang nhìn thấy cộng một ít đệm trên dưới, rồi tái sử dụng chính các ô đó khi cuộn. Đó là lý do mọi nền tảng đều có thành phần danh sách riêng thay vì để bạn tự lặp qua mảng.',
      },
      {
        hoi: 'Vì sao giải mã ảnh trên luồng chính lại phá ngân sách khung hình?',
        dap: 'Giải nén một ảnh thành bitmap tốn hàng chục mili-giây, mà luồng chính là luồng duy nhất được chạm giao diện, nên thời gian đó lấy thẳng từ 16ms của khung hình. Phải giải mã ở luồng nền rồi mới đưa bitmap sẵn sàng sang.',
      },
      {
        hoi: 'Vì sao báo cáo hiệu năng phải xếp nguyên nhân trước triệu chứng?',
        dap: 'Vì tổng thời gian vượt ngân sách chỉ là hậu quả; báo nó trước khiến người sửa phải tự đi tìm lại nguyên nhân, mà đó mới là phần tốn thời gian nhất của việc sửa hiệu năng.',
      },
    ],
  },
]
