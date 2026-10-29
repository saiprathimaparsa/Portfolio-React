import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ProjectsSection from './Projects';
import AboutSection from './About';
import { FaReact, FaGitAlt, FaJava, FaAws } from 'react-icons/fa';
import { SiNextdotjs, SiGrafana, SiOpenapiinitiative } from 'react-icons/si';
import { VscAzure } from 'react-icons/vsc';
import { SparklesIcon } from '@heroicons/react/24/outline';

const techChips = [
  { label: 'React',         Icon: FaReact,             color: '#087ea4', left: '6%',  top: '14%', dur: 5.0, delay: 0.0, mobile: true  },
  { label: 'Next.js',       Icon: SiNextdotjs,         color: '#000000', left: '84%', top: '12%', dur: 6.5, delay: 0.8, mobile: true  },
  { label: 'Git',           Icon: FaGitAlt,            color: '#f05033', left: '12%', top: '64%', dur: 4.5, delay: 1.6, mobile: false },
  { label: 'Java',          Icon: FaJava,              color: '#e76f00', left: '87%', top: '58%', dur: 7.0, delay: 0.4, mobile: false },
  { label: 'REST APIs',     Icon: SiOpenapiinitiative, color: '#6ba539', left: '4%',  top: '40%', dur: 5.5, delay: 2.0, mobile: false },
  { label: 'Gen AI',        Icon: SparklesIcon,        color: '#7c3aed', left: '89%', top: '34%', dur: 6.0, delay: 1.2, mobile: true  },
  { label: 'AWS',           Icon: FaAws,               color: '#ff9900', left: '16%', top: '86%', dur: 5.2, delay: 0.9, mobile: false },
  { label: 'Azure',         Icon: VscAzure,            color: '#0078d4', left: '72%', top: '85%', dur: 4.2, delay: 2.4, mobile: false },
  { label: 'Observability', Icon: SiGrafana,           color: '#f46800', left: '56%', top: '7%',  dur: 6.8, delay: 0.6, mobile: false },
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

          {/* Floating technology logos */}
          {techChips.map(({ label, Icon, color, left, top, dur, delay, mobile }) => (
            <motion.div
              key={label}
              animate={{ y: [0, -12, 0], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
              className={`absolute ${mobile ? 'flex' : 'hidden md:flex'} items-center gap-1.5 rounded-full bg-white border border-gray-200 shadow-md px-3 py-1.5 select-none`}
              style={{ left, top }}
            >
              <Icon style={{ color }} className="text-xl shrink-0" />
              <span className="text-xs font-semibold text-gray-800 whitespace-nowrap">{label}</span>
            </motion.div>
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
                    <strong>I&apos;m Prathima — I build clean, accessible websites with React, and I&apos;ve worked across the full stack, so I can take a feature from idea to interface to data.</strong>
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6 text-left text-base sm:text-lg md:text-xl lg:text-2xl">
                    Lately I&apos;m into AI and agentic workflows, and I bring the soft skills too: planning, keeping a team moving, and clearing blockers. I&apos;m working toward becoming a product engineer, and building great websites is my thing.
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
