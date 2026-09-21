// P6-U227 — algo-s3-m2: chuỗi. KMP đếm khớp có oracle brute-force, băm chuỗi HAI BỘ tự
// viết (không dùng hash() built-in vì PYTHONHASHSEED ngẫu nhiên giữa các tiến trình), và
// khoảng cách chỉnh sửa áp vào gợi ý sửa lỗi chính tả.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U227_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u227-l1',
    unitId: 'p6-u227',
    language: 'python',
    title: 'KMP — đếm số lần khớp mẫu mà không quay lui trên văn bản',
    hook: 'Tìm mẫu bằng vòng lặp lồng nhau vẫn ra đúng trên văn bản ngắn; nó chỉ gục khi văn bản dài và mẫu có nhiều tiền tố lặp.',
    theory:
      'KMP dựa trên một quan sát duy nhất: khi một ký tự lệch, phần đã khớp vẫn còn dùng được. Bảng `fail[i]` ghi độ dài tiền tố vừa là hậu tố dài nhất của `pattern[:i+1]`, nhờ đó con trỏ trên văn bản KHÔNG BAO GIỜ lùi lại. Bài này đếm cả những lần khớp CHỒNG NHAU: sau mỗi lần khớp đủ, con trỏ mẫu nhảy về `fail[k-1]` chứ không về 0. Vì miền dữ liệu bị chặn, một oracle brute-force cắt chuỗi từng vị trí chạy được trên cùng input và là thứ duy nhất đáng tin để nói "KMP của tôi đúng" — đọc code thấy hợp lý không phải là bằng chứng.',
    workedExample: {
      code: `# fail[i]: do dai tien to cung la hau to dai nhat cua pattern[:i+1].\npattern = "aab"\nfail = [0] * len(pattern)\nk = 0\nfor i in range(1, len(pattern)):\n    while k > 0 and pattern[k] != pattern[i]:\n        k = fail[k - 1]\n    if pattern[k] == pattern[i]:\n        k += 1\n    fail[i] = k\nprint(fail)`,
      stdinLines: [],
    },
    predict: {
      code: `text = "aaaa"\npattern = "aa"\ndem = 0\nfor i in range(len(text) - len(pattern) + 1):\n    if text[i:i + len(pattern)] == pattern:\n        dem += 1\nprint(dem)`,
      question: 'Oracle brute-force đếm được bao nhiêu lần khớp?',
      choices: ['1', '2', '3', '4'],
      answerIndex: 2,
      explain:
        'Các vị trí 0, 1 và 2 đều cho "aa"; đây là ba lần khớp CHỒNG NHAU và đề yêu cầu đếm hết, nên đáp án là 3.',
    },
    parsons: {
      prompt: 'Xếp vòng quét văn bản của KMP để con trỏ văn bản không bao giờ lùi.',
      lines: [
        'for ky_tu in text:',
        '    while k > 0 and pattern[k] != ky_tu:',
        '        k = fail[k - 1]',
        '    if pattern[k] == ky_tu:',
        '        k += 1',
        '    if k == len(pattern):',
        '        dem += 1',
        '        k = fail[k - 1]',
      ],
    },
    make: {
      prompt:
        'Đọc dòng một là văn bản, dòng hai là mẫu. Dùng KMP (có bảng `fail`) để in `tim-thay: <số lần khớp, tính cả khớp chồng nhau>`. Mẫu rỗng in `tu-choi: pattern-rong`; văn bản rỗng in `tim-thay: 0`. Kết quả phải khớp tuyệt đối oracle brute-force cắt chuỗi từng vị trí — đừng dùng `str.count`, vì hàm đó bỏ qua khớp chồng nhau.',
      starterCode: `text = input().strip()\npattern = input().strip()\n\n# Dung bang fail truoc, roi quet text mot luot duy nhat.`,
      testCases: [
        {
          stdinLines: ['aaaa', 'aa'],
          expected: 'tim-thay: 3',
          match: 'contains',
          hidden: false,
          label: 'ba lần khớp chồng nhau',
        },
        {
          stdinLines: ['abcabcabc', 'abc'],
          expected: 'tim-thay: 3',
          match: 'contains',
          hidden: true,
          label: 'khớp rời nhau',
        },
        {
          stdinLines: ['abcdef', 'xyz'],
          expected: 'tim-thay: 0',
          match: 'contains',
          hidden: true,
          label: 'không có lần khớp nào',
        },
        {
          stdinLines: ['', 'abc'],
          expected: 'tim-thay: 0',
          match: 'contains',
          hidden: true,
          label: 'văn bản rỗng',
        },
        {
          stdinLines: ['abc', ''],
          expected: 'tu-choi: pattern-rong',
          match: 'contains',
          hidden: true,
          label: 'mẫu rỗng bị từ chối',
        },
        {
          stdinLines: ['aaab', 'aab'],
          expected: 'tim-thay: 1',
          match: 'contains',
          hidden: true,
          label: 'mẫu có tiền tố lặp, phải nhảy đúng theo fail',
        },
      ],
      hints: [
        'Dựng bảng `fail` cho riêng mẫu trước khi động tới văn bản.',
        'Khi lệch, đừng đặt `k = 0`; hãy đặt `k = fail[k - 1]` và thử lại trong vòng `while`.',
        'Sau khi khớp đủ mẫu, `k = fail[k - 1]` mới cho phép đếm các lần khớp chồng nhau.',
      ],
      sampleSolution: `text = input().strip()\npattern = input().strip()\n\nif pattern == "":\n    print("tu-choi: pattern-rong")\n    raise SystemExit\n\nif text == "":\n    print("tim-thay: 0")\n    raise SystemExit\n\nfail = [0] * len(pattern)\nk = 0\nfor i in range(1, len(pattern)):\n    while k > 0 and pattern[k] != pattern[i]:\n        k = fail[k - 1]\n    if pattern[k] == pattern[i]:\n        k += 1\n    fail[i] = k\n\ndem = 0\nk = 0\nfor ky_tu in text:\n    while k > 0 and pattern[k] != ky_tu:\n        k = fail[k - 1]\n    if pattern[k] == ky_tu:\n        k += 1\n    if k == len(pattern):\n        dem += 1\n        k = fail[k - 1]\n\nprint("tim-thay: " + str(dem))`,
    },
    homework:
      'Viết oracle brute-force cho cùng bài, sinh 100 cặp văn bản/mẫu ngắn trên bảng chữ cái hai ký tự bằng một bộ sinh có hạt giống cố định, rồi so từng con số. Ghi lại bộ dữ liệu nhỏ nhất làm hai bản lệch nhau nếu bạn cố ý đặt `k = 0` sau khi khớp đủ.',
    srsCards: [
      {
        hoi: 'Bảng `fail` của KMP ghi lại thông tin gì?',
        dap: 'Với mỗi vị trí i, nó ghi độ dài của tiền tố dài nhất của mẫu mà đồng thời cũng là hậu tố của đoạn mẫu tính tới i, nhờ đó biết phải lùi con trỏ mẫu về đâu khi lệch.',
      },
      {
        hoi: 'Vì sao đếm khớp chồng nhau phải đặt `k = fail[k - 1]` thay vì `k = 0`?',
        dap: 'Vì đặt về 0 sẽ vứt bỏ phần đuôi vừa khớp vốn có thể là đầu của lần khớp kế tiếp, khiến các lần khớp chồng lên nhau bị bỏ sót hoàn toàn.',
      },
      {
        hoi: 'Vì sao `str.count` không thay được KMP trong bài đếm này?',
        dap: 'Vì `str.count` chỉ đếm các lần xuất hiện không chồng lên nhau, nên với văn bản "aaaa" và mẫu "aa" nó trả về 2 trong khi đáp án đúng của đề là 3.',
      },
    ],
  },
  {
    id: 'p6-u227-l2',
    unitId: 'p6-u227',
    language: 'python',
    title: 'Băm chuỗi hai bộ — vì sao một mô-đun là không đủ',
    hook: 'Một bộ băm cho kết quả nhanh và gần như luôn đúng; "gần như" chính là chỗ người ta tự tạo dữ liệu để đánh sập nó.',
    theory:
      'Băm đa thức biến một chuỗi thành một số theo công thức `h = (h * co_so + ord(ky_tu)) % mo_dun`. Hai chuỗi khác nhau có cùng giá trị băm gọi là va chạm, và với một mô-đun cố định, bất kỳ ai cũng dựng được dữ liệu va chạm cố ý. Dùng HAI bộ (hai mô-đun, hai cơ số khác nhau) khiến xác suất trùng cả hai nhỏ hơn rất nhiều, nhưng vẫn chưa phải chứng minh — nên bài này dùng băm để LỌC rồi xác nhận lại bằng so sánh chuỗi trực tiếp. Tuyệt đối không dùng `hash()` có sẵn của Python cho chuỗi: giá trị của nó phụ thuộc biến môi trường PYTHONHASHSEED và đổi giữa hai lần chạy, nên kết quả không tái hiện được và không dùng làm bằng chứng được.',
    workedExample: {
      code: `# Bam da thuc TU VIET, mo-dun va co so co dinh nen tai hien duoc.\ndef bam(chuoi, co_so, mo_dun):\n    gia_tri = 0\n    for ky_tu in chuoi:\n        gia_tri = (gia_tri * co_so + ord(ky_tu)) % mo_dun\n    return gia_tri\n\nprint(bam("abc", 131, 1000003))\nprint(bam("abc", 137, 1000033))`,
      stdinLines: [],
    },
    predict: {
      code: `def khoang_cach(a, b):\n    dp = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]\n    for i in range(len(a) + 1):\n        dp[i][0] = i\n    for j in range(len(b) + 1):\n        dp[0][j] = j\n    for i in range(1, len(a) + 1):\n        for j in range(1, len(b) + 1):\n            gia = 0 if a[i - 1] == b[j - 1] else 1\n            dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + gia)\n    return dp[len(a)][len(b)]\n\nprint(khoang_cach("kitten", "sitting"))`,
      question: 'Khoảng cách chỉnh sửa in ra là bao nhiêu?',
      choices: ['1', '2', '3', '4'],
      answerIndex: 2,
      explain:
        'Cần ba thao tác: đổi k thành s, đổi e thành i, và thêm g vào cuối — đây là ví dụ kinh điển của khoảng cách Levenshtein.',
    },
    parsons: {
      prompt: 'Xếp hàm băm đa thức tự viết để giá trị luôn nằm trong mô-đun.',
      lines: [
        'def bam(chuoi, co_so, mo_dun):',
        '    gia_tri = 0',
        '    for ky_tu in chuoi:',
        '        gia_tri = (gia_tri * co_so + ord(ky_tu)) % mo_dun',
        '    return gia_tri',
      ],
    },
    make: {
      prompt:
        'Đọc dòng một là văn bản, dòng hai là mẫu. Đếm số lần mẫu xuất hiện (tính cả khớp chồng nhau) bằng cách LỌC bằng HAI bộ băm đa thức TỰ VIẾT — mô-đun 1000003 với cơ số 131, và mô-đun 1000033 với cơ số 137 — rồi XÁC NHẬN lại bằng so sánh chuỗi trực tiếp trước khi cộng vào kết quả. In `tim-thay: <k>`. Mẫu rỗng in `tu-choi: pattern-rong`; văn bản rỗng hoặc ngắn hơn mẫu in `tim-thay: 0`. CẤM dùng `hash()` có sẵn của Python.',
      starterCode: `text = input().strip()\npattern = input().strip()\n\n# Hai bo bam de LOC, so sanh chuoi truc tiep de XAC NHAN.`,
      testCases: [
        {
          stdinLines: ['abababa', 'aba'],
          expected: 'tim-thay: 3',
          match: 'contains',
          hidden: false,
          label: 'ba lần khớp chồng nhau',
        },
        {
          stdinLines: ['xyzxyz', 'xyz'],
          expected: 'tim-thay: 2',
          match: 'contains',
          hidden: true,
          label: 'khớp rời nhau',
        },
        {
          stdinLines: ['abcdefgh', 'hgf'],
          expected: 'tim-thay: 0',
          match: 'contains',
          hidden: true,
          label: 'không khớp lần nào',
        },
        {
          stdinLines: ['ab', 'abcd'],
          expected: 'tim-thay: 0',
          match: 'contains',
          hidden: true,
          label: 'mẫu dài hơn văn bản',
        },
        {
          stdinLines: ['abc', ''],
          expected: 'tu-choi: pattern-rong',
          match: 'contains',
          hidden: true,
          label: 'mẫu rỗng bị từ chối',
        },
      ],
      hints: [
        'Viết một hàm `bam(chuoi, co_so, mo_dun)` dùng chung cho cả hai bộ thay vì chép hai lần.',
        'Tính giá trị băm của mẫu đúng một lần, trước vòng lặp quét văn bản.',
        'Chỉ cộng vào kết quả khi CẢ HAI giá trị băm khớp VÀ đoạn cắt bằng đúng mẫu.',
      ],
      sampleSolution: `text = input().strip()\npattern = input().strip()\n\nif pattern == "":\n    print("tu-choi: pattern-rong")\n    raise SystemExit\n\nif text == "" or len(pattern) > len(text):\n    print("tim-thay: 0")\n    raise SystemExit\n\nMO_DUN = [1000003, 1000033]\nCO_SO = [131, 137]\n\ndef bam(chuoi, co_so, mo_dun):\n    gia_tri = 0\n    for ky_tu in chuoi:\n        gia_tri = (gia_tri * co_so + ord(ky_tu)) % mo_dun\n    return gia_tri\n\nmuc_tieu = [bam(pattern, CO_SO[i], MO_DUN[i]) for i in range(2)]\n\ndem = 0\nn = len(pattern)\nfor i in range(len(text) - n + 1):\n    doan = text[i:i + n]\n    khop_bam = all(bam(doan, CO_SO[j], MO_DUN[j]) == muc_tieu[j] for j in range(2))\n    if khop_bam and doan == pattern:\n        dem += 1\n\nprint("tim-thay: " + str(dem))`,
    },
    homework:
      'Dựng một bộ dữ liệu va chạm cố ý cho MỘT mô-đun nhỏ (ví dụ 101) rồi chạy hai bản: bản chỉ dùng một bộ băm và bản dùng hai bộ có xác nhận. Ghi lại chuỗi đầu tiên khiến bản một bộ đếm thừa. Sau đó áp khoảng cách chỉnh sửa ở phần Predict vào một danh sách từ điển nhỏ để gợi ý sửa lỗi chính tả.',
    srsCards: [
      {
        hoi: 'Vì sao không được dùng `hash()` có sẵn của Python cho chuỗi trong bài cần tái hiện?',
        dap: 'Vì giá trị của nó phụ thuộc PYTHONHASHSEED được đặt ngẫu nhiên mỗi tiến trình, nên hai lần chạy cho hai kết quả khác nhau và không dùng làm bằng chứng tái hiện được.',
      },
      {
        hoi: 'Dùng hai bộ băm thay vì một bộ giải quyết được vấn đề gì?',
        dap: 'Nó khiến xác suất một cặp chuỗi khác nhau trùng giá trị ở cả hai mô-đun nhỏ hơn rất nhiều, nên dữ liệu va chạm cố ý dựng cho một mô-đun không còn đánh lừa được bộ lọc.',
      },
      {
        hoi: 'Vì sao vẫn phải so sánh chuỗi trực tiếp sau khi hai giá trị băm đã khớp?',
        dap: 'Vì băm khớp chỉ là bằng chứng xác suất chứ không phải chứng minh; muốn kết quả đúng tuyệt đối thì lần xác nhận cuối cùng phải so từng ký tự của đoạn cắt với mẫu.',
      },
    ],
  },
]
