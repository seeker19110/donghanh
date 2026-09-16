// P6-U183 — security-s1: crypto choice policy, metadata only and no cryptographic implementation.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U183_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u183-l1',
    unitId: 'p6-u183',
    language: 'python',
    title: 'MÔ PHỎNG crypto purpose — password hash, encryption, signature',
    hook: 'Ba từ “mã hoá” thường che ba mục đích khác nhau; chọn nhầm primitive có thể làm policy sai ngay từ thiết kế.',
    theory:
      'Password hash dùng để kiểm tra password mà không lưu plaintext; encryption bảo vệ confidentiality của dữ liệu có thể khôi phục; signature kiểm tra integrity và provenance. Bài này chỉ phân loại metadata policy, không tự cài thuật toán crypto và không nhận key, password hay bản rõ thật. Purpose hoặc primitive lạ, yếu hay không khớp phải reject.',
    workedExample: {
      code: `# Metadata công khai, không chứa password, key hay ciphertext thật.\ndef classify(purpose, primitive):\n    policy = {("password", "argon2id"): "password-hash", ("data", "aes-gcm"): "encryption", ("artifact", "ed25519"): "signature"}\n    return policy.get((purpose, primitive), "reject")\n\nprint(classify("data", "aes-gcm"))`,
      stdinLines: [],
    },
    predict: {
      code: `policy = {("password", "argon2id"): "password-hash"}\nprint(policy.get(("password", "md5"), "reject"))`,
      question: 'Primitive yếu hoặc không trong policy sẽ in gì?',
      choices: ['password-hash', 'encryption', 'reject', 'safe'],
      answerIndex: 2,
      explain: 'Mô phỏng không nâng metadata lạ thành hợp lệ; policy đóng và reject fail closed.',
    },
    parsons: {
      prompt: 'Xếp classifier để metadata ngoài policy không có fallback an toàn giả.',
      lines: [
        'def classify(pair, policy):',
        '    if pair in policy:',
        '        return policy[pair]',
        '    return "reject"',
      ],
    },
    make: {
      prompt:
        'Đọc `purpose|primitive`. Chỉ chấp nhận: `password|argon2id` → `password-hash`; `data|aes-gcm` → `encryption`; `artifact|ed25519` → `signature`. Input thiếu phần, plaintext password marker `plaintext`, primitive yếu/lạ hoặc cặp không khớp in `reject`. Chỉ xử lý metadata bounded; không tự viết crypto, không đọc hay in secret.',
      starterCode: `raw = input().strip()\n# Chỉ classify metadata; primitive ngoài bảng phải reject.`,
      testCases: [
        {
          stdinLines: ['data|aes-gcm'],
          expected: 'encryption',
          match: 'contains',
          hidden: false,
          label: 'confidentiality cho dữ liệu',
        },
        {
          stdinLines: ['password|argon2id'],
          expected: 'password-hash',
          match: 'contains',
          hidden: true,
          label: 'password là hash policy',
        },
        {
          stdinLines: ['password|plaintext'],
          expected: 'reject',
          match: 'contains',
          hidden: true,
          label: 'không lưu plaintext password',
        },
        {
          stdinLines: ['artifact|md5'],
          expected: 'reject',
          match: 'contains',
          hidden: true,
          label: 'primitive yếu bị reject',
        },
      ],
      hints: [
        'Kiểm tra `len(parts) == 2` trước.',
        'Dùng dictionary key `(purpose, primitive)` để biểu diễn policy đóng.',
        '`dict.get(..., "reject")` giúp unknown fail closed.',
      ],
      sampleSolution: `raw = input().strip()\npolicy = {\n    ("password", "argon2id"): "password-hash",\n    ("data", "aes-gcm"): "encryption",\n    ("artifact", "ed25519"): "signature",\n}\nparts = [part.strip() for part in raw.split("|")]\nif len(parts) != 2:\n    print("reject")\nelse:\n    print(policy.get(tuple(parts), "reject"))`,
    },
    homework:
      'Lập một bảng review cho ba loại dữ liệu của sản phẩm, nêu mục đích bảo vệ và primitive được đội security phê duyệt. Không ghi key, password hoặc dữ liệu thật.',
    srsCards: [
      {
        hoi: 'Password hash, encryption và signature phục vụ ba mục đích nào?',
        dap: 'Password hash hỗ trợ xác minh password không lưu bản rõ; encryption bảo vệ tính bí mật; signature kiểm tra tính toàn vẹn và nguồn gốc của artifact.',
      },
      {
        hoi: 'Vì sao policy crypto chỉ nên nhận metadata và reject primitive lạ?',
        dap: 'Metadata đủ để áp rule lựa chọn an toàn mà không đưa secret vào log hay bài học; primitive không được phê duyệt phải fail closed để tránh tự suy diễn.',
      },
    ],
  },
  {
    id: 'p6-u183-l2',
    unitId: 'p6-u183',
    language: 'python',
    title: 'MÔ PHỎNG crypto lifecycle — salt và rotation là contract bắt buộc',
    hook: 'Chọn đúng primitive vẫn chưa đủ: password hash thiếu salt hoặc dữ liệu mã hoá không có lịch rotation đều là trạng thái cần chặn.',
    theory:
      'Policy crypto cần metadata lifecycle: password hash phải có salt riêng theo record; encryption và signature phải nêu rotation state được phê duyệt. Simulator chỉ xét nhãn `present` hoặc `current`, không tạo salt, key, hash, ciphertext hay chữ ký. Bất kỳ field thiếu, `none`, stale hoặc malformed đều `reject` để tránh biến thiếu bằng chứng thành pass.',
    workedExample: {
      code: `# Chỉ kiểm metadata lifecycle đã redacted.\ndef check(kind, salt, rotation):\n    if kind == "password-hash" and salt == "present" and rotation == "current":\n        return "accept"\n    return "reject"\n\nprint(check("password-hash", "present", "current"))`,
      stdinLines: [],
    },
    predict: {
      code: `def check(salt):\n    return "accept" if salt == "present" else "reject"\n\nprint(check("none"))`,
      question: 'Không có salt cho password hash sẽ in gì?',
      choices: ['accept', 'reject', 'rotate', 'encrypted'],
      answerIndex: 1,
      explain:
        'Salt thiếu hay none không đạt crypto policy; simulator không tự tạo hoặc che giấu thiếu sót.',
    },
    parsons: {
      prompt: 'Xếp policy gate để salt và rotation đều được kiểm trước accept.',
      lines: [
        'def check(salt, rotation):',
        '    if salt != "present" or rotation != "current":',
        '        return "reject"',
        '    return "accept"',
      ],
    },
    make: {
      prompt:
        'Đọc `kind|salt|rotation`. `password-hash` chỉ accept khi `salt=present` và `rotation=current`; `encryption` và `signature` cũng chỉ accept khi `salt=na` và `rotation=current`. Mọi kind lạ, phần thiếu, salt `none`, rotation `stale` hay giá trị khác in `reject`. In `accept=<kind>` khi hợp lệ. Đây là MÔ PHỎNG metadata, không tạo hay hiển thị key, salt hoặc secret thật.',
      starterCode: `raw = input().strip()\n# Validate metadata lifecycle; unknown luôn reject.`,
      testCases: [
        {
          stdinLines: ['password-hash|present|current'],
          expected: 'accept=password-hash',
          match: 'contains',
          hidden: false,
          label: 'hash có salt và rotation hiện hành',
        },
        {
          stdinLines: ['password-hash|none|current'],
          expected: 'reject',
          match: 'contains',
          hidden: true,
          label: 'salt thiếu',
        },
        {
          stdinLines: ['encryption|na|stale'],
          expected: 'reject',
          match: 'contains',
          hidden: true,
          label: 'rotation cũ',
        },
        {
          stdinLines: ['signature|present|current'],
          expected: 'reject',
          match: 'contains',
          hidden: true,
          label: 'metadata salt không phù hợp kind',
        },
      ],
      hints: [
        'Tách thành đúng ba field trước khi kiểm policy.',
        'Viết một dictionary expected salt cho từng kind được phép.',
        'Chỉ accept khi rotation đúng chuỗi current và salt đúng expected.',
      ],
      sampleSolution: `raw = input().strip()\nexpected_salt = {\n    "password-hash": "present",\n    "encryption": "na",\n    "signature": "na",\n}\nparts = [part.strip() for part in raw.split("|")]\nif len(parts) != 3:\n    print("reject")\nelse:\n    kind, salt, rotation = parts\n    if kind in expected_salt and salt == expected_salt[kind] and rotation == "current":\n        print(f"accept={kind}")\n    else:\n        print("reject")`,
    },
    homework:
      'Viết checklist review lifecycle gồm owner của rotation, bằng chứng rotation đã hoàn tất và cách xử lý record cũ. Checklist không được chứa key hoặc bí mật.',
    srsCards: [
      {
        hoi: 'Vì sao password hash policy yêu cầu salt riêng hiện diện?',
        dap: 'Salt riêng làm các password giống nhau không tạo metadata hash giống nhau theo cách dự đoán đơn giản, đồng thời chứng minh record không dùng policy thiếu thành phần bắt buộc.',
      },
      {
        hoi: 'Rotation state nên xử lý thế nào khi thiếu hoặc stale?',
        dap: 'Thiếu, unknown hoặc stale rotation phải bị reject và chuyển sang remediation có owner; không được tự coi là current vì điều đó phá vỡ fail-closed policy.',
      },
    ],
  },
]
