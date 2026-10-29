import React from 'react';
import { motion } from 'framer-motion';
import { Link, Navigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogThumbnail from './BlogThumbnail';
import { getPostBySlug } from './posts';

const renderBlock = (block, index) => {
  switch (block.type) {
    case 'heading':
      return (
        <h2 key={index} className="text-2xl font-bold text-white mt-8 mb-3">
          {block.text}
        </h2>
      );
    case 'list':
      return (
        <ul key={index} className="list-disc pl-6 text-gray-300 leading-relaxed text-lg mb-5 space-y-1">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    default:
      return (
        <p key={index} className="text-gray-300 leading-relaxed text-lg mb-5">
          {block.text}
        </p>
      );
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="bg-neutral-950 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-28 pb-16 px-4 sm:px-6 lg:px-8" role="main">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/blog"
            className="inline-block text-indigo-400 font-semibold hover:text-indigo-300 transition-colors mb-8"
          >
            ← Back to Learning in Public
          </Link>

          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <BlogThumbnail
              icon={post.icon}
              gradient={post.gradient}
              className="w-full h-48 sm:h-56 mb-8"
            />
            <p className="text-sm tracking-[0.18em] text-gray-400 uppercase mb-2">{post.category}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{post.title}</h1>
            <p className="text-sm text-gray-500 mb-8">{post.dateLabel}</p>
            {post.body.map(renderBlock)}
          </motion.article>

          <div className="border-t border-neutral-800 mt-10 pt-6">
            <Link
              to="/blog"
              className="inline-block text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
            >
              ← Back to all posts
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;
