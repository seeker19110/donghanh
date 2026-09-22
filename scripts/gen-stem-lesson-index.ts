// gen-stem-lesson-index.ts — Sinh `lessonsLazy.ts` cho bốn môn STEM.
//
// Tệp sinh ra chứa chỉ mục NHẸ (id, tiêu đề, chương, nhánh) + bản đồ nạp lười từng tệp chương.
// Nhờ nó, giao diện liệt kê được toàn bộ bài mà không kéo ~2 MB nội dung vào bundle.
//
// CHẠY LẠI SAU MỖI LẦN THÊM/SỬA BÀI HỌC: `npm run gen:stem-lesson-index`.
// Quên thì `lessonsLazy.test.ts` của môn tương ứng sẽ đỏ với đúng câu nhắc đó.
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import prettier from 'prettier'

interface SubjectSpec {
  dir: string
  lessonType: string
  registryExport: string
}

const SUBJECTS: SubjectSpec[] = [
  { dir: 'packages/subject-math', lessonType: 'MathLesson', registryExport: 'MATH_LESSONS' },
  {
    dir: 'packages/subject-physics',
    lessonType: 'PhysicsLesson',
    registryExport: 'PHYSICS_LESSONS',
  },
  { dir: 'packages/subject-chemistry', lessonType: 'ChemLesson', registryExport: 'CHEM_LESSONS' },
  {
    dir: 'packages/subject-biology',
    lessonType: 'BiologyLesson',
    registryExport: 'BIOLOGY_LESSONS',
  },
]

/** Đọc `lessons.ts` để biết tệp chương nào xuất ra hằng nào — nguồn sự thật là chính registry. */
function readChapterFiles(dir: string): Array<{ key: string; file: string; exportName: string }> {
  const src = readFileSync(resolve(dir, 'lessons.ts'), 'utf8')
  const out: Array<{ key: string; file: string; exportName: string }> = []
  const re = /import\s*\{\s*([A-Z0-9_]+)\s*\}\s*from\s*'\.\/lessons\/([A-Za-z0-9_-]+)\.js'/g
  let m: RegExpExecArray | null
  while ((m = re.exec(src)) !== null) {
    const exportName = m[1]!
    const file = m[2]!
    out.push({ key: file, file, exportName })
  }
  return out
}

async function buildSubject(spec: SubjectSpec): Promise<string> {
  const chapters = readChapterFiles(spec.dir)
  if (chapters.length === 0) {
    throw new Error(`${spec.dir}/lessons.ts không có import tệp chương nào — kiểm lại khuôn import`)
  }

  // Nạp registry thật để lấy dữ liệu chỉ mục, thay vì phân tích cú pháp văn bản (dễ lệch).
  const rows: string[] = []
  for (const ch of chapters) {
    const mod = (await import(resolve(spec.dir, 'lessons', `${ch.file}.ts`))) as Record<
      string,
      Array<Record<string, unknown>>
    >
    const lessons = mod[ch.exportName]
    if (!lessons) throw new Error(`${ch.file}.ts không xuất ${ch.exportName}`)
    for (const l of lessons) {
      const tier = l.advancedTier ? `, advancedTier: '${String(l.advancedTier)}'` : ''
      rows.push(
        `  { id: '${String(l.id)}', grade: '${String(l.grade)}', chapterNumber: ${Number(l.chapterNumber)}, ` +
          `chapterTitle: ${JSON.stringify(l.chapterTitle)}, lessonNumber: ${Number(l.lessonNumber)}, ` +
          `title: ${JSON.stringify(l.title)}, track: '${String(l.track)}'${tier}, ` +
          `hasAnimation: ${l.animation ? 'true' : 'false'}, ` +
          `reviewStatus: '${String(l.reviewStatus)}', chapterKey: '${ch.key}' },`,
      )
    }
  }

  const loaders = chapters
    .map(
      (ch) =>
        `  '${ch.key}': () => import('./lessons/${ch.file}.js').then((m) => m.${ch.exportName}),`,
    )
    .join('\n')

  return `// lessonsLazy.ts — TỆP SINH TỰ ĐỘNG, ĐỪNG SỬA TAY.
// Sinh bởi \`npm run gen:stem-lesson-index\` (scripts/gen-stem-lesson-index.ts).
// Thêm hoặc sửa bài học xong PHẢI chạy lại lệnh đó, nếu không chỉ mục lệch với nội dung thật.
import type { StemLessonSummary } from '@dhcb/core-contracts/stemLesson'
import type { ${spec.lessonType} } from './lessonTypes.js'

export const LESSON_INDEX: StemLessonSummary[] = [
${rows.join('\n')}
]

export const CHAPTER_LOADERS: Record<string, () => Promise<${spec.lessonType}[]>> = {
${loaders}
}
`
}

async function main(): Promise<void> {
  for (const spec of SUBJECTS) {
    const content = await buildSubject(spec)
    const out = resolve(spec.dir, 'lessonsLazy.ts')
    // Định dạng bằng Prettier ngay khi sinh (giống gen-lesson-index.ts) — trước đây phải nhớ chạy
    // `prettier --write` tay sau mỗi lần sinh, quên là CI job `static` đỏ (nợ ghi ở changelog 0408).
    const prettierConfig = (await prettier.resolveConfig(out)) ?? {}
    writeFileSync(out, await prettier.format(content, { ...prettierConfig, filepath: out }), 'utf8')
    const count = content.split('\n').filter((l) => l.startsWith('  { id:')).length
    console.log(`${out} — ${count} bài`)
  }
}

await main()
