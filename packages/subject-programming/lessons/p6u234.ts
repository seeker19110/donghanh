// P6-U234 — systems-s3-m1: phần cứng quyết định tốc độ (cache line, false sharing).
// Hai bài tách theo hai nguyên nhân chậm KHÁC HẲN nhau: một bài do thứ tự truy cập của MỘT
// luồng, một bài do HAI luồng vô tình dùng chung một dòng cache. Gộp lại thì ca biên của
// nguyên nhân này che mất nguyên nhân kia.
import { systemsSimulation } from './systemsS3S4LessonFactory.js'

export const P6U234_LESSONS = [
  systemsSimulation({
    id: 'p6-u234-l1',
    unitId: 'p6-u234',
    title: 'bước nhảy truy cập và tỉ lệ trượt cache',
    hook: 'Hai vòng lặp cùng đếm đúng số phần tử, cùng độ phức tạp, nhưng một cái chậm hơn mười lần. Khác biệt không nằm ở số phép tính mà ở thứ tự chạm bộ nhớ.',
    theory:
      'Bộ nhớ không được nạp theo từng byte mà theo từng dòng cache (cache line). Bước nhảy (stride) lớn hơn kích thước dòng khiến mỗi lần đọc kéo về một dòng mới rồi chỉ dùng một phần, nên cache_miss_rate tăng vọt. Trace MÔ PHỎNG ở đây chỉ xét ba trường stride, line, pattern theo thứ tự tất định, không đo bộ đếm phần cứng.',
    workedCode:
      '# MO PHONG quan he stride va dong cache\nstride, line = 128, 64\nprint("slow: cache_miss_rate cao" if stride > line else "fast: truy cap tuan tu")',
    predictCode:
      'stride, line, pattern = 1, 64, "seq"\nprint("fast: truy cap tuan tu" if pattern == "seq" and stride <= line else "slow: cache_miss_rate cao")',
    predictChoices: [
      'fast: truy cap tuan tu',
      'slow: cache_miss_rate cao',
      'false-sharing: hai bien cung dong cache',
    ],
    predictAnswer: 0,
    predictExplain:
      'Bước nhảy 1 nhỏ hơn dòng cache 64 byte nên mỗi dòng nạp về được dùng hết trước khi sang dòng kế.',
    makePrompt:
      'Đọc fixture `stride:<số>,line:<số>,pattern:<seq|strided>`. Thiếu trường hoặc sai kiểu → `invalid: <trường>`; pattern strided và stride > line → `slow: cache_miss_rate cao`; pattern seq và stride <= line → `fast: truy cap tuan tu`; còn lại → `slow: cache_miss_rate trung binh`. MÔ PHỎNG, không đọc bộ đếm phần cứng thật.',
    testCases: [
      {
        stdinLines: ['stride:1,line:64,pattern:seq'],
        expected: 'fast: truy cap tuan tu',
        hidden: false,
        label: 'truy cập tuần tự dùng hết dòng cache',
      },
      {
        stdinLines: ['stride:128,line:64,pattern:strided'],
        expected: 'slow: cache_miss_rate cao',
        hidden: true,
        label: 'bước nhảy vượt dòng cache thì trượt nhiều',
      },
      {
        stdinLines: ['stride:8,line:64,pattern:strided'],
        expected: 'slow: cache_miss_rate trung binh',
        hidden: true,
        label: 'nhảy trong một dòng vẫn phí một phần dòng',
      },
      {
        stdinLines: ['stride:abc,line:64,pattern:seq'],
        expected: 'invalid: stride',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"stride", "line", "pattern"}: print("invalid: field")\n    elif not m["stride"].isdigit(): print("invalid: stride")\n    elif not m["line"].isdigit(): print("invalid: line")\n    elif m["pattern"] not in {"seq", "strided"}: print("invalid: pattern")\n    elif m["pattern"] == "strided" and int(m["stride"]) > int(m["line"]): print("slow: cache_miss_rate cao")\n    elif m["pattern"] == "seq" and int(m["stride"]) <= int(m["line"]): print("fast: truy cap tuan tu")\n    else: print("slow: cache_miss_rate trung binh")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, viết hai vòng lặp duyệt cùng một mảng lớn theo hàng và theo cột, đo bằng perf stat thật rồi so tỉ lệ trượt cache L1 với dự đoán của mô phỏng này.',
    cards: [
      {
        hoi: 'Vì sao bước nhảy lớn làm chậm dù số phép tính không đổi?',
        dap: 'Mỗi lần chạm bộ nhớ kéo về nguyên một dòng cache; bước nhảy lớn khiến phần lớn dữ liệu nạp về bị bỏ phí, băng thông bộ nhớ trở thành nút cổ chai.',
      },
      {
        hoi: 'cache_miss_rate nói lên điều gì?',
        dap: 'Tỉ lệ lần truy cập phải đi xuống tầng bộ nhớ chậm hơn; nó là dấu hiệu bố cục dữ liệu sai chứ không phải thuật toán sai.',
      },
    ],
  }),
  systemsSimulation({
    id: 'p6-u234-l2',
    unitId: 'p6-u234',
    title: 'false sharing — hai biến khác nhau, một dòng cache',
    hook: 'Hai luồng ghi hai biến hoàn toàn riêng biệt mà chương trình vẫn chậm đi khi thêm luồng. Không có khoá nào ở đây, nhưng phần cứng vẫn bắt chúng xếp hàng.',
    theory:
      'Giao thức nhất quán cache làm việc theo đơn vị dòng, không theo biến. Hai biến nằm cách nhau ít hơn một dòng cache thì mỗi lần một luồng ghi sẽ vô hiệu hoá dòng ở lõi kia, sinh ra false-sharing. Trace MÔ PHỎNG xét theo thứ tự: trường sai kiểu, số luồng, trùng địa chỉ, rồi khoảng cách offset — không chạy luồng thật.',
    workedCode:
      '# MO PHONG false sharing\noffset_a, offset_b, line = 0, 8, 64\nprint("false-sharing: hai bien cung dong cache" if abs(offset_a - offset_b) < line else "fast: hai dong cache rieng")',
    predictCode:
      'offset_a, offset_b, line, threads = 0, 128, 64, 2\nprint("fast: hai dong cache rieng" if abs(offset_a - offset_b) >= line else "false-sharing: hai bien cung dong cache")',
    predictChoices: [
      'fast: hai dong cache rieng',
      'false-sharing: hai bien cung dong cache',
      'deny: hai luong ghi cung bien',
    ],
    predictAnswer: 0,
    predictExplain:
      'Hai offset cách nhau 128 byte, lớn hơn một dòng 64 byte, nên hai biến nằm ở hai dòng cache khác nhau.',
    makePrompt:
      'Đọc `offsetA:<số>,offsetB:<số>,line:<số>,threads:<số>`. Thiếu trường hoặc sai kiểu → `invalid: <trường>`; threads < 2 → `fast: mot luong khong canh tranh`; hai offset bằng nhau → `deny: hai luong ghi cung bien`; khoảng cách < line → `false-sharing: hai bien cung dong cache`; còn lại → `fast: hai dong cache rieng`. MÔ PHỎNG, không tạo luồng thật.',
    testCases: [
      {
        stdinLines: ['offsetA:0,offsetB:128,line:64,threads:2'],
        expected: 'fast: hai dong cache rieng',
        hidden: false,
        label: 'đệm đủ xa thì hai lõi không giành dòng cache',
      },
      {
        stdinLines: ['offsetA:0,offsetB:8,line:64,threads:4'],
        expected: 'false-sharing: hai bien cung dong cache',
        hidden: true,
        label: 'hai biến sát nhau sinh false-sharing',
      },
      {
        stdinLines: ['offsetA:0,offsetB:0,line:64,threads:2'],
        expected: 'deny: hai luong ghi cung bien',
        hidden: true,
        label: 'ca âm — ghi chung một biến là tranh chấp thật, fail closed',
      },
      {
        stdinLines: ['offsetA:0,offsetB:8,line:x,threads:2'],
        expected: 'invalid: line',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"offsetA", "offsetB", "line", "threads"}: print("invalid: field")\n    elif not m["offsetA"].isdigit(): print("invalid: offsetA")\n    elif not m["offsetB"].isdigit(): print("invalid: offsetB")\n    elif not m["line"].isdigit(): print("invalid: line")\n    elif not m["threads"].isdigit(): print("invalid: threads")\n    elif int(m["threads"]) < 2: print("fast: mot luong khong canh tranh")\n    elif int(m["offsetA"]) == int(m["offsetB"]): print("deny: hai luong ghi cung bien")\n    elif abs(int(m["offsetA"]) - int(m["offsetB"])) < int(m["line"]): print("false-sharing: hai bien cung dong cache")\n    else: print("fast: hai dong cache rieng")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Ngoài sandbox, viết chương trình hai luồng cùng tăng hai bộ đếm cạnh nhau, đo thời gian, rồi chèn đệm cho mỗi bộ đếm chiếm trọn một dòng cache và đo lại.',
    cards: [
      {
        hoi: 'False sharing khác tranh chấp dữ liệu thật ở chỗ nào?',
        dap: 'Tranh chấp thật là hai luồng chạm cùng một biến nên kết quả có thể sai; false sharing cho kết quả đúng, chỉ chậm vì hai biến vô tình chung một dòng cache.',
      },
      {
        hoi: 'Cách sửa false sharing thông dụng nhất là gì?',
        dap: 'Đệm hoặc căn lề mỗi biến nóng lên biên một dòng cache để hai lõi không vô hiệu hoá dòng của nhau.',
      },
    ],
  }),
]
