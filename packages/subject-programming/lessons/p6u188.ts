// P6-U188 — security-s2-m3: defensive exposure and secret triage.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U188_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u188-l1',
    unitId: 'p6-u188',
    language: 'python',
    title: 'MÔ PHỎNG phân loại exposure inventory đã redacted',
    hook: 'Một service xuất hiện trong inventory chưa nói lên rủi ro; visibility, approval và cấu hình mới quyết định bước review.',
    theory:
      'Inventory này là fixture synthetic/redacted gồm service class, visibility và config state, không phải port hay target thật. Public service với config `unapproved` được đưa vào manual review; private hoặc approved không tự động là incident. Triage in category và owner cue, sau đó con người có thẩm quyền xác minh scope.',
    workedExample: {
      code: '# Fixture khong chua host, port hay target that.\nservice, visibility, config = "api|public|unapproved".split("|")\nprint("review" if visibility == "public" and config == "unapproved" else "inventory-ok")',
      stdinLines: [],
    },
    predict: {
      code: 'visibility, config = "private", "unapproved"\nprint("review" if visibility == "public" and config == "unapproved" else "inventory-ok")',
      question: 'Một item private/unapproved được simulator đánh dấu gì?',
      choices: ['review', 'inventory-ok', 'scan', 'exploit'],
      answerIndex: 1,
      explain:
        'Rule bounded chỉ đưa public và unapproved vào review; không suy diễn từ service inventory.',
    },
    parsons: {
      prompt: 'Xếp rule triage inventory fail closed.',
      lines: [
        'parts = raw.split("|")',
        'if parts[1] == "public" and parts[2] == "unapproved":',
        '    print("classification=review")',
        'else:',
        '    print("classification=inventory-ok")',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG triage inventory `service|visibility|config`. Service chỉ `api`, `worker`, `store`; visibility chỉ `public`, `private`; config chỉ `approved`, `unapproved`. `public|unapproved` (bất kể service) in `classification=review`, `category=exposure-inventory`, `next=verify-scope-and-owner`; mọi tổ hợp hợp lệ khác in `classification=inventory-ok`, `next=retain-redacted-inventory`. Input sai in `input-khong-hop-le`. Không dùng host, port, scan hoặc network.',
      starterCode:
        'raw = input().strip()\n\n# MÔ PHỎNG inventory synthetic/redacted, không có target thực.',
      testCases: [
        {
          stdinLines: ['api|public|unapproved'],
          expected:
            'classification=review\ncategory=exposure-inventory\nnext=verify-scope-and-owner',
          match: 'contains',
          hidden: false,
          label: 'public cấu hình chưa approved cần review',
        },
        {
          stdinLines: ['store|private|unapproved'],
          expected: 'classification=inventory-ok\nnext=retain-redacted-inventory',
          match: 'contains',
          hidden: true,
          label: 'private không tự suy diễn exposure',
        },
        {
          stdinLines: ['worker|public|approved'],
          expected: 'classification=inventory-ok',
          match: 'contains',
          hidden: true,
          label: 'approved không phải finding tự động',
        },
        {
          stdinLines: ['api|internet|unapproved'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'visibility ngoài inventory bị từ chối',
        },
      ],
      hints: [
        'Chỉ cho ba service class đã nêu.',
        'Kiểm tra token bằng set trước rule.',
        'Không thêm địa chỉ, port hay thao tác xác minh mạng.',
      ],
      sampleSolution: `try:
    service, visibility, config = input().strip().split("|")
    if service not in {"api", "worker", "store"} or visibility not in {"public", "private"} or config not in {"approved", "unapproved"}:
        raise ValueError
    if visibility == "public" and config == "unapproved":
        print("classification=review")
        print("category=exposure-inventory")
        print("next=verify-scope-and-owner")
    else:
        print("classification=inventory-ok")
        print("next=retain-redacted-inventory")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Lập inventory được ủy quyền chỉ với service class, visibility, owner và approval state. Ghi một ADR giải thích vì sao inventory không thay thế asset discovery hoặc đánh giá thực hiện bởi người có scope.',
    srsCards: [
      {
        hoi: 'Rule bounded nào đưa inventory item vào manual review?',
        dap: 'Chỉ item có visibility public và config unapproved được gắn review; các trạng thái khác được giữ inventory-ok để tránh suy diễn quá mức.',
      },
      {
        hoi: 'Vì sao bài inventory không có host hoặc port?',
        dap: 'Dữ liệu synthetic/redacted giúp học classification và ownership mà không biến lesson phòng thủ thành công cụ discovery hoặc scanning target.',
      },
    ],
  },
  {
    id: 'p6-u188-l2',
    unitId: 'p6-u188',
    language: 'python',
    title: 'MÔ PHỎNG secret exposure: rotate hoặc revoke, không in secret',
    hook: 'Khi một dấu hiệu credential bị lộ xuất hiện, ưu tiên là containment và owner—not copy giá trị nhạy cảm vào ticket.',
    theory:
      'Fixture redacted chỉ mang `artifact-state|credential-state|owner-state`; không có giá trị secret và chương trình tuyệt đối không in secret. Nếu artifact exposed và credential active, recommendation là rotate; nếu credential revoked, recommendation là confirm-revocation. Mọi state khác hợp lệ cần manual-review; thiếu hoặc sai state bị từ chối.',
    workedExample: {
      code: '# Khong luu hoac in gia tri secret.\nartifact, credential, owner = "exposed|active|assigned".split("|")\nprint("rotate" if artifact == "exposed" and credential == "active" and owner == "assigned" else "manual-review")',
      stdinLines: [],
    },
    predict: {
      code: 'artifact, credential = "exposed", "revoked"\nprint("confirm-revocation" if credential == "revoked" else "rotate")',
      question: 'Credential đã revoked nhận recommendation nào?',
      choices: ['rotate', 'confirm-revocation', 'print-secret', 'exploit'],
      answerIndex: 1,
      explain:
        'Simulator không khôi phục hay hiển thị dữ liệu nhạy cảm; revoked chỉ cần xác nhận containment.',
    },
    parsons: {
      prompt: 'Xếp nhánh containment không tiết lộ secret.',
      lines: [
        'if credential == "revoked":',
        '    recommendation = "confirm-revocation"',
        'elif artifact == "exposed" and credential == "active" and owner == "assigned":',
        '    recommendation = "rotate"',
        'else:',
        '    recommendation = "manual-review"',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG secret exposure triage từ fixture redacted `artifact|credential|owner`: artifact `exposed`/`not-exposed`; credential `active`/`revoked`; owner `assigned`/`unassigned`. Nếu credential `revoked`, in `classification=contained`, `recommendation=confirm-revocation`; nếu `exposed|active|assigned`, in `classification=action-required`, `recommendation=rotate`; các tổ hợp hợp lệ khác in `classification=manual-review`, `recommendation=review-owner-and-scope`. Input sai in `input-khong-hop-le`. Không nhập, giữ, khôi phục hay in bất kỳ giá trị secret nào; không network/filesystem/subprocess.',
      starterCode:
        'raw = input().strip()\n\n# MÔ PHỎNG redacted: chỉ state, không có giá trị secret.',
      testCases: [
        {
          stdinLines: ['exposed|active|assigned'],
          expected: 'classification=action-required\nrecommendation=rotate',
          match: 'contains',
          hidden: false,
          label: 'exposure active cần rotate',
        },
        {
          stdinLines: ['exposed|revoked|unassigned'],
          expected: 'classification=contained\nrecommendation=confirm-revocation',
          match: 'contains',
          hidden: true,
          label: 'revoked ưu tiên xác nhận containment',
        },
        {
          stdinLines: ['not-exposed|active|assigned'],
          expected: 'classification=manual-review\nrecommendation=review-owner-and-scope',
          match: 'contains',
          hidden: true,
          label: 'không tự rotate khi evidence không đủ',
        },
        {
          stdinLines: ['exposed|active|unknown'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'owner state lạ bị từ chối',
        },
      ],
      hints: [
        'Tách đúng ba state bằng dấu |.',
        'Kiểm tra state hợp lệ trước khi recommendation.',
        'Ưu tiên revoked trước vì containment đã được báo; không bao giờ ghép chuỗi secret.',
      ],
      sampleSolution: `try:
    artifact, credential, owner = input().strip().split("|")
    if artifact not in {"exposed", "not-exposed"} or credential not in {"active", "revoked"} or owner not in {"assigned", "unassigned"}:
        raise ValueError
    if credential == "revoked":
        print("classification=contained")
        print("recommendation=confirm-revocation")
    elif artifact == "exposed" and owner == "assigned":
        print("classification=action-required")
        print("recommendation=rotate")
    else:
        print("classification=manual-review")
        print("recommendation=review-owner-and-scope")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Soạn runbook containment cho artifact được ủy quyền: consent/scope, owner contact, rotate hoặc revoke recommendation, evidence redacted và review timeline. Không đưa credential value, log nhạy cảm hay lệnh tác động hệ thống vào artifact học tập.',
    srsCards: [
      {
        hoi: 'Exposure active, owner assigned được recommendation gì?',
        dap: 'Simulator đánh dấu action-required và recommendation rotate; nó chỉ dùng state redacted, không nhận hoặc in secret value.',
      },
      {
        hoi: 'Khi credential đã revoked, bước triage bounded là gì?',
        dap: 'In contained cùng recommendation confirm-revocation để xác nhận containment và ownership, thay vì cố truy xuất hoặc tiết lộ credential đã bị thu hồi.',
      },
    ],
  },
]
