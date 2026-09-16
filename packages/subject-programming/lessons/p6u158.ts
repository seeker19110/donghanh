// P6-U158 — mathforcode-s3-m1,m2: vector và transform 2D.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U158_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u158-l1',
    unitId: 'p6-u158',
    language: 'python',
    title: 'Vector 2D — dot product và chuẩn hoá fail-closed',
    hook: 'Một embedding sai dimension hoặc vector 0 bị đem chuẩn hoá có thể biến dữ liệu hỏng thành một con số nghe hợp lý.',
    theory:
      'Tích vô hướng `a·b = Σ ai*bi` chỉ được định nghĩa khi hai vector cùng dimension. Chuẩn Euclid là `sqrt(a·a)`; chuẩn hoá phải từ chối vector 0 thay vì chia 0. Đây là MÔ PHỎNG Python thuần trên dữ liệu nhỏ, không dùng NumPy, embedding service hay chứng minh chất lượng một model thật.',
    workedExample: {
      code: `import math\na = [3.0, 4.0]\nb = [2.0, -1.0]\nprint(sum(x * y for x, y in zip(a, b)))\nnorm = math.sqrt(sum(x * x for x in a))\nprint([x / norm for x in a])`,
      stdinLines: [],
    },
    predict: {
      code: `a = [1, 2]\nb = [2, -1]\nprint(sum(x * y for x, y in zip(a, b)))\nprint(sum(x * x for x in a))`,
      question: 'Tích vô hướng và bình phương độ dài được in theo thứ tự nào?',
      choices: ['0\n5', '1\n5', '-1\n3', '0\n3'],
      answerIndex: 0,
      explain: '`1*2 + 2*(-1)=0`; bình phương độ dài là `1²+2²=5`.',
    },
    parsons: {
      prompt: 'Xếp hàm chuẩn hoá vector sao cho từ chối vector 0.',
      lines: [
        'def chuan_hoa(v):',
        '    do_dai = sum(x * x for x in v) ** 0.5',
        '    if do_dai == 0:',
        '        return None',
        '    return [x / do_dai for x in v]',
      ],
    },
    make: {
      prompt:
        'Đọc hai dòng vector số thực, phần tử cách nhau bởi dấu phẩy, và chế độ `normalize` hoặc `cosine`. In `dot=<3-chữ-số>` và `norm-a=<3-chữ-số>`; normalize in thêm `unit-a=...`, cosine in thêm `cosine=...`. Vector rỗng, NaN/inf hoặc mode sai in `input-khong-hop-le`; khác dimension in `khac-dimension`; vector 0 cần chuẩn hoá/cosine in `vector-zero`. Đây là MÔ PHỎNG Python thuần, không gọi NumPy hay embedding thật.',
      starterCode: `import math\n\ndong_a = input().strip()\ndong_b = input().strip()\nche_do = input().strip()\n\n# MÔ PHỎNG đại số hữu hạn; không dùng NumPy.`,
      testCases: [
        {
          stdinLines: ['3,4', '2,-1', 'normalize'],
          expected: 'dot=2.000\nnorm-a=5.000\nunit-a=0.600,0.800',
          match: 'contains',
          hidden: false,
          label: 'dot và chuẩn hoá vector 3-4',
        },
        {
          stdinLines: ['1,2', '2,-1', 'cosine'],
          expected: 'cosine=0.000',
          match: 'contains',
          hidden: true,
          label: 'hai vector trực giao',
        },
        {
          stdinLines: ['1,2', '1', 'cosine'],
          expected: 'khac-dimension',
          match: 'contains',
          hidden: true,
          label: 'dimension phải bằng nhau',
        },
        {
          stdinLines: ['0,0', '1,2', 'normalize'],
          expected: 'vector-zero',
          match: 'contains',
          hidden: true,
          label: 'không chia vector 0',
        },
        {
          stdinLines: ['nan,1', '1,2', 'cosine'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'NaN bị từ chối',
        },
      ],
      hints: [
        'Dùng `math.isfinite` cho từng phần tử.',
        'Kiểm tra dimension trước khi zip.',
        'Cosine chỉ hợp lệ khi cả hai norm dương.',
      ],
      sampleSolution: `import math\n\ndef doc_vector(dong):\n    if not dong:\n        return None\n    try:\n        v = [float(x.strip()) for x in dong.split(",")]\n    except ValueError:\n        return None\n    return v if v and all(math.isfinite(x) for x in v) else None\n\na = doc_vector(input().strip())\nb = doc_vector(input().strip())\nche_do = input().strip()\nif a is None or b is None or che_do not in {"normalize", "cosine"}:\n    print("input-khong-hop-le")\nelif len(a) != len(b):\n    print("khac-dimension")\nelse:\n    dot = sum(x * y for x, y in zip(a, b))\n    norm_a = math.sqrt(sum(x * x for x in a))\n    norm_b = math.sqrt(sum(x * x for x in b))\n    if norm_a == 0 or (che_do == "cosine" and norm_b == 0):\n        print("vector-zero")\n    else:\n        print(f"dot={dot:.3f}")\n        print(f"norm-a={norm_a:.3f}")\n        if che_do == "normalize":\n            print("unit-a=" + ",".join(f"{x / norm_a:.3f}" for x in a))\n        else:\n            print(f"cosine={dot / (norm_a * norm_b):.3f}")`,
    },
    homework:
      'Dùng NumPy ngoài sandbox để đối chiếu 10 vector; lưu script và sai số. Simulator không thay phép kiểm chứng đó.',
    srsCards: [
      { hoi: 'Khi nào dot product hợp lệ?', dap: 'Khi hai vector cùng dimension.' },
      {
        hoi: 'Vì sao không chuẩn hoá vector 0?',
        dap: 'Độ dài bằng 0 nên phép chia không xác định.',
      },
    ],
  },
  {
    id: 'p6-u158-l2',
    unitId: 'p6-u158',
    language: 'python',
    title: 'Homogeneous transform 3×3 — thứ tự compose là hợp đồng',
    hook: 'Quay rồi tịnh tiến không bằng tịnh tiến rồi quay; đổi thứ tự transform là đổi kết quả.',
    theory:
      'Toạ độ homogeneous viết điểm 2D là `[x,y,1]`, để quay và tịnh tiến cùng là phép nhân ma trận 3×3. Với vector cột, áp A trước B là `B @ A @ p`; nhân ma trận không giao hoán. Bài này MÔ PHỎNG số nguyên, không phải engine đồ hoạ, GPU hay bằng chứng sai số production.',
    workedExample: {
      code: `# R90 rồi T(2,0) với vector cột.\np = [1, 0, 1]\np = [-p[1], p[0], p[2]]\np = [p[0] + 2, p[1], p[2]]\nprint(p)`,
      stdinLines: [],
    },
    predict: {
      code: `p = [1, 0, 1]\np = [-p[1], p[0], p[2]]\nprint(p)`,
      question: 'Quay 90° CCW điểm (1,0) ra homogeneous nào?',
      choices: ['[0, 1, 1]', '[0, -1, 1]', '[1, 0, 1]', '[1, 1, 0]'],
      answerIndex: 0,
      explain: 'Trục x dương thành trục y dương.',
    },
    parsons: {
      prompt: 'Xếp phép áp dụng R90 lên điểm homogeneous.',
      lines: ['def quay_90(p):', '    x, y, w = p', '    return [-y, x, w]'],
    },
    make: {
      prompt:
        'Đọc `x,y`, rồi danh sách transform cách nhau dấu phẩy: `R` (quay 90° CCW), `T:dx:dy`, `S:k`. Áp theo đúng thứ tự trái qua phải và in `point=x,y`. In `order-matters=yes` nếu có cả R và T, ngược lại `order-matters=not-shown`. Input sai, danh sách rỗng hay w khác 1 in `input-khong-hop-le`. Đây là MÔ PHỎNG vector cột, không phải graphics runtime.',
      starterCode: `dong_diem = input().strip()\ndong_ops = input().strip()\n\n# MÔ PHỎNG transform 3×3, không gọi thư viện đồ hoạ.`,
      testCases: [
        {
          stdinLines: ['1,0', 'R,T:2:0'],
          expected: 'point=2,1\norder-matters=yes',
          match: 'contains',
          hidden: false,
          label: 'quay rồi tịnh tiến',
        },
        {
          stdinLines: ['1,0', 'T:2:0,R'],
          expected: 'point=0,3\norder-matters=yes',
          match: 'contains',
          hidden: true,
          label: 'thứ tự ngược khác kết quả',
        },
        {
          stdinLines: ['2,-1', 'S:3,T:1:2'],
          expected: 'point=7,-1\norder-matters=not-shown',
          match: 'contains',
          hidden: true,
          label: 'scale rồi translate',
        },
        {
          stdinLines: ['1,2', 'R,T:x:0'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'tham số phải là số nguyên',
        },
      ],
      hints: [
        'Giữ điểm là `[x,y,1]`.',
        'Tách T thành đúng ba phần.',
        'Không đổi thứ tự danh sách transform.',
      ],
      sampleSolution: `try:\n    x, y = [int(v.strip()) for v in input().strip().split(",")]\n    ops = [v.strip() for v in input().strip().split(",")]\nexcept ValueError:\n    print("input-khong-hop-le")\n    raise SystemExit\nif not ops or any(not op for op in ops):\n    print("input-khong-hop-le")\n    raise SystemExit\np = [x, y, 1]\nhop_le = True\nco_r = co_t = False\nfor op in ops:\n    if op == "R":\n        p = [-p[1], p[0], p[2]]\n        co_r = True\n    elif op.startswith("S:"):\n        try:\n            phan = op.split(":")\n            if len(phan) != 2: raise ValueError\n            k = int(phan[1])\n            p = [k * p[0], k * p[1], p[2]]\n        except ValueError:\n            hop_le = False\n    elif op.startswith("T:"):\n        try:\n            phan = op.split(":")\n            if len(phan) != 3: raise ValueError\n            p = [p[0] + int(phan[1]), p[1] + int(phan[2]), p[2]]\n            co_t = True\n        except ValueError:\n            hop_le = False\n    else:\n        hop_le = False\nif not hop_le or p[2] != 1:\n    print("input-khong-hop-le")\nelse:\n    print(f"point={p[0]},{p[1]}")\n    print("order-matters=yes" if co_r and co_t else "order-matters=not-shown")`,
    },
    homework:
      'Dựng hai transform R,T và T,R bằng NumPy hoặc thư viện đồ hoạ ngoài sandbox, lưu output và giải thích sai khác.',
    srsCards: [
      {
        hoi: 'Vì sao dùng homogeneous coordinates?',
        dap: 'Để tịnh tiến và quay đều là phép nhân ma trận.',
      },
      { hoi: 'Áp A rồi B cho vector cột compose thế nào?', dap: 'B @ A @ p.' },
      {
        hoi: 'Có thể tự đổi thứ tự transform không?',
        dap: 'Không; phép nhân ma trận nói chung không giao hoán.',
      },
    ],
  },
]
