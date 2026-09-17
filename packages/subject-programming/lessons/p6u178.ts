import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U178_LESSONS = [
  devopsSimulation({
    id: 'p6-u178-l1',
    unitId: 'p6-u178',
    title: 'container policy: user, secret và base image',
    hook: 'Một image build xong chưa có nghĩa là được phép release: chạy root, mang secret hoặc dùng base mơ hồ đều là rủi ro phải chặn.',
    theory:
      'Policy container kiểm fixture Dockerfile theo hướng fail closed: user phải khác root, layer không chứa secret placeholder và base phải được pin bằng digest. Đây không phải Docker scanner thật.',
    workedCode:
      '# MÔ PHỎNG fixture policy\nfixture = {"user": "root", "secret": "no", "base": "sha256:abc"}\nprint("deny:root" if fixture["user"] == "root" else "allow:policy")',
    predictCode: 'has_secret = True\nprint("deny:secret" if has_secret else "allow:policy")',
    predictChoices: ['deny:secret', 'allow:policy', 'image:push'],
    predictAnswer: 0,
    predictExplain: 'Một layer có secret placeholder bị từ chối trước khi image được công nhận.',
    makePrompt:
      'Đọc fixture `user:<root|app>,secret:<yes|no>,base:<digest|tag>`. user root → `deny:root`; secret yes → `deny:secret`; base tag → `deny:base-unpinned`; đủ app/no/digest → `allow:policy`; thiếu/sai field → `deny:invalid`. MÔ PHỎNG, không build, scan hay push Docker image.',
    testCases: [
      {
        stdinLines: ['user:app,secret:no,base:digest'],
        expected: 'allow:policy',
        match: 'contains',
        hidden: false,
        label: 'fixture tối thiểu đạt policy',
      },
      {
        stdinLines: ['user:root,secret:no,base:digest'],
        expected: 'deny:root',
        match: 'contains',
        hidden: true,
        label: 'container root bị chặn',
      },
      {
        stdinLines: ['user:app,secret:maybe,base:digest'],
        expected: 'deny:invalid',
        match: 'contains',
        hidden: true,
        label: 'giá trị lạ fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"user", "secret", "base"} or m["user"] not in {"root", "app"} or m["secret"] not in {"yes", "no"} or m["base"] not in {"digest", "tag"}: print("deny:invalid")\n    elif m["user"] == "root": print("deny:root")\n    elif m["secret"] == "yes": print("deny:secret")\n    elif m["base"] != "digest": print("deny:base-unpinned")\n    else: print("allow:policy")\nexcept (ValueError, KeyError): print("deny:invalid")',
    homework:
      'Trong repository thử nghiệm, viết Dockerfile chạy non-root, pin base image bằng digest và dùng secret manager của môi trường CI; review log để chắc chắn không lộ secret.',
    cards: [
      {
        hoi: 'Vì sao policy nên từ chối container chạy root?',
        dap: 'Quyền root trong container làm tăng hậu quả khi tiến trình hoặc cấu hình bị khai thác, nên cần một user đặc quyền tối thiểu.',
      },
      {
        hoi: 'Pin base image bằng digest giải quyết điều gì?',
        dap: 'Digest cố định chính xác nội dung đã review, tránh tag thay đổi âm thầm khiến lần build sau dùng một base image khác.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u178-l2',
    unitId: 'p6-u178',
    title: 'SBOM và provenance trước release',
    hook: 'Một digest duy nhất chưa trả lời image đến từ đâu và gồm gì. Release cần evidence truy vết được, không chỉ một nhãn “đã build”.',
    theory:
      'Release policy đối chiếu fixture digest, SBOM và provenance. Thiếu bất cứ evidence nào hoặc digest provenance khác artifact đều phải deny; simulator không xác minh chữ ký hay registry thật.',
    workedCode:
      '# MÔ PHỎNG provenance\nartifact_digest = "d1"\nprovenance_digest = "d2"\nprint("deny:provenance-mismatch" if artifact_digest != provenance_digest else "allow:release")',
    predictCode:
      'sbom_present = False\nprint("deny:sbom-missing" if not sbom_present else "allow:release")',
    predictChoices: ['deny:sbom-missing', 'allow:release', 'registry:verified'],
    predictAnswer: 0,
    predictExplain:
      'Không có SBOM thì không đủ evidence thành phần để release, nên policy fail closed.',
    makePrompt:
      'Đọc `digest:<id>,sbom:<yes|no>,provenance:<id|missing>`. sbom no → `deny:sbom-missing`; provenance missing → `deny:provenance-missing`; provenance khác digest → `deny:provenance-mismatch`; còn lại `allow:release`. Trường thiếu, id rỗng hoặc input sai → `deny:invalid`. MÔ PHỎNG, không gọi registry, ký artifact hay phát hành image.',
    testCases: [
      {
        stdinLines: ['digest:sha256-a,sbom:yes,provenance:sha256-a'],
        expected: 'allow:release',
        match: 'contains',
        hidden: false,
        label: 'evidence cùng digest được chấp nhận',
      },
      {
        stdinLines: ['digest:sha256-a,sbom:no,provenance:sha256-a'],
        expected: 'deny:sbom-missing',
        match: 'contains',
        hidden: true,
        label: 'thiếu SBOM bị từ chối',
      },
      {
        stdinLines: ['digest:,sbom:yes,provenance:sha256-a'],
        expected: 'deny:invalid',
        match: 'contains',
        hidden: true,
        label: 'digest rỗng fail closed',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":", 1) for x in input().strip().split(","))\n    if set(m) != {"digest", "sbom", "provenance"} or not m["digest"] or m["sbom"] not in {"yes", "no"} or not m["provenance"]: print("deny:invalid")\n    elif m["sbom"] == "no": print("deny:sbom-missing")\n    elif m["provenance"] == "missing": print("deny:provenance-missing")\n    elif m["provenance"] != m["digest"]: print("deny:provenance-mismatch")\n    else: print("allow:release")\nexcept (ValueError, KeyError): print("deny:invalid")',
    homework:
      'Trong pipeline thử nghiệm, tạo SBOM và provenance cho một artifact vô hại, lưu digest bất biến cùng commit build, rồi chứng minh release gate từ chối evidence thiếu hoặc lệch.',
    cards: [
      {
        hoi: 'SBOM đóng góp evidence gì cho một artifact?',
        dap: 'SBOM liệt kê thành phần và phiên bản để đội vận hành có thể truy vết ảnh hưởng khi dependency có lỗ hổng hoặc cần thu hồi.',
      },
      {
        hoi: 'Vì sao provenance phải khớp digest artifact?',
        dap: 'Nếu provenance tham chiếu nội dung khác artifact, evidence không còn chứng minh được artifact đang release đã được build và review đúng quy trình.',
      },
    ],
  }),
]
