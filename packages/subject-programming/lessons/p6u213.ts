// lessons/p6u213.ts — P6-U213: HƯỚNG BẢO MẬT, chặng S3 — module `security-s3-m4` (bảo mật hệ
// thống hiện đại: chuỗi cung ứng phần mềm, IAM cloud, bảo mật AI).
//
// Ba nhóm rủi ro, cùng một tư thế phòng thủ: nguồn nào không xác thực được thì fail closed.
// Bài 1: chuỗi cung ứng (xuất xứ, chữ ký, lệ thuộc chuyển tiếp) và IAM (đặc quyền tối thiểu,
// ranh giới tài khoản). Bài 2: bảo mật AI — nội dung lấy về LUÔN là dữ liệu, không phải lệnh.
//
// Đặc tả: `docs/specs/2026-09-17-security-s3-bai-hoc-that.md`.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U213_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u213-l1',
    unitId: 'p6-u213',
    language: 'python',
    title: 'MÔ PHỎNG cổng chuỗi cung ứng theo xuất xứ (provenance) và cổng IAM least privilege',
    hook: 'Bạn đọc kỹ từng dòng code mình viết, rồi cài một gói phụ thuộc kéo theo hai trăm gói khác mà không ai đọc dòng nào.',
    theory:
      'Chuỗi cung ứng phần mềm hỏng ở chỗ ít ai nhìn: không phải mã của bạn, mà mã bạn kéo về. Hai câu hỏi tối thiểu cho mỗi phụ thuộc là xuất xứ (provenance — dựng ra từ nguồn nào, bằng quy trình nào) và chữ ký (ai bảo đảm bản này chính là bản đó). Thiếu một trong hai thì fail closed, vì "chắc là ổn" ở đây nghĩa là chạy mã của người lạ với toàn quyền của bạn. Lệ thuộc chuyển tiếp không khai báo thì chưa chặn hẳn nhưng phải cách ly chờ khai — đó là phần lớn nhất của cây phụ thuộc và là phần không ai chọn một cách có ý thức.\nVế IAM cloud đi theo cùng một logic: đặc quyền tối thiểu (least privilege) nghĩa là vai trò chỉ được đúng phạm vi cần, nên vai trò khai bằng ký tự đại diện là vai trò không ai biết nó làm được gì; còn ranh giới tài khoản bị xuyên qua thì sự cố ở một môi trường lan thẳng sang môi trường khác. Mục đích phòng thủ: dựng cổng ở chỗ rủi ro thật sự đi vào. MÔ PHỎNG trên bản ghi tổng hợp, không dò quét, không chạm hệ thống nào.',
    workedExample: {
      code: `# MO PHONG cong chuoi cung ung; ban ghi tong hop, khong tai goi that.\nxuatxu, chuky = "co", "khong"\nprint("deny: phu thuoc thieu xuat xu hoac chu ky" if xuatxu == "khong" or chuky == "khong" else "ok: phu thuoc dat nguong")`,
      stdinLines: [],
    },
    predict: {
      code: `pham = "kytudaidien"\nprint("deny: vai tro ky tu dai dien" if pham == "kytudaidien" else "ok: vai tro least privilege")`,
      question: 'Một vai trò IAM khai quyền bằng ký tự đại diện cho tiện. Cổng MÔ PHỎNG in gì?',
      choices: [
        'deny: vai tro ky tu dai dien',
        'ok: vai tro least privilege',
        'quarantine: le thuoc chuyen tiep chua khai',
        'deny: xuyen qua ranh gioi tai khoan',
      ],
      answerIndex: 0,
      explain:
        'Ký tự đại diện làm phạm vi quyền trở thành không đọc được: không ai — kể cả người viết nó — nói được vai trò này làm được những gì, nên không thể rà và cũng không thể thu hẹp.',
    },
    parsons: {
      prompt:
        'Xếp cổng chuỗi cung ứng: chặn thiếu xuất xứ/chữ ký trước, rồi cách ly lệ thuộc chưa khai.',
      lines: [
        'if xuatxu == "khong" or chuky == "khong":',
        '    print("deny: phu thuoc thieu xuat xu hoac chu ky")',
        'elif chuyentiep == "chuakhai":',
        '    print("quarantine: le thuoc chuyen tiep chua khai")',
        'else:',
        '    print("ok: phu thuoc dat nguong")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng chuỗi cung ứng và cổng IAM. Đọc `loai:<phuthuoc|vaitro>,xuatxu:<co|khong>,chuky:<co|khong>,chuyentiep:<khai|chuakhai>,pham:<cuthe|kytudaidien>,ranhgioi:<giu|xuyenqua>`. Thiếu/thừa trường → `invalid: field`; giá trị lạ ở trường nào → `invalid: <tên trường>`. Với `phuthuoc`: thiếu xuất xứ (provenance) hoặc chữ ký → `deny: phu thuoc thieu xuat xu hoac chu ky`; lệ thuộc chuyển tiếp chưa khai → `quarantine: le thuoc chuyen tiep chua khai`; còn lại → `ok: phu thuoc dat nguong`. Với `vaitro`: phạm vi là ký tự đại diện → `deny: vai tro ky tu dai dien`; ranh giới tài khoản bị xuyên qua → `deny: xuyen qua ranh gioi tai khoan`; còn lại → `ok: vai tro least privilege`. Không tải gói thật, không gọi mạng, không dò quét hệ thống nào.',
      starterCode: '# MÔ PHỎNG cổng chuỗi cung ứng và IAM; chỉ tính trên dòng nhập.\n',
      testCases: [
        {
          stdinLines: ['loai:phuthuoc,xuatxu:co,chuky:co,chuyentiep:khai,pham:cuthe,ranhgioi:giu'],
          expected: 'ok: phu thuoc dat nguong',
          match: 'contains',
          hidden: false,
          label: 'đủ xuất xứ, chữ ký và cây phụ thuộc đã khai',
        },
        {
          stdinLines: [
            'loai:phuthuoc,xuatxu:co,chuky:khong,chuyentiep:khai,pham:cuthe,ranhgioi:giu',
          ],
          expected: 'deny: phu thuoc thieu xuat xu hoac chu ky',
          match: 'contains',
          hidden: true,
          label: 'thiếu chữ ký là fail closed',
        },
        {
          stdinLines: [
            'loai:phuthuoc,xuatxu:co,chuky:co,chuyentiep:chuakhai,pham:cuthe,ranhgioi:giu',
          ],
          expected: 'quarantine: le thuoc chuyen tiep chua khai',
          match: 'contains',
          hidden: true,
          label: 'lệ thuộc chuyển tiếp chưa khai thì cách ly chờ khai',
        },
        {
          stdinLines: [
            'loai:vaitro,xuatxu:co,chuky:co,chuyentiep:khai,pham:kytudaidien,ranhgioi:giu',
          ],
          expected: 'deny: vai tro ky tu dai dien',
          match: 'contains',
          hidden: true,
          label: 'vai trò ký tự đại diện không đọc được phạm vi',
        },
        {
          stdinLines: [
            'loai:vaitro,xuatxu:co,chuky:co,chuyentiep:khai,pham:cuthe,ranhgioi:xuyenqua',
          ],
          expected: 'deny: xuyen qua ranh gioi tai khoan',
          match: 'contains',
          hidden: true,
          label: 'xuyên ranh giới tài khoản làm sự cố lan sang môi trường khác',
        },
        {
          stdinLines: ['loai:thu-vien,xuatxu:co,chuky:co,chuyentiep:khai,pham:cuthe,ranhgioi:giu'],
          expected: 'invalid: loai',
          match: 'contains',
          hidden: true,
          label: 'ca âm — loại bản ghi lạ fail closed',
        },
      ],
      hints: [
        'Kiểm đủ sáu khoá và tập giá trị cho phép trước khi rẽ nhánh theo loai.',
        'Deny và quarantine là hai mức khác nhau: một cái chặn hẳn, một cái giữ lại chờ bổ sung thông tin.',
        'Không gọi mạng, không tải gói, không dò quét — bài chỉ tính trên bản ghi tổng hợp.',
      ],
      sampleSolution: `MUC = {
    "loai": {"phuthuoc", "vaitro"},
    "xuatxu": {"co", "khong"},
    "chuky": {"co", "khong"},
    "chuyentiep": {"khai", "chuakhai"},
    "pham": {"cuthe", "kytudaidien"},
    "ranhgioi": {"giu", "xuyenqua"},
}
THU_TU = ("loai", "xuatxu", "chuky", "chuyentiep", "pham", "ranhgioi")

try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(MUC):
        print("invalid: field")
    else:
        xau = [k for k in THU_TU if m[k] not in MUC[k]]
        if xau:
            print("invalid: " + xau[0])
        elif m["loai"] == "phuthuoc":
            if m["xuatxu"] == "khong" or m["chuky"] == "khong":
                print("deny: phu thuoc thieu xuat xu hoac chu ky")
            elif m["chuyentiep"] == "chuakhai":
                print("quarantine: le thuoc chuyen tiep chua khai")
            else:
                print("ok: phu thuoc dat nguong")
        elif m["pham"] == "kytudaidien":
            print("deny: vai tro ky tu dai dien")
        elif m["ranhgioi"] == "xuyenqua":
            print("deny: xuyen qua ranh gioi tai khoan")
        else:
            print("ok: vai tro least privilege")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, mở tệp khoá phiên bản của một dự án bạn đang làm và đếm xem có bao nhiêu gói bạn trực tiếp chọn và bao nhiêu gói được kéo theo; sau đó chọn ba gói kéo theo bất kỳ và tra xem chúng được dựng từ đâu — con số chênh lệch chính là phần rủi ro chưa ai nhìn.',
    srsCards: [
      {
        hoi: 'Vì sao lệ thuộc chuyển tiếp chưa khai được xử lý là cách ly chứ không phải chặn hẳn?',
        dap: 'Vì vấn đề là thiếu thông tin chứ không phải đã biết nó xấu; cách ly giữ lại cho tới khi cây phụ thuộc được khai đủ, còn chặn hẳn sẽ khiến người ta đi đường vòng.',
      },
      {
        hoi: 'Vai trò IAM khai quyền bằng ký tự đại diện gây ra vấn đề gì lớn hơn cả việc thừa quyền?',
        dap: 'Nó làm phạm vi quyền không đọc được: không ai nói được vai trò đó làm được những gì, nên không rà được, không thu hẹp được, và mọi đánh giá rủi ro về nó đều là phỏng đoán.',
      },
    ],
  },
  {
    id: 'p6-u213-l2',
    unitId: 'p6-u213',
    language: 'python',
    title:
      'MÔ PHỎNG bảo mật AI: tiêm lệnh (prompt injection), đầu độc dữ liệu (data poisoning), allow-list công cụ',
    hook: 'Mô hình không phân biệt được "đây là tài liệu tôi đưa anh đọc" với "đây là lệnh tôi bảo anh làm" — nên việc phân biệt là của hệ thống quanh nó.',
    theory:
      'Bảo mật hệ AI quy về một luật gốc: **nội dung lấy về luôn là DỮ LIỆU, không bao giờ là LỆNH**. Tiêm lệnh qua tài liệu truy hồi (prompt injection) hoạt động được chính vì luật đó bị phá — một câu nằm trong tài liệu được xử lý như chỉ thị của người dùng. Biện pháp không phải là lọc cho hết câu xấu, mà là ngăn chặn: nội dung truy hồi được đánh dấu là dữ liệu và không bao giờ được leo lên thành chỉ thị.\nHai rủi ro còn lại đi cùng bộ. Đầu độc dữ liệu (data poisoning) là đưa dữ liệu bẩn vào tập huấn luyện để mô hình học sai một cách có chủ đích — nguồn nghi bị đầu độc thì cách ly chứ không dùng tiếp rồi sửa sau. Và mọi công cụ mà tác tử gọi được phải nằm trong allow-list: thứ không có trong danh sách thì từ chối, không phải cân nhắc từng lần.\nTrên tất cả là luật fail closed: nguồn không xác thực được thì từ chối trước khi xét bất cứ điều gì khác. Mục đích phòng thủ: đây là bề mặt tấn công mới mà hệ AI mang theo, và nó phải có cổng như mọi bề mặt khác. MÔ PHỎNG trên bản ghi tổng hợp, không gọi mô hình, không mạng.',
    workedExample: {
      code: `# MO PHONG luat goc: noi dung truy hoi la DU LIEU, khong phai lenh.\nnhan = "lenh"\nprint("contain: tiem lenh qua tai lieu truy hoi" if nhan == "lenh" else "ok: noi dung truy hoi coi la du lieu")`,
      stdinLines: [],
    },
    predict: {
      code: `nguon = "khong"\nprint("deny: nguon khong xac thuc duoc" if nguon != "xacthuc" else "ok: nguon dat nguong")`,
      question: 'Một tài liệu đến từ nguồn không xác thực được danh tính. Cổng MÔ PHỎNG in gì?',
      choices: [
        'deny: nguon khong xac thuc duoc',
        'ok: nguon dat nguong',
        'contain: tiem lenh qua tai lieu truy hoi',
        'quarantine: nguon nghi bi dau doc du lieu',
      ],
      answerIndex: 0,
      explain:
        'Fail closed: không xác thực được nguồn thì mọi phân tích phía sau đều đứng trên giả định không kiểm được, nên cổng từ chối trước khi xét nội dung.',
    },
    parsons: {
      prompt: 'Xếp cổng bảo mật AI: fail closed theo nguồn trước, rồi mới xét theo loại yêu cầu.',
      lines: [
        'if nguon != "xacthuc":',
        '    print("deny: nguon khong xac thuc duoc")',
        'elif loai == "congcu" and congcu != "trong-allowlist":',
        '    print("deny: cong cu ngoai allow-list")',
        'elif loai == "truyhoi" and nhan == "lenh":',
        '    print("contain: tiem lenh qua tai lieu truy hoi")',
        'elif loai == "huanluyen" and nhan == "nghi-doc":',
        '    print("quarantine: nguon nghi bi dau doc du lieu")',
        'else:',
        '    print("ok: xu ly nhu du lieu binh thuong")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng bảo mật AI. Đọc `loai:<truyhoi|huanluyen|congcu>,nguon:<xacthuc|khong>,nhan:<dulieu|lenh|nghi-doc>,congcu:<trong-allowlist|ngoai|->`. Thiếu/thừa trường → `invalid: field`; giá trị lạ ở trường nào → `invalid: <tên trường>`. Thứ tự quyết định: nguồn không xác thực được → `deny: nguon khong xac thuc duoc` (fail closed, xét trước mọi thứ khác); `congcu` mà công cụ không nằm trong allow-list → `deny: cong cu ngoai allow-list`; `truyhoi` mà nhãn là `lenh` → `contain: tiem lenh qua tai lieu truy hoi` (prompt injection: nội dung lấy về là dữ liệu, không phải lệnh); `huanluyen` mà nhãn là `nghi-doc` → `quarantine: nguon nghi bi dau doc du lieu` (data poisoning); còn lại → `ok: xu ly nhu du lieu binh thuong`. Không gọi mô hình, không gọi mạng.',
      starterCode: '# MÔ PHỎNG cổng bảo mật AI; chỉ tính trên dòng nhập, không gọi mô hình.\n',
      testCases: [
        {
          stdinLines: ['loai:truyhoi,nguon:xacthuc,nhan:dulieu,congcu:-'],
          expected: 'ok: xu ly nhu du lieu binh thuong',
          match: 'contains',
          hidden: false,
          label: 'tài liệu truy hồi được xử lý đúng vai trò dữ liệu',
        },
        {
          stdinLines: ['loai:truyhoi,nguon:xacthuc,nhan:lenh,congcu:-'],
          expected: 'contain: tiem lenh qua tai lieu truy hoi',
          match: 'contains',
          hidden: true,
          label: 'câu trong tài liệu đòi leo lên thành chỉ thị thì bị ngăn chặn',
        },
        {
          stdinLines: ['loai:huanluyen,nguon:xacthuc,nhan:nghi-doc,congcu:-'],
          expected: 'quarantine: nguon nghi bi dau doc du lieu',
          match: 'contains',
          hidden: true,
          label: 'nguồn nghi bị đầu độc thì cách ly, không dùng rồi sửa sau',
        },
        {
          stdinLines: ['loai:congcu,nguon:xacthuc,nhan:dulieu,congcu:ngoai'],
          expected: 'deny: cong cu ngoai allow-list',
          match: 'contains',
          hidden: true,
          label: 'công cụ ngoài danh sách cho phép bị từ chối thẳng',
        },
        {
          stdinLines: ['loai:truyhoi,nguon:khong,nhan:lenh,congcu:-'],
          expected: 'deny: nguon khong xac thuc duoc',
          match: 'contains',
          hidden: true,
          label: 'nguồn không xác thực được bị chặn TRƯỚC khi xét nội dung',
        },
        {
          stdinLines: ['loai:truyhoi,nguon:xacthuc,nhan:goi-y,congcu:-'],
          expected: 'invalid: nhan',
          match: 'contains',
          hidden: true,
          label: 'ca âm — nhãn nội dung lạ fail closed',
        },
      ],
      hints: [
        'Kiểm đủ bốn khoá và tập giá trị cho phép trước khi rẽ nhánh.',
        'Nhánh nguồn phải nằm TRƯỚC mọi nhánh khác, nếu không một nguồn không tin được vẫn lọt tới phần xét nội dung.',
        'Ba loại yêu cầu cho ba quyết định khác nhau: deny, contain và quarantine không thay nhau được.',
      ],
      sampleSolution: `MUC = {
    "loai": {"truyhoi", "huanluyen", "congcu"},
    "nguon": {"xacthuc", "khong"},
    "nhan": {"dulieu", "lenh", "nghi-doc"},
    "congcu": {"trong-allowlist", "ngoai", "-"},
}
THU_TU = ("loai", "nguon", "nhan", "congcu")

try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(MUC):
        print("invalid: field")
    else:
        xau = [k for k in THU_TU if m[k] not in MUC[k]]
        if xau:
            print("invalid: " + xau[0])
        elif m["nguon"] != "xacthuc":
            print("deny: nguon khong xac thuc duoc")
        elif m["loai"] == "congcu" and m["congcu"] != "trong-allowlist":
            print("deny: cong cu ngoai allow-list")
        elif m["loai"] == "truyhoi" and m["nhan"] == "lenh":
            print("contain: tiem lenh qua tai lieu truy hoi")
        elif m["loai"] == "huanluyen" and m["nhan"] == "nghi-doc":
            print("quarantine: nguon nghi bi dau doc du lieu")
        else:
            print("ok: xu ly nhu du lieu binh thuong")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, lấy một tính năng AI đang chạy (hoặc đang thiết kế) trong sản phẩm của bạn và vẽ ba mũi tên: nội dung lấy về từ đâu, tập huấn luyện lấy từ đâu, và tác tử gọi được những công cụ nào; với mỗi mũi tên, viết một dòng "nếu nguồn này bị chiếm thì chuyện gì xảy ra" — đó là mô hình đe doạ tối thiểu của một hệ AI.',
    srsCards: [
      {
        hoi: 'Luật gốc của bảo mật AI về nội dung lấy về được phát biểu thế nào?',
        dap: 'Nội dung lấy về luôn là dữ liệu, không bao giờ là lệnh: nó được đọc và trích dẫn, nhưng không bao giờ được leo lên thành chỉ thị cho hệ thống làm theo.',
      },
      {
        hoi: 'Vì sao lọc câu xấu không phải biện pháp đủ cho tiêm lệnh qua tài liệu?',
        dap: 'Vì cùng một ý có vô hạn cách diễn đạt nên bộ lọc luôn thua về số lượng; cái sửa được là vai trò của nội dung trong hệ thống, không phải hình dạng câu chữ của nó.',
      },
    ],
  },
]
