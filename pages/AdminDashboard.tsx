
import React, { useState, useEffect, useMemo } from 'react';
import { authService, portfolioService, blogService, configService, testimonialService, voucherService, contactService } from '../services/supabaseService';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { performSmartSearch, SmartSortOption } from '../services/smartSearchService';
import { useConfig } from '../contexts/ConfigContext';
import { useToast } from '../contexts/ToastContext';
import { 
    Plus, Trash2, LogOut, Settings, Grid, Save, LayoutDashboard, Globe, Edit, X, FileText, ArrowLeft, 
    Image as ImageIcon, Search, Cloud, BrainCircuit, Rocket, RefreshCcw, ShieldCheck, Zap, ArrowUp, 
    ArrowDown, Minus, Crown, Video as VideoIcon, Smartphone, Wand2, Loader2, Cpu, BarChart3, 
    Fingerprint, Upload, Bot, Tag as TagIcon, MapPin, Calendar, Link as LinkIcon, User, Menu, 
    ShieldAlert, Shield, BookOpen, Star, Copy, Check, Ticket, Gamepad2, Sparkles, Film, ExternalLink, 
    CheckCircle2, Mail, Database, AlertCircle, Activity
} from 'lucide-react';
import { PortfolioItem, BlogPost, SiteConfig, PortfolioCategory, MediaType, Testimonial, Voucher } from '../types';
import { BongoCatLoader } from '../components/BongoCatLoader';
import { DEFAULT_CONFIG } from '../constants';

interface AdminDashboardProps {
    onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { config, updateConfig, isLoading: isConfigLoading } = useConfig();
  const { showToast } = useToast();
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'blog' | 'settings' | 'stories' | 'trust'>('overview');
  const [settingsSection, setSettingsSection] = useState<'general' | 'hero' | 'bio' | 'testimonial' | 'journal' | 'contact' | 'theme' | 'seo'>('general');

  const [existingItems, setExistingItems] = useState<PortfolioItem[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [submissionsCount, setSubmissionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [diagStatus, setDiagStatus] = useState({ db: 'checking', mail: 'checking' });

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SmartSortOption>('dateUploaded');

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    title: '', category: 'illustration', mediaType: 'image', url: '', thumbnailUrl: '', description: '', dateCreated: getTodayDate(), references: [], assets: [], tags: [], isFeatured: false, featuredOrder: 99, metadata: { tools: [], role: '', client: '' }
  });
  
  const [portfolioTagsInput, setPortfolioTagsInput] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [toolsInput, setToolsInput] = useState('');

  const [tempConfig, setTempConfig] = useState<SiteConfig>(config);

  useEffect(() => { setTempConfig(config); }, [config]);
  
  useEffect(() => {
    const checkSession = async () => {
        try {
            const user = await authService.getCurrentUser();
            if (user) setIsAuthenticated(true);
        } catch (e) { console.error(e); } finally { setIsCheckingAuth(false); }
    };
    checkSession();
  }, []);

  const fetchData = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [items, blogs, tests, vchs, subs] = await Promise.all([ 
        portfolioService.getAll(), 
        blogService.getAll(),
        testimonialService.getAdminAll(),
        voucherService.getAll(),
        contactService.getTodayCount()
      ]);
      setExistingItems(items);
      setBlogPosts(blogs);
      setTestimonials(tests);
      setVouchers(vchs);
      setSubmissionsCount(subs);
      
