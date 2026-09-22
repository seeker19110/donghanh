import { devopsSimulation } from './devopsS1LessonFactory.js'

/** CI/release is represented as small, deterministic evidence records, never a real pipeline. */
export const P6U179_LESSONS = [
  devopsSimulation({
    id: 'p6-u179-l1',
    unitId: 'p6-u179',
    title: 'quality gate song song và artifact bất biến (immutable)',
    hook: 'Một bản build “xanh” nhưng gắn artifact của commit khác vẫn có thể đưa sai mã nguồn ra môi trường canary.',
    theory:
      'Quality gate có thể chạy song song (test và lint), nhưng promotion chỉ xảy ra khi mọi evidence pass. Artifact immutable phải có digest và phải gắn đúng commit đang xét; thiếu hoặc mismatch thì fail closed, không promote.',
    workedCode:
      '# MÔ PHỎNG quality gate song song\ntest_ok = True  # Evidence test đã pass\nlint_ok = True  # Evidence lint đã pass\ncommit = "c42"  # Commit release đang xét\nartifact_commit = "c42"  # Commit được ghi trên artifact immutable\nprint("gate:promote" if test_ok and lint_ok and commit == artifact_commit else "gate:deny")',
    predictCode:
      'test_ok = True\nlint_ok = False\nprint("gate:promote" if test_ok and lint_ok else "gate:deny")',
    predictChoices: ['gate:deny', 'gate:promote', 'artifact:mutable'],
    predictAnswer: 0,
    predictExplain: 'Một nhánh quality gate fail là đủ để chặn promotion, dù nhánh còn lại pass.',
    makePrompt:
      'Đọc đúng một dòng `commit:<id>,tests:<pass|fail>,lint:<pass|fail>,artifact:<digest>|<id>`. `digest` không rỗng biểu diễn artifact immutable. In `gate:promote` chỉ khi tests và lint đều pass, digest có mặt, và id sau `|` khớp commit. Mọi gate fail, commit mismatch hay input thiếu/sai in `gate:deny`. MÔ PHỎNG thuần Python: không chạy CI, Git, registry hay deploy thật.',
    testCases: [
      {
        stdinLines: ['commit:c42,tests:pass,lint:pass,artifact:sha256abc|c42'],
        expected: 'gate:promote',
        match: 'contains',
        hidden: false,
        label: 'hai gate pass và artifact khớp commit',
      },
      {
        stdinLines: ['commit:c42,tests:pass,lint:pass,artifact:sha256abc|old9'],
        expected: 'gate:deny',
        match: 'contains',
        hidden: true,
        label: 'commit mismatch không được promote',
      },
      {
        stdinLines: ['commit:c42,tests:pass,lint:fail,artifact:sha256abc|c42'],
        expected: 'gate:deny',
        match: 'contains',
        hidden: true,
        label: 'negative: quality gate fail',
      },
    ],
    sampleSolution:
      'try:\n    parts = dict(item.split(":", 1) for item in input().strip().split(","))\n    digest, artifact_commit = parts["artifact"].split("|", 1)\n    ok = (parts["tests"] == "pass" and parts["lint"] == "pass" and bool(digest) and artifact_commit == parts["commit"])\n    print("gate:promote" if ok else "gate:deny")\nexcept (ValueError, KeyError):\n    print("gate:deny")',
    homework:
      'Trong CI thật của một repository thử nghiệm, ghi lại commit SHA, digest artifact và kết quả từng gate; diễn tập commit mismatch bằng artifact giả rồi chứng minh release bị chặn, không đẩy registry/cloud thật nếu bạn không có sandbox được phép.',
    cards: [
      {
        hoi: 'Vì sao artifact immutable phải gắn đúng commit?',
        dap: 'Digest chỉ nhận diện artifact; liên kết commit chứng minh artifact được xây cho đúng mã nguồn đang được xét release.',
      },
      {
        hoi: 'Quality gate song song có cho phép một gate fail không?',
        dap: 'Không. Các gate có thể chạy đồng thời để nhanh hơn, nhưng promotion cần evidence pass của toàn bộ gate bắt buộc.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u179-l2',
    unitId: 'p6-u179',
    title: 'ngưỡng sức khoẻ canary và rollback fail closed',
    hook: 'Canary chỉ phục vụ một phần traffic để phát hiện lỗi sớm; bỏ qua health threshold biến rollout nhỏ thành rủi ro lớn.',
    theory:
      'Canary chỉ promote khi health đạt threshold đã khai báo. Khi health thấp hơn threshold, rollback là hành động an toàn; nếu rollback evidence không sẵn sàng, trạng thái phải bị chặn fail closed thay vì tiếp tục rollout.',
    workedCode:
      '# MÔ PHỎNG canary health\nhealth = 82  # Health fixture hữu hạn\nthreshold = 90  # Ngưỡng đã duyệt\nrollback_ready = True  # Evidence rollback có sẵn\nif health < threshold:  # Canary không đạt ngưỡng\n    print("rollback:done" if rollback_ready else "rollback:blocked")\nelse:  # Canary đạt ngưỡng\n    print("canary:promote")',
    predictCode:
      'health = 75\nthreshold = 80\nprint("rollback:done" if health < threshold else "canary:promote")',
    predictChoices: ['rollback:done', 'canary:promote', 'canary:ignore-health'],
    predictAnswer: 0,
    predictExplain:
      'Health thấp hơn threshold kích đường rollback; không được promote dựa vào cảm tính.',
    makePrompt:
      'Đọc `health:<0-100>,threshold:<0-100>,rollback:<ready|missing>`. Nếu health >= threshold, in `canary:promote`. Nếu health < threshold và rollback ready, in `rollback:done`; nếu rollback missing, in `rollback:blocked` để fail closed. Số ngoài 0..100 hoặc input sai in `rollback:blocked`. MÔ PHỎNG, không đổi traffic, Kubernetes, load balancer hay môi trường cloud thật.',
    testCases: [
      {
        stdinLines: ['health:96,threshold:90,rollback:ready'],
        expected: 'canary:promote',
        match: 'contains',
        hidden: false,
        label: 'canary khoẻ được promote',
      },
      {
        stdinLines: ['health:70,threshold:90,rollback:ready'],
        expected: 'rollback:done',
        match: 'contains',
        hidden: true,
        label: 'health thấp kích rollback',
      },
      {
        stdinLines: ['health:70,threshold:90,rollback:missing'],
        expected: 'rollback:blocked',
        match: 'contains',
        hidden: true,
        label: 'negative: không có rollback thì fail closed',
      },
    ],
    sampleSolution:
      'try:\n    parts = dict(item.split(":", 1) for item in input().strip().split(","))\n    health, threshold = int(parts["health"]), int(parts["threshold"])\n    valid = 0 <= health <= 100 and 0 <= threshold <= 100\n    if not valid: print("rollback:blocked")\n    elif health >= threshold: print("canary:promote")\n    elif parts["rollback"] == "ready": print("rollback:done")\n    else: print("rollback:blocked")\nexcept (ValueError, KeyError):\n    print("rollback:blocked")',
    homework:
      'Trong sandbox được phép, định nghĩa metric health, threshold và runbook rollback cho một canary thật; ghi evidence trước/sau rollback. Nếu không có quyền Linux/cloud, nộp runbook và nêu rõ giới hạn, không giả lập quyền deploy là đã vận hành thật.',
    cards: [
      {
        hoi: 'Khi nào canary được promote?',
        dap: 'Chỉ khi health đo được đạt hoặc vượt threshold đã công bố và policy không có evidence chặn khác.',
      },
      {
        hoi: 'Vì sao rollback missing phải bị chặn?',
        dap: 'Canary unhealthy mà không có đường rollback đáng tin cậy không được tiếp tục rollout, vì rủi ro phải được fail closed.',
      },
    ],
  }),
]
