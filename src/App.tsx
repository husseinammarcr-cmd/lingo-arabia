import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Learn from "./pages/Learn";
import Courses from "./pages/Courses";
import CourseLevel from "./pages/CourseLevel";
import CourseUnit from "./pages/CourseUnit";
import LessonPlayer from "./pages/LessonPlayer";
import Onboarding from "./pages/Onboarding";
import Profile from "./pages/Profile";
import Premium from "./pages/Premium";
import PlacementTest from "./pages/PlacementTest";
import PlacementTestStart from "./pages/PlacementTestStart";
import PlacementTestResult from "./pages/PlacementTestResult";
import LeaderboardPage from "./pages/LeaderboardPage";
import ChallengesPage from "./pages/ChallengesPage";
import Notifications from "./pages/Notifications";
import Admin from "./pages/Admin";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/learn" element={<Navigate to="/courses" replace />} />
              <Route path="/units" element={<Navigate to="/courses" replace />} />
              <Route path="/learning" element={<Navigate to="/courses" replace />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:level" element={<CourseLevel />} />
              <Route path="/courses/:level/:unit" element={<CourseUnit />} />
              <Route path="/lesson/:lessonId" element={<LessonPlayer />} />
              <Route path="/placement-test" element={<PlacementTest />} />
              <Route path="/placement-test/start" element={<PlacementTestStart />} />
              <Route path="/placement-test/result" element={<PlacementTestResult />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Analytics />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
