import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U195_LESSONS = [
  devopsSimulation({
    id: 'p6-u195-l1',
    unitId: 'p6-u195',
    title: 'GitOps: trạng thái mong muốn, drift và vòng reconcile',
    hook: 'Sửa tay lên cụm giải quyết sự cố trong năm phút rồi gây nhầm lẫn trong sáu tháng: Git không còn nói đúng hệ thống đang chạy cái gì.',
    theory:
      'Vòng reconcile so trạng thái mong muốn trong Git với live state. Thay đổi tay ngoài Git được báo là drift và KHÔNG bao giờ tự phê duyệt — người phải quyết định đưa nó vào Git hay hoàn nguyên. Vòng lặp có chặn trên số vòng để không quay vô hạn: hết vòng mà chưa hội tụ thì báo no-converge. Không có Argo hay Flux thật ở đây.',
    workedCode:
      '# MÔ PHỎNG phát hiện drift\nmanual = "yes"\nprint("drift: thay doi tay ngoai git, khong auto-approve" if manual == "yes" else "allow: reconcile")',
    predictCode:
      'git, live, rounds = "c1", "c2", 0\nprint("deny: no-converge" if git != live and rounds == 0 else "allow: reconcile")',
    predictChoices: ['deny: no-converge', 'allow: reconcile', 'drift: manual'],
    predictAnswer: 0,
    predictExplain:
      'Còn lệch mà đã hết số vòng cho phép thì vòng lặp dừng và báo không hội tụ, thay vì quay mãi.',
    makePrompt:
      'Đọc `git:<hash>,live:<hash>,manual:<yes|no>,rounds:<số>`. Thiếu trường hoặc sai kiểu → `invalid: <trường>`; manual yes → `drift: thay doi tay ngoai git, khong auto-approve`; git khác live và rounds = 0 → `deny: no-converge`; git khác live và rounds > 0 → `allow: reconcile hoi tu`; trùng nhau → `allow: reconcile no-op`. MÔ PHỎNG, không gọi Git, Argo, Flux hay cụm thật.',
    testCases: [
      {
        stdinLines: ['git:c1,live:c1,manual:no,rounds:3'],
        expected: 'allow: reconcile no-op',
        hidden: false,
        label: 'đã khớp thì vòng reconcile không làm gì',
      },
      {
        stdinLines: ['git:c1,live:c2,manual:no,rounds:3'],
        expected: 'allow: reconcile hoi tu',
        hidden: true,
        label: 'còn vòng thì kéo live về trạng thái mong muốn',
      },
      {
        stdinLines: ['git:c1,live:c2,manual:yes,rounds:3'],
        expected: 'drift: thay doi tay ngoai git',
        hidden: true,
        label: 'ca âm — sửa tay không được tự phê duyệt',
      },
      {
        stdinLines: ['git:c1,live:c2,manual:no,rounds:0'],
        expected: 'deny: no-converge',
        hidden: true,
        label: 'ca âm — hết vòng chặn trên vẫn chưa hội tụ',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"git", "live", "manual", "rounds"}: print("invalid: field")\n    elif not m["git"] or not m["live"]: print("invalid: hash")\n    elif m["manual"] not in {"yes", "no"}: print("invalid: manual")\n    elif not m["rounds"].isdigit(): print("invalid: rounds")\n    elif m["manual"] == "yes": print("drift: thay doi tay ngoai git, khong auto-approve")\n    elif m["git"] == m["live"]: print("allow: reconcile no-op")\n    elif int(m["rounds"]) == 0: print("deny: no-converge")\n    else: print("allow: reconcile hoi tu")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Trên một repo thử nghiệm, dựng vòng GitOps thật cho một ứng dụng vô hại, sửa tay một tài nguyên trên cụm rồi quan sát công cụ báo drift và cách nó hoàn nguyên.',
    cards: [
      {
        hoi: 'Vì sao drift không nên được tự động phê duyệt vào Git?',
        dap: 'Tự đưa thay đổi tay vào Git sẽ hợp thức hoá cả những sửa chữa sai hoặc độc hại mà chưa ai review.',
      },
      {
        hoi: 'Vì sao vòng reconcile cần chặn trên số vòng?',
        dap: 'Có những trạng thái không bao giờ hội tụ; chặn trên biến vòng lặp vô hạn thành một tín hiệu no-converge cho người xử lý.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u195-l2',
    unitId: 'p6-u195',
    title: 'overlay theo môi trường và bí mật đi bằng tham chiếu',
    hook: 'Overlay production thiếu một khoá bắt buộc thì bản deploy vẫn "thành công" — với cấu hình của môi trường khác.',
    theory:
      'Overlay theo môi trường chỉ được chấp nhận khi đủ khoá bắt buộc; thiếu khoá thì fail closed chứ không lặng lẽ dùng giá trị mặc định. Bí mật luôn đi bằng tham chiếu hoặc digest, simulator không bao giờ in giá trị bí mật ra output. Không có Helm hay Kustomize thật ở đây.',
    workedCode:
      '# MÔ PHỎNG tham chiếu bí mật\nsecret = "ref"\nprint("allow: overlay hop le, secret ref" if secret == "ref" else "deny: secret literal")',
    predictCode:
      'env, image = "prod", "no"\nprint("deny: overlay thieu khoa image" if env == "prod" and image == "no" else "allow: overlay hop le, secret ref")',
    predictChoices: [
      'deny: overlay thieu khoa image',
      'allow: overlay hop le, secret ref',
      'helm: rendered',
    ],
    predictAnswer: 0,
    predictExplain:
      'Overlay production thiếu khoá bắt buộc thì phải dừng, vì im lặng dùng mặc định là cách sai lệch cấu hình lan ra production.',
    makePrompt:
      'Đọc `env:<dev|prod>,image:<yes|no>,secret:<ref|literal>`. Thiếu trường hoặc giá trị lạ → `invalid: <trường>`; secret literal → `deny: secret phai di bang tham chieu`; env prod mà image no → `deny: overlay thieu khoa image`; còn lại → `allow: overlay hop le, secret ref`. Không in giá trị bí mật. MÔ PHỎNG, không chạy Helm, Kustomize hay secret manager thật.',
    testCases: [
      {
        stdinLines: ['env:prod,image:yes,secret:ref'],
        expected: 'allow: overlay hop le, secret ref',
        hidden: false,
        label: 'overlay đủ khoá và bí mật bằng tham chiếu',
      },
      {
        stdinLines: ['env:prod,image:no,secret:ref'],
        expected: 'deny: overlay thieu khoa image',
        hidden: true,
        label: 'thiếu khoá bắt buộc thì fail closed',
      },
      {
        stdinLines: ['env:dev,image:yes,secret:literal'],
        expected: 'deny: secret phai di bang tham chieu',
        hidden: true,
        label: 'ca âm — bí mật dạng giá trị bị chặn',
      },
      {
        stdinLines: ['env:staging,image:yes,secret:ref'],
        expected: 'invalid: env',
        hidden: true,
        label: 'ca âm — môi trường không nhận dạng được',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"env", "image", "secret"}: print("invalid: field")\n    elif m["env"] not in {"dev", "prod"}: print("invalid: env")\n    elif m["image"] not in {"yes", "no"}: print("invalid: image")\n    elif m["secret"] not in {"ref", "literal"}: print("invalid: secret")\n    elif m["secret"] == "literal": print("deny: secret phai di bang tham chieu")\n    elif m["env"] == "prod" and m["image"] == "no": print("deny: overlay thieu khoa image")\n    else: print("allow: overlay hop le, secret ref")\nexcept (ValueError, KeyError): print("invalid: input")',
    homework:
      'Dựng hai overlay dev và prod cho cùng một base thật, để bí mật ở secret manager ngoài cụm và chứng minh bản render không chứa giá trị bí mật nào.',
    cards: [
      {
        hoi: 'Vì sao bí mật nên đi bằng tham chiếu thay vì giá trị?',
        dap: 'Tham chiếu giữ giá trị ở nơi có kiểm soát truy cập và xoay vòng được, đồng thời không để bí mật lọt vào Git, log hay bản render.',
      },
      {
        hoi: 'Overlay thiếu khoá bắt buộc nên xử lý thế nào?',
        dap: 'Dừng lại và báo lỗi, vì dùng giá trị mặc định sẽ đưa cấu hình sai vào môi trường mà không ai nhận ra.',
      },
    ],
  }),
]
