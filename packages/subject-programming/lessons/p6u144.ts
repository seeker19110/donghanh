// P6-U144 — algo-s1-m3: hai con trỏ, cửa sổ, prefix và tìm kiếm nhị phân.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U144_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u144-l1',
    unitId: 'p6-u144',
    language: 'python',
    title: 'Cửa sổ trượt — bỏ một, thêm một thay vì cộng lại',
    hook: 'Tính tổng mọi đoạn dài k bằng cách cộng lại từ đầu tốn k phép cộng mỗi đoạn. Hai biên của cửa sổ cho phép cập nhật bằng đúng một phần tử ra và một phần tử vào.',
    theory:
      'Vét cạn mọi đoạn liên tiếp dài k tốn O(nk). Cửa sổ trượt tính tổng đoạn đầu, rồi cập nhật `tong += a[right] - a[right-k]`, nên O(n) thời gian và O(1) bộ nhớ phụ. Kỹ thuật chỉ đúng vì các đoạn liên tiếp kế nhau chia sẻ k−1 phần tử. Với hai con trỏ trên mảng đã sắp xếp, ta cũng loại một phía sau mỗi bước; không được tự ý sort nếu hợp đồng cần giữ vị trí hay thứ tự ban đầu. Luôn viết oracle vét cạn trên n nhỏ để bắt lỗi bỏ sót cửa sổ cuối.',
    workedExample: {
      code: `def nhanh(a, k):
    if k <= 0 or k > len(a):
        return None
    tong = sum(a[:k])
    lon_nhat = tong
    for right in range(k, len(a)):
        tong += a[right] - a[right - k]
        lon_nhat = max(lon_nhat, tong)
    return lon_nhat

print(nhanh([2, -1, 3, 5, -2], 3))`,
      stdinLines: [],
    },
    predict: {
      code: `a = [4, -2, 1, 7]
k = 2
tong = sum(a[:k])
for right in range(k, len(a)):
    tong += a[right] - a[right - k]
print(tong)`,
      question: 'Biến `tong` của cửa sổ cuối được in ra bao nhiêu?',
      choices: ['8', '6', '5', '10'],
      answerIndex: 0,
      explain: 'Các cửa sổ có tổng 2, -1 và 8; biến cuối cùng là tổng đoạn [1, 7].',
    },
    parsons: {
      prompt: 'Xếp phần cập nhật cửa sổ và giữ tổng lớn nhất.',
      lines: [
        'tong = sum(a[:k])',
        'lon_nhat = tong',
        'for right in range(k, len(a)):',
        '    tong += a[right] - a[right - k]',
        '    lon_nhat = max(lon_nhat, tong)',
        'return lon_nhat',
      ],
    },
    make: {
      prompt:
        'Đọc một dòng số nguyên (có thể rỗng) và k. Tính tổng đoạn liên tiếp dài k lớn nhất bằng cả vét cạn và cửa sổ trượt, in `brute fast`. Nếu k <= 0 hoặc k > n, in `k-khong-hop-le`.',
      starterCode: `line = input().strip()
a = list(map(int, line.split())) if line else []
k = int(input())

# Viet oracle don gian truoc, roi cua so O(n).
`,
      testCases: [
        {
          stdinLines: ['2 -1 3 5 -2', '3'],
          expected: '7 7',
          match: 'contains',
          hidden: false,
          label: 'oracle và cửa sổ cùng chọn đoạn giữa',
        },
        {
          stdinLines: ['-8 -3 -5', '1'],
          expected: '-3 -3',
          match: 'contains',
          hidden: true,
          label: 'toàn số âm không được mặc định 0',
        },
        {
          stdinLines: ['', '1'],
          expected: 'k-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'mảng rỗng',
        },
      ],
      hints: [
        'Oracle dùng `sum(a[i:i+k])` cho mọi i hợp lệ.',
        'Khởi tạo đáp án nhanh từ cửa sổ đầu, kể cả khi âm.',
        'Mỗi bước trừ phần tử rời cửa sổ và cộng phần tử mới.',
      ],
      sampleSolution: `line = input().strip()
a = list(map(int, line.split())) if line else []
k = int(input())

if k <= 0 or k > len(a):
    print("k-khong-hop-le")
else:
    brute = max(sum(a[i:i + k]) for i in range(len(a) - k + 1))
    tong = sum(a[:k])
    fast = tong
    for right in range(k, len(a)):
        tong += a[right] - a[right - k]
        fast = max(fast, tong)
    print(brute, fast)`,
    },
    homework:
      'Viết thêm bài hai con trỏ tìm cặp tổng bằng target trên mảng đã sắp xếp; dùng oracle mọi cặp và một ca chứng minh sort làm mất chỉ số gốc nếu hợp đồng yêu cầu vị trí.',
    srsCards: [
      {
        hoi: 'Cửa sổ trượt giảm O(nk) xuống O(n) bằng bất biến nào?',
        dap: 'Hai cửa sổ kế nhau chia sẻ k−1 phần tử, nên chỉ cần trừ phần tử rời đi và cộng phần tử mới vào.',
      },
      {
        hoi: 'Khi nào không được sort trước khi dùng hai con trỏ?',
        dap: 'Khi hợp đồng cần giữ thứ tự, vị trí gốc hoặc chỉ xét đoạn liên tiếp; sort sẽ đổi bài toán.',
      },
    ],
  },
  {
    id: 'p6-u144-l2',
    unitId: 'p6-u144',
    language: 'python',
    title: 'Prefix và binary search — chốt quy ước biên',
    hook: 'Phần lớn lỗi tìm kiếm nhị phân không nằm ở ý tưởng chia đôi, mà ở một dấu `<` hay `+1`. Viết rõ khoảng nửa mở và điều kiện đơn điệu trước khi lặp.',
    theory:
      'Prefix dùng `p[0]=0`, `p[i+1]=p[i]+a[i]`; tổng đoạn nửa mở [l,r) là `p[r]-p[l]`, kể cả đoạn rỗng. Binary search trên mảng đã sort có thể tìm vị trí đầu tiên `a[i] >= x` bằng khoảng [lo,hi), cập nhật `hi=mid` khi đúng và `lo=mid+1` khi sai. Đổi điều kiện sẽ tìm vị trí cuối `a[i] <= x`. Binary search trên đáp án cần hàm `feasible(x)` đơn điệu; ví dụ capacity lớn hơn không thể làm việc vận chuyển khó hơn. Negative control `lo=mid` trong bài tìm nhỏ nhất có thể kẹt khi hi=lo+1.',
    workedExample: {
      code: `a = [3, -1, 4, 2]
prefix = [0]
for x in a:
    prefix.append(prefix[-1] + x)
for left, right in [(0, 4), (1, 3), (2, 2)]:
    print(left, right, prefix[right] - prefix[left])`,
      stdinLines: [],
    },
    predict: {
      code: `a = [1, 3, 3, 8]
lo, hi = 0, len(a)
while lo < hi:
    mid = (lo + hi) // 2
    if a[mid] >= 3:
        hi = mid
    else:
        lo = mid + 1
print(lo)`,
      question: 'Vị trí đầu tiên có giá trị >= 3 là gì?',
      choices: ['1', '2', '3', '0'],
      answerIndex: 0,
      explain: 'Khoảng nửa mở co về index 1, là số 3 đầu tiên.',
    },
    parsons: {
      prompt: 'Xếp binary search tìm vị trí cuối cùng có giá trị <= target.',
      lines: [
        'lo, hi = 0, len(a)',
        'while lo < hi:',
        '    mid = (lo + hi) // 2',
        '    if a[mid] <= target:',
        '        lo = mid + 1',
        '    else:',
        '        hi = mid',
        'return lo - 1',
      ],
    },
    make: {
      prompt:
        'Đọc trọng lượng dương cách nhau bởi khoảng trắng và số ngày dương. Tìm capacity nhỏ nhất để chuyển theo đúng thứ tự, mỗi ngày lấy một đoạn liên tiếp không vượt capacity. In capacity; dữ liệu rỗng hoặc không hợp lệ in `dau-vao-khong-hop-le`.',
      starterCode: `weights = list(map(int, input().split()))
days = int(input())

# feasible(capacity) phai don dieu; binary search dap an nho nhat.
`,
      testCases: [
        {
          stdinLines: ['1 2 3 4 5', '3'],
          expected: '6',
          match: 'contains',
          hidden: false,
          label: 'capacity nhỏ nhất cho ba ngày',
        },
        {
          stdinLines: ['10', '1'],
          expected: '10',
          match: 'contains',
          hidden: true,
          label: 'một phần tử và một ngày',
        },
        {
          stdinLines: ['3 3 3', '5'],
          expected: '3',
          match: 'contains',
          hidden: true,
          label: 'nhiều ngày hơn kiện hàng',
        },
      ],
      hints: [
        'Cận dưới là max(weights), cận trên là sum(weights).',
        'feasible đếm số ngày bằng cách mở ngày mới khi thêm kiện sẽ vượt capacity.',
        'Nếu feasible(mid), giữ mid bằng `hi = mid`; nếu không, bỏ mid bằng `lo = mid + 1`.',
      ],
      sampleSolution: `weights = list(map(int, input().split()))
days = int(input())

if not weights or days <= 0 or any(x <= 0 for x in weights):
    print("dau-vao-khong-hop-le")
else:
    def feasible(capacity):
        used, current = 1, 0
        for weight in weights:
            if current + weight > capacity:
                used += 1
                current = 0
            current += weight
        return used <= days

    lo, hi = max(weights), sum(weights)
    while lo < hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1
    print(lo)`,
    },
    homework:
      'Cài cả `lower_bound` đầu tiên >= x và vị trí cuối <= x; đối chiếu mọi mảng sort dài tối đa 8 với vét cạn, gồm x nhỏ hơn min, lớn hơn max và nhiều phần tử trùng.',
    srsCards: [
      {
        hoi: 'Với prefix có p[0]=0, tổng đoạn [l,r) được tính thế nào?',
        dap: 'Dùng `p[r] - p[l]`; quy ước nửa mở làm độ dài là r−l và đoạn rỗng có tổng 0.',
      },
      {
        hoi: 'Binary search trên đáp án cần điều kiện cốt lõi nào?',
        dap: 'Hàm feasible phải đơn điệu để sau một ranh giới, mọi đáp án theo một phía đều cùng đúng hoặc cùng sai.',
      },
    ],
  },
]
