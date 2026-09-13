// packages/core-ui/LessonAnimation.tsx — Trình vẽ hoạt ảnh minh hoạ bài học, dùng chung
// cho cả 4 môn STEM (Toán · Lí · Hoá · Sinh).
//
// Nhận vào ĐẶC TẢ KHAI BÁO (`LessonAnimation` của @dhcb/core-contracts/lessonAnimation), không
// nhận HTML/SVG tự do — lý do ở đầu file hợp đồng đó. Ba việc file này lo thay cho mọi môn:
//   1. Ánh xạ vai trò màu → token `--a-*` / `--text-*` / `--anim-*`, để đúng ở cả 5 theme.
//   2. Tôn trọng `prefers-reduced-motion`: dừng hẳn hoạt ảnh, hiện cảnh ở mốc 0.
//   3. Luôn kèm mô tả bằng lời + nút phát/dừng — hoạt ảnh không được là kênh thông tin duy nhất.
import { useId, useMemo, useState } from 'react'
import type {
  AnimationColorRole,
  AnimationKeyframe,
  AnimationShape,
  LessonAnimation as LessonAnimationSpec,
} from '@dhcb/core-contracts/lessonAnimation'

/** Vai trò màu → giá trị CSS. Giữ ở một chỗ để đổi token là đổi toàn bộ hoạt ảnh mọi môn. */
const COLOR_BY_ROLE: Record<AnimationColorRole, string> = {
  primary: 'rgb(var(--a-600))',
  accent: 'rgb(var(--a-400))',
  correct: 'rgb(var(--anim-correct))',
  warn: 'rgb(var(--anim-warn))',
  danger: 'rgb(var(--anim-danger))',
  neutral: 'rgb(var(--text-primary))',
  muted: 'rgb(var(--text-muted))',
  surface: 'rgb(var(--surface-card))',
}

function color(role: AnimationColorRole | undefined, fallback: string): string {
  return role ? COLOR_BY_ROLE[role] : fallback
}

/** Tâm hình — mọi phép xoay/phóng đều quanh tâm để hoạt ảnh không "trôi" khỏi vị trí. */
function centerOf(shape: AnimationShape): { cx: number; cy: number } {
  switch (shape.kind) {
    case 'circle':
      return { cx: shape.cx, cy: shape.cy }
    case 'rect':
      return { cx: shape.x + shape.w / 2, cy: shape.y + shape.h / 2 }
    case 'line':
    case 'arrow':
      return { cx: (shape.x1 + shape.x2) / 2, cy: (shape.y1 + shape.y2) / 2 }
    case 'polyline': {
      const xs = shape.points.map((p) => p[0])
      const ys = shape.points.map((p) => p[1])
      return {
        cx: (Math.min(...xs) + Math.max(...xs)) / 2,
        cy: (Math.min(...ys) + Math.max(...ys)) / 2,
      }
    }
    case 'label':
      return { cx: shape.x, cy: shape.y }
  }
}

/** Dựng @keyframes CSS từ danh sách mốc thời gian. Chỉ sinh transform + opacity —
 *  hai thuộc tính trình duyệt chạy được trên luồng hợp thành, không gây reflow. */
function keyframesCss(
  name: string,
  frames: AnimationKeyframe[],
  durationMs: number,
  center: { cx: number; cy: number },
): string {
  const sorted = [...frames].sort((a, b) => a.atMs - b.atMs)
  const steps = sorted.map((f) => {
    const pct = durationMs === 0 ? 0 : (f.atMs / durationMs) * 100
    const parts = [`translate(${f.dx ?? 0}px, ${f.dy ?? 0}px)`]
    if (f.rotate !== undefined) parts.push(`rotate(${f.rotate}deg)`)
    if (f.scale !== undefined) parts.push(`scale(${f.scale})`)
    const opacity = f.opacity === undefined ? '' : ` opacity: ${f.opacity};`
    return `  ${pct.toFixed(3)}% { transform-origin: ${center.cx}px ${center.cy}px; transform: ${parts.join(' ')};${opacity} }`
  })
  return `@keyframes ${name} {\n${steps.join('\n')}\n}`
}

