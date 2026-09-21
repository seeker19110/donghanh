// lessons/p6u224.ts — P6-U224: HƯỚNG DI ĐỘNG, chặng S4 — Nền tảng và mã dùng chung
// (module `mobile-s4-m3`).
//
// MÔ PHỎNG: bộ phân loại mã dùng chung + cổng phát hành thư viện nội bộ, viết bằng TypeScript
// thuần, tất định. Không dựng KMP/cầu nối native thật. Việc viết một module gốc thật cho phần
// cầu nối chung không đáp ứng nổi nằm ở bài tập về nhà.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U224_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u224-l1',
    unitId: 'p6-u224',
    language: 'typescript',
    title: 'Cái gì dùng chung được, cái gì bắt buộc phải riêng từng nền tảng',
    hook: 'Đội quyết định "chia sẻ 100% mã giữa Android và iOS". Sáu tháng sau, một nửa số file dùng chung đầy những câu lệnh rẽ nhánh theo nền tảng, và sửa một lỗi ở iOS thì hỏng Android. Chia sẻ quá tay còn đắt hơn viết hai bản.',
    theory:
      'Câu hỏi "chia sẻ bao nhiêu phần trăm mã" là câu hỏi sai. Câu hỏi đúng là: đoạn mã này CÓ PHỤ THUỘC vào nền tảng không?\n\nBa nhóm, và ranh giới giữa chúng khá rõ nếu chịu nhìn:\n\n- **Chia sẻ được (share)** — logic thuần: tính toán, luật nghiệp vụ, phân tích dữ liệu, máy trạng thái, kiểm tra hợp lệ. Nó không biết gì về màn hình hay hệ điều hành, nên chạy ở đâu cũng cho cùng kết quả. Đây cũng là phần ĐÁNG chia sẻ nhất vì nó là phần dễ sai nhất và cần test kỹ nhất — viết một lần, test một lần, đúng ở cả hai máy.\n- **Riêng từng nền tảng (platform-specific)** — mọi thứ chạm API hệ điều hành: cảm biến, quyền, thông báo, kho an toàn, và toàn bộ giao diện. Cố ép dùng chung thì phải dựng một lớp trừu tượng cho hai thứ vốn khác nhau, và lớp đó thường phức tạp hơn việc viết riêng hai bản.\n- **Giao diện** — về nguyên tắc thì chia sẻ được bằng các bộ công cụ đa nền tảng, nhưng đó là một quyết định RIÊNG với đánh đổi riêng (cảm giác dùng có đúng chuẩn từng máy không), không gộp vào cuộc thảo luận về mã dùng chung.\n\nPhép phân loại trong bài đơn giản có chủ ý: một hàm chạm API hệ điều hành hoặc chạm giao diện thì là riêng nền tảng; còn lại là dùng chung. Sự đơn giản ấy chính là điểm mạnh — nó cho một câu trả lời nhất quán trong mọi lần tranh luận, thay vì mỗi lần lại theo cảm tính của người nói to nhất.\n\nTên hàm rỗng thì trả về **invalid**: một mục không tên trong danh sách kiểm kê là dấu hiệu công cụ quét bị lỗi, và im lặng cho qua nó sẽ giấu luôn phần mã nào đó chưa được phân loại.',
    workedExample: {
      code: `interface HamUngVien {
  ten: string
  chamApiHeDieuHanh: boolean  // cam bien, quyen, thong bao, kho an toan...
  chamGiaoDien: boolean
}

function phanLoai(h: HamUngVien): string {
  if (h.ten.trim() === "") return "invalid: thieu ten ham"
  // Cham he dieu hanh hoac giao dien -> ep dung chung se dat hon viet rieng hai ban.
  if (h.chamApiHeDieuHanh) return "platform-specific: cham API he dieu hanh"
  if (h.chamGiaoDien) return "platform-specific: cham giao dien"
  return "share: logic thuan, chay dau cung cho cung ket qua"
}

console.log(phanLoai({ ten: "tinhThue", chamApiHeDieuHanh: false, chamGiaoDien: false }))
console.log(phanLoai({ ten: "docConQuayHoiChuyen", chamApiHeDieuHanh: true, chamGiaoDien: false }))
console.log(phanLoai({ ten: "veTheSanPham", chamApiHeDieuHanh: false, chamGiaoDien: true }))
console.log(phanLoai({ ten: "  ", chamApiHeDieuHanh: false, chamGiaoDien: false }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface HamUngVien {
  ten: string
  chamApiHeDieuHanh: boolean
  chamGiaoDien: boolean
}
function phanLoai(h: HamUngVien): string {
  if (h.ten.trim() === "") return "invalid: thieu ten ham"
  if (h.chamApiHeDieuHanh) return "platform-specific: cham API he dieu hanh"
  if (h.chamGiaoDien) return "platform-specific: cham giao dien"
  return "share: logic thuan, chay dau cung cho cung ket qua"
}
console.log(phanLoai({ ten: "veTheSanPham", chamApiHeDieuHanh: false, chamGiaoDien: true }))`,
      question: 'Hàm vẽ thẻ sản phẩm: không chạm API hệ điều hành nhưng chạm giao diện. In ra gì?',
      choices: [
        'platform-specific: cham giao dien',
        'platform-specific: cham API he dieu hanh',
        'share: logic thuan, chay dau cung cho cung ket qua',
        'invalid: thieu ten ham',
      ],
      answerIndex: 0,
      explain:
        'Hai nhánh riêng nền tảng có lý do khác nhau nên chúng trả về hai chuỗi khác nhau — nhờ vậy báo cáo nói được VÌ SAO một hàm không chia sẻ được. Gộp chúng thành một chuỗi chung sẽ làm mất chính thông tin mà người đọc cần để quyết định có nên tách lại hay không.',
    },
    parsons: {
      prompt:
        'Xếp lại bộ phân loại: chặn thiếu tên, rồi hai lý do riêng nền tảng, rồi mới tới dùng chung.',
      lines: [
        'function phanLoai(h: HamUngVien): string {',
        '  if (h.ten.trim() === "") return "invalid: thieu ten ham"',
        '  if (h.chamApiHeDieuHanh) return "platform-specific: cham API he dieu hanh"',
        '  if (h.chamGiaoDien) return "platform-specific: cham giao dien"',
        '  return "share: logic thuan, chay dau cung cho cung ket qua"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết phanLoai(h) theo thứ tự:\n\n1. ten rỗng sau trim → "invalid: thieu ten ham"\n2. chamApiHeDieuHanh → "platform-specific: cham API he dieu hanh"\n3. chamGiaoDien → "platform-specific: cham giao dien"\n4. còn lại → "share: logic thuan, chay dau cung cho cung ket qua"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface HamUngVien {
  ten: string
  chamApiHeDieuHanh: boolean
  chamGiaoDien: boolean
}

function phanLoai(h: HamUngVien): string {
  // TODO: bon nhanh; hai ly do rieng nen tang tra ve hai chuoi KHAC nhau
  return "share: logic thuan, chay dau cung cho cung ket qua"
}

// ---- Đừng sửa phần dưới đây ----
console.log("Ca 1:", phanLoai({ ten: "tinhThue", chamApiHeDieuHanh: false, chamGiaoDien: false }))
console.log("Ca 2:", phanLoai({ ten: "docConQuayHoiChuyen", chamApiHeDieuHanh: true, chamGiaoDien: false }))
console.log("Ca 3:", phanLoai({ ten: "veTheSanPham", chamApiHeDieuHanh: false, chamGiaoDien: true }))
console.log("Ca 4:", phanLoai({ ten: "  ", chamApiHeDieuHanh: false, chamGiaoDien: false }))
console.log("Ca 5:", phanLoai({ ten: "manChupAnh", chamApiHeDieuHanh: true, chamGiaoDien: true }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: share: logic thuan, chay dau cung cho cung ket qua',
          match: 'contains',
          hidden: false,
          label: 'Logic thuần: đáng chia sẻ nhất vì test một lần đúng cả hai máy',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: platform-specific: cham giao dien',
          match: 'contains',
          hidden: false,
          label: 'Chạm giao diện: nêu đúng lý do, không gộp chung một chuỗi',
        },
        {
          stdinLines: [],
          expected: 'Ca 4: invalid: thieu ten ham',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: mục không tên là dấu hiệu công cụ quét bị lỗi',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: share: logic thuan, chay dau cung cho cung ket qua\nCa 2: platform-specific: cham API he dieu hanh\nCa 3: platform-specific: cham giao dien\nCa 4: invalid: thieu ten ham\nCa 5: platform-specific: cham API he dieu hanh',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: năm ca, gồm ca chạm cả hai thứ',
        },
      ],
      hints: [
        'Hai nhánh platform-specific trả về hai chuỗi khác nhau — đừng gộp hai điều kiện vào một câu if.',
        'Ca 5 chạm cả hai: thứ tự hai nhánh quyết định lý do nào được báo.',
        'Tên "  " cần trim() trước khi so với chuỗi rỗng.',
      ],
      sampleSolution: `interface HamUngVien {
  ten: string
  chamApiHeDieuHanh: boolean
  chamGiaoDien: boolean
}

function phanLoai(h: HamUngVien): string {
  if (h.ten.trim() === "") return "invalid: thieu ten ham"
  if (h.chamApiHeDieuHanh) return "platform-specific: cham API he dieu hanh"
  if (h.chamGiaoDien) return "platform-specific: cham giao dien"
  return "share: logic thuan, chay dau cung cho cung ket qua"
}

// ---- Đừng sửa phần dưới đây ----
console.log("Ca 1:", phanLoai({ ten: "tinhThue", chamApiHeDieuHanh: false, chamGiaoDien: false }))
console.log("Ca 2:", phanLoai({ ten: "docConQuayHoiChuyen", chamApiHeDieuHanh: true, chamGiaoDien: false }))
console.log("Ca 3:", phanLoai({ ten: "veTheSanPham", chamApiHeDieuHanh: false, chamGiaoDien: true }))
console.log("Ca 4:", phanLoai({ ten: "  ", chamApiHeDieuHanh: false, chamGiaoDien: false }))
console.log("Ca 5:", phanLoai({ ten: "manChupAnh", chamApiHeDieuHanh: true, chamGiaoDien: true }))`,
    },
    homework:
      'Lấy một app bạn biết và liệt kê 15 hàm hoặc lớp của nó vào ba cột: chia sẻ được, riêng nền tảng vì chạm hệ điều hành, riêng vì là giao diện. Đếm tỉ lệ. Rồi trả lời: phần chia sẻ được có phải phần nhiều lỗi nhất không, và nếu tách nó ra thành một thư viện riêng thì test nó dễ hơn bao nhiêu?',
    srsCards: [
      {
        hoi: 'Câu hỏi đúng cần đặt khi quyết định mã dùng chung là gì?',
        dap: 'Không phải "chia sẻ bao nhiêu phần trăm" mà là "đoạn mã này có phụ thuộc nền tảng không". Logic thuần thì chia sẻ, còn thứ chạm API hệ điều hành hay giao diện thì viết riêng.',
      },
      {
        hoi: 'Vì sao logic thuần là phần đáng chia sẻ nhất?',
        dap: 'Vì nó là phần dễ sai nhất và cần test kỹ nhất, nên viết một lần và test một lần rồi đúng ở cả hai máy là lợi ích lớn nhất mà việc dùng chung mang lại.',
      },
      {
        hoi: 'Ép dùng chung phần chạm API hệ điều hành thì hỏng thế nào?',
        dap: 'Phải dựng một lớp trừu tượng cho hai thứ vốn khác nhau, và lớp đó thường phức tạp hơn việc viết riêng hai bản; mã dùng chung dần đầy các nhánh rẽ theo nền tảng nên sửa bên này hỏng bên kia.',
      },
    ],
  },
  {
    id: 'p6-u224-l2',
    unitId: 'p6-u224',
    language: 'typescript',
    title: 'Phát hành thư viện nội bộ: đổi phá vỡ phải có ghi chú',
    hook: 'Thư viện lõi nhảy từ 2.4.0 lên 3.0.0 với ghi chú thay đổi: "cập nhật nhỏ". Ba đội dùng nó nâng phiên bản trong cùng một tuần, ba đội cùng đỏ CI, và không ai biết cái gì đã đổi vì người viết thư viện đang đi nghỉ.',
    theory:
      'Khi phần dùng chung được tách thành thư viện, nó trở thành một HỢP ĐỒNG với những đội khác. Và hợp đồng thì chỉ có nghĩa khi bên kia biết nó đổi lúc nào.\n\nĐánh số phiên bản ngữ nghĩa (semantic versioning) nói đúng điều đó bằng ba con số `major.minor.patch`:\n\n- **major** tăng: có thay đổi PHÁ VỠ — mã đang chạy của người dùng thư viện sẽ hỏng nếu họ nâng mà không sửa gì.\n- **minor** tăng: thêm tính năng, mã cũ vẫn chạy nguyên.\n- **patch** tăng: sửa lỗi, không đổi hợp đồng.\n\nCon số major vì thế là một lời cảnh báo có định nghĩa rõ, không phải chuyện thẩm mỹ. Và nó chỉ làm được việc khi đi kèm ghi chú nói RÕ cái gì đổi và người dùng phải sửa gì. Nâng major mà ghi chú trống thì lời cảnh báo mất hết nội dung — cổng của bài này vì vậy trả về **deny**, chặn thẳng.\n\nLưu ý một chi tiết hay bị bỏ qua: thiếu ghi chú ở bản minor hoặc patch chỉ là **warn**. Không phải vì nó tốt, mà vì hậu quả khác hẳn — người dùng nâng minor mà không đọc ghi chú thì mã của họ vẫn chạy. Phân biệt được hai mức đó là cách giữ cho cổng còn được tôn trọng: chặn đúng chỗ đáng chặn thì người ta nghe; chặn khắp nơi thì người ta tìm cách đi vòng.\n\nThứ tự đầy đủ: phiên bản lùi hoặc giữ nguyên → **invalid** (phát hành mà không tăng số là hỏng luồng phân phối); tăng major mà ghi chú rỗng → **deny**; ghi chú rỗng ở mức khác → **warn**; còn lại → **publish**.',
    workedExample: {
      code: `interface BanPhatHanh {
  majorCu: number
  majorMoi: number
  minorCu: number
  minorMoi: number
  ghiChu: string
}

function congThuVien(b: BanPhatHanh): string {
  const tangMajor = b.majorMoi > b.majorCu
  const tangMinor = b.majorMoi === b.majorCu && b.minorMoi > b.minorCu
  if (!tangMajor && !tangMinor) return "invalid: phien ban khong tang"
  // Nang major = loi canh bao "ma cua ban se hong". Canh bao khong noi dung thi vo nghia.
  if (tangMajor && b.ghiChu.trim() === "") return "deny: doi pha vo ma khong co ghi chu"
  if (b.ghiChu.trim() === "") return "warn: thieu ghi chu o ban khong pha vo"
  return "publish: du dieu kien phat hanh"
}

const tot: BanPhatHanh = { majorCu: 2, majorMoi: 2, minorCu: 4, minorMoi: 5, ghiChu: "them ham tinhThue" }
console.log(congThuVien(tot))
console.log(congThuVien({ ...tot, ghiChu: "" }))
console.log(congThuVien({ ...tot, majorMoi: 3, ghiChu: "" }))
console.log(congThuVien({ ...tot, minorMoi: 4 }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface BanPhatHanh {
  majorCu: number
  majorMoi: number
  minorCu: number
  minorMoi: number
  ghiChu: string
}
function congThuVien(b: BanPhatHanh): string {
  const tangMajor = b.majorMoi > b.majorCu
  const tangMinor = b.majorMoi === b.majorCu && b.minorMoi > b.minorCu
  if (!tangMajor && !tangMinor) return "invalid: phien ban khong tang"
  if (tangMajor && b.ghiChu.trim() === "") return "deny: doi pha vo ma khong co ghi chu"
  if (b.ghiChu.trim() === "") return "warn: thieu ghi chu o ban khong pha vo"
  return "publish: du dieu kien phat hanh"
}
console.log(congThuVien({ majorCu: 2, majorMoi: 2, minorCu: 4, minorMoi: 5, ghiChu: "   " }))`,
      question: 'Tăng minor, ghi chú chỉ toàn khoảng trắng. Kết quả là gì?',
      choices: [
        'warn: thieu ghi chu o ban khong pha vo',
        'deny: doi pha vo ma khong co ghi chu',
        'publish: du dieu kien phat hanh',
        'invalid: phien ban khong tang',
      ],
      answerIndex: 0,
      explain:
        'Bản này không phá vỡ hợp đồng nên mã của người dùng vẫn chạy dù họ không đọc ghi chú — thiếu ghi chú ở đây chỉ đáng cảnh báo. Chặn cả trường hợp này sẽ làm cổng bị coi là phiền phức, và một cổng bị đi vòng thì không còn chặn được cả những thứ đáng chặn.',
    },
    parsons: {
      prompt:
        'Xếp lại cổng thư viện: tính hai cờ tăng, chặn không tăng, chặn major thiếu ghi chú, rồi cảnh báo.',
      lines: [
        'function congThuVien(b: BanPhatHanh): string {',
        '  const tangMajor = b.majorMoi > b.majorCu',
        '  const tangMinor = b.majorMoi === b.majorCu && b.minorMoi > b.minorCu',
        '  if (!tangMajor && !tangMinor) return "invalid: phien ban khong tang"',
        '  if (tangMajor && b.ghiChu.trim() === "") return "deny: doi pha vo ma khong co ghi chu"',
        '  if (b.ghiChu.trim() === "") return "warn: thieu ghi chu o ban khong pha vo"',
        '  return "publish: du dieu kien phat hanh"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết congThuVien(b):\n\n1. tangMajor = majorMoi > majorCu; tangMinor = majorMoi bằng majorCu VÀ minorMoi > minorCu\n2. không tăng cả hai → "invalid: phien ban khong tang"\n3. tangMajor VÀ ghiChu rỗng sau trim → "deny: doi pha vo ma khong co ghi chu"\n4. ghiChu rỗng sau trim → "warn: thieu ghi chu o ban khong pha vo"\n5. còn lại → "publish: du dieu kien phat hanh"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface BanPhatHanh {
  majorCu: number
  majorMoi: number
  minorCu: number
  minorMoi: number
  ghiChu: string
}

function congThuVien(b: BanPhatHanh): string {
  // TODO: tinh hai co tang roi bon nhanh quyet dinh
  return "publish: du dieu kien phat hanh"
}

// ---- Đừng sửa phần dưới đây ----
const tot: BanPhatHanh = { majorCu: 2, majorMoi: 2, minorCu: 4, minorMoi: 5, ghiChu: "them ham tinhThue" }
console.log("Ca 1:", congThuVien(tot))
console.log("Ca 2:", congThuVien({ ...tot, ghiChu: "   " }))
console.log("Ca 3:", congThuVien({ ...tot, majorMoi: 3, ghiChu: "" }))
console.log("Ca 4:", congThuVien({ ...tot, minorMoi: 4 }))
console.log("Ca 5:", congThuVien({ ...tot, majorMoi: 3, ghiChu: "bo ham cu doiTien" }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 3: deny: doi pha vo ma khong co ghi chu',
          match: 'contains',
          hidden: false,
          label: 'Nâng major không ghi chú: chặn, vì lời cảnh báo trống rỗng',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: warn: thieu ghi chu o ban khong pha vo',
          match: 'contains',
          hidden: false,
          label: 'Thiếu ghi chú ở bản minor: chỉ cảnh báo',
        },
        {
          stdinLines: [],
          expected: 'Ca 4: invalid: phien ban khong tang',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: phát hành mà không tăng số là hỏng luồng phân phối',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: publish: du dieu kien phat hanh\nCa 2: warn: thieu ghi chu o ban khong pha vo\nCa 3: deny: doi pha vo ma khong co ghi chu\nCa 4: invalid: phien ban khong tang\nCa 5: publish: du dieu kien phat hanh',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: năm ca, gồm nâng major có ghi chú đầy đủ',
        },
      ],
      hints: [
        'tangMinor chỉ đúng khi major GIỮ NGUYÊN: nếu major đã tăng thì minor bao nhiêu cũng không quan trọng.',
        'Ca 4 giữ nguyên cả major lẫn minor nên cả hai cờ đều sai — đó là nhánh invalid.',
        'Ca 2 và Ca 3 chỉ khác nhau ở chỗ có tăng major hay không, và đó là toàn bộ nội dung của luật chặn/cảnh báo.',
      ],
      sampleSolution: `interface BanPhatHanh {
  majorCu: number
  majorMoi: number
  minorCu: number
  minorMoi: number
  ghiChu: string
}

function congThuVien(b: BanPhatHanh): string {
  const tangMajor = b.majorMoi > b.majorCu
  const tangMinor = b.majorMoi === b.majorCu && b.minorMoi > b.minorCu
  if (!tangMajor && !tangMinor) return "invalid: phien ban khong tang"
  if (tangMajor && b.ghiChu.trim() === "") return "deny: doi pha vo ma khong co ghi chu"
  if (b.ghiChu.trim() === "") return "warn: thieu ghi chu o ban khong pha vo"
  return "publish: du dieu kien phat hanh"
}

// ---- Đừng sửa phần dưới đây ----
const tot: BanPhatHanh = { majorCu: 2, majorMoi: 2, minorCu: 4, minorMoi: 5, ghiChu: "them ham tinhThue" }
console.log("Ca 1:", congThuVien(tot))
console.log("Ca 2:", congThuVien({ ...tot, ghiChu: "   " }))
console.log("Ca 3:", congThuVien({ ...tot, majorMoi: 3, ghiChu: "" }))
console.log("Ca 4:", congThuVien({ ...tot, minorMoi: 4 }))
console.log("Ca 5:", congThuVien({ ...tot, majorMoi: 3, ghiChu: "bo ham cu doiTien" }))`,
    },
    homework:
      'Chọn một phần logic dùng chung mà một bộ công cụ đa nền tảng KHÔNG đáp ứng nổi (thường là thứ cần cảm biến hoặc xử lý nặng). Viết một module gốc thật cho nó ở ít nhất một nền tảng, nối vào qua cầu nối, rồi ĐO: cùng một phép tính chạy qua cầu nối và chạy thuần bên dùng chung chênh nhau bao nhiêu mili-giây. Con số đó là căn cứ duy nhất đáng tin cho tranh luận "có nên viết native không".',
    srsCards: [
      {
        hoi: 'Tăng số major trong đánh số phiên bản ngữ nghĩa nghĩa là gì?',
        dap: 'Nghĩa là có thay đổi phá vỡ: mã đang chạy của người dùng thư viện sẽ hỏng nếu họ nâng lên mà không sửa gì, khác hẳn minor (thêm tính năng) và patch (sửa lỗi).',
      },
      {
        hoi: 'Vì sao nâng major mà ghi chú trống thì phải chặn?',
        dap: 'Vì con số major là một lời cảnh báo, và cảnh báo không nói rõ cái gì đổi cùng việc người dùng phải sửa gì thì mất hết nội dung — bên kia không có cách nào chuẩn bị.',
      },
      {
        hoi: 'Vì sao thiếu ghi chú ở bản minor chỉ đáng cảnh báo?',
        dap: 'Vì bản đó không phá hợp đồng nên mã của người dùng vẫn chạy dù họ không đọc. Chặn cả những chỗ không đáng chặn sẽ khiến cổng bị đi vòng và mất luôn tác dụng ở chỗ đáng chặn.',
      },
    ],
  },
]
