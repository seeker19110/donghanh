// P6-U151 — systems-s2-m2: I/O, file durability và bộ nhớ ánh xạ.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U151_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u151-l1',
    unitId: 'p6-u151',
    language: 'python',
    title: 'MÔ PHỎNG file descriptor, pipe và partial I/O',
    hook: 'Một lần `write` xin gửi 8 byte nhưng chỉ có 3 byte đi vào pipe. Nếu chương trình coi “không lỗi” là “đã gửi hết”, 5 byte còn lại biến mất khỏi giao thức.',
    theory:
      'Bài dùng MÔ PHỎNG Python hữu hạn, không gọi `open`, `pipe`, `dup2`, `read` hay `write` của hệ điều hành thật. File descriptor (fd) là số nguyên tra vào bảng tài nguyên của tiến trình: theo quy ước thường gặp, 0 là stdin, 1 là stdout và 2 là stderr. Redirect thay mục tiêu của một fd; ví dụ fd 1 có thể trỏ vào đầu ghi của pipe thay vì terminal. Pipe là luồng byte có dung lượng hữu hạn. `write` có thể chỉ nhận một tiền tố khi còn ít chỗ (partial write), hoặc nhận 0 byte trong mô hình non-blocking khi đầy (backpressure); bên gửi phải giữ phần chưa gửi để thử lại. `read(n)` lấy tối đa n byte đang có, nên cũng có thể trả ít hơn yêu cầu. Đọc pipe rỗng khi đầu ghi còn mở là “chưa có dữ liệu”, không phải EOF. EOF chỉ xuất hiện khi buffer rỗng và mọi đầu ghi đã đóng. Mô hình này đếm ký tự ASCII như byte và không mô phỏng scheduler, kernel buffer hay tính atomic thật của pipe.',
    workedExample: {
      code: `# MÔ PHỎNG: stdout (fd 1) được redirect vào pipe dung lượng 4.
buffer = ""
du_lieu = "ABCDEF"
nhan = min(len(du_lieu), 4 - len(buffer))
buffer += du_lieu[:nhan]
con_lai = du_lieu[nhan:]
print("write", nhan, "pending", con_lai)
doc = buffer[:3]
buffer = buffer[3:]
print("read", doc, "buffer", buffer)`,
      stdinLines: [],
    },
    predict: {
      code: `buffer = ""
writer_open = True
print("wait" if writer_open and not buffer else "eof")
writer_open = False
print("wait" if writer_open and not buffer else "eof")`,
      question: 'Hai lần đọc pipe rỗng trong MÔ PHỎNG cho kết quả nào?',
      choices: ['wait\neof', 'eof\neof', 'wait\nwait', 'eof\nwait'],
      answerIndex: 0,
      explain:
        'Buffer rỗng chưa đủ tạo EOF: khi writer còn mở, reader phải chờ hoặc nhận would-block. Sau khi writer đóng và buffer vẫn rỗng, reader mới thấy EOF.',
    },
    parsons: {
      prompt: 'Xếp hàm MÔ PHỎNG một partial write, trả lại buffer mới và phần dữ liệu chưa gửi.',
      lines: [
        'def ghi_mot_lan(buffer, data, capacity):',
        '    cho_trong = max(0, capacity - len(buffer))',
        '    so_byte = min(len(data), cho_trong)',
        '    buffer += data[:so_byte]',
        '    pending = data[so_byte:]',
        '    return buffer, pending',
      ],
    },
    make: {
      prompt:
        'Viết MÔ PHỎNG fd 1 và pipe bằng chuỗi ASCII. Đọc: đích của fd 1 (`terminal` hoặc `pipe`), dung lượng pipe, kích thước mỗi lần đọc, rồi một dòng thao tác cách nhau bởi dấu phẩy. Thao tác là `w:<text>`, `r`, `close`. Với terminal, `w:x` sinh `terminal:x`; `r` sinh `khong-phai-pipe`. Với pipe, mỗi `w` chỉ nhận tối đa chỗ trống và sinh `write=<n>;pending=<phần-còn-lại>`; nếu n=0 dùng `backpressure;pending=<text>`. `r` lấy tối đa kích thước đọc và sinh `read=<text>`; pipe rỗng sinh `wait` khi writer mở, `eof` khi đã đóng. `close` sinh `closed` lần đầu, `already-closed` các lần sau; ghi sau close sinh `writer-closed`. In mỗi sự kiện trên một dòng. Dữ liệu sau dấu `w:` không chứa dấu phẩy. Input sai sinh duy nhất `input-khong-hop-le`.',
      starterCode: `dich_fd1 = input().strip()
capacity = int(input())
read_size = int(input())
operations = [x.strip() for x in input().split(",")]

# MÔ PHỎNG hữu hạn, không gọi syscall hay tạo pipe thật.
`,
      testCases: [
        {
          stdinLines: ['pipe', '4', '3', 'w:ABCDEF,r,w:XY,r,close,r'],
          expected: 'write=4;pending=EF\nread=ABC\nwrite=2;pending=\nread=DXY\nclosed\neof',
          match: 'contains',
          hidden: false,
          label: 'partial write, đọc rồi giải phóng backpressure',
        },
        {
          stdinLines: ['pipe', '2', '2', 'w:AB,w:C,r,r,close,r'],
          expected: 'write=2;pending=\nbackpressure;pending=C\nread=AB\nwait\nclosed\neof',
          match: 'contains',
          hidden: true,
          label: 'pipe đầy và phân biệt wait với EOF',
        },
        {
          stdinLines: ['terminal', '8', '2', 'w:hello,r,close,w:x'],
          expected: 'terminal:hello\nkhong-phai-pipe\nclosed\nwriter-closed',
          match: 'contains',
          hidden: true,
          label: 'redirect stdout về terminal và đóng writer',
        },
        {
          stdinLines: ['pipe', '0', '2', 'w:A'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'từ chối dung lượng không dương',
        },
      ],
      hints: [
        'Giữ `buffer` và `writer_open`; đừng tự động ghi lại phần pending vì đề bài mô phỏng từng syscall riêng.',
        'Số byte nhận là `min(len(text), capacity - len(buffer))`.',
        'Chỉ trả EOF khi `buffer == ""` và `writer_open` là false.',
      ],
      sampleSolution: `dich_fd1 = input().strip()
try:
    capacity = int(input())
    read_size = int(input())
    operations = [x.strip() for x in input().split(",")]
except (ValueError, EOFError):
    print("input-khong-hop-le")
    raise SystemExit

if dich_fd1 not in {"terminal", "pipe"} or capacity <= 0 or read_size <= 0 or any(not x for x in operations):
    print("input-khong-hop-le")
else:
    buffer = ""
    writer_open = True
    for operation in operations:
        if operation == "close":
            if writer_open:
                writer_open = False
                print("closed")
            else:
                print("already-closed")
        elif operation == "r":
            if dich_fd1 != "pipe":
                print("khong-phai-pipe")
            elif buffer:
                data = buffer[:read_size]
                buffer = buffer[read_size:]
                print("read=" + data)
            elif writer_open:
                print("wait")
            else:
                print("eof")
        elif operation.startswith("w:"):
            data = operation[2:]
            if not writer_open:
                print("writer-closed")
            elif dich_fd1 == "terminal":
                print("terminal:" + data)
            else:
                accepted = min(len(data), capacity - len(buffer))
                buffer += data[:accepted]
                pending = data[accepted:]
                if accepted == 0 and data:
                    print("backpressure;pending=" + pending)
                else:
                    print("write=" + str(accepted) + ";pending=" + pending)
        else:
            print("input-khong-hop-le")`,
    },
    homework:
      'Mở rộng MÔ PHỎNG bằng hàng đợi `pending` và vòng lặp retry sau mỗi lần đọc. Đưa ra invariant “dữ liệu đã đọc + đang trong buffer + còn pending bằng dữ liệu ban đầu”, rồi tạo trace có ít nhất hai partial write. Không gọi pipe hoặc syscall thật.',
    srsCards: [
      {
        hoi: 'File descriptor và tài nguyên khác nhau thế nào?',
        dap: 'File descriptor là chỉ số trong bảng của tiến trình; mục bảng mới tham chiếu tài nguyên như file, terminal hoặc một đầu pipe.',
      },
      {
        hoi: 'Vì sao phải kiểm tra giá trị trả về của write?',
        dap: 'Một write hợp lệ vẫn có thể ghi ít byte hơn yêu cầu; chương trình phải giữ và gửi tiếp phần còn lại.',
      },
      {
        hoi: 'Khi nào đọc pipe rỗng thấy EOF?',
        dap: 'Chỉ khi buffer đã rỗng và mọi đầu ghi của pipe đã đóng; nếu còn đầu ghi thì đó là trạng thái chờ hoặc would-block.',
      },
    ],
  },
  {
    id: 'p6-u151-l2',
    unitId: 'p6-u151',
    language: 'python',
    title: 'MÔ PHỎNG durability và mmap hữu hạn',
    hook: 'Đã `rename` file mới vào đúng tên vẫn chưa đồng nghĩa tên đó sống sót sau mất điện: dữ liệu file và thay đổi thư mục là hai lớp bền vững khác nhau.',
    theory:
      'Bài ghép hai MÔ PHỎNG độc lập, không ghi file, gọi `fsync`, `rename`, `mmap` hay điều khiển page cache thật. Trong giao thức atomic replace đồ chơi, ta ghi file tạm, `fsync(temp)` để làm bền nội dung, `rename(temp, target)` để đổi tên nguyên tử trong trạng thái đang chạy, rồi `fsync(directory)` để làm bền cập nhật namespace. Nếu crash trước rename, target bền vững vẫn là bản cũ; crash sau rename nhưng trước fsync thư mục được ghi là `uncertain` vì mô hình không cam kết target cũ hay mới; sau fsync thư mục mới cam kết bản mới. Atomicity và durability là hai thuộc tính khác nhau. Phần mmap dùng cache trang LRU hữu hạn: truy cập trang có sẵn là hit; trang vắng là fault, và khi đầy thì đẩy trang ít được dùng gần đây nhất. Đây chỉ là mô hình trạng thái để học locality/page fault, không đại diện chính xác thuật toán thay trang, dirty page, SIGBUS hay thời điểm flush của một OS cụ thể.',
    workedExample: {
      code: `# MÔ PHỎNG giao thức replace; không đụng filesystem thật.
steps = ["write-temp", "fsync-temp", "rename", "fsync-dir"]
for step in steps:
    print(step)
print("durable=new")

# Cache trang LRU hữu hạn 2 frame.
cache = []
for page in [0, 1, 0, 2]:
    if page in cache:
        cache.remove(page)
    elif len(cache) == 2:
        cache.pop(0)
    cache.append(page)
print(cache)`,
      stdinLines: [],
    },
    predict: {
      code: `cache = []
for page in [1, 2, 1, 3]:
    if page in cache:
        cache.remove(page)
    elif len(cache) == 2:
        print("evict", cache.pop(0))
    cache.append(page)`,
      question: 'Cache LRU hai frame đẩy trang nào khi truy cập trang 3?',
      choices: ['evict 2', 'evict 1', 'evict 3', 'no-evict'],
      answerIndex: 0,
      explain:
        'Lần truy cập lại trang 1 làm nó mới dùng gần nhất; trang 2 trở thành ít dùng gần đây nhất và bị đẩy.',
    },
    parsons: {
      prompt: 'Xếp thứ tự giao thức MÔ PHỎNG thay file vừa atomic vừa durable.',
      lines: [
        'write_temp(new_content)',
        'fsync_temp()',
        'rename_temp_to_target()',
        'fsync_parent_directory()',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG crash durability và cache trang LRU. Đọc mốc crash (`after-temp`, `after-fsync-temp`, `after-rename`, `after-fsync-dir`, hoặc `none`), số frame dương, rồi danh sách số trang không âm cách nhau bởi dấu phẩy. In `durable=old` cho hai mốc trước rename, `durable=uncertain` sau rename nhưng trước fsync thư mục, và `durable=new` sau fsync thư mục hoặc không crash. Tiếp theo in `hits=<n>;faults=<n>`, `evicted=<các-trang-cách-nhau-bởi-dấu-phẩy>` (hoặc `evicted=none`), và `frames=<LRU->MRU>` (hoặc `frames=empty`). Input sai sinh duy nhất `input-khong-hop-le`.',
      starterCode: `crash = input().strip()
frame_count = int(input())
pages = [int(x.strip()) for x in input().split(",") if x.strip()]

# MÔ PHỎNG hữu hạn, không gọi fsync, rename hay mmap thật.
`,
      testCases: [
        {
          stdinLines: ['after-rename', '2', '1,2,1,3'],
          expected: 'durable=uncertain\nhits=1;faults=3\nevicted=2\nframes=1,3',
          match: 'contains',
          hidden: false,
          label: 'namespace chưa bền và LRU có một eviction',
        },
        {
          stdinLines: ['after-fsync-temp', '1', '0,0,2'],
          expected: 'durable=old\nhits=1;faults=2\nevicted=0\nframes=2',
          match: 'contains',
          hidden: true,
          label: 'nội dung temp bền nhưng target vẫn cũ',
        },
        {
          stdinLines: ['none', '3', ''],
          expected: 'durable=new\nhits=0;faults=0\nevicted=none\nframes=empty',
          match: 'contains',
          hidden: true,
          label: 'chuỗi trang rỗng và replace hoàn tất',
        },
        {
          stdinLines: ['after-fsync-dir', '0', '1'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'từ chối cache không có frame',
        },
      ],
      hints: [
        'Ánh xạ durability chỉ phụ thuộc mốc crash; đừng dùng sự hiện diện của file tạm để kết luận target mới đã bền.',
        'Giữ list cache theo thứ tự LRU đến MRU; hit thì bỏ trang khỏi vị trí cũ rồi append.',
        'Fault khi đầy: `pop(0)` trước khi append trang mới và ghi trang bị đẩy vào danh sách.',
      ],
      sampleSolution: `crash = input().strip()
try:
    frame_count = int(input())
    raw_pages = input().strip()
    pages = [] if raw_pages == "" else [int(x.strip()) for x in raw_pages.split(",")]
except (ValueError, EOFError):
    print("input-khong-hop-le")
    raise SystemExit

valid_crashes = {"after-temp", "after-fsync-temp", "after-rename", "after-fsync-dir", "none"}
if crash not in valid_crashes or frame_count <= 0 or any(page < 0 for page in pages):
    print("input-khong-hop-le")
else:
    if crash in {"after-temp", "after-fsync-temp"}:
        durable = "old"
    elif crash == "after-rename":
        durable = "uncertain"
    else:
        durable = "new"

    cache = []
    evicted = []
    hits = 0
    faults = 0
    for page in pages:
        if page in cache:
            hits += 1
            cache.remove(page)
        else:
            faults += 1
            if len(cache) == frame_count:
                evicted.append(cache.pop(0))
        cache.append(page)

    print("durable=" + durable)
    print("hits=" + str(hits) + ";faults=" + str(faults))
    print("evicted=" + (",".join(map(str, evicted)) if evicted else "none"))
    print("frames=" + (",".join(map(str, cache)) if cache else "empty"))`,
    },
    homework:
      'Vẽ state machine MÔ PHỎNG cho bốn bước atomic replace và đánh dấu kết quả crash ở từng cạnh. Sau đó chạy tay cache LRU ba frame với chuỗi `0,1,2,0,3,1,4`, đếm hit/fault và nêu vì sao kết quả không phải cam kết của mmap thật.',
    srsCards: [
      {
        hoi: 'Vì sao fsync file tạm chưa đủ làm target mới bền?',
        dap: 'Nó làm bền nội dung file tạm, nhưng target chưa trỏ tới file đó; sau rename còn phải làm bền cập nhật namespace của thư mục.',
      },
      {
        hoi: 'Atomic rename và durability khác nhau thế nào?',
        dap: 'Atomic rename tránh trạng thái tên nửa cũ nửa mới khi quan sát; durability nói thay đổi có sống qua crash hay không.',
      },
      {
        hoi: 'Hit, fault và eviction trong mô hình trang hữu hạn là gì?',
        dap: 'Hit là trang đã ở frame; fault là phải nạp trang vắng; eviction là đẩy một trang cũ khi mọi frame đều đầy.',
      },
    ],
  },
]