      setDiagStatus({
          db: 'online',
          mail: (config.contact.formspreeId && !config.contact.formspreeId.includes("ADD_YOUR")) ? 'configured' : 'missing'
      });
    } catch (err) { 
        showToast("Sync failed", "error");
        setDiagStatus(prev => ({ ...prev, db: 'offline' }));
    } finally { setIsLoading(false); }
  };

  useEffect(() => { fetchData(); }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setAuthError('');
    const { error } = await authService.login(email, password);
    if (error) setAuthError(error.message);
    else setIsAuthenticated(true);
    setIsLoggingIn(false);
  };

  const handleLogout = async () => { await authService.logout(); setIsAuthenticated(false); };

  const saveConfigChanges = async () => {
      setIsLoading(true);
      try {
          await updateConfig(tempConfig);
          showToast("System Configuration Updated", "success");
          setDiagStatus(prev => ({
              ...prev,
              mail: (tempConfig.contact.formspreeId && !tempConfig.contact.formspreeId.includes("ADD_YOUR")) ? 'configured' : 'missing'
          }));
      } catch(e) {
          showToast("Failed to save config", "error");
      } finally {
          setIsLoading(false);
      }
  };

  const handleConfigChange = (section: keyof SiteConfig, key: string, value: any) => {
    setTempConfig(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [key]: value
      }
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: string, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    const cloudName = tempConfig.cloudinary.cloudName || DEFAULT_CONFIG.cloudinary.cloudName;
    const uploadPreset = tempConfig.cloudinary.uploadPreset || DEFAULT_CONFIG.cloudinary.uploadPreset;
    try {
        const url = await uploadToCloudinary(file, cloudName, uploadPreset);
        
        if (target === 'portfolio') {
            setNewItem(prev => ({ ...prev, [field]: url }));
        } else if (target === 'config') {
            const parts = field.split('.');
            if (parts.length === 2) {
                const section = parts[0] as keyof SiteConfig;
                const key = parts[1];
                setTempConfig(prev => ({ 
                    ...prev, 
                    [section]: { ...(prev as any)[section], [key]: url } 
                }));
            }
        }
        showToast("Asset Uploaded Successfully", "success");
    } catch (err: any) { showToast(err.message || "Upload Failed", "error"); }
    finally { setIsLoading(false); }
  };

  const savePortfolioItem = async () => {
    if (!newItem.title || !newItem.url) {
        showToast("Title and URL are required", "error");
        return;
    }
    setIsLoading(true);
    try {
        const itemData = {
            ...newItem,
            tags: portfolioTagsInput.split(',').map(t => t.trim()).filter(t => t),
            metadata: {
                ...newItem.metadata,
                tools: toolsInput.split(',').map(t => t.trim()).filter(t => t)
            }
        } as Omit<PortfolioItem, 'id' | 'createdAt'>;

        if (editingItemId) {
            await portfolioService.update({ ...itemData, id: editingItemId, createdAt: existingItems.find(i => i.id === editingItemId)!.createdAt } as PortfolioItem);
            showToast("Work Updated", "success");
        } else {
            await portfolioService.create(itemData);
            showToast("Work Published", "success");
        }
        setEditingItemId(null);
        setNewItem({ title: '', category: 'illustration', mediaType: 'image', url: '', description: '', dateCreated: getTodayDate(), tags: [], metadata: { tools: [] } });
        setPortfolioTagsInput('');
        setToolsInput('');
        fetchData();
    } catch (e) { showToast("Save operation failed", "error"); }
    finally { setIsLoading(false); }
  };

  const filteredItems = useMemo(() => {
    return performSmartSearch(existingItems, searchQuery, sortOption);
  }, [existingItems, searchQuery, sortOption]);

  if (isCheckingAuth || isConfigLoading) return <BongoCatLoader />;

  if (!isAuthenticated) return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-paper overflow-y-auto">
        <button onClick={() => onNavigate('home')} className="absolute top-12 left-12 flex items-center gap-4 text-stone-400 font-black uppercase tracking-[0.4em] text-[10px] group"><ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform"/> Portal Entrance</button>
        <form onSubmit={handleLogin} className="bg-white p-12 md:p-16 rounded-[4rem] shadow-2xl max-w-lg w-full border border-stone-100 relative overflow-hidden my-auto">
          <div className="flex flex-col items-center justify-center mb-16">
              <div className="w-16 h-16 bg-stone-900 rounded-3xl flex items-center justify-center text-white mb-8 shadow-2xl"><Fingerprint size={32}/></div>
              <h2 className="font-heading text-6xl mb-3 text-stone-900 tracking-tighter">Console.</h2>
              <p className="text-stone-300 text-[10px] uppercase tracking-[0.6em] font-black">Authorized Personnel Only</p>
          </div>
          <div className="space-y-6">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Access Identifier" className="input-field" required/>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Security Keyphrase" className="input-field" required/>
              {authError && <p className="text-red-500 text-[11px] font-black text-center uppercase tracking-widest">{authError}</p>}
              <button type="submit" disabled={isLoggingIn} className="w-full py-6 mt-8 bg-stone-900 text-white rounded-[2rem] font-black uppercase tracking-[0.4em] text-xs hover:bg-black shadow-xl hover:-translate-y-1 transition-all disabled:opacity-50">
                  {isLoggingIn ? 'Authenticating...' : 'Unlock System'}
              </button>
          </div>
        </form>
      </div>
  );

  return (
    <div className="flex min-h-screen bg-paper font-body text-stone-800 relative">
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        className="md:hidden fixed top-6 right-6 z-[200] p-4 bg-stone-900 text-white rounded-full shadow-xl"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isSidebarOpen && (
          <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-[140] md:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-500 w-80 bg-white border-r border-stone-100 flex flex-col z-[150] shadow-2xl md:shadow-none`}>
        <div className="p-16 border-b border-stone-50 flex flex-col items-center">
            <h2 className="font-heading text-4xl font-bold tracking-tighter mb-2">Console.</h2>
            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ${diagStatus.db === 'online' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${diagStatus.db === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                System: {diagStatus.db.toUpperCase()}
            </div>
        </div>
        <nav className="flex-1 p-8 space-y-4 overflow-y-auto">
            {[ 
                {id:'overview', label:'Status', icon:LayoutDashboard}, 
                {id:'portfolio', label:'Workshops', icon:Grid}, 
                {id:'blog', label:'Journal', icon:FileText}, 
                {id:'settings', label:'Core Config', icon:Settings} 
            ].map(item => (
                <button 
                    key={item.id} 
                    onClick={() => { setActiveTab(item.id as any); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center px-8 py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ${activeTab === item.id ? 'bg-stone-900 text-white shadow-2xl shadow-stone-900/30' : 'text-stone-300 hover:text-stone-900 hover:bg-stone-50'}`}
                >
                    <item.icon size={20} className="mr-5"/> {item.label}
                </button>
            ))}
        </nav>
        <div className="p-10 border-t border-stone-50 space-y-3">
            <button onClick={() => onNavigate('home')} className="w-full flex items-center px-8 py-5 text-stone-400 hover:bg-stone-50 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-colors"><Globe size={18} className="mr-5"/> Live Site</button>
            <button onClick={handleLogout} className="w-full flex items-center px-8 py-5 text-red-400 hover:bg-red-50 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-colors"><LogOut size={18} className="mr-5"/> Terminate Session</button>
        </div>
      </aside>

      <main className="flex-1 md:ml-80 p-8 md:p-24 overflow-y-auto">
          {isLoading && <div className="fixed inset-0 bg-white/95 z-[220] flex items-center justify-center"><BongoCatLoader /></div>}

          {activeTab === 'overview' && (
              <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 space-y-16">
                  <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-300 mb-4">Command Center</p>
                      <h1 className="font-heading text-7xl md:text-9xl text-stone-900 leading-[0.8] tracking-tighter">Status.</h1>
                  </div>
                  
                  {/* Diagnostics Grid */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* Service Health */}
                      <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-8">
                         <div className="flex items-center gap-4">
                            <Activity size={24} className="text-accent" />
                            <h2 className="font-heading text-3xl">Diagnostics.</h2>
                         </div>
                         <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                <div className="flex items-center gap-3">
                                    <Database size={18} className="text-stone-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Supabase Engine</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${diagStatus.db === 'online' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {diagStatus.db}
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                <div className="flex items-center gap-3">
                                    <Mail size={18} className="text-stone-400" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Mail Protocol (Formspree)</span>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${diagStatus.mail === 'configured' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {diagStatus.mail}
                                </div>
                            </div>
                         </div>
                         {diagStatus.mail === 'missing' && (
                             <div className="flex gap-4 p-5 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                                <AlertCircle size={20} className="shrink-0" />
                                <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                    Action Required: The Contact Form is not active. Please add your Formspree ID in the Core Config tab to receive client signals.
                                </p>
                             </div>
                         )}
                      </div>

                      {/* Submissions Traffic */}
                      <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-8">
                         <div className="flex items-center gap-4">
                            <Rocket size={24} className="text-accent" />
                            <h2 className="font-heading text-3xl">Traffic.</h2>
                         </div>
                         <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">Daily Bandwidth Used</span>
                                <span className="text-2xl font-heading">{submissionsCount} / 10</span>
                            </div>
                            <div className="h-4 w-full bg-stone-50 rounded-full overflow-hidden border border-stone-100">
                                <div 
                                    className={`h-full transition-all duration-1000 ${submissionsCount >= 10 ? 'bg-red-400' : 'bg-stone-900'}`}
                                    style={{ width: `${(submissionsCount / 10) * 100}%` }}
                                />
                            </div>
                            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">
                                {submissionsCount >= 10 ? 'Threshold reached. New signals are paused.' : 'System can accept more creative briefs.'}
                            </p>
                         </div>
                      </div>
                  </div>

                  {/* Core Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-4 hover:border-accent transition-colors">
                          <div className="w-12 h-12 bg-stone-900 text-white rounded-2xl flex items-center justify-center"><Grid size={24}/></div>
                          <h3 className="text-stone-300 text-[10px] font-black uppercase tracking-widest">Active Artifacts</h3>
                          <p className="font-heading text-5xl">{existingItems.length}</p>
                      </div>
                      <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-4 hover:border-accent transition-colors">
                          <div className="w-12 h-12 bg-accent text-stone-900 rounded-2xl flex items-center justify-center"><Star size={24}/></div>
                          <h3 className="text-stone-300 text-[10px] font-black uppercase tracking-widest">Featured Works</h3>
                          <p className="font-heading text-5xl">{existingItems.filter(i => i.isFeatured).length}</p>
                      </div>
                      <div className="bg-white p-10 rounded-[3rem] border border-stone-100 shadow-xl space-y-4 hover:border-accent transition-colors">
                          <div className="w-12 h-12 bg-stone-100 text-stone-900 rounded-2xl flex items-center justify-center"><FileText size={24}/></div>
                          <h3 className="text-stone-300 text-[10px] font-black uppercase tracking-widest">Journal Entries</h3>
                          <p className="font-heading text-5xl">{blogPosts.length}</p>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'portfolio' && (
              <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 space-y-16 pb-32">
                  <header className="flex justify-between items-end">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-300 mb-4">Content Repository</p>
                        <h1 className="font-heading text-6xl md:text-9xl text-stone-900 leading-[0.8] tracking-tighter">Workshop.</h1>
                    </div>
                  </header>

                  <div className="bg-white p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] border border-stone-100 shadow-2xl space-y-12">
                      <div className="flex items-center gap-4 mb-8">
                          <div className="p-3 bg-stone-900 text-white rounded-2xl"><Plus size={24}/></div>
                          <h2 className="font-heading text-4xl">{editingItemId ? 'Update Manifest' : 'New Creation'}</h2>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-10">
                          <div className="space-y-6">
                              <div className="space-y-2">
                                  <label className="label">Title</label>
                                  <input className="input-field" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} placeholder="Project Title" />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                      <label className="label">Discipline</label>
                                      <select className="input-field" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as PortfolioCategory})}>
                                          <option value="illustration">Illustration</option>
                                          <option value="motion_graphics_animation">Motion/Animation</option>
                                          <option value="graphic_design">Graphic Design</option>
                                          <option value="video_editing">Video Editing</option>
                                          <option value="web_app_development">Web Development</option>
                                      </select>
                                  </div>
                                  <div className="space-y-2">
                                      <label className="label">Modality</label>
                                      <select className="input-field" value={newItem.mediaType} onChange={e => setNewItem({...newItem, mediaType: e.target.value as MediaType})}>
                                          <option value="image">Still Image</option>
                                          <option value="video_file">Video File</option>
                                          <option value="video_youtube">YouTube</option>
                                          <option value="game_godot">Godot Game</option>
                                      </select>
                                  </div>
                              </div>
                              <div className="space-y-2">
                                  <label className="label">Asset Source (URL or Upload)</label>
                                  <div className="flex flex-col sm:flex-row gap-4">
                                      <input className="input-field" value={newItem.url} onChange={e => setNewItem({...newItem, url: e.target.value})} placeholder="https://..." />
                                      <label className="p-4 bg-stone-900 text-white rounded-2xl cursor-pointer hover:bg-accent hover:text-stone-900 transition-colors flex justify-center items-center">
                                          <Upload size={20}/>
                                          <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'portfolio', 'url')} />
                                      </label>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="space-y-6">
                              <div className="space-y-2">
                                  <label className="label">Brief Description</label>
                                  <textarea className="input-field h-32 resize-none" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} placeholder="Describe the process and outcome..." />
                              </div>
                          </div>
                      </div>

                      <div className="pt-8 border-t border-stone-50 flex flex-col md:flex-row justify-between items-center gap-8">
                          <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-start">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="hidden" checked={newItem.isFeatured} onChange={e => setNewItem({...newItem, isFeatured: e.target.checked})} />
                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${newItem.isFeatured ? 'bg-accent border-accent text-stone-900' : 'border-stone-200'}`}>
                                    {newItem.isFeatured && <Star size={14} fill="currentColor" />}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 group-hover:text-stone-900">Featured</span>
                            </label>
                          </div>
                          <div className="flex gap-4 w-full md:w-auto">
                              <button onClick={savePortfolioItem} className="flex-1 md:flex-none px-8 py-4 bg-stone-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-stone-900 transition-all shadow-xl">
                                  {editingItemId ? 'Update' : 'Publish'}
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-24 space-y-16">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-300 mb-4">System Parameters</p>
                        <h1 className="font-heading text-6xl md:text-9xl text-stone-900 leading-[0.8] tracking-tighter">Config.</h1>
                    </div>
                    <button onClick={saveConfigChanges} className="flex items-center gap-3 px-10 py-5 bg-stone-900 text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-stone-900 transition-all shadow-xl">
                        <Save size={16}/> Sync Logic
                    </button>
                </header>

                <div className="flex flex-wrap gap-2 md:gap-4 p-2 bg-stone-100 rounded-[2rem] w-full md:w-fit overflow-x-auto">
                    {['general', 'seo', 'hero', 'bio', 'testimonial', 'contact', 'theme'].map(sec => (
                        <button key={sec} onClick={() => setSettingsSection(sec as any)} className={`px-4 md:px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${settingsSection === sec ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400'}`}>
                            {sec.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="bg-white p-8 md:p-16 rounded-[3rem] md:rounded-[4rem] border border-stone-100 shadow-2xl">
                    {settingsSection === 'seo' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="label">Search Engine Title</label>
                                        <input className="input-field" value={tempConfig.seo.metaTitle} onChange={e => handleConfigChange('seo', 'metaTitle', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="label">Social Meta Description</label>
                                        <textarea className="input-field h-32 resize-none" value={tempConfig.seo.metaDescription} onChange={e => handleConfigChange('seo', 'metaDescription', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="label">Search Keywords</label>
                                        <input className="input-field" value={tempConfig.seo.keywords} onChange={e => handleConfigChange('seo', 'keywords', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="label">Open Graph Image (1200x630 Recommended)</label>
                                        <div className="flex flex-col gap-4">
                                            <div className="aspect-[1.91/1] rounded-2xl overflow-hidden border-2 border-stone-100 bg-stone-50">
                                                <img src={tempConfig.seo.ogImage} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex gap-4">
                                                <input className="input-field text-xs" value={tempConfig.seo.ogImage} onChange={e => handleConfigChange('seo', 'ogImage', e.target.value)} />
                                                <label className="p-4 bg-stone-900 text-white rounded-2xl cursor-pointer hover:bg-accent hover:text-stone-900 transition-colors flex justify-center items-center">
                                                    <Upload size={20}/>
                                                    <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'config', 'seo.ogImage')} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="label">AI Knowledge Context (Digital Twin Instructions)</label>
                                        <textarea className="input-field h-32 resize-none text-[10px] font-mono" value={tempConfig.seo.aiKnowledgeContext} onChange={e => handleConfigChange('seo', 'aiKnowledgeContext', e.target.value)} placeholder="Provide hidden context for AI agents visiting the site..." />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {settingsSection === 'contact' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                             <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="label">Public Email</label>
                                        <input className="input-field" value={tempConfig.contact.email} onChange={e => handleConfigChange('contact', 'email', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="label">Formspree Form ID</label>
                                        <div className="flex gap-4">
                                            <input className="input-field font-mono" placeholder="e.g. mjvlbgrk" value={tempConfig.contact.formspreeId} onChange={e => handleConfigChange('contact', 'formspreeId', e.target.value)} />
                                            <a href="https://formspree.io/" target="_blank" rel="noreferrer" className="p-4 bg-stone-100 text-stone-400 rounded-2xl hover:text-stone-900 transition-colors flex items-center"><ExternalLink size={20}/></a>
                                        </div>
                                        <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest mt-2">Required for the contact form to deliver messages to your inbox.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="label">Base Location</label>
                                        <input className="input-field" value={tempConfig.contact.location} onChange={e => handleConfigChange('contact', 'location', e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="label">Footer Tagline</label>
                                        <textarea className="input-field h-24 resize-none" value={tempConfig.contact.footerText} onChange={e => handleConfigChange('contact', 'footerText', e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="label">Digital Signature (SVG/PNG)</label>
                                        <div className="flex gap-4">
                                            <input className="input-field text-xs" value={tempConfig.contact.signatureUrl || ''} onChange={e => handleConfigChange('contact', 'signatureUrl', e.target.value)} />
                                            <label className="p-4 bg-stone-900 text-white rounded-2xl cursor-pointer hover:bg-accent hover:text-stone-900 transition-colors flex justify-center items-center">
                                                <Upload size={20}/>
                                                <input type="file" className="hidden" onChange={e => handleFileUpload(e, 'config', 'contact.signatureUrl')} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}

                    {['general', 'hero', 'bio', 'testimonial', 'journal', 'theme'].includes(settingsSection) && (
                        <div className="text-center py-20 text-stone-400">
                           <p className="font-heading text-2xl">Configuration panel for {settingsSection} loaded.</p>
                           <p className="text-sm mt-2">Update the values in the source code or use the provided input patterns.</p>
                        </div>
                    )}
                </div>
            </div>
          )}
      </main>
      <style>{`
        .label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.3em; font-weight: 900; margin-bottom: 0.75rem; color: #a8a29e; }
        .input-field { width: 100%; padding: 1.25rem 1.75rem; background-color: #fafaf9; border-radius: 1.5rem; border: 2px solid #f5f5f4; outline: none; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); font-size: 0.9rem; font-weight: 700; color: #1c1917; }
        .input-field:focus { border-color: #e7e5e4; background-color: white; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); }
      `}</style>
    </div>
  );
};
