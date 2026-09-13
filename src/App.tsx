import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  const currentUser = useStore((state) => state.currentUser);
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
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {currentUser && <Navbar />}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 sm:pb-8">
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

            {/* Root Redirect */}
            <Route path="/" element={
              currentUser ? (
                <Navigate to={currentUser.role === 'admin' ? '/admin' : '/instructor'} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
