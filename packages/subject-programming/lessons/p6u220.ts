// lessons/p6u220.ts — P6-U220: HƯỚNG DI ĐỘNG, chặng S3 — Kiến trúc app lớn
// (module `mobile-s3-m3`).
//
// MÔ PHỎNG: bộ kiểm ranh giới lớp viết bằng TypeScript thuần, tất định. Không dựng MVVM/MVI
// thật, không quét mã nguồn thật — dữ liệu vào là mô tả phụ thuộc cho sẵn. Việc viết test thật
// cho lớp dữ liệu nằm ở bài tập về nhà.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U220_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u220-l1',
    unitId: 'p6-u220',
    language: 'typescript',
    title: 'Ranh giới lớp: màn hình không được gọi thẳng mạng hay cơ sở dữ liệu',
    hook: 'App có 40 màn hình. Server đổi tên một trường JSON. Phải sửa 17 chỗ, và ba chỗ bị bỏ sót chỉ lộ ra sau khi phát hành — vì mỗi màn hình tự gọi mạng, tự đọc JSON, tự quyết định lấy từ bộ nhớ đệm hay từ server.',
    theory:
      'Kiến trúc app lớn không phải chuyện chọn MVVM hay MVI. Nó là chuyện: một thay đổi ở bên ngoài (API đổi, đổi thư viện lưu trữ) chạm vào BAO NHIÊU file.\n\nBa lớp, và luật đi lại giữa chúng:\n\n- **Lớp trình bày** (màn hình, view model) — biết cách hiện dữ liệu và nhận thao tác người dùng. KHÔNG biết dữ liệu đến từ đâu.\n- **Lớp kho dữ liệu** (repository) — điểm vào DUY NHẤT để lấy dữ liệu. Nó quyết định lấy từ mạng hay từ bộ nhớ cục bộ, trộn hai nguồn, đổi kiểu dữ liệu ngoài thành kiểu của app.\n- **Lớp nguồn** (nguồn mạng, nguồn cơ sở dữ liệu) — chỉ biết đọc ghi một nơi cụ thể, không biết gì về nghiệp vụ.\n\nLuật một chiều: trình bày gọi kho, kho gọi nguồn. Trình bày gọi THẲNG nguồn là vi phạm, và bài này đánh nó thành **deny** chứ không phải cảnh báo. Lý do đo được, không phải chuyện thẩm mỹ: khi API đổi, nếu mọi lối đi đều qua kho thì chỗ phải sửa là một; nếu 17 màn hình tự gọi thì chỗ phải sửa là 17 và không có cách nào biết mình đã sửa hết.\n\nVi phạm thứ hai tinh vi hơn: **kho dữ liệu phụ thuộc thẳng vào một cài đặt cụ thể** thay vì một interface được tiêm vào. Hậu quả không nằm ở kiến trúc đẹp hay xấu mà nằm ở KIỂM THỬ: muốn test kho dữ liệu thì phải có server thật hoặc cơ sở dữ liệu thật chạy kèm. Test như vậy chậm, hay đỏ vu vơ, và cuối cùng bị ai đó tắt đi. Phụ thuộc vào interface thì thay bằng một cài đặt giả trong bộ nhớ là test chạy trong vài mili-giây.\n\nHai vi phạm này xếp trước mọi thứ khác vì chúng là VI PHẠM CẤU TRÚC — sửa muộn thì phải sửa lại nhiều màn hình, khác hẳn những thiếu sót có thể bổ sung dần.',
    workedExample: {
      code: `interface HoSoKienTruc {
  trinhBayGoiThangNguon: boolean  // man hinh goi thang mang/CSDL, bo qua kho du lieu
  khoPhuThuocImpl: boolean        // kho phu thuoc mot cai dat cu the thay vi interface
}

function kiemRanhGioi(h: HoSoKienTruc): string {
  // Hai vi pham CAU TRUC: sua muon thi phai sua lai nhieu man hinh.
  if (h.trinhBayGoiThangNguon) return "deny: trinh bay goi thang nguon, bo qua kho du lieu"
  if (h.khoPhuThuocImpl) return "deny: kho phu thuoc cai dat cu the, khong test duoc"
  return "allow: ranh gioi lop dung chieu"
}

console.log(kiemRanhGioi({ trinhBayGoiThangNguon: false, khoPhuThuocImpl: false }))
console.log(kiemRanhGioi({ trinhBayGoiThangNguon: true, khoPhuThuocImpl: false }))
console.log(kiemRanhGioi({ trinhBayGoiThangNguon: false, khoPhuThuocImpl: true }))
console.log(kiemRanhGioi({ trinhBayGoiThangNguon: true, khoPhuThuocImpl: true }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface HoSoKienTruc {
  trinhBayGoiThangNguon: boolean
  khoPhuThuocImpl: boolean
}
function kiemRanhGioi(h: HoSoKienTruc): string {
  if (h.trinhBayGoiThangNguon) return "deny: trinh bay goi thang nguon, bo qua kho du lieu"
  if (h.khoPhuThuocImpl) return "deny: kho phu thuoc cai dat cu the, khong test duoc"
  return "allow: ranh gioi lop dung chieu"
}
console.log(kiemRanhGioi({ trinhBayGoiThangNguon: true, khoPhuThuocImpl: true }))`,
      question: 'App vi phạm cả hai luật ranh giới. Dòng in ra là gì?',
      choices: [
        'deny: trinh bay goi thang nguon, bo qua kho du lieu',
        'deny: kho phu thuoc cai dat cu the, khong test duoc',
        'allow: ranh gioi lop dung chieu',
        'warn: thieu test lop du lieu',
      ],
      answerIndex: 0,
      explain:
        'Nhánh đầu tiên khớp thì trả về ngay. Xếp vi phạm "trình bày gọi thẳng nguồn" lên đầu là có chủ ý: nó rải khắp các màn hình nên tốn nhiều công sửa nhất, và sửa nó thường kéo theo việc dựng đúng kho dữ liệu — tức là giải quyết luôn phần lớn vi phạm thứ hai.',
    },
    parsons: {
      prompt:
        'Xếp lại bộ kiểm ranh giới: hai vi phạm cấu trúc theo thứ tự công sửa giảm dần, rồi mới cho qua.',
      lines: [
        'function kiemRanhGioi(h: HoSoKienTruc): string {',
        '  if (h.trinhBayGoiThangNguon) return "deny: trinh bay goi thang nguon, bo qua kho du lieu"',
        '  if (h.khoPhuThuocImpl) return "deny: kho phu thuoc cai dat cu the, khong test duoc"',
        '  return "allow: ranh gioi lop dung chieu"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết kiemRanhGioi(h) theo thứ tự:\n\n1. trinhBayGoiThangNguon → "deny: trinh bay goi thang nguon, bo qua kho du lieu"\n2. khoPhuThuocImpl → "deny: kho phu thuoc cai dat cu the, khong test duoc"\n3. còn lại → "allow: ranh gioi lop dung chieu"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface HoSoKienTruc {
  trinhBayGoiThangNguon: boolean
  khoPhuThuocImpl: boolean
}

function kiemRanhGioi(h: HoSoKienTruc): string {
  // TODO: hai nhanh deny roi allow
  return "allow: ranh gioi lop dung chieu"
}

// ---- Đừng sửa phần dưới đây ----
console.log("Ca 1:", kiemRanhGioi({ trinhBayGoiThangNguon: false, khoPhuThuocImpl: false }))
console.log("Ca 2:", kiemRanhGioi({ trinhBayGoiThangNguon: true, khoPhuThuocImpl: false }))
console.log("Ca 3:", kiemRanhGioi({ trinhBayGoiThangNguon: false, khoPhuThuocImpl: true }))
console.log("Ca 4:", kiemRanhGioi({ trinhBayGoiThangNguon: true, khoPhuThuocImpl: true }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 1: allow: ranh gioi lop dung chieu',
          match: 'contains',
          hidden: false,
          label: 'Không vi phạm: luồng phụ thuộc đúng một chiều',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: deny: kho phu thuoc cai dat cu the, khong test duoc',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: kho bám cài đặt cụ thể thì không test được nếu không dựng hạ tầng thật',
        },
        {
          stdinLines: [],
          expected: 'Ca 2: deny: trinh bay goi thang nguon, bo qua kho du lieu',
          match: 'contains',
          hidden: false,
          label: 'Màn hình gọi thẳng mạng: vi phạm chiều phụ thuộc',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: ranh gioi lop dung chieu\nCa 2: deny: trinh bay goi thang nguon, bo qua kho du lieu\nCa 3: deny: kho phu thuoc cai dat cu the, khong test duoc\nCa 4: deny: trinh bay goi thang nguon, bo qua kho du lieu',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: bốn tổ hợp, ca vi phạm cả hai báo vi phạm tốn công sửa nhất',
        },
      ],
      hints: [
        'Hai câu if đơn giản rồi một return cuối — không cần else.',
        'Thứ tự hai nhánh quyết định Ca 4: vi phạm trình bày phải được báo trước.',
        'Giá trị boolean dùng thẳng trong if, không cần so sánh với true.',
      ],
      sampleSolution: `interface HoSoKienTruc {
  trinhBayGoiThangNguon: boolean
  khoPhuThuocImpl: boolean
}

function kiemRanhGioi(h: HoSoKienTruc): string {
  if (h.trinhBayGoiThangNguon) return "deny: trinh bay goi thang nguon, bo qua kho du lieu"
  if (h.khoPhuThuocImpl) return "deny: kho phu thuoc cai dat cu the, khong test duoc"
  return "allow: ranh gioi lop dung chieu"
}

// ---- Đừng sửa phần dưới đây ----
console.log("Ca 1:", kiemRanhGioi({ trinhBayGoiThangNguon: false, khoPhuThuocImpl: false }))
console.log("Ca 2:", kiemRanhGioi({ trinhBayGoiThangNguon: true, khoPhuThuocImpl: false }))
console.log("Ca 3:", kiemRanhGioi({ trinhBayGoiThangNguon: false, khoPhuThuocImpl: true }))
console.log("Ca 4:", kiemRanhGioi({ trinhBayGoiThangNguon: true, khoPhuThuocImpl: true }))`,
    },
    homework:
      'Lấy một app (của bạn hoặc một dự án mã nguồn mở) và trả lời bằng cách ĐẾM: nếu server đổi tên một trường JSON, phải sửa bao nhiêu file? Tìm chuỗi tên trường đó trong toàn bộ mã nguồn. Một file là kiến trúc tốt; mười file là câu trả lời cho câu hỏi "vì sao cần lớp kho dữ liệu".',
    srsCards: [
      {
        hoi: 'Luật một chiều giữa ba lớp trong app di động là gì?',
        dap: 'Lớp trình bày gọi lớp kho dữ liệu, lớp kho gọi lớp nguồn. Trình bày không bao giờ gọi thẳng nguồn mạng hay cơ sở dữ liệu, nên nó không cần biết dữ liệu đến từ đâu.',
      },
      {
        hoi: 'Lợi ích ĐO ĐƯỢC của việc mọi lối lấy dữ liệu đều đi qua kho là gì?',
        dap: 'Khi API bên ngoài đổi, chỗ phải sửa là một điểm duy nhất thay vì rải khắp các màn hình tự gọi mạng, nên không có chỗ nào bị bỏ sót rồi mới lộ ra sau khi phát hành.',
      },
      {
        hoi: 'Vì sao kho dữ liệu phải phụ thuộc interface thay vì một cài đặt cụ thể?',
        dap: 'Để test được: với interface thì thay bằng một cài đặt giả trong bộ nhớ, test chạy vài mili-giây; bám cài đặt cụ thể thì phải dựng server hoặc cơ sở dữ liệu thật, test chậm và hay đỏ vu vơ rồi bị tắt đi.',
      },
    ],
  },
  {
    id: 'p6-u220-l2',
    unitId: 'p6-u220',
    language: 'typescript',
    title: 'Thiếu test lớp dữ liệu: cảnh báo, không phải chặn',
    hook: 'Một đội quyết định "kiến trúc phải sạch, thiếu test là không được merge". Ba tuần sau, mọi người thêm một test rỗng chỉ có chữ expect(true) để qua cổng. Cổng vẫn xanh, và bây giờ nó còn nói dối.',
    theory:
      'Bài trước xử lý vi phạm cấu trúc. Bài này thêm một điều kiện thuộc loại KHÁC HẲN: độ phủ test của lớp dữ liệu.\n\nVì sao nó là **warn** chứ không phải deny? Vì bản chất thời gian của nó khác:\n\n- Vi phạm cấu trúc: sửa muộn thì giá tăng theo số màn hình đã viết thêm. Chặn sớm rẻ hơn nhiều.\n- Thiếu test: bổ sung lúc nào cũng cùng một giá, vì test được viết cho một lớp dữ liệu đã có sẵn ranh giới rõ. Thiếu test là món nợ có lãi suất thấp, còn ranh giới sai là món nợ có lãi kép.\n\nCòn một lý do thực dụng hơn, và nó là bài học ở cái hook: chặn merge vì thiếu test thì người ta sẽ viết test rỗng. Lúc đó con số độ phủ vẫn đẹp mà không kiểm gì — cổng chuyển từ vô dụng sang nói dối, tệ hơn hẳn.\n\nHàm hoàn chỉnh của unit, theo thứ tự:\n\n1. ngưỡng test chưa cấu hình (số âm) → **unknown**\n2. trình bày gọi thẳng nguồn → **deny**\n3. kho phụ thuộc cài đặt cụ thể → **deny**\n4. số test lớp dữ liệu < ngưỡng → **warn**\n5. còn lại → **allow**\n\nMột chỗ dễ nhầm đáng chỉ ra: ngưỡng bằng 0 là hợp lệ và có nghĩa thật — "dự án này chưa yêu cầu test lớp dữ liệu". Chỉ số ÂM mới là chưa cấu hình. Phân biệt được "không yêu cầu" với "chưa khai báo" chính là phân biệt được 0 với null, thứ mà kiểu dữ liệu không nhắc bạn nhưng nghiệp vụ thì phân biệt rất rõ.',
    workedExample: {
      code: `interface HoSoKienTruc {
  trinhBayGoiThangNguon: boolean
  khoPhuThuocImpl: boolean
  soTestLopDuLieu: number
  nguongTest: number  // 0 = du an chua yeu cau test; AM = chua cau hinh
}

function kiemKienTruc(h: HoSoKienTruc): string {
  if (h.nguongTest < 0) return "unknown: chua cau hinh nguong test"
  if (h.trinhBayGoiThangNguon) return "deny: trinh bay goi thang nguon, bo qua kho du lieu"
  if (h.khoPhuThuocImpl) return "deny: kho phu thuoc cai dat cu the, khong test duoc"
  // Thieu test la mon no lai suat thap: bo sung luc nao cung cung mot gia.
  if (h.soTestLopDuLieu < h.nguongTest) return "warn: moi " + h.soTestLopDuLieu + " test lop du lieu"
  return "allow: ranh gioi dung va du test"
}

const tot: HoSoKienTruc = { trinhBayGoiThangNguon: false, khoPhuThuocImpl: false, soTestLopDuLieu: 12, nguongTest: 10 }
console.log(kiemKienTruc(tot))
console.log(kiemKienTruc({ ...tot, soTestLopDuLieu: 3 }))
console.log(kiemKienTruc({ ...tot, soTestLopDuLieu: 0, nguongTest: 0 }))
console.log(kiemKienTruc({ ...tot, nguongTest: -1 }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface HoSoKienTruc {
  trinhBayGoiThangNguon: boolean
  khoPhuThuocImpl: boolean
  soTestLopDuLieu: number
  nguongTest: number
}
function kiemKienTruc(h: HoSoKienTruc): string {
  if (h.nguongTest < 0) return "unknown: chua cau hinh nguong test"
  if (h.trinhBayGoiThangNguon) return "deny: trinh bay goi thang nguon, bo qua kho du lieu"
  if (h.khoPhuThuocImpl) return "deny: kho phu thuoc cai dat cu the, khong test duoc"
  if (h.soTestLopDuLieu < h.nguongTest) return "warn: moi " + h.soTestLopDuLieu + " test lop du lieu"
  return "allow: ranh gioi dung va du test"
}
console.log(kiemKienTruc({ trinhBayGoiThangNguon: false, khoPhuThuocImpl: false, soTestLopDuLieu: 0, nguongTest: 0 }))`,
      question: 'Không test nào, nhưng ngưỡng cũng là 0. Kết quả là gì?',
      choices: [
        'allow: ranh gioi dung va du test',
        'warn: moi 0 test lop du lieu',
        'unknown: chua cau hinh nguong test',
        'deny: kho phu thuoc cai dat cu the, khong test duoc',
      ],
      answerIndex: 0,
      explain:
        'Ngưỡng 0 nghĩa là dự án CHƯA YÊU CẦU test lớp dữ liệu, và 0 < 0 là sai nên nhánh cảnh báo không khớp. Ngưỡng 0 khác hẳn ngưỡng âm: một cái là "không yêu cầu", cái kia là "chưa khai báo" — đúng cái phân biệt giữa số 0 và giá trị rỗng mà kiểu dữ liệu không nhắc bạn.',
    },
    parsons: {
      prompt:
        'Xếp lại bộ kiểm đầy đủ: chưa cấu hình, hai vi phạm cấu trúc, cảnh báo thiếu test, rồi cho qua.',
      lines: [
        'function kiemKienTruc(h: HoSoKienTruc): string {',
        '  if (h.nguongTest < 0) return "unknown: chua cau hinh nguong test"',
        '  if (h.trinhBayGoiThangNguon) return "deny: trinh bay goi thang nguon, bo qua kho du lieu"',
        '  if (h.khoPhuThuocImpl) return "deny: kho phu thuoc cai dat cu the, khong test duoc"',
        '  if (h.soTestLopDuLieu < h.nguongTest) return "warn: moi " + h.soTestLopDuLieu + " test lop du lieu"',
        '  return "allow: ranh gioi dung va du test"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết kiemKienTruc(h) theo thứ tự:\n\n1. nguongTest < 0 → "unknown: chua cau hinh nguong test"\n2. trinhBayGoiThangNguon → "deny: trinh bay goi thang nguon, bo qua kho du lieu"\n3. khoPhuThuocImpl → "deny: kho phu thuoc cai dat cu the, khong test duoc"\n4. soTestLopDuLieu < nguongTest → "warn: moi <số> test lop du lieu"\n5. còn lại → "allow: ranh gioi dung va du test"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface HoSoKienTruc {
  trinhBayGoiThangNguon: boolean
  khoPhuThuocImpl: boolean
  soTestLopDuLieu: number
  nguongTest: number
}

function kiemKienTruc(h: HoSoKienTruc): string {
  // TODO: nam nhanh; chu y nguong 0 khac nguong am
  return "allow: ranh gioi dung va du test"
}

// ---- Đừng sửa phần dưới đây ----
const tot: HoSoKienTruc = { trinhBayGoiThangNguon: false, khoPhuThuocImpl: false, soTestLopDuLieu: 12, nguongTest: 10 }
console.log("Ca 1:", kiemKienTruc(tot))
console.log("Ca 2:", kiemKienTruc({ ...tot, soTestLopDuLieu: 3 }))
console.log("Ca 3:", kiemKienTruc({ ...tot, soTestLopDuLieu: 0, nguongTest: 0 }))
console.log("Ca 4:", kiemKienTruc({ ...tot, nguongTest: -1 }))
console.log("Ca 5:", kiemKienTruc({ ...tot, soTestLopDuLieu: 3, trinhBayGoiThangNguon: true }))
console.log("Ca 6:", kiemKienTruc({ ...tot, soTestLopDuLieu: 10 }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 2: warn: moi 3 test lop du lieu',
          match: 'contains',
          hidden: false,
          label: 'Thiếu test: chỉ cảnh báo, không chặn',
        },
        {
          stdinLines: [],
          expected: 'Ca 3: allow: ranh gioi dung va du test',
          match: 'contains',
          hidden: false,
          label: 'Ngưỡng 0 nghĩa là chưa yêu cầu test — không phải thiếu dữ liệu',
        },
        {
          stdinLines: [],
          expected: 'Ca 4: unknown: chua cau hinh nguong test',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: ngưỡng âm là chưa khai báo, khác hẳn ngưỡng 0',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: allow: ranh gioi dung va du test\nCa 2: warn: moi 3 test lop du lieu\nCa 3: allow: ranh gioi dung va du test\nCa 4: unknown: chua cau hinh nguong test\nCa 5: deny: trinh bay goi thang nguon, bo qua kho du lieu\nCa 6: allow: ranh gioi dung va du test',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: sáu ca, gồm ca vi phạm cấu trúc che mất cảnh báo thiếu test',
        },
      ],
      hints: [
        'Ca 3 và Ca 4 là cặp quan trọng nhất: 0 là một ngưỡng hợp lệ, chỉ số âm mới là chưa cấu hình.',
        'Ca 6 có số test đúng bằng ngưỡng: điều kiện cảnh báo là < chứ không phải <=.',
        'Ca 5 vừa thiếu test vừa vi phạm cấu trúc, nhưng chỉ vi phạm cấu trúc được báo — nhánh deny đứng trước nhánh warn.',
      ],
      sampleSolution: `interface HoSoKienTruc {
  trinhBayGoiThangNguon: boolean
  khoPhuThuocImpl: boolean
  soTestLopDuLieu: number
  nguongTest: number
}

function kiemKienTruc(h: HoSoKienTruc): string {
  if (h.nguongTest < 0) return "unknown: chua cau hinh nguong test"
  if (h.trinhBayGoiThangNguon) return "deny: trinh bay goi thang nguon, bo qua kho du lieu"
  if (h.khoPhuThuocImpl) return "deny: kho phu thuoc cai dat cu the, khong test duoc"
  if (h.soTestLopDuLieu < h.nguongTest) return "warn: moi " + h.soTestLopDuLieu + " test lop du lieu"
  return "allow: ranh gioi dung va du test"
}

// ---- Đừng sửa phần dưới đây ----
const tot: HoSoKienTruc = { trinhBayGoiThangNguon: false, khoPhuThuocImpl: false, soTestLopDuLieu: 12, nguongTest: 10 }
console.log("Ca 1:", kiemKienTruc(tot))
console.log("Ca 2:", kiemKienTruc({ ...tot, soTestLopDuLieu: 3 }))
console.log("Ca 3:", kiemKienTruc({ ...tot, soTestLopDuLieu: 0, nguongTest: 0 }))
console.log("Ca 4:", kiemKienTruc({ ...tot, nguongTest: -1 }))
console.log("Ca 5:", kiemKienTruc({ ...tot, soTestLopDuLieu: 3, trinhBayGoiThangNguon: true }))
console.log("Ca 6:", kiemKienTruc({ ...tot, soTestLopDuLieu: 10 }))`,
    },
    homework:
      'Viết ít nhất 10 test THẬT cho một lớp dữ liệu (repository) của một dự án bạn đang làm, dùng cài đặt giả trong bộ nhớ thay cho mạng và cơ sở dữ liệu. Chạy trên máy chủ CI, không cần máy ảo Android/iOS. Ghi lại tổng thời gian chạy 10 test đó — nếu nó quá vài giây thì lớp dữ liệu vẫn đang bám vào hạ tầng thật ở đâu đó.',
    srsCards: [
      {
        hoi: 'Vì sao thiếu test lớp dữ liệu chỉ nên cảnh báo, còn ranh giới sai thì phải chặn?',
        dap: 'Thiếu test là nợ lãi suất thấp, bổ sung lúc nào cũng cùng một giá; ranh giới sai là nợ lãi kép, sửa muộn thì giá tăng theo số màn hình đã viết thêm trong lúc đó.',
      },
      {
        hoi: 'Chặn merge vì thiếu test thường dẫn tới hành vi gì?',
        dap: 'Người ta viết test rỗng chỉ để qua cổng, nên con số độ phủ vẫn đẹp mà chẳng kiểm gì. Cổng chuyển từ vô dụng sang nói dối, tệ hơn hẳn trạng thái ban đầu.',
      },
      {
        hoi: 'Ngưỡng bằng 0 và ngưỡng âm khác nhau thế nào trong một cấu hình?',
        dap: 'Ngưỡng 0 là một giá trị hợp lệ nghĩa là dự án chưa yêu cầu, còn số âm mô phỏng trạng thái chưa khai báo. Đó là cách phân biệt số 0 với giá trị rỗng mà kiểu dữ liệu không nhắc nhưng nghiệp vụ thì phân biệt rõ.',
      },
    ],
  },
]
