// P6-U181 — devops-s2: policy IAM/cost là MÔ PHỎNG fail-closed.
import type { ProgrammingLesson } from '../lessonTypes.js'
import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U181_LESSONS: ProgrammingLesson[] = [
  devopsSimulation({
    id: 'p6-u181-l1',
    unitId: 'p6-u181',
    title: 'IAM least privilege và action allow-list',
    hook: 'Một policy tiện tay ghi wildcard có thể biến quyền đọc báo cáo thành toàn quyền quản trị.',
    theory:
      'Least privilege bắt đầu từ allow-list action nhỏ cho từng role. Simulator này chỉ nhận role `reader` hoặc `deployer` và action được liệt kê rõ; wildcard `*`, action lạ hoặc role lạ đều deny. Nó không đánh giá IAM JSON, không phát token và không thay thế review quyền thực tế.',
    workedCode: `allowed = {'read'}\naction = '*'\nprint('deny-wildcard' if action == '*' else ('allow' if action in allowed else 'deny-action'))`,
    predictCode: `role = 'reader'\naction = 'deploy'\nprint('allow' if role == 'deployer' and action == 'deploy' else 'deny-action')`,
    predictChoices: ['allow', 'deny-action', 'reader', 'deploy'],
    predictAnswer: 1,
    predictExplain:
      'Reader không có quyền deploy; thiếu quyền tường minh phải deny thay vì đoán cho phép.',
    makePrompt:
      'MÔ PHỎNG IAM. Đọc role (`reader`/`deployer`) và action. `reader` chỉ có `read`; `deployer` có `read,deploy`. Nếu action là `*`, in `decision=deny-wildcard`; action không trong allow-list in `decision=deny-action`; role lạ in `decision=deny-role`; còn lại in `decision=allow`. Chuỗi chỉ chữ thường dài 1..12. Input sai in `input-khong-hop-le`. Không cấp credential hay gọi IAM/cloud API thật.',
    testCases: [
      {
        stdinLines: ['reader', 'read'],
        expected: 'decision=allow',
        hidden: false,
        label: 'reader chỉ được action đã allow',
      },
      {
        stdinLines: ['deployer', '*'],
        expected: 'decision=deny-wildcard',
        hidden: true,
        label: 'wildcard admin bị chặn',
      },
      {
        stdinLines: ['reader', 'deploy'],
        expected: 'decision=deny-action',
        hidden: true,
        label: 'action vượt role fail closed',
      },
      {
        stdinLines: ['admin', 'read'],
        expected: 'decision=deny-role',
        hidden: true,
        label: 'role lạ không được suy diễn quyền',
      },
    ],
    sampleSolution: `try:
    role = input().strip()
    action = input().strip()
    if not action or len(action) > 12 or (action != '*' and (not action.isalpha() or not action.islower())):
        raise ValueError
    permissions = {'reader': {'read'}, 'deployer': {'read', 'deploy'}}
    if role not in permissions:
        print('decision=deny-role')
    elif action == '*':
        print('decision=deny-wildcard')
    elif action not in permissions[role]:
        print('decision=deny-action')
    else:
        print('decision=allow')
except (EOFError, ValueError):
    print('input-khong-hop-le')`,
    homework:
      'Lập ma trận role/action cho một ứng dụng có analyst và deployer. Chỉ ra action nào cần tách thêm role, và vì sao wildcard không phải cách thay thế cho quá trình cấp quyền production.',
    cards: [
      {
        hoi: 'Nguyên tắc least privilege đòi hỏi gì?',
        dap: 'Mỗi role chỉ nhận các action tối thiểu cần cho công việc đã định và mọi action ngoài allow-list phải bị từ chối cho đến khi có thay đổi policy được review.',
      },
      {
        hoi: 'Vì sao wildcard trong IAM là rủi ro?',
        dap: 'Wildcard mở rộng phạm vi quyền vượt khỏi action được xem xét, khiến một role có thể gọi thao tác phá huỷ hoặc nhạy cảm mà thiết kế ban đầu không dự tính.',
      },
    ],
  }),
  devopsSimulation({
    id: 'p6-u181-l2',
    unitId: 'p6-u181',
    title: 'ước lượng cost bounded và budget gate',
    hook: 'Một thay đổi hợp lệ về kỹ thuật vẫn có thể không hợp lệ về chi phí nếu nó vượt ngân sách đã duyệt.',
    theory:
      'Cost gate sử dụng estimate minh bạch, có giới hạn input, rồi so với budget trước khi mô phỏng triển khai. Ở đây total là instances nhân unit_cost; budget breach in alert và deny, không làm tròn thành bill thật. Pricing production cần catalog, region, commitment và dữ liệu billing đáng tin cậy ngoài sandbox.',
    workedCode: `instances, unit_cost, budget = 3, 7, 20\ntotal = instances * unit_cost\nprint('alert-budget' if total > budget else 'within-budget')`,
    predictCode: `total, budget = 21, 20\nprint(total > budget)`,
    predictChoices: ['True', 'False', '20', '21'],
    predictAnswer: 0,
    predictExplain: '21 lớn hơn budget 20, nên gate phải phát hiện budget breach.',
    makePrompt:
      'MÔ PHỎNG cost gate. Đọc instances (0..20), unit_cost (0..999) và budget (0..9999). Tính `estimate=<instances*unit_cost>`. Nếu estimate vượt budget, in `alert=budget-breach` và `decision=deny-budget`; ngược lại in `alert=within-budget` và `decision=allow-simulated`. Input sai in `input-khong-hop-le`. Đây không phải báo giá cloud hay quyết định mua hàng thật.',
    testCases: [
      {
        stdinLines: ['3', '7', '20'],
        expected: 'estimate=21\nalert=budget-breach\ndecision=deny-budget',
        hidden: false,
        label: 'budget breach phải alert và deny',
      },
      {
        stdinLines: ['2', '50', '100'],
        expected: 'estimate=100\nalert=within-budget\ndecision=allow-simulated',
        hidden: true,
        label: 'đúng bằng budget vẫn trong giới hạn',
      },
      {
        stdinLines: ['0', '999', '0'],
        expected: 'estimate=0\nalert=within-budget',
        hidden: true,
        label: 'zero instance là biên bounded hợp lệ',
      },
      {
        stdinLines: ['21', '1', '99'],
        expected: 'input-khong-hop-le',
        hidden: true,
        label: 'số instance vượt miền fixture bị từ chối',
      },
    ],
    sampleSolution: `try:
    instances = int(input().strip())
    unit_cost = int(input().strip())
    budget = int(input().strip())
    if not (0 <= instances <= 20 and 0 <= unit_cost <= 999 and 0 <= budget <= 9999):
        raise ValueError
    estimate = instances * unit_cost
    print('estimate=' + str(estimate))
    if estimate > budget:
        print('alert=budget-breach')
        print('decision=deny-budget')
    else:
        print('alert=within-budget')
        print('decision=allow-simulated')
except (EOFError, ValueError):
    print('input-khong-hop-le')`,
    homework:
      'Đề xuất một cost gate có estimate, owner duyệt và ngưỡng alert. Liệt kê ít nhất ba dữ liệu pricing hoặc billing thật mà mô phỏng này chưa thể cung cấp.',
    cards: [
      {
        hoi: 'Một budget gate fail closed nên làm gì khi estimate vượt ngưỡng?',
        dap: 'Nó phát alert có thể truy vết và từ chối hành động mô phỏng cho đến khi có approval hoặc budget được điều chỉnh, thay vì âm thầm cho triển khai tiếp.',
      },
      {
        hoi: 'Vì sao estimate nhỏ không phải cloud bill thật?',
        dap: 'Bill thực tế còn phụ thuộc region, thời gian chạy, pricing catalog, thuế, chiết khấu và mức sử dụng; fixture bounded chỉ giúp luyện logic gate một cách tái lập.',
      },
    ],
  }),
]
