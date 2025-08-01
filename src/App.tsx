import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";
import UserProfile from "./pages/UserProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProjectManagement from "./pages/admin/ProjectManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import Analytics from "./pages/admin/Analytics";
import TestimonialManagement from "./pages/admin/TestimonialManagement";
import ProfileManagement from "./pages/admin/ProfileManagement";
import NotFound from "./pages/NotFound";
import AdminProtectedRoute from "@/components/admin/AdminProtectedRoute";
import ResetPassword from "./pages/admin/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin/reset-password" element={<ResetPassword />} />
        <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path="/admin/projects" element={<AdminProtectedRoute><ProjectManagement /></AdminProtectedRoute>} />
        <Route path="/admin/content" element={<AdminProtectedRoute><ContentManagement /></AdminProtectedRoute>} />
        <Route path="/admin/blog" element={<AdminProtectedRoute><BlogManagement /></AdminProtectedRoute>} />
        <Route path="/admin/contacts" element={<AdminProtectedRoute><ContactManagement /></AdminProtectedRoute>} />
        <Route path="/admin/analytics" element={<AdminProtectedRoute><Analytics /></AdminProtectedRoute>} />
        <Route path="/admin/testimonials" element={<AdminProtectedRoute><TestimonialManagement /></AdminProtectedRoute>} />
        <Route path="/admin/profile" element={<AdminProtectedRoute><ProfileManagement /></AdminProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
