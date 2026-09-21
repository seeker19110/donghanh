// P6-U229 — algo-s3-m4: cấu trúc dữ liệu truy vấn khoảng. Cây phân đoạn có cập nhật lười
// (range-add, range-sum) đối chứng với thao tác trên mảng thô, và sparse table cho truy vấn
// min tĩnh — từ chối mọi cập nhật sau khi đã build.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U229_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u229-l1',
    unitId: 'p6-u229',
    language: 'python',
    title: 'Cây phân đoạn có cập nhật lười — nợ lại việc, nhưng phải trả trước khi đọc',
    hook: 'Cộng một lượng vào cả một khoảng rồi hỏi tổng khoảng khác: làm thật từng ô thì đúng mà chậm, làm lười thì nhanh mà rất dễ quên trả nợ.',
    theory:
      'Cây phân đoạn chia mảng thành các đoạn lồng nhau, mỗi nút giữ tổng của đoạn mình. Cập nhật lười là một lời hứa: khi một lệnh cộng phủ trọn đoạn của nút, ta cập nhật tổng của nút đó rồi GHI NỢ vào `lazy` thay vì đi xuống hai con. Nợ đó phải được ĐẨY XUỐNG (push-down) ngay trước lần đầu tiên ta cần đi vào con — cả khi cập nhật lẫn khi truy vấn. Quên push-down là lỗi kinh điển: chương trình vẫn chạy, vẫn in ra số, chỉ là con số đó bỏ sót phần đã hứa. Không có cách nào phát hiện bằng mắt; cách duy nhất là chạy cùng một chuỗi thao tác trên một mảng Python thô làm oracle và so từng kết quả truy vấn.',
    workedExample: {
      code: `# Oracle mang tho: dung de doi chieu voi cay phan doan.\nds = [1, 2, 3, 4, 5]\nfor i in range(1, 4):\n    ds[i] += 10\nprint(sum(ds[0:5]))\nprint(sum(ds[1:4]))`,
      stdinLines: [],
    },
    predict: {
      code: `lazy = [0, 0, 0]\ncay = [0, 0, 0]\n# Ghi no o nut 0 nhung KHONG day xuong con.\ncay[0] += 5 * 4\nlazy[0] += 5\nprint(cay[0])\nprint(cay[1])`,
      question: 'Hai dòng in ra là gì?',
      choices: ['20\n0', '20\n20', '5\n5', '20\n10'],
      answerIndex: 0,
      explain:
        'Nút cha đã cập nhật tổng và ghi nợ, nhưng nút con chưa hề được đẩy nợ xuống nên vẫn bằng 0 — đọc thẳng con lúc này sẽ ra kết quả thiếu.',
    },
    parsons: {
      prompt: 'Xếp hàm đẩy nợ xuống hai con trước khi bất kỳ ai đọc chúng.',
      lines: [
        'def day_xuong(nut, l, r):',
        '    if lazy[nut] == 0:',
        '        return',
        '    giua = (l + r) // 2',
        '    for con, cl, cr in ((nut * 2, l, giua), (nut * 2 + 1, giua + 1, r)):',
        '        lazy[con] += lazy[nut]',
        '        cay[con] += lazy[nut] * (cr - cl + 1)',
        '    lazy[nut] = 0',
      ],
    },
    make: {
      prompt:
        'Đọc dòng một là mảng số nguyên cách nhau bởi dấu phẩy, dòng hai là số thao tác `q`, rồi `q` dòng thao tác. Mỗi dòng là `add l r v` (cộng v vào mọi ô từ l đến r) hoặc `sum l r` (hỏi tổng đoạn). Dùng CÂY PHÂN ĐOẠN CÓ CẬP NHẬT LƯỜI. In `da-cap-nhat: <l>-<r>` cho mỗi `add` và `tong: <giá trị>` cho mỗi `sum`, theo đúng thứ tự thao tác. Chỉ số ngoài `[0, n)` hoặc `l > r` thì in `tu-choi: ngoai-bien` và dừng ngay. Kết quả phải khớp tuyệt đối oracle làm thẳng trên mảng Python.',
      starterCode: `dong = input().strip()\nso_thao_tac = int(input().strip())\nthao_tac = [input().strip() for _ in range(so_thao_tac)]\n\n# Doc HET input truoc, roi moi xu ly va in.`,
      testCases: [
        {
          stdinLines: ['1,2,3,4,5', '3', 'sum 0 4', 'add 1 3 10', 'sum 0 4'],
          expected: 'tong: 15\nda-cap-nhat: 1-3\ntong: 45',
          match: 'contains',
          hidden: false,
          label: 'cộng khoảng rồi hỏi lại tổng toàn mảng',
        },
        {
          stdinLines: ['1,2,3,4,5', '2', 'add 0 4 1', 'sum 1 3'],
          expected: 'da-cap-nhat: 0-4\ntong: 12',
          match: 'contains',
          hidden: true,
          label: 'truy vấn đoạn con sau cập nhật phủ toàn mảng — bắt lỗi quên push-down',
        },
        {
          stdinLines: ['7', '2', 'add 0 0 3', 'sum 0 0'],
          expected: 'da-cap-nhat: 0-0\ntong: 10',
          match: 'contains',
          hidden: true,
          label: 'mảng một phần tử',
        },
        {
          stdinLines: ['1,2,3', '1', 'sum 0 3'],
          expected: 'tu-choi: ngoai-bien',
          match: 'contains',
          hidden: true,
          label: 'chỉ số phải nhỏ hơn n',
        },
        {
          stdinLines: ['1,2,3', '1', 'sum 2 1'],
          expected: 'tu-choi: ngoai-bien',
          match: 'contains',
          hidden: true,
          label: 'khoảng đảo ngược',
        },
        {
          stdinLines: ['1,1,1,1', '4', 'add 0 1 5', 'add 2 3 5', 'sum 0 3', 'sum 1 2'],
          expected: 'tong: 24\ntong: 12',
          match: 'contains',
          hidden: true,
          label: 'hai lần cộng chồng lấn nhau',
        },
      ],
      hints: [
        'Đọc toàn bộ thao tác vào một danh sách TRƯỚC khi in bất cứ gì, để thứ tự output không lẫn với thứ tự đọc.',
        'Gọi `day_xuong` ở đầu cả hai hàm cập nhật và truy vấn, ngay trước khi đi vào hai con.',
        'Khi cập nhật phủ trọn đoạn, cộng `gia * (r - l + 1)` vào tổng của nút rồi ghi nợ — đừng đi xuống nữa.',
      ],
      sampleSolution: `dong = input().strip()\nso_thao_tac = int(input().strip())\nthao_tac = [input().strip() for _ in range(so_thao_tac)]\n\nds = [int(x.strip()) for x in dong.split(",")]\nn = len(ds)\ncay = [0] * (4 * n)\nlazy = [0] * (4 * n)\n\ndef dung(nut, l, r):\n    if l == r:\n        cay[nut] = ds[l]\n        return\n    giua = (l + r) // 2\n    dung(nut * 2, l, giua)\n    dung(nut * 2 + 1, giua + 1, r)\n    cay[nut] = cay[nut * 2] + cay[nut * 2 + 1]\n\ndef day_xuong(nut, l, r):\n    if lazy[nut] == 0:\n        return\n    giua = (l + r) // 2\n    for con, cl, cr in ((nut * 2, l, giua), (nut * 2 + 1, giua + 1, r)):\n        lazy[con] += lazy[nut]\n        cay[con] += lazy[nut] * (cr - cl + 1)\n    lazy[nut] = 0\n\ndef cong(nut, l, r, ql, qr, gia):\n    if qr < l or r < ql:\n        return\n    if ql <= l and r <= qr:\n        cay[nut] += gia * (r - l + 1)\n        lazy[nut] += gia\n        return\n    day_xuong(nut, l, r)\n    giua = (l + r) // 2\n    cong(nut * 2, l, giua, ql, qr, gia)\n    cong(nut * 2 + 1, giua + 1, r, ql, qr, gia)\n    cay[nut] = cay[nut * 2] + cay[nut * 2 + 1]\n\ndef tong(nut, l, r, ql, qr):\n    if qr < l or r < ql:\n        return 0\n    if ql <= l and r <= qr:\n        return cay[nut]\n    day_xuong(nut, l, r)\n    giua = (l + r) // 2\n    return tong(nut * 2, l, giua, ql, qr) + tong(nut * 2 + 1, giua + 1, r, ql, qr)\n\ndung(1, 0, n - 1)\nfor dong_lenh in thao_tac:\n    phan = dong_lenh.split()\n    l = int(phan[1])\n    r = int(phan[2])\n    if l < 0 or r >= n or l > r:\n        print("tu-choi: ngoai-bien")\n        raise SystemExit\n    if phan[0] == "add":\n        cong(1, 0, n - 1, l, r, int(phan[3]))\n        print("da-cap-nhat: " + str(l) + "-" + str(r))\n    else:\n        print("tong: " + str(tong(1, 0, n - 1, l, r)))`,
    },
    homework:
      'Viết oracle mảng thô cho đúng hợp đồng này, sinh 100 chuỗi thao tác ngẫu nhiên có hạt giống cố định trên mảng ngắn, và so từng dòng output. Sau đó xoá lời gọi `day_xuong` trong hàm truy vấn và ghi lại chuỗi thao tác ngắn nhất khiến hai bản lệch nhau.',
    srsCards: [
      {
        hoi: 'Cập nhật lười trong cây phân đoạn thực chất hoãn lại việc gì?',
        dap: 'Hoãn việc đi xuống cập nhật từng nút con: nút cha cập nhật tổng của mình rồi ghi lại khoản nợ, và chỉ truyền nợ ấy xuống khi thật sự cần đi vào con.',
      },
      {
        hoi: 'Push-down phải được gọi ở những chỗ nào?',
        dap: 'Ở ngay trước mỗi lần đi xuống hai con, trong cả hàm cập nhật lẫn hàm truy vấn; chỉ gọi ở hàm cập nhật thôi thì truy vấn vẫn đọc phải dữ liệu còn thiếu nợ.',
      },
      {
        hoi: 'Vì sao lỗi quên push-down phải bắt bằng oracle chứ không bằng đọc code?',
        dap: 'Vì nó không gây ngoại lệ nào: cây vẫn trả về một con số hợp lệ, chỉ thiếu phần đã hứa, nên chỉ so với kết quả của mảng thô trên cùng chuỗi thao tác mới lộ ra.',
      },
    ],
  },
  {
    id: 'p6-u229-l2',
    unitId: 'p6-u229',
    language: 'python',
    title: 'Sparse table — trả lời min cực nhanh, nhưng từ chối mọi cập nhật',
    hook: 'Có cấu trúc chỉ đổi lấy một điều: bạn hứa không sửa dữ liệu nữa. Đổi lại, mọi truy vấn min chỉ tốn hai phép so sánh.',
    theory:
      'Sparse table tiền xử lý bảng `bang[j][i]` = giá trị nhỏ nhất của đoạn bắt đầu tại i dài đúng 2^j. Nhờ phép min là luỹ đẳng (min(x, x) = x), hai đoạn dài 2^k CHỒNG LÊN NHAU vẫn phủ đúng khoảng cần hỏi, nên mỗi truy vấn chỉ tốn hai lần tra bảng. Cái giá là bảng đã dựng thì không sửa được: một lần cập nhật sẽ phải dựng lại toàn bộ. Vì vậy hợp đồng đúng đắn của cấu trúc này là TỪ CHỐI cập nhật một cách rõ ràng, chứ không lặng lẽ sửa một ô rồi trả lời sai. Dữ liệu hay đổi thì dùng cây phân đoạn ở bài trước; dữ liệu tĩnh thì sparse table mới đáng.',
    workedExample: {
      code: `# bang[j][i]: min cua doan bat dau tai i, dai dung 2^j.\nds = [5, 2, 4, 7]\nbang = [ds[:]]\nj = 1\nwhile (1 << j) <= len(ds):\n    truoc = bang[j - 1]\n    hang = []\n    for i in range(len(ds) - (1 << j) + 1):\n        hang.append(min(truoc[i], truoc[i + (1 << (j - 1))]))\n    bang.append(hang)\n    j += 1\nprint(bang[1])\nprint(bang[2])`,
      stdinLines: [],
    },
    predict: {
      code: `do_dai = 5\nk = (do_dai).bit_length() - 1\nprint(k)\nprint(1 << k)`,
      question: 'Hai dòng in ra là gì?',
      choices: ['2\n4', '3\n8', '2\n2', '1\n2'],
      answerIndex: 0,
      explain:
        'Với đoạn dài 5, luỹ thừa của hai lớn nhất không vượt quá 5 là 4, nên k = 2 và 2^k = 4; hai đoạn dài 4 chồng nhau phủ đúng đoạn dài 5.',
    },
    parsons: {
      prompt: 'Xếp vòng dựng tầng thứ j của sparse table từ tầng j-1.',
      lines: [
        'while (1 << j) <= n:',
        '    truoc = bang[j - 1]',
        '    hang = []',
        '    for i in range(n - (1 << j) + 1):',
        '        hang.append(min(truoc[i], truoc[i + (1 << (j - 1))]))',
        '    bang.append(hang)',
        '    j += 1',
      ],
    },
    make: {
      prompt:
        'Đọc dòng một là mảng số nguyên cách nhau bởi dấu phẩy, dòng hai là số thao tác `q`, rồi `q` dòng thao tác. `min l r` hỏi giá trị nhỏ nhất của đoạn — in `nho-nhat: <giá trị>`. `update i v` là thao tác KHÔNG được phép trên cấu trúc tĩnh: in `tu-choi: cau-truc-tinh` và dừng ngay. Chỉ số ngoài `[0, n)` hoặc `l > r` thì in `tu-choi: ngoai-bien` và dừng ngay. Phải dựng SPARSE TABLE một lần rồi trả lời mỗi truy vấn bằng đúng hai lần tra bảng, không quét lại đoạn.',
      starterCode: `dong = input().strip()\nso_thao_tac = int(input().strip())\nthao_tac = [input().strip() for _ in range(so_thao_tac)]\n\n# Dung bang mot lan; moi truy van chi tra bang hai lan.`,
      testCases: [
        {
          stdinLines: ['5,2,4,7,1', '2', 'min 0 4', 'min 1 2'],
          expected: 'nho-nhat: 1\nnho-nhat: 2',
          match: 'contains',
          hidden: false,
          label: 'hai truy vấn min trên mảng tĩnh',
        },
        {
          stdinLines: ['3', '1', 'min 0 0'],
          expected: 'nho-nhat: 3',
          match: 'contains',
          hidden: true,
          label: 'mảng một phần tử',
        },
        {
          stdinLines: ['5,2,4', '1', 'update 1 9'],
          expected: 'tu-choi: cau-truc-tinh',
          match: 'contains',
          hidden: true,
          label: 'cập nhật sau khi build bị từ chối rõ ràng',
        },
        {
          stdinLines: ['5,2,4', '1', 'min 0 5'],
          expected: 'tu-choi: ngoai-bien',
          match: 'contains',
          hidden: true,
          label: 'chỉ số vượt biên',
        },
        {
          stdinLines: ['9,9,9,9,9', '1', 'min 0 4'],
          expected: 'nho-nhat: 9',
          match: 'contains',
          hidden: true,
          label: 'mọi giá trị bằng nhau — min luỹ đẳng vẫn đúng',
        },
      ],
      hints: [
        'Tầng 0 chính là mảng gốc; mỗi tầng sau ghép hai đoạn của tầng trước.',
        'Với truy vấn `[l, r]`, tính `k = (r - l + 1).bit_length() - 1` rồi lấy min của hai đoạn dài 2^k bắt đầu tại l và tại r - 2^k + 1.',
        'Kiểm thao tác `update` TRƯỚC khi đọc chỉ số, vì câu trả lời đúng ở đây là từ chối chứ không phải tính toán.',
      ],
      sampleSolution: `dong = input().strip()\nso_thao_tac = int(input().strip())\nthao_tac = [input().strip() for _ in range(so_thao_tac)]\n\nds = [int(x.strip()) for x in dong.split(",")]\nn = len(ds)\n\nbang = [ds[:]]\nj = 1\nwhile (1 << j) <= n:\n    truoc = bang[j - 1]\n    hang = []\n    for i in range(n - (1 << j) + 1):\n        hang.append(min(truoc[i], truoc[i + (1 << (j - 1))]))\n    bang.append(hang)\n    j += 1\n\ndef truy_van(l, r):\n    k = (r - l + 1).bit_length() - 1\n    return min(bang[k][l], bang[k][r - (1 << k) + 1])\n\nfor dong_lenh in thao_tac:\n    phan = dong_lenh.split()\n    if phan[0] == "update":\n        print("tu-choi: cau-truc-tinh")\n        raise SystemExit\n    l = int(phan[1])\n    r = int(phan[2])\n    if l < 0 or r >= n or l > r:\n        print("tu-choi: ngoai-bien")\n        raise SystemExit\n    print("nho-nhat: " + str(truy_van(l, r)))`,
    },
    homework:
      'So sparse table với một vòng `min(ds[l:r+1])` thô trên 100 chuỗi truy vấn sinh có hạt giống cố định. Sau đó viết ra bằng lời vì sao cách ghép hai đoạn chồng nhau đúng cho phép min nhưng SAI cho phép tổng, rồi tự tìm một ví dụ cụ thể chứng minh điều đó.',
    srsCards: [
      {
        hoi: 'Vì sao sparse table trả lời truy vấn min chỉ bằng hai lần tra bảng?',
        dap: 'Vì phép min luỹ đẳng nên hai đoạn dài 2^k chồng lên nhau vẫn cho kết quả đúng; chỉ cần chọn k lớn nhất sao cho 2^k không vượt quá độ dài khoảng cần hỏi.',
      },
      {
        hoi: 'Cách ghép hai đoạn chồng nhau sai với phép nào, và vì sao?',
        dap: 'Sai với phép tổng, vì phần giao của hai đoạn sẽ bị cộng hai lần; tổng không luỹ đẳng nên bắt buộc phải phủ khoảng bằng các đoạn rời nhau.',
      },
      {
        hoi: 'Sparse table nên trả lời thế nào khi nhận lệnh cập nhật?',
        dap: 'Phải từ chối rõ ràng, vì bảng đã tiền xử lý không còn đúng sau khi dữ liệu đổi; sửa lén một ô rồi vẫn trả lời sẽ cho kết quả sai mà không ai biết.',
      },
    ],
  },
]
