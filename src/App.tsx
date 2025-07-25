import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./pages/Portfolio";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import UserProfilePage from "./pages/UserProfile";
import ProjectList from "./pages/ProjectList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProjectManagement from "./pages/admin/ProjectManagement";
import ContentManagement from "./pages/admin/ContentManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import ContactManagement from "./pages/admin/ContactManagement";
import Analytics from "./pages/admin/Analytics";
import TestimonialManagement from "./pages/admin/TestimonialManagement";
import ProfileManagement from "./pages/admin/ProfileManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<ProjectManagement />} />
          <Route path="/admin/content" element={<ContentManagement />} />
          <Route path="/admin/blog" element={<BlogManagement />} />
          <Route path="/admin/contacts" element={<ContactManagement />} />
          <Route path="/admin/analytics" element={<Analytics />} />
          <Route path="/admin/testimonials" element={<TestimonialManagement />} />
          <Route path="/admin/profile" element={<ProfileManagement />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
