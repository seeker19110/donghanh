// P6-U230 — algo-s4-m1: cấu trúc dữ liệu xác suất. Bloom filter với hàm băm đa thức TỰ VIẾT
// (không dùng hash() built-in vì không tất định giữa các tiến trình), đối chứng với `set`
// chuẩn để chứng minh không có âm tính giả, và đo tỉ lệ báo nhầm qua nhiều hạt giống.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U230_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u230-l1',
    unitId: 'p6-u230',
    language: 'python',
    title: 'Bloom filter — "chắc chắn không có" là lời hứa, "có thể có" thì không',
    hook: 'Một cấu trúc chỉ tốn vài nghìn bit có thể thay cho danh sách hàng triệu khoá, miễn là bạn chấp nhận nó đôi khi nói nhầm theo đúng MỘT hướng.',
    theory:
      'Bloom filter là một mảng `m` bit và `k` hàm băm. Thêm một khoá nghĩa là bật `k` bit tương ứng; hỏi một khoá nghĩa là xem cả `k` bit đó có bật không. Vì thế nó có một bất đối xứng rất quan trọng: nếu có bit nào tắt thì khoá CHẮC CHẮN chưa từng được thêm, còn nếu tất cả đều bật thì khoá CÓ THỂ có — các bit ấy có thể đã bị khoá khác bật hộ. Nói cách khác: không bao giờ có âm tính giả, nhưng luôn có dương tính giả, và tỉ lệ dương tính giả xấp xỉ `(1 - e^(-kn/m))^k`. Hàm băm ở đây phải TỰ VIẾT bằng công thức đa thức mô-đun cố định: `hash()` có sẵn của Python đổi giá trị theo PYTHONHASHSEED mỗi tiến trình nên không đo lại được kết quả nào.',
    workedExample: {
      code: `# k ham bam tu viet: chi khac nhau o co so.\ndef vi_tri(chuoi, chi_so, m):\n    co_so = 131 + 2 * chi_so\n    gia_tri = 0\n    for ky_tu in chuoi:\n        gia_tri = (gia_tri * co_so + ord(ky_tu)) % m\n    return gia_tri\n\nbit = [0] * 64\nfor j in range(3):\n    bit[vi_tri("apple", j, 64)] = 1\nprint(sum(bit))\nprint(all(bit[vi_tri("apple", j, 64)] == 1 for j in range(3)))`,
      stdinLines: [],
    },
    predict: {
      code: `bit = [0] * 8\nbit[2] = 1\nbit[5] = 1\n# Khoa X can bit 2 va bit 5; khoa Y can bit 2 va bit 7.\nprint(all(bit[i] == 1 for i in (2, 5)))\nprint(all(bit[i] == 1 for i in (2, 7)))`,
      question: 'Hai dòng in ra là gì?',
      choices: ['True\nFalse', 'False\nTrue', 'True\nTrue', 'False\nFalse'],
      answerIndex: 0,
      explain:
        'Dòng hai trả về False vì bit 7 còn tắt, nên khoá Y CHẮC CHẮN chưa từng được thêm — đó là kết luận chắc chắn duy nhất ở đây. Dòng một là True nhưng chỉ nói "có thể có": hai bit ấy có thể đã bị khoá khác bật hộ.',
    },
    parsons: {
      prompt: 'Xếp hàm băm đa thức tự viết trả về chỉ số bit trong mảng m bit.',
      lines: [
        'def vi_tri(chuoi, chi_so, m):',
        '    co_so = 131 + 2 * chi_so',
        '    gia_tri = 0',
        '    for ky_tu in chuoi:',
        '        gia_tri = (gia_tri * co_so + ord(ky_tu)) % m',
        '    return gia_tri',
      ],
    },
    make: {
      prompt:
        'Đọc bốn dòng: `m` (số bit), `k` (số hàm băm), danh sách khoá THÊM vào (cách nhau dấu phẩy), danh sách khoá HỎI. Dùng hàm băm TỰ VIẾT `vi_tri(chuoi, j, m)` với cơ số `131 + 2*j` và công thức `(gia_tri * co_so + ord(ky_tu)) % m`. In hai dòng: `co-the-co: <số khoá hỏi mà mọi bit đều bật>` rồi `chac-chan-khong-co: <số khoá còn lại>`. `m <= 0` hoặc `k <= 0` in `tu-choi: tham-so-khong-hop-le`. Số khoá thêm mà nhân đôi vượt quá `m` thì in `tu-choi: qua-tai`. CẤM dùng `hash()` có sẵn của Python.',
      starterCode: `m = int(input().strip())\nk = int(input().strip())\ndong_them = input().strip()\ndong_hoi = input().strip()\n\n# Kiem tham so truoc, roi moi dung mang bit.`,
      testCases: [
        {
          stdinLines: ['64', '3', 'apple,banana', 'apple,banana'],
          expected: 'co-the-co: 2\nchac-chan-khong-co: 0',
          match: 'contains',
          hidden: false,
          label: 'khoá đã thêm không bao giờ bị nói là không có',
        },
        {
          stdinLines: ['64', '3', 'apple,banana', 'cherry,durian,elderberry,fig'],
          expected: 'co-the-co: 0\nchac-chan-khong-co: 4',
          match: 'contains',
          hidden: true,
          label: 'bộ lọc còn thưa nên không báo nhầm lần nào',
        },
        {
          stdinLines: ['16', '2', 'a,b,c,d,e,f,g,h', 'x,y,z'],
          expected: 'co-the-co: 1\nchac-chan-khong-co: 2',
          match: 'contains',
          hidden: true,
          label: 'bộ lọc gần đầy sinh đúng một dương tính giả',
        },
        {
          stdinLines: ['128', '3', 'mot,hai,ba', 'mot,bon,nam,sau,bay'],
          expected: 'co-the-co: 1\nchac-chan-khong-co: 4',
          match: 'contains',
          hidden: true,
          label: 'chỉ khoá đã thêm được báo là có thể có',
        },
        {
          stdinLines: ['0', '3', 'a', 'a'],
          expected: 'tu-choi: tham-so-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'số bit bằng 0',
        },
        {
          stdinLines: ['4', '2', 'a,b,c', 'a'],
          expected: 'tu-choi: qua-tai',
          match: 'contains',
          hidden: true,
          label: 'thêm vượt sức chứa cấu hình',
        },
      ],
      hints: [
        'Kiểm `m` và `k` trước khi tạo mảng bit — `[0] * m` với m âm cho mảng rỗng và giấu mất lỗi.',
        'Một khoá được coi là "có thể có" khi TẤT CẢ k bit của nó đều bật, dùng `all(...)`.',
        'Bỏ qua các phần tử rỗng sau khi tách chuỗi, để dấu phẩy thừa không đếm thành một khoá.',
      ],
      sampleSolution: `m = int(input().strip())\nk = int(input().strip())\ndong_them = input().strip()\ndong_hoi = input().strip()\n\nif m <= 0 or k <= 0:\n    print("tu-choi: tham-so-khong-hop-le")\n    raise SystemExit\n\nthem = [x.strip() for x in dong_them.split(",") if x.strip() != ""]\nhoi = [x.strip() for x in dong_hoi.split(",") if x.strip() != ""]\n\nif len(them) * 2 > m:\n    print("tu-choi: qua-tai")\n    raise SystemExit\n\ndef vi_tri(chuoi, chi_so, so_bit):\n    co_so = 131 + 2 * chi_so\n    gia_tri = 0\n    for ky_tu in chuoi:\n        gia_tri = (gia_tri * co_so + ord(ky_tu)) % so_bit\n    return gia_tri\n\nbit = [0] * m\nfor tu in them:\n    for j in range(k):\n        bit[vi_tri(tu, j, m)] = 1\n\nco_the = 0\nchac_chan_khong = 0\nfor tu in hoi:\n    if all(bit[vi_tri(tu, j, m)] == 1 for j in range(k)):\n        co_the += 1\n    else:\n        chac_chan_khong += 1\n\nprint("co-the-co: " + str(co_the))\nprint("chac-chan-khong-co: " + str(chac_chan_khong))`,
    },
    homework:
      'Đối chứng bộ lọc với một `set` chuẩn trên cùng dữ liệu: mọi khoá đã thêm phải luôn được báo "có thể có" (không âm tính giả), còn các khoá chưa thêm bị báo nhầm thì đếm lại. So tỉ lệ đo được với công thức `(1 - e^(-kn/m))^k` và ghi lại độ lệch.',
    srsCards: [
      {
        hoi: 'Bloom filter sai theo hướng nào, và hướng nào thì không bao giờ sai?',
        dap: 'Nó có thể báo nhầm là "có thể có" với khoá chưa từng thêm, nhưng không bao giờ báo "chắc chắn không có" với khoá đã thêm — tức là có dương tính giả, không có âm tính giả.',
      },
      {
        hoi: 'Vì sao hàm băm của Bloom filter trong bài đo đạc phải tự viết?',
        dap: 'Vì `hash()` có sẵn của Python đổi giá trị theo PYTHONHASHSEED mỗi tiến trình, nên tỉ lệ báo nhầm đo được ở lần chạy này không lặp lại ở lần chạy sau và không dùng làm bằng chứng được.',
      },
      {
        hoi: 'Tỉ lệ dương tính giả của Bloom filter phụ thuộc những đại lượng nào?',
        dap: 'Phụ thuộc số bit m, số hàm băm k và số phần tử đã thêm n, xấp xỉ theo công thức (1 - e^(-kn/m))^k; nhồi thêm phần tử mà không tăng m thì tỉ lệ này tăng rất nhanh.',
      },
    ],
  },
  {
    id: 'p6-u230-l2',
    unitId: 'p6-u230',
    language: 'python',
    title: 'Đo tỉ lệ báo nhầm qua nhiều hạt giống — vì sao một hàm băm là không đủ',
    hook: 'Ai cũng gật đầu với câu "nhiều hàm băm thì ít báo nhầm hơn"; con số đo được trên năm hạt giống mới là thứ chốt lại điều đó.',
    theory:
      'Một lần đo trên một bộ dữ liệu không nói được gì về cấu trúc xác suất: số báo nhầm phụ thuộc chính bộ dữ liệu ấy. Cách làm đúng là chạy lại trên NHIỀU hạt giống rồi cộng dồn, và dữ liệu sinh ra phải tái hiện được — ở đây dùng một bộ sinh tuyến tính đồng dư (LCG) tự viết với công thức cố định, không dùng bộ sinh ngẫu nhiên toàn cục. Khi đó so sánh `k = 1` với `k = 3` trên CÙNG dữ liệu trở thành một thí nghiệm đối chứng thật: cùng số bit, cùng số phần tử, chỉ khác số hàm băm. Đây cũng là khuôn mẫu chung cho mọi tuyên bố về cấu trúc xác suất — đo nhiều lần, cố định hạt giống, so hai cấu hình chứ không so với cảm giác.',
    workedExample: {
      code: `# LCG tu viet: cung hat giong thi cung day so.\ndef sinh(hat_giong, so_luong):\n    x = hat_giong\n    ra = []\n    for _ in range(so_luong):\n        x = (x * 1103515245 + 12345) % 2147483648\n        ra.append(str(x))\n    return ra\n\nprint(sinh(1, 3))\nprint(sinh(1, 3) == sinh(1, 3))`,
      stdinLines: [],
    },
    predict: {
      code: `x = 1\nx = (x * 1103515245 + 12345) % 2147483648\nprint(x)\ny = 1\ny = (y * 1103515245 + 12345) % 2147483648\nprint(x == y)`,
      question: 'Dòng thứ hai in ra gì?',
      choices: ['True', 'False', 'None', 'Một số ngẫu nhiên'],
      answerIndex: 0,
      explain:
        'LCG là hàm thuần: cùng trạng thái đầu vào luôn cho cùng trạng thái tiếp theo, nên hai biến xuất phát từ 1 sẽ luôn bằng nhau — đó chính là tính tái hiện mà bài đo cần.',
    },
    parsons: {
      prompt: 'Xếp bộ sinh dữ liệu tất định theo hạt giống.',
      lines: [
        'def sinh(hat_giong, so_luong):',
        '    x = hat_giong',
        '    ra = []',
        '    for _ in range(so_luong):',
        '        x = (x * 1103515245 + 12345) % 2147483648',
        '        ra.append(str(x))',
        '    return ra',
      ],
    },
    make: {
      prompt:
        'Đọc dòng một là `m` (số bit), dòng hai là danh sách hạt giống cách nhau dấu phẩy. Với MỖI hạt giống, sinh 230 chuỗi bằng LCG `x = (x * 1103515245 + 12345) % 2147483648` (bắt đầu từ x = hạt giống, mỗi bước lấy `str(x)`): 30 chuỗi đầu là khoá THÊM, 200 chuỗi sau là khoá HỎI. Đếm số lần BÁO NHẦM (khoá không nằm trong tập đã thêm nhưng mọi bit đều bật) cho `k = 1` và cho `k = 3`, dùng hàm băm `(gia_tri * (131 + 2*j) + ord(ky_tu)) % m`. In `bao-nham: <tổng k=1>-<tổng k=3>` rồi `chon: k=3` hoặc `chon: k=1` theo cấu hình báo nhầm ÍT hơn (hoà thì chọn `k=1`). `m <= 0` in `tu-choi: tham-so-khong-hop-le`.',
      starterCode: `m = int(input().strip())\ndong_hat = input().strip()\n\n# Cung hat giong, cung du lieu, chi khac so ham bam.`,
      testCases: [
        {
          stdinLines: ['256', '1,2,3,4,5'],
          expected: 'bao-nham: 113-33\nchon: k=3',
          match: 'contains',
          hidden: false,
          label: 'năm hạt giống, k=3 báo nhầm ít hơn hẳn k=1',
        },
        {
          stdinLines: ['512', '1,2,3,4,5'],
          expected: 'bao-nham: 55-6\nchon: k=3',
          match: 'contains',
          hidden: true,
          label: 'gấp đôi số bit thì báo nhầm giảm ở cả hai cấu hình',
        },
        {
          stdinLines: ['256', '1'],
          expected: 'chon: k=3',
          match: 'contains',
          hidden: true,
          label: 'một hạt giống vẫn tái hiện được',
        },
        {
          stdinLines: ['0', '1,2'],
          expected: 'tu-choi: tham-so-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'số bit không hợp lệ bị chặn trước khi sinh dữ liệu',
        },
      ],
      hints: [
        'Viết một hàm `dem_bao_nham(m, k, hat_giong)` rồi gọi nó hai lần với cùng hạt giống — đó là điểm mấu chốt của thí nghiệm đối chứng.',
        'Dùng một `set` các khoá đã thêm để biết đâu là báo NHẦM thật sự, chứ không đếm cả khoá đã có.',
        'Cộng dồn qua mọi hạt giống trước khi so sánh; so trên một hạt giống là chưa đủ để kết luận.',
      ],
      sampleSolution: `m = int(input().strip())\ndong_hat = input().strip()\n\nif m <= 0:\n    print("tu-choi: tham-so-khong-hop-le")\n    raise SystemExit\n\nhat = [int(x.strip()) for x in dong_hat.split(",") if x.strip() != ""]\n\ndef sinh(hat_giong, so_luong):\n    x = hat_giong\n    ra = []\n    for _ in range(so_luong):\n        x = (x * 1103515245 + 12345) % 2147483648\n        ra.append(str(x))\n    return ra\n\ndef vi_tri(chuoi, chi_so, so_bit):\n    co_so = 131 + 2 * chi_so\n    gia_tri = 0\n    for ky_tu in chuoi:\n        gia_tri = (gia_tri * co_so + ord(ky_tu)) % so_bit\n    return gia_tri\n\ndef dem_bao_nham(so_bit, k, hat_giong):\n    day = sinh(hat_giong, 230)\n    them = day[:30]\n    hoi = day[30:]\n    bit = [0] * so_bit\n    for tu in them:\n        for j in range(k):\n            bit[vi_tri(tu, j, so_bit)] = 1\n    tap = set(them)\n    nham = 0\n    for tu in hoi:\n        if tu not in tap and all(bit[vi_tri(tu, j, so_bit)] == 1 for j in range(k)):\n            nham += 1\n    return nham\n\ntong_k1 = sum(dem_bao_nham(m, 1, h) for h in hat)\ntong_k3 = sum(dem_bao_nham(m, 3, h) for h in hat)\n\nprint("bao-nham: " + str(tong_k1) + "-" + str(tong_k3))\nif tong_k3 < tong_k1:\n    print("chon: k=3")\nelse:\n    print("chon: k=1")`,
    },
    homework:
      'Chạy lại thí nghiệm với `k = 5` và `k = 8` trên cùng năm hạt giống rồi vẽ bảng số báo nhầm theo k. Giải thích vì sao tăng k mãi lại làm tỉ lệ báo nhầm TĂNG trở lại, và tìm giá trị k tốt nhất theo công thức `k = (m/n) * ln2` cho cấu hình của bạn.',
    srsCards: [
      {
        hoi: 'Vì sao phải đo tỉ lệ báo nhầm trên nhiều hạt giống thay vì một lần chạy?',
        dap: 'Vì một lần chạy chỉ nói về đúng bộ dữ liệu đó; phương sai giữa các bộ dữ liệu có thể lớn hơn khác biệt giữa hai cấu hình, nên kết luận rút từ một lần đo là không đáng tin.',
      },
      {
        hoi: 'Điều kiện nào biến việc so `k=1` với `k=3` thành một thí nghiệm đối chứng thật?',
        dap: 'Hai cấu hình phải chạy trên cùng dữ liệu sinh từ cùng hạt giống, cùng số bit và cùng số phần tử, để khác biệt quan sát được chỉ có thể đến từ số hàm băm.',
      },
      {
        hoi: 'Vì sao tăng số hàm băm k mãi lại làm tỉ lệ báo nhầm tăng trở lại?',
        dap: 'Vì mỗi khoá thêm vào bật thêm k bit, nên k quá lớn làm mảng bit bão hoà nhanh; lúc đó gần như bit nào cũng bật và mọi truy vấn đều bị báo là có thể có.',
      },
    ],
  },
]
