import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export const AuthLayout = ({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[linear-gradient(120deg,transparent,rgba(242,183,5,0.08))] lg:block" />
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col justify-center gap-10 lg:flex-row lg:items-center lg:gap-16">
        <section className="max-w-xl">
          <Link
            to="/"
            className="font-display text-3xl font-extrabold tracking-tight text-amber sm:text-4xl"
          >
            Apex Motors
          </Link>
          <h1 className="mt-8 text-4xl font-bold text-mist sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-steel sm:text-lg">
            {subtitle}
          </p>
        </section>

        <section className="w-full max-w-md rounded-3xl border border-white/10 bg-slate/70 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-md sm:p-8">
          {children}
          <div className="mt-6 text-sm text-steel">{footer}</div>
        </section>
      </div>
    </div>
  );
};
