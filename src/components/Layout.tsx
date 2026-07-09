import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, FileText, List, LogOut, User, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Close sidebar on path change (mobile screen navigation)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { name: 'Products', path: '/products', icon: <Package size={20} /> },
        { name: 'Create Invoice', path: '/invoices/new', icon: <FileText size={20} /> },
        { name: 'Invoices', path: '/invoices', icon: <List size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-light-100 text-navy-900 font-sans overflow-hidden">
            {/* Mobile Sidebar Backdrop Overlay */}
            <div 
                className={`fixed inset-0 bg-navy-950/40 backdrop-blur-sm z-20 transition-opacity duration-300 lg:hidden ${
                    isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`} 
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar */}
            <aside 
                className={`w-72 bg-navy-900 flex flex-col shadow-2xl z-30 fixed inset-y-0 left-0 transition-transform duration-300 transform lg:static lg:translate-x-0 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo Section */}
                <div className="p-8 flex flex-col items-center border-b border-navy-800/50 relative">
                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg"
                    >
                        <X size={20} />
                    </button>

                    <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-lg mb-4 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                        <img
                            src="/logo.png"
                            alt="builders bazaar Logo"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerText = 'LOGO';
                            }}
                        />
                    </div>
                    <h1 className="text-xl font-montserrat font-bold text-white tracking-wider text-center">
                        BUILDERS <span className="text-gold-400">BAZAAR</span>
                    </h1>
                    <p className="text-xs text-white mt-1 uppercase tracking-widest">Billing Software</p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 mt-8 space-y-3 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-6 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                                    ? 'bg-gold-400 text-navy-900 shadow-lg font-bold transform translate-x-2'
                                    : 'text-slate-300 hover:bg-navy-800 hover:text-white hover:translate-x-1'
                                    }`}
                            >
                                <span className={`mr-4 relative z-10 ${isActive ? 'text-navy-900' : 'text-slate-400 group-hover:text-gold-400'}`}>
                                    {item.icon}
                                </span>
                                <span className="relative z-10">{item.name}</span>

                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-navy-900/20"></div>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-6 border-t border-navy-800/50 bg-navy-900">
                    <Link to="/profile" className="flex items-center px-4 py-3 w-full text-slate-400 hover:bg-navy-800 hover:text-white rounded-xl transition-colors mb-2">
                        <User size={20} className="mr-3" />
                        <span className="font-medium">Profile</span>
                    </Link>
                    <Link to="/settings" className="flex items-center px-4 py-3 w-full text-slate-400 hover:bg-navy-800 hover:text-white rounded-xl transition-colors mb-2">
                        <Settings size={20} className="mr-3" />
                        <span className="font-medium">Settings</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center px-4 py-3 w-full text-accent-brick hover:bg-accent-brick/10 hover:text-red-400 rounded-xl transition-colors">
                        <LogOut size={20} className="mr-3" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-navy-900/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                {/* Header */}
                <header className="h-20 bg-light-100/80 backdrop-blur-md flex items-center justify-between px-4 md:px-10 z-10 border-b border-slate-200">
                    <div className="flex items-center">
                        {/* Hamburger Button */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 text-navy-900 hover:bg-slate-200 rounded-lg mr-3 transition-colors"
                        >
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className="text-lg md:text-2xl font-montserrat font-bold text-navy-900 leading-tight">
                                {navItems.find(i => i.path === location.pathname)?.name || (location.pathname === '/profile' ? 'Profile' : 'Dashboard')}
                            </h2>
                            <p className="text-xs md:text-sm text-bluegrey-500">Welcome back, {user?.name || 'User'}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 bg-white px-3 py-1.5 md:px-4 md:py-2 rounded-full shadow-sm border border-slate-200">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-navy-900 flex items-center justify-center text-gold-400 font-bold shadow-md">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="text-right hidden sm:block">
                                <p className="text-xs md:text-sm font-bold text-navy-900">{user?.name || 'User'}</p>
                                <p className="text-[10px] md:text-xs text-bluegrey-500">{user?.role || 'Guest'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
