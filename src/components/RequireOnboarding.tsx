import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RequireOnboardingProps {
  children: React.ReactNode;
}

const RequireOnboarding: React.FC<RequireOnboardingProps> = ({ children }) => {
  const { user, profile, isLoading } = useAuth();

  // Show loading while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is logged in but hasn't completed onboarding, redirect to onboarding
  if (user && profile && !profile.onboarding_completed) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default RequireOnboarding;
