// P6-U141 — mathforcode-s2-m4: thống kê mô tả và phân vị.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U141_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u141-l1',
    unitId: 'p6-u141',
    language: 'python',
    title: 'Mean, median và độ phân tán — đừng để average che ngoại lai',
    hook: 'Latency trung bình 40 ms nghe rất ổn, cho tới khi một số người phải chờ 2 giây. Một số trung tâm không đủ; ta cần cả độ phân tán và thước đo bền hơn trước ngoại lai.',
    theory:
      'Trung bình là tổng chia số phần tử. Trung vị lấy phần tử giữa sau khi sắp xếp; với độ dài chẵn, lấy trung bình hai phần tử giữa. Phương sai tổng thể là trung bình của bình phương độ lệch so với mean, chia cho n; độ lệch chuẩn là căn bậc hai của phương sai. Một ngoại lai kéo mean và phương sai mạnh, trong khi median thường thay đổi ít hơn. Dãy rỗng phải bị từ chối; một phần tử có phương sai 0. Hãy sắp xếp một bản sao để không sửa dữ liệu đầu vào.',
    workedExample: {
      code: `from math import sqrt

def thong_ke(ds):
    # sorted tao ban sao, khong sua ds cua nguoi goi.
    sap_xep = sorted(ds)
    n = len(ds)
    mean = sum(ds) / n
    giua = n // 2
    median = sap_xep[giua] if n % 2 else (sap_xep[giua - 1] + sap_xep[giua]) / 2
    variance = sum((x - mean) ** 2 for x in ds) / n
    return mean, median, variance, sqrt(variance)

goc = [10, 11, 12, 13, 14]
co_ngoai_lai = goc + [200]
print(thong_ke(goc)[:2])
print(thong_ke(co_ngoai_lai)[:2])
print(goc)`,
      stdinLines: [],
    },
    predict: {
      code: `ds = [9, 1, 7, 3]
sap_xep = sorted(ds)
n = len(ds)
median = (sap_xep[n // 2 - 1] + sap_xep[n // 2]) / 2
print(median, ds)`,
      question: 'Chương trình in trung vị và danh sách gốc như thế nào?',
      choices: ['5.0 [9, 1, 7, 3]', '5.0 [1, 3, 7, 9]', '3.0 [9, 1, 7, 3]', '4.0 [9, 1, 7, 3]'],
      answerIndex: 0,
      explain:
        'Bản sao đã sắp là [1,3,7,9], nên median=(3+7)/2=5; `sorted` không sửa danh sách gốc.',
    },
    parsons: {
      prompt: 'Xếp các dòng tính phương sai tổng thể và độ lệch chuẩn.',
      lines: [
        'def do_phan_tan(ds):',
        '    if not ds: raise ValueError("day rong")',
        '    mean = sum(ds) / len(ds)',
        '    tong_binh_phuong = sum((x - mean) ** 2 for x in ds)',
        '    variance = tong_binh_phuong / len(ds)',
        '    return variance, sqrt(variance)',
      ],
    },
    make: {
      prompt:
        'Đọc một dòng số thực cách nhau bằng dấu phẩy. Dãy rỗng in `day-rong`. Ngược lại tự tính mean, median, population variance và standard deviation, mỗi số 6 chữ số sau dấu phẩy; cuối cùng in `khong-doi=True` nếu danh sách đầu vào vẫn đúng thứ tự ban đầu. Không dùng thư viện thống kê.',
      starterCode: `from math import sqrt

dong = input().strip()

# Sap xep ban sao va dung mau so n cho population variance.
`,
      testCases: [
        {
          stdinLines: ['1,2,3,4'],
          expected:
            'mean=2.500000\nmedian=2.500000\nvariance=1.250000\nstd=1.118034\nkhong-doi=True',
          match: 'contains',
          hidden: false,
          label: 'dãy chẵn lấy trung bình hai phần tử giữa',
        },
        {
          stdinLines: ['5'],
          expected:
            'mean=5.000000\nmedian=5.000000\nvariance=0.000000\nstd=0.000000\nkhong-doi=True',
          match: 'contains',
          hidden: true,
          label: 'một phần tử có phương sai 0',
        },
        {
          stdinLines: ['1,2,100'],
          expected:
            'mean=34.333333\nmedian=2.000000\nvariance=2156.222222\nstd=46.435140\nkhong-doi=True',
          match: 'contains',
          hidden: true,
          label: 'ngoại lai kéo mean xa median',
        },
        {
          stdinLines: ['0,0,0'],
          expected:
            'mean=0.000000\nmedian=0.000000\nvariance=0.000000\nstd=0.000000\nkhong-doi=True',
          match: 'contains',
          hidden: true,
          label: 'ba giá trị bằng nhau',
        },
        {
          stdinLines: ['-2,0,2'],
          expected:
            'mean=0.000000\nmedian=0.000000\nvariance=2.666667\nstd=1.632993\nkhong-doi=True',
          match: 'contains',
          hidden: true,
          label: 'dãy đối xứng có số âm',
        },
        {
          stdinLines: [''],
          expected: 'day-rong',
          match: 'contains',
          hidden: true,
          label: 'từ chối dãy rỗng',
        },
      ],
      hints: [
        'Lưu `ban_dau = ds[:]` rồi dùng `sap_xep = sorted(ds)`.',
        'Với n chẵn, hai chỉ số giữa là `n//2-1` và `n//2`.',
        'Population variance chia tổng bình phương độ lệch cho n, không phải n−1.',
      ],
      sampleSolution: `from math import sqrt

dong = input().strip()

if dong == "":
    print("day-rong")
else:
    ds = [float(x) for x in dong.split(",")]
    ban_dau = ds[:]
    sap_xep = sorted(ds)
    n = len(ds)
    mean = sum(ds) / n
    giua = n // 2
    median = sap_xep[giua] if n % 2 else (sap_xep[giua - 1] + sap_xep[giua]) / 2
    variance = sum((x - mean) ** 2 for x in ds) / n
    std = sqrt(variance)
    print(f"mean={mean:.6f}")
    print(f"median={median:.6f}")
    print(f"variance={variance:.6f}")
    print(f"std={std:.6f}")
    print(f"khong-doi={ds == ban_dau}")`,
    },
    homework:
      'Tính bốn thống kê cho `[10,11,12,13,14]`, rồi thêm 200 và tính lại; ghi mean và median đổi bao nhiêu để giải thích thước đo nào bền hơn trước ngoại lai.',
    srsCards: [
      {
        hoi: 'Population variance khác sample variance ở mẫu số nào?',
        dap: 'Population variance chia cho n; sample variance thường chia cho n−1 để ước lượng từ mẫu.',
      },
      {
        hoi: 'Mean và median phản ứng khác nhau thế nào trước một ngoại lai lớn?',
        dap: 'Mean bị kéo mạnh vì dùng độ lớn của mọi giá trị; median dựa vào vị trí giữa nên thường thay đổi ít hơn.',
      },
    ],
  },
  {
    id: 'p6-u141-l2',
    unitId: 'p6-u141',
    language: 'python',
    title: 'p50, p95, p99 — nhìn tail latency và kiểm độ ổn định',
    hook: 'p50 nhanh không cứu được người dùng ở đuôi p99. Báo cáo latency production cần nói rõ quy ước phân vị, vì hai thư viện dùng hai nội suy khác nhau có thể trả số khác nhau.',
    theory:
      'Bài này dùng nearest-rank: sắp n giá trị tăng dần; với 0<p<=100, hạng là `ceil(p*n/100)` và chỉ số là hạng−1. Quy ước riêng p=0 trả min, p=100 trả max. Dữ liệu rỗng hoặc p ngoài [0,100] bị từ chối. p50 mô tả trải nghiệm giữa, p95 và p99 cho thấy đuôi chậm. Một phân vị ở prefix nhỏ có thể nhảy mạnh khi thêm mẫu; hãy tính trên các prefix tăng dần và chỉ gọi là ổn định khi thay đổi đủ nhỏ theo ngưỡng nghiệp vụ. Luôn sắp bản sao để không sửa dữ liệu đầu vào.',
    workedExample: {
      code: `from math import ceil

def phan_vi(ds, p):
    # Nearest-rank voi quy uoc p=0 tra min.
    sap_xep = sorted(ds)
    if p == 0:
        return sap_xep[0]
    hang = ceil(p * len(sap_xep) / 100)
    return sap_xep[hang - 1]

latency = [12, 15, 11, 20, 18, 14, 13, 17, 16, 200, 19, 12, 15, 14, 13, 18, 16, 17, 21, 22]
print([phan_vi(latency, p) for p in [50, 95, 99]])
print([phan_vi(latency[:n], 95) for n in [5, 10, 20]])`,
      stdinLines: [],
    },
    predict: {
      code: `from math import ceil
ds = sorted([9, 1, 5, 3, 7])
chi_so = ceil(95 * len(ds) / 100) - 1
print(ds[chi_so])`,
      question: 'Theo nearest-rank, p95 của năm giá trị này là bao nhiêu?',
      choices: ['9', '7', '8', '5'],
      answerIndex: 0,
      explain: 'ceil(95×5/100)=5, nên lấy phần tử hạng 5 trong [1,3,5,7,9], tức 9.',
    },
    parsons: {
      prompt: 'Xếp hàm nearest-rank có xử lý p=0 và không sửa đầu vào.',
      lines: [
        'def phan_vi(ds, p):',
        '    if not ds or not 0 <= p <= 100:',
        '        raise ValueError("dau vao khong hop le")',
        '    sap_xep = sorted(ds)',
        '    if p == 0: return sap_xep[0]',
        '    hang = ceil(p * len(sap_xep) / 100)',
        '    return sap_xep[hang - 1]',
      ],
    },
    make: {
      prompt:
        'Dòng đầu chọn `phan-vi` hoặc `bao-cao`; dòng hai là dãy số cách nhau bằng dấu phẩy. Với `phan-vi`, đọc thêm p và in `ket-qua=` theo nearest-rank. Với `bao-cao`, in p50, p95, p99 và p95 của các prefix dài 5, 10, toàn bộ (bỏ mốc lớn hơn độ dài). Dãy rỗng, p ngoài [0,100] hoặc chế độ lạ in `khong-hop-le`. Không sửa thứ tự dãy gốc.',
      starterCode: `from math import ceil

che_do = input().strip()
dong = input().strip()

# Viet mot ham nearest-rank dung chung cho ca hai che do.
`,
      testCases: [
        {
          stdinLines: ['bao-cao', '12,15,11,20,18,14,13,17,16,200,19,12,15,14,13,18,16,17,21,22'],
          expected: 'p50=16\np95=22\np99=200\np95-prefix=20,200,22\nkhong-doi=True',
          match: 'contains',
          hidden: false,
          label: 'báo cáo latency cố định và ba prefix',
        },
        {
          stdinLines: ['phan-vi', '9,1,5,3,7', '50'],
          expected: 'ket-qua=5\nkhong-doi=True',
          match: 'contains',
          hidden: true,
          label: 'dữ liệu chưa sắp xếp vẫn cho p50 đúng',
        },
        {
          stdinLines: ['phan-vi', '9,1,5,3,7', '0'],
          expected: 'ket-qua=1\nkhong-doi=True',
          match: 'contains',
          hidden: true,
          label: 'p0 trả min',
        },
        {
          stdinLines: ['phan-vi', '9,1,5,3,7', '100'],
          expected: 'ket-qua=9\nkhong-doi=True',
          match: 'contains',
          hidden: true,
          label: 'p100 trả max',
        },
        {
          stdinLines: ['phan-vi', '', '50'],
          expected: 'khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'từ chối dãy rỗng',
        },
        {
          stdinLines: ['phan-vi', '1,2,3', '-1'],
          expected: 'khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'từ chối p âm',
        },
        {
          stdinLines: ['phan-vi', '1,2,3', '101'],
          expected: 'khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'từ chối p trên 100',
        },
      ],
      hints: [
        'Dùng `ceil(p * n / 100) - 1`; riêng p=0 lấy chỉ số 0.',
        'Hàm phải gọi `sorted(ds)` thay vì `ds.sort()`.',
        'Ở báo cáo, lọc các độ dài `[5, 10, len(ds)]` không vượt n và không lặp.',
      ],
      sampleSolution: `from math import ceil

che_do = input().strip()
dong = input().strip()

def phan_vi(ds, p):
    sap_xep = sorted(ds)
    if p == 0:
        return sap_xep[0]
    hang = ceil(p * len(sap_xep) / 100)
    return sap_xep[hang - 1]

if dong == "" or che_do not in {"phan-vi", "bao-cao"}:
    print("khong-hop-le")
else:
    ds = [float(x) for x in dong.split(",")]
    ban_dau = ds[:]
    if che_do == "phan-vi":
        p = float(input())
        if not 0 <= p <= 100:
            print("khong-hop-le")
        else:
            print(f"ket-qua={phan_vi(ds, p):g}")
            print(f"khong-doi={ds == ban_dau}")
    else:
        print(f"p50={phan_vi(ds, 50):g}")
        print(f"p95={phan_vi(ds, 95):g}")
        print(f"p99={phan_vi(ds, 99):g}")
        cac_moc = []
        for moc in [5, 10, len(ds)]:
            if moc <= len(ds) and moc not in cac_moc:
                cac_moc.append(moc)
        prefix = [phan_vi(ds[:moc], 95) for moc in cac_moc]
        print("p95-prefix=" + ",".join(f"{x:g}" for x in prefix))
        print(f"khong-doi={ds == ban_dau}")`,
    },
    homework:
      'Tạo bảng p95 sau mỗi 10 mẫu của một dãy latency cố định ít nhất 100 phần tử; chọn trước một ngưỡng thay đổi và ghi từ prefix nào p95 được xem là ổn định.',
    srsCards: [
      {
        hoi: 'Nearest-rank xác định vị trí phân vị p như thế nào?',
        dap: 'Với 0<p<=100, lấy hạng ceil(pn/100) trong dữ liệu tăng dần; quy ước của bài cho p=0 trả min.',
      },
      {
        hoi: 'Vì sao cần báo cả p50 và p95/p99 cho latency?',
        dap: 'p50 mô tả trải nghiệm giữa, còn p95/p99 phơi bày đuôi chậm mà trung vị hoặc trung bình có thể che khuất.',
      },
    ],
  },
]
