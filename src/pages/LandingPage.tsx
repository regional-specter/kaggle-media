import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Database } from 'lucide-react'
import { Link } from 'react-router-dom'
import { staggerContainer } from '../utils/motion'
import bgElement from '../assets/bg-element.png'
import leftCards from '../assets/left-cards.png'
import rightCards from '../assets/right-cards.png'

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
}

const rotatingPhrases = [
  'weekend project',
  'research project',
  'passion project',
  'side project',
  'thesis project',
]

const MotionLink = motion(Link)

function RotatingPhrase() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingPhrases.length)
    }, 3800)
    return () => clearInterval(id)
  }, [])

  return (
    <motion.span
      layout
      transition={{ layout: { type: 'spring', stiffness: 260, damping: 30 } }}
      className="relative inline-flex h-[1.15em] items-center overflow-hidden align-bottom"
    >
      <AnimatePresence mode="popLayout">
        <motion.span
          key={rotatingPhrases[index]}
          layout
          initial={{ y: 24, opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: -24, opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block whitespace-nowrap text-[#00D06F]"
        >
          {rotatingPhrases[index]}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

export function LandingPage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-white">
      {/* background glow */}
      <img
        src={bgElement}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[260px] w-full max-w-5xl -translate-x-1/2 select-none"
      />

      {/* decorative dataset cards */}
      <img
        src={leftCards}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-0 hidden w-72 select-none sm:block md:w-80 lg:w-96"
      />
      <img
        src={rightCards}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-16 right-0 hidden w-72 select-none sm:block md:w-80 lg:w-96"
      />

      <div className="relative z-10 mx-auto flex min-h-dvh max-w-6xl flex-col px-6 py-8 lg:px-10">
        <motion.header
          className="grid grid-cols-2 items-center sm:grid-cols-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-[#00D06F]" strokeWidth={2.5} />
            <span className="text-lg font-bold text-gray-900">KaggleFlow</span>
          </div>

          <nav className="hidden items-center justify-center gap-8 text-sm font-medium text-gray-700 sm:flex">
            <a href="#" className="transition hover:text-gray-900">Home</a>
            <a href="#" className="transition hover:text-gray-900">How it works</a>
          </nav>

          <div className="flex justify-end">
            <MotionLink
              to="/app"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
              className="rounded-lg bg-[#00D06F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:brightness-95"
            >
              Get Started
            </MotionLink>
          </div>
        </motion.header>

        <motion.section
          className="mt-20 flex flex-1 flex-col items-center text-center sm:mt-28"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={fadeUp}
            className="rounded-full bg-[#0CA533]/20 px-4 py-1.5 text-md font-semibold text-[#0CA533]"
          >
            For Curious Data Builders
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            Your next <RotatingPhrase />,
            <br />
            discovered in seconds
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base font-medium text-gray-600 sm:text-lg"
          >
            Whether you're commuting, traveling, or just scrolling, KaggleFlow
            makes it effortless to discover, evaluate, and bookmark fascinating
            Kaggle datasets for your next build
          </motion.p>

          <motion.div variants={fadeUp} className="mt-9">
            <MotionLink
              to="/app"
              whileHover={{ scale: 1.035, boxShadow: '0 12px 28px rgba(0,0,0,0.22)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className="btn-cta inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-medium text-white shadow-lg"
            >
              Try KaggleFlow, its free
              <ArrowRight className="h-4 w-4" />
            </MotionLink>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}