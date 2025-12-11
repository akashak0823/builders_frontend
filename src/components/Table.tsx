import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    onSearch?: (query: string) => void;
    searchPlaceholder?: string;
    actions?: (item: T) => React.ReactNode;
}

function Table<T extends { id?: string | number }>({ data, columns, onSearch, searchPlaceholder = "Search...", actions }: TableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearch) onSearch(query);
    };

    return (
        <div className="w-full">
            {onSearch && (
                <div className="mb-6 relative">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                    />
                    <Search className="absolute left-4 top-3.5 text-bluegrey-500" size={20} />
                </div>
            )}
            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">
                <table className="w-full text-left text-sm text-bluegrey-500">
                    <thead className="bg-navy-900 text-white uppercase font-bold tracking-wider">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={`px-6 py-4 ${col.className || ''}`}>{col.header}</th>
                            ))}
                            {actions && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.length > 0 ? (
                            data.map((item, idx) => (
                                <tr key={item.id || idx} className="hover:bg-gold-400/5 transition-colors group">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className={`px-6 py-4 font-medium text-navy-900 ${col.className || ''}`}>
                                            {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                                        </td>
                                    ))}
                                    {actions && <td className="px-6 py-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">{actions(item)}</td>}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-8 text-center text-slate-400">
                                    No data found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Table;
