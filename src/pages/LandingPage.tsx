import { motion } from 'framer-motion'
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
            <Link
              to="/app"
              className="rounded-lg bg-[#00D06F] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 active:scale-[0.98]"
            >
              Get Started
            </Link>
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
            className="rounded-full bg-[#0CA533]/20 px-4 py-1.5 text-xs font-semibold text-[#0CA533]"
          >
            For Curious Data Builders
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
          >
            Your next weekend project,
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
            <Link
              to="/app"
              className="btn-cta inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-medium text-white shadow-lg transition active:scale-[0.98]"
            >
              Try KaggleFlow, its free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}