// lessons/ly12c1.ts — Vật lí 12, Chương 1: Vật lí nhiệt (7 bài).
import type { PhysicsLesson } from '../lessonTypes.js'
import { donViHienThi } from '@dhcb/core-grading/units'

export const LY12_C1_LESSONS: PhysicsLesson[] = [
  {
    id: 'ly12-c1-b1',
    animation: {
      title: 'Ba thể của chất khác nhau ở mức tự do của phân tử',
      description:
        'Ba ô vuông cạnh nhau là cùng một chất ở ba thể. Ô RẮN: các hạt xếp thành mạng đều đặn, mỗi hạt chỉ rung nhẹ quanh một vị trí cố định nên vật giữ nguyên cả hình dạng lẫn thể tích. Ô LỎNG: các hạt vẫn chạm nhau nhưng trượt được lên nhau, khối chất giữ thể tích mà mất hình dạng riêng. Ô KHÍ: các hạt cách xa nhau và bay tự do khắp bình, nên chất khí chiếm trọn thể tích bình chứa. Đun nóng là cấp năng lượng để hạt rung mạnh hơn rồi bứt khỏi vị trí — đó chính là nóng chảy và hoá hơi; làm lạnh thì đi ngược lại.',
      viewBoxWidth: 460,
      viewBoxHeight: 200,
      durationMs: 3000,
      loop: true,
      shapes: [
        {
          kind: 'rect',
          id: 'o-ran',
          x: 10,
          y: 40,
          w: 130,
          h: 120,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 't-ran',
          x: 75,
          y: 30,
          text: 'RẮN',
          size: 15,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'rect',
          id: 'o-long',
          x: 165,
          y: 40,
          w: 130,
          h: 120,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 't-long',
          x: 230,
          y: 30,
          text: 'LỎNG',
          size: 15,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'rect',
          id: 'o-khi',
          x: 320,
          y: 40,
          w: 130,
          h: 120,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 't-khi',
          x: 385,
          y: 30,
          text: 'KHÍ',
          size: 15,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'circle',
          id: 'r0',
          cx: 35,
          cy: 65,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r1',
          cx: 65,
          cy: 65,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r2',
          cx: 95,
          cy: 65,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r3',
          cx: 125,
          cy: 65,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r4',
          cx: 35,
          cy: 95,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r5',
          cx: 65,
          cy: 95,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r6',
          cx: 95,
          cy: 95,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r7',
          cx: 125,
          cy: 95,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r8',
          cx: 35,
          cy: 125,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r9',
          cx: 65,
          cy: 125,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r10',
          cx: 95,
          cy: 125,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'r11',
          cx: 125,
          cy: 125,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 750,
              dx: 2,
              dy: -2,
            },
            {
              atMs: 1500,
              dx: 0,
              dy: 2,
            },
            {
              atMs: 2250,
              dx: -2,
              dy: 0,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'l0',
          cx: 190,
          cy: 75,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: -14,
              dy: 8,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'l1',
          cx: 218,
          cy: 75,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: 14,
              dy: 8,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'l2',
          cx: 246,
          cy: 75,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: -14,
              dy: 8,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'l3',
          cx: 274,
          cy: 75,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: 14,
              dy: 8,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'l4',
          cx: 190,
          cy: 109,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: -14,
              dy: 8,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'l5',
          cx: 218,
          cy: 109,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: 14,
              dy: 8,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'l6',
          cx: 246,
          cy: 109,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: -14,
              dy: 8,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'l7',
          cx: 274,
          cy: 109,
          r: 7,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: 14,
              dy: 8,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'k0',
          cx: 340,
          cy: 70,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: -35,
              dy: 40,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'k1',
          cx: 374,
          cy: 70,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: 45,
              dy: -30,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'k2',
          cx: 408,
          cy: 70,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: -35,
              dy: -30,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'k3',
          cx: 340,
          cy: 110,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: 45,
              dy: 40,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'k4',
          cx: 374,
          cy: 110,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: -35,
              dy: -30,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'circle',
          id: 'k5',
          cx: 408,
          cy: 110,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1500,
              dx: 45,
              dy: -30,
            },
            {
              atMs: 3000,
              dx: 0,
              dy: 0,
            },
          ],
        },
        {
          kind: 'label',
          id: 'gc-ran',
          x: 75,
          y: 180,
          text: 'rung tại chỗ',
          size: 11,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'gc-long',
          x: 230,
          y: 180,
          text: 'trượt lên nhau',
          size: 11,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'gc-khi',
          x: 385,
          y: 180,
          text: 'bay tự do',
          size: 11,
          anchor: 'middle',
          fill: 'muted',
        },
      ],
    },
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Vật lí nhiệt',
    lessonNumber: 1,
    title: 'Cấu trúc của chất. Sự chuyển thế',
    hook:
      'Tại sao nước đá để ngoài phòng lại tan thành nước lỏng, rồi đun nóng nước lỏng lại biến thành hơi nước? ' +
      'Mọi chất quanh ta đều được cấu tạo từ các hạt chuyển động không ngừng, và trạng thái của chúng phụ thuộc vào nhiệt độ và lực liên kết phân tử.',
    theory:
      'MÔ HÌNH ĐỘNG HỌC PHÂN TỬ VỀ CẤU TRÚC CHẤT:\n' +
      '1. Các chất được cấu tạo từ các hạt riêng biệt gọi là phân tử (hoặc nguyên tử, ion).\n' +
      '2. Các phân tử chuyển động không ngừng, chuyển động này càng nhanh thì nhiệt độ của chất càng cao (chuyển động nhiệt).\n' +
      '3. Giữa các phân tử có các lực tương tác (lực hút và lực đẩy phân tử).\n\n' +
      'BA THỂ CỦA CHẤT (RẮN - LỎNG - KHÍ):\n' +
      '— Thể rắn: Các phân tử ở rất gần nhau, sắp xếp có trật tự, chỉ dao động xung quanh các vị trí cân bằng cố định. Do đó, chất rắn có thể tích và hình dạng xác định.\n' +
      '— Thể lỏng: Lực liên kết yếu hơn thể rắn, các phân tử dao động quanh các vị trí cân bằng có thể di chuyển (trượt lên nhau). Do đó, chất lỏng có thể tích xác định nhưng hình dạng không xác định (phụ thuộc bình chứa).\n' +
      '— Thể khí: Lực tương tác phân tử rất yếu, các phân tử ở xa nhau và chuyển động hỗn loạn không ngừng. Chất khí không có thể tích và hình dạng xác định, luôn chiếm toàn bộ thể tích bình chứa.\n\n' +
      'SỰ CHUYỂN THỂ (PHASE TRANSITIONS):\n' +
      '— Nóng chảy (rắn -> lỏng) & Đông đặc (lỏng -> rắn).\n' +
      '— Hoá hơi (lỏng -> khí - gồm bay hơi ở bề mặt và sôi ở toàn lòng chất lỏng) & Ngưng tụ (khí -> lỏng).\n' +
      '— Thăng hoa (rắn -> khí) & Ngưng kết (khí -> rắn).',
    workedExample: {
      problem:
        'Dựa vào mô hình động học phân tử, hãy giải thích tại sao chất khí không có hình dạng và thể tích xác định mà luôn chiếm đầy bình chứa.',
      steps: [
        'Nhận xét khoảng cách phân tử ở thể khí: Khoảng cách giữa các phân tử khí rất lớn so với kích thước phân tử.',
        'Nhận xét lực liên kết phân tử: Do khoảng cách lớn nên lực tương tác giữa các phân tử khí rất yếu, hầu như có thể bỏ qua.',
        'Mô tả chuyển động: Các phân tử khí chuyển động hỗn loạn hoàn toàn không ngừng về mọi phía, va chạm liên tục vào nhau và vào thành bình.',
        'Kết luận: Do chuyển động hỗn loạn tự do và lực liên kết yếu, các phân tử khí tự do lan toả rộng và chiếm toàn bộ thể tích cũng như hình dạng của bất kì bình chứa nào.',
      ],
      answer:
        'Do lực liên kết phân tử rất yếu và khoảng cách phân tử rất lớn, các phân tử khí chuyển động hỗn loạn không ngừng chiếm đầy bình chứa.',
    },
    checkQuestions: [
      {
        prompt:
          'Thể nào của chất có đặc điểm là các phân tử chỉ dao động xung quanh các vị trí cân bằng cố định xác định?',
        choices: [
          { id: 'st_1', label: 'Thể rắn' },
          { id: 'st_2', label: 'Thể lỏng' },
          { id: 'st_3', label: 'Thể khí' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['st_1'],
        },
        explain:
          'Trong chất rắn, lực tương tác phân tử rất mạnh, giữ cho các phân tử chỉ dao động tại chỗ quanh vị trí cân bằng cố định.',
      },
      {
        prompt: 'Quá trình chuyển từ thể lỏng sang thể khí (hơi) của một chất được gọi là:',
        choices: [
          { id: 'ph_1', label: 'Sự hoá hơi' },
          { id: 'ph_2', label: 'Sự nóng chảy' },
          { id: 'ph_3', label: 'Sự ngưng tụ' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['ph_1'],
        },
        explain:
          'Quá trình chuyển đổi từ lỏng sang hơi/khí gọi là sự hoá hơi (gồm bay hơi và sôi).',
      },
    ],
    srsCards: [
      {
        hoi: 'Chuyển động nhiệt của các phân tử liên hệ như thế nào với nhiệt độ của chất?',
        dap: 'Nhiệt độ của chất càng cao thì các phân tử chuyển động hỗn loạn càng nhanh.',
      },
      {
        hoi: 'Sự thăng hoa là quá trình chuyển thể nào?',
        dap: 'Là quá trình chuyển thể trực tiếp từ thể rắn sang thể khí (không qua thể lỏng trung gian).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly12-c1-b2',
    animation: {
      title: 'Nội năng đổi bằng hai đường: truyền nhiệt và thực hiện công',
      description:
        'Khối khí trong xilanh là hệ ta theo dõi, thanh đứng bên phải là "mực" nội năng U của nó. Giai đoạn đầu, ngọn lửa cấp nhiệt lượng Q > 0 từ dưới lên: mũi tên Q chỉ vào hệ và mực U dâng lên. Giai đoạn sau, khí dãn ra đẩy pit-tông đi lên, hệ thực hiện công A lên bên ngoài nên phần năng lượng đó rời khỏi hệ và mực U tụt xuống. Cộng lại chính là định luật I nhiệt động lực học: ΔU = Q + A, với quy ước Q và A dương khi hệ NHẬN. Điểm cần nhớ: nhiệt lượng và công là hai cách TRUYỀN năng lượng, còn nội năng là lượng năng lượng hệ ĐANG chứa.',
      viewBoxWidth: 440,
      viewBoxHeight: 220,
      durationMs: 4000,
      loop: true,
      shapes: [
        {
          kind: 'rect',
          id: 'xilanh',
          x: 60,
          y: 60,
          w: 120,
          h: 130,
          stroke: 'muted',
          strokeWidth: 2.5,
        },
        {
          kind: 'rect',
          id: 'khi',
          x: 64,
          y: 110,
          w: 112,
          h: 76,
          fill: 'accent',
          opacity: 0.5,
        },
        {
          kind: 'rect',
          id: 'piston',
          x: 60,
          y: 96,
          w: 120,
          h: 14,
          fill: 'neutral',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
            },
            {
              atMs: 2000,
              dy: 0,
            },
            {
              atMs: 4000,
              dy: -40,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-khi',
          x: 120,
          y: 155,
          text: 'khí',
          size: 13,
          anchor: 'middle',
          fill: 'surface',
        },
        {
          kind: 'arrow',
          id: 'mui-q',
          x1: 120,
          y1: 215,
          x2: 120,
          y2: 195,
          stroke: 'danger',
          strokeWidth: 3,
          keyframes: [
            {
              atMs: 0,
              opacity: 1,
            },
            {
              atMs: 2000,
              opacity: 1,
            },
            {
              atMs: 2100,
              opacity: 0.1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-q',
          x: 150,
          y: 212,
          text: 'Q > 0 (nhận nhiệt)',
          size: 12,
          anchor: 'start',
          fill: 'neutral',
        },
        {
          kind: 'arrow',
          id: 'mui-a',
          x1: 205,
          y1: 100,
          x2: 205,
          y2: 60,
          stroke: 'primary',
          strokeWidth: 3,
          keyframes: [
            {
              atMs: 0,
              opacity: 0.1,
            },
            {
              atMs: 2000,
              opacity: 0.1,
            },
            {
              atMs: 2100,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-a',
          x: 215,
          y: 80,
          text: 'A < 0 (sinh công)',
          size: 12,
          anchor: 'start',
          fill: 'neutral',
        },
        {
          kind: 'rect',
          id: 'cot-vien',
          x: 380,
          y: 30,
          w: 34,
          h: 160,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'rect',
          id: 'cot-u',
          x: 382,
          y: 130,
          w: 30,
          h: 58,
          fill: 'primary',
          keyframes: [
            {
              atMs: 0,
              dy: 0,
              scale: 1,
            },
            {
              atMs: 2000,
              dy: -26,
              scale: 1.9,
            },
            {
              atMs: 4000,
              dy: -6,
              scale: 1.3,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-u',
          x: 397,
          y: 22,
          text: 'U',
          size: 15,
          anchor: 'middle',
          fill: 'neutral',
        },
        {
          kind: 'label',
          id: 'ct',
          x: 220,
          y: 18,
          text: 'ΔU = Q + A',
          size: 16,
          anchor: 'middle',
          fill: 'primary',
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Cấp nhiệt: Q vào hệ, nội năng U tăng',
        },
        {
          atMs: 2000,
          text: 'Khí đẩy pit-tông: hệ sinh công, U giảm bớt',
        },
      ],
    },
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Vật lí nhiệt',
    lessonNumber: 2,
    title: 'Nội năng. Định luật I của nhiệt động lực học',
    hook:
      'Xoa mạnh hai bàn tay vào nhau trong ngày đông lạnh giá giúp tay ấm lên. ' +
      'Dưới góc độ vật lí, ta đã thực hiện công lên tay để làm tăng nội năng và nhiệt độ của chúng.',
    theory:
      'KHÁI NIỆM NỘI NĂNG (INTERNAL ENERGY):\n' +
      '— Nội năng (U) của một hệ là tổng động năng của chuyển động hỗn loạn không ngừng của các phân tử cấu tạo nên hệ và thế năng tương tác giữa chúng.\n' +
      '— Nội năng phụ thuộc vào nhiệt độ (T) và thể tích (V) của hệ: U = f(T, V).\n\n' +
      'CÁC CÁCH LÀM BIẾN ĐỔI NỘI NĂNG:\n' +
      '1. Thực hiện công (Doing work): Có sự chuyển hoá năng lượng từ cơ năng sang nội năng (ví dụ cọ xát, nén khí).\n' +
      '2. Truyền nhiệt (Heat transfer): Không có sự chuyển hoá năng lượng mà chỉ có sự truyền nội năng từ vật này sang vật khác (nhiệt lượng Q).\n\n' +
      'ĐỊNH LUẬT I NHIỆT ĐỘNG LỰC HỌC:\n' +
      '— Phát biểu: Độ biến thiên nội năng của hệ bằng tổng công và nhiệt lượng mà hệ nhận được.\n' +
      '— Công thức: ΔU = A + Q.\n' +
      '— Quy ước dấu:\n' +
      '  — Q > 0: Hệ nhận nhiệt lượng (thu nhiệt); Q < 0: Hệ truyền nhiệt lượng (toả nhiệt).\n' +
      '  — A > 0: Hệ nhận công (bị nén); A < 0: Hệ thực hiện công (sinh công/dãn nở).',
    workedExample: {
      problem:
        'Một lượng khí bị nén trong xilanh. Người ta thực hiện lên khối khí một công bằng 200 J, ' +
        'đồng thời khối khí toả ra môi trường một nhiệt lượng bằng 150 J. Tính độ biến thiên nội năng ΔU của khối khí.',
      steps: [
        'Xác định dấu của công A: Hệ nhận công từ bên ngoài nên A = +200 J.',
        'Xác định dấu của nhiệt lượng Q: Khí toả nhiệt ra môi trường bên ngoài nên Q = -150 J.',
        'Áp dụng công thức Định luật I nhiệt động lực học: ΔU = A + Q.',
        'Thay số tính toán: ΔU = 200 + (-150) = 50 J.',
        'Kết luận: Nội năng của khối khí tăng thêm 50 J.',
      ],
      answer: 'ΔU = 50 J.',
    },
    checkQuestions: [
      {
        prompt:
          'Viết biểu thức toán học của Định luật I nhiệt động lực học liên hệ giữa độ biến thiên nội năng ΔU, công A và nhiệt lượng Q.',
        choices: [
          { id: 'th_1', label: 'ΔU = A + Q' },
          { id: 'th_2', label: 'ΔU = A - Q' },
          { id: 'th_3', label: 'ΔU = Q - A' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['th_1'],
        },
        explain:
          'Độ biến thiên nội năng bằng tổng công và nhiệt lượng mà hệ nhận được: ΔU = A + Q.',
      },
      {
        prompt:
          'Một chất khí nhận nhiệt lượng 500 J từ bên ngoài để dãn nở sinh công 200 J ra môi trường (hệ thực hiện công). Tính độ biến thiên nội năng của khối khí này.',
        answer: {
          kind: 'numeric',
          value: 300,
          unit: 'J',
        },
        explain: 'Q = +500 J, A = -200 J (hệ sinh công). ΔU = A + Q = -200 + 500 = 300 J.',
      },
    ],
    srsCards: [
      {
        hoi: 'Nội năng của một vật gồm những thành phần năng lượng nào ở cấp độ vi mô?',
        dap: 'Gồm động năng của chuyển động nhiệt phân tử và thế năng tương tác giữa các phân tử đó.',
      },
      {
        hoi: 'Trong công thức ΔU = A + Q, khi nào hệ nhận giá trị Q < 0 và A < 0?',
        dap: 'Q < 0 khi hệ toả nhiệt ra bên ngoài. A < 0 khi hệ dãn nở thực hiện công lên bên ngoài.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly12-c1-b3',
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Vật lí nhiệt',
    lessonNumber: 3,
    title: 'Nhiệt độ. Thang nhiệt độ – nhiệt kế',
    hook:
      'Làm thế nào định nghĩa chính xác trạng thái "nóng" và "lạnh" một cách khoa học? ' +
      'Tại sao thang đo Kelvin bắt đầu từ độ không tuyệt đối -273,15 °C? Hãy cùng khám phá thế giới nhiệt độ.',
    theory:
      'KHÁI NIỆM NHIỆT ĐỘ VÀ CÂN BẰNG NHIỆT:\n' +
      '— Nhiệt độ là đại lượng vật lí đặc trưng cho mức độ nóng lạnh của vật, đo bằng động năng trung bình của chuyển động nhiệt phân tử.\n' +
      '— Trạng thái cân bằng nhiệt: Khi hai vật tiếp xúc nhiệt đạt cùng nhiệt độ, không còn sự truyền nhiệt ròng giữa chúng.\n\n' +
      'CÁC THANG NHIỆT ĐỘ THÔNG DỤNG:\n' +
      '1. Thang Celsius (t, °C): Lấy nhiệt độ nóng chảy của nước đá nguyên chất làm mốc 0 °C, nhiệt độ sôi của nước làm mốc 100 °C (ở áp suất tiêu chuẩn).\n' +
      '2. Thang Kelvin (T, K): Là thang nhiệt độ tuyệt đối trong hệ SI. Độ không tuyệt đối (0 K) là nhiệt độ thấp nhất trên lí thuyết, nơi mọi chuyển động nhiệt phân tử ngừng lại.\n\n' +
      'HỆ THỨC CHUYỂN ĐỔI GIỮA CELSIUS VÀ KELVIN:\n' +
      '— T (K) = t (°C) + 273,15  (Thường làm tròn thành T = t + 273).\n' +
      '— Lưu ý về độ chênh lệch nhiệt độ: Khoảng chia của 1 độ C bằng đúng khoảng chia của 1 Kelvin, tức là: ΔT (K) = Δt (°C).',
    workedExample: {
      problem:
        'Nhiệt độ phòng hiện tại đo được là t = 27 °C. ' +
        'a) Hãy chuyển đổi nhiệt độ này sang thang tuyệt đối Kelvin (T).\n' +
        'b) Nếu nhiệt độ phòng tăng thêm 5 °C thì thang Kelvin tăng thêm bao nhiêu?',
      steps: [
        'Áp dụng công thức chuyển đổi: T = t + 273,15.',
        'Thay số tính toán: T = 27 + 273,15 = 300,15 K.',
        'Theo lí thuyết, độ chênh lệch nhiệt độ ở hai thang đo là bằng nhau (ΔT = Δt).',
        'Vì nhiệt độ tăng thêm Δt = 5 °C nên thang Kelvin cũng tăng thêm đúng ΔT = 5 K.',
      ],
      answer: 'T = 300,15 K; Độ tăng tuyệt đối là 5 K.',
    },
    checkQuestions: [
      {
        prompt:
          'Nhiệt độ tuyệt đối T (K) ở thang Kelvin liên hệ với nhiệt độ t (°C) ở thang Celsius theo công thức chuẩn nào?',
        choices: [
          { id: 'tc_1', label: 'T = t + 273,15' },
          { id: 'tc_2', label: 'T = t - 273,15' },
          { id: 'tc_3', label: 'T = (t + 273,15) * 1,8' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['tc_1'],
        },
        explain: 'T tuyệt đối bằng nhiệt độ Celsius cộng thêm hằng số gốc 273,15: T = t + 273,15.',
      },
      {
        prompt:
          'Chuyển đổi nhiệt độ t = 25 °C sang thang nhiệt độ Kelvin (nhập giá trị chính xác dùng hằng số gốc 273,15).',
        answer: {
          kind: 'numeric',
          value: 298.15,
          unit: 'K',
        },
        explain:
          'Thang Kelvin và thang Celsius có cùng ĐỘ CHIA, chỉ khác gốc, nên đổi một giá trị nhiệt độ chỉ cần cộng 273,15: T = 25 + 273,15 = 298,15 K. Cũng vì cùng độ chia nên một ĐỘ CHÊNH nhiệt độ tính bằng °C hay K đều ra cùng con số — chỗ đó không cộng gì cả.',
      },
    ],
    srsCards: [
      {
        hoi: 'Độ không tuyệt đối (0 K) có giá trị bằng bao nhiêu độ C?',
        dap: '-273,15 °C.',
      },
      {
        hoi: 'Độ biến thiên nhiệt độ 10 °C tương đương với độ biến thiên bao nhiêu Kelvin?',
        dap: 'Tương đương đúng 10 K (vì ΔT = Δt).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly12-c1-b4',
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Vật lí nhiệt',
    lessonNumber: 4,
    title: 'Nhiệt dung riêng',
    hook:
      'Tại sao bãi cát ngoài bờ biển lại nóng bỏng chân dưới ánh nắng mặt trời, trong khi nước biển sát cạnh bên vẫn mát rượi? ' +
      'Nước có khả năng trữ nhiệt rất lớn, hay nói cách khác là có Nhiệt dung riêng cao vượt trội.',
    theory:
      'ĐỊNH NGHĨA NHIỆT DUNG RIÊNG (SPECIFIC HEAT CAPACITY):\n' +
      '— Nhiệt dung riêng (c) của một chất là nhiệt lượng cần thiết để làm cho 1 kg chất đó tăng thêm 1 K (hoặc 1 °C).\n' +
      '— Công thức tính nhiệt lượng thu vào hay toả ra khi thay đổi nhiệt độ:\n' +
      '  Q = m * c * Δt  = m * c * (t₂ - t₁).\n' +
      '  — Q: Nhiệt lượng thu vào hay toả ra (đơn vị: J).\n' +
      '  — m: Khối lượng chất (đơn vị: kg).\n' +
      '  — c: Nhiệt dung riêng của chất (đơn vị: J/kg.K hoặc J/kg.°C).\n' +
      '  — Δt: Độ biến thiên nhiệt độ (độ C hoặc K).\n' +
      '— Ý nghĩa: Chất có c càng lớn thì cần nhiều nhiệt lượng để thay đổi nhiệt độ (nóng lên chậm và nguội đi chậm). c_nước ≈ 4200 J/kg.K.',
    workedExample: {
      problem:
        'Một khối nhôm có khối lượng m = 2 kg được nung nóng tăng nhiệt độ từ t₁ = 20 °C lên t₂ = 50 °C. ' +
        'Biết nhiệt dung riêng của nhôm là c = 880 J/kg.K. Tính nhiệt lượng Q mà khối nhôm đã hấp thụ.',
      steps: [
        'Xác định các thông số: m = 2 kg, c = 880 J/kg.K.',
        'Tính độ tăng nhiệt độ: Δt = t₂ - t₁ = 50 - 20 = 30 °C (tương đương 30 K).',
        'Áp dụng công thức tính nhiệt lượng: Q = m * c * Δt.',
        'Thay số tính toán: Q = 2 * 880 * 30 = 52800 J = 52,8 kJ.',
      ],
      answer: 'Q = 52800 J (52,8 kJ).',
    },
    checkQuestions: [
      {
        prompt:
          'Công thức tính nhiệt lượng Q thu vào hay toả ra của một vật khối lượng m, nhiệt dung riêng c khi nhiệt độ biến đổi một lượng Δt là gì?',
        choices: [
          { id: 'hc_1', label: 'Q = m * c * Δt' },
          { id: 'hc_2', label: 'Q = m * c / Δt' },
          { id: 'hc_3', label: 'Q = c * Δt / m' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['hc_1'],
        },
        explain:
          'Nhiệt lượng tỉ lệ thuận với khối lượng, nhiệt dung riêng và độ biến thiên nhiệt độ: Q = mcΔt.',
      },
      {
        prompt:
          'Cần cung cấp nhiệt lượng bằng bao nhiêu Joule để đun nóng 0,5 kg nước tăng thêm 10 K? Biết nhiệt dung riêng của nước là 4200 J/kg.K.',
        answer: {
          kind: 'numeric',
          value: 21000,
          unit: 'J',
        },
        explain:
          'Q = m * c * Δt = 0,5 * 4200 * 10 = 21000 J. Δt ở đây là ĐỘ TĂNG nhiệt độ (K hoặc °C đều được vì là hiệu số), khác với việc đổi nhiệt độ tuyệt đối T sang Kelvin.',
      },
    ],
    srsCards: [
      {
        hoi: 'Đơn vị đo chuẩn của nhiệt dung riêng trong hệ SI là gì?',
        dap: 'Joule trên kilôgam Kelvin (J/kg.K).',
      },
      {
        hoi: 'Tại sao nước được dùng nhiều làm chất làm mát động cơ ô tô hay lò phản ứng?',
        dap: 'Vì nước có nhiệt dung riêng rất lớn (4200 J/kg.K), giúp hấp thụ lượng nhiệt lớn mà ít bị tăng nhiệt độ quá cao.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly12-c1-b5',
    animation: {
      title: 'Đang nóng chảy thì nhiệt độ đứng yên dù vẫn đun',
      description:
        'Đồ thị nhiệt độ theo thời gian của một cục nước đá được đun đều. Đoạn dốc đầu tiên: đá lạnh nóng dần lên tới 0 °C, nhiệt lượng cấp vào làm tăng động năng chuyển động nhiệt nên nhiệt kế đi lên. Đoạn NẰM NGANG ở 0 °C là điều cần chú ý nhất: bếp vẫn đun, nhiệt lượng vẫn vào, nhưng nhiệt độ không nhích một độ nào — toàn bộ năng lượng đang dùng để phá vỡ liên kết trong mạng tinh thể, tức là chuyển đá thành nước. Chỉ khi mẩu đá cuối cùng tan hết thì nhiệt độ mới lại tăng (đoạn dốc thứ hai). Chiều dài đoạn nằm ngang tỉ lệ với nhiệt lượng Q = λ·m, và λ chính là nhiệt nóng chảy riêng của chất.',
      viewBoxWidth: 440,
      viewBoxHeight: 220,
      durationMs: 6000,
      loop: true,
      shapes: [
        {
          kind: 'line',
          id: 'truc-t',
          x1: 50,
          y1: 180,
          x2: 420,
          y2: 180,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'line',
          id: 'truc-nd',
          x1: 50,
          y1: 20,
          x2: 50,
          y2: 180,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'nhan-t',
          x: 415,
          y: 198,
          text: 't (thời gian)',
          size: 12,
          anchor: 'end',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'nhan-nd',
          x: 46,
          y: 16,
          text: 'T (°C)',
          size: 12,
          anchor: 'end',
          fill: 'muted',
        },
        {
          kind: 'line',
          id: 'muc-0',
          x1: 50,
          y1: 120,
          x2: 420,
          y2: 120,
          stroke: 'muted',
          strokeWidth: 1.2,
          dash: '4 4',
        },
        {
          kind: 'label',
          id: 'nhan-0',
          x: 44,
          y: 124,
          text: '0 °C',
          size: 12,
          anchor: 'end',
          fill: 'muted',
        },
        {
          kind: 'polyline',
          id: 'duong',
          points: [
            [50, 175],
            [130, 120],
            [270, 120],
            [400, 40],
          ],
          stroke: 'primary',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'gd1',
          x: 90,
          y: 160,
          text: 'đá nóng lên',
          size: 11,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'label',
          id: 'gd2',
          x: 200,
          y: 108,
          text: 'ĐANG NÓNG CHẢY — T không đổi',
          size: 12,
          anchor: 'middle',
          fill: 'primary',
        },
        {
          kind: 'label',
          id: 'gd3',
          x: 350,
          y: 80,
          text: 'nước nóng lên',
          size: 11,
          anchor: 'middle',
          fill: 'muted',
        },
        {
          kind: 'circle',
          id: 'diem',
          cx: 50,
          cy: 175,
          r: 6,
          fill: 'accent',
          keyframes: [
            {
              atMs: 0,
              dx: 0,
              dy: 0,
            },
            {
              atMs: 1400,
              dx: 80,
              dy: -55,
            },
            {
              atMs: 3800,
              dx: 220,
              dy: -55,
            },
            {
              atMs: 6000,
              dx: 350,
              dy: -135,
            },
          ],
        },
        {
          kind: 'arrow',
          id: 'q1',
          x1: 90,
          y1: 205,
          x2: 90,
          y2: 190,
          stroke: 'danger',
          strokeWidth: 2,
        },
        {
          kind: 'arrow',
          id: 'q2',
          x1: 200,
          y1: 205,
          x2: 200,
          y2: 190,
          stroke: 'danger',
          strokeWidth: 2,
        },
        {
          kind: 'arrow',
          id: 'q3',
          x1: 310,
          y1: 205,
          x2: 310,
          y2: 190,
          stroke: 'danger',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'nhan-q',
          x: 355,
          y: 212,
          text: 'đun đều, Q vào liên tục',
          size: 11,
          anchor: 'start',
          fill: 'muted',
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Đá dưới 0 °C: nhiệt vào làm nhiệt độ tăng',
        },
        {
          atMs: 1500,
          text: 'Tới 0 °C: nhiệt vào để phá liên kết, T đứng yên',
        },
        {
          atMs: 4000,
          text: 'Tan hết đá, nước mới tiếp tục nóng lên',
        },
      ],
    },
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Vật lí nhiệt',
    lessonNumber: 5,
    title: 'Nhiệt nóng chảy riêng',
    hook:
      'Khi cục nước đá tan chảy ở 0 °C, nhiệt độ của nó hoàn toàn không tăng thêm dù liên tục nhận nhiệt từ môi trường. ' +
      'Nhiệt lượng này đã đi đâu? Nó được dùng để phá vỡ các liên kết phân tử rắn chuyển thể sang lỏng.',
    theory:
      'Nhiệt lượng cần cung cấp để làm nóng chảy hoàn toàn một đơn vị khối lượng chất rắn ở nhiệt độ nóng chảy gọi là Nhiệt nóng chảy riêng.\n\n' +
      'CÔNG THỨC NHIỆT NÓNG CHẢY (LATENT HEAT OF FUSION):\n' +
      '— Q = λ * m.\n' +
      '  — Q: Nhiệt lượng cần cung cấp để chất rắn nóng chảy hoàn toàn (J).\n' +
      '  — λ: Nhiệt nóng chảy riêng của chất rắn (đơn vị: J/kg).\n' +
      '  — m: Khối lượng chất rắn (kg).\n' +
      '— Lưu ý: Trong suốt quá trình nóng chảy (hoặc đông đặc), nhiệt độ của hệ được giữ nguyên không đổi.',
    workedExample: {
      problem:
        'Tính nhiệt lượng Q cần cung cấp để làm nóng chảy hoàn toàn m = 2 kg nước đá ở nhiệt độ 0 °C. ' +
        'Biết nhiệt nóng chảy riêng của nước đá là λ = 3,4 * 10⁵ J/kg.',
      steps: [
        'Xác định các thông số: m = 2 kg, λ = 3,4 * 10⁵ J/kg.',
        'Áp dụng công thức tính nhiệt nóng chảy: Q = λ * m.',
        'Thay số tính toán: Q = 3,4 * 10⁵ * 2 = 6,8 * 10⁵ J = 680 kJ.',
      ],
      answer: 'Q = 6,8 * 10⁵ J.',
    },
    checkQuestions: [
      {
        prompt: 'Đơn vị đo của nhiệt nóng chảy riêng λ trong hệ SI là gì?',
        choices: [
          { id: 'lf_1', label: 'Joule trên kilôgam (J/kg)' },
          { id: 'lf_2', label: 'Joule trên kilôgam Kelvin (J/kg.K)' },
          { id: 'lf_3', label: 'Joule (J)' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['lf_1'],
        },
        explain: 'Nhiệt nóng chảy riêng được tính bằng Q/m nên có đơn vị là J/kg.',
      },
      {
        prompt:
          'Cần cung cấp nhiệt lượng 6 * 10⁵ J để nóng chảy hoàn toàn một khối kim loại ở nhiệt độ nóng chảy của nó. Biết nhiệt nóng chảy riêng của kim loại này là 2 * 10⁵ J/kg. Tính khối lượng của khối kim loại đó.',
        answer: {
          kind: 'numeric',
          value: 3,
          unit: 'kg',
        },
        explain:
          'Q = λ * m  ⇒  m = Q / λ = 6 * 10⁵ / (2 * 10⁵) = 3 kg. Công thức này chỉ dùng khi vật ĐÃ ở đúng nhiệt độ nóng chảy — không cộng thêm nhiệt lượng làm nóng vật trước đó.',
      },
    ],
    srsCards: [
      {
        hoi: 'Nhiệt độ của chất thay đổi như thế nào trong quá trình chuyển trạng thái nóng chảy hay đông đặc?',
        dap: 'Nhiệt độ của chất luôn được giữ không đổi trong suốt quá trình chuyển thể.',
      },
      {
        hoi: 'Ý nghĩa của nhiệt nóng chảy riêng λ = 3,4 * 10⁵ J/kg của nước đá là gì?',
        dap: 'Nghĩa là cần cung cấp 340.000 J nhiệt lượng để làm nóng chảy hoàn toàn 1 kg nước đá ở 0 °C.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly12-c1-b6',
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Vật lí nhiệt',
    lessonNumber: 6,
    title: 'Nhiệt hoá hơi riêng',
    hook:
      'Mồ hôi bay hơi khỏi da giúp cơ thể chúng ta hạ nhiệt mát mẻ trong những ngày nóng. ' +
      'Sự chuyển thể từ lỏng sang hơi cần hấp thụ một lượng năng lượng lớn để giải phóng các phân tử lỏng thoát ra ngoài.',
    theory:
      'Nhiệt lượng cần cung cấp để hoá hơi hoàn toàn một đơn vị khối lượng chất lỏng ở nhiệt độ sôi gọi là Nhiệt hoá hơi riêng.\n\n' +
      'CÔNG THỨC NHIỆT HOÁ HƠI (LATENT HEAT OF VAPORIZATION):\n' +
      '— Q = L * m.\n' +
      '  — Q: Nhiệt lượng cần cung cấp để chất lỏng hoá hơi hoàn toàn ở nhiệt độ sôi (J).\n' +
      '  — L: Nhiệt hoá hơi riêng của chất lỏng (đơn vị: J/kg).\n' +
      '  — m: Khối lượng chất lỏng (kg).\n' +
      '— Lưu ý: Trong suốt quá trình sôi và hoá hơi, nhiệt độ của chất lỏng giữ nguyên ở nhiệt độ sôi.',
    workedExample: {
      problem:
        'Tính nhiệt lượng Q cần cung cấp để hoá hơi hoàn toàn m = 0,5 kg nước lỏng ở nhiệt độ sôi 100 °C. ' +
        'Biết nhiệt hoá hơi riêng của nước là L = 2,26 * 10⁶ J/kg.',
      steps: [
        'Xác định các thông số: m = 0,5 kg, L = 2,26 * 10⁶ J/kg.',
        'Áp dụng công thức tính nhiệt hoá hơi: Q = L * m.',
        'Thay số tính toán: Q = 2,26 * 10⁶ * 0,5 = 1,13 * 10⁶ J = 1130 kJ.',
      ],
      answer: 'Q = 1,13 * 10⁶ J.',
    },
    checkQuestions: [
      {
        prompt:
          'Viết công thức tính nhiệt lượng Q cần thiết để hoá hơi hoàn toàn khối lượng m chất lỏng ở nhiệt độ sôi với nhiệt hoá hơi riêng L.',
        choices: [
          { id: 'vp_1', label: 'Q = L * m' },
          { id: 'vp_2', label: 'Q = L / m' },
          { id: 'vp_3', label: 'Q = m / L' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['vp_1'],
        },
        explain: 'Nhiệt lượng cần cung cấp tỉ lệ thuận với khối lượng cần hoá hơi: Q = Lm.',
      },
      {
        prompt:
          'Cung cấp nhiệt lượng 4 * 10⁶ J làm hoá hơi hoàn toàn 2 kg một chất lỏng ở nhiệt độ sôi của nó. Tính nhiệt hoá hơi riêng L của chất lỏng này.',
        answer: {
          kind: 'numeric',
          value: 2e6,
          unit: 'J/kg',
        },
        explain:
          'Nhiệt hoá hơi riêng là nhiệt lượng cần để hoá hơi MỘT KILÔGAM chất ở nhiệt độ sôi: L = Q / m = 4 * 10⁶ / 2 = 2 * 10⁶ J/kg. Suốt quá trình hoá hơi nhiệt độ KHÔNG tăng — toàn bộ nhiệt dùng để phá liên kết giữa các phân tử.',
      },
    ],
    srsCards: [
      {
        hoi: 'Sự hoá hơi gồm những hình thức nào?',
        dap: 'Gồm sự bay hơi (xảy ra ở mọi nhiệt độ, chỉ trên bề mặt chất lỏng) và sự sôi (xảy ra ở nhiệt độ sôi, trong toàn bộ lòng chất lỏng).',
      },
      {
        hoi: 'Đơn vị đo của nhiệt hoá hơi riêng L trong hệ SI là gì?',
        dap: 'Joule trên kilôgam (J/kg).',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
  {
    id: 'ly12-c1-b7',
    grade: '12',
    chapterNumber: 1,
    chapterTitle: 'Vật lí nhiệt',
    lessonNumber: 7,
    title: 'Bài tập về vật lí nhiệt',
    hook:
      'Luyện tập giải các bài toán trao đổi nhiệt phức tạp như pha trộn nước, đá tan chảy ' +
      'hay tính toán hiệu suất đun nấu sẽ giúp bạn củng cố sâu sắc kiến thức nhiệt học.',
    theory:
      'PHƯƠNG TRÌNH CÂN BẰNG NHIỆT (HEAT EQUILIBRIUM):\n' +
      '— Khi không có thất thoát nhiệt ra môi trường ngoài: Q_toả = Q_thu.\n' +
      '  — Vật toả nhiệt (nhiệt độ cao giảm xuống t_cânbằng): Q_toả = m * c * (t_đầu - t_cânbằng).\n' +
      '  — Vật thu nhiệt (nhiệt độ thấp tăng lên t_cânbằng): Q_thu = m * c * (t_cânbằng - t_đầu) + Q_chuyểnthể (nếu có chuyển thể đá tan/nước sôi).\n\n' +
      'HIỆU SUẤT ĐUN NẤU (HEATING EFFICIENCY):\n' +
      '— H = (Q_ích / Q_toànphần) * 100%.\n' +
      '  — Q_ích: Nhiệt lượng làm nóng nước/vật cần nấu đun.\n' +
      '  — Q_toànphần: Nhiệt năng do nhiên liệu toả ra hoặc điện năng tiêu thụ.',
    workedExample: {
      problem:
        'Người ta trộn m₁ = 1 kg nước ở t₁ = 80 °C với m₂ = 1 kg nước ở t₂ = 20 °C trong một nhiệt lượng kế cách nhiệt tốt. ' +
        'Tính nhiệt độ cân bằng θ của hỗn hợp nước khi ổn định (bỏ qua nhiệt lượng hấp thụ bởi nhiệt lượng kế).',
      steps: [
        'Khối nước nóng m₁ = 1 kg hạ nhiệt độ từ 80 °C xuống θ: Q_toả = m₁ * c * (80 - θ).',
        'Khối nước lạnh m₂ = 1 kg tăng nhiệt độ từ 20 °C lên θ: Q_thu = m₂ * c * (θ - 20).',
        'Áp dụng phương trình cân bằng nhiệt: Q_toả = Q_thu.',
        'Thay biểu thức: m₁ * c * (80 - θ) = m₂ * c * (θ - 20). Triệt tiêu c ở cả hai vế.',
        'Vì m₁ = m₂ = 1 kg nên phương trình trở thành: 80 - θ = θ - 20 ⇔ 2θ = 100 ⇔ θ = 50 °C.',
      ],
      answer: 'θ = 50 °C.',
    },
    checkQuestions: [
      {
        prompt:
          'Trong hệ trao đổi nhiệt khép kín hoàn hảo không trao đổi với bên ngoài, tổng nhiệt lượng do các vật toả ra luôn như thế nào so với tổng nhiệt lượng thu vào?',
        choices: [
          { id: 'eq_1', label: 'Bằng nhau' },
          { id: 'eq_2', label: 'Toả ra luôn lớn hơn' },
          { id: 'eq_3', label: 'Thu vào luôn lớn hơn' },
        ],
        answer: {
          kind: 'choice',
          correctIds: ['eq_1'],
        },
        explain:
          'Theo định luật bảo toàn năng lượng, tổng nhiệt lượng toả ra bằng đúng tổng nhiệt lượng thu vào: Q_toả = Q_thu.',
      },
      {
        prompt:
          'Pha trộn 2 kg nước ở 90 °C với 1 kg nước ở 30 °C trong bình cách nhiệt tốt. Tính nhiệt độ cân bằng của hỗn hợp nước thu được.',
        answer: {
          kind: 'numeric',
          value: donViHienThi(70, '°C'),
          unit: '°C',
        },
        explain:
          'Q_toả = Q_thu ⇔ m₁ * c * (t₁ - θ) = m₂ * c * (θ - t₂) ⇔ 2 * (90 - θ) = 1 * (θ - 30) ⇔ 180 - 2θ = θ - 30 ⇔ 3θ = 210 ⇔ θ = 70 °C.',
      },
    ],
    srsCards: [
      {
        hoi: 'Viết công thức tính hiệu suất đun nấu H của một bếp lò.',
        dap: 'H = Q_ích / Q_toànphần (thường nhân 100% để biểu diễn theo phần trăm).',
      },
      {
        hoi: 'Khi giải bài toán pha trộn nước đá ở dưới 0 °C vào nước ấm ở 40 °C, nhiệt lượng thu vào của đá gồm những giai đoạn nào?',
        dap: 'Gồm 3 giai đoạn: 1) Đá nhận nhiệt tăng lên 0 °C; 2) Đá nóng chảy hoàn toàn thành nước ở 0 °C; 3) Nước đá tan tăng nhiệt độ lên nhiệt độ cân bằng.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
