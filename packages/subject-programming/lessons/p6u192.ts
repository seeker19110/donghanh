// P6-U192 — architecture-s4: health gate cho dependency va technical debt.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U192_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u192-l1',
    unitId: 'p6-u192',
    language: 'python',
    title: 'MÔ PHỎNG phát hiện dependency cycle và hotspot',
    hook: 'Một module “tiện tay” import ngược có thể biến lần sửa nhỏ thành thay đổi dây chuyền khó đoán.',
    theory:
      'Architecture health là contract đo được, không phải cảm giác. Với đồ thị dependency có hướng, DFS giữ tập visiting để phát hiện cycle; module có số dependency vượt budget là hotspot. Cả cycle lẫn regression budget đều là violation fail closed: simulator chỉ báo lý do, không tự sửa hoặc deploy.',
    workedExample: {
      code: `# A phu thuoc B va B phu thuoc A tao thanh cycle.\ngraph = {"A": ["B"], "B": ["A"]}\n# visiting chua duong dang duyet cua DFS.\nprint("cycle" if "A" in graph["B"] else "ok")`,
      stdinLines: [],
    },
    predict: {
      code: `visiting = {"catalog", "pricing"}\nnext_module = "catalog"\nprint(next_module in visiting)`,
      question:
        'DFS đang đi catalog → pricing và pricing lại cần catalog. Điều kiện cycle có đúng không?',
      choices: ['True', 'False', 'catalog', 'pricing'],
      answerIndex: 0,
      explain:
        'Quay lại một node đang trong đường DFS (visiting) là back-edge, nên tạo dependency cycle.',
    },
    parsons: {
      prompt: 'Xếp các bước DFS fail closed khi gặp cycle.',
      lines: [
        'visiting.add(node)',
        'for child in graph[node]:',
        '    if child in visiting:',
        '        raise ValueError("cycle")',
        'visiting.remove(node)',
        'visited.add(node)',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG architecture-health. Đọc dòng `module:dep.dep;...` (tối đa 8 module, tên chữ thường 1..12 ký tự; `-` là không dependency), rồi dòng budget nguyên 0..7. Mọi dependency phải là module đã khai báo. In `status=violation` và `reason=dependency-cycle` nếu có cycle; nếu không cycle nhưng một module có số dependency trực tiếp lớn hơn budget, in `status=violation` và `reason=hotspot=<module>` theo tên alphabet đầu tiên; nếu không in `status=pass`. Input sai in `input-khong-hop-le`. Đây là MÔ PHỎNG bounded, không đọc file/network hay tự thay đổi kiến trúc.',
      starterCode:
        'raw = input().strip()\nbudget = input().strip()\n\n# MÔ PHỎNG: validate do thi nho truoc, sau do DFS.',
      testCases: [
        {
          stdinLines: ['catalog:pricing;pricing:catalog;checkout:-', '2'],
          expected: 'status=violation\nreason=dependency-cycle',
          match: 'contains',
          hidden: false,
          label: 'cycle phải là violation',
        },
        {
          stdinLines: ['api:auth.cache.db;auth:-;cache:-;db:-', '2'],
          expected: 'status=violation\nreason=hotspot:api',
          match: 'contains',
          hidden: true,
          label: 'quá budget dependency là hotspot',
        },
        {
          stdinLines: ['api:auth;auth:-', '1'],
          expected: 'status=pass',
          match: 'contains',
          hidden: true,
          label: 'đồ thị nhỏ trong budget đạt gate',
        },
        {
          stdinLines: ['api:missing', '1'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'dependency ngoài contract bị từ chối',
        },
      ],
      hints: [
        'Parse toàn bộ module trước khi kiểm dependency để tránh chấp nhận reference thiếu.',
        'DFS cần cả `visiting` và `visited`; gặp `child in visiting` thì dừng fail closed.',
        'Chỉ xét hotspot khi cycle đã không tồn tại để reason luôn xác định.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    budget = int(input().strip())
    if not 0 <= budget <= 7 or not raw:
        raise ValueError
    graph = {}
    for part in raw.split(";"):
        bits = part.split(":")
        if len(bits) != 2 or not bits[0].islower() or not 1 <= len(bits[0]) <= 12 or bits[0] in graph:
            raise ValueError
        deps = [] if bits[1] == "-" else bits[1].split(".")
        if len(deps) > 7 or any(not dep.islower() or not 1 <= len(dep) <= 12 for dep in deps):
            raise ValueError
        graph[bits[0]] = deps
    if len(graph) > 8 or any(dep not in graph for deps in graph.values() for dep in deps):
        raise ValueError
    visiting, visited = set(), set()
    def dfs(node):
        if node in visiting:
            return True
        if node in visited:
            return False
        visiting.add(node)
        found = any(dfs(child) for child in graph[node])
        visiting.remove(node)
        visited.add(node)
        return found
    if any(dfs(node) for node in sorted(graph)):
        print("status=violation")
        print("reason=dependency-cycle")
    else:
        hotspots = sorted(name for name, deps in graph.items() if len(deps) > budget)
        if hotspots:
            print("status=violation")
            print("reason=hotspot=" + hotspots[0])
        else:
            print("status=pass")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Vẽ dependency graph của một tính năng bạn biết, đặt budget rõ ràng cho dependency trực tiếp, rồi ghi evidence nào sẽ khiến team mở ADR để xử lý hotspot.',
    srsCards: [
      {
        hoi: 'Vì sao DFS dùng visiting để phát hiện dependency cycle?',
        dap: 'Một cạnh quay về node vẫn nằm trong visiting là back-edge trên đường duyệt hiện tại, chứng tỏ chuỗi dependency có vòng và phải bị báo violation.',
      },
      {
        hoi: 'Vì sao health gate phải fail closed khi budget dependency bị vượt?',
        dap: 'Budget regression là evidence kiến trúc xấu đi; pass khi không có ngoại lệ được phê duyệt sẽ biến chỉ số thành checklist và che mất technical debt.',
      },
    ],
  },
  {
    id: 'p6-u192-l2',
    unitId: 'p6-u192',
    language: 'python',
    title: 'MÔ PHỎNG ưu tiên technical debt theo impact và interest',
    hook: 'Không phải mọi khoản nợ kỹ thuật đều phải trả ngay, nhưng khoản làm lỗi production lặp lại không thể bị giấu trong backlog vô hạn.',
    theory:
      'Một debt item cần impact và interest đo được. Simulator ưu tiên score = impact × interest, phá hoà bằng id; nhưng status chỉ pass khi tổng score không vượt budget. Thiếu metric hoặc budget regression là violation, vì “để sau” không phải quyết định có evidence.',
    workedExample: {
      code: `# Impact 5 va interest 4 tao score cao hon mot viec 2 x 3.\nitems = [("cache", 5, 4), ("ui", 2, 3)]\nranked = sorted(items, key=lambda x: (-x[1] * x[2], x[0]))\nprint(ranked[0][0])`,
      stdinLines: [],
    },
    predict: {
      code: `impact = 4\ninterest = 3\nprint(impact * interest)`,
      question: 'Khoản debt có impact 4 và interest 3 có score bao nhiêu?',
      choices: ['7', '12', '1', '43'],
      answerIndex: 1,
      explain: 'Score là tích impact × interest, vì hai chiều đều phải có evidence.',
    },
    parsons: {
      prompt: 'Xếp bước chọn debt ưu tiên một cách tái lập.',
      lines: [
        'score = impact * interest',
        'ranked.append((score, item_id))',
        'ranked.sort(key=lambda item: (-item[0], item[1]))',
        'total = sum(score for score, _ in ranked)',
        'print(ranked[0][1])',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG debt budget. Đọc `id,impact,interest;...` với 1..6 item, id chữ thường 1..10 ký tự, impact và interest nguyên 1..9; rồi budget nguyên 1..486. In `priority=<id>`, `total=<n>`, và `status=pass` nếu total <= budget; ngược lại in `status=violation` và `reason=debt-budget-regression`. Tie ưu tiên theo id alphabet. Input thiếu metric, item trùng hoặc sai format in `input-khong-hop-le`; không có I/O ngoài stdin/stdout, không tự tạo ticket.',
      starterCode:
        'raw = input().strip()\nbudget = input().strip()\n\n# MÔ PHỎNG: score co evidence va budget fail closed.',
      testCases: [
        {
          stdinLines: ['cache,5,4;ui,2,3', '20'],
          expected: 'priority=cache\ntotal=26\nstatus=violation\nreason=debt-budget-regression',
          match: 'contains',
          hidden: false,
          label: 'tổng debt vượt budget là violation',
        },
        {
          stdinLines: ['api,3,3;db,3,3', '18'],
          expected: 'priority=api\ntotal=18\nstatus=pass',
          match: 'contains',
          hidden: true,
          label: 'tie phá hoà bằng id và budget bằng tổng',
        },
        {
          stdinLines: ['cache,5;ui,2,3', '20'],
          expected: 'input-khong-hop-le',
          match: 'contains',
          hidden: true,
          label: 'thiếu interest không được đoán',
        },
      ],
      hints: [
        'Tách item bằng `;`, rồi yêu cầu đúng ba trường phân cách dấu phẩy.',
        'Giữ score cùng id để sort `(-score, id)` tái lập.',
        'Tính total trước khi in status để không có pass dựa trên cảm tính.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    budget = int(input().strip())
    if not raw or not 1 <= budget <= 486:
        raise ValueError
    items, seen = [], set()
    for token in raw.split(";"):
        fields = token.split(",")
        if len(fields) != 3:
            raise ValueError
        item_id, impact_text, interest_text = fields
        impact, interest = int(impact_text), int(interest_text)
        if not item_id.islower() or not 1 <= len(item_id) <= 10 or item_id in seen or not 1 <= impact <= 9 or not 1 <= interest <= 9:
            raise ValueError
        seen.add(item_id)
        items.append((impact * interest, item_id))
    if len(items) > 6:
        raise ValueError
    items.sort(key=lambda item: (-item[0], item[1]))
    total = sum(score for score, _ in items)
    print("priority=" + items[0][1])
    print(f"total={total}")
    if total <= budget:
        print("status=pass")
    else:
        print("status=violation")
        print("reason=debt-budget-regression")
except (EOFError, ValueError):
    print("input-khong-hop-le")`,
    },
    homework:
      'Chọn hai debt item thật, ghi impact và interest bằng metric quan sát được, rồi nêu owner cùng ngưỡng budget khiến bạn phải escalation thay vì tiếp tục trì hoãn.',
    srsCards: [
      {
        hoi: 'Score impact × interest giúp quyết định technical debt theo nguyên tắc nào?',
        dap: 'Nó buộc mức ảnh hưởng hiện tại và chi phí tăng dần phải cùng có metric, tạo thứ tự ưu tiên tái lập thay vì chọn việc theo tiếng nói lớn nhất.',
      },
      {
        hoi: 'Khi total technical-debt score vượt budget, simulator cần trả gì?',
        dap: 'Nó phải trả violation cùng reason debt-budget-regression để owner có evidence review; không được tự động coi backlog vẫn an toàn hoặc tự quyết định bỏ qua debt.',
      },
    ],
  },
]
