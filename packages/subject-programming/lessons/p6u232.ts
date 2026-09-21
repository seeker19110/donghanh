// P6-U232 — algo-s4-m3: song song và bộ nhớ. Mọi thứ ở đây là MÔ PHỎNG SỐ HỌC: đếm số lần
// đổi khối nhớ khi duyệt ma trận, và chia N đơn vị công việc thành k phần bằng số học.
// Tuyệt đối không dùng đồng hồ tường, thread hay process thật làm điều kiện pass/fail.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U232_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u232-l1',
    unitId: 'p6-u232',
    language: 'python',
    title: 'Thứ tự duyệt và bộ nhớ — đếm số lần đổi khối thay vì bấm đồng hồ',
    hook: 'Hai vòng lặp cùng chạm đúng từng ấy ô, chỉ khác thứ tự, mà một bản chậm hơn bản kia nhiều lần. Nguyên nhân nằm ở khối nhớ, không ở số phép tính.',
    theory:
      'Bộ nhớ không được nạp từng byte mà theo KHỐI: chạm một ô thì cả khối chứa nó được kéo lên. Một ma trận hai chiều nằm trong bộ nhớ theo hàng, nên duyệt theo hàng đi liên tục trong cùng khối, còn duyệt theo cột nhảy qua cả hàng mỗi bước và đổi khối gần như liên tục. Ở bài này ta không đo thời gian — đo thời gian một lần là bằng chứng yếu, phụ thuộc máy, tải hệ thống và cả nhiệt độ CPU. Thay vào đó ta ĐẾM: quy ước địa chỉ tuyến tính của ô `(i, j)` là `i * so_cot + j`, khối của nó là `dia_chi // kich_thuoc_khoi`, và mỗi lần chỉ số khối khác lần chạm trước thì cộng một. Con số đếm được là tất định, lặp lại y hệt ở mọi máy, và đủ để giải thích khác biệt hiệu năng thật.',
    workedExample: {
      code: `# Dia chi tuyen tinh cua o (i, j) trong ma tran 3 cot.\nso_cot = 3\nfor i in range(2):\n    for j in range(3):\n        print(i * so_cot + j, (i * so_cot + j) // 4)`,
      stdinLines: [],
    },
    predict: {
      code: `so_cot = 4\nkich_thuoc_khoi = 4\ntruoc = -1\ndem = 0\nfor j in range(2):\n    for i in range(2):\n        khoi = (i * so_cot + j) // kich_thuoc_khoi\n        if khoi != truoc:\n            dem += 1\n            truoc = khoi\nprint(dem)`,
      question: 'Số lần đổi khối đếm được là bao nhiêu?',
      choices: ['1', '2', '4', '0'],
      answerIndex: 2,
      explain:
        'Duyệt theo cột nhảy qua lại giữa khối 0 và khối 1 ở mọi bước: các ô lần lượt thuộc khối 0, 1, 0, 1 nên cả bốn lần chạm đều là một lần đổi khối.',
    },
    parsons: {
      prompt: 'Xếp bộ đếm đổi khối cho một thứ tự duyệt bất kỳ.',
      lines: [
        'truoc = -1',
        'dem = 0',
        'for i, j in thu_tu:',
        '    khoi = (i * so_cot + j) // kich_thuoc_khoi',
        '    if khoi != truoc:',
        '        dem += 1',
        '        truoc = khoi',
      ],
    },
    make: {
      prompt:
        'Đọc ba dòng số nguyên: `so_hang`, `so_cot`, `kich_thuoc_khoi`. MÔ PHỎNG hai thứ tự duyệt trên cùng ma trận — theo hàng (i ngoài, j trong) và theo cột (j ngoài, i trong) — với quy ước địa chỉ `i * so_cot + j` và khối `dia_chi // kich_thuoc_khoi`, đếm số lần chỉ số khối khác lần chạm ngay trước (lần chạm đầu tiên luôn tính là một). In `doi-khoi: <theo hàng>-<theo cột>` rồi `chon: row-major` hoặc `chon: column-major` theo bên có số đổi khối NHỎ hơn (hoà thì chọn `row-major`). Tham số `<= 0` in `tu-choi: tham-so-khong-hop-le`. CẤM đo thời gian và CẤM dùng thread hay process thật.',
      starterCode: `so_hang = int(input().strip())\nso_cot = int(input().strip())\nkich_thuoc_khoi = int(input().strip())\n\n# Dem phep toan, KHONG bam dong ho.`,
      testCases: [
        {
          stdinLines: ['4', '4', '4'],
          expected: 'doi-khoi: 4-16\nchon: row-major',
          match: 'contains',
          hidden: false,
          label: 'ma trận 4x4, khối 4 ô: duyệt theo cột đổi khối mỗi bước',
        },
        {
          stdinLines: ['2', '2', '1'],
          expected: 'doi-khoi: 4-4\nchon: row-major',
          match: 'contains',
          hidden: true,
          label: 'khối một ô thì hai thứ tự bằng nhau — hoà chọn row-major',
        },
        {
          stdinLines: ['1', '8', '4'],
          expected: 'doi-khoi: 2-2\nchon: row-major',
          match: 'contains',
          hidden: true,
          label: 'ma trận một hàng: hai thứ tự duyệt trùng nhau',
        },
        {
          stdinLines: ['3', '3', '0'],
          expected: 'tu-choi: tham-so-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'kích thước khối bằng 0',
        },
        {
          stdinLines: ['0', '5', '4'],
          expected: 'tu-choi: tham-so-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'ma trận không có hàng nào',
        },
      ],
      hints: [
        'Viết một hàm `dem_doi_khoi(thu_tu)` nhận danh sách cặp (i, j) rồi dùng lại cho cả hai thứ tự.',
        'Khởi tạo khối trước đó bằng -1 để lần chạm đầu tiên luôn được tính là một lần đổi.',
        'Hai thứ tự chỉ khác nhau ở vòng nào nằm ngoài — dữ liệu và số ô chạm là y hệt nhau.',
      ],
      sampleSolution: `so_hang = int(input().strip())\nso_cot = int(input().strip())\nkich_thuoc_khoi = int(input().strip())\n\nif so_hang <= 0 or so_cot <= 0 or kich_thuoc_khoi <= 0:\n    print("tu-choi: tham-so-khong-hop-le")\n    raise SystemExit\n\ndef dem_doi_khoi(thu_tu):\n    truoc = -1\n    dem = 0\n    for i, j in thu_tu:\n        khoi = (i * so_cot + j) // kich_thuoc_khoi\n        if khoi != truoc:\n            dem += 1\n            truoc = khoi\n    return dem\n\ntheo_hang = [(i, j) for i in range(so_hang) for j in range(so_cot)]\ntheo_cot = [(i, j) for j in range(so_cot) for i in range(so_hang)]\n\na = dem_doi_khoi(theo_hang)\nb = dem_doi_khoi(theo_cot)\n\nprint("doi-khoi: " + str(a) + "-" + str(b))\nif b < a:\n    print("chon: column-major")\nelse:\n    print("chon: row-major")`,
    },
    homework:
      'Chạy mô phỏng với kích thước khối 1, 4, 16 và 64 trên ma trận 64x64, lập bảng số đổi khối theo hai thứ tự. Sau đó viết hai vòng lặp thật cộng dồn ma trận theo hàng và theo cột, quan sát khác biệt thời gian NGOÀI sandbox và đối chiếu xu hướng với bảng bạn vừa lập — nhưng đừng dùng con số thời gian ấy làm điều kiện pass/fail cho test.',
    srsCards: [
      {
        hoi: 'Vì sao duyệt ma trận theo cột thường chậm hơn theo hàng?',
        dap: 'Vì ma trận nằm trong bộ nhớ theo hàng, nên đi theo cột nhảy qua cả một hàng ở mỗi bước và rơi sang khối nhớ khác liên tục, trong khi đi theo hàng ở lại trong cùng khối.',
      },
      {
        hoi: 'Vì sao bài này đếm số lần đổi khối thay vì đo thời gian chạy?',
        dap: 'Vì số đếm là tất định và lặp lại y hệt ở mọi máy, còn thời gian phụ thuộc phần cứng và tải hệ thống nên một lần đo không phải là bằng chứng dùng chung được.',
      },
      {
        hoi: 'Khi kích thước khối bằng đúng một ô thì hai thứ tự duyệt khác nhau thế nào?',
        dap: 'Không khác gì nhau: mỗi lần chạm đều rơi vào một khối mới nên cả hai thứ tự cho cùng số lần đổi khối, và lợi thế của việc đi liên tục biến mất hoàn toàn.',
      },
    ],
  },
  {
    id: 'p6-u232-l2',
    unitId: 'p6-u232',
    language: 'python',
    title: 'Chia để trị song song — cân bằng tải đo bằng số học, không bằng thread thật',
    hook: 'Chia việc cho tám nhân mà bảy nhân xong sớm ngồi chờ một nhân, thì bạn chỉ mua được tốc độ của một nhân.',
    theory:
      'Trước khi bàn tới thread hay tiến trình, câu hỏi đầu tiên của tính toán song song là số học thuần: chia `N` đơn vị công việc thành `k` phần thì phần nặng nhất nặng hơn phần nhẹ nhất bao nhiêu? Chênh lệch đó chính là phần thời gian mọi người khác phải ngồi chờ. Chia đều đúng cách là lấy `N // k` cho mọi phần rồi rải `N % k` đơn vị dư sang các phần đầu, mỗi phần thêm đúng một — chênh lệch tối đa khi đó luôn là 0 hoặc 1. Cách chia lười biếng là cho `k-1` phần lấy `N // k` rồi dồn tất cả phần còn lại vào phần cuối; nó vẫn "chia hết việc" nhưng chênh lệch có thể lớn tuỳ ý. Bài này so hai chiến lược trên cùng số liệu — không dùng `threading`, `multiprocessing` hay đo thời gian.',
    workedExample: {
      code: `# Chia deu: rai phan du sang cac phan dau, moi phan them dung mot.\nN = 10\nk = 3\nco_ban = N // k\ndu = N % k\nphan = [co_ban + (1 if i < du else 0) for i in range(k)]\nprint(phan)\nprint(max(phan) - min(phan))`,
      stdinLines: [],
    },
    predict: {
      code: `N = 10\nk = 3\nphan = [N // k] * (k - 1)\nphan.append(N - sum(phan))\nprint(phan)\nprint(max(phan) - min(phan))`,
      question: 'Cách chia lười biếng cho ra gì?',
      choices: ['[3, 3, 4]\n1', '[3, 3, 3]\n0', '[4, 3, 3]\n1', '[3, 3, 4]\n0'],
      answerIndex: 0,
      explain:
        'Với N = 10 và k = 3 cách này tình cờ vẫn lệch có 1; hãy thử N = 10 với k = 4 để thấy phần cuối phồng lên thành 4 trong khi các phần kia chỉ có 2.',
    },
    parsons: {
      prompt: 'Xếp cách chia đều để chênh lệch tải tối đa không bao giờ vượt quá 1.',
      lines: [
        'co_ban = N // k',
        'du = N % k',
        'phan = []',
        'for i in range(k):',
        '    phan.append(co_ban + (1 if i < du else 0))',
        'print(max(phan) - min(phan))',
      ],
    },
    make: {
      prompt:
        'Đọc hai dòng số nguyên: `N` (số đơn vị công việc) và `k` (số phần). MÔ PHỎNG hai cách chia bằng SỐ HỌC: (a) chia đều — mỗi phần `N // k`, rồi `N % k` phần ĐẦU mỗi phần thêm một; (b) chia lười — `k - 1` phần đầu lấy `N // k`, phần CUỐI nhận toàn bộ phần còn lại. In `can-bang: <chênh lệch tối đa cách a>-<chênh lệch tối đa cách b>` rồi `chon: chia-deu` hoặc `chon: chia-luoi` theo bên có chênh lệch NHỎ hơn (hoà thì chọn `chia-deu`). `k <= 0`, `k > N` hoặc `N <= 0` in `tu-choi: k-khong-hop-le`. CẤM dùng `threading`, `multiprocessing` và CẤM đo thời gian.',
      starterCode: `N = int(input().strip())\nk = int(input().strip())\n\n# Chenh lech tai = thoi gian moi nguoi khac phai ngoi cho.`,
      testCases: [
        {
          stdinLines: ['10', '4'],
          expected: 'can-bang: 1-2\nchon: chia-deu',
          match: 'contains',
          hidden: false,
          label: 'chia lười dồn phần dư vào phần cuối nên lệch gấp đôi',
        },
        {
          stdinLines: ['12', '4'],
          expected: 'can-bang: 0-0\nchon: chia-deu',
          match: 'contains',
          hidden: true,
          label: 'chia hết thì hai cách bằng nhau — hoà chọn chia đều',
        },
        {
          stdinLines: ['7', '1'],
          expected: 'can-bang: 0-0\nchon: chia-deu',
          match: 'contains',
          hidden: true,
          label: 'một phần duy nhất thì không có chênh lệch',
        },
        {
          stdinLines: ['5', '9'],
          expected: 'tu-choi: k-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'nhiều phần hơn số việc',
        },
        {
          stdinLines: ['5', '0'],
          expected: 'tu-choi: k-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'số phần bằng 0',
        },
      ],
      hints: [
        'Chênh lệch tối đa là `max(phan) - min(phan)`, không phải độ lệch so với trung bình.',
        'Cách chia đều luôn cho chênh lệch 0 hoặc 1 — nếu bạn ra số lớn hơn thì phần dư đang bị rải sai.',
        'Kiểm `k > N` trước: chia 5 việc cho 9 phần thì có phần rỗng, nằm ngoài hợp đồng bài này.',
      ],
      sampleSolution: `N = int(input().strip())\nk = int(input().strip())\n\nif N <= 0 or k <= 0 or k > N:\n    print("tu-choi: k-khong-hop-le")\n    raise SystemExit\n\nco_ban = N // k\ndu = N % k\nchia_deu = [co_ban + (1 if i < du else 0) for i in range(k)]\n\nchia_luoi = [co_ban] * (k - 1)\nchia_luoi.append(N - co_ban * (k - 1))\n\nlech_deu = max(chia_deu) - min(chia_deu)\nlech_luoi = max(chia_luoi) - min(chia_luoi)\n\nprint("can-bang: " + str(lech_deu) + "-" + str(lech_luoi))\nif lech_luoi < lech_deu:\n    print("chon: chia-luoi")\nelse:\n    print("chon: chia-deu")`,
    },
    homework:
      'Lập bảng chênh lệch tải của hai cách chia với N từ 100 đến 110 và k từ 2 đến 8, rồi chỉ ra cặp (N, k) nào khiến cách chia lười tệ nhất. Sau đó viết ra bằng lời: nếu chênh lệch tải là d đơn vị thì tổng thời gian chờ của k-1 phần còn lại nhiều nhất là bao nhiêu.',
    srsCards: [
      {
        hoi: 'Chia đều N đơn vị cho k phần thì chênh lệch tải tối đa bằng bao nhiêu?',
        dap: 'Luôn bằng 0 hoặc 1, vì mỗi phần lấy N chia nguyên cho k rồi phần dư được rải sang các phần đầu, mỗi phần chỉ thêm đúng một đơn vị.',
      },
      {
        hoi: 'Vì sao dồn phần dư vào một phần duy nhất là cách chia tồi?',
        dap: 'Vì tổng thời gian chỉ được quyết định bởi phần nặng nhất; các phần khác xong sớm rồi ngồi chờ, nên phần lớn năng lực tính toán bị bỏ không.',
      },
      {
        hoi: 'Vì sao đánh giá cân bằng tải bằng số học lại đáng tin hơn chạy thread thật?',
        dap: 'Vì phép chia là tất định và tái hiện được ở mọi máy, còn kết quả chạy thread phụ thuộc bộ lập lịch của hệ điều hành và tải máy nên không lặp lại giữa hai lần đo.',
      },
    ],
  },
]
