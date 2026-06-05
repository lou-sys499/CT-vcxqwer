import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { BlogPost, Product } from '../types';
import { getBlogPosts } from '../services/blogService';
import { getFirestoreProducts } from '../services/productService';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { SEO } from '../components/SEO';

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [posts, productsData] = await Promise.all([
        getBlogPosts(),
        getFirestoreProducts()
      ]);
      const found = posts.find(p => p.id === id);
      setPost(found || null);
      setProducts((productsData || []).filter(Boolean));
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const linkedContent = useMemo(() => {
    if (!post || !products.length) return post?.content || '';
    
    let content = post.content;
    
    // Sort products by name length descending to avoid partial matches
    const sortedProducts = [...products].sort((a, b) => (b?.name?.length || 0) - (a?.name?.length || 0));
    
    sortedProducts.forEach(product => {
      if (!product || !product.name || product.name.trim().length < 4) return; // Skip very short vague names
      
      const escapedName = product.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Case insensitive match for the exact product name
      const regex = new RegExp(`(${escapedName})(?!(?:[^\\[]*\\]|[^\\(]*\\)))`, 'gi');
      
      content = content.replace(regex, (match) => {
        return `[${match}](/product/${product.id})`;
      });
    });
    
    return content;
  }, [post, products]);

  if (loading) {
    return (
      <div className="pt-32 pb-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-32 pb-24 min-h-screen text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-orange-600 font-bold hover:underline flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const schemaMarkup = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [post.image],
    "datePublished": post.date,
    "author": [{
        "@type": "Person",
        "name": post.author
    }]
  } : null;

  return (
    <article className="pt-32 pb-24 min-h-screen bg-white">
      {post && (
        <SEO 
          title={`${post.title} | ProTool Blog`}
          description={post.excerpt} 
        />
      )}
      {schemaMarkup && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }} />
      )}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 font-bold mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4 text-xs font-bold text-orange-600 uppercase tracking-widest mb-6">
            <span className="bg-orange-50 px-3 py-1 rounded-full">{post.category}</span>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </div>
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-8 border-y border-slate-100 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-orange-600/20">
                <User className="w-6 h-6 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Written By</p>
                <p className="text-lg font-bold text-slate-900 leading-none">{post.author}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="p-2.5 rounded-full bg-slate-50 text-slate-400 hover:bg-orange-600 hover:text-white transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="aspect-video rounded-[2.5rem] overflow-hidden mb-16 shadow-2xl shadow-slate-200"
        >
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" width="1200" height="675" />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="markdown-body prose prose-slate prose-lg max-w-none"
        >
          <Markdown
            remarkPlugins={[remarkBreaks]}
            components={{
              a: ({ node, ...props }) => {
                const isInternal = props.href?.startsWith('/');
                if (isInternal) {
                  return <Link to={props.href!} {...props} />;
                }
                return <a target="_blank" rel="noopener noreferrer" {...props} />;
              }
            }}
          >
            {linkedContent}
          </Markdown>
        </motion.div>
      </div>
    </article>
  );
}
