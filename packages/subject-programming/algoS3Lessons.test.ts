// CỔNG NGỮ NGHĨA cho chặng `algo-s3` (đặc tả docs/specs/2026-09-21-algo-s3-s4-bai-hoc-that.md).
//
// Vì sao cần cổng riêng ngoài `lessonsPython.test.ts`: cổng kia chỉ chứng minh code mẫu ĐẠT
// test-case của chính bài. Nó không chứng minh được thuật toán ĐÚNG — một bản quy hoạch động
// thiếu transition hay một cây phân đoạn quên push-down vẫn đạt bộ test do chính người soạn
// viết ra. Ở đây ta chạy lời giải nhanh ĐỐI CHỨNG với oracle vét cạn trên dữ liệu sinh có hạt
// giống, VÀ chạy một bản cài LỖI CỐ Ý (negative control) để chứng minh harness không xanh rỗng.
import { describe, expect, it } from 'vitest'
import { execFileSync, spawnSync } from 'node:child_process'
import { P6U226_LESSONS } from './lessons/p6u226.js'
import { P6U227_LESSONS } from './lessons/p6u227.js'
import { P6U228_LESSONS } from './lessons/p6u228.js'
import { P6U229_LESSONS } from './lessons/p6u229.js'

const lessons = [...P6U226_LESSONS, ...P6U227_LESSONS, ...P6U228_LESSONS, ...P6U229_LESSONS]

const hasPython = spawnSync('python3', ['--version']).status === 0

/** Chạy một đoạn Python và trả về stdout đã chuẩn hoá xuống dòng. */
function chayPython(code: string): string {
  return execFileSync('python3', ['-c', code], { encoding: 'utf8' }).replaceAll('\r\n', '\n').trim()
}

