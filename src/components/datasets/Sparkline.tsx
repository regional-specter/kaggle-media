interface SparklineProps {
  points: number[]
  className?: string
  positive?: boolean
}

export function Sparkline({
  points,
  className = '',
  positive = true,
}: SparklineProps) {
  const width = 120
  const height = 48
  const padding = 4

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const path = points
    .map((point, index) => {
      const x =
        padding + (index / (points.length - 1)) * (width - padding * 2)
      const y =
        height -
        padding -
        ((point - min) / range) * (height - padding * 2)
      return `${index === 0 ? 'M' : 'L'}${x},${y}`
    })
    .join(' ')

  const stroke = positive ? '#059669' : '#dc2626'
  const fill = positive ? 'rgba(5, 150, 105, 0.08)' : 'rgba(220, 38, 38, 0.08)'

  const areaPath = `${path} L${width - padding},${height - padding} L${padding},${height - padding} Z`

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`h-12 w-[120px] ${className}`}
      aria-hidden
    >
      <path d={areaPath} fill={fill} />
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
