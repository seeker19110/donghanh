// lessons/p6u217.ts — P6-U217: HƯỚNG DI ĐỘNG, chặng S2 — Kiểm thử và phát hành thử
// (module `mobile-s2-m4`).
//
// MÔ PHỎNG: cổng phát hành thử viết bằng TypeScript thuần, tất định. Không gọi App Store
// Connect, Play Console hay Fastlane thật. Việc nộp bản thử thật lên TestFlight/Internal
// testing và mời người ngoài cài nằm ở bài tập về nhà.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U217_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u217-l1',
    unitId: 'p6-u217',
    language: 'typescript',
    title: 'Cổng phát hành thử — chặn cái gì, cảnh báo cái gì',
    hook: 'Bản thử đã gửi đi, 40 người cài. Hai ngày sau mới phát hiện nó ký bằng khoá gỡ lỗi nên không thể nâng cấp lên bản chính thức — cả 40 người phải gỡ cài lại từ đầu. Một câu kiểm tự động ba dòng đã chặn được chuyện đó trước khi gửi.',
    theory:
      'Phát hành thử (TestFlight của Apple, Internal/Closed testing của Google) là bước duy nhất còn đứng giữa code và người dùng thật. Nó phải có một CỔNG tự động, vì con người sẽ quên đúng vào hôm vội nhất.\n\nCổng phân loại điều kiện thành hai nhóm khác hẳn nhau, và phân biệt được hai nhóm này mới là nội dung bài:\n\n- **Điều kiện CHẶN (reject)** — sai là không thể sửa sau khi đã phát, hoặc sửa được nhưng phải trả giá bằng người dùng. Hai ví dụ kinh điển: thiếu chữ ký phát hành (bản ký khoá gỡ lỗi không nâng cấp được, người dùng phải gỡ cài) và versionCode không tăng so với bản trước (chợ ứng dụng từ chối, hoặc tệ hơn là máy người dùng không nhận ra có bản mới).\n- **Điều kiện CẢNH BÁO (warn)** — thiếu thì chất lượng kém đi nhưng không hỏng gì không đảo ngược được. Ghi chú thay đổi là ví dụ: thiếu nó thì người thử không biết cần thử cái gì, nhưng bản build vẫn cài được, vẫn nâng cấp được, và bổ sung ghi chú sau vẫn kịp.\n\nNhầm hai nhóm này theo cả hai hướng đều hại. Chặn cả những thứ đáng cảnh báo thì đội ngũ sẽ học cách bỏ qua cổng (thêm cờ --force vào script, và từ đó cổng thành đồ trang trí). Cảnh báo cả những thứ đáng chặn thì cổng không cứu được ai.\n\nSố người thử tối thiểu cũng là điều kiện chặn, nhưng vì lý do khác: một bản thử chỉ có hai người cài thì kết quả "không ai báo lỗi" chẳng nói lên điều gì — không phải bằng chứng về chất lượng mà là thiếu dữ liệu. Cổng chặn ở đây để ngăn việc lấy sự im lặng làm bằng chứng.\n\nThứ tự: mọi nhánh reject xét trước, warn chỉ được xét khi đã sạch hết điều kiện chặn, và allow là nhánh cuối. Lý do: một bản build vừa thiếu chữ ký vừa thiếu ghi chú thì thứ cần nói với người phát hành là "thiếu chữ ký", không phải một lời nhắc nhỏ về ghi chú.',
    workedExample: {
      code: `interface BanThu {
  coChuKyPhatHanh: boolean
  versionCode: number
  versionTruoc: number
  soNguoiThu: number
  nguongNguoiThu: number
  ghiChu: string
}

function congPhatHanh(b: BanThu): string {
  if (!b.coChuKyPhatHanh) return "reject: thieu chu ky phat hanh"            // khong nang cap duoc
  if (b.versionCode <= b.versionTruoc) return "reject: versionCode khong tang"
  if (b.soNguoiThu < b.nguongNguoiThu) return "reject: chua du nguoi thu"    // im lang khong phai bang chung
  if (b.ghiChu.trim() === "") return "warn: thieu ghi chu thay doi, van cho qua"
  return "allow: du dieu kien phat hanh thu"
}

const tot: BanThu = { coChuKyPhatHanh: true, versionCode: 12, versionTruoc: 11, soNguoiThu: 8, nguongNguoiThu: 5, ghiChu: "sua man dang nhap" }
console.log(congPhatHanh(tot))
console.log(congPhatHanh({ ...tot, ghiChu: "" }))
console.log(congPhatHanh({ ...tot, versionCode: 11 }))
console.log(congPhatHanh({ ...tot, coChuKyPhatHanh: false, ghiChu: "" }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface BanThu {
  coChuKyPhatHanh: boolean
  versionCode: number
  versionTruoc: number
  soNguoiThu: number
  nguongNguoiThu: number
  ghiChu: string
}
function congPhatHanh(b: BanThu): string {
  if (!b.coChuKyPhatHanh) return "reject: thieu chu ky phat hanh"
  if (b.versionCode <= b.versionTruoc) return "reject: versionCode khong tang"
  if (b.soNguoiThu < b.nguongNguoiThu) return "reject: chua du nguoi thu"
  if (b.ghiChu.trim() === "") return "warn: thieu ghi chu thay doi, van cho qua"
  return "allow: du dieu kien phat hanh thu"
}
console.log(congPhatHanh({ coChuKyPhatHanh: false, versionCode: 11, versionTruoc: 11, soNguoiThu: 1, nguongNguoiThu: 5, ghiChu: "" }))`,
      question: 'Bản build này sai CẢ BỐN điều kiện. Dòng duy nhất in ra là gì?',
      choices: [
        'reject: thieu chu ky phat hanh',
        'reject: versionCode khong tang',
        'reject: chua du nguoi thu',
        'warn: thieu ghi chu thay doi, van cho qua',
      ],
      answerIndex: 0,
      explain:
        'Hàm trả về ngay ở nhánh đầu tiên khớp, nên chỉ báo lỗi đầu tiên theo thứ tự ưu tiên. Đó là đánh đổi có ý thức: báo một lỗi quan trọng nhất thì người phát hành biết làm gì tiếp, còn muốn thấy đủ cả bốn thì phải đổi thiết kế sang trả về một DANH SÁCH vi phạm — đúng việc của bài sau.',
    },
    parsons: {
      prompt:
        'Xếp lại cổng phát hành thử: ba điều kiện chặn trước, cảnh báo sau, cho qua cuối cùng.',
      lines: [
        'function congPhatHanh(b: BanThu): string {',
        '  if (!b.coChuKyPhatHanh) return "reject: thieu chu ky phat hanh"',
        '  if (b.versionCode <= b.versionTruoc) return "reject: versionCode khong tang"',
        '  if (b.soNguoiThu < b.nguongNguoiThu) return "reject: chua du nguoi thu"',
        '  if (b.ghiChu.trim() === "") return "warn: thieu ghi chu thay doi, van cho qua"',
        '  return "allow: du dieu kien phat hanh thu"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết congPhatHanh(b) trả về đúng một dòng, theo thứ tự:\n\n1. không có chữ ký phát hành → "reject: thieu chu ky phat hanh"\n2. versionCode <= versionTruoc → "reject: versionCode khong tang"\n3. soNguoiThu < nguongNguoiThu → "reject: chua du nguoi thu"\n4. ghiChu rỗng sau trim → "warn: thieu ghi chu thay doi, van cho qua"\n5. còn lại → "allow: du dieu kien phat hanh thu"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface BanThu {
  coChuKyPhatHanh: boolean
  versionCode: number
  versionTruoc: number
  soNguoiThu: number
  nguongNguoiThu: number
  ghiChu: string
}

function congPhatHanh(b: BanThu): string {
  // TODO: ba nhanh reject, mot nhanh warn, roi allow
  return "allow: du dieu kien phat hanh thu"
}

// ---- Đừng sửa phần dưới đây ----
const tot: BanThu = { coChuKyPhatHanh: true, versionCode: 12, versionTruoc: 11, soNguoiThu: 8, nguongNguoiThu: 5, ghiChu: "sua man dang nhap" }
console.log("Ca 1:", congPhatHanh(tot))
console.log("Ca 2:", congPhatHanh({ ...tot, ghiChu: "   " }))
console.log("Ca 3:", congPhatHanh({ ...tot, versionCode: 11 }))
console.log("Ca 4:", congPhatHanh({ ...tot, soNguoiThu: 2 }))
console.log("Ca 5:", congPhatHanh({ ...tot, coChuKyPhatHanh: false, ghiChu: "" }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: allow: du dieu kien phat hanh thu',
          match: 'contains',
          hidden: false,
          label: 'Đủ điều kiện: cho phát hành thử',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: warn: thieu ghi chu thay doi, van cho qua',
          match: 'contains',
          hidden: false,
          label: 'Thiếu ghi chú: chỉ cảnh báo, KHÔNG chặn',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: reject: versionCode khong tang',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: versionCode bằng bản trước là chặn, không phải cảnh báo',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: du dieu kien phat hanh thu\nCa 2: warn: thieu ghi chu thay doi, van cho qua\nCa 3: reject: versionCode khong tang\nCa 4: reject: chua du nguoi thu\nCa 5: reject: thieu chu ky phat hanh',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: cả năm ca, gồm ca sai nhiều điều kiện cùng lúc',
        },
      ],
      hints: [
        'versionCode phải TĂNG, nên điều kiện chặn là <= chứ không phải <. Ca 3 dùng đúng giá trị bằng nhau để bắt lỗi này.',
        'Ghi chú "   " không rỗng nhưng trim() xong thì rỗng — Ca 2 kiểm đúng chỗ đó.',
        'Ba nhánh reject phải đứng trước nhánh warn: một bản build vừa thiếu chữ ký vừa thiếu ghi chú thì thứ cần báo là thiếu chữ ký.',
      ],
      sampleSolution: `interface BanThu {
  coChuKyPhatHanh: boolean
  versionCode: number
  versionTruoc: number
  soNguoiThu: number
  nguongNguoiThu: number
  ghiChu: string
}

function congPhatHanh(b: BanThu): string {
  if (!b.coChuKyPhatHanh) return "reject: thieu chu ky phat hanh"
  if (b.versionCode <= b.versionTruoc) return "reject: versionCode khong tang"
  if (b.soNguoiThu < b.nguongNguoiThu) return "reject: chua du nguoi thu"
  if (b.ghiChu.trim() === "") return "warn: thieu ghi chu thay doi, van cho qua"
  return "allow: du dieu kien phat hanh thu"
}

// ---- Đừng sửa phần dưới đây ----
const tot: BanThu = { coChuKyPhatHanh: true, versionCode: 12, versionTruoc: 11, soNguoiThu: 8, nguongNguoiThu: 5, ghiChu: "sua man dang nhap" }
console.log("Ca 1:", congPhatHanh(tot))
console.log("Ca 2:", congPhatHanh({ ...tot, ghiChu: "   " }))
console.log("Ca 3:", congPhatHanh({ ...tot, versionCode: 11 }))
console.log("Ca 4:", congPhatHanh({ ...tot, soNguoiThu: 2 }))
console.log("Ca 5:", congPhatHanh({ ...tot, coChuKyPhatHanh: false, ghiChu: "" }))`,
    },
    homework:
      'Lấy một dự án bất kỳ bạn đang làm và viết ra danh sách điều kiện phát hành của nó, chia làm hai cột: CHẶN và CẢNH BÁO. Với mỗi dòng ở cột CHẶN, viết một câu trả lời cho "nếu lọt qua thì hậu quả không đảo ngược được là gì". Dòng nào không trả lời được thì nó thuộc cột cảnh báo, không phải cột chặn.',
    srsCards: [
      {
        hoi: 'Điều gì phân biệt một điều kiện CHẶN với một điều kiện CẢNH BÁO ở cổng phát hành?',
        dap: 'Chặn dành cho thứ mà lọt qua rồi thì không sửa được, hoặc sửa được nhưng phải trả giá bằng người dùng; cảnh báo dành cho thứ làm chất lượng kém đi nhưng bổ sung sau vẫn kịp và không hỏng gì không đảo ngược.',
      },
      {
        hoi: 'Chặn quá tay ở cổng phát hành dẫn tới hậu quả gì?',
        dap: 'Đội ngũ học cách đi vòng qua cổng, thường bằng một cờ bỏ qua thêm vào script, và từ đó cổng trở thành đồ trang trí không cứu được ai — hại không kém việc cảnh báo những thứ đáng chặn.',
      },
      {
        hoi: 'Vì sao số người thử tối thiểu lại là điều kiện chặn?',
        dap: 'Vì với quá ít người cài, việc không ai báo lỗi là thiếu dữ liệu chứ không phải bằng chứng về chất lượng. Cổng chặn ở đây để ngăn lấy sự im lặng làm bằng chứng đã kiểm thử xong.',
      },
    ],
  },
  {
    id: 'p6-u217-l2',
    unitId: 'p6-u217',
    language: 'typescript',
    title: 'Trả về DANH SÁCH vi phạm — báo cáo sửa được trong một lượt',
    hook: 'Chạy cổng: "thiếu chữ ký". Sửa, chạy lại: "versionCode không tăng". Sửa, chạy lại: "chưa đủ người thử". Ba vòng, mỗi vòng một lần build 12 phút. Cổng đúng nhưng cách báo cáo của nó đang đốt cả buổi chiều.',
    theory:
      'Bài trước dừng ở vi phạm đầu tiên. Cách đó đúng khi ta cần MỘT quyết định, nhưng sai khi ta cần một BÁO CÁO. Với cổng phát hành, mỗi lượt chạy tốn một lần build, nên phải gom hết vi phạm trong một lượt.\n\nKhuôn viết lại, vẫn tất định và vẫn bounded:\n\n1. Duyệt qua toàn bộ luật, gom mã vi phạm vào một mảng (không return sớm).\n2. Phân loại: có vi phạm loại chặn thì kết quả là **reject**; không có chặn nhưng có cảnh báo thì **warn**; sạch thì **allow**.\n3. In ra quyết định KÈM danh sách mã vi phạm theo thứ tự cố định — thứ tự cố định là điều kiện để output so sánh được giữa hai lần chạy, tức là để viết test được.\n\nMột luật nữa, quan trọng hơn vẻ ngoài của nó: dữ liệu thiếu KHÔNG được coi là đạt. Nếu nguongNguoiThu chưa được cấu hình (ở đây mô phỏng bằng số âm), ta không biết ngưỡng là bao nhiêu, nên không kết luận được "đủ người thử". Trường hợp đó phải ra **unknown** — một nhãn riêng nói thẳng là chưa đủ dữ liệu để kết luận. Cách xử lý sai mà rất phổ biến: coi ngưỡng chưa cấu hình là 0 và thế là mọi bản build đều "đủ người thử". Cổng khi đó vẫn xanh, vẫn chạy, và không còn kiểm gì nữa — hỏng im lặng, loại hỏng tệ nhất.\n\nThứ tự ưu tiên cuối cùng: unknown (thiếu dữ liệu) đứng TRƯỚC reject, vì khi chưa biết đủ thứ để phán thì phán "từ chối" cũng là một khẳng định không có cơ sở. Nói "tôi chưa đủ dữ liệu" luôn trung thực hơn, và nó chỉ đúng chỗ cần sửa: đi cấu hình ngưỡng.',
    workedExample: {
      code: `interface BanThu {
  coChuKyPhatHanh: boolean
  versionCode: number
  versionTruoc: number
  soNguoiThu: number
  nguongNguoiThu: number
  ghiChu: string
}

function ketLuan(b: BanThu): string {
  // Thieu du lieu de ket luan thi noi thang, KHONG suy dien thanh "dat".
  if (b.nguongNguoiThu < 0) return "unknown: chua cau hinh nguong nguoi thu"

  const chan: string[] = []
  const canhBao: string[] = []
  if (!b.coChuKyPhatHanh) chan.push("chu-ky")
  if (b.versionCode <= b.versionTruoc) chan.push("version-code")
  if (b.soNguoiThu < b.nguongNguoiThu) chan.push("nguoi-thu")
  if (b.ghiChu.trim() === "") canhBao.push("ghi-chu")

  if (chan.length > 0) return "reject: " + chan.join(",")
  if (canhBao.length > 0) return "warn: " + canhBao.join(",")
  return "allow: sach"
}

const tot: BanThu = { coChuKyPhatHanh: true, versionCode: 12, versionTruoc: 11, soNguoiThu: 8, nguongNguoiThu: 5, ghiChu: "sua man dang nhap" }
console.log(ketLuan(tot))
console.log(ketLuan({ ...tot, coChuKyPhatHanh: false, versionCode: 11, ghiChu: "" }))
console.log(ketLuan({ ...tot, nguongNguoiThu: -1 }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface BanThu {
  coChuKyPhatHanh: boolean
  versionCode: number
  versionTruoc: number
  soNguoiThu: number
  nguongNguoiThu: number
  ghiChu: string
}
function ketLuan(b: BanThu): string {
  if (b.nguongNguoiThu < 0) return "unknown: chua cau hinh nguong nguoi thu"
  const chan: string[] = []
  const canhBao: string[] = []
  if (!b.coChuKyPhatHanh) chan.push("chu-ky")
  if (b.versionCode <= b.versionTruoc) chan.push("version-code")
  if (b.soNguoiThu < b.nguongNguoiThu) chan.push("nguoi-thu")
  if (b.ghiChu.trim() === "") canhBao.push("ghi-chu")
  if (chan.length > 0) return "reject: " + chan.join(",")
  if (canhBao.length > 0) return "warn: " + canhBao.join(",")
  return "allow: sach"
}
console.log(ketLuan({ coChuKyPhatHanh: false, versionCode: 11, versionTruoc: 11, soNguoiThu: 1, nguongNguoiThu: -1, ghiChu: "" }))`,
      question: 'Bản build sai mọi điều kiện, NHƯNG ngưỡng người thử chưa được cấu hình. In ra gì?',
      choices: [
        'unknown: chua cau hinh nguong nguoi thu',
        'reject: chu-ky,version-code,nguoi-thu',
        'reject: chu-ky,version-code',
        'warn: ghi-chu',
      ],
      answerIndex: 0,
      explain:
        'Nhánh unknown đứng đầu và trả về ngay, nên mọi luật phía sau không chạy. Đó là chủ ý: chưa cấu hình đủ thì phán "từ chối" cũng là khẳng định không có cơ sở, và nó chỉ sai chỗ — chỗ cần sửa là đi cấu hình ngưỡng, không phải đi sửa bản build.',
    },
    parsons: {
      prompt:
        'Xếp lại hàm gom vi phạm: chặn thiếu dữ liệu trước, gom hai danh sách, rồi phân loại kết quả.',
      lines: [
        'function ketLuan(b: BanThu): string {',
        '  if (b.nguongNguoiThu < 0) return "unknown: chua cau hinh nguong nguoi thu"',
        '  const chan: string[] = []',
        '  const canhBao: string[] = []',
        '  if (!b.coChuKyPhatHanh) chan.push("chu-ky")',
        '  if (b.ghiChu.trim() === "") canhBao.push("ghi-chu")',
        '  if (chan.length > 0) return "reject: " + chan.join(",")',
        '  if (canhBao.length > 0) return "warn: " + canhBao.join(",")',
        '  return "allow: sach"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết ketLuan(b) gom HẾT vi phạm trong một lượt.\n\n1. nguongNguoiThu < 0 → "unknown: chua cau hinh nguong nguoi thu" (trả về ngay)\n2. Gom mã vào mảng chặn theo ĐÚNG thứ tự: "chu-ky" (thiếu chữ ký), "version-code" (versionCode <= versionTruoc), "nguoi-thu" (soNguoiThu < nguongNguoiThu)\n3. Gom mã "ghi-chu" vào mảng cảnh báo khi ghiChu rỗng sau trim\n4. chặn không rỗng → "reject: " + nối bằng dấu phẩy\n5. cảnh báo không rỗng → "warn: " + nối bằng dấu phẩy\n6. sạch → "allow: sach"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface BanThu {
  coChuKyPhatHanh: boolean
  versionCode: number
  versionTruoc: number
  soNguoiThu: number
  nguongNguoiThu: number
  ghiChu: string
}

function ketLuan(b: BanThu): string {
  // TODO: chan thieu du lieu truoc, roi gom hai danh sach, roi phan loai
  return "allow: sach"
}

// ---- Đừng sửa phần dưới đây ----
const tot: BanThu = { coChuKyPhatHanh: true, versionCode: 12, versionTruoc: 11, soNguoiThu: 8, nguongNguoiThu: 5, ghiChu: "sua man dang nhap" }
console.log("Ca 1:", ketLuan(tot))
console.log("Ca 2:", ketLuan({ ...tot, ghiChu: "" }))
console.log("Ca 3:", ketLuan({ ...tot, coChuKyPhatHanh: false, versionCode: 11, ghiChu: "" }))
console.log("Ca 4:", ketLuan({ ...tot, soNguoiThu: 2 }))
console.log("Ca 5:", ketLuan({ ...tot, nguongNguoiThu: -1 }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 3: reject: chu-ky,version-code',
          match: 'contains',
          hidden: false,
          label: 'Hai vi phạm chặn gom trong MỘT lượt, đúng thứ tự cố định',
        },
        {
          stdinLines: [],
          expected: 'Ca 5: unknown: chua cau hinh nguong nguoi thu',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: thiếu dữ liệu thì nói thẳng, không suy diễn thành đạt',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: warn: ghi-chu',
          match: 'contains',
          hidden: false,
          label: 'Chỉ có cảnh báo: không lẫn sang reject',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: sach\nCa 2: warn: ghi-chu\nCa 3: reject: chu-ky,version-code\nCa 4: reject: nguoi-thu\nCa 5: unknown: chua cau hinh nguong nguoi thu',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: cả năm kết luận của cổng',
        },
      ],
      hints: [
        'Đừng return sớm trong phần gom: dùng push để nhét mã vào mảng rồi mới phân loại ở cuối.',
        'Ca 3 có cả vi phạm chặn lẫn cảnh báo nhưng chỉ in phần reject — cảnh báo bị che khi đã có chặn, đúng như đề.',
        'Thứ tự trong mảng chặn phải cố định (chu-ky, version-code, nguoi-thu) thì output mới so sánh được giữa hai lần chạy.',
      ],
      sampleSolution: `interface BanThu {
  coChuKyPhatHanh: boolean
  versionCode: number
  versionTruoc: number
  soNguoiThu: number
  nguongNguoiThu: number
  ghiChu: string
}

function ketLuan(b: BanThu): string {
  if (b.nguongNguoiThu < 0) return "unknown: chua cau hinh nguong nguoi thu"

  const chan: string[] = []
  const canhBao: string[] = []
  if (!b.coChuKyPhatHanh) chan.push("chu-ky")
  if (b.versionCode <= b.versionTruoc) chan.push("version-code")
  if (b.soNguoiThu < b.nguongNguoiThu) chan.push("nguoi-thu")
  if (b.ghiChu.trim() === "") canhBao.push("ghi-chu")

  if (chan.length > 0) return "reject: " + chan.join(",")
  if (canhBao.length > 0) return "warn: " + canhBao.join(",")
  return "allow: sach"
}

// ---- Đừng sửa phần dưới đây ----
const tot: BanThu = { coChuKyPhatHanh: true, versionCode: 12, versionTruoc: 11, soNguoiThu: 8, nguongNguoiThu: 5, ghiChu: "sua man dang nhap" }
console.log("Ca 1:", ketLuan(tot))
console.log("Ca 2:", ketLuan({ ...tot, ghiChu: "" }))
console.log("Ca 3:", ketLuan({ ...tot, coChuKyPhatHanh: false, versionCode: 11, ghiChu: "" }))
console.log("Ca 4:", ketLuan({ ...tot, soNguoiThu: 2 }))
console.log("Ca 5:", ketLuan({ ...tot, nguongNguoiThu: -1 }))`,
    },
    homework:
      'Nộp một bản thử THẬT lên TestFlight hoặc Internal testing của Play Console (bản build gỡ lỗi cũng được, miễn là ký đúng khoá phát hành). Mời ít nhất 5 người ngoài cài, ghi lại: mỗi người mất bao lâu từ lúc nhận lời mời tới lúc mở được app, kẹt ở bước nào. Đó là dữ liệu mà không cổng tự động nào cho bạn được.',
    srsCards: [
      {
        hoi: 'Khi nào nên gom hết vi phạm thay vì dừng ở vi phạm đầu tiên?',
        dap: 'Khi mỗi lượt chạy tốn nhiều thời gian, như cổng phát hành phải build lại mỗi lần. Dừng sớm hợp cho một quyết định, còn gom hết hợp cho một báo cáo sửa được trong một lượt.',
      },
      {
        hoi: 'Vì sao nhãn "chưa đủ dữ liệu" phải đứng trước cả nhãn từ chối?',
        dap: 'Vì khi chưa biết đủ để phán thì phán từ chối cũng là khẳng định không có cơ sở và chỉ sai chỗ cần sửa. Nói thẳng là thiếu dữ liệu dẫn người ta đi cấu hình ngưỡng thay vì đi sửa bản build.',
      },
      {
        hoi: 'Coi một ngưỡng chưa cấu hình là 0 thì hỏng theo kiểu nào?',
        dap: 'Hỏng im lặng: mọi bản build đều vượt ngưỡng nên cổng luôn xanh và không còn kiểm gì nữa, mà không có tín hiệu đỏ nào để ai đó lần ra nguyên nhân.',
      },
    ],
  },
]
