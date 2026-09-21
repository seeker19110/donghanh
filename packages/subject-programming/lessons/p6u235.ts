// P6-U235 — systems-s3-m2: đo trước khi sửa.
// Bài 1 trả lời "số đo này có đáng tin không", bài 2 trả lời "chỗ này có đáng tối ưu không".
// Hai câu hỏi phải đi theo thứ tự đó: tối ưu dựa trên số đo nhiễu là tối ưu vào chỗ trống.
import { systemsSimulation } from './systemsS3S4LessonFactory.js'

export const P6U235_LESSONS = [
  systemsSimulation({
    id: 'p6-u235-l1',
    unitId: 'p6-u235',
    title: 'vi chuẩn không tự lừa mình — nhiễu và số mẫu',
    hook: 'Chạy một lần thấy nhanh hơn 8%, tuyên bố đã tối ưu. Chạy lại mười lần thì bản cũ có lần còn nhanh hơn. Số đo đầu tiên không sai — nó chỉ chưa đủ để kết luận.',
    theory:
      'Một vi chuẩn chỉ nói được điều gì khi độ phân tán của nó nhỏ hơn hiệu ứng muốn đo. Trace MÔ PHỎNG dùng TRUNG VỊ làm mốc thay vì trung bình vì trung bình bị một lần chạy lạc kéo lệch. Dưới 10 mẫu thì kết luận nào cũng là đoán, nên trả nhãn insufficient-samples chứ không quy về "đã tối ưu".',
    workedCode:
      '# MO PHONG do phan tan quanh trung vi\nxs = sorted([10.0, 10.1, 9.9, 30.0])\nmed = (xs[1] + xs[2]) / 2\nprint("noisy: khong ket luan duoc" if (xs[-1] - xs[0]) / med > 0.2 else "stable: ket luan duoc")',
    predictCode:
      'xs = [10.0, 10.0, 10.1]\nprint("invalid: insufficient-samples" if len(xs) < 10 else "stable: ket luan duoc")',
    predictChoices: [
      'invalid: insufficient-samples',
      'stable: ket luan duoc',
      'noisy: khong ket luan duoc',
    ],
    predictAnswer: 0,
    predictExplain:
      'Ba mẫu chưa đủ để ước lượng độ phân tán, nên simulator trả nhãn tường minh thay vì kết luận bừa.',
    makePrompt:
      'Đọc một dòng gồm các số thực ngăn bằng dấu phẩy. Dưới 10 mẫu → `invalid: insufficient-samples`; có phần tử không phải số → `invalid: sample`; trung vị <= 0 → `invalid: median`; (max - min) / trung vị > 0.2 → `noisy: khong ket luan duoc`; còn lại → `stable: ket luan duoc`. MÔ PHỎNG, không gọi perf hay đồng hồ hệ thống thật.',
    testCases: [
      {
        stdinLines: ['10,10.1,10,9.9,10,10.1,9.9,10,10,10.1'],
        expected: 'stable: ket luan duoc',
        hidden: false,
        label: 'mười mẫu sát nhau thì kết luận được',
      },
      {
        stdinLines: ['10,30,10,10,10,10,10,10,10,10'],
        expected: 'noisy: khong ket luan duoc',
        hidden: true,
        label: 'một lần chạy lạc làm dải đo rộng ra',
      },
      {
        stdinLines: ['10,10,10'],
        expected: 'invalid: insufficient-samples',
        hidden: true,
        label: 'thiếu mẫu thì không quy về đã tối ưu',
      },
      {
        stdinLines: ['10,abc,10,10,10,10,10,10,10,10'],
        expected: 'invalid: sample',
        hidden: true,
        label: 'ca âm — mẫu sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    xs = [float(x) for x in input().strip().split(",")]\n    if len(xs) < 10:\n        print("invalid: insufficient-samples")\n    else:\n        s = sorted(xs)\n        n = len(s)\n        med = s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2\n        if med <= 0: print("invalid: median")\n        elif (s[-1] - s[0]) / med > 0.2: print("noisy: khong ket luan duoc")\n        else: print("stable: ket luan duoc")\nexcept ValueError:\n    print("invalid: sample")',
    homework:
      'Ngoài sandbox, chạy một vi chuẩn thật 30 lần khi máy rảnh và 30 lần khi đang build song song, rồi so trung vị và dải đo của hai đợt để thấy môi trường quyết định độ tin cậy thế nào.',
    cards: [
      {
        hoi: 'Vì sao dùng trung vị thay vì trung bình khi đo hiệu năng?',
        dap: 'Trung bình bị một lần chạy lạc (bị ngắt, bị nhiệt, bị tiến trình khác) kéo lệch; trung vị bền vững hơn với các giá trị ngoại lai.',
      },
      {
        hoi: 'Khi số đo nhiễu hơn hiệu ứng muốn đo thì làm gì?',
        dap: 'Không kết luận. Giảm nhiễu (ghim lõi, tắt tăng xung, tăng số lần lặp) rồi đo lại, chứ không lấy lần đo đẹp nhất.',
      },
    ],
  }),
  systemsSimulation({
    id: 'p6-u235-l2',
    unitId: 'p6-u235',
    title: 'định luật Amdahl — chỗ nào đáng tối ưu',
    hook: 'Bạn làm phần tính toán nhanh gấp một trăm lần, tổng chương trình nhanh hơn được 3%. Phần bạn vừa tối ưu chỉ chiếm 3% thời gian chạy.',
    theory:
      'Định luật Amdahl nói trần cải thiện của toàn chương trình bị chặn bởi tỉ trọng phần tối ưu được: tăng tốc tổng bằng 1 chia cho ((1 - p) + p / s). Trace MÔ PHỎNG này kiểm miền của p trước, rồi chặn sớm những phần quá nhỏ để người học không đổi công lấy 1% — không đo chương trình thật.',
    workedCode:
      '# MO PHONG tran cai thien theo Amdahl\np, s = 0.9, 2.0\nprint("worth-it: Amdahl toi da x%.2f" % (1 / ((1 - p) + p / s)))',
    predictCode:
      'p, s = 0.02, 100.0\nprint("not-worth-it: Amdahl chan tran cai thien" if p < 0.05 else "tiep tuc: Amdahl cho phep")',
    predictChoices: [
      'not-worth-it: Amdahl chan tran cai thien',
      'tiep tuc: Amdahl cho phep',
      'invalid: p',
    ],
    predictAnswer: 0,
    predictExplain:
      'Phần tối ưu chỉ chiếm 2% thời gian, nên dù nhanh gấp 100 lần thì tổng cũng chỉ cải thiện chưa tới 2%.',
    makePrompt:
      'Đọc `p:<tỉ trọng 0..1>,speedup:<số>`. Thiếu trường → `invalid: field`; p ngoài [0,1] → `invalid: p`; speedup <= 0 → `invalid: speedup`; p < 0.05 → `not-worth-it: Amdahl chan tran cai thien`; còn lại in `worth-it: Amdahl toi da x<giá trị làm tròn 2 số>`. MÔ PHỎNG, không chạy chương trình thật.',
    testCases: [
      {
        stdinLines: ['p:0.9,speedup:2'],
        expected: 'worth-it: Amdahl toi da x1.82',
        hidden: false,
        label: 'phần nóng chiếm 90% thì tối ưu gấp đôi đáng làm',
      },
      {
        stdinLines: ['p:0.5,speedup:4'],
        expected: 'worth-it: Amdahl toi da x1.60',
        hidden: true,
        label: 'nửa thời gian, nhanh gấp bốn, tổng chỉ x1.6',
      },
      {
        stdinLines: ['p:0.02,speedup:100'],
        expected: 'not-worth-it: Amdahl chan tran cai thien',
        hidden: true,
        label: 'phần quá nhỏ thì tối ưu vô hạn cũng vô ích',
      },
      {
        stdinLines: ['p:1.5,speedup:2'],
        expected: 'invalid: p',
        hidden: true,
        label: 'ca âm — tỉ trọng ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"p", "speedup"}:\n        print("invalid: field")\n    else:\n        p = float(m["p"])\n        s = float(m["speedup"])\n        if p < 0 or p > 1: print("invalid: p")\n        elif s <= 0: print("invalid: speedup")\n        elif p < 0.05: print("not-worth-it: Amdahl chan tran cai thien")\n        else: print("worth-it: Amdahl toi da x%.2f" % (1 / ((1 - p) + p / s)))\nexcept (ValueError, KeyError):\n    print("invalid: input")',
    homework:
      'Ngoài sandbox, dựng flame graph thật cho một chương trình của bạn, đọc ra tỉ trọng của hàm nóng nhất, rồi tính trần Amdahl trước khi viết một dòng tối ưu nào.',
    cards: [
      {
        hoi: 'Định luật Amdahl phát biểu điều gì?',
        dap: 'Tăng tốc toàn chương trình bị chặn bởi phần KHÔNG tối ưu được: với tỉ trọng p tối ưu gấp s lần, tổng chỉ nhanh được 1/((1-p)+p/s) lần.',
      },
      {
        hoi: 'Vì sao phải đo trước khi tối ưu?',
        dap: 'Vì trần cải thiện phụ thuộc tỉ trọng thời gian thật; đoán sai chỗ nóng là đổ công vào phần chiếm vài phần trăm thời gian chạy.',
      },
    ],
  }),
]
