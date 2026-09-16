// P6-U159 — mathforcode-s3-m3,m4: khử Gauss và power iteration hữu hạn.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U159_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u159-l1',
    unitId: 'p6-u159',
    language: 'python',
    title: 'Khử Gauss partial pivot — phân biệt ba loại hệ',
    hook: 'Một pivot bằng 0 không nói hệ “không có nghiệm”: đổi hàng có thể cứu được nó. Chỉ hàng `0=khác-0` mới là mâu thuẫn.',
    theory:
      'Khử Gauss biến ma trận mở rộng thành dạng bậc thang để suy ra nghiệm. Partial pivot chọn hàng có trị tuyệt đối lớn nhất ở cột đang xét trước khi khử; nó tránh chia cho 0 và giảm rủi ro số học. Hàng toàn hệ số 0 nhưng vế phải khác 0 là vô nghiệm; rank hệ số nhỏ hơn số ẩn nhưng không mâu thuẫn là vô số nghiệm; ngược lại có nghiệm duy nhất. Bài dùng số nguyên/hữu tỉ nhỏ MÔ PHỎNG, không phải thư viện đại số tuyến tính hay lời hứa ổn định số cho production.',
    workedExample: {
      code: `# x + y = 3; 2x - y = 0\nA = [[1.0, 1.0, 3.0], [2.0, -1.0, 0.0]]\n# Pivot cột 0 là hàng [2,-1,0], rồi khử hàng còn lại.\nA[0], A[1] = A[1], A[0]\nf = A[1][0] / A[0][0]\nA[1] = [A[1][j] - f * A[0][j] for j in range(3)]\nprint(A)`,
      stdinLines: [],
    },
    predict: {
      code: `row = [0, 0, 4]\nif row[0] == 0 and row[1] == 0 and row[2] != 0:\n    print("vo-nghiem")`,
      question: 'Hàng `0x + 0y = 4` kết luận gì?',
      choices: ['vo-nghiem', 'vo-so-nghiem', 'nghiem-duy-nhat', 'doi-hang'],
      answerIndex: 0,
      explain: 'Nó đòi 0 bằng 4, một mâu thuẫn.',
    },
    parsons: {
      prompt: 'Xếp bước chọn partial pivot cho một cột.',
      lines: [
        'pivot = max(range(col, n), key=lambda r: abs(A[r][col]))',
        'if abs(A[pivot][col]) < eps:',
        '    continue',
        'A[col], A[pivot] = A[pivot], A[col]',
      ],
    },
    make: {
      prompt:
        'Đọc `n` (1 hoặc 2), sau đó n dòng ma trận mở rộng, mỗi dòng n+1 số nguyên cách nhau dấu phẩy. Dùng khử Gauss partial pivot và in `vo-nghiem`, `vo-so-nghiem`, hoặc `nghiem-duy-nhat:x=<...>` (nghiệm theo thứ tự, 3 chữ số, cách bởi dấu phẩy). Input không đúng kích thước/số nguyên in `input-khong-hop-le`. Đây là MÔ PHỎNG số nhỏ; không suy rộng thành solver production.',
      starterCode: `n = int(input())\n\n# MÔ PHỎNG khử Gauss partial pivot trên hệ rất nhỏ.`,
      testCases: [
        {
          stdinLines: ['2', '1,1,3', '2,-1,0'],
          expected: 'nghiem-duy-nhat:x=1.000,2.000',
          match: 'contains',
          hidden: false,
          label: 'hệ 2 ẩn có nghiệm duy nhất',
        },
        {
          stdinLines: ['2', '0,1,2', '1,1,3'],
          expected: 'nghiem-duy-nhat:x=1.000,2.000',
          match: 'contains',
          hidden: true,
          label: 'pivot phải đổi hàng',
        },
        {
          stdinLines: ['2', '1,1,1', '2,2,3'],
          expected: 'vo-nghiem',
          match: 'contains',
          hidden: true,
          label: 'hàng mâu thuẫn',
        },
        {
          stdinLines: ['2', '1,1,1', '2,2,2'],
          expected: 'vo-so-nghiem',
          match: 'contains',
          hidden: true,
          label: 'rank thiếu nhưng nhất quán',
        },
      ],
      hints: [
        'Mỗi pivot tìm hàng có `abs` lớn nhất bên dưới.',
        'Đếm pivot để có rank hệ số.',
        'Sau khử, hàng hệ số 0 với RHS khác 0 là mâu thuẫn.',
      ],
      sampleSolution: `try:\n    n = int(input())\n    if n not in {1, 2}: raise ValueError\n    A = []\n    for _ in range(n):\n        row = [float(x.strip()) for x in input().split(",")]\n        if len(row) != n + 1: raise ValueError\n        A.append(row)\nexcept (ValueError, EOFError):\n    print("input-khong-hop-le")\n    raise SystemExit\neps = 1e-9\npivots = []\nfor col in range(n):\n    pivot = max(range(len(pivots), n), key=lambda r: abs(A[r][col]))\n    row = len(pivots)\n    if abs(A[pivot][col]) < eps:\n        continue\n    A[row], A[pivot] = A[pivot], A[row]\n    for r in range(row + 1, n):\n        factor = A[r][col] / A[row][col]\n        A[r] = [A[r][j] - factor * A[row][j] for j in range(n + 1)]\n    pivots.append(col)\nif any(all(abs(x) < eps for x in row[:n]) and abs(row[n]) >= eps for row in A):\n    print("vo-nghiem")\nelif len(pivots) < n:\n    print("vo-so-nghiem")\nelse:\n    x = [0.0] * n\n    for r in range(n - 1, -1, -1):\n        col = pivots[r]\n        x[col] = (A[r][n] - sum(A[r][j] * x[j] for j in range(col + 1, n))) / A[r][col]\n    print("nghiem-duy-nhat:x=" + ",".join(f"{v:.3f}" for v in x))`,
    },
    homework:
      'Ngoài sandbox, dùng NumPy đối chiếu ít nhất ba hệ (pivot, vô nghiệm, suy biến), ghi matrix, rank và output. Không coi simulator là bằng chứng ổn định số.',
    srsCards: [
      {
        hoi: 'Partial pivot làm gì?',
        dap: 'Chọn hàng có phần tử tuyệt đối lớn nhất ở cột pivot rồi đổi hàng trước khi khử.',
      },
      {
        hoi: 'Hàng 0=4 nghĩa là gì?',
        dap: 'Hệ vô nghiệm vì một hàng có toàn hệ số bằng 0 nhưng vế phải khác 0, tạo mâu thuẫn.',
      },
      { hoi: 'Khi nào vô số nghiệm?', dap: 'Hệ nhất quán nhưng rank hệ số nhỏ hơn số ẩn.' },
    ],
  },
  {
    id: 'p6-u159-l2',
    unitId: 'p6-u159',
    language: 'python',
    title: 'Power iteration — PageRank đồ chơi và delta hội tụ',
    hook: 'Một vector “điểm” âm hoặc tổng khác 1 không phải phân bố xác suất. Cứ lặp tiếp chỉ che giấu trạng thái hỏng.',
    theory:
      'Power iteration lặp `p_mới = M p_cũ` để tìm trạng thái ổn định của toán tử. PageRank đồ chơi phân phối xác suất qua cạnh ra; dangling node cần một luật rõ ràng, ở đây chia đều. Delta L1 `Σ|mới-cũ|` đo mức đổi của hai vòng liên tiếp, không phải chứng minh hội tụ tổng quát. Bài MÔ PHỎNG đồ thị hữu hạn, deterministic, không crawl web, không dùng graph library và không đại diện PageRank production.',
    workedExample: {
      code: `# Hai node A->B, B->A: phân bố giữ nguyên.\np = [0.5, 0.5]\nnew = [p[1], p[0]]\ndelta = sum(abs(a - b) for a, b in zip(new, p))\nprint(new, delta)`,
      stdinLines: [],
    },
    predict: {
      code: `p = [1.0, 0.0]\nnew = [p[1], p[0]]\nprint(new)`,
      question: 'Sau một bước trên đồ thị A↔B, phân bố [1,0] thành gì?',
      choices: ['[0.0, 1.0]', '[1.0, 0.0]', '[0.5, 0.5]', '[0.0, 0.0]'],
      answerIndex: 0,
      explain: 'Toàn bộ mass ở A đi sang B.',
    },
    parsons: {
      prompt: 'Xếp kiểm tra một phân bố xác suất MÔ PHỎNG.',
      lines: [
        'if any(x < 0 for x in p):',
        '    return False',
        'if abs(sum(p) - 1.0) > 1e-9:',
        '    return False',
        'return True',
      ],
    },
    make: {
      prompt:
        'Đọc `n` (1..4), danh sách cạnh `from>to` cách nhau dấu phẩy (dòng rỗng là không cạnh), phân bố khởi tạo, số vòng không âm và tolerance dương. Node đánh số 0..n-1. Mỗi vòng chia mass node có cạnh đều cho các cạnh ra; dangling node chia đều cho mọi node. In `step=<k>;delta=<6-chữ-số>;p=<6-chữ-số-cách-bởi-dấu-phẩy>` sau từng vòng, và `converged=<yes|no>`. Phân bố âm/tổng khác 1, cạnh sai, n/số vòng/tolerance sai in `input-khong-hop-le`. Đây là PageRank MÔ PHỎNG hữu hạn, không phải xếp hạng web thật.',
      starterCode: `n = int(input())\ndong_canh = input().strip()\ndong_p = input().strip()\nso_vong = int(input())\ntolerance = float(input())\n\n# MÔ PHỎNG power iteration; không crawl network.`,
      testCases: [
        {
          stdinLines: ['2', '0>1,1>0', '0.5,0.5', '2', '0.000001'],
          expected: 'step=1;delta=0.000000;p=0.500000,0.500000\nconverged=yes',
          match: 'contains',
          hidden: false,
          label: 'phân bố ổn định',
        },
        {
          stdinLines: ['2', '0>1,1>0', '1,0', '1', '0.000001'],
          expected: 'step=1;delta=2.000000;p=0.000000,1.000000\nconverged=no',
          match: 'contains',
          hidden: true,
          label: 'delta lớn chưa hội tụ',
        },
        {
          stdinLines: ['2', '', '1,0', '1', '0.1'],
          expected: 'step=1;delta=1.000000;p=0.500000,0.500000',
          match: 'contains',
          hidden: true,
          label: 'dangling node chia đều',
        },
        {
          stdinLines: ['2', '0>2', '0.5,0.5', '1', '0.1'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'cạnh ngoài miền bị từ chối',
        },
      ],
      hints: [
        'Giữ adjacency list cho mọi node.',
        'Mỗi node dangling đóng góp `p[i]/n` cho từng node.',
        'Dừng sớm khi delta <= tolerance; không gọi đó là chứng minh hội tụ.',
      ],
      sampleSolution: `try:\n    n = int(input())\n    raw_edges = input().strip()\n    p = [float(x.strip()) for x in input().split(",")]\n    steps = int(input())\n    tolerance = float(input())\n    if not 1 <= n <= 4 or len(p) != n or steps < 0 or tolerance <= 0:\n        raise ValueError\n    if any(x < 0 for x in p) or abs(sum(p) - 1.0) > 1e-9:\n        raise ValueError\n    adj = [[] for _ in range(n)]\n    if raw_edges:\n        for edge in raw_edges.split(","):\n            a, b = edge.split(">")\n            a, b = int(a), int(b)\n            if not (0 <= a < n and 0 <= b < n): raise ValueError\n            adj[a].append(b)\nexcept (ValueError, EOFError):\n    print("input-khong-hop-le")\n    raise SystemExit\nconverged = False\nfor step in range(1, steps + 1):\n    new = [0.0] * n\n    for source in range(n):\n        targets = adj[source] or list(range(n))\n        for target in targets:\n            new[target] += p[source] / len(targets)\n    delta = sum(abs(new[i] - p[i]) for i in range(n))\n    p = new\n    print(f"step={step};delta={delta:.6f};p=" + ",".join(f"{x:.6f}" for x in p))\n    if delta <= tolerance:\n        converged = True\n        break\nprint("converged=yes" if converged else "converged=no")`,
    },
    homework:
      'Viết artifact ngoài sandbox cho đồ thị 5 node, biểu đồ delta theo vòng và nêu rõ dangling rule; đừng khẳng định đó là PageRank web production.',
    srsCards: [
      {
        hoi: 'Delta L1 trong power iteration đo gì?',
        dap: 'Tổng độ chênh tuyệt đối giữa phân bố hai vòng liên tiếp.',
      },
      {
        hoi: 'Dangling node được xử lý trong simulator ra sao?',
        dap: 'Nó chia đều mass cho mọi node theo luật đã chốt.',
      },
      {
        hoi: 'Delta nhỏ có chứng minh hội tụ tổng quát không?',
        dap: 'Không; đó chỉ là tiêu chí dừng trên trace hữu hạn.',
      },
    ],
  },
]
