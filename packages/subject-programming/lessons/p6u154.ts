import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U154_LESSONS = [
  devopsSimulation({
    id: 'p6-u154-l1',
    unitId: 'p6-u154',
    title: 'service restart và journal',
    hook: 'Ứng dụng chết sau khi bạn đóng SSH. Một service supervisor tốt phải để lại trace và khởi động lại theo policy.',
    theory:
      'Service có trạng thái running, failed và restarting. Restart policy không sửa lỗi gốc; journal là bằng chứng để khoanh vùng trước khi bấm restart.',
    workedCode:
      '# MÔ PHỎNG, không gọi systemd\nstate = "failed"\nprint("journal:exit:1")\nstate = "restarting"\nprint("service:" + state)',
    predictCode: 'state = "failed"\nprint("journal:exit:1")\nprint("service:restarting")',
    predictChoices: [
      'journal:exit:1\nservice:restarting',
      'service:running',
      'restart-da-chung-minh',
    ],
    predictAnswer: 0,
    predictExplain:
      'Trace ghi failure trước; restarting chỉ là policy, không chứng minh ứng dụng đã healthy.',
    makePrompt:
      'Đọc một lệnh: `crash`, `restart`, `status` hoặc khác. Ban đầu service `running`. `crash` in `journal:exit:1` và thành failed; `restart` chỉ từ failed, in `service:restarting` rồi `service:running`; `status` in `service:<state>`. Sai transition in `tu-choi`. MÔ PHỎNG, không gọi systemctl/journalctl.',
    testCases: [
      {
        stdinLines: ['crash'],
        expected: 'journal:exit:1',
        match: 'exact',
        hidden: false,
        label: 'crash để lại journal',
      },
      {
        stdinLines: ['restart'],
        expected: 'tu-choi',
        match: 'exact',
        hidden: true,
        label: 'không restart service đang chạy',
      },
    ],
    sampleSolution:
      'lenh = input().strip()\nstate = "running"\nif lenh == "crash":\n    print("journal:exit:1")\nelif lenh == "restart" and state == "failed":\n    print("service:restarting\\nservice:running")\nelif lenh == "status":\n    print("service:" + state)\nelse:\n    print("tu-choi")',
    homework:
      'Trên Linux thật, cấu hình một service thử nghiệm có restart policy, cố ý làm nó exit và lưu journal; nếu chưa có host, ghi BLOCKED.',
    cards: [
      {
        hoi: 'Restart policy chứng minh điều gì?',
        dap: 'Chỉ chứng minh supervisor thử khởi động lại, không chứng minh nguyên nhân lỗi đã được sửa.',
      },
      {
        hoi: 'Journal dùng để làm gì?',
        dap: 'Giữ evidence theo thời gian để khoanh vùng failure trước khi thay đổi cấu hình.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u154-l2',
    unitId: 'p6-u154',
    title: 'triage tài nguyên và least privilege',
    hook: 'CPU còn thấp nhưng app vẫn không mở được socket mới: file descriptor hoặc disk có thể đã cạn.',
    theory:
      'Triage phải theo evidence: CPU, RAM, disk và file descriptor là các failure mode khác nhau. Quyền tối thiểu giảm blast radius; không suy luận root hay SSH key từ simulator.',
    workedCode:
      '# MÔ PHỎNG metric\nmetrics = {"cpu": 20, "ram": 40, "disk": 98, "fd": 12}\nprint("triage:disk")',
    predictCode: 'metrics = {"cpu": 10, "ram": 20, "disk": 20, "fd": 100}\nprint("triage:fd")',
    predictChoices: ['triage:fd', 'triage:cpu', 'healthy'],
    predictAnswer: 0,
    predictExplain: 'FD saturation có thể chặn mở file/kết nối dù CPU và RAM còn.',
    makePrompt:
      'Đọc `cpu:<n>,ram:<n>,disk:<n>,fd:<n>`. Nếu disk hoặc fd >= 95 ưu tiên lần lượt `triage:disk` rồi `triage:fd`; nếu ram >= 95 in `triage:ram`; nếu cpu >= 95 in `triage:cpu`; còn lại `triage:khong-du-bang-chung`. Input sai in `tu-choi`. MÔ PHỎNG, không đo máy thật.',
    testCases: [
      {
        stdinLines: ['cpu:20,ram:30,disk:98,fd:99'],
        expected: 'triage:disk',
        match: 'exact',
        hidden: false,
        label: 'disk ưu tiên khi cạn',
      },
      {
        stdinLines: ['cpu:10,ram:20,disk:20,fd:99'],
        expected: 'triage:fd',
        match: 'exact',
        hidden: true,
        label: 'fd không bị bỏ sót',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":") for x in input().strip().split(","))\n    n = {k: int(m[k]) for k in ("cpu", "ram", "disk", "fd")}\n    if n["disk"] >= 95: print("triage:disk")\n    elif n["fd"] >= 95: print("triage:fd")\n    elif n["ram"] >= 95: print("triage:ram")\n    elif n["cpu"] >= 95: print("triage:cpu")\n    else: print("triage:khong-du-bang-chung")\nexcept (ValueError, KeyError): print("tu-choi")',
    homework:
      'Trên máy thử, ghi baseline CPU/RAM/disk/fd, tạo một failure có kiểm soát rồi viết triage note kèm quyền service tối thiểu.',
    cards: [
      {
        hoi: 'Vì sao CPU thấp không loại trừ sự cố?',
        dap: 'Disk, RAM hoặc file descriptor có thể cạn và gây failure độc lập CPU.',
      },
      {
        hoi: 'Least privilege giảm gì?',
        dap: 'Giảm blast radius nếu service hoặc credential bị lạm dụng.',
      },
    ],
  }),
]
