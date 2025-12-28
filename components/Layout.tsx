import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UserRole } from '../types';
import { HeartPulse, LayoutDashboard, LogOut, User as UserIcon, Sun, Moon } from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
      switch(user?.role) {
          case UserRole.DOCTOR: return '/dashboard/doctor';
          case UserRole.ADMIN: return '/dashboard/admin';
          default: return '/dashboard/user';
      }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground transition-colors duration-300">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-3 sm:px-6 mx-auto">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2 font-bold text-lg sm:text-xl text-foreground tracking-tight hover:opacity-80 transition-opacity">
            <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <HeartPulse className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span>CareConnect</span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-4">
            
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-muted-foreground hover:text-foreground h-9 w-9 sm:h-10 sm:w-10">
                {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
            </Button>

            {user ? (
              <>
                <Link to={getDashboardLink()}>
                    <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground px-2 sm:px-4">
                        <LayoutDashboard className="h-4 w-4" />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Button>
                </Link>
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground border-l border-border pl-4">
                    <UserIcon className="h-4 w-4" />
                    <span>{user.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="border-border hover:bg-accent hover:text-accent-foreground px-2 sm:px-4">
                    <LogOut className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground px-2 sm:px-4">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="px-3 sm:px-4">Sign Up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-muted/20 py-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6 mx-auto text-sm text-muted-foreground">
          <p>© 2024 CareConnect Inc. All rights reserved.</p>
          <div className="flex gap-6">
             <button onClick={scrollToTop} className="hover:text-foreground cursor-pointer transition-colors bg-transparent border-none p-0 text-sm text-muted-foreground">Privacy</button>
             <button onClick={scrollToTop} className="hover:text-foreground cursor-pointer transition-colors bg-transparent border-none p-0 text-sm text-muted-foreground">Terms</button>
             <button onClick={scrollToTop} className="hover:text-foreground cursor-pointer transition-colors bg-transparent border-none p-0 text-sm text-muted-foreground">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};