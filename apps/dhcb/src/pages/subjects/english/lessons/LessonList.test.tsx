// LessonList — số lượt trên thẻ phải cùng cách đếm với trang bài (2026-09-25).
// Trước đây thẻ ghi `turnCount / 2` ("10 lượt thoại") trong khi trang bài đếm "Lượt 20" và link
// `#luot-20` tồn tại — người học thấy hai con số cho cùng một bài.
import { describe, it, expect, afterEach } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { LessonList } from './LessonList'
import type { LessonMeta } from '../../../../data/lessons/loader'

;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const BAI: LessonMeta = {
  id: 1,
  title: 'Giới thiệu bản thân',
  situation: 'Gặp bạn mới',
  turnCount: 20,
  speakerAGender: null,
  speakerBGender: null,
  chunk: 0,
  idx: 0,
}

let root: Root | null = null
let host: HTMLDivElement | null = null
afterEach(() => {
  act(() => root?.unmount())
  host?.remove()
})

function hien(isA: boolean) {
  host = document.createElement('div')
  document.body.appendChild(host)
  root = createRoot(host)
  act(() => root!.render(<LessonList lessons={[BAI]} isA={isA} query="" onSelect={() => {}} />))
  return host.textContent ?? ''
}

describe('LessonList — số lượt thoại', () => {
  it('chiều A: ghi đúng turnCount, không chia đôi', () => {
    const text = hien(true)
    expect(text).toContain('20 lượt thoại')
    expect(text).not.toContain('10 lượt thoại')
  })

  it('chiều B: "turns", cùng con số', () => {
    expect(hien(false)).toContain('20 turns')
  })
})
