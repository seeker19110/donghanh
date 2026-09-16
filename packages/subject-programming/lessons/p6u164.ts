// P6-U164 — algo-s2-m3: đồ thị có thứ tự xác định, topo và đường đi ngắn.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U164_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u164-l1',
    unitId: 'p6-u164',
    language: 'python',
    title: 'MÔ PHỎNG topo sort và phát hiện chu trình',
    hook: 'Một pipeline có vòng phụ thuộc không thể chạy theo thứ tự; cần báo vòng thay vì bịa ra một kế hoạch.',
    theory:
      'Đồ thị có hướng biểu diễn bằng cạnh `A>B`. Kahn topo sort luôn lấy đỉnh indegree 0 theo thứ tự chữ cái để cùng input cho cùng output. Nếu còn đỉnh chưa lấy sau khi hết hàng đợi thì có cycle. Đây là MÔ PHỎNG bounded, không phải scheduler production; input không bị sửa đổi.',
    workedExample: {
      code: `# Ke A phai xong truoc B va C.\nedges = [('A', 'B'), ('A', 'C'), ('B', 'D')]\nvertices = sorted({v for edge in edges for v in edge})\nindegree = {v: 0 for v in vertices}\nfor _, target in edges:\n    indegree[target] += 1\nprint([v for v in vertices if indegree[v] == 0])`,
      stdinLines: [],
    },
    predict: {
      code: `edges = [('A', 'B'), ('B', 'A')]\nindegree = {'A': 1, 'B': 1}\nready = [v for v in indegree if indegree[v] == 0]\nprint(len(ready) == 0)`,
      question: 'Hai cạnh tạo vòng A↔B; biểu thức cuối in gì?',
      choices: ['True', 'False', 'A', 'B'],
      answerIndex: 0,
      explain: 'Cả A lẫn B đều có một cạnh đi vào, nên không có đỉnh nào sẵn sàng để bắt đầu.',
    },
    parsons: {
      prompt: 'Xếp vòng lặp Kahn để lấy đỉnh sẵn sàng theo thứ tự ổn định.',
      lines: [
        'while ready:',
        '    node = ready.pop(0)',
        '    order.append(node)',
        '    for next_node in sorted(graph[node]):',
        '        indegree[next_node] -= 1',
        '        if indegree[next_node] == 0:',
        '            ready.append(next_node)',
        '    ready.sort()',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG topo sort cho một đồ thị hướng nhỏ. Đọc một dòng cạnh dạng `A>B,A>C,B>D`; nhãn là một chữ/số, tối đa 12 cạnh. Dấu `-` là đồ thị rỗng. Hãy in `topo=A,B,C` theo thứ tự Kahn (các lựa chọn đồng thời sắp chữ cái). Nếu có chu trình in `cycle`. Cạnh sai, trùng, self-loop hoặc quá giới hạn in `tu-choi`. Không sửa chuỗi input, không dùng thư viện đồ thị.',
      starterCode: `# MÔ PHỎNG topo sort: cạnh có dạng A>B,B>C.\nraw = input().strip()\n`,
      testCases: [
        {
          stdinLines: ['A>B,A>C,B>D,C>D'],
          expected: 'topo=A,B,C,D',
          match: 'contains',
          hidden: false,
          label: 'hai nhánh hội tụ được xếp ổn định',
        },
        {
          stdinLines: ['A>B,B>C,C>A'],
          expected: 'cycle',
          match: 'contains',
          hidden: true,
          label: 'vòng phụ thuộc phải được báo rõ',
        },
        {
          stdinLines: ['-'],
          expected: 'topo=',
          match: 'contains',
          hidden: true,
          label: 'đồ thị rỗng có thứ tự rỗng',
        },
        {
          stdinLines: ['A>A'],
          expected: 'tu-choi',
          match: 'contains',
          hidden: true,
          label: 'self-loop không phải dependency hợp lệ',
        },
      ],
      hints: [
        'Khởi tạo graph và indegree cho cả đầu nguồn lẫn đích.',
        'Dùng `sorted` cho ready và danh sách kề để không phụ thuộc thứ tự nhập.',
        'So sánh `len(order)` với số đỉnh để nhận ra cycle.',
      ],
      sampleSolution: `try:
    raw = input().strip()
    if raw == "-":
        print("topo=")
    else:
        tokens = raw.split(",")
        if not raw or len(tokens) > 12:
            raise ValueError
        edges = []
        for token in tokens:
            parts = token.split(">")
            if len(parts) != 2 or any(len(part) != 1 or not part.isalnum() for part in parts):
                raise ValueError
            source, target = parts
            if source == target or (source, target) in edges:
                raise ValueError
            edges.append((source, target))
        vertices = sorted({vertex for edge in edges for vertex in edge})
        graph = {vertex: [] for vertex in vertices}
        indegree = {vertex: 0 for vertex in vertices}
        for source, target in edges:
            graph[source].append(target)
            indegree[target] += 1
        ready = sorted(vertex for vertex in vertices if indegree[vertex] == 0)
        order = []
        while ready:
            node = ready.pop(0)
            order.append(node)
            for next_node in sorted(graph[node]):
                indegree[next_node] -= 1
                if indegree[next_node] == 0:
                    ready.append(next_node)
            ready.sort()
        print("cycle" if len(order) != len(vertices) else "topo=" + ",".join(order))
except (EOFError, ValueError):
    print("tu-choi")`,
    },
    homework:
      'Mô hình hoá dependency của một dự án nhỏ thành đồ thị, thêm một vòng có chủ ý và viết ca kiểm thử chứng minh chương trình báo cycle thay vì phát hành thứ tự sai.',
    srsCards: [
      {
        hoi: 'Khi nào Kahn topo sort kết luận đồ thị có chu trình?',
        dap: 'Khi hàng đợi đỉnh indegree bằng không đã cạn nhưng số đỉnh đã lấy vẫn ít hơn tổng số đỉnh cần xử lý.',
      },
      {
        hoi: 'Vì sao phải sắp thứ tự các đỉnh sẵn sàng?',
        dap: 'Nhiều topo order có thể đúng; sắp theo quy tắc cố định giúp cùng input luôn cho cùng output để kiểm thử và debug tái lập.',
      },
    ],
  },
  {
    id: 'p6-u164-l2',
    unitId: 'p6-u164',
    language: 'python',
    title: 'MÔ PHỎNG Dijkstra: cạnh không âm và không có đường',
    hook: 'Dijkstra nhanh vì nó tin rằng khoảng cách đã chốt không thể bị một cạnh âm lật ngược.',
    theory:
      'Bài dùng đồ thị có hướng nhỏ với cạnh `A>B:3`. Dijkstra lấy khoảng cách nhỏ nhất từ heap, relax cạnh theo nhãn tăng dần và chỉ hợp lệ khi mọi trọng số không âm. Không có đường là kết quả bình thường, còn cạnh âm phải bị từ chối trước khi chạy. Đây là MÔ PHỎNG bounded, không thay thế route service thật.',
    workedExample: {
      code: `# Duong A -> B -> C co tong trong so 5.\ndistance = {'A': 0, 'B': 2, 'C': 5}\nprint(distance['C'])`,
      stdinLines: [],
    },
    predict: {
      code: `known = 4\nedge_weight = 3\ncandidate = known + edge_weight\nprint(candidate < 6)`,
      question: 'Nếu đã biết đường dài 6 đến đích, candidate mới dài 7 thì có relax không?',
      choices: ['False', 'True', '7', '6'],
      answerIndex: 0,
      explain: 'Chỉ relax khi candidate ngắn hơn khoảng cách tốt nhất hiện có; 7 không tốt hơn 6.',
    },
    parsons: {
      prompt: 'Xếp phần relax cạnh của Dijkstra với tie-break ổn định.',
      lines: [
        'for next_node, weight in sorted(graph[node]):',
        '    candidate = distance + weight',
        '    if candidate < best.get(next_node, float("inf")):',
        '        best[next_node] = candidate',
        '        parent[next_node] = node',
        '        heapq.heappush(queue, (candidate, next_node))',
      ],
    },
    make: {
      prompt:
        'MÔ PHỎNG Dijkstra trên đồ thị hướng nhỏ. Dòng 1 là cạnh `A>B:3,A>C:8,B>C:2` (hoặc `-` khi rỗng); dòng 2 là `start target`. Nhãn là một chữ/số, tối đa 12 cạnh, trọng số nguyên 0..99. In `distance=<n>` rồi `path=A>B>C` cho đường ngắn nhất; nếu không đến được in `khong-co-duong`. Cạnh âm in `negative-edge`; input sai, cạnh trùng/self-loop hoặc quá giới hạn in `tu-choi`. Khi bằng khoảng cách, ưu tiên nhãn nhỏ hơn bằng traversal đã sắp. Không dùng networkx hay sửa input.',
      starterCode: `# MÔ PHỎNG Dijkstra; chi nhan canh khong am.\nraw_edges = input().strip()\nstart, target = input().split()\n`,
      testCases: [
        {
          stdinLines: ['A>B:2,A>C:8,B>C:2,C>D:1', 'A D'],
          expected: 'distance=5\npath=A>B>C>D',
          match: 'contains',
          hidden: false,
          label: 'chọn đường qua B và C thay vì cạnh dài trực tiếp',
        },
        {
          stdinLines: ['A>B:2,C>D:1', 'A D'],
          expected: 'khong-co-duong',
          match: 'contains',
          hidden: true,
          label: 'đồ thị không liên thông không phải lỗi runtime',
        },
        {
          stdinLines: ['A>B:-1', 'A B'],
          expected: 'negative-edge',
          match: 'contains',
          hidden: true,
          label: 'Dijkstra phải từ chối cạnh âm',
        },
        {
          stdinLines: ['A>B:1', 'A A'],
          expected: 'distance=0\npath=A',
          match: 'contains',
          hidden: true,
          label: 'đường từ đỉnh đến chính nó có độ dài 0',
        },
        {
          stdinLines: ['-', 'A B'],
          expected: 'khong-co-duong',
          match: 'contains',
          hidden: true,
          label: 'đồ thị rỗng không có đường giữa hai đỉnh khác nhau',
        },
      ],
      hints: [
        'Hãy kiểm tra toàn bộ cạnh âm trước khi khởi tạo heap.',
        'Lưu `parent` khi một candidate thực sự ngắn hơn khoảng cách cũ.',
        'Nếu target không có trong `best`, in `khong-co-duong` thay vì ném lỗi.',
      ],
      sampleSolution: `import heapq
try:
    raw_edges = input().strip()
    start, target = input().split()
    if len(start) != 1 or len(target) != 1 or not start.isalnum() or not target.isalnum():
        raise ValueError
    tokens = [] if raw_edges == "-" else raw_edges.split(",")
    if not raw_edges or len(tokens) > 12:
        raise ValueError
    edges = []
    has_negative = False
    for token in tokens:
        parts = token.split(":")
        if len(parts) != 2:
            raise ValueError
        pair, raw_weight = parts
        ends = pair.split(">")
        if len(ends) != 2 or any(len(node) != 1 or not node.isalnum() for node in ends):
            raise ValueError
        source, destination = ends
        if source == destination:
            raise ValueError
        weight = int(raw_weight)
        if weight < 0:
            has_negative = True
        if weight > 99 or (source, destination) in [(a, b) for a, b, _ in edges]:
            raise ValueError
        edges.append((source, destination, weight))
    if has_negative:
        print("negative-edge")
    else:
        graph = {}
        for source, destination, weight in edges:
            graph.setdefault(source, []).append((destination, weight))
            graph.setdefault(destination, [])
        best = {start: 0}
        parent = {}
        queue = [(0, start)]
        while queue:
            distance, node = heapq.heappop(queue)
            if distance != best.get(node):
                continue
            for next_node, weight in sorted(graph.get(node, [])):
                candidate = distance + weight
                if candidate < best.get(next_node, float("inf")):
                    best[next_node] = candidate
                    parent[next_node] = node
                    heapq.heappush(queue, (candidate, next_node))
        if target not in best:
            print("khong-co-duong")
        else:
            path = [target]
            while path[-1] != start:
                path.append(parent[path[-1]])
            path.reverse()
            print("distance=" + str(best[target]))
            print("path=" + ">".join(path))
except (EOFError, ValueError):
    print("tu-choi")`,
    },
    homework:
      'Viết bộ sinh đồ thị nhỏ có cạnh âm rồi chứng minh Dijkstra bị từ chối; với đồ thị không âm, đối chiếu kết quả với một oracle brute-force có giới hạn rõ ràng.',
    srsCards: [
      {
        hoi: 'Vì sao Dijkstra không nhận cạnh trọng số âm?',
        dap: 'Một cạnh âm có thể làm đường đã chốt trở nên ngắn hơn về sau, phá giả định nền tảng khiến Dijkstra được phép tham lam.',
      },
      {
        hoi: 'Không có đường từ start đến target nên được xử lý thế nào?',
        dap: 'Đó là kết quả hợp lệ của đồ thị không liên thông: trả nhãn khong-co-duong rõ ràng thay vì crash hoặc bịa khoảng cách.',
      },
    ],
  },
]
