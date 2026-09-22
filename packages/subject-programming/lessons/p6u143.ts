// P6-U143 — algo-s1-m2: cấu trúc dữ liệu tuyến tính và bảng băm.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U143_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u143-l1',
    unitId: 'p6-u143',
    language: 'python',
    title: 'Stack, queue, deque — đúng thứ tự trước khi nói nhanh',
    hook: 'Dùng nhầm LIFO cho hàng chờ support khiến khách mới chen lên trước; dùng `pop(0)` lại buộc cả mảng dịch trái. Cấu trúc dữ liệu là một phần của hợp đồng hành vi.',
    theory:
      'Stack là LIFO: thêm và lấy ở cuối, hợp với kiểm ngoặc. Queue là FIFO: thêm bên phải, lấy bên trái; trong Python dùng `collections.deque`, không dùng `list.pop(0)` vì xóa đầu mảng động phải dịch O(n) phần tử. Deque hỗ trợ hai đầu O(1) khấu hao. Danh sách liên kết chèn/xóa O(1) khi đã có nút nhưng tốn con trỏ và truy cập chỉ số O(n); mảng động truy cập chỉ số O(1), append khấu hao O(1), nhưng chèn/xóa đầu O(n).',
    workedExample: {
      code: `def ngoac_hop_le(text):
    cap = {')': '(', ']': '[', '}': '{'}
    stack = []
    for ky_tu in text:
        if ky_tu in "([{":
            stack.append(ky_tu)
        elif ky_tu in cap:
            if not stack or stack.pop() != cap[ky_tu]:
                return False
    return not stack

print(ngoac_hop_le("([]){}"))
print(ngoac_hop_le("([)]"))`,
      stdinLines: [],
    },
    predict: {
      code: `from collections import deque
q = deque(["A", "B"])
q.append("C")
print(q.popleft())
print(q.pop())`,
      question: 'Hai dòng được in theo thứ tự nào?',
      choices: ['A\nC', 'C\nA', 'A\nB', 'B\nC'],
      answerIndex: 0,
      explain: 'popleft lấy đầu FIFO là A; pop lấy đầu bên phải còn lại là C.',
    },
    parsons: {
      prompt: 'Xếp lõi kiểm ngoặc đóng bằng stack.',
      lines: [
        'if ky_tu in "([{":',
        '    stack.append(ky_tu)',
        'elif ky_tu in cap:',
        '    if not stack or stack.pop() != cap[ky_tu]:',
        '        return False',
        'return not stack',
      ],
    },
    make: {
      prompt:
        'Đọc một dòng chỉ gồm các dấu ngoặc `()[]{}` (có thể rỗng). In `hop-le` nếu mọi ngoặc đóng đúng loại và đúng thứ tự, ngược lại in `sai`.',
      starterCode: `text = input().strip()

# Dung stack LIFO de ghep ngoac gan nhat.
`,
      testCases: [
        {
          stdinLines: ['([]){}'],
          expected: 'hop-le',
          match: 'contains',
          hidden: false,
          label: 'lồng và nối đúng',
        },
        {
          stdinLines: ['([)]'],
          expected: 'sai',
          match: 'contains',
          hidden: true,
          label: 'đúng số lượng nhưng sai thứ tự',
        },
        {
          stdinLines: [''],
          expected: 'hop-le',
          match: 'contains',
          hidden: true,
          label: 'chuỗi rỗng cân bằng',
        },
      ],
      hints: [
        'Lưu ngoặc mở vào list như stack.',
        'Khi gặp ngoặc đóng, stack phải không rỗng và đỉnh phải cùng loại.',
        'Cuối cùng stack cũng phải rỗng.',
      ],
      sampleSolution: `text = input().strip()
cap = {')': '(', ']': '[', '}': '{'}
stack = []
hop_le = True
for ky_tu in text:
    if ky_tu in "([{":
        stack.append(ky_tu)
    elif not stack or stack.pop() != cap[ky_tu]:
        hop_le = False
        break
print("hop-le" if hop_le and not stack else "sai")`,
    },
    homework:
      'Viết mô phỏng hàng chờ ticket bằng deque với ENQUEUE/DEQUEUE; tạo test chứng minh A, B, C được phục vụ đúng FIFO và giải thích vì sao `list.pop(0)` không phù hợp.',
    srsCards: [
      {
        hoi: 'Stack và queue khác nhau ở thứ tự lấy phần tử nào?',
        dap: 'Stack là vào sau ra trước (LIFO); queue là vào trước ra trước (FIFO).',
      },
      {
        hoi: 'Vì sao queue Python nên dùng deque thay cho list.pop(0)?',
        dap: 'deque lấy hai đầu O(1) khấu hao; xóa đầu list phải dịch các phần tử còn lại nên O(n).',
      },
    ],
  },
  {
    id: 'p6-u143-l2',
    unitId: 'p6-u143',
    language: 'python',
    title: 'Hash chaining — va chạm không được làm mất khóa',
    hook: 'Hai khóa có cùng bucket không có nghĩa một khóa được phép biến mất. Bảng băm production cần chiến lược va chạm, không chỉ một công thức modulo.',
    theory:
      'Bảng băm ánh xạ khóa tới bucket. Với số nguyên và m bucket, mô hình dễ kiểm là `key % m`. Chaining lưu một danh sách cặp trong mỗi bucket; insert cập nhật đúng khóa hoặc nối cặp mới. Lookup duyệt chain và đếm từng phép so sánh khóa. Trung bình có thể gần O(1) khi hash phân bố tốt và hệ số tải được kiểm soát, nhưng xấu nhất O(n) nếu mọi khóa va chạm. Không dùng tốc độ `dict` của một lần chạy để chứng minh; hãy chủ động cho 1, 5, 9 vào cùng bucket khi m=4.',
    workedExample: {
      code: `buckets = [[] for _ in range(4)]
for key in [1, 5, 9]:
    buckets[key % 4].append(key)

comparisons = 0
for key in buckets[1]:
    comparisons += 1
    if key == 9:
        break
print(buckets[1], comparisons)`,
      stdinLines: [],
    },
    predict: {
      code: `bucket = [1, 5, 9]
dem = 0
for key in bucket:
    dem += 1
    if key == 5:
        break
print(dem)`,
      question: 'Tra khóa 5 trong chain trên cần bao nhiêu phép so sánh?',
      choices: ['2', '1', '3', '5'],
      answerIndex: 0,
      explain: 'So với 1 rồi 5, nên dừng sau hai phép so sánh.',
    },
    parsons: {
      prompt: 'Xếp lookup chaining trả về found và số phép so sánh.',
      lines: [
        'def tim(buckets, key):',
        '    dem = 0',
        '    for current in buckets[key % len(buckets)]:',
        '        dem += 1',
        '        if current == key:',
        '            return True, dem',
        '    return False, dem',
      ],
    },
    make: {
      prompt:
        'Đọc m dương, một dòng khóa nguyên cách nhau bởi khoảng trắng (có thể rỗng), rồi khóa cần tìm. Chèn mọi khóa vào chaining theo `key % m`, khóa trùng chỉ lưu một lần. In `co comparisons` hoặc `khong comparisons` với số so sánh trong đúng bucket.',
      starterCode: `m = int(input())
keys_line = input().strip()
target = int(input())

# Moi bucket la mot chain; dung ghi de khi va cham.
`,
      testCases: [
        {
          stdinLines: ['4', '1 5 9', '9'],
          expected: 'co 3',
          match: 'contains',
          hidden: false,
          label: 'ba khóa cố tình va chạm',
        },
        {
          stdinLines: ['4', '1 5 9', '13'],
          expected: 'khong 3',
          match: 'contains',
          hidden: true,
          label: 'khóa vắng vẫn duyệt hết chain',
        },
        {
          stdinLines: ['3', '2 2 2', '2'],
          expected: 'co 1',
          match: 'contains',
          hidden: true,
          label: 'insert trùng không nhân bản khóa',
        },
      ],
      hints: [
        'Tạo `m` list con độc lập.',
        'Trước khi append, kiểm khóa chưa nằm trong chain.',
        'Chỉ tăng comparisons khi thật sự so một khóa trong bucket.',
      ],
      sampleSolution: `m = int(input())
keys_line = input().strip()
target = int(input())

if m <= 0:
    print("m-khong-hop-le")
else:
    buckets = [[] for _ in range(m)]
    for key in map(int, keys_line.split()) if keys_line else []:
        chain = buckets[key % m]
        if key not in chain:
            chain.append(key)
    comparisons = 0
    found = False
    for key in buckets[target % m]:
        comparisons += 1
        if key == target:
            found = True
            break
    print("co" if found else "khong", comparisons)`,
    },
    homework:
      'Chèn 1, 5, 9, 13 vào 4 bucket, đo lookup từng khóa; sau đó tăng lên 8 bucket và giải thích chain ngắn đi thế nào. Giữ ca va chạm như đối chứng âm (negative control) cho cài đặt chỉ lưu một khóa mỗi bucket.',
    srsCards: [
      {
        hoi: 'Chaining xử lý hai khóa có cùng hash ra sao?',
        dap: 'Nó giữ cả hai trong danh sách của bucket và khi lookup so từng khóa, thay vì ghi đè khóa cũ.',
      },
      {
        hoi: 'Độ phức tạp xấu nhất của lookup chaining là gì?',
        dap: 'O(n) nếu mọi khóa rơi vào cùng bucket; O(1) chỉ là kỳ vọng khi hash phân bố tốt và tải được kiểm soát.',
      },
    ],
  },
]
