// P6-U162 — algo-s2-m1: điều kiện dừng, backtracking và cắt tỉa có kiểm soát.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U162_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u162-l1',
    unitId: 'p6-u162',
    language: 'python',
    title: 'Đệ quy hữu hạn — đo tiến độ tới điều kiện dừng',
    hook: 'Một hàm tự gọi có thể trông rất ngắn nhưng vẫn làm dịch vụ treo nếu không có đường đi rõ ràng tới điểm dừng.',
    theory:
      'Một lời gọi đệ quy đúng cần hai bằng chứng: trường hợp cơ sở trả kết quả ngay, và một đại lượng biến thiên giảm nghiêm ngặt ở mọi lời gọi còn lại. Ở đây đại lượng là `n`; hàm cộng từ 1 đến n chỉ gọi tiếp với `n - 1`, rồi dừng tại 0. Giới hạn n nhỏ là một hợp đồng mô phỏng để không biến bài học thành thử giới hạn recursion của Python.',
    workedExample: {
      code: `# Trường hợp cơ sở: không còn số nào để cộng.\ndef tong_den(n):\n    if n == 0:\n        return 0\n    # n giảm đi một trước lần gọi tiếp theo.\n    return n + tong_den(n - 1)\n\nprint(tong_den(4))`,
      stdinLines: [],
    },
    predict: {
      code: `def dem(n):\n    if n == 0:\n        return 0\n    return 1 + dem(n - 1)\n\nprint(dem(3))`,
      question: 'Hàm `dem(3)` in ra gì?',
      choices: ['0', '1', '3', 'RecursionError'],
      answerIndex: 2,
      explain: 'Mỗi lời gọi với n dương đóng góp 1; chuỗi 3, 2, 1 rồi mới chạm trường hợp cơ sở 0.',
    },
    parsons: {
      prompt: 'Xếp hàm tính giai thừa để luôn kiểm điều kiện dừng trước khi gọi tiếp.',
      lines: [
        'def giai_thua(n):',
        '    if n == 0:',
        '        return 1',
        '    return n * giai_thua(n - 1)',
      ],
    },
    make: {
      prompt:
        'Đọc một số nguyên `n`. Nếu `0 <= n <= 12`, dùng ĐỆ QUY để in `sum=<tổng từ 1 đến n>` và `depth=<số lần gọi với n dương>`. Ngoài khoảng hoặc không phải số nguyên thì in `input-khong-hop-le`. MÔ PHỎNG phải có trường hợp cơ sở trước lời gọi tiếp theo; không dùng vòng lặp để tính tổng.',
      starterCode: `dong = input().strip()\n\n# Viết hàm đệ quy: n phải giảm và dừng tại 0.`,
      testCases: [
        {
          stdinLines: ['4'],
          expected: 'sum=10\ndepth=4',
          match: 'contains',
          hidden: false,
          label: 'cộng 1 đến 4',
        },
        {
          stdinLines: ['0'],
          expected: 'sum=0\ndepth=0',
          match: 'contains',
          hidden: true,
          label: 'trường hợp cơ sở',
        },
        {
          stdinLines: ['12'],
          expected: 'sum=78\ndepth=12',
          match: 'contains',
          hidden: true,
          label: 'giới hạn trên hữu hạn',
        },
        {
          stdinLines: ['-1'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'không cho phép đại lượng giảm vô hạn',
        },
      ],
      hints: [
        'Tách phần đọc và kiểm input khỏi hàm đệ quy.',
        'Trường hợp `n == 0` phải return trước dòng gọi lại.',
        'Để có depth, cho hàm trả một cặp `(tong, do_sau)` rồi cộng 1 khi n dương.',
      ],
      sampleSolution: `try:\n    n = int(input().strip())\nexcept ValueError:\n    print("input-khong-hop-le")\n    raise SystemExit\n\nif not 0 <= n <= 12:\n    print("input-khong-hop-le")\n    raise SystemExit\n\ndef tinh(n):\n    if n == 0:\n        return 0, 0\n    tong_con, do_sau_con = tinh(n - 1)\n    return n + tong_con, 1 + do_sau_con\n\ntong, do_sau = tinh(n)\nprint(f"sum={tong}")\nprint(f"depth={do_sau}")`,
    },
    homework:
      'Viết một phiên bản dùng vòng lặp cho cùng đầu vào và ghi rõ vì sao nó tránh stack call. Sau đó giải thích khi nào cấu trúc cây khiến đệ quy dễ đọc hơn dù cần giới hạn độ sâu.',
    srsCards: [
      {
        hoi: 'Hai điều kiện tối thiểu để một hàm đệ quy dừng là gì?',
        dap: 'Phải có trường hợp cơ sở trả về ngay, và mọi lời gọi còn lại phải làm một đại lượng hữu hạn tiến gần trường hợp cơ sở.',
      },
      {
        hoi: 'Vì sao kiểm điều kiện dừng phải đứng trước lời gọi đệ quy?',
        dap: 'Nếu gọi tiếp trước khi chặn trường hợp cơ sở, chương trình có thể không bao giờ quay lại để dừng và sẽ làm tràn call stack.',
      },
    ],
  },
  {
    id: 'p6-u162-l2',
    unitId: 'p6-u162',
    language: 'python',
    title: 'Backtracking có cắt tỉa — tìm tổng mục tiêu có thể kiểm chứng',
    hook: 'Quay lui không phải là thử mọi nhánh vô thức: một nhánh đã vượt ngân sách thì không thể tự nhiên trở thành lời giải.',
    theory:
      'Backtracking chọn hoặc bỏ từng phần tử, rồi hoàn tác lựa chọn khi quay về nhánh cha. Với các số nguyên dương, nếu tổng tạm thời đã lớn hơn target thì mọi phần tử thêm vào chỉ làm tổng lớn hơn: đó là một điều kiện cắt tỉa đúng. Bài mô phỏng giới hạn tối đa tám số để người học thấy cây trạng thái và có thể đối chiếu với vét cạn; nó không thay cho solver tối ưu tổng quát.',
    workedExample: {
      code: `# Dừng một nhánh ngay khi tổng đã vượt mục tiêu.\ndef tim(ds, target, i=0, tong=0):\n    if tong == target:\n        return True\n    if i == len(ds) or tong > target:\n        return False\n    return tim(ds, target, i + 1, tong + ds[i]) or tim(ds, target, i + 1, tong)\n\nprint(tim([2, 3, 7], 5))`,
      stdinLines: [],
    },
    predict: {
      code: `def duoc_cat(tong, target):\n    return tong > target\n\nprint(duoc_cat(9, 8))\nprint(duoc_cat(8, 8))`,
      question: 'Hai dòng kết quả của điều kiện cắt tỉa là gì?',
      choices: ['True\nTrue', 'True\nFalse', 'False\nTrue', 'False\nFalse'],
      answerIndex: 1,
      explain:
        'Tổng bằng target là một nghiệm, không phải nhánh bị cắt. Chỉ tổng lớn hơn target mới không thể cứu với số dương.',
    },
    parsons: {
      prompt: 'Xếp phần đầu của hàm quay lui để cắt nhánh an toàn trước khi thử phần tử kế tiếp.',
      lines: [
        'def duyet(i, tong):',
        '    if tong == target:',
        '        return True',
        '    if i == len(ds) or tong > target:',
        '        return False',
      ],
    },
    make: {
      prompt:
        'Đọc dòng một là các số nguyên dương cách nhau bởi dấu phẩy, dòng hai là `target` nguyên dương. Có nhiều nhất 8 số, mỗi số tối đa 30 và target tối đa 100. Dùng BACKTRACKING để tìm một tập con theo thứ tự input có tổng đúng target. Ưu tiên nghiệm có ít phần tử nhất; nếu hoà, giữ nghiệm được tìm đầu tiên khi duyệt “chọn trước, bỏ sau”. In `found=a,b` và `count=k`, hoặc `no-solution`. Input không hợp lệ in `input-khong-hop-le`. Cắt tỉa khi tổng vượt target; không dùng thư viện tối ưu hay sinh toàn bộ powerset.',
      starterCode: `dong_so = input().strip()\ndong_target = input().strip()\n\n# MÔ PHỎNG quay lui hữu hạn: chọn trước, bỏ sau, cắt khi tổng > target.`,
      testCases: [
        {
          stdinLines: ['2,3,5,7', '10'],
          expected: 'found=3,7\ncount=2',
          match: 'contains',
          hidden: false,
          label: 'ưu tiên nghiệm hai phần tử',
        },
        {
          stdinLines: ['4,6,8', '14'],
          expected: 'found=6,8\ncount=2',
          match: 'contains',
          hidden: true,
          label: 'nhánh chọn rồi bỏ',
        },
        {
          stdinLines: ['5,9', '8'],
          expected: 'no-solution',
          match: 'contains',
          hidden: true,
          label: 'không có tổ hợp',
        },
        {
          stdinLines: ['2,0,3', '5'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'cắt tỉa chỉ đúng với số dương',
        },
      ],
      hints: [
        'Xác thực mọi số dương trước khi bắt đầu; cắt `tong > target` không đúng nếu có số âm.',
        'Hàm `duyet(i, tong, da_chon)` thử nhánh thêm `ds[i]` trước nhánh không thêm.',
        'Khi gặp nghiệm, chỉ thay `best` nếu số phần tử ít hơn best cũ; không thay khi bằng để giữ thứ tự duyệt.',
      ],
      sampleSolution: `try:\n    ds = [int(x.strip()) for x in input().strip().split(",")]\n    target = int(input().strip())\nexcept ValueError:\n    print("input-khong-hop-le")\n    raise SystemExit\n\nif not ds or len(ds) > 8 or target <= 0 or target > 100 or any(x <= 0 or x > 30 for x in ds):\n    print("input-khong-hop-le")\n    raise SystemExit\n\nbest = None\ndef duyet(i, tong, da_chon):\n    global best\n    if tong == target:\n        if best is None or len(da_chon) < len(best):\n            best = da_chon[:]\n        return\n    if i == len(ds) or tong > target:\n        return\n    if best is not None and len(da_chon) >= len(best):\n        return\n    da_chon.append(ds[i])\n    duyet(i + 1, tong + ds[i], da_chon)\n    da_chon.pop()\n    duyet(i + 1, tong, da_chon)\n\nduyet(0, 0, [])\nif best is None:\n    print("no-solution")\nelse:\n    print("found=" + ",".join(str(x) for x in best))\n    print(f"count={len(best)}")`,
    },
    homework:
      'Viết một bộ sinh dữ liệu nhỏ, so sánh kết quả quay lui với vét cạn trên ít nhất 100 input cùng hạt giống. Ghi một ca cho thấy cắt tỉa giảm số nút đã thăm.',
    srsCards: [
      {
        hoi: 'Khi nào cắt nhánh `tong > target` là an toàn?',
        dap: 'Khi các giá trị còn lại đều dương, vì thêm chúng chỉ có thể làm tổng tăng nên nhánh đó không thể quay về target.',
      },
      {
        hoi: 'Backtracking phải hoàn tác điều gì sau nhánh chọn?',
        dap: 'Phải bỏ lựa chọn vừa thêm khỏi trạng thái dùng chung trước khi duyệt nhánh anh em, nếu không nhánh sau mang dữ liệu của nhánh trước.',
      },
      {
        hoi: 'Vì sao vẫn cần đối chiếu với vét cạn trên input nhỏ?',
        dap: 'Một điều kiện cắt tỉa sai có thể bỏ mất nghiệm nhưng không gây lỗi chạy; lời giải vét cạn nhỏ là oracle để phát hiện sai lệch.',
      },
    ],
  },
]
