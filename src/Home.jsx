import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ProjectsSection from './Projects';
import AboutSection from './About';
import { FaReact, FaGitAlt, FaJava, FaAws, FaSalesforce, FaHtml5 } from 'react-icons/fa';
import {
  SiNextdotjs, SiGrafana, SiOpenapiinitiative, SiTypescript, SiJavascript, SiAngular,
  SiNodedotjs, SiExpress, SiDotnet, SiPython, SiContentful, SiGraphql, SiTailwindcss,
  SiSass, SiMui, SiCss, SiJest, SiJenkins, SiGithubactions, SiBitbucket, SiJira,
  SiCursor, SiGithubcopilot, SiAnthropic,
} from 'react-icons/si';
import { VscAzure } from 'react-icons/vsc';
import { SparklesIcon } from '@heroicons/react/24/outline';

// Logos only — the full stack from Prathima's resume, drifting faintly across the hero.
const techLogos = [
  { label: 'React',            Icon: FaReact,             color: '#087ea4', left: '4%',  top: '9%',  size: 'text-4xl', dur: 6.0, delay: 0.0 },
  { label: 'TypeScript',       Icon: SiTypescript,        color: '#3178c6', left: '24%', top: '6%',  size: 'text-3xl', dur: 7.0, delay: 0.7 },
  { label: 'Salesforce',       Icon: FaSalesforce,        color: '#00a1e0', left: '45%', top: '10%', size: 'text-4xl', dur: 5.5, delay: 1.4 },
  { label: 'AWS',              Icon: FaAws,               color: '#ff9900', left: '66%', top: '7%',  size: 'text-4xl', dur: 6.5, delay: 0.3 },
  { label: 'Next.js',          Icon: SiNextdotjs,         color: '#111111', left: '86%', top: '9%',  size: 'text-4xl', dur: 5.8, delay: 1.0 },
  { label: 'JavaScript',       Icon: SiJavascript,        color: '#c7a008', left: '12%', top: '27%', size: 'text-3xl', dur: 6.2, delay: 1.8 },
  { label: 'Contentful',       Icon: SiContentful,        color: '#2478cc', left: '33%', top: '25%', size: 'text-3xl', dur: 7.4, delay: 0.5 },
  { label: 'Gen AI',           Icon: SparklesIcon,        color: '#7c3aed', left: '55%', top: '28%', size: 'text-4xl', dur: 5.2, delay: 2.1 },
  { label: 'Node.js',          Icon: SiNodedotjs,         color: '#339933', left: '76%', top: '26%', size: 'text-4xl', dur: 6.8, delay: 1.2 },
  { label: 'Git',              Icon: FaGitAlt,            color: '#f05033', left: '93%', top: '30%', size: 'text-3xl', dur: 5.6, delay: 0.9 },
  { label: 'Angular',          Icon: SiAngular,           color: '#dd1b16', left: '3%',  top: '45%', size: 'text-4xl', dur: 7.2, delay: 0.2 },
  { label: 'GraphQL',          Icon: SiGraphql,           color: '#e10098', left: '22%', top: '47%', size: 'text-3xl', dur: 6.4, delay: 1.6 },
  { label: 'Java',             Icon: FaJava,              color: '#e76f00', left: '43%', top: '44%', size: 'text-4xl', dur: 5.9, delay: 0.8 },
  { label: 'GitHub Copilot',   Icon: SiGithubcopilot,     color: '#24292f', left: '63%', top: '46%', size: 'text-3xl', dur: 7.1, delay: 2.4 },
  { label: 'REST APIs',        Icon: SiOpenapiinitiative, color: '#6ba539', left: '83%', top: '45%', size: 'text-3xl', dur: 6.1, delay: 0.4 },
  { label: 'Tailwind CSS',     Icon: SiTailwindcss,       color: '#06b6d4', left: '10%', top: '63%', size: 'text-4xl', dur: 5.4, delay: 1.1 },
  { label: 'Python',           Icon: SiPython,            color: '#3776ab', left: '31%', top: '65%', size: 'text-3xl', dur: 6.9, delay: 0.6 },
  { label: '.NET',             Icon: SiDotnet,            color: '#512bd4', left: '52%', top: '62%', size: 'text-4xl', dur: 7.3, delay: 1.9 },
  { label: 'Azure',            Icon: VscAzure,            color: '#0078d4', left: '72%', top: '64%', size: 'text-3xl', dur: 5.7, delay: 0.1 },
  { label: 'Observability',    Icon: SiGrafana,           color: '#f46800', left: '90%', top: '62%', size: 'text-3xl', dur: 6.6, delay: 1.5 },
  { label: 'HTML5',            Icon: FaHtml5,             color: '#e34f26', left: '6%',  top: '82%', size: 'text-3xl', dur: 6.3, delay: 2.2 },
  { label: 'Jest',             Icon: SiJest,              color: '#c21325', left: '26%', top: '84%', size: 'text-3xl', dur: 5.3, delay: 0.0 },
  { label: 'Cursor',           Icon: SiCursor,            color: '#111111', left: '47%', top: '81%', size: 'text-3xl', dur: 7.0, delay: 1.3 },
  { label: 'Jenkins',          Icon: SiJenkins,           color: '#d24939', left: '67%', top: '83%', size: 'text-3xl', dur: 6.0, delay: 0.7 },
  { label: 'Jira',             Icon: SiJira,              color: '#0052cc', left: '86%', top: '81%', size: 'text-3xl', dur: 5.5, delay: 1.7 },
  { label: 'Sass',             Icon: SiSass,              color: '#cc6699', left: '16%', top: '93%', size: 'text-2xl', dur: 6.7, delay: 0.9 },
  { label: 'Material UI',      Icon: SiMui,               color: '#007fff', left: '37%', top: '94%', size: 'text-2xl', dur: 5.9, delay: 2.0 },
  { label: 'CSS',              Icon: SiCss,               color: '#663399', left: '57%', top: '93%', size: 'text-2xl', dur: 7.5, delay: 0.4 },
  { label: 'GitHub Actions',   Icon: SiGithubactions,     color: '#2088ff', left: '77%', top: '94%', size: 'text-2xl', dur: 6.2, delay: 1.0 },
  { label: 'Bitbucket',        Icon: SiBitbucket,         color: '#0052cc', left: '93%', top: '92%', size: 'text-2xl', dur: 5.6, delay: 1.5 },
  { label: 'Anthropic',        Icon: SiAnthropic,         color: '#d97757', left: '50%', top: '16%', size: 'text-2xl', dur: 6.4, delay: 2.6 },
  { label: 'Express',          Icon: SiExpress,           color: '#222222', left: '68%', top: '17%', size: 'text-2xl', dur: 7.2, delay: 0.2 },
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

          {/* Floating technology logos — faint, logos only, across the whole hero */}
          {techLogos.map(({ label, Icon, color, left, top, size, dur, delay }) => (
            <motion.span
              key={label}
              title={label}
              animate={{ y: [0, -10, 0], opacity: [0.32, 0.52, 0.32], rotate: [0, 3, 0] }}
              transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
              className={`absolute ${size} select-none`}
              style={{ left, top, color }}
            >
              <Icon />
            </motion.span>
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
