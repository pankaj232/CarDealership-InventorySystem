import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { ReactNode } from 'react';

interface AppShellProps {
  title: string;
  children: ReactNode;
}

export const AppShell = ({ title, children }: AppShellProps) => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10">
      <header className="mx-auto flex w-full max-w-7xl flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link to="/dashboard" className="font-display text-2xl font-bold text-amber">
            Apex Motors
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-mist sm:text-4xl">
            {title}
          </h1>
        </div>
        <nav className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <Link
            to="/dashboard"
            className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-mist transition hover:border-amber hover:text-amber"
          >
            Inventory
          </Link>
          {isAdmin ? (
            <Link
              to="/admin/vehicles"
              className="rounded-2xl border border-amber/50 px-4 py-2 text-sm font-medium text-amber transition hover:bg-amber/10"
            >
              Admin
            </Link>
          ) : null}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl border border-white/15 px-4 py-2 text-sm font-medium text-mist transition hover:border-amber hover:text-amber"
          >
            Sign out
          </button>
        </nav>
      </header>
      <main className="mx-auto mt-8 w-full max-w-7xl">{children}</main>
    </div>
  );
};
