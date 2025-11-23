import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './screens/Home';
import { BatchDashboard } from './screens/BatchDashboard';
import { SubjectDashboard } from './screens/SubjectDashboard';

// Admin Imports
import { AdminLayout } from './screens/AdminLayout';
import { AdminDashboard } from './screens/AdminDashboard';
import { AdminBatches } from './screens/AdminBatches';
import { AdminSubjects } from './screens/AdminSubjects';
import { AdminContent } from './screens/AdminContent';
import { AdminStudents } from './screens/AdminStudents';
import { AdminSettings } from './screens/AdminSettings';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Home />} />
          <Route path="batch/:batchId" element={<BatchDashboard />} />
          <Route path="batch/:batchId/subject/:subjectId" element={<SubjectDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
           <Route index element={<AdminDashboard />} />
           <Route path="batches" element={<AdminBatches />} />
           <Route path="subjects" element={<AdminSubjects />} />
           <Route path="lectures" element={<AdminContent />} />
           <Route path="notes" element={<AdminContent />} />
           <Route path="students" element={<AdminStudents />} />
           <Route path="analytics" element={<AdminDashboard />} /> {/* Reusing Dashboard for Analytics mock */}
           <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
