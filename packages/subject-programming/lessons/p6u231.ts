// P6-U231 — algo-s4-m2: tối ưu và NP-khó. Nhận ra bài ba lô 0/1 lớn là không khả thi vét
// cạn, chuyển sang heuristic tham lam + cải thiện cục bộ, và luôn kèm một cận trên tính
// được bằng công thức đóng để biết mình còn cách lời giải tốt nhất bao xa.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U231_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u231-l1',
    unitId: 'p6-u231',
    language: 'python',
    title: 'Heuristic tham lam kèm cận trên — biết mình còn cách bao xa',
    hook: 'Với 60 món hàng, vét cạn cần hơn một tỉ tỉ tổ hợp. Câu hỏi đúng không còn là "tối ưu chưa" mà là "cách tối ưu bao xa".',
    theory:
      'Ba lô 0/1 là bài NP-khó: không có thuật toán nào biết được chạy nhanh cho mọi kích thước. Khi số món vượt trần vét cạn, việc cần làm không phải là cố tìm lời giải hoàn hảo mà là (1) chọn một heuristic rẻ, (2) tính một CẬN TRÊN đúng, và (3) báo rõ rằng kết quả CHƯA được kiểm là tối ưu. Cận trên tốt và rẻ nhất ở đây là lời giải của bài ba lô PHÂN SỐ: sắp món theo tỉ suất giá trị trên trọng lượng giảm dần, nhét trọn cho tới khi không đủ chỗ rồi nhét phần lẻ của món kế tiếp. Vì bài phân số nới lỏng ràng buộc nguyên, giá trị của nó luôn lớn hơn hoặc bằng lời giải 0/1 thật. Khoảng cách giữa heuristic và cận trên là thứ duy nhất nói lên chất lượng, và nó tính được mà không cần biết đáp án.',
    workedExample: {
      code: `# Can tren = ba lo PHAN SO: sap theo ti suat giam dan.\nmon = [(10, 60), (20, 100), (30, 120)]\nsuc_chua = 50\nmon.sort(key=lambda t: (-t[1] * 1000 // t[0], t[0]))\ncon = suc_chua\ncan_tren = 0\nfor w, v in mon:\n    if w <= con:\n        can_tren += v\n        con -= w\n    else:\n        can_tren += v * con // w\n        con = 0\n        break\nprint(can_tren)`,
      stdinLines: [],
    },
    predict: {
      code: `mon = [(10, 60), (20, 100)]\n# Ti suat: 60/10 = 6 va 100/20 = 5.\nti_suat = [v * 100 // w for w, v in mon]\nprint(ti_suat)\nprint(ti_suat[0] > ti_suat[1])`,
      question: 'Hai dòng in ra là gì?',
      choices: ['[600, 500]\nTrue', '[6, 5]\nTrue', '[600, 500]\nFalse', '[60, 100]\nTrue'],
      answerIndex: 0,
      explain:
        'Nhân 100 trước khi chia nguyên giữ được hai chữ số thập phân của tỉ suất mà vẫn chỉ dùng số nguyên; 600 lớn hơn 500 nên món đầu được ưu tiên.',
    },
    parsons: {
      prompt: 'Xếp vòng tính cận trên bằng ba lô phân số.',
      lines: [
        'for w, v in mon:',
        '    if w <= con:',
        '        can_tren += v',
        '        con -= w',
        '    else:',
        '        can_tren += v * con // w',
        '        con = 0',
        '        break',
      ],
    },
    make: {
      prompt:
        'Đọc dòng một là danh sách món `trọng lượng:giá trị` cách nhau dấu phẩy, dòng hai là sức chứa. Sắp món theo tỉ suất `v*1000//w` GIẢM DẦN, hoà thì trọng lượng nhỏ trước, rồi nhét tham lam theo thứ tự đó. In ba dòng: `gia-tri: <tổng giá trị nhét được>`, `can-tren: <cận trên ba lô phân số, lấy phần nguyên>`, rồi `khong-kiem-tra-toi-uu: qua-tran-vet-can` nếu có hơn 12 món, ngược lại `da-kiem-toi-uu: trong-tran-vet-can`. Danh sách rỗng hoặc sức chứa `<= 0` in `tu-choi: input-khong-hop-le`. Không được im lặng coi kết quả heuristic là tối ưu.',
      starterCode: `dong_mon = input().strip()\ndong_suc_chua = input().strip()\n\n# Tham lam de CO ket qua, can tren de BIET con cach bao xa.`,
      testCases: [
        {
          stdinLines: ['10:60,20:100,30:120', '50'],
          expected: 'gia-tri: 160\ncan-tren: 240\nda-kiem-toi-uu: trong-tran-vet-can',
          match: 'contains',
          hidden: false,
          label: 'ví dụ kinh điển: tham lam được 160, cận trên 240',
        },
        {
          stdinLines: ['5:10,5:10', '10'],
          expected: 'gia-tri: 20\ncan-tren: 20\nda-kiem-toi-uu: trong-tran-vet-can',
          match: 'contains',
          hidden: true,
          label: 'nhét trọn nên tham lam chạm đúng cận trên',
        },
        {
          stdinLines: ['7:10', '3'],
          expected: 'gia-tri: 0\ncan-tren: 4',
          match: 'contains',
          hidden: true,
          label: 'không món nào vừa, nhưng cận trên phân số vẫn dương',
        },
        {
          stdinLines: ['1:2,2:4,3:6,4:8,5:10,6:12,7:14,8:16,9:18,10:20,11:22,12:24,13:26', '20'],
          expected: 'khong-kiem-tra-toi-uu: qua-tran-vet-can',
          match: 'contains',
          hidden: true,
          label: 'quá trần vét cạn thì phải khai rõ chưa kiểm tối ưu',
        },
        {
          stdinLines: ['', '10'],
          expected: 'tu-choi: input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'danh sách rỗng',
        },
        {
          stdinLines: ['5:10', '0'],
          expected: 'tu-choi: input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'sức chứa không dương',
        },
      ],
      hints: [
        'Dùng `v * 1000 // w` làm khoá sắp xếp để giữ toàn số nguyên; đừng chia thực.',
        'Cận trên dùng CHÍNH thứ tự tỉ suất đó, nhưng cho phép nhét phần lẻ của món cuối cùng.',
        'Dòng thứ ba chỉ phụ thuộc số món so với trần 12 — nó là lời khai về mức tin cậy, không phải kết quả tính toán.',
      ],
      sampleSolution: `dong_mon = input().strip()\ndong_suc_chua = input().strip()\n\ntry:\n    suc_chua = int(dong_suc_chua)\nexcept ValueError:\n    print("tu-choi: input-khong-hop-le")\n    raise SystemExit\n\nif dong_mon == "" or suc_chua <= 0:\n    print("tu-choi: input-khong-hop-le")\n    raise SystemExit\n\ntry:\n    mon = []\n    for phan in dong_mon.split(","):\n        w_s, v_s = phan.strip().split(":")\n        mon.append((int(w_s), int(v_s)))\nexcept ValueError:\n    print("tu-choi: input-khong-hop-le")\n    raise SystemExit\n\nif any(w <= 0 or v <= 0 for w, v in mon):\n    print("tu-choi: input-khong-hop-le")\n    raise SystemExit\n\nmon.sort(key=lambda t: (-(t[1] * 1000 // t[0]), t[0]))\n\ncon = suc_chua\ngia_tri = 0\nfor w, v in mon:\n    if w <= con:\n        gia_tri += v\n        con -= w\n\ncon = suc_chua\ncan_tren = 0\nfor w, v in mon:\n    if w <= con:\n        can_tren += v\n        con -= w\n    else:\n        can_tren += v * con // w\n        con = 0\n        break\n\nprint("gia-tri: " + str(gia_tri))\nprint("can-tren: " + str(can_tren))\nif len(mon) > 12:\n    print("khong-kiem-tra-toi-uu: qua-tran-vet-can")\nelse:\n    print("da-kiem-toi-uu: trong-tran-vet-can")`,
    },
    homework:
      'Với các bộ dữ liệu không quá 12 món, chạy thêm quy hoạch động đúng và ghi lại ba con số: heuristic, tối ưu thật, cận trên. Tìm một bộ dữ liệu mà tham lam theo tỉ suất cho kết quả tệ hơn hẳn tối ưu, rồi giải thích vì sao tỉ suất cao không bảo đảm chọn đúng.',
    srsCards: [
      {
        hoi: 'Vì sao lời giải ba lô phân số luôn là cận TRÊN của bài ba lô 0/1?',
        dap: 'Vì nó nới lỏng ràng buộc "lấy trọn hoặc không lấy", tức là mọi lời giải 0/1 đều là lời giải hợp lệ của bài phân số, nên giá trị tốt nhất của bài phân số không thể nhỏ hơn.',
      },
      {
        hoi: 'Khi bài quá lớn để vét cạn, kết quả heuristic phải đi kèm điều gì?',
        dap: 'Phải đi kèm một cận trên tính được và lời khai rõ rằng chưa kiểm tra tính tối ưu; im lặng trình bày kết quả heuristic như đáp án tối ưu là một tuyên bố sai.',
      },
      {
        hoi: 'Vì sao dùng `v * 1000 // w` thay cho phép chia thực khi sắp theo tỉ suất?',
        dap: 'Để mọi phép tính ở lại trong số nguyên, nhờ đó thứ tự sắp xếp là tất định và không phụ thuộc sai số làm tròn của dấu phẩy động.',
      },
    ],
  },
  {
    id: 'p6-u231-l2',
    unitId: 'p6-u231',
    language: 'python',
    title: 'Cải thiện cục bộ — đo xem thêm một bước có đáng hay không',
    hook: 'Thêm một vòng tinh chỉnh vào heuristic luôn nghe hợp lý; chỉ con số trước và sau mới nói được nó có đáng chi phí hay không.',
    theory:
      'Cải thiện cục bộ (local search) bắt đầu từ một lời giải có sẵn rồi thử các nước đi nhỏ: ở đây là đổi một món đang chọn lấy một món chưa chọn, hoặc nhét thêm một món còn vừa chỗ. Mỗi nước chỉ được chấp nhận khi tổng giá trị TĂNG, và số vòng bị chặn để thuật toán chắc chắn dừng. Điểm quan trọng về phương pháp: đừng tin "thêm bước thì tốt hơn" — hãy chạy cả hai bản trên CÙNG dữ liệu và in ra mức cải thiện. Nếu mức cải thiện bằng 0 trên mọi bộ dữ liệu bạn quan tâm thì bước đó chỉ tốn thời gian. Đây chính là khuôn đánh giá mọi heuristic: so với chính mình khi bỏ bớt một thành phần, chứ không so với cảm giác.',
    workedExample: {
      code: `# Mot nuoc doi: bo mon dang chon, lay mon chua chon neu tang gia tri.\nmon = [(4, 5), (3, 4), (5, 9)]\nchon = [True, True, False]\nsuc_chua = 8\nnang = sum(w for i, (w, v) in enumerate(mon) if chon[i])\ngia = sum(v for i, (w, v) in enumerate(mon) if chon[i])\n# Doi mon 0 (4kg, 5d) lay mon 2 (5kg, 9d).\nnang_moi = nang - mon[0][0] + mon[2][0]\ngia_moi = gia - mon[0][1] + mon[2][1]\nprint(nang_moi <= suc_chua and gia_moi > gia)\nprint(gia, gia_moi)`,
      stdinLines: [],
    },
    predict: {
      code: `gia = 100\ncac_nuoc = [98, 100, 105]\nchap_nhan = [g for g in cac_nuoc if g > gia]\nprint(chap_nhan)`,
      question: 'Danh sách nước đi được chấp nhận là gì?',
      choices: ['[105]', '[100, 105]', '[98, 105]', '[]'],
      answerIndex: 0,
      explain:
        'Chỉ nước đi làm TĂNG nghiêm ngặt tổng giá trị mới được nhận; nhận cả nước đi bằng nhau sẽ khiến thuật toán lặp vòng và không dừng.',
    },
    parsons: {
      prompt: 'Xếp điều kiện chấp nhận một nước đổi món trong cải thiện cục bộ.',
      lines: [
        'nang_moi = nang - mon[i][0] + mon[j][0]',
        'gia_moi = gia - mon[i][1] + mon[j][1]',
        'if nang_moi <= suc_chua and gia_moi > gia:',
        '    chon[i] = False',
        '    chon[j] = True',
        '    return True',
      ],
    },
    make: {
      prompt:
        'Đọc dòng một là danh sách món `trọng lượng:giá trị`, dòng hai là sức chứa. Bước 1: tham lam theo tỉ suất `v*1000//w` giảm dần (hoà thì trọng lượng nhỏ trước) để có lời giải nền. Bước 2: CẢI THIỆN CỤC BỘ tối đa 100 vòng — mỗi vòng, trước hết duyệt chỉ số tăng dần để nhét thêm món chưa chọn còn vừa chỗ; nếu không nhét được thì duyệt mọi cặp (i đang chọn, j chưa chọn) theo chỉ số tăng dần và thực hiện nước ĐỔI ĐẦU TIÊN làm tổng giá trị tăng nghiêm ngặt; không còn nước nào thì dừng. In `gia-tri: <sau cải thiện>`, `cai-thien: <sau - trước>`. Danh sách rỗng hoặc sức chứa `<= 0` in `tu-choi: input-khong-hop-le`.',
      starterCode: `dong_mon = input().strip()\ndong_suc_chua = input().strip()\n\n# Chay ca hai ban tren CUNG du lieu roi in muc cai thien.`,
      testCases: [
        {
          stdinLines: ['1:2,1:3,4:6', '5'],
          expected: 'gia-tri: 9\ncai-thien: 4',
          match: 'contains',
          hidden: false,
          label: 'hai nước đổi liên tiếp làm giá trị tăng đo được',
        },
        {
          stdinLines: ['5:10,5:10', '10'],
          expected: 'gia-tri: 20\ncai-thien: 0',
          match: 'contains',
          hidden: true,
          label: 'tham lam đã tối ưu, cải thiện cục bộ không thêm gì',
        },
        {
          stdinLines: ['7:10', '3'],
          expected: 'gia-tri: 0\ncai-thien: 0',
          match: 'contains',
          hidden: true,
          label: 'không món nào vừa chỗ',
        },
        {
          stdinLines: ['', '10'],
          expected: 'tu-choi: input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'danh sách rỗng',
        },
        {
          stdinLines: ['5:10', '-1'],
          expected: 'tu-choi: input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'sức chứa âm',
        },
      ],
      hints: [
        'Lưu lời giải nền lại TRƯỚC khi cải thiện — không có nó thì không tính được mức cải thiện.',
        'Chặn số vòng lặp: một nước đi chỉ được nhận khi giá trị tăng nghiêm ngặt, nhưng vẫn nên có trần vòng để chắc chắn dừng.',
        'Thứ tự duyệt phải cố định (chỉ số tăng dần) thì kết quả mới tất định và chấm được.',
      ],
      sampleSolution: `dong_mon = input().strip()\ndong_suc_chua = input().strip()\n\ntry:\n    suc_chua = int(dong_suc_chua)\nexcept ValueError:\n    print("tu-choi: input-khong-hop-le")\n    raise SystemExit\n\nif dong_mon == "" or suc_chua <= 0:\n    print("tu-choi: input-khong-hop-le")\n    raise SystemExit\n\ntry:\n    mon = []\n    for phan in dong_mon.split(","):\n        w_s, v_s = phan.strip().split(":")\n        mon.append((int(w_s), int(v_s)))\nexcept ValueError:\n    print("tu-choi: input-khong-hop-le")\n    raise SystemExit\n\nif any(w <= 0 or v <= 0 for w, v in mon):\n    print("tu-choi: input-khong-hop-le")\n    raise SystemExit\n\nmon.sort(key=lambda t: (-(t[1] * 1000 // t[0]), t[0]))\n\nchon = [False] * len(mon)\nnang = 0\ngia = 0\nfor i, (w, v) in enumerate(mon):\n    if nang + w <= suc_chua:\n        chon[i] = True\n        nang += w\n        gia += v\n\ntruoc = gia\n\nfor _ in range(100):\n    doi_duoc = False\n    for j, (wj, vj) in enumerate(mon):\n        if not chon[j] and nang + wj <= suc_chua:\n            chon[j] = True\n            nang += wj\n            gia += vj\n            doi_duoc = True\n            break\n    if doi_duoc:\n        continue\n    for i in range(len(mon)):\n        if not chon[i]:\n            continue\n        for j in range(len(mon)):\n            if chon[j]:\n                continue\n            nang_moi = nang - mon[i][0] + mon[j][0]\n            gia_moi = gia - mon[i][1] + mon[j][1]\n            if nang_moi <= suc_chua and gia_moi > gia:\n                chon[i] = False\n                chon[j] = True\n                nang = nang_moi\n                gia = gia_moi\n                doi_duoc = True\n                break\n        if doi_duoc:\n            break\n    if not doi_duoc:\n        break\n\nprint("gia-tri: " + str(gia))\nprint("cai-thien: " + str(gia - truoc))`,
    },
    homework:
      'Chạy bản có và bản không có cải thiện cục bộ trên 50 bộ dữ liệu sinh có hạt giống cố định, ghi lại mức cải thiện trung bình và số bộ dữ liệu cải thiện bằng 0. Từ đó tự kết luận bước cải thiện có đáng giữ lại trong bài toán của bạn hay không.',
    srsCards: [
      {
        hoi: 'Vì sao nước đi trong cải thiện cục bộ phải làm giá trị tăng NGHIÊM NGẶT?',
        dap: 'Vì nếu chấp nhận cả nước đi giữ nguyên giá trị, thuật toán có thể đi vòng qua lại giữa hai lời giải tương đương và không bao giờ dừng lại.',
      },
      {
        hoi: 'Cách đúng để biết một bước tinh chỉnh heuristic có đáng giữ hay không là gì?',
        dap: 'Chạy bản có bước đó và bản bỏ bước đó trên cùng bộ dữ liệu rồi so mức cải thiện đo được; nếu mức cải thiện bằng 0 thì bước đó chỉ thêm chi phí mà không thêm giá trị.',
      },
      {
        hoi: 'Vì sao thứ tự duyệt các nước đi phải cố định?',
        dap: 'Vì lời giải cuối cùng phụ thuộc vào nước đi nào được chấp nhận trước; thứ tự đổi giữa các lần chạy sẽ làm kết quả khác nhau và không chấm hay tái hiện được.',
      },
    ],
  },
]
