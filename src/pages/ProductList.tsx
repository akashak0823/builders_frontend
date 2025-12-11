import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Plus, Edit, Trash2, Minus } from 'lucide-react';



const ProductList: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        fetch('http://localhost:5000/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch(err => console.error(err));
    };

    const handleSearch = (query: string) => {
        const lowerQuery = query.toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(lowerQuery) ||
            product.productId.toLowerCase().includes(lowerQuery)
        );
        setFilteredProducts(filtered);
    };

    const handleStockToggle = async (product: any) => {
        try {
            const updatedProduct = { ...product, inStock: !product.inStock };
            await fetch(`http://localhost:5000/products/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const handleQuantityChange = async (product: any, change: number) => {
        const newQuantity = product.quantity + change;
        if (newQuantity < 0) return;

        try {
            const updatedProduct = { ...product, quantity: newQuantity };
            await fetch(`http://localhost:5000/products/${product._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        { header: 'Product ID', accessor: 'productId' as const },
        { header: 'Name', accessor: 'name' as const },
        { header: 'Category', accessor: 'category' as const },
        {
            header: 'Quantity',
            accessor: (item: any) => (
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleQuantityChange(item, -1)}
                        className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        disabled={item.quantity <= 0}
                    >
                        <Minus size={14} />
                    </button>
                    <span className="font-bold w-8 text-center">{item.quantity}</span>
                    <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            )
        },
        { header: 'Unit', accessor: 'unit' as const },
        { header: 'Base Price (₹)', accessor: 'basePrice' as const },
        { header: 'GST (%)', accessor: 'gstRate' as const },
        {
            header: 'Stock Status',
            accessor: (item: any) => (
                <button
                    onClick={() => handleStockToggle(item)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${item.inStock
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                >
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                </button>
            )
        },
    ];

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const res = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            setImageUrl(data.url);
            setUploading(false);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const productData = {
            name: formData.get('name') as string,
            productId: formData.get('productId') as string,
            image: imageUrl,
            category: formData.get('category') as string,
            quantity: Number(formData.get('quantity')),
            unit: formData.get('unit') as string,
            basePrice: Number(formData.get('basePrice')),
            gstRate: Number(formData.get('gstRate')),
        };

        try {
            if (currentProduct) {
                await fetch(`http://localhost:5000/products/${currentProduct._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            } else {
                await fetch('http://localhost:5000/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }
            fetchProducts();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            await fetch(`http://localhost:5000/products/${id}`, { method: 'DELETE' });
            fetchProducts();
        }
    };

    const openModal = (product: any = null) => {
        setCurrentProduct(product);
        setImageUrl(product?.image || '');
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-montserrat font-bold text-navy-900">Products</h2>
                <button
                    onClick={() => openModal()}
                    className="flex items-center px-4 py-2 bg-gold-400 text-navy-900 font-bold rounded-lg hover:bg-gold-500 transition-colors shadow-md"
                >
                    <Plus size={20} className="mr-2" />
                    Add Product
                </button>
            </div>

            <Table
                data={filteredProducts}
                columns={columns}
                onSearch={handleSearch}
                actions={(item) => (
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => openModal(item)} className="p-2 text-navy-900 hover:bg-gold-400/20 rounded-full transition-colors">
                            <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </div>
                )}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={currentProduct ? 'Edit Product' : 'Add Product'}
            >
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Product ID</label>
                            <input name="productId" defaultValue={currentProduct?.productId} type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                            <input name="name" defaultValue={currentProduct?.name} type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Product Image</label>
                        <div className="flex items-center space-x-4">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-gold-50 file:text-gold-700
                                    hover:file:bg-gold-100"
                            />
                            {uploading && <span className="text-sm text-slate-500">Uploading...</span>}
                            {imageUrl && (
                                <img src={imageUrl} alt="Preview" className="h-10 w-10 object-cover rounded-lg" />
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <input name="category" defaultValue={currentProduct?.category} type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                            <input name="quantity" defaultValue={currentProduct?.quantity} type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                            <input name="unit" defaultValue={currentProduct?.unit} type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Base Price</label>
                            <input name="basePrice" defaultValue={currentProduct?.basePrice} type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">GST Rate (%)</label>
                        <input name="gstRate" defaultValue={currentProduct?.gstRate} type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg mr-2">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ProductList;
