# Đặc tả — `algo-s2`: recursion, cây, đồ thị và greedy

> Trạng thái: **APPROVED FOR IMPLEMENTATION**. Goal `GOAL-2026-ASA`, lát cắt `M2/S1g`.

## Phạm vi

- `p6-u162` / `algo-s2-m1`: recursion có termination measure; backtracking hữu hạn, pruning so
  với oracle và negative control không được mất nghiệm.
- `p6-u163` / `algo-s2-m2`: BST/degeneration; priority queue top-k và trie prefix với ordering
  tất định, k=0/token sai bị từ chối.
- `p6-u164` / `algo-s2-m3`: graph immutable, BFS/DFS/topo có neighbor sorted; Dijkstra chỉ nhận
  trọng số không âm, `khong-co-duong`/cycle/negative edge tường minh, DSU và bounded oracle.
- `p6-u165` / `algo-s2-m4`: interval scheduling greedy có oracle brute-force hữu hạn; coin/greedy
  counterexample và exchange-invariant, không suy rộng finite search thành proof tổng quát.
- Mỗi unit có 2 lesson Python, curriculum/registry/lazy mapping, CTA và semantic gate.

## Ranh giới

Không thêm DP (`algo-s3`), balanced tree implementation, external graph library, graph UI, unlimited
brute-force hoặc benchmark 10k vertices. Simulator pure Python, input bounded, deterministic cùng
input/seed, không file/network/time/random global. Artifact thật vẫn cần graph solver ≥10k, đo hai
thuật toán và differential seed có tái lập.

## Hợp đồng và nghiệm thu

```ts
const ALGO_S2_UNIT_IDS = ['p6-u162', 'p6-u163', 'p6-u164', 'p6-u165'] as const
```

- [ ] 4 unit/8 lesson, Make có visible/hidden/edge; sample, worked và Predict chạy Python thật.
- [ ] recursion giảm measure/bounded; faulty prune bị oracle bắt; BST/trie/top-k ordering ổn định.
- [ ] graph không mutate input, xử lý empty/disconnected/cycle/no-path; Dijkstra reject negative.
- [ ] greedy có tie-break, oracle/counterexample và tuyên bố rõ miền hữu hạn.
- [ ] `SPEC_STAGE_UNITS['algo-s2']` map đúng 162..165; lazy registry/CTA đồng bộ.

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/algoS2Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npm run typecheck && npm run lint && npm run format:check && npm test
```

Rollback là revert trọn source PR và regenerate index, không tái dùng ID/xóa tiến độ. Rủi ro chính là
đánh đồng bounded simulator với proof/performance production; bị khóa bởi nhãn MÔ PHỎNG, semantic
test và rubric artifact.
