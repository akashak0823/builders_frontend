import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Plus, Trash2, Save, ShoppingCart, FileText, Search } from 'lucide-react';
import axios from 'axios';
// import { useAuth } from '../context/AuthContext'; // Unused for now

const InvoiceCreate: React.FC = () => {
    // const { user } = useAuth(); 

    const [customer, setCustomer] = useState({ name: '', address: '', gstNumber: '' });
    const [items, setItems] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('https://builders-backend-ghve.onrender.com/products')
            .then(res => {
                const availableProducts = res.data.filter((p: any) => p.inStock && p.quantity > 0);
                setProducts(availableProducts);
                setFilteredProducts(availableProducts);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(lowerQuery) ||
            (product.productId && product.productId.toLowerCase().includes(lowerQuery))
        );
        setFilteredProducts(filtered);
    };

    const addToInvoice = (product: any) => {
        const existingItem = items.find(item => item.productId === product._id);
        if (existingItem) {
            setItems(items.map(item =>
                item.productId === product._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setItems([...items, {
                productId: product._id,
                productName: product.name,
                hsnCode: product.hsnCode,
                quantity: 1,
                unitPrice: product.basePrice,
                gstRate: product.gstRate
            }]);
        }
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const updateItem = (index: number, field: string, value: any) => {
        setItems(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
    };

    const calculateTotal = () => {
        return items.reduce((acc, item) => {
            const base = item.quantity * item.unitPrice;
            const gst = base * (item.gstRate / 100);
            return acc + base + gst;
        }, 0);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://builders-backend-ghve.onrender.com/invoices', { customer, items });

            alert('Invoice Created Successfully!');
            // Reset form
            setCustomer({ name: '', address: '', gstNumber: '' });
            setItems([]);
            // Download PDF
            window.open(`https://builders-backend-ghve.onrender.com/invoices/${res.data._id}/pdf`, '_blank');
        } catch (error) {
            console.error(error);
            alert('Error creating invoice');
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
            {/* Left Side: Product Grid */}
            <div className="lg:w-1/2 overflow-y-auto pr-2">
                <div className="sticky top-0 bg-light-100 py-2 z-50 mb-4">
                    <h2 className="text-xl font-montserrat font-bold text-navy-900 mb-4">Select Products</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by Product ID or Name..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                </div>
                {loading ? (
                    <p>Loading products...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4">
                        {filteredProducts.map(product => (
                            <div key={product._id} className="layer-3d p-4 group cursor-pointer hover:border-gold-400 relative overflow-hidden flex flex-col h-full min-h-[160px]" onClick={() => addToInvoice(product)}>
                                <div className="flex justify-between items-start h-full gap-2">
                                    <div className="flex flex-col justify-between h-full z-10 flex-1">
                                        <div>
                                            <span className="text-xs font-bold bg-bluegrey-500/10 text-bluegrey-500 px-2 py-1 rounded-full inline-block mb-3">
                                                {product.category}
                                            </span>
                                            <h3 className="font-bold text-navy-900 mb-1 text-lg leading-tight line-clamp-2">{product.name}</h3>
                                        </div>
                                        <div className="mt-2">
                                            <p className="text-xs text-slate-500">Price per {product.unit}</p>
                                            <p className="text-lg font-bold text-gold-500">₹{product.basePrice}</p>
                                        </div>
                                    </div>

                                    <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center self-center">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} className="w-full h-full object-contain rounded-lg" />
                                        ) : (
                                            <div className="w-full h-full bg-navy-900/5 rounded-lg flex items-center justify-center">
                                                <ShoppingCart size={24} className="text-navy-900/20" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gold-400 text-navy-900 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 z-20">
                                    <Plus size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Side: Invoice Form */}
            <div className="lg:w-1/2 flex flex-col h-full">
                <Card className="flex-1 flex flex-col overflow-hidden !p-0 border-t-4 border-gold-400">
                    <div className="p-6 border-b border-slate-100 bg-white">
                        <h2 className="text-xl font-montserrat font-bold text-navy-900 flex items-center">
                            <FileText className="mr-2 text-gold-400" /> New Invoice
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Customer Details */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-bluegrey-500 uppercase tracking-wider">Customer Details</h3>
                            <div className="grid grid-cols-1 gap-4">
                                <input
                                    type="text"
                                    placeholder="Customer Name"
                                    value={customer.name}
                                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
                                    required
                                />
                                <textarea
                                    placeholder="Address"
                                    value={customer.address}
                                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
                                    rows={2}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="GSTIN (Optional)"
                                    value={customer.gstNumber}
                                    onChange={e => setCustomer({ ...customer, gstNumber: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-400"
                                />
                            </div>
                        </div>

                        {/* Selected Items */}
                        <div>
                            <h3 className="text-sm font-bold text-bluegrey-500 uppercase tracking-wider mb-4">Selected Items ({items.length})</h3>
                            {items.length === 0 ? (
                                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl text-slate-400">
                                    <ShoppingCart size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>Select products from the grid</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <div className="flex-1">
                                                <p className="font-bold text-navy-900 text-sm">{item.productName}</p>
                                                <p className="text-xs text-slate-500">₹{item.unitPrice} x {item.quantity}</p>
                                            </div>
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                                    className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-sm text-center"
                                                />
                                                <div className="text-right w-20">
                                                    <p className="font-bold text-navy-900 text-sm">₹{((item.quantity * item.unitPrice) * (1 + item.gstRate / 100)).toFixed(0)}</p>
                                                </div>
                                                <button onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-navy-900 text-white mt-auto">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-slate-400">Grand Total</span>
                            <span className="text-2xl font-bold text-gold-400">₹{calculateTotal().toFixed(2)}</span>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={items.length === 0 || !customer.name}
                            className="w-full py-4 bg-gold-400 text-navy-900 font-bold rounded-xl hover:bg-gold-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            <Save size={20} className="mr-2" />
                            Generate Invoice
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default InvoiceCreate;
