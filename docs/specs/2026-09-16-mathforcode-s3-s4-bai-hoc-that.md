# Đặc tả — `mathforcode-s3..s4`: đại số tuyến tính và giải tích

> Trạng thái: **APPROVED FOR IMPLEMENTATION**. Goal `GOAL-2026-ASA`, lát cắt `M2/S1f`.

## Một câu

Thêm tám bài Python tất định để người học tự kiểm chứng đại số tuyến tính, gradient và tối ưu trên
miền nhỏ, đồng thời giữ các artifact NumPy/ML/đồ thị thật ngoài sandbox.

## Phạm vi

- `p6-u158` (`mathforcode-s3-m1,m2`): vector 2D/dot/normalize và homogeneous transform 3×3;
  zero vector, sai dimension và thứ tự compose phải fail closed.
- `p6-u159` (`mathforcode-s3-m3,m4`): khử Gauss partial pivot với nghiệm duy nhất/vô nghiệm/vô số
  nghiệm; power iteration/PageRank đồ chơi với delta, trạng thái probability không hợp lệ bị từ chối.
- `p6-u160` (`mathforcode-s4-m1,m2`): finite difference/gradient descent cho quadratic và
  MSE/MAE/hồi quy tuyến tính; epsilon, learning rate, variance và divergence có contract tường minh.
- `p6-u161` (`mathforcode-s4-m3,m4`): chain rule/backprop một neuron ẩn so với numerical gradient;
  tối ưu giá có ràng buộc/budget trên miền hữu hạn và tiêu chí dừng fixed.
- Mỗi unit đúng hai `ProgrammingLesson` Python; đăng ký curriculum, registry/lazy, mappings
  `mathforcode-s3` và `mathforcode-s4`, semantic test và CTA hiện theo mapping.

## Không làm

- Không dùng NumPy, autograd, subprocess, network, random/time toàn cục, GPU hoặc training thật.
- Không tuyên bố simulator chứng minh accuracy test set, convergence tổng quát, benchmark hay
  PageRank/price engine production.
- Không thay rubric artifact: geometry/transform thực, so sánh NumPy ngoài sandbox, gradient sai
  lệch dưới ngưỡng, biểu đồ loss và mạng một tầng ẩn vẫn cần bằng chứng riêng.

## Hợp đồng

```ts
const MATH_S3_UNIT_IDS = ['p6-u158', 'p6-u159'] as const
const MATH_S4_UNIT_IDS = ['p6-u160', 'p6-u161'] as const
```

| Điều kiện                                        | Hành vi bắt buộc                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| chuẩn hóa vector 0 / shape sai / NaN/inf         | từ chối có nhãn, không chia hay lan giá trị sai                  |
| compose transform sai thứ tự                     | trace khác rõ; không coi phép nhân ma trận giao hoán             |
| pivot suy biến                                   | phân biệt vô nghiệm, vô số nghiệm và nghiệm duy nhất             |
| epsilon/lr không dương hoặc loss tăng vượt guard | từ chối/diverged, không nói hội tụ                               |
| numerical vs analytic gradient                   | báo sai lệch tương đối với tolerance hữu hạn                     |
| miền giá/budget không khả thi                    | `infeasible`; finite search không suy rộng thành tối ưu toàn cục |

## Nghiệm thu

- [ ] Có 4 unit/8 lesson, Python sample/Worked/Predict chạy thật, visible+hidden case.
- [ ] `SPEC_STAGE_UNITS` map S3 đúng `158,159`, S4 đúng `160,161`; lazy registry đồng bộ.
- [ ] Test semantic khóa zero/pivot/singular/delta/epsilon/divergence/relative-error/constraint.
- [ ] Mọi bài ghi MÔ PHỎNG, pure Python, không library/runtime thật và không hạ rubric artifact.

```bash
npm run gen:lesson-index
npx vitest run packages/subject-programming/mathforcodeS34Lessons.test.ts
npx vitest run packages/subject-programming/lessonsPython.test.ts
npm run typecheck && npm run lint && npm run format:check
npm test && npm run build
```

## Rollout và rollback

Một PR source sau spec: thêm lesson → semantic/Python gate → generate lazy index → mapping/CTA.
Rollback là revert trọn PR source và regenerate index; không xóa tiến độ, tái dùng ID hay deploy
production. Rủi ro chính là hiểu finite simulator là ML/NumPy production; nhãn, contract và rubric
khóa ranh giới đó.
