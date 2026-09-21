// P6-U228 — algo-s3-m3: toán rời rạc ứng dụng. Luỹ thừa/nghịch đảo mô-đun tất định, sàng
// nguyên tố đối chiếu kiểm tra ngây thơ, và giao đoạn thẳng bằng tích có hướng SỐ NGUYÊN —
// tuyệt đối không dùng float để so sánh vị trí.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U228_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u228-l1',
    unitId: 'p6-u228',
    language: 'python',
    title: 'Số học mô-đun — luỹ thừa nhanh, nghịch đảo và khi nào phải từ chối',
    hook: 'Nghịch đảo mô-đun không phải lúc nào cũng tồn tại; một thư viện trả về số bừa còn tệ hơn một hàm chịu nói "không có".',
    theory:
      'Luỹ thừa mô-đun nhanh chia số mũ đôi một: `a^b mod m` tính bằng bình phương liên tiếp nên chỉ tốn khoảng log(b) phép nhân, và vì mọi bước đều lấy dư nên con số không bao giờ phình to. Nghịch đảo của `a` theo mô-đun `m` là số `x` sao cho `a*x ≡ 1 (mod m)`; nó TỒN TẠI khi và chỉ khi `gcd(a, m) = 1`. Đây là điểm dễ sai nhất: nhiều người cắm thẳng công thức Fermat `a^(m-2)` mà quên rằng công thức ấy chỉ đúng khi `m` là số nguyên tố. Sàng Eratosthenes đi kèm ở đây vì cùng họ bài: nó đánh dấu bội của từng số từ nhỏ lên, và kết quả phải đối chiếu được với một hàm kiểm tra nguyên tố ngây thơ trên toàn miền nhỏ.',
    workedExample: {
      code: `# Luy thua mo-dun bang binh phuong lien tiep.\ndef luy_thua(a, b, m):\n    ket_qua = 1\n    a = a % m\n    while b > 0:\n        if b % 2 == 1:\n            ket_qua = (ket_qua * a) % m\n        a = (a * a) % m\n        b = b // 2\n    return ket_qua\n\nprint(luy_thua(2, 10, 1000))`,
      stdinLines: [],
    },
    predict: {
      code: `def uoc_chung(a, b):\n    while b != 0:\n        a, b = b, a % b\n    return a\n\nprint(uoc_chung(6, 9))\nprint(uoc_chung(7, 9))`,
      question: 'Hai dòng kết quả in ra là gì?',
      choices: ['3\n1', '1\n3', '3\n7', '1\n1'],
      answerIndex: 0,
      explain:
        'gcd(6, 9) = 3 và gcd(7, 9) = 1. Hệ quả cần nhớ: 6 KHÔNG có nghịch đảo theo mô-đun 9, còn 7 thì có — nghịch đảo chỉ tồn tại khi ước chung lớn nhất bằng 1.',
    },
    parsons: {
      prompt: 'Xếp hàm luỹ thừa mô-đun bằng bình phương liên tiếp.',
      lines: [
        'def luy_thua(a, b, m):',
        '    ket_qua = 1',
        '    a = a % m',
        '    while b > 0:',
        '        if b % 2 == 1:',
        '            ket_qua = (ket_qua * a) % m',
        '        a = (a * a) % m',
        '        b = b // 2',
        '    return ket_qua',
      ],
    },
    make: {
      prompt:
        'Đọc bốn dòng số nguyên: `a`, `b`, `m`, `n`. Nếu `m <= 0` in `tu-choi: modulo-khong-hop-le` rồi dừng. Ngược lại in ba việc theo thứ tự: (1) `luy-thua: <a^b mod m>` tính bằng bình phương liên tiếp, với `b >= 0`; (2) nghịch đảo của `a` theo mô-đun `m` — in `nghich-dao: <x>` với `0 <= x < m`, hoặc `tu-choi: khong-ton-tai-nghich-dao` khi `gcd(a, m) != 1`; (3) `so-nguyen-to: <số nguyên tố không vượt quá n>` bằng sàng, hoặc `tu-choi: khong-co-so-nguyen-to` khi `n < 2`. Không dùng `pow` ba tham số có sẵn và không dùng thư viện ngoài.',
      starterCode: `a = int(input().strip())\nb = int(input().strip())\nm = int(input().strip())\nn = int(input().strip())\n\n# Kiem m TRUOC, vi moi phep con lai deu lay du theo m.`,
      testCases: [
        {
          stdinLines: ['7', '3', '9', '10'],
          expected: 'luy-thua: 1\nnghich-dao: 4\nso-nguyen-to: 4',
          match: 'contains',
          hidden: false,
          label: '7^3 mod 9 = 1, nghịch đảo của 7 là 4, có 4 số nguyên tố ≤ 10',
        },
        {
          stdinLines: ['6', '2', '9', '10'],
          expected: 'tu-choi: khong-ton-tai-nghich-dao',
          match: 'contains',
          hidden: true,
          label: 'gcd(6, 9) = 3 nên không có nghịch đảo',
        },
        {
          stdinLines: ['5', '0', '7', '1'],
          expected: 'tu-choi: khong-co-so-nguyen-to',
          match: 'contains',
          hidden: true,
          label: 'n < 2 thì sàng không có gì để trả',
        },
        {
          stdinLines: ['2', '10', '0', '10'],
          expected: 'tu-choi: modulo-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'mô-đun bằng 0 bị chặn trước mọi phép tính',
        },
        {
          stdinLines: ['3', '0', '5', '2'],
          expected: 'luy-thua: 1\nnghich-dao: 2\nso-nguyen-to: 1',
          match: 'contains',
          hidden: true,
          label: 'số mũ 0 và n đúng bằng 2',
        },
      ],
      hints: [
        'Kiểm `m <= 0` trước tiên: mọi phép còn lại đều lấy dư theo m nên không có m thì không tính được gì.',
        'Tìm nghịch đảo bằng cách thử `x` từ 0 tới m-1 là đủ cho miền nhỏ; nhưng hãy kiểm `gcd` trước để biết có tồn tại hay không.',
        'Sàng: tạo mảng cờ `True` độ dài n+1, đánh dấu 0 và 1 là không nguyên tố, rồi gạch bội của từng số.',
      ],
      sampleSolution: `a = int(input().strip())\nb = int(input().strip())\nm = int(input().strip())\nn = int(input().strip())\n\nif m <= 0:\n    print("tu-choi: modulo-khong-hop-le")\n    raise SystemExit\n\ndef luy_thua(co_so, so_mu, mo_dun):\n    ket_qua = 1\n    co_so = co_so % mo_dun\n    while so_mu > 0:\n        if so_mu % 2 == 1:\n            ket_qua = (ket_qua * co_so) % mo_dun\n        co_so = (co_so * co_so) % mo_dun\n        so_mu = so_mu // 2\n    return ket_qua\n\nprint("luy-thua: " + str(luy_thua(a, b, m)))\n\ndef uoc_chung(x, y):\n    while y != 0:\n        x, y = y, x % y\n    return x\n\nif uoc_chung(a % m, m) != 1:\n    print("tu-choi: khong-ton-tai-nghich-dao")\nelse:\n    nghich_dao = 0\n    for x in range(m):\n        if (a * x) % m == 1:\n            nghich_dao = x\n            break\n    print("nghich-dao: " + str(nghich_dao))\n\nif n < 2:\n    print("tu-choi: khong-co-so-nguyen-to")\nelse:\n    co = [True] * (n + 1)\n    co[0] = False\n    co[1] = False\n    i = 2\n    while i * i <= n:\n        if co[i]:\n            for boi in range(i * i, n + 1, i):\n                co[boi] = False\n        i += 1\n    print("so-nguyen-to: " + str(sum(1 for x in co if x)))`,
    },
    homework:
      'So kết quả sàng với một hàm kiểm tra nguyên tố ngây thơ cho mọi n từ 0 đến 200 và ghi lại số đầu tiên lệch nhau nếu có. Sau đó thử thay hàm nghịch đảo bằng công thức Fermat `a^(m-2)` và tìm một mô-đun hợp số khiến nó trả ra số sai mà không hề báo lỗi.',
    srsCards: [
      {
        hoi: 'Nghịch đảo của a theo mô-đun m tồn tại khi nào?',
        dap: 'Khi và chỉ khi ước chung lớn nhất của a và m bằng 1; nếu chúng có ước chung lớn hơn 1 thì không số nào nhân với a cho ra dư 1 theo mô-đun m.',
      },
      {
        hoi: 'Vì sao công thức Fermat `a^(m-2)` không dùng được cho mọi mô-đun?',
        dap: 'Vì định lý Fermat nhỏ chỉ đúng khi m là số nguyên tố; với m hợp số công thức vẫn chạy và trả ra một con số, nhưng con số đó không phải nghịch đảo.',
      },
      {
        hoi: 'Luỹ thừa mô-đun bằng bình phương liên tiếp tốn khoảng bao nhiêu phép nhân?',
        dap: 'Khoảng log cơ số hai của số mũ, vì mỗi vòng lặp chia đôi số mũ; nhờ lấy dư ở mọi bước nên giá trị trung gian cũng không bao giờ phình to.',
      },
    ],
  },
  {
    id: 'p6-u228-l2',
    unitId: 'p6-u228',
    language: 'python',
    title: 'Giao đoạn thẳng bằng tích có hướng số nguyên — bỏ hẳn số thực',
    hook: 'Hình học máy tính hỏng nhiều nhất không ở công thức mà ở dấu phẩy động: hai điểm đáng lẽ thẳng hàng lại lệch nhau ở chữ số thứ mười bảy.',
    theory:
      'Tích có hướng của hai vectơ `(x1, y1)` và `(x2, y2)` là `x1*y2 - x2*y1`. Với toạ độ nguyên, tích này cũng nguyên, nên DẤU của nó — âm, dương hay đúng bằng 0 — là một câu trả lời chính xác tuyệt đối về việc một điểm nằm bên trái, bên phải hay ngay trên đường thẳng. Nếu đổi sang số thực và so sánh bằng `==`, câu trả lời "thẳng hàng" phụ thuộc vào sai số làm tròn, và một ca sát ngưỡng sẽ được phân loại sai mà không có ngoại lệ nào được ném ra. Thuật toán chuẩn: hai đoạn cắt nhau khi dấu của hai cặp tích có hướng đối nhau; trường hợp có tích bằng 0 là các ca suy biến (thẳng hàng) phải xử lý riêng bằng phép kiểm điểm nằm trong hình chữ nhật bao.',
    workedExample: {
      code: `# Tich co huong SO NGUYEN: dau cua no la cau tra loi chinh xac.\ndef huong(ax, ay, bx, by, cx, cy):\n    gia_tri = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)\n    if gia_tri > 0:\n        return 1\n    if gia_tri < 0:\n        return -1\n    return 0\n\nprint(huong(0, 0, 4, 4, 1, 1))\nprint(huong(0, 0, 4, 4, 0, 2))`,
      stdinLines: [],
    },
    predict: {
      code: `def huong(ax, ay, bx, by, cx, cy):\n    return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)\n\nprint(huong(0, 0, 2, 2, 5, 5))`,
      question: 'Tích có hướng in ra bao nhiêu?',
      choices: ['0', '6', '-6', '15'],
      answerIndex: 0,
      explain:
        'Ba điểm (0,0), (2,2), (5,5) cùng nằm trên đường y = x nên tích có hướng đúng bằng 0 — và với toạ độ nguyên, con số 0 này là chính xác tuyệt đối.',
    },
    parsons: {
      prompt: 'Xếp hàm trả dấu của tích có hướng, dùng số nguyên từ đầu đến cuối.',
      lines: [
        'def huong(ax, ay, bx, by, cx, cy):',
        '    gia_tri = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)',
        '    if gia_tri > 0:',
        '        return 1',
        '    if gia_tri < 0:',
        '        return -1',
        '    return 0',
      ],
    },
    make: {
      prompt:
        'Đọc tám số nguyên trên tám dòng: `ax ay bx by cx cy dx dy`, là hai đoạn thẳng AB và CD. Dùng TÍCH CÓ HƯỚNG SỐ NGUYÊN để in đúng một dòng: `trung-nhau: <lý do>` khi bốn điểm thẳng hàng và hai đoạn có phần chung, `cat-nhau: <lý do>` khi hai đoạn có điểm chung, `khong-cat-nhau: <lý do>` khi không. CẤM dùng `float`, phép chia `/`, hay so sánh số thực bằng `==` — mọi phép tính phải là số nguyên.',
      starterCode: `ax = int(input().strip())\nay = int(input().strip())\nbx = int(input().strip())\nby = int(input().strip())\ncx = int(input().strip())\ncy = int(input().strip())\ndx = int(input().strip())\ndy = int(input().strip())\n\n# Bon dau cua tich co huong quyet dinh tat ca.`,
      testCases: [
        {
          stdinLines: ['0', '0', '4', '4', '0', '4', '4', '0'],
          expected: 'cat-nhau: cross-doi-dau',
          match: 'contains',
          hidden: false,
          label: 'hai đường chéo cắt nhau ở giữa',
        },
        {
          stdinLines: ['0', '0', '1', '1', '3', '3', '4', '4'],
          expected: 'khong-cat-nhau: thang-hang-roi-nhau',
          match: 'contains',
          hidden: true,
          label: 'thẳng hàng nhưng rời nhau',
        },
        {
          stdinLines: ['0', '0', '4', '4', '2', '2', '6', '6'],
          expected: 'trung-nhau: thang-hang-chong-nhau',
          match: 'contains',
          hidden: true,
          label: 'thẳng hàng và chồng lên nhau',
        },
        {
          stdinLines: ['0', '0', '4', '0', '0', '1', '4', '1'],
          expected: 'khong-cat-nhau: cung-dau',
          match: 'contains',
          hidden: true,
          label: 'hai đoạn song song rời nhau',
        },
        {
          stdinLines: ['0', '0', '4', '4', '4', '4', '8', '0'],
          expected: 'cat-nhau: cham-dau-mut',
          match: 'contains',
          hidden: true,
          label: 'chạm đúng một đầu mút — ca sát ngưỡng',
        },
      ],
      hints: [
        'Viết một hàm `huong` trả về -1, 0 hoặc 1; mọi quyết định còn lại chỉ nhìn bốn giá trị đó.',
        'Bốn dấu khác 0 và hai cặp đối nhau nghĩa là cắt nhau thực sự ở trong lòng hai đoạn.',
        'Khi một dấu bằng 0, hãy kiểm điểm đó có nằm trong hình chữ nhật bao của đoạn kia không — chỉ bằng phép so sánh số nguyên.',
      ],
      sampleSolution: `ax = int(input().strip())\nay = int(input().strip())\nbx = int(input().strip())\nby = int(input().strip())\ncx = int(input().strip())\ncy = int(input().strip())\ndx = int(input().strip())\ndy = int(input().strip())\n\ndef huong(px, py, qx, qy, rx, ry):\n    gia_tri = (qx - px) * (ry - py) - (qy - py) * (rx - px)\n    if gia_tri > 0:\n        return 1\n    if gia_tri < 0:\n        return -1\n    return 0\n\ndef trong_bao(px, py, qx, qy, rx, ry):\n    return min(px, qx) <= rx <= max(px, qx) and min(py, qy) <= ry <= max(py, qy)\n\nd1 = huong(ax, ay, bx, by, cx, cy)\nd2 = huong(ax, ay, bx, by, dx, dy)\nd3 = huong(cx, cy, dx, dy, ax, ay)\nd4 = huong(cx, cy, dx, dy, bx, by)\n\nif d1 == 0 and d2 == 0:\n    chung = (\n        trong_bao(ax, ay, bx, by, cx, cy)\n        or trong_bao(ax, ay, bx, by, dx, dy)\n        or trong_bao(cx, cy, dx, dy, ax, ay)\n        or trong_bao(cx, cy, dx, dy, bx, by)\n    )\n    if chung:\n        print("trung-nhau: thang-hang-chong-nhau")\n    else:\n        print("khong-cat-nhau: thang-hang-roi-nhau")\n    raise SystemExit\n\nif d1 != d2 and d3 != d4 and d1 != 0 and d2 != 0 and d3 != 0 and d4 != 0:\n    print("cat-nhau: cross-doi-dau")\n    raise SystemExit\n\nif d1 == 0 and trong_bao(ax, ay, bx, by, cx, cy):\n    print("cat-nhau: cham-dau-mut")\nelif d2 == 0 and trong_bao(ax, ay, bx, by, dx, dy):\n    print("cat-nhau: cham-dau-mut")\nelif d3 == 0 and trong_bao(cx, cy, dx, dy, ax, ay):\n    print("cat-nhau: cham-dau-mut")\nelif d4 == 0 and trong_bao(cx, cy, dx, dy, bx, by):\n    print("cat-nhau: cham-dau-mut")\nelse:\n    print("khong-cat-nhau: cung-dau")`,
    },
    homework:
      'Viết một bản dùng `float` và so sánh `== 0.0` cho cùng bài, rồi sinh các ca sát ngưỡng với toạ độ lớn (ví dụ 10^9) để tìm bộ dữ liệu đầu tiên hai bản phân loại khác nhau. Ghi lại bộ đó làm bằng chứng cho luật "hình học số nguyên thì dùng số nguyên".',
    srsCards: [
      {
        hoi: 'Dấu của tích có hướng cho biết điều gì về vị trí một điểm?',
        dap: 'Dấu dương nghĩa là điểm nằm bên trái đường thẳng đi qua hai điểm kia, dấu âm là bên phải, và đúng bằng 0 nghĩa là ba điểm thẳng hàng.',
      },
      {
        hoi: 'Vì sao dùng `float` để kiểm ba điểm thẳng hàng là nguy hiểm?',
        dap: 'Vì sai số làm tròn khiến một biểu thức đáng lẽ bằng 0 lại ra một số rất nhỏ khác 0, nên ca thẳng hàng bị phân loại sai mà chương trình không báo lỗi gì.',
      },
      {
        hoi: 'Khi một tích có hướng bằng 0, phải kiểm thêm điều gì trước khi kết luận hai đoạn cắt nhau?',
        dap: 'Phải kiểm điểm thẳng hàng đó có thực sự nằm trong hình chữ nhật bao của đoạn kia hay không, vì thẳng hàng mới chỉ nói về đường thẳng vô hạn chứ chưa nói về đoạn hữu hạn.',
      },
    ],
  },
]
