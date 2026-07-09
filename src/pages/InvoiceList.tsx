import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import { Download, Eye } from 'lucide-react';
import { API_URL } from '../config';

const InvoiceList: React.FC = () => {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [filteredInvoices, setFilteredInvoices] = useState<any[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/invoices`)
            .then(res => res.json())
            .then(data => {
                setInvoices(data);
                setFilteredInvoices(data);
            })
            .catch(err => console.error(err));
    }, []);

    const downloadPdf = (id: string) => {
        window.open(`${API_URL}/invoices/${id}/pdf`, '_blank');
    };

    const handleSearch = (query: string) => {
        const lowerQuery = query.toLowerCase();
        const filtered = invoices.filter(invoice => {
            const invoiceNo = (invoice.invoiceNumber || '').toLowerCase();
            const customerName = (invoice.customer?.name || '').toLowerCase();
            const dateStr = new Date(invoice.date).toLocaleDateString().toLowerCase();
            const grandTotalStr = (invoice.grandTotal?.toFixed(2) || '0.00').toLowerCase();
            const statusStr = 'paid'; // All invoices have status PAID

            return invoiceNo.includes(lowerQuery) ||
                customerName.includes(lowerQuery) ||
                dateStr.includes(lowerQuery) ||
                grandTotalStr.includes(lowerQuery) ||
                statusStr.includes(lowerQuery);
        });
        setFilteredInvoices(filtered);
    };

    const openPreview = (invoice: any) => {
        setSelectedInvoice(invoice);
        setIsPreviewOpen(true);
    };

    const columns = [
        { header: 'Invoice No', accessor: 'invoiceNumber' as const },
        { header: 'Customer', accessor: (item: any) => item.customer?.name || 'N/A' },
        { header: 'Date', accessor: (item: any) => new Date(item.date).toLocaleDateString() },
        { header: 'Total (₹)', accessor: (item: any) => item.grandTotal?.toFixed(2) || '0.00' },
        {
            header: 'Status', accessor: (_item: any) => (
                <span className="px-2 py-1 rounded-full text-xs font-bold bg-accent-green/10 text-accent-green">
                    PAID
                </span>
            )
        },
    ];

    return (
        <div>
            <h2 className="text-2xl font-montserrat font-bold text-navy-900 mb-6">Invoices</h2>

            <Table
                data={filteredInvoices}
                columns={columns}
                onSearch={handleSearch}
                searchPlaceholder="Search invoices by any column..."
                actions={(item) => (
                    <div className="flex justify-end space-x-2">
                        <button 
                            onClick={() => openPreview(item)} 
                            className="p-2 text-bluegrey-500 hover:bg-light-100 rounded-full transition-colors" 
                            title="View Preview"
                        >
                            <Eye size={18} />
                        </button>
                        <button 
                            onClick={() => downloadPdf(item._id)} 
                            className="p-2 text-navy-900 hover:bg-gold-400/20 rounded-full transition-colors" 
                            title="Download PDF"
                        >
                            <Download size={18} />
                        </button>
                    </div>
                )}
            />

            <Modal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                title="Invoice Preview"
                maxWidth="max-w-3xl"
            >
                {selectedInvoice && (
                    <div className="space-y-6">
                        {/* Header details */}
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-navy-900">BUILDERS <span className="text-gold-500">BAZAAR</span></h3>
                                <p className="text-xs text-slate-500 mt-1">123 Construction Lane, Business City</p>
                                <p className="text-xs text-slate-500">GSTIN: 29ABCDE1234F1Z5</p>
                            </div>
                            <div className="text-right">
                                <h4 className="text-lg font-bold text-navy-900">INVOICE</h4>
                                <p className="text-sm font-semibold text-gold-500">{selectedInvoice.invoiceNumber}</p>
                                <p className="text-xs text-slate-500">Date: {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</h4>
                            <p className="font-bold text-navy-900">{selectedInvoice.customer?.name || 'Customer'}</p>
                            <p className="text-sm text-slate-600 mt-1">{selectedInvoice.customer?.address || ''}</p>
                            <p className="text-xs text-slate-500 mt-2 font-medium">GSTIN: {selectedInvoice.customer?.gstNumber || 'N/A'}</p>
                        </div>

                        {/* Table of Items */}
                        <div className="overflow-x-auto border border-slate-200 rounded-xl">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-navy-900 text-white text-[10px] uppercase font-bold tracking-wider">
                                        <th className="px-4 py-3">Product</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-4 py-3 text-right">Rate (₹)</th>
                                        <th className="px-4 py-3 text-right">Taxable (₹)</th>
                                        <th className="px-4 py-3 text-center">GST (%)</th>
                                        <th className="px-4 py-3 text-right">GST Amt (₹)</th>
                                        <th className="px-4 py-3 text-right">Total (₹)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {selectedInvoice.items?.map((item: any, idx: number) => {
                                        const rate = Number(item.unitPrice || 0);
                                        const qty = Number(item.quantity || 0);
                                        const taxable = rate * qty;
                                        const gstRate = Number(item.gstRate || 0);
                                        const gstAmt = Number(item.gstAmount || (taxable * gstRate / 100));
                                        const total = Number(item.totalAmount || (taxable + gstAmt));
                                        return (
                                            <tr key={idx} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 font-semibold text-navy-900">{item.productName}</td>
                                                <td className="px-4 py-3 text-center">{qty}</td>
                                                <td className="px-4 py-3 text-right">{rate.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right">{taxable.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-center">{gstRate}%</td>
                                                <td className="px-4 py-3 text-right">{gstAmt.toFixed(2)}</td>
                                                <td className="px-4 py-3 text-right font-bold text-navy-900">{total.toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Financial Totals */}
                        <div className="flex justify-end">
                            <div className="w-64 space-y-2 text-sm">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal:</span>
                                    <span>₹{Number(selectedInvoice.subtotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Total GST:</span>
                                    <span>₹{Number(selectedInvoice.totalGst || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-navy-900 border-t border-slate-200 pt-2 text-lg">
                                    <span>Grand Total:</span>
                                    <span className="text-gold-500">₹{Number(selectedInvoice.grandTotal || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions in Modal */}
                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <button
                                onClick={() => setIsPreviewOpen(false)}
                                className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-100 mr-2 transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => downloadPdf(selectedInvoice._id)}
                                className="px-4 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800 flex items-center transition-colors"
                            >
                                <Download size={16} className="mr-2" /> Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default InvoiceList;
