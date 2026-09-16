import { devopsSimulation } from './devopsS1LessonFactory.js'

export const P6U157_LESSONS = [
  devopsSimulation({
    id: 'p6-u157-l1',
    unitId: 'p6-u157',
    title: '3-2-1, off-site và RPO',
    hook: 'Một archive nằm cạnh database không cứu được khi mất cả máy. Backup chỉ đáng tin nếu có bản ngoài host và độ mới đo được.',
    theory:
      '3-2-1 cần nhiều bản sao, loại media/risk độc lập và một bản off-site. RPO là lượng dữ liệu theo thời gian chấp nhận mất, không phải tuổi backup tùy ý.',
    workedCode:
      '# MÔ PHỎNG inventory\nbackup = {"copies": 3, "offsite": True, "age": 10, "rpo": 60}\nprint("backup:fresh")',
    predictCode:
      'offsite = False\nprint("backup:not-protected" if not offsite else "backup:fresh")',
    predictChoices: ['backup:not-protected', 'backup:fresh', 'restore:ok'],
    predictAnswer: 0,
    predictExplain: 'Không có off-site thì failure mất host có thể lấy luôn bản sao.',
    makePrompt:
      'Đọc `copies:<n>,offsite:<yes|no>,age:<minutes>,rpo:<minutes>`. Chỉ in `backup:fresh` khi copies >= 3, offsite yes và age <= rpo; thiếu offsite/copies in `backup:not-protected`; còn lại `backup:stale`. Input sai `tu-choi`. MÔ PHỎNG, không tạo archive.',
    testCases: [
      {
        stdinLines: ['copies:3,offsite:yes,age:10,rpo:60'],
        expected: 'backup:fresh',
        match: 'exact',
        hidden: false,
        label: 'bản sao đủ và mới',
      },
      {
        stdinLines: ['copies:3,offsite:no,age:1,rpo:60'],
        expected: 'backup:not-protected',
        match: 'exact',
        hidden: true,
        label: 'không có off-site không được công nhận',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":") for x in input().strip().split(","))\n    if int(m["copies"]) < 3 or m["offsite"] != "yes": print("backup:not-protected")\n    elif int(m["age"]) <= int(m["rpo"]): print("backup:fresh")\n    else: print("backup:stale")\nexcept (ValueError, KeyError): print("tu-choi")',
    homework:
      'Đặt lịch backup thật ra nơi ngoài host, ghi RPO bằng phút và kiểm chứng ít nhất ba artifact gần nhất.',
    cards: [
      {
        hoi: 'Vì sao off-site là bắt buộc?',
        dap: 'Mất hoặc bị chiếm quyền host có thể phá các bản sao cùng host.',
      },
      { hoi: 'RPO đo gì?', dap: 'Lượng dữ liệu theo thời gian chấp nhận mất khi khôi phục.' },
    ],
  }),
  devopsSimulation({
    id: 'p6-u157-l2',
    unitId: 'p6-u157',
    title: 'restore drill và RTO',
    hook: 'Backup tồn tại nhưng không restore được vẫn là một niềm tin, không phải khả năng phục hồi.',
    theory:
      'Protected cần off-site backup hợp lệ và restore evidence. RTO là thời gian phục hồi mục tiêu; drill đo từ bắt đầu tới service usable, không phải chỉ giải nén file.',
    workedCode:
      '# MÔ PHỎNG restore evidence\nevidence = False\nprint("restore:missing-evidence" if not evidence else "restore:pass")',
    predictCode:
      'minutes = 45\nrto = 30\nprint("restore:rto-breach" if minutes > rto else "restore:pass")',
    predictChoices: ['restore:rto-breach', 'restore:pass', 'backup:protected'],
    predictAnswer: 0,
    predictExplain: 'Drill vượt RTO là evidence cần cải thiện, không tự pass.',
    makePrompt:
      'Đọc `evidence:<yes|no>,minutes:<n>,rto:<n>`. evidence no → `restore:missing-evidence`; evidence yes nhưng minutes > rto → `restore:rto-breach`; còn lại `restore:pass`. Input sai `tu-choi`. MÔ PHỎNG, không restore hệ thống thật.',
    testCases: [
      {
        stdinLines: ['evidence:yes,minutes:20,rto:30'],
        expected: 'restore:pass',
        match: 'exact',
        hidden: false,
        label: 'drill đạt RTO',
      },
      {
        stdinLines: ['evidence:no,minutes:1,rto:30'],
        expected: 'restore:missing-evidence',
        match: 'exact',
        hidden: true,
        label: 'không có evidence không protected',
      },
    ],
    sampleSolution:
      'try:\n    m = dict(x.split(":") for x in input().strip().split(","))\n    if m["evidence"] != "yes": print("restore:missing-evidence")\n    elif int(m["minutes"]) > int(m["rto"]): print("restore:rto-breach")\n    else: print("restore:pass")\nexcept (ValueError, KeyError): print("tu-choi")',
    homework:
      'Dựng môi trường trống, restore backup thật có bấm giờ tới khi service usable, lưu start/end, RPO/RTO và các bước cần sửa.',
    cards: [
      {
        hoi: 'Khi nào backup được gọi là protected?',
        dap: 'Khi có bản sao hợp lệ ngoài host và evidence restore drill phù hợp.',
      },
      { hoi: 'RTO đo gì?', dap: 'Thời gian tối đa chấp nhận để khôi phục dịch vụ usable.' },
    ],
  }),
]
