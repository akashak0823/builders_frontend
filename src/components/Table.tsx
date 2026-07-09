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
            <div className="w-full bg-transparent md:bg-white md:rounded-xl md:border md:border-slate-200 md:shadow-sm md:overflow-hidden">
                <table className="w-full block md:table text-left text-sm text-bluegrey-500">
                    <thead className="hidden md:table-header-group bg-navy-900 text-white uppercase font-bold tracking-wider">
                        <tr>
                            {columns.map((col, idx) => (
                                <th key={idx} className={`px-6 py-4 ${col.className || ''}`}>{col.header}</th>
                            ))}
                            {actions && <th className="px-6 py-4 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="block md:table-row-group divide-y-0 md:divide-y md:divide-slate-100 space-y-4 md:space-y-0">
                        {data.length > 0 ? (
                            data.map((item, idx) => (
                                <tr key={item.id || idx} className="block md:table-row hover:bg-gold-400/5 transition-colors group bg-white rounded-xl border border-slate-200 md:border-none p-4 md:p-0 shadow-sm md:shadow-none mb-4 md:mb-0">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className={`px-1 py-2 md:px-6 md:py-4 font-medium text-navy-900 flex justify-between items-center md:table-cell border-b border-slate-100 md:border-none last:border-b-0 ${col.className || ''}`}>
                                            <span className="md:hidden font-bold text-slate-400 text-[10px] uppercase tracking-wider">{col.header}</span>
                                            <div className="text-right md:text-left">
                                                {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                                            </div>
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-1 py-2 md:px-6 md:py-4 text-right flex justify-between items-center md:table-cell border-none">
                                            <span className="md:hidden font-bold text-slate-400 text-[10px] uppercase tracking-wider">Actions</span>
                                            <div className="flex justify-end">{actions(item)}</div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr className="block md:table-row">
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="block md:table-cell px-6 py-8 text-center text-slate-400 bg-white rounded-xl border border-slate-200 md:border-none">
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
