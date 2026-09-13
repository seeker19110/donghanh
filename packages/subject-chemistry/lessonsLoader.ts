// lessonsLoader.ts — tra cứu bài học môn Hoá học cho GIAO DIỆN, không kéo cả môn vào bundle.
//
// KHÔNG import `lessons.ts` ở đây — đó chính là điều giữ bundle nhẹ. Server, test và script
// vẫn dùng bản đồng bộ đầy đủ ở `lessons.ts` (nguồn sự thật). Cơ chế chung:
// packages/core-learner/stemLessonLoader.ts.
import { createStemLessonLoader } from '@dhcb/core-learner/stemLessonLoader'
import type { ChemLesson } from './lessonTypes.js'
import { CHAPTER_LOADERS, LESSON_INDEX } from './lessonsLazy.js'

export const CHEM_LOADER = createStemLessonLoader<ChemLesson>(LESSON_INDEX, CHAPTER_LOADERS)
export { LESSON_INDEX } from './lessonsLazy.js'
