// P6-U233 — algo-s4-m4: phỏng vấn và truyền đạt. Rút ràng buộc và làm rõ đề TRƯỚC khi ước
// lượng, ước lượng dung lượng bằng công thức đóng tất định, và kiểm một bản giải thích có
// đủ thành phần bắt buộc hay không.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U233_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u233-l1',
    unitId: 'p6-u233',
    language: 'python',
    title: 'Làm rõ đề trước khi ước lượng — thiếu một trường thì chưa có gì để tính',
    hook: 'Ứng viên bắt đầu gõ ngay khi nghe xong đề thường giải rất nhanh một bài không ai hỏi.',
    theory:
      'Trước khi ước lượng bất cứ con số nào, phải chắc rằng đề đã đủ dữ kiện. Kỹ năng này kiểm được bằng máy: khai trước một danh sách trường BẮT BUỘC theo thứ tự cố định, rồi trả về trường ĐẦU TIÊN còn thiếu. Thứ tự cố định là điểm mấu chốt — hỏi lung tung khiến người đối diện không biết bạn đang lần theo mạch nào, và với chương trình thì kết quả không tất định. Khi đã đủ trường, ước lượng dung lượng là số học thuần: số yêu cầu mỗi giây nhân kích thước một bản ghi nhân số giây trong ngày nhân số ngày lưu. Cuối cùng, một giá trị bằng 0 hay âm KHÔNG phải là dữ kiện hợp lệ: nó phải bị từ chối, chứ không được nhân vào thành ước lượng bằng 0 rồi trình bày như một kết quả.',
    workedExample: {
      code: `# Thu tu cac truong bat buoc la CO DINH.\nBAT_BUOC = ["qps", "kich-thuoc-ban-ghi", "so-ngay-luu"]\nde_bai = {"qps": 100, "so-ngay-luu": 7}\nthieu = [ten for ten in BAT_BUOC if ten not in de_bai]\nprint(thieu[0])`,
      stdinLines: [],
    },
    predict: {
      code: `qps = 100\nkich_thuoc = 200\nso_ngay = 1\nGIAY_TRONG_NGAY = 86400\nprint(qps * kich_thuoc * GIAY_TRONG_NGAY * so_ngay)`,
      question: 'Ước lượng dung lượng in ra là bao nhiêu byte?',
      choices: ['1728000000', '1440000000', '8640000000', '20000'],
      answerIndex: 0,
      explain:
        '100 × 200 = 20000 byte mỗi giây; nhân 86400 giây được 1.728.000.000 byte cho một ngày — khoảng 1,7 GB.',
    },
    parsons: {
      prompt: 'Xếp bước tìm trường bắt buộc đầu tiên còn thiếu theo thứ tự cố định.',
      lines: [
        'BAT_BUOC = ["qps", "kich-thuoc-ban-ghi", "so-ngay-luu"]',
        'for ten in BAT_BUOC:',
        '    if ten not in de_bai:',
        '        print("can-lam-ro: " + ten)',
        '        raise SystemExit',
      ],
    },
    make: {
      prompt:
        'Đọc MỘT dòng là đặc tả bài toán dạng `ten=gia_tri` cách nhau bởi dấu phẩy (dòng rỗng nghĩa là không có trường nào). Ba trường bắt buộc theo ĐÚNG thứ tự này: `qps`, `kich-thuoc-ban-ghi`, `so-ngay-luu`. Thiếu trường nào thì in `can-lam-ro: <tên trường ĐẦU TIÊN thiếu>` rồi dừng. Đủ trường nhưng có giá trị `<= 0` hoặc không phải số nguyên thì in `tu-choi: tham-so-khong-hop-le`. Đủ và mọi giá trị dương thì in `uoc-luong: <qps × kich-thuoc-ban-ghi × 86400 × so-ngay-luu>` (đơn vị byte). Không được tính ra ước lượng bằng 0 rồi coi là hợp lệ.',
      starterCode: `dong = input().strip()\n\n# Lam ro de TRUOC, uoc luong SAU.`,
      testCases: [
        {
          stdinLines: ['qps=100,kich-thuoc-ban-ghi=200,so-ngay-luu=1'],
          expected: 'uoc-luong: 1728000000',
          match: 'contains',
          hidden: false,
          label: '100 yêu cầu/giây, bản ghi 200 byte, giữ 1 ngày',
        },
        {
          stdinLines: ['kich-thuoc-ban-ghi=200,so-ngay-luu=7'],
          expected: 'can-lam-ro: qps',
          match: 'contains',
          hidden: true,
          label: 'thiếu trường đầu tiên trong thứ tự cố định',
        },
        {
          stdinLines: ['qps=100,so-ngay-luu=7'],
          expected: 'can-lam-ro: kich-thuoc-ban-ghi',
          match: 'contains',
          hidden: true,
          label: 'thiếu trường thứ hai — hỏi đúng một trường, không hỏi cả hai',
        },
        {
          stdinLines: ['qps=100,kich-thuoc-ban-ghi=200,so-ngay-luu=0'],
          expected: 'tu-choi: tham-so-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'giá trị 0 bị từ chối, không tính thành ước lượng 0',
        },
        {
          stdinLines: ['qps=-5,kich-thuoc-ban-ghi=200,so-ngay-luu=7'],
          expected: 'tu-choi: tham-so-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'giá trị âm',
        },
        {
          stdinLines: [''],
          expected: 'can-lam-ro: qps',
          match: 'contains',
          hidden: true,
          label: 'đặc tả rỗng vẫn phải hỏi trường đầu tiên',
        },
      ],
      hints: [
        'Tách dòng thành từ điển trước, rồi mới kiểm; đừng vừa tách vừa tính.',
        'Duyệt danh sách bắt buộc theo thứ tự và dừng ở trường thiếu ĐẦU TIÊN — hỏi một lần một thứ.',
        'Kiểm giá trị `<= 0` chỉ sau khi đã chắc chắn đủ trường; hai loại lỗi này cần hai thông báo khác nhau.',
      ],
      sampleSolution: `dong = input().strip()\n\nBAT_BUOC = ["qps", "kich-thuoc-ban-ghi", "so-ngay-luu"]\nGIAY_TRONG_NGAY = 86400\n\nde_bai = {}\nif dong != "":\n    for phan in dong.split(","):\n        if "=" not in phan:\n            continue\n        ten, gia_tri = phan.split("=", 1)\n        de_bai[ten.strip()] = gia_tri.strip()\n\nfor ten in BAT_BUOC:\n    if ten not in de_bai:\n        print("can-lam-ro: " + ten)\n        raise SystemExit\n\nso = {}\nfor ten in BAT_BUOC:\n    try:\n        so[ten] = int(de_bai[ten])\n    except ValueError:\n        print("tu-choi: tham-so-khong-hop-le")\n        raise SystemExit\n    if so[ten] <= 0:\n        print("tu-choi: tham-so-khong-hop-le")\n        raise SystemExit\n\nuoc_luong = so["qps"] * so["kich-thuoc-ban-ghi"] * GIAY_TRONG_NGAY * so["so-ngay-luu"]\nprint("uoc-luong: " + str(uoc_luong))`,
    },
    homework:
      'Lấy một đề thiết kế hệ thống bất kỳ bạn từng gặp, viết ra danh sách trường bắt buộc theo thứ tự bạn sẽ hỏi, rồi tự chấm: câu hỏi đầu tiên của bạn có phải là thứ chặn mọi tính toán phía sau không. Sau đó ước lượng dung lượng một năm và ghi rõ từng giả định bạn đã dùng.',
    srsCards: [
      {
        hoi: 'Vì sao phải hỏi trường thiếu ĐẦU TIÊN theo thứ tự cố định thay vì liệt kê hết?',
        dap: 'Vì hỏi một thứ tại một thời điểm cho thấy mạch suy nghĩ và giúp người đối diện trả lời được; với chương trình, thứ tự cố định còn là điều kiện để kết quả tất định và chấm được.',
      },
      {
        hoi: 'Công thức ước lượng dung lượng lưu trữ theo kiểu thiết kế hệ thống gồm những thừa số nào?',
        dap: 'Số yêu cầu mỗi giây nhân kích thước một bản ghi nhân số giây trong một ngày nhân số ngày giữ lại; mọi thừa số đều phải là dữ kiện đã được làm rõ trước.',
      },
      {
        hoi: 'Vì sao một tham số bằng 0 phải bị từ chối chứ không được nhân vào công thức?',
        dap: 'Vì kết quả 0 trông như một ước lượng hợp lệ nhưng thực ra là dấu hiệu đề sai hoặc dữ kiện chưa có; im lặng trả về 0 là giấu lỗi thay vì báo lỗi.',
      },
    ],
  },
  {
    id: 'p6-u233-l2',
    unitId: 'p6-u233',
    language: 'python',
    title: 'Giải thích lại cho người khác — kiểm đủ thành phần bắt buộc',
    hook: 'Nói được thuật toán chạy thế nào mới là nửa việc; nửa còn lại là nói được bạn đã giả định gì và đánh đổi cái gì.',
    theory:
      'Một lời giải được trình bày tốt luôn có ba thành phần: GIẢ ĐỊNH (bạn đã coi điều gì là đúng mà chưa kiểm), ĐÁNH ĐỔI (bạn được gì và mất gì so với phương án khác) và VÍ DỤ (một ca cụ thể chạy qua lời giải). Thiếu giả định thì người nghe không biết lời giải hỏng trong hoàn cảnh nào; thiếu đánh đổi thì nghe như quảng cáo; thiếu ví dụ thì không ai kiểm được bạn hiểu hay chỉ thuộc. Vì ba thành phần này là danh sách hữu hạn, việc kiểm chúng làm được bằng máy và tất định: rà theo thứ tự cố định, báo thành phần thiếu ĐẦU TIÊN, hoặc xác nhận đủ kèm số lượng. Đây là checklist tự chấm trước khi trình bày, không phải thang điểm chấm con người.',
    workedExample: {
      code: `BAT_BUOC = ["gia-dinh", "danh-doi", "vi-du"]\nda_neu = ["vi-du", "gia-dinh"]\nthieu = [ten for ten in BAT_BUOC if ten not in da_neu]\nprint(thieu)\nprint(len(da_neu))`,
      stdinLines: [],
    },
    predict: {
      code: `BAT_BUOC = ["gia-dinh", "danh-doi", "vi-du"]\nda_neu = ["danh-doi", "vi-du", "gia-dinh"]\nprint(all(ten in da_neu for ten in BAT_BUOC))\nprint(BAT_BUOC == da_neu)`,
      question: 'Hai dòng in ra là gì?',
      choices: ['True\nFalse', 'True\nTrue', 'False\nFalse', 'False\nTrue'],
      answerIndex: 0,
      explain:
        'Đủ ba thành phần nên dòng một là True; nhưng thứ tự nêu khác thứ tự trong danh sách nên so sánh hai danh sách bằng nhau cho False — đủ hay không mới là điều kiện, thứ tự trình bày thì không.',
    },
    parsons: {
      prompt: 'Xếp bước kiểm checklist trình bày theo thứ tự cố định.',
      lines: [
        'BAT_BUOC = ["gia-dinh", "danh-doi", "vi-du"]',
        'for ten in BAT_BUOC:',
        '    if ten not in da_neu:',
        '        print("thieu: " + ten)',
        '        raise SystemExit',
        'print("dat: " + str(len(BAT_BUOC)))',
      ],
    },
    make: {
      prompt:
        'Đọc MỘT dòng là danh sách thành phần đã nêu trong bản giải thích, cách nhau bởi dấu phẩy (dòng rỗng nghĩa là chưa nêu gì). Ba thành phần bắt buộc theo ĐÚNG thứ tự: `gia-dinh`, `danh-doi`, `vi-du`. Thiếu thì in `thieu: <thành phần ĐẦU TIÊN thiếu>` rồi dừng. Đủ cả ba thì in `dat: 3`. Thành phần lạ ngoài ba tên trên thì bỏ qua, không tính và cũng không báo lỗi. Thứ tự nêu trong input KHÔNG quan trọng, chỉ cần có đủ.',
      starterCode: `dong = input().strip()\n\n# Checklist tu cham truoc khi trinh bay.`,
      testCases: [
        {
          stdinLines: ['danh-doi,vi-du,gia-dinh'],
          expected: 'dat: 3',
          match: 'contains',
          hidden: false,
          label: 'đủ ba thành phần dù nêu khác thứ tự',
        },
        {
          stdinLines: ['danh-doi,vi-du'],
          expected: 'thieu: gia-dinh',
          match: 'contains',
          hidden: true,
          label: 'thiếu giả định',
        },
        {
          stdinLines: ['gia-dinh,vi-du'],
          expected: 'thieu: danh-doi',
          match: 'contains',
          hidden: true,
          label: 'thiếu đánh đổi',
        },
        {
          stdinLines: ['gia-dinh,danh-doi,do-phuc-tap'],
          expected: 'thieu: vi-du',
          match: 'contains',
          hidden: true,
          label: 'thành phần lạ không thay được thành phần bắt buộc',
        },
        {
          stdinLines: [''],
          expected: 'thieu: gia-dinh',
          match: 'contains',
          hidden: true,
          label: 'chưa nêu gì thì thiếu thành phần đầu tiên',
        },
      ],
      hints: [
        'Đưa các thành phần đã nêu vào một `set` để kiểm "có mặt" cho gọn.',
        'Duyệt danh sách BẮT BUỘC chứ không duyệt danh sách đã nêu — chỉ như vậy mới báo đúng thành phần thiếu đầu tiên.',
        'Bỏ qua phần tử rỗng sau khi tách, để dấu phẩy thừa không biến thành một thành phần lạ.',
      ],
      sampleSolution: `dong = input().strip()\n\nBAT_BUOC = ["gia-dinh", "danh-doi", "vi-du"]\n\nda_neu = set()\nif dong != "":\n    for phan in dong.split(","):\n        ten = phan.strip()\n        if ten != "":\n            da_neu.add(ten)\n\nfor ten in BAT_BUOC:\n    if ten not in da_neu:\n        print("thieu: " + ten)\n        raise SystemExit\n\nprint("dat: " + str(len(BAT_BUOC)))`,
    },
    homework:
      'Viết lại lời giải của một bài bạn đã làm ở chặng này theo đúng ba thành phần, mỗi thành phần tối đa ba câu, rồi đọc to trong năm phút. Nhờ một người không biết bài đó nghe và hỏi lại — mỗi câu hỏi của họ là một giả định bạn đã quên nêu.',
    srsCards: [
      {
        hoi: 'Ba thành phần bắt buộc của một bản trình bày lời giải là gì?',
        dap: 'Giả định đã dùng mà chưa kiểm, đánh đổi so với phương án khác, và một ví dụ cụ thể chạy qua lời giải để người nghe kiểm được là bạn hiểu chứ không thuộc.',
      },
      {
        hoi: 'Thiếu phần nêu giả định thì người nghe mất thông tin gì?',
        dap: 'Mất thông tin về hoàn cảnh lời giải sẽ hỏng: họ không biết lời giải dựa trên điều kiện nào, nên không đánh giá được nó có dùng được cho tình huống của họ hay không.',
      },
      {
        hoi: 'Vì sao checklist trình bày kiểm được bằng máy một cách tất định?',
        dap: 'Vì nó chỉ là một danh sách hữu hạn thành phần có thứ tự cố định, nên chương trình luôn báo đúng thành phần thiếu đầu tiên và cho cùng kết quả ở mọi lần chạy.',
      },
    ],
  },
]
