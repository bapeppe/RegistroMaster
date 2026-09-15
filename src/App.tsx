import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';

// Components
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { InstructorDashboard } from './pages/instructor/InstructorDashboard';
import { CourseManagement } from './pages/admin/CourseManagement';
import { UserManagement } from './pages/admin/UserManagement';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole: string }) {
  const currentUser = useStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function MainLayout() {
  const currentUser = useStore((state) => state.currentUser);
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {currentUser && <Navbar />}
      <div className={`flex-1 w-full ${isLoginPage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute allowedRole="admin">
              <CourseManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRole="admin">
              <UserManagement />
            </ProtectedRoute>
          } />
          
          {/* Instructor Routes */}
          <Route path="/instructor" element={
            <ProtectedRoute allowedRole="instructor">
              <InstructorDashboard />
            </ProtectedRoute>
          } />

          {/* Default Route */}
          <Route path="/" element={
            <Navigate to={currentUser ? (currentUser.role === 'admin' ? '/admin' : '/instructor') : '/login'} replace />
          } />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  const isLoading = useStore((state) => state.isLoading);
  const fetchInitialData = useStore((state) => state.fetchInitialData);

  React.useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
