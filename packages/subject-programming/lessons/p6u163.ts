// P6-U163 — algo-s2-m2: cấu trúc cây và priority queue qua mô phỏng Python hữu hạn.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U163_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u163-l1',
    unitId: 'p6-u163',
    language: 'python',
    title: 'MÔ PHỎNG trie prefix và BST có thể thoái hóa',
    hook: 'Autocomplete cần kết quả ổn định dù từ được thêm theo thứ tự khác. Trie lưu prefix chung; BST chèn dãy đã sắp có thể cao như danh sách.',
    theory:
      'Trie đi theo từng ký tự nên truy vấn prefix chỉ xét nhánh dưới prefix đó. Simulator chỉ nhận chữ thường ASCII, sort tăng dần và tối đa ba kết quả: đây là hợp đồng tất định, không phải benchmark autocomplete thật. BST so sánh khóa để rẽ trái/phải, nhưng BST thường không tự cân bằng: chèn 1,2,3,4 tạo một nhánh dài bốn. Đừng suy luận O(log n) cho BST không cân bằng.',
    workedExample: {
      code: `# MÔ PHỎNG: tập từ nhỏ, không dùng trie library hay file.
words = ["ban", "banana", "bang", "cat"]
prefix = "ban"
found = sorted(w for w in words if w.startswith(prefix))
print("prefix:" + ",".join(found[:3]))

# Khóa tăng dần làm BST đồ chơi thành một nhánh phải.
keys = [1, 2, 3, 4]
print("bst:degenerate-height=" + str(len(keys)))`,
      stdinLines: [],
    },
    predict: {
      code: `words = ["ant", "apple", "ape", "bat"]
prefix = "ap"
print("prefix:" + ",".join(sorted(w for w in words if w.startswith(prefix))[:3]))`,
      question: 'Trie mô phỏng trả các từ có prefix `ap` theo thứ tự nào?',
      choices: ['prefix:ape,apple', 'prefix:apple,ape', 'prefix:ant,ape,apple', 'prefix:bat'],
      answerIndex: 0,
      explain: 'Chỉ ape và apple bắt đầu bằng ap; sort chữ cái khiến ape đứng trước apple.',
    },
    parsons: {
      prompt: 'Xếp hàm truy vấn prefix tất định, chỉ lấy tối đa limit kết quả.',
      lines: [
        'def prefix_search(words, prefix, limit):',
        '    if not prefix.isalpha() or not prefix.islower():',
        '        return "tu-choi"',
        '    found = [word for word in words if word.startswith(prefix)]',
        '    return "prefix:" + ",".join(sorted(found)[:limit])',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG trie prefix trên kho cố định ant,ape,apple,bat,banana,band,bandit,cat. Đọc một prefix chữ thường ASCII. In prefix: cộng tối đa BA từ bắt đầu bằng prefix, sort tăng dần và ngăn bằng dấu phẩy; nếu không có từ thì in prefix:empty. Prefix rỗng, có số, dấu cách hoặc ký tự khác in tu-choi. Không dùng file, network hay thư viện trie; đây là mô hình hữu hạn để kiểm hợp đồng ordering, không đo hiệu năng trie/BST thật.',
      starterCode: `prefix = input().strip()
words = ["ant", "ape", "apple", "bat", "banana", "band", "bandit", "cat"]

# MÔ PHỎNG trie: hãy lọc, sort và giới hạn ba kết quả.
`,
      testCases: [
        {
          stdinLines: ['ban'],
          expected: 'prefix:banana,band,bandit',
          match: 'contains',
          hidden: false,
          label: 'prefix có hơn ba kết quả vẫn ổn định',
        },
        {
          stdinLines: ['ap'],
          expected: 'prefix:ape,apple',
          match: 'contains',
          hidden: true,
          label: 'prefix chung trả hai nhánh lá',
        },
        {
          stdinLines: ['zoo'],
          expected: 'prefix:empty',
          match: 'contains',
          hidden: true,
          label: 'prefix không tồn tại không bịa kết quả',
        },
        {
          stdinLines: ['ban2'],
          expected: 'tu-choi',
          match: 'contains',
          hidden: true,
          label: 'token ngoài miền mô phỏng bị từ chối',
        },
      ],
      hints: [
        'Dùng prefix.isalpha() và prefix.islower(), đồng thời chặn chuỗi rỗng.',
        'Lọc bằng word.startswith(prefix), rồi sorted trước khi cắt [:3].',
        'Nếu danh sách rỗng, in đúng prefix:empty.',
      ],
      sampleSolution: `prefix = input().strip()
words = ["ant", "ape", "apple", "bat", "banana", "band", "bandit", "cat"]

if not prefix or not prefix.isalpha() or not prefix.islower():
    print("tu-choi")
else:
    found = sorted(word for word in words if word.startswith(prefix))[:3]
    print("prefix:" + ",".join(found) if found else "prefix:empty")`,
    },
    homework:
      'Tự cài trie node cho tối đa 20 từ, kiểm thử hai thứ tự thêm từ khác nhau cho cùng kết quả prefix đã sort. Đồng thời tạo BST chèn khóa tăng dần, ghi chiều cao và giải thích vì sao nó thoái hóa; nếu không tự chạy được, ghi BLOCKED cùng giả định.',
    srsCards: [
      {
        hoi: 'Vì sao autocomplete phải sort trước khi giới hạn?',
        dap: 'Thứ tự thêm hay duyệt có thể khác nhau; sort tạo tie-break tất định để cùng input luôn có cùng output.',
      },
      {
        hoi: 'Khi nào BST thường có thể mất lợi thế O(log n)?',
        dap: 'Khi khóa được chèn theo thứ tự làm cây lệch thành một nhánh; BST không cân bằng khi đó có chiều cao gần n.',
      },
      {
        hoi: 'Simulator prefix này không chứng minh điều gì?',
        dap: 'Nó không đo memory, latency hay độ phức tạp của trie production; nó chỉ kiểm token, ordering và giới hạn kết quả trên kho hữu hạn.',
      },
    ],
  },
  {
    id: 'p6-u163-l2',
    unitId: 'p6-u163',
    language: 'python',
    title: 'MÔ PHỎNG priority queue top-k có tie-break',
    hook: 'Một hàng chờ ưu tiên phải quyết định được ai đứng trước khi điểm bằng nhau. Không có tie-break, cùng dữ liệu có thể ra kết quả khác giữa các lần chạy.',
    theory:
      'Heap thường duy trì phần tử tốt nhất mà không cần sort toàn bộ sau mỗi lần thêm. Bài này mô phỏng top-k trên tối đa tám name:score: ưu tiên score giảm dần, hòa điểm thì name tăng dần. k=0, k âm, k lớn hơn số phần tử, tên sai hoặc score không nguyên đều bị từ chối. Hàm dùng sort để lộ rõ hợp đồng; nó không tuyên bố độ phức tạp heapq hay throughput production.',
    workedExample: {
      code: `# MÔ PHỎNG priority queue bằng danh sách hữu hạn có tie-break.
items = [("linh", 9), ("an", 9), ("binh", 7)]
k = 2
top = sorted(items, key=lambda item: (-item[1], item[0]))[:k]
print("top:" + ",".join(name for name, _ in top))`,
      stdinLines: [],
    },
    predict: {
      code: `items = [("zoe", 5), ("an", 5), ("binh", 6)]
top = sorted(items, key=lambda item: (-item[1], item[0]))[:2]
print("top:" + ",".join(name for name, _ in top))`,
      question: 'Hai score 5 hòa nhau; top-2 MÔ PHỎNG in gì?',
      choices: ['top:binh,an', 'top:an,binh', 'top:binh,zoe', 'top:zoe,an'],
      answerIndex: 0,
      explain:
        'Score 6 của binh cao nhất; score 5 hòa thì an đứng trước zoe theo tie-break tăng dần.',
    },
    parsons: {
      prompt: 'Xếp phần lõi top-k với score giảm dần và name tăng dần khi hòa.',
      lines: [
        'def top_k(items, k):',
        '    if k <= 0 or k > len(items):',
        '        return "tu-choi"',
        '    ordered = sorted(items, key=lambda item: (-item[1], item[0]))',
        '    return "top:" + ",".join(name for name, _ in ordered[:k])',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG priority queue top-k. Đọc một dòng dạng k|name:score,name:score,..., tối đa 8 item. name chỉ gồm chữ thường ASCII, không trùng; score là số nguyên 0..100; k phải từ 1 đến số item. In top: rồi các name của k item tốt nhất, score giảm dần và hòa score theo name tăng dần. Định dạng/token/k sai in tu-choi. Không import heapq, không file/network: bài chấm hợp đồng top-k hữu hạn, không benchmark heap thật.',
      starterCode: `raw = input().strip()

# Tách k và các item; sau đó kiểm dữ liệu trước khi xếp hạng.
`,
      testCases: [
        {
          stdinLines: ['2|linh:9,an:9,binh:7'],
          expected: 'top:an,linh',
          match: 'contains',
          hidden: false,
          label: 'tie-break name tăng dần khi điểm bằng nhau',
        },
        {
          stdinLines: ['3|zoe:5,an:5,binh:6,chi:5'],
          expected: 'top:binh,an,chi',
          match: 'contains',
          hidden: true,
          label: 'top-k cắt sau toàn bộ tie-break',
        },
        {
          stdinLines: ['0|an:1'],
          expected: 'tu-choi',
          match: 'contains',
          hidden: true,
          label: 'k bằng không không có nghĩa ngầm',
        },
        {
          stdinLines: ['2|an:10,an:9'],
          expected: 'tu-choi',
          match: 'contains',
          hidden: true,
          label: 'tên trùng làm thứ tự ưu tiên mơ hồ',
        },
      ],
      hints: [
        'Dùng raw.split("|", 1) và từ chối nếu không có hai phần có nội dung.',
        'Tách item đúng một lần bằng split(":", 1); kiểm name, score và tên trùng trước khi sort.',
        'Khóa sort là (-score, name), sau đó mới lấy ordered[:k].',
      ],
      sampleSolution: `raw = input().strip()

try:
    k_text, items_text = raw.split("|", 1)
    k = int(k_text)
    pieces = items_text.split(",")
    if not raw or not pieces or len(pieces) > 8:
        raise ValueError
    items = []
    names = set()
    for piece in pieces:
        name, score_text = piece.split(":", 1)
        if not name or not name.isalpha() or not name.islower() or name in names:
            raise ValueError
        score = int(score_text)
        if not 0 <= score <= 100:
            raise ValueError
        names.add(name)
        items.append((name, score))
    if not 1 <= k <= len(items):
        raise ValueError
    ordered = sorted(items, key=lambda item: (-item[1], item[0]))
    print("top:" + ",".join(name for name, _ in ordered[:k]))
except (ValueError, TypeError):
    print("tu-choi")`,
    },
    homework:
      'Viết hai implementation cho tối đa 100 phần tử: sort toàn bộ và heap bounded k; dùng cùng tie-break rồi so kết quả qua nhiều fixture hữu hạn. Báo riêng thời gian/memory chỉ là đo cục bộ, không suy rộng thành benchmark production; nếu không chạy, nêu BLOCKED và dữ liệu test dự định.',
    srsCards: [
      {
        hoi: 'Tie-break nào dùng khi hai item top-k có cùng score?',
        dap: 'Tên tăng dần theo alphabet; khóa đầy đủ là (-score, name) nên thứ tự luôn tái lập được.',
      },
      {
        hoi: 'Vì sao k=0 phải bị từ chối trong hợp đồng bài?',
        dap: 'Để không tạo nghĩa ngầm có thể che lỗi caller; miền hợp lệ được nêu rõ là từ một đến số item.',
      },
      {
        hoi: 'Bài sort danh sách này khác heap production ở đâu?',
        dap: 'Nó diễn giải đúng luật chọn top-k trên input nhỏ nhưng không chứng minh độ phức tạp, memory footprint hay throughput của hàng chờ ưu tiên thật.',
      },
    ],
  },
]
