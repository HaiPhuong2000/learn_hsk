import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Book, Layers, Gamepad2, Menu, X, ChevronDown } from 'lucide-react';

// Create a custom event for level changes
export const LEVEL_CHANGE_EVENT = 'hsk-level-change';

export const getStoredLevel = (): number => {
  const stored = localStorage.getItem('hsk-level');
  return stored ? parseInt(stored) : 1;
};

export const setStoredLevel = (level: number) => {
  localStorage.setItem('hsk-level', level.toString());
  window.dispatchEvent(new CustomEvent(LEVEL_CHANGE_EVENT, { detail: level }));
};

const Layout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(getStoredLevel());
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);

  useEffect(() => {
    const handleLevelChange = (e: CustomEvent) => {
      setCurrentLevel(e.detail);
    };

    window.addEventListener(LEVEL_CHANGE_EVENT as any, handleLevelChange);
    return () => {
      window.removeEventListener(LEVEL_CHANGE_EVENT as any, handleLevelChange);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleLevelSelect = (level: number) => {
    setStoredLevel(level);
    setIsLevelMenuOpen(false);
  };

  const navItems = [
    { path: '/vocabulary', label: 'Từ vựng', icon: <Book size={20} /> },
    { path: '/flashcards', label: 'Thẻ ghi nhớ', icon: <Layers size={20} /> },
    { path: '/grammar', label: 'Ngữ pháp', icon: <Book size={20} /> },
    { path: '/exercises', label: 'Bài tập', icon: <Gamepad2 size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-teal-600/20 blur-[120px]" />
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight shrink-0">
              <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">HSK Master</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-indigo-400 ${
                      location.pathname === item.path ? 'text-indigo-400' : 'text-slate-400'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
              
              {/* Level Selector */}
              <div className="relative ml-4 border-l border-white/10 pl-6">
                <button 
                  onClick={() => setIsLevelMenuOpen(!isLevelMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium text-slate-200"
                >
                  <span>HSK {currentLevel}</span>
                  <ChevronDown size={14} />
                </button>
                
                {isLevelMenuOpen && (
                  <div className="absolute right-0 mt-2 w-32 py-1 rounded-lg bg-slate-800 border border-white/10 shadow-xl animate-in fade-in zoom-in-95 duration-200 z-50">
                    {[1, 2, 3, 4, 5, 6].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleLevelSelect(level)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors ${
                          currentLevel === level ? 'text-indigo-400 bg-white/5' : 'text-slate-300'
                        }`}
                      >
                        HSK {level}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-400 hover:text-white" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-xl absolute w-full left-0">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 text-base font-medium p-2 rounded-lg ${
                    location.pathname === item.path ? 'bg-white/10 text-indigo-400' : 'text-slate-400'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              
              <div className="border-t border-white/10 pt-4">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Trình độ</div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        handleLevelSelect(level);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                        currentLevel === level 
                          ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400' 
                          : 'border-white/10 bg-white/5 text-slate-400'
                      }`}
                    >
                      HSK {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
        <Outlet />
      </main>
    </div>
  );
};



export default Layout;
