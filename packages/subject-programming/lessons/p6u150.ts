// P6-U150 — systems-s2-m1: tiến trình, luồng và đồng bộ qua mô phỏng Python.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U150_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u150-l1',
    unitId: 'p6-u150',
    language: 'python',
    title: 'MÔ PHỎNG fork/exec/wait — zombie tồn tại đến khi được reap',
    hook: 'Tiến trình con đã kết thúc nhưng vẫn còn một dòng trong bảng tiến trình. Nó không còn chạy: kernel giữ exit status để cha có thể wait.',
    theory:
      'Bài này dùng state machine Python MÔ PHỎNG, không gọi process hay syscall Linux thật. `fork` tạo child riêng từ parent; mô hình chỉ sao chép tên image và không giả lập bộ nhớ. `exec` thay image của tiến trình đang chạy, không tạo PID mới. `exit` chuyển child thành `zombie` nếu parent còn sống và chưa `wait`; zombie không chạy nhưng còn exit status. `wait` thu status rồi chuyển child thành `reaped`. Nếu parent kết thúc trước child, bài đánh dấu child là `orphan` và giả định một reaper đồ chơi nhận nuôi; chi tiết init/subreaper phụ thuộc hệ thật. Signal trong mô hình là một sự kiện có thể làm child exit với status `signal:<n>`; không suy rộng thứ tự hay handler sang runtime thật.',
    workedExample: {
      code: `# MÔ PHỎNG logic, không gọi os.fork/exec/wait.
child = {"pid": 101, "image": "shell", "state": "running", "status": None}
child["image"] = "worker"       # exec: PID không đổi
child["state"] = "zombie"       # exit trước khi cha wait
child["status"] = "exit:0"
print(child["pid"], child["image"], child["state"])
print("reap", child["status"])
child["state"] = "reaped"`,
      stdinLines: [],
    },
    predict: {
      code: `child = {"state": "running", "status": None}
child["status"] = "signal:15"
child["state"] = "zombie"
print(child["state"], child["status"])
child["state"] = "reaped"
print(child["state"])`,
      question: 'Trace MÔ PHỎNG in gì khi child nhận signal 15 rồi cha wait?',
      choices: [
        'zombie signal:15\nreaped',
        'running signal:15\nreaped',
        'zombie exit:0\nrunning',
        'orphan signal:15\nzombie',
      ],
      answerIndex: 0,
      explain:
        'Signal làm child kết thúc nhưng status còn chờ cha thu nên trạng thái trung gian là zombie; wait mới reap bản ghi.',
    },
    parsons: {
      prompt: 'Xếp transition wait an toàn cho một child trong bảng tiến trình MÔ PHỎNG.',
      lines: [
        'def wait_child(child):',
        '    if child["state"] == "running":',
        '        return "dang-chay"',
        '    if child["state"] == "reaped":',
        '        return "da-reap"',
        '    status = child["status"]',
        '    child["state"] = "reaped"',
        '    return "reap:" + status',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG một parent P1 và child C1. Đọc các lệnh cách nhau bởi dấu phẩy: `fork`, `exec:<image>`, `exit:<code>`, `signal:<n>`, `wait`, `parent-exit`. Ban đầu chưa có child. In một dòng cho mỗi lệnh: `fork:C1:running`, `exec:C1:<image>`, `zombie:<status>`, `reap:<status>`, `dang-chay`, `orphan:C1`, `da-reap`, `khong-co-child` hoặc `lenh-khong-hop-le`. Chỉ `exec/exit/signal` khi child đang running; transition không hợp lệ in `trang-thai-khong-hop-le`. Đây là state machine Python hữu hạn, không phải syscall/runtime Linux thật.',
      starterCode: `lenh_list = [x.strip() for x in input().split(",") if x.strip()]
child = None
parent_alive = True

# MÔ PHỎNG duy nhat; khong tao process hoac gui signal that.
`,
      testCases: [
        {
          stdinLines: ['fork,exec:worker,exit:0,wait'],
          expected: 'fork:C1:running\nexec:C1:worker\nzombie:exit:0\nreap:exit:0',
          match: 'contains',
          hidden: false,
          label: 'fork, thay image, zombie rồi reap',
        },
        {
          stdinLines: ['fork,signal:15,wait,wait'],
          expected: 'fork:C1:running\nzombie:signal:15\nreap:signal:15\nda-reap',
          match: 'contains',
          hidden: true,
          label: 'giữ signal status và chặn reap lần hai',
        },
        {
          stdinLines: ['wait,fork,parent-exit,exit:7'],
          expected: 'khong-co-child\nfork:C1:running\norphan:C1\nzombie:exit:7',
          match: 'contains',
          hidden: true,
          label: 'child trở thành orphan trước khi kết thúc',
        },
        {
          stdinLines: ['fork,wait,exec:job,exit:0'],
          expected: 'fork:C1:running\ndang-chay\nexec:C1:job\nzombie:exit:0',
          match: 'contains',
          hidden: true,
          label: 'wait không reap child còn chạy',
        },
      ],
      hints: [
        'Giữ `state`, `image`, `status` và cờ `orphan` trong child.',
        '`exec` chỉ đổi image; `exit` và `signal` đều lưu status rồi thành zombie.',
        '`wait` chỉ reap zombie; running và reaped có kết quả riêng.',
      ],
      sampleSolution: `lenh_list = [x.strip() for x in input().split(",") if x.strip()]
child = None
parent_alive = True

for lenh in lenh_list:
    if lenh == "fork":
        if child is not None:
            print("trang-thai-khong-hop-le")
        else:
            child = {"state": "running", "image": "parent", "status": None, "orphan": False}
            print("fork:C1:running")
    elif lenh == "parent-exit":
        if not parent_alive:
            print("trang-thai-khong-hop-le")
        else:
            parent_alive = False
            if child is not None and child["state"] == "running":
                child["orphan"] = True
                print("orphan:C1")
            else:
                print("parent-exited")
    elif child is None:
        print("khong-co-child")
    elif lenh == "wait":
        if child["state"] == "running":
            print("dang-chay")
        elif child["state"] == "zombie":
            print("reap:" + child["status"])
            child["state"] = "reaped"
        else:
            print("da-reap")
    elif lenh.startswith("exec:"):
        image = lenh.split(":", 1)[1]
        if child["state"] != "running" or not image:
            print("trang-thai-khong-hop-le")
        else:
            child["image"] = image
            print("exec:C1:" + image)
    elif lenh.startswith("exit:") or lenh.startswith("signal:"):
        phan = lenh.split(":", 1)
        if child["state"] != "running" or not phan[1]:
            print("trang-thai-khong-hop-le")
        else:
            child["status"] = phan[0] + ":" + phan[1]
            child["state"] = "zombie"
            print("zombie:" + child["status"])
    else:
        print("lenh-khong-hop-le")`,
    },
    homework:
      'Trên Linux thật, viết chương trình C nhỏ tạo child, trì hoãn wait và quan sát trạng thái bằng công cụ hệ thống; lưu source, lệnh build và output. Sau đó thêm exec thất bại và kiểm return/error. Nếu chưa có toolchain thì ghi BLOCKED: simulator Python không chứng minh syscall thật.',
    srsCards: [
      {
        hoi: '`fork`, `exec` và `wait` khác nhau ở đâu?',
        dap: '`fork` tạo tiến trình con, `exec` thay image của tiến trình hiện tại mà giữ PID, còn `wait` thu exit status và reap child đã kết thúc.',
      },
      {
        hoi: 'Vì sao child đã exit vẫn có thể là zombie?',
        dap: 'Nó không còn chạy, nhưng kernel còn giữ bản ghi và exit status cho đến khi parent hoặc reaper gọi wait để thu.',
      },
      {
        hoi: 'Mô phỏng này không chứng minh điều gì?',
        dap: 'Nó không chạy process, syscall hay signal thật và không chứng minh chi tiết scheduling, memory copy hay adoption của một Linux cụ thể.',
      },
    ],
  },
  {
    id: 'p6-u150-l2',
    unitId: 'p6-u150',
    language: 'python',
    title: 'MÔ PHỎNG interleaving — bắt lost update và vòng deadlock',
    hook: 'Hai worker đều đọc bộ đếm bằng 0, đều tính 1 rồi cùng ghi 1. Không có dòng code nào “sai”, nhưng interleaving đã làm mất một lần tăng.',
    theory:
      'Concurrency phải được xét theo các bước nguyên tử và thứ tự xen kẽ. Read–modify–write không tự nguyên tử: hai task đọc cùng phiên bản rồi ghi có thể tạo lost update, một race vì kết quả phụ thuộc lịch. Mutex bảo vệ critical section bằng mutual exclusion; condition variable chỉ cho phép task ngủ tới khi predicate đúng và luôn phải kiểm lại predicate sau khi thức. Deadlock xuất hiện khi wait-for graph có chu trình, ví dụ A giữ L1 chờ L2 còn B giữ L2 chờ L1. Simulator Python này chạy trace hữu hạn, phát hiện cycle rồi dừng; nó không tạo thread, mutex hay scheduler runtime thật và không chứng minh một trace cụ thể luôn xảy ra trên máy thật.',
    workedExample: {
      code: `# MÔ PHỎNG hai phép tăng bị xen kẽ, không tạo thread thật.
shared = 0
doc = {"A": shared, "B": shared}
shared = doc["A"] + 1
shared = doc["B"] + 1
print("shared", shared)
print("race:lost-update" if shared != 2 else "an-toan")`,
      stdinLines: [],
    },
    predict: {
      code: `giu = {"L1": "A", "L2": "B"}
cho = {"A": giu["L2"], "B": giu["L1"]}
print("A->" + cho["A"])
print("B->" + cho["B"])
print("deadlock:A-B-A")`,
      question: 'Vì sao trace báo deadlock thay vì tiếp tục chờ?',
      choices: [
        'deadlock:A-B-A',
        'Cả hai lock đang rảnh',
        'Condition variable tự giải phóng cả hai lock',
        'Python luôn chạy đúng một task',
      ],
      answerIndex: 0,
      explain:
        'Mỗi task giữ tài nguyên task kia cần, tạo chu trình wait-for; simulator phát hiện và báo thay vì tự treo.',
    },
    parsons: {
      prompt: 'Xếp phép tăng có mutex trong state machine MÔ PHỎNG.',
      lines: [
        'def tang_co_khoa(state, task):',
        '    if state["owner"] not in (None, task):',
        '        return "blocked"',
        '    state["owner"] = task',
        '    state["value"] += 1',
        '    state["owner"] = None',
        '    return "ok"',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG trace đồng thời hữu hạn. Đọc các lệnh cách nhau bởi dấu phẩy: `read:<task>`, `write:<task>`, `lock:<task>:<L>`, `unlock:<task>:<L>`. `read` lưu snapshot bộ đếm; `write` ghi snapshot+1. Nếu một task khác đã ghi kể từ snapshot, in `race:lost-update:<task>` rồi vẫn ghi. Lock đã có owner khác tạo cạnh task→owner; ngay khi wait-for graph có chu trình, in `deadlock:<chu trình>` (dạng `A-B-A`) và bỏ cạnh vừa tạo để trace không treo. Unlock sai owner in `sai-owner`; lệnh/transition sai in `lenh-khong-hop-le`. Cuối cùng in `value=<n>`. Đây không phải thread/mutex runtime thật.',
      starterCode: `lenh_list = [x.strip() for x in input().split(",") if x.strip()]
value = 0
version = 0
snapshot = {}
locks = {}
waiting = {}

# MÔ PHỎNG trace tat dinh; khong tao thread that.
`,
      testCases: [
        {
          stdinLines: ['read:A,read:B,write:A,write:B'],
          expected: 'race:lost-update:B\nvalue=1',
          match: 'contains',
          hidden: false,
          label: 'hai read cùng phiên bản làm mất cập nhật',
        },
        {
          stdinLines: ['lock:A:L1,lock:B:L2,lock:A:L2,lock:B:L1'],
          expected: 'blocked:A->B\ndeadlock:B-A-B\nvalue=0',
          match: 'contains',
          hidden: true,
          label: 'phát hiện chu trình hai task mà không treo',
        },
        {
          stdinLines: ['lock:A:M,read:A,write:A,unlock:A:M,lock:B:M,read:B,write:B,unlock:B:M'],
          expected: 'value=2',
          match: 'contains',
          hidden: true,
          label: 'critical section tuần tự không lost update',
        },
        {
          stdinLines: ['lock:A:M,unlock:B:M,unlock:A:M'],
          expected: 'sai-owner\nvalue=0',
          match: 'contains',
          hidden: true,
          label: 'chỉ owner được unlock',
        },
      ],
      hints: [
        'Snapshot nên lưu cả `value` và `version` tại lúc read.',
        'Sau mỗi write tăng version; version khác snapshot nghĩa là task khác đã ghi xen vào.',
        'Mỗi task chỉ có một cạnh chờ; đi theo owner cho tới khi hết cạnh hoặc quay về điểm đầu.',
      ],
      sampleSolution: `lenh_list = [x.strip() for x in input().split(",") if x.strip()]
value = 0
version = 0
snapshot = {}
locks = {}
waiting = {}

def tim_chu_trinh(bat_dau):
    duong = [bat_dau]
    hien_tai = waiting.get(bat_dau)
    while hien_tai is not None:
        duong.append(hien_tai)
        if hien_tai == bat_dau:
            return duong
        if hien_tai in duong[:-1]:
            return None
        hien_tai = waiting.get(hien_tai)
    return None

for lenh in lenh_list:
    phan = lenh.split(":")
    if len(phan) == 2 and phan[0] == "read" and phan[1]:
        snapshot[phan[1]] = (value, version)
    elif len(phan) == 2 and phan[0] == "write" and phan[1] in snapshot:
        task = phan[1]
        gia_tri_doc, phien_ban_doc = snapshot[task]
        if phien_ban_doc != version:
            print("race:lost-update:" + task)
        value = gia_tri_doc + 1
        version += 1
        del snapshot[task]
    elif len(phan) == 3 and phan[0] == "lock" and phan[1] and phan[2]:
        task, khoa = phan[1], phan[2]
        owner = locks.get(khoa)
        if owner is None:
            locks[khoa] = task
            waiting.pop(task, None)
        elif owner == task:
            print("lenh-khong-hop-le")
        else:
            waiting[task] = owner
            chu_trinh = tim_chu_trinh(task)
            if chu_trinh:
                print("deadlock:" + "-".join(chu_trinh))
                del waiting[task]
            else:
                print("blocked:" + task + "->" + owner)
    elif len(phan) == 3 and phan[0] == "unlock" and phan[1] and phan[2]:
        task, khoa = phan[1], phan[2]
        if locks.get(khoa) != task:
            print("sai-owner")
        else:
            del locks[khoa]
            waiting.pop(task, None)
    else:
        print("lenh-khong-hop-le")

print("value=" + str(value))`,
    },
    homework:
      'Bổ sung transition condition variable `wait(predicate)` và `notify`: wait phải nhả mutex, khi thức phải giành lại mutex và kiểm predicate trong vòng lặp. Sau đó trên runtime thật tạo một race có kiểm soát và một bản sửa bằng mutex; nếu không chạy được thì ghi BLOCKED, không dùng trace mô phỏng làm bằng chứng.',
    srsCards: [
      {
        hoi: 'Vì sao `x = x + 1` có thể tạo lost update?',
        dap: 'Nó gồm read, tính và write; hai task có thể cùng đọc phiên bản cũ rồi ghi cùng kết quả, làm mất một cập nhật.',
      },
      {
        hoi: 'Điều kiện cấu trúc nào cho phép kết luận deadlock trong wait-for graph?',
        dap: 'Một chu trình cho biết mỗi task trong vòng đang chờ tài nguyên do task kế tiếp giữ, nên không task nào tự tiến được.',
      },
      {
        hoi: 'Vì sao condition variable phải kiểm predicate trong vòng lặp?',
        dap: 'Task có thể thức khi predicate chưa còn đúng hoặc thức không gắn với thay đổi mong muốn; nó phải giành lại mutex và kiểm lại trạng thái.',
      },
    ],
  },
]
