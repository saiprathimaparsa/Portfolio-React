
import React from 'react';
import { motion } from 'framer-motion';

const skills = [
    "React", "Next.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS",
    "Accessibility (WCAG)", "Semantic HTML", "RESTful APIs", "Contentful",
    "Jest", "React Testing Library", "Git", "CI/CD", "Agile/Scrum", "Generative AI"
];

const AboutSection = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
            <div className="flex flex-col gap-12">
                {/* Top Row: About & Skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* About Me (Left) */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">About Me</h2>
                        <div className="prose prose-lg">
                            <p className="text-gray-600 leading-relaxed text-lg">
                                I build accessible, component-driven front-end systems with a focus on clarity and scale. I’m currently exploring responsible ways to integrate Generative AI into web workflows.
                            </p>
                        </div>
                    </motion.div>

                    {/* Skills (Right) */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col justify-center h-full"
                    >
                        <h3 className="text-xl font-semibold text-gray-900 mb-6">Skills & Technologies</h3>
                        <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-full text-sm font-medium shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-default"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
