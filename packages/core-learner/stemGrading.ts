// stemGrading.ts — chỉ mục NẠP LƯỜI cho phần chấm điểm STEM tại máy khách.
//
// Vì sao tách riêng: `stemEvidence.ts` (apps/dhcb) bị `guestProgress.ts` import EAGER (đường
// đăng nhập/đăng ký), nhưng chỉ để gọi `pushGuestEvidence` — không đụng chấm điểm. Trước đây cả
// `gradeStemEvidence`/`decideCompletion` (và `core-grading` mà chúng kéo theo) nằm sẵn trong
// chunk khởi động dù chỉ trang bài học STEM (đã lazy) mới thật sự cần. `submitStemEvidence` nạp
// module này bằng `import()` động ngay lúc nộp bài, giữ ngân sách `Initial JS`.
export { gradeStemEvidence } from './stemEvidenceGrader.js'
export { decideCompletion } from './completionRules.js'
