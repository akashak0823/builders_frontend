import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { IndianRupee, Package, FileText, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
    totalRevenue: number;
    totalInvoices: number;
    totalProducts: number;
    recentInvoices: any[];
}

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats>({
        totalRevenue: 0,
        totalInvoices: 0,
        totalProducts: 0,
        recentInvoices: []
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('https://builders-backend-ghve.onrender.com/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div>
            {/* Welcome Section with Logo */}
            <div className="mb-10 flex items-center bg-navy-900 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-navy-800 to-transparent opacity-50"></div>
                <div className="absolute -right-10 -bottom-20 w-64 h-64 rounded-full blur-3xl opacity-20"></div>

                <div className="relative z-10 flex items-center">

                    <div>
                        <h2 className="text-3xl font-montserrat font-bold text-white mb-2">
                            Welcome to <span className="text-gold-400">Builders Bazaar</span>
                        </h2>
                        <p className="text-slate-300 max-w-xl">
                            Manage your construction materials, invoices, and billing with our
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <Card className="relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <IndianRupee size={100} className="text-navy-900" />
                    </div>
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-xl bg-gold-400/20 text-gold-500 mr-4">
                            <IndianRupee size={24} />
                        </div>
                        <p className="text-sm text-bluegrey-500 font-bold uppercase tracking-wider">Total sales</p>
                    </div>
                    <h3 className="text-3xl font-montserrat font-bold text-navy-900">₹{stats.totalRevenue.toLocaleString()}</h3>
                    <div className="mt-4 flex items-center text-accent-green text-sm font-medium">
                        <TrendingUp size={16} className="mr-1" />
                        <span>+12.5% from last month</span>
                    </div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={100} className="text-navy-900" />
                    </div>
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-xl bg-navy-900/10 text-navy-900 mr-4">
                            <FileText size={24} />
                        </div>
                        <p className="text-sm text-bluegrey-500 font-bold uppercase tracking-wider">Total Invoices</p>
                    </div>
                    <h3 className="text-3xl font-montserrat font-bold text-navy-900">{stats.totalInvoices}</h3>
                    <div className="mt-4 flex items-center text-accent-green text-sm font-medium">
                        <TrendingUp size={16} className="mr-1" />
                        <span>+5 new today</span>
                    </div>
                </Card>

                <Card className="relative overflow-hidden group">
                    <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Package size={100} className="text-navy-900" />
                    </div>
                    <div className="flex items-center mb-4">
                        <div className="p-3 rounded-xl bg-brown-500/10 text-brown-500 mr-4">
                            <Package size={24} />
                        </div>
                        <p className="text-sm text-bluegrey-500 font-bold uppercase tracking-wider">Total Products</p>
                    </div>
                    <h3 className="text-3xl font-montserrat font-bold text-navy-900">{stats.totalProducts}</h3>
                    <div className="mt-4 flex items-center text-bluegrey-500 text-sm font-medium">
                        <span>In Stock</span>
                    </div>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Recent Invoices">
                    <div className="space-y-4">
                        {stats.recentInvoices.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No recent invoices found.</p>
                        ) : (
                            stats.recentInvoices.map((invoice) => (
                                <div key={invoice._id} className="flex items-center justify-between p-4 rounded-lg bg-light-100 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-200 cursor-pointer">
                                    <div className="flex items-center">
                                        <div className="w-10 h-10 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center font-bold text-xs mr-4">
                                            INV
                                        </div>
                                        <div>
                                            <p className="font-bold text-navy-900">{invoice.invoiceNumber}</p>
                                            <p className="text-xs text-bluegrey-500">{invoice.customer.name}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-navy-900">₹{invoice.grandTotal.toLocaleString()}</p>
                                        <span className="text-xs font-bold text-accent-green bg-accent-green/10 px-2 py-1 rounded-full">PAID</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                <Card title="Quick Actions">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => navigate('/invoices/new')}
                            className="p-6 rounded-xl bg-navy-900 text-white hover:bg-navy-800 hover:-translate-y-1 transition-all shadow-lg flex flex-col items-center justify-center group"
                        >
                            <FileText size={32} className="mb-3 text-gold-400 group-hover:scale-110 transition-transform" />
                            <span className="font-bold">New Invoice</span>
                        </button>
                        <button
                            onClick={() => navigate('/products')}
                            className="p-6 rounded-xl bg-white border border-slate-200 text-navy-900 hover:border-gold-400 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center group"
                        >
                            <Package size={32} className="mb-3 text-brown-500 group-hover:scale-110 transition-transform" />
                            <span className="font-bold">Add Product</span>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
