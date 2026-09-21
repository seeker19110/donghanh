// lessons/p6u222.ts — P6-U222: HƯỚNG DI ĐỘNG, chặng S4 "Chuyên gia — quy mô và nền tảng" —
// Phát hành chuyên nghiệp (module `mobile-s4-m1`).
//
// MÔ PHỎNG: cổng rollout theo tỉ lệ viết bằng TypeScript thuần, tất định. Không gọi Play
// Console / App Store Connect / Fastlane thật, không đọc đồng hồ hệ thống — thời gian theo dõi
// là tham số. Việc dựng CI/CD thật build–test–nộp chợ nằm ở bài tập về nhà.
import type { ProgrammingLesson } from '../lessonTypes.js'

export const P6U222_LESSONS: ProgrammingLesson[] = [
  {
    id: 'p6-u222-l1',
    unitId: 'p6-u222',
    language: 'typescript',
    title: 'Rollout theo tỉ lệ: tăng dần, và biết khi nào phải dừng',
    hook: 'Bản mới phát cho 100% người dùng lúc 5 giờ chiều thứ Sáu. Nửa đêm, tỉ lệ sập phiên lên 12%. Chợ ứng dụng duyệt bản vá mất một ngày, nên suốt cuối tuần đó app hỏng với tất cả mọi người — trong khi phát cho 1% trước đã lộ ra đúng lỗi ấy.',
    theory:
      'App di động khác web ở một điểm quyết định mọi thứ: BẠN KHÔNG ROLLBACK ĐƯỢC. Web thì đổi lại bản cũ trong một phút. App đã cài trên máy người dùng thì nằm đó, và bản vá phải qua vòng duyệt của chợ ứng dụng rồi chờ từng người cập nhật.\n\nVì không lùi được nên phải đi chậm về phía trước: phát cho 1% người dùng, theo dõi, rồi 5%, 20%, 50%, 100%. Mỗi bước tăng phải trả lời được hai câu hỏi:\n\n1. **Đã theo dõi đủ lâu chưa?** Một bước rollout mới mười phút thì con số "0 lỗi" chưa có ý nghĩa — phần lớn người dùng chưa kịp mở app. Tăng tỉ lệ trước khi hết cửa sổ theo dõi tối thiểu là tự bỏ đi chính cái lợi của rollout theo tỉ lệ, nên bài xếp nó vào **deny**.\n2. **Tỉ lệ lỗi có dưới ngưỡng dừng không?** Vượt ngưỡng thì **halt-rollout**: dừng phát thêm ngay lập tức. Dừng không sửa được máy của những người đã nhận bản lỗi, nhưng nó chặn con số đó lớn thêm — và đó là toàn bộ giá trị của cơ chế này.\n\nHai ngưỡng phải được định trước khi bắt đầu phát, không phải lúc đang nhìn biểu đồ. Lúc nửa đêm nhìn số nhảy, ai cũng có xu hướng tự thuyết phục rằng "chắc chỉ là nhiễu". Ngưỡng viết sẵn là cách tự bảo vệ mình khỏi chính mình vào lúc mệt nhất.\n\nThứ tự ưu tiên của cổng: thiếu cấu hình ngưỡng → **unknown**; vượt ngưỡng lỗi → **halt-rollout**; chưa đủ cửa sổ theo dõi → **deny**; đủ điều kiện → **advance**. Nhánh halt đứng trước nhánh deny vì chúng nói hai việc khác nhau: deny là "chưa được tăng", halt là "dừng hẳn lại" — và khi lỗi đã vượt ngưỡng thì thông điệp phải là cái sau.',
    workedExample: {
      code: `interface TrangThaiRollout {
  tiLeLoiPhien: number       // phan tram phien bi sap
  nguongDung: number         // vuot la dung phat them
  phutDaTheoDoi: number
  cuaSoToiThieuPhut: number
}

function buocRollout(t: TrangThaiRollout): string {
  if (t.nguongDung <= 0 || t.cuaSoToiThieuPhut <= 0) return "unknown: chua cau hinh nguong rollout"
  // "Dung han" khac "chua duoc tang" — thong diep phai dung viec can lam.
  if (t.tiLeLoiPhien > t.nguongDung) return "halt-rollout: ti le loi " + t.tiLeLoiPhien + "% vuot nguong"
  if (t.phutDaTheoDoi < t.cuaSoToiThieuPhut) return "deny: moi theo doi " + t.phutDaTheoDoi + " phut"
  return "advance: du dieu kien tang ti le"
}

const tot: TrangThaiRollout = { tiLeLoiPhien: 0.4, nguongDung: 2, phutDaTheoDoi: 120, cuaSoToiThieuPhut: 60 }
console.log(buocRollout(tot))
console.log(buocRollout({ ...tot, tiLeLoiPhien: 12 }))
console.log(buocRollout({ ...tot, phutDaTheoDoi: 10 }))
console.log(buocRollout({ ...tot, nguongDung: 0 }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface TrangThaiRollout {
  tiLeLoiPhien: number
  nguongDung: number
  phutDaTheoDoi: number
  cuaSoToiThieuPhut: number
}
function buocRollout(t: TrangThaiRollout): string {
  if (t.nguongDung <= 0 || t.cuaSoToiThieuPhut <= 0) return "unknown: chua cau hinh nguong rollout"
  if (t.tiLeLoiPhien > t.nguongDung) return "halt-rollout: ti le loi " + t.tiLeLoiPhien + "% vuot nguong"
  if (t.phutDaTheoDoi < t.cuaSoToiThieuPhut) return "deny: moi theo doi " + t.phutDaTheoDoi + " phut"
  return "advance: du dieu kien tang ti le"
}
console.log(buocRollout({ tiLeLoiPhien: 12, nguongDung: 2, phutDaTheoDoi: 10, cuaSoToiThieuPhut: 60 }))`,
      question: 'Lỗi vượt ngưỡng VÀ mới theo dõi 10 phút. Thông điệp nào được in?',
      choices: [
        'halt-rollout: ti le loi 12% vuot nguong',
        'deny: moi theo doi 10 phut',
        'advance: du dieu kien tang ti le',
        'unknown: chua cau hinh nguong rollout',
      ],
      answerIndex: 0,
      explain:
        'Hai nhánh cùng khớp và halt đứng trước. Nói "chưa được tăng tỉ lệ" lúc này là sai trọng tâm: khi lỗi đã vượt ngưỡng thì việc cần làm không phải là chờ thêm mà là dừng phát ngay, kể cả khi cửa sổ theo dõi chưa hết.',
    },
    parsons: {
      prompt:
        'Xếp lại cổng rollout: chặn thiếu cấu hình, rồi dừng khẩn, rồi mới tới chưa đủ cửa sổ theo dõi.',
      lines: [
        'function buocRollout(t: TrangThaiRollout): string {',
        '  if (t.nguongDung <= 0 || t.cuaSoToiThieuPhut <= 0) return "unknown: chua cau hinh nguong rollout"',
        '  if (t.tiLeLoiPhien > t.nguongDung) return "halt-rollout: ti le loi " + t.tiLeLoiPhien + "% vuot nguong"',
        '  if (t.phutDaTheoDoi < t.cuaSoToiThieuPhut) return "deny: moi theo doi " + t.phutDaTheoDoi + " phut"',
        '  return "advance: du dieu kien tang ti le"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết buocRollout(t) theo thứ tự:\n\n1. nguongDung <= 0 hoặc cuaSoToiThieuPhut <= 0 → "unknown: chua cau hinh nguong rollout"\n2. tiLeLoiPhien > nguongDung → "halt-rollout: ti le loi <số>% vuot nguong"\n3. phutDaTheoDoi < cuaSoToiThieuPhut → "deny: moi theo doi <số> phut"\n4. còn lại → "advance: du dieu kien tang ti le"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface TrangThaiRollout {
  tiLeLoiPhien: number
  nguongDung: number
  phutDaTheoDoi: number
  cuaSoToiThieuPhut: number
}

function buocRollout(t: TrangThaiRollout): string {
  // TODO: bon nhanh, halt truoc deny
  return "advance: du dieu kien tang ti le"
}

// ---- Đừng sửa phần dưới đây ----
const tot: TrangThaiRollout = { tiLeLoiPhien: 0.4, nguongDung: 2, phutDaTheoDoi: 120, cuaSoToiThieuPhut: 60 }
console.log("Ca 1:", buocRollout(tot))
console.log("Ca 2:", buocRollout({ ...tot, tiLeLoiPhien: 12 }))
console.log("Ca 3:", buocRollout({ ...tot, phutDaTheoDoi: 10 }))
console.log("Ca 4:", buocRollout({ ...tot, tiLeLoiPhien: 12, phutDaTheoDoi: 10 }))
console.log("Ca 5:", buocRollout({ ...tot, tiLeLoiPhien: 2, phutDaTheoDoi: 60 }))
console.log("Ca 6:", buocRollout({ ...tot, nguongDung: 0 }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 2: halt-rollout: ti le loi 12% vuot nguong',
          match: 'contains',
          hidden: false,
          label: 'Vượt ngưỡng lỗi: dừng phát thêm ngay',
        },
        {
          stdinLines: [],
          expected: 'Ca 5: advance: du dieu kien tang ti le',
          match: 'contains',
          hidden: false,
          label: 'Ca biên: lỗi đúng bằng ngưỡng và thời gian đúng bằng cửa sổ thì vẫn được tăng',
        },
        {
          stdinLines: [],
          expected: 'Ca 6: unknown: chua cau hinh nguong rollout',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: chưa cấu hình ngưỡng thì không phán bất cứ điều gì',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: advance: du dieu kien tang ti le\nCa 2: halt-rollout: ti le loi 12% vuot nguong\nCa 3: deny: moi theo doi 10 phut\nCa 4: halt-rollout: ti le loi 12% vuot nguong\nCa 5: advance: du dieu kien tang ti le\nCa 6: unknown: chua cau hinh nguong rollout',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: sáu ca, gồm ca halt thắng deny',
        },
      ],
      hints: [
        'Ca 5 dùng cả hai giá trị đúng bằng ngưỡng: điều kiện phải là > và < chứ không phải >= và <=.',
        'Ca 4 là ca quyết định thứ tự: halt phải được báo, không phải deny.',
        'Ghép hai điều kiện thiếu cấu hình bằng || trong cùng một câu if.',
      ],
      sampleSolution: `interface TrangThaiRollout {
  tiLeLoiPhien: number
  nguongDung: number
  phutDaTheoDoi: number
  cuaSoToiThieuPhut: number
}

function buocRollout(t: TrangThaiRollout): string {
  if (t.nguongDung <= 0 || t.cuaSoToiThieuPhut <= 0) return "unknown: chua cau hinh nguong rollout"
  if (t.tiLeLoiPhien > t.nguongDung) return "halt-rollout: ti le loi " + t.tiLeLoiPhien + "% vuot nguong"
  if (t.phutDaTheoDoi < t.cuaSoToiThieuPhut) return "deny: moi theo doi " + t.phutDaTheoDoi + " phut"
  return "advance: du dieu kien tang ti le"
}

// ---- Đừng sửa phần dưới đây ----
const tot: TrangThaiRollout = { tiLeLoiPhien: 0.4, nguongDung: 2, phutDaTheoDoi: 120, cuaSoToiThieuPhut: 60 }
console.log("Ca 1:", buocRollout(tot))
console.log("Ca 2:", buocRollout({ ...tot, tiLeLoiPhien: 12 }))
console.log("Ca 3:", buocRollout({ ...tot, phutDaTheoDoi: 10 }))
console.log("Ca 4:", buocRollout({ ...tot, tiLeLoiPhien: 12, phutDaTheoDoi: 10 }))
console.log("Ca 5:", buocRollout({ ...tot, tiLeLoiPhien: 2, phutDaTheoDoi: 60 }))
console.log("Ca 6:", buocRollout({ ...tot, nguongDung: 0 }))`,
    },
    homework:
      'Tìm một app mã nguồn mở có ghi chép quy trình phát hành (thường ở file RELEASING.md hoặc trang wiki). Đọc và ghi lại: họ phát theo mấy bước tỉ lệ, theo dõi bao lâu mỗi bước, ngưỡng dừng là con số nào. Rồi viết quy trình tương đương cho một app giả định của bạn, với các con số cụ thể và lý do chọn từng con số.',
    srsCards: [
      {
        hoi: 'Vì sao rollout theo tỉ lệ quan trọng với app di động hơn với web?',
        dap: 'Vì app đã cài trên máy người dùng thì không rollback được: bản vá phải qua vòng duyệt của chợ ứng dụng rồi chờ từng người cập nhật, trong khi web đổi lại bản cũ trong một phút.',
      },
      {
        hoi: 'Vì sao tăng tỉ lệ trước khi hết cửa sổ theo dõi tối thiểu là sai?',
        dap: 'Vì phần lớn người dùng ở bước đó chưa kịp mở app nên con số "0 lỗi" chưa có ý nghĩa. Tăng sớm là tự bỏ đi chính cái lợi mà rollout theo tỉ lệ mang lại.',
      },
      {
        hoi: 'Vì sao ngưỡng dừng phải được chốt TRƯỚC khi bắt đầu phát?',
        dap: 'Vì lúc nửa đêm nhìn số nhảy, người ta có xu hướng tự thuyết phục rằng đó chỉ là nhiễu. Ngưỡng viết sẵn là cách tự bảo vệ mình khỏi chính mình vào lúc mệt nhất.',
      },
    ],
  },
  {
    id: 'p6-u222-l2',
    unitId: 'p6-u222',
    language: 'typescript',
    title: 'Bắt buộc cập nhật: quyền lực phải dùng dè',
    hook: 'App chặn màn hình với thông báo "Vui lòng cập nhật để tiếp tục" — trong lúc người dùng đang ở sân bay với 3% pin và mạng chập chờn. Bản cập nhật nặng 80 MB, và thứ nó sửa chỉ là màu một cái nút.',
    theory:
      'Bắt buộc cập nhật (force update) là công cụ mạnh nhất mà phía server có với app đã cài: nó chặn hẳn người dùng cho tới khi họ tải bản mới. Và như mọi công cụ mạnh, dùng sai thì hại hơn không có.\n\nBa trường hợp chính đáng, hết:\n\n- Bản cũ có lỗ hổng bảo mật đang bị khai thác.\n- Bản cũ gửi dữ liệu SAI lên server (làm hỏng dữ liệu của chính người dùng hoặc của người khác).\n- API mà bản cũ gọi đã bị gỡ hẳn, không còn cách nào phục vụ nó.\n\nMọi lý do khác — giao diện mới, tính năng mới, muốn số liệu đẹp — đều không đáng chặn một người đang cần việc gấp. Cách đúng cho những lý do đó là gợi ý cập nhật mềm, có nút bỏ qua.\n\nĐiều này thể hiện thành MỘT con số trong cấu hình server: `minSupportedVersion`. Server so phiên bản client với nó, dưới thì trả về **force-update**. Nâng con số đó là quyết định tính bằng người dùng bị chặn, nên nó phải được ghi lại kèm lý do — đúng tinh thần một sổ quyết định.\n\nCổng đầy đủ của unit, theo thứ tự ưu tiên:\n\n1. thiếu cấu hình ngưỡng → **unknown**\n2. phiên bản client < minSupportedVersion → **force-update**\n3. tỉ lệ lỗi vượt ngưỡng → **halt-rollout**\n4. chưa đủ cửa sổ theo dõi → **deny**\n5. còn lại → **advance**\n\nVì sao force-update đứng trên cả halt-rollout: hai nhánh này trả lời cho hai câu hỏi khác nhau. force-update nói về MÁY ĐANG HỎI (client này quá cũ, không phục vụ được), halt-rollout nói về CẢ ĐỢT PHÁT HÀNH. Với một client đã quá cũ thì việc đợt phát hành mới có dừng hay không chẳng đổi được gì cho nó — nó vẫn cần cập nhật.',
    workedExample: {
      code: `interface YeuCauClient {
  phienBanClient: number
  minSupportedVersion: number
  tiLeLoiPhien: number
  nguongDung: number
  phutDaTheoDoi: number
  cuaSoToiThieuPhut: number
}

function congPhatHanh(y: YeuCauClient): string {
  if (y.nguongDung <= 0 || y.cuaSoToiThieuPhut <= 0) return "unknown: chua cau hinh nguong rollout"
  // Noi ve chinh MAY DANG HOI: dot phat hanh co dung hay khong cung khong cuu duoc no.
  if (y.phienBanClient < y.minSupportedVersion) return "force-update: ban " + y.phienBanClient + " duoi muc ho tro"
  if (y.tiLeLoiPhien > y.nguongDung) return "halt-rollout: ti le loi " + y.tiLeLoiPhien + "% vuot nguong"
  if (y.phutDaTheoDoi < y.cuaSoToiThieuPhut) return "deny: moi theo doi " + y.phutDaTheoDoi + " phut"
  return "advance: du dieu kien tang ti le"
}

const tot: YeuCauClient = { phienBanClient: 30, minSupportedVersion: 25, tiLeLoiPhien: 0.4, nguongDung: 2, phutDaTheoDoi: 120, cuaSoToiThieuPhut: 60 }
console.log(congPhatHanh(tot))
console.log(congPhatHanh({ ...tot, phienBanClient: 20 }))
console.log(congPhatHanh({ ...tot, tiLeLoiPhien: 12 }))
console.log(congPhatHanh({ ...tot, phienBanClient: 25 }))`,
      stdinLines: [],
    },
    predict: {
      code: `interface YeuCauClient {
  phienBanClient: number
  minSupportedVersion: number
  tiLeLoiPhien: number
  nguongDung: number
  phutDaTheoDoi: number
  cuaSoToiThieuPhut: number
}
function congPhatHanh(y: YeuCauClient): string {
  if (y.nguongDung <= 0 || y.cuaSoToiThieuPhut <= 0) return "unknown: chua cau hinh nguong rollout"
  if (y.phienBanClient < y.minSupportedVersion) return "force-update: ban " + y.phienBanClient + " duoi muc ho tro"
  if (y.tiLeLoiPhien > y.nguongDung) return "halt-rollout: ti le loi " + y.tiLeLoiPhien + "% vuot nguong"
  if (y.phutDaTheoDoi < y.cuaSoToiThieuPhut) return "deny: moi theo doi " + y.phutDaTheoDoi + " phut"
  return "advance: du dieu kien tang ti le"
}
console.log(congPhatHanh({ phienBanClient: 25, minSupportedVersion: 25, tiLeLoiPhien: 0.4, nguongDung: 2, phutDaTheoDoi: 120, cuaSoToiThieuPhut: 60 }))`,
      question: 'Phiên bản client ĐÚNG BẰNG mức hỗ trợ tối thiểu. Kết quả là gì?',
      choices: [
        'advance: du dieu kien tang ti le',
        'force-update: ban 25 duoi muc ho tro',
        'halt-rollout: ti le loi 0.4% vuot nguong',
        'deny: moi theo doi 120 phut',
      ],
      answerIndex: 0,
      explain:
        'Điều kiện là phienBanClient < minSupportedVersion, và 25 < 25 là sai — bản đúng bằng mức tối thiểu vẫn được hỗ trợ. "Tối thiểu" nghĩa là còn nằm trong vùng phục vụ; viết nhầm thành <= sẽ chặn oan toàn bộ người dùng vừa mới cập nhật lên đúng bản đó.',
    },
    parsons: {
      prompt:
        'Xếp lại cổng đầy đủ: thiếu cấu hình, client quá cũ, dừng đợt phát, chưa đủ theo dõi, rồi tăng.',
      lines: [
        'function congPhatHanh(y: YeuCauClient): string {',
        '  if (y.nguongDung <= 0 || y.cuaSoToiThieuPhut <= 0) return "unknown: chua cau hinh nguong rollout"',
        '  if (y.phienBanClient < y.minSupportedVersion) return "force-update: ban " + y.phienBanClient + " duoi muc ho tro"',
        '  if (y.tiLeLoiPhien > y.nguongDung) return "halt-rollout: ti le loi " + y.tiLeLoiPhien + "% vuot nguong"',
        '  if (y.phutDaTheoDoi < y.cuaSoToiThieuPhut) return "deny: moi theo doi " + y.phutDaTheoDoi + " phut"',
        '  return "advance: du dieu kien tang ti le"',
        '}',
      ],
    },
    make: {
      prompt:
        'Viết congPhatHanh(y) với NĂM nhánh theo đúng thứ tự:\n\n1. nguongDung <= 0 hoặc cuaSoToiThieuPhut <= 0 → "unknown: chua cau hinh nguong rollout"\n2. phienBanClient < minSupportedVersion → "force-update: ban <số> duoi muc ho tro"\n3. tiLeLoiPhien > nguongDung → "halt-rollout: ti le loi <số>% vuot nguong"\n4. phutDaTheoDoi < cuaSoToiThieuPhut → "deny: moi theo doi <số> phut"\n5. còn lại → "advance: du dieu kien tang ti le"\n\nDùng starter code, đừng sửa phần dưới.',
      starterCode: `interface YeuCauClient {
  phienBanClient: number
  minSupportedVersion: number
  tiLeLoiPhien: number
  nguongDung: number
  phutDaTheoDoi: number
  cuaSoToiThieuPhut: number
}

function congPhatHanh(y: YeuCauClient): string {
  // TODO: nam nhanh; force-update dung TREN halt-rollout
  return "advance: du dieu kien tang ti le"
}

// ---- Đừng sửa phần dưới đây ----
const tot: YeuCauClient = { phienBanClient: 30, minSupportedVersion: 25, tiLeLoiPhien: 0.4, nguongDung: 2, phutDaTheoDoi: 120, cuaSoToiThieuPhut: 60 }
console.log("Ca 1:", congPhatHanh(tot))
console.log("Ca 2:", congPhatHanh({ ...tot, phienBanClient: 20 }))
console.log("Ca 3:", congPhatHanh({ ...tot, tiLeLoiPhien: 12 }))
console.log("Ca 4:", congPhatHanh({ ...tot, phienBanClient: 20, tiLeLoiPhien: 12 }))
console.log("Ca 5:", congPhatHanh({ ...tot, phienBanClient: 25 }))
console.log("Ca 6:", congPhatHanh({ ...tot, cuaSoToiThieuPhut: 0 }))`,
      testCases: [
        {
          stdinLines: [],
          expected: 'Ca 2: force-update: ban 20 duoi muc ho tro',
          match: 'contains',
          hidden: false,
          label: 'Client dưới mức hỗ trợ: buộc cập nhật',
        },
        {
          stdinLines: [],
          expected: 'Ca 5: advance: du dieu kien tang ti le',
          match: 'contains',
          hidden: false,
          label: 'Ca biên: đúng bằng mức tối thiểu thì VẪN được phục vụ',
        },
        {
          stdinLines: [],
          expected: 'Ca 6: unknown: chua cau hinh nguong rollout',
          match: 'contains',
          hidden: false,
          label: 'Ca âm: cửa sổ theo dõi bằng 0 là chưa cấu hình',
        },
        {
          stdinLines: [],
          expected:
            'Ca 1: advance: du dieu kien tang ti le\nCa 2: force-update: ban 20 duoi muc ho tro\nCa 3: halt-rollout: ti le loi 12% vuot nguong\nCa 4: force-update: ban 20 duoi muc ho tro\nCa 5: advance: du dieu kien tang ti le\nCa 6: unknown: chua cau hinh nguong rollout',
          match: 'contains',
          hidden: true,
          label: 'Ca ẩn: sáu ca, gồm ca force-update thắng halt-rollout',
        },
      ],
      hints: [
        'Ca 5 là ca biên quan trọng nhất: dùng < chứ không phải <=, nếu không mọi người vừa cập nhật lên đúng bản tối thiểu sẽ bị chặn oan.',
        'Ca 4 quyết định thứ tự hai nhánh: client quá cũ phải được báo trước, vì đợt phát hành dừng hay không cũng không cứu được nó.',
        'Nhánh cuối không cần if — mọi điều kiện phía trên đều return nên tới đó là trường hợp sạch.',
      ],
      sampleSolution: `interface YeuCauClient {
  phienBanClient: number
  minSupportedVersion: number
  tiLeLoiPhien: number
  nguongDung: number
  phutDaTheoDoi: number
  cuaSoToiThieuPhut: number
}

function congPhatHanh(y: YeuCauClient): string {
  if (y.nguongDung <= 0 || y.cuaSoToiThieuPhut <= 0) return "unknown: chua cau hinh nguong rollout"
  if (y.phienBanClient < y.minSupportedVersion) return "force-update: ban " + y.phienBanClient + " duoi muc ho tro"
  if (y.tiLeLoiPhien > y.nguongDung) return "halt-rollout: ti le loi " + y.tiLeLoiPhien + "% vuot nguong"
  if (y.phutDaTheoDoi < y.cuaSoToiThieuPhut) return "deny: moi theo doi " + y.phutDaTheoDoi + " phut"
  return "advance: du dieu kien tang ti le"
}

// ---- Đừng sửa phần dưới đây ----
const tot: YeuCauClient = { phienBanClient: 30, minSupportedVersion: 25, tiLeLoiPhien: 0.4, nguongDung: 2, phutDaTheoDoi: 120, cuaSoToiThieuPhut: 60 }
console.log("Ca 1:", congPhatHanh(tot))
console.log("Ca 2:", congPhatHanh({ ...tot, phienBanClient: 20 }))
console.log("Ca 3:", congPhatHanh({ ...tot, tiLeLoiPhien: 12 }))
console.log("Ca 4:", congPhatHanh({ ...tot, phienBanClient: 20, tiLeLoiPhien: 12 }))
console.log("Ca 5:", congPhatHanh({ ...tot, phienBanClient: 25 }))
console.log("Ca 6:", congPhatHanh({ ...tot, cuaSoToiThieuPhut: 0 }))`,
    },
    homework:
      'Dựng một quy trình CI/CD THẬT cho một dự án di động (hoặc một dự án bất kỳ nếu chưa có app): mỗi lần đẩy mã lên nhánh chính thì tự build, tự chạy test, tự đóng gói. Dùng Fastlane, GitHub Actions hoặc tương đương. Mục tiêu đo được: không thao tác tay nào giữa lúc đẩy mã và lúc có gói cài. Ghi lại thời gian chạy trọn quy trình.',
    srsCards: [
      {
        hoi: 'Ba trường hợp nào thật sự chính đáng để bắt buộc cập nhật?',
        dap: 'Bản cũ có lỗ hổng đang bị khai thác, bản cũ gửi dữ liệu sai lên server làm hỏng dữ liệu, hoặc API mà bản cũ gọi đã bị gỡ hẳn. Giao diện mới hay tính năng mới đều không thuộc nhóm này.',
      },
      {
        hoi: 'Vì sao nhánh buộc cập nhật phải đứng trên nhánh dừng đợt phát hành?',
        dap: 'Vì chúng trả lời hai câu khác nhau: buộc cập nhật nói về chính máy đang hỏi, còn dừng phát nói về cả đợt phát hành. Với một client đã quá cũ thì đợt phát hành dừng hay không cũng không đổi được gì.',
      },
      {
        hoi: 'Nâng minSupportedVersion là loại quyết định gì?',
        dap: 'Là quyết định tính bằng số người dùng bị chặn cho tới khi họ cập nhật, nên nó phải được ghi lại kèm lý do trong sổ quyết định chứ không sửa lặng lẽ trong cấu hình.',
      },
    ],
  },
]
