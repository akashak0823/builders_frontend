import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, onClick }) => {
    return (
        <div onClick={onClick} className={`layer-3d p-6 ${className}`}>
            {title && <h3 className="text-lg font-montserrat font-bold text-navy-900 mb-4 border-b border-slate-100 pb-2">{title}</h3>}
            {children}
        </div>
    );
};

export default Card;
