// lessons/p6u251.ts — P6-U251: HƯỚNG GAME, chặng S3 — module `game-s3-m2` (shader: biến đồng
// nhất và kết cấu, chiếu sáng, hậu xử lý — ở đây học NGÂN SÁCH và LOẠI BIẾN, không viết GLSL thật).
//
// Bài 1 lo CHI PHÍ: mỗi "shader" là một hàm khai báo chi phí mili-giây theo số điểm ảnh/đỉnh xử
// lý; vượt ngân sách riêng là `exceed`, tổng nhiều shader vượt phần ngân sách khung hình còn lại
// sau CPU là `deny`. Bài 2 lo LOẠI BIẾN: biến "đồng nhất" (uniform) là một giá trị cho cả lệnh
// vẽ, gán nó theo từng đỉnh là nhầm loại biến — `invalid`.
//
// Đặc tả: `docs/specs/2026-09-21-game-s1-s4-bai-hoc-that.md`.
// MÔ PHỎNG Python tất định: KHÔNG GLSL/HLSL thật, không GPU, không biên dịch shader, không pixel.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U251_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u251-l1',
    unitId: 'p6-u251',
    language: 'python',
    title: 'MÔ PHỎNG ngân sách shader: một hiệu ứng đẹp vẫn có thể là một hiệu ứng không dùng được',
    hook: 'Hiệu ứng nước của bạn tốn 9 mili-giây trên máy mục tiêu — nghĩa là hơn nửa ngân sách khung hình chỉ để làm mặt hồ gợn sóng.',
    theory:
      'Shader chạy cho RẤT NHIỀU điểm ảnh, nên một phép tính thêm trong shader điểm ảnh không tốn một lần mà tốn hàng triệu lần. Vì vậy mọi hiệu ứng phải đi kèm một con số ngân sách: hiệu ứng này được phép tốn bao nhiêu mili-giây trên máy mục tiêu. Một shader vượt ngân sách RIÊNG của nó là `exceed` — nó phải bị đơn giản hoá, chứ không phải chờ tới lúc ghép cảnh mới biết. Tổng nhiều shader vượt phần ngân sách khung hình CÒN LẠI sau khi CPU đã lấy phần của mình là `deny` cho cả cảnh: ba hiệu ứng đều "trong ngân sách riêng" vẫn có thể giết khung hình khi cộng vào nhau. Ở đây các con số là KHAI BÁO trước, không phải đo thật: đây là MÔ PHỎNG Python hữu hạn, không GLSL/HLSL thật, không GPU, không profiler thật.',
    workedExample: {
      code: `# MO PHONG ngan sach shader; moi so la mili-giay KHAI BAO, khong do that.\nchi_phi, ngan_sach_rieng = 4, 6\nprint("allow: trong ngan sach rieng" if chi_phi <= ngan_sach_rieng else "exceed: vuot ngan sach rieng")`,
      stdinLines: [],
    },
    predict: {
      code: `tong, ngan_sach_khung, cpu = 9, 16, 8\nprint("deny: tong shader vuot ngan sach khung con lai" if tong > ngan_sach_khung - cpu else "allow: ca canh trong ngan sach")`,
      question:
        'CPU đã lấy 8ms trong ngân sách khung hình 16ms, tổng shader khai báo 9ms. MÔ PHỎNG in gì?',
      choices: [
        'deny: tong shader vuot ngan sach khung con lai',
        'allow: ca canh trong ngan sach',
        'exceed: vuot ngan sach rieng',
        'invalid: ngan sach',
      ],
      answerIndex: 0,
      explain:
        'Phần còn lại cho GPU chỉ là 16 − 8 = 8ms, mà shader đòi 9ms. Từng hiệu ứng có thể vẫn nằm trong ngân sách riêng của nó — cái vỡ ở đây là TỔNG, và đó là lý do ngân sách phải cộng lại chứ không chỉ xét từng cái.',
    },
    parsons: {
      prompt: 'Xếp cổng ngân sách shader: kiểm ngân sách riêng trước, rồi mới cộng cho cả khung.',
      lines: [
        'if ngan_sach_rieng <= 0 or ngan_sach_khung <= 0:',
        '    print("invalid: ngan sach")',
        'elif chi_phi > ngan_sach_rieng:',
        '    print("exceed: vuot ngan sach rieng")',
        'elif tong > ngan_sach_khung - cpu:',
        '    print("deny: tong shader vuot ngan sach khung con lai")',
        'else:',
        '    print("allow: ca canh trong ngan sach")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng ngân sách shader. Đọc `chi_phi:<ms>,rieng:<ms>,tong:<ms>,khung:<ms>,cpu:<ms>`. Thiếu/thừa trường → `invalid: field`; trường không phải số nguyên không âm → `invalid: so`; rieng ≤ 0 hoặc khung ≤ 0 → `invalid: ngan sach`; cpu ≥ khung → `deny: cpu da an het ngan sach khung`; chi_phi > rieng → `exceed: vuot ngan sach rieng`; tong > khung − cpu → `deny: tong shader vuot ngan sach khung con lai`; còn lại → `allow: ca canh trong ngan sach`. Mọi con số là KHAI BÁO, không đo thật; không GPU, không biên dịch shader.',
      starterCode:
        '# MÔ PHỎNG ngân sách shader; mili-giây là tham số khai báo, KHÔNG phải số đo thật.\n',
      testCases: [
        {
          stdinLines: ['chi_phi:4,rieng:6,tong:7,khung:16,cpu:8'],
          expected: 'allow: ca canh trong ngan sach',
          match: 'contains',
          hidden: false,
          label: 'trong ngân sách riêng và tổng vẫn vừa phần GPU còn lại',
        },
        {
          stdinLines: ['chi_phi:9,rieng:6,tong:9,khung:16,cpu:8'],
          expected: 'exceed: vuot ngan sach rieng',
          match: 'contains',
          hidden: true,
          label: 'một hiệu ứng vượt ngân sách riêng phải sửa ngay, không chờ ghép cảnh',
        },
        {
          stdinLines: ['chi_phi:4,rieng:6,tong:9,khung:16,cpu:8'],
          expected: 'deny: tong shader vuot ngan sach khung con lai',
          match: 'contains',
          hidden: true,
          label: 'từng cái vừa nhưng cộng lại thì vỡ khung hình',
        },
        {
          stdinLines: ['chi_phi:4,rieng:6,tong:7,khung:16,cpu:16'],
          expected: 'deny: cpu da an het ngan sach khung',
          match: 'contains',
          hidden: true,
          label: 'CPU ăn hết ngân sách thì GPU không còn chỗ, nói rõ bên nào vượt',
        },
        {
          stdinLines: ['chi_phi:4,rieng:0,tong:7,khung:16,cpu:8'],
          expected: 'invalid: ngan sach',
          match: 'contains',
          hidden: true,
          label: 'ca âm — ngân sách không dương là lỗi cấu hình, fail closed',
        },
      ],
      hints: [
        'Ngân sách còn lại cho GPU là `khung - cpu` — tính một lần rồi dùng, đừng rải phép trừ.',
        'Kiểm CPU đã ăn hết ngân sách TRƯỚC khi so tổng shader, để lời báo chỉ đúng bên vượt.',
        'Không dùng file, socket, subprocess, thư viện đồ hoạ hay thời gian thực.',
      ],
      sampleSolution: `KHOA = ("chi_phi", "rieng", "tong", "khung", "cpu")


def so(x):
    return int(x) if x.isdigit() else None


try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != set(KHOA):
        print("invalid: field")
    elif any(so(m[k]) is None for k in KHOA):
        print("invalid: so")
    else:
        v = {k: so(m[k]) for k in KHOA}
        if v["rieng"] <= 0 or v["khung"] <= 0:
            print("invalid: ngan sach")
        elif v["cpu"] >= v["khung"]:
            print("deny: cpu da an het ngan sach khung")
        elif v["chi_phi"] > v["rieng"]:
            print("exceed: vuot ngan sach rieng")
        elif v["tong"] > v["khung"] - v["cpu"]:
            print("deny: tong shader vuot ngan sach khung con lai")
        else:
            print("allow: ca canh trong ngan sach")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, viết một shader thật trong Godot hoặc Unity (một hiệu ứng hoà tan hoặc gợn nước), rồi dùng công cụ đo của chính engine đó trên máy mục tiêu để lấy con số mili-giây thật của nó. Ghi lại: ngân sách bạn ĐẶT trước khi viết, con số ĐO được sau khi viết, và bạn đã cắt gì để hai con số gặp nhau.',
    srsCards: [
      {
        hoi: 'Vì sao một phép tính thêm trong shader điểm ảnh đắt hơn nhiều so với trong mã game thường?',
        dap: 'Mã game chạy một lần mỗi khung hình, còn shader điểm ảnh chạy một lần cho MỖI điểm ảnh nó phủ — hàng triệu lần mỗi khung, nên chi phí nhân lên theo độ phân giải và theo diện tích hiệu ứng.',
      },
      {
        hoi: 'Vì sao phải kiểm cả ngân sách riêng của từng shader lẫn tổng ngân sách khung hình?',
        dap: 'Ngân sách riêng bắt lỗi sớm, ngay khi viết hiệu ứng; ngân sách tổng bắt loại lỗi mà từng hiệu ứng đều "đạt" nhưng cộng lại thì vượt phần GPU còn lại sau CPU.',
      },
    ],
  },
  {
    id: 'p6-u251-l2',
    unitId: 'p6-u251',
    language: 'python',
    title: 'MÔ PHỎNG loại biến trong shader: biến đồng nhất không gán được theo từng đỉnh',
    hook: 'Gán màu "một giá trị cho cả lệnh vẽ" theo từng đỉnh là lỗi im lặng nhất của shader: không ai báo, chỉ có hình sai.',
    theory:
      'Shader có nhiều loại biến và nhầm loại là nhầm cả mô hình tính toán. Biến ĐỒNG NHẤT (uniform) mang MỘT giá trị cho toàn bộ lệnh vẽ — thời gian, màu ánh sáng, ma trận camera — nên phần cứng chỉ nạp nó một lần; gán nó khác nhau theo từng đỉnh là dùng sai loại biến, và tuỳ nền tảng nó sẽ im lặng lấy một giá trị bất kỳ thay vì báo lỗi. Biến THEO ĐỈNH (attribute) mới là thứ khác nhau ở từng đỉnh: vị trí, pháp tuyến, toạ độ kết cấu. Còn giá trị nội suy chuyển từ shader đỉnh sang shader điểm ảnh (varying) thì tự động được pha giữa các đỉnh. Cổng ở bài này chặn mọi phép gán sai loại: `invalid`, fail closed. Đây là MÔ PHỎNG Python hữu hạn trên nhãn loại biến: KHÔNG GLSL/HLSL thật, không biên dịch, không GPU.',
    workedExample: {
      code: `# MO PHONG kiem loai bien; chi lam viec tren NHAN, khong bien dich shader that.\nloai, pham_vi = "uniform", "ca_lenh_ve"\nprint("allow: gan dung loai bien" if (loai, pham_vi) == ("uniform", "ca_lenh_ve") else "invalid: gan sai loai bien")`,
      stdinLines: [],
    },
    predict: {
      code: `loai, pham_vi = "uniform", "tung_dinh"\nprint("invalid: gan sai loai bien" if (loai, pham_vi) != ("uniform", "ca_lenh_ve") else "allow: gan dung loai bien")`,
      question: 'Một biến đồng nhất bị gán giá trị khác nhau theo từng đỉnh. MÔ PHỎNG in gì?',
      choices: [
        'invalid: gan sai loai bien',
        'allow: gan dung loai bien',
        'exceed: vuot ngan sach rieng',
        'unknown: loai bien chua khai bao',
      ],
      answerIndex: 0,
      explain:
        'Biến đồng nhất theo định nghĩa chỉ có một giá trị cho cả lệnh vẽ, nên "khác nhau theo từng đỉnh" là mâu thuẫn với chính loại biến. Chặn ở cổng vì phần cứng thường KHÔNG báo lỗi — nó chỉ lấy một giá trị nào đó, và bạn chỉ thấy hình sai.',
    },
    parsons: {
      prompt: 'Xếp cổng loại biến: loại lạ là lỗi khai báo, phạm vi sai là lỗi gán.',
      lines: [
        'if loai not in LOAI_HOP_LE:',
        '    print("unknown: loai bien chua khai bao")',
        'elif pham_vi not in PHAM_VI_HOP_LE:',
        '    print("invalid: pham vi")',
        'elif PHAM_VI_DUNG[loai] != pham_vi:',
        '    print("invalid: gan sai loai bien")',
        'else:',
        '    print("allow: gan dung loai bien")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG cổng loại biến của shader. Bảng đúng: `uniform` → `ca_lenh_ve`, `attribute` → `tung_dinh`, `varying` → `noi_suy`. Đọc `loai:<uniform|attribute|varying>,pham_vi:<ca_lenh_ve|tung_dinh|noi_suy>`. Thiếu/thừa trường → `invalid: field`; loai ngoài ba giá trị → `unknown: loai bien chua khai bao`; pham_vi ngoài ba giá trị → `invalid: pham vi`; cặp không khớp bảng → `invalid: gan sai loai bien`; khớp → `allow: gan dung loai bien`. Không viết GLSL thật, không biên dịch, không GPU.',
      starterCode: '# MÔ PHỎNG loại biến shader; chỉ làm việc trên nhãn, không biên dịch gì.\n',
      testCases: [
        {
          stdinLines: ['loai:uniform,pham_vi:ca_lenh_ve'],
          expected: 'allow: gan dung loai bien',
          match: 'contains',
          hidden: false,
          label: 'biến đồng nhất một giá trị cho cả lệnh vẽ',
        },
        {
          stdinLines: ['loai:uniform,pham_vi:tung_dinh'],
          expected: 'invalid: gan sai loai bien',
          match: 'contains',
          hidden: true,
          label: 'gán biến đồng nhất theo từng đỉnh là nhầm loại biến',
        },
        {
          stdinLines: ['loai:attribute,pham_vi:tung_dinh'],
          expected: 'allow: gan dung loai bien',
          match: 'contains',
          hidden: true,
          label: 'biến theo đỉnh mới là thứ khác nhau ở từng đỉnh',
        },
        {
          stdinLines: ['loai:texture3d,pham_vi:ca_lenh_ve'],
          expected: 'unknown: loai bien chua khai bao',
          match: 'contains',
          hidden: true,
          label: 'loại biến lạ là lỗi khai báo, không phải lỗi gán',
        },
        {
          stdinLines: ['loai:varying,pham_vi:toan_canh'],
          expected: 'invalid: pham vi',
          match: 'contains',
          hidden: true,
          label: 'ca âm — phạm vi ngoài bảng fail closed',
        },
      ],
      hints: [
        'Bảng loại → phạm vi viết thành dict: thêm loại biến mới chỉ là thêm một dòng dữ liệu.',
        'Phân biệt `unknown` (loại chưa khai báo — lỗi khai báo) với `invalid` (gán sai — lỗi dùng).',
        'Không dùng file, socket, subprocess, thư viện đồ hoạ hay thời gian thực.',
      ],
      sampleSolution: `PHAM_VI_DUNG = {"uniform": "ca_lenh_ve", "attribute": "tung_dinh", "varying": "noi_suy"}
PHAM_VI_HOP_LE = {"ca_lenh_ve", "tung_dinh", "noi_suy"}

try:
    m = dict(p.split(":", 1) for p in input().strip().split(","))
    if set(m) != {"loai", "pham_vi"}:
        print("invalid: field")
    elif m["loai"] not in PHAM_VI_DUNG:
        print("unknown: loai bien chua khai bao")
    elif m["pham_vi"] not in PHAM_VI_HOP_LE:
        print("invalid: pham vi")
    elif PHAM_VI_DUNG[m["loai"]] != m["pham_vi"]:
        print("invalid: gan sai loai bien")
    else:
        print("allow: gan dung loai bien")
except (EOFError, ValueError, KeyError):
    print("invalid: input")`,
    },
    homework:
      'Ngoài sandbox, trong Godot hoặc Unity viết một shader nhỏ có đủ ba loại biến: một biến đồng nhất (thời gian), một biến theo đỉnh (toạ độ kết cấu) và một giá trị nội suy chuyển từ shader đỉnh sang shader điểm ảnh. Cố tình dùng sai một biến, chụp lại hình sai và ghi lại engine có báo lỗi hay im lặng.',
    srsCards: [
      {
        hoi: 'Khác nhau cơ bản giữa biến đồng nhất và biến theo đỉnh trong shader là gì?',
        dap: 'Biến đồng nhất có MỘT giá trị cho cả lệnh vẽ và được nạp một lần; biến theo đỉnh có giá trị riêng cho từng đỉnh và được đọc lại ở mỗi đỉnh. Nhầm hai loại này là nhầm cả mô hình tính toán của shader.',
      },
      {
        hoi: 'Vì sao lỗi nhầm loại biến shader nguy hiểm hơn lỗi cú pháp?',
        dap: 'Lỗi cú pháp bị trình biên dịch chặn ngay; nhầm loại biến thường không báo gì, phần cứng cứ lấy một giá trị nào đó, nên lỗi chỉ hiện ra dưới dạng "hình trông hơi lạ" và có thể sống sót tới bản phát hành.',
      },
    ],
  },
]
