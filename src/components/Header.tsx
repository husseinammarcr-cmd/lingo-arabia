import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Star, Crown, LogOut, ChevronLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

interface HeaderProps {
  showBack?: boolean;
  showUserInfo?: boolean;
  showAuthButton?: boolean;
}

const Header = ({ showBack = false, showUserInfo = false, showAuthButton = false }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-5 h-5 rotate-180" />
            </Button>
          )}
          <a href="/" className="flex items-center flex-shrink-0">
            <img 
              src={logo} 
              alt="LingoArab Logo" 
              className="h-12 md:h-10 w-auto"
            />
          </a>
        </div>
        
        <div className="flex items-center gap-3">
          {showUserInfo && profile && (
            <>
              <div className="flex items-center gap-1 bg-xp/10 text-xp px-3 py-1.5 rounded-full font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{profile.xp || 0}</span>
              </div>
              {profile.is_premium && <Crown className="w-5 h-5 text-accent fill-accent" />}
            </>
          )}
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          
          {showUserInfo && user && (
            <>
              <Button variant="ghost" size="icon" onClick={() => navigate('/profile')}>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {profile?.name?.charAt(0) || 'U'}
                </div>
              </Button>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </>
          )}
          
          {showAuthButton && !user && (
            <Button variant="outline" onClick={() => navigate('/auth')}>
              تسجيل الدخول
            </Button>
          )}
          
          {showAuthButton && user && (
            <Button variant="default" onClick={() => navigate('/courses')}>
              تابع التعلم
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
