import { LayoutDashboard, FileText, Package, Settings, User } from 'lucide-react';

export const navItems = [
    {
        label: 'Dashboard',
        path: '/',
        icon: LayoutDashboard,
        permission: 'VIEW_DASHBOARD_BRANCH' // or GLOBAL, handled in component
    },
    {
        label: 'Products',
        path: '/products',
        icon: Package,
        permission: 'VIEW_PRODUCTS'
    },
    {
        label: 'Invoices',
        path: '/invoices',
        icon: FileText,
        permission: 'VIEW_OWN_INVOICES' // Basic invoice access
    },
    {
        label: 'Create Invoice',
        path: '/invoices/new',
        icon: FileText,
        permission: 'CREATE_INVOICE'
    },
    {
        label: 'Settings',
        path: '/settings',
        icon: Settings,
        permission: null // Public or basics
    },
    {
        label: 'Profile',
        path: '/profile',
        icon: User,
        permission: null
    }
];
