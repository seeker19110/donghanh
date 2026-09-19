// completionSandboxServer — Chấm LẠI bài Make bậc P1–P4 (Python) Ở SERVER trước khi ghi
// `status:'completed'` (ADR-0007, docs/adr/0007-completion-evidence-sandbox-lap-trinh.md).
//
// VÌ SAO CẦN: client chỉ chạy Pyodide/WASM trong Web Worker rồi tự POST 'completed' — DevTools
// sửa được. File này CHẤM LẠI đúng test-case của bài (đọc từ registry server, KHÔNG tin dữ liệu
// test-case do client gửi) bằng python3 thật trong tiến trình con, dùng LẠI đúng engine chấm
// (`grading.ts`) và đúng "làn Python" (`pyLanes.ts`) mà `lessonsPython.test.ts` đã dùng làm cổng
// nội dung — nhờ vậy hành vi CI/test và hành vi chấm-lại-khi-nộp-bài không trôi khỏi nhau.
//
// BA LỚP BẢO VỆ BẮT BUỘC (Quyết định 1–3 của ADR-0007):
//   1. Allowlist Python: chặn import các module hệ thống/mạng nguy hiểm (luôn bật, không phụ
//      thuộc hạ tầng).
//   2. Chạy dưới user hệ thống riêng, không quyền ghi ngoài thư mục tạm của chính nó (BEST-EFFORT
//      — cần biến môi trường `PROGRAMMING_SANDBOX_USER` trỏ tới user đã cấu hình sẵn trên VPS
//      qua `sudo -n -u <user>`; KHÔNG cấu hình thì chạy bằng user của tiến trình Node, vẫn còn
//      lớp 1 + 3 chặn).
//   3. Giới hạn CPU/bộ nhớ/số tiến trình con (`ulimit`) + timeout cứng khớp client (10s).
//
// CÔ LẬP MẠNG (Quyết định 2 của ADR-0007) — HAI TẦNG:
//   · TẦNG CHÍNH (luôn bật): allowlist ở lớp 1 chặn `socket`/`urllib`/`http`/`ftplib`/`smtplib`/
//     `requests` (trừ làn httpsim tự có `requests.py` MÔ PHỎNG, không phải mạng thật).
//   · TẦNG PHỤ (best-effort, dò THẬT lúc chạy, không giả định): nếu `unshare --net` dùng được
//     trên máy chủ, bọc lệnh chấm trong đó để cô lập ở tầng OS. Không có thì bỏ qua — xem
//     PROGRESS.md mục nợ kỹ thuật "cô lập mạng chấm bài Lập trình".
import { execFileSync, spawnSync } from 'node:child_process'
import { chownSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { getLesson } from './lessons.js'
import { laLanPython, fileCuaLan, noiCodeTheoLan, type PythonLane } from './pyLanes.js'
import { gradeTestCase, allTestsPassed, type TestCaseResult } from './grading.js'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

/** Khớp `DEFAULT_TIMEOUT_MS` client (`apps/dhcb/src/lib/pythonRunner.ts`) — cùng trải nghiệm. */
const TIMEOUT_MS = 10_000
const MAX_OUTPUT_BYTES = 1_000_000
/** Bộ nhớ ảo tối đa một lượt chấm (KB) — đủ cho bài người mới, chặn bom bộ nhớ. */
const MAX_VIRTUAL_MEM_KB = 512_000
/** Số tiến trình/luồng con tối đa của user chạy lệnh — chặn fork-bomb kiểu `while True: os.fork()`
 * (dù `os` đã bị chặn ở lớp 1, đây là lớp CHẶN THỨ HAI độc lập, phòng allowlist có kẽ hở). */
const MAX_PROCESSES = 32

/** Phạm vi ADR-0007 (Quyết định 4): CHỈ bậc P1–P4, bài xương sống (không phải bước dự án). */
const SPINE_P1_P4_RE = /^p[1-4]-u\d+-l\d+$/

/** Bài này có thuộc phạm vi chấm-lại-ở-server không (dùng cả ở route để quyết có đòi `code` hay không). */
export function isServerRegradableLesson(lessonId: string): boolean {
  if (!SPINE_P1_P4_RE.test(lessonId)) return false
  const lesson = getLesson(lessonId)
  return !!lesson && laLanPython(lesson.language)
}

// Lớp bảo vệ 1: chặn import module hệ thống/mạng — liệt kê MỌI module không lành mạnh mà bài
// P1–P4 (đã rà: không bài nào dùng các module này) không cần tới.
const BLOCKED_MODULES = [
  'os',
  'sys',
  'subprocess',
  'socket',
  'ctypes',
  'importlib',
  'shutil',
  'multiprocessing',
  'threading',
  'ftplib',
  'smtplib',
  'ssl',
  'urllib',
  'http',
  'requests',
  'asyncio',
  'signal',
  'resource',
  'platform',
  'pathlib',
  'tempfile',
  'pickle',
  'marshal',
  'webbrowser',
  'pty',
  'fcntl',
  'mmap',
] as const

function buildGuardPreamble(lane: PythonLane): string {
  // Làn httpsim/apisim tự ghi sẵn module MÔ PHỎNG trùng tên ('requests.py', gói 'fastapi/') —
  // không phải mạng thật, nên không chặn tên module đó ở đúng làn tương ứng.
  const allow = new Set<string>()
  if (lane === 'httpsim') allow.add('requests')
  if (lane === 'apisim') allow.add('fastapi')
  const blocked = BLOCKED_MODULES.filter((m) => !allow.has(m))
  const pyList = blocked.map((m) => `'${m}'`).join(', ')
  return (
    `import builtins as _b\n` +
    `_BLOCKED = {${pyList}}\n` +
    `_orig_import = _b.__import__\n` +
    `def _guarded_import(name, *a, **kw):\n` +
    `    top = name.split('.')[0]\n` +
    `    if top in _BLOCKED:\n` +
    `        raise ImportError("module '" + top + "' bi chan trong moi truong cham bai")\n` +
    `    return _orig_import(name, *a, **kw)\n` +
    `_b.__import__ = _guarded_import\n\n`
  )
}

/** Prelude input(): giống hệt `lessonsPython.test.ts` (đọc tuần tự stdinLines, echo ra stdout) —
 * PHẢI khớp hành vi sandbox trình duyệt (`pyodideWorker.ts`) để không lệch chấm. */
function wrapStdin(code: string, stdinLines: string[]): string {
  return (
    `import builtins, json\n` +
    `_lines = json.loads(${JSON.stringify(JSON.stringify(stdinLines))})\n` +
    `_it = iter(_lines)\n` +
    `def _input(prompt=""):\n` +
    `    try:\n` +
    `        value = next(_it)\n` +
    `    except StopIteration:\n` +
    `        raise EOFError("het du lieu nhap")\n` +
    `    print(f"{prompt}{value}")\n` +
    `    return value\n` +
    `builtins.input = _input\n\n` +
    `${code}\n`
  )
}

let sandboxUserIds: { uid: number; gid: number } | null | undefined
/**
 * uid/gid của `PROGRAMMING_SANDBOX_USER` — tra MỘT LẦN (cache), dùng để `chown` thư mục tạm.
 *
 * VÌ SAO CẦN: tiến trình Node chạy bằng `root` (theo `scripts/deploy.sh`, PM2 khởi động trực
 * tiếp trên VPS bằng user root) — `mkdtempSync` tạo thư mục quyền 700 sở hữu root. Nếu chấm bài
 * chạy dưới user riêng qua `sudo -u` mà KHÔNG `chown` trước, user đó không đọc/ghi được thư mục
 * tạm → mọi lượt chấm lỗi ngay, không phải lỗ hổng bảo mật nhưng là lỗi CHỨC NĂNG nghiêm trọng
 * nếu bật `PROGRAMMING_SANDBOX_USER` mà thiếu bước này.
 */
function getSandboxUserIds(user: string): { uid: number; gid: number } | null {
  if (sandboxUserIds !== undefined) return sandboxUserIds
  try {
    const uid = Number(execFileSync('id', ['-u', user], { encoding: 'utf8' }).trim())
    const gid = Number(execFileSync('id', ['-g', user], { encoding: 'utf8' }).trim())
    sandboxUserIds = Number.isFinite(uid) && Number.isFinite(gid) ? { uid, gid } : null
  } catch {
    sandboxUserIds = null
  }
  return sandboxUserIds
}

let unshareNetAvailable: boolean | null = null
/** Dò THẬT lúc chạy (không giả định) — cache kết quả vì không đổi trong đời tiến trình server. */
function hasUnshareNet(): boolean {
  if (unshareNetAvailable !== null) return unshareNetAvailable
  try {
    const r = spawnSync('unshare', ['--net', '--', 'true'], { timeout: 2000 })
    unshareNetAvailable = r.status === 0
  } catch {
    unshareNetAvailable = false
  }
  return unshareNetAvailable
}

interface RunOutcome {
  output: string
  error?: string
}

/**
 * Chạy MỘT lần trong tiến trình con đã bọc đủ 3 lớp bảo vệ + cô lập mạng best-effort.
 *
 * `scriptPath` PHẢI là file THẬT nằm trong `cwd` (đã ghi + `chown` sẵn cho user sandbox nếu có
 * cấu hình) — KHÔNG truyền code qua biến môi trường: `sudo` mặc định `env_reset` xoá sạch biến
 * môi trường tự đặt (đã xác nhận bằng thực nghiệm — bật `PROGRAMMING_SANDBOX_USER` thật khiến
 * code học viên "biến mất", `python3 -c ""` chạy rỗng, chấm sai im lặng). File tránh cả vấn đề
 * đó lẫn escaping/injection của việc nối chuỗi vào `-c`.
 */
function runSandboxed(scriptPath: string, cwd: string): RunOutcome {
  // `ulimit` là lệnh nội trú của shell — bọc qua `bash -c`, tham số `$1` là ĐƯỜNG DẪN FILE
  // (không phải code) nên không có gì để escaping/injection.
  const ulimitPart = `ulimit -v ${MAX_VIRTUAL_MEM_KB} -u ${MAX_PROCESSES} 2>/dev/null`
  const runPart = 'exec python3 "$1"'
  const script = `${ulimitPart}; ${runPart}`

  const sandboxUser = process.env.PROGRAMMING_SANDBOX_USER
  const netIsolate = hasUnshareNet()

  let cmd = 'bash'
  let args = ['-c', script, 'dhcb-sandbox', scriptPath]
  // Lớp 2 (best-effort): user hệ thống riêng, cấu hình `sudo -n` (không hỏi mật khẩu) sẵn trên
  // VPS cho đúng user đó — KHÔNG cấu hình được thì bỏ qua, không chặn PR (xem PROGRESS.md).
  if (sandboxUser) {
    args = ['-n', '-u', sandboxUser, '--', cmd, ...args]
    cmd = 'sudo'
  }
  // Tầng phụ cô lập mạng: bọc NGOÀI CÙNG nếu máy chủ hỗ trợ.
  if (netIsolate) {
    args = ['--net', '--', cmd, ...args]
    cmd = 'unshare'
  }
  // BỌC NGOÀI CÙNG bằng `timeout(1)` (coreutils) — xác nhận bằng thực nghiệm: timeout của
  // Node (`execFileSync`'s `timeout` option) chỉ kill tiến trình CON TRỰC TIẾP nó spawn; khi
  // đó là `sudo`, cháu `python3` SỐNG SÓT sau timeout (vòng lặp vô hạn chạy vô thời hạn dưới
  // user sandbox — đúng thứ timeout cứng phải chặn). `timeout(1)` tự đặt process group mới
  // (không có `--foreground`) và kill CẢ NHÓM khi hết giờ — diệt được cả chuỗi
  // unshare→sudo→bash→python3. `-k 1` gửi thêm SIGKILL sau 1s nếu SIGTERM đầu không đủ.
  const timeoutSeconds = Math.ceil(TIMEOUT_MS / 1000)
  args = ['-k', '1', `${timeoutSeconds}`, cmd, ...args]
  cmd = 'timeout'

  try {
    const output = execFileSync(cmd, args, {
      encoding: 'utf8',
      // Lưới an toàn PHỤ (Node), phòng khi `timeout(1)` tự nó bị treo — dài hơn timeout(1)
      // một chút để không tranh triggers với nó.
      timeout: TIMEOUT_MS + 3_000,
      killSignal: 'SIGKILL',
      cwd,
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: MAX_OUTPUT_BYTES,
      // Không kế thừa secret của server (bất biến kỹ thuật #2, CLAUDE.md mục 4) — chỉ truyền
      // đúng những gì cần. `sudo` sẽ tự `env_reset` lại theo chính sách của nó dù có set gì ở
      // đây, nên code học viên KHÔNG được đặt vào env (xem comment ở scriptPath).
      env: {
        PATH: process.env.PATH ?? '/usr/bin:/bin',
        PYTHONIOENCODING: 'utf-8',
        PYTHONUTF8: '1',
      },
    })
    return { output }
  } catch (err) {
    const e = err as {
      stdout?: string
      stderr?: string
      message?: string
      killed?: boolean
      status?: number | null
    }
    // Mã thoát 124 = quy ước của `timeout(1)` khi nó phải diệt tiến trình (SIGTERM/SIGKILL đến
    // TỪ `timeout`, không phải từ Node — `e.killed` chỉ đúng cho lưới an toàn phụ của Node).
    const error =
      e.killed || e.status === 124
        ? 'Quá thời gian hoặc vượt giới hạn tài nguyên khi chấm lại'
        : (e.stderr || e.message || 'lỗi chạy python3 khi chấm lại').trim()
    return { output: e.stdout ?? '', error }
  }
}

export interface RegradeResult {
  passed: boolean
  results: TestCaseResult[]
}

/**
 * Chấm lại TOÀN BỘ test-case của bài Make bằng code học viên vừa nộp. Test-case lấy từ
 * `getLesson()` (registry server, đáng tin) — KHÔNG bao giờ nhận test-case từ client.
 *
 * Ném lỗi nếu bài không thuộc phạm vi chấm-lại (gọi `isServerRegradableLesson` trước ở route).
 */
export function regradeMakeSubmission(lessonId: string, code: string): RegradeResult {
  const lesson = getLesson(lessonId)
  if (!lesson || !laLanPython(lesson.language)) {
    throw new Error(`Bài "${lessonId}" không thuộc phạm vi chấm-lại-ở-server`)
  }
  const lane = lesson.language
  const laneFiles = fileCuaLan(lane)
  const guard = buildGuardPreamble(lane)

  // Thư mục TẠM RIÊNG cho lượt nộp này — xoá ngay sau khi chấm xong (không để rác/không rò
  // giữa các lượt chấm của người dùng khác nhau).
  const scratchDir = mkdtempSync(join(tmpdir(), 'dhcb-regrade-'))
  try {
    for (const [name, content] of Object.entries(laneFiles)) {
      const dest = join(scratchDir, name)
      mkdirSync(dirname(dest), { recursive: true })
      writeFileSync(dest, content, 'utf8')
    }

    // Đổi chủ thư mục tạm cho user sandbox RIÊNG (nếu có cấu hình) — bắt buộc để nó đọc/ghi
    // được, vì tiến trình Node (root) vừa tạo thư mục này với quyền mặc định 700 của root.
    const sandboxUser = process.env.PROGRAMMING_SANDBOX_USER
    const sandboxIds = sandboxUser ? getSandboxUserIds(sandboxUser) : null
    if (sandboxUser && !sandboxIds) {
      console.warn(
        `[completionSandboxServer] không tra được uid/gid của user "${sandboxUser}" — ` +
          'chạy chấm bài KHÔNG đổi chủ (có thể lỗi quyền nếu user đó tồn tại nhưng lệnh `id` thất bại).',
      )
    }
    const chownForSandbox = (p: string) => {
      if (!sandboxIds) return
      chownSync(p, sandboxIds.uid, sandboxIds.gid)
    }
    if (sandboxIds) {
      chownForSandbox(scratchDir)
      for (const name of Object.keys(laneFiles)) {
        // Đổi chủ CẢ đường dẫn cha lẫn file — tên có "/" nghĩa là một gói (fastapi/__init__.py).
        let dir = dirname(join(scratchDir, name))
        while (dir !== scratchDir && dir.startsWith(scratchDir)) {
          chownForSandbox(dir)
          dir = dirname(dir)
        }
        chownForSandbox(join(scratchDir, name))
      }
    }

    const results: TestCaseResult[] = []
    let seq = 0
    for (const testCase of lesson.make.testCases) {
      const studentCode = guard + noiCodeTheoLan(lane, code)
      // Ghi ra FILE THẬT (không qua biến môi trường — xem comment ở runSandboxed) rồi chown
      // ngay cho user sandbox, nếu có, để nó đọc được sau khi `sudo -u` hạ quyền.
      const scriptPath = join(scratchDir, `submission-${seq++}.py`)
      writeFileSync(scriptPath, wrapStdin(studentCode, testCase.stdinLines), 'utf8')
      chownForSandbox(scriptPath)
      const outcome = runSandboxed(scriptPath, scratchDir)
      results.push(gradeTestCase(testCase, outcome.output, outcome.error))
    }
    return { passed: allTestsPassed(results), results }
  } finally {
    rmSync(scratchDir, { recursive: true, force: true })
  }
}
