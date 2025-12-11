import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import InvoiceCreate from './pages/InvoiceCreate';
import InvoiceList from './pages/InvoiceList';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/" element={
                        <ProtectedRoute requiredPermission="VIEW_DASHBOARD_BRANCH">
                            {/* Note: VIEW_DASHBOARD_BRANCH is minimum for dashboard, inside we check global/local */}
                            <Layout>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/products" element={
                        <ProtectedRoute requiredPermission="VIEW_PRODUCTS">
                            <Layout>
                                <ProductList />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/invoices" element={
                        <ProtectedRoute requiredPermission="VIEW_OWN_INVOICES">
                            <Layout>
                                <InvoiceList />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/invoices/new" element={
                        <ProtectedRoute requiredPermission="CREATE_INVOICE">
                            <Layout>
                                <InvoiceCreate />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/settings" element={
                        <ProtectedRoute>
                            <Layout>
                                <Settings />
                            </Layout>
                        </ProtectedRoute>
                    } />

                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Layout>
                                <Profile />
                            </Layout>
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