function Shape({ shape, animName }: { shape: AnimationShape; animName?: string }) {
  const style = animName ? { animationName: animName } : undefined
  const stroke = color(shape.stroke, 'none')
  const common = {
    style,
    stroke,
    strokeWidth: shape.strokeWidth,
    strokeDasharray: shape.dash,
    opacity: shape.opacity,
  }

  switch (shape.kind) {
    case 'circle':
      return (
        <circle
          {...common}
          cx={shape.cx}
          cy={shape.cy}
          r={shape.r}
          fill={color(shape.fill, 'none')}
        />
      )
    case 'rect':
      return (
        <rect
          {...common}
          x={shape.x}
          y={shape.y}
          width={shape.w}
          height={shape.h}
          rx={shape.rx}
          fill={color(shape.fill, 'none')}
        />
      )
    case 'line':
      return <line {...common} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} />
    case 'arrow':
      return (
        <line
          {...common}
          x1={shape.x1}
          y1={shape.y1}
          x2={shape.x2}
          y2={shape.y2}
          markerEnd={`url(#dhcb-arrowhead-${shape.stroke ?? 'neutral'})`}
        />
      )
    case 'polyline':
      return (
        <polyline
          {...common}
          points={shape.points.map((p) => `${p[0]},${p[1]}`).join(' ')}
          fill={shape.closed ? color(shape.fill, 'none') : 'none'}
        />
      )
    case 'label':
      return (
        <text
          {...common}
          x={shape.x}
          y={shape.y}
          fontSize={shape.size ?? 14}
          textAnchor={shape.anchor ?? 'start'}
          fill={color(shape.fill, 'rgb(var(--text-primary))')}
        >
          {shape.text}
        </text>
      )
  }
}

export interface LessonAnimationProps {
  spec: LessonAnimationSpec
  className?: string
}

export function LessonAnimation({ spec, className }: LessonAnimationProps) {
  const rawId = useId()
  // useId sinh chuỗi có dấu ':' — không hợp lệ trong tên @keyframes và id của SVG.
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const [playing, setPlaying] = useState(true)

  const { css, animNames } = useMemo(() => {
    const names = new Map<string, string>()
    const blocks: string[] = []
    for (const shape of spec.shapes) {
      if (!shape.keyframes || shape.keyframes.length === 0) continue
      const name = `dhcbAnim${uid}${shape.id.replace(/[^a-zA-Z0-9]/g, '')}`
      names.set(shape.id, name)
      blocks.push(keyframesCss(name, shape.keyframes, spec.durationMs, centerOf(shape)))
    }
    return { css: blocks.join('\n'), animNames: names }
  }, [spec, uid])

  // Các vai trò màu thật sự có mũi tên — chỉ sinh marker cần dùng.
  const arrowRoles = useMemo(
    () =>
      Array.from(
        new Set(spec.shapes.filter((s) => s.kind === 'arrow').map((s) => s.stroke ?? 'neutral')),
      ),
    [spec],
  )

  const descriptionId = `dhcb-anim-desc-${uid}`

  return (
    <figure className={className}>
      <style>{`
${css}
.dhcb-anim-${uid} [data-animated='true'] {
  animation-duration: ${spec.durationMs}ms;
  animation-timing-function: linear;
  animation-iteration-count: ${spec.loop ? 'infinite' : '1'};
  animation-fill-mode: both;
  animation-play-state: ${playing ? 'running' : 'paused'};
}
/* Người dùng bật "giảm chuyển động" của hệ điều hành: giữ nguyên cảnh đầu, không chạy.
   Nội dung không mất đi — mô tả bằng lời luôn hiển thị bên dưới. */
@media (prefers-reduced-motion: reduce) {
  .dhcb-anim-${uid} [data-animated='true'] { animation: none !important; }
}
      `}</style>

      <svg
        className={`dhcb-anim-${uid} w-full h-auto`}
        viewBox={`0 0 ${spec.viewBoxWidth} ${spec.viewBoxHeight}`}
        role="img"
        aria-describedby={descriptionId}
        aria-label={spec.title}
      >
        <defs>
          {arrowRoles.map((role) => (
            <marker
              key={role}
              id={`dhcb-arrowhead-${role}`}
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={COLOR_BY_ROLE[role]} />
            </marker>
          ))}
        </defs>
        {spec.shapes.map((shape) => (
          <g key={shape.id} data-animated={animNames.has(shape.id) ? 'true' : undefined}>
            <Shape shape={shape} animName={animNames.get(shape.id)} />
          </g>
        ))}
      </svg>

      <figcaption className="mt-2 space-y-2">
        <p className="font-medium text-content">{spec.title}</p>
        <p id={descriptionId} className="text-content-secondary">
          {spec.description}
        </p>
        {spec.captions && spec.captions.length > 0 && (
          <ol className="list-decimal pl-5 text-content-secondary">
            {spec.captions.map((c) => (
              <li key={c.atMs}>{c.text}</li>
            ))}
          </ol>
        )}
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="min-h-[44px] rounded-lg border border-line-strong px-4 text-content"
        >
          {playing ? 'Tạm dừng hoạt ảnh' : 'Chạy hoạt ảnh'}
        </button>
      </figcaption>
    </figure>
  )
}
