import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { navItems } from '../config/nav';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const { user, logout, hasPermission } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const filteredNavItems = navItems.filter(item => {
        if (!item.permission) return true; // No permission required
        return hasPermission(item.permission);
    });

    return (
        <div className="flex h-screen bg-light-100 text-navy-900 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-navy-900 flex flex-col shadow-2xl z-20 relative">
                {/* Logo Section */}
                <div className="p-8 flex flex-col items-center border-b border-navy-800/50">
                    <div className="w-24 h-24 bg-white rounded-2xl p-2 shadow-lg mb-4 flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                        <img
                            src="/logo.png"
                            alt="builders bazaar Logo"
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                // Fallback if image fails
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
                    {filteredNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;
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
                                    <Icon size={20} />
                                </span>
                                <span className="relative z-10">{item.label}</span>

                                {/* Active Indicator Bar */}
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
                <header className="h-20 bg-light-100/80 backdrop-blur-md flex items-center justify-between px-10 z-10">
                    <div>
                        <h2 className="text-2xl font-montserrat font-bold text-navy-900">
                            {navItems.find(i => i.path === location.pathname)?.label || (location.pathname === '/profile' ? 'Profile' : 'Dashboard')}
                        </h2>
                        <p className="text-sm text-bluegrey-500">Welcome back, {user?.name || 'User'}</p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
                            <div className="w-10 h-10 rounded-full bg-navy-900 flex items-center justify-center text-gold-400 font-bold shadow-md">
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-navy-900">{user?.name || 'User'}</p>
                                <p className="text-xs text-bluegrey-500">{user?.role?.name || 'Guest'}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-10">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
