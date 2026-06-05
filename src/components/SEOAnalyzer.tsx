import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { 
  Sparkles, Plus, X, CheckSquare, AlertCircle, 
  HelpCircle, Eye, Sliders, ArrowRight, RefreshCw, 
  Settings, CheckCircle, Search, Laptop, Edit3, 
  Info, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function SEOAnalyzer() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = useLocation().pathname;

  // Keyword Management State
  const [keywords, setKeywords] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('seo_analyzer_keywords');
      return saved ? JSON.parse(saved) : ['cordless', 'power tools', 'impact', 'pro-grade'];
    } catch (e) {
      return ['cordless', 'power tools', 'impact', 'pro-grade'];
    }
  });
  const [newKeyword, setNewKeyword] = useState('');

  // Overrides for META / HEAD (Persisted per pathname)
  const [titleOverride, setTitleOverride] = useState('');
  const [descOverride, setDescOverride] = useState('');

  // Page DOM Scraped Specs
  const [pageH1, setPageH1] = useState('');
  const [pageFirstParagraph, setPageFirstParagraph] = useState('');
  const [helmetDescriptionOriginal, setHelmetDescriptionOriginal] = useState('');
  const [documentTitleOriginal, setDocumentTitleOriginal] = useState('');

  // Read local store overrides for page
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`seo_analyzer_overrides_${pathname}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTitleOverride(parsed.title || '');
        setDescOverride(parsed.description || '');
      } else {
        setTitleOverride('');
        setDescOverride('');
      }
    } catch (e) {
      console.error('Error loading overrides', e);
    }
  }, [pathname]);

  // Save keywords to localStorage
  useEffect(() => {
    localStorage.setItem('seo_analyzer_keywords', JSON.stringify(keywords));
  }, [keywords]);

  // Periodic DOM Scraper (runs every 500ms to listen to dynamic page switches/updates)
  useEffect(() => {
    const scrapeDOM = () => {
      // Scrape H1 text
      const h1El = document.querySelector('h1');
      const h1Text = h1El ? (h1El.textContent || '').trim() : '';
      setPageH1(h1Text);

      // Scrape first non-empty paragraph text on page
      const pElements = Array.from(document.querySelectorAll('p'));
      const firstNonEmptyP = pElements.find(p => {
        const text = (p.textContent || '').trim();
        // Skip footer links, header utilities, and short texts
        return text.length > 15 && !p.closest('footer') && !p.closest('header') && !p.closest('[role="dialog"]');
      });
      const pText = firstNonEmptyP ? (firstNonEmptyP.textContent || '').trim() : '';
      setPageFirstParagraph(pText);

      // Scrape current original page title (if override isn't active)
      setDocumentTitleOriginal(document.title || '');

      // Scrape current original description from existing meta tags (pre-override)
      // Since Helmet overrides on the fly, let's find the non-overridden meta tags if possible, or fallback
      const nonOverrideMeta = Array.from(document.querySelectorAll('meta[name="description"]'))
        .filter(meta => !meta.hasAttribute('data-rh'));
      const origDesc = nonOverrideMeta.length > 0 
        ? nonOverrideMeta[0].getAttribute('content') || ''
        : document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      
      setHelmetDescriptionOriginal(origDesc);
    };

    scrapeDOM();
    const interval = setInterval(scrapeDOM, 1000);
    return () => clearInterval(interval);
  }, [pathname, isOpen]);

  // Add Focus Keyword tag
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newKeyword.trim().toLowerCase();
    if (clean && !keywords.includes(clean)) {
      setKeywords([...keywords, clean]);
      setNewKeyword('');
    }
  };

  // Remove Keyword tag
  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  // Reset Overrides
  const handleResetOverrides = () => {
    setTitleOverride('');
    setDescOverride('');
    localStorage.removeItem(`seo_analyzer_overrides_${pathname}`);
  };

  // Save overrides on blur/change
  const handleOverrideChange = (type: 'title' | 'description', value: string) => {
    if (type === 'title') {
      setTitleOverride(value);
      localStorage.setItem(`seo_analyzer_overrides_${pathname}`, JSON.stringify({
        title: value,
        description: descOverride
      }));
    } else {
      setDescOverride(value);
      localStorage.setItem(`seo_analyzer_overrides_${pathname}`, JSON.stringify({
        title: titleOverride,
        description: value
      }));
    }
  };

  // --- Real-time calculation helper ---
  const activeTitle = titleOverride || pageH1 || documentTitleOriginal || 'CordlessToolz';
  const activeDesc = descOverride || helmetDescriptionOriginal || 'No meta description registered on this page yet. Please write one to improve keyword targeting and click-through-rates in Google Search Result Snippets.';
  const primaryKeyword = keywords[0] || '';

  // RUN YOAST AUDITS
  const auditList = [
    {
      id: 'h1_check',
      title: 'Focus Keyword in Title (H1)',
      description: `Primary focus keyphrase "${primaryKeyword}" must be present in your landing page's main <h1> header.`,
      status: !primaryKeyword 
        ? 'info' 
        : pageH1.toLowerCase().includes(primaryKeyword.toLowerCase()) 
          ? 'pass' 
          : 'fail',
      message: !primaryKeyword
        ? 'Specify a focus keyphrase to evaluate.'
        : pageH1.toLowerCase().includes(primaryKeyword.toLowerCase())
          ? 'Passed! Focus keyphrase found in main H1 heading.'
          : `Missing! The primary focus keyphrase "${primaryKeyword}" was not found in your page's H1. Detected H1: "${pageH1 || '(none)'}"`
    },
    {
      id: 'intro_check',
      title: 'Focus Keyword in First Paragraph (Intro)',
      description: 'At least one of your target keyword tags must be present in the leading paragraph <p> tag of your content context.',
      status: keywords.length === 0
        ? 'info'
        : keywords.some(keyword => pageFirstParagraph.toLowerCase().includes(keyword.trim().toLowerCase()))
          ? 'pass'
          : 'fail',
      message: keywords.length === 0
        ? 'No keyword tags assigned.'
        : keywords.some(keyword => pageFirstParagraph.toLowerCase().includes(keyword.trim().toLowerCase()))
          ? 'Passed! At least one target keyword is present in the introductory paragraph.'
          : 'Missing! None of your target keyword tags were found in the page’s leading paragraph <p> tag.'
    },
    {
      id: 'meta_desc_check',
      title: 'Focus Keyword in Meta Description',
      description: 'Your keywords should show up inside your Google Search Snippet description to highlight match relevance.',
      status: keywords.length === 0
        ? 'info'
        : keywords.some(keyword => activeDesc.toLowerCase().includes(keyword.trim().toLowerCase()))
          ? 'pass'
          : 'fail',
      message: keywords.length === 0
        ? 'No keyword tags assigned.'
        : keywords.some(keyword => activeDesc.toLowerCase().includes(keyword.trim().toLowerCase()))
          ? 'Passed! Target keywords found inside the active meta description.'
          : 'Missing! Ensure at least one focus keyphrase appears inside your meta description copy.'
    },
    {
      id: 'meta_length_check',
      title: 'Meta Description Length Gating',
      description: 'To fit within mobile & desktop search consoles, keep description lengths between 120 and 160 characters.',
      status: activeDesc.length >= 120 && activeDesc.length <= 160
        ? 'pass'
        : activeDesc.length === 0
          ? 'fail'
          : 'amber',
      message: activeDesc.length >= 120 && activeDesc.length <= 160
        ? `Passed! Description length counts are perfect (${activeDesc.length} characters).`
        : activeDesc.length === 0
          ? 'Deficient! Current meta description length is 0 characters.'
          : `Warning! Currently ${activeDesc.length} characters. Optimal length is 120-160 characters for search results display constraints.`
    },
    {
      id: 'title_length_check',
      title: 'SEO Title Length Gating',
      description: 'Title headers exceeding 60 characters risk getting truncated with ellipses on search index displays.',
      status: activeTitle.length <= 60 && activeTitle.length > 5
        ? 'pass'
        : activeTitle.length > 60
          ? 'amber'
          : 'fail',
      message: activeTitle.length <= 60 && activeTitle.length > 5
        ? `Passed! SEO title size is optimal (${activeTitle.length} characters).`
        : activeTitle.length > 60
          ? `Too long! Title size is ${activeTitle.length} chars. Keep titles under 60 characters to avoid snippet truncation.`
          : `Deficient! Current SEO title size is too short (${activeTitle.length} chars).`
    }
  ];

  // Scoring Metrics for closed state representation
  const passedCount = auditList.filter(a => a.status === 'pass').length;
  const scorePct = Math.round((passedCount / auditList.length) * 100);

  return (
    <>
      {/* 1. Sync overrides continuously back into Head via React Helmet */}
      <Helmet>
        {titleOverride ? <title>{titleOverride}</title> : null}
        {descOverride ? <meta name="description" content={descOverride} data-rh="true" /> : null}
        {keywords.length > 0 ? <meta name="keywords" content={keywords.join(', ')} data-rh="true" /> : null}
      </Helmet>

      {/* 2. Sleek Floating SEO Trigger Button */}
      <div className="fixed bottom-6 right-6 z-[60]" id="seo_analyzer_button_container">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full font-bold shadow-2xl transition-all cursor-pointer ${
            isOpen 
              ? 'bg-slate-900 border border-slate-800 text-white' 
              : scorePct === 100
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white glow-emerald'
                : scorePct >= 60
                  ? 'bg-orange-600 hover:bg-orange-500 text-white glow-orange'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
          id="seo_analyzer_trigger"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 pointer-events-none -right-1 flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${scorePct === 100 ? 'bg-emerald-300' : 'bg-orange-300'}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${scorePct === 100 ? 'bg-emerald-400' : 'bg-orange-400'}`}></span>
            </span>
          </div>
          <span className="text-xs uppercase tracking-wider font-extrabold lg:block hidden">
            SEO Analyzer
          </span>
          <span className="text-xs px-2 py-0.5 bg-black/20 rounded-full font-black">
            {passedCount}/{auditList.length}
          </span>
        </motion.button>
      </div>

      {/* 3. Panel Overlay on backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 pointer-events-auto"
              id="seo_analyzer_backdrop"
            />

            {/* 4. Sliding Sidebar Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[460px] md:w-[500px] bg-slate-900 border-l border-slate-800 text-slate-100 p-6 shadow-2xl z-50 overflow-y-auto flex flex-col justify-between"
              id="seo_analyzer_sidebar"
            >
              <div>
                {/* Panel Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600/10 border border-orange-500/20 rounded-xl">
                      <Sparkles className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-white">Yoast-Style SEO Checker</h3>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Real-Time Context Audits</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-1 px-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    id="seo_analyzer_close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Score Indicator Grid */}
                <div className="bg-slate-950/40 p-4 rounded-3xl border border-slate-800/60 mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-bold mb-0.5">Real-time Optimization Score</p>
                    <h4 className="text-2xl font-black text-white flex items-baseline gap-1">
                      {scorePct}% <span className="text-xs font-bold text-slate-500">({passedCount} of {auditList.length} passed)</span>
                    </h4>
                  </div>
                  <div className="w-16 h-16 relative flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="32" cy="32" r="26" fill="transparent" stroke="#1E293B" strokeWidth="6" />
                      <circle 
                        cx="32" 
                        cy="32" 
                        r="26" 
                        fill="transparent" 
                        stroke={scorePct === 100 ? '#10B981' : scorePct >= 60 ? '#EA580C' : '#F43F5E'} 
                        strokeWidth="6" 
                        strokeDasharray={2 * Math.PI * 26}
                        strokeDashoffset={2 * Math.PI * 26 * (1 - scorePct / 100)}
                        className="transition-all duration-500"
                      />
                    </svg>
                    <span className="absolute text-xs font-black text-white">{passedCount}/{auditList.length}</span>
                  </div>
                </div>

                {/* Scope Target URL Alert Indicator */}
                <div className="px-4 py-2 border border-slate-800 rounded-2xl text-[11px] bg-slate-950/20 text-slate-400 mb-6 font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="truncate">Analyzing path: <span className="text-orange-500 font-bold">{pathname}</span></span>
                </div>

                {/* 1. Focus Keywords Tag State Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
                      Focus Target Keywords
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">
                      {keywords.length} active Tags
                    </span>
                  </div>

                  <form onSubmit={handleAddKeyword} className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                      placeholder="Add keyword tag (e.g. impact driver)..."
                      className="bg-slate-950 text-white placeholder-slate-500 border border-slate-800 rounded-xl px-3 py-2 text-sm flex-grow focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all font-medium"
                      id="keyword_input_field"
                    />
                    <button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-xl font-bold flex items-center justify-center transition-all cursor-pointer shrink-0"
                      id="keyword_submit_btn"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2 py-1 bg-slate-950/25 p-3 rounded-2xl border border-slate-850">
                    {keywords.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-1">No target keywords added. Page is evaluated as clean.</p>
                    ) : (
                      <AnimatePresence>
                        {keywords.map((kw, i) => (
                          <motion.span
                            key={kw}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                              i === 0 
                                ? 'bg-orange-600/10 border-orange-600/30 text-orange-400' 
                                : 'bg-slate-800/60 border-slate-700 text-slate-300'
                            }`}
                          >
                            <span>{kw}</span>
                            {i === 0 && <span className="text-[9px] uppercase px-1 bg-orange-600/25 rounded-md text-orange-400 shrink-0 font-extrabold">Primary</span>}
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(i)}
                              className="hover:bg-slate-700 p-0.5 rounded-full hover:text-white cursor-pointer shrink-0"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </motion.span>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </div>

                {/* 2. Google Search Result Snippet Preview (Mimicking SERP widget) */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
                      Live Google Search SERP Snippet
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">SERP Visualizer</span>
                  </div>

                  <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm text-[#4d5156] font-sans antialiased text-left mb-4 select-none">
                    <div className="flex items-center gap-2 text-xs text-[#202124] mb-1">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 shrink-0 border border-slate-200">
                        C
                      </div>
                      <div className="truncate">
                        <p className="text-[11px] leading-tight text-[#202124] font-medium">CordlessToolz</p>
                        <p className="text-[9px] leading-tight text-[#4d5156] opacity-80">https://cordlesstoolz.com{pathname}</p>
                      </div>
                    </div>
                    
                    <h4 className="text-lg leading-tight hover:underline text-[#1a0dab] cursor-pointer font-medium mb-1 line-clamp-1">
                      {activeTitle}
                    </h4>

                    <p className="text-xs leading-normal text-[#4d5156] line-clamp-2 select-text font-normal font-sans py-0.5">
                      {activeDesc}
                    </p>
                  </div>

                  {/* Overrides Fields */}
                  <div className="bg-slate-950/40 border border-slate-800 p-4 rounded-3xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-orange-500" /> Page Head Overrides
                      </span>
                      {(titleOverride || descOverride) && (
                        <button 
                          onClick={handleResetOverrides}
                          className="text-[10px] font-black text-slate-500 uppercase hover:text-orange-500 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" /> Clear Overrides
                        </button>
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <label className="font-extrabold">SEO Title Override</label>
                        <span className={`font-mono font-bold ${activeTitle.length > 60 ? 'text-amber-500' : 'text-slate-500'}`}>
                          {activeTitle.length} / 60 Chars
                        </span>
                      </div>
                      <input
                        type="text"
                        placeholder="Fallback to page title..."
                        value={titleOverride}
                        onChange={(e) => handleOverrideChange('title', e.target.value)}
                        className="w-full bg-slate-950 text-white placeholder-slate-600 font-medium text-xs rounded-xl border border-slate-850 p-2 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <label className="font-extrabold">Meta Description Override</label>
                        <span className={`font-mono font-bold ${activeDesc.length >= 120 && activeDesc.length <= 160 ? 'text-emerald-500' : 'text-slate-500'}`}>
                          {activeDesc.length} Chars (Goal: 120-160)
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        placeholder="Fallback to template default meta description..."
                        value={descOverride}
                        onChange={(e) => handleOverrideChange('description', e.target.value)}
                        className="w-full bg-slate-950 text-white placeholder-slate-600 font-medium text-xs rounded-xl border border-slate-850 p-2 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Yoast Analysis Live Checklist */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs uppercase font-extrabold tracking-wider text-slate-300">
                      SEO Audit Checklist
                    </label>
                    <span className="text-[10px] text-slate-500 font-bold font-mono">
                      {passedCount} Passed
                    </span>
                  </div>

                  <div className="space-y-3">
                    {auditList.map((audit) => (
                      <div 
                        key={audit.id} 
                        className={`p-3.5 rounded-2xl border transition-all ${
                          audit.status === 'pass'
                            ? 'bg-emerald-950/15 border-emerald-900/30 text-emerald-100'
                            : audit.status === 'amber'
                              ? 'bg-amber-950/15 border-amber-900/30 text-amber-100'
                              : audit.status === 'info'
                                ? 'bg-slate-950/30 border-slate-800 text-slate-300'
                                : 'bg-rose-950/15 border-rose-900/30 text-rose-100'
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          {audit.status === 'pass' && <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />}
                          {audit.status === 'amber' && <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0 animate-pulse" />}
                          {audit.status === 'fail' && <AlertCircle className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />}
                          {audit.status === 'info' && <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />}

                          <div className="flex-grow">
                            <h5 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                              {audit.title}
                            </h5>
                            <p className="text-[11px] leading-relaxed mt-0.5 opacity-90 font-medium">
                              {audit.message}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Page Inspector debug metrics */}
                <div className="bg-slate-950/40 p-4 border border-slate-800/60 rounded-3xl mb-8">
                  <h5 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-3 flex items-center gap-1.5 select-none">
                    <Laptop className="w-3.5 h-3.5 text-orange-500" /> Scraped DOM Inspector
                  </h5>
                  <div className="space-y-2 text-[11px] font-mono leading-relaxed">
                    <div className="flex justify-between gap-4 border-b border-slate-850 pb-1.5">
                      <span className="text-slate-500 shrink-0 select-none">H1 Header:</span>
                      <span className="text-slate-300 truncate font-semibold" title={pageH1 || '(None detected)'}>
                        {pageH1 ? `"${pageH1}"` : '(None detected)'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4 border-b border-slate-850 pb-1.5">
                      <span className="text-slate-500 shrink-0 select-none">Intro P:</span>
                      <span className="text-slate-300 truncate font-semibold" title={pageFirstParagraph || '(None detected)'}>
                        {pageFirstParagraph ? `"${pageFirstParagraph.slice(0, 48)}..."` : '(None detected)'}
                      </span>
                    </div>
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500 shrink-0 select-none">Meta Desc:</span>
                      <span className="text-slate-300 truncate font-semibold" title={helmetDescriptionOriginal || '(None detected)'}>
                        {helmetDescriptionOriginal ? `"${helmetDescriptionOriginal.slice(0, 48)}..."` : '(None detected)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Yoast Guide Tip Promo footer */}
              <div className="border-t border-slate-850 pt-5 mt-6 bg-slate-900 sticky bottom-0">
                <div className="bg-slate-950 p-4 rounded-2xl flex items-center gap-3">
                  <div className="p-1.5 bg-orange-600/10 border border-orange-500/20 rounded-lg text-orange-400 shrink-0">
                    <Sparkles className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">SEO Golden Rule</p>
                    <p className="text-[11px] text-slate-300 font-medium leading-normal mt-0.5">
                      Make sure your primary keyword is also used contextually in key categories page URLs and alt tags.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
