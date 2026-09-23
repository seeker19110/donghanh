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

function Shape({ shape }: { shape: AnimationShape }) {
  const stroke = color(shape.stroke, 'none')
  // Opacity TĨNH của hình nằm trên thẻ con, opacity ĐỘNG (keyframes) chạy trên <g> cha — hai
  // giá trị NHÂN với nhau. 159/238 hoạt ảnh (rà 2026-09-22) viết `opacity: 0` tĩnh + keyframes
  // nâng lên 1 với ý "keyframe quyết định lúc hiện" → nếu giữ opacity tĩnh thì hình vô hình vĩnh
  // viễn (0 × bất kỳ = 0). Vì thế: hình có keyframe điều khiển opacity thì keyframe là nguồn sự
  // thật, bỏ opacity tĩnh; hình chỉ có keyframe vị trí (dx/dy…) vẫn giữ opacity tĩnh làm nền.
  const keyframeDieuKhienOpacity = shape.keyframes?.some((k) => k.opacity !== undefined) ?? false
  const common = {
    stroke,
    strokeWidth: shape.strokeWidth,
    strokeDasharray: shape.dash,
    opacity: keyframeDieuKhienOpacity ? undefined : shape.opacity,
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
          stroke="rgb(var(--surface-card))"
          strokeWidth={3}
          strokeDasharray="none"
          paintOrder="stroke fill"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
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
        {/* Nhãn vẽ sau hình để halo đục không bị đường/hình chuyển động che chữ. */}
        {[
          ...spec.shapes.filter((shape) => shape.kind !== 'label'),
          ...spec.shapes.filter((shape) => shape.kind === 'label'),
        ].map((shape) => {
          const animName = animNames.get(shape.id)
          // `animation-name` PHẢI nằm trên CHÍNH thẻ <g> mang data-animated, vì duration /
          // iteration / play-state được gán cho <g> qua CSS ở trên và CSS animation KHÔNG kế
          // thừa xuống con. Bẫy đã mắc thật (2026-09-22, docs/changelog/0407-*.md): trước đây
          // tên nằm ở hình con → hình con có tên nhưng duration 0s, <g> có duration nhưng không
          // tên → KHÔNG hoạt ảnh nào từng chạy ở cả 4 môn STEM lẫn Lập trình, mà mọi cổng (Zod,
          // snapshot HTML, ảnh chụp cảnh đầu) vẫn xanh vì cảnh đầu vốn đúng.
          return (
            <g
              key={shape.id}
              data-animated={animName ? 'true' : undefined}
              style={animName ? { animationName: animName } : undefined}
            >
              <Shape shape={shape} />
            </g>
          )
        })}
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
