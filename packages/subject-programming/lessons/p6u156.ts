import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U156_LESSONS = [
  devopsSimulation({
    id: 'p6-u156-l1',
    unitId: 'p6-u156',
    title: 'fail-fast và cấu hình bắt buộc',
    hook: 'Script deploy nuốt lỗi rồi chạy tiếp có thể phá trạng thái tốt. Dừng sớm với trace là một tính năng an toàn.',
    theory:
      'Automation phải từ chối biến cấu hình thiếu và command fail bằng nonzero exit. `set -euo pipefail` là cách Bash thường dùng, nhưng đây chỉ là mô hình Python.',
    workedCode:
      '# MÔ PHỎNG fail-fast\nconfig = ""\nprint("exit:2:missing-config" if not config else "deploy")',
    predictCode: 'steps = ["prepare", "fail", "deploy"]\nprint("exit:1:fail")',
    predictChoices: ['exit:1:fail', 'deploy', 'ignore-error'],
    predictAnswer: 0,
    predictExplain: 'Fail-fast không chạy bước deploy sau failure.',
    makePrompt:
      'Đọc `config`, `fail` hoặc `ok`. `config` in `exit:2:missing-config`; `fail` in `exit:1:command-failed`; `ok` in `exit:0:done`; lệnh khác `tu-choi`. MÔ PHỎNG exit status, không chạy Bash.',
    testCases: [
      {
        stdinLines: ['fail'],
        expected: 'exit:1:command-failed',
        match: 'exact',
        hidden: false,
        label: 'failure dừng script',
      },
      {
        stdinLines: ['config'],
        expected: 'exit:2:missing-config',
        match: 'exact',
        hidden: true,
        label: 'thiếu config fail closed',
      },
    ],
    sampleSolution:
      'x = input().strip()\nprint({"config": "exit:2:missing-config", "fail": "exit:1:command-failed", "ok": "exit:0:done"}.get(x, "tu-choi"))',
    homework:
      'Viết script Bash thử nghiệm với `set -euo pipefail`, cố ý làm một bước fail và chứng minh bước sau không chạy; không commit secret.',
    cards: [
      {
        hoi: 'Fail-fast tránh điều gì?',
        dap: 'Tránh chạy các bước sau trên giả định sai và làm trạng thái khó khôi phục.',
      },
      {
        hoi: 'Biến cấu hình thiếu nên có kết quả gì?',
        dap: 'Một lỗi rõ ràng, nonzero exit và không thay đổi trạng thái.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u156-l2',
    unitId: 'p6-u156',
    title: 'desired state, idempotency và secret scan',
    hook: 'Chạy deploy lần hai không được tạo thêm user/port; và xóa key khỏi file hiện tại không xóa nó khỏi Git history.',
    theory:
      'Desired state làm lần chạy lại thành unchanged. Secret policy quét cả source và history; fixture chỉ dùng placeholder redacted, không có credential dùng được.',
    workedCode:
      '# MÔ PHỎNG desired state\ninstalled = True\nprint("unchanged" if installed else "created")',
    predictCode:
      'history_has_placeholder = True\nprint("policy:secret-history" if history_has_placeholder else "policy:clean")',
    predictChoices: ['policy:secret-history', 'policy:clean', 'print-token'],
    predictAnswer: 0,
    predictExplain: 'History còn dấu vết thì policy fail; mô hình không in secret.',
    makePrompt:
      'Đọc `first`, `again`, `source-secret`, `history-secret`. `first` → `created`; `again` → `unchanged`; hai lệnh secret → `policy:secret-redacted`. Lệnh khác `tu-choi`. MÔ PHỎNG policy, không scan repo thật và không in token.',
    testCases: [
      {
        stdinLines: ['again'],
        expected: 'unchanged',
        match: 'exact',
        hidden: false,
        label: 'lần hai không đổi state',
      },
      {
        stdinLines: ['history-secret'],
        expected: 'policy:secret-redacted',
        match: 'exact',
        hidden: true,
        label: 'history bị chặn và redacted',
      },
    ],
    sampleSolution:
      'x = input().strip()\nprint({"first": "created", "again": "unchanged", "source-secret": "policy:secret-redacted", "history-secret": "policy:secret-redacted"}.get(x, "tu-choi"))',
    homework:
      'Tạo script idempotent trên máy thử và chạy hai lần; dùng công cụ phù hợp quét toàn bộ history, xoay bất cứ credential thật nào từng lộ.',
    cards: [
      {
        hoi: 'Idempotent nghĩa là gì khi deploy?',
        dap: 'Chạy lại đưa hệ về cùng desired state, không tích lũy tác dụng phụ.',
      },
      {
        hoi: 'Xóa secret khỏi file hiện tại có đủ?',
        dap: 'Không; history vẫn phải quét, credential đã lộ phải được xoay.',
      },
    ],
  }),
]