describe('algo-s3 — bốn unit bám bốn module, bài Python bounded và tất định', () => {
  it('có bốn unit, tám lesson Python và Make case hiện/ẩn', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u226', 'p6-u227', 'p6-u228', 'p6-u229']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('mỗi bài có ít nhất một ca biên TỪ CHỐI trong bộ test', () => {
    for (const lesson of lessons) {
      const coTuChoi = lesson.make.testCases.some(
        (testCase) =>
          testCase.expected.includes('tu-choi:') || testCase.expected.includes('khong-cat-nhau:'),
      )
      expect(coTuChoi, `Bài ${lesson.id} thiếu ca biên từ chối`).toBe(true)
    }
  })

  it('khoá nội dung bốn module bằng evidence cụ thể', () => {
    const evidence = lessons
      .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
      .join('\n')
      .toLocaleLowerCase('vi')
    for (const marker of [
      'quy hoạch động',
      'bottom-up',
      'off-by-one',
      'kmp',
      'băm',
      'mô-đun',
      'nghịch đảo',
      'tích có hướng',
      'cập nhật lười',
      'push-down',
      'sparse table',
      'oracle',
    ]) {
      expect(evidence, `thiếu dấu vết nội dung: ${marker}`).toContain(marker)
    }
  })

  it('code chạy được không dùng hash() built-in, float, đồng hồ tường hay thư viện ngoài', () => {
    const executableCode = lessons
      .flatMap((lesson) => [
        lesson.workedExample.code,
        lesson.predict.code,
        lesson.parsons.lines.join('\n'),
        lesson.make.starterCode,
        lesson.make.sampleSolution,
      ])
      .join('\n')
    for (const cam of [
      /\bhash\(/,
      /\bfloat\(/,
      /\btime\b/,
      /perf_counter/,
      /\bthreading\b/,
      /multiprocessing/,
      /\bnumpy\b/,
      /\brandom\b/,
      /\bopen\(/,
      /requests/,
    ]) {
      expect(executableCode, `chuỗi bị cấm xuất hiện: ${cam}`).not.toMatch(cam)
    }
  })
})

// Mỗi khối dưới đây so LỜI GIẢI NHANH với ORACLE trên dữ liệu sinh bằng LCG có hạt giống, rồi
// chạy lại với một bản cài LỖI CỐ Ý và đòi hỏi oracle PHẢI bắt được — nếu không, cổng này đang
// xanh rỗng. Mọi lệch đều in ra hạt giống và input để điều tra lại được.
const PRELUDE = `
def lcg(seed):
    x = seed
    def tiep(n):
        nonlocal x
        x = (x * 1103515245 + 12345) % 2147483648
        return x % n
    return tiep
`

describe.runIf(hasPython)('algo-s3 — đối chứng oracle và negative control bằng Python thật', () => {
  it('p6-u226: quy hoạch động ba lô khớp oracle vét cạn trên 100 ca có hạt giống; bản thiếu transition bị bắt', () => {
    const ra = chayPython(`${PRELUDE}
def dp_dung(mon, C):
    dp = [0] * (C + 1)
    for w, v in mon:
        for c in range(C, w - 1, -1):
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[C]

def dp_loi(mon, C):
    # LOI CO Y: duyet TANG dan -> mot mon bi lay nhieu lan.
    dp = [0] * (C + 1)
    for w, v in mon:
        for c in range(w, C + 1):
            dp[c] = max(dp[c], dp[c - w] + v)
    return dp[C]

def oracle(mon, C):
    tot = 0
    for mask in range(1 << len(mon)):
        nang = 0
        gia = 0
        for i, (w, v) in enumerate(mon):
            if mask >> i & 1:
                nang += w
                gia += v
        if nang <= C and gia > tot:
            tot = gia
    return tot

lech_dung = []
lech_loi = 0
for seed in range(1, 101):
    r = lcg(seed)
    n = 1 + r(8)
    mon = [(1 + r(10), 1 + r(20)) for _ in range(n)]
    C = r(25)
    that = oracle(mon, C)
    if dp_dung(mon, C) != that:
        lech_dung.append((seed, mon, C))
    if dp_loi(mon, C) != that:
        lech_loi += 1
print("lech_dung=" + str(lech_dung[:1]))
print("bat_duoc_loi=" + str(lech_loi > 0))
`)
    expect(ra, `bản DP đúng lệch oracle: ${ra}`).toContain('lech_dung=[]')
    expect(ra, 'negative control không bị bắt — harness đang xanh rỗng').toContain(
      'bat_duoc_loi=True',
    )
  })

  it('p6-u227: KMP khớp brute-force; bản dùng MỘT hash trên dữ liệu va chạm cố ý cho kết quả SAI', () => {
    const ra = chayPython(`${PRELUDE}
def kmp(text, pattern):
    fail = [0] * len(pattern)
    k = 0
    for i in range(1, len(pattern)):
        while k > 0 and pattern[k] != pattern[i]:
            k = fail[k - 1]
        if pattern[k] == pattern[i]:
            k += 1
        fail[i] = k
    dem = 0
    k = 0
    for ch in text:
        while k > 0 and pattern[k] != ch:
            k = fail[k - 1]
        if pattern[k] == ch:
            k += 1
        if k == len(pattern):
            dem += 1
            k = fail[k - 1]
    return dem

def brute(text, pattern):
    return sum(1 for i in range(len(text) - len(pattern) + 1) if text[i:i + len(pattern)] == pattern)

lech = []
for seed in range(1, 101):
    r = lcg(seed)
    text = "".join("ab"[r(2)] for _ in range(1 + r(30)))
    pattern = "".join("ab"[r(2)] for _ in range(1 + r(4)))
    if kmp(text, pattern) != brute(text, pattern):
        lech.append((seed, text, pattern))
print("lech_kmp=" + str(lech[:1]))

def bam(s, co_so, mo_dun):
    g = 0
    for c in s:
        g = (g * co_so + ord(c)) % mo_dun
    return g

# Du lieu VA CHAM CO Y: "ad" va "ba" cung gia tri bam voi co so 3, mo-dun 101.
text = "adba" * 20
pattern = "ad"
mot_hash = 0
hai_hash = 0
for i in range(len(text) - len(pattern) + 1):
    doan = text[i:i + len(pattern)]
    if bam(doan, 3, 101) == bam(pattern, 3, 101):
        mot_hash += 1
    if bam(doan, 3, 101) == bam(pattern, 3, 101) and bam(doan, 137, 1000033) == bam(pattern, 137, 1000033):
        hai_hash += 1
that = brute(text, pattern)
print("mot_hash_sai=" + str(mot_hash != that))
print("hai_hash_dung=" + str(hai_hash == that))
`)
    expect(ra, `KMP lệch brute-force: ${ra}`).toContain('lech_kmp=[]')
    expect(ra, 'một hash không bị bắt sai trên dữ liệu va chạm cố ý').toContain('mot_hash_sai=True')
    expect(ra, 'hai bộ hash cũng sai — bộ dữ liệu đối chứng không hợp lệ').toContain(
      'hai_hash_dung=True',
    )
  })

  it('p6-u228: kiểm giao đoạn bằng số nguyên đúng ở ca sát ngưỡng mà bản dùng float `==` bắt sai', () => {
    const ra = chayPython(`
def huong_nguyen(ax, ay, bx, by, cx, cy):
    return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax)

def huong_float(ax, ay, bx, by, cx, cy):
    # LOI CO Y: doi sang so thuc roi so sanh bang 0.0.
    doc = (by - ay) / (bx - ax) if bx != ax else None
    if doc is None:
        return None
    return (cy - ay) - doc * (cx - ax)

# Ca sat nguong: ba diem THANG HANG voi toa do lon.
ax, ay = 0, 0
bx, by = 3, 7
cx, cy = 9 * 10 ** 8, 21 * 10 ** 8
print("nguyen_thang_hang=" + str(huong_nguyen(ax, ay, bx, by, cx, cy) == 0))
print("float_thang_hang=" + str(huong_float(ax, ay, bx, by, cx, cy) == 0.0))

# Sang nguyen to doi chieu kiem tra ngay tho tren toan mien nho.
def sang(n):
    co = [True] * (n + 1)
    co[0] = False
    if n >= 1:
        co[1] = False
    i = 2
    while i * i <= n:
        if co[i]:
            for boi in range(i * i, n + 1, i):
                co[boi] = False
        i += 1
    return [x for x in range(n + 1) if co[x]]

def ngay_tho(n):
    ra = []
    for x in range(2, n + 1):
        if all(x % d != 0 for d in range(2, x)):
            ra.append(x)
    return ra

print("sang_khop=" + str(all(sang(n) == ngay_tho(n) for n in range(2, 200))))
`)
    expect(ra, 'bản số nguyên không nhận ra ba điểm thẳng hàng').toContain('nguyen_thang_hang=True')
    expect(ra, 'bản float không bị bắt sai — negative control vô dụng').toContain(
      'float_thang_hang=False',
    )
    expect(ra, 'sàng nguyên tố lệch kiểm tra ngây thơ').toContain('sang_khop=True')
  })

  it('p6-u229: segment tree lazy khớp mảng thô trên 100 chuỗi thao tác; bản quên push-down bị bắt', () => {
    const ra = chayPython(`${PRELUDE}
class Cay:
    def __init__(self, ds, day_xuong_khi_truy_van):
        self.n = len(ds)
        self.ds = ds[:]
        self.cay = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self.co_day = day_xuong_khi_truy_van
        self.dung(1, 0, self.n - 1)

    def dung(self, nut, l, r):
        if l == r:
            self.cay[nut] = self.ds[l]
            return
        giua = (l + r) // 2
        self.dung(nut * 2, l, giua)
        self.dung(nut * 2 + 1, giua + 1, r)
        self.cay[nut] = self.cay[nut * 2] + self.cay[nut * 2 + 1]

    def day(self, nut, l, r):
        if self.lazy[nut] == 0:
            return
        giua = (l + r) // 2
        for con, cl, cr in ((nut * 2, l, giua), (nut * 2 + 1, giua + 1, r)):
            self.lazy[con] += self.lazy[nut]
            self.cay[con] += self.lazy[nut] * (cr - cl + 1)
        self.lazy[nut] = 0

    def cong(self, nut, l, r, ql, qr, gia):
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            self.cay[nut] += gia * (r - l + 1)
            self.lazy[nut] += gia
            return
        self.day(nut, l, r)
        giua = (l + r) // 2
        self.cong(nut * 2, l, giua, ql, qr, gia)
        self.cong(nut * 2 + 1, giua + 1, r, ql, qr, gia)
        self.cay[nut] = self.cay[nut * 2] + self.cay[nut * 2 + 1]

    def tong(self, nut, l, r, ql, qr):
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return self.cay[nut]
        if self.co_day:
            self.day(nut, l, r)
        giua = (l + r) // 2
        return self.tong(nut * 2, l, giua, ql, qr) + self.tong(nut * 2 + 1, giua + 1, r, ql, qr)

def chay(seed, co_day):
    r = lcg(seed)
    n = 1 + r(12)
    ds = [r(20) for _ in range(n)]
    cay = Cay(ds, co_day)
    tho = ds[:]
    ra = []
    for _ in range(12):
        l = r(n)
        rr = l + r(n - l)
        if r(2) == 0:
            gia = 1 + r(9)
            cay.cong(1, 0, n - 1, l, rr, gia)
            for i in range(l, rr + 1):
                tho[i] += gia
        else:
            ra.append((cay.tong(1, 0, n - 1, l, rr), sum(tho[l:rr + 1])))
    return ra

lech_dung = [s for s in range(1, 101) if any(a != b for a, b in chay(s, True))]
print("lech_dung=" + str(lech_dung[:1]))

# Negative control: cap nhat PHU TRON roi truy van MOT PHAN — dung chuoi thao tac dung san,
# vi sinh ngau nhien hiem khi roi vao dung khuon nay (da do: 200 hat giong khong lan nao).
def thu_push_down(co_day):
    cay = Cay([1, 1, 1, 1], co_day)
    cay.cong(1, 0, 3, 0, 3, 5)
    return cay.tong(1, 0, 3, 1, 2)

print("ban_dung=" + str(thu_push_down(True) == 12))
print("bat_duoc_loi=" + str(thu_push_down(False) != 12))
`)
    expect(ra, `segment tree lệch mảng thô: ${ra}`).toContain('lech_dung=[]')
    expect(ra, 'bản quên push-down không bị bắt — harness đang xanh rỗng').toContain(
      'bat_duoc_loi=True',
    )
  })
})
