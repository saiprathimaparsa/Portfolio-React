import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogThumbnail from './BlogThumbnail';
import { posts } from './posts';

const BlogList = () => {
  const sortedPosts = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8" role="main">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-sm sm:text-base tracking-[0.2em] text-gray-400 uppercase mb-4">
              Prathima Parsa · Engineering Journal
            </p>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-white mb-4">Learning in Public</h1>
            <p className="text-xl text-gray-400 mb-4">
              Building, debugging, questioning, and sharing what I learn along the way.
            </p>
          </motion.div>

          <div className="border-t border-neutral-800">
            {sortedPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-neutral-800 py-8"
              >
                <Link
                  to={`/blog/${post.slug}`}
                  className="flex flex-col sm:flex-row gap-6 group"
                  aria-label={post.title}
                >
                  <BlogThumbnail icon={post.icon} gradient={post.gradient} />
                  <div>
                    <p className="text-sm tracking-[0.18em] text-gray-400 uppercase mb-2">
                      {post.category}
                    </p>
                    <h2 className="text-2xl sm:text-[1.7rem] font-bold text-white leading-snug mb-2 group-hover:text-indigo-300 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-lg text-gray-300 leading-relaxed">{post.excerpt}</p>
                    <p className="text-sm text-gray-500 mt-3">{post.dateLabel}</p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          <p className="text-gray-500 mt-8">One small note a day — more coming as I learn.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;
