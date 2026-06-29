import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Database } from 'lucide-react'
import { Link } from 'react-router-dom'
import { staggerContainer } from '../utils/motion'
import bgElement from '../assets/bg-element.png'
import leftCards from '../assets/left-cards.png'
import rightCards from '../assets/right-cards.png'
import mobilePreview from '../assets/mobile-preview.png'
import footerElement from '../assets/footer-element.png'

const steps = [
  {
    num: '1',
    title: 'Scroll Anywhere',
    desc: 'Outside on a trip or relaxing? Browse a premium, distraction-free feed of trending Kaggle datasets',
  },
  {
    num: '2',
    title: 'Bookmark Instantly',
    desc: 'Spot a unique dataset or a niche financial index? Save it to your dashboard with a single click',
  },
  {
    num: '3',
    title: 'Build Later',
    desc: "When you're back at your desk ready for a weekend project, open your bookmarks and jump straight to the data",
  },
]

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
    <div className="relative overflow-x-hidden bg-white">
      {/* hero zone — owns its own decorative layer so absolute images
          stay scoped to the hero's bottom, not the whole page's bottom */}
      <div className="relative overflow-hidden md:min-h-dvh">
        <img
          src={bgElement}
          alt=""
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 select-none sm:max-w-4xl lg:max-w-5xl"
        />
        <img
          src={leftCards}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-10 left-0 hidden w-64 select-none lg:bottom-16 lg:block lg:w-72 xl:w-80 2xl:w-96"
        />
        <img
          src={rightCards}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-10 right-0 hidden w-64 select-none lg:bottom-16 lg:block lg:w-72 xl:w-80 2xl:w-96"
        />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-4 py-5 sm:px-6 sm:py-8 md:min-h-dvh lg:px-10">
          <motion.header
            className="grid shrink-0 grid-cols-2 items-center sm:grid-cols-3"
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
                className="rounded-lg bg-[#00D06F] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:brightness-95 sm:px-5 sm:py-2.5"
              >
                Get Started
              </MotionLink>
            </div>
          </motion.header>

          <motion.section
            className="flex flex-col items-center pt-8 pb-10 text-center sm:pt-10 sm:pb-12 md:flex-1 md:justify-center md:py-0"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={fadeUp}
              className="rounded-full bg-[#0CA533]/20 px-4 py-1.5 text-xs font-semibold text-[#0CA533] sm:px-5 sm:py-2 sm:text-sm"
            >
              For Curious Data Builders
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mt-5 max-w-3xl px-1 text-[1.75rem] font-semibold leading-tight tracking-tight text-gray-900 sm:mt-6 sm:px-0 sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Your next <RotatingPhrase />,
              <br />
              discovered in seconds
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-5 max-w-xl px-2 text-sm font-medium text-gray-600 sm:mt-6 sm:px-0 sm:text-base md:text-lg"
            >
              Whether you're commuting, traveling, or just scrolling, KaggleFlow
              makes it effortless to discover, evaluate, and bookmark fascinating
              Kaggle datasets for your next build
            </motion.p>

            <motion.div variants={fadeUp} className="mt-7 sm:mt-9">
              <MotionLink
                to="/app"
                whileHover={{ scale: 1.035, boxShadow: '0 12px 28px rgba(0,0,0,0.22)' }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                className="btn-cta inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white shadow-lg sm:px-7 sm:py-3.5"
              >
                Try KaggleFlow, its free
                <ArrowRight className="h-4 w-4" />
              </MotionLink>
            </motion.div>
          </motion.section>
        </div>
      </div>

      {/* how it works — separate stacking context, sits cleanly below the hero */}
      <div className="relative z-10 mx-auto max-w-6xl px-4 pb-8 sm:px-6 md:pb-10 lg:px-10">
        <motion.section
          className="grid grid-cols-1 items-center gap-6 md:gap-8 md:pt-2 lg:grid-cols-[1fr_1.1fr] lg:gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={fadeUp} className="hidden justify-center md:flex">
            <img
              src={mobilePreview}
              alt="KaggleFlow discover feed shown on a mobile screen"
              className="h-auto w-full max-w-[220px] select-none sm:max-w-[280px] md:max-w-[340px] lg:max-w-[400px] xl:max-w-[480px]"
            />
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col items-center gap-6 text-left sm:gap-7 md:gap-8 lg:items-start lg:gap-9 lg:text-left">
            {steps.map((step) => (
              <div key={step.num} className="max-w-md">
                <h3 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
                  {step.num}. {step.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-gray-600 sm:text-base">
                  {step.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.section>
      </div>

      {/* footer */}
      <footer className="relative bg-white pt-8">
        <img
          src={footerElement}
          alt=""
          aria-hidden
          className="pointer-events-none absolute bottom-0 right-0 hidden w-[440px] shrink-0 select-none md:block md:w-[520px] lg:w-[600px] xl:w-[450px]"
        />

        <div className="relative z-10 max-w-sm px-6 pb-8 lg:px-10">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-[#00D06F]" strokeWidth={2.5} />
            <span className="text-lg font-bold text-gray-900">KaggleFlow</span>
          </div>
          <p className="mt-4 w-[750px] max-w-full text-sm font-medium leading-relaxed text-gray-600">
            KaggleFlow is a streamlined discovery tool built for curious data scientists and weekend builders. We turn Kaggle's massive data repository into a fluid, metrics-first scrolling feed. Whether you're on a trip or just seeking project inspiration, KaggleFlow makes it effortless to browse on the go, bookmark cool datasets instantly, and jump straight into building whenever you're ready
          </p>
        </div>
      </footer>
    </div>
  )
}