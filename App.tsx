import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Contact from './pages/Contact';
import AIFinder from './pages/AIFinder';
import About from './pages/About';
import Manufacturing from './pages/Manufacturing';
import Industrial from './pages/Industrial';
import OEMPlatform from './pages/OEMPlatform';
import Blog from './pages/Blog';
import Careers from './pages/Careers';
import BlogDetail from './pages/BlogDetail';

// Admin Components (Professional Suite)
import AdminLogin from './pages/Admin/Login';
import AdminLayout from './components/AdminLayout';
import DashboardHome from './pages/Admin/Dashboard';
import ProductManager from './pages/Admin/ProductList';
import Enquiries from './pages/Admin/Enquiries';
import AddProduct from './pages/Admin/AddProduct';
import JobsList from './pages/Admin/JobsList';
// import AdminShell from './pages/Admin/AdminShell'; // Likely not needed if using AdminLayout, or use as Layout
import AddBlog from './pages/Admin/AddBlog';
import BlogList from './pages/Admin/BlogList';
import ManageCategories from './pages/Admin/ManageCategories';

// Contexts & Auth
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import ProtectedRoute from './components/ProtectedRoute';

const { BrowserRouter: Router, Routes, Route, Navigate } = ReactRouterDOM;

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <ScrollToTop />
          
          <Routes>

            {/* --- Public Website Routes --- */}
            <Route path="/" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Home /></main><Footer /></div></>} />
            <Route path="/about" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><About /></main><Footer /></div></>} />
            <Route path="/products" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Products /></main><Footer /></div></>} />
            <Route path="/product/:slug" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><ProductDetail /></main><Footer /></div></>} />
            <Route path="/manufacturing" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Manufacturing /></main><Footer /></div></>} />
            <Route path="/industrial" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Industrial /></main><Footer /></div></>} />
            <Route path="/contact" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Contact /></main><Footer /></div></>} />
            <Route path="/ai-finder" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><AIFinder /></main><Footer /></div></>} />
            <Route path="/oem-platform" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><OEMPlatform /></main><Footer /></div></>} />
            <Route path="/careers" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Careers /></main><Footer /></div></>} />

            {/* --- Blog Public Routes (Fixed) --- */}
            {/* Note: Changed /Blog to /blog for consistency */}
            <Route path="/blog" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><Blog /></main><Footer /></div></>} />
            {/* Added Blog Detail here so the public can read it */}
            <Route path="/blog/:id" element={<><Navbar /><div className="flex flex-col min-h-screen"><main className="flex-grow pt-16"><BlogDetail /></main><Footer /></div></>} />


            {/* --- Admin Login --- */}
            <Route path="/admin/login" element={<AdminLogin />} />
            

            {/* --- Secure Admin Panel --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                
                {/* Default redirect */}
                <Route index element={<Navigate to="dashboard" replace />} />
                
                {/* Admin Pages (Notice: NO leading slashes here) */}
                <Route path="dashboard" element={<DashboardHome />} />
                <Route path="products" element={<ProductManager />} />
                <Route path="products/new" element={<AddProduct />} />
                <Route path="products/edit/:id" element={<AddProduct />} />
                <Route path="categories" element={<ManageCategories />} />
                <Route path="jobs" element={<JobsList />} />
                <Route path="enquiries" element={<Enquiries />} />
                
                {/* Fixed Blog Admin Routes */}
                <Route path="edit-blog/:id" element={<AddBlog />} />
                {/* This allows you to go to /admin/add-blog */}
                <Route path="add-blog" element={<AddBlog />} />
                <Route path="blogs" element={<BlogList />} />
                <Route path="/admin" element={<AdminLayout />}></Route>
                
                {/* If you wanted to view the blog INSIDE admin, use these (no leading slash): */}
                {/* <Route path="blog" element={<Blog />} /> */}
                
              </Route>
            </Route>

            {/* --- 404 Fallback --- */}
            <Route path="*" element={<Navigate to="/" replace />} />
          
          </Routes>
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
};

export default App;