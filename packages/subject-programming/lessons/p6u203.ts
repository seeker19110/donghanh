// lessons/p6u203.ts — P6-U203: HƯỚNG DỮ LIỆU, chặng S4 — module `data-s4-m2` (độ tin cậy dữ liệu).
//
// Bài 1 dạy cái bẫy đắt nhất của giám sát dữ liệu: GỘP ba trạng thái khác hẳn nhau — 0 dòng,
// giá trị NULL, và "đường ống chưa chạy" — thành một khái niệm "không có số". Bài 2 dạy đọc tốc
// độ đốt ngân sách sai số (burn rate) và biết khi nào mẫu quá nhỏ để kết luận bất cứ điều gì.
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U203_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u203-l1',
    unitId: 'p6-u203',
    language: 'python',
    title:
      'MÔ PHỎNG SLO độ tươi (freshness) và đầy đủ (completeness): ba trạng thái không được gộp',
    hook: 'Job báo "thành công" xong bảng vẫn cũ mười hai tiếng — và bảng điều khiển vẫn xanh. Đó là lúc giám sát đang đo sai thứ.',
    theory:
      'SLO dữ liệu có ba thước riêng: độ tươi (freshness — dữ liệu mới đến mức nào), đầy đủ (completeness — có đủ số dòng đáng lẽ phải có không) và chính xác. Sai lầm hay gặp nhất là gộp ba trạng thái KHÁC HẲN nhau: 0 dòng (đường ống chạy xong, thật sự không có bản ghi nào), giá trị NULL (có dòng nhưng ô trống — lỗi nguồn), và "chưa chạy" (không có gì để nói cả). Gộp chúng lại thì một sự cố im lặng bị đọc như một ngày ế khách. Và độ tươi phải xét ĐỘC LẬP với trạng thái job: job xanh không chứng minh dữ liệu mới, nó chỉ chứng minh mã chạy xong. MÔ PHỎNG Python hữu hạn trên một bản ghi tổng hợp, không đọc kho dữ liệu hay hệ giám sát thật.',
    workedExample: {
      code: `# MO PHONG SLO freshness; ban ghi tong hop.\ntuoi_gio, nguong_gio, job = 9, 6, "success"\nprint("violated: qua han do tuoi" if tuoi_gio > nguong_gio else "allow: du lieu tin cay")`,
      stdinLines: [],
    },
    predict: {
      code: `trangthai = "notrun"\nrows = "0"\nprint("unknown: chua chay" if trangthai == "notrun" else "violated: 0 dong")`,
      question: 'Đường ống chưa chạy, và biến đếm dòng đang là 0. Cổng MÔ PHỎNG in gì?',
      choices: [
        'unknown: chua chay',
        'violated: 0 dong',
        'allow: du lieu tin cay',
        'violated: gia tri null khac 0 dong',
      ],
      answerIndex: 0,
      explain:
        'Số 0 ở đây không phải kết quả đo mà là giá trị khởi tạo của một phép đo chưa xảy ra — trả `unknown` mới nói đúng sự thật, trả `violated: 0 dong` là bịa ra một sự cố không có.',
    },
    parsons: {
      prompt: 'Xếp thứ tự kiểm để ba trạng thái "không có số" không bị gộp làm một.',
      lines: [
        'if trangthai == "notrun":',
        '    print("unknown: chua chay")',
        'elif rows == "null":',
        '    print("violated: gia tri null khac 0 dong")',
        'elif rows == "0":',
        '    print("violated: 0 dong")',
        'else:',
        '    print("allow: du lieu tin cay")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng SLO độ tươi (freshness) và đầy đủ (completeness). Đọc `trangthai:<ran|notrun>,rows:<số|null>,tuoi:<số giờ>,nguong:<số giờ>,job:<success|fail>`. Thiếu/thừa trường → `invalid: field`; trangthai hoặc job lạ → `invalid: trangthai` / `invalid: job`; tuoi hoặc nguong không phải số nguyên không âm → `invalid: tuoi` / `invalid: nguong`; rows không phải số nguyên không âm và cũng không phải `null` → `invalid: rows`. Sau đó theo đúng thứ tự: trangthai `notrun` → `unknown: chua chay`; rows `null` → `violated: gia tri null khac 0 dong`; rows `0` → `violated: 0 dong`; tuoi > nguong → `violated: qua han do tuoi` (KỂ CẢ khi job là success); còn lại → `allow: du lieu tin cay`. Không đọc kho dữ liệu hay hệ giám sát thật.',
      starterCode: '# MÔ PHỎNG SLO dữ liệu; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['trangthai:ran,rows:1200,tuoi:2,nguong:6,job:success'],
          expected: 'allow: du lieu tin cay',
          match: 'contains',
          hidden: false,
          label: 'dữ liệu mới và đủ dòng',
        },
        {
          stdinLines: ['trangthai:notrun,rows:0,tuoi:2,nguong:6,job:success'],
          expected: 'unknown: chua chay',
          match: 'contains',
          hidden: true,
          label: 'chưa chạy khác hẳn 0 dòng',
        },
        {
          stdinLines: ['trangthai:ran,rows:null,tuoi:2,nguong:6,job:success'],
          expected: 'violated: gia tri null khac 0 dong',
          match: 'contains',
          hidden: true,
          label: 'NULL là lỗi nguồn, không phải ngày ế khách',
        },
        {
          stdinLines: ['trangthai:ran,rows:1200,tuoi:12,nguong:6,job:success'],
          expected: 'violated: qua han do tuoi',
          match: 'contains',
          hidden: true,
          label: 'job xanh vẫn không cứu được độ tươi quá hạn',
        },
        {
          stdinLines: ['trangthai:ran,rows:1200,tuoi:2,nguong:sau,job:success'],
          expected: 'invalid: nguong',
          match: 'contains',
          hidden: true,
          label: 'ca âm — ngưỡng sai kiểu fail closed',
        },
      ],
      hints: [
        'Xong toàn bộ kiểm kiểu rồi mới rẽ nhánh nghiệp vụ — trộn hai tầng lại sẽ có ca ra sai.',
        '`rows` có ba miền giá trị hợp lệ: số, chuỗi `null`, và không hợp lệ; đừng ép kiểu trước khi phân biệt.',
        'Nhánh độ tươi phải đứng độc lập, không được đặt sau một điều kiện nào liên quan tới job.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"trangthai", "rows", "tuoi", "nguong", "job"}:
        print("invalid: field")
    elif m["trangthai"] not in {"ran", "notrun"}:
        print("invalid: trangthai")
    elif m["job"] not in {"success", "fail"}:
        print("invalid: job")
    elif so(m["tuoi"]) is None:
        print("invalid: tuoi")
    elif so(m["nguong"]) is None:
        print("invalid: nguong")
    elif m["rows"] != "null" and so(m["rows"]) is None:
        print("invalid: rows")
    elif m["trangthai"] == "notrun":
        print("unknown: chua chay")
    elif m["rows"] == "null":
        print("violated: gia tri null khac 0 dong")
    elif so(m["rows"]) == 0:
        print("violated: 0 dong")
    elif so(m["tuoi"]) > so(m["nguong"]):
        print("violated: qua han do tuoi")
    else:
        print("allow: du lieu tin cay")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, mở một bảng điều khiển dữ liệu đang có và tìm xem nó phân biệt được mấy trong ba trạng thái "0 dòng / NULL / chưa chạy"; nếu nó gộp, viết ra một sự cố thật mà cách gộp đó sẽ giấu đi.',
    srsCards: [
      {
        hoi: 'Ba trạng thái nào hay bị gộp thành "không có số", và vì sao gộp là sai?',
        dap: '0 dòng (đo xong, thật sự rỗng), NULL (có dòng nhưng ô trống — lỗi nguồn) và chưa chạy (không có phép đo nào). Ba trạng thái dẫn tới ba hành động khác nhau: không làm gì, sửa nguồn, và đi tìm đường ống chết.',
      },
      {
        hoi: 'Job báo thành công thì độ tươi có được coi là đạt không?',
        dap: 'Không. Job xanh chỉ chứng minh mã chạy hết, không chứng minh dữ liệu mới đến; độ tươi phải đo bằng mốc thời gian của chính dữ liệu.',
      },
    ],
  },
  {
    id: 'p6-u203-l2',
    unitId: 'p6-u203',
    language: 'python',
    title:
      'MÔ PHỎNG tốc độ đốt ngân sách (burn rate) và ngưỡng mẫu tối thiểu của phát hiện bất thường',
    hook: 'Đốt 80% ngân sách sai số khi mới đi được nửa kỳ là một tin xấu — trừ khi con số đó rút ra từ đúng ba lượt đo.',
    theory:
      'Tốc độ đốt (burn rate) so phần ngân sách sai số đã tiêu với phần thời gian đã trôi của kỳ: tiêu nhanh hơn thời gian trôi nghĩa là hết ngân sách trước khi hết kỳ, và đó là tín hiệu phải hành động chứ không phải chờ. Nhưng mọi kết luận thống kê đều có điều kiện nhập môn: mẫu phải đủ lớn. Bất thường tính trên mẫu dưới ngưỡng phải trả `unknown`, không được trả "bình thường" — vì "không phát hiện được gì" và "không có gì" là hai câu khác nhau. MÔ PHỎNG hữu hạn, tất định: không random, không đồng hồ hệ thống, không hệ giám sát thật.',
    workedExample: {
      code: `# MO PHONG toc do dot; chuoi do tong hop, tat dinh.\nmau, nguong_mau = 50, 30\ndot, troi = 80, 50\nif mau < nguong_mau:\n    print("unknown: mau duoi nguong")\nelse:\n    print("violated: toc do dot vuot ngan sach" if dot > troi else "allow: ngan sach con an toan")`,
      stdinLines: [],
    },
    predict: {
      code: `mau, nguong_mau = 3, 30\ndot, troi = 80, 50\nprint("unknown: mau duoi nguong" if mau < nguong_mau else "violated: toc do dot vuot ngan sach")`,
      question: 'Tỉ lệ đốt rất cao nhưng chỉ có ba lượt đo. Cổng MÔ PHỎNG in gì?',
      choices: [
        'unknown: mau duoi nguong',
        'violated: toc do dot vuot ngan sach',
        'allow: ngan sach con an toan',
        'invalid: mau',
      ],
      answerIndex: 0,
      explain:
        'Ngưỡng mẫu được kiểm TRƯỚC mọi kết luận: ba lượt đo không đủ để phân biệt một sự cố thật với nhiễu, nên câu trả lời trung thực là "chưa biết", không phải một cảnh báo có thể sai.',
    },
    parsons: {
      prompt: 'Xếp thứ tự: ngưỡng mẫu đứng trước mọi kết luận về tốc độ đốt.',
      lines: [
        'if mau < nguong_mau:',
        '    print("unknown: mau duoi nguong")',
        'elif dot > troi:',
        '    print("violated: toc do dot vuot ngan sach")',
        'else:',
        '    print("allow: ngan sach con an toan")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng tốc độ đốt (burn rate) ngân sách sai số. Đọc `mau:<số>,nguongmau:<số>,dot:<0..100>,troi:<0..100>`. Thiếu/thừa trường → `invalid: field`; trường nào không phải số nguyên không âm → `invalid: <tên trường>`; `dot` hoặc `troi` ngoài 0..100 → `invalid: dot` / `invalid: troi`. Sau đó: mau < nguongmau → `unknown: mau duoi nguong`; dot > troi → `violated: toc do dot vuot ngan sach`; còn lại → `allow: ngan sach con an toan`. Tất định, không random, không đồng hồ hệ thống.',
      starterCode: '# MÔ PHỎNG tốc độ đốt; chỉ tính trên dòng nhập, không chạm hệ ngoài.\n',
      testCases: [
        {
          stdinLines: ['mau:50,nguongmau:30,dot:20,troi:50'],
          expected: 'allow: ngan sach con an toan',
          match: 'contains',
          hidden: false,
          label: 'tiêu chậm hơn thời gian trôi',
        },
        {
          stdinLines: ['mau:3,nguongmau:30,dot:80,troi:50'],
          expected: 'unknown: mau duoi nguong',
          match: 'contains',
          hidden: true,
          label: 'mẫu quá nhỏ thì chưa kết luận được gì',
        },
        {
          stdinLines: ['mau:50,nguongmau:30,dot:80,troi:50'],
          expected: 'violated: toc do dot vuot ngan sach',
          match: 'contains',
          hidden: true,
          label: 'đốt nhanh hơn thời gian là tín hiệu phải hành động',
        },
        {
          stdinLines: ['mau:50,nguongmau:30,dot:120,troi:50'],
          expected: 'invalid: dot',
          match: 'contains',
          hidden: true,
          label: 'ca âm — phần trăm ngoài miền fail closed',
        },
      ],
      hints: [
        'Kiểm miền giá trị 0..100 ngay sau khi ép kiểu, đừng để một phần trăm vô lý chạy tới nhánh kết luận.',
        'Ngưỡng mẫu phải đứng trước nhánh so sánh đốt/trôi, nếu không mẫu nhỏ sẽ sinh cảnh báo giả.',
        'Không dùng random, subprocess, socket, file hay thời gian thực.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"mau", "nguongmau", "dot", "troi"}:
        print("invalid: field")
    elif so(m["mau"]) is None:
        print("invalid: mau")
    elif so(m["nguongmau"]) is None:
        print("invalid: nguongmau")
    elif so(m["dot"]) is None or not 0 <= so(m["dot"]) <= 100:
        print("invalid: dot")
    elif so(m["troi"]) is None or not 0 <= so(m["troi"]) <= 100:
        print("invalid: troi")
    elif so(m["mau"]) < so(m["nguongmau"]):
        print("unknown: mau duoi nguong")
    elif so(m["dot"]) > so(m["troi"]):
        print("violated: toc do dot vuot ngan sach")
    else:
        print("allow: ngan sach con an toan")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, chọn một cảnh báo dữ liệu đã từng nổ trong tháng qua và tính lại nó dựa trên bao nhiêu lượt đo; nếu số lượt nhỏ hơn ngưỡng bạn thấy hợp lý, viết ra ngưỡng mẫu tối thiểu nên đặt cho cảnh báo đó.',
    srsCards: [
      {
        hoi: 'Tốc độ đốt nói lên điều gì mà tỉ lệ lỗi thô không nói được?',
        dap: 'Nó so phần ngân sách đã tiêu với phần kỳ đã trôi, tức trả lời "cứ đà này có hết ngân sách trước khi hết kỳ không" — một câu hỏi về xu hướng, không phải về một lát cắt.',
      },
      {
        hoi: 'Vì sao mẫu dưới ngưỡng phải trả `unknown` chứ không phải "bình thường"?',
        dap: '"Bình thường" là một kết luận, còn dữ liệu đang không đủ để kết luận gì; báo bình thường sẽ ru ngủ người trực đúng lúc họ cần đi tìm thêm số liệu.',
      },
    ],
  },
]
