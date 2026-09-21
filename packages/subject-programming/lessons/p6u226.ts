// P6-U226 — algo-s3-m1: quy hoạch động — đặt trạng thái trước khi viết code, rồi chuyển
// từ đệ quy có nhớ sang bản lặp và giảm chiều bộ nhớ. Mọi miền dữ liệu đều bounded để
// oracle vét cạn chạy xong trong timeout.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U226_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u226-l1',
    unitId: 'p6-u226',
    language: 'python',
    title: 'Quy hoạch động — đặt trạng thái và công thức chuyển trước khi gõ code',
    hook: 'Phần lớn bài quy hoạch động sai không phải vì code xấu, mà vì người viết bắt đầu gõ khi chưa nói được "trạng thái của tôi là gì".',
    theory:
      'Một lời giải quy hoạch động cần ba câu trả lời viết ra giấy TRƯỚC khi gõ: trạng thái là gì, chuyển trạng thái tính từ đâu, và thứ tự tính nào bảo đảm mọi thứ cần đã có sẵn. Với bài ba lô 0/1, trạng thái là "dùng i món đầu tiên, sức chứa còn c thì giá trị lớn nhất là bao nhiêu"; chuyển là chọn max giữa bỏ món i và lấy món i. Bản lặp bottom-up duyệt sức chứa GIẢM DẦN để mỗi món chỉ được lấy một lần — đó chính là chỗ một lỗi off-by-one trên chỉ số trạng thái biến bài 0/1 thành bài ba lô vô hạn mà không hề báo lỗi chạy. Vì vậy miền dữ liệu ở đây bị chặn nhỏ: một oracle đệ quy vét cạn chạy được trên cùng input và so từng giá trị trả về, thay vì tin mắt đọc code.',
    workedExample: {
      code: `# Trang thai: dp[c] = gia tri lon nhat khi suc chua con c.\ndp = [0] * 6\nmon = [(2, 3), (3, 4)]\nfor w, v in mon:\n    # Duyet GIAM DAN de moi mon chi duoc lay mot lan.\n    for c in range(5, w - 1, -1):\n        if dp[c - w] + v > dp[c]:\n            dp[c] = dp[c - w] + v\nprint(dp[5])`,
      stdinLines: [],
    },
    predict: {
      code: `dp = [0] * 4\nfor c in range(3, 1, -1):\n    dp[c] = dp[c - 2] + 5\nprint(dp)`,
      question: 'Dòng `print(dp)` in ra gì?',
      choices: ['[0, 0, 5, 5]', '[0, 0, 0, 5]', '[5, 5, 5, 5]', '[0, 0, 5, 10]'],
      answerIndex: 0,
      explain:
        'Vòng chạy c = 3 rồi c = 2. Với c = 3 lấy dp[1] + 5 = 5, với c = 2 lấy dp[0] + 5 = 5; dp[0] và dp[1] không bị đụng tới nên vẫn bằng 0.',
    },
    parsons: {
      prompt: 'Xếp vòng lặp bottom-up của ba lô 0/1 để mỗi món chỉ được chọn đúng một lần.',
      lines: [
        'for w, v in mon:',
        '    for c in range(suc_chua, w - 1, -1):',
        '        if dp[c - w] + v > dp[c]:',
        '            dp[c] = dp[c - w] + v',
        'print(dp[suc_chua])',
      ],
    },
    make: {
      prompt:
        'Đọc dòng một là danh sách món dạng `trọng lượng:giá trị` cách nhau bởi dấu phẩy, dòng hai là sức chứa. Giải BA LÔ 0/1 bằng quy hoạch động bottom-up một chiều và in `ket-qua: <giá trị lớn nhất>`. Dòng một rỗng hoặc sai khuôn in `tu-choi: rong`. Có trọng lượng/giá trị ≤ 0 hoặc sức chứa âm in `tu-choi: gia-tri-am`. Quá 12 món hoặc sức chứa quá 100 in `tu-choi: qua-lon`. Miền bị chặn như vậy để oracle vét cạn đối chiếu được; không dùng thư viện tối ưu ngoài.',
      starterCode: `dong_mon = input().strip()\ndong_suc_chua = input().strip()\n\n# Dat trang thai truoc: dp[c] = gia tri lon nhat voi suc chua con c.`,
      testCases: [
        {
          stdinLines: ['2:3,3:4,4:5', '5'],
          expected: 'ket-qua: 7',
          match: 'contains',
          hidden: false,
          label: 'chọn món 2kg và 3kg vừa đủ sức chứa',
        },
        {
          stdinLines: ['1:1', '0'],
          expected: 'ket-qua: 0',
          match: 'contains',
          hidden: true,
          label: 'sức chứa 0 là ca biên hợp lệ',
        },
        {
          stdinLines: ['5:10', '4'],
          expected: 'ket-qua: 0',
          match: 'contains',
          hidden: true,
          label: 'không món nào nhét vừa',
        },
        {
          stdinLines: ['', '5'],
          expected: 'tu-choi: rong',
          match: 'contains',
          hidden: true,
          label: 'danh sách rỗng',
        },
        {
          stdinLines: ['2:-3', '5'],
          expected: 'tu-choi: gia-tri-am',
          match: 'contains',
          hidden: true,
          label: 'giá trị âm nằm ngoài hợp đồng bài này',
        },
        {
          stdinLines: ['1:1,1:1,1:1,1:1,1:1,1:1,1:1,1:1,1:1,1:1,1:1,1:1,1:1', '5'],
          expected: 'tu-choi: qua-lon',
          match: 'contains',
          hidden: true,
          label: 'vượt trần oracle vét cạn',
        },
      ],
      hints: [
        'Viết ra trạng thái bằng lời trước: dp[c] nghĩa là gì khi đã xét xong i món?',
        'Kiểm hết input trước khi dựng bảng dp — thứ tự kiểm quyết định thông báo nào được in.',
        'Vòng sức chứa phải đi từ lớn về nhỏ; đi từ nhỏ lên lớn là biến bài thành ba lô lấy lặp.',
      ],
      sampleSolution: `dong_mon = input().strip()\ndong_suc_chua = input().strip()\n\nif dong_mon == "":\n    print("tu-choi: rong")\n    raise SystemExit\n\ntry:\n    mon = []\n    for phan in dong_mon.split(","):\n        w_s, v_s = phan.strip().split(":")\n        mon.append((int(w_s), int(v_s)))\n    suc_chua = int(dong_suc_chua)\nexcept ValueError:\n    print("tu-choi: rong")\n    raise SystemExit\n\nif suc_chua < 0 or any(w <= 0 or v <= 0 for w, v in mon):\n    print("tu-choi: gia-tri-am")\n    raise SystemExit\n\nif len(mon) > 12 or suc_chua > 100:\n    print("tu-choi: qua-lon")\n    raise SystemExit\n\ndp = [0] * (suc_chua + 1)\nfor w, v in mon:\n    for c in range(suc_chua, w - 1, -1):\n        if dp[c - w] + v > dp[c]:\n            dp[c] = dp[c - w] + v\n\nprint("ket-qua: " + str(dp[suc_chua]))`,
    },
    homework:
      'Viết thêm một oracle đệ quy vét cạn cho đúng bài này, sinh 100 bộ dữ liệu nhỏ bằng một bộ sinh có hạt giống cố định và so từng giá trị. Sau đó cố ý đổi `range(suc_chua, w - 1, -1)` thành vòng tăng dần và ghi lại bộ dữ liệu đầu tiên làm hai bản lệch nhau.',
    srsCards: [
      {
        hoi: 'Ba câu phải trả lời trước khi gõ một lời giải quy hoạch động là gì?',
        dap: 'Trạng thái biểu diễn cái gì, công thức chuyển tính trạng thái đó từ những trạng thái nào, và thứ tự tính nào bảo đảm mọi trạng thái phụ thuộc đã được tính xong.',
      },
      {
        hoi: 'Vì sao ba lô 0/1 bản một chiều phải duyệt sức chứa giảm dần?',
        dap: 'Vì duyệt tăng dần sẽ đọc lại ô đã cập nhật bởi chính món đang xét, nên một món có thể được lấy nhiều lần và bài biến thành ba lô không giới hạn số lượng.',
      },
      {
        hoi: 'Vì sao lỗi off-by-one của quy hoạch động khó phát hiện bằng mắt?',
        dap: 'Vì nó không gây lỗi chạy: chương trình vẫn in ra một con số trông hợp lý, chỉ sai giá trị, nên phải đối chiếu với một oracle vét cạn trên miền nhỏ mới thấy.',
      },
    ],
  },
  {
    id: 'p6-u226-l2',
    unitId: 'p6-u226',
    language: 'python',
    title: 'Từ đệ quy có nhớ sang bản lặp — giảm chiều bộ nhớ mà không đổi kết quả',
    hook: 'Bảng hai chiều đầy đủ dễ viết nhưng tốn bộ nhớ; rút xuống một chiều chỉ an toàn khi bạn biết đúng dòng nào còn cần đọc.',
    theory:
      'Đệ quy có nhớ và bản lặp bottom-up là hai cách đi trên cùng một đồ thị phụ thuộc: một cái đi từ ngọn xuống gốc và ghi nhớ, một cái đi từ gốc lên. Khi đã có bản lặp hai chiều, việc giảm chiều bộ nhớ chỉ là quan sát "dòng i chỉ đọc dòng i-1" rồi giữ lại hai dòng, hoặc một dòng nếu thứ tự duyệt cho phép. Bài dưới đây dùng dãy con tăng nghiêm ngặt dài nhất (LIS) với bảng một chiều `dai[i]`, trong đó mỗi ô chỉ đọc các ô có chỉ số nhỏ hơn. Giảm chiều SAI không làm chương trình vỡ — nó chỉ trả về một con số nhỏ hơn hoặc lớn hơn sự thật, nên bản đúng phải chịu được đối chiếu với vét cạn trên dãy ngắn.',
    workedExample: {
      code: `# dai[i] = do dai day con tang ket thuc dung tai i.\nds = [3, 1, 4, 1, 5]\ndai = [1] * len(ds)\nfor i in range(len(ds)):\n    for j in range(i):\n        # Chi doc cac o co chi so NHO HON i.\n        if ds[j] < ds[i] and dai[j] + 1 > dai[i]:\n            dai[i] = dai[j] + 1\nprint(max(dai))`,
      stdinLines: [],
    },
    predict: {
      code: `ds = [2, 2, 2]\ndai = [1] * 3\nfor i in range(3):\n    for j in range(i):\n        if ds[j] < ds[i]:\n            dai[i] = dai[j] + 1\nprint(max(dai))`,
      question: 'Kết quả in ra là bao nhiêu?',
      choices: ['1', '2', '3', '0'],
      answerIndex: 0,
      explain:
        'Điều kiện là tăng NGHIÊM NGẶT nên ba giá trị bằng nhau không nối được vào nhau; mọi ô giữ nguyên giá trị khởi tạo 1.',
    },
    parsons: {
      prompt: 'Xếp phần lõi của LIS một chiều để mỗi ô chỉ đọc các ô đã tính xong.',
      lines: [
        'dai = [1] * len(ds)',
        'for i in range(len(ds)):',
        '    for j in range(i):',
        '        if ds[j] < ds[i] and dai[j] + 1 > dai[i]:',
        '            dai[i] = dai[j] + 1',
        'print(max(dai))',
      ],
    },
    make: {
      prompt:
        'Đọc một dòng gồm các số nguyên cách nhau bởi dấu phẩy. In `ket-qua: <độ dài dãy con TĂNG NGHIÊM NGẶT dài nhất>` tính bằng bảng quy hoạch động MỘT CHIỀU. Dòng rỗng hoặc sai khuôn in `tu-choi: rong`; quá 20 số in `tu-choi: qua-lon`. Không sắp xếp rồi đếm phần tử khác nhau — cách đó sai với dãy không đơn điệu.',
      starterCode: `dong = input().strip()\n\n# dai[i] chi duoc doc cac o co chi so nho hon i.`,
      testCases: [
        {
          stdinLines: ['3,1,4,1,5,9,2,6'],
          expected: 'ket-qua: 4',
          match: 'contains',
          hidden: false,
          label: 'dãy kinh điển, đáp án là 4',
        },
        {
          stdinLines: ['5'],
          expected: 'ket-qua: 1',
          match: 'contains',
          hidden: true,
          label: 'một phần tử',
        },
        {
          stdinLines: ['7,7,7'],
          expected: 'ket-qua: 1',
          match: 'contains',
          hidden: true,
          label: 'tăng nghiêm ngặt nên giá trị trùng không nối',
        },
        {
          stdinLines: ['9,8,7,6'],
          expected: 'ket-qua: 1',
          match: 'contains',
          hidden: true,
          label: 'dãy giảm hoàn toàn',
        },
        {
          stdinLines: [''],
          expected: 'tu-choi: rong',
          match: 'contains',
          hidden: true,
          label: 'dãy rỗng',
        },
        {
          stdinLines: ['1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21'],
          expected: 'tu-choi: qua-lon',
          match: 'contains',
          hidden: true,
          label: 'vượt trần đối chiếu vét cạn',
        },
      ],
      hints: [
        'Khởi tạo mọi ô bằng 1: một phần tử luôn tự nó là một dãy con hợp lệ.',
        'So sánh phải là `<` chứ không phải `<=` nếu đề yêu cầu tăng nghiêm ngặt.',
        'Đáp án là `max(dai)`, không phải `dai[-1]` — dãy dài nhất có thể kết thúc ở giữa.',
      ],
      sampleSolution: `dong = input().strip()\n\nif dong == "":\n    print("tu-choi: rong")\n    raise SystemExit\n\ntry:\n    ds = [int(x.strip()) for x in dong.split(",")]\nexcept ValueError:\n    print("tu-choi: rong")\n    raise SystemExit\n\nif len(ds) > 20:\n    print("tu-choi: qua-lon")\n    raise SystemExit\n\ndai = [1] * len(ds)\nfor i in range(len(ds)):\n    for j in range(i):\n        if ds[j] < ds[i] and dai[j] + 1 > dai[i]:\n            dai[i] = dai[j] + 1\n\nprint("ket-qua: " + str(max(dai)))`,
    },
    homework:
      'Viết bản đệ quy có nhớ cho cùng bài LIS, so kết quả với bản lặp trên 100 dãy ngắn sinh có hạt giống. Sau đó viết một bản ba lô hai chiều rồi rút xuống một chiều, ghi lại số ô bộ nhớ tiết kiệm được theo công thức chứ không theo cảm giác.',
    srsCards: [
      {
        hoi: 'Khi nào một bảng quy hoạch động hai chiều rút xuống một chiều được?',
        dap: 'Khi mỗi dòng chỉ đọc dữ liệu của dòng liền trước hoặc của chính nó theo một thứ tự duyệt không ghi đè thứ còn cần đọc; lúc đó giữ lại một hoặc hai dòng là đủ.',
      },
      {
        hoi: 'Trong LIS một chiều, `dai[i]` được định nghĩa là gì?',
        dap: 'Là độ dài dãy con tăng dài nhất KẾT THÚC đúng tại phần tử thứ i, nên đáp án cuối cùng là giá trị lớn nhất trong toàn bảng chứ không phải ô cuối.',
      },
      {
        hoi: 'Vì sao giảm chiều bộ nhớ sai lại nguy hiểm hơn lỗi chạy?',
        dap: 'Vì chương trình vẫn chạy trọn vẹn và in ra một con số, chỉ khác là con số đó sai; không có ngoại lệ nào được ném ra để báo cho người viết biết.',
      },
    ],
  },
]
