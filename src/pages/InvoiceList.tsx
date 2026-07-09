import React, { useState, useEffect } from 'react';
import Table from '../components/Table';
import { Download, Eye } from 'lucide-react';
import { API_URL } from '../config';

const InvoiceList: React.FC = () => {
    const [invoices, setInvoices] = useState<any[]>([]);

    useEffect(() => {
        fetch(`${API_URL}/invoices`)
            .then(res => res.json())
            .then(data => setInvoices(data))
            .catch(err => console.error(err));
    }, []);

    const downloadPdf = (id: string) => {
        window.open(`${API_URL}/invoices/${id}/pdf`, '_blank');
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
                data={invoices}
                columns={columns}
                onSearch={(q) => console.log(q)}
                searchPlaceholder="Search by customer or invoice no..."
                actions={(item) => (
                    <div className="flex justify-end space-x-2">
                        <button className="p-2 text-bluegrey-500 hover:bg-light-100 rounded-full transition-colors" title="View">
                            <Eye size={18} />
                        </button>
                        <button onClick={() => downloadPdf(item._id)} className="p-2 text-navy-900 hover:bg-gold-400/20 rounded-full transition-colors" title="Download PDF">
                            <Download size={18} />
                        </button>
                    </div>
                )}
            />
        </div>
    );
};

export default InvoiceList;
