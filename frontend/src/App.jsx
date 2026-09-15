import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoutes';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ApplicantDashboard from './pages/ApplicantDashboard';
import ApplicantProfile from './pages/ApplicantProfile';
import MySkills from './pages/MySkills';
import FindInternships from './pages/FindInternships';
import InternshipDetail from './pages/InternshipDetail';
import RecommendedInternships from './pages/RecommendedInternships';
import MyApplications from './pages/MyApplications';
import MyJourney from './pages/MyJourney';
import GetCertified from './pages/GetCertified';
import OrganizationDashboard from './pages/OrganizationDashboard';
import OrganizationProfile from './pages/OrganizationProfile';
import PostInternship from './pages/PostInternship';
import MyInternships from './pages/MyInternships';
import ApplicationsReceived from './pages/ApplicationsReceived';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F4F4F6] text-[#09090B] selection:bg-[#000000] selection:text-white">
      <Navbar />


      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/find-internships" element={<FindInternships />} />
          <Route path="/internship/:id" element={<InternshipDetail />} />

          {/* Applicant Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['applicant']} />}>
            <Route path="/applicant-dashboard" element={<ApplicantDashboard />} />
            <Route path="/profile" element={<ApplicantProfile />} />
            <Route path="/my-skills" element={<MySkills />} />
            <Route path="/recommended" element={<RecommendedInternships />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route path="/my-journey" element={<MyJourney />} />
            <Route path="/get-certified" element={<GetCertified />} />
          </Route>

          {/* Organization Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['organization', 'admin']} />}>
            <Route path="/org-dashboard" element={<OrganizationDashboard />} />
            <Route path="/org-profile" element={<OrganizationProfile />} />
            <Route path="/post-internship" element={<PostInternship />} />
            <Route path="/edit-internship/:id" element={<PostInternship />} />
            <Route path="/my-internships" element={<MyInternships />} />
            <Route path="/applications-received" element={<ApplicationsReceived />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Common Settings Route */}
          <Route element={<ProtectedRoute allowedRoles={['applicant', 'organization', 'admin']} />}>
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
