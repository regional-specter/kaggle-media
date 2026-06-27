import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { easeTransition, fadeUp } from '../../utils/motion'

interface PageTransitionProps {
  tabKey: string
  children: ReactNode
}

export function PageTransition({ tabKey, children }: PageTransitionProps) {
  return (
    <motion.div
      key={tabKey}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={easeTransition}
    >
      {children}
    </motion.div>
  )
}
