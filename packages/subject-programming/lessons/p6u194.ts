import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U194_LESSONS = [
  devopsSimulation({
    id: 'p6-u194-l1',
    unitId: 'p6-u194',
    title: 'workload contract: request, limit và readiness probe',
    hook: 'Một workload khai báo sai tài nguyên hoặc thiếu thăm dò sẵn sàng vẫn "chạy" — nó chỉ hỏng lúc có tải thật, đúng lúc không ai muốn.',
    theory:
      'Hợp đồng workload kiểm fixture theo thứ tự tất định: trường sai kiểu trước, rồi limit so với request, rồi readiness probe. limit nhỏ hơn request là cấu hình không thể lên lịch nên bị reject; thiếu readiness probe thì pod không được nhận traffic. Đây không phải API server Kubernetes thật.',
    workedCode:
      '# MÔ PHỎNG hợp đồng workload\nrequest, limit = 200, 100\nprint("reject: limit below request" if limit < request else "allow: schedule")',
    predictCode:
      'readiness = "no"\nprint("deny: no readiness probe" if readiness == "no" else "allow: schedule")',
    predictChoices: ['deny: no readiness probe', 'allow: schedule', 'pod: running'],
    predictAnswer: 0,
    predictExplain:
      'Không có readiness probe thì không có bằng chứng pod sẵn sàng, nên hợp đồng fail closed thay vì cho nhận traffic.',
    makePrompt:
      'Đọc fixture `request:<số>,limit:<số>,readiness:<yes|no>`. Sai kiểu hoặc thiếu trường → `invalid: <trường>`; limit < request → `reject: limit below request`; readiness no → `deny: no readiness probe`; còn lại → `allow: schedule`. MÔ PHỎNG, không gọi kubectl, API server hay cụm thật.',
    testCases: [
      {
        stdinLines: ['request:100,limit:200,readiness:yes'],
        expected: 'allow: schedule',
        hidden: false,
        label: 'hợp đồng đủ điều kiện lên lịch',
      },
      {
        stdinLines: ['request:200,limit:100,readiness:yes'],
        expected: 'reject: limit below request',
        hidden: true,
        label: 'limit nhỏ hơn request bị từ chối',
      },
      {
        stdinLines: ['request:100,limit:200,readiness:no'],
        expected: 'deny: no readiness probe',
        hidden: true,
        label: 'thiếu readiness probe thì không nhận traffic',
      },
      {
        stdinLines: ['request:abc,limit:200,readiness:yes'],
        expected: 'invalid: request',
        hidden: true,
        label: 'ca âm — sai kiểu fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"request", "limit", "readiness"}: print("invalid: field")\n    elif not m["request"].isdigit(): print("invalid: request")\n    elif not m["limit"].isdigit(): print("invalid: limit")\n    elif m["readiness"] not in {"yes", "no"}: print("invalid: readiness")\n    elif int(m["limit"]) < int(m["request"]): print("reject: limit below request")\n    elif m["readiness"] == "no": print("deny: no readiness probe")\n    else: print("allow: schedule")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên một cụm thử nghiệm NGOÀI sandbox, khai báo một Deployment có request/limit và cả hai probe sống/sẵn sàng, rồi cố tình đặt limit nhỏ hơn request để xem API server từ chối như thế nào.',
    cards: [
      {
        hoi: 'Vì sao limit nhỏ hơn request là cấu hình không hợp lệ?',
        dap: 'Request là mức tài nguyên được bảo đảm, limit là trần; trần thấp hơn mức bảo đảm là mâu thuẫn nên bộ lập lịch không thể thoả mãn.',
      },
      {
        hoi: 'Readiness probe khác liveness probe ở chỗ nào?',
        dap: 'Readiness quyết định pod có được nhận traffic hay không, liveness quyết định pod có bị khởi động lại hay không.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u194-l2',
    unitId: 'p6-u194',
    title: 'tự mở rộng và ngân sách gián đoạn',
    hook: 'Tự mở rộng không giới hạn đốt tiền, còn ngân sách gián đoạn quá chặt thì khoá cứng mọi lần bảo trì — hai luật này phải xét cùng nhau.',
    theory:
      'Simulator xét ngân sách gián đoạn trước tự mở rộng vì một cụm không drain được là rủi ro vận hành nặng hơn việc thiếu replica. minAvailable 100% khoá drain vĩnh viễn nên bị deny; số replica mong muốn vượt maxReplicas bị clamp kèm cảnh báo chứ không im lặng. Không có HPA controller thật ở đây.',
    workedCode:
      '# MÔ PHỎNG clamp HPA\ndesired, max_replicas = 9, 5\nprint("allow: clamp to max, canh bao vuot maxReplicas" if desired > max_replicas else "allow: scale")',
    predictCode:
      'min_available = 100\nprint("deny: minAvailable 100 khoa drain" if min_available == 100 else "allow: scale")',
    predictChoices: ['deny: minAvailable 100 khoa drain', 'allow: scale', 'node: drained'],
    predictAnswer: 0,
    predictExplain:
      'minAvailable bằng 100% nghĩa là không pod nào được phép rời đi, nên node không bao giờ drain xong.',
    makePrompt:
      'Đọc `desired:<số>,max:<số>,minAvailable:<0-100>`. Sai kiểu hoặc thiếu trường → `invalid: <trường>`; minAvailable = 100 → `deny: minAvailable 100 khoa drain`; desired > max → `allow: clamp to max, canh bao vuot maxReplicas`; còn lại → `allow: scale`. MÔ PHỎNG, không gọi HPA hay cụm thật.',
    testCases: [
      {
        stdinLines: ['desired:3,max:5,minAvailable:50'],
        expected: 'allow: scale',
        hidden: false,
        label: 'trong ngưỡng thì mở rộng bình thường',
      },
      {
        stdinLines: ['desired:9,max:5,minAvailable:50'],
        expected: 'allow: clamp to max',
        hidden: true,
        label: 'vượt maxReplicas bị clamp kèm cảnh báo',
      },
      {
        stdinLines: ['desired:3,max:5,minAvailable:100'],
        expected: 'deny: minAvailable 100 khoa drain',
        hidden: true,
        label: 'ca âm — ngân sách gián đoạn khoá drain',
      },
      {
        stdinLines: ['desired:3,max:5,minAvailable:150'],
        expected: 'invalid: minAvailable',
        hidden: true,
        label: 'ca âm — giá trị ngoài miền fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"desired", "max", "minAvailable"}: print("invalid: field")\n    elif not m["desired"].isdigit(): print("invalid: desired")\n    elif not m["max"].isdigit(): print("invalid: max")\n    elif not m["minAvailable"].isdigit() or int(m["minAvailable"]) > 100: print("invalid: minAvailable")\n    elif int(m["minAvailable"]) == 100: print("deny: minAvailable 100 khoa drain")\n    elif int(m["desired"]) > int(m["max"]): print("allow: clamp to max, canh bao vuot maxReplicas")\n    else: print("allow: scale")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên cụm thử nghiệm thật, đặt một PodDisruptionBudget với minAvailable 100% rồi thử drain node để quan sát lệnh treo, sau đó hạ xuống mức cho phép bảo trì và ghi lại khác biệt.',
    cards: [
      {
        hoi: 'Vì sao clamp số replica phải kèm cảnh báo?',
        dap: 'Clamp im lặng khiến đội vận hành tưởng đã mở rộng đủ, trong khi hệ thống thực ra đang chạm trần và vẫn thiếu năng lực.',
      },
      {
        hoi: 'Ngân sách gián đoạn dùng để làm gì?',
        dap: 'Nó giới hạn số pod được phép mất cùng lúc trong các thao tác chủ động, để bảo trì không vô tình làm sập dịch vụ.',
      },
    ],
  }),
]
