import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import ChittiAvatar from '../components/ChittiAvatar'
import RippleButton from '../components/RippleButton'
import { useMotion } from '../context/MotionContext'

const LandingPage = () => {
  const navigate = useNavigate()
  const { reducedMotion, toggleReducedMotion } = useMotion()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -200])
  const identityY = useTransform(scrollYProgress, [0, 1], [0, -100])
  const competitionY = useTransform(scrollYProgress, [0, 1], [0, -50])

  return (
    <div ref={containerRef} className="relative">
      {/* Hero Section */}
      <motion.section 
        style={{ y: heroY }}
        className="min-h-screen flex flex-col items-center justify-center relative px-8"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
          className="mb-8"
        >
          <ChittiAvatar size="large" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            className="text-7xl md:text-8xl font-black mb-6 leading-none"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6, #8b5cf6)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            animate={!reducedMotion ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            THINK
            <br />
            <span className="text-6xl md:text-7xl">FAST</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-2xl md:text-3xl text-blue-200 font-light tracking-wide"
          >
            CODE FASTER
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="absolute bottom-12 animate-bounce"
        >
          <div className="w-6 h-10 border-2 border-purple-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-purple-400 rounded-full mt-2 animate-pulse" />
          </div>
        </motion.div>
      </motion.section>

      {/* Identity Reveal Section */}
      <motion.section 
        style={{ y: identityY }}
        className="min-h-screen flex items-center justify-center px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-4xl text-center"
        >
          <motion.h2
            className="text-5xl md:text-6xl font-bold mb-8 text-white"
            whileInView={{ 
              textShadow: [
                "0 0 0px #8b5cf6",
                "0 0 20px #8b5cf6",
                "0 0 0px #8b5cf6"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            We Are The Student Developers Cell (SDC)
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl md:text-2xl text-blue-100 leading-relaxed mb-8"
          >
            The Student Developers Cell (SDC) is a student-driven tech community built on curiosity, creativity, and collaboration. We bridge the gap between theory and real-world application - turning ideas into innovation through hackathons, coding sprints, workshops, and live projects.


Our initiatives connect students with industry leaders, alumni innovators, and like-minded peers, creating a network where knowledge meets opportunity. We're not just preparing developers for the future - we're building the next generation of tech leaders ready to code, create, and lead change.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-6 text-lg"
          >
            
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Competition Section */}
      <motion.section 
        style={{ y: competitionY }}
        className="min-h-screen flex items-center justify-center px-8 py-20"
      >
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-5xl"
        >
          <motion.h2
            className="text-6xl md:text-7xl font-black mb-12"
            style={{
              background: 'linear-gradient(45deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)',
              backgroundSize: '300% 300%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
            animate={!reducedMotion ? {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            Let's Begin
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, staggerChildren: 0.2 }}
          >
            
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <RippleButton
              onClick={() => navigate('/dashboard')}
              className="px-12 py-6 text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 
                        hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl
                        shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40
                        transform hover:scale-105 transition-all duration-300
                        border border-purple-400/50 hover:border-purple-400/80"
            >
              ENTER THE ARENA
            </RippleButton>

            <motion.p
              className="text-purple-300 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              No registration • Jump straight into battle
            </motion.p>

            <motion.div
              className="flex items-center justify-center gap-4 mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <label className="flex items-center gap-2 text-purple-300 cursor-pointer hover:text-purple-200 transition-colors">
                <input
                  type="checkbox"
                  checked={reducedMotion}
                  onChange={toggleReducedMotion}
                  className="w-4 h-4 accent-purple-500"
                />
                <span>Reduce Motion</span>
              </label>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  )
}

export default LandingPage
