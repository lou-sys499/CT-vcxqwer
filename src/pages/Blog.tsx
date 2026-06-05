import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, User, Clock, ChevronRight, BookOpen, Filter } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { BlogPost } from '../types';
import { getBlogPosts } from '../services/blogService';
import { cn } from '../lib/utils';
import { SEO } from '../components/SEO';

export function Blog() {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');
  
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const fbPosts = await getBlogPosts();
      
      const seenTitles = new Set();
      const validPosts = [];

      for (const p of fbPosts) {
        if (p.title && p.title.trim() !== '' && p.content && p.content.trim() !== '') {
          if (!seenTitles.has(p.title)) {
            seenTitles.add(p.title);
            validPosts.push(p);
          }
        }
      }
      
      setPosts(validPosts);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts = activeCategory 
    ? posts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase())
    : posts;

  const categories = ['All', 'Guides', 'Reviews', 'Industry News', 'Tips & Tricks'];

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "The Cordless Blog",
    "description": "Expert guides, tool reviews, and industry insights.",
    "url": window.location.href,
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": post.date,
      "url": `${window.location.origin}/blog/${post.id}`
    }))
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-slate-50">
      <SEO 
        title="The Cordless Blog | Hardware News, Reviews & Buyer Guides"
        description="Read the latest Cordless blog posts for rigorous field tests, comprehensive buying guides, and news about the newest cordless tools and accessories." 
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight"
            >
              The <span className="text-orange-600">Cordless</span> Blog
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 max-w-2xl"
            >
              Expert cordless power tools guides, pro-grade field reviews, and workshop industry insights.
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm">
            {categories.map((cat) => {
              const isActive = (cat === 'All' && !activeCategory) || (cat.toLowerCase() === activeCategory?.toLowerCase());
              return (
                <Link
                  key={cat}
                  to={cat === 'All' ? '/blog' : `/blog?category=${cat}`}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                    isActive ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "text-slate-500 hover:bg-slate-50"
                  )}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100">
            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No posts found in this category</h2>
            <p className="text-slate-500">Check back soon for more content!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width="600"
                    height="337"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-500 mb-6 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{post.author}</span>
                    </div>
                    <Link 
                      to={`/blog/${post.id}`}
                      className="text-orange-600 p-2 rounded-full bg-orange-50 group-hover:bg-orange-600 group-hover:text-white transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
