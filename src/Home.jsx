import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ProjectsSection from './Projects';
import AboutSection from './About';

const codeSymbols = [
  { symbol: '</>', left: '8%',  top: '12%', dur: 5.0, delay: 0.0 },
  { symbol: '{ }', left: '82%', top: '18%', dur: 6.5, delay: 0.8 },
  { symbol: '[ ]', left: '14%', top: '72%', dur: 4.5, delay: 1.6 },
  { symbol: '()',  left: '78%', top: '65%', dur: 7.0, delay: 0.4 },
  { symbol: '=>',  left: '50%', top: '82%', dur: 5.5, delay: 2.0 },
  { symbol: '##',  left: '88%', top: '42%', dur: 6.0, delay: 1.2 },
];

const floatingDots = [
  { left: '22%', top: '20%', dur: 4.0, delay: 0.0, size: 'w-2 h-2',     color: 'bg-indigo-300/50' },
  { left: '72%', top: '28%', dur: 5.5, delay: 0.6, size: 'w-3 h-3',     color: 'bg-rose-300/40'   },
  { left: '38%', top: '76%', dur: 3.8, delay: 1.2, size: 'w-2 h-2',     color: 'bg-teal-300/50'   },
  { left: '60%', top: '15%', dur: 6.0, delay: 0.3, size: 'w-1.5 h-1.5', color: 'bg-amber-300/50'  },
  { left: '12%', top: '50%', dur: 4.8, delay: 1.8, size: 'w-2 h-2',     color: 'bg-purple-300/50' },
  { left: '85%', top: '78%', dur: 5.2, delay: 0.9, size: 'w-3 h-3',     color: 'bg-cyan-300/40'   },
  { left: '48%', top: '88%', dur: 4.2, delay: 2.4, size: 'w-1.5 h-1.5', color: 'bg-pink-300/50'   },
];

const miniSquares = [
  { left: '30%', top: '10%', dur: 8, delay: 0.5 },
  { left: '68%', top: '55%', dur: 7, delay: 2.0 },
  { left: '5%',  top: '85%', dur: 9, delay: 1.0 },
];

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <Header />

      {/* Home Section */}
      <section id="home" className="h-screen w-full snap-start flex flex-col pt-16 relative overflow-hidden" aria-label="Introduction">

        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">

          {/* Soft gradient orbs */}
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-gradient-to-br from-purple-200/40 to-indigo-200/30 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-24 -left-16 w-56 h-56 rounded-full bg-gradient-to-tr from-rose-100/40 to-orange-100/30 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 12, 0] }}
            transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute top-1/2 right-4 w-40 h-40 rounded-full bg-gradient-to-bl from-teal-100/50 to-cyan-100/30 blur-2xl"
          />

          {/* Floating code symbols */}
          {codeSymbols.map(({ symbol, left, top, dur, delay }, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -14, 0], opacity: [0.18, 0.45, 0.18], rotate: [0, 6, 0] }}
              transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
              className="absolute font-mono text-sm font-semibold text-gray-400 select-none"
              style={{ left, top }}
            >
              {symbol}
            </motion.span>
          ))}

          {/* Small floating dots */}
          {floatingDots.map(({ left, top, dur, delay, size, color }, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -16, 0], opacity: [0.4, 0.9, 0.4], scale: [1, 1.3, 1] }}
              transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
              className={`absolute rounded-full ${size} ${color}`}
              style={{ left, top }}
            />
          ))}

          {/* Drifting mini squares */}
          {miniSquares.map(({ left, top, dur, delay }, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -20, 0], rotate: [0, 45, 0], opacity: [0.12, 0.3, 0.12] }}
              transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
              className="absolute w-4 h-4 border border-gray-400/40 rounded-sm"
              style={{ left, top }}
            />
          ))}
        </div>

        <main id="main-content" className="flex-grow relative h-full flex flex-col justify-center" role="main">
          <div className="px-4 sm:px-6 lg:px-8 w-full" aria-labelledby="about-heading">
            <div className="w-[90%] sm:w-[70%] md:w-[50%] lg:w-[40%] mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="prose prose-lg">
                  <p className="text-gray-600 leading-relaxed text-left text-base sm:text-lg md:text-xl lg:text-2xl">
                    Hey there,
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6 text-left text-base sm:text-lg md:text-xl lg:text-2xl">
                    <strong>I&apos;m Prathima — a front-end developer who enjoys building clean, intuitive, and responsive web experiences.</strong>
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6 text-left text-base sm:text-lg md:text-xl lg:text-2xl">
                    I work primarily with React and love turning ideas into thoughtful interfaces that feel effortless to use.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </section>

      {/* About Me Section (Detailed) */}
      <section id="about" className="h-screen w-full snap-start pt-16 overflow-y-auto bg-gray-50/50" aria-label="About Me">
        <AboutSection />
      </section>

      {/* Projects Section */}
      <section id="projects" className="h-screen w-full snap-start pt-16 overflow-y-auto bg-white/50" aria-label="Projects">
        <ProjectsSection />
      </section>

      {/* Footer */}
      <section id="contact" className="w-full snap-start" aria-label="Contact">
        <Footer />
      </section>
    </div>
  );
};

export default Home;
