import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Footer from './components/Footer';
import ProjectsSection from './Projects';
import ContactSection from './Contact/Contact';
import AboutSection from './About';
import profileImage from './assets/pic.png';

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-gray-100">
      <Header />

      {/* Home Section */}
      <section id="home" className="h-screen w-full snap-start flex flex-col pt-16 relative" aria-label="Introduction">
        <main id="main-content" className="flex-grow relative h-full flex flex-col justify-center" role="main">
          {/* About Section (Intro) */}
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
                    <strong>I’m Prathima — a front-end developer who enjoys building clean, intuitive, and responsive web experiences.</strong>
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

      {/* Contact Section */}
      <section id="contact" className="h-screen w-full snap-start pt-16 flex flex-col justify-between bg-gray-50/50" aria-label="Contact">
        <div className="flex-grow flex flex-col justify-center">
          <ContactSection />
        </div>
        <Footer />
      </section>
    </div>
  );
};

export default Home; 