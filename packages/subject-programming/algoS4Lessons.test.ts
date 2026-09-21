// CỔNG NGỮ NGHĨA cho chặng `algo-s4` (đặc tả docs/specs/2026-09-21-algo-s3-s4-bai-hoc-that.md).
//
// Cùng khuôn với `algoS3Lessons.test.ts`: chạy lời giải ĐỐI CHỨNG trên dữ liệu sinh có hạt
// giống, kèm một bản cài LỖI CỐ Ý (negative control) phải bị bắt — nếu không thì cổng đang
// xanh rỗng. Mọi mô phỏng ở đây là SỐ HỌC: không thread/process thật, không đồng hồ tường.
import { describe, expect, it } from 'vitest'
import { execFileSync, spawnSync } from 'node:child_process'
import { P6U230_LESSONS } from './lessons/p6u230.js'
import { P6U231_LESSONS } from './lessons/p6u231.js'
import { P6U232_LESSONS } from './lessons/p6u232.js'
import { P6U233_LESSONS } from './lessons/p6u233.js'

const lessons = [...P6U230_LESSONS, ...P6U231_LESSONS, ...P6U232_LESSONS, ...P6U233_LESSONS]

const hasPython = spawnSync('python3', ['--version']).status === 0

/** Chạy một đoạn Python và trả về stdout đã chuẩn hoá xuống dòng. */
function chayPython(code: string): string {
  return execFileSync('python3', ['-c', code], { encoding: 'utf8' }).replaceAll('\r\n', '\n').trim()
}

describe('algo-s4 — bốn unit bám bốn module, mô phỏng số học tất định', () => {
  it('có bốn unit, tám lesson Python và Make case hiện/ẩn', () => {
    expect(lessons).toHaveLength(8)
    for (const unitId of ['p6-u230', 'p6-u231', 'p6-u232', 'p6-u233']) {
      expect(lessons.filter((lesson) => lesson.unitId === unitId)).toHaveLength(2)
    }
    for (const lesson of lessons) {
      expect(lesson.language).toBe('python')
      expect(lesson.make.testCases.some((testCase) => !testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.some((testCase) => testCase.hidden)).toBe(true)
      expect(lesson.make.testCases.every((testCase) => testCase.match === 'contains')).toBe(true)
    }
  })

  it('mỗi bài có ít nhất một ca biên TỪ CHỐI hoặc LÀM RÕ trong bộ test', () => {
    for (const lesson of lessons) {
      const coCaBien = lesson.make.testCases.some(
        (testCase) =>
          testCase.expected.includes('tu-choi:') ||
          testCase.expected.includes('can-lam-ro:') ||
          testCase.expected.includes('thieu:'),
      )
      expect(coCaBien, `Bài ${lesson.id} thiếu ca biên từ chối/làm rõ`).toBe(true)
    }
  })

  it('khoá nội dung bốn module bằng evidence cụ thể', () => {
    const evidence = lessons
      .map((lesson) => `${lesson.title}\n${lesson.theory}\n${lesson.make.prompt}`)
      .join('\n')
      .toLocaleLowerCase('vi')
    for (const marker of [
      'bloom filter',
      'âm tính giả',
      'hạt giống',
      'np-khó',
      'cận trên',
      'cải thiện cục bộ',
      'đổi khối',
      'row-major',
      'cân bằng tải',
      'làm rõ',
      'ước lượng',
      'giả định',
    ]) {
      expect(evidence, `thiếu dấu vết nội dung: ${marker}`).toContain(marker)
    }
  })

  it('code chạy được không dùng hash() built-in, đồng hồ tường, thread/process hay thư viện ngoài', () => {
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
      /concurrent\.futures/,
      /\bnumpy\b/,
      /\brandom\b/,
      /\bopen\(/,
      /requests/,
    ]) {
      expect(executableCode, `chuỗi bị cấm xuất hiện: ${cam}`).not.toMatch(cam)
    }
  })
})

const PRELUDE = `
def sinh(hat_giong, so_luong):
    x = hat_giong
    ra = []
    for _ in range(so_luong):
        x = (x * 1103515245 + 12345) % 2147483648
        ra.append(str(x))
    return ra

def bam(chuoi, chi_so, so_bit):
    co_so = 131 + 2 * chi_so
    g = 0
    for ky_tu in chuoi:
        g = (g * co_so + ord(ky_tu)) % so_bit
    return g
`

