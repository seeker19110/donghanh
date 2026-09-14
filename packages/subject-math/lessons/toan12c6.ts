// lessons/toan12c6.ts — Toán 12, Chương 6: Xác suất có điều kiện.
import type { MathLesson } from '../lessonTypes.js'

export const TOAN12_C6_LESSONS: MathLesson[] = [
  {
    id: 'toan12-c6-b1',
    grade: '12',
    chapterNumber: 6,
    chapterTitle: 'Xác suất có điều kiện',
    lessonNumber: 1,
    title: 'Xác suất có điều kiện và công thức Bayes',
    hook:
      'Một xét nghiệm sàng lọc bệnh được quảng cáo là "chính xác 99%". Bạn xét nghiệm và nhận kết quả dương tính. ' +
      'Vậy khả năng bạn thật sự mắc bệnh là 99%? Với một căn bệnh hiếm, con số thật có khi chỉ khoảng 9%. Sự chênh ' +
      'lệch khổng lồ ấy không phải lỗi của xét nghiệm — nó là chỗ trực giác con người sai một cách hệ thống.',
    theory:
      'ĐỊNH NGHĨA\n' +
      'Xác suất của A với ĐIỀU KIỆN B đã xảy ra:\n' +
      'P(A|B) = P(A ∩ B) / P(B), với P(B) > 0.\n' +
      'Ý nghĩa: khi biết B đã xảy ra, không gian mẫu bị THU HẸP lại chỉ còn B. Ta không còn tính trên toàn bộ Ω nữa ' +
      'mà tính trên B — đó là lý do mẫu số đổi từ 1 (tức P(Ω)) thành P(B).\n\n' +
      'CÔNG THỨC NHÂN XÁC SUẤT\n' +
      'P(A ∩ B) = P(B)·P(A|B) = P(A)·P(B|A).\n' +
      'Hai biến cố ĐỘC LẬP khi P(A|B) = P(A), tức việc B xảy ra không làm thay đổi khả năng của A. Khi đó công thức ' +
      'rút gọn thành P(A ∩ B) = P(A)·P(B).\n' +
      'CẢNH BÁO: "độc lập" KHÁC "xung khắc". Hai biến cố xung khắc (không cùng xảy ra) thì P(A ∩ B) = 0, và nếu cả ' +
      'hai đều có xác suất dương thì chúng KHÔNG độc lập — biết A xảy ra là biết chắc B không xảy ra, tức thông tin ' +
      'về A ảnh hưởng mạnh tới B. Nhầm hai khái niệm này là lỗi phổ biến nhất của chương.\n\n' +
      'CÔNG THỨC XÁC SUẤT TOÀN PHẦN\n' +
      'Nếu B và B̄ chia đôi không gian mẫu thì:\n' +
      'P(A) = P(B)·P(A|B) + P(B̄)·P(A|B̄).\n' +
      'Đây là cách "gom" các nhánh của một sơ đồ cây: đi hết mọi con đường dẫn tới A rồi cộng lại.\n\n' +
      'CÔNG THỨC BAYES\n' +
      'P(B|A) = P(B)·P(A|B) / P(A), trong đó P(A) tính bằng công thức toàn phần.\n' +
      'Bayes làm đúng một việc: ĐẢO NGƯỢC chiều điều kiện. Biết P(dương tính | có bệnh) mà cần P(có bệnh | dương ' +
      'tính) thì dùng Bayes.\n\n' +
      'VÌ SAO TRỰC GIÁC SAI Ở BÀI XÉT NGHIỆM\n' +
      'Người ta lẫn lộn P(A|B) với P(B|A) — hai con số hoàn toàn khác nhau. "99% chính xác" nói về P(dương tính | có ' +
      'bệnh). Nhưng nếu bệnh rất hiếm, số người KHOẺ MẠNH bị dương tính giả (1% của một nhóm rất đông) có thể nhiều ' +
      'gấp nhiều lần số người bệnh dương tính thật (99% của một nhóm rất nhỏ). Xác suất nền P(B), gọi là XÁC SUẤT ' +
      'TIÊN NGHIỆM, mới là thứ quyết định kết quả — và đó chính là thứ trực giác hay bỏ quên.',
    animation: {
      title: 'Biết B xảy ra thì không gian mẫu co lại còn đúng B',
      description:
        'Hình chữ nhật lớn là không gian mẫu, diện tích của nó ứng với xác suất 1. Biến cố B chiếm nửa trái nên P(B) = 1/2. Biến cố A là hình chữ nhật nằm vắt ngang, chiếm 1/4 diện tích toàn bộ nên P(A) = 1/4; phần chung của A và B chiếm 3/16. Khi tin tức B đã xảy ra tới nơi, toàn bộ phần nằm ngoài B mờ đi và biến mất khỏi cuộc chơi: không gian mẫu co lại chỉ còn B. Lúc này A không còn được so với hình lớn nữa mà so với B, cho P(A | B) bằng 3/16 chia 1/2 bằng 3/8, lớn hơn hẳn P(A) = 1/4 ban đầu. Hình động phá nhầm lẫn cốt tử của chương: xác suất có điều kiện không phải một công thức mới, nó là xác suất cũ đo trên một không gian mẫu đã bị thu nhỏ, và mẫu số P(B) chính là diện tích của cái không gian mới ấy.',
      viewBoxWidth: 300,
      viewBoxHeight: 250,
      durationMs: 7000,
      loop: true,
      shapes: [
        {
          kind: 'rect',
          id: 'khong-gian',
          x: 30,
          y: 40,
          w: 240,
          h: 160,
          stroke: 'muted',
          strokeWidth: 2,
        },
        {
          kind: 'label',
          id: 'nhan-omega',
          x: 30,
          y: 32,
          text: 'Ω  (xác suất 1)',
          size: 13,
          fill: 'muted',
        },
        {
          kind: 'rect',
          id: 'bien-co-b',
          x: 30,
          y: 40,
          w: 120,
          h: 160,
          fill: 'primary',
          opacity: 0.18,
        },
        {
          kind: 'label',
          id: 'nhan-b',
          x: 62,
          y: 60,
          text: 'B: P(B) = 1/2',
          size: 13,
          fill: 'primary',
        },
        {
          kind: 'rect',
          id: 'bien-co-a',
          x: 60,
          y: 80,
          w: 120,
          h: 80,
          stroke: 'accent',
          strokeWidth: 3,
        },
        {
          kind: 'label',
          id: 'nhan-a',
          x: 186,
          y: 96,
          text: 'A: P(A) = 1/4',
          size: 13,
          fill: 'accent',
        },
        {
          kind: 'rect',
          id: 'phan-chung',
          x: 60,
          y: 80,
          w: 90,
          h: 80,
          fill: 'accent',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1200,
              opacity: 0,
            },
            {
              atMs: 1700,
              opacity: 0.4,
            },
            {
              atMs: 7000,
              opacity: 0.4,
            },
          ],
        },
        {
          kind: 'label',
          id: 'nhan-chung',
          x: 105,
          y: 126,
          text: 'P(A ∩ B) = 3/16',
          size: 12,
          anchor: 'middle',
          fill: 'neutral',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 1700,
              opacity: 0,
            },
            {
              atMs: 2200,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'rect',
          id: 'che-ngoai',
          x: 150,
          y: 40,
          w: 120,
          h: 160,
          fill: 'surface',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 3200,
              opacity: 0,
            },
            {
              atMs: 4000,
              opacity: 0.85,
            },
            {
              atMs: 7000,
              opacity: 0.85,
            },
          ],
        },
        {
          kind: 'label',
          id: 'loai-bo',
          x: 210,
          y: 180,
          text: 'phần ngoài B bị loại',
          size: 12,
          anchor: 'middle',
          fill: 'muted',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4000,
              opacity: 0,
            },
            {
              atMs: 4400,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'rect',
          id: 'vien-b-moi',
          x: 30,
          y: 40,
          w: 120,
          h: 160,
          stroke: 'primary',
          strokeWidth: 4,
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4400,
              opacity: 0,
            },
            {
              atMs: 4900,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'kg-moi',
          x: 90,
          y: 216,
          text: 'không gian mẫu mới = B',
          size: 12,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 4900,
              opacity: 0,
            },
            {
              atMs: 5300,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
        {
          kind: 'label',
          id: 'ket',
          x: 150,
          y: 240,
          text: 'P(A | B) = (3/16) : (1/2) = 3/8  >  P(A) = 1/4',
          size: 14,
          anchor: 'middle',
          fill: 'primary',
          opacity: 0,
          keyframes: [
            {
              atMs: 0,
              opacity: 0,
            },
            {
              atMs: 5600,
              opacity: 0,
            },
            {
              atMs: 6100,
              opacity: 1,
            },
            {
              atMs: 7000,
              opacity: 1,
            },
          ],
        },
      ],
      captions: [
        {
          atMs: 0,
          text: 'Hình lớn là Ω; B chiếm nửa trái nên P(B) = 1/2, A chiếm 1/4 hình lớn.',
        },
        {
          atMs: 2200,
          text: 'Phần giao A ∩ B chiếm 3/16 diện tích toàn bộ.',
        },
        {
          atMs: 4000,
          text: 'Nghe tin B đã xảy ra: mọi kết quả ngoài B bị loại khỏi cuộc chơi.',
        },
        {
          atMs: 5300,
          text: 'Không gian mẫu co lại còn đúng B — A phải đo lại trên nền mới này.',
        },
        {
          atMs: 6100,
          text: 'P(A|B) = P(A ∩ B)/P(B) = 3/8, cao hơn P(A) = 1/4: biết B làm A dễ xảy ra hơn.',
        },
      ],
    },
    workedExample: {
      problem:
        'Một bệnh có tỉ lệ mắc trong dân số là 1%. Xét nghiệm cho kết quả dương tính đúng 99% với người có bệnh, và ' +
        'cũng cho dương tính nhầm 10% với người không bệnh. Một người xét nghiệm ra dương tính. Tính xác suất người ' +
        'đó thật sự có bệnh.',
      steps: [
        'Bước 1 — Đặt tên biến cố cho rõ chiều điều kiện (bước quan trọng nhất, vì lẫn chiều là hỏng cả bài): gọi B ' +
          'là "có bệnh", A là "xét nghiệm dương tính". Đề cho P(B) = 0,01; P(A|B) = 0,99; P(A|B̄) = 0,10. Cần tìm ' +
          'P(B|A) — chiều NGƯỢC lại với dữ kiện, nên chắc chắn phải dùng Bayes.',
        'Bước 2 — Tính xác suất dương tính tổng thể bằng công thức toàn phần, vì có hai con đường dẫn tới dương ' +
          'tính: P(A) = P(B)·P(A|B) + P(B̄)·P(A|B̄) = 0,01·0,99 + 0,99·0,10.',
        'Bước 3 — Tính từng nhánh: 0,01·0,99 = 0,0099 (dương tính thật) và 0,99·0,10 = 0,099 (dương tính giả). Cộng ' +
          'lại P(A) = 0,1089. Nhận xét ngay ở đây: số ca dương tính GIẢ gấp 10 lần số ca dương tính THẬT, vì nhóm ' +
          'người khoẻ đông hơn hẳn.',
        'Bước 4 — Áp Bayes: P(B|A) = 0,0099 / 0,1089 ≈ 0,0909, tức khoảng 9,1%.',
        'Bước 5 — Diễn giải: dù xét nghiệm rất nhạy, một kết quả dương tính chỉ cho khoảng 9% khả năng thật sự mắc ' +
          'bệnh. Đó là lý do y học luôn làm xét nghiệm khẳng định lần hai thay vì kết luận ngay — và cũng là lý do ' +
          'không được sàng lọc đại trà một bệnh quá hiếm.',
      ],
      answer: 'Xác suất người đó thật sự có bệnh chỉ khoảng 9,1%.',
    },
    checkQuestions: [
      {
        prompt:
          'Gieo một con xúc xắc cân đối. Biết kết quả là số chẵn, tính xác suất để đó là số 6. ' +
          '(Nhập dạng phân số tối giản.)',
        answer: { kind: 'fraction', num: 1, den: 3 },
        explain:
          'Điều kiện "số chẵn" THU HẸP không gian mẫu từ {1;...;6} xuống còn {2; 4; 6} gồm 3 kết quả đồng khả năng. ' +
          'Trong đó chỉ một kết quả là số 6, nên xác suất bằng 1/3. Lỗi hay gặp là vẫn trả lời 1/6 vì quên rằng ' +
          'thông tin điều kiện đã loại bỏ ba khả năng lẻ. Kiểm bằng công thức: P(6 ∩ chẵn)/P(chẵn) = (1/6)/(1/2) = 1/3.',
      },
      {
        prompt:
          'Hai biến cố A và B đều có xác suất dương và XUNG KHẮC với nhau. Chúng có độc lập với nhau không? ' +
          'Nhập 1 nếu CÓ, 0 nếu KHÔNG.',
        answer: { kind: 'numeric', value: 0 },
        explain:
          'KHÔNG độc lập — và đây là bẫy khái niệm trọng tâm của chương. Xung khắc nghĩa là P(A ∩ B) = 0. Nếu chúng ' +
          'độc lập thì phải có P(A ∩ B) = P(A)·P(B) > 0 (vì cả hai xác suất đều dương), mâu thuẫn. Hiểu theo trực ' +
          'giác: biết A đã xảy ra là biết CHẮC CHẮN B không xảy ra, tức P(B|A) = 0 khác hẳn P(B) — thông tin về A ' +
          'ảnh hưởng tối đa tới B, đó là phụ thuộc mạnh nhất có thể chứ không phải độc lập.',
      },
      {
        prompt:
          'Một hộp có 3 bi đỏ và 2 bi xanh. Lấy lần lượt 2 bi KHÔNG hoàn lại. Tính xác suất cả hai bi đều đỏ. ' +
          '(Nhập dạng phân số tối giản.)',
        answer: { kind: 'fraction', num: 3, den: 10 },
        explain:
          'Dùng công thức nhân: P(đỏ lần 1) = 3/5. Sau khi đã lấy một bi đỏ ra, hộp chỉ còn 4 bi trong đó 2 đỏ, nên ' +
          'P(đỏ lần 2 | đỏ lần 1) = 2/4 = 1/2. Nhân lại: 3/5 · 1/2 = 3/10. Lỗi phổ biến là dùng 3/5 · 3/5 = 9/25, ' +
          'tức coi hai lần lấy là độc lập — chỉ đúng khi có HOÀN LẠI. Lấy không hoàn lại thì lần đầu làm thay đổi ' +
          'thành phần của hộp, nên bắt buộc phải dùng xác suất có điều kiện.',
      },
    ],
    srsCards: [
      {
        hoi: 'Công thức xác suất có điều kiện và ý nghĩa của mẫu số?',
        dap: 'P(A|B) = P(A∩B)/P(B); mẫu là P(B) vì không gian mẫu đã thu hẹp lại còn B.',
      },
      {
        hoi: 'Phân biệt "độc lập" và "xung khắc"?',
        dap: 'Xung khắc: P(A∩B) = 0. Độc lập: P(A∩B) = P(A)P(B). Hai biến cố xung khắc có xác suất dương thì KHÔNG độc lập.',
      },
      {
        hoi: 'Công thức Bayes dùng để làm gì?',
        dap: 'Đảo chiều điều kiện: từ P(A|B) suy ra P(B|A), với mẫu số tính bằng công thức xác suất toàn phần.',
      },
    ],
    track: 'core',
    reviewStatus: 'draft',
  },
]
