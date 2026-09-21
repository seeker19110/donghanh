// P6-U287 — desktop-s4-m2 "Cập nhật an toàn": phát hành theo kênh/theo tỉ lệ và quay lui khi
// health-check đỏ (bài 1), di trú dữ liệu người dùng qua nhiều phiên bản (bài 2). Đây là chặng
// duy nhất mà "rollback" là một kết luận hợp lệ, không phải một thất bại.
import { desktopSimulation } from './desktopLessonFactory.js'

export const P6U287_LESSONS = [
  desktopSimulation({
    id: 'p6-u287-l1',
    unitId: 'p6-u287',
    title: 'channel, rolloutPercent và rollback khi health-check đỏ',
    hook: 'Bản mới hỏng trên máy người dùng thì bạn không sửa nóng được như web — đường duy nhất là quay lui, và nó phải có sẵn từ trước.',
    theory:
      'Health-check sau cập nhật là luật ưu tiên tuyệt đối: đỏ thì rollback bất kể kênh phát hành hay tỉ lệ đang là bao nhiêu, vì máy người dùng đang ở trạng thái hỏng. Sau đó mới tới tính hợp lệ của tham số: rolloutPercent ngoài khoảng 0–100 là cấu hình sai nên trả invalid thay vì kẹp về biên trong im lặng. Phát hành theo tỉ lệ tồn tại chính là để rollback chỉ chạm một phần nhỏ người dùng.',
    workedCode:
      '# MÔ PHỎNG luật health-check sau cập nhật\nhealth_failed = "yes"\nprint("rollback: update failed health check" if health_failed == "yes" else "allow: rollout")',
    predictCode:
      'health_failed, channel, rollout_percent = "yes", "stable", 5\nif health_failed == "yes":\n    print("rollback: update failed health check")\nelif rollout_percent < 0 or rollout_percent > 100:\n    print("invalid: rolloutPercent")\nelse:\n    print("allow: rollout")',
    predictChoices: [
      'allow: rollout',
      'rollback: update failed health check',
      'invalid: rolloutPercent',
      'deny: unstable channel',
    ],
    predictAnswer: 1,
    predictExplain:
      'Health-check đỏ là luật ưu tiên tuyệt đối: kênh ổn định và tỉ lệ nhỏ cũng không đổi được kết luận, vì người dùng đã nhận bản hỏng.',
    makePrompt:
      'Đọc fixture `channel:<stable|beta>,rolloutPercent:<số>,healthCheckFailedAfterUpdate:<yes|no>`. Thiếu trường hoặc sai miền channel/yes-no → `invalid: <trường>`; healthCheckFailedAfterUpdate là yes → `rollback: update failed health check` (ưu tiên tuyệt đối); rolloutPercent không phải số nguyên trong khoảng 0–100 → `invalid: rolloutPercent`; còn lại → `allow: rollout`. MÔ PHỎNG, không phát hành hay cài bản cập nhật thật.',
    testCases: [
      {
        stdinLines: ['channel:stable,rolloutPercent:5,healthCheckFailedAfterUpdate:no'],
        expected: 'allow: rollout',
        hidden: false,
        label: 'phát hành dần trên kênh ổn định',
      },
      {
        stdinLines: ['channel:stable,rolloutPercent:5,healthCheckFailedAfterUpdate:yes'],
        expected: 'rollback: update failed health check',
        hidden: true,
        label: 'health-check đỏ thắng mọi luật khác',
      },
      {
        stdinLines: ['channel:beta,rolloutPercent:150,healthCheckFailedAfterUpdate:no'],
        expected: 'invalid: rolloutPercent',
        hidden: true,
        label: 'tỉ lệ ngoài khoảng 0–100',
      },
      {
        stdinLines: ['channel:canary,rolloutPercent:5,healthCheckFailedAfterUpdate:no'],
        expected: 'invalid: channel',
        hidden: true,
        label: 'ca âm — kênh ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"channel", "rolloutPercent", "healthCheckFailedAfterUpdate"}: print("invalid: field")\n    elif m["channel"] not in {"stable", "beta"}: print("invalid: channel")\n    elif m["healthCheckFailedAfterUpdate"] not in {"yes", "no"}: print("invalid: healthCheckFailedAfterUpdate")\n    elif m["healthCheckFailedAfterUpdate"] == "yes": print("rollback: update failed health check")\n    elif not m["rolloutPercent"].isdigit() or int(m["rolloutPercent"]) > 100: print("invalid: rolloutPercent")\n    else: print("allow: rollout")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, phát hành ba phiên bản liên tiếp của một app nhỏ qua cơ chế cập nhật tự động, cố tình làm hỏng bản thứ ba, rồi thực hiện quay lui thật về bản thứ hai và ghi lại từng bước bạn phải làm.',
    cards: [
      {
        hoi: 'Vì sao phát hành theo tỉ lệ lại quan trọng với app desktop hơn web?',
        dap: 'Vì bản cài nằm trên máy người dùng, không thu hồi được ngay; giới hạn tỉ lệ là cách giới hạn số máy dính bản hỏng.',
      },
      {
        hoi: 'Vì sao tham số sai nên trả invalid thay vì kẹp về biên?',
        dap: 'Vì kẹp im lặng giấu mất cấu hình sai; đội phát hành tưởng mình đang phát 150% trong khi thực tế là 100, và sai lệch đó lặp lại ở lần sau.',
      },
    ],
  }),
  desktopSimulation({
    id: 'p6-u287-l2',
    unitId: 'p6-u287',
    title: 'di trú dữ liệu qua nhiều phiên bản: tiến được, lùi được',
    hook: 'Quay lui bản cập nhật chỉ cứu được người dùng nếu dữ liệu đã bị bản mới nâng cấp vẫn mở lại được bằng bản cũ.',
    theory:
      'Quay lui phần mềm là dễ; quay lui DỮ LIỆU mới là chỗ mất mát xảy ra. Hợp đồng đòi ba điều theo thứ tự: chưa sao lưu trước khi di trú thì deny vì không còn đường lùi; chuỗi bước di trú đứt quãng (thiếu bước giữa) thì reject; di trú đã chạy nhưng chưa có đường hạ cấp thì trả unknown về khả năng quay lui, chứ không hứa là quay lui được.',
    workedCode:
      '# MÔ PHỎNG cổng sao lưu trước di trú\nbackup_before = "no"\nprint("deny: no backup before migrate" if backup_before == "no" else "allow: migrate")',
    predictCode:
      'backup_before, steps_contiguous, downgrade_path = "yes", "yes", "no"\nif backup_before == "no":\n    print("deny: no backup before migrate")\nelif steps_contiguous == "no":\n    print("reject: migration chain broken")\nelif downgrade_path == "no":\n    print("unknown: rollback not proven")\nelse:\n    print("allow: migrate")',
    predictChoices: [
      'allow: migrate',
      'deny: no backup before migrate',
      'reject: migration chain broken',
      'unknown: rollback not proven',
    ],
    predictAnswer: 3,
    predictExplain:
      'Có sao lưu và chuỗi bước liền mạch nên di trú tiến lên được, nhưng không có đường hạ cấp thì chưa thể khẳng định quay lui sẽ giữ nguyên dữ liệu.',
    makePrompt:
      'Đọc fixture `backupBefore:<yes|no>,stepsContiguous:<yes|no>,downgradePath:<yes|no>`. Thiếu trường hoặc sai miền → `invalid: <trường>`; backupBefore là no → `deny: no backup before migrate`; stepsContiguous là no → `reject: migration chain broken`; downgradePath là no → `unknown: rollback not proven`; còn lại → `allow: migrate`. MÔ PHỎNG, không chạy migration hay CSDL thật.',
    testCases: [
      {
        stdinLines: ['backupBefore:yes,stepsContiguous:yes,downgradePath:yes'],
        expected: 'allow: migrate',
        hidden: false,
        label: 'tiến được và lùi được',
      },
      {
        stdinLines: ['backupBefore:no,stepsContiguous:no,downgradePath:no'],
        expected: 'deny: no backup before migrate',
        hidden: true,
        label: 'không sao lưu thì không còn đường lùi',
      },
      {
        stdinLines: ['backupBefore:yes,stepsContiguous:no,downgradePath:yes'],
        expected: 'reject: migration chain broken',
        hidden: true,
        label: 'chuỗi bước di trú đứt quãng',
      },
      {
        stdinLines: ['backupBefore:yes,stepsContiguous:yes,downgradePath:no'],
        expected: 'unknown: rollback not proven',
        hidden: true,
        label: 'chưa có đường hạ cấp thì chưa hứa quay lui được',
      },
      {
        stdinLines: ['backupBefore:yes,stepsContiguous:yes,downgradePath:soon'],
        expected: 'invalid: downgradePath',
        hidden: true,
        label: 'ca âm — giá trị ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"backupBefore", "stepsContiguous", "downgradePath"}: print("invalid: field")\n    elif m["backupBefore"] not in {"yes", "no"}: print("invalid: backupBefore")\n    elif m["stepsContiguous"] not in {"yes", "no"}: print("invalid: stepsContiguous")\n    elif m["downgradePath"] not in {"yes", "no"}: print("invalid: downgradePath")\n    elif m["backupBefore"] == "no": print("deny: no backup before migrate")\n    elif m["stepsContiguous"] == "no": print("reject: migration chain broken")\n    elif m["downgradePath"] == "no": print("unknown: rollback not proven")\n    else: print("allow: migrate")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'NGOÀI sandbox, viết hai bước di trú dữ liệu cho app của bạn kèm bước hạ cấp tương ứng, rồi chạy đủ vòng tiến-lùi-tiến trên một bản sao dữ liệu thật và đối chiếu số bản ghi sau mỗi lượt.',
    cards: [
      {
        hoi: 'Vì sao quay lui phần mềm chưa đủ để gọi là quay lui an toàn?',
        dap: 'Vì dữ liệu đã bị bản mới nâng cấp; thiếu đường hạ cấp thì bản cũ mở không được và người dùng kẹt ở giữa.',
      },
      {
        hoi: 'Bản sao lưu trước di trú nên giữ tới khi nào?',
        dap: 'Tới khi bản mới đã chạy ổn qua vài phiên làm việc thật — xoá ngay sau khi migrate xong là bỏ mất lưới an toàn đúng lúc cần nhất.',
      },
    ],
  }),
]
