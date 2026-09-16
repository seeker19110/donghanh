// P6-U165 — algo-s2-m4: greedy co oracle huu han va counterexample.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U165_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u165-l1',
    unitId: 'p6-u165',
    language: 'python',
    title: 'MÔ PHỎNG greedy chọn lịch không chồng lấp',
    hook: 'Một phòng họp chỉ phục vụ được một cuộc họp tại một thời điểm, nên một lựa chọn sớm sai có thể làm mất nhiều chỗ trống phía sau.',
    theory:
      'Interval scheduling tối đa số phiên dùng greedy: luôn nhận phiên kết thúc sớm nhất còn tương thích với phiên đã nhận. Khi hai phiên cùng giờ kết thúc, bài mô phỏng phá hoà bằng giờ bắt đầu rồi vị trí nhập để kết quả tái lập. Oracle bên dưới duyệt mọi tập con của tối đa tám phiên để đối chiếu số lượng; kiểm tra hữu hạn này minh hoạ, không phải chứng minh thay thế cho lập luận exchange của thuật toán tổng quát.',
    workedExample: {
      code: `# Sap theo luc ket thuc de de lai nhieu thoi gian cho phien sau.\nintervals = [(1, 4), (3, 5), (4, 7)]\nlast_end = -1\nchosen = []\nfor start, end in sorted(intervals, key=lambda item: (item[1], item[0])):\n    if start >= last_end:\n        chosen.append((start, end))\n        last_end = end\nprint(chosen)`,
      stdinLines: [],
    },
    predict: {
      code: `last_end = 4\nstart, end = 3, 5\nprint(start >= last_end)`,
      question:
        'Một phiên mới bắt đầu lúc 3 trong khi phiên trước kết thúc lúc 4. Greedy có nhận phiên mới không?',
      choices: ['True', 'False', '3', '5'],
      answerIndex: 1,
      explain:
        'Phiên mới chồng với phiên trước vì 3 nhỏ hơn 4; chỉ start >= last_end mới tương thích.',
    },
    parsons: {
      prompt: 'Xếp vòng greedy để chỉ giữ các phiên không chồng lấp.',
      lines: [
        'last_end = -1',
        'chosen = []',
        'for start, end in ordered:',
        '    if start >= last_end:',
        '        chosen.append((start, end))',
        '        last_end = end',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG chọn tối đa cuộc hẹn không chồng lấp. Đọc một dòng `start-end` phân cách bằng dấu phẩy, ví dụ `1-4,3-5,0-6,5-7,8-9`. Tối đa 8 phiên; mỗi mốc là số nguyên 0..99 và phải có start < end. Dấu `-` nghĩa là lịch rỗng. Sắp theo `(end, start, vị-trí-nhập)`, nhận phiên nếu `start >= last_end`, rồi in `selected=1-4,5-7,8-9`, `count=<n>` và `oracle=<n>`. Oracle phải vét cạn mọi tập con hữu hạn để kiểm số lượng tối ưu. Input sai in `input-khong-hop-le`; không dùng thư viện tối ưu, thời gian, random hay đổi chuỗi input.',
      starterCode: `raw = input().strip()\n\n# MÔ PHỎNG: greedy theo giờ kết thúc, sau đó oracle duyệt tối đa 2^8 tập con.`,
      testCases: [
        {
          stdinLines: ['1-4,3-5,0-6,5-7,8-9'],
          expected: 'selected=1-4,5-7,8-9\ncount=3\noracle=3',
          match: 'contains',
          hidden: false,
          label: 'greedy bỏ phiên chồng lấp để nhận ba phiên',
        },
        {
          stdinLines: ['1-2,2-3,3-4'],
          expected: 'count=3\noracle=3',
          match: 'contains',
          hidden: true,
          label: 'hai đầu mút kề nhau vẫn tương thích',
        },
        {
          stdinLines: ['-'],
          expected: 'selected=\ncount=0\noracle=0',
          match: 'contains',
          hidden: true,
          label: 'lịch rỗng là trường hợp biên hợp lệ',
        },
        {
          stdinLines: ['4-4,5-6'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'phiên không có độ dài phải bị từ chối',
        },
      ],
      hints: [
        'Gắn vị trí nhập vào mỗi phiên trước khi sort để phá hoà một cách tất định.',
        'Với oracle, duyệt mask từ 0 đến 2**n - 1 rồi sort tập con theo start trước khi kiểm chồng lấp.',
        'Oracle chỉ cần trả số lượng lớn nhất; đừng suy luận rằng tám phần tử đã chứng minh mọi đầu vào.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    intervals = []
    if raw != "-":
        tokens = raw.split(",")
        if not raw or len(tokens) > 8:
            raise ValueError
        for index, token in enumerate(tokens):
            parts = token.split("-")
            if len(parts) != 2:
                raise ValueError
            start, end = (int(part) for part in parts)
            if not 0 <= start < end <= 99:
                raise ValueError
            intervals.append((start, end, index))

    ordered = sorted(intervals, key=lambda item: (item[1], item[0], item[2]))
    chosen = []
    last_end = -1
    for start, end, index in ordered:
        if start >= last_end:
            chosen.append((start, end, index))
            last_end = end

    oracle = 0
    for mask in range(1 << len(intervals)):
        candidate = [intervals[i] for i in range(len(intervals)) if mask & (1 << i)]
        candidate.sort(key=lambda item: (item[0], item[1], item[2]))
        if all(candidate[i][1] <= candidate[i + 1][0] for i in range(len(candidate) - 1)):
            oracle = max(oracle, len(candidate))

    print("selected=" + ",".join(f"{start}-{end}" for start, end, _ in chosen))
    print(f"count={len(chosen)}")
    print(f"oracle={oracle}")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Tạo một lịch có hai phiên cùng giờ kết thúc và viết ra quy tắc phá hoà bạn chọn. Sau đó giải thích bằng exchange argument ngắn vì sao thay phiên đầu tiên bằng phiên kết thúc sớm hơn không làm giảm số chỗ còn có thể chọn.',
    srsCards: [
      {
        hoi: 'Quy tắc greedy của interval scheduling tối đa số phiên là gì?',
        dap: 'Sắp các phiên theo giờ kết thúc tăng dần rồi luôn nhận phiên tương thích đầu tiên, vì nó để lại nhiều thời gian nhất cho các phiên sau.',
      },
      {
        hoi: 'Vì sao oracle vét cạn tám phiên không tự nó chứng minh greedy luôn đúng?',
        dap: 'Nó chỉ kiểm tất cả trường hợp trong miền hữu hạn đã đặt ra; tính đúng tổng quát cần lập luận exchange hoặc chứng minh riêng cho mọi kích thước input.',
      },
    ],
  },
  {
    id: 'p6-u165-l2',
    unitId: 'p6-u165',
    language: 'python',
    title: 'MÔ PHỎNG coin greedy và phản ví dụ hữu hạn',
    hook: 'Chọn đồng xu lớn nhất nhìn có vẻ hợp lý, nhưng hệ mệnh giá 1, 3, 4 đổi 6 lại là một cái bẫy nhỏ.',
    theory:
      'Coin greedy luôn lấy mệnh giá không vượt quá số tiền còn lại. Nó đúng với vài hệ tiền quen thuộc nhưng không đúng cho mọi tập mệnh giá: với 1, 3, 4 và số tiền 6, greedy lấy 4+1+1 còn oracle lấy 3+3. Bài mô phỏng dùng một oracle đệ quy hữu hạn để tìm số xu ít nhất cho amount không quá 99; một counterexample hoặc một cuộc tìm kiếm hữu hạn không thay cho proof về mọi amount và mọi hệ tiền.',
    workedExample: {
      code: `# Greedy lay dong lon nhat khong vuot qua so tien con lai.\ncoins = [4, 3, 1]\nremaining = 6\nchosen = []\nfor coin in coins:\n    while remaining >= coin:\n        chosen.append(coin)\n        remaining -= coin\nprint(chosen)`,
      stdinLines: [],
    },
    predict: {
      code: `remaining = 6\ncoin = 4\nremaining -= coin\nprint(remaining)`,
      question: 'Sau khi greedy lấy đồng 4 để đổi 6, số tiền còn lại là bao nhiêu?',
      choices: ['1', '2', '3', '4'],
      answerIndex: 1,
      explain: 'Greedy trừ 4 từ 6 nên còn 2; sau đó nó mới xét tiếp các đồng nhỏ hơn.',
    },
    parsons: {
      prompt: 'Xếp bước greedy để lấy các đồng xu lớn trước một cách xác định.',
      lines: [
        'remaining = amount',
        'chosen = []',
        'for coin in sorted(coins, reverse=True):',
        '    while remaining >= coin:',
        '        chosen.append(coin)',
        '        remaining -= coin',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG đổi xu. Dòng 1 là các mệnh giá nguyên dương phân cách dấu phẩy, dòng 2 là amount nguyên 0..99. Có 1..6 mệnh giá khác nhau trong 1..50. Chạy greedy lấy đồng lớn nhất trước và một ORACLE đệ quy hữu hạn tìm số đồng ít nhất. Nếu oracle không cách nào đổi chính xác, in `khong-the-doi`. Nếu oracle đổi được, in `greedy=4+1+1` và `greedy-count=3`; trường hợp greedy kẹt thì in `greedy=khong-the-doi` và `greedy-count=khong-the-doi`. Sau đó in `oracle-count=2`, rồi `counterexample=yes` khi greedy kẹt hoặc nhiều đồng hơn oracle, ngược lại `counterexample=no`. Input sai in `input-khong-hop-le`. Không dùng DP/library tối ưu; oracle chỉ là tìm kiếm bounded, không kết luận hệ tiền luôn tối ưu.',
      starterCode: `raw_coins = input().strip()\nraw_amount = input().strip()\n\n# MÔ PHỎNG: so greedy voi oracle de quy tren amount <= 99.`,
      testCases: [
        {
          stdinLines: ['1,3,4', '6'],
          expected: 'greedy=4+1+1\ngreedy-count=3\noracle-count=2\ncounterexample=yes',
          match: 'contains',
          hidden: false,
          label: 'hệ 1,3,4 có phản ví dụ ở amount 6',
        },
        {
          stdinLines: ['1,5,10', '15'],
          expected: 'greedy-count=2\noracle-count=2\ncounterexample=no',
          match: 'contains',
          hidden: true,
          label: 'một input trùng kết quả không chứng minh mọi amount',
        },
        {
          stdinLines: ['4,6', '5'],
          expected: 'khong-the-doi',
          match: 'contains',
          hidden: true,
          label: 'không có mệnh giá 1 có thể làm amount không đạt được',
        },
        {
          stdinLines: ['3,4', '6'],
          expected:
            'greedy=khong-the-doi\ngreedy-count=khong-the-doi\noracle-count=2\ncounterexample=yes',
          match: 'contains',
          hidden: true,
          label: 'greedy kẹt không đồng nghĩa oracle không đổi được',
        },
        {
          stdinLines: ['1,1,5', '6'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'mệnh giá trùng làm hợp đồng không xác định',
        },
      ],
      hints: [
        'Dùng `sorted(coins, reverse=True)` để greedy không phụ thuộc thứ tự người dùng nhập.',
        'Oracle có thể thử từng coin không vượt amount còn lại và trả về `None` nếu nhánh không đổi hết.',
        'Chỉ in counterexample sau khi cả greedy và oracle đều đổi chính xác được số tiền.',
      ],
      sampleSolution: `try:
    raw_coins = input().strip()
    amount = int(input().strip())
    tokens = raw_coins.split(",")
    if not raw_coins or not 0 <= amount <= 99 or not 1 <= len(tokens) <= 6:
        raise ValueError
    coins = [int(token) for token in tokens]
    if any(not 1 <= coin <= 50 for coin in coins) or len(set(coins)) != len(coins):
        raise ValueError
    coins.sort(reverse=True)

    remaining = amount
    greedy = []
    for coin in coins:
        while remaining >= coin:
            greedy.append(coin)
            remaining -= coin
    def oracle(index, rest):
        if rest == 0:
            return 0
        if index == len(coins):
            return None
        coin = coins[index]
        best = None
        for count in range(rest // coin, -1, -1):
            tail = oracle(index + 1, rest - count * coin)
            if tail is not None:
                candidate = count + tail
                if best is None or candidate < best:
                    best = candidate
        return best

    optimal = oracle(0, amount)
    if optimal is None:
        print("khong-the-doi")
    else:
        if remaining == 0:
            print("greedy=" + "+".join(str(coin) for coin in greedy))
            print(f"greedy-count={len(greedy)}")
        else:
            print("greedy=khong-the-doi")
            print("greedy-count=khong-the-doi")
        print(f"oracle-count={optimal}")
        print(
            "counterexample=yes"
            if remaining != 0 or len(greedy) > optimal
            else "counterexample=no"
        )
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Tìm một amount khác cho hệ 1,3,4 rồi ghi đường greedy và đường oracle. Sau đó mô tả một điều kiện hay lập luận exchange cụ thể mà bạn sẽ cần trước khi dám tuyên bố greedy tối ưu cho một hệ tiền trong production.',
    srsCards: [
      {
        hoi: 'Một counterexample của coin greedy cho hệ 1, 3, 4 là gì?',
        dap: 'Với amount 6, greedy lấy 4+1+1 gồm ba đồng, trong khi 3+3 chỉ cần hai đồng; vì vậy greedy không tối ưu cho mọi hệ mệnh giá.',
      },
      {
        hoi: 'Oracle hữu hạn trong bài coin dùng để kết luận điều gì?',
        dap: 'Nó đối chiếu tối ưu trên miền amount đã giới hạn để phát hiện sai khác; nó không phải bằng chứng tổng quát cho mọi số tiền hoặc mọi hệ mệnh giá.',
      },
    ],
  },
]
