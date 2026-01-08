import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const projects = [
  {
    id: 1,
    title: "QuizBot",
    description: "An interactive AI-powered quiz application that tests knowledge across different frontend categories. Features include timed questions, instant feedback, detailed explanations for incorrect answers, and a modern, responsive UI.",
    skills: ["React", "Node.js", "Express", "OpenAI API", "Tailwind CSS", "Framer Motion"],
    link: "/chat"
  },

  {
    id: 3,
    title: "Rent vs Buy Decision Calculator",
    description: "An interactive financial planning tool that helps users evaluate the cost of renting vs buying a home over time. Features real-time calculation, visualizing break-even points, and detailed financial forecasting inputs.",
    skills: ["React", "Recharts", "Financial Modeling", "Tailwind CSS", "Framer Motion"],
    link: "/projects/rent-vs-buy"
  },
  {
    id: 4,
    title: "Commute Cost Calculator",
    description: "A tool to calculate the true cost of commuting by factoring in fuel, maintenance, transit fares, and the value of time lost. Provides monthly/yearly cost breakdowns and long-term projections.",
    skills: ["React", "Recharts", "Analytics", "Tailwind CSS"],
    link: "/projects/commute-calculator"
  },
  {
    id: 5,
    title: "Lifestyle Inflation Calculator",
    description: "Visualizes the long-term impact of 'small' recurring expenses. Calculates true inflation-adjusted cost vs opportunity cost of investing to help users make smarter spending decisions.",
    skills: ["React", "Recharts", "Financial Planning", "Tailwind CSS"],
    link: "/projects/lifestyle-inflation"
  }
];

const ProjectsSection = () => {
  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Projects
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Explore my latest work and contributions
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Portfolio projects">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full"
            role="listitem"
          >
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-4 flex-grow">{project.description}</p>
              <div className="mb-4">
                <h3 className="sr-only">Technologies used</h3>
                <div className="flex flex-wrap gap-2" role="list" aria-label="Technologies used">
                  {project.skills?.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      role="listitem"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {project.image && (
                <div className="mb-6 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                  <img
                    src={project.image}
                    alt={`${project.title} Preview`}
                    className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}

              {project.link && (
                <div className="mt-auto">
                  <Link
                    to={project.link}
                    className="inline-block w-full text-center bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    aria-label={`View ${project.title} on GitHub`}
                  >
                    View Project
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsSection;