describe.runIf(hasPython)('algo-s4 — đối chứng và negative control bằng Python thật', () => {
  it('p6-u230: Bloom filter không có âm tính giả so với `set`; k=1 báo nhầm nhiều hơn hẳn k=3 trên 5 hạt giống', () => {
    const ra = chayPython(`${PRELUDE}
def do_bao_nham(so_bit, k, hat_giong):
    day = sinh(hat_giong, 230)
    them = day[:30]
    hoi = day[30:]
    bit = [0] * so_bit
    for tu in them:
        for j in range(k):
            bit[bam(tu, j, so_bit)] = 1
    tap = set(them)
    # Bat buoc: khoa da them KHONG BAO GIO bi bao la khong co (khong am tinh gia).
    am_tinh_gia = any(not all(bit[bam(tu, j, so_bit)] == 1 for j in range(k)) for tu in them)
    nham = 0
    for tu in hoi:
        if tu not in tap and all(bit[bam(tu, j, so_bit)] == 1 for j in range(k)):
            nham += 1
    return nham, am_tinh_gia

hat = [1, 2, 3, 4, 5]
k1 = 0
k3 = 0
co_am_tinh_gia = False
for h in hat:
    a, sai_a = do_bao_nham(256, 1, h)
    b, sai_b = do_bao_nham(256, 3, h)
    k1 += a
    k3 += b
    co_am_tinh_gia = co_am_tinh_gia or sai_a or sai_b
print("am_tinh_gia=" + str(co_am_tinh_gia))
print("k1=" + str(k1) + " k3=" + str(k3))
print("k1_te_hon=" + str(k1 > k3))
`)
    expect(ra, `Bloom filter có âm tính giả: ${ra}`).toContain('am_tinh_gia=False')
    expect(ra, `k=1 không tệ hơn k=3 — negative control vô dụng: ${ra}`).toContain('k1_te_hon=True')
    // Con số khoá cứng: đây chính là kỳ vọng của test-case hiện trong bài p6-u230-l2.
    expect(ra).toContain('k1=113 k3=33')
  })

  it('p6-u231: heuristic không bao giờ vượt cận trên; bản BỎ cải thiện cục bộ cho kết quả xấu hơn đo được', () => {
    const ra = chayPython(`${PRELUDE}
def lcg(seed):
    x = seed
    def tiep(n):
        nonlocal x
        x = (x * 1103515245 + 12345) % 2147483648
        return x % n
    return tiep

def sap(mon):
    return sorted(mon, key=lambda t: (-(t[1] * 1000 // t[0]), t[0]))

def tham_lam(mon, C):
    con = C
    gia = 0
    chon = []
    for i, (w, v) in enumerate(mon):
        if w <= con:
            chon.append(i)
            gia += v
            con -= w
    return gia, chon

def can_tren(mon, C):
    con = C
    tong = 0
    for w, v in mon:
        if w <= con:
            tong += v
            con -= w
        else:
            tong += v * con // w
            break
    return tong

def cai_thien(mon, C, gia, chon):
    dang_chon = set(chon)
    nang = sum(mon[i][0] for i in dang_chon)
    for _ in range(100):
        doi = False
        for j in range(len(mon)):
            if j not in dang_chon and nang + mon[j][0] <= C:
                dang_chon.add(j)
                nang += mon[j][0]
                gia += mon[j][1]
                doi = True
                break
        if doi:
            continue
        for i in sorted(dang_chon):
            for j in range(len(mon)):
                if j in dang_chon:
                    continue
                nang_moi = nang - mon[i][0] + mon[j][0]
                gia_moi = gia - mon[i][1] + mon[j][1]
                if nang_moi <= C and gia_moi > gia:
                    dang_chon.discard(i)
                    dang_chon.add(j)
                    nang = nang_moi
                    gia = gia_moi
                    doi = True
                    break
            if doi:
                break
        if not doi:
            break
    return gia

vuot_can = []
so_lan_tot_hon = 0
for seed in range(1, 101):
    r = lcg(seed)
    mon = sap([(1 + r(15), 1 + r(30)) for _ in range(5 + r(20))])
    C = 10 + r(40)
    gia, chon = tham_lam(mon, C)
    sau = cai_thien(mon, C, gia, list(chon))
    tran = can_tren(mon, C)
    if gia > tran or sau > tran:
        vuot_can.append((seed, gia, sau, tran))
    if sau > gia:
        so_lan_tot_hon += 1
print("vuot_can_tren=" + str(vuot_can[:1]))
print("so_lan_cai_thien_tot_hon=" + str(so_lan_tot_hon))
print("cai_thien_co_tac_dung=" + str(so_lan_tot_hon > 0))
`)
    expect(ra, `heuristic vượt cận trên — cận trên tính sai: ${ra}`).toContain('vuot_can_tren=[]')
    expect(ra, `bỏ cải thiện cục bộ không tệ hơn — negative control vô dụng: ${ra}`).toContain(
      'cai_thien_co_tac_dung=True',
    )
  })

  it('p6-u232: đếm đổi khối và chia tải đều tất định; cách chia dồn phần dư lệch tải hơn hẳn', () => {
    const ra = chayPython(`
def dem_doi_khoi(so_hang, so_cot, khoi, theo_cot):
    truoc = -1
    dem = 0
    thu_tu = (
        [(i, j) for j in range(so_cot) for i in range(so_hang)]
        if theo_cot
        else [(i, j) for i in range(so_hang) for j in range(so_cot)]
    )
    for i, j in thu_tu:
        k = (i * so_cot + j) // khoi
        if k != truoc:
            dem += 1
            truoc = k
    return dem

# Duyet theo hang KHONG BAO GIO doi khoi nhieu hon duyet theo cot tren cung du lieu.
te_hon = []
for so_hang in range(1, 17):
    for so_cot in range(1, 17):
        for khoi in (1, 2, 4, 8, 16):
            a = dem_doi_khoi(so_hang, so_cot, khoi, False)
            b = dem_doi_khoi(so_hang, so_cot, khoi, True)
            if a > b:
                te_hon.append((so_hang, so_cot, khoi, a, b))
print("row_major_te_hon=" + str(te_hon[:1]))
print("vi_du_4x4_khoi4=" + str(dem_doi_khoi(4, 4, 4, False)) + "-" + str(dem_doi_khoi(4, 4, 4, True)))

def lech_deu(N, k):
    co_ban = N // k
    du = N % k
    phan = [co_ban + (1 if i < du else 0) for i in range(k)]
    return max(phan) - min(phan)

def lech_luoi(N, k):
    co_ban = N // k
    phan = [co_ban] * (k - 1)
    phan.append(N - co_ban * (k - 1))
    return max(phan) - min(phan)

deu_khong_bao_gio_te_hon = all(
    lech_deu(N, k) <= lech_luoi(N, k) for N in range(1, 200) for k in range(1, N + 1)
)
deu_toi_da_mot = all(lech_deu(N, k) <= 1 for N in range(1, 200) for k in range(1, N + 1))
co_luc_luoi_te_hon = any(
    lech_luoi(N, k) > lech_deu(N, k) for N in range(1, 200) for k in range(1, N + 1)
)
print("deu_khong_te_hon=" + str(deu_khong_bao_gio_te_hon))
print("deu_toi_da_mot=" + str(deu_toi_da_mot))
print("luoi_co_luc_te_hon=" + str(co_luc_luoi_te_hon))
`)
    expect(ra, `duyệt theo hàng đổi khối nhiều hơn theo cột: ${ra}`).toContain(
      'row_major_te_hon=[]',
    )
    // Con số khoá cứng: kỳ vọng của test-case hiện trong bài p6-u232-l1.
    expect(ra).toContain('vi_du_4x4_khoi4=4-16')
    expect(ra, `chia đều lệch hơn chia lười: ${ra}`).toContain('deu_khong_te_hon=True')
    expect(ra, `chia đều lệch quá 1 đơn vị: ${ra}`).toContain('deu_toi_da_mot=True')
    expect(ra, `chia lười không bao giờ tệ hơn — negative control vô dụng: ${ra}`).toContain(
      'luoi_co_luc_te_hon=True',
    )
  })

  it('p6-u233: báo đúng trường thiếu ĐẦU TIÊN theo thứ tự cố định và từ chối giá trị 0', () => {
    const ra = chayPython(`
BAT_BUOC = ["qps", "kich-thuoc-ban-ghi", "so-ngay-luu"]
GIAY_TRONG_NGAY = 86400

def quyet_dinh(de_bai):
    for ten in BAT_BUOC:
        if ten not in de_bai:
            return "can-lam-ro: " + ten
    for ten in BAT_BUOC:
        if de_bai[ten] <= 0:
            return "tu-choi: tham-so-khong-hop-le"
    uoc_luong = (
        de_bai["qps"] * de_bai["kich-thuoc-ban-ghi"] * GIAY_TRONG_NGAY * de_bai["so-ngay-luu"]
    )
    return "uoc-luong: " + str(uoc_luong)

du = {"qps": 100, "kich-thuoc-ban-ghi": 200, "so-ngay-luu": 1}
print(quyet_dinh(du))
print(quyet_dinh({"kich-thuoc-ban-ghi": 200, "so-ngay-luu": 7}))
print(quyet_dinh({"qps": 100, "so-ngay-luu": 7}))
print(quyet_dinh({"qps": 100, "kich-thuoc-ban-ghi": 200}))
# Tat dinh: thieu HAI truong van chi hoi truong DAU TIEN.
print(quyet_dinh({"so-ngay-luu": 7}))
# Ca am: gia tri 0 KHONG duoc bien thanh uoc luong 0.
print(quyet_dinh({"qps": 100, "kich-thuoc-ban-ghi": 200, "so-ngay-luu": 0}))
print(quyet_dinh({}))
`)
    expect(ra.split('\n')).toEqual([
      'uoc-luong: 1728000000',
      'can-lam-ro: qps',
      'can-lam-ro: kich-thuoc-ban-ghi',
      'can-lam-ro: so-ngay-luu',
      'can-lam-ro: qps',
      'tu-choi: tham-so-khong-hop-le',
      'can-lam-ro: qps',
    ])
  })
})
