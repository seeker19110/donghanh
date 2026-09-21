// lessons/p6u205.ts — P6-U205: HƯỚNG DỮ LIỆU, chặng S4 — module `data-s4-m4` (đạo đức và pháp lý).
//
// Bài 1: cổng xử lý dữ liệu cá nhân — không có cơ sở pháp lý và mục đích đã khai thì không xử lý,
// và đã khai mục đích nào thì không dùng sang mục đích khác. Bài 2: nén nhóm nhỏ dưới ngưỡng k và
// bắt buộc kèm câu giới hạn khi kết luận rút từ mẫu lệch.
//
// RANH GIỚI: toàn bộ fixture là TỔNG HỢP, chỉ gồm NHÃN PHÂN LOẠI (canhan/phicanhan, tên cơ sở
// pháp lý, tên mục đích) — không có và không được có giá trị dữ liệu cá nhân thật. Nội dung pháp
// luật ở đây chỉ ở mức khái niệm và KHÔNG THAY THẾ Ý KIẾN PHÁP LÝ.
//
// Đặc tả: `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U205_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u205-l1',
    unitId: 'p6-u205',
    language: 'python',
    title: 'MÔ PHỎNG cổng cơ sở pháp lý (legal basis) và giới hạn mục đích (purpose limitation)',
    hook: '"Thu thập trước, nghĩ sau" là câu rẻ nhất lúc thiết kế và đắt nhất lúc bị hỏi — kể cả khi không ai kiện.',
    theory:
      'Với dữ liệu cá nhân, hai câu hỏi phải trả lời TRƯỚC khi ghi dòng đầu tiên: dựa trên cơ sở pháp lý (legal basis) nào — sự đồng ý, hợp đồng hay nghĩa vụ luật định — và phục vụ mục đích đã khai nào. Giới hạn mục đích (purpose limitation) nói rằng dữ liệu thu cho mục đích A không được dùng lại cho mục đích B, dù về kỹ thuật nó nằm sẵn đó; đây là chỗ vi phạm hay xảy ra nhất vì nó không cần thêm thao tác nào cả. Simulator này chỉ xử lý NHÃN PHÂN LOẠI tổng hợp, không có giá trị dữ liệu cá nhân nào và không bao giờ in ra một giá trị như vậy. Nội dung pháp luật ở mức khái niệm, KHÔNG THAY THẾ Ý KIẾN PHÁP LÝ của người có chuyên môn.',
    workedExample: {
      code: `# MO PHONG cong xu ly; chi co NHAN phan loai tong hop, khong co gia tri ca nhan.\nloai, coso, mucdich = "canhan", "consent", "goi-y-bai-hoc"\nprint("deny: thieu co so phap ly hoac muc dich" if loai == "canhan" and (coso == "-" or mucdich == "-") else "allow: xu ly hop le")`,
      stdinLines: [],
    },
    predict: {
      code: `mucdich, mucdichdung = "goi-y-bai-hoc", "quang-cao"\nprint("deny: dung lai ngoai muc dich da khai" if mucdich != mucdichdung else "allow: xu ly hop le")`,
      question: 'Dữ liệu khai thu để gợi ý bài học, nay đem chạy quảng cáo. Cổng in gì?',
      choices: [
        'deny: dung lai ngoai muc dich da khai',
        'allow: xu ly hop le',
        'deny: thieu co so phap ly hoac muc dich',
        'suppress: nhom nho hon nguong k',
      ],
      answerIndex: 0,
      explain:
        'Cơ sở pháp lý được cấp cho một mục đích cụ thể, không phải cấp cho dữ liệu nói chung; đổi mục đích là một lần xử lý mới và phải xin lại cơ sở của chính nó.',
    },
    parsons: {
      prompt: 'Xếp cổng xử lý: kiểm cơ sở pháp lý và mục đích trước, rồi mới xét dùng lại.',
      lines: [
        'if loai == "canhan" and (coso == "-" or mucdich == "-"):',
        '    print("deny: thieu co so phap ly hoac muc dich")',
        'elif loai == "canhan" and mucdichdung != mucdich:',
        '    print("deny: dung lai ngoai muc dich da khai")',
        'else:',
        '    print("allow: xu ly hop le")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng cơ sở pháp lý (legal basis) và giới hạn mục đích (purpose limitation). Đọc `loai:<canhan|phicanhan>,coso:<consent|contract|nghiavu|->,mucdich:<nhãn|->,mucdichdung:<nhãn|->`. Thiếu/thừa trường → `invalid: field`; loai lạ → `invalid: loai`; coso lạ → `invalid: coso`. Sau đó: loai là `phicanhan` → `allow: khong phai du lieu ca nhan`; loai là `canhan` và (coso là `-` hoặc mucdich là `-`) → `deny: thieu co so phap ly hoac muc dich`; loai là `canhan` và mucdichdung khác mucdich → `deny: dung lai ngoai muc dich da khai`; còn lại → `allow: xu ly hop le`. Chỉ xử lý NHÃN phân loại, tuyệt đối không in giá trị dữ liệu cá nhân.',
      starterCode:
        '# MÔ PHỎNG trên nhãn phân loại tổng hợp; không chạm hệ ngoài, không dữ liệu cá nhân.\n',
      testCases: [
        {
          stdinLines: ['loai:canhan,coso:consent,mucdich:goi-y-bai-hoc,mucdichdung:goi-y-bai-hoc'],
          expected: 'allow: xu ly hop le',
          match: 'contains',
          hidden: false,
          label: 'có cơ sở pháp lý và dùng đúng mục đích đã khai',
        },
        {
          stdinLines: ['loai:canhan,coso:-,mucdich:goi-y-bai-hoc,mucdichdung:goi-y-bai-hoc'],
          expected: 'deny: thieu co so phap ly hoac muc dich',
          match: 'contains',
          hidden: true,
          label: 'không có cơ sở pháp lý thì không xử lý',
        },
        {
          stdinLines: ['loai:canhan,coso:consent,mucdich:goi-y-bai-hoc,mucdichdung:quang-cao'],
          expected: 'deny: dung lai ngoai muc dich da khai',
          match: 'contains',
          hidden: true,
          label: 'dùng lại ngoài mục đích là một lần xử lý mới',
        },
        {
          stdinLines: ['loai:phicanhan,coso:-,mucdich:-,mucdichdung:thong-ke'],
          expected: 'allow: khong phai du lieu ca nhan',
          match: 'contains',
          hidden: true,
          label: 'dữ liệu phi cá nhân không đi qua cổng này',
        },
        {
          stdinLines: [
            'loai:canhan,coso:cam-thay-on,mucdich:goi-y-bai-hoc,mucdichdung:goi-y-bai-hoc',
          ],
          expected: 'invalid: coso',
          match: 'contains',
          hidden: true,
          label: 'ca âm — cơ sở pháp lý bịa ra bị fail closed',
        },
      ],
      hints: [
        'Danh sách cơ sở pháp lý hợp lệ phải là hằng cố định — không được mở rộng theo input.',
        'Nhánh `phicanhan` đứng trước hai nhánh deny, nếu không dữ liệu không nhạy cảm sẽ bị chặn oan.',
        'Chỉ in nhãn và quyết định; không ghép giá trị nào từ input vào output ngoài các nhãn cố định.',
      ],
      sampleSolution: `try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"loai", "coso", "mucdich", "mucdichdung"}:
        print("invalid: field")
    elif m["loai"] not in {"canhan", "phicanhan"}:
        print("invalid: loai")
    elif m["coso"] not in {"consent", "contract", "nghiavu", "-"}:
        print("invalid: coso")
    elif m["loai"] == "phicanhan":
        print("allow: khong phai du lieu ca nhan")
    elif m["coso"] == "-" or m["mucdich"] == "-":
        print("deny: thieu co so phap ly hoac muc dich")
    elif m["mucdichdung"] != m["mucdich"]:
        print("deny: dung lai ngoai muc dich da khai")
    else:
        print("allow: xu ly hop le")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, chọn một bảng có dữ liệu cá nhân trong hệ của bạn và viết ra ba dòng: cơ sở pháp lý, mục đích đã khai, thời hạn lưu giữ. Nếu dòng nào bạn không trả lời được ngay, đó chính là việc cần làm tiếp — và hãy hỏi người có chuyên môn pháp lý, bài học này không thay thế ý kiến pháp lý.',
    srsCards: [
      {
        hoi: 'Vì sao dùng lại dữ liệu cho mục đích mới lại cần cơ sở pháp lý mới?',
        dap: 'Vì cơ sở pháp lý được cấp cho một mục đích cụ thể chứ không cho dữ liệu nói chung; đổi mục đích là một lần xử lý khác, và người cung cấp dữ liệu chưa từng đồng ý với lần đó.',
      },
      {
        hoi: 'Vì sao giới hạn mục đích là chỗ dễ vi phạm nhất?',
        dap: 'Vì vi phạm nó không cần thêm thao tác nào — dữ liệu đã nằm sẵn trong kho, chỉ cần một truy vấn mới là đã dùng sang việc khác.',
      },
    ],
  },
  {
    id: 'p6-u205-l2',
    unitId: 'p6-u205',
    language: 'python',
    title:
      'MÔ PHỎNG nén nhóm nhỏ theo ngưỡng k (k-anonymity) và chênh lệch sai số giữa nhóm (bias)',
    hook: 'Một ô có đúng hai người trong bảng thống kê công khai không còn là thống kê — nó là danh sách.',
    theory:
      'Ngưỡng k (k-anonymity) nói rằng mỗi ô công bố phải gộp ít nhất k cá thể; dưới ngưỡng thì phải nén ô đó (`suppress`), vì với nhóm quá nhỏ người đọc chỉ cần biết thêm một chi tiết là suy ngược ra được cá nhân. Song song đó là chênh lệch sai số giữa các nhóm (bias): một mô hình sai 3% ở nhóm đa số nhưng 20% ở nhóm thiểu số vẫn có thể khoe con số trung bình rất đẹp, nên phải đo theo nhóm chứ không chỉ đo tổng. Và kết luận rút từ mẫu lệch bắt buộc kèm câu giới hạn — con số không có ngữ cảnh sẽ tự đi xa khỏi ngữ cảnh. Fixture tổng hợp, chỉ gồm kích thước nhóm và tỉ lệ sai số; không có giá trị dữ liệu cá nhân nào. Nội dung pháp luật ở mức khái niệm, KHÔNG THAY THẾ Ý KIẾN PHÁP LÝ.',
    workedExample: {
      code: `# MO PHONG nguong k; chi co kich thuoc nhom, khong co gia tri ca nhan.\nco_nhom, k = 2, 10\nprint("suppress: nhom nho hon nguong k" if co_nhom < k else "allow: cong bo duoc")`,
      stdinLines: [],
    },
    predict: {
      code: `co_nhom, k, mau_lech = 50, 10, "yes"\nprint("unknown: mau lech, phai kem cau gioi han" if mau_lech == "yes" else "allow: cong bo duoc")`,
      question: 'Nhóm đủ lớn theo ngưỡng k, nhưng mẫu được biết là lệch. Cổng in gì?',
      choices: [
        'unknown: mau lech, phai kem cau gioi han',
        'allow: cong bo duoc',
        'suppress: nhom nho hon nguong k',
        'violated: chenh lech sai so giua cac nhom',
      ],
      answerIndex: 0,
      explain:
        'Đủ số lượng không có nghĩa là đại diện: mẫu lệch cho ra một con số hợp lệ về mặt tính toán nhưng không suy rộng được, nên nó phải đi kèm câu giới hạn chứ không được công bố trần.',
    },
    parsons: {
      prompt: 'Xếp cổng công bố: nén nhóm nhỏ trước, rồi mới tới mẫu lệch và chênh lệch sai số.',
      lines: [
        'if co_nhom < k:',
        '    print("suppress: nhom nho hon nguong k")',
        'elif mau_lech == "yes":',
        '    print("unknown: mau lech, phai kem cau gioi han")',
        'elif sailech > nguong_sailech:',
        '    print("violated: chenh lech sai so giua cac nhom")',
        'else:',
        '    print("allow: cong bo duoc")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng công bố thống kê theo ngưỡng k (k-anonymity) và chênh lệch sai số giữa các nhóm (bias). Đọc `conhom:<số>,k:<số>,sailech:<0..100>,nguongsailech:<0..100>,maulech:<yes|no>`. Thiếu/thừa trường → `invalid: field`; maulech lạ → `invalid: maulech`; trường số nào không phải số nguyên không âm hoặc phần trăm ngoài 0..100 → `invalid: <tên trường>`. Sau đó: conhom < k → `suppress: nhom nho hon nguong k`; maulech là `yes` → `unknown: mau lech, phai kem cau gioi han`; sailech > nguongsailech → `violated: chenh lech sai so giua cac nhom`; còn lại → `allow: cong bo duoc`. Chỉ nhận kích thước nhóm và tỉ lệ; tuyệt đối không in giá trị dữ liệu cá nhân.',
      starterCode:
        '# MÔ PHỎNG trên số liệu tổng hợp; không chạm hệ ngoài, không dữ liệu cá nhân.\n',
      testCases: [
        {
          stdinLines: ['conhom:120,k:10,sailech:4,nguongsailech:10,maulech:no'],
          expected: 'allow: cong bo duoc',
          match: 'contains',
          hidden: false,
          label: 'nhóm đủ lớn, mẫu không lệch, sai số trong ngưỡng',
        },
        {
          stdinLines: ['conhom:2,k:10,sailech:4,nguongsailech:10,maulech:no'],
          expected: 'suppress: nhom nho hon nguong k',
          match: 'contains',
          hidden: true,
          label: 'ô hai người bị nén, không công bố số',
        },
        {
          stdinLines: ['conhom:120,k:10,sailech:4,nguongsailech:10,maulech:yes'],
          expected: 'unknown: mau lech, phai kem cau gioi han',
          match: 'contains',
          hidden: true,
          label: 'mẫu lệch phải kèm câu giới hạn',
        },
        {
          stdinLines: ['conhom:120,k:10,sailech:25,nguongsailech:10,maulech:no'],
          expected: 'violated: chenh lech sai so giua cac nhom',
          match: 'contains',
          hidden: true,
          label: 'sai số lệch giữa các nhóm vượt ngưỡng',
        },
        {
          stdinLines: ['conhom:120,k:10,sailech:250,nguongsailech:10,maulech:no'],
          expected: 'invalid: sailech',
          match: 'contains',
          hidden: true,
          label: 'ca âm — phần trăm ngoài miền fail closed',
        },
      ],
      hints: [
        'Ngưỡng k phải được kiểm TRƯỚC mọi nhánh khác — nhóm nhỏ thì không có kết luận nào đáng công bố.',
        'Hai trường phần trăm cần kiểm cả kiểu lẫn miền 0..100.',
        'Output chỉ gồm quyết định và lý do cố định; không ghép bất cứ giá trị nào từ input vào đó.',
      ],
      sampleSolution: `def so(x):
    return int(x) if x.isdigit() else None


def phan_tram(x):
    n = so(x)
    return n if n is not None and 0 <= n <= 100 else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"conhom", "k", "sailech", "nguongsailech", "maulech"}:
        print("invalid: field")
    elif m["maulech"] not in {"yes", "no"}:
        print("invalid: maulech")
    elif so(m["conhom"]) is None:
        print("invalid: conhom")
    elif so(m["k"]) is None:
        print("invalid: k")
    elif phan_tram(m["sailech"]) is None:
        print("invalid: sailech")
    elif phan_tram(m["nguongsailech"]) is None:
        print("invalid: nguongsailech")
    elif so(m["conhom"]) < so(m["k"]):
        print("suppress: nhom nho hon nguong k")
    elif m["maulech"] == "yes":
        print("unknown: mau lech, phai kem cau gioi han")
    elif phan_tram(m["sailech"]) > phan_tram(m["nguongsailech"]):
        print("violated: chenh lech sai so giua cac nhom")
    else:
        print("allow: cong bo duoc")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy một bảng thống kê công khai của tổ chức bạn và đếm xem có ô nào gộp dưới mười cá thể không; sau đó chọn một mô hình đang chạy và đo lại sai số của nó TÁCH THEO NHÓM thay vì chỉ xem con số trung bình.',
    srsCards: [
      {
        hoi: 'Vì sao ô thống kê dưới ngưỡng k phải bị nén thay vì làm tròn?',
        dap: 'Làm tròn vẫn để lại thông tin về nhóm nhỏ và có thể ghép với nguồn khác để suy ngược ra cá nhân; nén là cách duy nhất không phát ra tín hiệu nào.',
      },
      {
        hoi: 'Vì sao phải đo sai số tách theo nhóm chứ không chỉ đo tổng?',
        dap: 'Con số trung bình bị nhóm đa số kéo đi; một mô hình sai rất nhiều ở nhóm thiểu số vẫn có thể trông rất tốt trên tổng, và chính nhóm đó là nhóm chịu thiệt.',
      },
    ],
  },
]
