import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AnimatedCursor } from "@/components/animations/AnimatedCursor";
import { useLenis } from "@/hooks/useLenis";
import RequireOnboarding from "./components/RequireOnboarding";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Learn from "./pages/Learn";
import Courses from "./pages/Courses";
import CourseLevel from "./pages/CourseLevel";
import CourseUnit from "./pages/CourseUnit";
import LessonPlayer from "./pages/LessonPlayer";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import PlacementTest from "./pages/PlacementTest";
import PlacementTestStart from "./pages/PlacementTestStart";
import PlacementTestResult from "./pages/PlacementTestResult";
import LeaderboardPage from "./pages/LeaderboardPage";
import ChallengesPage from "./pages/ChallengesPage";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";
import EmailVerification from "./pages/EmailVerification";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CookiePolicy from "./pages/CookiePolicy";
import SidebarNav from "./components/SidebarNav";

const queryClient = new QueryClient();

// Smooth scroll wrapper
const SmoothScrollProvider = ({ children }: { children: React.ReactNode }) => {
  useLenis();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <SmoothScrollProvider>
            <AnimatedCursor />
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SidebarNav />
              <Routes>
                {/* Public pages - no onboarding required */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsAndConditions />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                
                {/* Protected pages - require onboarding completion */}
                <Route path="/learn" element={<RequireOnboarding><Navigate to="/courses" replace /></RequireOnboarding>} />
                <Route path="/units" element={<RequireOnboarding><Navigate to="/courses" replace /></RequireOnboarding>} />
                <Route path="/learning" element={<RequireOnboarding><Navigate to="/courses" replace /></RequireOnboarding>} />
                <Route path="/courses" element={<RequireOnboarding><Courses /></RequireOnboarding>} />
                <Route path="/courses/:level" element={<RequireOnboarding><CourseLevel /></RequireOnboarding>} />
                <Route path="/courses/:level/:unit" element={<RequireOnboarding><CourseUnit /></RequireOnboarding>} />
                <Route path="/lesson/:lessonId" element={<RequireOnboarding><LessonPlayer /></RequireOnboarding>} />
                <Route path="/placement-test" element={<RequireOnboarding><PlacementTest /></RequireOnboarding>} />
                <Route path="/placement-test/start" element={<RequireOnboarding><PlacementTestStart /></RequireOnboarding>} />
                <Route path="/placement-test/result" element={<RequireOnboarding><PlacementTestResult /></RequireOnboarding>} />
                <Route path="/profile" element={<RequireOnboarding><Profile /></RequireOnboarding>} />
                <Route path="/settings" element={<RequireOnboarding><Settings /></RequireOnboarding>} />
                <Route path="/leaderboard" element={<RequireOnboarding><LeaderboardPage /></RequireOnboarding>} />
                <Route path="/challenges" element={<RequireOnboarding><ChallengesPage /></RequireOnboarding>} />
                <Route path="/notifications" element={<RequireOnboarding><Notifications /></RequireOnboarding>} />
                <Route path="/admin" element={<RequireOnboarding><Admin /></RequireOnboarding>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SmoothScrollProvider>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
