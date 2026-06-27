import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

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
  const [ready, setReady] = useState(false)
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

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80)
    return () => window.clearTimeout(timer)
  }, [points])

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`h-10 w-[100px] sm:h-12 sm:w-[120px] ${className}`}
      aria-hidden
    >
      <motion.path
        d={areaPath}
        fill={fill}
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: ready ? 1 : 0, opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}
