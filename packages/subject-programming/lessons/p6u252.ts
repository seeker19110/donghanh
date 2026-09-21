// lessons/p6u252.ts — P6-U252: HƯỚNG GAME, chặng S3 — module `game-s3-m3` (hiệu năng: ngân sách
// khung hình, cắt tỉa ngoài tầm nhìn, mức chi tiết LOD).
//
// Bài 1 lo THỨ TỰ LÀM VIỆC: cắt tỉa (culling) TRƯỚC, chọn mức chi tiết (LOD) SAU — vật đã bị cắt
// thì không tốn một phép tính nào nữa. Bài 2 lo NGÂN SÁCH KHUNG HÌNH chia cho CPU và GPU, và lời
// từ chối phải nói rõ BÊN NÀO vượt, vì tối ưu nhầm bên là tối ưu vô ích.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: mili-giây là tham số khai báo, KHÔNG phải số đo từ profiler thật.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U252_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u252-l1',
    unitId: 'p6-u252',
    language: 'python',
    title: 'MÔ PHỎNG cắt tỉa và LOD: rẻ nhất là thứ bạn không vẽ',
    hook: 'Mức chi tiết thấp nhất của một mô hình vẫn đắt hơn mô hình bị cắt bỏ hoàn toàn — vì cái sau tốn đúng 0.',
    theory:
      'Hai kỹ thuật này hay bị nhắc chung nhưng làm hai việc khác nhau, và THỨ TỰ giữa chúng là phần quan trọng nhất. Cắt tỉa (culling) loại bỏ vật không nằm trong tầm nhìn camera, hoặc bị vật khác che kín — vật bị cắt thì không vẽ, không tính LOD, không tốn gì. Chọn mức chi tiết (LOD) chỉ áp cho vật CÒN LẠI: xa thì dùng mô hình ít tam giác hơn, gần thì mô hình đầy đủ, theo các ngưỡng khoảng cách khai báo trước. Làm ngược thứ tự — tính LOD cho cả những vật sắp bị cắt — là tự trả tiền cho công việc mình sắp vứt đi. Ngưỡng LOD phải tăng dần; ngưỡng lộn xộn thì hai vật ở cùng khoảng cách có thể ra hai mức khác nhau. Đây là MÔ PHỎNG Python hữu hạn trên số nguyên khai báo: không engine, không profiler thật.',
    workedExample: {
      code: `# MO PHONG cat tia truoc, LOD sau; nguong la khoang cach KHAI BAO truoc.\ntrong_tam_nhin, kc = 0, 30\nif trong_tam_nhin == 0:\n    print("cull: ngoai tam nhin, khong tinh LOD")\nelse:\n    print("render: lod=0")`,
      stdinLines: [],
    },
    predict: {
      code: `nguong = [20, 60]\nkc = 30\nmuc = sum(1 for n in nguong if kc >= n)\nprint("render: lod=" + str(muc))`,
      question: 'Vật ở khoảng cách 30, ngưỡng LOD khai báo là 20 và 60. MÔ PHỎNG in gì?',
      choices: ['render: lod=1', 'render: lod=0', 'render: lod=2', 'cull: ngoai tam nhin'],
      answerIndex: 0,
      explain:
        'Khoảng cách 30 đã qua ngưỡng đầu tiên (20) nhưng chưa tới ngưỡng thứ hai (60), nên vật rơi vào mức chi tiết 1 — mức giữa. Đếm số ngưỡng đã vượt là cách viết gọn và tất định cho luật bậc thang này.',
    },
    parsons: {
      prompt: 'Xếp thứ tự đúng: cắt tỉa trước, chỉ vật còn lại mới tính mức chi tiết.',
      lines: [
        'if trong_tam_nhin == 0:',
        '    print("cull: ngoai tam nhin, khong tinh LOD")',
        'elif nguong != sorted(nguong):',
        '    print("invalid: nguong lod khong tang dan")',
        'else:',
        '    muc = sum(1 for n in nguong if kc >= n)',
        '    print("render: lod=" + str(muc))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng cắt tỉa và LOD. Ngưỡng LOD đọc từ đầu vào. Đọc `trong_tam_nhin:<0|1>,kc:<int>,n1:<int>,n2:<int>`. Thiếu/thừa trường → `invalid: field`; trong_tam_nhin ngoài {0,1} → `invalid: trong_tam_nhin`; kc, n1, n2 không phải số nguyên không âm → `invalid: so`; n1 ≥ n2 → `invalid: nguong lod khong tang dan`; trong_tam_nhin = 0 → `cull: ngoai tam nhin, khong tinh LOD`; còn lại → `render: lod=<số ngưỡng mà kc đã vượt hoặc bằng>`. Không engine, không profiler thật, không I/O ngoài.',
      starterCode: '# MÔ PHỎNG cắt tỉa và LOD; vật bị cắt thì KHÔNG tính thêm gì nữa.\n',
      testCases: [
        {
          stdinLines: ['trong_tam_nhin:1,kc:30,n1:20,n2:60'],
          expected: 'render: lod=1',
          match: 'contains',
          hidden: false,
          label: 'khoảng cách giữa hai ngưỡng thì dùng mức chi tiết giữa',
        },
        {
          stdinLines: ['trong_tam_nhin:0,kc:30,n1:20,n2:60'],
          expected: 'cull: ngoai tam nhin, khong tinh LOD',
          match: 'contains',
          hidden: true,
          label: 'vật ngoài tầm nhìn bị cắt TRƯỚC, không tốn phép tính LOD nào',
        },
        {
          stdinLines: ['trong_tam_nhin:1,kc:5,n1:20,n2:60'],
          expected: 'render: lod=0',
          match: 'contains',
          hidden: true,
          label: 'ở gần thì dùng mô hình đầy đủ',
        },
        {
          stdinLines: ['trong_tam_nhin:1,kc:60,n1:20,n2:60'],
          expected: 'render: lod=2',
          match: 'contains',
          hidden: true,
          label: 'đúng ngưỡng thì đã thuộc mức xa hơn — biên phải khai rõ',
        },
        {
          stdinLines: ['trong_tam_nhin:1,kc:30,n1:60,n2:20'],
          expected: 'invalid: nguong lod khong tang dan',
          match: 'contains',
          hidden: true,
          label: 'ca âm — ngưỡng lộn xộn làm mức chi tiết không tất định, fail closed',
        },
      ],
      hints: [
        'Đếm số ngưỡng mà khoảng cách đã đạt: `sum(1 for n in nguong if kc >= n)`.',
        'Cắt tỉa phải đứng TRƯỚC LOD trong chuỗi rẽ nhánh — đó chính là bài học của lesson này.',
        'Không dùng file, socket, subprocess, thư viện đồ hoạ hay thời gian thực.',
      ],
      sampleSolution: `KHOA = ("kc", "n1", "n2")


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"trong_tam_nhin", *KHOA}:
        print("invalid: field")
    elif m["trong_tam_nhin"] not in {"0", "1"}:
        print("invalid: trong_tam_nhin")
    elif any(so(m[k]) is None for k in KHOA):
        print("invalid: so")
    else:
        kc, n1, n2 = so(m["kc"]), so(m["n1"]), so(m["n2"])
        if n1 >= n2:
            print("invalid: nguong lod khong tang dan")
        elif m["trong_tam_nhin"] == "0":
            print("cull: ngoai tam nhin, khong tinh LOD")
        else:
            print("render: lod=" + str(sum(1 for n in (n1, n2) if kc >= n)))
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity dựng một cảnh có ít nhất năm mươi vật thể giống nhau, gắn LOD cho chúng rồi đọc số vật thể được vẽ và số tam giác trong thống kê của engine khi xoay camera. Ghi lại ba cặp số: quay vào giữa cảnh, quay ra ngoài cảnh, và đứng sát một vật thể.',
    srsCards: [
      {
        hoi: 'Vì sao cắt tỉa phải chạy trước khi chọn mức chi tiết?',
        dap: 'Vật bị cắt không được vẽ nên mọi phép tính dành cho nó — kể cả chọn mức chi tiết — là công việc vứt đi; đảo thứ tự là tự trả tiền cho thứ mình sắp bỏ.',
      },
      {
        hoi: 'Vì sao ngưỡng LOD phải tăng dần?',
        dap: 'Luật bậc thang chỉ tất định khi các mốc xếp theo thứ tự; ngưỡng lộn xộn khiến cùng một khoảng cách có thể rơi vào hai mức tuỳ cách duyệt, và mô hình sẽ nhảy qua lại giữa hai mức khi camera nhích nhẹ.',
      },
    ],
  },
  {
    id: 'p6-u252-l2',
    unitId: 'p6-u252',
    language: 'python',
    title: 'MÔ PHỎNG ngân sách khung hình 16,6ms: nói rõ CPU hay GPU đang vượt',
    hook: 'Tối ưu nhầm bên là cách tốn thời gian sang trọng nhất: bạn cắt nửa số tam giác và khung hình không nhanh lên một mili-giây nào.',
    theory:
      'Sáu mươi khung hình một giây nghĩa là mỗi khung có khoảng 16,6 mili-giây — tất cả mọi thứ phải vừa trong đó. Ngân sách ấy chia cho hai bên chạy song song: CPU (luật chơi, vật lý, chuẩn bị lệnh vẽ) và GPU (dựng hình). Vì chạy song song, bên chậm hơn quyết định thời gian khung hình, nên câu hỏi đầu tiên của mọi đợt tối ưu không phải "làm sao nhanh hơn" mà "BÊN NÀO đang là nút thắt". Cắt tam giác khi nút thắt nằm ở CPU thì không cải thiện gì; ngược lại cũng vậy. Vì thế cổng ngân sách ở đây không chỉ trả `deny` mà phải gọi tên bên vượt. Mọi con số là KHAI BÁO trước, không đo thật — đây là MÔ PHỎNG Python hữu hạn, không profiler thật, không engine.',
    workedExample: {
      code: `# MO PHONG ngan sach khung hinh; don vi la 1/10 mili-giay de giu so nguyen.\ncpu, gpu, ngan_sach = 80, 90, 166  # 8.0ms, 9.0ms, 16.6ms\nben_cham = max(cpu, gpu)\nprint("allow: trong ngan sach khung" if ben_cham <= ngan_sach else "deny: vuot ngan sach")`,
      stdinLines: [],
    },
    predict: {
      code: `cpu, gpu, ngan_sach = 200, 90, 166\nprint("deny: cpu la nut that" if cpu > ngan_sach and cpu >= gpu else "allow: trong ngan sach khung")`,
      question: 'CPU tốn 20,0ms và GPU tốn 9,0ms trong ngân sách 16,6ms. MÔ PHỎNG in gì?',
      choices: [
        'deny: cpu la nut that',
        'allow: trong ngan sach khung',
        'deny: gpu la nut that',
        'invalid: ngan sach',
      ],
      answerIndex: 0,
      explain:
        'CPU là bên chậm hơn và nó vượt ngân sách, nên nó quyết định thời gian khung hình. Nếu lúc này bạn đi giảm số tam giác (việc của GPU), khung hình sẽ không nhanh lên chút nào.',
    },
    parsons: {
      prompt: 'Xếp cổng ngân sách khung hình: gọi tên bên vượt, đừng chỉ nói "chậm".',
      lines: [
        'if ngan_sach <= 0:',
        '    print("invalid: ngan sach")',
        'elif cpu > ngan_sach and cpu >= gpu:',
        '    print("deny: cpu la nut that")',
        'elif gpu > ngan_sach:',
        '    print("deny: gpu la nut that")',
        'else:',
        '    print("allow: trong ngan sach khung")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng ngân sách khung hình (đơn vị 1/10 mili-giây để giữ số nguyên; 16,6ms là 166). Đọc `cpu:<int>,gpu:<int>,ngan_sach:<int>`. Thiếu/thừa trường → `invalid: field`; trường không phải số nguyên không âm → `invalid: so`; ngan_sach ≤ 0 → `invalid: ngan sach`; cpu và gpu đều bằng 0 → `unknown: chua co so do nao`; cpu > ngan_sach và cpu ≥ gpu → `deny: cpu la nut that`; gpu > ngan_sach → `deny: gpu la nut that`; còn lại → `allow: trong ngan sach khung, con <ngan_sach − max(cpu,gpu)> phan muoi ms`. Mọi con số là KHAI BÁO, không đo thật.',
      starterCode:
        '# MÔ PHỎNG ngân sách khung hình; đơn vị 1/10 ms, số khai báo chứ không đo thật.\n',
      testCases: [
        {
          stdinLines: ['cpu:80,gpu:90,ngan_sach:166'],
          expected: 'allow: trong ngan sach khung, con 76 phan muoi ms',
          match: 'contains',
          hidden: false,
          label: 'cả hai bên đều vừa, phần dư tính theo bên chậm hơn',
        },
        {
          stdinLines: ['cpu:200,gpu:90,ngan_sach:166'],
          expected: 'deny: cpu la nut that',
          match: 'contains',
          hidden: true,
          label: 'CPU vượt và chậm hơn — tối ưu GPU lúc này là vô ích',
        },
        {
          stdinLines: ['cpu:80,gpu:200,ngan_sach:166'],
          expected: 'deny: gpu la nut that',
          match: 'contains',
          hidden: true,
          label: 'GPU vượt thì gọi đúng tên GPU',
        },
        {
          stdinLines: ['cpu:0,gpu:0,ngan_sach:166'],
          expected: 'unknown: chua co so do nao',
          match: 'contains',
          hidden: true,
          label: 'chưa có số đo thì trả unknown, cấm coi như "đạt ngân sách"',
        },
        {
          stdinLines: ['cpu:80,gpu:90,ngan_sach:0'],
          expected: 'invalid: ngan sach',
          match: 'contains',
          hidden: true,
          label: 'ca âm — ngân sách không dương fail closed',
        },
      ],
      hints: [
        'Vì CPU và GPU chạy song song, thời gian khung hình là `max(cpu, gpu)` chứ không phải tổng.',
        'Chưa có số đo KHÔNG phải là "nhanh" — trả `unknown` thay vì một tín hiệu xanh giả.',
        'Không dùng file, socket, subprocess hay thời gian thực.',
      ],
      sampleSolution: `KHOA = ("cpu", "gpu", "ngan_sach")


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(KHOA):
        print("invalid: field")
    elif any(so(m[k]) is None for k in KHOA):
        print("invalid: so")
    else:
        cpu, gpu, ns = so(m["cpu"]), so(m["gpu"]), so(m["ngan_sach"])
        if ns <= 0:
            print("invalid: ngan sach")
        elif cpu == 0 and gpu == 0:
            print("unknown: chua co so do nao")
        elif cpu > ns and cpu >= gpu:
            print("deny: cpu la nut that")
        elif gpu > ns:
            print("deny: gpu la nut that")
        else:
            print("allow: trong ngan sach khung, con " + str(ns - max(cpu, gpu)) + " phan muoi ms")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, chạy một cảnh thật của bạn trên máy mục tiêu và dùng công cụ đo của Godot hoặc Unity để lấy thời gian CPU và thời gian GPU của một khung hình. Xác định bên nào là nút thắt, làm MỘT thay đổi nhắm đúng bên đó, đo lại, rồi nộp bảng bốn con số trước–sau kèm ảnh chụp công cụ đo.',
    srsCards: [
      {
        hoi: 'Vì sao thời gian một khung hình là `max(CPU, GPU)` chứ không phải tổng hai con số?',
        dap: 'Hai bên chạy song song: trong lúc GPU dựng khung này, CPU đã chuẩn bị khung sau. Nên bên chậm hơn quyết định nhịp, và cộng hai con số sẽ cho một bức tranh sai hẳn.',
      },
      {
        hoi: 'Vì sao câu hỏi đầu tiên của mọi đợt tối ưu là "bên nào là nút thắt"?',
        dap: 'Vì cải thiện bên không phải nút thắt không làm khung hình nhanh lên chút nào; biết đúng bên trước khi sửa là thứ phân biệt tối ưu có số đo với tối ưu theo cảm giác.',
      },
    ],
  },
]
