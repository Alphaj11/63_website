'use client';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { L } from '@/lib/types';
import { useT } from '@/store/lang';

export function PageHeader({ eyebrow, title, accent, intro, children }: { eyebrow: L; title: L; accent?: L; intro?: L; children?: ReactNode }) {
  const { t } = useT();
  return (
    <header className="relative overflow-hidden pb-10 pt-32 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_80%_at_85%_0%,rgba(211,75,37,.22),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <motion.p className="eyebrow" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{t(eyebrow)}</motion.p>
        <motion.h1 className="display-xl mt-3 text-6xl sm:text-8xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          {t(title)} {accent && <span className="text-ember">{t(accent)}</span>}
        </motion.h1>
        {intro && <motion.p className="mt-5 max-w-2xl text-lg text-bone/65" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>{t(intro)}</motion.p>}
        {children}
      </div>
    </header>
  );
}
