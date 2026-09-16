// P6-U139 — mathforcode-s2-m2: xác suất rời rạc, kỳ vọng và nhiễu A/B.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U139_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u139-l1',
    unitId: 'p6-u139',
    language: 'python',
    title: 'Xác suất có điều kiện và bài toán va chạm',
    hook: 'Trong một phòng chỉ 23 người, khả năng có hai người trùng ngày sinh đã vượt 50%. Trực giác dễ đánh giá thấp va chạm vì nó quên đếm mọi cặp có thể gặp nhau.',
    theory:
      'Xác suất có điều kiện P(A|B) chỉ nhìn các kết quả thuộc B, rồi lấy phần trong đó cũng thuộc A. Với không gian mẫu đều hữu hạn, đó là |A∩B|/|B|; nếu B rỗng thì phép chia không có nghĩa và phải bị từ chối. Để tính xác suất va chạm khi lấy k giá trị độc lập từ N giá trị, tính phần bù: xác suất không va chạm là tích (N−i)/N với i từ 0 tới k−1, rồi lấy 1 trừ tích. k=0 hoặc 1 cho 0; k>N chắc chắn va chạm; N<=0 không hợp lệ. Mô phỏng bằng `random.Random(seed)` là phép đối chiếu tái hiện được, không thay thế công thức.',
    workedExample: {
      code: `import random

def xac_suat_va_cham(N, k):
    # Tinh tuan tu phan bu, khong dung giai thua lon.
    if k <= 1:
        return 0.0
    if k > N:
        return 1.0
    khong_va_cham = 1.0
    for i in range(k):
        khong_va_cham *= (N - i) / N
    return 1.0 - khong_va_cham

def mo_phong(N, k, so_lan, seed):
    # Nguon ngau nhien cuc bo giup chay lai dung cung ket qua.
    rng = random.Random(seed)
    va_cham = 0
    for _ in range(so_lan):
        mau = [rng.randrange(N) for _ in range(k)]
        va_cham += len(set(mau)) < k
    return va_cham / so_lan

print(f"{xac_suat_va_cham(365, 23):.6f}")
print(f"{mo_phong(365, 23, 20000, 2026):.6f}")`,
      stdinLines: [],
    },
    predict: {
      code: `khong_gian = set(range(1, 7))
A = {2, 4, 6}
B = {4, 5, 6}
print(len(A & B) / len(B))`,
      question: 'Với xúc xắc đều, code in P(A|B) bằng bao nhiêu?',
      choices: ['0.6666666666666666', '0.5', '0.3333333333333333', '2'],
      answerIndex: 0,
      explain: 'Sau khi biết B xảy ra, chỉ còn {4,5,6}; hai trong ba kết quả 4 và 6 cũng thuộc A.',
    },
    parsons: {
      prompt: 'Xếp hàm tính xác suất va chạm bằng phần bù.',
      lines: [
        'def va_cham(N, k):',
        '    if k <= 1: return 0.0',
        '    if k > N: return 1.0',
        '    khong_va_cham = 1.0',
        '    for i in range(k):',
        '        khong_va_cham *= (N - i) / N',
        '    return 1.0 - khong_va_cham',
      ],
    },
    make: {
      prompt:
        'Dòng đầu chọn `dieu-kien` hoặc `va-cham`. Với `dieu-kien`, đọc hai dòng số nguyên cách nhau bởi khoảng trắng là A và B, rồi in P(A|B) với 6 chữ số; B rỗng in `bien-dieu-kien-rong`. Với `va-cham`, đọc N, k, số lần mô phỏng và seed trên bốn dòng. N<=0, k<0 hoặc số lần<=0 in `khong-hop-le`; ngược lại in `ly-thuyet=` và `mo-phong=` với 6 chữ số. Dùng `random.Random(seed)` và công thức phần bù tuần tự.',
      starterCode: `import random

che_do = input().strip()

# Tach hai che do; khong dung random toan cuc.
`,
      testCases: [
        {
          stdinLines: ['va-cham', '365', '23', '20000', '2026'],
          expected: 'ly-thuyet=0.507297\nmo-phong=0.506850',
          match: 'contains',
          hidden: false,
          label: 'nghịch lý ngày sinh có seed cố định',
        },
        {
          stdinLines: ['dieu-kien', '2 4 6', '4 5 6'],
          expected: '0.666667',
          match: 'contains',
          hidden: true,
          label: 'lọc không gian mẫu theo B',
        },
        {
          stdinLines: ['dieu-kien', '1 2', ''],
          expected: 'bien-dieu-kien-rong',
          match: 'contains',
          hidden: true,
          label: 'từ chối điều kiện rỗng',
        },
        {
          stdinLines: ['va-cham', '10', '0', '50', '9'],
          expected: 'ly-thuyet=0.000000\nmo-phong=0.000000',
          match: 'contains',
          hidden: true,
          label: 'k bằng 0 không thể va chạm',
        },
        {
          stdinLines: ['va-cham', '10', '1', '50', '9'],
          expected: 'ly-thuyet=0.000000\nmo-phong=0.000000',
          match: 'contains',
          hidden: true,
          label: 'k bằng 1 không thể va chạm',
        },
        {
          stdinLines: ['va-cham', '2', '3', '50', '9'],
          expected: 'ly-thuyet=1.000000\nmo-phong=1.000000',
          match: 'contains',
          hidden: true,
          label: 'k lớn hơn N chắc chắn va chạm',
        },
        {
          stdinLines: ['va-cham', '0', '3', '50', '9'],
          expected: 'khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'N phải dương',
        },
      ],
      hints: [
        'Dòng rỗng của B phải thành tập rỗng, không phải lỗi chuyển số.',
        'Nhánh va chạm xử lý k<=1 và k>N trước vòng tích.',
        'Tạo `rng = random.Random(seed)` rồi gọi `rng.randrange(N)`.',
      ],
      sampleSolution: `import random

che_do = input().strip()

if che_do == "dieu-kien":
    dong_A = input().strip()
    dong_B = input().strip()
    A = set() if dong_A == "" else set(map(int, dong_A.split()))
    B = set() if dong_B == "" else set(map(int, dong_B.split()))
    if not B:
        print("bien-dieu-kien-rong")
    else:
        print(f"{len(A & B) / len(B):.6f}")
elif che_do == "va-cham":
    N = int(input())
    k = int(input())
    so_lan = int(input())
    seed = int(input())
    if N <= 0 or k < 0 or so_lan <= 0:
        print("khong-hop-le")
    else:
        if k <= 1:
            ly_thuyet = 0.0
        elif k > N:
            ly_thuyet = 1.0
        else:
            khong_va_cham = 1.0
            for i in range(k):
                khong_va_cham *= (N - i) / N
            ly_thuyet = 1.0 - khong_va_cham

        rng = random.Random(seed)
        va_cham = 0
        for _ in range(so_lan):
            mau = [rng.randrange(N) for _ in range(k)]
            va_cham += len(set(mau)) < k
        print(f"ly-thuyet={ly_thuyet:.6f}")
        print(f"mo-phong={va_cham / so_lan:.6f}")
else:
    print("khong-hop-le")`,
    },
    homework:
      'Chạy công thức và mô phỏng với N=365, k từ 2 tới 60 bằng ba seed cố định; tìm k đầu tiên vượt 50% và ghi độ lệch lớn nhất giữa mô phỏng với lý thuyết.',
    srsCards: [
      {
        hoi: 'Xác suất có điều kiện P(A|B) được tính thế nào trong không gian mẫu đều?',
        dap: 'Lọc còn các kết quả thuộc B rồi lấy tỷ lệ cũng thuộc A: |A∩B|/|B|; B rỗng thì không xác định.',
      },
      {
        hoi: 'Vì sao tính va chạm bằng biến cố bù dễ hơn?',
        dap: 'Không va chạm có tích tuần tự đơn giản; lấy 1 trừ tích đó gộp mọi cách va chạm mà không đếm trùng.',
      },
    ],
  },
  {
    id: 'p6-u139-l2',
    unitId: 'p6-u139',
    language: 'python',
    title: 'Kỳ vọng tuyến tính và ngưỡng nhiễu trong A/B test',
    hook: 'Biến thể B hơn A hai điểm phần trăm chưa chắc là chiến thắng; ở mẫu nhỏ, chênh lệch ấy có thể chỉ là dao động lấy mẫu. Ta cần công bố ngưỡng trước khi nhìn kết quả.',
    theory:
      'Kỳ vọng có tính tuyến tính: E[X₁+…+Xₙ]=E[X₁]+…+E[Xₙ], kể cả khi các biến không độc lập. Một lượt chuyển đổi là biến chỉ báo 0/1 có kỳ vọng p, nên số chuyển đổi kỳ vọng trong n lượt là np. Với hai tỉ lệ quan sát pA và pB, bài này dùng ngưỡng xấp xỉ `2*sqrt(pA(1-pA)/nA + pB(1-pB)/nB)`. Nếu |pB−pA| vượt ngưỡng, ta gọi là tín hiệu đáng điều tra; nếu không, coi là chưa tách khỏi nhiễu. Đây là kiểm tra học tập đơn giản, không chứng minh quan hệ nhân quả và không thay thế phân bổ ngẫu nhiên, khoảng tin cậy hay thiết kế thí nghiệm đầy đủ.',
    workedExample: {
      code: `from math import sqrt

def danh_gia(chuyen_A, n_A, chuyen_B, n_B):
    # Moi chuyen doi la mot bien chi bao co ky vong p.
    p_A = chuyen_A / n_A
    p_B = chuyen_B / n_B
    do_lech = p_B - p_A
    nguong = 2 * sqrt(p_A * (1 - p_A) / n_A + p_B * (1 - p_B) / n_B)
    return do_lech, nguong

do_lech, nguong = danh_gia(50, 1000, 100, 1000)
print(f"{do_lech:.6f} {nguong:.6f}")
print("tin-hieu" if abs(do_lech) > nguong else "chua-vuot-nhieu")`,
      stdinLines: [],
    },
    predict: {
      code: `xac_suat = [0.2, 0.5, 0.8]
ky_vong = sum(xac_suat)
print(ky_vong)`,
      question: 'Tổng số thành công kỳ vọng của ba biến chỉ báo được in ra là gì?',
      choices: ['1.5', '0.8', '0.3', '3'],
      answerIndex: 0,
      explain: 'Tuyến tính kỳ vọng cho phép cộng trực tiếp 0.2 + 0.5 + 0.8 = 1.5.',
    },
    parsons: {
      prompt: 'Xếp các dòng tính chênh lệch và ngưỡng dao động xấp xỉ cho hai nhóm.',
      lines: [
        'p_A = chuyen_A / n_A',
        'p_B = chuyen_B / n_B',
        'do_lech = p_B - p_A',
        'phuong_sai = p_A * (1 - p_A) / n_A + p_B * (1 - p_B) / n_B',
        'nguong = 2 * sqrt(phuong_sai)',
        'return do_lech, nguong',
      ],
    },
    make: {
      prompt:
        'Đọc lần lượt số chuyển đổi A, cỡ mẫu A, số chuyển đổi B, cỡ mẫu B. Nếu cỡ mẫu không dương hoặc chuyển đổi ngoài 0..n, in `khong-hop-le`. Ngược lại in `chenh-lech=<pB-pA>`, `nguong=<2*SE>` với 6 chữ số và `tin-hieu` nếu trị tuyệt đối chênh lệch lớn hơn ngưỡng, còn lại in `chua-vuot-nhieu`.',
      starterCode: `from math import sqrt

chuyen_A = int(input())
n_A = int(input())
chuyen_B = int(input())
n_B = int(input())

# Kiem tra mien truoc khi chia.
`,
      testCases: [
        {
          stdinLines: ['50', '1000', '100', '1000'],
          expected: 'chenh-lech=0.050000\nnguong=0.023452\ntin-hieu',
          match: 'contains',
          hidden: false,
          label: 'chênh lệch vượt ngưỡng công bố',
        },
        {
          stdinLines: ['50', '1000', '70', '1000'],
          expected: 'chenh-lech=0.020000\nnguong=0.021223\nchua-vuot-nhieu',
          match: 'contains',
          hidden: true,
          label: 'chênh lệch còn trong nhiễu',
        },
        {
          stdinLines: ['0', '10', '10', '10'],
          expected: 'chenh-lech=1.000000\nnguong=0.000000\ntin-hieu',
          match: 'contains',
          hidden: true,
          label: 'tỉ lệ 0 và 100 phần trăm vẫn hữu hạn',
        },
        {
          stdinLines: ['0', '0', '5', '10'],
          expected: 'khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'nhóm A không được rỗng',
        },
        {
          stdinLines: ['1', '10', '0', '0'],
          expected: 'khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'nhóm B không được rỗng',
        },
      ],
      hints: [
        'Kiểm `n_A > 0`, `n_B > 0` và số chuyển đổi nằm trong 0..n.',
        'Phương sai xấp xỉ là tổng hai lượng `p*(1-p)/n`.',
        'So `abs(p_B-p_A) > nguong`; dấu bằng chưa vượt ngưỡng.',
      ],
      sampleSolution: `from math import sqrt

chuyen_A = int(input())
n_A = int(input())
chuyen_B = int(input())
n_B = int(input())

if n_A <= 0 or n_B <= 0 or not 0 <= chuyen_A <= n_A or not 0 <= chuyen_B <= n_B:
    print("khong-hop-le")
else:
    p_A = chuyen_A / n_A
    p_B = chuyen_B / n_B
    do_lech = p_B - p_A
    phuong_sai = p_A * (1 - p_A) / n_A + p_B * (1 - p_B) / n_B
    nguong = 2 * sqrt(phuong_sai)
    print(f"chenh-lech={do_lech:.6f}")
    print(f"nguong={nguong:.6f}")
    print("tin-hieu" if abs(do_lech) > nguong else "chua-vuot-nhieu")`,
    },
    homework:
      'Giữ tỉ lệ A=5% và B=7%, tính kết luận ở cỡ mẫu 100, 1.000 và 10.000 mỗi nhóm; giải thích vì sao cùng chênh lệch nhưng ngưỡng giảm khi mẫu lớn hơn.',
    srsCards: [
      {
        hoi: 'Tuyến tính kỳ vọng cho tổng các biến chỉ báo nói gì?',
        dap: 'Kỳ vọng của tổng bằng tổng các kỳ vọng, nên n lượt có xác suất thành công p cho số thành công kỳ vọng np.',
      },
      {
        hoi: 'Vượt ngưỡng nhiễu đơn giản trong bài A/B có chứng minh quan hệ nhân quả không?',
        dap: 'Không; đó chỉ là tín hiệu đáng điều tra, còn nhân quả cần phân bổ và thiết kế thí nghiệm đầy đủ cùng phân tích phù hợp.',
      },
    ],
  },
]
