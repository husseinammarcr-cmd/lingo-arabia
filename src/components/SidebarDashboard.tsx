import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logoAsset from '@/assets/lingoarab-logo.png.asset.json';
import './SidebarDashboard.css';

interface NavItem {
  labelAr: string;
  href: string;
  icon: string; // FontAwesome class
  requiresAuth?: boolean;
  hideWhenAuth?: boolean;
}

const PUBLIC_ITEMS: NavItem[] = [
  { labelAr: 'الرئيسية', href: '/', icon: 'fa-solid fa-house' },
];

const AUTH_ITEMS: NavItem[] = [
  { labelAr: 'AI Speaking', href: '/ai-tutor', icon: 'fa-solid fa-microphone', requiresAuth: true },
  { labelAr: 'لوحة التحكم', href: '/app/courses', icon: 'fa-solid fa-table-cells-large', requiresAuth: true },
  { labelAr: 'نقاط الضعف', href: '/app/weak-points', icon: 'fa-solid fa-brain', requiresAuth: true },
  { labelAr: 'الملف الشخصي', href: '/profile', icon: 'fa-regular fa-user', requiresAuth: true },
  { labelAr: 'الإعدادات', href: '/settings', icon: 'fa-solid fa-gear', requiresAuth: true },
  { labelAr: 'الشهادة', href: '/certificate', icon: 'fa-solid fa-award', requiresAuth: true },
];

const GUEST_ITEMS: NavItem[] = [
  { labelAr: 'تسجيل الدخول', href: '/auth', icon: 'fa-solid fa-right-to-bracket', hideWhenAuth: true },
  { labelAr: 'إنشاء حساب', href: '/auth?mode=signup', icon: 'fa-solid fa-user-plus', hideWhenAuth: true },
];

export default function SidebarDashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  // Close on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const isActive = (href: string) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  const go = (href: string) => {
    if (user && (href === '/courses' || href === '/learn')) {
      navigate('/app/courses');
    } else {
      navigate(href);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const initial = profile?.name?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <div className="sd-root">
      <button
        className="sd-toggle-btn"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="فتح القائمة"
        aria-expanded={isOpen}
      >
        <i className="fa-solid fa-bars" aria-hidden="true"></i>
      </button>

      <div
        className={`sd-overlay ${isOpen ? 'show' : ''}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <nav className={`sd-sidebar ${isOpen ? 'show' : ''}`} aria-label="القائمة الجانبية">
        <button className="sd-logo" onClick={() => go('/')} aria-label="الرئيسية">
          <img
            src={logoAsset.url}
            alt="LingoArab"
            width={32}
            height={32}
            className="sd-logo-img"
          />
        </button>

        <div className="sd-nav-items">
          {PUBLIC_ITEMS.map((item) => (
            <button
              key={item.href}
              onClick={() => go(item.href)}
              className={`sd-nav-item ${isActive(item.href) ? 'active' : ''}`}
            >
              <i className={item.icon} aria-hidden="true"></i>
              <span>{item.labelAr}</span>
            </button>
          ))}

          <div className="sd-nav-divider" />

          {user
            ? AUTH_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => go(item.href)}
                  className={`sd-nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  <i className={item.icon} aria-hidden="true"></i>
                  <span>{item.labelAr}</span>
                </button>
              ))
            : GUEST_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => go(item.href)}
                  className={`sd-nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  <i className={item.icon} aria-hidden="true"></i>
                  <span>{item.labelAr}</span>
                </button>
              ))}

          {user && (
            <button onClick={handleLogout} className="sd-nav-item logout">
              <i className="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
              <span>خروج</span>
            </button>
          )}
        </div>

        {user && (
          <div className="sd-sidebar-bottom">
            <button className="sd-avatar" onClick={() => navigate('/profile')} aria-label="الملف الشخصي">
              {initial}
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
