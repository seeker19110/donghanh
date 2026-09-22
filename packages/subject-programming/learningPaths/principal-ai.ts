// learningPaths/principal-ai.ts — Lộ trình "Kiến trúc sư phần mềm & AI".
//
// Đặc tả: `docs/specs/2026-08-31-khoa-hoc-ky-su-truong-ai.md`. Khác hướng `ai` (một trục
// chuyên môn), đích của lộ trình này là NGƯỜI RA QUYẾT ĐỊNH về hệ AI: nắm nhiều trục kỹ thuật
// cùng lúc (toán → dữ liệu → AI → vận hành) và biết đặc tả/đánh giá/dẫn dắt. Toàn bộ giai đoạn
// P1–P4 lắp từ chặng ĐÃ CÓ của 8 hướng; riêng giai đoạn P5 "Tầm trưởng" dùng 4 chặng nội dung
// mới soạn ở đợt 4 (`principal-s1…s4`, xem `learningPaths/pathStages.ts`).
import type { LearningPath } from './types.js'

export const PRINCIPAL_AI_PATH: LearningPath = {
  id: 'principal-ai',
  title: 'Kiến trúc sư phần mềm & AI',
  tagline:
    'Từ dòng code đầu tiên tới hệ AI chạy production — biết thiết kế, đo chất lượng, vận hành và chịu trách nhiệm cho quyết định kiến trúc.',
  forWho:
    'Người muốn đi đường dài tới vai trò AI Systems Architect/AI Software Architect. Người mới bắt đầu từ P1; người đã có kinh nghiệm dùng bài chẩn đoán để bỏ qua phần đã vững.',
  prerequisite: 'p4',
  duration: '24–36 tháng từ số 0 · 9–20 tháng nếu đã có nền kỹ thuật',
  foundationLevelIds: ['p1', 'p2', 'p3', 'p4'],
  phases: [
    {
      id: 'principal-ai-p1',
      name: 'Nền toán & thuật toán',
      canDo:
        'Đọc hiểu và tự cài được thuật toán ML căn bản (hồi quy, gradient descent) bằng Python thuần, không thư viện — AI không còn là hộp đen.',
      stages: [
        {
          stageId: 'mathforcode-s1',
          why: 'Toán rời rạc là ngôn ngữ chung của mọi thứ phía sau — bắt đầu từ đây để không hổng nền.',
        },
        {
          stageId: 'mathforcode-s2',
          why: 'Tổ hợp & xác suất là nền của đánh giá mô hình và mọi quyết định dưới bất định.',
        },
        {
          stageId: 'mathforcode-s3',
          why: 'Đại số tuyến tính là cấu trúc dữ liệu thật của ML — vector, ma trận, embedding.',
        },
        {
          stageId: 'mathforcode-s4',
          why: 'Giải tích & tối ưu: tự cài gradient descent để hiểu mô hình HỌC bằng cách nào.',
        },
        {
          stageId: 'algo-s1',
          why: 'Cấu trúc dữ liệu & độ phức tạp — để đọc code hệ thống AI không bị choáng.',
          requires: ['mathforcode-s1'],
        },
        {
          stageId: 'algo-s2',
          why: 'Thuật toán kinh điển đủ dùng — kỹ sư trưởng cần đọc và thẩm định, không cần luyện thi đấu.',
          requires: ['algo-s1'],
        },
      ],
      artifact: {
        name: 'Sổ tay thuật toán ML tự cài',
        brief:
          'Repo các thuật toán tự cài bằng Python thuần kèm ghi chú "vì sao chạy được" của chính bạn.',
      },
    },
    {
      id: 'principal-ai-p2',
      name: 'Dữ liệu & backend',
      canDo:
        'Dựng được đường ống dữ liệu sạch và API phục vụ mô hình — vì mọi hệ AI đứng trên hai chân này.',
      stages: [
        {
          stageId: 'data-s1',
          why: 'SQL và mô hình dữ liệu — dữ liệu bẩn thì mô hình nào cũng vô dụng.',
        },
        {
          stageId: 'data-s2',
          why: 'Đường ống dữ liệu: thu thập, làm sạch, biến đổi có kiểm chứng.',
          requires: ['data-s1'],
        },
        {
          stageId: 'data-s3',
          why: 'Quy mô và thời gian thực — dữ liệu huấn luyện lớn hơn RAM và luồng gần thời gian thực là chuyện thường của hệ AI.',
          requires: ['data-s2'],
        },
        {
          stageId: 'backend-s1',
          why: 'API và server căn bản — mô hình chỉ có ích khi có đường cho người dùng gọi tới.',
        },
        {
          stageId: 'backend-s2',
          why: 'Dữ liệu và đồng thời — schema chịu được truy vấn thật, và xử lý đúng khi nhiều yêu cầu tranh nhau một bản ghi.',
          requires: ['backend-s1'],
        },
      ],
      artifact: {
        name: 'Đường ống dữ liệu + API hoàn chỉnh',
        brief: 'Một dịch vụ nhỏ: nhận dữ liệu thô → làm sạch → lưu → phục vụ qua API có auth.',
      },
    },
    {
      id: 'principal-ai-p3',
      name: 'Trục AI chính',
      canDo:
        'Xây sản phẩm AI hoàn chỉnh: ứng dụng LLM có RAG, mô hình ML/DL tự huấn luyện, có bộ eval và guardrail — trục chuyên môn sâu nhất của lộ trình.',
      stages: [
        {
          stageId: 'ai-s1',
          why: 'Ứng dụng LLM trước — làm ra sản phẩm có ích sớm nhất, rồi mới đào xuống lý thuyết.',
        },
        {
          stageId: 'ai-s2',
          why: 'ML cổ điển — nhiều bài toán thật thắng bằng mô hình nhỏ rẻ, không phải LLM.',
          requires: ['ai-s1'],
        },
        {
          stageId: 'ai-s3',
          why: 'Học sâu & tinh chỉnh — hiểu tới tận gradient thứ mình đang vận hành.',
          requires: ['ai-s2'],
        },
        {
          stageId: 'ai-s4',
          why: 'MLOps & hệ tác tử — đưa mô hình ra production có giám sát, có trách nhiệm.',
          requires: ['ai-s3'],
        },
      ],
      artifact: {
        name: 'Sản phẩm AI có eval',
        brief:
          'Một ứng dụng AI chạy thật (RAG hoặc mô hình tinh chỉnh) kèm bộ đánh giá tự động và báo cáo chất lượng.',
      },
    },
    {
      id: 'principal-ai-p4',
      name: 'Vận hành & tin cậy',
      canDo:
        'Đưa hệ AI ra production an toàn, chịu tải, và ĐẶC TẢ được kiến trúc cho người khác (hoặc AI) thi hành.',
      stages: [
        {
          stageId: 'devops-s1',
          why: 'Đóng gói, deploy, CI/CD — hệ của bạn phải tự đứng được ngoài máy bạn.',
        },
        {
          stageId: 'devops-s2',
          why: 'Container và CI/CD — đóng gói một lần rồi chạy được ở mọi môi trường, có đường quay lui khi bản mới hỏng.',
          requires: ['devops-s1'],
        },
        {
          stageId: 'devops-s3',
          why: 'Kubernetes, GitOps và error budget — khi hệ AI đã có mắt nhìn, bạn cần luật để quyết định lúc nào còn được phát hành và lúc nào phải dừng.',
          requires: ['devops-s2'],
        },
        {
          stageId: 'devops-s4',
          why: 'Nền tảng nội bộ, chuỗi cung ứng tạo tác và sức chứa–chi phí phục vụ mô hình — để đội khác phát hành hệ AI an toàn mà không cần bạn đứng cạnh.',
          requires: ['devops-s3'],
        },
        {
          stageId: 'security-s1',
          why: 'Bảo mật căn bản — hệ AI mở thêm bề mặt tấn công mới (prompt injection, rò dữ liệu).',
        },
        {
          stageId: 'security-s2',
          why: 'Bảo mật ứng dụng thực chiến — nghĩ như kẻ tấn công trước khi kẻ tấn công nghĩ tới bạn.',
          requires: ['security-s1'],
        },
        {
          // Đợt `security-s3` (đặc tả `docs/specs/2026-09-17-security-s3-bai-hoc-that.md`):
          // đặt NGAY SAU `security-s2`. Chặng dạy vì sao lỗ hổng tồn tại và cách phát hiện —
          // kiến trúc sư phải thẩm định được lựa chọn ngôn ngữ và tin được kết quả công cụ tìm
          // lỗi, chứ không phải học cách khai thác.
          stageId: 'security-s3',
          why: 'Thẩm định được vì sao "viết cẩn thận" không thay thế được an toàn bộ nhớ, và đọc được kết quả của công cụ tìm lỗi tự động thay vì tin theo lời người khác.',
          requires: ['security-s2'],
        },
        {
          stageId: 'architecture-s1',
          why: 'Ranh giới module & hợp đồng — ngôn ngữ chung để bàn chuyện kiến trúc cho rõ ràng, không nói chung chung.',
        },
        {
          stageId: 'architecture-s2',
          why: 'Hợp đồng & mô hình miền — gọi đúng tên khái niệm nghiệp vụ và kiểm hợp đồng dữ liệu ngay tại ranh giới.',
          requires: ['architecture-s1'],
        },
        {
          stageId: 'architecture-s3',
          why: 'Viết đặc tả cho người khác thi hành — kỹ năng lõi của người dẫn dắt.',
          requires: ['architecture-s2'],
        },
        {
          stageId: 'architecture-s4',
          why: 'Kiến trúc tiến hoá — hệ sống nhiều năm, quyết định hôm nay phải chịu được ngày mai.',
          requires: ['architecture-s3'],
        },
      ],
      artifact: {
        name: 'Hệ AI production + bản đặc tả',
        brief:
          'Sản phẩm AI của P3 chạy production có giám sát, kèm bản đặc tả kiến trúc đủ để người khác dựng lại.',
      },
    },
    {
      id: 'principal-ai-p5',
      name: 'Tầm trưởng — vận hành AI & dẫn dắt',
      canDo:
        'Vận hành AI hiệu quả ở quy mô đội: viết đặc tả giao việc cho AI, thiết kế eval, quản chi phí, quyết định kiến trúc bằng ADR, review và dẫn dắt người khác.',
      // Đợt 4 (đặc tả con: docs/specs/2026-08-31-dot-4-p5-tam-truong.md) — 4 chặng RIÊNG của
      // lộ trình (KHÔNG phải hướng chuyên sâu thứ 15), xem `learningPaths/pathStages.ts`.
      stages: [
        {
          stageId: 'principal-s1',
          why: 'Vận hành AI bắt đầu từ đặc tả rõ và cách đo chất lượng — không có hai thứ này thì AI làm gì cũng khó biết đúng hay sai.',
        },
        {
          stageId: 'principal-s2',
          why: 'Hệ tác tử & MCP là cách AI hôm nay thật sự VẬN HÀNH ngoài đời — hiểu cơ chế bên trong để không bị nó làm hộp đen lần hai.',
          requires: ['principal-s1'],
        },
        {
          // Đợt `data-s4` (đặc tả `docs/specs/2026-09-17-data-s4-security-s4-bai-hoc-that.md`):
          // chặng HƯỚNG CHUYÊN SÂU được mượn vào lộ trình, đặt TRƯỚC `principal-s3` vì quyết định
          // kiến trúc ở s3 phải dựa trên số liệu tin được — chưa quản trị được dữ liệu thì mọi
          // đánh đổi định lượng đều đang cãi nhau trên con số không ai bảo đảm.
          stageId: 'data-s4',
          why: 'Trước khi ra quyết định kiến trúc bằng số, phải bảo đảm được con số đó: ai sở hữu dữ liệu, nó còn tươi không, chỉ số có đúng một định nghĩa không, và xử lý dữ liệu cá nhân có cơ sở pháp lý không.',
          requires: ['principal-s2'],
        },
        {
          // Đợt `security-s4` (cùng đặc tả với `data-s4`): chặng HƯỚNG CHUYÊN SÂU mượn vào lộ
          // trình, đặt TRƯỚC `principal-s3` — quyết định kiến trúc mà chưa biết ranh giới tin cậy
          // nằm ở đâu thì mọi phương án đều thiếu một cột đánh đổi. Chặng PHÒNG THỦ, không dạy
          // tấn công.
          stageId: 'security-s4',
          why: 'Kiến trúc nào rồi cũng phải trả lời: ai được tin và vì sao, bí mật sống bao lâu, hỏng thì phát hiện bằng gì và ứng cứu theo trình tự nào — bốn câu này phải có trước khi chốt thiết kế, không phải sau.',
          requires: ['data-s4'],
        },
        {
          stageId: 'principal-s3',
          why: 'Có đặc tả và hiểu cơ chế rồi thì tới lượt RA QUYẾT ĐỊNH kiến trúc — bằng số, ghi lại bằng ADR để người sau hiểu vì sao.',
          requires: ['principal-s2'],
        },
        {
          stageId: 'principal-s4',
          why: 'Đỉnh của tầm trưởng là DẪN DẮT: review việc AI làm và người khác làm, chịu trách nhiệm khi hệ AI hỏng.',
          requires: ['principal-s3'],
        },
      ],
      artifact: {
        name: 'Capstone: hệ AI có người dùng thật',
        brief:
          'Hệ AI hoàn chỉnh có người dùng, có eval, có giám sát chi phí — cộng hồ sơ artifact tích luỹ từ P1.',
      },
    },
  ],
  outcomes: [
    'Tự cài được thuật toán ML nền tảng và giải thích được vì sao nó chạy — không coi AI là hộp đen.',
    'Đưa được một sản phẩm AI từ ý tưởng tới production: dữ liệu, mô hình, API, giám sát, chi phí.',
    'Viết được đặc tả và bộ eval để người khác — hoặc AI — thi hành đúng ngay lượt đầu.',
    'Ra được quyết định kiến trúc AI (build vs buy, RAG vs fine-tune) kèm đánh đổi định lượng.',
    'Review được công việc AI của người khác và nói thẳng được rủi ro trước khi nó thành sự cố.',
  ],
}
