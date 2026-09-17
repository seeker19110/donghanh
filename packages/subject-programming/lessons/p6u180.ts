// P6-U180 — devops-s2: IaC plan/state là MÔ PHỎNG, không phải Terraform hay cloud thật.
import type { ProgrammingLesson } from '../lessonTypes.js'
import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U180_LESSONS: ProgrammingLesson[] = [
  devopsSimulation({
    id: 'p6-u180-l1',
    unitId: 'p6-u180',
    title: 'IaC plan và cổng xoá phá huỷ',
    hook: 'Một plan nhìn ngắn có thể chứa delete; vì vậy lệnh áp dụng không được tin chỉ vì nó đến từ một file cấu hình.',
    theory:
      'IaC đúng nghĩa so desired fixture với state fixture để tạo plan create, update hoặc delete. Trong bài này mỗi tài nguyên chỉ là tên ngắn; delete là destructive và phải có approval đúng chuỗi `APPROVE-DELETE`. Thiếu dữ liệu hay approval sai đều fail closed, còn simulator không thay Terraform plan/apply hay quyền cloud.',
    workedCode: `desired = {'api', 'queue'}\nstate = {'api', 'old'}\nprint('delete=' + ','.join(sorted(state - desired)))`,
    predictCode: `approval = 'NO'\nprint('apply' if approval == 'APPROVE-DELETE' else 'deny-destructive')`,
    predictChoices: ['apply', 'deny-destructive', 'delete', 'approval'],
    predictAnswer: 1,
    predictExplain:
      'Một delete không có approval chính xác phải bị chặn trước khi state được thay đổi.',
    makePrompt:
      'MÔ PHỎNG IaC plan thuần Python. Đọc desired, state, approval (ba dòng), mỗi danh sách là tên chữ thường phân cách dấu phẩy hoặc `-` rỗng; tối đa 6 tên khác nhau, dài 1..12. In `create=<...>`, `update=-`, `delete=<...>` theo thứ tự từ điển. Nếu có delete mà approval không đúng `APPROVE-DELETE`, in thêm `decision=deny-destructive`; nếu không có delete hoặc approval đúng, in `decision=apply-simulated`. Input sai in `input-khong-hop-le`. Không deploy, không ghi remote state và không coi simulator là Terraform/cloud thật.',
    testCases: [
      {
        stdinLines: ['api,queue', 'api,old', 'NO'],
        expected: 'create=queue\nupdate=-\ndelete=old\ndecision=deny-destructive',
        hidden: false,
        label: 'delete không approval bị fail closed',
      },
      {
        stdinLines: ['api', 'api,old', 'APPROVE-DELETE'],
        expected: 'delete=old\ndecision=apply-simulated',
        hidden: true,
        label: 'approval rõ ràng mới qua cổng destructive',
      },
      {
        stdinLines: ['api', 'api', 'NO'],
        expected: 'create=-\nupdate=-\ndelete=-\ndecision=apply-simulated',
        hidden: true,
        label: 'plan rỗng không cần approval delete',
      },
      {
        stdinLines: ['api,api', '-', 'NO'],
        expected: 'input-khong-hop-le',
        hidden: true,
        label: 'tên trùng làm plan mơ hồ',
      },
    ],
    sampleSolution: `try:
    def read_names():
        raw = input().strip()
        if raw == '-':
            return set()
        parts = raw.split(',')
        if not 1 <= len(parts) <= 6 or any(not part.islower() or not part.isalpha() or len(part) > 12 for part in parts):
            raise ValueError
        if len(set(parts)) != len(parts):
            raise ValueError
        return set(parts)
    desired = read_names()
    state = read_names()
    approval = input().strip()
    if approval not in ('NO', 'APPROVE-DELETE'):
        raise ValueError
    create = sorted(desired - state)
    delete = sorted(state - desired)
    show = lambda values: ','.join(values) if values else '-'
    print('create=' + show(create))
    print('update=-')
    print('delete=' + show(delete))
    print('decision=deny-destructive' if delete and approval != 'APPROVE-DELETE' else 'decision=apply-simulated')
except (EOFError, ValueError):
    print('input-khong-hop-le')`,
    homework:
      'Vẽ plan cho một service đổi version và một queue bị xoá. Nêu bằng chứng review nào cần có ngoài simulator trước khi cho phép destructive apply trong môi trường cloud thật.',
    cards: [
      {
        hoi: 'Vì sao delete trong IaC cần cổng approval riêng?',
        dap: 'Delete có thể phá dữ liệu hoặc năng lực phục vụ; một cổng approval tường minh buộc người vận hành xem lại plan và ngăn áp dụng nhầm khi state thay đổi.',
      },
      {
        hoi: 'Plan fixture khác gì plan Terraform hay cloud production?',
        dap: 'Fixture chỉ minh hoạ phép so sánh hữu hạn giữa hai tập tên, không đọc provider, không khoá state và không có quyền tạo, sửa hoặc xoá hạ tầng thật.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u180-l2',
    unitId: 'p6-u180',
    title: 'remote state lock và phát hiện drift',
    hook: 'Hai người cùng apply có thể biến một state hợp lệ thành bản ghi không ai còn giải thích được.',
    theory:
      'Remote state cần lock để chỉ một apply sở hữu phiên cập nhật tại một thời điểm. Drift là khác biệt giữa expected và observed; khi drift xuất hiện, hệ thống dừng để điều tra thay vì ghi đè âm thầm. Bài dùng owner và revision nhỏ trong bộ nhớ, không kết nối backend state, cloud API hay lock service thật.',
    workedCode: `lock_owner = 'lan'\nrequester = 'minh'\nprint('deny-lock' if lock_owner != requester else 'lock-held')`,
    predictCode: `expected, observed = 3, 4\nprint('drift' if expected != observed else 'clean')`,
    predictChoices: ['clean', 'drift', '3', '4'],
    predictAnswer: 1,
    predictExplain:
      'Revision observed khác expected là bằng chứng drift; apply phải dừng thay vì tự hợp nhất.',
    makePrompt:
      'MÔ PHỎNG remote-state lock. Đọc owner hiện tại (`-` hoặc tên chữ thường), requester (tên chữ thường), expected revision và observed revision (0..99). Nếu owner khác `-` và khác requester, in `decision=deny-lock`. Nếu lock hợp lệ nhưng revision khác nhau, in `decision=deny-drift`. Chỉ khi lock trống/thuộc requester và revision bằng nhau mới in `decision=apply-simulated` và `lock=<requester>`. Input sai in `input-khong-hop-le`; không gọi remote backend, filesystem, mạng hay cloud.',
    testCases: [
      {
        stdinLines: ['lan', 'minh', '2', '2'],
        expected: 'decision=deny-lock',
        hidden: false,
        label: 'concurrent apply bị state lock chặn',
      },
      {
        stdinLines: ['-', 'minh', '2', '3'],
        expected: 'decision=deny-drift',
        hidden: true,
        label: 'drift bị chặn dù lock đang trống',
      },
      {
        stdinLines: ['minh', 'minh', '7', '7'],
        expected: 'decision=apply-simulated\nlock=minh',
        hidden: true,
        label: 'owner hiện tại được tiếp tục revision sạch',
      },
      {
        stdinLines: ['MINH', 'minh', '1', '1'],
        expected: 'input-khong-hop-le',
        hidden: true,
        label: 'owner sai định dạng bị từ chối',
      },
    ],
    sampleSolution: `try:
    owner = input().strip()
    requester = input().strip()
    expected = int(input().strip())
    observed = int(input().strip())
    valid_name = lambda value: value.isalpha() and value.islower() and len(value) <= 12
    if (owner != '-' and not valid_name(owner)) or not valid_name(requester) or not (0 <= expected <= 99 and 0 <= observed <= 99):
        raise ValueError
    if owner != '-' and owner != requester:
        print('decision=deny-lock')
    elif expected != observed:
        print('decision=deny-drift')
    else:
        print('decision=apply-simulated')
        print('lock=' + requester)
except (EOFError, ValueError):
    print('input-khong-hop-le')`,
    homework:
      'Viết runbook ba bước cho drift: dừng, thu thập bằng chứng, rồi quyết định import hay rollback. Ghi rõ bước nào bắt buộc dùng backend và quyền cloud thật ngoài sandbox.',
    cards: [
      {
        hoi: 'State lock giải quyết rủi ro nào của IaC?',
        dap: 'Nó ngăn hai apply cùng ghi vào một state trong cùng thời điểm, giảm nguy cơ lost update và giữ trách nhiệm của phiên cập nhật có thể truy vết.',
      },
      {
        hoi: 'Khi phát hiện drift, vì sao không tự ghi đè observed state?',
        dap: 'Khác biệt có thể là thay đổi khẩn cấp hoặc tác động ngoài ý muốn; fail closed giữ bằng chứng để người có thẩm quyền điều tra trước khi apply tiếp.',
      },
    ],
  }),
]
