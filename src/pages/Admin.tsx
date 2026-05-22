import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, logOut, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Plus, LogOut, Package, Tag, Star, Image as ImageIcon, Layout, ArrowRight, Zap, Trash2, Pencil, Type, FileStack, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { CATEGORIES as STATIC_CATEGORIES, PRODUCTS as STATIC_PRODUCTS } from '../data';
import { getFirestoreCategories, getFirestoreProducts, updateFirestoreProduct, deleteFirestoreProduct, updateFirestoreCategory, deleteFirestoreCategory } from '../services/productService';
import { Category, BlogPost, Product } from '../types';
import { addBlogPost, getBlogPosts, deleteBlogPost, updateBlogPost } from '../services/blogService';

export function Admin() {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'blog'>('products');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>(STATIC_CATEGORIES);
  const [products, setProducts] = useState<Product[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [showAddBlogForm, setShowAddBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<string | null>(null);
  
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    price: '',
    category: 'cordless-vacuums',
    images: '',
    description: '',
    rating: '5.0',
    reviewsCount: '0',
    tag: '',
    popularity: '1',
    discount: '0',
    productHighlights: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    image: '',
    description: ''
  });

  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: 'CordlessToolz Editorial',
    category: 'Guides',
    readTime: '5 min read'
  });

  useEffect(() => {
    const fetchData = async () => {
      // Categories
      const fbCats = await getFirestoreCategories();
      const combinedCats = [...STATIC_CATEGORIES, ...fbCats].filter(Boolean);
      setCategories(Array.from(new Map(combinedCats.map(c => [c.id, c])).values()));

      // Products
      const fbProducts = await getFirestoreProducts();
      const combinedProducts = [...STATIC_PRODUCTS, ...fbProducts].filter(Boolean);
      const uniqueProducts = Array.from(new Map(combinedProducts.map(p => [p.id, p])).values());
      setProducts(uniqueProducts);

      // Blog posts
      const fbBlogPosts = await getBlogPosts();
      
      const seenTitles = new Set();
      const toDelete = [];
      const validPosts = [];

      for (const p of fbBlogPosts) {
        if (!p.title || p.title.trim() === '' || !p.content || p.content.trim() === '') {
          toDelete.push(p.id);
        } else if (seenTitles.has(p.title)) {
          toDelete.push(p.id);
        } else {
          seenTitles.add(p.title);
          validPosts.push(p);
        }
      }

      for (const id of toDelete) {
         try {
             await deleteBlogPost(id);
         } catch(e) {}
      }
      
      setBlogPosts(validPosts);
    };
    if (user && isAdmin) fetchData();
  }, [user, isAdmin]);

  const refreshProducts = async () => {
    const fbProducts = await getFirestoreProducts();
    const combinedProducts = [...fbProducts, ...STATIC_PRODUCTS];
    const uniqueProducts = Array.from(new Map(combinedProducts.map(p => [p.id, p])).values());
    setProducts(uniqueProducts);
  };

  if (loading) return <div className="pt-40 text-center">Loading...</div>;

  if (!user || !isAdmin) {
    return (
      <div className="pt-40 pb-24 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl p-12 premium-shadow border border-slate-100">
          <Layout className="w-16 h-16 text-orange-600 mx-auto mb-6" />
          <h1 className="text-3xl font-black text-slate-900 mb-4">Admin Access</h1>
          <p className="text-slate-500 mb-8">This area is reserved for authorized personnel only.</p>
          <button 
            onClick={signInWithGoogle}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
          >
            <Zap className="w-5 h-5 text-orange-500" /> Sign In with Google
          </button>
          {!isAdmin && user && (
             <p className="mt-4 text-red-500 text-xs font-bold uppercase tracking-widest">Access Denied: Not an Admin</p>
          )}
        </div>
      </div>
    );
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let highlights = productForm.productHighlights;
      if (highlights.trim() === '') {
        const response = await fetch('/api/summarize', {
          method: 'POST',
          body: JSON.stringify({ description: productForm.description }),
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        highlights = data.summary;
      }
      
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        rating: parseFloat(productForm.rating),
        reviewsCount: parseInt(productForm.reviewsCount),
        popularity: parseInt(productForm.popularity),
        discount: parseFloat(productForm.discount),
        images: productForm.images.split(',').map(s => s.trim()),
        productHighlights: (highlights || '').split('\n').map(s => s.trim()).filter(s => s !== ''),
        features: [], // Default empty or add form field later
        specs: {},
      };

      if (editingProduct) {
        await updateFirestoreProduct(editingProduct, productData);
        alert('Product updated successfully!');
      } else {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        });
        alert('Product added successfully!');
      }
      
      await refreshProducts();
      setShowAddForm(false);
      setEditingProduct(null);
      setProductForm({
        name: '',
        brand: '',
        price: '',
        category: 'cordless-vacuums',
        images: '',
        description: '',
        rating: '5.0',
        reviewsCount: '0',
        tag: '',
        popularity: '1',
        discount: '0',
        productHighlights: ''
      });
    } catch (error: any) {
      const op = editingProduct ? OperationType.UPDATE : OperationType.WRITE;
      if (error.code === 'permission-denied') {
        handleFirestoreError(error, op, 'products');
      }
      console.error(`Error ${editingProduct ? 'updating' : 'adding'} product:`, error);
      alert(`Failed to ${editingProduct ? 'update' : 'add'} product.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      brand: product.brand,
      price: product.price.toString(),
      category: product.category,
      images: (product.images || []).join(','),
      description: product.description,
      rating: product.rating.toString(),
      reviewsCount: (product.reviewsCount || 0).toString(),
      tag: product.tag || '',
      popularity: (product.popularity || 1).toString(),
      discount: (product.discount || 0).toString(),
      productHighlights: (product.productHighlights || []).join('\n')
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (productId: string, isStatic: boolean) => {
    if (isStatic) {
      alert('This is a demo product and cannot be deleted.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteFirestoreProduct(productId);
        await refreshProducts();
        alert('Product deleted!');
      } catch (error) {
        console.error("Delete error:", error);
        alert('Failed to delete. Make sure it is a Firestore product and you have permissions.');
      }
    }
  };

  const refreshCategories = async () => {
    const fbCats = await getFirestoreCategories();
    if (fbCats.length > 0) {
      setCategories(fbCats);
    } else {
      setCategories(STATIC_CATEGORIES);
    }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateFirestoreCategory(editingCategory, categoryForm);
        alert('Category updated successfully!');
      } else {
        await addDoc(collection(db, 'categories'), {
          ...categoryForm,
          createdAt: serverTimestamp()
        });
        alert('Category added successfully!');
      }
      setCategoryForm({
        name: '',
        slug: '',
        image: '',
        description: ''
      });
      setShowAddCategoryForm(false);
      setEditingCategory(null);
      await refreshCategories();
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        const op = editingCategory ? OperationType.UPDATE : OperationType.WRITE;
        handleFirestoreError(error, op, 'categories');
      }
      console.error(`Error ${editingCategory ? 'updating' : 'adding'} category:`, error);
      alert(`Failed to ${editingCategory ? 'update' : 'add'} category.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryEditClick = (category: Category) => {
    setEditingCategory(category.id);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      image: category.image || '',
      description: category.description || ''
    });
    setShowAddCategoryForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryDeleteClick = async (categoryId: string, isStatic: boolean) => {
    if (isStatic) {
      alert('This is a demo category and cannot be deleted.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteFirestoreCategory(categoryId);
        await refreshCategories();
        alert('Category deleted!');
      } catch (error) {
        console.error("Delete error:", error);
        alert('Failed to delete. Make sure it is a Firestore category and you have permissions.');
      }
    }
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingBlog) {
        await updateBlogPost(editingBlog, blogForm);
        alert('Blog post updated successfully!');
      } else {
        const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        await addBlogPost({
          ...blogForm,
          date: today
        });
        alert('Blog post published successfully!');
      }
      setShowAddBlogForm(false);
      setEditingBlog(null);
      await refreshBlogPosts();
      setBlogForm({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        author: 'CordlessToolz Editorial',
        category: 'Guides',
        readTime: '5 min read'
      });
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        handleFirestoreError(error, OperationType.WRITE, 'blogPosts');
      }
      console.error("Error saving blog post:", error);
      alert('Failed to save blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshBlogPosts = async () => {
    const fbBlogPosts = await getBlogPosts();
    const seenTitles = new Set();
    const validPosts = [];

    for (const p of fbBlogPosts) {
      if (p.title && p.title.trim() !== '' && p.content && p.content.trim() !== '') {
        if (!seenTitles.has(p.title)) {
          seenTitles.add(p.title);
          validPosts.push(p);
        }
      }
    }
    setBlogPosts(validPosts);
  };

  const handleEditBlog = (post: BlogPost) => {
    setBlogForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      image: post.image || '',
      author: post.author || '',
      category: post.category || 'Guides',
      readTime: post.readTime || ''
    });
    setEditingBlog(post.id);
    setShowAddBlogForm(true);
  };

  const handleBlogDeleteClick = async (postId: string) => {
    try {
      await deleteBlogPost(postId);
      await refreshBlogPosts();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const seedDemoBlog = async () => {
    setIsSubmitting(true);
    const demoPosts = [
      {
        title: 'Best Ice Auger for Cordless Drill: 2026 Buying Guide',
        excerpt: 'We field-tested the top ice augers to see which ones pair best with modern high-torque cordless drills.',
        content: 'Ice fishing has been revolutionized by cordless technology. In this guide, we break down why the **Milwaukee M18 FUEL** and **DEWALT 60V MAX** are the kings of the ice when paired with the right auger flighting...',
        image: 'https://images.unsplash.com/photo-1544551763-47a0159f963f?auto=format&fit=crop&q=80&w=800',
        author: 'CordlessToolz Editorial',
        category: 'Guides',
        readTime: '8 min read',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      },
      {
        title: 'Top 5 Best Cordless Vacuums for Workshop Use',
        excerpt: 'From saw dust to metal shavings, these cordless vacuums are built for the heavy-duty cleanup.',
        content: 'Testing cordless vacuums in a workshop environment revealed massive differences in filtration efficiency and sustain suction power. We recommend the following units for total shop mastery...',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
        author: 'CordlessToolz Editorial',
        category: 'Guides',
        readTime: '12 min read',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      },
      {
        title: 'Best Cordless Nailers: Which One Should You Buy?',
        excerpt: 'Comparing 18GA and 16GA battery-powered nailers from the biggest brands in the industry.',
        content: 'Hoses and compressors are becoming things of the past. Our deep-dive into cordless nailers covers firing speed, depth adjustment accuracy, and overall weight distribution...',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800',
        author: 'CordlessToolz Editorial',
        category: 'Guides',
        readTime: '6 min read',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      }
    ];

    try {
      for (const post of demoPosts) {
        await addBlogPost(post);
      }
      alert('Demo blog posts seeded successfully!');
    } catch (error) {
      console.error("Error seeding demo posts:", error);
      alert('Failed to seed demo posts.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-24 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Command Center</h1>
            <p className="text-slate-500">Welcome back, <span className="font-bold text-slate-900">{user.email === 'austinlouisetx@gmail.com' ? 'Admin' : user.displayName}</span></p>
          </div>
          <button 
            onClick={logOut}
            className="self-start bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-2">
            <button 
              onClick={() => setActiveTab('products')}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
                activeTab === 'products' ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20" : "bg-white text-slate-500 hover:bg-slate-100"
              )}
            >
              <Package className="w-5 h-5" /> Manage Products
            </button>
            <button 
              onClick={() => setActiveTab('categories')}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
                activeTab === 'categories' ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20" : "bg-white text-slate-500 hover:bg-slate-100"
              )}
            >
              <Layout className="w-5 h-5" /> Categories
            </button>
            <button 
              onClick={() => setActiveTab('blog')}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all",
                activeTab === 'blog' ? "bg-orange-600 text-white shadow-xl shadow-orange-600/20" : "bg-white text-slate-500 hover:bg-slate-100"
              )}
            >
              <BookOpen className="w-5 h-5" /> Blog Posts
            </button>

            <div className="pt-8 mt-8 border-t border-slate-200">
              <button 
                onClick={seedDemoBlog}
                disabled={isSubmitting}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-slate-400 hover:text-orange-600 transition-all border border-dashed border-slate-200 hover:border-orange-600/50"
              >
                <Zap className="w-5 h-5" /> Seed Buying Guides
              </button>
            </div>
          </div>

          {/* Form Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 premium-shadow border border-slate-100">
                <div className="flex items-center justify-between mb-10 text-nowrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
                      {activeTab === 'products' ? <Package className="w-6 h-6" /> : activeTab === 'categories' ? <Tag className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {activeTab === 'products' ? 'Product Inventory' : activeTab === 'categories' ? 'Add New Category' : 'Write New Article'}
                    </h2>
                  </div>
                  {(activeTab === 'products' || activeTab === 'blog') && (
                    <button 
                      onClick={() => {
                        if (activeTab === 'products') {
                          setShowAddForm(!showAddForm);
                          if (showAddForm) {
                            setEditingProduct(null);
                            setProductForm({
                              name: '',
                              brand: '',
                              price: '',
                              category: 'cordless-vacuums',
                              images: '',
                              description: '',
                              rating: '5.0',
                              reviewsCount: '0',
                              tag: '',
                              popularity: '1',
                              discount: '0',
                              productHighlights: ''
                            });
                          }
                        } else if (activeTab === 'blog') {
                          setShowAddBlogForm(!showAddBlogForm);
                          if (showAddBlogForm) {
                            setEditingBlog(null);
                            setBlogForm({
                              title: '',
                              excerpt: '',
                              content: '',
                              image: '',
                              author: 'CordlessToolz Editorial',
                              category: 'Guides',
                              readTime: '5 min read'
                            });
                          }
                        }
                      }}
                      className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20"
                    >
                      {(activeTab === 'products' ? showAddForm : showAddBlogForm) ? 'Cancel' : <><Plus className="w-5 h-5" /> Add {activeTab === 'products' ? 'Product' : 'Post'}</>}
                    </button>
                  )}
                </div>

                {activeTab === 'products' && showAddForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-12 pb-12 border-b border-slate-100 overflow-hidden"
                  >
                    <form onSubmit={handleProductSubmit} className="space-y-8">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Product Name</label>
                          <input 
                            required
                            type="text" 
                            value={productForm.name}
                            onChange={e => setProductForm({...productForm, name: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                            placeholder="e.g. V15 Detect™ Cordless"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Manufacturer / Brand</label>
                          <input 
                            required
                            type="text" 
                            value={productForm.brand}
                            onChange={e => setProductForm({...productForm, brand: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                            placeholder="e.g. Dyson, Milwaukee"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Price (USD)</label>
                          <input 
                            required
                            type="number" 
                            step="0.01"
                            value={productForm.price}
                            onChange={e => setProductForm({...productForm, price: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                            placeholder="749.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Department</label>
                          <select 
                            value={productForm.category}
                            onChange={e => setProductForm({...productForm, category: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                          >
                            {categories.map(cat => (
                              <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Image URLs (Comma separated)</label>
                          <div className="relative">
                            <input 
                              required
                              type="text" 
                              value={productForm.images}
                              onChange={e => setProductForm({...productForm, images: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pl-12 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                              placeholder="https://image1.jpg, https://image2.jpg"
                            />
                            <ImageIcon className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Product Description</label>
                          <textarea 
                            required
                            rows={4}
                            value={productForm.description}
                            onChange={e => setProductForm({...productForm, description: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                            placeholder="Highlight the key benefits..."
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Key Features (One per line)</label>
                          <textarea 
                            rows={3}
                            value={productForm.productHighlights}
                            onChange={e => setProductForm({...productForm, productHighlights: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                            placeholder="Enter features, one per line (max 6 lines)..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Popularity Rank (1-10)</label>
                          <input 
                            type="number" 
                            value={productForm.popularity}
                            onChange={e => setProductForm({...productForm, popularity: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Initial Rating</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              step="0.1"
                              max="5"
                              value={productForm.rating}
                              onChange={e => setProductForm({...productForm, rating: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pl-12 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                            />
                            <Star className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Discount (%)</label>
                          <input 
                            type="number" 
                            value={productForm.discount}
                            onChange={e => setProductForm({...productForm, discount: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div className="pt-6">
                        <button 
                          type="submit"
                          disabled={isSubmitting}
                          className={cn(
                            "w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-orange-600/30 transition-all flex items-center justify-center gap-3",
                            isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-orange-700 hover:scale-[1.01] active:scale-95"
                          )}
                        >
                          {isSubmitting ? (
                            <>Processing...</>
                          ) : (
                            <>{editingProduct ? 'Update Product' : 'Publish Product'} <ArrowRight className="w-5 h-5" /></>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'products' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <div className="col-span-1">Image</div>
                      <div className="col-span-5">Product Details</div>
                      <div className="col-span-2 text-right">Price</div>
                      <div className="col-span-2 text-right">Rating</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    {products.map((product) => (
                      <div key={product.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-orange-600 transition-all">
                        <div className="col-span-1">
                          <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1594818821917-001a707ecc5c?auto=format&fit=crop&q=80&w=800'} className="w-10 h-10 object-contain" alt="" />
                        </div>
                        <div className="col-span-5">
                          <p className="font-bold text-slate-900 leading-none mb-1">{product.name}</p>
                          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{product.brand} • {product.category}</p>
                        </div>
                        <div className="col-span-2 text-right font-black text-slate-900">${product.price}</div>
                        <div className="col-span-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-xs font-bold text-slate-600">{product.rating}</span>
                            <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                          </div>
                        </div>
                        <div className="col-span-2 text-right flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditClick(product)}
                            className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(product.id, STATIC_PRODUCTS.some(p => p.id === product.id))}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'categories' && (
                  <div className="space-y-8">
                    <div className="flex justify-end">
                      <button 
                        onClick={() => {
                          if (showAddCategoryForm) {
                            setShowAddCategoryForm(false);
                            setEditingCategory(null);
                            setCategoryForm({ name: '', slug: '', image: '', description: '' });
                          } else {
                            setShowAddCategoryForm(true);
                          }
                        }}
                        className={cn(
                          "px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg",
                          showAddCategoryForm 
                            ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                            : "bg-orange-600 text-white hover:bg-orange-700 shadow-orange-600/30"
                        )}
                      >
                        {showAddCategoryForm ? (
                          <>Cancel</>
                        ) : (
                          <><Plus className="w-5 h-5" /> Add New Category</>
                        )}
                      </button>
                    </div>

                    {showAddCategoryForm && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-100 mb-12"
                      >
                        <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                          <Layout className="w-6 h-6 text-orange-600" />
                          {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </h2>
                        <form onSubmit={handleCategorySubmit} className="space-y-8">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Category Name</label>
                              <input 
                                required
                                type="text" 
                                value={categoryForm.name}
                                onChange={e => setCategoryForm({...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                                placeholder="e.g. Laser Levels"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">URL Slug</label>
                              <div className="relative">
                                <input 
                                  required
                                  type="text" 
                                  value={categoryForm.slug}
                                  onChange={e => setCategoryForm({...categoryForm, slug: e.target.value})}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pl-12 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                                />
                                <FileStack className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                              </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Image URL</label>
                              <div className="relative">
                                <input 
                                  required
                                  type="url" 
                                  value={categoryForm.image}
                                  onChange={e => setCategoryForm({...categoryForm, image: e.target.value})}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 pl-12 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                                  placeholder="https://images.unsplash.com/..."
                                />
                                <ImageIcon className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                              </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Category Description</label>
                              <textarea 
                                required
                                rows={3}
                                value={categoryForm.description}
                                onChange={e => setCategoryForm({...categoryForm, description: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                                placeholder="What items are in this category?"
                              />
                            </div>
                          </div>
                          <div className="pt-6">
                            <button 
                              type="submit"
                              disabled={isSubmitting}
                              className={cn(
                                "w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-orange-600/30 transition-all flex items-center justify-center gap-3",
                                isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-orange-700 hover:scale-[1.01] active:scale-95"
                              )}
                            >
                              {isSubmitting ? (
                                <>Processing...</>
                              ) : (
                                <>{editingCategory ? 'Update Category' : 'Create Category'} <ArrowRight className="w-5 h-5" /></>
                              )}
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}

                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <div className="col-span-2">Image</div>
                      <div className="col-span-8">Category Details</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    {categories.map((category) => (
                      <div key={category.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-orange-600 transition-all">
                        <div className="col-span-2">
                          <img src={category.image || 'https://images.unsplash.com/photo-1594818821917-001a707ecc5c?auto=format&fit=crop&q=80&w=800'} className="w-12 h-12 rounded-xl object-cover" alt="" />
                        </div>
                        <div className="col-span-8">
                          <p className="font-bold text-slate-900 leading-none mb-1">{category.name}</p>
                          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{category.slug}</p>
                        </div>
                        <div className="col-span-2 text-right flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleCategoryEditClick(category)}
                            className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleCategoryDeleteClick(category.id, STATIC_CATEGORIES.some(c => c.id === category.id))}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {activeTab === 'blog' && (
                <>
                  {showAddBlogForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mb-12 pb-12 border-b border-slate-100 overflow-hidden"
                    >
                      <form onSubmit={handleBlogSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Article Title</label>
                            <input 
                              required
                              type="text" 
                              value={blogForm.title}
                              onChange={e => setBlogForm({...blogForm, title: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                              placeholder="e.g. 5 Cordless Drills You Need in 2026"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Featured Image URL</label>
                            <input 
                              required
                              type="url" 
                              value={blogForm.image}
                              onChange={e => setBlogForm({...blogForm, image: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                              placeholder="https://images.unsplash.com/..."
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Category</label>
                            <select 
                              value={blogForm.category}
                              onChange={e => setBlogForm({...blogForm, category: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                            >
                              <option>Guides</option>
                              <option>Reviews</option>
                              <option>Industry News</option>
                              <option>Tips & Tricks</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Read Time</label>
                            <input 
                              type="text" 
                              value={blogForm.readTime}
                              onChange={e => setBlogForm({...blogForm, readTime: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                              placeholder="5 min read"
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Excerpt (Short Preview)</label>
                            <textarea 
                              required
                              rows={2}
                              value={blogForm.excerpt}
                              onChange={e => setBlogForm({...blogForm, excerpt: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                              placeholder="A brief summary for the blog listing card..."
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Content (Markdown supported)</label>
                            <textarea 
                              required
                              rows={10}
                              value={blogForm.content}
                              onChange={e => setBlogForm({...blogForm, content: e.target.value})}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 focus:ring-4 focus:ring-orange-600/5 focus:border-orange-600/50 outline-none transition-all"
                              placeholder="Write your article here..."
                            />
                          </div>
                        </div>
                        <div className="pt-6">
                          <button 
                            type="submit"
                            disabled={isSubmitting}
                            className={cn(
                              "w-full bg-orange-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl shadow-orange-600/30 transition-all flex items-center justify-center gap-3",
                              isSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-orange-700 hover:scale-[1.01] active:scale-95"
                            )}
                          >
                            {isSubmitting ? "Saving..." : editingBlog ? "Update Post" : "Publish Post"}
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}
                  
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <div className="col-span-8">Article Details</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  {blogPosts.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">No content available. Write an article or seed demo posts.</div>
                  ) : (
                    blogPosts.map((post) => (
                      <div key={post.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-orange-600 transition-all mt-2">
                        <div className="col-span-8 flex items-center gap-4">
                           <img src={post.image || 'https://images.unsplash.com/photo-1594818821917-001a707ecc5c?auto=format&fit=crop&q=80&w=800'} className="w-12 h-12 rounded-xl object-cover" alt="" />
                           <div>
                             <p className="font-bold text-slate-900 leading-tight mb-1">{post.title}</p>
                             <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{post.category} • {post.readTime}</p>
                           </div>
                        </div>
                        <div className="col-span-2">
                           <p className="text-xs text-slate-500 font-medium">{post.date}</p>
                        </div>
                        <div className="col-span-2 text-right flex items-center justify-end">
                          <button 
                            onClick={() => handleEditBlog(post)}
                            className="p-2 text-slate-400 hover:text-orange-600 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleBlogDeleteClick(post.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
